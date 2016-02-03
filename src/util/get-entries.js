'use strict'

var isObject = require('./is-object')

module.exports = function getEntries (obj) {
  if (!isObject(obj)) {
    throw new Error('getEntries requires an object as a parameter')
  }

  var allOwnKeys =
    Object.keys(obj).concat(Object.getOwnPropertySymbols(obj))

  return allOwnKeys.map(function (key) {
    return [key, obj[key]]
  })
}
