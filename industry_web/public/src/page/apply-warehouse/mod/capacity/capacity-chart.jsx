import React, { Component } from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  // Frame,
  transform,
  Guide,
  Shape,
  Label
} from "bizcharts";
import DataSet from '@antv/data-set';
import { connectAll } from "common/redux-helpers";
const _ = require('lodash');
import { ajax } from "utils/index";
import "./index.scss";

class CapacityChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: "",
      dataIndexArr: [],
      style: {},
      timeEff: {},
      type: "",
      allChartsData: {
        plot: []
      },
      singleChartsData: [],
      NavItem: [],
      AllSingleData: {},
      frame: [],
      listIndex: 0,
      ChartsData:true
    };
    this.colorGroup = {};
  }

  componentDidMount() {
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    selectTitle = selectTitle ? selectTitle : this.props.workshop;
    this.getChartsData({workShop: selectTitle.value});
    // this.setState({
    //   AllSingleData:[]
    // },() => {
    // this.getChartsData({workShop: selectTitle.value});
    // })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
    this.getChartsData({ workShop: nextProps.workshop });
      //  this.setState({
      //   AllSingleData:[]
      // },() => {
      // this.getChartsData({workShop: selectTitle.value});
      // })
    }
  }

  //#5DADE2  #52BE80  #F4D03F #EB984E  #AF7AC5 #EC7063 #48C9B0 #8A8BFF #FE787D #80CC74
  //["#5DADE2","#52BE80","#F4D03F","#EB984E","#AF7AC5","#EC7063","#48C9B0","#8A8BFF","#FE787D","#80CC74"]
  returnRandomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    // alert(123)
    // // // console.log(decodeColor('#5DADE2'))

    return `rgb(${r},${g},${b})`;
  }

  // 能处理 #axbycz 或 #abc 形式
  decodeColor(hex) {
    var color = [],
      rgb = [];

    hex = hex.replace(/#/, "");

    if (hex.length == 3) {
      // 处理 "#abc" 成 "#aabbcc"
      var tmp = [];
      for (var i = 0; i < 3; i++) {
        tmp.push(hex.charAt(i) + hex.charAt(i));
      }
      hex = tmp.join("");
    }

    for (var i = 0; i < 3; i++) {
      color[i] = "0x" + hex.substr(i * 2, 2);
      rgb.push(parseInt(Number(color[i])));
    }
    return "rgb(" + rgb.join(",") + ")";
  }

  renderDiffColor(length) {
    let colorArr = [];
    // if(window.localStorage.colorArr){
    //   if(JSON.parse(window.localStorage.colorArr).length === length){
    //     colorArr = JSON.parse(window.localStorage.colorArr)
    //   } else{
    //     let count = 0;
    //     while(count < length){
    //       const color = this.returnRandomColor();
    //       if(colorArr.indexOf(color) === -1){
    //         colorArr.push(color);
    //         count ++ ;
    //       }
    //     };
    //     window.localStorage.colorArr = JSON.stringify(colorArr);
    //   }
    // } else {
    //   let count = 0;
    //   while(count < length){
    //     const color = this.returnRandomColor();
    //     if(colorArr.indexOf(color) === -1){
    //       colorArr.push(color);
    //       count ++ ;
    //     }
    //   };
    //   window.localStorage.colorArr = JSON.stringify(colorArr);
    // }
    let colorSource = [
      "#5DADE2",
      "#52BE80",
      "#F4D03F",
      "#EB984E",
      "#AF7AC5",
      "#EC7063",
      "#8A8BFF",
      "#FE787D",
      "#00C6BA",
      "#7DD97C"
    ];
    let count = 0;
    while (count < length) {
      const color = this.decodeColor(colorSource[count]);
      if (colorArr.indexOf(color) === -1) {
        colorArr.push(color);
        count++;
      }
    }
    window.localStorage.colorArr = JSON.stringify(colorArr);

    return colorArr;
  }
  returnColorMap(colorGroup, plot) {
    const colorMap = {};
    plot.forEach((item, index) => {
      colorMap[item.processName] = colorGroup[index];
    });
    return colorMap;
  }

  handleGetG2Instance(chart) {
    this.chart = chart;
  }

  getSingleChartsInitData(data) {
    ajax(
      {
        api: "lately",
        params: data
      }, 
      json => {
        if (json.data.data) {
          let newState = _.cloneDeep(this.state);
          let dataIndexArr = _.cloneDeep(this.state.dataIndexArr);
          dataIndexArr = [0];
          newState.AllSingleData[json.data.data.processName] = json.data.data.plot;
          newState.dataIndexArr = dataIndexArr;
          this.setState(newState, () => {
              this.singleChartsData();
          });
        }else{
          this.setState({
            dataIndexArr:[],
            // AllSingleData:[],
            frame:null
          })
        }
      }
    );
  }
  getSingleChartsData(data) {
    ajax(
      {
        api: "lately",
        params: data
      }, 
      json => {
        if (json.data.data) {
          let newState = _.cloneDeep(this.state);
          newState.AllSingleData[json.data.data.processName] = json.data.data.plot;
          this.setState(newState, () => {
            this.singleChartsData();
          });
        }
        // else{
        //   this.setState({
        //     // dataIndexArr:[],
        //     frame:null
        //   })
        // }
        this.setState({
          ChartsData:true
        })
      }
    );
  }
  singleChartsData() {
    let AllSingleData = _.cloneDeep(this.state.AllSingleData);
    let singleChartsData = _.cloneDeep(this.state.singleChartsData);
    let arr = [];
    _.forEach(AllSingleData, (item, key) => {
      arr.push(key);
      singleChartsData = item.map((ele, index) => {
        let obj = singleChartsData[index] ? singleChartsData[index] : {};
        obj[key] = Number(ele.number);
        obj.time = ele.date;
        return obj;
      });
    });
    if(arr.length>0){
      var ds = new DataSet();
      var dv = ds.createView().source(singleChartsData);
      dv.transform({
        type: 'fold',
        fields: arr, // 展开字段集
        key: 'type',                   // key字段
        value: 'value',               // value字段
        retains: ["time"]        // 保留字段集，默认为除 fields 以外的所有字段
      });
    }else{
      var dv = null;
    }
    let colsData = {
      time: {
        alias: "最近30天在制数量变化趋势（每日23:45分快照）",
        // type: "timeCat",
        // nice: false,
        // mask: "yyyy-mm-dd",
        // tickCount: 23,
        range: [0, 1]
      },
      value: {
        alias: "在制数量(千片)"
      },
      type: {
        alias: "类型",
        formatter: val => {
          return val;
        }
      }
    };
    this.setState({ singleChartsData, frame:dv, colsData });
  }
  getChartsData(data) {
    ajax({
      api: "current",
      params:data
    },(json) => {
      if(json.data.data) {
        let processName = {
          processName: json.data.data.plot[0].processName,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        };
        this.setState({
          AllSingleData:{}
        },() =>{
          this.getSingleChartsInitData(processName);  
        })
        const colorGrounp = this.renderDiffColor(json.data.data.plot.length || 0);
        const colorMap = this.returnColorMap(colorGrounp, json.data.data.plot);
        this.setState({
          allChartsData: json.data.data,
          colorMap
        });
      } else {
        this.setState({
          allChartsData: {
            plot: []
          },
          frame: [],
          colsData: {}
        })
      }

    })
  }

  onPlotClick(evt) {
    const ChartsData = _.cloneDeep(this.state.ChartsData);
    if(ChartsData){
      this.colorGroup[this.type] = this._color;
      let ChartIndex = null;
      this.state.allChartsData.plot.forEach((item, index) => {
        if (item.processName === this.type) {
          ChartIndex = index;
        }
      });
      let name = this.type;
      let dataIndexArr = _.cloneDeep(this.state.dataIndexArr);
      let AllSingleData = _.cloneDeep(this.state.AllSingleData);
      let number = dataIndexArr.indexOf(ChartIndex);
      let isCheck = false;
      if (number !== -1) {
        dataIndexArr.splice(number, 1);
        delete AllSingleData[name];
        isCheck = false;
      } else {
        if (dataIndexArr.length < 5) {
          dataIndexArr.push(ChartIndex);
          isCheck = true;
        }
      }
      this.setState(
        {
          AllSingleData,
          dataIndexArr,
          timeEff: {
            processName: this.type,
            workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
          }
        },
        () => {
          this.singleChartsData();
          if (isCheck) {
            this.setState({
              ChartsData:false
            })
            this.getSingleChartsData(this.state.timeEff);
          }
        }
      );
    }else{

    }
  }

  onTooltipChange(evt) {
    evt.items[0].value = `${evt.items[0].value}千片`;
    this.type = evt.items[0].title;
    this._color = evt.items[0].color;
  }
  
  returnColor(key) {
    return this.state.colorMap[key];
  }

  tooltipChange(ev) {
    ev.items.forEach((item, index) => {
      item.value = `${item.value}千片`;
    });
  }

  render() {
    const scale = {
      "processName":{ alias:"工序" },
      "number":{ alias:"在制数量(千片)" }
    };
    const grid = {
      line: {
        stroke: "#e6e6e6",
        lineHeight: 1,
        lineDash: [0, 0]
      }
    };
    const style = {
      lineWidth: 3
    };
    // console.log(this.state.frame,"frame");
    // console.log(this.state.colsData,"colsData");
    let { dataIndexArr, allChartsData } = this.state;
    return (
      <div className="capacity-content">
        <div className="capacity-info">
          <h4>更新时间：{allChartsData.lastUpdate}</h4>
        </div>
        <div className="current-time">
          {/*<Chart
            height={0}
            onPlotClick={this.onPlotClick.bind(this)}
            onTooltipChange ={this.onTooltipChange.bind(this)}
            plotCfg={{ margin: [30, 85, 60, 60] }}
            forceFit={true}
            data={allChartsData.plot}
            scale={scale}
            onGetG2Instance={chart => {
              this.handleGetG2Instance(chart);
            }}

            plotCfg={{ margin: [60, 30, 60, 80] }}
          >
            <Axis name="number" title />
            <Axis name="processName" title />
            <Tooltip />
            <Geom
              type="interval"
              position="processName*number"
              selected
              label={[
                "number",
                {
                  custom: true,
                  renderer: function(text, item, index) {
                    let src = null;
                    let IMG = "";
                    if (dataIndexArr.indexOf(index) !== -1) {
                      src =
                        "https://img.alicdn.com/tfs/TB1BgLAd8fH8KJjy1XbXXbLdXXa-28-24.png";
                      IMG = `<img style="width:14px" src="${src}" />`;
                    }
                    return ``;
                  }
                }
              ]}
              shape="gradientColor"
            />
          </Chart>*/}
          <Chart
            height={280}
            onPlotClick={this.onPlotClick.bind(this)}
            onTooltipChange ={this.onTooltipChange.bind(this)}
            plotCfg={{ margin: [30, 85, 60, 60] }}
            forceFit={true}
            data={allChartsData.plot}
            scale={scale}
            onGetG2Instance={chart => {
              this.handleGetG2Instance(chart);
            }}
            placeholder={
              <div style={{
                width: "100%",
                height: "100%",
                background: "url(https://img.alicdn.com/tfs/TB16Q2LatfJ8KJjy0FeXXXKEXXa-204-166.png) center no-repeat",
                backgroundSize: "102px 83px",
                textAlign: "center",
                color: "#898989",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "125px"
              }}>
                暂无相关数据
              </div>
            }
            plotCfg={{ margin: [60, 30, 60, 80] }}
          >
            <Axis name="number" title />
            <Axis name="processName" title />
            <Tooltip />
            <Geom
              type="interval"
              position="processName*number"
              selected
              color={[
                "processName",
                val => {
                  return this.returnColor(val);
                }
              ]}
              shape="gradientColor"
            >
            <Label
              content='sales'
              htmlTemplate={(text, item, index) =>{
                let src = null;
                let IMG = "";
                if (dataIndexArr.indexOf(index) !== -1) {
                  src =
                    "https://img.alicdn.com/tfs/TB1BgLAd8fH8KJjy1XbXXbLdXXa-28-24.png";
                  IMG = `<img style="width:14px" src="${src}" />`;
                }
                return IMG;
              }}
              textStyle={{
                textAlign: 'center', // 文本对齐方向，可取值为： start middle end
                fill: '#404040', // 文本的颜色
                fontSize: '12', // 文本大小
                fontWeight: 'bold', // 文本粗细
                rotate: 30,
                textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
              }}
            />
            </Geom>
          </Chart>
        </div>
        <div
          className="current-time-have"
          style={{ background: "rgba(147,158,168,0.10)", height: "500px" }}
        >
          <Chart
            padding = {'auto'}
            height={450}
            forceFit={true}
            data={this.state.frame}
            scale={this.state.colsData}
            onTooltipChange={ev => {
                this.tooltipChange(ev);
              }}
            placeholder={
              <div style={{
                width: "100%",
                height: "100%",
                background: "url(https://img.alicdn.com/tfs/TB16Q2LatfJ8KJjy0FeXXXKEXXa-204-166.png) center no-repeat",
                backgroundSize: "102px 83px",
                textAlign: "center",
                color: "#898989",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "125px"
              }}>
                暂无相关数据
              </div>
            }
          >
            <Axis name="time" grid={grid}  titleOffset={110} title />
            <Axis name="value" grid={grid} title />
            <Legend position={"top"} marker="square" />
            <Tooltip
            />
            <Geom
              type="line"
              style={style}
              position="time*value"
              shape="smooth"
              color={[
                "type",
                val => {
                  return this.returnColor(val);
                }
              ]}
            />
          </Chart>
        </div>
      </div>
    );
  }
}
export default connectAll(CapacityChart);
