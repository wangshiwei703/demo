const axios = require('axios');

// 企业微信应用密钥配置
const agentSecrets = {
  '1000008': 'Fcj8TvrosqH76AhxhJBtkKsdOgGYJYQx0jbeJRHvSm0',
  'agent2_id': '你的agent2_secret',
  'agent3_id': '你的agent3_secret'
};

exports.handler = async (event) => {

  await sendTikTokServerEvent({
    externalUserId: 'cs',
    name: 'cs'
  })
};



// 在云函数中添加发送TikTok服务器端事件的逻辑
async function sendTikTokServerEvent(contact) {
  try {
    const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
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
            value: 1,
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

