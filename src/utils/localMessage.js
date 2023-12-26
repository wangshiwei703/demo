export function setLocalMessage(key, value) {
    let data = JSON.stringify(value)
    localStorage.setItem(key, data);
}

export function getLocalMessage(key) {
    let data = ''
    let value = localStorage.getItem(key);
    try {
        data = JSON.parse(value)
    } catch (e) {
        data = value
    }
    return data
}

export function deleteLocalMessage(key) {
    localStorage.removeItem(key)
}

export function watchLocalMessage(key, callback = null) {
    if (!(callback instanceof Function)) return
    window.addEventListener("setLocalStorageEvent", function (e) {
        //e.key : 是值发生变化的key
        //例如 e.key==="token";
        //e.newValue : 是可以对应的新值
        if (e.key === key) {
            let data = ''
            let value = e.newValue;
            try {
                data = JSON.parse(value)
            } catch (e) {
                data = value
            }
            callback(data)
        }
    })
    let _value = getLocalMessage(key)
    callback(_value)
}

export function clearLocalMessage() {
    localStorage.clear();
}

export function dispatchEventStroage() {
    const signSetItem = localStorage.setItem
    localStorage.setItem = function (key, val) {
        let setEvent = new Event('setLocalStorageEvent')
        setEvent.key = key
        setEvent.newValue = val
        window.dispatchEvent(setEvent)
        signSetItem.apply(this, arguments)
    }
}