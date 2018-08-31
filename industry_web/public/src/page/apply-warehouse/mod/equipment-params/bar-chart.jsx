import React from "react";
import ReactDOM from "react-dom";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  Frame,
  Guide,
  Shape
} from "bizcharts";
import { connectAll } from "common/redux-helpers";
import _ from "lodash";
import Slider from "bizcharts-plugin-slider";
class BarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colsData: {},
      frame: {},
      data: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.dataSource, nextProps.dataSource)) {
      this.setState(
        {
          data: nextProps.dataSource
        },
        () => {
          this.applyCharts();
        }
      );
    }
  }

  getTimeNode(data) {
    let initTime = new Date(data[0].log_time).getTime();
    let oldHoursTime = initTime + 60 * 60 * 1000;
    let count = 0;
    data.forEach((item, index) => {
      if (oldHoursTime > new Date(item.log_time).getTime()) {
        count++;
      }
    });
    return count;
  }

  applyCharts() {
    const data = this.state.data;
    if (data.length) {
      let number = parseInt(data.length / 24);
      let arr = [];
      _.forEach(data[0], (item, key) => {
        if (key !== "log_time") {
          arr.push(key);
        }
      });
      let count = this.getTimeNode(data);
      let frame = new Frame(data);
      frame = Frame.combinColumns(frame, arr, "value", "type", "log_time");
      let colsData = {
        log_time: {
          alias: " ",
          type: "timeCat",
          nice: false,
          mask: "HH:MM:ss",
          range: [0, 1]
        },
        value: {
          alias: " "
        },
        type: {
          alias: "日期",
          formatter: val => {
            return val;
          }
        }
      };
      this.setState({
        startTime: frame.data[0].log_time,
        endTime: frame.data[frame.data.length - 1].log_time,
        frame,
        colsData
      });
    } else {
      this.setState({
        frame: {},
        colsData: {}
      });
    }
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
    if (!this.state.frame.data) {
      return  <div style={{
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
          // xDim="log_time"
    return (
      <div style={{ width: "100%" }}>
        <Slider
          height={20}
          xAxis="log_time"
          start={this.state.startTime}
          end={this.state.endTime}
        >
          <Chart
            plotCfg={{ margin: [70, 70, 70, 80] }}
            height={400}
            forceFit={true}
            data={this.state.frame}
            scale={this.state.colsData}
          >
            <Axis name="log_time" titleOffset={100} grid={grid} title />
            <Axis name="value" grid={grid} />
            <Legend position={"top"} marker="square" title />
            <Tooltip />
            <Geom
              type="line"
              style={style}
              position="log_time*value"
              shape="smooth"
              color="type"
            />
          </Chart>
        </Slider>
      </div>
    );
  }
}
export default connectAll(BarChart);
