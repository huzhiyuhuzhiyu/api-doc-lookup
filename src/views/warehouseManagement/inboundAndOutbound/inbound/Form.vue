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
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
              :element-loading-text="loadingText">
              <div class="subtitle">
                <h5>基本信息</h5>
              </div>
              <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode" />
              <div class="subtitle">
                <h5>产品信息</h5>
              </div>
              <TableForm-product :value="linesList" @input="linesChange" ref="linesForm" class="TableForm"
                :tableItems="linesListItems" :openMode="openMode" @addth="addOrDelLinesItem"
                @deleteth="addOrDelLinesItem" @openSide="openSide" :warehouseId="dataForm.warehouseId" customStyle
                @changeLoading="onChangeLoading" />
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
import { detailByBarCodes } from '@/api/warehouseManagement/packingList'
import TableFormProduct from "./TableForm-product.vue"
import WareSide from './WareSide.vue'
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
      dataForm: {},
      dataFormItems: [/* 通过 this.refeshDataFormItems() 动态更改 */],

      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      spaceLines: [],
      productionLotList: [],
      loadingText: '',
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
      this.dataForm.sourceType = this.dataForm.sourceType ? this.dataForm.sourceType : 'io_other'
      let sm = this.dataForm.sourceType !== "io_other" ? 8 : 12
      this.dataFormItems = [
        { prop: "sourceType", label: "来源类型", value: "io_other", type: "select", options: this.originTypeList, itemRules: [{ required: true, trigger: "blur" }], itemDisabled: true, sm },
        {
          prop: "warehouseName", label: "入库仓库", value: "", type: "custom", customComponent: "ComSelect-list", method: getWarehouseList,
          change: this.wareChange, requestObj: { chooseUserFlag: true, type: 'normal' },
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg) => { this.$message.error(`入库仓库${errMsg}`) }] }), trigger: 'no' },
            { required: true, trigger: "no" }
          ], dialogTitle: "选择仓库", sm
        },
        { prop: "sourceNo", label: "来源单号", value: "", type: "select", itemDisabled: true, render: this.dataForm.sourceType !== 'io_other', sm },
        { prop: "partnerName", label: partnerName, value: "", type: "select", itemDisabled: true, render: this.dataForm.sourceType !== 'io_other', sm },
        { prop: "submitDate", label: "入库时间", value: "", type: "dateTime", itemDisabled: true, render: this.dataForm.sourceType !== 'io_other', sm },
        { prop: "createByName", label: "入库人", value: "", type: "input", itemDisabled: true, render: this.dataForm.sourceType !== 'io_other', sm },
        { prop: "remark", label: "备注", value: "", type: "textarea" }
      ]
    },
    refeshLinesListItems() {
      this.linesListItems = [
        { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 140 },
        { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 140 },
        { prop: "drawingNo", label: "产品图号", value: "", type: 'view', minWidth: 300 },
        {
          prop: "num", label: "数量(主)", value: "", type: "input",
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量(主)${errMsg}`) }] }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(主)：${errMsg}`) }), trigger: 'blur' }
          ], minWidth: 180, input:
            (val, scope) => {
              if (scope.row.calculationDirection === 'multiplication') { scope.row.deputyNum = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
              else { scope.row.deputyNum = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
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
              if (scope.row.calculationDirection === 'division') { scope.row.num = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
              else { scope.row.num = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
            }
        },
        { prop: "deputyUnit", label: "单位(副)", value: "", type: "view", minWidth: 100 },
        // { prop: "ratio", label: "转换系数(开发测试参考)", value: "", type: 'view', minWidth: 220 },
        // { prop: "calculationDirection", label: "计算方向(开发测试参考)", value: "", type: 'view', minWidth: 220 },
        { prop: "routingName", label: "工艺路线名称", value: "", type: "view", minWidth: 160 },
        {
          prop: "processName", label: "工序名称", value: "", type: "custom", customComponent: "ComSelect-page", minWidth: 160, dialogTitle: "选择工序", renderTree: false, tableItems: [{ prop: "routingName", label: "工艺路线名称" }, { prop: "processName", label: "工序名称" }, { prop: "lastFlagText", label: "是否最后一道工序" }], listMethod: getProductRoutingList, listRequestObj: this.processSelectRequestObj, change: this.processChange, placeholder: "请选择工序", clearable: true, listDataFormatting: (res) => {
            if (!res.data.records.length) this.$message.warning('此产品没有工序')
            return res.data.records
          }, beforeSubmit: async (data, paramsObj) => {
            let flag = true
            if (data) {
              if (this.linesList.some(line => line.productsId === paramsObj.scope.row.productsId && line.routingLineId == data.routingLineId)) {
                this.$message.error('该产品已存在此工艺路线')
                flag = false
              } else {
                flag = await this.$confirm('切换产品工序会重置产品的货位设置，确定继续吗？', this.$t('common.tipTitle'), { type: 'warning' }).catch(err => false)
              }
            } else {
              flag = await this.$confirm('切换产品工序会重置产品的货位设置，确定继续吗？', this.$t('common.tipTitle'), { type: 'warning' }).catch(err => false)
            }
            return flag
          },
          checkSelectable: (row) => !row.lastFlag,
          listDataFormatting: (res) => res.data.records.map(line => {
            return {
              ...line,
              lastFlagText: line.lastFlag ? '是' : '否'
            }
          })
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
        this.title = btnType ? '查看入库单' : '编辑入库单'
        // 获取详情
        detailWarehouseData(id).then(res => {
          this.dataForm = res.data.stockMove
          this.linesList = res.data.lines
          this.spaceLines = res.data.spaceLines
          this.spaceLines.forEach(item => {
            item.boxList = item.boxVoList
            delete item.boxVoList
            item.barCodeIds = item.boxList.map(box => box.id)
            item.barCodeList = item.boxList.map(box => box.barCode)
            item.boxList.forEach(box => {
              box.name = box.barCode
            })
          });
          this.refeshDataFormItems()
          this.formLoading = false
        }).catch(() => { this.formLoading = false })
      } else {
        this.title = '新建入库单'
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
        // 校验失败，聚焦第一失败项，继续校验后续项
        if (submitFlag) {
          // 聚焦第一个失败的表单元素
          let formItems = form_1.$children[0].$children
          for (let j = 0; j < formItems.length; j++) {
            let formItem = formItems[j].$children[0].$children[0]
            if (formItem.validateState === 'error') {
              submitFlag = false
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
      if (!valid_2 && submitFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }

      // 判断子表是否有效
      if (!this.linesList.length && submitFlag) {
        submitFlag = false
        this.$message.error('请至少选择一个产品')
      }
      if (this.linesList.length && submitFlag) {
        this.linesList.some((item, index) => {
          let num = 0
          let tempList = this.spaceLines.filter(line => line.productsId === item.productsId && line.routingLineId == item.routingLineId)
          tempList.forEach(line => {
            num += line.num ? Number(line.num) : 0
          })
          if (item.num != num) {
            submitFlag = false
            this.$message.error(`产品信息第${index + 1}行：请先完善入库产品货位设置`)
            return true
          }
          return false
        })
      }

      // 同一条码箱是否在同一货位上
      if (submitFlag) {
        let allBoxList = this.spaceLines.map(line => [...line.boxList]).flat()
        let result = []
        for (let i = 0; i < allBoxList.length; i++) {
          let barCode = allBoxList[i].barCode;
          let shelfSpaceId = allBoxList[i].shelfSpaceId;
          let isDifferent = false; // 标记是否存在不相同的项
          for (let j = 0; j < allBoxList.length; j++) {
            if (allBoxList[j].barCode === barCode && allBoxList[j].shelfSpaceId !== shelfSpaceId) {
              isDifferent = true;
              break;
            }
          }
          if (isDifferent) {
            result.push(barCode);
          }
        }
        result = [...new Set(result)]
        if (result.length) {
          submitFlag = false
          this.$message.error(`${result.join('、')}条码箱，不允许存放在多个库位上`)
        }
      }

      // 条码箱物品是否全部配置入库完成
      if (submitFlag) {
        let allBarCode = [...new Set(this.spaceLines.map(line => [...line.boxList]).flat().map(line => line.barCode))]
        let res = allBarCode.length ? await detailByBarCodes({ barCodes: allBarCode }).catch(err => false) : { data: [] }
        if (!res) return this.btnLoading = false

        let allBoxList = this.spaceLines.map(line => [...line.boxList]).flat()
        res.data.some(item => {
          return item.barcodeLineVOs.some(o => { // 依次对比barcodeLineVOs中是否每个产品都已经配置货位
            let hasBox = allBoxList.find(o1 => o1.productsId === o.productsId && o1.routingLineId == o.routingLineId && o1.barCode === item.barCode)
            if (!hasBox) {
              this.$message.error(`条码箱产品未全部设置货位 —— 条码箱：${o.barCode} ${item.standardBoxName} - 产品名称：${o.productsName} - 数量：${o.realityTotalNum}`)
              submitFlag = false
              return true
            }
            return false
          })
        })
      }

      // 自动聚焦未使用则提交
      if (submitFlag) {
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

        // 提交确认
        if (submitModel === 'submit') {
          let flag = await this.$confirm('请确认信息是否正确，提交后不允许修改，是否提交！', '提交确认', { type: 'warning' }).catch(err => false)
          if (!flag) {
            console.log(dataObj)
            return this.btnLoading = false
          }
        }

        if (location.hostname === 'localhost' || location.href.indexOf('mode=dev') !== -1) { // 调试
          let flag = confirm('确定提交吗？')
          if (!flag) {
            console.log(dataObj)
            return this.btnLoading = false
          }
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
    addOrDelLinesItem(data, type) {
      let paramType = Array.isArray(data) ? 'Array' : 'Object'
      if (paramType === 'Object') {
        this.linesList.splice(data.$index, 1)
        this.spaceLines = this.spaceLines.filter(item => item.productsId === data.row.productsId ? item.routingLineId !== data.row.routingLineId : true)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        // 新数据替代旧数据
        if (type === 'cover') {
          data = data[0]
          tempList = data.lines
          this.spaceLines = data.spaceLines.map(spaceLine => {
            spaceLine.boxList = spaceLine.boxVoList.map(box => ({
              ...box,
              name: box.barCode
            }))
            delete spaceLine.boxVoList
            return spaceLine
          })
          this.dataForm['warehouseId'] = data.stockMove.warehouseId
          this.$set(this.dataForm, 'warehouseName', data.stockMove.warehouseName)
          this.wareChange(null, [{}])
        }
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
      // template2.forEach(line => { line.routingLineId = this.linesList[paramsObj.scope.$index].routingLineId })
      // tempList.push(...template2)
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
    onChangeLoading(val) {
      this.loadingText = val ? '正在导入数据' : ''
      this.formLoading = val
    }
  },
  computed: {
    openMode() {
      this.$nextTick(() => { this.refeshLinesListItems() });
      return this.title === '新建入库单' ? '新建' : this.title === '编辑入库单' ? '编辑' : '只读'
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