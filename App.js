import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import MainApplication from './components/MainApplication';
import store from './redux/store'

const m_store = createStore(store, applyMiddleware(...[thunk]))

export default class Main extends React.Component {
  render() {
    return (
      <Provider store={m_store} >
        <MainApplication />
      </Provider>
    );
  }
}