'use strict';

import React from 'react';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connectAll } from 'common/redux-helpers';
import Tools from 'utils/index';
import { ajax } from 'utils/index';
import 'utils/apimap';
import './index.scss';

const linkConfig = {
  // 本地localhost或127.0.0.1环境下的路径设置
  local: {
    userPermissions: '#userPermissions',
    userGroup: '#/userGroup',
    roleManagement: '#/roleManagement'
  },
  onLine: {
    // 自行根据服务端路径定义
    userPermissions: '#userPermissions',
    userGroup: '#/userGroup',
    roleManagement: '#/roleManagement'
  }
};

// const links = Tools.isLocal() ? linkConfig.local : linkConfig.onLine;
const links = linkConfig.onLine;

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navItemArr: []
    };
    this.popstate = this.popstate.bind(this);
  }

  // foldClick() {
  //   this.props.onMenuFolden(false);
  // }

  popstate() {
    if (!location.hash.split('#')[1].split('/')[1]) {
      location.hash = '/userPermissions'
    }
    let hashKey = location.hash
      .split('#')[1]
      .split('/')[1];
    this.setState({
      defaultKey: hashKey
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.activeKey !== nextProps.activeKey) {
      this.setState({ activeKey: nextProps.activeKey }, () => {
        nextProps.activeKey && this.getListTab();
      });
    }
  }

  componentDidMount() {
    const defaultKey = location.hash.split('#')[1].split('/')[1]
      ? location.hash.split('#')[1].split('/')[1]
      : 'userPermissions';
    this.setState({
      defaultKey
    });
    window.addEventListener("popstate", this.popstate, false);
  }

  getListTab() {
    ajax(
      {
        api: 'listMenu',
        params: { parentId: this.state.activeKey }
      },
      res => {
        if (res.data) {
          let navItemArr = res.data.data.children.map((item, index) => {
            return {
              key: item.url,
              icon: 'set',
              text: item.name
            };
          });
          this.setState({ navItemArr });
        }
      }
    );
  }
  // selectKeys(key) {
  //   this.setState({
  //     defaultKey: key
  //   });
  //   location.hash = `/${key}`
  // }
  handleClick = value => {
    this.setState({
      defaultKey: value.key
    });
    location.hash = `/${value.key}`;
  };
  render() {
    const { folden } = this.props;
    const className = classnames({
      'left-menu': true,
      'left-menu-folden': folden
    });
    return (
      <div className={className}>
        <Menu
          onClick={this.handleClick.bind(this)}
          mode="inline"
          // defaultOpenKeys={[this.state.defaultKey]}
          // defaultSelectedKeys={[this.state.defaultKey]}
          selectedKeys={[this.state.defaultKey]}
        >
          {this.state.navItemArr.map((item, index) => {
            return (
              <Menu.Item
                key={item.key}
                className="left-nav-item"
              // icon={item.icon}
              // onClick={this.selectKeys.bind(this,item.key)}
              >
                {item.text}
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    );
  }
}
SideMenu.propTypes = {
  onMenuFolden: PropTypes.func,
  folden: PropTypes.bool
};
export default connectAll(SideMenu);
