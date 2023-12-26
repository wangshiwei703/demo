import {
    dispatchEventStroage
} from '@/utils/localMessage'
import {
    setSystemInfo,
    setSystemVersion,
    setLanguage
} from '@/utils/author'
import {hasLanguage, getCurrentLanguage} from '@/utils/tool'
import {changeFavicon} from '@/utils/tool'
import ThemeManager from '@js/themeManager'
import AuthManager from '@js/authManager'

(function () {
    let _themeManager = new ThemeManager()
    window.themeManager = _themeManager
    _themeManager.replaceTheme()

    let _authManager = new AuthManager()
    window.authManager = _authManager
    _authManager.init()

    let _currentLang = getCurrentLanguage()
    if(!hasLanguage()){
        setLanguage(_currentLang)
    }
    
    dispatchEventStroage()
})()