'use strict';

import React from 'react';
import ReactDOM from "react-dom";
import { Menu, Icon } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Tools from 'utils/index';
import { ajax } from 'utils/index';
import { connectAll } from 'common/redux-helpers';
const _ = require('lodash');
import './index.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const linkConfig = {
  // 本地localhost或127.0.0.1环境下的路径设置
  local: {
    report: '#report',
    task: '#task',
    factors: '#factors',
    warning: '#warning',
    recommend: '#recommend',
    taskManage: '#taskManage',
    market: '#market',
    algorithm: '#algorithm',
    analysis: '#analysis',
  },
  onLine: {
    // 自行根据服务端路径定义
    report: '#report',
    task: '#task',
    factors: '#factors',
    warning: '#warning',
    recommend: '#recommend',
    taskManage: '#taskManage',
    market: '#market',
    algorithm: '#algorithm',
    analysis: '#analysis',
  },
};

const links = Tools.isLocal() ? linkConfig.local : linkConfig.onLine;

class SideMenus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: '',
      isHasTask: false,
    };
    this.popstate = this.popstate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.defaultkey) {
      this.time = setTimeout(() => {
        this.setState({
          defaultKey: this.returnDefaultKey()
        },() => {
          this.props.actions.setDefaultkey(false);
        });
      },300);
    }
    
    if (this.props.activeKey !== nextProps.activeKey) {
      this.setState({ activeKey: nextProps.activeKey }, () => {
        nextProps.activeKey && this.getListTab();
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.time);
  }

  popstate() {
    let hashKey = location.hash
    .split('#')[1]
    .split('/')[1]
    .split('?')[0];
    this.setState({
      defaultKey: hashKey
    })
  }

  componentDidMount() {
    let hashKey = location.hash
    .split('#')[1]
    .split('/')[1]
    .split('?')[0];
    this.setState({
      defaultKey: hashKey
    })
    window.addEventListener("popstate",this.popstate, false);
  }

  getListTab() {
    const hashKey = location.hash
      .split('#')[1]
      .split('/')[1];
    ajax(
      {
        api: 'listMenu',
        params: { parentId: this.state.activeKey },
      },
      (res) => {
        if (res.data.data) {
          let isHasTask = _.cloneDeep(this.state.isHasTask);
          const algId = null;
          const newListMenu = res.data.data.children.filter((item) => {
            if (item.url === 'task') {
              isHasTask = true;
            }
            localStorage.setItem(hashKey, item.algorithmId);
            return item.url !== 'task';
          });
          window.entiretyInfo.menu = newListMenu;
          this.props.actions.setMenu(newListMenu);
          window.PusbSub.publish();
          if (newListMenu[0].customized && !hashKey) {
            this.setState({
              isHasTask,
              menuList: this.renderSideMenu(newListMenu),
              firstMenuType: newListMenu[0].customized,
            });
          } else if(hashKey) {
            this.setState({
              isHasTask,
              menuList: this.renderSideMenu(newListMenu),
              firstMenuType: newListMenu[0].customized,
            });
          } else{
            this.setState({
              isHasTask,
              menuList: this.renderSideMenu(newListMenu),
              firstMenuType: newListMenu[0].customized,
            });
            if (!location.hash || (location.hash && !hashKey)) {
              location.hash = `/algorithm/${newListMenu[0].algorithmId}`;
            }
          }
        }
      },
      () => {}
    );
  }
  componentWillMount() {
    const that = this;
    window.PusbSub = {
      subscrib(func) {
        that.myfunc = func;
        if (window.entiretyInfo.menu === '') {
          if (that.props.activeKey) {
            that.getListTab();
          }
        } else {
          this.publish();
        }
      },
      unsubscrib() {
        that.myfunc = null;
      },
      publish() {
        that.myfunc &&
          that.myfunc({
            menu: window.entiretyInfo.menu,
          });
      },
    };
  }


  renderSideMenu(data) {
    const customizedMenuArr = [];
    const noCustomizedMenuArr = [];
    data.forEach((item, index) => {
      if (item.customized) {
        customizedMenuArr.push(item);
      } else {
        noCustomizedMenuArr.push(item);
      }
    });
    return { customizedMenuArr, noCustomizedMenuArr };
  }
  returnDefaultKey() {
    let defaultKey;
    const hashKey = location.hash
      .split('#')[1]
      .split('/')[1];
    if (location.hash && hashKey) {
      if (hashKey === 'algorithm') {
        defaultKey = location.hash.split('?')[0].split('/')[2];
      } else {
        defaultKey = hashKey;
      }
    } else {
      defaultKey = this.state.defaultKey;
    }
    this.setState({
      defaultKey
    },() => {
      this.props.actions.setDefaultkey(false);
    })
    return defaultKey;
  }

  selectKey(item) {
    const defaultKey = this.returnDefaultKey();
    this.setState({
      defaultKey: item.url
    })
    location.hash = `/${item.url}/${item.algorithmId}`;
  }
  render() {
    const { folden } = this.props;
    const className = classnames({
      'left-menu': true,
      'left-menu-folden': folden,
    });
    const noCustomizedIconArr = [
      'all',
      'guanxitu',
      'ditu',
      'dabingtu',
      'sandiantu',
      'zhexiantu',
      'zhuzhuangtu',
      'yanshi',
      'shujuji',
      'shujubiao',
    ];
    const customizedIconArr = [
      'fenxiang',
      'tuding',
      'qizi',
      'xiaduiqi',
      'shangduiqi',
      'youduiqi',
      'zuoduiqi',
      'tuceng',
      'yibiaoban',
      'shaixuan',
    ];
    const navItem = this.state.menuList
      ? this.state.menuList.customizedMenuArr.map((item, index) => (
        <Menu.Item
          key={item.url}
          // className="left-nav-item"
          icon={customizedIconArr[index % 10]}
          onClick={this.selectKey.bind(this,item)}
        >
          {item.name}
        </Menu.Item>
        ))
      : null;
    const templateItem = this.state.menuList
      ? this.state.menuList.noCustomizedMenuArr.map((item, index) => (
        <Menu.Item
          key={item.algorithmId}
          // className="left-nav-item"
          icon={noCustomizedIconArr[index % 10]}
          onClick={() => {
            location.hash = `#algorithm/${item.algorithmId}`;
          }}
        >
          {item.name}
        </Menu.Item>
        ))
      : null;
    return (
      <div className={className}>
        {this.state.firstMenuType ? (
          <Menu
            mode="inline"
            className="left-nav side-menu-scroll"
            selectedKeys={[this.state.defaultKey]}
          >
            {navItem}
            {templateItem}
          </Menu>
        ) : (
          <Menu
            mode="inline"
            className="left-nav side-menu-scroll"
            selectedKeys={[this.state.defaultKey]}
          >
            {templateItem}
            {navItem}
          </Menu>
        )}
        {this.state.isHasTask ? (
          <div onClick={this.selectKey.bind(this,{url: "task"})} className={`task-item ${this.state.defaultKey === 'task' ? 'task-item-active' : ''}`}>
            <p />
            <a href={links.task}>我的任务列表</a>
          </div>
        ) : null}
      </div>
    );
  }
}
SideMenus.propTypes = {
  onMenuFolden: PropTypes.func,
  folden: PropTypes.bool,
};
export default connectAll(SideMenus);
