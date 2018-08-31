'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Feedback, Icon, message } from "antd";
// import { connectAll } from 'common/redux-helpers';
import { ajax } from 'utils/index';
import 'utils/apimap';
import './index.scss';

class Head extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      iconUp: false
    };
  }
  componentWillMount(){
    window.addEventListener('click', () => {
      this.setState({
        iconUp: false
      });
    }, false)
  }
  writeOff(){
    ajax({
      api: "loginOut",
      data: {}
    }, (res) => {
      message.success("注销成功");
      setTimeout(() => {
        location.href = "login.html"
      }, 1000)
    });
  }
  iconClick(e){
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      iconUp: !this.state.iconUp
    });
  }
  render() {
    const uersName = localStorage.userName || null;
    return (
        <div className="login-page-head">
            <div className="login-page-header">
            <div className="header-logo" onClick={() => { history.back()}}>
              <span className="head-logo"><i className='iconfont little-logo'></i></span>
              <span><Icon type="left" style={{fontSize:24, color: '#fff'}}/></span>
              <h3>{window.localStorage.getItem("name") || null}</h3>
            </div>
        <div className="login-info-show">
          <div className="user-img" onClick={(e) => { this.iconClick(e)}}></div>
          {
            (this.state.iconUp) &&
            <ul className="handle-list">
              <li>{uersName}</li>
              <li onClick={() => { this.writeOff()}}><Icon type="tuichu" style={{marginRight: '10px'}}/>退出</li>
            </ul>
          }

          </div>
        </div>
    </div>)
  }
}

export default Head;
