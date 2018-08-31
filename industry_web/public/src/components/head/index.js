"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Menu, Icon ,Dropdown ,message} from 'antd';
import { connectAll } from "common/redux-helpers";
import { ajax } from "utils/index";
import "./index.scss";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class Head extends React.Component {
  state = {
    current: 'mail',
    menuList: [],
    titleSelect: "",
    isChangeTitle: true,
    activeKey:""
  }
  componentWillMount() {
    const titleObj = JSON.parse(sessionStorage.getItem("selectTitle"));
    window.addEventListener(
      "click",
      () => {
        this.setState({
          dataSource: [],
          isShowItem: false
        });
      },
      false
    );
    titleObj &&
      this.setState({
        titleSelect: titleObj.label + "/" + titleObj.value,
        isChangeTitle: false
      });
    this.getworkShopAuth();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ activeKey: nextProps.activeKey });
  }
  getworkShopAuth() {
    ajax(
      {
        api: "getworkShopAuth"
      },
      json => {
        this.setState(
          {
            titleSelect: this.state.isChangeTitle
              ? json.data.data[0].label + "/" + json.data.data[0].children[0].label
              : this.state.titleSelect,
            menuList: json.data.data,
            selectTitle: {label: json.data.data[0].label,value: json.data.data[0].children[0].value}

          },
          () => {
            this.state.isChangeTitle &&
              sessionStorage.setItem(
                "selectTitle",
                JSON.stringify({
                  label: json.data.data[0].label,
                  value: json.data.data[0].children[0].value
                })
              );
          }
        );
      }
    );
  }
  checkoutItem(value) {
    this.setState({
      activeKey: value+""
    });
  }
  writeOff() {
    ajax(
      {
        api: "loginOut",
        data: {}
      },
      res => {
        message.success(`注销成功`);
        setTimeout(() => {
          location.href = "login.html";
        }, 1000);
      }
    );
  }
  onClickSelect(label, value) {
    this.setState(
      {
        titleSelect: label + "/" + value,
        isShowItem: false,
        iconUp: false
      },
      () => {
        this.props.actions.setWorkshop(value);
        sessionStorage.setItem(
          "selectTitle",
          JSON.stringify({
            label,
            value
          })
        );
      }
    );
  }
  render() {
    // triggerSubMenuAction = "click"
    const uersName = localStorage.userName || null;
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    selectTitle = selectTitle ? selectTitle : this.state.selectTitle;
    const menu = (
         <Menu>
          <Menu.Item style={{textAlign:"center"}}>{uersName}</Menu.Item>
          <Menu.Item onClick={() => {
                  this.writeOff();
                }}>
                <div className="my-next-menu-item-child">
                  <Icon type="logout" style={{ marginRight: "10px" }} />退出
                </div>
          </Menu.Item>
        </Menu>
    );
    return (
      <div className="login-page-head">
        <div className="login-page-header">
        <Menu
          mode="horizontal"
          triggerSubMenuAction = "click"
          selectedKeys={[this.state.activeKey]}
        >
          <Menu.Item style={{ marginRight: "80px" }}>
            <a href="control-warehouse.html">
                <i className="iconfont little-logo" />
                <span className="header-text">天合光能</span>
            </a>
          </Menu.Item>
          <SubMenu 
            title={<span>{this.state.titleSelect}<Icon type="down" /></span>}
            >
            {this.state.menuList.map((item, index) => {
                  let label = item.label;
                  return (
                    <SubMenu
                      title={label}
                      key={index}
                      className={label === selectTitle.label ? "ant-menu-submenu-selected ant-menu-submenu-active" : ""}
                    >
                      {item.children &&
                        item.children.map((ele, i) => {
                          return (
                            <Menu.Item
                              onClick={this.onClickSelect.bind(
                                this,
                                label,
                                ele.value
                              )}
                              key={ele.label}
                              className={ele.value === selectTitle.value ? "ant-menu-item-active" : ""}
                            >
                              <div className="my-next-menu-item-child">
                                {ele.label}
                              </div>
                            </Menu.Item>
                          );
                        })}
                    </SubMenu>
                  );
                })}
          </SubMenu>
          {this.props.titleTab.map((item, index) => {
              return (
                <Menu.Item
                  onClick={this.checkoutItem.bind(this, item.id)}
                  key={item.id}
                >
                  <a href={`${item.url}.html`}>{item.name}</a>
                </Menu.Item>
              );
          })}
          <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
            <div className="login-info-show">
              <div className="user-img"></div>
            </div>
          </Dropdown>
        </Menu>
         </div>
      </div>
    );
  }
}

export default connectAll(Head);
