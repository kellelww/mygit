'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Card, Progress, Icon } from "antd";

class Productline extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data,
      hide:{}
    };
  }
  closeWarningInfo(index){
   this.setState({
       hide: Object.assign({}, this.state.hide, {[index]: true})
   });
  }
  render() {
      const { productLineName, equipmentList } = this.state.data;
      const cardList = equipmentList ? equipmentList.map((item, index) => {
          const lightStatus = item.statusLight;
          return (
              <div style={{float: 'left', position: 'relative', top: '10px'}} key={index}>
                <div className={`${item.warning && !this.state.hide[index] ? 'warning-info' : 'warning-info-hide'}`}>
                    <p>
                        <Icon type="yujing"/>
                        <span style={{fontSize:'12px'}}>状态异常</span>
                    </p>
                    <p>
                        <Icon type="guanbi" style={{fontSize: '12px',color: '#FFFFFF', cursor: 'pointer'}} onClick={() => {this.closeWarningInfo(index)}}/>
                    </p>
                </div>
                <Card style={{width: 177, height: 120, margin: '10px', cursor:'pointer'}}
                    className={`${item.warning && !this.state.hide[index] ? "warning-card" : ''}`}
                    title={item.remark}
                    onClick={() => {window.open( `apply-warehouse.html#/eqpEff?type=${item.type}&name=${item.name}`)}}
                    extra={<div className="statusLightGroup"><p className={`statusLight ${lightStatus[0] === '1' ? 'red' : ''}`}></p><p className={`statusLight ${lightStatus[1] === '1' ? 'green' : ''}`}></p><p className={`statusLight ${lightStatus[2] === '1' ? 'yellow' : ''}`}></p></div>}>
                    {
                        item.params.map((value, index) => {
                            const num = (value.value * 100).toFixed(1);
                            return (
                                <div key={index}>
                                    <span style={{display: 'inlineBlock', paddingRight: '10px', color: '#66B0E9'}}>{value.title}</span>
                                    <Progress percent={Number(num)} state={value.status === 1 ? 'success' : 'error'}/>
                                </div>
                            )
                        })
                    }
                </Card>
            </div>
          )
      }): null
    return (
      <div className="productLine">
         <h3 className="productLine-name">{`产线${productLineName}`}</h3>
         <div className="productLine-info">{cardList}</div>
      </div>
    )
  }
}

export default Productline;
