import {
    getUserAuthority,
    getSystemVersion,
    getTenantInfo,
    getSystemInfo
} from '@/utils/author'

export default class AuthManager {
    constructor() {
        this.userAuthority = null
        this.systemVersion = null
        this.tenantInfo = null
        this.systemInfo = null
        this.init()
    }

    init() {
        this.userAuthority = getUserAuthority()
        this.systemVersion = getSystemVersion()
        this.tenantInfo = getTenantInfo()
        this.systemInfo = getSystemInfo()
    }
    initDependency() {
        if (!this.userAuthority || !this.systemVersion || !this.tenantInfo || !this.systemInfo) {
            this.init()
        }
    }

    systemAuth() {
        let _hasAuth = false
        this.initDependency()
        let _operatingAuthorities = this.userAuthority && this.userAuthority['operatingAuthorities']
        if (_operatingAuthorities && _operatingAuthorities.includes('MANAGE_BACKEND')) {
            _hasAuth = true
        }
        return _hasAuth
    }

    systemLicenseAuth() {
        let _hasAuth = false
        this.initDependency()
        let _operatingAuthorities = this.userAuthority && this.userAuthority['operatingAuthorities']
        if (_operatingAuthorities && _operatingAuthorities.includes('MANAGE_LICENCE')) {
            _hasAuth = true
        }
        return _hasAuth
    }

    systemTenantAuth() {
        let _hasAuth = false
        this.initDependency()
        let _tenantId = this.userAuthority['tenantId']
        let _roleName = this.userAuthority['roleName']
        if (_tenantId === '000000' && _roleName === 'Administrator') {
            _hasAuth = true
        }
        return _hasAuth
    }

    systemAPKAuth() {
        let _hasAuth = false
        this.initDependency()
        let _tenantId = this.userAuthority['tenantId']
        let _roleName = this.userAuthority['roleName']
        if (_tenantId === '000000' && _roleName === 'Administrator') {
            _hasAuth = true
        }
        return _hasAuth
    }

    addSceneAuth() {
        let _hasAuth = false
        this.initDependency()
        let _operatingAuthorities = this.userAuthority && this.userAuthority['operatingAuthorities']
        if (_operatingAuthorities && _operatingAuthorities.includes('ADD_APP')) {
            _hasAuth = true
        }
        return _hasAuth
    }

    importSceneAuth() {
        let _hasAuth = false
        this.initDependency()
        let _operatingAuthorities = this.userAuthority && this.userAuthority['operatingAuthorities']
        if (_operatingAuthorities && _operatingAuthorities.includes('IMPORT')) {
            _hasAuth = true
        }
        return _hasAuth
    }

    setSystemHomeAuth() {
        let _hasAuth = false
        this.initDependency()

        let _releaseType = this.systemVersion.releaseType
        let _tenantId = this.tenantInfo.tenantId
        let _version = this.tenantInfo.account.version
        if (_tenantId === '000000' || (_releaseType === 'PRIVATE' && _version === '企业版')) {
            _hasAuth = true
        }
        return _hasAuth
    }

    manageAuthSceneAuth(sceneId) {
        let _hasAuth = false
        this.initDependency()
        let _appAuths = this.userAuthority.appAuths
        if (_appAuths && _appAuths[sceneId]) {
            _hasAuth = _appAuths[sceneId].includes('MANAGE_APP_AUTH')
        }
        return _hasAuth
    }

    editSceneAuth(sceneId) {
        let _hasAuth = false
        this.initDependency()
        let _appAuths = this.userAuthority.appAuths
        if (_appAuths && _appAuths[sceneId]) {
            _hasAuth = _appAuths[sceneId].includes('EDIT_PORTAL_VISUAL')
        }
        return _hasAuth
    }

    deleteSceneAuth(sceneId) {
        let _hasAuth = false
        this.initDependency()
        let _appAuths = this.userAuthority.appAuths
        if (_appAuths && _appAuths[sceneId]) {
            _hasAuth = _appAuths[sceneId].includes('DELETE_PORTAL_VISUAL')
        }
        return _hasAuth
    }

    exportSceneAuth(sceneId) {
        let _hasAuth = false
        this.initDependency()
        let _appAuths = this.userAuthority.appAuths
        if (_appAuths && _appAuths[sceneId]) {
            _hasAuth = _appAuths[sceneId].includes('EXPORT')
        }
        return _hasAuth
    }

    previewSceneAuth(sceneId) {
        let _hasAuth = false
        this.initDependency()
        let _appAuths = this.userAuthority.appAuths
        if (_appAuths && _appAuths[sceneId]) {
            _hasAuth = _appAuths[sceneId].includes('PREVIEW_PORTAL_VISUAL')
        }
        return _hasAuth
    }
}