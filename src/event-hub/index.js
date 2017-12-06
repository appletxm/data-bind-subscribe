export default class EventHub {
  constructor () {
    this.eventQueue = {}
  }

  on (eventName, cbFn) {
    if (!(this.eventQueue)[eventName]) {
      (this.eventQueue)[eventName] = []
    }
    (this.eventQueue)[eventName].push(cbFn)
  }

  trigger (eventName) {
    let cbFns = (this.eventQueue)[eventName]
    let args = Array.prototype.slice.call(arguments, 1)

    if (cbFns && cbFns.length >= 1) {
      cbFns.forEach((fn) => {
        if (typeof fn === 'function') {
          fn(...args)
        }
      })
    }
  }

  off (eventName, cbFn) {
    let eventQueue = (this.eventQueue)[eventName]
    if (cbFn) {
      if (eventQueue) {
        (this.eventQueue)[eventName] = eventQueue.filter((fn) => {
          return fn.name !== cbFn.name
        })
      }
    } else if (eventQueue) {
      delete (this.eventQueue)[eventName]
    }
  }

  gnerateEventId (prefix) {
    return (prefix || '') + '-' + (new Date()).getTime()
  }
}
