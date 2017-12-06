export default class Compiler {
  constructor (data, template) {
    this.data = {}
    this.template = ''
    this.nodes = []
    this.eventId = ''
    this.parentNode = null
  }

  setTemplate (data, template, eventId) {
    this.data = data
    this.template = template
    this.parentNode = null
    this.eventId = eventId
  }

  getNodes () {
    let analysNodesRes
    let data = this.data
    this.html = this.template

    analysNodesRes = this._analysNodes(this.html)
    this.nodes = analysNodesRes.allNodes
    this.parentNode = analysNodesRes.parentNode

    let {cloneAllNodes, cloneParentNode} = this._getCloneNodes()

    cloneAllNodes.map((node) => {
      node = (this._analysText(node, data))['node']
      node = (this._analysAttributes(node, data))['node']
      node = this._atachedEvent(node, data)
    })

    return cloneParentNode
  }

  updateData (data, changedKeys) {
    let {cloneAllNodes, cloneParentNode} = this._getCloneNodes()

    cloneAllNodes.map((node) => {
      let textRes = this._analysText(node, data)
      let attrRes = this._analysAttributes(node, data)
      // console.info(node, textRes.nodeChanged, attrRes.nodeChanged)
      if (textRes.nodeChanged === true) {
        document.querySelector('#' + textRes.node.getAttribute('id')).textContent = textRes.activeNode.nodeValue
      }
      if (attrRes.nodeChanged === true) {
        // if (attrRes.activeNode.nodeName === 'value') return
        let nodeInDoc = document.querySelector('#' + attrRes.node.getAttribute('id'))
        let nodeInDocAttr = nodeInDoc.getAttribute(attrRes.activeNode.nodeName)
        nodeInDocAttr = attrRes.activeNode.nodeValue
      }
    })
  }

  _analysNodes (html) {
    // let reg = /<([\w\d-\s]+)[//]{0,1}>/g
    // let matched = ''
    // let lastIndex = 0
    // let nodes = []

    // do {
    //   reg.lastIndex = lastIndex
    //   matched = reg.exec(html)
    //   lastIndex = matched ? (matched[0].length + matched.index - 1) : lastIndex
    //   console.info(matched[0], matched.index)
    // } while (matched)

    // let fragment = document.createDocumentFragment
    let div = document.createElement('div')
    let allNodes

    div.innerHTML = html
    allNodes = Array.prototype.slice.call(div.querySelectorAll('*'))

    allNodes.map((node) => {
      node.setAttribute('id', 'eId-' + Math.round(Math.random() * 100000))
    })

    return {parentNode: div, allNodes}
  }

  _analysText (node, data) {
    let childNodes = node.childNodes
    let nodeChanged = false
    let activeNode

    for (var i = 0; i < childNodes.length; i++) {
      if (childNodes[i].nodeType === 3) {
        nodeChanged = true
        activeNode = childNodes[i]
        childNodes[i].nodeValue = this._fillValue(childNodes[i].nodeValue, data)
      }
    }

    return {node, nodeChanged, activeNode}
  }

  _analysAttributes (node, data) {
    let attrs = node.attributes
    let nodeChanged = false
    let activeNode

    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i]['nodeValue'].indexOf('{{') >= 0) {
        nodeChanged = true
        activeNode = attrs[i]
        attrs[i]['nodeValue'] = this._fillValue(attrs[i]['nodeValue'], data)
      }
    }

    return {node, nodeChanged, activeNode}
  }

  _atachedEvent (node, data) {
    let attrs = node.attributes

    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i]['nodeName'].indexOf('@input') >= 0) {
        node.addEventListener('input', (event) => {
          window.eventHub.trigger(this.eventId + '-dom-event', event.target.getAttribute('@input'), event)
        })
      }
      if (attrs[i]['nodeName'].indexOf('@click') >= 0) {
        node.addEventListener('click', (event) => {
          window.eventHub.trigger(this.eventId + '-dom-event', event.target.getAttribute('@click'), event)
        })
      }
    }

    return node
  }

  _fillValue (nodeValue, data) {
    let nodeChanged = false

    Object.keys(data).forEach((key) => {
      let reg = new RegExp('\{\{' + key + '\}\}', 'g')
      nodeValue = nodeValue.replace(reg, (matchedValue) => {
        // console.info(matchedValue, data[key])
        return data[key]
      })
    })

    return nodeValue
  }

  _getCloneNodes () {
    let tmpDiv
    let cloneAllNodes
    let cloneParentNode

    tmpDiv = document.createElement('div')
    tmpDiv.innerHTML = this.parentNode.outerHTML
    cloneParentNode = (tmpDiv.children[0]).children[0]
    cloneAllNodes = Array.prototype.slice.call(cloneParentNode.children)

    return {cloneAllNodes, cloneParentNode}
  }
}
