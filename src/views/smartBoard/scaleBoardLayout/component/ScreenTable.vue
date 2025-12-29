<!--
 * @Author: Carrey 2954831281@qq.com
 * @Date: 2025-12-29 10:09:59
 * @LastEditors: Carrey 2954831281@qq.com
 * @LastEditTime: 2025-12-29 10:10:51
 * @FilePath: src/views/smartBoard/scaleBoardLayout/component/ScreenTable.vue
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 -->
<script>
export default {
  name: "ScreenTable",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<template>
  <table class="screen-table">
    <thead>
    <tr>
      <th v-for="column in columns" :key="column.prop" :style="{ width: column.width }">{{ column.label }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in data">
      <td v-for="column in columns" :key="column.prop" :style="{ width: column.width }">{{ row[column.prop] }}</td>
    </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
@use "~@/views/smartBoard/style/util";

.screen-table {
  color: #fff;
  box-sizing: border-box;
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  th, td {
    padding: 8px;
    text-align: center;
  }
}
</style>
