<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header']">
        <el-page-header @back="goBack" content="流程设置" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">{{ $t('common.submitButton')
            }}</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <AbnormalProcess  ref="processDesign" :conf="flowTemplateJson"  :flowType="0" />
      </div>
    </div>
  </transition>
</template>

<script>
import AbnormalProcess from "@/components/AbnormalProcess"
export default {
  components: { AbnormalProcess },
  data() {
    return {
      flowTemplateJson:''
    }
  },
  methods: {

    init(id) {
      this.visible = true
      this.formLoading = true
      
    },
    goBack() {
      this.$emit('close')
    },
    handleConfirm(){

    },
  },
}
</script>
<style lang="scss" scoped>
.main {
  background: #ebeef5;
  padding: 10px;
}

.flow-container{
    height: calc(100% - 10px);
}
</style>