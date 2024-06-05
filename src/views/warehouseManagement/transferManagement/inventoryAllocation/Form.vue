<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="title" />
        <div class="options" v-if="!btnType">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>基本信息</h5>
              </div>
              <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode" />
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>
              <TableForm-product :value="linesList" @input="contentChanges" ref="tableForm" :tableItems="linesListItems"
                :openMode="openMode" @addth="addOrDelLinesItem" @deleteth="addOrDelLinesItem"
                :selfWarehouseId="dataForm.transferOutWarehouseId" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { addTransferData, updateTransferData, detailTransferData } from '@/api/warehouseManagement/transferManagement'

import TableFormProduct from './TableForm-product' // 产品表格表单组件
import { getWarehouseList } from '@/api/basicData/index' // 默认仓库 材质

export default {
  components: { TableFormProduct },
  data() {
    return {
      btnType: false,
      visible: true,
      btnLoading: false,
      formLoading: true,
      title: "",
      dataForm: {},
      documentStatus: "",
      dataFormItems: [
        { prop: "transferOutWarehouseName", label: "调出仓库", value: "", type: "custom", customComponent: "ComSelect-list", dialogTitle: '选择仓库', method: getWarehouseList, change: this.outWareChange, requestObj: { chooseUserFlag: true, type: 'normal' }, itemRules: [{ required: true, trigger: "no" }], beforeSubmit: this.transferOutWarehouseChange, sm: 12 },
        { prop: "transferInWarehouseName", label: "调入仓库", value: "", type: "custom", customComponent: "ComSelect-list", dialogTitle: '选择仓库', method: getWarehouseList, change: this.inWareChange, requestObj: { type: 'normal' }, itemRules: [{ required: true, trigger: "no" }, { validator: this.wareValidate(), trigger: 'change' }], sm: 12 },
        { prop: "remark", label: "备注", value: "", type: 'textarea' }
      ],

      linesList: [],
      linesListItems: [
        { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 120, fixed: "" },
        { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 120, fixed: "" },
        { prop: "productSpec", label: "规格型号", value: "", type: 'view', minWidth: 120 },
        {
          prop: "num", label: "数量(主)", value: "", type: "input",
          itemRules: [
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(主)：${errMsg}`) }), trigger: 'blur' },
            { validator: this.calcValidate(this.linesList, 'num', 'availableQuantity', '<=', "不能超过对应可用数量", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }), trigger: 'blur' }
          ], minWidth: 180, input:
            (val, scope) => {
              if (scope.row.calculationDirection === 'multiplication') { scope.row.deputyNum = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
              else { scope.row.deputyNum = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
            }
        },
        { prop: "mainUnit", label: "单位(主)", value: "", type: "view", minWidth: 100 },
        { prop: "availableQuantity", label: "可用数量(主)", value: "0", type: 'view', minWidth: 120 },
        {
          prop: "deputyNum", label: "数量(副)", value: "0", type: "input",
          itemRules: [
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(副)：${errMsg}`) }), trigger: 'blur' },
            { validator: this.calcValidate(this.linesList, 'deputyNum', 'deputyAvailableQuantity', '<=', "不能超过对应可用数量", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }), trigger: 'blur' }
          ], minWidth: 180, input:
            (val, scope) => {
              if (scope.row.calculationDirection === 'division') { scope.row.num = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
              else { scope.row.num = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
            }
        },
        { prop: "deputyAvailableQuantity", label: "可用数量(副)", value: "0", type: 'view', minWidth: 120, render: this.openMode !== '只读' },
        { prop: "deputyUnit", label: "单位(副)", value: "", type: "view", minWidth: 100 }
      ],
    }
  },
  created() {
    this.dataFormItems.forEach(tc => {
      this.dataForm[tc.prop] = tc.value || "";
    })
    this.linesListItems.forEach(tc => {
      if (tc.prop === "availableQuantity") {
        this.$nextTick(() => { tc.render = this.openMode !== "只读" })
      }
    })
  },
  watch: {
    "dataForm.transferOutWarehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.linesList = []
      },
    }
  },
  methods: {
    outWareChange(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField('transferOutWarehouseName') })
      if (!val && data.length) return
      if (!data || !data.length) {
        this.dataForm['transferOutWarehouseId'] = ""
        this.dataForm['transferOutWarehouseName'] = ""
      } else {
        this.dataForm['transferOutWarehouseId'] = data[0].id
        this.dataForm['transferOutWarehouseName'] = data[0].name
      }
    },
    inWareChange(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField('transferInWarehouseName') })
      if (!val && data.length) return // 忽略处理自动回显的数据
      if (!data || !data.length) {
        this.dataForm['transferInWarehouseId'] = ""
        this.dataForm['transferInWarehouseName'] = ""
      } else {
        this.dataForm['transferInWarehouseId'] = data[0].id
        this.dataForm['transferInWarehouseName'] = data[0].name
      }
    },
    init(id, btnType) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      if (id) {
        this.dataForm.id = id
        this.title = btnType ? '查看存货调拨单' : '编辑存货调拨单'
        detailTransferData(id).then(res => {
          this.dataForm = res.data.picking
          this.linesList = res.data.lines
          this.formLoading = false
        })
      } else {
        this.title = '新建存货调拨单'
        this.formLoading = false
      }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用

      // 校验表单
      let form_1 = this.$refs['dataForm'].$refs.main
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['tableForm'].$children[0]
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      // 判断是否有产品
      if (!this.linesList.length && submitFlag) {
        submitFlag = false
        this.$message.error('请至少添加一个产品')
      }

      // 是否有产品明细的主数量与可用数量不一致，给出提示
      if (submitFlag) {
        let index = this.linesList.findIndex(line => line.num != line.availableQuantity)
        if (index != -1) {
          submitFlag = await this.$confirm(`产品信息第${index + 1}行：调拨数量与可用数量不一致，是否继续？`, this.$t('common.tipTitle'), { type: 'warning' }).catch(err => false)
        }
      }

      // 自动聚焦未使用则提交
      if (submitFlag) {
        this.dataForm.documentStatus = submitModel
        this.dataForm.transferType = "allocate_transfer" // 调拨
        this.dataForm.receiveStatus = "not_received" // 待接收

        const formMethod = this.dataForm.id ? updateTransferData : addTransferData
        let dataObj = {
          picking: this.dataForm,
          lines: this.linesList
        }
        formMethod(dataObj).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { { msg = submitModel == "submit" ? "提交成功" : "保存成功" } }
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }
    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'
      if (type === 'Object') { this.linesList.splice(data.$index, 1) }
      else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          item.remark = ""
          item.productsId = item.id
          item.productCode = item.code
          item.productSpec = item.spec
          item.productName = item.name
          item.pickingId = this.dataForm.id
          item.id = ""
          item.num = item.availableQuantity
          item.deputyNum = item.deputyAvailableQuantity
          const hasFlag = this.linesList.some(line => line.productId === item.productId || line.productsId === item.productId)
          if (hasFlag) { hasItemList.push(item.productName) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        }
        this.linesList = JSON.parse(JSON.stringify(tempList))
        this.$nextTick(() => { this.$refs.tableForm.setDefaultValue() });
      }
    },
    goBack() {
      this.$emit('close')
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    wareValidate() {
      return (rule, value, callback) => {
        if (!value) { callback() }
        else if (this.dataForm.transferOutWarehouseId === this.dataForm.transferInWarehouseId) {
          return callback(new Error("调入仓库不能与调出仓库相同"))
        } else { return callback() }
      };
    },
    // list 中 a 不能 operator b 的校验规则
    calcValidate(list, a, b, operator, msg, callbackMethod) {
      return (rule, value, callback) => {
        let index = Number(rule.field.match(/\d+/)[0])
        msg = msg || `${a} 不能 ${operator} ${b}`
        if (!value || value == 0) { callback() }
        else {
          let flag = false
          list = this.linesList
          let num_1 = Number(list[index][a])
          let num_2 = Number(list[index][b])
          switch (operator) {
            case '<=':
              if (!(num_1 <= num_2)) { flag = true }
              break;
            default:
              break;
          }
          if (flag) {
            if (callbackMethod) { callbackMethod(msg, rowIndex) }
            callback(new Error(msg));
          } else { callback() }
        }
      };
    },
    async transferOutWarehouseChange(data, paramsObj) {
      if (!this.dataForm.transferOutWarehouseName) return true
      let flag = await this.$confirm('确定切换调出仓库吗？这会导致你需要重新选择出库产品', '提示', { type: 'warning' }).catch(err => false)
      return flag
    }
  },
  computed: {
    openMode() {
      return this.title === '新建存货调拨单' ? '新建' : this.title === '编辑存货调拨单' ? '编辑' : '只读'
    }
  },
}
</script>
<style lang="scss" scoped>
.contain {
  position: relative;
  height: calc(100% - 47px);
  overflow-y: auto;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px 30px;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}
</style>