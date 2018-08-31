'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, hashHistory, Route, IndexRoute } from 'react-router';
import { BrowserRouter as Router, Route, HashRouter, Switch} from 'react-router-dom';

import factorsSet from './mod/apply-set.jsx';

import './index.scss';
import '../../styles/common.scss';


ReactDOM.render(
  // <Router history={hashHistory}>
  //   <Route path="/" component={factorsSet} />
  // </Router>,
   <HashRouter>
   <Switch>
      <Route path="/" component={factorsSet} />
     </Switch>
   </HashRouter>,
  document.getElementById('container'));