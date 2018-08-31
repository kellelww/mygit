import React,{Component} from 'react';
import { Table, Icon, Input, Radio, Tooltip } from 'antd';
const { Group: RadioGroup } = Radio;
import { ajax } from 'utils/index';
import 'utils/apimap';
import _ from 'lodash';
import './layout.scss';

const render = (value,index,record) => {
  return <Icon type="edit" />
}
class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: {},
      dataSource: [],
      params: {}
    }

    this.frontName = (value,record,index) => {
      return <Input value={this.state.inputValue[record.id]}
        onChange={(value) => {this.onChangeInputValue(value,record)}}
        onBlur={this.onBlur.bind(this,index,record)}
         />
    }
    this.fillStyle = (value,record,index) => {
      if(record.type === '离散') {
        return (
          <RadioGroup value={this.state[record.name]} onChange={(e) => {
              this.setState({
                [record.name]: e.target.value
              },() => {
                this.changeParams(index,e.target.value);
              })
            }}>
            <Radio id="radio" value={0}>单选</Radio>
            <Radio id="checkbox" value={1}>多选</Radio>
          </RadioGroup>
        )
      }else {
        return null;
      }
    }

    this.icon = (value,record,index) => {
      this.down = <Icon onClick={this.onMove.bind(this,index,record,1)} className={index === 0 ? 'down-icon all-icon' : 'all-icon'} type="xiayiyiceng" />
      this.up = <Icon onClick={this.onMove.bind(this,index,record,-1)} className='all-icon' type="shangyiyiceng" />
      if(index === 0 && this.state.dataSource.length !== 1) {
        return  <Tooltip title="下移">{this.down}</Tooltip>
      } else if (index === this.state.dataSource.length - 1 && this.state.dataSource.length !== 1) {
        return  <Tooltip title="上移">{this.up}</Tooltip>
      } else if(this.state.dataSource.length === 1){
        return null;
      }else {
        return (
          <span>
            <Tooltip title="上移">{this.up}</Tooltip>
            <Tooltip title="下移">{this.down}</Tooltip>
          </span>
        )
      }
    }

  }

  onChangeInputValue(e,record) {
    console.log(e.target.value, record)
    let newState = _.cloneDeep(this.state);
    newState.inputValue[record.id] = e.target.value;
    this.setState(newState);
  }

  onBlur(index,record) {
    let newState = _.cloneDeep(this.state);
    if(this.state.inputValue[record.id]) {
      newState.params.layout[index].name = this.state.inputValue[record.id];
      newState.params.id = window.localStorage.getItem('id');
      this.setState(newState,() => {
        this.props.getValue(this.state.params,4,true);
      });
    }
  }

  onMove(index,record,num) {
    let dataSource = _.cloneDeep(this.state.dataSource);
    let params = _.cloneDeep(this.state.params);
    dataSource.splice(index,1);
    dataSource.splice(index + num,0,record);
    let newRecord = params.layout.splice(index,1);
    params.layout.splice(index + num,0,newRecord[0]);
    this.setState({dataSource,params},() => {
      this.props.getValue(this.state.params,4,true);
    });
  }

  changeParams(index,value) {
    let newStateParams = _.cloneDeep(this.state.params);
    newStateParams.layout[index].style = value;
    this.setState({params: newStateParams},() => {
      this.props.getValue(this.state.params,4,true);
    });
  }

  componentDidMount() {
    this.selectedFilters();
  }

  filterData(data) {
    let params = _.cloneDeep(data);
    let newData = _.cloneDeep(data);
    let layout = params.map((item,index) => {
      item.valueType = _.cloneDeep(item.type);
      item.style = 0;
      delete item.emptyCount;
      delete item.emptyRatio;
      delete item.validCount;
      delete item.type;
      return item;
    })

    let dataSource = newData.map((item,index) => {
      if(item.type === 0) {
        item.type = '离散'
        return item;
      }else if(item.type === 1){
        item.type = '连续'
        return item;
      }else if(item.type === 2){
        item.type = '日期'
        return item;
      }
    })
    return {dataSource, layout}
  }

  defaultParams(data) {
    this.setState({
      dataSource: this.filterData(data).dataSource,
      params: {
        layout: this.filterData(data).layout,
        id: window.localStorage.getItem('id')
      }
    },() => {
      this.props.getValue(this.state.params,4,true);
      let newState = _.cloneDeep(this.state);
      this.filterData(data).dataSource.forEach((item,index) => {
        newState[item.name] = 0;
      })
      this.setState(newState);
    });
  }

  selectedFilters() {
    let id = window.localStorage.getItem('id');
    ajax({
      api: 'selectedFilters',
      params: {
        id: id
      }
    },(res) => {
      if(res.data) {
        this.defaultParams(res.data.data);
      }
    })
  }

  render() {
    return (
      <div className="layout-content">
        <div className='screening'>
          <h3>配置关键因素识别页面样式</h3>
            <Table dataSource={this.state.dataSource} pagination={false} rowKey={record=>record.id} hasBorder={false} >
              <Table.Column align="left" title="字段" dataIndex="name"/>
              <Table.Column align="left" title="有效值数量" dataIndex="validCount" />
              <Table.Column align="left" title="空值数量" dataIndex="emptyCount"/>
              <Table.Column align="left" title="空值率" dataIndex="emptyRatio"/>
              <Table.Column align="left" title="使用者界面显示名称" render={this.frontName} width={300}/>
              <Table.Column align="left" title="类型" dataIndex="type" width={75}/>
              <Table.Column align="right" title="填写样式" render={this.fillStyle} width={200}/>
              <Table.Column align="right" title="" render={this.icon} width={100}/>
            </Table>
        </div>
      </div>
    )
  }
}
export default Layout;
