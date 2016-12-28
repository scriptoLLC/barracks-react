const React = require('react')
const barracks = require('barracks')
const sid = require('shortid')

function generateStore (component, model) {
  const BarracksReact = React.createClass({
    componentWillMount: function () {
      if (!model.namespace) {
        model.namespace = sid.generate()
      }
      this.namespace = model.namespace
      this.store = barracks()
      this.store.use({
        onError: (err) => {
          this.setState({err})
        },
        onStateChange: (state, data, prev, caller) => {
          this.setState({model: state[this.namespace]})
        }
      })
      this.store.model(model)

      const createSend = this.store.start({subscriptions: false})
      const _send = createSend('reactDispatcher', true)
      const send = (action, msg) => {
        _send(`${this.namespace}:${action}`, msg)
      }
      this.setState({model: Object.assign({}, model.state), send})
    },

    componentWillUnmount: function () {
      this.store.stop()
    },

    render: function () {
      return React.createElement(component, this.state)
    }
  })

  return BarracksReact
}

module.exports = generateStore
