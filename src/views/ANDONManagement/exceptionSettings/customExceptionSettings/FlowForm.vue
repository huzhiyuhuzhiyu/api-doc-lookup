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
        <AbnormalProcess :key="flowTemplateJson.nodeId" ref="processDesign" :conf="flowTemplateJson" :flowType="0"
          v-if="flowTemplateJson.nodeId" :planPersonId="planPersonId" :planPersonName="planPersonName" />
        <AbnormalProcess ref="processDesign" :conf="flowTemplateJson" :flowType="0" v-else :planPersonId="planPersonId" :planPersonName="planPersonName"/>
      </div>
    </div>
  </transition>
</template>

<script>
import { Update, Create } from '@/api/workFlow/FlowEngine'
import { getBusinessFlowInfo } from '@/api/workFlow/FlowEngine'
import AbnormalProcess from "@/components/AbnormalProcess"
let unique = 0
export default {
  components: { AbnormalProcess },
  data() {
    return {
      flowTemplateJson: {},
      dataForm: {
        businessFlow: '',
        id: '',
        flowTemplateJson: '',
        formType: '4',
        enCode: '',
        name: '',
        category: '',
        enabledMark: 1,
        busCallBack: 'AbApplyRecordCallback',
        planProcessingTime: '',
        planHandler: '',
        planPersonId:'',
        planPersonName:'',
      },
    }
  },
  methods: {

    init(id, fullName,planPersonId,planPersonName) {
      this.visible = true
      this.formLoading = true
      this.dataForm.businessFlow = id
      this.planPersonId = planPersonId
      this.planPersonName = planPersonName
      this.dataForm.enCode = this.uuid()
      this.dataForm.fullName = fullName
      this.dataForm.category = 'exception'
      this.getBusInfo(this.dataForm.businessFlow)
    },
    uuid() {
      const time = Date.now()
      const random = Math.floor(Math.random() * 1000000000)
      unique++
      return random + unique + String(time)
    },
    getBusInfo(id) {
      getBusinessFlowInfo(id).then(res => {
        if (res.data) {
          this.dataForm = { ...res.data, formType: '4' }
          this.dataForm.flowTemplateJson && (this.flowTemplateJson = JSON.parse(this.dataForm.flowTemplateJson))
        } else {
          this.flowTemplateJson = {}
          this.dataForm.flowTemplateJson = {}
        }
        this.formLoading = false
      }).catch(() => { })
    },
    goBack() {
      this.$emit('close')
    },
    handleConfirm() {
      this.$refs['processDesign'].getData().then(res => {
        this.btnLoading = true
        this.flowTemplateJson = res.formData
        this.dataForm.flowTemplateJson = JSON.stringify(this.flowTemplateJson)
        
        let planTime = res.formData.childNode.properties.planTime
        let flowUnit = res.formData.childNode.properties.flowUnit
        this.dataForm.planProcessingTime = this.jnpf.timeToMinutes(planTime,flowUnit)
        this.dataForm.planPersonId = this.dataForm.planPersonId ? this.dataForm.planPersonId : res.formData.childNode.properties.approvers[0]
        const formMethod = this.dataForm.id ? Update : Create
        formMethod(this.dataForm).then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
              this.$emit('close')
            }
          })
        }).catch(() => { this.btnLoading = false })
      }).catch(err => {
        err.msg && this.$message.warning(err.msg)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.main {
  background: #ebeef5;
  padding: 10px;
}

.flow-container {
  height: calc(100% - 10px);
}
</style>