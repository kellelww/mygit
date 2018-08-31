

import React,{Component} from 'react';
import { Icon } from 'antd';

import './complete.scss';


class Complete extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    setTimeout(() => {
      window.location.href = "/industry/apply-warehouse-set.html#/factors";
    },3000)  
  }

  render() {
    return (
      <div className="complete-content">
        <div className="complete-loading">
          <Icon type="loading" className="loading"/>
          <span>服务正在生成，预计需要几分钟时间，请您稍等</span>
        </div>
      </div>
    )
  }
}
export default Complete;
