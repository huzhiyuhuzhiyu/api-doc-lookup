<script>
import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";

export default {
  components: {TableFormProduct},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    linesFormList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      linesList: [],
      linesListItems: [
        // {
        //   prop: 'cooperativePartnerName',
        //   label: '客户',
        //   type: 'view',
        //   minWidth: 180,
        //   align: 'left',
        // },
        // {
        //   prop: '0',
        //   label: '销售单号',
        //   type: 'view',
        //   minWidth: 220,
        //   align: 'left',
        // },
        {
          prop: 'productDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 220,
          align: 'left',
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 220,
          align: 'left',
        },
        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'productionQuantity',
          label: '计划数量',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'unqualifiedQuantity',
          label: '不合格',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'packingQuantity',
          label: '已装箱',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'waitPackingQuantity',
          label: '待装箱',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'currentPlanNum',
          label: '本次计划',
          type: 'input',
          minWidth: 220,
          itemRules: [
            {
              validator: this.formValidate('noZero', '本次计划不能为0', (errMsg, rowIndex) => {
                this.$message.error(`本次计划包装信息第${ rowIndex + 1 }行：${ errMsg }`)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['本次计划不能为空', (errMsg, rowIndex) => {
                  this.$message.error(`本次计划包装信息第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`本次计划包装信息第${ rowIndex + 1 }行：本次计划${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [(rowIndex, value) => +value <= +this.linesList[rowIndex].waitPackingQuantity, "本次计划数量不能大于待装箱数量", (errMsg, rowIndex) => {
                  this.$message.error(`本次计划包装信息第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur'
            },
            {required: true, message: '本次计划不能为空', trigger: ['blur', 'change'],},
          ]
        },
      ],
      linesTableHeight: 0
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
      this.$nextTick(() => {
        this.refreshTableHeight()
        this.linesList = this.linesFormList.map(item => ({
          ...item,
          currentPlanNum: item.waitPackingQuantity || 0
        }))
      })
    }
  },
  computed: {
    planTotalNum() {
      return this.linesList.reduce((total, item) => {
        return total + (parseFloat(item.currentPlanNum) || 0)
      }, 0)
    }
  },
  methods: {
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      let maxHeight = mainRef.clientHeight
      maxHeight -= 100 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

   async handleConfirm() {
      const valid = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid) return
      this.$emit('update:visible', false);
      this.$emit('confirm', this.planTotalNum);
    },
  }
}
</script>

<template>
  <el-dialog
    title="本次计划包装"
    :visible.sync="dialogVisible"
    width="70%"
    lock-scroll
    append-to-body
    :close-on-click-modal="false"
    class="JNPF-dialog JNPF-dialog_center"
    @close="$emit('update:visible', false)"
  >
    <div class="simple-dialog" ref="main">
      <TableForm-product
        @input="contentChanges"
        :value="linesList"
        :hasToolbar="false"
        :hasActionbar="false"
        ref="tableForm"
        :tableItems="linesListItems"
        :tableProps="{
          is: 'JNPF-table',
          fixedNO: true,
          height: linesTableHeight,
          rowKey: 'id',
          defaultExpandAll: true,
          customColumn: true,
          customKey: 'PackagingPlanFormTable'
        }"
      />
      <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
        <span style="font-weight:500;margin-right:10px">计划总数量：{{ planTotalNum }}</span>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" class="cancel-btn">取消</el-button>
      <el-button type="primary" @click="handleConfirm" class="confirm-btn">确定</el-button>
    </span>
  </el-dialog>
</template>


<style lang="scss">
.simple-dialog {
  padding: 15px;
}

.dialog-footer {
  .cancel-btn {
    background-color: #f56c6c;
    border-color: #f56c6c;
    color: white;

    &:hover {
      background-color: #f78989;
      border-color: #f78989;
    }
  }

  .confirm-btn {
    background-color: #409eff;
    border-color: #409eff;

    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
  }
}
</style>
