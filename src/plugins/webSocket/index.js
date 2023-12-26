import WebSocket from "./socket"

let ws = new WebSocket()
ws.start()

export default {
    installed: false,
    install(Vue){
        if (this.installed) {
            return
        }
        this.installed = true
        !Vue.config.globalProperties.$ws && Object.defineProperties(Vue.config.globalProperties, {
            $ws: {
                get() {
                    // const _this = this;
                    return ws
                }
            }
        })
    }
}