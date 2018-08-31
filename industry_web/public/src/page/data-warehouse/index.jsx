'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Layout from 'components/layout-data/index';
import { hashHistory, IndexRoute } from 'react-router';
import { BrowserRouter as Router, Route,Switch ,HashRouter} from 'react-router-dom';

import { Provider } from 'react-redux';
import { store } from 'common/store.js';
import './index.scss';
import '../../styles/common.scss';
import OriginData from './data-origin';
import BusinessData from './data-business';
import ModelData from './data-model';
import OverView from './data-overview'
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
class RouterRender extends React.Component {
  constructor(props){
    super(props);
    this.state = {}; //初始化state
  }
  render(){
    return(
      <LocaleProvider locale={zh_CN}>
        <Provider store={store}>
          <HashRouter>
            <Switch>
                <Layout>
                  <Route path="/" exact component={OverView}></Route>
                  <Route path="/model" component={ModelData}/>
                  <Route path="/business" component={BusinessData}/>
                  <Route path="/overview" component={OverView}/>
                  <Route path="/origin" component={OriginData}/> 
                </Layout>
            </Switch>
          </HashRouter>
        </Provider>
      </LocaleProvider>
    )
  }

}

ReactDOM.render(
  <RouterRender/>,
  document.getElementById('container'));