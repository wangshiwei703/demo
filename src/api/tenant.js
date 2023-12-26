import {get,post} from "@/axios/http.js"
import qs from 'qs'

// 获取主题列表
export const getThemeList = () => get('/api/app/theme/list')

// 添加主题
export const addTheme = (data) => post('/api/app/theme/save',data)

export const updateTheme = (data) => post('/api/app/theme/update',data)


// 获取项目列表
export const getDeptList = () => get('/api/Department/List')
// 获取用户列表
export const getUserList = (params) => get(`/api/User/List?${qs.stringify(params)}`)

export const getRoleList = (params) => get(`/api/Role/List?${qs.stringify(params)}`)
// 修改用户角色
export const editUser = (data) => post('/api/User/Edit',data)
// 添加用户
export const addUser = (data) => post('/api/User/Add',data)
// 删除用户
export const deleteUser = (params) => post(`/api/User/Delete?${qs.stringify(params)}`)
// 重置密码
export const resetUserPassword = (params) => post(`/api/User/ResetPassword?${qs.stringify(params)}`)

// 下载模板
export const exportTemplate = () => get('/api/User/Import/Template',{},{responseType: 'blob'})

// 批量导入用户
export const importUser = (data) => post('/api/User/Import',data)

// 获取当前公司下的人员
export const getDeptUserList = (params) => get(`/api/User/ListOfDept?${qs.stringify(params)}`)

// 添加部门
export const addDept = (data) => post('/api/Department/Add',data)
// 删除部门
export const deleteDept = (params) => post(`/api/Department/Delete?${qs.stringify(params)}`)
// 修改部门
export const updateDept = (data) => post('/api/Department/Edit',data)

// 获取密钥列表
export const getLicenseList = () => get('/api/lic/List')

//启用license
export const enableLicense = (params) => post(`/api/lic/Enable?${qs.stringify(params)}`)

//添加license
export const addLicense = (params) => post(`/api/lic/Add?${qs.stringify(params)}`)

//获得机器码
export const getMachineID = (params) => get(`/api/lic/MachineID?${qs.stringify(params)}`)

//获得租户账号信息
export const getTenantInfo = (params) => get(`/api/Tenant/Info/GetByTenantId?${qs.stringify(params)}`)

export const BalanceHistory = (tenantId, type) => get(`/api/Tenant/Info/BalanceHistory?tenantId=${tenantId}&type=${type}`)

export const getApkList = () => get('/api/apk')

// 删除apk
export const deleteApk = (data) => post('/api/apk/delete',data)
// 添加apk
export const addApk = (data) => post('/api/apk/create',data)
// 修改apk
export const editApk = (data) => post('/api/apk/edit',data)
// 删除角色
export const deleteRole = (params) => post(`/api/Role/Delete?${qs.stringify(params)}`)
//根据角色ID获得角色
export const getRoleByID = (params) => get(`/api/Role/Get?${qs.stringify(params)}`)
// 添加角色
export const addRole = (data) => post('/api/Role/Add',data)
// 修改角色
export const editRole = (data) => post('/api/Role/Edit',data)


// 获取租户信息
export const getTenantList = (params) => get(`/api/Tenant/List?${qs.stringify(params)}`)
// 验证租户信息
export const getUserById = (params) => get(`/api/User/GetUserByIdOrName?${qs.stringify(params)}`)
// 添加租户
export const addTenant = (params) => post(`/api/Tenant/Add?${qs.stringify(params)}`)
// 修改租户
export const editTenant = (data) => post('/api/Tenant/Update',data)
// 删除租户
export const deleteTenant = (params) => post(`/api/Tenant/Delete?${qs.stringify(params)}`)

export const getAuthorityList = (params) => get(`/api/Authority/Get?${qs.stringify(params)}`)

// 租户充值
export const recharge = (data) => post('/api/Tenant/Info/Recharge',data)
//修改租户账号信息
export const updateTenantInfo = (data) => post('/api/Tenant/Info/Update',data)

export const createDeptTree=(deptList=[])=>{

    var m={};
    deptList.forEach(d=>{
        var pId=   d.parentId
        if(!m[pId]){
            m[pId]=[]
        }
        m[pId].push(d)
    });
    var pArr=m["0"]
    var tree=[]
    if(!pArr) return tree;
    pArr.forEach(p=>{
        var dept={
            label:p.name,
            value:p.id,
            id:p.id,
            children:getChildren(p,m)
        }
        tree.push(dept)
    })
    return tree;

}
export const getChildren=(p,m)=>{
    var id=p.id
    var childs=m[id];
    if(!childs) return [];
    var children=[]
    childs.forEach(c=>{
        var d={
            label:c.name,
            value:c.id,
            id:c.id,
            children:getChildren(c,m)
        }
        children.push(d)

    })

    return children;
}

// 复制文本

export const copyDomText = (id) => {
const node = document.getElementById(id)
try{
    if (node) {
        let createRange = document.createRange()
        createRange.selectNodeContents(document.getElementById(id))
        const selection = document.getSelection()
        selection.removeAllRanges()
        selection.addRange(createRange)
        document.execCommand('Copy')
        selection.removeAllRanges()
        return true
    }
    return false
}catch{
    return false
}
}

export const createCascadDepValue=(csv,deptList)=>{
    var m={};
    deptList.forEach(p=>{
        m[p.id]=p;
    })
    var result=[]
    if(csv){
        var deptArr=csv.split(",");//["id1","id2"]
        deptArr.map(s=>{
            var arr=[];
            createParentArr(m,s,arr);
            result.push(arr);
        })
    }
    return result;

}

export const createParentArr=(m,str,arr)=>{
    var d=m[str];
    if(!d) {
        return arr;
    }
    arr.unshift(d.id);
    var pId=d.parentId;
    if(pId=="0"){
        return arr;
    }
    createParentArr(m,pId,arr);
}