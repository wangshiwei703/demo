const axios = require('axios');

// 企业微信应用密钥配置
const agentSecrets = {
  '1000008': '你的agent1_secret',
  'agent2_id': '你的agent2_secret',
  'agent3_id': '你的agent3_secret'
};

exports.handler = async (event) => {
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
};
