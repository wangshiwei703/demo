import Cookies from 'js-cookie'
import {
    setLocalMessage,
    getLocalMessage,
    watchLocalMessage,
    deleteLocalMessage
} from "./localMessage";

const TOKEN_KEY = "Token";
const REFRESH_TOKEN_KEY = 'saber-refresh-token';
const USER_INFO_KEY = 'UserInfo';
const USER_AUTHORITY_KEY = 'UserAuthority'
const SYSTEM_INFO_KEY = 'SystemInfo'
const SYSTEM_VERSION_KEY = 'SystemVersion'
const CONFIG_KEY = 'Config';
const TENANT_INFO_KEY = 'TenantInfo';
const ENTRY_KEY = 'Entry'
const LANG_KEY = 'Language'

export function setEntry(entry) {
    return setLocalMessage(ENTRY_KEY, entry);
}

export function getEntry() {
    return getLocalMessage(ENTRY_KEY);
}

export function deleteEntry() {
    deleteLocalMessage(ENTRY_KEY)
}

export function setTenantInfo(tenantInfo) {
    return setLocalMessage(TENANT_INFO_KEY, tenantInfo);
}

export function getTenantInfo() {
    return getLocalMessage(TENANT_INFO_KEY);
}

export function deleteTenantInfo() {
    deleteLocalMessage(TENANT_INFO_KEY)
}

export function setConfig(val) {
    setLocalMessage(CONFIG_KEY, val)
}

export function getConfig() {
    return getLocalMessage(CONFIG_KEY)
}

export function deleteConfig() {
    deleteLocalMessage(CONFIG_KEY)
}

export function setRefreshToken(token) {
    setLocalMessage(REFRESH_TOKEN_KEY, token)
}

export function getRefreshToken() {
    return getLocalMessage(REFRESH_TOKEN_KEY)
}

export function deleteRefreshToken() {
    deleteLocalMessage(REFRESH_TOKEN_KEY)
}

export function setToken(token) {
    setLocalMessage(TOKEN_KEY, token)
    Cookies.set(TOKEN_KEY, token)
}

export function getToken() {
    return getLocalMessage(TOKEN_KEY)
}

export function deleteToken() {
    deleteLocalMessage(TOKEN_KEY)
    Cookies.remove(TOKEN_KEY)
}

export function setUserInfo(userInfo) {
    return setLocalMessage(USER_INFO_KEY, userInfo)
}

export function getUserInfo() {
    return getLocalMessage(USER_INFO_KEY)
}

export function deleteUserInfo() {
    deleteLocalMessage(USER_INFO_KEY)
}

export function setUserAuthority(userAuthority) {
    return setLocalMessage(USER_AUTHORITY_KEY, userAuthority);
}

export function getUserAuthority() {
    return getLocalMessage(USER_AUTHORITY_KEY);
}

export function deleteUserAuthority() {
    deleteLocalMessage(USER_AUTHORITY_KEY)
}

export function setSystemInfo(systemInfo) {
    return setLocalMessage(SYSTEM_INFO_KEY, systemInfo);
}

export function getSystemInfo() {
    return getLocalMessage(SYSTEM_INFO_KEY);
}

export function deleteSystemInfo() {
    deleteLocalMessage(SYSTEM_INFO_KEY)
}

export function watchSystemInfo(callback) {
    return watchLocalMessage(SYSTEM_INFO_KEY, callback);
}

export function setSystemVersion(systemVersion) {
    return setLocalMessage(SYSTEM_VERSION_KEY, systemVersion);
}

export function getSystemVersion() {
    return getLocalMessage(SYSTEM_VERSION_KEY);
}

export function deleteSystemVersion() {
    deleteLocalMessage(SYSTEM_VERSION_KEY)
}

export function watchSystemVersion(callback) {
    return watchLocalMessage(SYSTEM_VERSION_KEY, callback);
}

export function setLanguage(lang){
    return setLocalMessage(LANG_KEY, lang);
}

export function getLanguage() {
    return getLocalMessage(LANG_KEY);
}

export function deleteLanguage() {
    deleteLocalMessage(LANG_KEY)
}


export function clearUserMessage(){
    deleteEntry()
    deleteTenantInfo()
    deleteConfig()
    deleteRefreshToken()
    deleteToken()
    deleteUserInfo()
    deleteUserAuthority()
}