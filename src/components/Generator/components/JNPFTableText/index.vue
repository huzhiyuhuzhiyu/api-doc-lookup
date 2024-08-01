<template>
  <div class="viewData">
    <el-form-item style="height:32px">
      <span>{{ value }}</span>
    </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: ''
    }
  },
}
</script>
<style lang="scss">
.JNPF-Text {
  padding: 3px 0;
  margin: 0;
  // font-style: italic;
}

.viewData {
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>