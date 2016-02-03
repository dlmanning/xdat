'use strict'

var Map = require('es6-map')
var objectAssign = require('object-assign')
var getEntries = require('./util/get-entries')
var isObject = require('./util/is-object')

module.exports = function createAbstractChildren (childDictionary) {
  var childMap = getEntries(childDictionary).reduce(intoMap, new Map())

  var abstractChildren = function (context, callToken) {
    var children = function (propName, additionalContext) {
      var component = childMap.get(propName)

      context = additionalContext != null && isObject(additionalContext)
        ? objectAssign({}, context, additionalContext)
        : context

      return component(context, callToken)
    }

    children.keys = function () { return childMap.keys() }

    return children
  }

  abstractChildren.forEach = function (cb) { childMap.forEach(cb) }

  return abstractChildren
}

function intoMap (map, entry) {
  return map.set(entry[0], entry[1])
}
