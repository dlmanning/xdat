'use strict'

var Map = require('es6-map')
var shallowEqual = require('./util/shallow-equal')
var DEFAULT = 'hi2[Kza]ACn=&*T;rgW?Q6'

module.exports = function pure (component) {
  var cache = new Map()
  var lastCache = null
  var token = null

  cache.set(DEFAULT, {
    lastProps: null,
    lastContext: null,
    result: null
  })

  return function (props, children, context, callToken) {
    if (callToken !== token) {
      lastCache = cache
      cache = new Map()
      token = callToken
    }

    var keyPropName = props.key != null
      ? props.key
      : DEFAULT

    var cached = lastCache.get(keyPropName)
    var lastProps = cached != null ? cached.lastProps : null
    var lastContext = cached != null ? cached.lastContext : null

    var result
    if (
      !shallowEqual(props, lastProps) ||
      !shallowEqual(context, lastContext)
    ) {
      result = component(props, children, context)
      cache.set(keyPropName, { lastProps: props, lastContext: context, result })
    } else {
      result = cached.result
      cache.set(keyPropName, cached)
    }

    return result
  }
}
