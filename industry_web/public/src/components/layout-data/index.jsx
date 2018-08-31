'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'components/head/index';
import SideMenu from 'components/side-menu-data/index';
import classnames from 'classnames';
import { connectAll } from 'common/redux-helpers';
import './index.scss';
import { ajax } from 'utils/index';

let pathName = location.pathname.split('/');
pathName = pathName[pathName.length - 1].split('.')[0];
class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folden: false,
      titleTab: [],
      titleKey: '',
    };
    this.onMenuFolden = this.onMenuFolden.bind(this);
  }
  onMenuFolden(flag) {
    this.setState({
      folden: flag,
    });
  }

  componentWillMount() {
    this.getListTab();
  }

  getListTab() {
    ajax(
      {
        api: 'listTopTab',
      },
      (json) => {
        if (json.data.data) {
          let titleKey = null;
          json.data.data.children.forEach((item, index) => {
            if (item.url === pathName) {
              titleKey = String(item.id);
            }
          });
          this.setState({
            titleKey,
            titleTab: json.data.data.children,
          });
        }
      }
    );
  }

  render() {
    const { folden } = this.state;
    const className = classnames({
      'right-content': true,
      'right-content-full': !folden,
    });
   
    return (
      <div className="main container">
        <Head titleTab={this.state.titleTab} activeKey={this.state.titleKey} />
        <div className="main-content">
          <SideMenu activeKey={this.state.titleKey} onMenuFolden={this.onMenuFolden} folden={this.state.folden} />
          <div className={className}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.element]),
};
export default connectAll(Layout);
