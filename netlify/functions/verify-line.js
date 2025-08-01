const axios = require('axios');

exports.handler = async (event) => {
  try {
    // 1. 解析请求参数
    const { lineUserId } = JSON.parse(event.body);
    
    // 验证必要参数
    if (!lineUserId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': import.meta.env.VITE_FRONTEND_URL || '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '缺少LINE用户ID' })
      };
    }

    // 2. 从环境变量获取LINE配置
    const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;
    if (!LINE_ACCESS_TOKEN) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': import.meta.env.VITE_FRONTEND_URL || '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '服务器配置错误' })
      };
    }

    // 3. 调用LINE API获取关注者列表
    let isFollowed = false;
    let nextCursor = '';
    
    do {
      const response = await axios.get('https://api.line.me/v2/bot/followers/ids', {
        headers: {
          'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
        },
        params: {
          limit: 1000, // 每次最多获取1000个
          cursor: nextCursor || undefined
        }
      });

      // 检查当前页是否包含目标用户ID
      if (response.data.ids && response.data.ids.includes(lineUserId)) {
        isFollowed = true;
        break; // 找到后退出循环
      }

      // 更新分页游标
      nextCursor = response.data.nextCursor;
    } while (nextCursor); // 有下一页时继续查询

    // 4. 返回验证结果
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': import.meta.env.VITE_FRONTEND_URL || '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ followed: isFollowed })
    };

  } catch (error) {
    console.error('LINE验证失败:', error.response?.data || error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': import.meta.env.VITE_FRONTEND_URL || '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: '验证失败',
        details: error.response?.data || error.message
      })
    };
  }
};
