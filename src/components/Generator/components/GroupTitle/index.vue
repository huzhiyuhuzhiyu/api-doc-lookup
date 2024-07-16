<template>
  <div class="groupTitle subtitle">{{content}}</div>
</template>
<script>
export default {
  name: 'groupTitle',
  props: {
    content: {
      type: String,
      default: ''
    },
    'content-position': {
      type: String,
      default: 'left'
    },
  }
}
</script>
<style lang="scss" scoped>
// .groupTitle {
//   border-bottom: 1px solid #ebeef5;
//   color: #606266;
//   font-size: 16px;
//   line-height: 50px;
//   font-weight: 600;
// }
.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px !important;
}
</style>