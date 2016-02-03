'use strict'

const test = require('tape')
const xdat = require('../src')
const single = require('./data/single.json')
const flattened = require('./data/single-flat.json')
const multiple = require('./data/mock.json')

const h = xdat.createComponent
const pure = xdat.pure
const run = xdat.run

test('basic exports', t => {
  t.is(typeof h, 'function', 'exports createComponent')
  t.is(typeof pure, 'function', 'exports pure')
  t.is(typeof run, 'function', 'exports run')

  t.end()
})

function Entity (props, children, context) {
  const childKeys = [...children.keys()]
  const entity = copyWithout(props, childKeys)
  const result = { [entity.id]: entity }

  for (let key of childKeys) {
    const value = props[key]
    const child = children(key)

    if (value == null) continue

    if (Array.isArray(value)) {
      entity[key] = value.map(entity => entity.id)
      Object.assign(result, ...flatMap(value, child))
    } else {
      entity[key] = value.id
      Object.assign(result, child(value))
    }
  }

  return result
}

const schema = h(Entity, {
  'procedure': h(Entity),
  'car': h(Entity),
  'employer': h(Entity)
})

test('single object', t => {
  const output = run(schema, single)

  t.isEquivalent(
    output,
    flattened,
    'process a single object'
  )

  t.end()
})

test('multiple objects', t => {
  const multischema = h(People, { person: schema })

  const output = run(multischema, multiple)

  t.equals(Object.keys(output).length, 284, 'deconstructed a lot of entities')

  t.end()

  function People (props, children) {
    return Object.assign(...props.map(children('person')))
  }
})

function flatMap (arr, lambda) {
  return [].concat(...arr.map(lambda))
}

function copyWithout (obj, except) {
  except = except || []
  const exclusionSet = new Set(except)

  return filterObject(obj, (key) => !exclusionSet.has(key))
}

function filterObject (obj, cb) {
  const copy = {}

  const allOwnKeys = Object.keys(obj).concat(Object.getOwnPropertySymbols(obj))

  for (let key of allOwnKeys) {
    if (cb(key, obj[key])) {
      copy[key] = obj[key]
    }
  }

  return copy
}
