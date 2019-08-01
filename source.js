'use strict'

const win = typeof window !== 'undefined' ? window : {}
const doc = typeof document !== 'undefined' ? document : {}
const winHist = win.history || {}
const routes = {}

let routesAry = []

const orderRoutes = () => {
  const fz = routesAry.filter(function (p) { return p.match(/\*/) })

  if (!fz.length) return

  routesAry = routesAry.filter(function (p) { return !p.match(/\*/) }).concat(fz)
}

export const history = {}

export const list = () => routesAry

export const addRoute = (path, title, cb) => {
  routes[path] = { path: path, cb: cb, title: title }
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

  const find = (r) => r.match(/\*/) && path.match(new RegExp(r))

  let handler = routes[path]

  if (handler) path = handler.path
  if (!handler) handler = routes[(routesAry.filter(find) || [])[0]]
  if (!handler) throw new Error('Handler not found for path: ' + path)

  title = title || handler.title || doc.title

  if (title && title !== doc.title) doc.title = title

  history.previous = history.current
  history.current = state.pathname = path

  if (winHist.pushState) {
    winHist.pushState(noStore ? {} : state, title, path)
  }

  handler.cb(state)
}

export function updateUrl (path, title) {
  if (title && title !== doc.title) doc.title = title
  if (winHist.pushState) winHist.pushState(null, title || doc.title, path)
}
