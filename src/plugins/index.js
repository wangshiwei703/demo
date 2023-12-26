import webSocket from "./webSocket";

export default {
    components: [webSocket],
    install(Vue) {
        this.components.forEach(component => {
            component.install(Vue)
        })
    }
};