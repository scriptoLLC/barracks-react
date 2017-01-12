const React = require('react')
const barracks = require('barracks')

function generateStore (component, models) {
  const BarracksReact = React.createClass({
    componentWillMount: function () {
      if (!Array.isArray(models)) {
        models = [models]
      }
      this.store = barracks()
      this.store.use({
        onError: (err) => {
          this.setState({err})
        },
        onStateChange: (state, data, prev, caller) => {
          this.setState({data: state})
        }
      })
      const data = {}
      models.forEach((model) => {
        this.store.model(model)
        data[model.namespace] = model.state
      })

      const createSend = this.store.start({subscriptions: false})
      const send = createSend('reactDispatcher', true)
      this.setState({data, send})
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
