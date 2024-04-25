import '@/assets/icon/iconfont.js'
import '@/assets/icon/iconfont.css'

// import CardView from './components/cardView/view.vue'

const componentList = []//[{name: 'CgsCardView', component: CardView}]

componentList.forEach(_item => {
    const _component = _item.component
    const _name = _item.name
    _component.install = function (Vue) {
        Vue.component(_name, _component)
    }
})

const install = (Vue) => {
    componentList.forEach(_item => {
        const _component = _item.component
        const _name = _item.name
        Vue.component(_name, _component)
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    /* script方式引入时主动调用install方法！！ */
    install(window.Vue);
}

export default {
    install,
    ...componentList.map(_item => _item.component)
}