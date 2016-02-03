'use strict'

var objectAssign = require('object-assign')

module.exports = function run (abstractComponent, props, context) {
  var callToken = {}
  context = objectAssign({}, context)

  return abstractComponent(context, callToken)(props)
}
