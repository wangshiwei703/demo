const axios = require('axios'); // 需安装：npm install axios

// 配置参数（替换为你的实际值）
const config = {
  client_id: '你的client_id',
  client_secret: '你的client_secret',
  code: '用户授权后获取的code', // 临时授权码
  redirect_uri: '你的回调URL', // 与应用配置一致
  pixel_id: '你的pixel_id' // 从Events Manager获取
};

// 1. 用code换取access_token
async function getAccessToken() {
  try {
    const response = await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/',
      {
        client_id: config.client_id,
        client_secret: config.client_secret,
        code: config.code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirect_uri
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data.code === 0) {
      console.log('access_token获取成功：', response.data.data.access_token);
      return response.data.data; // 返回包含access_token和过期时间的对象
    } else {
      throw new Error(`获取token失败：${response.data.message}`);
    }
  } catch (error) {
    console.error('获取access_token错误：', error.message);
    throw error;
  }
}

// 2. 上报CompleteRegistration事件
async function trackCompleteRegistration(accessToken) {
  try {
    const eventData = {
      pixel_id: config.pixel_id,
      events: [
        {
          event: 'CompleteRegistration', // 事件名称
          timestamp: Math.floor(Date.now() / 1000), // 当前Unix时间戳（秒）
          context: {
            page: {
              url: 'https://你的注册完成页URL' // 事件发生的页面URL
            },
            user: {
              external_id: 'user_123456' // 用户唯一标识（可选，如用户ID）
            }
          },
          properties: {
            currency: 'CNY', // 必选，ISO 4217货币代码（如人民币CNY）
            value: 0 // 注册事件的价值（可选，根据业务填写，如0或100）
          }
        }
      ]
    };

    const response = await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/pixel/event/',
      eventData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken // 关键：携带access_token
        }
      }
    );

    if (response.data.code === 0) {
      console.log('事件上报成功：', response.data);
    } else {
      throw new Error(`事件上报失败：${response.data.message}`);
    }
  } catch (error) {
    console.error('事件上报错误：', error.message);
    throw error;
  }
}

// 执行流程
(async () => {
  try {
    // 第一步：获取access_token
    const tokenData = await getAccessToken();
    // 第二步：上报事件
    await trackCompleteRegistration(tokenData.access_token);
  } catch (error) {
    console.error('流程执行失败：', error);
  }
})();