import EventHub from './event-hub'
import Core from './core'

window.eventHub = new EventHub()
const eventId = eventHub.gnerateEventId('txm-event')
const meta = {
  template: '<div><p>{{name}} {{title}} {{userName}}</p><input type="text" value="{{userName}}" v-model="userName" placeholder="input user name" @input="$testInput"/><button @click="$testClick">change</button><p>this is bind value {{userName}}</p></div>',
  data() {
    return {
      name: 'My',
      title: 'data-binding function',
      userName: ''
    }
  },
  methods: {
    $testClick(event) {
      eventHub.trigger(eventId + '-update-data', {userName: ''})
    },

    $testInput(event) {
      eventHub.trigger(eventId + '-update-data', {userName: event.target.value})
    }
  },
  created() {
    console.info('@@@@created@@@@')
  },
  mounted() {
    console.info('@@@@mounted@@@@')
  },
  updated() {
    console.info('@@@@updated@@@@')
  }
}

const App = new Core(meta, eventId, document.querySelector('body'))
App.boot()
