'use strict'

import test from 'ava'
const { addRoute, route, list, addRedirect, history } = require('./index')

// globals
let val
let state = {foo: 'bar'}
let oldPath = 'some/other/page'

test.serial(`addRoute adds a route, list shows that route`, (assert) => {
  let path = '/somepage'
  addRoute(path, 'Page Title', () => {})
  assert.is(list()[0], path)
})

test.serial(`route fails if no match`, (assert) => {
  assert.throws(() => route('/no/matching/path'))
})

test.serial(`re-routes to current path if no path specified`, (assert) => {
  route('/somepage')
  assert.notThrows(() => route())
})

test.serial(`default route works`, (assert) => {
  addRoute('.*', 'Page Title', (state) => {})
  assert.notThrows(() => route('/no/matching/path'))
})

test.serial(`explicit route supercedes regex route`, (assert) => {
  let path = '/another/page'
  addRoute(path, 'Page Title', () => {})
  assert.is(list()[1], path)
})

test.serial(`route fires callback with state`, (assert) => {
  addRoute(oldPath, 'Other Page', (s) => { val = s })
  route(oldPath, 'Some Title', state)
  assert.is(val.foo, 'bar')
})

test.serial(`addRedirect redirects correctly`, (assert) => {
  let newPath = 'yet/another/page'
  addRedirect(newPath, oldPath)
  state.bar = 'foo'
  route(newPath, 'Some Title', state)
  assert.is(val.bar, 'foo')
})

test.serial(`history returns expected paths`, (assert) => {
  let current = 'unspecified/path'
  route(current)
  assert.is(history.previous, oldPath)
  assert.is(history.current, current)
})

test.serial(`regexed search route works as expected`, (assert) => {
  let path = '/search?somekey=someval'
  addRoute('/search?.*', 'Search Page', (s) => {})
  route(path)
  assert.is(history.current, path)
})
