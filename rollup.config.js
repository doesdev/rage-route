'use strict'

import rollBabel from 'rollup-plugin-babel'
const babelOpts = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        useBuiltIns: 'entry',
        targets: { browsers: ['ie > 8'] }
      }
    ]
  ],
  exclude: 'node_modules/**'
}
export default {
  input: 'source.js',
  output: [
    {
      file: 'index.js',
      format: 'cjs'
    },
    {
      file: 'module.js',
      format: 'es'
    }
  ],
  plugins: [rollBabel(babelOpts)]
}
