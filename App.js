import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import MainApplication from './containers/MainApplication';
import reducer from './reducers'

const middleware = [thunk]
const store = createStore(
    reducer,
    applyMiddleware(...middleware)
)

export default class Main extends React.Component {
  render() {
    return (
      <Provider store={store} >
        <MainApplication />
      </Provider>
    );
  }
}