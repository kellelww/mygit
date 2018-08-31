// 'use strict';

// import React from 'react';
// import ReactDOM from 'react-dom';
// import {withRouter} from 'react-router'
// import {ajax} from 'utils/index';
// import 'utils/apimap';
// import Head from 'components/head-detail/index';
// import { connectAll } from 'common/redux-helpers';

// import {
//   Button,
//   Icon,
//   Table,
//   Grid,
//   Feedback,
//   Select,
//   Input,
//   Balloon,
//   Form,
//   Tag,
//   Dialog
// } from "@alife/next";
// import './index.scss';

// const {Row, Col} = Grid;
// const FormItem = Form.Item;
// const Toast = Feedback.toast;

// class addBusinessTable extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isShowMask: false,
//       showSettingDec: false,
//       listParam: [],
//       showAddTable: false,
//       listAppTableColumn: [],
//       visible: false,
//       leaveConfirm: false,
//       listColumnTags: [],
//       selectedTag: {},
//       activeTagList: []
//     };
//   }
//   componentDidMount() {
//     this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
//     if (this.props.params.data) {
//       const appId = this.props.params.data.split('&')[0];
//       const appType = this.props.params.data.split('&')[1];
//       const tableName = this.props.params.data.split('&')[2] || '';
//       const scene = this.props.params.data.split('&')[3];
//       this.fetchListParam(appId, tableName, appType);
//       this.setState({
//         tableName,
//         scene
//       })
//       ajax({
//         api: 'listMyApp',
//         data: {}
//       }, res => {
//         this.setState({
//           title: this.titleRender(res.data, appId),
//           listMyApp: res.data,
//           appId,
//           appType,
//           hash: location.hash
//         });
//       }, () => {});

//       ajax(
//         {
//           api: 'algorithmParame',
//           data: { id: appId },
//         },
//         (res) => {
//           if(res.data) {
            
//             let inputType = res.data.typeInfoParam ? res.data.typeInfoParam.inputType : null;
//             ajax({
//               api: 'listTableName',
//               data: {
//                 appId,
//                 type: inputType
//               }
//             }, res => {
//               this.setState({listTable: res.data});
//             }, () => {});
//             ajax({
//               api: 'listTags',
//               data: {
//                 dataType: inputType
//               }
//             }, res => {
//               this.setState({tagList: res.data})
//             }, () => {})
//           }
//         });

//     }
//   }
//   titleRender(data, id) {
//     let title = '';
//     data.forEach((item, index) => {
//       if (item.externalId === id) {
//         title = item.name
//       }
//     })
//     return title
//   }
//   routerWillLeave = (nextLocation) => {
//     if (!this.state.scene || !this.state.tableName || !this.state.appId) {
//       if (!this.isLeave) {
//         this.setState({leaveConfirm: true, nextLocation: nextLocation.pathname});
//         return false
//       }
//     } else {
//       this.subTable()
//     }
//   }
//   subTable() {
//     const {appId, tableName, scene} = this.state;
//     ajax({
//       api: 'subTable',
//       data: {
//         appId,
//         tableName,
//         scene
//       }
//     }, res => {
//       return true
//     }, () => {})
//   }
//   onApplyChange(value) {
//     this.state.listMyApp.forEach((item, index) => {
//       if (item.externalId === value) {
//         this.setState({appId: value, appType: item.appType})
//       }
//     })
//   }
//   tableChange(tableName) {
//     this.setState({tableName});
//     this.fetchListParam(this.state.appId, tableName, this.state.appType)
//     this.getAppScene(this.state.appId,tableName )
//   }
//   getAppScene(appId, tableName){
//     ajax({
//       api: 'getAppScene',
//       data: {appId, tableName}
//     }, res => {
//       this.setState({
//         scene: res.data
//       })
//     }, () => {

