import React, { Component } from "react";
import { connectAll } from "common/redux-helpers";
import Content from "components/content";
import "./index.scss";

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      
    };
  }
  render() {
    return (
      <Content title={<span style={{color:'#999999'}}>产品介绍</span>} >
        <div className="multparameter-contents">
          <h1>多维参数分析</h1>
          <div>对于生产环节较多的流程制造业，工艺工程师需要衡量不同工艺环节多个参数的设定对于最终产品质量产生的影响。多维参数分析主要基于两份基础数据表：</div>
          <div>1. SPC抽检数据表：来源于生产过程中，各工序针对加工中的产品进行的质量抽检结果以及对应的工艺指标数据。</div>
          <div>2. 丝网印刷设备参数数据表：来源于丝网印刷工序中，从丝网印刷设备中按照10秒的采集频率获得的设备参数数据，包括印刷速度，印刷压力，丝网间距和回墨速度等。</div>
          <h3 className="left">分析步骤：</h3>
          <div>1. 选择需要分析的数据源</div>
          <div className="images"><img src="/images/MultidimensionalOne.png" width="400" height="222" /></div>
          <div>2. 选择需要分析的“时间区间”，“产线编号”以及“产品类型”，点击“确认分析范围”刷新可以调整的参数及其范围。</div>
          <div className="images"><img src="/images/MultidimensionalFour.png" width="539" height="331" /></div>
          <div>3.  根据步骤2中选择的分析范围，显示每个参数的取值范围，客户可以灵活调整参数的取值范围，探索不同参数控制模式下对产品质量的影响。</div>
          <div className="images"><img src="/images/MultidimensionalTwo.png" width="234" height="356" /></div>
          <div>4. 可在运行结果中查看在当前设定下产品的“电效率均值”“良品率”以及“A品率”，对于每个指标会给出当前参数设定下的样本总数、平均值以及4分位值。</div>
          <div className="images"><img src="/images/MultidimensionalThree.png" width="1000" height="560" /></div>
        </div>        
      </Content>
    );
  }
}

export default connectAll(App);
