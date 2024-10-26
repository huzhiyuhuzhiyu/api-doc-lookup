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
        title: "供应商档案", //此title为业务名称
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
}
