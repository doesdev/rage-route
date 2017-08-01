'use strict'

// Setup
const fs = require('fs')
const pkg = require('./package.json')
const semver = require('semver')
const rollup = require('rollup').rollup
const entry = 'module.js'
const dest = 'index.js'
const git = require('simple-git')(__dirname)
const toAdd = ['package.json', dest]

// Main
pkg.version = semver.inc(pkg.version, 'patch')
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8')
let cjsRollup = () => rollup({entry})
let cjsBundle = (b) => b.write({format: 'cjs', dest})
let rollCjs = () => cjsRollup().then(cjsBundle)
let gitAdd = () => new Promise((resolve, reject) => {
  git.add(toAdd, (err) => err ? reject(err) : resolve())
})

rollCjs().then(gitAdd).catch(console.error)