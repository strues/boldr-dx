/**
 * server/utils/renderReact
 * Provides serverside rendering
 *
 * @exports {Function} - handleRender
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext, createMemoryHistory } from 'react-router';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import configureStore from 'app/utils.redux/configureStore';
import createRoutes from 'app/config.routes';
import Html from 'app/utils.render/Html';

const head = Helmet.rewind();
const renderFullPage = (component, store) => {
  const assets = webpackIsomorphicTools.assets();
  // Render the component to a string
  const html = renderToString(<Html head={ head } assets={ assets } component={ component } store={ store } />);

  return `<!doctype html>\n${html}`;
};

const handleRender = ctx => {
  // clear require() cache if in development mode
  // (makes asset hot reloading work)
  if (__DEV__) {
    webpackIsomorphicTools.refresh();
  }
  const history = createMemoryHistory();
  // Compile an initial state
  const initialState = {};
  // Create a new Redux store instance
  const store = configureStore(initialState);
  // Grab the initial state from our Redux store
  const finalState = store.getState();
  const routes = createRoutes(store);
  const _ctx = ctx;
  const { url: location } = _ctx;

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (error) {
      _ctx.status = 500;
      _ctx.body = error.message;
    } else if (redirectLocation) {
      _ctx.status = 302;
      _ctx.redirect(`${redirectLocation.pathname}${redirectLocation.search}`);
    } else if (renderProps) {
      const component = (
        <Provider store={store} key="provider">
            <RouterContext {...renderProps} />
        </Provider>
      );

      // Send the rendered page back to the client
      _ctx.type = 'html';
      _ctx.status = 200;
      _ctx.body = renderFullPage(component, store);
    } else {
      _ctx.status = 404;
      _ctx.body = 'Not found';
    }
  });
};

export { handleRender };
