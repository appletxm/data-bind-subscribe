import EventHub from './event-hub'
import Core from './core'

export default {
  EventHub: EventHub,
  MyMvvm: Core
}

try {
  if (define) {
    define('MyMvvm', function () {
      return {
        EventHub: EventHub,
        MyMvvm: Core
      }
    })
  } else if (module) {
    module.exports = {
      EventHub: EventHub,
      MyMvvm: Core
    }
  } else {
    window.MyMvvm = Core
    window.EventHub = EventHub
  }
} catch (e) {
  window.MyMvvm = Core
  window.EventHub = EventHub
}
