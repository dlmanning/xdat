'use strict'

var isObject = require('./util/is-object')
var createAbstractChildren = require('./create-abstract-children')

module.exports = function createComponent (componentFn, childDictionary) {
  childDictionary = childDictionary != null
    ? childDictionary
    : {}

  var abstractChildren = createAbstractChildren(childDictionary)

  var abstractComponent = function (context, callToken) {
    context = context != null && isObject(context)
      ? context
      : {}

    var children = abstractChildren(context, callToken)
    return function (props) {
      return componentFn(props, children, context, callToken)
    }
  }

  abstractChildren.forEach(function (value, key) {
    abstractComponent[key] = value
  })

  return abstractComponent
}
