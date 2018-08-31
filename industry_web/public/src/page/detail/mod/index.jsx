'use strict';

import React from 'react';
import { Button, Search, Row, Col, Table, Checkbox, Pagination } from 'antd';
import Head from 'components/head-detail/index';
import Histogram from './histogram';
import { ajax } from 'utils/index';
import 'utils/apimap';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskDetail: ''
    };
    this.translateTime = this.translateTime.bind(this);
    this.renderCondition = this.renderCondition.bind(this);
  }
  componentDidMount() {
    let taskId = '';
    if (window.location.search) {
      this.taskIdArr = window.location.search.split('?');
      taskId = this.taskIdArr[1].split('=')[1];
      ajax({
        api: 'taskDetail',
        params: { id: taskId }
      },
        (res) => {
          this.setState({
            taskDetail: res.data.data
          });
        },
        () => {
        });
    } else {

    }
  }
  goBack() {
    history.back();
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
  renderCondition(filter) {
    if (filter.type === 0 ) {
      const value = filter.values.join(',');
      return (
        <div className="row-text">
          <span className="label-name">{filter.name}</span>
          {value}
        </div>
      )
    } else if (filter.type === 2|| filter.type === 1) {
      return (
        <div className="row-text">
          <span className="label-name" >{filter.name}</span>
          {filter.range.min}~{filter.range.max}</div>
      )
    }
  }
  renderTarget() {
    const target = this.state.taskDetail.targets;
    if (target.type === 1) {
      return (
        <div>
          <div className="row-text">
            <span className="label-name">分析类型</span>
            {target.name}
          </div>
          <div className="row-text">
            <span className="label-name" >期望值</span>
            {target.range.min}~{target.range.max}
          </div>
          <div className="row-text">
            <span className="label-name" >正样本量</span>
            {this.state.taskDetail?this.state.taskDetail.positive:''}
          </div>
          <div className="row-text">
            <span className="label-name" >负样本量</span>
            {this.state.taskDetail?this.state.taskDetail.negative:''}
          </div>
          <div className="row-text">
            <span className="label-name" >总样本量</span>
            {this.state.taskDetail?this.state.taskDetail.sampleCount:''}
          </div>
          
        </div>
      )
    } else {
      const value = target.values.join(',');
      return (
        <div>
          <div className="row-text">
            <span className="label-name">分析类型</span>
            {target.name}
          </div>
          <div className="row-text">
            <span className="label-name" >期望值</span>
            {value}
          </div>
        </div>
      )
    }
  }
  render() {
    if (!this.state.taskDetail) {
      return null
    };
    const { taskDetail } = this.state;
    const renderCondition = taskDetail.filters.map((item, index) => {
      return <div key={index}>{this.renderCondition(item)}</div>;
    });

    return (<div className="task-page">
      <Head title={this.state.taskDetail.name || ''} />
      <div className="detail-content">
        <div className="detail-info">
          <div className="row-text"><span className="label-name">任务类型</span> {taskDetail.algorithmType}</div>
          <div className="row-text"><span className="label-name">服务类型</span> {taskDetail.service}</div>
          {renderCondition}
          {this.renderTarget()}
        </div>

        <div className="chart-data">
          <div className="chart">
            <Histogram dataSource={this.state.taskDetail.result} />
          </div>
        </div>
      </div>
    </div>)
  }
}
export default Index;
