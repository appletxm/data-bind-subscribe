import Watcher from '../watcher'
import Dep from '../dep'

export default class Observer {
  constructor () {
    this.dep = new Dep()
  }

  setObserver (data) {
    let keys

    if (!data || typeof data !== 'object') {
      throw new Error('data format error')
    }

    keys = Object.keys(data)

    keys.forEach((key) => {
      if (typeof data[key] === 'object') {
        this.setObserver(data[key])
      } else {
        this.defineReactive(data, key, data[key])
      }
    })
  }

  defineReactive (data, key, value) {
    let dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      set(newVal) {
        console.log('the watcher works:', newVal)
        value = newVal
        dep.notify()
      },
      get() {
        console.log('get value')
        if (Dep.target) {
          dep.depend()
        }
        return value
      }
    })
  }
}
