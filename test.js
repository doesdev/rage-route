'use strict'

const test = require('mvt')
const {
  addRoute,
  route,
  list,
  addRedirect,
  history,
  currentTitle,
  registerComponent
} = require('./index')

const oldPath = 'some/other/page'

test('addRoute adds a route, list shows that route', (assert) => {
  const path = '/somepage'
  addRoute(path, 'Page Title', () => {})
  assert.is(list()[0], path)
})

test('route fails if no match', (assert) => {
  assert.throws(() => route('/no/matching/path'))
})

test('re-routes to current path if no path specified', (assert) => {
  route('/somepage')
  assert.notThrows(() => route())
})

test('default route works', (assert) => {
  addRoute('.*', 'Page Title', () => {})
  assert.notThrows(() => route('/no/matching/path'))
})

test('explicit route supercedes regex route', (assert) => {
  const path = '/another/page'
  addRoute(path, 'Page Title', () => {})
  assert.is(list()[1], path)
})

test('route fires callback with state', (assert) => {
  let val
  const state = { foo: 'bar' }
  addRoute(oldPath, 'Other Page', (s) => { val = s })
  route(oldPath, 'Some Title', state)
  assert.is(val.foo, 'bar')
})

test('title as function', (assert) => {
  const title = 'Title Function'
  const titlePath = '/title-as-function'
  addRoute(titlePath, () => title, () => {})
  route(titlePath)
  assert.is(currentTitle(), title)
})

test('registerComponent', (assert) => {
  const title = 'Register Component'
  const path = '/register-component'
  registerComponent({ path, title: () => title, component: () => {} })
  route(path)
  assert.is(currentTitle(), title)

  const title2 = 'Register Component 2'
  const path2 = '/register-component-2'
  registerComponent(path2, { title: () => title2, component: () => {} })
  route(path2)
  assert.is(currentTitle(), title2)
})

test('history returns expected paths', (assert) => {
  const current = 'unspecified/path'
  route(oldPath)
  route(current)
  assert.is(history.previous, oldPath)
  assert.is(history.current, current)
})

test('addRedirect redirects correctly', (assert) => {
  const state = { foo: 'bar' }
  const redirectedPath = '/jimmy'
  addRoute(redirectedPath, 'Jimmy', (s) => { s.bar = 'foo' })
  const newPath = 'yet/another/page'
  addRedirect(newPath, redirectedPath)
  route(newPath, 'Some Title', state)
  assert.is(state.bar, 'foo')
})

test('regexed path with query string works as expected', (assert) => {
  const state = { foo: 'bar' }
  const path = '/search?somekey=someval'
  addRoute('/search.*', 'Search Page', () => {})
  route(path, 'Regeed w/ query params', state)

  assert.is(history.current, path)
  assert.deepEqual(state.queryParams, { somekey: 'someval' })
})
