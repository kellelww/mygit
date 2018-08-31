import React, { Component } from 'react';
// import { Step, Tab, Button, Table, Icon, Pagination, Feedback } from '@alife/next';
import { Button, Table, Icon, Pagination, message } from 'antd';
import _ from 'lodash';
import { ajax } from 'utils/index';
import 'utils/apimap';
import './app-data.scss';

class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowMask: false,
      rowSelection: {
        onChange: this.onSelector.bind(this),
        onSelect: this.onSelect.bind(this),
        selectedRowKeys: [0],
        // mode: 'single'
        type: 'radio'
      },
      dataSource: {},
      detailSource: [],
      name: '',
      type: ""
    }
    this.action = (value, record, index) => {
      return <Icon type="eye-o" className="watch-icon" onClick={this.onWatchBrowse.bind(this, record)} />;
    };
    this.description = (value, record, index) => {
      return <span>{record.comment}</span>;
    };
  }

  componentDidMount() {
    this.getDataSource();
  }

  getDataSource(pageNum, pageSize) {
    pageSize = pageSize ? pageSize : 10;
    pageNum = pageNum ? pageNum : 1;
    ajax({
      api: 'getDataSource',
      params: {
        pageSize: pageSize,
        pageNum: pageNum
      }
    }, (res) => {
      if (res.data) {
        res.data.data.list.forEach((item, index) => {
          item.key = index;
        })
        let newState = _.cloneDeep(this.state);
        newState.total = res.data.data.total;
        newState.dataSource = res.data.data;
        newState.rowSelection.selectedRowKeys = [0];
        newState.id = res.data.data.list[0].id;
        this.props.getValue({ table: newState.id, id: window.localStorage.getItem('id') }, 1, true);
        this.setState(newState);
      }
    })
  }

  onSelect(record) {
    this.props.getValue({ table: record.id, id: window.localStorage.getItem('id') }, 1, true);
    let newState = _.cloneDeep(this.state);
    newState.id = record.id;
    this.setState(newState);
  }

  onSelector(arr, array) {
    let newState = _.cloneDeep(this.state);
    newState.rowSelection.selectedRowKeys = arr;
    this.setState(newState);
  }

  getDetailSource(id) {
    // Toast.show({
    //   type: 'loading',
    //   duration: 0,
    //   content: '数据加载中',
    //   hasMask: true,
    //   style: { background: 'white', borderColor: 'white' }
    // });
    return new Promise((resolve, reject) => {
      ajax({
        api: 'detailSource',
        method: 'get',
        params: {
          name: id
        }
      }, (res) => {
        let list = res.data.data && res.data.data.map((item, index) => {
          item.id = index + 1;
          return item;
        })
        // Toast.hide();
        resolve(list);
      })
    })
  }

  onWatchBrowse(record) {
    this.props.getValue({ table: record.id, id: window.localStorage.getItem('id') }, 1, true);
    this.getDetailSource(record.id).then((data) => {
      let newState = _.cloneDeep(this.state);
      newState.rowSelection.selectedRowKeys = [record.key];
      newState.detailSource = data;
      newState.isShowMask = true;
      this.setState(newState);
    })
  }

  onClose() {
    let newState = _.cloneDeep(this.state);
    newState.isShowMask = false;
    this.setState(newState);
  }

  onChangePageNum(pageNum) {
    this.getDataSource(pageNum, null, this.state.type);
  }

  render() {
    return (
      <div className="app-data-content">
        <Table dataSource={_.get(this.state, 'dataSource.list')}
          hasBorder={false}
          primaryKey="key"
          pagination={false}
          rowSelection={this.state.rowSelection}>
          <Table.Column align="left" title="数据表名称" dataIndex="name" />
          <Table.Column align="left" title="创建时间" dataIndex="createAt" />
          <Table.Column align="left" title="更新时间" dataIndex="updateAt" />
          <Table.Column align="right" title="操作" render={this.action} width={75} />
        </Table>
        <div className="Pagination">
          <Pagination  defaultCurrent={1} total={this.state.total} shape="arrow-only" onChange={this.onChangePageNum.bind(this)} />
        </div>
        <div className={this.state.isShowMask ? 'mask-details is-mask-active' : 'mask-details close-active'}>
          <div className="mask-button">
            <Button className="close" onClick={this.onClose.bind(this)}>返回</Button>
          </div>
          <div className="table-mask">
            <Table dataSource={_.get(this.state, 'detailSource')}
              rowKey={record=>record.name}
              hasBorder={false}>
              <Table.Column align="left" title="" dataIndex="id" width={100} />
              <Table.Column align="left" title="字段" dataIndex="name" />
              <Table.Column align="left" title="类型" dataIndex="type" />
              <Table.Column align="left" title="描述" render={this.description} width={100} />
            </Table>
          </div>
        </div>
      </div>
    )
  }
}
export default Data;
