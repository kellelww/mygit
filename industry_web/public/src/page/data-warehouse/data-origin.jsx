/*
  数据舱-》原始数据
*/
'use strict';

import React from 'react';
import { Button, Table, Icon, Pagination, Row, Col,Tooltip} from 'antd';
import { ajax } from 'utils/index';
import FullBox from './full-box';
import 'utils/apimap';
import { connectAll } from 'common/redux-helpers';

class DataBase extends React.Component {
  constructor(props){
    super(props);
    this.state={
      dataSource: "",
      selectedLength: 0,
      value: 1,
      total: 0,
      baseTotal:1,
      loading:false,//列表的loading
      detailLoading:false,//详情列表的loading
    };
    this.fetchBusinessDetail = this.fetchBusinessDetail.bind(this);
    this.paginationChange = this.paginationChange.bind(this);
  }
  componentDidMount(){
    this.fetchBusinessDetail(1);
  }
  fetchBusinessDetail(num){
    this.setState({
      loading:true
    })
    ajax({
      api: "baseTable",
      params: {pageNum: num, pageSize: 10}
    }, (json) => {
      this.setState({
        loading:false
      })
      this.setState({
        dataSource: json.data.data.list,
        total: json.data.data.total
      });
    }, () => {

    })
  }
  paginationChange(value){
    this.fetchBusinessDetail(value);
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
  detailInfo(name, num, size){
    this.setState({
      detailLoading:true
    })
    ajax({
      api: "baseDataDetail",
      params: { name, pageNum: num, pageSize: size }
    }, (json) => {
      this.setState({
        detailLoading:false
      })
      if(json.data.data && json.data.data.list.length > 0){
        const data = [];
        json.data.data.list.forEach((item, index) => {
          data[index] = Object.assign({}, item, { index: index + 1 })
        })
        this.setState({
          detailData: data,
          name,
          baseTotal: json.data.data.total
        });
      }
      this.setState({
        isShowMask: true
      })
    }, () => {

    })
  }
  closeMasklayer(){
    this.setState({
      isShowMask: false
    });
  }
  detailPaginationChange(value){
    this.detailInfo(this.state.name, value, 10)
  }
  render() {
    if(!this.state.dataSource || (this.state.dataSource && this.state.dataSource.length === 0)){
      return <div className="data-table"><FullBox /></div>
    };
    const dataSource = [];
    this.state.dataSource.forEach((item, index) => {
      dataSource.push(Object.assign({}, { id : index }, item))
    });
    const columnsList = [{
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width:500,
      }, {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
        width:300,
      }, {
        title: '更新时间',
        dataIndex: 'updateAt',
        key: 'updateAt',
        width:300,        
      }, {
        title: '状态',
        key: 'status',
        width:200,        
        render: (text, record) => (
          <span>{record.status === 0 ? 
            <div><Icon type="clock-circle"/><span>校验中</span></div> 
          : (record.status === 1 ? 
            <div><Icon type="check-circle" style={{color:'#7ed321'}}/><span>校验成功</span></div> 
          : (record.status ===-1 ? 
            <div><Icon type="close-circle" style={{color:'#f05634'}}/><span>校验失败</span></div> 
          : null))}</span>                                         
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <Tooltip title="详情">
            <span 
              style={{cursor: 'pointer'}}
              onClick={() => { this.detailInfo(record.name, 1, 10)}}>
              <Icon type="form" />
            </span>
         </Tooltip >
        ),
    }];
    const columnsDetail = [{
        title: '',
        dataIndex: 'index',
        key: 'index',
      }, {
        title: '字段',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      }, {
        title: '描述',
        dataIndex: 'comment',
        key: 'comment',
    }];
    return (<div className="data-table">
    <Row style={{textAlign:'right'}}><div style={{marginTop: '15px'}}><span style={{marginRight: '10px'}}>当前页面数据每12小时更新一次</span><Button type="primary" style={{marginLeft: '15px'}} onClick={() => { window.open('https://workbench.data.aliyun.com/console#/')}}>数据开发</Button></div></Row>
      <Table 
        loading={this.state.loading}
        columns={columnsList} 
        dataSource={dataSource} 
        rowKey={record => record.dataCount}
        pagination={false}/>
      <Row style={{marginTop:'10px',textAlign:'right'}}>
        <Pagination 
          defaultCurrent={1} 
          showQuickJumper 
          onChange={(value) => {this.paginationChange(value)}} 
          total={Number(this.state.total)}/>
      </Row>
      <div className={ this.state.isShowMask ? 'mask-details is-mask-active' : 'mask-details close-active'}>
        <Row 
          justify="space-between" 
          align="center" 
          style={{border: '1px solid #DCDCDC',overflow:"hidden"}}>
          <h3 style={{display:"inline-block",float:"left"}}>查看详情</h3>
          <Button style={{margin: '5px 20px 0 25px',float:"right"}} onClick={() => {this.closeMasklayer()}}>关闭</Button>
        </Row>
        <div className="detail-content">
          <Table 
            loading={this.state.detailLoading}
            columns={columnsDetail} 
            dataSource={this.state.detailData}  
            rowKey={record => record.name}
            pagination={false}/>
        </div>
        <div className="pagination">
          <Pagination 
            defaultCurrent={1} 
            onChange={(value) => {this.detailPaginationChange(value)}} 
            shape="no-border" simple 
            total={Number(this.state.baseTotal)}/>
        </div>
      </div>
    </div>);
  }
}
export default connectAll(DataBase);
