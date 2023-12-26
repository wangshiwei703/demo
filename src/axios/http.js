import {requests} from './index'
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Object} config [请求头]
 * @param {Object} checkCode [是否检查code]
 */
export function get(url, params, config, checkCode){    
    return new Promise((resolve, reject) =>{
        requests.get(url, config).then(res => {
            if(res && ( !checkCode || res.code === 200 || res.Code === 200)){
                resolve(res);
            } else {
                reject(res)
            }
        }).catch(err =>{
            reject(err.data)        
        })    
    });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 * @param {Object} config [请求头]
 * @param {Object} checkCode [是否检查code]
 */
export function post(url, data, config, checkCode=true) {
    return new Promise((resolve, reject) => {
        requests.post(url, data, config)
        .then(res => {
            if(res && ( !checkCode || res.code === 200 || res.Code === 200)){
                resolve(res);
            } else {
                reject(res)
            }
        })
        .catch(err =>{
            reject(err.data)
        })
    });
}