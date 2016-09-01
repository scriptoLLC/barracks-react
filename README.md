# barracks-react

An action dispatcher for React that provides for unidirectional dataflows.
Intended to be very small and provide a small amount of cognative overhead in
providing an "actions up, data down" type model for React. Built on top of
[barracks](https://github.com/yoshuawuyts/barracks). Bonus -- use this with
[hyperx](https://github.com/substack/hyperx) for a JSX-free, forward compatible
version of React!

## Usage
```js
const React = require('react')
const ReactDOM = require('react-dom')
const hyperx = require('hyperx')
const html = hyperx(React.createElement)
const br = require('./')
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
      hello: '',
      instance: this
    }
  },
  componentWillMount: function () {
    this.send = store.register(model, this.state.instance)
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
      <input type="text" value="${this.state.hello}" onChange=${this.handleChange} />
    </div>`
  }
})

const main = React.createElement(Main)
ReactDOM.render(main, document.body)
```

## License
Copyright © 2016 Scripto, licenced under the Apache-2.0 license