//     })
//   }
//   fetchListParam(appId, tableName, appType) {
//     ajax({
//       api: 'listParam',
//       data: {
//         appId,
//         tableName,
//         appType
//       }
//     }, res => {
//       this.setState({
//         listParam: this.addIndexInListParam(res.data)
//       })
//     }, () => {})
//   }
//   fetchListAppTableColumn(paramName) {
//     ajax({
//       api: 'listAppTableColumn',
//       data: {
//         tableName: this.state.tableName,
//         appId: this.state.appId,
//         paramName
//       }
//     }, res => {
//       this.setState({
//         listAppTableColumn: this.addIdInlistAppTableColumn(res.data.list),
//         markList: JSON.stringify(res.data.list),
//         totalCount: res.data.totalCount,
//         selectedTag: this.returnSelectedParame(res.data.list)
//       })
//     }, () => {})
//   }
//   addIdInlistAppTableColumn(data) {
//     let jsonData = [];
//     if (data.length > 0) {
//       data.forEach((item, index) => {
//         jsonData.push(Object.assign({}, item, {id: index}))
//       })
//     }
//     return jsonData
//   }
//   returnSelectedParame(data){
//     let selectedParame = {};
//     if (data.length > 0) {
//       data.forEach((item, index) => {
//         if(item.tags.length > 0){
//           selectedParame[item.columnName] = item.tags
//         }
//       })
//     }
//     return selectedParame
//   }
//   addIndexInListParam(data) {
//     let dataIndex = [];
//     let count;
//     let num = 1;
//     data.forEach((item, index) => {
//       if (count !== item.paramName) {
//         dataIndex.push(Object.assign({}, item, {index: num}));
//         count = item.paramName;
//         num += 1;
//       } else {
//         dataIndex.push(Object.assign({}, item, {index: num}));
//       }
//     });
//     return dataIndex
//   }
//   onAdd = (record) => {
//     if(this.state.tableName){
//       this.fetchListAppTableColumn(record.paramName);
//       this.setState({isShowMask: true, showAddTable: true, paramName: record.paramName})
//     }
//   }
//   showSettingDec() {
//     this.setState({isShowMask: true, showSettingDec: true})
//   }
//   onCloseSettingDec() {
//     this.setState({isShowMask: false, showSettingDec: false})
//   }
//   getCellProps = (rowIndex, colIndex) => {
//     const count = this.state.listParam[rowIndex].columnCount;
//     if (rowIndex === rowIndex && colIndex < 4) {
//       if (count > 1) {
//         return {colSpan: 1, rowSpan: count}
//       } else {
//         return {colSpan: 1, rowSpan: 1}
//       }
//     }
//   }
//   onSelect(checked, record) {
//     let newListAppTableColumn = this.state.listAppTableColumn;
//     newListAppTableColumn.splice(record.id, 1, Object.assign({}, newListAppTableColumn[record.id], {active: checked}));
//     this.setState({listAppTableColumn: newListAppTableColumn})
//   }
//   onSelectAllItem(checked) {
//     let newListAppTableColumn = [];
//     this.state.listAppTableColumn.forEach((item, index) => {
//       newListAppTableColumn.push(Object.assign({}, item, {active: checked}))
//     });
//     this.setState({listAppTableColumn: newListAppTableColumn})
//   }
//   addTag(record, index) {
//     this.setState({visible: true, index});
//     let activeTagList = [];
//     if (this.state.listAppTableColumn[index].tags.length === 0) {
//       this.state.tagList.forEach((item, index) => {
//         activeTagList.push(Object.assign({}, item, {active: false}))
//       })
//     } else {
//       this.state.tagList.forEach((tag, num) => {
//         if (this.state.listAppTableColumn[index].tags.indexOf(tag.desc) === -1) {
//           activeTagList.push(Object.assign({}, tag, {active: false}))
//         } else {
//           activeTagList.push(Object.assign({}, tag, {active: true}))
//         }
//       })
//     }
//     this.setState({activeTagList})
//   }
//   tagSelectChange(bol, index) {
//     let {activeTagList} = this.state;
//     activeTagList.splice(index, 1, Object.assign({}, activeTagList[index], {active: bol}));
//     this.setState({activeTagList})
//   }
//   onAffirmMark = () => {
//     let activeTagList = [];
//     let selectedTag = [];
//     this.state.activeTagList.forEach((item, index) => {
//       if (item.active) {
//         activeTagList.push(item.desc);
//         selectedTag.push(item.name)
//       }
//     })
//     let listAppTableColumn = this.state.listAppTableColumn;
//     listAppTableColumn.splice(this.state.index, 1, Object.assign({}, listAppTableColumn[this.state.index], {tags: activeTagList}));
//     this.setState({visible: false, listAppTableColumn, selectedTag: Object.assign({}, this.state.selectedTag, {
//         [listAppTableColumn[this.state.index].columnName]: selectedTag
//       })})
//   }
//   onCloseMark = () => {
//     this.setState({visible: false})
//   }
//   returnNameByDesc(desc){
//     let name = '';
//     this.state.tagList.forEach((item, index) => {
//       if(item.desc === desc){
//         name = item.name
//       }
//     });
//     if(name){
//       return name
//     } else {
//       return desc
//     }
//   }
//   dealMarkParame() {
//     let parame = [];
//     for (const key in this.state.selectedTag) {
//       if (this.state.selectedTag[key].length > 0) {
//         let arr = [];
//         this.state.selectedTag[key].forEach((item, index) => {
//           arr.push(this.returnNameByDesc(item))
//         });
//         parame.push({columnName: key, tags: arr})
//       }
//     }
//     return parame;
//   }
//   dealTableParame() {
//     let parame = [];
//     this.state.listAppTableColumn.forEach((item, index) => {
//       if (item.active) {
//         parame.push(item.columnName)
//       }
//     })
//     return parame;
//   }
//   onSaveAdd() {
//     this.setState({isShowMask: false, showAddTable: false})
//     this.onPostNewMark();
//     this.onPostNewTable();
//   }
//   onPostNewMark() {
//     const parame = this.dealMarkParame();
//       this.fetchSubColumnSign(parame)
//   }
//   onPostNewTable() {
//     const parame = this.dealTableParame();
//     if (JSON.stringify(this.state.listAppTableColumn) !== this.state.listParam) {
//       this.fetchSubParamRelation(parame)
//     }
//   }
//   fetchSubColumnSign(parame) {
//     const subParame = {
//       appId: this.state.appId,
//       tableName: this.state.tableName,
//       columns: parame
//     };
//     ajax({
//       api: 'subColumnSign',
//       data: JSON.stringify(subParame),
//       dataType: 'json',
//       method: 'post',
//       contentType: 'application/json'
//     }, res => {
//       this.fetchListParam(this.state.appId, this.state.tableName, this.state.appType)
//     }, () => {})
//   }
//   fetchSubParamRelation(parame) {
//     const subParame = {
//       appId: this.state.appId,
//       tableName: this.state.tableName,
//       "paramName": this.state.paramName,
//       columnsList: parame
//     };
//     ajax({
//       api: 'subParamRelation',
//       data: JSON.stringify(subParame),
//       dataType: 'json',
//       method: 'post',
//       contentType: 'application/json'
//     }, res => {
//       this.fetchListParam(this.state.appId, this.state.tableName, this.state.appType)
//     }, () => {})
//   }
//   onCloseAddTable() {
//     this.setState({isShowMask: false, showAddTable: false})
//   }
//   applyScene(value) {
//     this.setState({scene: value})
//   }
//   abandonEdit() {
//     this.isLeave = true;
//     location.hash = this.state.nextLocation
//   }
//   continueEdit() {
//     this.setState({leaveConfirm: false});
//   }
//   render() {
//     const listMyApp = this.state.listMyApp
//       ? this.state.listMyApp.map((item, index) => {
//         return <Option key={index} value={item.externalId}>{item.name}</Option>
//       })
//       : null;
//     const listTable = this.state.listTable
//       ? this.state.listTable.map((item, index) => {
//         return <Option key={index} value={item}>{item}</Option>
//       })
//       : null;
//     const actionRender = (value, index, record) => {
//       return (
//         <div>
//           <a style={{
//             cursor: 'pointer'
//           }} onClick={this.onAdd.bind(this, record)}
//             className={this.state.tableName ? '' : 'disabled'}>
//             <Icon type="add"/>
//             添加字段
//           </a>
//         </div>
//       )
//     };
//     const tagRender = (value, index, record) => {
//       return (
//         <div>
//           {record.tags && record.tags.length > 0
//             ? record.tags.map((item, index) => {
//               return <span className="tag-box" key={item} style={{display:'inline-block',padding: '0 3px'}}>{item}</span>
//             })
//             : null
// }
//         </div>
//       )
//     };
//     const tagReadOnlyRender = (value, index, record) => {
//       return (
//         <div>
//           {record.tags && record.tags.length > 0
//             ? record.tags.map((item, index) => {
//               return <span className="readonly" key={index}>{item}</span>
//             })
//             : null
// }
//           <span className="readonly"><Icon type="add" onClick={() => {
//           this.addTag(record, index)
//         }}/></span>
//         </div>
//       )
//     };
//     const listColumnTags = this.state.activeTagList.length > 0
//       ? this.state.activeTagList.map((item, index) => {
//         return <Tag shape="selectable" type="primary" selected={item.active} key={item.name} onSelect={(bol) => this.tagSelectChange(bol, index)}>{item.desc}</Tag>
//       })
//       : null;
//     const footer = <div>
//       <Button onClick={() => {
//         this.abandonEdit()
//       }} href="javascript:;">放弃编辑</Button>
//       <Button type="primary" onClick={() => {
//         this.continueEdit()
//       }}>继续编辑</Button>
//     </div>
//     return (
//       <div className="addTable-page">
//         <Head title={`${this.state.title}-增加业务表`}/>
//         <div className="container">
//           <div className="content-add">
//             <Row justify="space-between">
//               <Col span="22">
//                 <Form direction="hoz" style={{
//                   paddingTop: '10px'
//                 }}>
//                   <FormItem label="应用">
//                     <Select style={{
//                       minWidth: '150px'
//                     }} onChange={(a, b) => {
//                       this.onApplyChange(a)
//                     }} value={this.state.appId} disabled>
//                       {listMyApp}
//                     </Select>
//                   </FormItem>
//                   <FormItem label="映射表">
//                     <Select style={{
//                       minWidth: '350px'
//                     }} onChange={(a, b) => {
//                       this.tableChange(a)
//                     }} value={this.state.tableName}>
//                       {listTable}
//                     </Select>
//                   </FormItem>
//                   <FormItem label="使用场景">
//                     <Input onChange={(value) => {
//                       this.applyScene(value)
//                     }} value={this.state.scene} />
//                   </FormItem>

