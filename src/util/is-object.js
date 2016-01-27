'use strict'

module.exports = function (obj) {
  return (
    obj != null &&
    typeof obj === 'object' &&
    !Array.isArray(obj)
  )
}
