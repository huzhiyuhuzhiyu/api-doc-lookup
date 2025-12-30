<!--
 * @Author: Carrey 2954831281@qq.com
 * @Date: 2025-12-29 10:09:59
 * @LastEditors: Carrey 2954831281@qq.com
 * @LastEditTime: 2025-12-30 09:17:23
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
      <th v-for="column in columns" :key="column.prop" :style="{ width: column.width, textAlign: column.textAlign }">{{ column.label }}</th>
    </tr>
    </thead>
    <!--    <div class="split-line" />-->
    <tbody>
    <tr v-for="row in data">
      <td v-for="column in columns" :key="column.prop" :style="{ width: column.width, textAlign: column.textAlign, color: column.color }">{{ row[column.prop] }}</td>
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
  table-layout: fixed; /* 关键：固定表格布局，确保列宽生效 */

  tr {
    white-space: nowrap; /* 防止内容换行 */
  }

  th, td {
    padding: 4px 0;
    text-align: left;
    overflow: hidden; /* 防止内容溢出 */
    white-space: nowrap; /* 确保内容不换行 */
    transform: scaleX(0.95);
  }

  thead {
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      position: absolute;
      background-color: #268EFF88;
    }
  }
}
</style>