//                   <Balloon style={{
//                     width: 'auto',
//                     minWidth: '350px',
//                     color: '#999999'
//                   }} trigger={< a className="help-text" > <Icon type="help" /> </a>} closable={false} align="r">
//                       必填，作为用户使用应用时选择业务表的判断依据
//                     </Balloon>

//                 </Form>
//               </Col>
//                 <Col >
//                   <p className="show-setting-desc" onClick={() => {
//                     this.showSettingDec()
//                   }}>查看配置说明</p>
//                 </Col>
//             </Row>
            
//             <Table dataSource={this.state.listParam} getCellProps={this.getCellProps.bind(this)} hasBorder={false}>
//               <Table.Column title="" dataIndex="index"/>
//               <Table.Column title="应用参数名称" dataIndex="paramName"/>
//               <Table.Column title="数据类型" dataIndex="paramType"/>
//               <Table.Column title="描述" dataIndex="paramDesc" style={{borderRight: '1px solid #F6F3F3'}}/>
//               <Table.Column title="映射字段" dataIndex="columnName"/>
//               <Table.Column title="字段标签" cell={tagRender} style={{borderRight: '1px solid #F6F3F3'}}/>
//               <Table.Column title="操作" cell={actionRender}/>
//             </Table>
//           </div>
//         </div>



