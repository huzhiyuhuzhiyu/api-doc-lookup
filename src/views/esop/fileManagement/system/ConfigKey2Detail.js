export default {
    "fj_qgd": {
        title: "请购单", //此title为业务名称
        path: "purchasingManagement/purchasingDemand/buyingRequisition/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_sales": {
        title: "销售订单", //此title为业务名称
        path: "salesManagement/orderManagement/orderList/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_bomgl": {
        title: "BOM管理", //此title为业务名称
        path: "basicData/bomSettings/productionBom/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_gylx": {
        title: "工艺管理", //此title为业务名称
        path: "basicData/processSettings/processSettingss/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_procurejyd": {
        title: "质量管理", //此title为业务名称
        path: "inspectionManagement/components/inspectionFormManagementDetail.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中
            inspectionType: 'procure'
        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_externaljyd": {
        title: "质量管理", //此title为业务名称
        path: "inspectionManagement/components/inspectionFormManagementDetail.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中
            inspectionType: 'external'
        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_sale_backjyd": {
        title: "质量管理", //此title为业务名称
        path: "inspectionManagement/components/inspectionFormManagementDetail.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中
            inspectionType: 'sale_back'
        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_processjyd": {
        title: "质量管理", //此title为业务名称
        path: "inspectionManagement/components/inspectionFormManagementDetail.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中
            inspectionType: 'process'
        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_finishedjyd": {
        title: "质量管理", //此title为业务名称
        path: "inspectionManagement/components/inspectionFormManagementDetail.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中
            inspectionType: 'finished'
        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_producejyd": {
        title: "质量管理", //此title为业务名称
        path: "inspectionManagement/components/inspectionFormManagementDetail.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中
            inspectionType: 'produce'
        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_wxgysgl": {
        title: "外协供应商档案", //此title为业务名称
        path: "basicData/outsourcingSuppliers/outsourcingSuppliersProfile/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_wxdd": {
        title: "外协订单", //此title为业务名称
        path: "outsourcingManagement/processOutsourcingOrders/orderList/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_wxfltzd": {
        title: "外协发料通知单", //此title为业务名称
        path: "outsourcingManagement/externalMaterialIssuance/materialsIssueNotice/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_cgshd": {
        title: "采购收货单", //此title为业务名称
        path: "receivingManagement/procurementReceiving/receivingAdvice/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_cpcgshd": {
        title: "采购成品收货单", //此title为业务名称
        path: "receivingManagement/purchaseAndReceiveFinishedProducts/receivingAdvice/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_wxshd": {
        title: "外协收货单", //此title为业务名称
        path: "receivingManagement/receiveGoodsByOutsourcing/receivingAdvice/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_cggysgl": {
        title: "采购供应商档案", //此title为业务名称
        path: "basicData/supplierManagement/supplierProfile/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "'fj_dddj'": {
        title: "定点定价", //此title为业务名称
        path: "purchasingManagement/fixedPointPricing/pricingListedSeparately/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "'fj_cgdd'": {
        title: "采购订单", //此title为业务名称
        path: "purchasingManagement/purchaseOrders/purchaseOrder/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "'fj_cpcgdd'": {
        title: "成品采购订单", //此title为业务名称
        path: "purchasingManagement/finishedProductPurchaseOrders/purchaseOrder/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "'fj_cgthtzd'": {
        title: "采购退货通知单", //此title为业务名称
        path: "purchasingManagement/returnManagement/purchaseReturnNote/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "'fj_cpcgthtzd'": {
        title: "成品采购退货通知单", //此title为业务名称
        path: "purchasingManagement/finishedProductReturnManagement/purchaseReturnNote/Form.vue", //需要调用的组件路径
        params: { //需要传递的参数，会被传递到组件的props中

        },
        closeEventName: "close", //关闭事件名称 不写默认为close
    },
    "fj_sbgysda": {
      title: "设备供应商档案",
      path: "basicData/equipmentManagement/equipmentSupplierProfile/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_bjly": {
      title: "备件领用",
      path: "dailyManagement/sparepartsmanagement/sparepartsrequisition/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_bjgh": {
      title: "备件归还",
      path: "dailyManagement/sparepartsmanagement/sparepartsReturn/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_sbda": {
      title: "设备档案",
      path: "basicData/deviceProfile/deviceProfileset/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_sbwxzsk": {
      title: "设备维修知识库",
      path: "basicData/deviceProfile/maintenanceknowledgeBase/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_sbbx": {
      title: "设备报修",
      path: "dailyManagement/maintenanceManagement/deviceservice/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_bfgl": {
      title: "报废申请单",
      path: "dailyManagement/scrapManagement/announceInvalidated/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_byrwgl": {
      title: "保养任务",
      path: "dailyManagement/Maintenance/maintenanceTasks/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_byrwgl": {
      title: "点检任务",
      path: "dailyManagement/pointInspection/inspectionTask/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_gjda": {
      title: "工具档案设置",
      path: "basicData/deviceProfile/toolProfilesettings/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_gjwxzsk": {
      title: "工具维修知识库",
      path: "basicData/deviceProfile/toolknowledgeBase/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_gjly": {
      title: "工具领用",
      path: "dailyManagement/borrowingReturn/circulate/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_gjgh": {
      title: "工具归还",
      path: "dailyManagement/borrowingReturn/toolreturn/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_gjbx": {
      title: "工具报修",
      path: "toolclampmeasuring/toolManagement/pendingdispatch/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_gjbf": {
      title: "报废申请单",
      path: "toolclampmeasuring/scrapManagement/announceInvalidated/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_gjbyrwgl": {
      title: "保养任务",
      path: "toolclampmeasuring/Maintenance/maintenanceTasks/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_gjjdrwgl": {
      title: "检定任务",
      path: "toolclampmeasuring/verification/inspectionTask/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_sbly": {
      title: "设备领用",
      path: "dailyManagement/equipmentrequisitionreturn/equipmentrequisition/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    },
    "fj_sbgh": {
      title: "设备归还",
      path: "dailyManagement/equipmentrequisitionreturn/equipmentreturn/Form.vue", //需要调用的组件路径
      params: {

      },
      closeEventName: "close",
    }
}
