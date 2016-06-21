import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import createRoutes from './config.routes';
import configureStore from './utils.redux/configureStore';
import preRenderMiddleware from './utils.render/preRenderMiddleware';

import './styles/app.scss';
const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, browserHistory);
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(store);

/**
 * Callback function handling frontend route changes.
 */
function onUpdate() {
  if (window.__INITIAL_STATE__ !== null) {
    window.__INITIAL_STATE__ = null;
    return;
  }
  const { state: { components, params } } = this;
  preRenderMiddleware(store.dispatch, components, params);
}

const root = (
<Provider store={ store }>
    <Router history={ history }>
        { routes }
    </Router>
</Provider>
);

const MOUNT_DOM = document.getElementById('root');

ReactDOM.render(root, MOUNT_DOM);
