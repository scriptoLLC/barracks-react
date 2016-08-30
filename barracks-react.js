const barracks = require('barracks')
const noop = () => {}

function generateStore (onError) {
  const components = {}
  const currentAction = {}
  const opts = {
    onError: onError || noop,
    onAction: (data, state, name, caller, createSend) => {
      const action = name.split(':')[1]
      currentAction[action] = caller
    },
    onStateChange: (data, state, prev, caller, createSend) => {
      const ns = currentAction[caller]
      delete currentAction[caller]
      components[ns] && components[ns](state)
    }
  }
  const store = barracks(opts)
  return {register, deregister}

  function register (model, component) {
    if (typeof model.namespace !== 'string') {
      throw new Error('Models must have namespaces')
    }

    components[model.namespace] = (appState) => {
      component.setState(appState[model.namespace])
    }

    store.model(model)
    const createSend = store.start({noSubscriptions: true})
    const send = createSend(model.namespace, true)
    return send
  }

  function deregister (name) {
    if (typeof name !== 'string') {
      name = name.namespace
    }
    components[name] = void 0
  }
}

module.exports = generateStore
