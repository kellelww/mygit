import React from "react";
import ReactDOM from "react-dom";
import { Form, Icon, Input, Button, Checkbox , message } from 'antd';
const FormItem = Form.Item;
import { ajax } from "utils/index";
const _ = require('lodash');
import "./index.scss";
// import axios from "axios";
// import qs from "qs";

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}; //初始化state
  }
  getListTab() {
    return new Promise((resolve,reject) => {
      ajax({
        api: 'listTopTab',
      }, json => {
        if (json.data.data) {
          let isHasControl = _.cloneDeep(this.state.isHasControl);
          json.data.data.children && json.data.data.children.forEach((ele,index) => {
            if (ele.url === "control-warehouse") {
              isHasControl = true;
            }
          })
          this.setState({
            link: _.get(json.data.data,"children[0].url")
          },() => {
            resolve();
          })
        } else if(json.data === null) {
          resolve();
        }
      });
    })

  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        ajax({
        api: 'login',
        data: JSON.stringify(values),
        dataType: 'json',
        method:'post',
        headers:{ "Authorization" :"Basic " + btoa(`${values.userName}:${values.password}`) },
        contentType: 'application/json'
      }, (res) => {
        if(res.data.code === 200){
          message.destroy();
          let data = Number(res.data.data[1]);       
            if(data === 0) {   
              this.getListTab().then(() => {
                message.destroy();
                message.success(`登录成功,正在跳转...`);
                localStorage.userName = values.userName.trim();
                setTimeout(() => {
                  location.href = "/industry/apply-warehouse.html#/overview";
                },2000);
              });
            } else {
              message.destroy();
              message.success(`登录成功,正在跳转...`);
              localStorage.userName = values.userName.trim();
            }
        }else {
          message.destroy();
          message.warning(res.data.message);
        }  
      }, (err) => {
        message.destroy();
        message.warning(err);
      })
        // axios.post('/loginApi/api/user/login', values,{
        //   dataType: 'json',
        //   contentType: 'application/json',
        //   headers: {
        //       "Authorization":"Basic " + btoa(`${values.userName}:${values.password}`)
        //   },
        // })
        //   .then(function (res) {
        //     if(res.data.code === 200){
        //       message.destroy();
        //       message.success(res.data.message);
        //       let data = Number(res.data[1]);       
        //         if(data === 0) {   
        //           this.getListTab().then(() => {
        //             message.destroy();
        //             message.success(`登录成功,正在跳转...`);
        //             localStorage.userName = values.userName.trim();
        //             setTimeout(() => {
        //               // location.href = `${this.state.link}.html`;
        //               location.href = "/industry/apply-warehouse.html#/overview";
        //             },2000);
        //           });
        //         } else {
        //           message.destroy();
        //           message.success(`登录成功,正在跳转...`);
        //           localStorage.userName = values.userName.trim();
        //         }
        //     }else {
        //       message.destroy();
        //       message.warning(res.data.message);
        //     }
        //   })
        //   .catch(function (error) {
        //     message.destroy();
        //     message.warning(error);
        //   });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-page">
        <div className="login-page-header">
          <i className="iconfont little-logo" />
          <span>天合光能</span>
        </div>
        <div className="login-page-body">
          <div className="login-page-body-main">
            <div className="logo">
              <img
                src="//img.alicdn.com/tfs/TB1soUDgwMPMeJjy1XcXXXpppXa-366-180.png"
                width="183"
                height="90"
              />
            </div>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: 'Please input your username!' }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Log in
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <p className="add-text">Powered by 阿里云</p>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

ReactDOM.render(<WrappedNormalLoginForm />, document.getElementById("container"));

// ReactDOM.render(<Login />, document.getElementById("container"));
