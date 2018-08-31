'use strict';

import React from 'react';
import { Button, Table, Pagination, Modal, Input, Select, Form, Row, Col, message } from 'antd';
import { ajax } from 'utils/index';
// const { Combobox } = Select;
import { connectAll } from 'common/redux-helpers';
import './index.scss';

const Option = Select.Option;
const FormItem = Form.Item;
// const Toast = Feedback.toast;


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeList: [],
      taskList: [],
      value: 1,
      total: '',
      visible: false,
      disabled: true,
      loading: true,
      // isValue:false
      // itemValue:null
    };
    this.translateTime = this.translateTime.bind(this);
    this.pollingFetch = this.pollingFetch.bind(this);
    this.paginationChange = this.paginationChange.bind(this);
    this.getListNode = this.getListNode.bind(this);
  }
  componentDidMount() {
    this.getListNode();
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    selectTitle = selectTitle ? selectTitle : this.props.workshop;
    this.pollingFetch(1, selectTitle.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
      this.pollingFetch(1, nextProps.workshop);
      window.location.reload();
    }
  }

  pollingFetch(value, data) {

    // Toast.show({
    //     type: 'loading',
    //     duration: 0,
    //     content: '数据加载中',
    //     hasMask: true,
    //     style: { background: 'white', borderColor: 'white' }
    // });
    if (this.nodeNo === "全部") {
      this.nodeNo = "";
    }
    ajax({
      api: 'getHistory',
      params: { pageNo: value, pageSize: 10, workShop: data, nodeNo: this.nodeNo }
    }, (json) => {
      // Toast.hide();
      this.setState({
        loading: false
      })
      this.setState({
        taskList: json.data.data.list,
        total: json.data.data.total
      });
    }, () => {
      this.setState({
        loading: false
      })
    });
  }

  translateTime(time) {
    const cstTime = new Date(time);
    const year = cstTime.getFullYear();
    const month = (cstTime.getMonth() + 1 > 9) ? cstTime.getMonth() + 1 : `0${cstTime.getMonth() + 1}`;
    const day = (cstTime.getDate() > 9) ? cstTime.getDate() : `0${cstTime.getDate()}`;
    const hours = (cstTime.getHours() > 9) ? cstTime.getHours() : `0${cstTime.getHours()}`;
    const min = (cstTime.getMinutes() > 9) ? cstTime.getMinutes() : `0${cstTime.getMinutes()}`;
    const sec = (cstTime.getSeconds() > 9) ? cstTime.getSeconds() : `0${cstTime.getSeconds()}`;
    return `${year}-${month}-${day}  ${hours}:${min}:${sec}`
  }
  paginationChange(value) {
    this.pollingFetch(value, JSON.parse(sessionStorage.getItem("selectTitle")).value);
    this.setState({
      value
    })

  }
  timeChange(value) {
    if (!isNaN(Number(value))) {
      this.setState({
        textValue: value
      });
      if (value === '') {
        this.setState({
          disabled: true
        })
      } else {
        this.verifyData();
      }
    }
  }
  itemClick(item) {
    this.setState({
      textValue: item.upperLimit,
      selectedCode: item.code,
      // itemValue:item.name,
      disabled: false
    });
  }
  verifyData() {
    if (this.state.textValue && this.state.selectedCode) {
      this.setState({
        disabled: false
      });
    }
  }
  onClose() {
    this.setState({
      visible: false
    })
  }
  openCompile() {
    ajax({
      api: 'getNavItem',
      params: { workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value }
    }, (res) => {
      this.setState({
        eqpList: res.data.data.data.plot || ''
      });
    }, () => {

    })
    this.setState({
      visible: true,
      textValue: '',
      // itemValue:null
      // selectedCode:""
    })
  }
  onOk() {
    ajax({
      api: 'editUpperLimit',
      params: { process: this.state.selectedCode, upperLimit: this.state.textValue, workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value }
    }, (res) => {
      if (res.data.message === 'success') {
        // Toast.success('修改成功');
        this.setState({
          visible: false
        });
        this.pollingFetch(1, JSON.parse(sessionStorage.getItem("selectTitle")).value)
      }
    }, () => {

    })
  }
  getListNode() {
    ajax({
      api: 'getNavItem',
      params: { workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value }
    }, (res) => {
      let data = [{ code: '', name: '全部' }].concat(res.data.data.data.plot);
      this.setState({
        nodeList: data
      });
    }, () => {

    })
  }
  changeNodeNo(val) {
    this.nodeNo = val;
  }
  nodeNo = "";

  render() {
    let total = +this.state.total;
    const footer = <div><Button onClick={() => { this.onClose() }}>取消</Button><Button type="primary" onClick={() => { this.onOk() }} disabled={this.state.disabled}>修改</Button></div>
    const formItemLayout = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 12
      }
    };
    const eqpList = this.state.eqpList != undefined && this.state.eqpList.length != 0 ? this.state.eqpList.map((item, index) => {
      return <Option value={item.code} key={index} onClick={() => { this.itemClick(item) }}>{item.name}</Option>
    }) : null;
    const nodeList = this.state.nodeList != undefined && this.state.nodeList.length != 0 ? this.state.nodeList.map((item, index) => {
      return <Option value={item.name} key={index} >{item.name}</Option>
    }) : null;
    return (<div className="capacity-content">
      <div className="capacity-top">
        <div className="top-left">
          <Select
            placeholder="请选择工序"
            onChange={this.changeNodeNo.bind(this)}
            style={{ width: 230 }}
          >
            {nodeList}
          </Select>
          <Button className="button" onClick={this.paginationChange.bind(this, 1)}>确认</Button>
        </div>
        <Button className="compile-button" disabled={!this.state.taskList.length} onClick={() => { this.openCompile() }}>编辑在制时间上限</Button>
      </div>
      <Table dataSource={this.state.taskList} rowKey={record => record.lotNo} style={{ textAlign: 'center' }} loading={this.state.loading} pagination={false}>
        <columns align="left" title="批次号" dataIndex="lotNo" />
        <columns align="left" title="工序" dataIndex="nodeNo" />
        <columns align="left" title="开始时间" dataIndex="startTime" />
        <columns align="left" title="累积在制时间(min)" dataIndex="timeCost" />
        <columns align="left" title="在制时间上限(min)" dataIndex="upperLimitTime" />
      </Table>
      <Row justify="end" style={{ marginTop: "10px" }}>
        <Pagination
          total={total}
          onChange={value => {
            this.paginationChange(value);
          }}
          defaultCurrent={1}
        />

      </Row>
      <Modal
        visible={this.state.visible}
        footer={footer}
        onCancel={this.onClose.bind(this)}
        title="编辑在制时间上限"
        style={{ width: '600px', height: '220px' }}
        destroyOnClose
      >
        <Form>
          <FormItem label="工序" {...formItemLayout} >
            <Select
              placeholder="选择工序"
            >
              {eqpList}
            </Select>
          </FormItem>
          <FormItem label="在制时间上限(分钟)" {...formItemLayout}>
            <Input
              value={this.state.textValue}
              onChange={e => { this.timeChange(e.target.value) }}
            />
          </FormItem>
        </Form>
      </Modal>
    </div>);
  }
}
export default connectAll(Index);
