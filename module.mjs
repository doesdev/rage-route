'use strict'

var win = typeof window !== 'undefined' ? window : {}
var doc = typeof document !== 'undefined' ? document : {}
var winHist = win.history || {}
var routes = {}
var memo = {}

var routesAry = []

function orderRoutes () {
  var fz = routesAry.filter(function (p) { return p.match(/\*/) })

  if (!fz.length) return

  routesAry = routesAry.filter(function (p) { return !p.match(/\*/) }).concat(fz)
}

export var history = {}

export function list () { return routesAry }

export function currentTitle () { return doc.title }

export function addRoute (path, title, cb) {
  memo = {}
  routes[path] = { path: path, cb: cb, title: title }
  routesAry.push(path)
  orderRoutes()
}

export function addRedirect (newPath, existingPath) {
  memo = {}
  routes[newPath] = routes[existingPath]
  routesAry.push(newPath)
  orderRoutes()
}

export function route (path, title, state, noStore) {
  path = path || history.current
  state = state || {}

  function find (r) { return r.match(/\*/) && path.match(new RegExp(r)) }

  function finder () {
    if (memo[path]) return memo[path]
    return (memo[path] = routes[(routesAry.filter(find) || [])[0]])
  }

  var handler = routes[path]

  if (handler) path = handler.path
  if (!handler) handler = finder()
  if (!handler) throw new Error('Handler not found for path: ' + path)

  title = title || handler.title || doc.title
  title = typeof title === 'function' ? title() : title

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

export function registerComponent (path, opts) {
  var pathIsString = typeof path === 'string'

  if (!pathIsString) {
    opts = path
    path = (opts || {}).path
  }

  var title = (opts || {}).title
  var component = (opts || {}).component

  if (!(path && title && component)) throw new Error('Missing required params')

  addRoute(path, title, component)
}
