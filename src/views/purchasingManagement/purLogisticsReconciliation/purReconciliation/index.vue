<!--
 * @Author: Carrey 2954831281@qq.com
 * @Date: 2025-12-27 10:59:09
 * @LastEditors: Carrey 2954831281@qq.com
 * @LastEditTime: 2026-01-04 13:07:14
 * @FilePath: src/views/purchasingManagement/purLogisticsReconciliation/purReconciliation/index.vue
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 -->
<script>
import purReconciliation from '@/views/purchasingManagement/purReconciliationManagement/purReconciliation/index.vue'

export default {
  components: { purReconciliation },
  name: "index"
}
</script>

<template>
  <purReconciliation :query-object="{ reconciliationType: 'payable_logistics' }"/>
</template>
