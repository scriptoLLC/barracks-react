const React = require('react')
const ReactDOM = require('react-dom')
const hyperx = require('hyperx')
const html = hyperx(React.createElement)
const br = require('barracks-react')
const store = br()

const model = {
  namespace: 'example',
  store: {
    hello: ''
  },
  reducers: {
    setHello: (data, state) => ({hello: data.value})
  }
}

const Main = React.createClass({
  getInitialState: function () {
    return {
      hello: ''
    }
  },
  componentWillMount: function () {
    this.send = store.register(model, this)
  },
  componentWillUnmount: function () {
    store.unregister(model)
  },
  handleChange: function (evt) {
    this.send('example:setHello', {value: evt.target.value})
  },
  render: function () {
    return html`<div>
      <h1>Hello, ${this.state.hello}</h1><br>
      <input type="text" value="${this.state.hello}" onChange=${(e) => this.handleChange(e)} />
    </div>`
  }
})

const main = React.createElement(Main)
const mount = document.createElement('div')
mount.id = 'example'
document.body.appendChild(mount)
ReactDOM.render(main, mount)
