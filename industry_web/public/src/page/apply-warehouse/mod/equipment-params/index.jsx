"use strict";

import React from "react";
import {
  Button,
  Icon,
  Feedback,
  Menu,
  Form,
  Select,
  Row,
  Col
} from "antd";
import { ajax } from "utils/index";
import BarChart from "./bar-chart";
import { connectAll } from "common/redux-helpers";
import "./index.scss";
const FormItem = Form.Item;
const Option  = Select.Option;
// const Toast = Feedback.toast;

class Multiparameter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listdataset: "",
      visible: {},
      titleName: "",
      machine: [],
      params: [],
      NavItem: [],
      allParams: [],
      selectEquipmentParams: [],
      selectParams: [],
      timeRange: "",
      currentTime: 0,
      chartsData: [],
      selectedKeys: "0",
      isGet: false
    };
  }
  componentDidMount() {
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    selectTitle = selectTitle ? selectTitle : this.props.workshop;
    this.getFilter({ workShop: selectTitle.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
      this.getFilter({ workShop: nextProps.workshop });
      this.setState({
        sid: "",
        chartsData: [],
        isGet: false,
        selectEquipmentParams: [],
        selectParams: [],
        machine: [],
        params: [],
        NavItem: []
      });
    }
  }

  dataSourceChange(value) {
    let allParams = _.cloneDeep(this.state.allParams);
    this.setState(
      {
        sid: value,
        selectParams: allParams,
        machine: [],
        params: [],
        paramsItem: [],
        chartsData: []
      },
      () => {
        let params = {
          processNo: this.state.sid,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        };
        this.getParamsData("listEqpId", params, "selectEquipmentParams");
        this.getParamsData("listEqpParams", params, "selectParams");
      }
    );
  }

  getParamsData(api, parmas, key) {
    ajax(
      {
        api: api,
        params: parmas
      },
      json => {
        if (json.data.data) {
          this.setState({
            [key]: json.data.data
          });
        }
      }
    );
  }

  getFilter(data) {
    ajax(
      {
        api: "listNodeNo",
        params:data
      },
      json => {
        if (json.data.data) {
          let NavItem = json.data.data;
          this.setState({
            NavItem,
            allParams: json.data.data
          });
        }
      }
    );
  }

  onChangeSelect(value) {
    if (value.length <= 5 && value.indexOf("--最多可以选择5个--") === -1) {
      this.setState({ machine: value });
    }
  }

  onChangeSelectParams(value) {
    if (value.length <= 5 && value.indexOf("--最多可以选择5个--") === -1) {
      this.setState({ params: value });
    }
  }

  disabledStartDate(value) {
    let ret = false;
    let currentTime = this.state.currentTime;
    const { year, month, date, timestamp, week } = value;
    if (timestamp > currentTime - 60 * 60 * 1000) {
      ret = true;
      return ret;
    }
    if (timestamp < currentTime - 60 * 60 * 1000 * 24) {
      ret = true;
      return ret;
    }
  }

  onTimeRangeChange(val, str) {
    this.setState({
      timeRange: str
    });
  }

  getCharts() {
    let newState = _.cloneDeep(this.state);
    let params = {};
    params.nodeNo = newState.sid;
    params.eqpIds = newState.machine.join();
    params.dataKey = newState.params[0];
    params.workShop = JSON.parse(sessionStorage.getItem("selectTitle")).value;
    this.applyChart(params);
    this.setState({
      selectedKeys: "0",
      paramsItem: this.state.params,
      isGet: true
    });
  }

  applyChart(params) {
    // Toast.show({
    //   type: "loading",
    //   duration: 0,
    //   content: "数据加载中",
    //   hasMask: true,
    //   style: { background: "white", borderColor: "white" }
    // });
    ajax(
      {
        api: "list_statistic_equipment_param",
        params: params
      },
      json => {
        if (json.data.data) {
          this.setState(
            {
              chartsData: json.data.data
            },
            () => {
              // Toast.hide();
            }
          );
        }
      }
    );
  }

  fetchDetail(record, index) {
    index = index ? index : "0";
    this.setState(
      {
        selectedKeys: String(index)
      },
      () => {
        let newState = _.cloneDeep(this.state);
        record = record ? record : this.state.params[0];
        let params = {};
        params.nodeNo = newState.sid;
        params.eqpIds = newState.machine.join();
        params.dataKey = record;
        params.workShop = JSON.parse(
          sessionStorage.getItem("selectTitle")
        ).value;
        this.applyChart(params);
      }
    );
  }

  render() {
    const listdataset = this.state.NavItem.map((item, index) => {
      return (
        <Option key={index} value={item.name}>
          {item.description}
        </Option>
      );
    });
    const navItem = this.state.paramsItem
      ? this.state.paramsItem.map((item, index) => {
          return (
            <Menu.Item
              key={index}
              icon=""
              onClick={() => {
                this.fetchDetail(item, index);
              }}
            >
              {item}
            </Menu.Item>
          );
        })
      : null;
    const selectEquipmentParams = this.state.selectEquipmentParams.map(
      (item, index) => {
        return (
          <Option key={index} value={item}>
            {item}
          </Option>
        );
      }
    );
    const selectParams = this.state.selectParams.map((item, index) => {
      return (
        <Option key={item} value={item}>
          {item}
        </Option>
      );
    });
    let isStart =
      !!this.state.machine.length && !!this.state.params.length ? false : true;
    return (
      <div className="multparame-page">
        <div className="content-nav-table">
          <div className="multparame-nav">
            <div className="multparam-left-top">
              <div>应用配置</div>
            </div>
            <Form
              style={{
                height: "100%",
                overflowY: "scroll",
                padding: "20px 10px 0 30px ",
                width: 403
              }}
            >
              <Row style={{marginLeft: 30}}>
                <FormItem label="选择工序">
                  <Select
                    disabled={this.state.NavItem.length === 0}
                    placeholder="请选择"
                    style={{ width: 220 }}
                    onChange={value => {
                      this.dataSourceChange(value);
                    }}
                    value={this.state.sid}
                  >
                    {listdataset}
                  </Select>
                </FormItem>
              </Row>
              <Row style={{marginLeft: 30}}>
                <FormItem label="选择机台">
                  <Select
                    disabled={!this.state.sid}
                    multiple={true}
                    placeholder="请选择"
                    style={{ width: 220 }}
                    value={this.state.machine}
                    onChange={this.onChangeSelect.bind(this)}
                  >
                    <Option
                      style={{ fontSize: 12 }}
                      value="--最多可以选择5个--"
                    >
                      --最多可以选择5个--
                    </Option>
                    {selectEquipmentParams}
                  </Select>
                </FormItem>
              </Row>
              <Row style={{marginLeft: 30}}>
                <FormItem label="选择参数">
                  <Select
                    disabled={!this.state.sid}
                    placeholder="请选择"
                    style={{ width: 220 }}
                    multiple={true}
                    value={this.state.params}
                    onChange={this.onChangeSelectParams.bind(this)}
                  >
                    <Option
                      style={{ fontSize: 12 }}
                      value="--最多可以选择5个--"
                    >
                      --最多可以选择5个--
                    </Option>
                    {selectParams}
                  </Select>
                </FormItem>
              </Row>
              <Button
                disabled={isStart}
                type="primary"
                onClick={() => {
                  this.getCharts();
                }}
                style={{ marginBottom: "20px", marginLeft: 86, marginTop: 15 }}
              >
                确定
              </Button>
            </Form>
          </div>
          <div className="table-main">
            <h2>
              <span>参数曲线</span>
            </h2>
            <div className="market-nav">
              <Menu
                type="line"
                direction="hoz"
                selectedKeys={[this.state.selectedKeys]}
                style={{ border: "none" }}
              >
                {this.state.isGet ? navItem : null}
              </Menu>
            </div>
            {
              <div className="chart-line">
                <BarChart
                  dataSource={this.state.chartsData}
                  title={this.state.titleName}
                />
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default connectAll(Multiparameter);
