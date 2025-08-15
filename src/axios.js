import axios from 'axios'
// 本地和线上统一使用相对路径（自动适配代理）
const basePath = '/seatable-api';

// 统一请求配置（显式处理跨域）
const axiosInstance = axios.create({
  baseURL: basePath,
  withCredentials: true, // 本地同域不影响，线上跨域必须
  headers: {
    'Content-Type': 'application/json',
    // 其他全局头
  }
});

// 所有请求使用该实例
axiosInstance.post('/api-gateway/...', { /* 数据 */ })