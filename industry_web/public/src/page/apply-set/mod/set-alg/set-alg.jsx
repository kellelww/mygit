

import React,{Component} from 'react';
import { Icon ,Input,Card,Radio} from 'antd';
const { Group: RadioGroup } = Radio;
import { ajax } from 'utils/index';
import 'utils/apimap';
import _ from 'lodash';
import './set-alg.scss';

class SetAlg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkValue: 'alg1',
      params: {},
      dataSource: [],
      selectRadio: "",
      algorithmParam: [],
    }
  }

  componentDidMount() {
    this.algorithm();
  }

  algorithm() {
    ajax({
      api: 'algorithm'
    },(res) => {
      if(res.data) {

        this.props.getValue(null,5,false);
        let params = {};
        res.data.data.forEach((item,index) => {
          item.params.forEach((ele) => {
            params[ele.id] = ele.default;
          })
        })
        
        this.setState({
          params: params,
          dataSource: res.data.data,
          selectRadio: res.data.data[0].name
        },() => {
          let algorithmParam = [];
          res.data.data.forEach((item,index) => {
            algorithmParam[index] = [];
            item.params.forEach((ele) => {
              algorithmParam[index].push({name: ele.id,value: ele.default});
            })
          })
          this.setState({algorithmParam});
          let sendParams = {
            "id": window.localStorage.getItem('id'),
            "algorithm": {
              "algorithmId": res.data.data.id,
              "algorithmParam": algorithmParam[0]
            }
          }
          this.props.getValue(sendParams,5,true);
        });
        
      }
    })
  }

  onBlur(index,name,evt) {
    this.setState({
      [index]: {
        [name]: evt.target.value
      }
    })
  }

  onChangeRadio(e,record,index) {
    this.setState({
      selectRadio: e.target.value
    },() => {
      let arr = [];
      let {algorithmParam} = this.state;
      this.state.dataSource.forEach((item,index) => {
        if(item.name === e.target.value) {
          item.params.forEach((ele,i) => {
            arr.push(ele.default);
          })
        }
      })

      if(arr.indexOf("") !== -1) {
        this.props.getValue(null,5,false);
      }else {
        let sendParams = {
          "id": window.localStorage.getItem('id'),
          "algorithm": {
            "algorithmId": record.id,
            "algorithmParam": algorithmParam[index]
          }
        }
        this.props.getValue(sendParams,5,true);
      }

    })
  }

  onInputValue(e,id,record,index) {
    let newState = _.cloneDeep(this.state);
    let params = newState.params
    let selectRadio = newState.selectRadio;
    let dataSource = newState.dataSource;
    params[id] = e.target.value;
    dataSource.forEach((item,index) => {
      item.params.forEach((ele,i) => {
        if(ele.id === id) {
          ele.default = e.target.value;
        }
      })
    })
    
    this.setState(newState,() => {
      if(record.name === selectRadio) {
        let algorithmParam = [];
        let arr = [];
        dataSource.forEach((item,index) => {
          arr[index] = [];
          item.params.forEach((ele) => {
            arr[index].push({name: ele.id,value: ele.default});
          })
        })
        this.setState({algorithmParam: arr})
        algorithmParam = arr[index];
        if(algorithmParam.length === record.params.length){
          this.isAllInput = true;
          algorithmParam.forEach((item,index) => {
            if(item.value === "") {
              this.isAllInput = false;
            }
          })
          if(this.isAllInput) {
            let sendParams = {
              "id": window.localStorage.getItem('id'),
              "algorithm": {
                "algorithmId": record.id,
                "algorithmParam": algorithmParam
              }
            }
            this.props.getValue(sendParams,5,true);
          }else {
            this.props.getValue(null,5,false);
          }
        }else {
          this.props.getValue(null,5,false);
        }
      }
    });
  }

  render() {
    
    return (
      <div className="alg-content">
        {_.map(_.get(this,'state.dataSource'),(item,index) => {
          return (
            <RadioGroup value={this.state.selectRadio}  key={item.id} onChange={(value) => this.onChangeRadio(value,item,index)}>
              <Card className="card-hover"  style={{width: 285, height: 180}} >
                <div className="card-title">
                  <Radio value={item.name} />
                  <span className="radio-title">{item.name}</span>
                </div>
                  {
                    _.map(_.get(item,"params"),(ele,i) => {
                      return (
                        <div className="form-all" key={ele.id}>
                          <label className="label-name">{ele.name}：</label>
                          <Input 
                          className='input-distance' 
                          value={ele.default} 
                          // htmlType="text" 
                          onChange={(value) => { this.onInputValue(value,ele.id,item,index)}}
                           />
                        </div>
                      )
                    })
                  }
              </Card>
            </RadioGroup>
          )
        })}
        {/* <Card className="card-hover"  style={{width: 280}} bodyHeight={160} > */}
        <Card className="card-hover"  style={{width: 285, height: 180}}>

          <div className="card-title">
            <Radio disabled={true}/>
            <span className="radio-title">关键因素识别 - **</span>
          </div>
          <div className="card-dev">
            <Icon type="code" style={{ fontSize: 44 }}></Icon>
            <p>开发中...</p>
          </div>
        </Card>
        <div className="selecte-alg">
        当前服务使用 <span>{this.state.selectRadio}</span> 进行运算
        </div>
      </div>
    )
  }
}
export default SetAlg;
