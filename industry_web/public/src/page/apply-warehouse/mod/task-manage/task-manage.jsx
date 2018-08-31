import React, { Component } from 'react';
import { Table, Icon, Button ,Card} from 'antd';
import Header from "components/head-detail/index.js";
import { connectAll } from 'common/redux-helpers';
import { ajax } from 'utils/index';
import 'utils/apimap';
import _ from 'lodash';
import './task-manage.scss';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      allTask: {},
    }
  }

  componentDidMount() {
    this.getTaskManage();
  }

  getTaskManage() {
    this.setState({
      isLoading: true
    });
    ajax({
      api: "taskManage",
      params: {
        id: this.props.location.search.split('=')[1]
      },
    },(json) => {

      if(json.data) {
        this.setState({
          allTask: json.data.data,
        })
        this.setState({
          isLoading: false
        })
      }
    })

  }

  allParams(path) {
    return (
      <span>
        {
          _.map(path,(ele,i) => {
            return (
              <p className="func-details" key={i}>
                <span className="params">参数{i+1}：</span>
                <span>
                  <span className="distance">{ele.splitInfo.splitColumnName}</span>
                  <span className="distance style">{ele.splitInfo.splitDescriptor}</span>
                  <span className="distance">{ele.splitInfo.splitValue}</span>
                </span>
              </p>
            )
          })
        }
      </span>
    )
  }

  render() { 
    const {allTask} = this.state;
    if(!allTask.filters) {
      return null;
    }
    return (
      <div className="task-manage-content">
        <Header title="返回工艺参数推荐"/>
        <div className="recommended">
          <div className="recommended-left">
            <p>
              <span className="task-name">任务类型 </span>
              <span>{allTask.algorithmType}</span>
            </p>
            <p>
              <span className="task-name">{allTask.filters[0].name} </span>
              {allTask.filters[0] && <span>{allTask.filters[0].values[0]}</span>}
            </p>
            <p>
              <span className="task-name">{allTask.filters[1].name} </span>
              {allTask.filters[1] && <span>{allTask.filters[1].values[0]}</span>}
            </p>
            <p>
              <span className="task-name">时间 </span>
              {_.get(allTask.filters[2],"range") &&<span >{_.get(allTask.filters[2],"range").min} ~ {_.get(allTask.filters[2],"range").max}</span>}
            </p>
            <p>
              <span className="task-name">目标 </span>
              <span>{_.get(allTask.targets,"name")}</span>
            </p>
 
            {/* <p>
              <span className="task-name">样本总量 </span>
              <span>{allTask.sampleCount}</span>
            </p>
            <p>
              <span className="task-name">正样本总量 </span>
              <span>{allTask.positive}</span>
            </p>
            <p>
              <span className="task-name">负样本总量 </span>
              <span>{allTask.negative}</span>
            </p> */}
            <p>
              <span className="task-name">期望值 </span>
              {
                _.get(allTask,"targets.type") === 1 ? 
                <span style={{
                  "word-wrap": "break-word", 
                  "word-break": "normal",
                  width: 223,
                  display: "inline-block"
                }}>{_.get(allTask,"targets.range.min")} ~ {_.get(allTask,"targets.range.max")}</span> : 
                _.map(_.get(allTask,"targets.range"),(item) => {
                  return (
                    <span style={{marginRight: "5px"}}>{item}</span>
                  )
                })
              }
            </p>
            <p>
              <span className="task-name">正样本量 </span>
              <span>{this.state.allTask?this.state.allTask.positive:''}</span>
            </p>
              <p>
              <span className="task-name">负样本量 </span>
              <span>{this.state.allTask?this.state.allTask.negative:''}</span>
            </p>
              <p>
              <span className="task-name">总样本量 </span>
              <span>{this.state.allTask?this.state.allTask.sampleCount:''}</span>
            </p>
          </div>
          <div className="recommended-table">
            <div className="recommended-page">
              {
                _.map(allTask.result,(item,index) => {
                  return (
                    <Card title={index === 0 ? "推荐参数组合一" : "推荐参数组合二"}
                    key={index} 
                    className="preferred-plan" 
                    style={{width: 430}} 
                    bodyHeight={item.path.length !== 0 ? item.path.length * 65 : 55}>
                      <p>
                        <span style={{marginRight: "20px"}}>
                          <span className="params">期望达成率：</span>
                          <span>{parseInt(item.metricValue * 10000) / 100 + "%"} </span>
                        </span>
                        <span>
                          <span className="params">样本量：</span>
                          <span>{item.leafNodeSize}</span>
                        </span>
                      </p>
                      {this.allParams(item.path)}
                    </Card>
                  )
                })
              }
            </div>
            

          </div>
        </div>
      </div>
    )
  }
}
export default connectAll(Task);