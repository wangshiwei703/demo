import {
    get,
    post
} from "@/axios/http.js"
import qs from 'qs'

export const loginByUsername = (data) => post('/api/Login/Login', qs.stringify(data), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}, false)

export const getUserInfo = () => get('/api/User/Info')

export const getTenantInfo = (params) => get(`/api/Tenant/Info/GetByTenantId?${qs.stringify(params)}`)

export const getUserList = () => get('/api/User/List')

export const getDepartmentList = () =>  get('/api/Department/List')

//校验验证码
export const checkValidationCode = (params) => post(`api/checkValidationCode?${qs.stringify(params)}`)

//检查用户是否存在
export const CheckByUsername = (params) => get(`api/User/CheckByUsername?${qs.stringify(params)}`)

//获取手机验证码
export const getPhoneValidationCode = (params) => post(`api/getValidationCode?${qs.stringify(params)}`)

//忘记密码
export const findPassword = (data) => post('api/User/RetrievePassword',data)

//注册用户加入组织
export const joinTenant = (data) => post('api/Register/Register',data)

//注册用户创建组织
export const createTenant = (data) => post('api/Register/Register',data)

//获取配置参数
export const getConfigApi = () => get('/api/Config/Get')

//初始化
export const initializeDataBase = (params) => post(`/api/Initialize/Initialize?${qs.stringify(params)}`)