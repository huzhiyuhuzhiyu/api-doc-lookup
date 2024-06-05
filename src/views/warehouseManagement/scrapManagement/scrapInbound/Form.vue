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
              <div class="subtitle">
                <h5>基本信息</h5>
              </div>
              <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode" />
              <div class="subtitle">
                <h5>产品信息</h5>
              </div>
              <el-row :gutter="30" style="padding:0 15px">
                <TableForm-product :value="linesList" @input="linesChange" ref="linesForm" :tableItems="linesListItems"
                  :openMode="openMode" @addth="addOrDelLinesItem" @deleteth="addOrDelLinesItem" @openSide="openSide"
                  :warehouseId="dataForm.warehouseId" />
              </el-row>
            </div>
          </div>
        </div>
      </div>

      <WareSide v-if="wareVisibled" ref="wareSide" @confirm="sideConfirm" :openMode="openMode"
        :warehouseId="dataForm.warehouseId" />
    </div>
  </transition>
</template>

<script>
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getStockGoodsShelves, getStockGoodsShelvesList, getProductionLotList } from '@/api/basicData/index'
import TableFormProduct from "@/views/warehouseManagement/inboundAndOutbound/inbound/TableForm-product.vue"
import WareSide from '@/views/warehouseManagement/inboundAndOutbound/inbound/WareSide.vue'
export default {
  components: { TableFormProduct, WareSide },
  props: {
    originTypeList: {}
  },
  data() {
    return {
      title: "",
      visible: true,
      btnType: false,
      wareVisibled: false,
      btnLoading: false,
      formLoading: true,
      documentStatus: "",
      sourceType: "inbound_scrap",
      dataForm: {},
      dataFormItems: [/* 通过 this.refeshDataFormItems() 动态更改 */],

      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      spaceLines: [],
      productionLotList: [],
    }
  },
  created() { },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },
  methods: {
    refeshDataFormItems() {
      let partnerName = this.sourceType === "inbound_purchase" || this.sourceType === "inbound_external" ? '供应商' : '客户'
      this.dataForm.sourceType = this.dataForm.sourceType ? this.dataForm.sourceType : 'inbound_scrap'
      let sm = this.dataForm.sourceType !== "inbound_scrap" ? 8 : 12
      this.dataFormItems = [
        { prop: "sourceType", label: "来源类型", value: "inbound_scrap", type: "select", options: this.originTypeList, itemRules: [{ required: true, trigger: "blur" }], itemDisabled: true, sm },
        {
          prop: "warehouseName", label: "入库仓库", value: "", type: "custom", customComponent: "ComSelect-list", method: getWarehouseList,
          change: this.wareChange, requestObj: { chooseUserFlag: true, type: 'scrap' },
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg) => { this.$message.error(`入库仓库${errMsg}`) }] }), trigger: 'no' },
            { required: true, trigger: "no" }
          ], dialogTitle: "选择仓库", sm
        },
        { prop: "sourceNo", label: "来源单号", value: "", type: "select", itemDisabled: true, render: this.dataForm.sourceType !== 'inbound_scrap', sm },
        { prop: "partnerName", label: partnerName, value: "", type: "select", itemDisabled: true, render: this.dataForm.sourceType !== 'inbound_scrap', sm },
        { prop: "submitDate", label: "入库时间", value: "", type: "dateTime", itemDisabled: true, render: this.dataForm.sourceType !== 'inbound_scrap', sm },
        { prop: "createByName", label: "入库人", value: "", type: "input", itemDisabled: true, render: this.dataForm.sourceType !== 'inbound_scrap', sm },
        { prop: "remark", label: "备注", value: "", type: "textarea" }
      ]
    },
    refeshLinesListItems() {
      this.linesListItems = [
        { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 120, fixed: "" },
        { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 120, fixed: "" },
        { prop: "drawingNo", label: "产品图号", value: "", type: 'view', minWidth: 120, fixed: "" },
        {
          prop: "num", label: "数量(主)", value: "", type: "input",
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(主)：${errMsg}`) }), trigger: 'blur' }
          ], minWidth: 180, input:
            (val, scope) => {
              if (scope.row.calculationDirection === 'multiplication') { scope.row.deputyNum = this.jnpf.numberFormat(val * scope.row.ratio) }
              else { scope.row.deputyNum = this.jnpf.numberFormat(val / scope.row.ratio) }
            }
        },
        { prop: "mainUnit", label: "单位(主)", value: "", type: "view", minWidth: 100 },
        {
          prop: "deputyNum", label: "数量(副)", value: "", type: "input",
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量(副)${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(副)：${errMsg}`) }), trigger: 'blur' }
          ], minWidth: 180, input:
            (val, scope) => {
              if (scope.row.calculationDirection === 'division') { scope.row.num = this.jnpf.numberFormat(val * scope.row.ratio) }
              else { scope.row.num = this.jnpf.numberFormat(val / scope.row.ratio) }
            }
        },
        { prop: "deputyUnit", label: "单位(副)", value: "", type: "view", minWidth: 100 },
        // { prop: "ratio", label: "转换系数(开发测试参考)", value: "", type: 'view', minWidth: 220 },
        // { prop: "calculationDirection", label: "计算方向(开发测试参考)", value: "", type: 'view', minWidth: 220 },
        { prop: "routingName", label: "工艺路线名称", value: "", type: "view", minWidth: 160 },
        {
          prop: "processName", label: "工序名称", value: "", type: "custom", customComponent: "ComSelect-page", minWidth: 160, dialogTitle: "选择工序", renderTree: false, tableItems: [{ prop: "routingName", label: "工艺路线名称" }, { prop: "processName", label: "工序名称" }], listMethod: getProductRoutingList, listRequestObj: this.processSelectRequestObj, change: this.processChange, placeholder: "请选择工序", clearable: true, listDataFormatting: (res) => {
            if (!res.data.records.length) this.$message.warning('此产品没有工序')
            return res.data.records
          }, beforeSubmit: async (data, paramsObj) => {
            let flag = true
            if (this.linesList.some(line => line.productsId === paramsObj.scope.row.productsId && line.routingLineId == data.routingLineId)) {
              await this.$message.error('该产品已存在此工艺路线')
              flag = false
            }
            return flag
          }
        },
        { prop: "originalBatchNumber", label: "产品原批号", value: "", type: "input", maxlength: 50, minWidth: 220 },
        { prop: "batchNumber", label: "批次号", value: "", type: "select", options: this.productionLotList, filterable: true, remote: true, remoteMethod: this.remoteMethod, maxlength: 50, minWidth: 220, blur: this.elementBlur },
        { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200, minWidth: 160 },
      ]
      this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
    },
    processSelectRequestObj(rowIndex) {
      let productsId = this.linesList[rowIndex].productsId
      return { productsId }
    },
    init(id, btnType) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.refeshDataFormItems()
      if (id) {
        this.title = btnType ? '查看报废入库单' : '编辑报废入库单'
        // 获取详情
        detailWarehouseData(id).then(res => {
          this.documentStatus = res.data.stockMove.documentStatus
          this.dataForm = res.data.stockMove
          this.linesList = res.data.lines
          this.spaceLines = res.data.spaceLines
          this.refeshDataFormItems()
          this.formLoading = false
        }).catch(() => { this.btnLoading = false })
      } else {
        this.title = '新建报废入库单'
        this.formLoading = false
      }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let focusFlag = true // 自动聚焦是否可用

      // 校验表单
      let form_1 = this.$refs['dataForm'].$refs.main
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && focusFlag) {
        // 校验失败，聚焦第一失败项，继续校验后续项
        if (focusFlag) {
          // 聚焦第一个失败的表单元素
          let formItems = form_1.$children[0].$children
          for (let j = 0; j < formItems.length; j++) {
            let formItem = formItems[j].$children[0].$children[0]
            if (formItem.validateState === 'error') {
              focusFlag = false
              this.jnpf.focusItem(formItem.$children[1].$el)
              this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
              break
            }
          }
        }
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['linesForm'].$refs.main
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && focusFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            focusFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }

      // 判断子表是否有效
      if (!this.linesList.length && focusFlag) {
        focusFlag = false
        this.$message.error('请至少选择一个产品')
      }
      if (this.linesList.length && focusFlag) {
        this.linesList.some(item => {
          let num = 0
          let tempList = this.spaceLines.filter(line => line.productsId === item.productsId && line.routingLineId == item.routingLineId)
          tempList.forEach(line => {
            num += line.num ? Number(line.num) : 0
          })
          if (item.num != num) {
            focusFlag = false
            this.$message.error('请先完善入库产品货位设置')
            return true
          }
          return false
        })
      }

      // 自动聚焦未使用则提交
      if (focusFlag) {
        this.dataForm.documentStatus = submitModel
        this.dataForm.originNo = "io_other"
        this.dataForm.documentType = "inbound"
        this.linesList.forEach(item => item.id = "")
        const formMethod = this.dataForm.id ? updateWarehouseData : addWarehouseData
        // spaceLines每一项的产品id如果与linesList项的产品id相同，那么让spaceLines项的批次号也等于linesList项的批次号
        this.spaceLines.forEach(item => {
          let linesOption = this.linesList.find(line => line.productsId === item.productsId && line.routingLineId == item.routingLineId)
          item.batchNumber = linesOption ? linesOption.batchNumber : ''
        })
        let dataObj = {
          stockMove: this.dataForm,
          lines: this.linesList,
          spaceLines: this.spaceLines
        }
        formMethod(dataObj).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
          this.$emit('close', true)
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
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
      let paramType = Array.isArray(data) ? 'Array' : 'Object'
      if (paramType === 'Object') {
        this.linesList.splice(data.$index, 1)
        this.spaceLines = this.spaceLines.filter(item => item.productsId === data.row.productsId ? item.routingLineId !== data.row.routingLineId : true)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          item.remark = ""
          item.productCode = item.code
          item.productsId = item.id
          const hasFlag = this.linesList.find(i => item.productId === i.productsId)
          if (hasFlag) { hasItemList.push(item.productName) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        }
        this.linesList = tempList.map(item => { return { ...item, warehouseId: this.dataForm.warehouseId } })
        this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() });
      }
    },
    goBack() {
      this.$emit('close')
    },
    linesChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
    // 打开抽屉
    openSide(scope) {
      this.wareVisibled = true
      this.$nextTick(() => {
        let rowDetailList = JSON.parse(JSON.stringify(this.spaceLines.filter(line => line.productsId === scope.row.productsId && line.routingLineId == scope.row.routingLineId)))
        this.$refs['wareSide'].init(scope, rowDetailList, this.btnType)
      })
    },
    // 抽屉提交
    sideConfirm(data, scope) {
      let tempList = this.spaceLines.filter(line => line.productsId === scope.row.productsId ? line.routingLineId != scope.row.routingLineId : true)
      tempList.push(...data)
      this.spaceLines = tempList
      this.$refs['wareSide'].drawerVisible = false
      this.$refs['wareSide'].btnLoading = false
      this.$message.success("配置成功")
    },
    // 批次号失焦清空批次号列表选项
    elementBlur(e) {
      setTimeout(() => {
        let option = this.linesListItems.find(o => o.prop === 'batchNumber')
        option.options = []
      }, 100)
    },
    wareChange(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField('warehouseName') })
      if (!val && data.length) return
      if (!data || !data.length) {
        this.dataForm['warehouseId'] = ""
        this.dataForm['warehouseName'] = ""
      } else {
        this.dataForm['warehouseId'] = data[0].id
        this.dataForm['warehouseName'] = data[0].name
      }
    },
    processChange(val, data, paramsObj) {
      let tempList = this.spaceLines.filter(line => line.productsId === paramsObj.scope.row.productsId ? line.routingLineId !== paramsObj.scope.row.routingLineId : true) // 找出非操作line的scapeLines
      let template2 = this.spaceLines.filter(line => line.productsId === paramsObj.scope.row.productsId && line.routingLineId === paramsObj.scope.row.routingLineId) // 找出操作line的scapeLines
      if (!data || !data.length) {
        this.linesList[paramsObj.scope.$index].routingName = ""
        this.linesList[paramsObj.scope.$index].routingLineId = ""
        this.linesList[paramsObj.scope.$index].processName = ""
      } else {
        this.linesList[paramsObj.scope.$index].routingName = data[0].all.routingName
        this.linesList[paramsObj.scope.$index].routingLineId = data[0].all.routingLineId
        this.linesList[paramsObj.scope.$index].processName = data[0].all.processName
      }
      template2.forEach(line => { line.routingLineId = this.linesList[paramsObj.scope.$index].routingLineId })
      tempList.push(...template2)
      this.spaceLines = tempList
    },
    remoteMethod(query) {
      getProductionLotList({
        keyword: query,
        pageNum: 1,
        pageSize: 20,
      }).then(res => {
        this.productionLotList = res.data.records.map(item => { return { label: item.batchNumber, value: item.batchNumber } })
        // this.$nextTick(() => { this.refeshLinesListItems() });
        let option = this.linesListItems.find(o => o.prop === 'batchNumber')
        option.options = this.productionLotList
      })
    },
  },
  computed: {
    openMode() {
      this.$nextTick(() => { this.refeshLinesListItems() });
      return this.title === '新建报废入库单' ? '新建' : this.title === '编辑报废入库单' ? '编辑' : '只读'
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

.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}
</style>