'use strict'

const test = require('mvt')
const { addRoute, route, list, addRedirect, history } = require('./index')

let val
const state = { foo: 'bar' }
const oldPath = 'some/other/page'

test(`addRoute adds a route, list shows that route`, (assert) => {
  const path = '/somepage'
  addRoute(path, 'Page Title', () => {})
  assert.is(list()[0], path)
})

test(`route fails if no match`, (assert) => {
  assert.throws(() => route('/no/matching/path'))
})

test(`re-routes to current path if no path specified`, (assert) => {
  route('/somepage')
  assert.notThrows(() => route())
})

test(`default route works`, (assert) => {
  addRoute('.*', 'Page Title', (state) => {})
  assert.notThrows(() => route('/no/matching/path'))
})

test(`explicit route supercedes regex route`, (assert) => {
  const path = '/another/page'
  addRoute(path, 'Page Title', () => {})
  assert.is(list()[1], path)
})

test(`route fires callback with state`, (assert) => {
  addRoute(oldPath, 'Other Page', (s) => { val = s })
  route(oldPath, 'Some Title', state)
  assert.is(val.foo, 'bar')
})

test(`addRedirect redirects correctly`, (assert) => {
  const newPath = 'yet/another/page'
  addRedirect(newPath, oldPath)
  state.bar = 'foo'
  route(newPath, 'Some Title', state)
  assert.is(val.bar, 'foo')
})

test(`history returns expected paths`, (assert) => {
  const current = 'unspecified/path'
  route(current)
  assert.is(history.previous, oldPath)
  assert.is(history.current, current)
})

test(`regexed search route works as expected`, (assert) => {
  const path = '/search?somekey=someval'
  addRoute('/search?.*', 'Search Page', (s) => {})
  route(path)
  assert.is(history.current, path)
})
