import React from 'react';
import { Provider } from 'react-redux'

import MainApplication from './components/MainApplication';
import store from './redux/store'

export default class Main extends React.Component {
  render() {
    return (
      <Provider store={store} >
        <MainApplication />
      </Provider>
    );
  }
}