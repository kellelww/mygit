import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {
  Switch,
  Icon,
  Button,
  Table,
  Input,
  Tooltip,
  Tag,
  Modal,
  message
} from 'antd';
import config from './config.jsx';
import { connectAll } from 'common/redux-helpers';
import { ajax } from 'utils/index';
import 'utils/apimap';
import './index.scss';
const _ = require('lodash');

class warningSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMask: false,
      closed: {},
      peopleArr: [],
      peopleValue: {},
      maskType: '',
      iskeyInput: true,
      listIndex: 0,
      isError: {},
      oldDataSource: [],
      dataSource: [],
      visible: false,
      isSave: false,
      timeRatio: '',
      loading: true
    };
  }

  targetValue(value, record, index ) {
    return (
      <span>
        <Input
          onBlur={evt => this.onBlur(evt.target.value, index)}
          style={{ width: 100 }}
          state={this.state.isError[index] ? 'error' : 'success'}
          value={record.timeRatio}
          maxLength={3}
          onChange={(e) => {
            this.onChangeTargetValue(e.target.value, index);
          }}
        />%
      </span>
    );
  }

  onBlur(value, index) {
    value = value ? value : 0;
    let isError = _.cloneDeep(this.state.isError);
    let dataSource = _.cloneDeep(this.state.dataSource);
    isError[index] = false;
    if (!value) {
      dataSource[index].timeRatio = value;
    }
    this.setState({
      isError,
      dataSource
    });
  }

  onChangeTargetValue(value, index) {
    let isError = _.cloneDeep(this.state.isError);
    if (typeof parseInt(value) === 'number' && value <= 100) {
      let dataSource = _.cloneDeep(this.state.dataSource);
      isError[index] = false;
      dataSource[index].timeRatio = value;
      this.setState({
        dataSource,
        isError
      });
    } else {
      isError[index] = true;
      this.setState({
        isError
      });
    }
  }

  componentDidMount() {
    let selectTitle = JSON.parse(sessionStorage.getItem('selectTitle'));
    selectTitle = selectTitle ? selectTitle : this.props.workshop;
    this.getQueryAll({ workShop: selectTitle.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
      this.getQueryAll({ workShop: nextProps.workshop });
    }
  }

  componentWillUnmount() {
    let newState = _.cloneDeep(this.state);
    if (
      !_.isEqual(newState.dataSource, newState.oldDataSource) &&
      !newState.isSave
    ) {
      let save = window.confirm('数据未保存,是否保存?');
      if (save) {
        this.onSaveData();
      }
    }
  }

  onSaveData() {
    let dataSource = _.cloneDeep(this.state.dataSource);
    dataSource.forEach((item, index) => {
      item.timeRatio = item.timeRatio / 100;
      item.type = config.value[item.type];
    });
    let params = {};
    params.data = dataSource;
    params.workShop = JSON.parse(sessionStorage.getItem('selectTitle')).value;
    ajax({
      api: 'saveEdit',
      method: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(params)
    });
  }

  routerLeaveInformation(nextLocation, that) {
    let newState = _.cloneDeep(this.state);
    if (
      !_.isEqual(newState.dataSource, newState.oldDataSource) &&
      !newState.isSave
    ) {
      return '数据未保存,确认要离开?';
    }
  }

  getQueryAll(data) {
    this.setState({
      loading: true
    });
    ajax(
      {
        api: 'queryAll',
        params: data
      },
      json => {
        if (json.data.data) {
          // Toast.hide();
          let isError = {};
          json.data.data.forEach((item, index) => {
            item.timeRatio = parseInt(item.timeRatio * 100);
            item.type = config.type[item.type];
            isError[index] = false;
          });
          this.setState({
            oldDataSource: json.data.data,
            dataSource: json.data.data,
            isError
          });
        }
        this.setState({
          loading: false
        });
      }
    );
  }

  onClickShowMask(record, index) {
    this.setState({
      maskType: record.desc,
      isShowMask: true,
      listIndex: index
    });
  }

  actionEdit(value, record, index ) {
    let edit = (
      <Icon
        onClick={this.onClickShowMask.bind(this, record, index)}
        type="form"
        size="medium"
        style={{ cursor: 'pointer', color: '#999' }}
      />
    );
    return <Tooltip title='编辑'>{edit}</Tooltip>;
  }

  switch(value, record, index) {
    return (
      <Switch
        checked={this.state.dataSource[index].warnning}
        onChange={value => {
          this.onChangeSwitch(value, index);
        }}
      />
    );
  }

  onChangeSwitch(value, index) {
    let dataSource = _.cloneDeep(this.state.dataSource);
    dataSource[index].warnning = value;
    this.setState({ dataSource });
  }

  onSubmit() {
    this.setState({
      isShowMask: false
    });
    // let data = this.state.dataSource[this.state.listIndex];
    // ajax(
    //   {
    //     api: 'SubmissionData',
    //     data,
    //     method: 'post',
    //     dataType: 'json',
    //     contentType: 'application/json'
    //   },
    //   json => {
    //     if (json.data === 'success') {
    //       this.setState({
    //         isShowMask: false
    //       });
    //     }
    //   }
    // );
    // return;
    // this.setState({
    //   isShowMask: false
    // })
  }
  onClose() {
    this.setState({
      isShowMask: false
    });
  }

  onCloseTag(index) {
    let dataSource = _.cloneDeep(this.state.dataSource);
    dataSource[this.state.listIndex].rule.users.splice(index, 1);
    this.setState({ dataSource });
  }

  addTabPeople() {
    let newState = _.cloneDeep(this.state);
    let peopleValue = newState.peopleValue;
    let isRepeat = false;
    let iskeyInput = true;
    let Reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
    if (!newState.dataSource[this.state.listIndex].rule.users) {
      newState.dataSource[this.state.listIndex].rule.users = [];
    }
    newState.dataSource[this.state.listIndex].rule.users.forEach(
      (item, index) => {
        if (item.email === peopleValue[this.state.listIndex]) {
          isRepeat = true;
        }
      }
    );
    if (
      !isRepeat &&
      peopleValue[this.state.listIndex] !== '' &&
      Reg.test(peopleValue[this.state.listIndex])
    ) {
      newState.dataSource[this.state.listIndex].rule.users.push({
        email: peopleValue[this.state.listIndex]
      });
      newState.peopleValue[this.state.listIndex] = '';
      newState.iskeyInput = true;
    } else {
      newState.iskeyInput = false;
    }
    this.setState(newState);
  }

  onSaveAllData() {
    // Toast.show({
    //   type: 'loading',
    //   duration: 0,
    //   content: '数据加载中',
    //   hasMask: true,
    //   style: { background: 'white', borderColor: 'white' }
    // });
    message.loading('数据加载中', 0.5);
    let dataSource = _.cloneDeep(this.state.dataSource);
    dataSource.forEach((item, index) => {
      item.timeRatio = item.timeRatio / 100;
      item.type = config.value[item.type];
    });
    let params = {};
    params.data = dataSource;
    params.workShop = JSON.parse(sessionStorage.getItem('selectTitle')).value;
    ajax(
      {
        api: 'saveEdit',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: params
      },
      json => {
        if (json.data) {
          this.setState(
            {
              isSave: true
            },
            () => {
              message.success('保存成功！', 1);
            }
          );
        }
      }
    );
  }

  onChangePeople(e) {
    let peopleValue = _.cloneDeep(this.state.peopleValue);
    peopleValue[this.state.listIndex] = e.target.value;
    this.setState({
      iskeyInput: true,
      peopleValue
    });
  }

  checkInputValue(value) {
    if (typeof parseInt(value) === 'number' && value <= 2000) {
      return true;
    }
  }

  onBlurValue() {}

  onChangeStopTime(e) {
    if (this.checkInputValue(e.target.value)) {
      let dataSource = _.cloneDeep(this.state.dataSource);
      dataSource[this.state.listIndex].rule.stopTime = e.target.value;
      this.setState({ dataSource });
    }
  }

  onBlurStopTime(evt) {
    let value = evt.target.value;
    if (value < 30) {
      let dataSource = _.cloneDeep(this.state.dataSource);
      dataSource[this.state.listIndex].rule.stopTime = 30;
      this.setState({ dataSource });
    }
  }

  onChangeTimeRange(e) {
    if (this.checkInputValue(e.target.value)) {
      let dataSource = _.cloneDeep(this.state.dataSource);
      dataSource[this.state.listIndex].rule.timeRange = e.target.value;
      this.setState({ dataSource });
    }
  }

  onBlurTimeRange(evt) {
    let value = evt.target.value;
    if (value < 30) {
      let dataSource = _.cloneDeep(this.state.dataSource);
      dataSource[this.state.listIndex].rule.timeRange = 30;
      this.setState({ dataSource });
    }
  }

  onChangeAlarmInterval(e) {
    if (this.checkInputValue(e.target.value)) {
      let dataSource = _.cloneDeep(this.state.dataSource);
      dataSource[this.state.listIndex].rule.alarmInterval = e.target.value;
      this.setState({ dataSource });
    }
  }

  onBlurAlarmInterval(evt) {
    let value = evt.target.value;
    if (value < 15) {
      let dataSource = _.cloneDeep(this.state.dataSource);
      dataSource[this.state.listIndex].rule.alarmInterval = 15;
      this.setState({ dataSource });
    }
  }

  onSubmitConfirm() {
    this.setState({ visible: false });
  }

  onCloseConfirm() {
    this.setState({ visible: false });
  }
  render() {
    let { dataSource, listIndex } = this.state;
    let iskeyInput = this.state.iskeyInput ? 'success' : 'error';
    return (
      <div className="warningSet-content">
        <Modal
          visible={this.state.visible}
          onOk={this.onSubmitConfirm.bind(this)}
          onCancel={this.onCloseConfirm.bind(this)}
          shouldUpdatePosition
          onClose={this.onCloseConfirm.bind}
          title="您正在试图离开此页面"
        >
          数据未保存,是否保存?
        </Modal>
        <div className="save">
          <Button
            disabled={this.state.dataSource.length === 0}
            style={{ width: 82 }}
            type="primary"
            onClick={this.onSaveAllData.bind(this)}
          >
            保存
          </Button>
        </div>
        <div className="overflow">
          <Table
            loading={this.state.loading}
            rowKey={record => record.process}
            pagination={false}
            dataSource={this.state.dataSource}
            hasBorder={false}
            style={{ marginTop: 40 }}
          >
            <Table.Column
              title={<span style={{ color: '#999999' }}>设备类型</span>}
              dataIndex="desc"
            />
            <Table.Column
              title={<span style={{ color: '#999999' }}>设备利用率目标</span>}
              render={this.targetValue.bind(this)}
            />
            <Table.Column
              title={<span style={{ color: '#999999' }}>报警开关</span>}
              render={this.switch.bind(this)}
              width={100}
            />
            <Table.Column
              title={<span style={{ color: '#999999' }}>报警类型</span>}
              dataIndex="type"
              width={150}
            />
            <Table.Column
              title={<span style={{ color: '#999999' }}>操 作</span>}
              render={this.actionEdit.bind(this)}
              width={100}
            />
          </Table>
        </div>
        <div className={this.state.isShowMask ? 'mask mask-switch' : 'mask'}>
          <div className="mask-show">
            <div className="title">
              <h3>设置报警规则</h3>
              <div>
                <Button
                  type="primary"
                  onClick={this.onSubmit.bind(this)}
                  style={{ marginRight: 10, width: 82 }}
                >
                  确定
                </Button>
                <Button style={{ width: 82 }} onClick={this.onClose.bind(this)}>
                  关闭
                </Button>
              </div>
            </div>
            <div className="mask-content">
              <p className="type">设备类型：{this.state.maskType}</p>
              <div className="send-people">
                <p>
                  <span>报警接收人：</span>
                  <span>
                    <Input
                      style={{width: 220}}
                      value={this.state.peopleValue[this.state.listIndex]}
                      state={
                        !this.state.peopleValue[this.state.listIndex]
                          ? ''
                          : iskeyInput
                      }
                      placeholder="请输入邮箱账号"
                      onChange={this.onChangePeople.bind(this)}
                    />
                    <Button
                      style={{ width: 82 }}
                      style={{ marginLeft: 5 }}
                      type="primary"
                      onClick={this.addTabPeople.bind(this)}
                    >
                      确定
                    </Button>
                  </span>
                </p>
                {_.get(
                  dataSource[this.state.listIndex],
                  'rule.users.length'
                ) ? (
                  <div className="people-content">
                    {dataSource[this.state.listIndex].rule.users.map(
                      (item, index) => {
                        return (
                          <Tag
                            shape="deletable"
                            closable
                            closed={this.state.closed[index]}
                            onClose={this.onCloseTag.bind(this, index)}
                            key={index}
                          >
                            {item.email}
                          </Tag>
                        );
                      }
                    )}
                  </div>
                ) : null}
              </div>
              <div className="warning-rule">
                <p>报警规则：</p>
                <p style={{ marginLeft: 15, marginBottom: 25 }}>
                  最近
                  <Input
                    className="warn-input"
                    onChange={this.onChangeStopTime.bind(this)}
                    onBlur={this.onBlurStopTime.bind(this)}
                    value={_.get(dataSource[listIndex], 'rule.stopTime')}
                  />{' '}
                  分钟内，累计停机超过
                  <Input
                    className="warn-input"
                    onChange={this.onChangeTimeRange.bind(this)}
                    onBlur={this.onBlurTimeRange.bind(this)}
                    value={_.get(dataSource[listIndex], 'rule.timeRange')}
                  />{' '}
                  分钟则触发报警
                </p>
                <p style={{ marginLeft: 15 }}>
                  报警间隔时间
                  <Input
                    className="warn-input"
                    onBlur={this.onBlurAlarmInterval.bind(this)}
                    onChange={this.onChangeAlarmInterval.bind(this)}
                    value={_.get(dataSource[listIndex], 'rule.alarmInterval')}
                  />{' '}
                  分钟
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(connectAll(warningSet));
