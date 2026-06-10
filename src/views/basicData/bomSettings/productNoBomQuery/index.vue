<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-05-14 15:21:22
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-05-14 15:23:33
 * @FilePath: \os-web\src\views\basicData\bomSettings\productNoBomQuery\index.vue
 * @Description: 产品无bom查询  引入 采购无价格页面  更改查询参数
-->
<template>
  <QueryIndex searchType="bom"  />
</template>
  
<script>
import QueryIndex from '@/views/purchasingManagement/purchaseNoprice/index.vue'
export default {
  name: 'productNobom',
  components: { QueryIndex },
}
</script>

  