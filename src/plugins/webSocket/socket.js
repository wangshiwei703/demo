export default class WebSocket {
    constructor() {

        this.reconnectTime = 5000; // 重新连接时间

        this._listeners = {}
    }

    start() {

        let protocol = window.location.protocol === 'http:' ? "ws:" : 'wss:'
        let url = `${protocol}//${window.location.host}/ws`;
        try {
            this.socket = new window.WebSocket(url);
        } catch (e) {
            console.warn(e);
        }

        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('message', this.onMessage);
        this.socket.addEventListener('error', this.onError);
        this.socket.addEventListener('close', this.onClose);
    }

    stop() {
        if (!this.socket) {
            return;
        }

        this.socket.removeEventListener('open', this.onOpen);
        this.socket.removeEventListener('message', this.onMessage);
        this.socket.removeEventListener('error', this.onError);
        this.socket.removeEventListener('close', this.onClose);

        this.socket.close()
        this.socket = null
    }

    reconnect() {
        console.log('WebSocket reconnect')
        this.stop();
        this.start();
    }

    /**
     * 通过WebSocket向服务端发送消息
     * @param {Object} obj 数据
     * @param {String} obj.type 消息类型
     */
    handleSend = (obj) => {
        if (!this.socket) {
            return;
        }
        if (this.socket.readyState !== this.socket.OPEN) {
            this.reconnect();
            return;
        }
        this.socket.send(JSON.stringify(obj));
    }

    onOpen = () => {
        console.log('WebSocket open successfully.');
    }

    onMessage = (event) => {
        // console.log('WebSocket message received.', event.data);
        try {
            let data = JSON.parse(event.data)
            // console.log(data);
            let listenerArray = this._listeners[data.type]
            if (listenerArray) {
                listenerArray.forEach(listener => {
                    listener(data.data)
                })
            }

        } catch (e) {
            console.warn(e);
        }
    }


    onError = (event) => {
        console.warn('WebSocket Error:', event);
        setTimeout(() => {
            this.reconnect();
        }, this.reconnectTime);
    }

    onClose = () => {
        console.log('WebSocket closed.');
        setTimeout(() => {
            this.reconnect();
        }, this.reconnectTime);
    }

    on = (type, listener) => {
        if (typeof listener !== "function") {
            return
        }
        // 初始化_listeners为{}
        if (this._listeners === undefined) this._listeners = {};
        // 获取_listeners内容
        let listeners = this._listeners;
        // 如果_listeners对象上没有 type属性 的数据则初始化为[]
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        // 如果_listeners对象的type属性值的数组里没有listener函数，则push进数组
        if (listeners[type].indexOf(listener) === - 1) {
            listeners[type].push(listener);
        }
    }

    emit = (type, data) => {
        // 如果_listeners未定义，则直接退出
        if (this._listeners === undefined) return;
        // 获取_listeners内容
        let listeners = this._listeners;
        // _listeners对象上type属性的内容
        let listenerArray = listeners[type];
        // 如果有值
        if (listenerArray !== undefined) {
            // 在event对象上增加target属性，把this对象传给target，后续外部调用者可能需要使用，先保存
            // event.target = this;
            // slice方法并不会修改数组，而是返回一个新数组
            let array = listenerArray.slice(0);
            // 遍历event.type类型下的所有事件监听
            for (let i = 0, l = array.length; i < l; i++) {
                // 调用监听事件
                // array[ i ].call( this, event );
                array[i](data)
            }
        }
    }

    remove = (type, listener) => {
        // 如果_listeners未定义，则直接退出
        if (this._listeners === undefined) return;
        // 获取_listeners内容
        let listeners = this._listeners;
        // _listeners对象上type属性的内容
        let listenerArray = listeners[type];
        // 如果有值
        if (listenerArray !== undefined) {
            // 查找listener监听函数是否存在
            let index = listenerArray.indexOf(listener);
            // 如果存在则在数组中删除
            if (index !== - 1) {
                listenerArray.splice(index, 1);
            }
        }
    }
}