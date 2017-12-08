import Compiler from '../compiler'
const compiler = new Compiler()

export default class Core {
  constructor (meta, eventId, dom) {
    this.meta = meta
    this.data = meta.data()
    this.eventId = eventId
    this.dom = dom ? dom : document.querySelector('body')
  }
  created () {
    this._compiler(this.data, this.meta.template, this.eventId)

    if (this.meta && this.meta.created && typeof this.meta.created === 'function') {
      this.meta.created()
    }
  }

  mounted () {
    if (this.meta && this.meta.mounted && typeof this.meta.mounted === 'function') {
      this.meta.mounted()
    }
    eventHub.on(this.eventId + '-dom-event', this._handleDomEvent.bind(this))
    eventHub.on(this.eventId + '-update-data', this._handleDataUpdateEvent.bind(this))
  }

  boot () {
    this.created()
    this.mounted()
  }

  updated () {
    // this._compiler(this.data, this.meta.template)

    if (this.updated && this.meta.updated && typeof this.meta.updated === 'function') {
      this.meta.updated()
    }
  }

  _handleDomEvent (eventName, event) {
    let fn, methods, fnName, params

    fnName = eventName.match(/.[^\(]+/)[0]
    methods = this.meta.methods
    fn = methods[fnName]

    if (fn && typeof fn === 'function') {
      params = arguments.length <= 2 ? [] : Array.from(arguments).slice(2)
      if (params && params.length >= 1) {
        fn(...params)
      } else {
        fn(event)
      }
    }
  }

  _handleDataUpdateEvent (params) {
    this.data = Object.assign(this.data, params)
    compiler.updateData(this.data, Object.keys(params))
  }

  _compiler (data, template, eventId) {
    let nodes = []
    compiler.setTemplate(data, template, eventId)
    nodes = compiler.getNodes()
    this.dom.appendChild(nodes)
  }
}
