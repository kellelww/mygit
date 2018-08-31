"use strict";

import React from "react";
import {
  Table,
  Checkbox,
  Pagination,
  Icon,
  // Feedback,
  Tooltip,
  Menu,
  // Field,
  Row, 
  Col
} from "antd";
import { ajax } from "utils/index";
import "./index.scss";
import { connectAll } from "common/redux-helpers";

// const Toast = Feedback.toast;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskList: [],
      value: 1,
      total: "",
      array: [],
      selectedKeys: ["0"],
      loading:true
    };
    this.translateTime = this.translateTime.bind(this);
    this.pollingFetch = this.pollingFetch.bind(this);
    this.pollingIdFetch = this.pollingIdFetch.bind(this);
    // this.paginationChange = this.paginationChange.bind(this);
    this.getGroupFetch = this.getGroupFetch.bind(this);
  }

  componentDidMount() {
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    selectTitle = selectTitle ? selectTitle : this.props.workshop;
    this.getGroupFetch({ workShop: selectTitle.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
      this.getGroupFetch({ workShop: nextProps.workshop });
    }
  }

  pollingFetch(value) {
    // Toast.show({
    //   type: "loading",
    //   duration: 0,
    //   content: "数据加载中",
    //   hasMask: true,
    //   style: { background: "white", borderColor: "white" }
    // });
    this.setState({
          loading:true
        })
    ajax(
      {
        api: "biNewList",
        params: {
          pageNum: value,
          pageSize: 10,
          isSort: 0,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value,
          groupId: this.indexGroupId
        }
      },
      json => {
        // Toast.hide();
        this.setState({
            loading:false
          })
        this.setState({
          taskList: json.data.data.list,
          total: json.data.data.total
        });
      },
      () => {
        this.setState({
            loading:false
          })
      }
    );
  }

  translateTime(time) {
    const cstTime = new Date(time);
    const year = cstTime.getFullYear();
    const month =
      cstTime.getMonth() + 1 > 9
        ? cstTime.getMonth() + 1
        : `0${cstTime.getMonth() + 1}`;
    const day =
      cstTime.getDate() > 9 ? cstTime.getDate() : `0${cstTime.getDate()}`;
    const hours =
      cstTime.getHours() > 9 ? cstTime.getHours() : `0${cstTime.getHours()}`;
    const min =
      cstTime.getMinutes() > 9
        ? cstTime.getMinutes()
        : `0${cstTime.getMinutes()}`;
    const sec =
      cstTime.getSeconds() > 9
        ? cstTime.getSeconds()
        : `0${cstTime.getSeconds()}`;
    return `${year}-${month}-${day}  ${hours}:${min}:${sec}`;
  }

  paginationChange(value) {
    this.pollingFetch(value);
  }

  // field = new Field(this);
  indexGroupId = -1;

  getGroupFetch(data) {
    ajax(
      {
        api: "listGroup",
        params:data
      },
      json => {
        if (json.data.code === 200) {
          if (json.data.data.length !== 0) {
            this.indexGroupId = json.data.data[0].id;
            this.defaultGroupId = json.data.data[0].id;
            
            this.setState({
              array: json.data.data
            });

            this.pollingIdFetch(
              json.data.data[0].id,
              JSON.parse(sessionStorage.getItem("selectTitle")).value
            );
          } else {
            this.setState({
              array: json.data.data,
              taskList: [],
              total: 0
            });
          }
        }
      },
      () => {}
    );
  }

  pollingIdFetch(value, workShop) {
    this.indexGroupId = value;
    this.defaultGroupId = value;
    ajax(
      {
        api: "biNewList",
        params: {
          pageNum: this.state.value,
          pageSize: 10,
          isSort: 0,
          workShop: workShop,
          groupId: this.indexGroupId
        }
      },
      json => {
        this.setState({
            loading:false
          })
        json.data.data.list.forEach((item, index) => {
          item["editable"] = false;
        });
        this.setState({
          taskList: json.data.data.list,
          total: json.data.data.total
        });
      },
      () => {}
    );
  }
  render() {
    // const { init, getValue } = this.field;
    const operateRender = (value, record, index) => {
      return (
        <Tooltip
          title="查看"
          placement="top"
          style={{ color: "white", background: "#373D41" }}
        >
            <a
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.open(record.biUrl);
              }}
            >
            <Icon style={{color: '#333'}} type="eye-o" />
            </a>
        </Tooltip>
      );
    };
    const createTime = (value, index, record) => {
      return this.translateTime(record.createdAt);
    };
    const total = +this.state.total;
    return (
      <div id="contain" className="apply-warehouse-mod-report">
        <div className="data-table">
          <div className="left left-content">
            <div className="multparam-left-top">
              <div>报表目录</div>
            </div>
            <Menu
              ref={ref => (this.reportNav = ref)}
              id="apply-warehouse-report"
              className="left-bottom"
              selectedKeys={this.state.selectedKeys}
              onSelect={value => {
                this.setState(
                  {
                    selectedKeys: value.selectedKeys
                  },
                  () => {
                    this.defaultGroupId = this.state.array[value.selectedKeys[0]].id;
                  }
                );
              }}
            >
              {this.state.array.map((item, id) => {
                return (
                  <Menu.Item
                    onClick={() =>
                      this.pollingIdFetch(
                        item.id,
                        JSON.parse(sessionStorage.getItem("selectTitle")).value
                      )
                    }
                    style={{
                      color: "#333333",
                      display: "flex",
                      flexDirection: "row"
                    }}
                    key={id.toString()}
                  >
                    {/* <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        height: "100%",
                        justifyContent: "space-between"
                      }}
                    > */}
                    {item.groupName}
                    {/* </div> */}
                  </Menu.Item>
                );
              })}
            </Menu>
          </div>

          <div
            className="home-page"
            style={{ marginRight: 0, marginTop: 0, marginLeft: 1 ,border: "1px solid #dcdcdc"}}
          >
            <Table
              dataSource={this.state.taskList}
              className="white-table"
              rowKey={record=>record.biName}
              pagination={false}
              loading={this.state.loading}
              style={{
                textAlign: "center",
                padding: 0,
              }}
            >
              {/*<columns title=" " width="47px" />*/}
              <columns
                align="left"
                title={
                  <span style={{ color: "#999999" }}>
                    报表名称
                  </span>
                }
                width="220px"
                dataIndex="biName"
              />
              <columns
                align="right"
                title={<span style={{ color: "#999999" }}>操作</span>}
                render={operateRender}
              />
              {/*<columns title=" " width="55px" />*/}
            </Table>
            <Row justify="end" style={{ marginTop: "10px" }}>
                <Pagination
                  total={total}
                  onChange={
                    this.paginationChange.bind(this)
                  }
                  defaultCurrent={1}
                />
                
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default connectAll(Index);
