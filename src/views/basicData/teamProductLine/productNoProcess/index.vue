<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-05-14 15:21:22
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-05-15 09:59:04
 * @Description: 产品无工序查询  引入 采购无价格页面  更改查询参数
-->
<template>
  <QueryIndex searchType="routing"  />
</template>
  
<script>
import QueryIndex from '@/views/purchasingManagement/purchaseNoprice/index.vue'
export default {
  name: 'productNoprocess',
  components: { QueryIndex },
}
</script>

  