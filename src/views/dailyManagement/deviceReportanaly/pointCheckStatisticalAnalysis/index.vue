<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="group-container-body section has-hover">
        <div style="height: 65px;width: 100%;padding: 10px;">
          <div class="dash-rich-text">
            <div class="rich-text-content">设备动态看板</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.has-hover:hover {
  box-shadow: 0 6px 14px 0 rgba(84, 48, 132, 0.15) !important;
}
.section {
  min-width: 1080px;
  background-color: #fff;
  border-radius: 3px;
}
.group-container-body {
  .dash-rich-text {
    width: 100%;
    height: 100%;
    .rich-text-content {
      word-wrap: break-word;
      background: 0 0;
      height: 100%;
      overflow: auto;
      padding-right: 10px;
      word-break: break-word;
      text-align: center;
      font-weight: bold;
      line-height: 1.6;
      font-size: 28px;
      color: rgb(237, 237, 239);
    }
  }
}
</style>