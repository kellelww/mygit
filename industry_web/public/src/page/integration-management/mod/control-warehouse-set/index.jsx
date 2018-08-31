'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { ajax } from 'utils/index';
import 'utils/apimap';
import {
  Button,
  Switch,
  Icon,
  Modal,
  Input,
  Row,
  Col,
  Form,
  message
} from 'antd';
import { connectAll } from 'common/redux-helpers';
import './index.scss';
const FormItem = Form.Item;

class DataWareHouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   screenList: '',
      screenList: [],
      visible: false,
      deleteDialog: false
    };
    this.addressShow = this.addressShow.bind(this);
    this.addScreen = this.addScreen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOk = this.onOk.bind(this);
    this.deleteScreen = this.deleteScreen.bind(this);
    this.publishScreen = this.publishScreen.bind(this);
    this.fetchScreenList = this.fetchScreenList.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  componentDidMount() {
    this.fetchScreenList();
  }
  fetchScreenList() {
    ajax(
      {
        api: 'allScreenList',
        data: {}
      },
      json => {
        this.setState({
          screenList: json.data.data
        });
      },
      () => {}
    );
  }
  addScreen() {
    this.setState({
      visible: true
    });
  }
  addressShow(id) {
    ajax(
      {
        api: 'templateAdress',
        params: { id: id }
      },
      json => {
        location.href = json.data.data;
        // location.href = json.data.data+`&workShop=${JSON.parse(sessionStorage.getItem("selectTitle")).value}`;
      },
      () => {}
    );
  }
  onClose() {
    this.setState({
      visible: false,
      deleteDialog: false
    });
  }
  onOk() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        ajax(
          {
            api: 'addScreen',
            data: values,
            dataType: 'json',
            method: 'post',
            contentType: 'application/json'
          },
          res => {
            if(res.data.code == 200) {
                message.success('添加成功');
                setTimeout(() => {
                    this.fetchScreenList();
                }, 2000);
            } else {
                message.error(res.data.message);
            }
          },
          err => {
            message.error(res.data.message);
          }
        );
        this.setState({
            visible: false
        })
      }
    });
  }
  deleteScreen(id) {
    this.setState(
      {
        deleteId: id
      },
      () => {
        Modal.confirm({
          title: '确认删除大屏数据',
          cancelText: '取消',
          okText: '确定',
          content: '删除后，指挥舱无法查看该大屏',
          onOk: this.onDelete
        });
      }
    );
  }
  onDelete() {
    ajax(
      {
        api: 'deleteScreen',
        params: { id: this.state.deleteId }
      },
      json => {
        message.success('删除成功');
        setTimeout(() => {
          this.fetchScreenList();
        }, 1500);
      },
      () => {}
    );
    this.setState({
      deleteDialog: false
    });
  }
  publishScreen(status, id) {
    ajax(
      {
        api: 'publishScreen',
        params: { id: id, isPublish: status }
      },
      json => {
        message.success('操作成功');
        this.fetchScreenList();
      },
      () => {}
    );
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const myList = this.state.screenList
      ? this.state.screenList.map((item, index) => {
          return (
            <dl key={index}>
              <dt className="template-img">
                <img src={item.thumbnail} />
                <div className="template-use">
                  <Icon
                    type="delete"
                    style={{
                      color: 'white',
                      position: 'absolute',
                      top: '7px',
                      right: '7px',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      this.deleteScreen(item.id);
                    }}
                  />
                </div>
              </dt>
              <dd className="template-name">
                <Icon type="edit" className="icon-style" />
                {item.screenName}
              </dd>
              <dd className="template-button">
                <span
                  onClick={() => {
                    this.addressShow(item.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon type="eye-o" className="icon-style" />预览
                </span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Switch
                    checkedChildren="已发布"
                    unCheckedChildren="未发布"
                    checked={item.isPublish === 0 ? false : true}
                    onChange={() => {
                      this.publishScreen(item.isPublish, item.id);
                    }}
                  />
                  {/* <span>发布</span> */}
                </div>
              </dd>
            </dl>
          );
        })
      : null;
    const templateView = this.state.screenList
      ? this.state.screenList.map((item, index) => {
          return (
            <dl key={index}>
              <dt className="template-img">
                <img src={item.thumbnail} />
              </dt>
              <dd className="template-name">{item.screenName}</dd>
              <dd className="template-button">
                <p
                  onClick={() => {
                    this.addressShow(item.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon type="eye-o" className="icon-style" />预览
                </p>
              </dd>
            </dl>
          );
        })
      : null;
    const footer = (
      <div>
        <Button
          onClick={() => {
            this.onClose();
          }}
        >
          取消
        </Button>
        <Button
          type="primary"
          onClick={() => {
            this.onOk();
          }}
        >
          添加
        </Button>
      </div>
    );
    return (
      <div className="registered-page">
        {/* <Head activeKey="3" /> */}
        <div className="header-gg">
          <header>
            <span>公告</span>：DataV测试版发布，请使用谷歌 Chrome 浏览器版本 50
            以上，暂时不支持 Safari、360、IE
            等其他任何浏览器。如有问题请加入旺旺群：1452337492
          </header>
        </div>
        <div className="container">
          <div className="content">
            <div className="content-left">
              <h3 className="content-title">我的指挥舱</h3>
              <div className="template-list">
                <div
                  className="add-screen"
                  onClick={() => {
                    this.addScreen();
                  }}
                >
                  <div>
                    <Icon type="plus" style={{ fontSize: '38' }} />
                  </div>
                  <p style={{ marginTop: '25px' }}>添加大屏</p>
                </div>
                {myList}
                {localStorage.userName !== 'dunan.industry' && (
                  <dl>
                    <dt className="template-img">
                      <img src="https://img.alicdn.com/tfs/TB1l_Z1fnnI8KJjy0FfXXcdoVXa-398-216.png" />
                    </dt>
                    <dd className="template-name">
                      <Icon type="edit" className="icon-style" />设备状况概览
                    </dd>
                    <dd className="template-button">
                      <span
                        className="view-big"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          location.href = 'anlagenzustand.html';
                        }}
                      >
                        <Icon type="eye-o" className="icon-style" />预览
                      </span>
                      <a
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          location.href = 'compile.html';
                        }}
                      >
                        <Icon type="form" className="icon-style" />编辑
                      </a>
                    </dd>
                  </dl>
                )}
              </div>
            </div>
          </div>
        </div>
        <Modal
          visible={this.state.visible}
          footer={footer}
          onClose={this.onClose}
          onCancel={this.onClose}
          title="添加大屏"
        >
          <FormItem>
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '大屏名称不能为空!' },
                {
                  max: 10,
                  message: '请输入10字以内的名称'
                }
              ]
            })(
              <Input
                className="control-next-input"
                placeholder="大屏名称最多10个汉字"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('url', {
              rules: [{ required: true, message: '大屏链接不能为空!' }]
            })(<Input className="control-next-input" placeholder="大屏链接" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('token')(
              <Input className="control-next-input" placeholder="token" />
            )}
          </FormItem>
          <Row>
            <p
              style={{
                fontFamily: 'MicrosoftYaHei',
                fontSize: '12px',
                color: '#0FB2CC',
                paddingLeft: '20px',
                marginTop: '5px'
              }}
            >
              如果在datav发布是设置了token则必填
            </p>
          </Row>
        </Modal>
      </div>
    );
  }
}
const DataWareHouseForm = Form.create()(DataWareHouse);
export default connectAll(DataWareHouseForm);
