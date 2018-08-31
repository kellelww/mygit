'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'utils/index';
import 'utils/apimap';
import { Icon, Tabs, Table } from "antd";
import Head from 'components/head-detail/index';
import './index.scss';

const TabPane = Tabs.TabPane;


class CompilePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource: []
    }
  }
  componentDidMount(){
    ajax({
      api: 'equipments',
      params: {workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value}
    }, (res) => {
      this.setState({
        dataSource: this.returnFormData(res.data.data)
      })
    },
    () => {

    });
  }
  returnFormData(data){
    let dataSource = [];
      data.forEach((item, index) => {
      item.equipmentList.forEach((value, num) => {
        value = Object.assign({}, value, {lineName: item.productLineName});
        dataSource.push(value)
      });
    });
    return dataSource;
  }
  render() {
    return (
      <div className="compile-page">
        <Head title="设备状况概览"/>
        <div className="container">
          <div className="content">
            <div className="content-left">
              <div className="contenter-left">
                <div className="template-img">
                  <iframe src='anlagenzustand.html' style={{border: 'none'}} width="100%" height="100%" className="iframe-view"></iframe>
                </div>
              </div>
            </div>
            <div className="content-right">
              <Tabs>
                <TabPane tab="数据连接" key="1">
                    <Table pagination={false} dataSource={this.state.dataSource} style={{margin:'10px', textAlign:'center'}}>
                      <Table.Column title="产线" dataIndex="lineName"/>
                      <Table.Column title="设备类型" dataIndex="typeTitle"/>
                      <Table.Column title="设备ID" dataIndex="name"/>
                      <Table.Column title="备注" dataIndex="remark"/>
                    </Table>
                </TabPane>
                <TabPane tab="页面展示" key="2">
                    <div>
                    {
                      this.state.dataSource.length > 0 &&
                      this.state.dataSource.map((item, index) => {
                        return (
                          <div key={index} className="parame-list">
                            <h3>{item.name}</h3>
                            <ul>
                              {
                                item.params.length > 0 &&
                                item.params.map((value, num) => {
                                  return (
                                    <li key={num}>{value.title} <Icon type="browse"/></li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                        )
                      })
                    }
                    </div>
                </TabPane>                
              </Tabs>
            </div>
          </div>
        </div>
      </div>);
  }
}

ReactDOM.render(<CompilePage />, document.getElementById('container'));
