# barracks-react

An action dispatcher for React that provides for unidirectional dataflows.
Intended to be very small and provide a small amount of cognative overhead in
providing an "actions up, data down" type model for React. Built on top of
[barracks](https://github.com/yoshuawuyts/barracks).

## Usage
```js
const breact = require('barracks-react')
const store = breact()
const React = require('react')
const ReactDOM = require('react-dom')

const model = {
  namespace: 'hello',
  state: {
    hello: 'no one'
  },
  reducers: {
    updateHello: (data, state) => {
      return {hello: data.value}
    }
  }
}

const View = React.createClass({
  componentWillMount: function () {
    this.send = store.register(model, this)
  },
  componentWillUmount: function () {
    store.unregister(model)
  }
  handleChange: function (evt) {
    this.send('hello:updateHello', {value: evt.target.value})
  },
  render: function () {
    return (
      <div>
        <h1>Hello, {this.state.hello}</h1>
        <input type="text" value="{this.state.hello}" onChange={this.handleChange} />
      </div>
    )
  }
})

ReactDOM.render(<View />, document.body)
```

## License
Copyright © 2016 Scripto, licenced under the Apache-2.0 license
