"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { ajax } from "utils/index";
// import { Button, Switch, Icon, Nav, Balloon } from "@alife/next";
import { Menu, Icon, Tooltip, message } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { connectAll } from "common/redux-helpers";
import Head from "components/head/index.js";
import "./index.scss";

class DataWareHouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateList: "",
      itemKey: "",
      selectedKey: this.props.match.params.data,
      titleTab: [],
      titleKey: "",
      navItemArr: [],
      //大屏切换编码
      status: ""
    };
    this.addressShow = this.addressShow.bind(this);
  }

  getScreenList(data) {
    ajax(
      {
        api: "screenList",
        params: data
      },
      json => {
        if (json.data.data && String(json.data.data)) {
          this.setState({
            templateList: json.data.data
          });
          this.returnDefaultKey(json);
        } else {
          // message.destroy();报错
          // message.warning(json.data.message);
          let itemKey = this.state.titleKey ? "anlagenzustand.html" : null;
          this.setState({
            itemKey,
            selectedKey: "equipment",
            status: ""
          });
        }
      },
      (err) => { }
    );
  }

  getEqlData(data) {
    data = data
      ? data
      : { workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value };
    ajax(
      {
        api: "equipments",
        params: data
      },
      res => {
        localStorage.setItem("equipmentsList", JSON.stringify(res.data.data));
      }
    );
  }

  componentWillMount() {
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    selectTitle = selectTitle ? selectTitle : this.props.workshop;
    this.getListTab(selectTitle).then(() => {
      this.getScreenList();
    });
  }
  componentDidMount() {
    // let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    // this.setState({
    //   status: "&workShopId=" + selectTitle.value
    // })
  }
  componentWillReceiveProps(nextProps) {
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    if (this.state.itemKey === "anlagenzustand.html") {
      // this.setState({
      //   status: ""
      // })
    } else {
      this.setState({
        status: "&workShopId=" + selectTitle.value
      })
    }
    if (nextProps.workshop !== this.props.workshop) {
      let iframe = document.getElementsByTagName("iframe")[0];
      try {
        iframe.contentWindow.location.reload(true);
      }
      catch (err) {
      }
      this.getListTab({ workShop: nextProps.workshop }).then(() => {
        this.getScreenList({ workShop: nextProps.workshop });
      });
    }
  }
  getListTab(data) {
    return new Promise((resolve, reject) => {
      ajax(
        {
          api: "listTopTab",
          params: data
        },
        json => {
          if (json.data.data) {
            let titleKey = null;
            json.data.data.children.forEach((item, index) => {
              if (item.name === "指挥舱") {
                titleKey = String(item.id);
              }
            });
            this.setState(
              {
                titleKey,
                titleTab: json.data.data.children
              },
              () => {
                titleKey && this.getListSideMenu();
                resolve();
              }
            );
          }
        }
      );
    });
  }

  getListSideMenu() {
    ajax(
      {
        api: "listMenu",
        params: { parentId: this.state.titleKey }
      },
      res => {
        if (res.data.data) {
          let navItemArr = [];
          navItemArr =
            res.data.data.children &&
            res.data.data.children.map((item, index) => {
              return {
                key: item.url,
                icon: "shujubiao",
                text: item.name
              };
            });
          navItemArr = navItemArr ? navItemArr : [];
          this.setState({ navItemArr });
        }
      }
    );
  }

  returnDefaultKey(json) {
    const userName = localStorage.userName;
    if (userName !== "dunan.industry") {
      if (location.hash && location.hash.slice(1).indexOf("equipment") !== -1) {
        this.setState({
          itemKey: "anlagenzustand.html",
          selectedKey: "equipment",
          status: ""
        });
      } else if (this.props.match.params.data) {
        this.setState(
          {
            selectedKey: this.props.match.params.data
          },
          () => {
            this.addressShow(json.data.data[this.state.selectedKey].id);
          }
        );
      } else {
        this.setState(
          {
            selectedKey: "0"
          },
          () => {
            this.addressShow(json.data.data[this.state.selectedKey].id);
          }
        );
      }
    } else {
      if (!location.hash) {
        this.itemClick(json.data.data[0].id, 0);
      } else {
        this.addressShow(json.data.data[this.state.selectedKey].id);
      }
    }
  }
  addressShow(id) {
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    ajax(
      {
        api: "templateAdress",
        params: { id: id }
      },
      json => {
        this.setState({
          itemKey: json.data.data,
          status: "&workShopId=" + selectTitle.value
        });
      },
      () => { }
    );
  }
  itemClick(id, index) {
    // let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    // this.setState({
    //   status: "&workShopId=" + selectTitle.value
    // })
    this.addressShow(id);
    location.hash = index;
    this.setState({
      selectedKey: String(index)
    });
  }
  equipmentShow() {
    this.setState({
      status: ""
    })
    location.hash = "equipment";
    this.setState({
      itemKey: "anlagenzustand.html",
      selectedKey: "equipment",
    });
  }
  fullScreenShow(id, index) {
    if (id === this.state.selectedKey) {
      location.href = `${this.state.itemKey}`;
    } else {
      if (id === "equipment") {
        this.equipmentShow();
        location.href = "anlagenzustand.html";
      } else {
        let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
        ajax(
          {
            api: "templateAdress",
            params: { id: id }
          },
          json => {
            this.setState(
              {
                itemKey: json.data.data,
                selectedKey: String(index)
              },
              () => {
                location.hash = this.state.selectedKey;
                location.href = this.state.itemKey + "&workShopId=" + selectTitle.value;
              }
            );
          },
          () => { }
        );
      }
    }
  }
  // zuidahua
  render() {
    const templateView =
      this.state.templateList && String(this.state.templateList)
        ? this.state.templateList.map((item, index) => {
          return (
            <Menu.Item
              key={index}
              className="left-nav-item"
              icon="shujubiao"
              onClick={() => {
                this.itemClick(item.id, index);
              }}
            >
              {item.screenName}
              {" "}

              <Tooltip
                title="全屏展示"
                placement="top"
                style={{ color: "white", background: "#373D41" }}
              >
                <Icon
                  type="arrows-alt"
                  onClick={() => {
                    this.fullScreenShow(item.id, index);
                  }}
                />
              </Tooltip>
            </Menu.Item>
          );
        })
        : null;
    const userName = localStorage.userName;
    let templateList = Object.assign([], this.state.templateList);
    templateList = templateList ? templateList : [];
    let isShowBigUrl = !this.state.navItemArr.length && !templateList.length ? false : true;
    return (
      <div className="registered-page">
        <Head
          titleName="指挥舱"
          titleTab={this.state.titleTab}
          activeKey={this.state.titleKey}
        />
        <div className="container">
          <div className="left-menu">
            <Menu
              mode="inline"
              className="left-nav"
              selectedKeys={[this.state.selectedKey]}
            >
              {templateView}
              {this.state.navItemArr.map((item, index) => {
                return (
                  <Menu.Item
                    key={item.key}
                    className="left-nav-item"
                    icon={item.icon}
                    onClick={() => {
                      this.equipmentShow();
                    }}
                  >
                    {item.text}
                    <Tooltip
                      placement="top"
                      title="全屏展示"
                      style={{ color: "white", background: "#373D41" }}
                    >
                      <Icon
                        type="arrows-alt"
                        onClick={() => {
                          this.fullScreenShow(item.key, "");
                        }}
                      />
                    </Tooltip>
                  </Menu.Item>
                );
              })}
            </Menu>
          </div>
          <div className="content-right">
            <div className="content-html">
              <iframe
                src={isShowBigUrl ? this.state.itemKey + this.state.status : null}
                style={{ border: 'none' }}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connectAll(DataWareHouse);
