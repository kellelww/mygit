import React from 'react';
import { createForm } from 'rc-form';
import { InputItem, WingBlank, WhiteSpace, Button, Icon, Toast } from 'antd-mobile';

import axios from 'axios';

import './Login.less';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  handleBtnClick(){
    this.props.form.validateFields((error, value) => {
      if(error){
        // handle error
        Toast.fail('登录失败', 1);
        return;
      }

      if(!value.username || !value.password){
        Toast.fail('用户名或密码不能为空', 1);
        return;
      }

      // fetch('/proxy/api/user/login',{
      //   method: 'POST',
      //   dataType: 'json',
      //   headers:{ "Authorization" :"Basic " + btoa(`${value.username}:${value.password}`),"content-type": 'application/json'},
      //   credentials: 'include',
      //   body: JSON.stringify({
	    //     userName : value.username,
	    //     password: value.password
      //   })
      // }).then(res =>{
      //   return res.json();
      // }).then((result) =>{
      //   if(result && result.code === 200){
      //     this.props.router.push('/dashboard')
      //   }else{
      //     Toast.fail(result.message || '接口错误', 1);
      //   }
      // })

      axios('/loginApi/api/user/login',{
		    method: 'post',
		    headers:{
		    	"Authorization" :"Basic " + btoa(`${value.username}:${value.password}`),
          "content-type": 'application/json'
		    },
		    withCredentials: true,
		    data: {
			    userName : value.username,
			    password: value.password
		    }
	    }).then((_result) =>{

		    const result = _result.data;

		    if(result && result.code === 200){
          let title = localStorage.removeItem("workShopId");
          let titleLabel = localStorage.removeItem("workShopLabel");
			    this.props.router.push('/dashboard')
		    }else{
			    Toast.fail(result.message || '接口错误', 1);
		    }
	    })


    });
  }

  render() {

    const { getFieldProps, getFieldError } = this.props.form;

    return (<div className="login">

      <div className="logo">
        <img src="//img.alicdn.com/tfs/TB1soUDgwMPMeJjy1XcXXXpppXa-366-180.png" width="183" height="90"/>
      </div>

      <div className="login-wrap">
        <WingBlank size="lg">
          <InputItem type="text" placeholder="请输入用户名" {...getFieldProps('username')}>
            {/*<Icon type="check" size="md" color="red" />*/}
          </InputItem>

          <WhiteSpace size="lg" />

          <InputItem type="password" placeholder="请输入密码" {...getFieldProps('password')}>
            {/*<Icon type="check" size="md" color="red" />*/}
          </InputItem>

          <WhiteSpace size="lg" />

          <Button type="primary" onClick={this.handleBtnClick.bind(this)}>登录</Button>

        </WingBlank>
      </div>

      <div className="copyright">
        Powered by 阿里云计算
      </div>

    </div>);
  }
}

export default createForm()(Login);
