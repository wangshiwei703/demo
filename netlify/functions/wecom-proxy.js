const axios = require('axios');

// 企业微信应用密钥配置
const agentSecrets = {
  'agent1_id': '1000008',
  'agent2_id': '1000008',
  'agent3_id': '1000008'
};

exports.handler = async (event) => {
  debugger
  console.log(event);
  
  try {
    const body = JSON.parse(event.body);
    
    // 验证必要参数
    if (!body.corpId || !body.agentId || !body.userId || !body.wecomId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*', // 允许跨域
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
    
    // 2. 获取该员工的外部联系人列表
    const externalListResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/externalcontact/list?access_token=${accessToken}&userid=${body.userId}`
    );
    
    if (externalListResponse.data.errcode !== 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: '获取外部联系人列表失败',
          details: externalListResponse.data
        })
      };
    }
    
    // 3. 检查最近5分钟内是否有新增联系人
    const externalUserIds = externalListResponse.data.external_userid || [];
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5分钟前的时间戳
    
    for (const externalUserId of externalUserIds) {
      // 获取联系人详情
      const contactDetail = await axios.get(
        `https://qyapi.weixin.qq.com/cgi-bin/externalcontact/get?access_token=${accessToken}&external_userid=${externalUserId}`
      );
      
      if (contactDetail.data.errcode !== 0) continue;
      
      // 转换添加时间 (企业微信返回的是秒级时间戳)
      const addTime = contactDetail.data.add_time * 1000;
      
      // 检查是否是5分钟内添加的
      if (addTime >= fiveMinutesAgo) {
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            added: true,
            wecomId: body.wecomId
          })
        };
      }
    }
    
    // 未找到符合条件的联系人
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        added: false,
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
