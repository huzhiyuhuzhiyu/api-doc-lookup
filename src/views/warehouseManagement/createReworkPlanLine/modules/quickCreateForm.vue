<template>
  <el-dialog
    title="返工"
    :visible.sync="dialogVisible"
    width="40%"
    lock-scroll
    append-to-body
    :close-on-click-modal="false"
    class="JNPF-dialog JNPF-dialog_center"
    @close="handleClose"
  >
    <div class="dialog-content">
      <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" btnType="add"/>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { detailProcess } from "@/api/basicData/processSettingss";
import { cardInspectionCompletion } from "@/api/inspectionManagement";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dataForm: {},
      dataFormItems: [],
      processList: []
    }
  },
  watch: {
    async visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        await this.fetchRoutingDetails()
        this.updateDataFormItems()
        this.dataForm = {
          id: this.formData.id,
          productCode: this.formData.productCode,
          waitSplitQuantity: this.formData.waitSplitQuantity,
          completionCardNum: this.formData.waitSplitQuantity,
          productionLineId: this.formData.productionLineId,
          routingId: this.formData.routingId,
          processId: '',
        };
      }
    }
  },
  methods: {
    updateDataFormItems() {
      this.dataFormItems = [
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input',
          disabled: true,
          sm: 24
        },
        {
          prop: 'waitSplitQuantity',
          label: '可返工数量',
          type: 'input',
          disabled: true,
          sm: 24
        },
        {
          prop: 'completionCardNum',
          label: '返工数量',
          type: 'input',
          itemRules: [
            {
              validator: this.formValidate('noZero', '返工数量不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['返工数量不能为空', (errMsg) => {
                  this.$message.error(`返工数量不能为空`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg) => {
                  this.$message.error(errMsg)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [(rowIndex, value) => +value <= +this.dataForm.waitSplitQuantity, "返工数量不能大于可返工数量", (errMsg, rowIndex) => {
                  this.$message.error(`返工数量${ errMsg }`)
                }]
              }), trigger: 'blur'
            },
            { required: true, message: '返工数量不能为空', trigger: ['blur', 'change'], },
          ],
          sm: 24,
        },
        {
          prop: 'processId',
          label: '工序',
          type: 'select',
          options: this.processList,
          sm: 24,
        }
      ]
    },
    async fetchRoutingDetails() {
      const res = await detailProcess(this.formData.routingId)
      const { routingLineList = [] } = res.data || {}
      this.processList = routingLineList.map(item => ({
        label: item.processName,
        value: item.processId,
      })).sort((a, b) => a.sort - b.sort)
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleConfirm() {
      await this.$refs.dataForm.$refs.main.validate()
      try {
        this.loading = true
        const res = await cardInspectionCompletion(this.dataForm)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success('返工成功')
          this.dialogVisible = false
          this.$emit('initData')
        } else {
          this.$message.error(msg || '返工失败')
        }
      } catch ( error ) {
        this.$message.error('返工数据出错')
      } finally {
        this.loading = false
      }
    },
  }
}
</script>
