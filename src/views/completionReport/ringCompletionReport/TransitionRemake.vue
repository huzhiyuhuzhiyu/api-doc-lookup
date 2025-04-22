<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main transitionForm org-form">
          <div class="JNPF-common-page-header"
            v-if="!approvalFlag">
            <el-page-header @back="goBack" :content="title"/>
            <div class="options">
              <template v-if="btnType !== 'look'">
                <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
                  保存草稿
                </el-button>
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
                  保存并提交
                </el-button>
              </template>
              <el-button @click="goBack">{{
                  $t('common.cancelButton')
                }}
              </el-button>
            </div>
          </div>
          <div class="main" v-loading="loading">
            <el-tabs v-model="activeName" v-if="!approvalFlag">
              <el-tab-pane label="基础信息" name="jcInfo">
                <el-collapse v-model="activeNames" style="margin-top: 5px;">
                  <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
                      :btnType="btnType"/>
                    <div class="process-manager">
                      <!-- 当前工序 -->
                      <div class="process-column">
                        <h4 class="section-title">当前工序</h4>
                        <div class="process-list">
                          <el-card
                            v-for="item in currentList"
                            :key="item.processId"
                            class="process-item">
                            <span class="process-name">
                              {{ item.processName }}
                              <el-tag v-if="item.processCode" size="mini">{{ item.processCode }}</el-tag>
                              <el-tag class="ml-8" size="mini">不合格数量：{{ item.autoUnqualifiedQuantity }}</el-tag>
                            </span>
                          </el-card>
                        </div>
                      </div>

                      <!-- 可重制工序 -->
                      <div class="process-column">
                        <h4 class="section-title">可重制工序</h4>
                        <div class="process-list">
                          <el-card
                            v-for="(item,index) in processList"
                            :key="item.processId"
                            class="process-item">
                            <el-radio
                              v-model="selectedProcesses"
                              :label="item.processId"
                              class="selection-radio"
                              :disabled="isFirstOrApprovalFlag(index)"
                              @input="radioInput"
                            >
        <span class="process-name">
          {{ item.processName }}
          <el-tag v-if="item.processCode" size="mini">{{ item.processCode }}</el-tag>
          <el-tag class="ml-8" size="mini">不合格数量：{{ item.autoUnqualifiedQuantity }}</el-tag>
        </span>
                            </el-radio>
                          </el-card>
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="流程信息" name="approvalFlow">
                <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId"
                  style="margin-top: 5px;"/>
              </el-tab-pane>
              <el-tab-pane v-if="btnType === 'look' && dataForm.approvalFlag" label="流转记录"
                name="transferList">
                <recordList :list='flowTaskOperatorRecordList' :endTime='endTime'/>
              </el-tab-pane>
            </el-tabs>
            <el-collapse v-model="activeNames" v-else>
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
                  :btnType="btnType"/>
                <div class="process-manager">
                  <!-- 当前工序 -->
                  <div class="process-column">
                    <h4 class="section-title">当前工序</h4>
                    <div class="process-list">
                      <el-card
                        v-for="item in currentList"
                        :key="item.processId"
                        class="process-item">
                            <span class="process-name">
                              {{ item.processName }}
                              <el-tag v-if="item.processCode" size="mini">{{ item.processCode }}</el-tag>
                              <el-tag class="ml-8" size="mini">不合格数量：{{ item.autoUnqualifiedQuantity }}</el-tag>
                            </span>
                      </el-card>
                    </div>
                  </div>

                  <!-- 可重制工序 -->
                  <div class="process-column">
                    <h4 class="section-title">可重制工序</h4>
                    <div class="process-list">
                      <el-card
                        v-for="(item,index) in processList"
                        :key="item.processId"
                        class="process-item">
                        <el-radio
                          v-model="selectedProcesses"
                          :label="item.processId"
                          class="selection-radio"
                          :disabled="isFirstOrApprovalFlag(index)"
                          @input="radioInput"
                        >
        <span class="process-name">
          {{ item.processName }}
          <el-tag v-if="item.processCode" size="mini">{{ item.processCode }}</el-tag>
          <el-tag class="ml-8" size="mini">不合格数量：{{ item.autoUnqualifiedQuantity }}</el-tag>
        </span>
                        </el-radio>
                      </el-card>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import recordList from "@/views/workFlow/components/RecordList.vue";
import Process from "@/components/Process/Preview.vue";
import busFlow from "@/mixins/generator/busFlow";
import flowMixin from "@/mixins/generator/flowMixin.js"
import {deepClone} from "@/utils";
import {getRemastered, RemasteredAdd, RemasteredEdit} from "@/api/monotonicRemake/monotonicRemake";

