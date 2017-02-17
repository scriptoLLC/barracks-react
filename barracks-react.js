const React = require('react')
const barracks = require('barracks')
const shortid = require('shortid')
const store = barracks()
const data = {}
const components = {}
let send

store.use({
  onError: (err) => {
    updateComponents(err)
  },
  onStateChange: (state, data, prev, caller) => {
    updateComponents(null, state)
  }
})

function addModels (models) {
  if (send) {
    throw new Error('Cant add after start')
  }

  if (!Array.isArray(models)) {
    models = [models]
  }

  models.forEach((model) => {
    store.model(model)
    data[model.namespace] = model.state
  })
}

function updateComponents (err, data) {
  Object.keys(components).forEach(k => components[k]({err, data}))
}

function connectComponent (component, models) {
  if (!send) {
    const createSend = store.start({subscriptions: false})
    send = createSend('reactDispatcher', true)
  }

  const BarracksReact = React.createClass({
    getInitialState: function () {
      this._bid = shortid.generate()
      components[this._bid] = this.setState.bind(this)
      return {data, send}
    },

    componentWillMount: function () {
      this.setState({data})
    },

    componentWillUnmount: function () {
      delete components[this._bid]
    },

    render: function () {
      return React.createElement(component, this.state)
    }
  })

  return BarracksReact
}

module.exports = {addModels, connectComponent}
