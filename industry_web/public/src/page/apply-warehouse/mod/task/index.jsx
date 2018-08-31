/*
  应用舱-》我的任务列表
*/
"use strict";

import React from "react";
import {Button,Row, Col,Table,Checkbox,Pagination,Icon,Tooltip,Input,message,Modal,Spin} from "antd";
import { ajax } from "utils/index";
import { connectAll } from "common/redux-helpers";
import "utils/apimap";
import "./index.scss";
const confirm = Modal.confirm;
const Search = Input.Search;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskList: [],//列表数据
      value: 1,//当前页
      total: "",
      tableLoading:false,
      filteredInfo: {
        type:[],
        status:[],
        timeSort:null,
        search:null,
      },//过略的值
      filteredInfoTemp:null,//临时的筛选值
      sortedInfo: null,//排序的值
      deleteId:null,
    };
    this.translateTime = this.translateTime.bind(this);
    this.paginationChange = this.paginationChange.bind(this);
    this.onOk = this.onOk.bind(this);
    this.onDelectSomeTask = this.onDelectSomeTask.bind(this);
  }
  componentDidMount() {
    this.fetchTaskList(1,true);
  }
  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  beforeRouteLeave() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  fetchTaskList(value,state) {//刷新列表
    const {filteredInfo,filteredInfo:{type,status,timeSort,search}} = this.state
    let newStatus=[]
    if(status){
      for(let i=0;i<status.length;i++){
        if(status[i]==="0"){
          newStatus.push("运行中")
        }else if(status[i]==="1"){
          newStatus.push("运行成功")
          
        }else if(status[i]==="-1"){
          newStatus.push("运行失败")
        }
      }
   
    }
    if(state){//定时刷新
      this.setState({
        tableLoading:false
      })
    }else{//刷新列表
      this.setState({
        tableLoading:true
      })
    }
  
    ajax(
      {
        api: "taskList",
        method: "post",
        dataType: "json",
        contentType: "application/json",
        data: {
          pageNum: value,
          pageSize: 10,
          type:type||[],
          status: newStatus||[],
          timeSort:timeSort,
          search:search
        }
      },
      res => {
        this.setState({
          tableLoading:false
        })
        if (
          JSON.stringify(res.data.data.list) !==
          JSON.stringify(this.state.taskList)
        ) {
          this.setState({
            taskList: res.data.data.list,
            total: res.data.data.total
          });
        }
        if (this.timer) {//清楚延时器
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {//设置延时器
          this.fetchTaskList(value,true)
        }, 10000);
      },
      () => {}
    );
  }
  translateTime(time) {//将毫秒转换为年月日时分秒
    if (!time) {
      return "";
    } else {
      let date = new Date(time);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      return Y+M+D+h+m+s;
    }
  }


  //查看详情
  onShowDetail(record) {
    if (record.status === 1) {
      if (record.serviceId === -1) {
        location.href = `#taskManage?id=${record.id}`;
      } else if (record.serviceId === -2) {
        location.href = `result.html?status=success&taskId=${record.id}`;
      } else {
        location.href = `detail.html?taskId=${record.id}`;
      }
    } else if (record.status === 0) {
      return null;
    } else {
      // if(record.serviceId === -2){
      location.href = `result.html?status=fail&id=${record.id}`;
      // }
      // else{
      //   ajax({
      //     api: 'getTaskLog',
      //     data:{ id: record.id},
      //   }, (res) => {
      //     if(res.data){
      //       location.href = res.data;
      //     }
      //   }, () => {

      //  })
      // }
    }
  }
  onDelectSomeTask() {//点击批量删除后的确认弹窗
    confirm({
      title: '确认删除数据?',
      content: '删除后，无法查看该数据',
      onOk: this.onOk,
      onCancel() {
      },
    });
  }
  onSelectItem(selectedRowKeys, selectedRows) {
    this.setState({
      deleteId: selectedRowKeys
    });
  }
  //获取当前页数
  paginationChange(value) {
    this.fetchTaskList(value);
  }
  onOk() {//确认删除数据
      const parame = this.state.deleteId;
      ajax(
        {
          api: "deleteTask",
          data: parame,
          dataType: "json",
          method: "post",
          contentType: "application/json"
        },
        res => {
          message.success("删除成功");
          this.fetchTaskList(this.state.value);
        },
        err => {
          message.error(err);
        }
      );
  }

  //搜索框搜索
  onSearchClick(value) {
    const { filteredInfo } = this.state;
    if (value === undefined || value === "") {
      filteredInfo.search= null
    } else {
      filteredInfo.search= value
    }
    filteredInfo.type = null
    filteredInfo.status = null
    filteredInfo.timeSort = null
    this.setState({
      filteredInfo
    });
    this.fetchTaskList(1);
  }
  //表中的筛选
  searchChange(pagination, filters, sorter){
    const { filteredInfo } = this.state;
    if(filters){
      filteredInfo.type = filters.algorithmType||[]
      let status=[]
      if(filters.status&&filters.status.length>0){
        for(let i=0;i<filters.status.length;i++){
          status.push(filters.status[i])
        }
      }
      filteredInfo.status = status
      if(sorter.order==="ascend"){
        filteredInfo.timeSort = false
      }else{
        filteredInfo.timeSort = true
      }
    }
    this.setState({
      filteredInfo: filteredInfo,
    });
    this.fetchTaskList(1);
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [{
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
    },  {
      title: '应用类型',
      dataIndex: 'algorithmType',
      key: 'algorithmType',
      filters: [
        { text: '工艺参数推荐', value: '工艺参数推荐' },
        { text: '关键因素识别', value: '关键因素识别' },
      ],
      filteredValue: filteredInfo.type || null,
    },
    {
      title: '服务类型',
      dataIndex: 'service',
      key: 'service',
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render:(text,record)=>(
        <span>{this.translateTime(record.createdAt)}</span>
      ),
      sorter: true,
    }, {
      title: '结束时间',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render:(text,record)=>(
        <span>{this.translateTime(record.updateAt)}</span>
      )
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <span>{record.status === 0 ? 
          <div className="post"><Icon type="setting" /><span>运行中</span></div>
        : (record.status === 1 ? 
          <div><Icon type="check-circle" style={{color:'#7ed321'}}/><span>运行成功</span></div> 
        : (record.status ===-1 ? 
          <div><Icon type="close-circle" style={{color:'#f05634'}}/><span>运行失败</span></div> 
        : null))}</span>                                         
      ),
      filters: [
        { text: '运行中', value: 0},
        { text: '运行成功', value: 1 },
        { text: '运行失败', value: -1 },
      ],
      filteredValue: filteredInfo.status || null,
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Tooltip title={record.status === 0 ? "运行中不可查看" : "查看"}>
          <span 
            style={{cursor: 'pointer'}} 
            >
            <Icon type="eye-o" style={record.status === 0 ? {color:'#CCCCCC' }:{color:'#151515'}} 
              onClick={() => { this.onShowDetail(record)}}
            />
          </span>
       </Tooltip >
      ),
    }];
    
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectItem(selectedRowKeys, selectedRows)
      },
    };
    return (
      <div className="apply-warehouse-page">
        <div className="div-row search-margin">
          <Search
            className="search-input"
            placeholder="输入任务名称或服务类型"
            onSearch={this.onSearchClick.bind(this)}
            style={{ width: 200 }}
          />
        </div>
        <Table 
          loading={this.state.tableLoading}
          style={{margin:"20px 10px 10px 10px"}}
          columns={columns} 
          dataSource={this.state.taskList} 
          rowKey={record => record.id}
          onChange={this.searchChange.bind(this)}
          rowSelection={rowSelection}
          pagination={false}/>
        <Row justify="space-between" style={{ marginTop: "10px" }}>
          <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            onClick={() => {
              this.onDelectSomeTask();
            }}
            disabled={this.state.deleteId&&this.state.deleteId.length>0?false:true}
          >
            批量删除
          </Button>
          <Pagination
            defaultCurrent={1}
            onChange={value => {
              this.paginationChange(value);
            }}
            total={Number(this.state.total)}
          />
        </Row>
      </div>
    );
  }
}
export default connectAll(Index);
