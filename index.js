'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// setup
var winHist = window.history || {};
var routes = {};
var routesAry = [];

// helpers
function orderRoutes () {
  var fz = routesAry.filter(function (p) { return p.match(/\*/) });
  if (!fz.length) return
  routesAry = routesAry.filter(function (p) { return !p.match(/\*/) }).concat(fz);
}

// main
var history = {};

function list () { return routesAry }

function addRoute (path, title, cb) {
  routes[path] = {path: path, cb: cb, title: title};
  routesAry.push(path);
  orderRoutes();
}

function addRedirect (newPath, existingPath) {
  routes[newPath] = routes[existingPath];
  routesAry.push(newPath);
  orderRoutes();
}

function route (path, title, state, noStore) {
  state = state || {};
  var find = function (r) {
    return r.match(/\*/) && path.match(new RegExp(r))
  };
  var handler = routes[path];
  if (handler) path = handler.path;
  if (!handler) handler = routes[(routesAry.filter(find) || [])[0]];
  if (!handler) throw new Error('Handler not found for path: ' + path)
  title = title || handler.title || document.title;
  if (title && title !== document.title) document.title = title;
  history.previous = history.current;
  history.current = state.pathname = path;
  var search = state.search = (window.location || {}).search || '';
  if (winHist.pushState) {
    winHist.pushState(noStore ? {} : state, title, path + '' + search);
  }
  handler.cb(state);
}

function updateUrl (path, title) {
  if (title && title !== document.title) document.title = title;
  winHist.pushState(null, title || document.title, path);
}

exports.history = history;
exports.list = list;
exports.addRoute = addRoute;
exports.addRedirect = addRedirect;
exports.route = route;
exports.updateUrl = updateUrl;
