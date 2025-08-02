const axios = require('axios');

// 企业微信应用密钥配置
const agentSecrets = {
  '1000008': 'Fcj8TvrosqH76AhxhJBtkKsdOgGYJYQx0jbeJRHvSm0',
  'agent2_id': '你的agent2_secret',
  'agent3_id': '你的agent3_secret'
};



const checkInterval = null

exports.handler = async (event) => {

sendTikTokServerEvent()

  // 直接开始检查
  // await checkWecomStatus(event);

  // // 定时检查（每30秒一次）
  // checkInterval = setInterval(async () => {
  //   const checkResult = await checkWecomStatus(event);
  //   let result = checkResult.data
  //   if (result.added) {
  //     clearInterval(checkInterval);
  //     return result
  //   } else {
  //     return result
  //   }
  // }, 30000);

  // // 5分钟后停止检查
  // setTimeout(() => {
  //   clearInterval(checkInterval);
  //   return {
  //     statusCode: 400,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       error: '检查超时',
  //     })
  //   }
  // }, 300000);
};

async function checkWecomStatus(event) {
  try {
    const body = JSON.parse(event.body);

    // 验证必要参数
    if (!body.corpId || !body.agentId || !body.userId || !body.wecomId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*', //'https://你的网站域名.com'
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '缺少必要参数' })
      };
    }

    // 获取对应应用的secret
    const agentSecret = agentSecrets[body.agentId];
    if (!agentSecret) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '未找到对应的应用配置' })
      };
    }

    // 1. 获取access_token
    const tokenResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${body.corpId}&corpsecret=${agentSecret}`
    );

    if (tokenResponse.data.errcode !== 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: '获取access_token失败',
          details: tokenResponse.data
        })
      };
    }

    const accessToken = tokenResponse.data.access_token;
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5分钟前的时间戳
    let hasRecentContact = false;
    let nextCursor = ''; // 分页游标

    do {
      // 2. 批量获取外部联系人（每次最多100个）
      const batchResponse = await axios.post(
        `https://qyapi.weixin.qq.com/cgi-bin/externalcontact/batch/get_by_user?access_token=${accessToken}`,
        {
          userid: body.userId,       // 企业成员的userId
          cursor: nextCursor,        // 分页游标，首次为空
          limit: 100                 // 每次最多获取100个
        }
      );

      if (batchResponse.data.errcode !== 0) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: '批量获取外部联系人失败',
            details: batchResponse.data
          })
        };
      }

      // 3. 检查是否有5分钟内新增的联系人
      const contacts = batchResponse.data.external_contact_list || [];
      for (const contact of contacts) {
        // 企业微信返回的是秒级时间戳，转换为毫秒
        const addTime = contact.add_time * 1000;

        // 验证是否在最近5分钟内添加
        if (addTime >= fiveMinutesAgo) {
          hasRecentContact = true;
          // 在检查到新联系人时调用

          // （添加到之前的云函数中，当获取到newContacts时）
          await sendTikTokServerEvent(contact);

          break; // 找到符合条件的联系人，跳出循环
        }
      }

      // 更新分页游标，准备获取下一页
      nextCursor = batchResponse.data.next_cursor || '';

    } while (!hasRecentContact && nextCursor); // 有下一页且未找到目标联系人时继续

    // 4. 返回检查结果
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        added: hasRecentContact,
        wecomId: body.wecomId
      })
    };

  } catch (error) {
    console.error('代理请求错误:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: '服务器内部错误' })
    };
  }
}


// 在云函数中添加发送TikTok服务器端事件的逻辑
async function sendTikTokServerEvent(contact) {
  try {
    const accessToken = '6eecc9c1084bfcf1106510252f8645542d48d9ff';
    const pixelId = 'D268FFJC77UAP1JBRVP0';
    if (!accessToken || !pixelId) {
      throw new Error("缺少TikTok服务器端事件配置");
    }

    // 构造事件数据（需符合TikTok服务器端事件格式）
    const eventData = {
      events: [
        {
          event: "CompleteRegistration", // 事件名称（与前端一致）
          event_time: Math.floor(Date.now() / 1000), // 事件时间（秒级时间戳）
          user: {
            // 尽可能提供用户标识（提高事件匹配率）
            external_id: contact.externalUserId, // 企业微信外部联系人ID
            phone_number: contact.phone ? contact.phone : undefined // 如有手机号可添加
          },
          context: {
            // 可选：补充用户环境信息（提高事件质量）
            user_agent: "Netlify Function/1.0",
            ip_address: contact.ipAddress || "0.0.0.0" // 如有用户IP可添加
          },
          properties: {
            content_name: "企业微信添加成功",
            content_type: "contact",
            external_user_id: contact.externalUserId,
            user_name: contact.name,
            value: 0,
            currency: "CNY"
          }
        }
      ]
    };

    // 发送请求到TikTok服务器端事件API
    const response = await axios.post(
      `https://business-api.tiktok.com/open_api/v1.3/pixel/track/`,
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

    console.log(`TikTok事件发送成功: ${contact.externalUserId}`);
    return true;
  } catch (error) {
    console.error("发送TikTok服务器端事件错误:", error);
    return false;
  }
}