'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, hashHistory, Route, IndexRoute } from 'react-router';
import { hashHistory, IndexRoute } from 'react-router';
import { BrowserRouter as Router, Route ,HashRouter,Switch } from 'react-router-dom';
import Apply from "./mod/index";
import { Provider } from 'react-redux';
// import { createStore } from 'redux';
import { store } from 'common/store.js';
import Loading from 'components/Loading/index';

ReactDOM.render(
  <Provider store={store}>
    <HashRouter history={hashHistory}>
	    <Switch>
	      <Loading>
  			<Route exact path="/" component={Apply} />
		    <Route path="/:data" component={Apply} />
		    {/*<Route exact path="/equipment" component={Apply} />*/}
	      </Loading>
	     </Switch>
    </HashRouter>
  </Provider>
,
  document.getElementById('container'));
