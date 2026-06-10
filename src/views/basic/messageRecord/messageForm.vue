<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-10-25 17:01:51
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-10-25 17:16:21
 * @FilePath: \os-web-zgt4.0\src\views\basic\messageRecord\messageForm.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog title="查看消息内容" :close-on-click-modal="false" :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center JNPF-dialog-notice" lock-scroll width="90%"
    append-to-body>
    <div class="notice-wrapper" v-loading="loading">
      <h1 class="title">{{info.title}}</h1>
      <div class="info">
        <span>{{info.releaseTime|toDate()}}</span><span>{{info.releaseUser}}</span>
      </div>
      <div class="main" v-html="info.bodyText"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{$t('common.cancelButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      loading: false,
      info: {}
    }
  },
  methods: {
    init(row) {
      this.visible = true
      // this.loading = true
      this.info = row
    }
  }
}
</script>