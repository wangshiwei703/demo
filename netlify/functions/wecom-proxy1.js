const axios = require('axios');

// 企业微信应用配置（生产环境建议用环境变量）
const agentSecrets = {
  '1000008': 'Fcj8TvrosqH76AhxhJBtkKsdOgGYJYQx0jbeJRHvSm0',
  'agent2_id': '你的agent2_secret',
  'agent3_id': '你的agent3_secret'
};

// 状态存储 - 生产环境建议使用Redis
const trackingStore = new Map();

// 配置参数
const CHECK_INTERVAL = 30000; // 检查间隔30秒（前端调用间隔）
const TIMEOUT_DURATION = 300000; // 超时时间5分钟

exports.handler = async (event) => {
  // 处理跨域预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: getCorsHeaders(),
      body: JSON.stringify({ error: '仅支持POST方法' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    
    // 验证必要参数
    if (!body.corpId || !body.agentId || !body.userId || !body.trackingId) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({ 
          error: '缺少必要参数',
          required: ['corpId', 'agentId', 'userId', 'trackingId']
        })
      };
    }

    // 初始化跟踪记录
    if (!trackingStore.has(body.trackingId)) {
      trackingStore.set(body.trackingId, {
        startTime: Date.now(),
        lastCheckTime: null,
        checkCount: 0,
        isCompleted: false
      });
    }

    const trackInfo = trackingStore.get(body.trackingId);
    const now = Date.now();

    // 检查是否超时
    if (now - trackInfo.startTime > TIMEOUT_DURATION) {
      trackingStore.delete(body.trackingId); // 清理超时记录
      return {
        statusCode: 200,
        headers: getCorsHeaders(),
        body: JSON.stringify({
          status: 'expired',
          message: '检查已超时（5分钟）',
          added: false,
          trackingId: body.trackingId
        })
      };
    }

    // 检查是否过于频繁（防止前端调用太频繁）
    if (trackInfo.lastCheckTime && now - trackInfo.lastCheckTime < CHECK_INTERVAL - 1000) {
      return {
        statusCode: 200,
        headers: getCorsHeaders(),
        body: JSON.stringify({
          status: 'too_frequent',
          message: `请${Math.ceil((CHECK_INTERVAL - (now - trackInfo.lastCheckTime)) / 1000)}秒后再试`,
          added: false,
          trackingId: body.trackingId
        })
      };
    }

    // 执行检查
    trackInfo.lastCheckTime = now;
    trackInfo.checkCount += 1;
    trackingStore.set(body.trackingId, trackInfo);

    const checkResult = await verifyWecomContact(body);

    // 如果检查成功，更新状态并清理
    if (checkResult.added) {
      trackInfo.isCompleted = true;
      trackingStore.delete(body.trackingId);
    }

    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify({
        status: checkResult.added ? 'completed' : 'pending',
        added: checkResult.added,
        checkCount: trackInfo.checkCount,
        elapsedTime: Math.floor((now - trackInfo.startTime) / 1000), // 已用秒数
        remainingTime: Math.floor((TIMEOUT_DURATION - (now - trackInfo.startTime)) / 1000), // 剩余秒数
        trackingId: body.trackingId
      })
    };

  } catch (error) {
    console.error('处理错误:', error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({
        error: '服务器内部错误',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

/**
 * 验证企业微信联系人是否在指定时间内添加
 */
async function verifyWecomContact(params) {
  try {
    // 获取应用密钥
    const agentSecret = agentSecrets[params.agentId];
    if (!agentSecret) {
      throw new Error(`未找到agentId: ${params.agentId}的配置`);
    }

    // 1. 获取access_token
    const tokenRes = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${params.corpId}&corpsecret=${agentSecret}`
    );
    
    if (tokenRes.data.errcode !== 0) {
      throw new Error(`获取access_token失败: ${JSON.stringify(tokenRes.data)}`);
    }

    const accessToken = tokenRes.data.access_token;
    const checkStartTime = Date.now() - TIMEOUT_DURATION; // 检查起始时间（5分钟前）
    let hasNewContact = false;
    let nextCursor = '';

    do {
      // 2. 批量获取外部联系人
      const contactRes = await axios.post(
        `https://qyapi.weixin.qq.com/cgi-bin/externalcontact/batch/get_by_user?access_token=${accessToken}`,
        {
          userid: params.userId,
          cursor: nextCursor,
          limit: 100
        }
      );
      
      if (contactRes.data.errcode !== 0) {
        throw new Error(`获取联系人失败: ${JSON.stringify(contactRes.data)}`);
      }

      // 3. 检查是否有5分钟内新增的联系人
      const contacts = contactRes.data.external_contact_list || [];
      for (const contact of contacts) {
        // 企业微信返回的是秒级时间戳，转换为毫秒
        const addTime = contact.add_time * 1000;
        
        if (addTime >= checkStartTime) {
          hasNewContact = true;
          // 发送TikTok事件
          await sendTikTokEvent({
            ...contact,
            trackingId: params.trackingId,
            agentId: params.agentId
          });
          break; // 找到后跳出循环
        }
      }

      nextCursor = contactRes.data.next_cursor || '';
      
    } while (!hasNewContact && nextCursor);

    return { added: hasNewContact };

  } catch (error) {
    console.error('验证联系人失败:', error);
    throw error;
  }
}

/**
 * 发送事件到TikTok
 */
async function sendTikTokEvent(contact) {
  try {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
    const pixelId = process.env.TIKTOK_PIXEL_ID;
    
    if (!accessToken || !pixelId) {
      throw new Error("TikTok配置不完整（请设置TIKTOK_ACCESS_TOKEN和TIKTOK_PIXEL_ID）");
    }

    const eventData = {
      pixel_code: pixelId,
      events: [{
        event: "CompleteRegistration",
        event_time: Math.floor(Date.now() / 1000),
        user: {
          external_id: contact.external_userid,
          phone_number: contact.phone ? contact.phone : undefined
        },
        context: {
          user_agent: "Netlify Function",
          ip_address: contact.ip_addr || "0.0.0.0"
        },
        properties: {
          content_name: "企业微信添加成功",
          content_type: "contact",
          external_user_id: contact.external_userid,
          agent_id: contact.agentId,
          tracking_id: contact.trackingId,
          value: 0,
          currency: "CNY"
        }
      }]
    };

    const response = await axios.post(
      "https://business-api.tiktok.com/open_api/v1.3/pixel/track/",
      eventData,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Token": accessToken
        }
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`TikTok事件发送失败: ${JSON.stringify(response.data)}`);
    }

    console.log(`TikTok事件已发送 - 跟踪ID: ${contact.trackingId}`);
    return true;

  } catch (error) {
    console.error('发送TikTok事件出错:', error);
    // 不阻断主流程，仅记录错误
    return false;
  }
}

/**
 * 获取CORS头配置
 */
function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}
