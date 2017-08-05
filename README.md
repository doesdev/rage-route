# rage-route [![NPM version](https://badge.fury.io/js/rage-route.svg)](https://npmjs.org/package/rage-route)   [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)   [![Dependency Status](https://dependencyci.com/github/doesdev/rage-route/badge)](https://dependencyci.com/github/doesdev/rage-route)

> Tiny, feature lite, super basic client router

## Why rage?

Because I had been running page.js and got rage pissed dealing with
stagnant bugs causing client headaches. The features I used required very little
code to accomplish, so here it is.

I don't plan on adding any features not currently present unless they also require
very little code.

Ships with es6 styled module and commonjs module for your rolling pleasure.

## Install

```sh
$ npm install --save rage-route
```

## Usage

```js
import { addRoute, addRedirect, route, history } from 'rage-route'
addRoute('/somepage', 'Page Title', (state) => handlePageRoute(state))
addRedirect('/someotherpage', '/somepage')
addRoute('.*', 'Everything Else', (state) => handleDefaultRoute(state))
...
route('/somepage')
...
console.log(history.previous)
console.log(history.current)
```

## API

#### Add route handler

#### `addRoute(*path, *title, *callback)`

- **path** *[string - required]* (ex. `'/somepage'`)
- **title** *[string - required]* (ex. `'Page Title'`)
- **callback** *[function - receives state object - required]* (ex. `(state) => fn(state)`)

#### Add redirect from one page to another

#### `addRedirect(*oldPath, *newPath)`

- **oldPath** *[string - required]* (ex. `'/someotherpage'`)
- **newPath** *[string - required]* (ex. `'/somepage'`)

#### Route to another page, triggering callback set in addRoute

#### `route(*path, *title, *state, *noStore)`

- **path** *[string - required]* (ex. `'/somepage'`)
- **title** *[string - optional]* (ex. `'Page Title'`)
- **state** *[object - optional]* (ex. `{foo: 'bar'}`)
- **noStore** *[boolean - optional - don't store state in history]* (ex. `true`)

#### We also expose a history object with the previous and current page

#### `history`

- **previous** *[string]* previous page
- **current** *[string]* current page

## License

MIT © [Andrew Carpenter](https://github.com/doesdev)
