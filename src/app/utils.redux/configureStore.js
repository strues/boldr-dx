import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise';

import rootReducer from 'state/reducers';

/**
 * configureStore
 * @param  {Object} initialState         initial state to bootstrap stores for server rendering
 * @param  {History Object} history      createMemoryHistory for server. browserHistory for client rendering
 * @return {Object}                      the store.
 */
export default function configureStore(initialState, history) {
  const middleware = [thunkMiddleware, promiseMiddleware, routerMiddleware(history)];
  if (__DEV__) {
    middleware.push(createLogger());
  }

  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middleware),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('state/reducers', () => {
      const nextReducer = require('state/reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
