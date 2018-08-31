import React, { Component } from 'react';
import { Button, Row, Col, Card, Icon, Modal, Input, Form } from 'antd';
import { connectAll } from 'common/redux-helpers';
import { ajax } from 'utils/index';
import 'utils/apimap';
const _ = require('lodash');
import './factors.scss';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    fixedSpan: 10
  },
  wrapperCol: {
    span: 20
  }
};

class Factor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visibleDialog: false,
      ischeck: true,
      list: [],
      isErrTip: false,
      errTipValue: '',
      addModal: {
        visible: false
      }
    };
  }

  componentDidMount() {
    this.getgenerate();
  }

  getgenerate() {
    ajax(
      {
        api: 'generate',
        method: 'GET'
      },
      res => {
        if (res.data.data) {
          let list = res.data.data.forEach((item, index) => {
            if (item.status === -1) {
              item.status = '失败';
            } else if (item.status === 1) {
              item.status = '完成';
            } else if (item.status === 0) {
              item.status = '生成中';
            }
          });
          this.setState({ list: res.data.data });
        }
      }
    );
  }

  hanlderHover() {
    this.setState({ visible: true });
  }

  onClose(e) {
    e.stopPropagation();
    this.setState({ visible: false });
  }

  addModal() {
    let newState = _.cloneDeep(this.state);
    newState.addModal.visible = true;
    this.setState(newState);
  }

  onAddClose() {
    let newState = _.cloneDeep(this.state);
    newState.addModal.visible = false;
    this.setState(newState);
  }

  onDeleteService(item) {
    ajax(
      {
        api: 'deleteService',
        params: {
          id: item.id
        }
      },
      res => {
        // let list = this.state.list.filter((ele,index) => {
        //   return item.id !== ele.id;
        // })
        this.getgenerate();
        this.setState({ [item.id]: true });
      }
    );
  }

  onCloseDialog(item) {
    this.setState({ [item.id]: false });
  }

  onOpen(item) {
    Modal.confirm({
      title: '确认删除服务',
      content: '删除后，无法使用该服务',
      cancelText: '取消',
      okText: '确定',
      onOk: this.onDeleteService.bind(this, item)
    });
  }

  showStatus(item) {
    {
      item.status === '失败' ? (
        <span>
          <Icon className="error" type="close-circle-o" /> {item.status}
        </span>
      ) : (
        <span>
          <Icon type="check-circle-o" /> {item.status}
        </span>
      );
    }
    if (item.status === '失败') {
      return (
        <span>
          <Icon className="error" type="close-circle-o" /> {item.status}
        </span>
      );
    } else if (item.status === '生成中') {
      return (
        <Icon style={{ color: '#0FB2CC' }} type="loading">
          {' '}
          {item.status}
        </Icon>
      );
    } else {
      return (
        <span>
          <Icon type="check-circle-o" /> {item.status}
        </span>
      );
    }
  }
  // 提交form表单
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let newState = _.cloneDeep(this.state);
        newState.addModal.visible = false;
        let params = {
          name: values.name,
          desc: values.desc
        };
        ajax(
          {
            api: 'createService',
            method: 'post',
            dataType: 'json',
            contentType: 'application/json',
            // data: JSON.stringify(params)
            data: params
          },
          res => {
            this.setState(newState, () => {
              window.localStorage.setItem('id', res.data.data);
              window.localStorage.setItem('name', values.name);
              window.location.href = '/industry/apply-set.html';
            });
          }
        );
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="factors-content">
        <Row>
          <Col span="24">
            <Card className="Cart">
              <h2 style={{ marginBottom: '6px' }}>关键因素识别</h2>
              <p>通过新建服务，创建出更多关键因素识别的场景化算法服务</p>
              <Button type="primary" onClick={this.addModal.bind(this)}>
                新建服务
              </Button>
            </Card>
          </Col>
        </Row>
        <div className="factors-style">
          <Row type="wrap" className="demo-row">
            {_.map(_.get(this, 'state.list'), (item, index) => {
              return (
                <Col span="6" key={index}>
                  <div className="cart-content">
                    <h2 className="name">{item.name}</h2>
                    <div className="status">{this.showStatus(item)}</div>
                    <p className="mask-title">{item.desc}</p>
                    <div className="cart-border">
                      <Button
                        className="delete-btn"
                        icon="delete"
                        onClick={this.onOpen.bind(this, item)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
        <Modal
          visible={this.state.addModal.visible}
          onCancel={this.onAddClose.bind(this)}
          onClose={this.onAddClose.bind(this)}
          style={{ width: 500 }}
          title="新建服务"
          className="create-modal"
          footer={null}
          destroyOnClose={true}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: '服务名称，不能为空!' },
                  {
                    max: 10,
                    message: '请输入10字以内的名称'
                  }
                ]
              })(<Input placeholder="服务名称最多10个汉字" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('desc', {
                rules: [
                  { required: true, message: '服务功能描述，最多18个字符!' },
                  {
                    max: 18,
                    message: '请输入18字以内的功能描述'
                  }
                ]
              })(<Input placeholder="服务功能描述，最多18个字符" />)}
            </FormItem>
            <Row>
              <span className="tip-text">
                服务功能描述为必填项，方便使用者明确此项服务的业务特点
              </span>
            </Row>
            <FormItem className="btn-row" wrapperCol={{ span: 12, offset: 16 }}>
              <Button type="primary" htmlType="submit" className="save-btn">
                保存
              </Button>
              <Button onClick={this.onAddClose.bind(this)}>取消</Button>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

const Factors = Form.create()(Factor);
export default connectAll(Factors);
