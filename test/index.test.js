'use strict'
const test = require('brittle')
const path = require('bare-path')

test('pear-rti throws if missing Pear.constructor.RTI.checkout', (t) => {
  t.exception(() => require('..'))
})

test('pear-rti exports CHECKOUT', (t) => {
  class API {
    static RTI = { checkout: { fork: null, length: null, key: '/some/path' } }
  }
  global.Pear = new API()
  t.teardown(() => {
    delete global.Pear
  })

  t.alike(API.RTI.checkout, require('..').CHECKOUT)
})

test('pear-rti exports Pear.constructor.RTI.mount (if set) (+ \'/\') as URL', (t) => {
  class API {
    static RTI = {
      checkout: { fork: null, length: null, key: '/some/path' },
      mount: '/a/b/c'
    }
  }
  global.Pear = new API()
  t.teardown(() => {
    delete global.Pear
  })
  const { MOUNT } = require('..')
  t.ok(MOUNT instanceof URL)
  console.log(MOUNT.pathname, API.RTI.mount + '/')
})

test('pear-rti exports Pear.constructor.RTI.checkout', (t) => {
  class API {
    static RTI = { checkout: { fork: null, length: null, key: '/some/path' } }
  }
  global.Pear = new API()
  t.teardown(() => {
    delete global.Pear
  })

  t.alike(API.RTI.checkout, require('..').CHECKOUT)
})

test('pear-rti MOUNT defaults to entrypoint dirname (+ \'/\') as URL', (t) => {
  class API {
    static RTI = { checkout: { fork: null, length: null, key: '/some/path' } }
  }
  global.Pear = new API()
  t.teardown(() => {
    delete global.Pear
  })
  const { MOUNT } = require('..')
  t.ok(MOUNT instanceof URL)
  t.is(MOUNT.pathname, path.dirname(require.main.url.pathname) + '/')
})

test('pear-rti MOUNT defaults to entrypoint dirname (+ \'/\') as URL - boot.bundle case', (t) => {
  class API {
    static RTI = { checkout: { fork: null, length: null, key: '/some/path' } }
  }
  global.Pear = new API()
  const main = require.main
  require.main = {
    __proto__: require.main,
    url: new URL(path.dirname(require.main.url.pathname) + '/boot.bundle', 'file:')
  }
  t.teardown(() => {
    delete global.Pear
    require.main = main
  })
  const { MOUNT } = require('..')
  t.is(MOUNT.pathname, path.dirname(main.url.pathname) + '/')
})
