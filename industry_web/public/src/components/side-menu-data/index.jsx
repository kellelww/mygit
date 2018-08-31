'use strict';

import React from 'react';
import { Icon, Menu, Tooltip } from 'antd';
import classnames from 'classnames';
import Tools from 'utils/index';
import './index.scss';
import { ajax } from 'utils/index';
import { connectAll } from 'common/redux-helpers';

import 'utils/apimap';
import { Link, hashHistory } from 'react-router';

const iconArr = ["zhuzhuangtu", "yujing", "shaixuan","yanshi"];
class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navItemArr: []
    }
  }
  // foldClick() {
  //   this.props.onMenuFolden(false);
  // }

  componentWillReceiveProps(nextProps) {
    if (this.props.activeKey !== nextProps.activeKey) {
      this.setState({ activeKey: nextProps.activeKey }, () => {
        nextProps.activeKey && this.getListTab();
      })
    }
  }

  componentDidMount() {
    const defaultKey = location.hash.split('?')[0].split('/')[1] ? location.hash.split('?')[0].split('/')[1] : 'overview';
    this.setState({
      defaultKey
    })    
  }

  getListTab() {
    ajax({
      api: 'listMenu',
      params: { parentId: this.state.activeKey }
    }, (res) => {
      if(res.data) {
        let navItemArr = res.data.data.children.map((item,index) => {
          return {
            key: item.url,
            icon: iconArr[index],
            text: item.name
          }
        })
        this.setState({navItemArr});
      }
    })
  }

  selectKeys(key) {
    this.setState({
      defaultKey: key
    });
    location.hash = `/${key}`;
  }

  render() {
    const { folden } = this.props;
    const className = classnames({
      'left-menu': true,
      'left-menu-folden': folden
    });
    const navItem = this.state.navItemArr.map((item, index) => {
      return  <Menu.Item
      key={item.key}
      // className="left-nav-item"
      icon={item.icon}
      onClick={this.selectKeys.bind(this,item.key)}
    >{item.text}</Menu.Item>
    })
    return (
      <div className={className}>
        <Menu
          // theme="dark"
          mode="inline"
          className="left-nav"
          defaultOpenKeys={['sub1']}
          selectedKeys={[this.state.defaultKey]}
        >
          {navItem}
        </Menu>


      </div>
    );
  }
}
// SideMenu.propTypes = {
//   onMenuFolden: React.PropTypes.func,
//   folden: React.PropTypes.bool
// };
export default connectAll(SideMenu);
