<template>
  <div>
    <el-dialog
      title="工单信息"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="workOrderVisible"
      lock-scroll
      class="JNPF-dialog JNPF-dialog_center"
      width="800px"
      @close="handleClose"
    >
      <el-row :gutter="20">
        <el-form
          ref="workOrderForm"
          :rules='workOrderRules'
          :model="workOrderForm"
          label-width="120px"
          label-position="left"
        >
          <el-col :span="12">
            <el-form-item label="生产数量：" prop="productionQuantity">
              <el-input v-model="workOrderForm.productionQuantity" placeholder="生产数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打印模版：" prop="templateId">
              <el-select v-model="workOrderForm.templateId" placeholder="选择打印模版">
                <el-option
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                  v-for="item in printTemplateList"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <JNPF-table
        ref="workOrderTable"
        :data="workOrderList"
        :hasC="true"
        @selection-change="handleWorkOrderSelection"
        fixedNo
        v-loading="tableLoading"
        border
        :checkSelectable="row => !row.selectFlag"
        customKey="JNPFTableKey_PrintFlowCard"
      >
        <el-table-column prop="orderNo" label="工单号" min-width="160" />
        <el-table-column prop="processName" label="工序名称" min-width="120" />
        <el-table-column prop="processCode" label="工序编码" min-width="120"></el-table-column>
        <el-table-column prop="planStartDate" label="计划开始日期" min-width="150"></el-table-column>
        <el-table-column prop="planEndDate" label="计划结束日期" min-width="150"></el-table-column>
        <el-table-column prop="mainUnit" label="单位" min-width="80"></el-table-column>
        <el-table-column prop="productionQuantity" label="生产数量" min-width="100"></el-table-column>
        <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="100"></el-table-column>
        <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="130"></el-table-column>
      </JNPF-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">{{ $t('common.cancelButton') }}</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          :disabled="submitLoading"
          @click="handlePrintSubmit"
        >
          打 印
        </el-button>
      </span>
    </el-dialog>

    <!-- 打印预览组件 -->
    <print-browse
      :visible.sync="printBrowseVisible"
      :id="printId"
      :formId="formId"
      :params="workOrderForm"
      :fullName="fullName"
      ref="printForm"
    />
  </div>
</template>

<script>
import { detailordershengchan } from '@/api/productOrdes/index.js'
import { getPrintList, getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'

export default {
  name: 'PrintFlowCard',
  components: {
    PrintBrowse
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectedRows: {
      type: Array,
      default: () => []
    },
    printQuery: {
      type: Object,
      default: () => ({})
    },
    enCode: {
      type: String,
      default: 'p023'
    }
  },
  data() {
    return {
      workOrderVisible: false,
      printBrowseVisible: false,
      workOrderList: [],
      printTemplateList: [],
      printId: '',
      formId: '',
      fullName: '装配流转卡',
      tableLoading: false,
      submitLoading: false,
      workOrderForm: {
        productionQuantity: '',
        templateId: ''
      },
      workOrderRules: {
        productionQuantity: [
          { required: true, message: '请输入生产数量', trigger: 'blur' }
        ],
        templateId: [
          { required: true, message: '请选择打印模板', trigger: 'change' }
        ]
      },
      selectedWorkOrders: []
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        this.workOrderVisible = newVal
        if (newVal) {
          this.initData()
        }
      },
      immediate: true
    }
  },
  methods: {
    async initData() {
      try {
        if (!this.selectedRows.length) {
          this.$message.error("请选择您要打印的数据!")
          return
        }

        if (this.selectedRows.length > 1) {
          this.$message.error("打印只支持单条数据操作！")
          return
        }

        this.workOrderForm.productionQuantity = this.selectedRows[0].productionQuantity

        this.tableLoading = true

        const [workOrderRes, printListRes] = await Promise.all([
          detailordershengchan(this.selectedRows[0].id),
          getPrintList(this.printQuery)
        ])

        if (workOrderRes.data?.workOrderList) {
          workOrderRes.data.workOrderList.forEach(item => {
            item.selectFlag = false
          })
          this.workOrderList = workOrderRes.data.workOrderList
        }

        if (printListRes.data?.[this.enCode]) {
          this.printTemplateList = printListRes.data[this.enCode]

          if (this.printTemplateList?.length) {
            const enabledTemplate = this.printTemplateList.find(item => item.enabledMark)
            if (enabledTemplate) {
              this.workOrderForm.templateId = enabledTemplate.id
            }
          }
        }
      } catch (error) {
        console.error('初始化数据失败:', error)
        this.$message.error('数据加载失败，请稍后重试')
      } finally {
        this.tableLoading = false
      }
    },

    handleWorkOrderSelection(val) {
      if (val.length) {
        this.workOrderList.forEach(item => {
          if (item.id !== val[0].id) {
            item.selectFlag = true
          }
        });
        this.selectedWorkOrders = val
      } else {
        this.workOrderList.forEach(item => {
          item.selectFlag = false
        });
      }
    },

    async handlePrintSubmit() {
      try {
        const valid = await this.$refs.workOrderForm.validate()
        if (!valid) return

        if (!this.selectedWorkOrders.length) {
          this.$message.error("请选择您要打印的数据!")
          return
        }

        if (this.selectedWorkOrders.length > 1) {
          this.$message.error("打印只支持单条数据操作！")
          return
        }

        if (!this.workOrderForm.templateId) {
          this.$message.error("请选择打印模板!")
          return
        }

        this.submitLoading = true
        const res = await getPrintBusInfo(this.workOrderForm.templateId)

        if (res.data) {
          this.printId = res.data.id
          this.formId = this.selectedWorkOrders[0].id
          this.printBrowseVisible = true
          this.$emit('update:visible', false)
          this.$emit('close')
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('打印操作失败，请稍后重试')
        }
      } finally {
        this.submitLoading = false
      }
    },

    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },

    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('close')
    }
  }
}
</script>
