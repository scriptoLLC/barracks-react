const tape = require('tape')
const br = require('../')

tape('basic', (t) => {
  t.plan(1)
  const store = br()
  const model = {
    namespace: 'test',
    state: {
      val: false
    },
    reducers: {
      setVal: (data, state) => ({val: true})
    }
  }
  const view = {
    setState: (state) => {
      t.ok(state.val)
    }
  }
  const send = store.register(model, view)
  send('test:setVal')
})

tape('dereg', (t) => {
  t.plan(1)
  const store = br()
  const model = {
    namespace: 'test',
    state: {
      val: false
    },
    reducers: {
      setVal: (data, state) => ({val: true})
    }
  }
  const view = {
    setState: (state) => {
      t.ok(state.val)
    }
  }
  const send = store.register(model, view)
  store.deregister(model)
  send('test:setVal')
  t.ok(true)
})

tape('dereg string', (t) => {
  t.plan(1)
  const store = br()
  const model = {
    namespace: 'test',
    state: {
      val: false
    },
    reducers: {
      setVal: (data, state) => ({val: true})
    }
  }
  const view = {
    setState: (state) => {
      t.ok(state.val)
    }
  }
  const send = store.register(model, view)
  store.deregister('test')
  send('test:setVal')
  t.ok(true)
})

tape('throws with no namespace', (t) => {
  t.plan(1)
  const store = br()
  const model = {
    state: {
      val: false
    },
    reducers: {
      setVal: (data, state) => ({val: true})
    }
  }
  const view = {
    setState: (state) => {
      t.ok(state.val)
    }
  }
  t.throws(() => store.register(model, view))
})