//         <div className={this.state.isShowMask
//           ? 'maskLayer maskLayer-active'
//           : 'maskLayer maskLayer-hide'}></div>
//         <div className={this.state.isShowMask
//           ? 'mask-details is-mask-active'
//           : 'mask-details close-active'}>
//           {this.state.showSettingDec && <div className="mask-content">
//             <div className="set-dec-title">
//               <h3>配置说明</h3>
//               <p>
//                 <Button style={{
//                   margin: '6px 15px 0 0'
//                 }} onClick={() => {
//                   this.onCloseSettingDec()
//                 }}>关闭</Button>
//               </p>
//             </div>
//             <div className="set-dec-info">
//               当前应用需要怎么配置的说明 通过说明来指导用户给应用链接业务表 当前应用需要怎么配置的说明 通过说明来指导用户给应用链接业务表 当前应用需要怎么配置的说明 通过说明来指导用户给应用链接业务表 当前应用需要怎么配置的说明 通过说明来指导用户给应用链接业务表 当前应用需要怎么配置的说明 通过说明来指导用户给应用链接业务表 当前应用需要怎么配置的说明 通过说明来指导用户给应用链接业务表
//             </div>
//           </div>
// }
//           {this.state.showAddTable && <div className="mask-content">
//             <div className="set-dec-title">
//               <h3>查看详情</h3>
//               <p>
//                 <Button style={{
//                   margin: '6px 15px 0 0'
//                 }} onClick={() => {
//                   this.onCloseAddTable()
//                 }}>关闭</Button>
//                 <Button type="primary" style={{
//                   margin: '6px 15px 0 0'
//                 }} onClick={() => {
//                   this.onSaveAdd()
//                 }}>确定</Button>
//               </p>
//             </div>
//             <div className="detail-content">
//               <div className="table-content">
//                 <Table dataSource={this.state.listAppTableColumn} style={{
//                   margin: '10px',
//                   textAlign: 'center'
//                 }} rowSelection={{
//                   onSelect: (checked, record) => {
//                     this.onSelect(checked, record)
//                   },
//                   getProps: (record) => {
//                     return {checked: record.active}
//                   },
//                   onSelectAll: (checked, record) => {
//                     this.onSelectAllItem(checked, record)
//                   }
//                 }}>
//                   <Table.Column title="字段" dataIndex="columnDesc"/>
//                   <Table.Column title="类型" dataIndex="columnType"/>
//                   <Table.Column title="数据打标" cell={tagReadOnlyRender}/>
//                 </Table>
//               </div>
//             </div>
//             <div className="pagination">
//               <Row style={{marginTop: '15px'}}>
//                 <Col style={{paddingLeft: '25px'}}><p>已选{this.dealTableParame().length}个字段</p></Col>
//                 <Col><p>已打标字段 <span style={{color: '#40c1de'}}>{this.dealMarkParame().length}</span>个／共{this.state.totalCount}个字段</p></Col>

//               </Row>
//             </div>
//           </div>
// }
//         </div>
//         <Dialog visible={this.state.leaveConfirm} onClose={() => {this.continueEdit()}} title="提示" footer={footer} style={{width: '600px'}}>
//           <div className="leaveConfirm">
//             <Icon type="gantanhao" size="xl" style={{ margin: '30px 0 0 150px', color: '#00C1DE'}} />
//             <div style={{ margin: '-45px 0 0 200px'}}>
//               <p>是继续编辑，还是放弃</p>
//               <p>放弃编辑则关联业务表不成功</p>
//             </div>
//           </div>
//         </Dialog>
//         <Dialog visible={this.state.visible} onOk={this.onAffirmMark.bind(this)} closable="esc,mask,close" onCancel={this.onCloseMark} onClose={this.onCloseMark} title="数据打标">
//           <div>
//             {listColumnTags}
//           </div>
//         </Dialog>
//         </div>
//     );
//   }
// }

// export default withRouter(connectAll(addBusinessTable));