import defaultThemeScheme from './themeVars'
import StyleVarOperator from './styleVarOperator'

export default class ThemeManager {
    constructor(themeScheme = defaultThemeScheme, defaultThemeName = null) {
        this._themeScheme = themeScheme
        this._currentThemeName = this._initCurrentThemeName(defaultThemeName)
        this._styleVarOperator = new StyleVarOperator();
    }

    addTheme(themeName = null) {
        if(themeName !== null && themeName in this._themeScheme){
            this._currentThemeName = themeName
        }
        if(!(this._currentThemeName in this._themeScheme)) return 
        let _currentTheme = this._themeScheme[this._currentThemeName]
        Object.keys(_currentTheme).forEach(varName => {
            let _varValue = _currentTheme[varName]
            this._styleVarOperator.replaceThemeVar(varName, _varValue)
        })
    }

    replaceTheme(themeName = null) {
        if(themeName !== null && themeName in this._themeScheme){
            this._currentThemeName = themeName
        }
        if(!(this._currentThemeName in this._themeScheme)) return 
        let _currentTheme = this._themeScheme[this._currentThemeName]
        Object.keys(_currentTheme).forEach(varName => {
            let _varValue = _currentTheme[varName]
            this._styleVarOperator.replaceThemeVar(varName, _varValue)
        })
    }

    resetThemeScheme(themeScheme, defaultThemeName = null) {
        this._themeScheme = themeScheme
        this._currentThemeName = this._initCurrentThemeName(defaultThemeName)
    }

    _initCurrentThemeName(themeName) {
        let _name = null
        if (themeName) {
            _name = themeName
        } else {
            let _names = Object.keys(this._themeScheme)
            if (_names.length > 0) _name = _names[0]
        }
        return _name
    }




}