var win = typeof window !== 'undefined' ? window : {};
var doc = typeof document !== 'undefined' ? document : {};
var winHist = win.history || {};
var routes = {}; // globals

var routesAry = []; // helpers

var orderRoutes = function orderRoutes() {
  var fz = routesAry.filter(function (p) {
    return p.match(/\*/);
  });
  if (!fz.length) return;
  routesAry = routesAry.filter(function (p) {
    return !p.match(/\*/);
  }).concat(fz);
}; // main


var history = {};
var list = function list() {
  return routesAry;
};
var addRoute = function addRoute(path, title, cb) {
  routes[path] = {
    path: path,
    cb: cb,
    title: title
  };
  routesAry.push(path);
  orderRoutes();
};
var addRedirect = function addRedirect(newPath, existingPath) {
  routes[newPath] = routes[existingPath];
  routesAry.push(newPath);
  orderRoutes();
};
var route = function route(path, title, state, noStore) {
  path = path || history.current;
  state = state || {};

  var find = function find(r) {
    return r.match(/\*/) && path.match(new RegExp(r));
  };

  var handler = routes[path];
  if (handler) path = handler.path;
  if (!handler) handler = routes[(routesAry.filter(find) || [])[0]];
  if (!handler) throw new Error('Handler not found for path: ' + path);
  title = title || handler.title || doc.title;
  if (title && title !== doc.title) doc.title = title;
  history.previous = history.current;
  history.current = state.pathname = path;

  if (winHist.pushState) {
    winHist.pushState(noStore ? {} : state, title, path);
  }

  handler.cb(state);
};
function updateUrl(path, title) {
  if (title && title !== doc.title) doc.title = title;
  if (winHist.pushState) winHist.pushState(null, title || doc.title, path);
}

export { addRedirect, addRoute, history, list, route, updateUrl };
