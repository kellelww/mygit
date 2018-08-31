'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'utils/index';
// import 'utils/apimap';
// import { Button, Icon, Table, Grid, Feedback } from "antd";
import Productline from './productline';
import './index.scss';

// const { Row, Col } = Grid;
// const Toast = Feedback.toast;


class Anlagenzustand extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     
    };
  }
  componentDidMount(){
    ajax({
      api: 'equipments',
      params: {workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value}
    }, (res) => {
      this.setState({
        equipmentsList: res.data.data
      })
    },
    () => {

    });
  }
  render() {
    const productline = this.state.equipmentsList && this.state.equipmentsList.length > 0 ? this.state.equipmentsList.map((item, index) => {
      return <div key={index}><Productline data={item} /></div>
    }):null;
    return (
      <div className="anlagenzustand-page">
         {productline}
      </div>
    )
  }
}

ReactDOM.render(<Anlagenzustand />, document.getElementById('container'));
