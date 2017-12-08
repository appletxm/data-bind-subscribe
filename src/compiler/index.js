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
    let currentNodeTree
    let data = this.data
    this.html = this.template

    currentNodeTree = this._getCurrentNodeTree(this.html)
    this.nodes = currentNodeTree.allNodes
    this.parentNode = currentNodeTree.parentNode

    let {cloneAllNodes, cloneParentNode} = this._getCloneNodes()

    cloneAllNodes.map((node) => {
      node = this._analysNodeTree(node, data)
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

  _getCurrentNodeTree (html) {
    let div = document.createElement('div')
    let allNodes

    div.innerHTML = html
    allNodes = Array.prototype.slice.call(div.querySelectorAll('*'))

    allNodes.map((node) => {
      node.setAttribute('id', 'eId-' + Math.round(Math.random() * 100000))
    })

    return {parentNode: div, allNodes}
  }

  _analysNodeTree (node, data) {
    if (node.children.length <= 0) {
      node = (this._analysText(node, data))['node']
      node = (this._analysAttributes(node, data))['node']
      node = this._atachedEvent(node, data)
    } else {
      let attrs = Array.prototype.slice.call(node.attributes)
      let { attrKeys, attrValues } = this._getAttrKeysValues(node)

      if (attrs && attrs.length > 0 && attrKeys.indexOf('@for') >= 0) {
        node = this._analysForEach(node, data)
      }
    }
    return node
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
    let args = []

    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i]['nodeName'].indexOf('@input') >= 0) {
        node.addEventListener('input', (event) => {
          window.eventHub.trigger(this.eventId + '-dom-event', event.target.getAttribute('@input'), event, ...args)
        })
      }

      if (attrs[i]['nodeName'].indexOf('@click') >= 0) {
        let params = attrs[i]['nodeValue'].match(/\((.+)\)/g)
        if (params && params.length > 0) {
          params = params[0].replace(/\(|\s|\)/g, '').split(',')
          params.forEach((param) => {
            args.push(data[param])
          })
        }

        node.addEventListener('click', (event) => {
          window.eventHub.trigger(this.eventId + '-dom-event', event.target.getAttribute('@click'), event, ...args)
        })
      }
    }

    return node
  }

  _analysForEach (node, data) {
    // let leafNodes = Array.from(node.childNodes)
    let { attrKeys, attrValues, keyValue } = this._getAttrKeysValues(node)
    let listKey = (/in\s(.+)/).exec(keyValue['@for'])[1].trim()
    let needIndex = (/\(|\)/).exec(keyValue['@for'])
    let itemKey, indexKey
    let html = node.innerHTML

    if (needIndex) { [itemKey, indexKey] = (/\((.+)\)/).exec(keyValue['@for'])[1].split(',')
    }

    itemKey = itemKey.trim()
    indexKey = indexKey.trim()
    node.innerHTML = ''

    data[listKey].forEach((item, index) => {
      let dataItem = {
        [itemKey]: item,
        [indexKey]: index
      }
      let {allNodes} = this._getCurrentNodeTree(html)

      allNodes.map((leaf) => {
        leaf = this._analysNodeTree(leaf, dataItem)
        node.appendChild(leaf)
      })
    })

    return node
  }

  _fillValue (nodeValue, data) {
    let nodeChanged = false

    Object.keys(data).forEach((key) => {
      let reg = new RegExp('\\{\\{' + key + '(\\..[^\\{\\}]+)*' + '\\}\\}', 'g')
      nodeValue = nodeValue.replace(reg, (matchedValue) => {
        if (matchedValue) {
          return this._getValueFromContent(data, matchedValue)
        }
      })
    })

    return nodeValue
  }

  _getValueFromContent (data, matchedValue) {
    let labels = matchedValue.replace(/\{|\}/g, '').split('.')
    let fnStr = ''

    labels.map((label) => {
      fnStr += "['" + label + "']"
    })
    // console.info(eval('(data' + fnStr + ')'))

    return eval('(data' + fnStr + ')')
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

  _getAttrKeysValues (node) {
    let attrValues = []
    let attrKeys = []
    let keyValue = {}
    let attrs

    attrs = Array.from(node.attributes)
    attrs.forEach((attr) => {
      attrValues.push(attr.nodeValue)
      attrKeys.push(attr.nodeName)
      keyValue[attr.nodeName] = attr.nodeValue
    })

    return {attrKeys, attrValues, keyValue}
  }
}
