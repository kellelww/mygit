/*
  数据舱-》业务数据
*/
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {Button,Row, Col,message,Spin} from "antd";
import { ajax } from 'utils/index';
import { connectAll } from 'common/redux-helpers';
import 'utils/apimap';

class DataBusiness extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource: '',
      loading:false,
    };
    this.showDataDetail = this.showDataDetail.bind(this);
  }
  componentDidMount(){
    this.setState({
      loading:true
    })
    ajax({
      api: "businessdata",
      data: {}
    }, (json) => {
      this.setState({
        loading:false
      })
      this.setState({
        dataSource: json.data.data
      });
    }, () => {
    })
  }
  showDataDetail(name, des){
    location.href = `businessdata-detail.html?type=${name}&name=${escape(`${des}`)}`;
  }

  render(){
    if(!this.state.dataSource){
      return null;
    };
    const businessCard = this.state.dataSource ? this.state.dataSource.map((item, index) => {
      return (
        <li key={index} onClick={() => { this.showDataDetail(item.type, item.des)}} style={{cursor: 'pointer'}}>
          <div><h3>{item.des}</h3><p>{item.tag}</p></div>
          <div className="num-tar">
            <dl>
              <dt>数量（个)</dt>
              <dd style={{color: '#00C1DE'}}>{item.count}</dd>
            </dl>
            <dl>
              <dt>数据（GB)</dt>
              <dd style={{color: '#35B34A'}}>{item.volume}</dd>
            </dl>
          </div>
        </li>
      )
    }):null;
    return(
      <div className="data-business">
      <Row style={{textAlign:'right'}}><div style={{marginTop: '15px'}}><span style={{marginRight: '10px'}}>当前页面数据每12小时更新一次</span><Button type="primary" style={{marginLeft: '15px'}} onClick={() => { window.open('https://workbench.data.aliyun.com/console#/')}}>数据开发</Button></div></Row>
        <ul>
          <Spin spinning={this.state.loading}>
            {businessCard}
          </Spin>
        </ul>
      </div>
    )
  }
};

export default connectAll(DataBusiness);
