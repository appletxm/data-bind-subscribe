export default class Compiler {
  constructor (el) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
      this.$fragment = this.nodeToFragment(this.$el)
      this.init()
      this.$el.appendChild(this.$fragment)
      this.$vm.$option['mount'] && this.$vm.$option['mount'].call(this.$vm)
    }
  }
}
