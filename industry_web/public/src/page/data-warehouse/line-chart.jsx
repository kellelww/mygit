import React from 'react';
import ReactDOM from 'react-dom';
import { connectAll } from 'common/redux-helpers';
import {Chart, Geom,Axis, Tooltip,Shape } from "bizcharts";
class LineChart extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource: this.props.dataSource//横坐标和竖坐标
    };
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      dataSource: nextProps.dataSource
    });
  }
  render(){
    if(!this.state.dataSource){
      return null
    };
    this.dataSource = [];//横坐标和竖坐标
    let tickValues = [];
    for(const key in this.state.dataSource){
      const newKey = key; 
      this.dataSource.push({genre: newKey, sold:Number(this.state.dataSource[key])});
      tickValues.push(newKey);
    };
    const cols = {
      sold: { alias: '单位：行' },
      genre: {
          type:"time",
          tickCount: tickValues.length,
          alias: ' ', 
          nice: false,}
    };
    const grid = {
      lineStyle: {
        stroke: '#d9d9d9',
        lineWidth: 1,
        lineDash: [2, 2]
      }
    };
    const title = {
      textStyle: {
      fontSize: '12',
      textAlign: 'center',
      fontWeight: 'bold',
      }, 
      position: 'center'
    }
    return(
      <div>
        {this.dataSource.length>0?
        <Chart width={400} height={290} scale={cols} forceFit data={this.dataSource} >
            <Axis name="sold" title/>
            <Axis name="genre" grid={grid}/>
            <Geom type="line" position="genre*sold" size={2} color="#00DBFF" 
              tooltip={['genre*sold', (genre, sold) => {
                return {
                  name: '数据',
                  title: genre,
                  value: sold+"行"
                };
              }]}
            />
            <Tooltip /> 
        </Chart>
        :
        <div style={{textAlign:"center",color:"black",height:"300px",lineHeight:"300px"}}>暂无数据</div>
        }
      </div>
    )

  }
}
export default connectAll(LineChart);
