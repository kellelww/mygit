import React from 'react';
import ReactDOM from 'react-dom';
import Layout from 'components/layout-management/index';
import userPermissions from './mod/user-permissions/index';
import AddBusinessTable from './mod/add-businesstable/index';
import Report from './mod/report/index.jsx';
import Factors from './mod/factors/factors.jsx';
import WarningSet from './mod/warning-set/index.jsx';
import Control from './mod/control-warehouse-set/index.jsx';
import { store } from 'common/store.js';
import { ajax } from 'utils/index';
import 'utils/apimap';
import { hashHistory, IndexRoute } from 'react-router';
import { BrowserRouter as Router, Route, HashRouter, Switch} from 'react-router-dom';

import { Provider } from 'react-redux';
import '../../styles/common.scss';
let pathName = location.pathname.split('/');
pathName = pathName[pathName.length - 1].split('.')[0];
let path = location.hash;
path = path.substring(path.indexOf('/') + 1, path.indexOf('?'));
class RouterRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.getListTab();
  }

  getListTab() {
    ajax(
      {
        api: 'listTopTab'
      },
      json => {
        if (json.data) {
          let titleKey = null;
          // let hashKey = location.hash.split('#')[1].split('?')[0].split('/')[1];
          json.data.data.children.forEach((item, index) => {
            if (item.url === pathName) {
              titleKey = String(item.id);
            }
          });
          ajax(
            {
              api: 'listMenu',
              params: { parentId: titleKey }
            },
            res => {
              if (res.data) {
                if (!path) {
                  location.hash = res.data.data
                    ? res.data.data.children[0].url
                    : '';
                }
              }
            }
          );
        }
      }
    );
  }
  render() {
    return (
      <Provider store={store}>
        <HashRouter>
        <Switch>
          <Layout>
            <Route path="/userPermissions" component={userPermissions} />
            <Route path="/report" component={Report} />
            <Route path="/factors" component={Factors} />
            <Route path="/warningSet" component={WarningSet} />
            <Route path="/control-warehouse-set" component={Control} />
            <Route path="/addBusinessTable/:data" component={AddBusinessTable} />
          </Layout>
          </Switch>
        </HashRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<RouterRender />, document.getElementById('container'));
