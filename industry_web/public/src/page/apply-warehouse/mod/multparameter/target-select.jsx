import React from 'react';
import { Button, Modal, Checkbox, Search} from 'antd';
import { connectAll } from 'common/redux-helpers';
const { Group: CheckboxGroup } = Checkbox;
class TargetRangeSelect extends React.Component {
    constructor(props){
      super(props);
      this.state={
        visible: this.props.visible,
        targetRange: this.props.targetRange,
        value: [],
        selectedTarget: []
      };
      this.onClose = this.onClose.bind(this);
    }
    componentWillReceiveProps(nextPorps){
     let targetRange = [];
      if(nextPorps.targetRange){
        nextPorps.targetRange.forEach((item, index) => {
            if(nextPorps.selectedTarget.indexOf(item) === -1){
                targetRange[index] = {value: item, selected: false}
            } else{
                targetRange[index] = {value: item, selected: true}
            }
        });
      };
      this.setState({
        visible: nextPorps.visible,
        targetRange: targetRange,
        selectedTarget: nextPorps.selectedTarget
      });
    }
    onClose(){
      this.props.closeTargetSelect(false);
    }
    onClickItem(index){
        let arr = this.state.targetRange;
        arr[index] = Object.assign({},arr[index], {selected: !arr[index].selected} );
       this.setState({
         targetRange: arr
       });
    }
    getValue(){
        let valueList = [];
        this.state.targetRange.forEach((item, index) => {
            if(item.selected){
                valueList.push(item.value)
            }
        });
        this.props.getValue(valueList);
    }
    render() {
      const footer = <div><Button onClick={this.getValue.bind(this)}>确定</Button></div>;
      const targetRangeList = (this.state.targetRange) ? this.state.targetRange.map((item ,index) => {
        return <span onClick={() => {this.onClickItem(index)}} className={`target-items ${item.selected ? 'selected-target-item' : ''}`} key={index} style={{width: "auto"}}>{item.value}</span>
      }) : null;
        return (
            <div>
              <Modal visible={this.state.visible}
                      footer={footer}
                      onClose={this.onClose}
                      title={this.props.title}
                      style={{width:"500px", height:'420px'}}
                      >
                    <div style={{overflow: 'auto', height:'307px', border:'1px solid #dcdcdc', marginTop: '15px'}}>
                        {targetRangeList}
                    </div>
              </Modal>
            </div>);
    }
}
export default connectAll(TargetRangeSelect);
