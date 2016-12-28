const React = require('react')
const ReactDOM = require('react-dom')
const bearact = require('./')

const model = {
  namespace: 'example',
  state: {
    hello: ''
  },
  reducers: {
    setHello: (state, data) => ({hello: data.value})
  }
}

const Main = React.createClass({
  handleChange: function (evt) {
    this.props.send('setHello', {value: evt.target.value})
  },
  render: function () {
    return React.createElement('div', {}, [
      React.createElement('h1', {}, `Hello, ${this.props.model.hello}`),
      React.createElement('br', {}, null),
      React.createElement('input', {value: this.props.model.hello, onChange: (evt) => this.handleChange(evt)}, null)])
  }
})

const main = React.createElement(bearact(Main, model))
const mount = document.createElement('div')
document.body.appendChild(mount)
ReactDOM.render(main, mount)
