'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// setup
var winHist = window.history || {};
var routes = {};
var routesAry = [];

// main
var history = {};

function addRoute (path, title, cb) {
  routes[path] = {cb: cb, title: title};
  routesAry.push(path);
}

function addRedirect (oldPath, newPath) {
  routes[oldPath] = routes[newPath];
  routesAry.push(oldPath);
}

function route (path, title, state, noStore) {
  state = state || {};
  var find = function (r) { return path.match(new RegExp(r)) || [] };
  var key = routesAry.filter(find)[0];
  var handler = routes[key];
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
exports.addRoute = addRoute;
exports.addRedirect = addRedirect;
exports.route = route;
exports.updateUrl = updateUrl;
