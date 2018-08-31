/*
  应用舱-》关键因素识别
*/
"use strict";

import React from "react";
import {Button,Row, Col,Checkbox,Icon,Menu,Steps,Form,Field,DatePicker,Select,Input,Tooltip,Table,Tag,
  // moment,
  message
} from "antd";
import { ajax } from "utils/index";
import { connectAll } from "common/redux-helpers";
import "utils/apimap";
import "./index.scss";
import moment from 'moment';
const Option = Select.Option;
const Step = Steps.Step

// const { Item } = Nav;

const FormItem = Form.Item;
// const Toast = Feedback.toast;
const { RangePicker } = DatePicker;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMask: false,
      applyList: "",
      listfactorgroups: "",
      activeKey: "0",
      selectedTitle: "",
      selectedParames: {},
      selectList: {},
      newDetailfactorsList: "",
      totalNum: "",
      targetRange: [],
      defaultTargetRange: {},
      target: {},
      selectFilter: {}
    };
    this.translateTime = this.translateTime.bind(this);
    this.itemClick = this.itemClick.bind(this);
    this.showMasklayer = this.showMasklayer.bind(this);
    this.tagClose = this.tagClose.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderRangePicker = this.renderRangePicker.bind(this);
    this.switchComponent = this.switchComponent.bind(this);
    this.onSetState = this.onSetState.bind(this);
    this.selectFirstValue = this.selectFirstValue.bind(this);
    this.returnFilterName = this.returnFilterName.bind(this);
    this.checkSelect = this.checkSelect.bind(this);
    this.onTargetRangeChange = this.onTargetRangeChange.bind(this);
    this.onMinInputChange = this.onMinInputChange.bind(this);
    this.onMaxInputChange = this.onMaxInputChange.bind(this);
    this.onMultpleValueArrChange = this.onMultpleValueArrChange.bind(this);
    this.onSingleValueArrChange = this.onSingleValueArrChange.bind(this);
    this.returnSelectedState = this.returnSelectedState.bind(this);
    this.fetchTargetRange = this.fetchTargetRange.bind(this);
    this.fetchSamplecalculate = this.fetchSamplecalculate.bind(this);
    this.taskNameChange = this.taskNameChange.bind(this);
    this.onInputTargetClick = this.onInputTargetClick.bind(this);
    this.onInputMinChange = this.onInputMinChange.bind(this);
    this.onInputMaxChange = this.onInputMaxChange.bind(this);
    this.onSelectRange = this.onSelectRange.bind(this);
    this.publishTask = this.publishTask.bind(this);
    this.clearExpectedValue = this.clearExpectedValue.bind(this);
  }
  componentDidMount() {
    // const externalId = this.props.params.data;
    const externalId = "00";
    
    this.setState({
      externalId
    });
    this.selectWorkshop = JSON.parse(
      sessionStorage.getItem("selectTitle")
    ).value;
    ajax(
      {
        api: "applyList",
        params: {}
      },
      json => {
        this.setState({
          applyList: json.data.data
        });
        if (json.data.data && json.data.data.lenght !== 0) {
          this.itemClick(json.data.data[0].id);
        }
      },
      () => {}
    );
  }
  selectWorkshop;
  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
      this.selectWorkshop = nextProps.workshop;
      // const externalId = this.props.params.data;
      const externalId = "00";
      this.setState({
        externalId
      });
      ajax(
        {
          api: "applyList",
          params: {}
        },
        json => {
          this.setState({
            applyList: json.data.data
          });
          if (json.data.data && json.data.data.lenght !== 0) {
            this.itemClick(json.data.data[0].id);
          }
        },
        () => {}
      );
    }
  }
  /**
   * 点击左侧切换服务类型，清空表单，重新获取页面布局
   *
   * @param {any} key
   * @memberof Index
   */
  itemClick(key) {
    this.setState({
      activeKey: key,
      selectedTitle: "",
      taskName: "",
      newDetailfactorsList: ""
    });
    this.clearExpectedValue();
    ajax(
      {
        api: "filterlayout",
        params: {
          sid: key,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        this.setState({
          filterlayout: json.data.data
        });
        if (json.data.data && json.data.data.lenght !== 0) {
          this.selectFirstValue(json.data.data[0]);
        }
      },
      () => {}
    );
    ajax(
      {
        api: "detailfactors",
        params: { sid: key }
      },
      json => {
        this.setState({
          newDetailfactorsList: this.returnNewDetailfactorsList(json.data.data),
          totalNum:
            this.returnDetailfactorsList(
              this.returnNewDetailfactorsList(json.data.data)
            ).length || 0
        });
      },
      () => {}
    );
  }
  //将接口返回的数据做处理，增加标识位selected表示选中状态 ，默认全选
  returnNewDetailfactorsList(data) {
    let json = [];
    if (!data || data.length === 0) {
      return [];
    } else {
      data.forEach((item, index) => {
        let jsonData = [];
        item.items.forEach((a, b) => {
          jsonData.push(Object.assign({}, a, { selected: true }));
        });
        json.push({ bizType: item.bizType, items: jsonData });
      });
      return json;
    }
  }
  //将事件处理成 YY-MM-DD hh:mm:ss 格式
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
  //清空表单
  clearExpectedValue() {
    if (this.state.selectedTarget && this.state.selectedTarget.range) {
      this.setState({
        selectedTarget: {},
        target: {},
        defaultTargetRange: {}
      });
    }
    if (this.state.rangeValues) {
      this.setState({
        rangeValues: "",
        selectedRangValue: ""
      });
    }
    if (this.state.samplecalculate) {
      this.setState({
        samplecalculate: ""
      });
    }
  }
  //关闭编辑分组浮窗
  closeMasklayer() {
    this.setState({
      isShowMask: false
    });
  }
  //开启编辑分组浮窗
  showMasklayer() {
    this.setState({
      isShowMask: true
    });
  }
  //将用户输入的任务名称存入state
  taskNameChange(value) {
    this.setState({
      taskName:value 
    });
  }
  // 将用户选中的因素存入state， 以便后面拼接参数
  returnDetailfactorsList(data) {
    if (!data || (data && data.length === 0)) {
      return [];
    } else {
      let newDetailfactorsList = [];
      data.forEach((item, index) => {
        item.items.forEach((a, b) => {
          if (a.selected) {
            newDetailfactorsList.push(a);
          }
        });
      });
      return newDetailfactorsList;
    }
  }
  //编辑因素时，点击已选中的因素触发取消操作
  tagClose(value, index) {
    let newDetailfactorsList1 = this.state.newDetailfactorsList;
    let newNewDetailfactorsList = [];
    newDetailfactorsList1[index].items.forEach((item, a) => {
      if (value === item.id) {
        newNewDetailfactorsList.push(
          Object.assign({}, item, {
            selected: !this.state.newDetailfactorsList[index].items[a].selected
          })
        );
      } else {
        newNewDetailfactorsList.push(item);
      }
    });
    newDetailfactorsList1[index] = Object.assign(
      {},
      newDetailfactorsList1[index],
      { items: newNewDetailfactorsList }
    );
    this.setState({
      newDetailfactorsList: newDetailfactorsList1
    });
  }
  //封装的方法
  onSetState(item, key, value) {
    this.setState({
      [item]: Object.assign({}, this.state[item], {
        [key]: value
      })
    });
  }
  //layout接口返回页面布局，数组的第一项，如果type是0(离散型， 下拉框多选), 返回可供选择项；如果是连续性（1）或者 时间连续性（2），返回一个区间范围
  selectFirstValue(item) {
    if (item.type === 0) {
      this.setState({
        selectList: {
          [item.id]: item.values
        },
        selectedTarget: "",
        selectedParames: {},
        selectedTitle: ""
      });
      //this.onSetState('selectList', item.id, item.value);
    } else {
      this.setState({
        selectedParames: {
          [item.id]: item.range
        },
        selectedTarget: "",
        selectList: {}
      });
      //this.onSetState('selectedParames', item.id, item.range );
    }
    if (item.type === 2) {
      this.onTargetRangeChange(item, 0, item.range);
    }
    this.clearExpectedValue();
  }
  //多选连续性组件时，只有关闭下拉浮窗，切所选不为空时，发送请求
  selectClosed(a, item, index) {
    this.onSetState("selectedVisible", item.id, a);
    this.clearExpectedValue();
    if (!a && this.state.selectedParames[item.id]) {
      this.onTargetRangeChange(
        item,
        index,
        this.state.selectedParames[item.id]
      );
    }
  }
  // 根据selectedType返回下拉组件类型（单选or多选）
  renderSelect(option, index) {
    const multipleType = option.selectedType === 1 ? true : false;

    // // console.log(option);
    // 按5个字进行补充，一个字14像素
      
    let stringSupplementWidth = (5 - option.name.length) * 14;
    if (option.name === "车间编号") {
      const selectList = (
        <Option key={index} value={this.selectWorkshop}>
          {this.selectWorkshop}
        </Option>
      );
      return (
        <FormItem 
          style={{ marginLeft: stringSupplementWidth }}
          label={`${option.name}`}
        >
          {multipleType && (
            <Select
              placeholder="请选择"
              multiple={true}
              onChange={(a, b) => {
                this.onMultpleValueArrChange(option, index, a);
              }}
              onVisibleChange={a => {
                this.selectClosed(a, option, index);
              }}
              value={this.state.selectedParames[option.id] || []}
            >
              {selectList}
            </Select>
          )}
          {!multipleType && (
            <Select
              placeholder="请选择"
              multiple={false}
              onChange={(a, b) => {
                this.state.taskName ? this.onSingleValueArrChange(option, index, a) : message.error("任务名称不能为空");
              }}
            >
              {selectList}
            </Select>
          )}
        </FormItem>
      );
    } else {
      const selectList =
        JSON.stringify(this.state.selectList) !== "{}" &&
        this.state.selectList[option.id]
          ? this.state.selectList[option.id].map((item, index) => {
              return (
                <Option key={index} value={item}>
                  {item}
                </Option>
              );
            })
          : null;
      return (
        <FormItem
          style={{ marginLeft: stringSupplementWidth }}
          label={`${option.name}`}
        >
          {multipleType && (
            <Select
              placeholder="请选择"
              multiple={true}
              onChange={(a, b) => {
                this.onMultpleValueArrChange(option, index, a);
              }}
              onVisibleChange={a => {
                this.selectClosed(a, option, index);
              }}
              value={this.state.selectedParames[option.id] || []}
            >
              {selectList}
            </Select>
          )}
          {!multipleType && (
            <Select
              placeholder="请选择"
              multiple={false}
              onChange={(a, b) => {
                this.state.taskName ? this.onSingleValueArrChange(option, index, a) : message.error("任务名称不能为空");
              }}
              value={this.state.selectedParames[option.id] || []}
            >
              {selectList}
            </Select>
          )}
        </FormItem>
      );
    }
  }
  //连续性组件
  renderInput(option, index) {
    const inputValue =
      JSON.stringify(this.state.selectedParames) !== "{}" &&
      this.state.selectedParames[option.id]
        ? this.state.selectedParames[option.id]
        : { min: "", max: "" };
    // 按5个字进行补充，一个字14像素
    let stringSupplementWidth = (5 - option.name.length) * 14;
    return (
      <FormItem
        style={{ marginLeft: stringSupplementWidth }}
        label={`${option.name}`}
      >
        <Col>
          <Input
            value={inputValue["min"]}
            onChange={a => {
              this.onMinInputChange(option, index, a);
            }}
          />
        </Col>&nbsp;&nbsp;~&nbsp;&nbsp;<Col>
          <Input
            value={inputValue["max"]}
            onChange={a => {
              this.onMaxInputChange(option, index, a);
            }}
          />
        </Col>
        <Col>
          <Button
            onClick={() => {
              this.onInputTargetClick(option, index);
            }}
          >
            确定
          </Button>
        </Col>
      </FormItem>
    );
  }
  //时间区间选择组件
  renderRangePicker(option, index) {
    const rangePickerValue =
      JSON.stringify(this.state.selectedParames) !== "{}"
        ? this.state.selectedParames[option.id]
        : { min: "", max: "" };
    const timeValue = rangePickerValue
      ? [rangePickerValue.min, rangePickerValue.max]
      : ["", ""];
    const newTime = timeValue[0]?[moment(timeValue[0]), moment(timeValue[1])]:timeValue
    // 按5个字进行补充，一个字14像素
    let stringSupplementWidth = (5 - option.name.length) * 14;
    const range = this.state.selectFilter[option.id];
    const disabledRange = function(calendarDate) {
      let ret = false;
      if (range) {
        const max = range.max;
        const min = range.min;
        const minTime = new Date(max).getTime();
        const maxTime = new Date(min).getTime();
        let year = calendarDate.year();
        let month = calendarDate.month();
        let date = calendarDate.date();
        const now = moment();
        // const nowWeek = now.isoWeekday();
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
      }
      return ret;
    };
    return (
      <FormItem
        style={{ marginLeft: stringSupplementWidth }}
        label={`${option.name}`}
      >
        <RangePicker
          showTime={{ format: 'HH:mm:ss' }}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(val, str) => {
            this.timeRangeChange(option, str);
          }}
          disabledDate={disabledRange}
          value={newTime}
          onOpenChange={bol => {
            this.timeFloorVisible(option, index, bol);
          }}
        />
      </FormItem>
    );
  }
  //时间区间选择 值发生变化的时候，更新state，但不发送请求（浮层关闭后再发送请求，同多选下拉）
  timeRangeChange(item, timeArr) {
    this.onSetState("selectedParames", item.id, {
      max: timeArr[1],
      min: timeArr[0]
    });
  }
  //当时间区间选择浮层关闭后，发送请求
  timeFloorVisible(item, index, visible) {
    if (!visible) {
      this.onTargetRangeChange(
        item,
        index,
        this.state.selectedParames[item.id]
      );
    }
    this.clearExpectedValue();
  }
  //根据接口 type字段，返回页面布局
  switchComponent(item, index) {
    switch (item.type) {
      case 0:
        return this.renderSelect(item, index);
        break;
      case 1:
        return this.renderInput(item, index);
        break;
      case 2:
        return this.renderRangePicker(item, index);
        break;
    }
  }
  //根据组件在接口中的inde，返回对应的id
  returnFilterName(index) {
    if (index > this.state.filterlayout.length - 1) {
      return null;
    } else {
      return this.state.filterlayout[index].id;
    }
  }
  //填入连续性范围，点击确定按钮后，发送请求
  onInputTargetClick(item, index) {
    this.onTargetRangeChange(item, index, this.state.selectedParames[item.id]);
  }
  //连续性范围输入后，更新state
  onMinInputChange(item, index, value) {
    this.onSetState("selectedParames", item.id, {
      max: this.state.selectedParames[item.id].max,
      min: value
    });
  }
  //同上
  onMaxInputChange(item, index, value) {
    this.onSetState("selectedParames", item.id, {
      max: value,
      min: this.state.selectedParames[item.id].min
    });
  }
  //多选下拉值发生变化时，存入state，但不发送请求
  onMultpleValueArrChange(item, index, value) {
    if (!this.state.selectedVisible[item.id] && String(value)) {
      this.onTargetRangeChange(item, index, value);
    }
    this.onSetState("selectedParames", item.id, value);
    this.clearExpectedValue();
  }
  //单选下拉框值发生变化时，发送请求
  onSingleValueArrChange(item, index, value) {
    this.onTargetRangeChange(item, index, value);
    this.onSetState("selectedParames", item.id, value);
    this.clearExpectedValue();
  }
  /**
   * [checkSelect ]返回被改变项之前的所有select的可选项
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  checkSelect(index) {
    let selectList = [];
    this.state.filterlayout.forEach((item, num) => {
      if (num <= index) {
        if (item.type === 0) {
          selectList.push(item.id);
        }
      } else {
        return;
      }
    });
    let newList = {};
    if (selectList.length !== 0) {
      for (const key in this.state.selectList) {
        if (selectList.indexOf(key) !== -1) {
          newList[key] = this.state.selectList[key];
        }
      }
    }
    return newList;
  }
  /**
   * [returnSelectedState 以数组的形式返回selected项，并清除当前项之后的state，[parame, state]
   * @param  {[type]} items [description]
   * @param  {[type]} index [description]
   * @param  {[type]} value [description]
   * @return {[type]}       [description]
   */
  returnSelectedState(items, index, value) {
    const filterNameArr = [];
    let newState = {};
    this.state.filterlayout.forEach((item, num) => {
      if (num < index) {
        if (item.type === 0) {
          if (item.selectedType === 0) {
            filterNameArr.push({
              values: [this.state.selectedParames[this.returnFilterName(num)]],
              id: this.returnFilterName(num)
            });
          } else {
            filterNameArr.push({
              values: this.state.selectedParames[this.returnFilterName(num)],
              id: this.returnFilterName(num)
            });
          }
        } else {
          filterNameArr.push({
            range: this.state.selectedParames[this.returnFilterName(num)],
            id: this.returnFilterName(num)
          });
        }
        newState[this.returnFilterName(num)] = this.state.selectedParames[
          this.returnFilterName(num)
        ];
      } else {
        return;
      }
    });

    if (items.type === 0) {
      if (items.selectedType === 0) {
        filterNameArr.push({
          values: [value],
          id: this.returnFilterName(index)
        });
      } else {
        filterNameArr.push({
          values: value,
          id: this.returnFilterName(index)
        });
      }
    } else {
      filterNameArr.push({
        range: value,
        id: this.returnFilterName(index)
      });
    }
    newState[this.returnFilterName(index)] = value;
    return [filterNameArr, newState];
  }
  //拼接参数，发送请求，获取分析类型
  fetchTargetRange(items, index, value) {
    const filterNameArr = this.returnSelectedState(items, index, value)[0];
    let factorsList = [];
    this.returnDetailfactorsList(this.state.newDetailfactorsList).forEach(
      (item, index) => {
        factorsList.push(item.id);
      }
    );
    const parame = {
      name: this.state.taskName,
      sid: this.state.activeKey,
      filters: filterNameArr,
      factors: factorsList,
      externalId: this.state.externalId,
      workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
    };
    // Toast.show({
    //   type: "loading",
    //   duration: 0,
    //   content: "数据加载中",
    //   hasMask: true,
    //   style: { background: "white", borderColor: "white" }
    // });

      ajax(
        {
          api: "targetRange",
          data: parame,
          dataType: "json",
          method: "post",
          contentType: "application/json"
        },
        json => {
          // Toast.hide();
          if (json.data.data) {
            this.setState({
              targetRange: json.data.data.targets,
              targetId: json.data.data.id
            });
          }
        },
        err => {
          message.error(err);
        }
      );

  }
  //选择分析类型后，根据所选值 请求正负样本比
  onSelectRange(value) {
    let itemValue;
    this.clearExpectedValue();
    this.state.targetRange.forEach((item, index) => {
      if (item.id === value) {
        itemValue = item;
      }
    });
    let parseMax = parseFloat(itemValue["range"].max).toFixed(5) * 1;
    let parseMin = parseFloat(itemValue["range"].min).toFixed(5) * 1;

    this.setState({
      selectedTarget: itemValue,
      defaultTargetRange: {
        max: parseMax,
        min: parseMin
      },
      target: {
        max: parseMax,
        min: parseMin
      }
    });
    if (itemValue.type === 0) {
      this.setState({
        rangeValues: itemValue.values
      });
    } else {
      const target = {
        range: itemValue.range,
        id: itemValue.id,
        type: itemValue.type
      };
      const parame = {
        id: this.state.targetId,
        target: target,
        workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
      };
      this.fetchSamplecalculate(parame);
    }
  }
  //请求正负样本比
  fetchSamplecalculate(parame) {
    parame.target.range.min = parame.target.range.min + "";
    parame.target.range.max = parame.target.range.max + "";
    ajax(
      {
        api: "samplecalculate",
        data: parame,
        dataType: "json",
        method: "post",
        contentType: "application/json"
      },
      json => {
        this.setState({
          samplecalculate: json.data.data
        });
      },
      err => {
        message.error(err);
      }
    );
  }
  returnItemByIndex(index) {
    return this.state.filterlayout[index];
  }
  //根据layout的index，判断所要发送的接口类型，如果是最后一个，请求分析类型，否则请求filter（即下一个组件的值或者取值范围））
  onTargetRangeChange(items, index, value) {
    const filterNameArr = this.returnSelectedState(items, index, value)[0];
    const newState = this.returnSelectedState(items, index, value)[1];
    const newList = this.checkSelect(index);
    const newFilterName = this.returnFilterName(index + 1);
    const parame = {
      column: newFilterName,
      conditions: filterNameArr,
      sid: this.state.activeKey,
      workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
    };

    this.setState({
      selectedTarget: ""
    });
    if (index < this.state.filterlayout.length - 1) {
      ajax(
        {
          api: "filterRange",
          data: parame,
          dataType: "json",
          method: "post",
          contentType: "application/json"
        },
        json => {
          if (json.data.data && JSON.stringify(json.data.data) !== "{}") {
            if (json.data.data.type === 0) {
              newList[newFilterName] = json.data.data.values;
            } else if (json.data.data.type === 1) {
              newState[newFilterName] = json.data.data.range;
              this.onTargetRangeChange(
                this.returnItemByIndex(index + 1),
                index + 1,
                json.data.data.range
              );
            }
            this.setState({
              selectedParames: newState,
              selectFilter: newState,
              selectList: newList
            });
          } else {
          }
        },
        err => {
          message.error(err);
        }
      );
    }
    if (index === this.state.filterlayout.length - 1) {
      this.fetchTargetRange(items, index, value);
    }
  }
  onBlurInputMax(value) {
    let target = Object.assign({}, this.state.target);
    let initMinValue = this.state.defaultTargetRange.min;
    let initMaxValue = this.state.defaultTargetRange.max;

    if (
      Number(value) <= Number(initMinValue) ||
      Number(value) >= Number(initMaxValue)
    ) {
      target.max = initMaxValue;
      this.setState({
        target,
        selectedTarget: {
          name: this.state.selectedTarget["name"],
          range: {
            min: this.state.target.min,
            max: initMaxValue
          },
          id: this.state.selectedTarget["id"],
          type: this.state.selectedTarget["type"]
        }
      });
    }
    if (value !== "" && !isNaN(Number(value))) {
      const rangeValue = {
        range: { max: value, min: this.state.selectedTarget["range"].min },
        id: this.state.selectedTarget["id"],
        type: this.state.selectedTarget.type
      };
      const target = {
        range: rangeValue.range,
        id: rangeValue.id,
        type: rangeValue.type
      };
      const parame = {
        id: this.state.targetId,
        target: target,
        workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
      };
      this.fetchSamplecalculate(parame);
    }
  }
  onBlurInputMin(value) {//最小值失去焦点
    let target = Object.assign({}, this.state.target);
    let initMinValue = this.state.defaultTargetRange.min;
    let initMaxValue = this.state.defaultTargetRange.max;
    if (
      Number(value) <= Number(initMinValue) ||
      Number(value) >= Number(initMaxValue)
    ) {
      target.min = initMinValue;
      this.setState({
        target,
        selectedTarget: {
          name: this.state.selectedTarget["name"],
          range: {
            min: initMinValue,
            max: this.state.target.max
          },
          id: this.state.selectedTarget["id"],
          type: this.state.selectedTarget["type"]
        }
      });
    }
    if (value !== "" && !isNaN(Number(value))) {
      const rangeValue = {
        range: { min: value, max: this.state.selectedTarget["range"].max },
        id: this.state.selectedTarget["id"],
        type: this.state.selectedTarget.type
      };
      const target = {
        range: rangeValue.range,
        id: rangeValue.id,
        type: rangeValue.type
      };
      const parame = {
        id: this.state.targetId,
        target: target,
        workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
      };
      this.fetchSamplecalculate(parame);
    }
  }

  //当期望值类型为连续性时，改变最小值触发，更新state，重新请求正负样本比
  onInputMinChange(e) {
    this.setState({
      selectedTarget: {
        name: this.state.selectedTarget["name"],
        range: {
          min: e.target.value,
          max: this.state.target.max
        },
        id: this.state.selectedTarget["id"],
        type: this.state.selectedTarget["type"]
      },
      target: {
        min: e.target.value,
        max: this.state.target.max
      }
    });
    if (e.target.value !== "" && !isNaN(Number(e.target.value))) {
      const rangeValue = {
        range: { min: e.target.value, max: this.state.selectedTarget["range"].max },
        id: this.state.selectedTarget["id"],
        type: this.state.selectedTarget.type
      };
      const target = {
        range: rangeValue.range,
        id: rangeValue.id,
        type: rangeValue.type
      };
      const parame = {
        id: this.state.targetId,
        target: target,
        workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
      };
      this.fetchSamplecalculate(parame);
    }
  }
  //当期望值类型为连续性时，改变最大值触发，更新state，重新请求正负样本比

  onInputMaxChange(e) {
    this.setState({
      selectedTarget: {
        name: this.state.selectedTarget["name"],
        range: {
          max: e.target.value,
          min: this.state.target.min
        },
        id: this.state.selectedTarget["id"],
        type: this.state.selectedTarget["type"]
      },
      target: {
        max: e.target.value,
        min: this.state.target.min
      }
    });
    if (e.target.value !== "" && !isNaN(Number(e.target.value))) {
      const rangeValue = {
        range: { max: e.target.value, min: this.state.selectedTarget["range"].min },
        id: this.state.selectedTarget["id"],
        type: this.state.selectedTarget.type
      };
      const target = {
        range: rangeValue.range,
        id: rangeValue.id,
        type: rangeValue.type
      };
      const parame = {
        id: this.state.targetId,
        target: target,
        workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
      };
      this.fetchSamplecalculate(parame);
    }
  }
  //当期望值类型为离散型时，所选值发生变化后更新state，重新请求正负样本比

  onChangeRangValue(a) {
    const rangeValue = {
      values: a,
      id: this.state.selectedTarget["id"],
      type: this.state.selectedTarget.type
    };
    const target = {
      values: rangeValue.values,
      id: rangeValue.id,
      type: rangeValue.type
    };
    const parame = {
      id: this.state.targetId,
      target: target,
      workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
    };
    this.setState({
      selectedRangValue: a
    });
    this.fetchSamplecalculate(parame);
  }
  //提交任务
  publishTask() {
    if (
      this.state.samplecalculate &&
      (this.state.samplecalculate["negative"] !== 0 &&
        this.state.samplecalculate["positive"] !== 0)
    ) {
      ajax(
        {
          api: "runTask",
          params: { instanceId: this.state.targetId }
        },
        json => {
          message.success("任务创建成功");
          location.href = "#task";
        },
        () => {}
      );
    } else {
      message.error("正样本或负样本为0时，算法无法正常启动");
    }
  }
  render() {
    //左侧菜单栏
    const applyList = this.state.applyList
      ? this.state.applyList.map((item, index) => {
          return (
            <Menu.Item
              key={item.id}
              onClick={this.itemClick.bind(this,item.id)}
            >
              <div className="service-item">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            </Menu.Item>
          );
        })
      : null;
    const tagList = this.state.newDetailfactorsList
      ? this.state.newDetailfactorsList.map((item, index) => {
          return (
            <div key={index}>
              <Row>
                <Col span="4">
                  <p
                    style={{
                      whiteSpace: "nowrap",
                      minWidth: "70px",
                      overflow: "hidden",
                      marginTop: "13px",
                      fontSize: "12px",
                      color: "#999999"
                    }}
                  >
                    {item.bizType}
                  </p>
                </Col>
                <Col>
                  <div>
                    {item.items.map((a, b) => {
                      return (
                        <span
                          key={a.id}
                          onClick={() => {
                            this.tagClose(a.id, index);
                          }}
                          className={`target-item ${
                            a.selected === false ? "" : "selected-target-item"
                          }`}
                          style={{ width: "auto" }}
                        >
                          {a.name}
                          <span className="hoveredText">
                            {a.selected === false ? "选择" : "取消"}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </div>
          );
        })
      : null;
    const renderButton = (value, index, record) => {
      return (
        <a style={{ cursor: "pointer" }} onClick={() => {}}>
          <Icon type="baocun" />
        </a>
      );
    };
    const componentLayout = this.state.filterlayout
      ? this.state.filterlayout.map((item, index) => {
          return <Row style={{paddingLeft: 28}} key={index}>{this.switchComponent(item, index)}</Row>;
        })
      : null;
    const targetRange = this.state.targetRange
      ? this.state.targetRange.map((item, index) => {
          return (
            <Option key={index} value={item.id}>
              {item.name}
            </Option>
          );
        })
      : null;
    const samplecalculate = this.state.samplecalculate
      ? `${this.state.samplecalculate["positive"]}:${
          this.state.samplecalculate["negative"]
        }`
      : "--:--";
    const rangeValues = this.state.rangeValues
      ? this.state.rangeValues.map((item, index) => {
          return (
            <Option key={index} value={item}>
              {item}
            </Option>
          );
        })
    : null;
    const formItemLayout = {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 21
      }
    };

    const typeLayout = {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 7
      }
    };

    return (
      <div className="foctor-warehouse-page">
        <div className="content-nav-table">
          <div className="module-nav">
            <h2 className="">
              选择服务
            </h2>
            <div style={{ width: 249, height: "96%", overflowX: "hidden" }}>
              <Menu
                style={{width: "100%",height: "96%",overflowY: "scroll",overflowX: "hidden"}}
                mode="vertical-right"
                selectedKeys = {[this.state.activeKey.toString()]}
                // defaultSelectedKeys={[this.state.activeKey.toString()]}
                // defaultOpenKeys={['sub1']}
              >
                {applyList}
              </Menu>
            </div>
          </div>
          <div className="table-main">
            <h2 style={{ fontSize: 14 ,color:'#999999'}}>填写任务详情</h2>
            <Form style={{ padding: "50px 0 0 100px" }}>
              <Steps current={-1} direction="vertical">
                <Step
                  title=""
                  description={
                    <FormItem {...formItemLayout} label="任务名称">
                      <Input
                        placeholder="输入任务名称"
                        style={{ width: 231 }}
                        onChange={e => {this.taskNameChange(e.target.value);}}
                        value={this.state.taskName}
                      />
                    </FormItem>
                  }
                />
                <Step
                  title=""
                  description={
                    <FormItem {...formItemLayout} label="分析因素">
                      <p className="factorsList">
                        共{this.returnDetailfactorsList(this.state.newDetailfactorsList).length}个因素
                          <a
                            onClick={() => {this.showMasklayer();}}
                            style={{display: "inline-block",height: "25px",color: "#00C1DE",paddingLeft: "10px",cursor: "pointer"}}
                            >编辑
                          </a>
                      </p>
                    </FormItem>
                  }
                />
                {
                  this.state.filterlayout ? <Step title="" description={componentLayout} /> : null
                }
                <Step
                  title=""
                  description={
                    <div>
                      <Row>
                        <FormItem {...typeLayout} label="分析类型">
                          <Select
                            placeholder="请选择目标"
                            onChange={a => {this.onSelectRange(a);}}
                            value={this.state.selectedTarget? this.state.selectedTarget["name"]: ""}
                          >
                            {this.state.targetRange.map((item, index) => {
                              return (
                                <Option key={index} value={item.id}>{item.name}</Option>
                              );
                            })}
                          </Select>
                        </FormItem>
                      </Row>
                      <Row>
                        <FormItem {...formItemLayout} label="正样本期望值">
                          {this.state.target && (
                            <Col>
                              <Input
                                onBlur={evt =>this.onBlurInputMin(evt.target.value)}
                                value={this.state.target.min !== undefined? this.state.target.min: ""}
                                style={{ width: 102 }}
                                onChange={value => {this.onInputMinChange(value)}}
                              />{" "}
                              &nbsp;&nbsp;至 &nbsp;&nbsp;
                              <Input
                                onBlur={evt =>this.onBlurInputMax(evt.target.value)}
                                value={this.state.target.max !== undefined? this.state.target.max: ""}
                                style={{ width: 100 }}
                                onChange={value => {this.onInputMaxChange(value)}}
                              />
                            </Col>
                          )}
                          {this.state.rangeValues && (
                            <Select
                              placeholder="请选择"
                              onChange={a => {
                                this.onChangeRangValue(a);
                              }}
                              value={
                                this.state.selectedRangValue
                                  ? this.state.selectedRangValue
                                  : null
                              }
                              multiple
                            >
                              {rangeValues}
                            </Select>
                          )}
                        </FormItem>
                      </Row>
                      <div style={{ margin: "0px 0px 0px 98px",color: "#999999",fontSize: 10}}>
                        选值范围：
                        {this.state.defaultTargetRange.min !== undefined? this.state.defaultTargetRange.min: ""}{" "}-{" "}
                        {this.state.defaultTargetRange.max !== undefined? this.state.defaultTargetRange.max: ""}
                      </div>
                      <Row style={{ margin: "8px 28px" }}>
                        <span className="proportion-text">
                          正样本量：负样本量（{samplecalculate}）
                        </span>
                        <Tooltip
                          placement="rightTop"  
                          title={ <span
                            className="prompt-text"
                            style={{ fontSize: "12px", color: "white" }}
                          >
                            两者数量相似时，分析结果较准确，任一数值为0时，算法无法正常启动
                          </span>}
                        >
                          <Icon type="info-circle-o" />
                        </Tooltip>
                      </Row>
                      <Row>
                        <Button type="primary" style={{ marginLeft: 100 }} onClick={() => {this.publishTask();}}>开始分析</Button>
                      </Row>
                    </div>
                  }
                />
              </Steps>
            </Form>
          </div>
        </div>
        <div
          className={this.state.isShowMask? "maskLayer maskLayer-active": "maskLayer maskLayer-hide"}
        />
        <div
          className={
            this.state.isShowMask
              ? "mask-details is-mask-active"
              : "mask-details close-active"
          }
          >
          <Row style={{overflow:"hidden"}}>
            <h3 style={{display:"inline-block",float:"left"}}>编辑分组</h3>
            <Button
              style={{ margin: "5px 20px 0 25px",float:"right" }}
              onClick={() => {
                this.closeMasklayer();
              }}
            >
              关闭
            </Button>
          </Row>
          <Row className="totalNum">
            已选&nbsp;<span style={{ color: "#00C1DE" }}>
              {
                this.returnDetailfactorsList(this.state.newDetailfactorsList)
                  .length
              }
            </span>&nbsp;/&nbsp;共{this.state.totalNum}&nbsp;个因素参加本次分析任务
          </Row>
          <div className="tag-list">{tagList}</div>
        </div>
      </div>
    );
  }
}
export default connectAll(Index);
