export default class Dep {
  constructor () {
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  notify () {
    this.subs.forEach((sub) => {
      if (typeof sub.update === 'function') {
        sub.update()
      }
    })
  }

  removeSub (sub) {
    let index = sub.indexOf(this.subs)
    if (index >= 0) {
      this.subs.splice(index, 1)
    }
  }

  depend () {
    Dep.target.addDep(this)
  }
}

Dep.target = null
