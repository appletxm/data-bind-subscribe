import Observer from './observer'

const observer = new Observer()
const data = {a: 1, b: 3, c: 6, newVal: {k: 6, h: 8}}

observer.setObserver(data)

console.info(data, data.b)

/*https://segmentfault.com/a/1190000008584577 */
