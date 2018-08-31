import React,{Component} from 'react';
import { Button ,Table ,Icon,Input } from 'antd';
import { ajax } from 'utils/index';
import 'utils/apimap';
import _ from 'lodash';
import './target.scss';
const Search = Input.Search;


class Target extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",      
      leftArray: [],
      rightArray: [],
      searchData: [],
      leftRowSelection : {
        onChange: this.onLeftSelector.bind(this),
        selectedRowKeys: [],
        getProps: (record) => {
          return {
              disabled: record.id === 100306660941
          };
        }
      },
      rightRowSelection : {
        onChange: this.onRightSelector.bind(this),
        selectedRowKeys: [],
        getProps: (record) => {
          return {
              disabled: record.id === 100306660941
          };
        }
      },
      leftDataSource: [],
      rightDataSource : [],
    }

  }

  componentDidMount() {
    this.getTargets();
  }

  getTargets() {
    ajax({
      api: 'getTargets',
      params: {
        id: window.localStorage.getItem('id')
      }
    },(res) => {
      this.setState({leftDataSource: res.data.data,searchData: res.data.data},() => {
        this.props.getValue(null,3,false);
      });
    })
  }

  onLeftSelectAll() {
    let newState = _.cloneDeep(this.state);
    let arr = _.map(newState.leftDataSource,(item,index) =>{
      return item.id;
    })
    newState.leftRowSelection.selectedRowKeys = arr;
    newState.leftArray = newState.leftDataSource;
    this.setState(newState);
  }

  onCloseSelectAll() {
    let newState = _.cloneDeep(this.state);
    newState.leftRowSelection.selectedRowKeys = [];
    newState.leftArray = [];
    this.setState(newState);
  }

  onRightSelectAll() {
    let newState = _.cloneDeep(this.state);
    newState.leftDataSource = newState.leftDataSource.concat(this.state.rightArray);
    newState.leftDataSource = _.uniqWith(newState.leftDataSource,_.isEqual);
    newState.rightDataSource = _.differenceWith(newState.rightDataSource,newState.leftDataSource,_.isEqual);
    newState.rightRowSelection.selectedRowKeys = [];
    this.editParams(newState.rightDataSource);
    this.setState(newState);
  }

  onLeftSelector(arr,array) {
    let newState = _.cloneDeep(this.state);
    newState.leftRowSelection.selectedRowKeys = arr;
    newState.leftArray = array;
    this.setState(newState);
  }

  onRightSelector(arr,array) {
    let newState = _.cloneDeep(this.state);
    newState.rightRowSelection.selectedRowKeys = arr;
    newState.rightArray = array;
    this.setState(newState);
  }

  editParams(rightDataSource) {
    let targets = rightDataSource.map((item,index) => {
      return item.id;
    })
    let params = {
      "id": window.localStorage.getItem("id"),
      "targets": targets
    }
    let isSave = rightDataSource.length === 0 ? false : true;
    this.props.getValue(params,3,isSave);
  }

  onToRight() {
    let newState = _.cloneDeep(this.state);
    if(newState.leftRowSelection.selectedRowKeys.length !== 0) {
      newState.rightDataSource = newState.rightDataSource.concat(this.state.leftArray);
      newState.rightDataSource = _.uniqWith(newState.rightDataSource,_.isEqual);
      newState.leftDataSource = _.differenceWith(newState.leftDataSource,newState.rightDataSource,_.isEqual);
      newState.leftRowSelection.selectedRowKeys = [];
      this.editParams(newState.rightDataSource);
      this.setState(newState);
    }
  }

  onToLeft() {
    let newState = _.cloneDeep(this.state);
    if(newState.rightRowSelection.selectedRowKeys.length !== 0) {
      newState.leftDataSource = newState.leftDataSource.concat(this.state.rightArray);
      newState.leftDataSource = _.uniqWith(newState.leftDataSource,_.isEqual);
      newState.rightDataSource = _.differenceWith(newState.rightDataSource,newState.leftDataSource,_.isEqual);
      newState.rightRowSelection.selectedRowKeys = [];
      this.editParams(newState.rightDataSource);
      this.setState(newState);
    }
  }
  
  onSearch() {
    let newState = _.cloneDeep(this.state);
    newState.leftRowSelection.selectedRowKeys = [];
    newState.leftArray = [];
    newState.leftDataSource = newState.searchData.filter((item,index) => {
      return item.name.indexOf(newState.inputValue) !== -1 ;
    })
    newState.leftDataSource = _.differenceWith(newState.leftDataSource,newState.rightDataSource,_.isEqual);
    this.setState(newState);
  }

  onInputSearch(e) {
    let newState = _.cloneDeep(this.state);
    newState.inputValue = e.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <div className="screening-content">
        <div className="Transfer">
          <div className="optional">
            <div className="optional-title">
              <h3>可选字段</h3>
              <span className="search-content">
                <Search value={this.state.inputValue} onSearch={this.onSearch.bind(this)} onChange={this.onInputSearch.bind(this)} className="search-input" placeholder="搜索内容"/>
                {/* <Icon onClick={this.onSearch.bind(this)} className="search" type="sousuo"/> */}
              </span>
              <div className="tab-action">
                <a onClick={this.onLeftSelectAll.bind(this)}>全选 </a>
                <a onClick={this.onCloseSelectAll.bind(this)}> 反选</a>
              </div>
            </div>
            <Table 
              dataSource={this.state.leftDataSource} 
              hasBorder={false}
              rowKey={record=>record.id}
              pagination={false}
              // primaryKey = "id"
              // fixedHeader={true}
              // maxBodyHeight={750} 
              rowSelection={this.state.leftRowSelection}>
                <Table.Column align="left" title="名称" dataIndex="name"/>
                <Table.Column align="left" title="参数个数" dataIndex="validCount"/>
                <Table.Column align="left" title="空值数量" dataIndex="emptyCount"/>
                <Table.Column align="right"  title="空值率" dataIndex="emptyRatio" />
            </Table>
          </div>
          <div className="arrow">
            <Button onClick={this.onToRight.bind(this)}><Icon type="arrow-right" /></Button>
            <br />
            <br />
            <Button onClick={this.onToLeft.bind(this)}><Icon type="arrow-left" /></Button>
          </div>

          <div className="screening">
            <div className="screening-title">
              <h3>目标字段</h3>
              <a onClick={this.onRightSelectAll.bind(this)} className="tab-action">全部删除</a>
            </div>
            <Table 
              dataSource={this.state.rightDataSource} 
              hasBorder={false}
              rowKey={record=>record.id}
              pagination={false}
              // fixedHeader={true}
              // maxBodyHeight={750}  
              rowSelection={this.state.rightRowSelection}
               >
                <Table.Column align="left" title="名称" dataIndex="name"/>
                <Table.Column align="left" title="参数个数" dataIndex="validCount"/>
                <Table.Column align="left" title="空值数量" dataIndex="emptyCount"/>
                <Table.Column align="right" title="空值率" dataIndex="emptyRatio" />
            </Table>
          </div>
        </div>
      </div>
    )
  }
}
export default Target;
