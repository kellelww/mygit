"use strict";

import React from "react";
import {
  Button,
  Grid,
  Checkbox,
  Icon,
  Feedback,
  Menu,
  Step,
  Form,
  Field,
  DatePicker,
  Select,
  Input,
  Balloon,
  Table,
  Tag,
  message,
  Row, 
  Col
} from "antd";
import moment from 'moment';
import 'moment/locale/zh-cn';
import { ajax } from "utils/index";
import TargetRangeSelect from "./target-select.jsx";
import BarChart from "./bar-chart";
import { connectAll } from "common/redux-helpers";
import "./index.scss";

const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class Multiparameter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listdataset: "",
      visible: {},
      detailData: "",
      titleName: "",
      isError: {},
      selectedKeys: "0"
    };
  }
  componentDidMount() {
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    selectTitle = selectTitle ? selectTitle : this.props.workshop;
    this.getReset({ workShop: selectTitle.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
      this.getReset({ workShop: nextProps.workshop });
    }
  }

  dataSourceChange(value) {
    this.setState({
      sid: value
    },() => {
    this.getParameter();
    });
    this.getFilter(value);
  }
  getFilter(id) {
    ajax(
      {
        api: "getfilter",
        params: {
          sid: id,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        this.setState({
          filter: json.data.data.filters || "",
          selectedFactors: this.fromArrToObject(json.data.data.filters) || "",
          timeValue: json.data.data.time || ""
        });
      },
      () => {}
    );
  }
  fromArrToObject(arr) {
    const arrObject = {};
    arr.forEach((item, index) => {
      arrObject[item.id] = item;
    });
    return arrObject;
  }
  switchFactorComponent(item, index) {
    switch (item.type) {
      case 0:
        return this.renderSelect(item, index, "selectedFactors");
        break;
      case 1:
        return this.renderInput(item, index, "selectedFactors");
        break;
    }
  }
  switchParameComponent(item, index) {
    switch (item.type) {
      case 0:
        return this.renderSelect(item, index, "selectedParame");
        break;
      case 1:
        return this.renderInput(item, index, "selectedParame");
        break;
    }
  }
  showTargetDialog(option) {
    this.setState({
      visible: Object.assign({}, this.state.visible, { [option.id]: true })
    });
  }
  closeTargetSelect(option, visible) {
    this.setState({
      visible: Object.assign({}, this.state.visible, { [option.id]: visible })
    });
  }
  getSelectedValue(value, option, key) {
    this.setState({
      visible: false
    });
    const inputState = Object.assign({}, option, { values: value });
    this.setState({
      [key]: Object.assign({}, this.state[key], { [option.id]: inputState })
    });
  }
  renderSelect(option, index, key) {
    const selectList =
      JSON.stringify(this.state[key]) !== "{}" && this.state[key][option.id]
        ? this.state[key][option.id].values.map((item, index) => {
            return (
              <Option key={index} value={item}>
                {item}
              </Option>
            );
          })
        : null;
    const tagList =
      this.state[key] && this.state[key][option.id]
        ? this.state[key][option.id].values.map((item, index) => {
            return (
              <Tag key={index} shape="readonly">
                {item}
              </Tag>
            );
          })
        : null;
    const formItemLayout = {
        labelCol: {
            span: 6
        },
        wrapperCol: {
            span: 18
        }
    };

    return (
      <FormItem label={`${option.name}`} {...formItemLayout}>
        <div className="next-row">
          <Row>
            <Col>
              <div className="selected-tag-list">{tagList}</div>
            </Col>
            <Col style={{marginTop:"4px",marginLeft:"5px"}}>
              <Icon
                type="form"
                style={{ position: "relative", top: "-5px", cursor: "pointer" }}
                onClick={() => this.showTargetDialog(option)}
              />
            </Col>
          </Row>
          <TargetRangeSelect
            visible={this.state.visible[option.id]}
            closeTargetSelect={visible => {
              this.closeTargetSelect(option, visible);
            }}
            title={option.name}
            targetRange={option.values}
            getValue={value => this.getSelectedValue(value, option, key)}
            selectedTarget={
              this.state[key] ? this.state[key][option.id].values : []
            }
          />
        </div>
      </FormItem>
    );
  }
  renderInput(option, index, key) {
    const inputValue =
      JSON.stringify(this.state[key]) !== "{}" && this.state[key][option.id]
        ? this.state[key][option.id].range
        : { min: "", max: "" };
    const formItemLayout = {
        labelCol: {
            span: 9
        },
        wrapperCol: {
            span: 15
        }
    };
    return (
      <FormItem style={{marginLeft:10}} label={`${option.name}`} {...formItemLayout}>
        <Row>
            <Input
              value={inputValue["min"]}
              onChange={e => {
                this.onMinInputChange(option, e.target.value, key);
              }}
              style={{ width: "107px" }}
              className={`${
                this.state.isError[option.id]
                  ? this.state.isError[option.id].min ? "is-error" : ""
                  : ""
              }`}
              onBlur={e => {
                this.checkoutMinInput(e.target.value, option, key);
              }}
            />
          <span style={{marginRight:6,marginLeft:6}}>-</span>
            <Input
              value={inputValue["max"]}
              onChange={e => {
                this.onMaxInputChange(option, e.target.value, key);
              }}
              style={{ width: "107px" }}
              className={`${
                this.state.isError[option.id]
                  ? this.state.isError[option.id].max ? "is-error" : ""
                  : ""
              }`}
              onBlur={e => {
                this.checkoutMaxInput(e.target.value, option, key);
              }}
            />
        </Row>
      </FormItem>
    );
  }
  isNumber(value) {
    let bol;
    if (!isNaN(value)) {
      bol = true;
    } else if (value === "-") {
      bol = true;
    }
    return bol;
  }
  checkoutMinInput(value, option, key) {
    const isRight = Boolean(this.returnDefaultParameValue(value, option.id)[0]);
    const defaultValue = this.returnDefaultParameValue(value, option.id)[1];
    this.setState({
      isError: Object.assign({}, this.state.isError, {
        [option.id]: Object.assign({}, this.state.isError[option.id], {
          min: !isRight
        })
      })
    });
    if (!isRight) {
      const inputState = Object.assign({}, option, {
        range: {
          min: defaultValue.min,
          max: this.state[key][option.id].range.max
        }
      });
      this.setState({
        [key]: Object.assign({}, this.state[key], { [option.id]: inputState })
      });
    }
  }
  checkoutMaxInput(value, option, key) {
    const isRight = Boolean(this.returnDefaultParameValue(value, option.id)[0]);
    const defaultValue = this.returnDefaultParameValue(value, option.id)[1];
    this.setState({
      isError: Object.assign({}, this.state.isError, {
        [option.id]: Object.assign({}, this.state.isError[option.id], {
          max: !isRight
        })
      })
    });
    if (!isRight) {
      const inputState = Object.assign({}, option, {
        range: {
          min: this.state[key][option.id].range.min,
          max: defaultValue.max
        }
      });
      this.setState({
        [key]: Object.assign({}, this.state[key], { [option.id]: inputState })
      });
    }
  }
  onMinInputChange(option, value, key) {
    if (this.isNumber(value)) {
      const inputState = Object.assign({}, option, {
        range: { min: value, max: this.state[key][option.id].range.max }
      });
      this.setState({
        [key]: Object.assign({}, this.state[key], { [option.id]: inputState })
      });
    }
  }
  onMaxInputChange(option, value, key) {
    if (this.isNumber(value)) {
      const inputState = Object.assign({}, option, {
        range: { min: this.state[key][option.id].range.min, max: value }
      });
      this.setState({
        [key]: Object.assign({}, this.state[key], { [option.id]: inputState })
      });
    }
  }
  returnDefaultParameValue(value, id) {
    let bool;
    let defaultParameValue;
    if (value === "-") {
      bool = true;
    } else {
      value = Number(value);
      this.state.parameterFilter.forEach((item, index) => {
        if (item.id === id) {
          if (
            Number(item.range["min"]) <= value &&
            Number(item.range["max"]) >= value
          ) {
            bool = true;
          }
          defaultParameValue = item.range;
        }
      });
    }
    return [bool, defaultParameValue];
  }
  returnSelected(filterName) {
    let filterSelected = [];
    for (const key in this.state[filterName]) {
      filterSelected.push(this.state[filterName][key]);
    }
    return filterSelected;
  }
  getParameter() {
    const parame = {
      sid: this.state.sid,
      time: this.state.timeValue,
      filters: this.returnSelected("selectedFactors"),
      workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
    };
    ajax(
      {
        api: "getParameter",
        data: parame,
        dataType: "json",
        method: "post",
        contentType: "application/json"
      },
      res => {
        this.setState({
          parameterFilter: res.data.data.params,
          selectedParame: this.fromArrToObject(res.data.data.params)
        });
      },
      err => {
        // Toast.error(err);
      }
    );
  }
  fetchDetail(id, name, index) {
    this.getAnalysis(id, name);
    this.setState({
      titleName: name,
      selectedKeys: String(index)
    });
  }
  getTargetList(id) {
    ajax(
      {
        api: "getListtarget",
        params: {
          sid: id,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        this.setState({
          targetList: json.data.data,
          titleName: json.data.data[0].name
        });
      }
    );
  }
//时间区间
  disabledDate(calendarDate) {
    if(this.state.timeValue.min) {
      let ret = false;
      const max = this.state.timeValue.max;
      const min = this.state.timeValue.min;
      const minTime = new Date(max).getTime();
      const maxTime = new Date(min).getTime();
      let year = calendarDate.year();
      let month = calendarDate.month();
      let date = calendarDate.date();
      const now = moment();
      const nowWeek = now.isoWeekday();
      const theDate = moment(`${year}-${month + 1}-${date}`, "YYYY-M-D");
      if (!theDate) {
        return ret;
      }
  
      if (theDate > minTime) {
        ret = true;
      }
  
      if (theDate < maxTime) {
        ret = true;
      }
      return ret;
    }
  }
  getAnalysis(target) {
    if (!target) {
      this.getTargetList(this.state.sid);
      this.setState({
        selectedKeys: "0"
      });
    }
    const parame = {
      sid: this.state.sid,
      time: this.state.timeValue,
      target,
      filters: this.returnSelected("selectedFactors"),
      params: this.returnSelected("selectedParame"),
      workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
    };
    ajax(
      {
        api: "getAnalysis",
        data: parame,
        dataType: "json",
        method: "post",
        contentType: "application/json"
      },
      res => {
        this.setState({
          detailData: res.data.data
        });
      },
      err => {
        Toast.error(err);
      }
    );
  }
  timeValueChange(a, b) {
    if(b[0] && b[1]){
      const timeObj = { min: `${b[0]} 00:00:00`, max: `${b[1]} 00:00:00` };
      this.setState({
        timeValue: timeObj
      });
    }else{
      this.setState({
        timeValue: []
      });
    }
    
  }
  getReset(data) {
    ajax(
      {
        api: "listdataset",
        params:data
      },
      json => {
        if (json.data.data && json.data.data.length > 0) {
          this.resetDataSource(json.data.data[0].id);
          this.setState({
            listdataset: json.data.data,
            selectedKeys: "0"
          });
        }
      },
      () => {}
    );
  }
  resetDataSource(value) {
    this.setState({
      sid: value
    });
    this.resetFilter(value);
  }
  resetFilter(id) {
    ajax(
      {
        api: "getfilter",
        params: {
          sid: id,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        if (json.data.data && json.data.data.time && json.data.data.filters) {
          this.resetParameter(
            id,
            json.data.data.time,
            this.fromArrToObject(json.data.data.filters)
          );
          this.setState({
            filter: json.data.data.filters,
            selectedFactors: this.fromArrToObject(json.data.data.filters),
            timeValue: json.data.data.time
          });
        } else {
          this.setState({
            filter: [],
            selectedFactors: {},
            timeValue: [],
            parameterFilter: [],
            selectedParame: {}
          });
        }
      },
      () => {}
    );
  }
  resetParameter(id, timeValue, selectedFactors) {
    let filterSelected = [];
    for (const key in selectedFactors) {
      filterSelected.push(selectedFactors[key]);
    }
    const parame = {
      sid: id,
      time: timeValue,
      filters: filterSelected,
      workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
    };
    ajax(
      {
        api: "getParameter",
        data:parame,
        dataType: "json",
        method: "post",
        contentType: "application/json"
      },
      res => {
        this.setState({
          parameterFilter: res.data.data.params,
          selectedParame: this.fromArrToObject(res.data.data.params)
        });
      },
      err => {
        Toast.error(err);
      }
    );
    this.setState({
      detailData: "",
      targetList: ""
    });
  }

  render() {
    const listdataset = this.state.listdataset
      ? this.state.listdataset.map((item, index) => {
          return (
            <Option key={index} value={item.id}>
              {item.name}
            </Option>
          );
        })
      : null;
    const navItem = this.state.targetList
      ? this.state.targetList.map((item, index) => {
          return (
            <Menu.Item
              key={index}
              onClick={() => {
                this.fetchDetail(item.id, item.name, index);
              }}
            >
              {item.name}
            </Menu.Item>
          );
        })
      : null;
    const componentLayout = this.state.filter
      ? this.state.filter.map((item, index) => {
          return (
            <Row key={index}>{this.switchFactorComponent(item, index)}</Row>
          );
        })
      : null;
    const parameterFilter = this.state.parameterFilter
      ? this.state.parameterFilter.map((item, index) => {
          return (
            <Row key={index}>{this.switchParameComponent(item, index)}</Row>
          );
        })
      : null;
      const formItemLayout = {
        labelCol: {
            span: 6
        },
        wrapperCol: {
            span: 18
        }
    };
    return (
      <div className="multparame-page">
        <div className="content-nav-table">
          <div className="multparame-navs">
            <div className="multparam-left-top" style={{color:'#999999'}}>
              应用配置
            </div>
            <Form
              style={{
                height: "100%",
                overflowY: "scroll",
                overflowX: "hidden",
                padding: "20px 20px 250px 0px"
              }}
            >
              <Row>
                <FormItem label="数据源" {...formItemLayout}>
                  <Select
                    placeholder="请选择数据源"
                    onChange={value => {
                      this.dataSourceChange(value);
                    }}
                    value={this.state.sid}
                  >
                    {listdataset}
                  </Select>
                </FormItem>
              </Row>
              <Row>
                <FormItem label="时间区间" {...formItemLayout}>
                  <RangePicker
                    disabledDate={this.disabledDate.bind(this)}
                    value={
                      this.state.timeValue != undefined && this.state.timeValue.length != 0
                        ? [
                            moment(this.state.timeValue["min"]),
                            moment(this.state.timeValue["max"])
                          ]
                        : []
                    }
                    onChange={(a, b) => {
                      this.timeValueChange(a, b);
                    }}
                  />
                </FormItem>
              </Row>
              {componentLayout}
              {this.state.filter && (
                <Row type="flex" justify="center">
                  <Button
                    onClick={this.getParameter.bind(this)}
                    style={{ marginBottom: "20px",marginLeft:-74 }}
                  >
                    确认分析范围
                  </Button>
                </Row>
              )}
              <hr style={{ width: 402,marginBottom: "25px", borderColor: "#CCCCCC" }} />

              {parameterFilter}
            </Form>
            <div className="action-button">
              <Row justify="center">
                <Col span={12}>
                  <Button
                    onClick={this.getReset.bind(this, {
                      workShop: JSON.parse(
                        sessionStorage.getItem("selectTitle")
                      ).value
                    })}
                  >
                    一键重置
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.getAnalysis();
                    }}
                  >
                    开始运行
                  </Button>
                </Col>
              </Row>
            </div>
          </div>
          <div className="table-main">
            <div className="my-h2">
              <span>产品质量分布</span>
            </div>
            <div className="market-nav">
            {navItem?<Menu
                mode="horizontal"
                selectedKeys={[this.state.selectedKeys]}
                style={{ border: "none" }}
              >
              {navItem}
              </Menu>:null}
            </div>
            {this.state.detailData ? (
              <div className="chart-lines">
                <div className="chart-value">
                  <p>
                    <span className="distance">
                      样本总数：{this.state.detailData.total}
                    </span>
                    <span>平均值：{this.state.detailData.avg}</span>
                  </p>
                  <p>
                    <span className="distance">
                      25分位值：{this.state.detailData.percent25}
                    </span>
                    <span className="distance">/</span>
                    <span className="distance">
                      {" "}
                      50分位值：{this.state.detailData.percent50}
                    </span>
                    <span className="distance">/</span>
                    <span className="distance">
                      {" "}
                      75分位值： {this.state.detailData.percent75}
                    </span>
                  </p>
                </div>
                <BarChart
                  dataSource={this.state.detailData}
                  title={this.state.titleName}
                /> 
              </div>
            ) : <div className="dataDom" style={{
              width: "100%",
              height: "100%",
              background: "url(https://img.alicdn.com/tfs/TB16Q2LatfJ8KJjy0FeXXXKEXXa-204-166.png) center no-repeat",
              backgroundSize: "102px 83px",
              textAlign: "center",
              color: "#898989",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: "125px"
            }}>
              暂无相关数据
            </div>
}
          </div>
        </div>
      </div>
    );
  }
}
export default connectAll(Multiparameter);
