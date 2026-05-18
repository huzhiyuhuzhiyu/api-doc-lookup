<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-07 15:26:28
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-17 14:58:28
 * @FilePath: \os-web-zgt4.0\src\views\masterDataManagement\productManagement\raw_material\index.vue
 * @Description: 半成品页面
-->
<template>
  <ProductIndex :initListQuery="initListQuery" productName="半成品" :busSetId="'CPBM'" clearClassAttributeOnEdit />
 </template>

 <script>
 import ProductIndex from '../components/productIndex.vue'
 export default {
   components: { ProductIndex},
   name:'semi_finished',
   data() {
     return {
       initListQuery:{
         code: "",
         name: "",
         orderItems: [{
           asc: false,
           column: ""
         }, {
           asc: false,
           column: "create_time"
         }],
         pageNum: 1,
         pageSize: 20,
         drawingNo: "", // 图号
         productSource: "", // 产品来源
         startAndEndTime: [], // 创建时间
         productCategoryId: "", // 类型id
         productStatus: "", // 产品状态
         customerQueryFields: [],
         createTimeArr:[],
         classAttribute: "semi_finished"
       },
     }
   },
 }
 </script>
