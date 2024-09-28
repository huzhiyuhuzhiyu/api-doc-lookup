<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="$emit('close', true)" content="异常处理" />
        <div class="options">
          <el-button type="primary" v-if="dataForm.processStatus === 'processing'" size="mini" :loading="btnLoading" @click="handleConfirm()">
            处理</el-button>
          <el-button @click="$emit('close', true)">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本信息" name="basicInfo">
            <JNPF-Col v-model="dataForm" :tabContent="masterList" ref="dataForm" :openMode="openMode" />
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="flowInfo">
            <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="处理" :close-on-click-modal="false" :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center"
        lock-scroll append-to-body width='600px'>
        <el-form ref="dealForm" :model="dealForm" label-width="120px">
          <el-form-item label="处理描述：" prop="processDescription">
            <el-input v-model="dealForm.processDescription" placeholder="请输入处理描述" type="textarea" :rows="4" />
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="handleApproval()" :loading="approvalBtnLoading">
            {{ $t('common.confirmButton') }}
          </el-button>
        </span>
      </el-dialog>

    </div>
  </transition>
</template>

<script>
import { detailAbnoramlData } from '@/api/abnormalManagement/index.js'
import { Audit } from '@/api/workFlow/FlowBefore'
import { getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/AbnormalProcess/Preview'
const Base64 = require('js-base64').Base64
export default {
  components: { Process },
  data() {
    return {
      visible: false,
      activeName: 'basicInfo',
      formLoading: false,
      flowTemplateJson: '',
      btnType: '',
      dataForm: {},
      approvalBtnLoading: false,
      masterList: [
        { prop: "orderNo", label: "申请单号", value: "", type: "input", sm: 6, itemDisabled: true },
        { prop: "abnormalType", label: "申请类型", value: "", type: "input", sm: 6, itemDisabled: true },
        { prop: "abnormalContent", label: "申请内容", value: "", type: "input", sm: 6, itemDisabled: true },
        { prop: "equipmentName", label: "设备名称", value: "", type: "input", sm: 6, itemDisabled: true },
        { prop: "productionOrderNo", label: "生产单号", value: "", type: "input", sm: 6, itemDisabled: true },
      ],
      dealForm: {
        processDescription: '',
      },
    }
  },
  computed: {
    openMode() {
      return '只读'
    }
  },
  methods: {
    init(id) {
      this.formLoading = true
      if (id) {
        detailAbnoramlData(id).then(res => {
          res.data && (this.dataForm = res.data)
          this.formLoading = false
          this.getFlowDetail(id)
        }).catch(() => this.formLoading = false)
      }
    },
    handleApproval() {
      this.approvalBtnLoading = true
      let query = {
        handleOpinion: this.dealForm.processDescription,
        formData: this.dataForm,
      }
      Audit(this.dataForm.flowTaskOperatorId, query).then(res => {
        const errorData = res.data
        if (errorData && Array.isArray(errorData) && errorData.length) {
          this.approvalBtnLoading = false
        } else {
          this.$message({
            type: 'success',
            message: '处理成功',
            duration: 1000,
            onClose: () => {
              this.approvalBtnLoading = false
              this.visible = false
              this.$emit('close', true)
            }
          })
        }
      }).catch(() => this.approvalBtnLoading = false)

    },
    handleConfirm() {
      this.visible = true
      this.$nextTick(() => {this.$refs.dealForm.resetFields()})
    },
    getFlowDetail(id) {
      getBusinessFlowDetail(id).then(res => {
        if (res.data) {
          this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson) : null
          let flowTaskNodeList = res.data.flowTaskNodeList
          if (flowTaskNodeList.length) {
            for (let i = 0; i < flowTaskNodeList.length; i++) {
              const nodeItem = flowTaskNodeList[i]
              const loop = data => {
                if (Array.isArray(data)) data.forEach(d => loop(d))
                if (data.nodeId === nodeItem.nodeCode) {
                  if (nodeItem.type == 0) data.state = 'state-past'
                  if (nodeItem.type == 1) data.state = 'state-curr'
                  if (nodeItem.nodeType === 'approver' || nodeItem.nodeType === 'start' || nodeItem.nodeType === 'subFlow') data.content = nodeItem.userName
                  return
                }
                if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                if (data.childNode) loop(data.childNode)
              }
              loop(this.flowTemplateJson)
            }
          }
        }
      }).catch(() => { })
    },
  },



}
</script>

<style lang="scss" scoped>
.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}

/* 进度跟踪样式 */
::v-deep #pane-schedule {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  // padding: 0 20px;
}

::v-deep .el-tabs {
  height: 100% !important;
}
</style>