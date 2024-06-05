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
import { addTransferData, updateTransferData, detailTransferData, TransferBarCode } from '@/api/warehouseManagement/transferManagement'

import TableFormProduct from './TableForm-product' // 产品表格表单组件
import { getWarehouseList, getStockGoodsShelves, getStockGoodsShelvesList } from '@/api/basicData/index' // 库位分类和列表

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
      shelfSpaceRequestObj: { locationType: "goods_allocation", warehouseId: "" },
      barCodeRequestObj: { removeShelfSpaceId: '', isTarget: true, productsId: '', routingLineId: '', barcode: '' },
      dataFormItems: [
        { prop: "transferOutWarehouseName", label: "移库仓库", value: "", type: "custom", customComponent: "ComSelect-list", method: getWarehouseList, change: this.wareChange, requestObj: { chooseUserFlag: true, type: 'normal' }, itemRules: [{ required: true, trigger: "no" }] },
        { prop: "remark", label: "备注", value: "", type: 'textarea' }
      ],

      linesList: [],
      linesListItems: [],
    }
  },
  watch: {
    "dataForm.transferOutWarehouseId": {
      handler: function (newVal, oldVal) {
        this.shelfSpaceRequestObj.warehouseId = newVal
        if (oldVal) this.linesList = []
      },
    }
  },
  methods: {
    setLinesListItems() {
      this.linesListItems = [
        { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 120, fixed: "" },
        { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 120, fixed: "" },
        { prop: "productSpec", label: "规格型号", value: "", type: 'view', minWidth: 120, fixed: "" },
        { prop: "batchNumber", label: "原批次号", value: "", type: "view", minWidth: 180 },
        { prop: "availableQuantity", label: "原批次数量", value: "", type: "view", minWidth: 120, render: this.openMode !== '只读' },
        { prop: "removeGoodsShelvesName", label: "原货架", value: "", type: "view", minWidth: 180 },
        { prop: "removeShelfSpaceName", label: "原库位", value: "", type: "view", minWidth: 180 },
        {
          prop: "removeBarCode", label: "原箱条码", value: "", type: "custom", customComponent: "ComSelect-page", minWidth: 220, itemRules: [{ required: true, trigger: "change" }],
          dialogTitle: "选择条码",
          renderTree: false,
          listMethod: TransferBarCode,

          listRequestObj: (rowIndex) => {
            let removeShelfSpaceId = this.linesList[rowIndex].removeShelfSpaceId
            let isTarget = false
            let productsId = this.linesList[rowIndex].productsId
            let routingLineId = ''
            let barcode = ''
            return { removeShelfSpaceId, isTarget, productsId, routingLineId, barcode }
          },
          tableItems: [
            { prop: 'barCode', label: '条码', minWidth: 200 },
            { prop: 'realityTotalNum', label: '实际数量', minWidth: 120 },
          ],
          searchList: [
            { prop: 'barcode', label: '条码', type: 'input', },
          ],
          change: (val, data, paramsObj) => {
            let index = paramsObj.scope.$index
            let targetIndex = this.linesList.findIndex(line => line.removeBarCode === data[0].all.barCode)
            if (targetIndex !== -1 && index !== targetIndex) return this.$message.error(`这个条码已经用在产品信息第${targetIndex + 1}行`)
            this.$nextTick(() => { this.$refs.dataForm.$children[0].validateField("removeBarCode") })
            if (!data || !data.length) {
              this.linesList[index].removeBarCode = ""
              this.linesList[index].realityTotalNum = ""
            } else {
              this.linesList[index].removeBarCode = data[0].all.barCode
              this.linesList[index].realityTotalNum = data[0].all.realityTotalNum
              if (this.linesList[index].targetBarCode == '整箱移') {
                this.linesList[index].num = this.linesList[index].realityTotalNum
              }
            }
          }
        },
        { prop: "realityTotalNum", label: "原箱数量", value: "", type: "view", minWidth: 120, render: this.openMode !== '只读' },
        {
          prop: "num", label: "数量(主)", value: "", type: "input", itemDisabled: (rowIndex) => this.linesList[rowIndex].targetBarCode === '整箱移' || this.openMode === '只读',
          itemRules: [
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(主)：${errMsg}`) }), trigger: 'blur' },
            { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => Number(this.linesList[rowIndex].num) <= Number(this.linesList[rowIndex].availableQuantity), "不能超过对应原批次数量", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => Number(this.linesList[rowIndex].num) <= Number(this.linesList[rowIndex].realityTotalNum), "不能超过对应原箱数量", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' }
          ], minWidth: 180, input: (val, scope) => {
            if (scope.row.calculationDirection === 'multiplication') {
              scope.row.deputyNum = this.jnpf.numberFormat(val * scope.row.ratio, 4)
            }
            else {
              scope.row.deputyNum = this.jnpf.numberFormat(val / scope.row.ratio, 4)
            }
          }
        },
        { prop: "mainUnit", label: "单位(主)", value: "", type: "view", minWidth: 100 },
        { prop: "targetGoodsShelvesName", label: "目标货架", value: "", type: "view", minWidth: 180 },
        {
          prop: "targetShelfSpaceName", label: "目标库位", value: "", type: "custom", customComponent: "ComSelect-page", minWidth: 300, itemRules: [{ required: true, trigger: "change" }],
          dialogTitle: "选择库位",
          treeTitle: '仓库',
          methodArr: { method: getWarehouseList, requestObj: {} },
          treeNodeClick: (data, node, listQuery) => {
            if (listQuery.warehouseId === data.id) return listQuery
            listQuery.warehouseId = data.id
            return listQuery
          },
          renderTree: false,
          listMethod: getStockGoodsShelvesList,
          listRequestObj: this.shelfSpaceRequestObj,
          tableItems: [
            { prop: 'code', label: '货位编码', minWidth: 120 },
            { prop: 'warehouseName', label: '仓库名称', minWidth: 120 },
            { prop: 'parentName', label: '货架名称', minWidth: 120 },
            { prop: 'name', label: '货位名称', minWidth: 120 },
            { prop: 'remark', label: '备注' }
          ],
          searchList: [
            { prop: "code", label: "货位编码", type: 'input', },
            { prop: "name", label: "货位名称", type: 'input', },
          ],
          change: (val, data, paramsObj) => {
            this.$nextTick(() => { this.$refs.dataForm.$children[0].validateField("targetShelfSpaceName") })
            let index = paramsObj.scope.$index
            if (!data || !data.length) {
              this.linesList[index].targetShelfSpaceId = ""
              this.linesList[index].targetShelfSpaceName = ""
              this.linesList[index].targetGoodsShelvesId = ""
              this.linesList[index].targetGoodsShelvesName = ""
            } else {
              this.linesList[index].targetShelfSpaceId = data[0].id
              this.linesList[index].targetShelfSpaceName = data[0].name
              this.linesList[index].targetGoodsShelvesId = data[0].all.parentId
              this.linesList[index].targetGoodsShelvesName = data[0].all.parentName
            }
          }
        },
        {
          prop: "targetBarCode", label: "目标箱条码", value: "", type: "custom", customComponent: "ComSelect-page", minWidth: 220, itemRules: [{ required: true, trigger: "change" }], itemDisabled: (rowIndex) => !this.linesList[rowIndex].targetShelfSpaceId || this.openMode === '只读',
          dialogTitle: "选择条码",
          renderTree: false,
          listMethod: TransferBarCode,
          listRequestObj: (rowIndex) => {
            this.barCodeRequestObj.removeShelfSpaceId = this.linesList[rowIndex].targetShelfSpaceId
            this.barCodeRequestObj.isTarget = true
            this.barCodeRequestObj.productsId = ''
            this.barCodeRequestObj.routingLineId = ''
            this.barCodeRequestObj.barcode = ''
            return this.barCodeRequestObj
          },
          listDataFormatting: (res) => {
            let data = { barCode: '整箱移', realityTotalNum: '' }
            let treeData = res.data
            treeData.unshift(data)
            return treeData
          },
          tableItems: [
            { prop: 'barCode', label: '条码', minWidth: 200 },
            { prop: 'realityTotalNum', label: '实际数量', minWidth: 120 },
          ],
          searchList: [
            { prop: 'barcode', label: '条码', type: 'input', },
          ],
          change: (val, data, paramsObj) => {
            this.$nextTick(() => { this.$refs.dataForm.$children[0].validateField("targetBarCode") })
            let index = paramsObj.scope.$index
            if (!data || !data.length) {
              this.linesList[index].targetBarCode = ""
              this.linesList[index].targetRealityTotalNum = ""
            } else {
              this.linesList[index].targetBarCode = data[0].all.barCode
              this.linesList[index].targetRealityTotalNum = data[0].all.realityTotalNum ? data[0].all.realityTotalNum : 0
              if (this.linesList[index].realityTotalNum) {
                this.linesList[index].num = this.linesList[index].realityTotalNum
              }
            }
          }
        },
        { prop: "targetRealityTotalNum", label: "目标箱数量", value: "", type: "view", minWidth: 120, render: this.openMode !== '只读' },
      ]
    },
    remoteMethod(query) {
      TransferBarCode({
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
    wareChange(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField('transferOutWarehouseName') })
      if (!val && data.length) return
      if (!data || !data.length) {
        this.dataForm['transferInWarehouseId'] = ""
        this.dataForm['transferOutWarehouseId'] = ""
        this.dataForm['transferOutWarehouseName'] = ""
      } else {
        this.dataForm['transferInWarehouseId'] = data[0].id
        this.dataForm['transferOutWarehouseId'] = data[0].id
        this.dataForm['transferOutWarehouseName'] = data[0].name
        this.transferOutWarehouseId = data[0].id
      }
    },
    init(id, btnType) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      if (id) {
        this.dataForm.id = id
        this.title = btnType ? '查看货位移库单' : '编辑货位移库单'
        detailTransferData(id).then(res => {
          this.dataForm = res.data.picking
          this.linesList = res.data.lines
          this.linesList.forEach((item, index) => {
            this.$set(this.linesList[index], 'targetRealityTotalNum', item.num)
          })
          this.formLoading = false
        })
      } else {
        this.title = '新建货位移库单'
        this.formLoading = false
      }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true

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

      // 库位相同，原箱条码不能与目标箱条码相同
      if (submitFlag) {
        let flag = this.linesList.some((line, index) => {
          if (line.removeShelfSpaceId === line.targetShelfSpaceId && ((line.removeBarCode === line.targetBarCode) || line.targetBarCode === '整箱移')) {
            this.$message.error(`产品信息第${index + 1}行：库位相同，原箱条码不能与目标箱条码相同`)
            submitFlag = false
            return true
          }
        })
      }

      // 自动聚焦未使用则提交
      if (submitFlag) {
        this.dataForm.documentStatus = submitModel
        this.dataForm.transferType = "relocation" // 移库
        this.dataForm.receiveStatus = "not_received" // 待接收

        const formMethod = this.dataForm.id ? updateTransferData : addTransferData
        let barCodeFlag = true
        let lines = JSON.parse(JSON.stringify(this.linesList))
        lines.forEach((item, index) => {
          if (item.targetBarCode === '整箱移') {
            item.targetBarCode = item.removeBarCode
          }
        })
        let dataObj = {
          picking: this.dataForm,
          lines: lines
        }
        if (barCodeFlag) {
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
        }
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
          item.removeGoodsShelvesId = item.goodsShelvesId
          item.removeShelfSpaceId = item.shelfSpaceId
          item.removeGoodsShelvesName = item.goodsShelvesName
          item.removeShelfSpaceName = item.shelfSpaceName
          item.pickingId = this.dataForm.id
          item.id = ""
          // 找出this.linesList中与item 产品id、货位id、批次号 完全相同的项
          const hasFlag = this.linesList.some(i => {
            let flag = false
            if (i.productsId === item.productsId && i.removeShelfSpaceId === item.shelfSpaceId && i.batchNumber === item.batchNumber) { flag = true }
            return flag
          })
          if (hasFlag) { hasItemList.push(`${item.productName} - ${item.goodsShelvesName} - ${item.batchNumber}`) }
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
  },
  computed: {
    openMode() {
      this.$nextTick(() => { this.setLinesListItems() });
      return this.title === '新建货位移库单' ? '新建' : this.title === '编辑货位移库单' ? '编辑' : '只读'
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