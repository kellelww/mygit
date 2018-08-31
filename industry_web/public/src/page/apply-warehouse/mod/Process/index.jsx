/*
  应用舱-》工艺参数推荐
*/
import React, { Component } from "react";
import {Table,Icon,Button,Row, Col,message,
  Tag,Steps,Select,Form,Input,Radio,DatePicker} from "antd";
import { ajax } from "utils/index";
import { connectAll } from "common/redux-helpers";
import Content from "components/content";
import Mask from "components/mask";
import "utils/apimap";
const _ = require('lodash')
import "./index.scss";
const Step = Steps.Step
import moment from 'moment';
// const Toast = Feedback.toast;
// const { Group: RadioGroup } = Radio;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.selectWorkshop = JSON.parse(
      sessionStorage.getItem("selectTitle")
    ).value;
    this.state = {
      selectData: [],
      selectFactors: [],
      time: {},
      factor: [],
      selectCount: 0,
      isShowMask: false,
      countSum: 0,
      dataSource: {},
      factorParams: [],
      selectFilter: {},
      selectTargetList: [],
      selectValue: "",
      sid: "",
      defaultTargetRange: "",
      targetRange: "",
      samplecalculate: {},
      taskName: "",
      initTime: {
        max: '',
        min: ''
      }
    };
  }

  /**
   * 选择数据源
   */
  componentWillUnmount() {
    clearTimeout(this.time);
  }

  componentDidMount() {
    this.getDataSource();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
      this.selectWorkshop = nextProps.workshop;
      this.setState({
        selectData: [],
        selectFactors: [],
        time: {},
        factor: [],
        selectCount: 0,
        isShowMask: false,
        countSum: 0,
        dataSource: {},
        factorParams: [],
        selectFilter: {},
        selectTargetList: [],
        selectValue: "",
        sid: "",
        defaultTargetRange: "",
        targetRange: "",
        samplecalculate: {},
        taskName: "",
        selectLine: [],
        initValue:null
      });
      this.getDataSource();
    }
  }

  /**
   *
   * @param {*数据源} id
   */

  getDataSource(id) {
    ajax(
      {
        api: "getdataSourceRecommended"
      },
      json => {
        if (json.data.data) {
          this.setState(
            {
              selectData: json.data.data,
              sid: json.data.data[0].id,
              selectValue: json.data.data[0].id
            },
            async () => {
              await this.getParamsListRec(json.data.data[0].id);
              await this.getFilterRec(json.data.data[0].id);
              await this.getTargetRec(json.data.data[0].id);
              await this.getTargetRange();
              this.getSamplecalculate();
            }
          );
        }
      }
    );
  }

  /**
   *
   * @param {*分析参数} sid
   */

  getParamsListRec(sid) {//分析参数数据
    return new Promise((resolve, reject) => {
      ajax(
        {
          api: "getParamsListRec",
          params: { sid }
        },
        json => {
          if (json.data.data) {
            let factor = [];
            let selectCount = 0;
            json.data.data.forEach((item, index) => {
              item.items.forEach((item, index) => {
                item.isSelect = true;
              });
              let arr = item.items.map((ele, index) => {
                return ele;
              });
              factor = factor.concat(arr);
            });
            this.setState(
              {
                selectCount: factor.length,//选中的
                factorParams: json.data.data,
                countSum: factor.length,
                factor
              },
              () => {
                resolve(json.data.data);
              }
            );
          }
        }
      );
    });
  }

  /**
   *
   * @param {*选择时间范围和车间产线} sid
   */

  getFilterRec(sid) {
    return new Promise((resolve, reject) => {
      ajax(
        {
          api: "getFilterRec",
          params: {
            sid: sid,
            workShop: this.selectWorkshop
          }
        },

        json => {
          if (json.data.data) {
            this.setState(
              {
                selectFilter: json.data.data,
                time: json.data.data.time,
                initTime: json.data.data.time,
                selectLine: [String(json.data.data.line[0].id)]
              },
              () => {
                resolve();
              }
            );
          }
        }
      );
    });
  }

  /**
   *
   * @param {*选择目标} sid
   */

  getTargetRec(sid) {
    return new Promise((resolve, reject) => {
      ajax(
        {
          api: "getTargetRec",
          params: { sid }
        },
        json => {
          if (json.data.data) {
            this.setState(
              {
                selectTargetList: json.data.data,
                selectTargetListValue: json.data.data[0].id
              },
              () => {
                resolve();
              }
            );
          }
        }
      );
    });
  }

  /**
   * 获取正负样本量
   */

  getSamplecalculate() {
    let params = Object.assign({}, this.state.samplecalculateParams);
    params.target.range = {};
    params.target.range.min = this.state.targetRange.min;
    params.target.range.max = this.state.targetRange.max;
    ajax(
      {
        api: "getSamplecalculate",
        data: params,
        dataType: "json",
        method: "post",
        contentType: "application/json"
      },
      json => {
        if (json.data.data) {
          this.setState({
            recommendedParams: params,
            samplecalculate: json.data.data
          });
        }
      }
    );
  }

  getTargetRange() {
    return new Promise((resolve, reject) => {
      let selectValue = this.state.selectValue;
      let selectWorkshop = this.selectWorkshop;
      let selectLine = this.state.selectLine;
      let selectTargetListValue = this.state.selectTargetListValue;
      if (
        selectValue &&
        selectWorkshop &&
        selectLine &&
        selectTargetListValue
      ) {
        let params = {
          sid: this.state.sid,
          target: {
            id: selectTargetListValue
          },
          filter: {
            time: {
              max: this.state.time.max,
              min: this.state.time.min
            },
            workshop: selectWorkshop,
            line: selectLine
          }
        };

        if (selectLine.length) {
          ajax(
            {
              api: "getTargetRange",
              data: params,
              dataType: "json",
              method: "post",
              contentType: "application/json"
            },
            json => {
              if (json.data.data) {
                json.data.data.min = parseFloat(json.data.data.min).toFixed(5);
                json.data.data.max = parseFloat(json.data.data.max).toFixed(5);
                this.setState(
                  {
                    targetRange: json.data.data,
                    defaultTargetRange: json.data.data,
                    initValue: json.data.data,
                    samplecalculateParams: params
                  },
                  () => {
                    resolve();
                  }
                );
              }
            }
          );
        }
      }
    });
  }

  async onSelectField(value) {
    await this.getParamsListRec(value);
    await this.getFilterRec(value);
    await this.getTargetRec(value);
    this.setState({ selectValue: value, sid: value }, async () => {
      await this.getTargetRange();
      this.getSamplecalculate();
    });
  }

  disabledDate(calendarDate) {
    if(this.state.selectFilter.time) {
      let ret = false;
      // const max = this.state.selectFilter.time.max;
      // const min = this.state.selectFilter.time.min;

      const max = this.state.initTime.max;
      const min = this.state.initTime.min;


      const minTime = new Date(max).getTime();
      const maxTime = new Date(min).getTime();
      // const { year, month, date } = calendarDate;
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

  showTime(time) {
    let selectFilter = _.cloneDeep(this.state.selectFilter);
    let initMin = new Date(this.state.initTime.min).getTime();
    let initMax = new Date(this.state.initTime.max).getTime();
    let currentMin = new Date(time[0]).getTime();
    let currentMax = new Date(time[1]).getTime();

    if (currentMin < initMin) {
      time[0] = initMin;
    } else if (currentMax > initMax) {
      time[1] = initMax;
    }
    selectFilter.time ? selectFilter.time.min = moment(time[0]).format("YYYY-MM-DD HH:mm:ss") : '';
    selectFilter.time ? selectFilter.time.max = moment(time[1]).format("YYYY-MM-DD HH:mm:ss") : '';
    this.setState(
      {
        selectFilter,
        time: {
          min: moment(time[0]).format("YYYY-MM-DD HH:mm:ss"),
          max: moment(time[1]).format("YYYY-MM-DD HH:mm:ss")
        }
      },
      async () => {
        await this.getTargetRange();
        this.getSamplecalculate();
      }
    );
  }

  selectDataSource() {
    return (
      <div className="select-data">
        <Form>
          <FormItem {...formItemLayout} label="数据源">
            <Select
              placeholder="请选择"              
              value={this.state.selectValue}
              style={{ width: 187 }}
              onChange={this.onSelectField}
            >
              {this.state.selectData.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 任务名称
   */

  onChangeInputtaskName(value) {
    this.setState({
      taskName: value
    });
  }

  taskName() {
    return (
      <Form>
        <FormItem label="任务名称" {...formItemLayout}>
          <Input
            style={{width:"250px"}}
            value={this.state.taskName}
            onChange={e => {this.onChangeInputtaskName(e.target.value);}}
            placeholder="请输入"
          />
        </FormItem>
      </Form>
    );
  }

  /**
   *  分析参数
   */

  selectWay() {
    return (
      <Form>
        <FormItem label="分析参数" {...formItemLayout}>
          <span>共{this.state.factor.length}个参数</span>
          <span
            onClick={this.onShowEditGroup.bind(this)}
            style={{ color: "#108EE9", marginLeft: 30, cursor: "pointer" }}
          >
            编辑
          </span>
        </FormItem>
      </Form>
    );
  }

  /**
   * 分析因素
   */

  onAllSelectTag(value, index) {
    const factors = _.cloneDeep(this.state.factors);
    factors[index].isSelect = !factors[index].isSelect;
    this.setState({ factors });
  }

  onOkTag() {
    const factors = _.cloneDeep(this.state.factors);
    const selectFactors = factors.filter((item, index) => item.isSelect);
    this.setState({ visible: false, selectFactors });
  }

  onSelectWorkshop(value) {
    async () => {
      await this.getTargetRange();
      this.getSamplecalculate();
    };
  }

  onSelectLine(value) {
    let recommendedParams = _.cloneDeep(this.state.recommendedParams);
    recommendedParams.filter.line = value;
    this.setState(
      {
        recommendedParams,
        selectLine: value
      },
      async () => {
        await this.getTargetRange();
        this.getSamplecalculate();
      }
    );
  }

  selectFactors() {
    const timeValue = this.state.selectFilter.time?[moment(this.state.selectFilter.time.min), moment(this.state.selectFilter.time.max)]:''
    return (
      <Form>
        <FormItem {...formItemLayout} label="选择时间">
          <RangePicker
            // value={[
            //   _.get(this.state.selectFilter, "time.min"),
            //   _.get(this.state.selectFilter, "time.max")
            // ]}
            value={timeValue}
            showTime={{ format: 'HH:mm:ss' }}
            format="YYYY-MM-DD HH:mm:ss"
            allowClear={false}
            // showTime={{
            //   hideDisabledOptions: true,
            //   // defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('00:00:00', 'HH:mm:ss')],
            // }}
            disabledDate={this.disabledDate.bind(this)}
            onChange={this.showTime.bind(this)}
          />
        </FormItem>

        <FormItem {...formItemLayout} label="产线">
          <Select
            placeholder="请选择"
            mode='multiple'
            value={this.state.selectLine}
            style={{ width: 187 }}
            onChange={this.onSelectLine.bind(this)}
          >
            {this.state.selectFilter.line &&
              this.state.selectFilter.line.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </FormItem>
      </Form>
    );
  }
  checkParams(params) {
    if (!params.taskName) {
      message.warning("请输入任务名称!");
      return false;
    } else if (!params.factors.length) {
      message.warning("请选择分析参数!");
      return false;
    } else if (!params.filter.line.length) {
      message.warning("请选择产线!");
      return false;
    } else if (
      Number(this.state.samplecalculate.positive) === 0 ||
      Number(this.state.samplecalculate.negative === 0)
    ) {
      message.warning("正负样本量不能0");
      return false;
    } else {
      return true;
    }
  }

  onStartRecommended() {
    let recommendedParams = Object.assign({}, this.state.recommendedParams);
    recommendedParams.taskName = this.state.taskName;
    recommendedParams.factors = this.state.factor[0].id
      ? this.state.factor.map(item => {
          return item.id;
        })
      : this.state.factor;

    if (this.checkParams(recommendedParams)) {
      ajax(
        {
          api: "createRec",
          data: recommendedParams,
          dataType: "json",
          method: "post",
          contentType: "application/json"
        },
        json => {
          if (json.data.data) {
            if (json.data.data === 1) {
              message.success('任务创建成功！');
              this.time = setTimeout(function() {
                location.hash = "task";
              }, 1000);
            }
          }
        }
      );
    }
  }
  /**
   * 选择目标
   */

  onSelectTarget(value) {
    this.setState(
      {
        selectTargetListValue: value
      },
      async () => {
        await this.getTargetRange();
        this.getSamplecalculate();
      }
    );
  }

  onChangeInputMin(value) {
    let targetRange = Object.assign({}, this.state.targetRange);

    if (String(parseInt(value)) !== "NaN" || value === "") {
      if (
        typeof Number(value) === "number" &&
        String(Number(value)) !== "NaN"
      ) {
        targetRange.min = value;
        this.setState({ targetRange });
      }
    }
  }

  onChangeInputMax(value) {
    let targetRange = Object.assign({}, this.state.targetRange);

    if (String(parseInt(value)) !== "NaN" || value === "") {
      if (
        typeof Number(value) === "number" &&
        String(Number(value)) !== "NaN"
      ) {
        targetRange.max = value;
        this.setState({ targetRange });
      }
    }
    this.setState({ targetRange });
  }

  onBlurInputMin(value) {
    let targetRange = Object.assign({}, this.state.targetRange);
    let initMinValue = this.state.initValue.min;
    let initMaxValue = this.state.initValue.max;
    if (
      Number(value) <= Number(initMinValue) ||
      Number(value) >= Number(initMaxValue)
    ) {
      targetRange.min = initMinValue;
      this.setState({ targetRange });
    }
    this.getSamplecalculate();
  }

  onBlurInputMax(value) {
    let targetRange = Object.assign({}, this.state.targetRange);
    let initMinValue = this.state.initValue.min;
    let initMaxValue = this.state.initValue.max;

    if (
      Number(value) <= Number(initMinValue) ||
      Number(value) >= Number(initMaxValue)
    ) {
      targetRange.max = initMaxValue;
      this.setState({ targetRange });
    }
    this.getSamplecalculate();
  }

  selectTarget(value) {
    return (
      <Form>
        <FormItem label="选择目标" {...formItemLayout}>
          <Select
            placeholder="请选择"
            value={this.state.selectTargetListValue}
            style={{ width: 187 }}
            onChange={this.onSelectTarget.bind(this)}
          >
            {this.state.selectTargetList.length &&
              this.state.selectTargetList.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </FormItem>
        <div className="step-item">
          <div className="step-item-left">正样本期望值:</div>
          <Input
            onBlur={evt => this.onBlurInputMin(evt.target.value)}
            value={this.state.targetRange.min}
            onChange={evt => this.onChangeInputMin(evt.target.value)}
            style={{ width: 108, marginRight: 6 }}
          />
          -
          <Input
            onBlur={evt => this.onBlurInputMax(evt.target.value)}
            value={this.state.targetRange.max}
            onChange={evt => this.onChangeInputMax(evt.target.value)}
            style={{ width: 108, marginLeft: 6 }}
          />
          
        </div>
        <div
          style={{
            margin: "10px 0px 0px 88px",
            color: "#999999",
            fontSize: 10
          }}
          >
          选值范围：{this.state.defaultTargetRange.min} -{" "}
          {this.state.defaultTargetRange.max}
        </div>
        <div
          style={{
            margin: "20px 0px 0px 88px",
            color: "#999999",
          }}
          >
          正样本量 : 负样本量({this.state.samplecalculate.positive} :{" "}
          {this.state.samplecalculate.negative})
        </div>
      </Form>
    );
  }

  /**
   * mask
   */

  onShowEditGroup() {
    this.setState({ isShowMask: true });
  }
  onClose() {
    const factorParams = _.cloneDeep(this.state.factorParams);
    let factor = [];
    factorParams.forEach((item, index) => {
      let arr = item.items.filter((ele, index) => {
        return ele.isSelect;
      });
      factor = factor.concat(arr);
    });
    factor = factor.map(item => {
      return item.id;
    });
    this.setState({ isShowMask: false, factor });
  }

  onSubmit() {
    this.setState({ isShowMask: false });
  }

  tagClose(id, index) {
    let factorParams = _.cloneDeep(this.state.factorParams);
    let selectCount = 0;
    let factor = [];
    factorParams.forEach((item, index) => {
      let arr = item.items.filter(ele => {
        if (id === ele.id) {
          ele.isSelect = !ele.isSelect;
        }
        if (ele.isSelect) {
          selectCount++;
        }
        return ele.isSelect;
      });
      factor = factor.concat(arr);
    });
    this.setState({ factorParams, selectCount, factor });
  }

  render() {
    return (
      <Content title={<span style={{color:'#999999'}}>服务配置</span>} >
        <div className="multparameter-content">
          <Steps current={-1} direction="vertical">
            <Step title="" description={this.selectDataSource()} />
            <Step title="" description={this.taskName()} />
            <Step title="" description={this.selectWay()} />
            <Step title="" description={this.selectFactors()} />
            <Step title="" description={this.selectTarget()} />
          </Steps>
          <Button
            style={{ marginLeft: 163, marginTop: 30 }}
            type="primary"
            onClick={this.onStartRecommended.bind(this)}
          >
            开始推荐
          </Button>
        </div>
        <Mask
          isShowMask={this.state.isShowMask}
          title="编辑分组"
          onClose={this.onClose.bind(this)}
        >
          <p style={{ textAlign: "center" }}>
            已选<span style={{ color: "#108EE9" }}>
              {this.state.selectCount}
            </span>/共<span>{this.state.countSum}</span>个工艺参数参加本次推荐任务
          </p>
          {this.state.factorParams.map((item, index) => {
            return (
              <Row key={item.bizType + index} style={{ marginTop: 30 }}>
                <Col span="4">{item.bizType}</Col>
                <Col>
                  {item.items.map((ele, index) => {
                    return (
                      <span
                        className={ele.isSelect ? "tag" : "tag-close"}
                        key={index}
                        onClick={this.tagClose.bind(this, ele.id)}
                      >
                        {ele.name}
                        <span className="tag-hover">
                          {ele.isSelect ? "取消" : "选择"}
                        </span>
                      </span>
                    );
                  })}
                </Col>
              </Row>
            );
          })}
        </Mask>
      </Content>
    );
  }
}

export default connectAll(App);
