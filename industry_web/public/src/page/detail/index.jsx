'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Layout from 'components/layout/index';
import Mods from './mod/index';
import './index.scss';

ReactDOM.render(
  <div style={{height: '100%'}}>
    <Mods />
  </div>,
  document.getElementById('container'));
