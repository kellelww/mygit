'use strict';

import React from 'react';
import { Button, Search, Row, Col, Table, Checkbox, Pagination, Input} from 'antd';
import { ajax } from 'utils/index';
import 'utils/apimap';
class Index extends React.Component {
  constructor(props){
    super(props);
    this.state={
      taskDetail: ''
    };
  }
  componentDidMount(){
    let taskId = '';
    if(window.location.search){
      this.taskIdArr = window.location.search.split('=');
      const status = this.taskIdArr[1].split('&')[0];
      taskId = this.taskIdArr[2];
      if(status === 'success'){
          ajax({
          api: 'taskDetail',
          params: { id:taskId }
        },
        (res) => {
          this.setState({
            taskDetail: res.data.data
          });
        },
        () => {
        });
      } else {
        ajax({
          api: 'getTaskLog',
          params:{ id: taskId},
        }, (res) => {
          this.setState({
            failReason: String(res.data.data)
          })
        }, () => {

       })
      }
      
    } else {

    }
  }
  goBack(){
    history.back();
  }
  render() {
    if(!this.state.taskDetail && !this.state.failReason){
      return null
    };
    const result = JSON.stringify(this.state.taskDetail, null, 10);
    return (<div className="task-page">
      {
        this.state.taskDetail &&
        <Input multiple value={result} style={{width:'100%', height: '100%'}} readOnly/>
      }
      {
        this.state.failReason &&
        <Input multiple value={this.state.failReason} style={{width:'100%', height: '100%'}} readOnly/>
      }
         
    </div>)
  }
}
export default Index;
