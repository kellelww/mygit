import React, { Component } from 'react';
import {
  Button,
  Modal,
  Checkbox,
  Tabs,
  Icon,
  message,
  Form,
  Select,
  Input,
  Tooltip,
  Table,
  Tree,
  // Cascader,
  Radio
} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
// const { Node: TreeNode } = Tree;
const TreeNode = Tree.TreeNode;
// const Toast = Feedback.toast;
import Mask from 'components/mask';
import { ajax } from 'utils/index';
// import "utils/apimap";
const _ = require('lodash');
import './index.scss';
import Cascader from 'components/workshop-cascader';

let pathName = location.pathname.split('/');
pathName = pathName[pathName.length - 1].split('.')[0];

class Management extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleList: [],
      dataSource: [],
      category: [],
      isCheckSuccess: true,
      roleMenuList: [], // 角色菜单tab
      roleMenu: [], //
      treeNodeKeys: [], // 树形结构
      activeKeyRoleTab: '',
      roleListDataSource: [], // 角色列表
      activeKeyNode: {},
      userVisibleDelete: false,
      isRoleAdd: false,
      checkIsSubmit: false,
      CheckPhone: false,
      CheckEmail: false,
      selectedKeysAll: {},
      selectValue: [],
      allTreeNodeKeys: {}, // 角色树形控件
      checkIsRoleSubmit: false, // 角色管理是否可以提交
      workshopValue: [],
      value2: '',
      selectedKeysCheck: [],
      arrLength: [],
      allLength: 0,
      isCheck: false,
      judgeRoleName: '',
      judgeForm: true,
      checkedWorkShop: [],
      workshop: [],
      isShowWorkShop: false,
      activeId: '',
      activeRadio: '',
      loading: true,
    };
    this.onNestChange = this.onNestChange.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.onDeleteOk = this.onDeleteOk.bind(this);

    // this.field = new Field(this);
    this.tabTypeBtn = {
      人员管理: {
        funC: this.addPerson.bind(this),
        text: '添加成员'
      },
      角色设置: {
        funC: this.addRole.bind(this),
        text: '创建角色'
      }
    };
  }

  getListTab() {
    return new Promise((resolve, reject) => {
      ajax(
        {
          api: 'listTopTab'
        },
        json => {
          if (json.data) {
            let titleKey = null;
            json.data.data.children.forEach((item, index) => {
              if (item.url === pathName) {
                titleKey = item.id;
              }
            });
            ajax(
              {
                api: 'listMenu',
                params: { parentId: titleKey }
              },
              json => {
                if (json.data) {
                  let urlId = null;
                  json.data.data.children.forEach((item, index) => {
                    if (item.url === 'userPermissions') {
                      urlId = item.id;
                    }
                  });
                  resolve(urlId);
                }
              }
            );
          }
        }
      );
    });
  }

  componentWillMount() {
    this.getListTab().then(data => {
      ajax(
        {
          api: 'listMenu',
          params: { parentId: data }
        },
        json => {
          if (json.data) {
            this.setState({
              category: json.data.data.children,
              activeKey: json.data.data.children
                ? json.data.data.children[0].name
                : ''
            });
          }
        }
      );
    });
  }

  componentDidMount() {
    this.getTabMenu();
    // this.getRoleList();
    this.getPersonManagement();
    this.getWorkShopData();
  }

  /**
   * 获取车间数据权限
   */

  getWorkShopData() {
    ajax(
      {
        api: 'getWorkShopData'
      },
      json => {
        if (json.data) {
          this.setState({
            workshopData: json.data.data
          });
        }
      }
    );
  }

  /**
   * 角色设置菜单列表
   */

  getTabMenu() {
    ajax(
      {
        api: 'getTabMenu'
      },
      json => {
        if (json.data) {
          const arr = json.data.data.children.map((item, index) => ({
            name: item.name,
            id: item.id
          }));
          this.setState({
            roleMenuList: arr,
            activeKeyNode: json.data.data.children[0],
            roleMenu: json.data.data.children,
            activeKeyRoleTab: arr[0].id
          });
        }
      }
    );
  }

  /**
   * 创建人员
   */

  createPerson() {
    const checkedWorkShop = this.state.workshopValue;
    this.props.form.setFieldsValue({
      workShopIds: checkedWorkShop
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {

        const newParams = _.cloneDeep(values);
        delete newParams.email;
        delete newParams.phone;
        let isCheckSuccess = true;
        _.mapKeys(newParams, (value, key) => {
          if (value === undefined) {
            isCheckSuccess = false;
          }
        });
        this.setState({ isCheckSuccess });
        if (isCheckSuccess) {
          this.setState({
            isShowMask: false
          });
          this.updateAccountInfo(values, '添加成功', 'createPerson', 'post');
        }
      }
    });
  }

  /**
   * update 账号信息
   */

  updateAccountInfo(params, content, api, method) {
    ajax(
      {
        api,
        data: params,
        dataType: 'json',
        contentType: 'application/json',
        method
      },
      json => {
        if (json.data) {
          this.getPersonManagement().then(data => {
            if (json.data.code == 200) {
              message.success(content);
              this.setState({
                isShowMask: false
              })
            }
          });
        }
      }
    );
  }

  /**
   * 账号更新
   */

  updateData() {
    const checkedWorkShop = this.state.workshopValue;
    this.props.form.setFieldsValue({
      workShopIds: checkedWorkShop
    });
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.id = this.state.userSadebarId;
        this.updateAccountInfo(values, '修改成功', 'updateData', 'put');
      }
    });
  }

  /**
   * 账号检查
   */

  userAccountCheck() {
    const account = this.props.form.getFieldValue('account') || '';
    return new Promise((resolve, reject) => {
      ajax(
        {
          api: 'accountCheck',
          params: { account }
        },
        json => {
          resolve(json.data.data);
          this.setState({ isCheckSuccess: json.data.data });
        }
      );
    });
  }

  /**
   * 获取preson 管理数据列表
   */

  getPersonManagement() {
    this.setState({
      loading: true
    });
    return new Promise((resolve, reject) => {
      ajax(
        {
          api: 'getPersonManagement'
        },
        json => {
          if (json.data) {
            const roleList = json.data.data.map((item, index) => ({
              id: item.id,
              name: item.name
            }));
            let allLength = 0;
            for (let i = 0; i < json.data.data.length; i++) {
              this.selectKeyArray[i] = [];
              allLength += json.data.data[i].userList.length;
            }

            this.setState(
              {
                dataSource: json.data.data,
                roleList,
                selectedKeysCheck: [],
                allLength,
              },
              () => {
                resolve(json);
              }
            );
          }
          this.setState({
            loading: false
          })
        }
      );
      
    });
  }

  /**
   * 删除数据
   */

  popupConfirm(id) {
    Modal.confirm({
      title: '确认删除成员',
      content: '删除以后，该用户无法使用产品',
      cancelText: '取消',
      okText: '确定',
      onOk: this.onDeleteList.bind(this, id)
    });
  }

  onDeleteAll(id) {
    let params = { id: id.join() };
    let selectedKeysAll = _.cloneDeep(this.state.selectedKeysAll);
    selectedKeysAll[this.state.singeTableId] = [];
    ajax(
      {
        api: 'deletePerson',
        method: 'post',
        data: params,
        dataType: 'json',
        contentType: 'application/json'
      },
      json => {
        if (json.data) {
          if (json.data.code == 200) {
            this.getPersonManagement().then(data => {
              this.setState(
                {
                  selectedKeysAll
                },
                () => {
                  // this.allSelect(false);
                  message.success('删除成功');
                }
              );
            });
          }
        }
      }
    );
  }

  onDeleteList(id) {
    let params = { id };
    ajax(
      {
        api: 'deleteUserId',
        method: 'put',
        data: params,
        dataType: 'json',
        contentType: 'application/json'
      },
      json => {
        if (json.data) {
          this.getPersonManagement().then(data => {
            // this.allSelect(false);
            if (json.data.code == 200) {
              message.success('删除成功!');
            }
          });
        }
      }
    );
  }
  /**
   * 弹出侧边栏
   */

  onClickShowMask(record) {
    this.setState(
      {
        judgeForm: true,
        isAdd: false,
        checkIsSubmit: true,
        userSadebarId: record.id,
        workshopValue: record.workShopIds,
        isShowWorkShop: true,
        isShowMask: true,
      }, () => {
        const dafaultWorkShop = record.workShopIds[0];
        const workshopData = this.state.workshopData;

        workshopData.forEach((item) => {
          item.children.forEach((list) => {
            if(dafaultWorkShop == list.label) {
              this.setState({
                workshop: item.children,
                activeId: item.id,
                // workshopValue: record.workShopIds,
              })
            }
          })
        })
        this.props.form.setFieldsValue({
          name: record.name,
          account: record.account,
          password: '*********', // 暂定
          position: record.position ? record.position : '',
          phone: record.phone ? record.phone : '',
          email: record.email ? record.email : '',
          roleIds: record.roleList.map((item, index) => item.id.toString())
        })
        
      }
    );
  }

  onSubmit() {
    this.state.isAdd ? this.createPerson() : this.updateData();
    // this.setState({
    //   isShowMask: false
    // });
  }

  onClose() {
    this.setState({
      isShowMask: false,
      workshopValue: []
    });
  }

  /**
   * 选择mask
   *
   */

  onSelectField(value) {
    this.props.form.setFieldsValue({roleList:value});
    // this.checkIsSubmit("roleList");
  }

  /**
   * 操作
   */

  userAction(index, record) {
    const edit = (
      <Icon
        type="edit"
        onClick={this.onClickShowMask.bind(this, record)}
        style={{ cursor: 'pointer', marginRight: '10' }}
      />
    );
    const shanchu = (
      <Icon
        type="delete"
        onClick={this.popupConfirm.bind(this, record.id)}
        style={{ cursor: 'pointer' }}
      />
    );
    return (
      <span>
        <Tooltip title="编辑">{edit}</Tooltip>
        <Tooltip title="删除">{shanchu}</Tooltip>
      </span>
    );
  }

  /**
   * 添加成员
   */

  addPerson() {
    this.props.form.resetFields();
    this.setState({
      judgeForm: true,
      isShowMask: true,
      isAdd: true,
      checkIsSubmit: true,
      workshopValue: [],
      isShowWorkShop: false
    });
  }

  scrollToTable = (name, index) => {
    this.setState({
      activeRadio: index
    });
    if (document.getElementById(name) !== null) {
      let divObj = document.getElementById(name);

      let height = parseInt(
        window.getComputedStyle(
          document.getElementsByClassName('ant-radio-group')[0],
          null
        ).height
      );
      document
        .getElementById('commentlist')
        .scroll(0, divObj.offsetTop - 82 - height);
    }
  };

  onNestChange(value) {
    this.setState({
      value2: value
    });
  }
  onSelectItem(a, b, index) {
    let selectedKeysAll = _.cloneDeep(this.state.selectedKeysAll);

    selectedKeysAll[index] = a;
    let arrLength = [];
    _.forEach(selectedKeysAll, (item, key) => {
      arrLength = arrLength.concat(item);
    });
    let isAllSelect = false;
    if (arrLength.length == this.state.allLength) {
      isAllSelect = true;
    }
    this.setState({
      selectedKeysAll: selectedKeysAll,
      arrLength: arrLength,
      isCheck: isAllSelect,
      singeTableId: index
    });
  }

  selectKeyArray = [];
  onDeleteUsrList() {
    let params = { id: this.state.selectedKeysCheck.join(',') };
    ajax(
      {
        api: 'deletePerson',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: params
      },
      json => {
        if (json.data) {
          this.getPersonManagement().then(data => {
            message.success('删除成功');
          });
        }
      }
    );
  }
  onDeleteOk(id) {
    Modal.confirm({
      title: '确认删除成员',
      content: '删除以后，该用户无法使用产品',
      cancelText: '取消',
      okText: '确定',
      onOk: this.onDeleteAll.bind(this, id)
    });
  }
  /**
   * 页面列表
   */

  personManagement() {
    const height = window.innerHeight - 120;
    return (
      <div className="person-management" style={{ height }}>
        <RadioGroup value={this.state.value2} onChange={this.onNestChange}>
          {this.state.dataSource.map((item, index) => {
            return (
              <RadioButton
                onClick={() => this.scrollToTable(item.name, index)}
                key={index}
                value={item.name}
                className={ this.state.activeRadio == index ? 'active-radio' : 'normal-radio' }
              >
                {item.name}
              </RadioButton>
            );
          })}
        </RadioGroup>

        <div id="commentlist" className="scroll">
          <div>
            {this.state.dataSource.map((item, index) => (
              <div key={index} id={item.name} style={{ marginBottom: 10 }}>
                <h3>
                  {item.name} 共{item.count}人
                </h3>
                <div style={{ marginBottom: '25px' }}>
                  <Table
                    loading={this.state.loading}
                    rowKey={record => record.id}
                    dataSource={item.userList}
                    hasBorder={false}
                    pagination={false}
                    rowSelection={{
                      onChange: (a, b) => {
                        this.onSelectItem(a, b, index);
                      },
                      selectedRowKeys: this.state.selectedKeysAll[index]
                    }}
                  >
                    <Table.Column
                      align="left"
                      title={<span style={{ color: '#999999' }}>姓名</span>}
                      dataIndex="name"
                      width="20%"
                    />
                    <Table.Column
                      align="left"
                      title={<span style={{ color: '#999999' }}>用户名</span>}
                      dataIndex="account"
                      width="20%"
                    />
                    <Table.Column
                      align="left"
                      title={<span style={{ color: '#999999' }}>角色</span>}
                      dataIndex="currentRoleGroup"
                      width="45%"
                    />
                    <Table.Column
                      align="right"
                      title={<span style={{ color: '#999999' }}>操作</span>}
                      render={this.userAction.bind(this)}
                      dataIndex="action"
                      width="15%"
                    />
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  account = '';
  password = '';
  name = '';
  position = '';
  workshop = [];
  phone = '';
  email = '';
  roleIds = [];
  /**
   * 检测是否可以提交
   */

  checkIsSubmit(value) {
    // switch(){
    //   case 'account':
    //   break;
    //   case 'account':
    //   break;

    // }
    if (value !== 'workshop') {
      if (
        value === 'account' ||
        value === 'password' ||
        value === 'phone' ||
        value === 'email'
      ) {
        // this[value] = this.field.getState(value);
        this[value] = this.props.form.getFieldValue(value) || '';

      } else {
        // this[value] = this.field.getValue(value);
        this[value] = this.props.form.getFieldValue(value) || '';
      }
    }

    let checkIsSubmit = this.state.checkIsSubmit;
    if (
      this.account === 'success' &&
      this.password === 'success' &&
      this.name != '' &&
      this.roleList &&
      this.state.workshopValue.length > 0 &&
      this.roleList.length > 0 &&
      this.phone !== 'error' &&
      this.email !== 'error'
    ) {
      checkIsSubmit = true;
    } else {
      checkIsSubmit = false;
    }
    this.setState({ checkIsSubmit });
  }

  /**
   * 检测
   */

  onChangeCheck(rule, value, callback) {
    this.userAccountCheck().then(data => {
      this.checkIsSubmit('account');
      if (!value) {
        callback();
      } else if (!data) {
        callback([new Error('该账号已经使用')]);
      } else if (!/^\w{3,16}$/.test(value)) {
        callback([new Error('请输入3-16位字母与数字组合')]);
      } else {
        callback();
      }
    });
  }

  /**
   * 检测密码
   */

  onChangeCheckPassWord(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      this.checkIsSubmit('password');
      if (!/^\w{6,16}$/.test(value)) {
        callback([new Error('请输入6-16位密码')]);
      } else {
        callback();
      }
    }
  }

  /**
   * 检测手机号
   */

  onCheckPhone(rule, value, callback) {
    if (!value) {
      callback();
    } else if (
      !/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/.test(
        value
      )
    ) {
      this.setState({ CheckPhone: false }, () => {
        callback([new Error('请输入正确的手机号')]);
        this.checkIsSubmit('phone');
      });
    } else {
      // this.setState({ CheckPhone: true }, () => {
      //   this.checkIsSubmit('phone');
      //   callback();
      // });
      callback();
    }
  }

  /**
   * 检测邮箱
   */

  onCheckEmail(rule, value, callback) {
    if (!value) {
      callback();
    } else if (
      !/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(
        value
      )
    ) {
      this.setState({ CheckEmail: false }, () => {
        this.checkIsSubmit('email');
        callback([new Error('请输入正确的邮箱')]);
      });
    } else {
      // this.setState({ CheckEmail: true }, () => {
      //   this.checkIsSubmit('email');
      //   callback();
      // });
      callback();
    }
  }

  /**
   * 账号检查
   */

  roleAccountCheck() {
    // const roleName = this.field.getValue('roleName');
    const roleName = this.props.form.getFieldValue('roleName') || '';
    return new Promise((resolve, reject) => {
      ajax(
        {
          api: 'rolecheckUnique',
          params: { roleName }
        },
        json => {
          if (roleName == this.state.judgeRoleName) {
            resolve(true);
          } else {
            resolve(json.data.data);
          }
          this.setState({ isRoleCheckSuccess: json.data.data });
        }
      );
    });
  }

  /**
   * 检测角色管理
   */

  onChangeCheckRole(rule, value, callback) {
    if (this.roleTime) {
      clearTimeout(this.roleTime);
    }
    this.roleTime = setTimeout(() => {
      this.roleAccountCheck().then(data => {
        this.checkIsSubmit('roleName');
        if (!value) {
          callback();
        } else if (!data) {
          callback([new Error('该账号已经使用')]);
        } else {
          callback();
        }
      });
    }, 500);
  }
  /**
   * 点击车间
   */
  handleClick(id) {
    this.setState({
      isShowWorkShop: true,
      activeId: id
    });
    const workshopData =  this.state.workshopData;
    workshopData.forEach((item, index) => {
      if(id == item.id) {
        this.setState({
          workshop: item.children
        })
      }
   })
  }
  // 选中的车间值
  handleCheck(value) {
    this.setState({
      checkedWorkShop: value,
      workshopValue: value
    })
    this.props.form.setFieldsValue({
      workShopIds: value
    });
  }
  /**
   * 页面dom
   */
  personMask() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    };
    const { isCheckSuccess } = this.state;

    return (
      <Form>
        <FormItem {...formItemLayout} label="账号：">
          {getFieldDecorator('account', {
            rules: [
              {
                required: true,
                message: '请输入账号'
              },
              {
                min: 3,
                message: '账号最少为3个字符'
              },
              this.state.isAdd?
              {
                validator: this.onChangeCheck.bind(this)
              }:''
            ]
          })(<Input disabled={!this.state.isAdd} className="form-input" placeholder="请输入账号" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="密码：">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码'
              },
              {
                min: 6,
                message: '密码最少为6个字符'
              },
              this.state.isAdd?{ validator: this.onChangeCheckPassWord.bind(this) }:''
            ]
          })(<Input disabled={!this.state.isAdd} className="form-input" placeholder="请输入密码" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="姓名：">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入姓名'
              }
            ]
          })(<Input className="form-input" placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="职务：">
          {getFieldDecorator('position', {
            initialValue: '',
          })(
            <Input className="form-input" placeholder="请输入职务" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="手机：">
          {getFieldDecorator('phone', {
            rules: [{ validator: this.onCheckPhone.bind(this) }]
          })(
            <Input className="form-input" placeholder="请输入手机" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="邮箱：">
          {getFieldDecorator('email', {
            rules: [{ validator: this.onCheckEmail.bind(this) }]
          })(
            <Input className="form-input" placeholder="请输入邮箱" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="角色：">
          {getFieldDecorator('roleIds', {
            rules: [
              {
                required: true,
                message: '请输入角色'
              }
            ]
          })(
            <Select
              mode="multiple"
              placeholder="请选择角色"
              className="form-input"
            // onChange={handleChange}
            >
              {this.state.roleList.map((item, index) => {
                return (
                  <Option key={index} value={item.id.toString()}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="车间：">
          {getFieldDecorator('workShopIds', {
            rules: [
              {
                required: true,
                message: '请选择车间'
              }
            ],
            // initialValue: this.state.workshopValue
          })(
            <Cascader 
            workshopData = {this.state.workshopData}
            workshop = {this.state.workshop}
            defaultChecked = {this.state.workshopValue}
            handleClick = {this.handleClick.bind(this)}
            handleCheck = {this.handleCheck.bind(this)}
            isShowWorkShop = {this.state.isShowWorkShop}
            active = {this.state.activeId}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  /**
   * 车间权限
   */

  onChangeWorkshop(value, data, extra) {
    // console.log(value, data, extra);

    this.setState(
      {
        workshopValue: value
      },
      this.checkIsSubmit.bind(this, 'workshop')
    );
  }

  roleSet() {
    const height = window.innerHeight - 120;
    return (
      <div
        style={{ borderTop: '1px solid #ccc', borderBottom: 0, height }}
        className="role-content"
      >
        <Table
          loading={this.state.loading}
          pagination={false}
          rowKey={record => record.id}
          dataSource={this.state.roleListDataSource}
          hasBorder={false}
        >
          <Table.Column
            align="left"
            title="角色"
            dataIndex="role"
            width="20%"
          />
          <Table.Column
            align="left"
            title="描述"
            dataIndex="desc"
            width="20%"
          />
          <Table.Column
            align="left"
            title="权限范围"
            dataIndex="permissions"
            width="45%"
          />
          <Table.Column
            align="right"
            title="操作"
            width={200}
            render={this.roleAction.bind(this)}
            dataIndex="action"
            width="15%"
          />
        </Table>
      </div>
    );
  }

  /**
   * 选中树形结构
   */

  defaultSelectTree(record) {
    const { activeKeyNode, allTreeNodeKeys } = this.state;
    const obj = {};
    record.children.forEach((item, index) => {
      const filterArr = item.children.filter((ele, i) => ele.authorize);

      obj[item.id] = filterArr.map((ele, i) => String(ele.id));

      obj[`fatherNode${item.id}`] = [];
      obj[`fatherNode${item.id}`].push(String(item.id));
      item.children.forEach((ele, index) => {
        let newArr = [];
        if (ele.children) {
          newArr = ele.children.filter((element, j) => element.authorize);
        }
        newArr.forEach((el, key) => {
          obj[item.id].push(String(el.id));
        });
      });
    });
    // let fatherNode = record.nodes.children.filter(
    //   (item, index) => item.authorize
    // );

    // fatherNode.forEach((item, index) => {
    //   obj[item.id].push(String(item.id));
    // });

    this.setState({ allTreeNodeKeys: obj });
  }

  /**
   * 是否可以提交
   */

  checkIsRoleSubmit() {
    // const roleName = this.field.getValue("roleName");
    // const roleDesc = this.field.getValue("roleDesc");
    // let checkIsRoleSubmit = false;
    // if (roleDesc && roleName) {
    //   checkIsRoleSubmit = true;
    // }
    // this.setState({ checkIsRoleSubmit });
  }

  /**
   * role DOM
   */

  roleMask() {
    const { getFieldDecorator } = this.props.form;
    // const init = this.field.init;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    };
    const activeKeyNode = _.cloneDeep(this.state.activeKeyNode);
    let { isRoleCheckSuccess } = this.state;
    return (
      <Form onSubmit={this.onRoleSubmit}>

        <FormItem {...formItemLayout} label="角色">
          {getFieldDecorator('roleName', {
            rules: [{ required: true, message: '请输入角色名称' },
            { validator: this.onChangeCheckRole.bind(this) }],
          })(
            <Input className="form-input" style={{ width: 192 }} placeholder="角色名称" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="描述">
          {getFieldDecorator('roleDesc', {
            rules: [{ required: true, message: '请输入角色描述' }],
          })(
            <Input className="form-input" style={{ width: 192 }} placeholder="角色描述" />
          )}
        </FormItem>
        <div>
          <Tabs
            activeKey={this.state.activeKeyRoleTab.toString()}
            animation={false}
            onChange={this.onChangeActiveKeyRoleTab.bind(this)}
            style={{ marginLeft: 12, marginTop: 30 }}
            size="small"
            type="capsule"
          >
            {_.get(this.state, 'roleMenuList').map(item => (
              <TabPane key={item.id} tab={item.name}>
                {this.showTreeNode(activeKeyNode)}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </Form>
    );
  }

  /**
   *
   * 树形控件
   */

  onRoleSubmit() {
    let id = null;
    if (!this.state.isRoleAdd) {
      id = this.state.roleId;
    }
    this.roleUpdateAjax(id).then(data => {
      this.getRoleList();
      this.setState({
        isRoleShowMask: false
      });
    });
  }
  /**
   * 树形控件函数
   */

  onSelect(keys, info) { }

  onCheck(keys, info) {
    const allTreeNodeKeys = _.cloneDeep(this.state.allTreeNodeKeys);
    const activeKeyRoleTab = this.state.activeKeyRoleTab;
    const halfCheckedKeys = info.halfCheckedKeys;

    allTreeNodeKeys[activeKeyRoleTab] = keys;
    halfCheckedKeys.forEach(item => {
      allTreeNodeKeys[`fatherNode${item}`] = item;
    });
    this.setState({ allTreeNodeKeys });
  }

  /**
   *
   * @param {*选中树形控件默认值} info
   */

  selectTreeDefault() {
    const { activeKeyNode, allTreeNodeKeys } = this.state;
    let arrKeys = [];
    const fatherKey = null;
    _.forEach(allTreeNodeKeys, (item, key) => {
      if (!item.length && String(Number(key)) !== 'NaN') {
        allTreeNodeKeys[`fatherNode${key}`] = [];
      }
      arrKeys = arrKeys.concat(item);
    });
    return arrKeys;
  }

  onRightClick(info) { }

  showTreeNode(activeKeyNode) {
    const mask = document.getElementsByClassName('mask-show')[0];
    let height = window.getComputedStyle(mask, null).height;
    height = `calc(${height} - 250px)`;
    const { roleTreeType, activeKeyRoleTab, allTreeNodeKeys } = this.state;
    const selectKeys = allTreeNodeKeys[activeKeyRoleTab]
      ? allTreeNodeKeys[activeKeyRoleTab]
      : [];

    return (
      <div className="show-tree-node" style={{ height }}>
        <Tree
          multiple
          checkable
          showLine={true}
          checkStrictly={false}
          checkedKeys={selectKeys}
          defaultExpandAll
          enableCheckedCache={false}
          onCheck={this.onCheck.bind(this)}
          onRightClick={this.onRightClick.bind(this)}
        >
          {
            <TreeNode title={activeKeyNode.name} key={activeKeyNode.id}>
              {activeKeyNode.children &&
                activeKeyNode.children.map((item, index) => (
                  <TreeNode title={item.name} key={item.id}>
                    {item.children
                      ? item.children.map((ele, i) => (
                        <TreeNode title={ele.name} key={ele.id} />
                      ))
                      : null}
                  </TreeNode>
                ))}
            </TreeNode>
          }
        </Tree>
      </div>
    );
  }

  onChangeActiveKeyRoleTab(id) {
    const activeKeyNode = this.state.roleMenu.filter(
      (item, index) => item.id === Number(id)
    );
    this.setState({ activeKeyRoleTab: id, activeKeyNode: activeKeyNode[0] });
  }

  /**
   * roleset设置
   */

  getRoleList() {
    this.setState({
      loading: true
    });
    ajax(
      {
        api: 'getRolelist'
      },
      json => {
        if (json.data) {
          this.setState({ roleListDataSource: json.data.data });
        }
        this.setState({
          loading: false
        });
      }
    );
  }

  /**
   * roleaction
   */

  roleAction(value, record, index) {
    const edit = (
      <Icon
        type="edit"
        onClick={this.onClickRoleShowMask.bind(this, record)}
        style={{ cursor: 'pointer', marginRight: '10' }}
      />
    );
    const deleteAction = (
      <Icon
        type="delete"
        onClick={this.onDeleteRoleList.bind(this, record.id)}
        style={{ cursor: 'pointer' }}
      />
    );
    return (
      <span>
        <Tooltip title="编辑">{edit}</Tooltip>
        <Tooltip title="删除">{deleteAction}</Tooltip>
      </span>
    );
  }

  //获取角色列表设置
  getRoleParamsInfo(roleId) {
    return new Promise((resolve, reject) => {
      ajax(
        {
          api: 'getRoleSet',
          params: { roleId }
        },
        res => {
          res.data && resolve(res.data.data[0]);
        }
      );
    });
  }

  onClickRoleShowMask(record) {
    this.getRoleParamsInfo(record.id).then(data => {
      this.setState(
        {
          judgeForm: false,
          isRoleShowMask: true,
          isRoleAdd: false,
          roleId: record.id,
          activeKeyNode: this.state.roleMenu[0],
          activeKeyRoleTab: this.state.roleMenuList[0].id,
          checkIsRoleSubmit: true,
          judgeRoleName: record.role
        },
        () => {
          this.defaultSelectTree(data);
        }
      );
      this.props.form.setFieldsValue({
        roleName: record.role,
        roleDesc: record.desc
      });
    });
  }

  /**
   * 角色更新
   */

  roleUpdateAjax(id) {
    return new Promise((resolve, reject) => {
      let params = {};
      if (id) {
        params.id = id;
      }
      const content = !id ? '添加成功' : '修改成功';
      this.props.form.validateFields((err, values) => {
        if (!err) {
          params.name = values.roleName;
          params.description = values.roleDesc;
          params.menuIds = this.selectTreeDefault();
          ajax(
            {
              api: 'addOneRole',
              method: 'post',
              dataType: 'json',
              contentType: 'application/json',
              data: params
            },
            json => {
              if (json.data) {
                resolve(json.data.data);
                message.success(
                  content
                );
              }
            }
          );
        }
      });
      params.menuIds = this.selectTreeDefault();
    });
  }

  onDeleteRoleList(id) {
    this.setState({ roleVisible: true, roleId: id }, () => {
      Modal.confirm({
        title: '确认删除角色',
        cancelText: '取消',
        okText: '确定',
        content: '删除以后，该角色无法使用',
        onOk: this.onRoleOk.bind(this)
      });
    });
  }

  onRoleClose() {
    this.setState({
      isRoleShowMask: false
    });
  }

  onRoleCancel() {
    this.setState({ roleVisible: false });
  }

  onRoleOk() {
    ajax(
      {
        api: 'roleRoleDelete',
        method: 'put',
        dataType: 'json',
        contentType: 'application/json',
        data: { id: this.state.roleId }
      },
      json => {
        if (json.data) {
          if (json.data.code == 200) {
            message.success('删除成功');
          }
          this.getRoleList();
          this.setState({ roleVisible: false });
        }
      }
    );
  }

  addRole() {
    this.setState({
      judgeForm: false,
      isRoleShowMask: true,
      activeKeyNode: this.state.roleMenu[0],
      activeKeyRoleTab: this.state.roleMenuList[0].id,
      isRoleAdd: true,
      checkIsRoleSubmit: true,
      allTreeNodeKeys: {}
    });
    this.props.form.setFieldsValue({
      roleName: '',
      roleDesc: ''
    });
  }

  dataPermissions() { }

  /**
   * 切换页面
   * @param {*} name
   */

  fetchListByType(name) {
    name = name || null;
    switch (name) {
      case '人员管理':
        return this.personManagement();
        break;
      case '角色设置':
        return this.roleSet();
        break;
      case '数据权限':
        return this.dataPermissions();
        break;
      default:
        return this.personManagement();
        break;
    }
  }
  /**
   * 选项卡
   */

  activeKey(activeKey) {
    this.setState({ activeKey }, () => {
      this.getRoleList();
      this.getPersonManagement();
    });
  }
  allSelect(isCheck) {
    let { allLength, dataSource, selectedKeysCheck } = this.state;
    if (isCheck.target.checked) {
      let arr = dataSource.map((item, index) => {
        return item.userList.map((ele, i) => {
          return ele.id;
        });
      });
      let arrLength = [];
      arr.forEach((item, index) => {
        arrLength = arrLength.concat(item);
      });
      this.setState({
        isCheck: isCheck.target.checked,
        arrLength,
        selectedKeysAll: arr
      });
    } else {
      this.setState({
        isCheck: isCheck.target.checked,
        arrLength: [],
        selectedKeysAll: {}
      });
    }
  }
  render() {
    const footer = (
      <span>
        <Button onClick={this.onRoleOk.bind(this)}>删除</Button>
        <Button onClick={this.onRoleCancel.bind(this)} type="primary">
          不删除
        </Button>
      </span>
    );
    const { activeKey, selectedKeysCheck } = this.state;
    return (
      <div className="integration-management-content">
        {this.state.activeKey !== '角色设置' && (
          <div className="right-bottom">
            <div className="row" style={{ marginTop: '10px', border: 1 }}>
              <div style={{ marginLeft: 50 }}>
                <Checkbox
                  checked={this.state.isCheck}
                  style={{ marginLeft: -20 }}
                  onChange={this.allSelect.bind(this)}
                >
                  全选
                </Checkbox>
                <span style={{ marginLeft: 20 }}>已选中</span>
                <span style={{ color: '#4bd3e9' }}>
                  {this.state.arrLength.length}
                </span>/{this.state.allLength}
                <span style={{ marginRight: 10 }}>个</span>
                <Button
                  disabled={!this.state.arrLength.length}
                  onClick={() => {
                    this.onDeleteOk(this.state.arrLength);
                  }}
                >
                  批量删除
                </Button>
              </div>
            </div>
          </div>
        )}
        <Button
          type="primary"
          onClick={_.get(this.tabTypeBtn[activeKey], 'funC')}
          className="add-btn"
        >
          {_.get(this.tabTypeBtn[activeKey], 'text')}
        </Button>
        <Tabs
          activeKey={this.state.activeKey}
          onChange={this.activeKey.bind(this)}
          style={{ marginTop: 9 }}
        >
          {_.get(this.state, 'category').map(item => (
            <TabPane key={item.name} tab={item.name}>
              {this.fetchListByType(item.name)}
            </TabPane>
          ))}
        </Tabs>

        <Mask
          isShowMask={this.state.isShowMask}
          disabled={false}
          title={this.state.isAdd ? '添加成员' : '编辑成员'}
          onSubmit={this.onSubmit.bind(this)}
          onClose={this.onClose.bind(this)}
        >
          {this.state.judgeForm ? this.personMask() : null}
        </Mask>
        <Mask
          isShowMask={this.state.isRoleShowMask}
          disabled={!this.state.checkIsRoleSubmit}
          title={this.state.isRoleAdd ? '添加角色' : '编辑角色'}
          onSubmit={this.onRoleSubmit.bind(this)}
          onClose={this.onRoleClose.bind(this)}
        >
          {!this.state.judgeForm ? this.roleMask() : null}
        </Mask>
        <div />
      </div>
    );
  }
}
const ManagementForm = Form.create()(Management);

export default ManagementForm;
