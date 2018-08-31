/*
  数据舱-》 数据概览
*/
'use strict';

import React from 'react';
import { Select, message, Row, Col, Button, Spin } from "antd";
import LineChart from './line-chart.jsx';
import { ajax } from 'utils/index';
import 'utils/apimap';
import { connectAll } from 'common/redux-helpers';

const Option = Select.Option;

class DataOverView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overview: '',
      loading: false
    };
    this.equipmentChange = this.equipmentChange.bind(this);
    this.defaultMonitorSelected = this.defaultMonitorSelected.bind(this);
  }
  componentDidMount() {
    this.setState({
      loading: true
    })
    ajax({
      api: 'overview',
      params: {}
    }, (json) => {
      this.setState({
        loading: false
      })
      this.setState({
        overview: json.data.data
      });
    }, () => {
    });
    ajax({
      api: 'monitorByType',
      params: {}
    }, (json) => {
      if (json.data && String(json.data) !== '') {
        this.setState({
          monitorList: json.data.data
        });
        this.defaultMonitorSelected(json.data.data);
      }
    }, () => {
    });
  }
  defaultMonitorSelected(data) {
    data.forEach((item, index) => {
      this.equipmentChange(item['type'], item.data[0])
    })
  }
  equipmentChange(type, name){
    let tempname = ""
    if(name){
      tempname=name
    }
    ajax({
      api:'monitorDetailByType',
      params:{ type: type, name: tempname}
    },(json) => {
      this.setState({
        monitorDataSource: Object.assign({}, this.state.monitorDataSource, {
          [type]: json.data.data
        }),
        monitorValue: Object.assign({}, this.state.monitorValue, {
          [type]: name
        })
      });
    }, () => {
    });
  }
  render() {
    if (!this.state.overview) {
      return null
    };
    const overview = this.state.overview ? this.state.overview.map((item, index) => {
      return <div className="number-overview" key={index}>
        <h2>{item.name}</h2>
        <div className="number-overview-dl">
          <dl style={{ marginRight: '25px' }}>
            <dt>数量（个）</dt>
            <dd style={{ color: '#00C1DE' }}>{item.count}</dd>
          </dl>
          <dl>
            <dt>总数据(GB)</dt>
            <dd>{item.volume}</dd>
          </dl>
        </div>
      </div>
    }) : null;
    const monitorList = (this.state.monitorList) ? this.state.monitorList.map((item, index) => {
      return <div className="chart-overview-chart" key={index}>
        <div className="title-select">
          <h2>{item.name}</h2>
          <Select 
            placeholder="请选择"
            value={this.state.monitorValue ? this.state.monitorValue[item.type] : ''}>
            {item.data.map((a, b) => {
              return <Option key={b} value={a} onClick={() => { this.equipmentChange(item.type, a) }} >{a}</Option>
            })}
          </Select>
        </div>
        <LineChart dataSource={this.state.monitorDataSource ? this.state.monitorDataSource[item.type] : []} />
      </div>
    }) : null;
    return (
      <div className="data-overview">
        <Row style={{ textAlign: 'right' }}><div style={{ marginTop: '15px' }}><span style={{ marginRight: '10px' }}>当前页面数据每12小时更新一次</span><Button type="primary" style={{ marginLeft: '15px' }} onClick={() => { window.open('https://workbench.data.aliyun.com/console#/') }}>数据开发</Button></div></Row>
        <div>
          <Spin spinning={this.state.loading}>{overview}</Spin>
          <div className="chart-overview" >
            {monitorList}
          </div>
        </div>
      </div>
    )
  }
};

export default connectAll(DataOverView);
