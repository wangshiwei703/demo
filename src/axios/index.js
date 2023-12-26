import axios from 'axios'
import {
  getToken
} from '@/utils/author'
import {
  clearUserMessage
} from '@/utils/author'
import router from '../router/index.js'
import { cgsMessage } from 'cgs-design'

// 创建 axios 实例
export const requests = axios.create({
  baseURL: import.meta.env.VUE_APP_HN_BASEURL,
  timeout: 60000, // 请求超时时间
  // withCredentials: true
})

// 错误处理函数
const err = (error) => {
  if (error.response) {
    if (error.response.status === 403) {
      // clearLocalMessage()
      if (error.response.data.code === 110302) {
        cgsMessage.error("租户过期")
      }
    }
    if (error.response.status === 401) {
      clearUserMessage()
      router.push({
        path: '/login'
      })
    }
  }
  return Promise.reject(error)
}

const requestInterceptor = config => {
  const token = getToken()
  if (token) {
    config.headers['Auth-Token'] = token
  }
  return config
}

const responseInterceptor = (response) => {
  if (response.status === 200) {
    const res = response.data
    if (res.code === 401 || res.Code === 401) {
      clearUserMessage()
      router.push({
        path: '/login'
      })
    } else if (res.code && res.code !== 200 || res.Code && res.Code !== 200) {
      // message.error(res.msg)
    }
    return res
  } else {
    return Promise.reject('error')
  }

}

// request interceptor(请求拦截器)
requests.interceptors.request.use(requestInterceptor, err)

// response interceptor（接收拦截器）
requests.interceptors.response.use(responseInterceptor, err)