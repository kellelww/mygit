'use strict';

/**
 * API MAP 对象
 * 页面上所有ajax请求统一在这里管理.
 * 详细用法请查看: http://web.npm.alibaba-inc.com/package/@alife/apimap
 */
export default {
  // 基础的api设置,其他环境会覆盖base的内容.
  base: {},
  // 本地开发环境,一般可以mock数据
  development: {},
  // daily环境,可重写base定义的接口
  local: {
    // 6.30关键因素识别接口
    // myDataList: '/proxy/api/dataSet/list?size=7', // 带host的地址，不会添加_host
    // moduleType: '/proxy/api/tasks/listType',
    // moduleUsedList: '/proxy/api/dataSet/listByType?valid=1',
    // listByVariety: '/proxy/api/facility/listTypes',
    // listByType: '/proxy/api/facility/listByType',
    // qualityList: '/proxy/api/modelQuality/listSlicerTargets',
    // formulaList: '/proxy/api/mixer/formula',
    // rubberList: '/proxy/api/mixer/rubber',
    // uploadFile: '/proxy/api/dataSet/upload',
    // getCalculateResult:'/proxy/api/tasks/sampleStatistics',
    // timeRange: '/proxy/api/dataTime/timeRange',
    //
    // monneyRange: '/proxy/api/mixer/monney',

    // 数据上传
    dataTable: '/proxy/api/dataSet/listAll',
    getCredentials: '/proxy/api/dataSet/getCredentials',
    upLoad: '/proxy/api/dataSet/upload',
    errorDetail: '/proxy/api/dataSet/error',
    delectDataSet: '/proxy/api/dataSet/delete',
    detailDataSet: '/proxy/api/dataSet/detail',
    downloadTemplate: '/proxy/api/template/download',

    // 登录注册
    login: '/loginApi/api/user/login',
    register: '/loginApi/api/user/register',
    loginOut: '/loginApi/api/user/logout',

    // BI报表
    biList: '/proxy/api/bi/list',
    biAdminList: '/proxy/api/bi/adminList',
    biNewList: '/proxy/api/bi/newList',
    biCreate: '/proxy/api/bi/create',
    biUpdate: '/proxy/api/bi/update',
    biDelete: '/proxy/api/bi/delete',
    biPublish: '/proxy/api/bi/publish',
    biUnPublish: '/proxy/api/bi/unPublish',
    listGroup: '/proxy/api/bi/listGroup',
    listAdminGroup: '/proxy/api/bi/listAdminGroup',
    createGroup: '/proxy/api/bi/createGroup',
    updateGroup: '/proxy/api/bi/updateGroup',
    deleteGroup: '/proxy/api/bi/deleteGroup',
    queryAllRole: '/proxy/api/role/queryAll/overview',
    workShopListByUser: '/proxy/api/dataAuth/workShopListByUser',


    // 指挥舱前台
    screenList: '/proxy/api/screen/pub/list',
    templateAdress: '/proxy/api/screen/address',

    // 指挥舱设置
    addScreen: '/proxy/api/screen/add',
    deleteScreen: '/proxy/api/screen/delete',
    publishScreen: '/proxy/api/screen/publish',
    allScreenList: '/proxy/api/screen/list',
    isExpire: '/isExpire',

    // 数据舱
    baseTable: '/proxy/api/datawarehouse/table',
    businessdata: '/proxy/api/datawarehouse/businessdata',
    modelData: '/proxy/api/datawarehouse/modeldata',
    overview: '/proxy/api/datawarehouse/overview',
    monitorByType: '/proxy/api/datawarehouse/monitor',
    monitorDetailByType: '/proxy/api/datawarehouse/monitor/detail',
    baseDataDetail: '/proxy/api/datawarehouse/table/detail',

    // 关键因素识别使用页面
    applyList: '/proxy/api/service/keyfactor/apply/listservice',
    listfactorgroups: '/proxy/api/service/keyfactor/apply/listfactorgroups',
    filterlayout: '/proxy/api/service/keyfactor/apply/filterlayout',
    detailfactors: '/proxy/api/service/keyfactor/apply/detailfactors',
    targetRange: '/proxy/api/service/keyfactor/apply/targetRange',
    samplecalculate: '/proxy/api/service/keyfactor/apply/samplecalculate',
    filterRange: '/proxy/api/service/keyfactor/apply/filterRange',
    runTask: '/proxy/api/service/keyfactor/apply/run',

    // 任务列表
    taskList: '/proxy/api/service/apply/instance/list',
    getTaskLog: '/proxy/api/service/apply/instance/log',
    deleteTask: '/proxy/api/service/apply/instance/delete',
    taskDetail: '/proxy/api/service/apply/instance/detail',

    // 异常报警
    eqpDetail: '/proxy/api/service/foreWarning/eqpDetail',

    // 关键因素识别配置页面
    generate: '/proxy/api/service/keyfactor/generate/list',
    deleteService: '/proxy/api/service/keyfactor/generate/delete',
    createService: '/proxy/api/service/keyfactor/generate/create',
    // getBusinessData: '/proxy/api/datawarehouse/businessdata',
    getDataSource: '/proxy/api/service/keyfactor/generate/listdataset',
    detailSource: '/proxy/api/datawarehouse/dataset/detail',
    getFilters: '/proxy/api/service/keyfactor/generate/getfilters',
    getTargets: '/proxy/api/service/keyfactor/generate/gettargets',
    selectedFilters: '/proxy/api/service/keyfactor/generate/selectedfilters',
    algorithm: '/proxy/api/service/keyfactor/generate/listalgorithm',
    addAlgOrithm: '/proxy/api/service/keyfactor/generate/addalgorithm',
    addDataSource: '/proxy/api/service/keyfactor/generate/addtable',
    addFilters: '/proxy/api/service/keyfactor/generate/addfilters',
    addTarget: '/proxy/api/service/keyfactor/generate/addtarget',
    generateLayout: '/proxy/api/service/keyfactor/generate/layout',

    // 废弃关键因素识别因素分组
    // addfactorgroup: '/proxy/api/service/generate/addfactorgroup',
    // deleteFactorGroup: '/proxy/api/service/generate/deletefactorgroup',

    // 设备预警分析
    getCharsDetails: '/proxy/api/service/foreWarning/statistics',
    getTableData: '/proxy/api/service/foreWarning/listAll',
    watchDetail: '/proxy/api/service/foreWarning/warningData',
    detailwarning: '/proxy/api/service/foreWarning/detailWarning',

    // 工艺参数推荐

    listByType: '/proxy/api/service/tecparameter/apply/listdataset',
    taskManage: '/proxy/api/service/apply/instance/detail',
    listCommonTargets: '/proxy/api/service/tecparameter/apply/listCommonTargets',
    targetFeatures: '/proxy/api/service/tecparameter/apply/targetFeatures',
    fearuresList: '/proxy/api/service/tecparameter/apply/listfactors',
    sampleStatistics: '/proxy/api/service/tecparameter/apply/samplecalculate',
    publishTask: '/proxy/api/service/tecparameter/apply/create',

    // 多维参数分析
    listdataset: '/proxy/api/service/multiparameter/listdataset',
    gettargets: '/proxy/api/service/multiparameter/listtarget',
    getfilter: '/proxy/api/service/multiparameter/getfilters',
    getParameter: '/proxy/api/service/multiparameter/getparameters',
    getAnalysis: '/proxy/api/service/multiparameter/analysis',
    getListtarget: '/proxy/api/service/multiparameter/listtarget',

    // 算法上架
    algList: '/algorithmShelves/api/alg/shelves/template/list',
    algCreate: '/algorithmShelves/api/alg/shelves/template/create',
    algDelect: '/algorithmShelves/api/alg/shelves/template/delete',
    getTypeList: '/algorithmShelves/api/alg/shelves/category/list',

    // 申请上架
    resourceList: '/algorithmShelves/api/alg/shelves/resource/list',

    // 算法审核
    algAudit: '/audit/api/alg/approval/template/list',
    approvalPass: '/audit/api/alg/approval/template/approvalPass',
    approvalReject: '/audit/api/alg/approval/template/approvalReject',
    // 审核节点
    auditNode: '/audit/api/alg/approval/template/get',
    auditGet: '/audit/api/alg/approval/template/node/get',

    // 申请销售上架
    applySales: '/algorithmShelves/api/alg/shelves/template/applySales',

    // 固化参数页面
    updateList: '/algorithmShelves/api/alg/shelves/template/update',

    // 算法市场
    listCategory: '/buyAlg/appmarket/categories',
    templateList: '/buyAlg/api/alg/sales/template/list',
    applyFetch: '/buyAlg/appmarket/algorithm/trial',

    getApplyMarketType: '/buyAlg/appmarket/myalgorithms',

    // 文件上传
    getUpload: '/algorithmShelves/api/alg/shelves/resource/getUploadResourceSignature',
    createUpload: '/algorithmShelves/api/alg/shelves/resource/create',
    // 算法购买审核界面

    buyAlg: '/audit/api/alg/approval/flow/list',
    flowApprovalPass: '/audit/api/alg/approval/flow/approvalPass',
    flowApprovalReject: '/audit/api/alg/approval/flow/approvalReject',

    // 算法上架审核

    // 获取参数
    getParams: '/algorithmShelves/api/alg/shelves/template/get',
    getParamsType: '/algorithmShelves/api/alg/shelves/template/listParameterType',
    updateParamsList: '/algorithmShelves/api/alg/shelves/template/updateParameterMap',

    // 增加节点

    createNode: '/algorithmShelves/api/alg/shelves/template/node/create',
    updateNode: '/algorithmShelves/api/alg/shelves/template/node/update',
    getAllNodeList: '/algorithmShelves/api/alg/shelves/template/get',
    getNode: '/algorithmShelves/api/alg/shelves/template/node/get',

    // 删除节点
    deleteNode: '/algorithmShelves/api/alg/shelves/template/node/delete',

    // 算法模版
    algorithmParame: '/proxy/api/service/algorithm/detail',
    liseDataSet: '/proxy/api/service/common/apply/listdataset',
    listcolumn: '/proxy/api/service/common/apply/listcolumn',
    invoke: '/proxy/api/service/algorithm/invoke',

    // 设备状况概览
    equipments: '/proxy/api/equipment_screen/equipments_by_productline',

    // 设备效率分析
    getNavItem: '/proxy/api/eqpEff/getEqpType',
    getAll: '/proxy/api/eqpEff/getAll',
    getSingle: '/proxy/api/eqpEff/getSingle',
    getListNode: '/proxy/api/productivity/listnode',
    // 设备报警查询接口

    queryAll: '/proxy/api/eqpWarnning/queryAll',
    saveEdit: '/proxy/api/eqpWarnning/edit',
    SubmissionData:'/proxy/api/service/getParms',
    // 产能效率分析
    current: '/proxy/api/productivity/runningCount/current',
    lately: '/proxy/api/productivity/runningCount/lately',
    getHistory: '/proxy/api/productivity/getHistory',
    editUpperLimit: '/proxy/api/productivity/editUpperLimit',

    // 动态参数曲线
    equipment_params: '/proxy/api/equipment_param_curve/equipment_params',
    listNodeNo: '/proxy/api/equipment_param_curve/listNodeNo',
    listEqpId: '/proxy/api/equipment_param_curve/listEqpId',
    listEqpParams: '/proxy/api/equipment_param_curve/listEqpParams',
    list_statistic_equipment_param: '/proxy/api/equipment_param_curve/list_statistic_equipment_param',

    // 算法中心重构
    // 审核系统
    algAuditOperation: '/audit/appoperation/requests/algorithms',
    algAuditPassOrRejected: '/audit/appoperation/requests/status',
    algorithmDetail: '/audit/appoperation/algorithm/detail',

    // 算法中心
    getListAlg: '/algorithmShelves/app/category/list',
    getRequestAlgList: '/algorithmShelves/app/algorithm/request/list',
    createAlg: '/algorithmShelves/app/algorithm/create',
    createAlgNode: '/algorithmShelves/app/algorithm/node/create',
    updateAlgNode: '/algorithmShelves/app/algorithm/node/update',
    updateAlgInfo: '/algorithmShelves/app/algorithm/update',
    delectAlg: '/algorithmShelves/app/algorithm/delete',
    deleteNodeAlg: '/algorithmShelves/app/algorithm/node/delete',
    deleteFile: '/algorithmShelves/app/algorithm/file/delete',
    // 申请上架
    apprequest: '/algorithmShelves/app/algorithm/apprequest/sale',
    // 获取参数类型
    getDataTypes: '/algorithmShelves/app/algorithm/param/dataTypes',
    // 获取参数列表
    getParamsList: '/algorithmShelves/app/algorithm/param',
    postParamsList: '/algorithmShelves/app/algorithm/request/sale',
    // 获取签名认证
    getSignature: '/algorithmShelves/app/algorithm/file/signature',
    createFile: '/algorithmShelves/app/algorithm/file/create',

    // 算法节点信息
    allAlgorithmInfo: '/algorithmShelves/app/algorithm',



    // 应用使用管理
    appManageList: '/data/appManageList.json',
    // 人员管理
    getPersonManagement: '/data/person.json',
    // 获取用户权限分类
    getPersonType: '/data/getCategory.json',
    getRolelist: '/data/getrolelist.json',
    getTabMenu: '/data/menu.json',


    //===============

    //新工艺参数推荐
    getdataSourceRecommended: '/proxy/api/service/tecparameter/apply/listdataset',
    getParamsListRec: "/proxy/api/service/tecparameter/apply/params",
    getFilterRec: "/proxy/api/service/tecparameter/apply/filters",
    getTargetRec: "/proxy/api/service/tecparameter/apply/targets",
    getTargetRange: "/proxy/api/service/tecparameter/apply/targetRange",
    getSamplecalculate: "/proxy/api/service/tecparameter/apply/sampleCalculate",
    createRec: "/proxy/api/service/tecparameter/apply/createTask",

    //////////////////////////////////////////////////////////////////////////////
    //用户中心
    listTopTab: '/proxy/api/treeMenu/getTabByAuthority',
    // 指挥舱动态菜单
    listMenu: '/proxy/api/treeMenu/getAuthorityByParentMenu',

    // 人员管理
    getPersonManagement: '/userApi/api/user/queryRoleGroup',
    // 创建人员
    createPerson: '/userApi/api/user/createUser',
    //删除人员
    deletePerson: '/proxy/api/user/batchDelete',

    // 账号
    accountCheck: '/userApi/api/user/checkUnique',

    // 删除用户
    deleteUserId: '/userApi/api/user/delete',
    updateData: '/userApi/api/user/update',
    // 获取用户权限分类
    getPersonType: '/data/getCategory.json',
    listAppTableColumn: '/proxy/api/appManager/listAppTableColumn',
    getRolelist: '/userApi/api/role/queryAll/detail',
    getTabMenu: '/userApi/api/treeMenu/getAll',

    // 添加或修改角色信息
    addOneRole: '/userApi/api/role/addOne',

    roleRoleDelete: '/userApi/api/role/delete',

    //获取全量车间信息

    getWorkShopData: "/proxy/api/dataAuth/workShopList",
    //获取用户工作区列表
    getworkShopAuth: '/proxy/api/dataAuth/workShopAuth',

    //角色设置列表接口
    getRoleSet: '/proxy/api/treeMenu/menuOnChecked',

    //角色唯一性检验

    rolecheckUnique: '/proxy/api/role/checkUnique'
  },
  // daily环境
  pre: {
    // 这里填入预发的host
    // _HOST : '//lbs.daily.taobao.net'
  },
  // 线上环境
  production: {
    // 这里填入线上的host
    _HOST: '//lbs.taobao.com',
  },
};
