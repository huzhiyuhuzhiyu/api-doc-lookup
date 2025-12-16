<template>
  <el-dialog
    title="下达需求池"
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
import { issuePoolSaleLines } from "@/api/salesManagement/assemblyOrders";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    issuePoolForm: {
      type: Array,
      default: () => {
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dataForm: {},
      dataFormItems: [
        {
          label: '可下发数量',
          prop: 'num',
          type: 'input',
          disabled: true,
          sm: 24
        },
        {
          prop: 'issueQuantity',
          label: '下发数量',
          type: 'input',
          sm: 24,
          itemRules: [
            {
              validator: this.formValidate('noZero', '下发数量不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['下发数量不能为空', (errMsg) => {
                  this.$message.error(`下发数量不能为空`)
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
                params: [(rowIndex, value) => +value <= +this.dataForm.num, "不能大于可下发数量", (errMsg, rowIndex) => {
                  this.$message.error(`下发数量${ errMsg }`)
                }]
              }), trigger: 'blur'
            },
            { required: true, message: '下发数量不能为空', trigger: ['blur', 'change'], },
          ]
        },
      ],
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        const { num, id } = this.issuePoolForm;
        this.dataForm = {
          num,
          issueQuantity: num,
          saleOrdersLineId: id,
        };
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleConfirm() {
      await this.$refs.dataForm.$refs.main.validate()
      try {
        this.loading = true
        const res = await issuePoolSaleLines([this.dataForm])
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success('下达成功')
          this.dialogVisible = false
          this.$emit('initData')
        } else {
          this.$message.error(msg || '下达失败')
        }
      } catch ( error ) {
        this.$message.error('下达需求池数据出错')
      } finally {
        this.loading = false
      }
    },
  }
}
</script>
