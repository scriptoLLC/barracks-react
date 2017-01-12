const tape = require('tape')
const React = require('react')
require('react-addons-test-utils')
const {mount} = require('enzyme')
const bearact = require('../')
let count = 0

const testStore = {
  namespace: 'foo',
  state: {
    header: 'test'
  },
  reducers: {
    update: function (state, data) {
      ++count
      return {header: data}
    }
  },
  effects: {
    makeError: function (state, data, send, done) {
      done(new Error('boop'))
    }
  }
}

const testStore2 = {
  namespace: 'boop',
  state: {
    header: 'beep'
  },
  reducers: {
    update: function (state, data) {
      return {header: data}
    }
  }
}

const TestComponent = React.createClass({
  change: function (evt) {
    evt.preventDefault()
    this.props.send('foo:update', 'foobar')
  },
  render: function () {
    const props = {
      onClick: (evt) => this.props.send('foo:update', 'foobar'),
      onBlur: (evt) => this.props.send('foo:makeError')
    }
    return React.createElement('h1', props, `${this.props.err || this.props.data.foo.header}`)
  }
})

const TestComponent2 = React.createClass({
  render: function () {
    const props = {
      onClick: (evt) => this.props.send('boop:update', 'plorb')
    }
    return React.createElement('h1', props, `${this.props.data.boop.header} ${this.props.data.foo.header}`)
  }
})

tape('basic', (t) => {
  t.plan(4)
  const Test = bearact(TestComponent, testStore)
  const el = React.createElement(Test, {}, null)
  const wrapper = mount(el)
  const h1 = wrapper.find('h1')
  t.equal(h1.text(), testStore.state.header)
  h1.simulate('click')
  setTimeout(() => {
    const h1 = wrapper.find('h1')
    t.equal(h1.text(), 'foobar')
    h1.simulate('blur')
    setTimeout(() => {
      const h1 = wrapper.find('h1')
      t.equal(h1.text(), 'Error: boop')
      wrapper.unmount()
      h1.simulate('click')
      setTimeout(() => {
        t.equal(count, 1)
      }, 5)
    }, 5)
  }, 5)
})

tape('multimodel', (t) => {
  const Test = bearact(TestComponent2, [testStore, testStore2])
  const el = React.createElement(Test, {}, null)
  const wrapper = mount(el)
  const h1 = wrapper.find('h1')
  t.equal(h1.text(), `${testStore2.state.header} ${testStore.state.header}`)
  h1.simulate('click')
  setTimeout(() => {
    t.equal(wrapper.find('h1').text(), 'plorb test')
    t.end()
  }, 5)
})

