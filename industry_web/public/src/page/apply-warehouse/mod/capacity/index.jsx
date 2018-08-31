'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'utils/index';
import { Form, Tabs} from "antd";
import CapacityChart from './capacity-chart';
import CapacityTable from './capacity-table';
import { connectAll } from 'common/redux-helpers';
import './index.scss';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;


class Capacity extends React.Component {
  constructor(props){
    super(props);
    // this.field = new Field(this);
    this.state = {
        tarData: {
            plot: [],
            lastUpdate: ''
          }
    }
  }

  componentWillUnmount() {
    localStorage.setItem("activeKeyTab","");
  }

  componentDidMount() {
    let activeKey = localStorage.getItem("activeKeyTab") ? localStorage.getItem("activeKeyTab","") : "1";
    this.setState({
      activeKey
    })
  }

  onChange(activeKey) {
    this.setState({activeKey},() => {
      localStorage.setItem("activeKeyTab",activeKey);
    });
  }
  render() {
     // const init = this.field.init;
    return (
      <div className="capacity-page">
              <Tabs activeKey={this.state.activeKey} onChange={this.onChange.bind(this)}>
                <TabPane  tab="在制数量分析" key="1" >
                   <CapacityChart />
                </TabPane>
                <TabPane tab="在制超时批次" key="2">
                   <CapacityTable />
                </TabPane>
              </Tabs>
      </div>);
  }
}

export default connectAll(Capacity);
