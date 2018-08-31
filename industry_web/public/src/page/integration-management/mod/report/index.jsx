"use strict";

import React from "react";
import {
  Menu,
  Button,
  Search,
  Table,
  Checkbox,
  Pagination,
  Icon,
  Input,
  Modal,
  Tooltip,
  Switch,
  Row,
  message,
  Popover
} from "antd";
import { ajax } from "utils/index";
import { connectAll } from "common/redux-helpers";
import Mask from "components/mask";
import "utils/apimap";
import "./index.scss";
const CheckboxGroup = Checkbox.Group;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskList: [],
      value: 1,
      total: "",
      deleteDialog: false,
      deleteGDialog: false,
      updateDialog: false,
      createDialog: false,
      inputValue: "",
      visible: true,
      biUrl: "",
      biName: "",
      createdUser: "",
      array: [],
      selectedKeys: "0",
      checkIsSubmit: false,
      isShowMask: false,
      workshop: ["请选择车间"],
      character: ["请选择角色"],
      overlayVisible1: false,
      overlayVisible2: false,
      all2: false,
      all: false,
      selectedKeysCheck: [],
      loading: true
    };
    this.onSelectItem = this.onSelectItem.bind(this);
    this.translateTime = this.translateTime.bind(this);
    this.pollingFetch = this.pollingFetch.bind(this);
    this.pollingFetchState = this.pollingFetchState.bind(this);
    this.paginationChange = this.paginationChange.bind(this);
    this.editItem = this.editItem.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.cellEditRender = this.cellEditRender.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOk = this.onOk.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.addNewReport = this.addNewReport.bind(this);
    this.publishReport = this.publishReport.bind(this);
    this.closeClick = this.closeClick.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.updateGroupFetch = this.updateGroupFetch.bind(this);
    this.deleteGroupFetch = this.deleteGroupFetch.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.createGroupFetch = this.createGroupFetch.bind(this);
    this.pollingIdFetch = this.pollingIdFetch.bind(this);
    this.getGroupFetch = this.getGroupFetch.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  componentDidMount() {
    this.getAllRoll();
    let selectTitle = JSON.parse(sessionStorage.getItem("selectTitle"));
    selectTitle = selectTitle ? selectTitle : this.props.workshop;
    this.getGroupFetch({ workShop: selectTitle.value }, true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workshop !== this.props.workshop) {
      this.getGroupFetch({ workShop: nextProps.workshop });
      this.pollingIdFetch(this.defaultGroupId, nextProps.workshop);
    }
  }

  pollingFetch(value) {
    this.setState({
      loading: true
    });
    ajax(
      {
        api: "biAdminList",
        params: {
          pageNum: value,
          pageSize: 10,
          isSort: 0,
          groupId: this.indexGroupId,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        // Toast.hide();
        json.data.data.list.forEach((item, index) => {
          item["editable"] = false;
        });
        this.setState({
          taskList: json.data.data.list,
          total: json.data.data.total
        });
        this.setState({
          loading: false
        });
      },
      () => { }
    );
  }
  itemIndex = 0;
  pollingFetchState(index) {
    const item = this.state.taskList;

    if (item[index].isPublish === 0) {
      message.success("发布成功");
    } else {
      message.success("取消发布");
    }
    item[index].isPublish = item[index].isPublish === 1 ? 0 : 1;
    this.setState({
      taskList: item
    });
    setTimeout(() => {
      //   Toast.hide();
    }, 1000);
  }

  pollingIdFetch(value, data) {
    if (!value) {
      value = this.state.array ? this.state.array[0].id : ''
    }
    this.indexGroupId = value;
    ajax(
      {
        api: "biAdminList",
        params: {
          pageNum: this.state.value,
          pageSize: 10,
          isSort: 0,
          groupId: value,
          workShop: data
        }
      },
      json => {
        // Toast.hide();
        json.data.data.list.forEach((item, index) => {
          item["editable"] = false;
        });
        this.setState(
          {
            taskList: json.data.data.list,
            total: json.data.data.total,
            groupId: value
          },
          () => { }
        );
      },
      () => { }
    );
  }

  createGroupFetch() {
    //http://ip:8080/api/bi/createGroup?groupName=xxx
    this.setState({
      createDialog: false
    });
    ajax(
      {
        api: "createGroup",
        params: {
          groupName: this.state.inputValue,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        if (json.data.code === 200) {
          this.setState({
            inputValue: ""
          });
          this.getGroupFetch();
          message.success("创建成功");
        }
      },
      err => {
        message.error(err);
      }
    );
  }

  deleteGroupFetch() {
    this.setState({
      deleteGDialog: false
    });
    ajax(
      {
        api: "deleteGroup",
        params: {
          id: this.groupId,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        if (json.data.code === 200) {
          this.setState({
            deleteGDialog: false
          });
          message.success("删除成功");
          this.getGroupFetch(
            {
              workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
            },
            true
          );
        }
      },
      err => {
        message.error(err);
      }
    );
  }

  updateGroupFetch() {
    this.setState({
      inputValue: ""
    });
    ajax(
      {
        api: "updateGroup",
        params: {
          id: this.groupId,
          groupName: this.state.inputValue,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        if (json.data.code === 200) {
          this.setState({
            updateDialog: false
          });
          message.success("更新成功");
          this.getGroupFetch();
          this.setState({ inputValue: "" });
        }
      },
      err => {
        message.error(err);
      }
    );
  }

  getGroupFetch(data, getList) {
    data = data
      ? data
      : { workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value };
    ajax(
      {
        api: "listAdminGroup",
        data: data
      },
      json => {
        if (json.data.code === 200 && json.data.data.length !== 0) {
          if (this.indexGroupId === -1) {
            this.indexGroupId = json.data.data[0].id;
          }
          this.setState({
            array: json.data.data
          });

          // // // console.log(this.defaultGroupId,"---",json.data,this.state.selectedKeys[0]);
          if (getList) {
            this.pollingFetch(this.state.value);
          }
        } else {
          this.setState({
            array: []
          });
          //   Toast.hide();
        }
      },
      () => { }
    );
  }

  translateTime(time) {
    const cstTime = new Date(time);
    const year = cstTime.getFullYear();
    const month =
      cstTime.getMonth() + 1 > 9
        ? cstTime.getMonth() + 1
        : `0${cstTime.getMonth() + 1}`;
    const day =
      cstTime.getDate() > 9 ? cstTime.getDate() : `0${cstTime.getDate()}`;
    const hours =
      cstTime.getHours() > 9 ? cstTime.getHours() : `0${cstTime.getHours()}`;
    const min =
      cstTime.getMinutes() > 9
        ? cstTime.getMinutes()
        : `0${cstTime.getMinutes()}`;
    const sec =
      cstTime.getSeconds() > 9
        ? cstTime.getSeconds()
        : `0${cstTime.getSeconds()}`;
    return `${year}-${month}-${day}  ${hours}:${min}:${sec}`;
  }

  onSelectItem(a, b) {
    this.setState({
      deleteId: a.join(","),
      selectedKeysCheck: a
    });
  }

  deleteGroup(id) {
    this.groupId = id;
    this.setState({
      deleteGDialog: true
    }, () => {
      Modal.confirm({
        cancelText: '取消',
        okText: '确定',
        content: '删除后，所有数据将全部清空',
        title: '确认删除文件夹',
        onOk: this.deleteGroupFetch
      });
    });
  }

  onDelectTask(id) {
    this.setState({
      deleteId: id,
    }, () => {
      const tip = <span>
        <span>确认删除数据</span>
        <p style={{ color: "rgba(153, 153, 153, 0.72)", marginTop: 8 }}>删除后，无法查看该数据</p>
      </span>
      Modal.confirm({
        cancelText: '取消',
        okText: '确定',
        content: '删除后，无法查看该数据',
        title: '确认删除数据',
        onOk: this.onOk
      });
    });

  }

  onOk() {
    ajax(
      {
        api: "biDelete",
        params: {
          id: this.state.deleteId,
          workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
        }
      },
      json => {
        message.success("删除成功");
        this.setState({
          deleteDialog: false,
          inputValue: "",
          selectedKeysCheck: []
        });
        setTimeout(() => {
          this.pollingFetch(this.state.value);
        }, 1500);
      },
      () => { }
    );
  }

  onClose() {
    this.setState({
      deleteDialog: false
    });
  }

  paginationChange(value) {
    this.setState({
      value
    });
    this.pollingFetch(value);
  }

  editItem(index, record) {
    let isEdit = false;
    let list = this.state.taskList;
    list.forEach((item, index) => {
      if (item.editable === true) {
        isEdit = true;
      }
    });
    if (!isEdit) {
      this.isAdd = false;
      const item = this.state.taskList;
      item[index].editable = true;
      this.setState({
        taskList: item,
        biUrl: record.biUrl,
        biName: record.biName,
        createdUser: record.createdUser,
        release: record.release
      });
    } else {
      message.warning("请保存当前项再操作");
    }
  }

  groupId = -1;
  indexGroupId = -1;

  saveItem(index, id) {
    let isDelete = false;
    if (this.indexGroupId === -1) {
      return;
    }
    if (this.state.biUrl && this.state.biName && this.state.createdUser) {
      const item = this.state.taskList;
      const parame = {
        path: this.state.biUrl,
        name: this.state.biName,
        owner: this.state.createdUser,
        groupId: this.indexGroupId,
        workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
      };
      if (id) {
        ajax(
          {
            api: "biUpdate",
            data: {
              ...parame,
              id
            },
            dataType: "json",
            method: "post",
            contentType: "application/json"
          },
          res => {
            if (res.data) {
              message.success("保存成功");
              isDelete = true;
              this.setState({
                biUrl: "",
                biName: "",
                createdUser: ""
              });
            }
          },
          err => {
            message.error(err);
          }
        );
      } else {
        ajax(
          {
            api: "biCreate",
            data: parame,
            dataType: "json",
            method: "post",
            contentType: "application/json"
          },
          res => {
            if (res.data) {
              message.success("保存成功");
              isDelete = true;
              this.setState({
                biUrl: "",
                biName: "",
                createdUser: ""
              });
            }
          },
          err => {
            message.error(err);
          }
        );
      }

      setTimeout(() => {
        isDelete && this.pollingFetch(this.state.value);
      }, 1500);
    } else {
      message.warning("请完善信息后保存");
    }
  }

  cellEditRender(key) {
    return (value, record, index) => {
      if (key !== "isPublish") {
        if (record.editable) {
          return (
            <Input
              defaultValue={record[key]}
              onChange={value => {
                this.inputChange(key, value);
              }}
            />
          );
        } else {
          return record[key];
        }
      } else {
        return (
          <Switch
            checked={record[key] === 1}
            onChange={checked => {
              this.onSwitchChange(checked, index, record);
            }}
          // size="small"
          />
        );
        z;
      }
    };
  }
  record;
  onSwitchChange = (checked, index, record) => {
    this.itemIndex = index;
    this.record = record;
    let isEdit = false;
    let list = this.state.taskList;
    list.forEach((item, index) => {
      if (item.editable === true) {
        isEdit = true;
      }
    });
    if (!isEdit) {
      if (checked) {
        this.setState({ isShowMask: true });
      } else {
        ajax(
          {
            api: "biUnPublish",
            params: {
              reportId: record.id
            }
          },
          json => {
            // message.success("取消发布");
            setTimeout(() => {
              // message.hide();
            }, 1000);
            this.pollingFetchState(index);
          },
          () => { }
        );
      }
    } else {
      message.warning("请保存当前项再操作");
    }
  };
  inputChange(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }

  addNewReport() {
    let list = this.state.taskList;
    let editInput = false;
    list.forEach((item, index) => {
      if (item.editable === true) {
        editInput = true;
      }
    });
    if (editInput) {
      message.warning("请保存当前项再操作");
    } else {
      this.isAdd = true;
      list.unshift({ biUrl: "", biName: "", createdUser: "", editable: true });
    }
    this.setState({
      taskList: list
    });
  }

  publishReport() {
    let list = this.state.taskList;
    let editInput = false;
    list.forEach((item, index) => {
      if (item.editable === true) {
        editInput = true;
      }
    });
    if (editInput) {
      message.warning("请保存当前项再操作");
    } else {
      ajax(
        {
          api: "biPublish",
          data: {
            workShop: JSON.parse(sessionStorage.getItem("selectTitle")).value
          }
        },
        json => {
          this.pollingFetchState(this.itemIndex);
        },
        () => { }
      );
    }
    this.setState({
      taskList: list
    });
  }

  closeClick() {
    window.localStorage.balloon = true;
    this.setState({
      visible: false
    });
  }

  // field = new Field(this);

  onInputChange(e) {
    this.setState({
      inputValue: e.target.value
    });
  }

  reportNav;
  onCloseMask() {
    this.setState({
      isShowMask: false,
      workshop: ["请选择车间"],
      character: ["请选择角色"],
      all: false,
      all2: false
    });
  }
  characterJson;
  onSubmit() {
    // // console.log(this.characterSource);
    // Toast.show({
    //   type: "loading",
    //   duration: 0,
    //   content: "数据加载中",
    //   hasMask: true,
    //   style: { background: "white", borderColor: "white" }
    // });
    this.characterJson = JSON.parse(this.characterSource);
    let characterId = [];
    let { character } = this.state;
    for (let i = this.characterJson.length - 1; i >= 0; i--) {
      for (let j = character.length - 1; j >= 0; j--) {
        if (this.characterJson[i].name === character[j]) {
          characterId[j] = this.characterJson[i].id;
        }
      }
    }
    ajax(
      {
        api: "biPublish",
        data: {
          id: this.record.id,
          workShopList: this.state.workshop,
          roleIdList: characterId
        },
        dataType: "json",
        method: "post",
        contentType: "application/json"
      },
      json => {
        this.setState({
          isShowMask: false,
          workshop: ["请选择车间"],
          character: ["请选择角色"],
          all: false,
          all2: false
        });
        this.pollingFetchState(this.itemIndex);
      },
      () => {
        this.setState({
          isShowMask: false,
          workshop: ["请选择车间"],
          character: ["请选择角色"],
          all: false,
          all2: false
        });
      }
    );
  }

  onOverLayClick() {
    // // // console.log("this.state.overlayVisible1::" + this.state.overlayVisible1);
    this.setState({ overlayVisible1: !this.state.overlayVisible1 });
  }
  onOverLayClick2() {
    // // // console.log("this.state.overlayVisible2::" + this.state.overlayVisible2);
    this.setState({ overlayVisible2: !this.state.overlayVisible2 });
  }
  onOverLayClose = () => {
    this.setState({
      overlayVisible1: false
    });
  };
  onOverLayClose2 = () => {
    this.setState({
      overlayVisible2: false
    });
  };
  onCheckboxGroupChange = selectedItems => {
    // // // console.log("onChange callback", selectedItems);
    if (selectedItems[0] === "请选择车间" && selectedItems.length > 1) {
      this.setState({
        workshop: selectedItems.slice(1)
      });
    } else {
      if (selectedItems.length === 0) {
        this.setState({
          workshop: ["请选择车间"]
        });
      } else {
        this.setState({
          workshop: selectedItems
        });
      }
    }
  };
  onCheckboxGroupChange2 = selectedItems => {
    // // // console.log("onChange callback", selectedItems);

    if (selectedItems[0] === "请选择角色" && selectedItems.length > 1) {
      this.setState({
        character: selectedItems.slice(1)
      });
    } else {
      if (selectedItems.length === 0) {
        this.setState({
          character: ["请选择角色"]
        });
      } else {
        this.setState({
          character: selectedItems
        });
      }
    }
  };

  characterSource = "[]";
  getAllRoll = () => {
    ajax(
      {
        api: "queryAllRole"
      },
      json => {
        let character = json.data.data;
        this.characterSource = JSON.stringify(json.data.data);
        for (var i = character.length - 1; i >= 0; i--) {
          character[i] = character[i].name;
        }
        this.character = character;
      },
      () => { }
    );
    ajax(
      {
        api: "workShopListByUser"
      },
      json => {
        this.workshop = json.data.data;
      },
      () => { }
    );
  };
  character = [];
  workshop = [];
  isAdd = false;
  cancelEdit = (index, record) => {
    const item = this.state.taskList;
    item[index].editable = false;
    this.setState({
      taskList: item
    });
    this.pollingFetch(this.state.value);
    // this.getGroupFetch({ workShop: selectTitle.value }, true);
  };
  render() {
    // let defaultMenu = this.state.array[this.indexGroupId] ? this.state.array[this.indexGroupId].groupName : '';
    // // // console.log('pang:::' + defaultMenu);
    // const { init, getValue } = this.field;
    const createTime = (value, index, record) => {
      return this.translateTime(record.createdAt);
    };
    // const publishButton = window.localStorage.balloon ? (
    //   <Button
    //     type="primary"
    //     onClick={() => {
    //       this.publishReport();
    //     }}
    //     style={{ marginLeft: "10px" }}
    //   >
    //     发布
    //   </Button>
    // ) : (
    //   <Balloon
    //     visible={this.state.visible}
    //     trigger={
    //       <Button
    //         type="primary"
    //         onClick={() => {
    //           this.publishReport();
    //         }}
    //         style={{ marginLeft: "10px" }}
    //       >
    //         发布
    //       </Button>
    //     }
    //     closable={true}
    //     align="b"
    //     style={{ color: "white", background: "#373D41" }}
    //     type="primary"
    //     onCloseClick={() => {
    //       this.closeClick();
    //     }}
    //   >
    //     点击发布后
    //     <br />修改内容在前台生效
    //   </Balloon>
    // );
    const TooltipClickDiv = <div
      id="model-select"
      className="model-select"
      ref="target"
      onClick={this.onOverLayClick.bind(this)}
    >
      <div className="model-select-left">
        {this.state.workshop.map((item, index) => {
          if (index === 0) {
            return (
              <div key={index} className="model-select-txt">
                {item}
              </div>
            );
          } else {
            return (
              <div key={index} className="model-select-txt">
                , {item}
              </div>
            );
          }
        })}
      </div>
      <Icon
        type="down"
        size="xs"
        style={{ color: "#CDCDCD", marginRight: 12 }}
      />
    </div>
    const workshopSelect = <div className="overlay">
      <div className="top">
        <CheckboxGroup
          onChange={this.onCheckboxGroupChange}
          value={this.state.workshop}
          className="group"
        >
          {this.workshop.map((item, index) => {
            return (
              <div key={index} className="item2">
                <Checkbox id={index.toString()} value={item}>
                  {item}
                </Checkbox>
              </div>
            );
          })}
        </CheckboxGroup>
      </div>
      <div className="bottom">
        <div className="bottom-left">
          <Checkbox
            checked={this.state.all}
            onChange={e => {
              if (e.target.checked) {
                this.setState({
                  workshop: this.workshop,
                  all: true
                });
              } else {
                this.setState({
                  workshop: ["请选择车间"],
                  all: false
                });
              }
            }}
          >
            全选
      </Checkbox>
        </div>
        <div className="bottom-right">
          <div
            className="clear-btn"
            onClick={() => {
              this.setState({
                workshop: ["请选择车间"],
                all: false
              });
            }}
          >
            <div className="clear-btn-txt">清空</div>
          </div>

          <div
            className="my-ok-btn"
            onClick={this.onOverLayClose.bind(this)}
          >
            <div className="my-ok-btn-txt">确认</div>
          </div>
        </div>
      </div>
    </div>
    const roleSelectDiv = <div
      id="model-select"
      className="model-select"
      ref="target2"
      onClick={this.onOverLayClick2.bind(this)}
    >
      <div className="model-select-left">
        {this.state.character.map((item, index) => {
          if (index === 0) {
            return (
              <div key={index} className="model-select-txt">
                {item}
              </div>
            );
          } else {
            return (
              <div key={index} className="model-select-txt">
                , {item}
              </div>
            );
          }
        })}
      </div>
      <Icon
        type="down"
        size="xs"
        style={{ color: "#CDCDCD", marginRight: 12 }}
      />
    </div>
    const roleSelectContent = <div className="overlay">
      <div className="top">
        <CheckboxGroup
          onChange={this.onCheckboxGroupChange2}
          className="group"
          value={this.state.character}
        >
          {this.character.map((item, index) => {
            // // console.log(index);

            return (
              <div key={index} className="item">
                <Checkbox id={index.toString()} value={item}>
                  {item}
                </Checkbox>
              </div>
            );
          })}
        </CheckboxGroup>
      </div>
      <div className="bottom">
        <div className="bottom-left">
          <Checkbox
            checked={this.state.all2}
            onChange={e => {
              if (e.target.checked) {
                // // console.log(this.character);
                this.setState({
                  character: this.character,
                  all2: true
                });
              } else {
                this.setState({
                  character: ["请选择角色"],
                  all2: false
                });
              }
            }}
          >
            全选
    </Checkbox>
        </div>
        <div className="bottom-right">
          <div
            className="clear-btn"
            onClick={() => {
              this.setState({
                character: ["请选择角色"],
                all2: false
              });
            }}
          >
            <div className="clear-btn-txt">清空</div>
          </div>

          <div
            className="my-ok-btn"
            onClick={this.onOverLayClose2.bind(this)}
          >
            <div className="my-ok-btn-txt">确认</div>
          </div>
        </div>
      </div>
    </div>
    const operateRender = (value, record, index) => {
      if (!record.editable) {
        return (
          <div>
            <Tooltip
              title='编辑'
            >
              <a
                style={{ cursor: "pointer", marginRight: 5 }}
                onClick={() => {
                  this.editItem(index, record);
                }}
              >
                <Icon type="edit" />
              </a>
            </Tooltip>
            <Tooltip
              title='查看'
            >
              <a
                style={{ cursor: "pointer", marginRight: 5 }}
                onClick={() => {
                  window.open(record.biUrl);
                }}
              >
                <Icon type="eye-o" />
              </a>
            </Tooltip>
            <Tooltip
              title='删除'
            >
              <a
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.onDelectTask(record.id);
                }}
              >
                <Icon type="delete" />
              </a>
            </Tooltip>
          </div>
        );
      } else {
        return (
          <div>
            <Tooltip
              title='保存'
            >
              <a
                style={{ cursor: "pointer", marginRight: 6 }}
                onClick={() => {
                  this.saveItem(index, record.id);
                }}
              >
                <Icon type="save" />
              </a>
            </Tooltip>
            <Tooltip
              title={this.isAdd ? "删除" : "取消"}
            >
              <a
                style={{ cursor: "pointer" }}
                onClick={() => {
                  this.cancelEdit(index, record.id);
                }}
              >
                <Icon type={this.isAdd ? "delete" : "close"} />
              </a>
            </Tooltip>
          </div>
        );
      }
    };

    return (
      <div id="contain" className="apply-warehouse-set-mod">
        <Mask
          isShowMask={this.state.isShowMask}
          disabled={
            !(
              this.state.workshop[0] !== "请选择车间" &&
              this.state.character[0] !== "请选择角色"
            )
          }
          title={"确认发布对象"}
          onSubmit={this.onSubmit.bind(this)}
          onClose={this.onCloseMask.bind(this)}
        >
          <div className="mask-top-tip">
            <div className="tips">
              <Icon type="info-circle-o" style={{ color: "#E8D3B0", marginRight: 8 }} size="small" />
              <div>该报表发布后，将对您指定的车间中指定角色可见</div>
            </div>
          </div>
          <div className="mask-item">
            <div className="model-txt">车间选择</div>
            <Popover
              className='popover-tooltip'
              visible={this.state.overlayVisible1}
              // target={() => this.refs.target}
              // safeNode={() => this.refs.target}
              // onRequestClose={this.onOverLayClose.bind(this)}
              trigger="click"
              placement="bottom"

              content={
                workshopSelect
              }
            >
              {TooltipClickDiv}
            </Popover>
          </div>
          <div className="tips">
            <Icon type="info-circle-o" />
            请选择该报表对应的车间
          </div>
          <div className="mask-item" style={{ marginTop: 30 }}>
            <div className="model-txt">角色选择</div>
            <Popover
              className='popover-tooltip'
              visible={this.state.overlayVisible2}
              // target={() => this.refs.target2}
              // safeNode={() => this.refs.target2}
              // onRequestClose={this.onOverLayClose2.bind(this)}
              trigger="click"
              placement="bottom"
              content={
                roleSelectContent
              } >
              {roleSelectDiv}
            </Popover>
          </div>
          <div className="tips">
            <Icon type="info-circle-o" />
            请选择可以在应用舱查看此报表的全部角色
          </div>
        </Mask>

        <div className="data-table">
          <div className="left">
            <div className="left-top">
              <div style={{ marginLeft: 20, color: "#999999" }}>
                报表目录设置
              </div>

              <Tooltip
                title='新建文件夹'
              >
                <Icon
                  type="folder-add"
                  style={{ marginRight: 20, cursor: "pointer" }}
                  onClick={() => this.setState({ createDialog: true })}
                />
              </Tooltip>
            </div>
            <Menu
              mode="inline"
              ref={ref => (this.reportNav = ref)}
              id="apply-warehouse-report"
              selectedKeys={[this.state.selectedKeys.toString()]}
              onSelect={({ item, key, selectedKeys }) => {
                this.setState(
                  {
                    selectedKeys
                  },
                  () => {
                    this.defaultGroupId = this.state.array[selectedKeys[0]].id;
                  }
                );
              }}
            >
              {this.state.array.map((item, id) => {
                return (
                  <Menu.Item
                    onClick={() =>
                      this.pollingIdFetch(
                        item.id,
                        JSON.parse(sessionStorage.getItem("selectTitle")).value
                      )
                    }
                    style={{
                      color: "#333333",
                      display: "flex",
                      flexDirection: "row",
                      marginRight: 1
                    }}
                    key={id.toString()}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        height: "100%",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>{item.groupName}</div>
                      <div>
                        <Tooltip
                          title='删除'
                        >
                          <Icon
                            type="delete"
                            style={{ marginRight: 6 }}
                            onClick={() => this.deleteGroup(item.id)}
                          />
                        </Tooltip>
                        <Tooltip
                          title='编辑'
                        >
                          {" "}
                          <Icon
                            type="form"
                            onClick={() => this.updateMenuItemName(item.id)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  </Menu.Item>
                );
              })}
            </Menu>
          </div>
          <div className="right" style={{ marginTop: 0 }}>
            <div className="right-bottom">
              <Row
                style={{ marginTop: "10px", border: 1, display: 'flex' }}
              >
                <div style={{ marginLeft: 70 }}>
                  <span style={{ marginLeft: -20, marginRight: 20 }}>全选</span>
                  <span>已选中</span>
                  <span style={{ color: "#4bd3e9" }}>
                    {this.state.selectedKeysCheck.length}
                  </span>/10
                  <span style={{ marginRight: 10 }}>个</span>
                  <Button
                    disabled={!this.state.selectedKeysCheck.length}
                    onClick={() => {
                      this.onOk();
                    }}
                  >
                    批量删除
                  </Button>
                </div>

                <Pagination
                  defaultCurrent={1}
                  onChange={value => this.paginationChange(value)}
                  total={Number(this.state.total)}
                />
              </Row>
            </div>

            <Row style={{ height: 52, textAlign: 'right' }}>
              <Button
                className="add-btn"
                type="primary"
                onClick={() => {
                  this.addNewReport();
                }}
              >
                添加分析
              </Button>
            </Row>
            <div className="overflow-scroll">
              <Table
                loading={this.state.loading}
                id="apply-warehouse-report-table"
                pagination={false}
                dataSource={this.state.taskList}
                className="white-table"
                style={{ textAlign: "center", background: "#fff" }}
                rowKey={record => record.id}
                rowSelection={{
                  onChange: (a, b) => {
                    this.onSelectItem(a, b);
                  },
                  selectedRowKeys: this.state.selectedKeysCheck
                }}
              >
                <Table.Column
                  width={220}
                  className='report-link'
                  title={<span style={{ color: "#999999" }}>报表链接</span>}
                  align={"left"}
                  render={this.cellEditRender("biUrl")}
                />
                <Table.Column
                  className='report-name'
                  align={"left"}
                  title={<span style={{ color: "#999999" }}>报表名称</span>}
                  render={this.cellEditRender("biName")}
                />
                <Table.Column
                  title={<span style={{ color: "#999999" }}>创建人</span>}
                  align={"left"}
                  render={this.cellEditRender("createdUser")}
                />
                <Table.Column
                  title={<span style={{ color: "#999999" }}>发布设置</span>}
                  align={"left"}
                  render={this.cellEditRender("isPublish")}
                />

                <Table.Column
                  title={<span style={{ color: "#999999" }}>操作</span>}
                  align={"right"}
                  width={100}
                  render={operateRender}
                />
              </Table>
              <Modal
                visible={this.state.updateDialog}
                onOk={this.updateGroupFetch}
                onCancel={this.onCloseInput}
                onClose={this.onCloseInput}
                title="提示"
                cancelText='取消'
                okText='确定'
                style={{ width: "300px", height: "400px" }}
              >
                <Input
                  value={this.state.inputValue}
                  onChange={this.onInputChange.bind(this)}
                  placeholder="请输入新的分组名"
                />
                <h3>确定要修改分组名称？</h3>
              </Modal>
              <Modal
                visible={this.state.createDialog}
                onOk={this.createGroupFetch}
                onCancel={this.onCloseCreate}
                onClose={this.onCloseCreate}
                cancelText='取消'
                okText='确定'
                title="提示"
                style={{ width: "300px", height: "400px" }}
              >
                <Input
                  value={this.state.inputValue}
                  onChange={this.onInputChange.bind(this)}
                  placeholder="请输入新的分组名"
                />
                <h3>确定要创建分组？</h3>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onCloseInput = () => {
    this.setState({
      updateDialog: false,
      inputValue: ""
    });
  };

  onCloseCreate = () => {
    this.setState({
      createDialog: false,
      inputValue: ""
    });
  };
  onCloseDelete = () => {
    this.setState({
      deleteGDialog: false,
      inputValue: ""
    });
  };
  updateMenuItemName = id => {
    this.groupId = id;
    this.setState({
      updateDialog: true
    });
  };
}

export default connectAll(Index);
