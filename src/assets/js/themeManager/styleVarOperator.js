export default class StyleVarOperator {
    constructor() {
        // this._operator = document.querySelector(':root');
        this._rootElement = document.documentElement;
    }

    _hasVarName(name) {
        let _isHas = false
        let _styles = getComputedStyle(this._rootElement);
        let _value = _styles.getPropertyValue(name);
        if (_value) _isHas = true
        return _isHas
    }

    /**
     * 将样式变量写入，如果已存在，则不写入
     * @param {String} name 样式变量名
     * @param {String} value 样式变量值
     */
    addThemeVar(name, value) {
        if (!this._hasVarName(name)) {
            this._rootElement.style.setProperty(name, value);
        }
    }

    /**
     * 替换原有样式变量的值，如果该颜色变量不存在，则新增
     * @param {String} name 
     * @param {String} value 
     */
    replaceThemeVar(name, value){
        this._rootElement.style.setProperty(name, value);
    }

    /**
     *删除样式变量
     * @param {String} name 
     */
    removeThemeVar(name){
        console.log(name)
    }
}