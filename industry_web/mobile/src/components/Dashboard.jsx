import React from 'react';
import {createForm} from 'rc-form';
import {district} from 'antd-mobile-demo-data';
import {
  WingBlank,
  WhiteSpace,
  ActionSheet,
  Flex,
  Menu
} from 'antd-mobile';
import axios from 'axios';

import './Dashboard.less';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionList: [],
      list: [],
      title: "",
      param: "",
    };
  }
  componentDidMount() {
    this.getOptionList();
  }

  componentWillUnmount() {

  }
 
  getOptionList() {

    let titleLabel = localStorage.getItem("workShopId");
    let title = localStorage.getItem("workShopLabel");
    let url = "/mobileApi/api/dataAuth/workShopList";
		let authorization = "Basic dHJpbmE6dHJpbmE4ODg6VUhXSU1OSFlWOjQwZDcwMGZkZjJlMjQ5M2M4NWU5YWJhZWExMjI5YzU2";
    
    axios('/loginApi/api/user/login',{
      method: 'post',
      headers:{
        "Authorization" : authorization,
        "content-type": 'application/json'
      },
      withCredentials: true,
      data: {
        userName : "trina",
        password: "trina888"
      }
    }).then((_result) =>{
      axios(url, {
        method: "GET",
        headers: {
          // "headers":{ "Authorization" : authorization },
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache': 'no-cache'
        },
        withCredentials: "include"      
      }).then((res) => {
        this.setState({
          title: title ? title : res.data.data[0].label,
          titleLabel: titleLabel ? titleLabel : res.data.data[0].children[0].value,
          optionList: res.data.data,
          menuSelectValue: [res.data.data[0].id,res.data.data[0].children[1]]
        });
      })

    })


    
    
  }

  handleLinkClick(id) {
    
    let param = this.state.param;
    const url = '/mobileApi/api/screen/address?id=' + id;

    axios(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache'
      },
      withCredentials: "include"
    }).then((_result) => {

      const result = _result.data;

      if (result && result.code === 200) {
        localStorage.setItem("workShopId",this.state.titleLabel);
        localStorage.setItem("workShopLabel",this.state.title);
        if(id === 148){
          window.location.href = `https://datav.aliyun.com/share/98077bf2554a838dc998956135fbde25?&workShopId=${this.state.titleLabel}`;
        }else{    
          window.location.href = `${result.data}&workShopId=${this.state.titleLabel}`
        }

      } else {
        // Toast.fail(result.message || '接口错误', 1);
      }
    }).catch(err => {
      // Toast.fail(err || '接口错误', 1);
    })


  }

  showActionSheet() {
    const BUTTONS = this.state.list;
    let content = <div className="title-content">
      <div className="content-title">
        <span>选择车间</span>
      </div>
    </div>;
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      message: content,
      maskClosable: true,
      'data-seed': 'logId',
      wrapProps,
    },
    (buttonIndex) => {
      let optionList = this.state.optionList;
      if(buttonIndex !== optionList.length && buttonIndex != -1) {
        let param = optionList[buttonIndex].value;
        this.setState({ title: BUTTONS[buttonIndex] ,param});
      }
    });
  }

  showMenu() {
    this.setState({
      isShowMenu: true
    });
  }

  onClickShow(record) {

  }

  onChangeMenu(value) {
    if(!value[0]) {
      this.setState({
        isShowMenu: false,
        titleLabel: value[1],
      });
    } else {
      let optionList = this.state.optionList;
      let titleData = optionList.filter((item,index) => {
        return item.value == value[0];
      });
        this.setState({
          isShowMenu: false,
          title: titleData[0].label,
          titleLabel: value[1],
          menuSelectValue: value
        })
    }

  }

  onCancel() {
    this.setState({
      isShowMenu: false
    });
  }

  render() {

    return (
      <div className="dashboard">
        <div className="logo"> 
          <div className="logo-content">
            <img src="//img.alicdn.com/tfs/TB1soUDgwMPMeJjy1XcXXXpppXa-366-180.png" width="76" height="38"/>
            <div className="border"></div>
            <div className="select-name" onClick={this.showMenu.bind(this)}>
              {this.state.title}/{this.state.titleLabel}
              <i className="iconfont icon-qiehuan iconselect"></i>
            </div>
          </div>

        </div>
        <WingBlank size="sm">
          <Flex>
          <Flex.Item>
              <a onClick={this.handleLinkClick.bind(this, 148)}>
                <img src="//gw.alicdn.com/tfs/TB1Qh3BgwMPMeJjy1XbXXcwxVXa-100-98.png" width="50" height="49"/>
                在制情况
              </a>
            </Flex.Item>
           
            <Flex.Item>
              <a onClick={this.handleLinkClick.bind(this, 147)}>
                <img src="//gw.alicdn.com/tfs/TB1SN3BgwMPMeJjy1XbXXcwxVXa-100-100.png" width="50" height="50"/>
                良率监测
              </a>
            </Flex.Item>
          </Flex>
          <WhiteSpace size="sm"/>
          <Flex>
             <Flex.Item>
              <a onClick={this.handleLinkClick.bind(this, 146)}>
                <img src="//gw.alicdn.com/tfs/TB1beExgwoQMeJjy1XaXXcSsFXa-98-96.png" width="49" height="48"/>
                产量监测
              </a>
            </Flex.Item>
            <Flex.Item>
              <a href="javascript:void(0)" onClick={this.handleLinkClick.bind(this, 149)}>
                <img src="//gw.alicdn.com/tfs/TB1MT.BgwoQMeJjy0FpXXcTxpXa-100-100.png" width="50" height="50"/>
                设备状况
              </a>
            </Flex.Item>
          </Flex>
        </WingBlank>
        <WhiteSpace size="lg"/>
        <Flex direction="column" justify="center" align="center" className="footer">
          <Flex.Item>Powered by 阿里云计算</Flex.Item>
        </Flex>
        <div className={this.state.isShowMenu ? "menu-content" : "menu-content menu-cencel"}>
          <h3>请选择工厂／车间</h3>
          <Menu
            className="foo-menu"
            data={this.state.optionList}
            value={this.state.menuSelectValue}
            onChange={this.onChangeMenu.bind(this)}
            height={384}
          />
          <div onClick={this.onCancel.bind(this)} className="cancel">取消</div>
        </div>
      </div>
    );
  }
}

export default createForm()(Dashboard);

