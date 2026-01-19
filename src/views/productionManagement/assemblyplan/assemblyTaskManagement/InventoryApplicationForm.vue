<template>
  <el-dialog
    title="入库申请"
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
import { submitAssemblyInboundApplication } from "@/api/productOrdes";

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
      dataFormItems: [
        {
          prop: 'completedQuantity',
          label: '可申请数量',
          type: 'input',
          disabled: true,
          sm: 24
        },
        {
          prop: 'transferPackagingNum',
          label: '申请数量',
          type: 'input',
          itemRules: [
            // {
            //   validator: this.formValidate('noZero', '申请数量不能为0', (errMsg) => {
            //     this.$message.error(errMsg)
            //   }), trigger: ['blur', 'change']
            // },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['申请数量不能为空', (errMsg) => {
                  this.$message.error(`申请数量不能为空`)
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
                params: [(rowIndex, value) => +value <= +this.dataForm.completedQuantity, "不能大于可申请数量", (errMsg, rowIndex) => {
                  this.$message.error(`申请数量${ errMsg }`)
                }]
              }), trigger: 'blur'
            },
            { required: true, message: '申请数量不能为空', trigger: ['blur', 'change'], },
          ],
          sm: 24,
        },
      ],
    }
  },
  watch: {
    async visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        const { completedQuantity, id } = this.formData;
        this.dataForm = {
          id,
          completedQuantity,
          transferPackagingNum: completedQuantity,
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
        const res = await submitAssemblyInboundApplication(this.dataForm)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success('入库申请成功')
          this.dialogVisible = false
          this.$emit('initData')
        } else {
          this.$message.error(msg || '入库申请失败')
        }
      } catch ( error ) {
        this.$message.error('入库申请数据出错')
      } finally {
        this.loading = false
      }
    },
  }
}
</script>
