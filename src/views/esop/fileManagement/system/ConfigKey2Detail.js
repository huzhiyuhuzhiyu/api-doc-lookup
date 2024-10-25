export default {
    "fj_qgd":{
        title:"请购单", //此title为业务名称
        path:"purchasingManagement/purchasingDemand/buyingRequisition/Form.vue", //需要调用的组件路径
        params:{ //需要传递的参数，会被传递到组件的props中

        },
        closeEventName:"close", //关闭事件名称 不写默认为close
    },
    "fj_sales":{
        title:"销售订单", //此title为业务名称
        path:"salesManagement/orderManagement/orderList/Form.vue", //需要调用的组件路径
        params:{ //需要传递的参数，会被传递到组件的props中
       
        },
        closeEventName:"close", //关闭事件名称 不写默认为close
    }
}
