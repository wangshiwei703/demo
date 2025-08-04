const axios = require('axios');

// 企业微信应用密钥配置
const agentSecrets = {
  '1000008': 'Fcj8TvrosqH76AhxhJBtkKsdOgGYJYQx0jbeJRHvSm0',
  'agent2_id': '你的agent2_secret',
  'agent3_id': '你的agent3_secret'
};

// 阿里云函数计算入口（兼容FC的event格式）
exports.handler = async (event, context, callback) => {
  try {
    // 阿里云FC的event.body为Buffer，需转换为字符串再解析
    const body = JSON.parse(event.body.toString());
    
    // 验证必要参数
    if (!body.corpId || !body.agentId || !body.userId || !body.wecomId) {
      return callback(null, {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*', // 生产环境替换为你的Netlify域名
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '缺少必要参数' })
      });
    }
    
    // 获取对应应用的secret
    const agentSecret = agentSecrets[body.agentId];
    if (!agentSecret) {
      return callback(null, {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '未找到对应的应用配置' })
      });
    }
    
    // 1. 获取access_token
    const tokenResponse = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${body.corpId}&corpsecret=${agentSecret}`
    );
    
    if (tokenResponse.data.errcode !== 0) {
      return callback(null, {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: '获取access_token失败',
          details: tokenResponse.data
        })
      });
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
          userid: body.userId,
          cursor: nextCursor,
          limit: 100
        }
      );
      
      if (batchResponse.data.errcode !== 0) {
        return callback(null, {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            error: '批量获取外部联系人失败',
            details: batchResponse.data
          })
        });
      }
      
      // 3. 检查是否有5分钟内新增的联系人
      const contacts = batchResponse.data.external_contact_list || [];
      for (const contact of contacts) {
        const addTime = contact.add_time * 1000; // 转换为毫秒
        if (addTime >= fiveMinutesAgo) {
          hasRecentContact = true;
          break;
        }
      }
      
      nextCursor = batchResponse.data.next_cursor || '';
      
    } while (!hasRecentContact && nextCursor);
    
    // 4. 返回检查结果
    return callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        added: hasRecentContact,
        wecomId: body.wecomId
      })
    });
    
  } catch (error) {
    console.error('代理请求错误:', error);
    return callback(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: '服务器内部错误' })
    });
  }
};
