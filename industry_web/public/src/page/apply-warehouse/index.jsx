'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, IndexRoute } from 'react-router';
import { BrowserRouter as Router, Route, HashRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'common/store.js';
import './index.scss';
import Foctor from './mod/foctor/index';
import Task from './mod/task/index';
import Process from './mod/Process/index';
import TaskManage from './mod/task-manage/task-manage';
import Multiparameter from './mod/multparameter/index';
import Capacity from './mod/capacity/index';
import Layout from 'components/layout/index';
import overview from './mod/overview';
import Analysis from './mod/analysis/index';
import keyFactorIntroduce from './mod/keyFactorIntroduce/index';
import ProcessIntroduce from './mod/ProcessIntroduce/index';
import multiParameterIntroduce from './mod/multiParameterIntroduce/index';
import EquipmentParams from './mod/equipment-params/index';
import Report from './mod/report/index';



import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
class RouterRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }; //初始化state
  }
  render() {
    // const hashKey = location.hash
    //   .split('#')[1]
    //   .split('/')[1];
    return (
      <LocaleProvider locale={zh_CN}>
        <Provider store={store}>
          <HashRouter history={hashHistory}>
            <Switch>
              <Route path="/taskManage" component={TaskManage} />
              <Layout>
                <Route exact path="/" component={overview} />
                <Route exact path="/overview" component={overview} />
                <Route path="/keyFactor" component={Foctor} />
                <Route path="/task" component={Task} />
                <Route path="/process" component={Process} />
                <Route path="/eqpEff" component={Analysis} />
                <Route path="/keyfactorintroduce" component={keyFactorIntroduce} />
                <Route path="/Processintroduce" component={ProcessIntroduce} />
                <Route path="/multiparameterintroduce" component={multiParameterIntroduce} />
                <Route exact path="/multiParameter" component={Multiparameter} />
                <Route exact path="/productionEff" component={Capacity} />
                <Route exact path="/eqpParameter" component={EquipmentParams} />
                <Route exact path="/dataAnalysis" component={Report} />
              </Layout>
            </Switch>
          </HashRouter>
        </Provider>
      </LocaleProvider>

    )
  }

}

ReactDOM.render(
  <RouterRender />,
  document.getElementById('container'));