import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import CoreLayout from 'shared/tpl.CoreLayout';
import Error404 from 'shared/pg.Error404';

import Home from 'scenes/Home';

export default (store) => {
  return (
  <Route path="/" component={ CoreLayout }>
    <IndexRoute component={ Home } />
    <Route path="home" component={ Home } />

     <Route path="*" component={ Error404 } />
  </Route>
  );
};

