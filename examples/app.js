var App, meta, eventId
window.eventHub = new EventHub()
eventId = eventHub.gnerateEventId('txm-event')
meta = {
  template: '<div><p>{{name}} {{title}} {{userName}}</p><input type="text" value="{{userName}}" v-model="userName" placeholder="input user name" @input="$testInput"/><button @click="$testClick">change</button><p>this is bind value {{userName}}</p><ul @for="(item, index) in list "><li @click="$itemClick(index, item)">{{item.title}} : {{item.content}}</li></ul></div>',
  data: function () {
    return {
      name: 'My',
      title: 'data-binding function',
      userName: '',
      list: [
        {
          title: 'title 1',
          content: 'this is content 1'
        },
        {
          title: 'title 2',
          content: 'this is content 2'
        },
        {
          title: 'title 3',
          content: 'this is content 3'
        },
        {
          title: 'title 4',
          content: 'this is content 5'
        }
      ]
    }
  },
  methods: {
    $testClick: function (event) {
      eventHub.trigger(eventId + '-update-data', { userName: '' })
    },

    $testInput: function (event) {
      eventHub.trigger(eventId + '-update-data', { userName: event.target.value })
    },

    $itemClick(index, item) {
      console.info(index, ':', item)
    }
  },
  created: function () {
    console.info('@@@@created@@@@')
  },
  mounted: function () {
    console.info('@@@@mounted@@@@')
  },
  updated: function () {
    console.info('@@@@updated@@@@')
  }
}

App = new MyMvvm(meta, eventId, document.querySelector('body'))
App.boot()
