import React,{Component} from 'react';
// import { Step ,Tab ,Button ,Table ,Dialog ,Notice} from '@alife/next';
import { Steps ,Tabs ,Button , Modal } from 'antd';
const Step = Steps.Step;
const TabPane = Tabs.TabPane;
import { ajax } from 'utils/index';
import 'utils/apimap';
const _ = require('lodash');
import Layout from 'components/head-detail-set/index';
import AppData from './app-data/app-data.jsx';
import Screening from './screening/screening.jsx';
import PageLayout from './layout/layout.jsx';
import SetAlg from './set-alg/set-alg.jsx';
import Target from './target/target.jsx';
import './apply-set.scss';

const steps = ['选择数据源', '选择页面筛选字段' ,'选择目标字段' ,'配置使用者界面' ,'配置算法']
.map((item, index) => <Step className="step-item" key={index} title={item} />);

class ApplySet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSave: false,
      activeKey: 1,
      current: 0,
      service: false,
    }
    this.tabs = [
      {  key: 1, content: <AppData getValue={this.getValue.bind(this)}/> },
      {  key: 2, content: <Screening getValue={this.getValue.bind(this)}/> },
      {  key: 3, content: <Target getValue={this.getValue.bind(this)}/> },
      {  key: 4, content: <PageLayout getValue={this.getValue.bind(this)}/> },
      {  key: 5, content: <SetAlg getValue={this.getValue.bind(this)}/> }
    ];

  }

  getValue(value,stepNum,isSave) {
    let newState = _.cloneDeep(this.state);
    newState.step = stepNum;
    newState.isSave = isSave;
    newState[stepNum] = value;
    this.setState(newState);
  }

  handleChange(key) {
  }

  onSendRequest(api,method,data) {
    return new Promise((resolve,reject) => {
      ajax({
        api: api,
        method: method,
        data: data,
        dataType: 'json',
        contentType: 'application/json'
      },(res) => {
        if(res.data) {
          resolve(res.data);
        }
      })
    })
  }

  changeStep(num) {
    let newState = _.cloneDeep(this.state);
    newState.isSave = true;
    newState.activeKey += num;
    newState.current += num;
    newState.step += num;
    if (newState.activeKey <= 1 || newState.current <= 0) {
      newState.activeKey = 1;
      newState.current = 0;
    } else if(newState.activeKey >= 5 || newState.current >= 4){
      newState.current = 4;
      newState.activeKey = 5;
    }
    this.setState(newState);
  }

  nextCall(num) {
    let api = '';
    if(this.state.step === 1) {
      api = 'addDataSource';
    }
    else if(this.state.step === 2) {
      api = 'addFilters';
    }else if(this.state.step === 3) {
      api = 'addTarget';
    }else if(this.state.step === 4) {
      api = 'generateLayout'
    }
    this.onSendRequest(api,'post',this.state[this.state.step]).then((id) => {
      this.changeStep(num);
    })

  }

  onWatchService() {
  }

  onOpen() {
    this.setState({
      service: true
    })
  }

  onCloseDialog() {
    this.setState({
      service: false
    })
  }

  createService(num) {
    let api = 'addAlgOrithm';
    this.onSendRequest(api,'post',this.state[num]).then((id) => {
      this.changeStep(num);
      if(num === 5) {
        this.setState({
          service: false
        })
        window.location.href = "/industry/integration-management.html#/factors";
      }
    })
  }

  render() {

    return (
      <div className="content">
        <Layout title={window.localStorage.getItem("serviceName")}/>
        <div className="apply-set-content">
          <div className="step">
            <Steps current={this.state.current} type="arrow">
              {steps}
            </Steps>
          </div>
          <div className="tab">
          <Tabs onChange={this.handleChange.bind(this)} activeKey={this.state.activeKey.toString()}>
            {
              this.tabs.map(item => <TabPane key={item.key} tab=''  >{item.content}</TabPane>)
            }
          </Tabs>
          </div>
        </div>
        <div className="tab-layout">
          <div className="tab-step">
            {this.state.current !== 0 && this.state.current !== 5 && <Button className="up-step" onClick={this.changeStep.bind(this,-1)}>上一步</Button>}
            {this.state.current !== 4 && this.state.current !== 5 && <Button type="primary" disabled={!this.state.isSave} onClick={this.nextCall.bind(this,1)}>下一步</Button>}
            {this.state.current === 4 &&
              <Button type="primary" disabled={!this.state.isSave} onClick={this.onOpen.bind(this)}>生成服务</Button>
            }
          </div>
        </div>
        <Modal 
          title='生成服务'
          visible={this.state.service}
          okText='确定'
          cancelText='取消'
          onOk={this.createService.bind(this,5)}
          onCancel={this.onCloseDialog.bind(this)}
          // minMargin={50}
          onClose={this.onCloseDialog.bind(this)} >
          确认生成服务?
        </Modal>
      </div>
    )
  }
}
export default ApplySet;
