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
          <h1>关键因素识别</h1>
          <div>用于定位多源高维度生产数据（包括物料，工艺参数，设备参数等）中，对于给定生产目标影响最重要的关键参数。</div>
          <p>操作流程：</p>
          <div>1. 填写任务详情并启动</div>
          <div>2. 启动的任务进入任务列表</div>
          <div>3. 点击详情查看关键因素排序</div>
          <div>使用示例：客户希望分析哪些因素对3车间全部产线的良品率影响最大，现在车间良率的目标是0.98，则页面配置步骤如下：</div>
          <div>步骤1：填写任务名称，选择待分析的车间以及全部产线。</div>
          <div className="images"><img src="/images/one.png" width="650" height="460" /></div>
          <h3>选择待分析车间及产线</h3>
          <div>步骤2：选择任务类型为“电池片良率”，则可以看到期望值出现两个输入框，显示的是当前数据中电池片良率的最小值以及最大值，此时对应的正样本量（符合期望值的样本数目）为全量样本数目，负样本数目为0。</div>
          <div className="images"><img src="/images/two.png" width="650" height="460" /></div>
          <h3>设置期望值</h3>
          <div>步骤3：因为车间的目标是将良率控制在0.98以上，因此在期望值内填入0.98-1.0，此时可以看到正样本量与负样本量随之更新，请注意正样本量或负样本量任一为0 则算法无法正常启动，正样本量与负样本量接近时分析效果较为准确。</div>
          <div className="images"><img src="/images/three.png" width="650" height="460" /></div>
          <h3>正负样本量</h3>
          <div>步骤4：点击“开始分析”，去任务列表里查看任务运行结果。<img src="/images/four.png" width="136" height="63" /></div>
          <div>步骤5：点击“查看”，读取关键因素排序。算法会将最重要的15个因素按照重要性由高到低进行显示，并且对每个因素的重要性进行评分，排名第一的因素分数为1，其他的因素按照与第一因素的重要性对比给出分数。</div>
          <div className="images"><img src="/images/five.png" width="1000" height="390" /></div>
          <h3>任务运行结果</h3>
          <div className="images"><img src="/images/six.png" width="1000" height="460" /></div>
          <h3>查看分析结果</h3>
        </div>       
      </Content>
    );
  }
}

export default connectAll(App);
