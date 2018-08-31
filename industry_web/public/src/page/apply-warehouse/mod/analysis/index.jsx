import React, { Component } from "react";
import { Menu, Icon} from "antd";
const _ = require('lodash');
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  Guide,
  Shape,
  Label,
  transform
} from "bizcharts";
import { connectAll } from "common/redux-helpers";
import { ajax } from "utils/index";
import "./index.scss";
import DataSet from '@antv/data-set';
const Line = Guide.Line;
const Text = Guide.Text;

class Analysis extends Component {
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
      listIndex: 0
    };
    this.getQueryString = this.getQueryString.bind(this);
  }

  componentDidMount() {
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    selectTitle = selectTitle ? selectTitle : this.props.workshop;
    this.getNavItem({
      workShop: selectTitle.value
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
      this.getNavItem({ workShop: nextProps.workshop });
    }
  }
  getQueryString = (name) => {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    const r = this.props.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }
  getNavItem(data) {   
    ajax({
      api: "getNavItem",
      params: data
    }, json => {
      if (json.data.data.data.plot.length) {
        let type = null;
        let data = null;
        if (this.getQueryString("type")) {
          type = this.getQueryString("type");
          let listIndex = 0;
          json.data.data.data.plot.forEach((item, index) => {
            if (item.code === this.getQueryString("type")) {
              listIndex = index;
            }
          })
          data = this.getQueryString("type");
          this.setState({
            type: this.getQueryString("type"),
            NavItem: json.data.data.data.plot,
            listIndex
          })
        } else {
          type = json.data.data.data.plot[0] && json.data.data.data.plot[0].code;
          this.setState({
            NavItem: json.data.data.data.plot
          })
        }
        type && this.getChartsData(type);
      } else {
        this.setState({
          allChartsData: {
            plot: []
          },
          frame: [],
          colsData: {},
          NavItem: []
        });
      }
    });
  }

  handleGetG2Instance(chart) {
    this.chart = chart;
  }

  onItemSelected(evt) {
    let colorArr = JSON.parse(window.localStorage.colorArr);
    let name = evt.data._origin.marker;
    let ChartIndex = null;
    this.state.allChartsData.plot.forEach((item, index) => {
      if (item.marker === name) {
        ChartIndex = index;
      }
    });
    // for (let i = 0; i < colorArr.length; i++) {
    //   if (evt.data.color === colorArr[i]) {
    //     index = i;
    //     break;
    //   }
    // }
    // console.log(index,"index");
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
    this.setState({
      AllSingleData,
      dataIndexArr,
      timeEff: {
        type: this.state.type,
        eqpId: evt.data._origin.eqpId,
        workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
      }
    }, () => {
      this.singleChartsData();
      if (isCheck) {
        this.getSingleChartsData(this.state.timeEff);
      }
    });
  }

  getSingleChartsData(data) {
    data.workShop = JSON.parse(sessionStorage.getItem("selectTitle")).value;
    ajax({
      api: "getSingle",
      params: data
    }, (json) => {
      if (json.data.data) {
        let newState = _.cloneDeep(this.state);
        newState.AllSingleData[json.data.data.marker] = json.data.data.plot
        this.setState(newState, () => {
          this.singleChartsData();
        });
      }
    });
  }

  singleChartsData() {
    let AllSingleData = _.cloneDeep(this.state.AllSingleData);
    let singleChartsData = _.cloneDeep(this.state.singleChartsData);
    let arr = [];
    _.forEach(AllSingleData, (item, key) => {
      arr.push(key);
      singleChartsData = item.map((ele, index) => {
        let obj = singleChartsData[index] ? singleChartsData[index] : {};
        obj[key] = ele.eff;
        obj.time = ele.date;
        return obj;
      });
    });
    singleChartsData = singleChartsData.map((item,index) => {
      item.tip = `${moment(item.time).subtract(1,"h").format("HH:mm")} ~ ${moment(item.time).format("HH:mm")}`;
      return item;
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
    // let frame = new Frame(singleChartsData);
    // frame = Frame.combinColumns(frame, arr, "value", "type", "time");
    let colsData = {
      time: {
        alias: "最近24小时",
        // type: "timeCat",
        // nice: false,
        // mask: "HH:MM",        
        // tickCount: 24,
        range: [0, 1]
      },
      value: {
        alias: "时间利用率"
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

  onClickItem(type) {
    this.setState({ type, dataIndexArr: [], AllSingleData: {} }, () => {
      this.selectedKeys = type;
      this.getChartsData(type);
    });
  }

  getChartsData(type) {
    this.selectedKeys = this.selectedKeys ? this.selectedKeys : type;
    ajax(
      {
        api: "getAll",
        params: {
          type: this.selectedKeys,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        let data = {
          plot: []
        };
        let dataIndexArr = _.cloneDeep(this.state.dataIndexArr);
        data = json.data.data ? json.data.data : data;
        if (this.getQueryString("name")) {
          data.plot.forEach((item, index) => {
            if (item.eqpId === this.getQueryString("name")) {
              dataIndexArr.push(index);
            }
          });
          let params = {
            type: type,
            eqpId: this.getQueryString("name")
          };
          this.getSingleChartsData(params);
        } else {
          let num = 1;
          let arr = data.plot.map((item, index) => {
            if (item.eff < num && item.eff !== 0) {
              num = item.eff;
            }
            return item.eff;
          });
          let index = arr.indexOf(num);
          dataIndexArr.push(index);
          this.setState({
            type:type
          },() =>{
            if (data.plot[index]) {
              let params = {
                type: this.state.type,
                eqpId: data.plot[index].eqpId
              };
              this.getSingleChartsData(params);
            }
          })
        }
        const colorGrounp = this.renderDiffColor(data.plot.length || 0);
        const colorMap = this.returnColorMap(colorGrounp, data.plot);
        this.setState({
          allChartsData: data,
          dataIndexArr,
          colorMap
        });
        if (!json.data) {
          this.setState({
            frame: []
          });
        }
      }
    );
  }

  onSelect(keys) {
    this.setState({ listIndex: Number(keys.key) });
  }

  onTooltipChange(evt) {
    let items = evt.items;
    let origin = _.cloneDeep(items);
    origin.forEach((item, index) => {
      let value = item.value;
      if (
        typeof parseInt(item.value) === "number" &&
        String(parseInt(item.value)) !== "NaN"
      ) {
        value = parseInt(item.value * 10000) / 100 + "%";
      }
      items[index].value = value;
    });
  }

  returnColor(key) {
    return this.state.colorMap[key];
  }
  returnColorMap(colorGroup, plot) {
    const colorMap = {};
    plot.forEach((item, index) => {
      colorMap[item.eqpId] = colorGroup[index];
    });
    return colorMap;
  }
  renderDiffColor(length) {
    let colorArr = [];
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

  render() {
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
    const cols = {
      marker: { alias: "设备名称" },
      eff: { alias: "当日累计时间利用率", min: 0, max: 1 }
    };
    const label = {
      autoRotate: false,
      formatter(text, item, index) {
        return `${text * 100}%`;
      }
    }
    let { dataIndexArr, allChartsData } = this.state;
    // const datas = [{eff:0.5,eqpId:"C03PBCN05-1",marker:"C03PBCN05-1"},{"eff":0.6,eqpId:"C03PBCN05-2",marker:"C03PBCN05-2"}];
    return (
      <div className="analysis-content">
        <div className="analysis-left">
          <h2>选择设备类型</h2>
          <Menu
            onSelect={this.onSelect.bind(this)}
            selectedKeys={[String(this.state.listIndex)]}
          >
            {this.state.NavItem.map((item, index) => {
              return (
                <Menu.Item
                  onClick={this.onClickItem.bind(this, item.code)}
                  key={index}
                >
                  {item.name}
                </Menu.Item>
              );
            })}
          </Menu>
        </div>
        <div className="analysis-right">
          <div className="current-time">
            <Chart
              height={280}
              plotCfg={{ margin: [30, 85, 60, 80] }}
              forceFit={true}
              onIntervalClick={this.onItemSelected.bind(this)}
              onTooltipChange={this.onTooltipChange.bind(this)} 
              data={allChartsData.plot}
              scale={cols}
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
              onGetG2Instance={chart => {
                this.handleGetG2Instance(chart);
              }}
            > 
              <Axis
                name="eff"
                label={label}
                title
              />
              <Axis name="marker" title />
              <Tooltip
                 showTitle={false}
              />
              <Geom
                type="interval"
                position="marker*eff"
                selected
                shape="gradientColor"
                tooltip={["marker*eff"]}
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
              <Guide>
                <Line
                  top={true} 
                  start= {[-0.5, allChartsData.targetEff]} 
                  end= {[allChartsData.plot.length - 0.5, allChartsData.targetEff]} 
                  lineStyle= {{
                    stroke: '#FF8732',
                    lineDash: [ 0, 2, 2 ],
                    lineWidth: 1
                  }}
                />
                <Text
                  top= {true}
                  position= {[allChartsData.plot.length - 0.5, allChartsData.targetEff]} 
                  content= {`利用率目标${allChartsData.targetEff * 100}%`}
                  style= {{
                    fill: '#cccccc', // 文本颜色
                    fontSize: '12', // 文本大小
                    fontWeight: 'normal', // 文本粗细
                    rotate: 0 // 旋转角度
                  }}
                  offsetY={-10}
                  offsetX={-85}
                />
              </Guide>
            </Chart>
          </div>
          <div
            className="current-time-have"
            style={{
              background:"rgba(147, 158, 168, 0.10)"
            }}
          >
            <Chart
              padding = {'auto'}
              height={350}
              forceFit={true}
              data={this.state.frame}
              scale={this.state.colsData}
              onTooltipChange={this.onTooltipChange.bind(this)} 
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
              <Axis name="time" titleOffset={100} grid={grid} title />
              <Axis
                title
                name="value"
                grid={grid}
                label={label}
              />
              <Legend position={"top"} marker="square" />
              <Tooltip />
              <Geom
                type="interval"
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
      </div>
    );
  }
}
export default connectAll(Analysis);
