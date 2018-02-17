'use strict'

// setup
const win = typeof window !== 'undefined' ? window : {}
const doc = typeof document !== 'undefined' ? document : {}
const winHist = win.history || {}
const routes = {}

// globals
let routesAry = []

// helpers
const orderRoutes = () => {
  let fz = routesAry.filter(function (p) { return p.match(/\*/) })
  if (!fz.length) return
  routesAry = routesAry.filter(function (p) { return !p.match(/\*/) }).concat(fz)
}

// main
export const history = {}

export const list = () => routesAry

export const addRoute = (path, title, cb) => {
  routes[path] = {path: path, cb: cb, title: title}
  routesAry.push(path)
  orderRoutes()
}

export const addRedirect = (newPath, existingPath) => {
  routes[newPath] = routes[existingPath]
  routesAry.push(newPath)
  orderRoutes()
}

export const route = (path, title, state, noStore) => {
  path = path || history.current
  state = state || {}
  let find = (r) => r.match(/\*/) && path.match(new RegExp(r))
  let handler = routes[path]
  if (handler) path = handler.path
  if (!handler) handler = routes[(routesAry.filter(find) || [])[0]]
  if (!handler) throw new Error('Handler not found for path: ' + path)
  title = title || handler.title || doc.title
  if (title && title !== doc.title) doc.title = title
  history.previous = history.current
  history.current = state.pathname = path
  if (winHist.pushState) {
    let search = state.search = (win.location || {}).search || ''
    if (path.match(search)) search = ''
    winHist.pushState(noStore ? {} : state, title, path + '' + search)
  }
  handler.cb(state)
}

export function updateUrl (path, title) {
  if (title && title !== doc.title) doc.title = title
  if (winHist.pushState) winHist.pushState(null, title || doc.title, path)
}
