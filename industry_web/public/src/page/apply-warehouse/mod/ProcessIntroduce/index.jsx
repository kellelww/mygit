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

  componentWillUnmount() {
    
  }

  componentDidMount() {
    
  }
  render() {
    return (
      <Content title={<span style={{color:'#999999'}}>产品介绍</span>} >
        <div className="multparameter-contents">
          <h1>工艺参数推荐</h1>
          <div>本功能通过对历史工艺生产情况进行大数据挖掘，给出核心参数的取值范围。其模型基础是基于对电池片生产流程数据的整理与打通，基于尤其是对电池片丝网印刷工序数据的整理，按照生产时间和测试时间的关系进行关联，集成功率测试仪数据，汇总整理出丝网印刷设备参数基础特征值表数据表。</div>
          <p>操作流程：</p>
          <div>1. 填写任务详情并启动</div>
          <div>2. 启动的任务进入任务列表</div>
          <div>3. 点击详情查看推荐结果</div>
          <div>使用示例：客户的目标是将3车间产线2 的电池片效率控制在0.1865以上，希望通过分析2017年11月的数据，得到一组参数推荐,步骤如下：</div>
          <div>步骤1：填写任务名称，选择车间与产线。</div>
          <div className="images"><img src="/images/TechnologyOne.png" width="650" height="460" /></div>
          <div>步骤2：选择任务类型为“电池片效率”，则可以看到期望值出现两个输入框，显示的是所选时间区间内3车间产线2电池片效率的最小值以及最大值，此时对应的正样本量（符合期望值的样本数目）为全量样本数目，负样本数目为0。</div>
          <div className="images"><img src="/images/TechnologyTwo.png" width="650" height="460" /></div>
          <div>步骤3：因为车间的目标是将电池片效率控制在0.1865以上，因此将期望值下限修改为0.1865，此时可以看到正样本量与负样本量随之更新，请注意正样本量或负样本量任一为0 则算法无法正常启动，正样本量与负样本量接近时分析效果较为准确。</div>
          <div className="images"><img src="/images/TechnologyThree.png" width="650" height="460" /></div>
          <div>步骤4：点击“开始推荐”，去任务列表里查看任务运行结果。<img src="/images/TechnologyFour.png" width="68" height="32" /></div>
          <div>步骤5：点击“查看”，读取工艺参数推荐结果。算法会出最优的两组推荐结果，每组推荐结果会给出其对应的样本数目、达成期望目标的概率，以及核心参数的推荐限值条件。</div>
          <div className="images"><img src="/images/TechnologyFive.png" width="1000" height="390" /></div>
          <h3>查看任务运行结果</h3>
          <div className="images"><img src="/images/TechnologySix.png" width="1000" height="460" /></div>
          <h3>查看推荐的工艺参数</h3>
        </div>       
      </Content>
    );
  }
}

export default connectAll(App);