export default {
  props: {
    productionOrderId: { // 生产订单ID
      type: [String, Number],
      default: null
    },
    currentProcessId: { // 当前工序ID
      type: [String, Number],
      default: null
    },
    currentWorkOrderId: { // 当前工单ID
      type: [String, Number],
      default: null
    },
    workList: {
      type: Array,
      default: () => []
    },
    pickingWay: { // 领料方式
      type: [String, Number],
      default: null
    },
  },
  mixins: [flowMixin, busFlow],
  components: {Process, recordList},
  data() {
    return {
      title: '重制生产申请',
      btnType: '',
      loading: false,
      btnLoading: false,
      autoUnqualifiedQuantity: '', // 不合格数量
      dataForm: {
        remasteredQuantity: '',
        productionOrderId: this.productionOrderId, // 生产订单ID
        processId: this.currentProcessId, // 当前工序ID
        workOrderId: this.currentWorkOrderId, // 当前工单ID
        remasteredProcessId: '', //重制的工序ID
        remasteredWorkOrderId: '', //重制的工单ID
      },
      dataFormItems: [
        {
          prop: "remasteredQuantity",
          label: "重制数量",
          type: "input",
          value: '',
          itemRules: [
            {
              validator: this.formValidate('noZero', '重制数量不能为0'), trigger: 'change'
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 1, null]
              }),
              trigger: 'change',
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['重制数量不能为空']
              }), trigger: 'change',
            },
            {required: true, trigger: 'change',},
          ],
          sm: 12,
          mb: '6px'
        },
        {
          prop: "applicationReason",
          label: "申请原因",
          value: "",
          type: 'textarea',
          sm: 24,
        },
      ],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      approvalFlag: false,
      flowData: {},
      flowTemplateJson: {},
      flowTaskOperatorRecordList: [],
      endTime: 0,
      // 当前工序
      currentList: [],
      // 可重制工序
      processList: [],
      // 选择需要重制的工序
      selectedProcesses: ''
    }
  },
  created() {
  },
  methods: {
    // 初始化当前工序 和 可重制工序
    initList(workList, currentProcessId) {
      const targetIndex = workList.findIndex(item => item.processId === currentProcessId);
      this.currentList = workList.filter(item => item.processId === currentProcessId)
      if (targetIndex === -1) return;
      this.processList = workList.slice(0, targetIndex + 1);
    },
    async init(id = '', type, approvalFlag = false) {
      this.btnType = type
      this.approvalFlag = approvalFlag
      this.getBusInfo('b080')
      if (type === 'add') this.initList(this.workList, this.currentProcessId)
      if (!id) return

      await this.getDetail(id)
      this.dataForm.approvalFlag && this.getFlowDetail(id)
    },
    radioInput(val) {
      this.autoUnqualifiedQuantity = ''
      if (!val) return
      const selected = this.workList.filter(item => item.processId === val)[0]
      this.autoUnqualifiedQuantity = selected.autoUnqualifiedQuantity
      this.dataForm.remasteredProcessId = selected.processId
      this.dataForm.remasteredWorkOrderId = selected.id
    },
    isFirstOrApprovalFlag(index) {
      if (this.btnType !== 'look') return index === 0 && this.pickingWay !== 'none'
      else return true
    },
    async getDetail(id) {
      this.loading = true
      try {
        const res = await getRemastered(id)
        const {msg, data} = res
        if (msg === 'Success') {
          this.dataForm = data
          this.initList(data.workOrderList, data.processId)
          this.selectedProcesses = data.remasteredProcessId
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    handleSubmit(type) {
      this.$refs.dataForm.$refs.main.validate(valid => {
        if (!valid) return
        if (!this.selectedProcesses.toString()) return this.$message.error('请选择需要重制的工序')
        if (+this.dataForm.remasteredQuantity > +this.autoUnqualifiedQuantity) return this.$message.error('当前需要重制的不合格数量不能大于当前工序的不合格数量')
        this.btnLoading = true
        this.dataForm.documentStatus = type
        const params = deepClone(this.dataForm)
        const api = this.dataForm.id ? RemasteredEdit : RemasteredAdd
        api({proRemastered: params, flowData: this.flowData}).then(res => {
          this.$message.success('操作成功')
          this.goBack()
        }).finally(() => {
          this.btnLoading = false
        })
      })
    },

    goBack() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.process-manager {
  display: grid;
  grid-template-columns: repeat(2, minmax(400px, 1fr));
  gap: 30px;
  align-items: start;

  .section-title {
    margin: 0 0 15px 10px;
    color: #666;
    font-weight: normal;
    font-size: 14px;
    border-left: 4px solid #409EFF;
    padding-left: 10px;
  }

  .process-list {
    user-select: none;
    max-width: 800px;
    margin: 20px auto;
    padding: 0 15px;

    .process-item {
      margin-bottom: 12px;
      border-radius: 8px;
      transition: all 0.3s ease-in;
      cursor: pointer;

      ::v-deep .el-card__body {
        padding: 8px 12px !important; // 减小内边距
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
      }

      .selection-radio {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;

        ::v-deep .el-radio__label {
          display: flex;
          align-items: center;
          width: calc(100% - 28px);
          font-size: 13px;
          line-height: 1.2;
        }

        ::v-deep .el-radio__input {
          margin-top: -1px;
        }
      }

      &:hover {
        transform: translateX(8px);
        box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
        border-color: #ebeef5;
        border-left: 4px solid #409EFF;
      }
    }
  }

}
</style>
