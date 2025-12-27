<script>
import { getScrapCategoryList } from "@/api/basicData/index.js"
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { deepClone } from "@/utils";

export default {
  name: 'ScrapReasonSelector',

  components: {
    TableFormProduct
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    // v-model 绑定的值
    value: {
      type: Array,
      default: () => []
    },
    // 按钮文本
    buttonText: {
      type: String,
      default: '设置原因'
    },
    // 弹框标题
    dialogTitle: {
      type: String,
      default: '设置原因'
    },
    // 关键字段，如：责废、料废、工废等
    keyword: {
      type: String,
      default: '责废'
    },
    // 原因类型，对应接口中的 type 参数
    reasonType: {
      type: String,
      default: 'responsibility_fee'
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 初始数量（用于显示）
    initialQuantity: {
      type: [Number, String],
      default: 0
    },
    // 显示责任人字段
    showResponsiblePerson: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      dialogVisible: false,
      loading: false,
      submitting: false,
      scrapCategoryList: [],
      tableData: [],
      tableHeight: 400,
      emptyRow: {
        scrapCategoryId: '',
        scrapCategoryName: '',
        scrapQuantity: '',
        scrapUserId: '',
        price: '',
        amount: '',
        id: Date.now() + Math.random() // 添加唯一ID用于表格key
      }
    }
  },

  computed: {
    displayText() {
      if (this.value && this.value.length > 0) {
        const total = this.value.reduce((sum, item) => {
          return this.jnpf.math('add', [sum, item.scrapQuantity || 0])
        }, 0)
        return `已设置 ${ this.value.length } 项${ this.keyword }原因，合计 ${ total } 个`
      }
      return this.initialQuantity ? `待设置${ this.keyword }原因数量：${ this.initialQuantity }` : `请设置${ this.keyword }原因`
    },

    totalQuantity() {
      return this.tableData.reduce((total, item) => {
        return this.jnpf.math('add', [total, Number(item.scrapQuantity) || 0])
      }, 0)
    },

    // 表格列配置
    tableItems() {
      return [
        {
          prop: 'scrapCategoryName',
          label: `${ this.keyword }原因`,
          type: 'select',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: [`${ this.keyword }原因不能为空`, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.keyword }原因第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: ['blur', 'change'],
            },
            { required: true, message: `请选择${ this.keyword }原因`, trigger: "change" },
          ],
          options: this.scrapCategoryList,
          disabled: this.readonly,
          change: (value, scope) => this.handleSelectChange(value, scope)
        },
        {
          prop: 'scrapQuantity',
          label: `${ this.keyword }数量`,
          type: 'input',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate('noZero', `${ this.keyword }数量不能为0`, (errMsg, rowIndex) => {
                this.$message.error(`${ this.keyword }数量第${ rowIndex + 1 }行：${ errMsg }`)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: [`${ this.keyword }数量不能为空`, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.keyword }数量第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.keyword }数量第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            { required: true, message: `${ this.keyword }数量不能为空`, trigger: ['blur', 'change'], },
          ],
          disabled: this.readonly,
          change: (value, scope) => this.calculateAmount(scope)
        },
        ...(this.showResponsiblePerson ? [{
          prop: 'scrapUserId',
          label: '责任人',
          type: 'custom',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: [`${ this.keyword }责任人不能为空`, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.keyword }责任人第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur',
            },
            { required: true, message: `${ this.keyword }责任人不能为空`, trigger: "change" }
          ],
          customComponent: 'user-select',
          placeholder: '请选择责任人',
          disabled: this.readonly,
          change: async (value, data, scope) => {
            const index = scope.scope.$index;
            await this.$nextTick()
            this.$refs.tableForm.$refs.main.validateField(`data.${ index }.scrapUserId`)
          }
        }] : []),
      ]
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        if (newVal && Array.isArray(newVal)) {
          this.tableData = deepClone(newVal).map(item => ({
            ...item,
            id: item.id || Date.now() + Math.random()
          }))
        }
      }
    },

    keyword: {
      handler(newKeyword) {
        if (!this.$props.dialogTitle) {
          this.$emit('update:dialogTitle', `设置${ newKeyword }原因`)
        }
        if (!this.$props.buttonText) {
          this.$emit('update:buttonText', `设置${ newKeyword }`)
        }
      },
      immediate: true
    }
  },

  methods: {
    // 打开弹框
    handleOpenDialog() {
      if (this.disabled || this.readonly) return

      this.dialogVisible = true
      if (this.tableData.length === 0) {
        this.addLine()
      }
      this.loadScrapCategoryList()
    },

    handleDialogClose() {
      // 恢复为原始数据
      this.tableData = JSON.parse(JSON.stringify(this.value || [])).map(item => ({
        ...item,
        id: item.id || Date.now() + Math.random()
      }))
    },

    async loadScrapCategoryList() {
      try {
        this.loading = true
        const params = {
          type: this.reasonType,
          pageNum: -1,
          pageSize: -1
        }
        const res = await getScrapCategoryList(params)
        this.scrapCategoryList = res.data?.records.map(item => ({
          label: item.name,
          value: item.id
        })) || []
      } catch ( error ) {
        console.error(`加载${ this.keyword }原因列表失败:`, error)
        this.scrapCategoryList = []
      } finally {
        this.loading = false
      }
    },

    // 新增一行
    addLine() {
      this.tableData.push({
        ...JSON.parse(JSON.stringify(this.emptyRow)),
        id: Date.now() + Math.random(),
        type: 'work',
        scrapCategory: this.reasonType
      })
    },

    handleTableInput(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.tableData = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.tableData[dataOrIndex][prop] = value
        // 如果是责废数量变化，重新计算金额
        if (prop === 'scrapQuantity') {
          this.calculateAmount({ $index: dataOrIndex })
        }
      }
    },

    calculateAmount(scope) {
      const index = scope.$index
      const row = this.tableData[index]
      if (row.scrapQuantity && row.price) {
        row.amount = this.jnpf.numberFormat(
          this.jnpf.math('multiply', [row.scrapQuantity, row.price]),
          6
        )
      }
    },

    handleSelectChange(value, scope) {
      const selectedItem = this.scrapCategoryList.find(item => item.id === value)
      if (selectedItem) {
        const index = scope.$index
        const row = this.tableData[index]
        row.price = selectedItem.price
        row.scrapCategoryName = selectedItem.name
        row.scrapCategoryId = selectedItem.id

        if (row.scrapQuantity) {
          row.amount = this.jnpf.numberFormat(
            this.jnpf.math('multiply', [row.scrapQuantity, row.price]),
            6
          )
        }
      }
    },

    // 删除行
    handleDelete(scope) {
      this.tableData.splice(scope.$index, 1)
    },

    // 确认提交
    async handleConfirm() {
      const valid = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid) return

      this.submitting = true

      try {
        const result = deepClone(this.tableData)
        this.$emit('change', result, this.totalQuantity)

        this.dialogVisible = false
        this.$message.success('设置成功')
      } catch ( error ) {
        console.error('提交失败:', error)
        this.$message.error('提交失败，请重试')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<template>
  <div class="scrap-reason-selector">
    <div class="selector-display" @click="handleOpenDialog">
      <span class="display-text">{{ displayText }}</span>
      <el-button
        type="primary"
        size="small"
        @click.stop="handleOpenDialog"
        :disabled="disabled"
      >
        {{ buttonText }}
      </el-button>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      width="50%"
      class="JNPF-dialog JNPF-dialog_center"
      @close="handleDialogClose"
    >
      <div class="JNPF-common-layout" style="height: 60vh;overflow: auto;">
        <div class="JNPF-common-layout-center JNPF-flex-main" style="background-color: #fff;overflow-y:auto;">
          <div class="JNPF-common-layout-main JNPF-flex-main" style="padding-top: 0;">
            <div v-if="!readonly">
              <el-button type="text" icon="el-icon-plus" @click="addLine" style="width: 100px;text-align: left;padding-top: 0;">
                新增一行
              </el-button>
            </div>

            <TableForm-product
              @input="handleTableInput"
              :value="tableData"
              :hasToolbar="false"
              ref="tableForm"
              :btnType="readonly ? 'look' : 'edit'"
              :tableItems="tableItems"
              @deleteth="handleDelete"
              :tableProps="{
                is: 'JNPF-table',
                fixedNO: true,
                hasC: false,
                height: tableHeight,
                rowKey: 'id',
                customColumn: true,
              }"
            />
            <div class="summary-section text">
              <span class="summary-item">{{ keyword }}数量合计：{{ totalQuantity }}</span>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.scrap-reason-selector {
  width: 100%;
}

.selector-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.3s;
}

.selector-display:hover {
  border-color: #409EFF;
}

.display-text {
  color: #606266;
  font-size: 14px;
}

.summary-section {
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  padding-left: 10px;
  font-size: 14px;
  margin-top: 10px;
}

.summary-item {
  font-weight: 500;
  margin-right: 20px;
}

.selector-display[readonly] {
  background-color: #f5f7fa;
  cursor: not-allowed;
  border-color: #E4E7ED;
}

.selector-display[readonly]:hover {
  border-color: #E4E7ED;
}
</style>
