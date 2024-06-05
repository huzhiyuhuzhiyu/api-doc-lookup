<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="title" />
        <div class="options" v-if="!btnType">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            {{ $t('common.submitButton') }}
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main">
              <div class="subtitle">
                <h5>基本信息</h5>
              </div>
              <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode" />
              <div class="subtitle">
                <h5>产品信息</h5>
              </div>
              <TableForm-product :value="linesList" @input="linesChange" ref="linesForm" :tableItems="linesListItems"
                :openMode="openMode" @addth="addOrDelLinesItem" @deleteth="addOrDelLinesItem" @openSide="openSide"
                :warehouseId="dataForm.warehouseId" customStyle />
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
import { detailWarehouseData, getProductRoutingList, cardInbound } from "@/api/warehouseManagement/inboundAndOutbound" // 出入库单详情、工艺路线明细列表、卡片入库
import { getQuotationsendlist } from "@/api/salesManagement/index"; // 销售、外协退发货通知单详情
import { getpurPurchaseReceiptReturnGoodsdetail, detailpurPurchaseReceiptReturnGoods } from '@/api/purchasingManagement/purchaseInquirySheet' // 采购通知单详情
import { detailTransferData } from '@/api/warehouseManagement/transferManagement' // 调拨单详情
import { detailWithdrawal } from '@/api/productOrdes/index' // 生产领退料详情
import { getWarehouseList, getProductionLotList } from '@/api/basicData/index' // 仓库、批次号列表
import { detailQcUnqualifiedData } from '@/api/inspectionManagement/index' // 产品检验项目列表
import { detailByBarCodes } from '@/api/warehouseManagement/packingList'
import { prodOrderInfo } from '@/api/productOrdes/finishedProductOrders'
import { detailWorkData } from "@/api/productOrdes/index"
import { getQcUnqualifiedLinesList } from '@/api/inspectionManagement/index' // 获取报废入库明细
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
      documentStatus: "",
      dataForm: {},
      dataFormItems: [/* 通过 this.refeshDataFormItems() 动态更改 */],
      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      spaceLines: [],
      productionLotList: [],
      sourceType: "", // 来源类型
    }
  },
  provide() {
    return {
      thisForm: this
    }
  },
  created() {
  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },
  methods: {
    refeshDataFormItems() {
      let sm = this.sourceType === "inbound_transfer" ? 8 : 12
      let partnerName = this.sourceType === "inbound_purchase" || this.sourceType === "inbound_external" ? '供应商名称' : '客户名称'
      let warehouseRequestObj = { chooseUserFlag: true, type: this.sourceType.indexOf('scrap') > -1 ? 'scrap' : 'normal' }
      this.dataFormItems = [
        { prop: "sourceType", label: "来源类型", value: "io_other", type: "select", options: this.originTypeList, itemRules: [{ required: true, trigger: "blur" }], itemDisabled: true, sm },
        {
          prop: "sourceNo", label: "来源单号", value: "", type: "input", itemDisabled: true, sm,
          render: this.sourceType.indexOf('_batch') === -1
        },
        {
          prop: "partnerName", label: partnerName, value: "", type: "select", itemDisabled: true,
          render: !(['inbound_transfer', 'inbound_production', 'inbound_scrap', 'inbound_production_batch', 'inbound_scrap_batch'].includes(this.sourceType)), sm
        },
        {
          prop: "warehouseName", label: "入库仓库", value: "", type: "custom", customComponent: "ComSelect-list", method: getWarehouseList, change: this.wareChange, requestObj: warehouseRequestObj,
          itemRules: [{ required: true, trigger: "no" }], itemDisabled: this.sourceType === "inbound_transfer" || this.openMode === '只读', dialogTitle: '选择仓库', sm,
          render: this.openMode !== '只读' ? true : this.sourceType !== 'inbound_production'
        },
        { prop: "remark", label: "备注", value: "", type: "textarea" }
      ]
    },
    refeshLinesListItems() {
      this.linesListItems = [
        { prop: "productCode", label: "产品编码", type: 'view', minWidth: 140 },
        { prop: "productName", label: "产品名称", type: 'view', minWidth: 140 },
        { prop: "drawingNo", label: "产品图号", type: 'view', minWidth: 300 },
        { prop: "sourceNo", label: "来源单号", type: 'view', minWidth: 200, render: this.sourceType.indexOf('_batch') > -1 },
        {
          prop: "num", label: "数量(主)", value: "", type: "input",
          itemRules: [
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(主)：${errMsg}`) }), trigger: 'blur' },
            { validator: this.calcValidate(this.linesList, 'num', 'deliveryQuantity', '<=', "不能超过对应待入库数量", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }), trigger: 'blur' },
          ], minWidth: 180, itemDisabled: this.sourceType === 'inbound_transfer' || this.openMode === '只读',
          input: (val, scope) => {
            if (scope.row.calculationDirection === 'multiplication') { scope.row.deputyNum = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
            else { scope.row.deputyNum = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
          }
        },
        { prop: "deliveryQuantity", label: "待入库数量(主)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' },
        { prop: "mainUnit", label: "单位(主)", value: "", type: "view", minWidth: 100 },
        {
          prop: "deputyNum", label: "数量(副)", value: "", type: "input",
          itemRules: [
            { required: true, trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`数量(主)：${errMsg}`) }), trigger: 'blur' },
            { validator: this.calcValidate(this.linesList, 'deputyNum', 'deputyDeliveryQuantity', '<=', "不能超过对应待入库数量", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }), trigger: 'blur' },
          ], minWidth: 180, itemDisabled: this.sourceType === 'inbound_transfer' || this.openMode === '只读',
          input: (val, scope) => {
            if (scope.row.calculationDirection === 'division') { scope.row.num = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
            else { scope.row.num = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
          }
        },
        { prop: "deputyDeliveryQuantity", label: "待入库数量(副)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' },
        { prop: "deputyUnit", label: "单位(副)", value: "", type: "view", minWidth: 100 },
        {
          prop: "routingName", label: "工艺路线名称", value: "", type: "view", minWidth: 160,
          render: ['inbound_external_return', 'inbound_external', 'inbound_return_materials', 'inbound_scrap', 'inbound_production', 'inbound_order_production_batch', 'inbound_production_batch'].includes(this.sourceType)
        },
        {
          prop: "processName", label: "工序名称", value: "", type: "view", minWidth: 160,
          render: ['inbound_external_return', 'inbound_external', 'inbound_return_materials', 'inbound_scrap', 'inbound_production', 'inbound_order_production_batch', 'inbound_production_batch'].includes(this.sourceType)
        },
        {
          prop: "workOrderQuantity", label: "订单生产数量", value: "", type: "view", minWidth: 160,
          render: ['inbound_production'].includes(this.sourceType) && this.openMode === '只读'
        },
        {
          prop: "completedQuantity", label: "完成数量", value: "", type: "view", minWidth: 160,
          render: ['inbound_production'].includes(this.sourceType) && this.openMode === '只读'
        },
        {
          prop: "receivedQuantity", label: "已入库数量", value: "", type: "view", minWidth: 160,
          render: ['inbound_production'].includes(this.sourceType) && this.openMode === '只读'
        },
        {
          prop: "planStartDate", label: "计划开始时间", value: "", type: "view", minWidth: 160,
          render: ['inbound_production'].includes(this.sourceType) && this.openMode === '只读'
        },
        {
          prop: "planEndDate", label: "计划结束时间", value: "", type: "view", minWidth: 160,
          render: ['inbound_production'].includes(this.sourceType) && this.openMode === '只读'
        },
        {
          prop: "actualStartDate", label: "实际开始时间", value: "", type: "view", minWidth: 160,
          render: ['inbound_production'].includes(this.sourceType) && this.openMode === '只读'
        },
        {
          prop: "actualEndDate", label: "实际结束时间", value: "", type: "view", minWidth: 160,
          render: ['inbound_production'].includes(this.sourceType) && this.openMode === '只读'
        },
        {
          prop: "createTime", label: "创建时间", value: "", type: "view", minWidth: 180,
          render: ['inbound_production'].includes(this.sourceType) && this.openMode === '只读'
        },
        {
          prop: "createByName", label: "创建人", value: "", type: "view", minWidth: 160,
          render: ['inbound_production'].includes(this.sourceType) && this.openMode === '只读'
        },
        { prop: "originalBatchNumber", label: "产品原批号", value: "", type: "input", maxlength: 50, minWidth: 220 },
        { prop: "batchNumber", label: "批次号", value: "", type: "select", options: this.productionLotList, filterable: true, remote: true, remoteMethod: this.remoteMethod, maxlength: 50, minWidth: 220, blur: this.elementBlur },
        { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200, minWidth: 200 },
      ]
      // this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
    },
    async init(id, btnType = false, sourceType, inboundId) {
      console.log(id, btnType, sourceType, inboundId);
      let option = this.originTypeList.find(item => item.value === sourceType.replace('_batch', ''))
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.sourceType = sourceType
      this.refeshDataFormItems()
      if (id) {
        this.title = btnType ? '查看' : '新建'
        this.title += option.label + '单'
        if (inboundId) {
          detailWarehouseData(inboundId).then(res => {
            this.dataForm = res.data.stockMove
            this.linesList = res.data.lines
            this.spaceLines = res.data.spaceLines
            // this.spaceLines.forEach(item => {
            //   item.boxList = item.boxVoList
            //   delete item.boxVoList
            //   item.barCodeIds = item.boxList.map(box => box.id)
            //   item.barCodeList = item.boxList.map(box => box.barCode)
            //   item.boxList.forEach(box => {
            //     box.name = box.barCode
            //   })
            // });
            this.refeshDataFormItems()
            this.formLoading = false
          }).catch(() => { this.formLoading = false })
        } else if (sourceType === "inbound_transfer") {
          detailTransferData(id).then(res => {
            this.dataForm = {
              ...res.data.picking,
              sourceType,
              warehouseId: res.data.picking.transferInWarehouseId,
              warehouseCode: res.data.picking.transferInWarehouseCode,
              warehouseName: res.data.picking.transferInWarehouseName,
              sourceNo: res.data.picking.orderNo
            }
            let tempLinesList = res.data.lines
            tempLinesList.forEach(line => {
              line.routingName = ""
              line.routingLineId = ""
              line.processName = ""
              line.drawingNo = line.productDrawingNo
              line.deliveryQuantity = line.num
              if (line.calculationDirection === 'multiplication') {
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
              } else {
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
              }
            })
            tempLinesList = tempLinesList.filter(line => line.num != '0')
            this.linesList = JSON.parse(JSON.stringify(tempLinesList))
            this.formLoading = false
          }).catch(() => { this.formLoading = false })
        } else if (sourceType === "inbound_sale_return" || sourceType === "inbound_external_return") { // 销售退货、外协退料
          getQuotationsendlist(id).then(res => {
            this.dataForm = { ...res.data.notice, sourceType, sourceNo: res.data.notice.orderNo, cooperativePartnerId: res.data.notice.cooperativePartnerId }
            let tempLinesList = res.data.noticeLineList.map(line => {
              return {
                ...line,
                deliveryQuantity: this.jnpf.math('subtract', [line.deliveryQuantity, line.outboundQuantity]) // 入库数量 = 退发货数量 - 已入库数量(这里已入库数量包括报废数量)
              }
            })
            // 使用 reduce() 方法进行合并和求和操作
            tempLinesList = tempLinesList.reduce((result, obj) => {
              let existingObj = result.find(item => item.productCode === obj.productCode && item.routingLineId === obj.routingLineId);
              if (existingObj) {
                existingObj.deliveryQuantity = this.jnpf.math('add', [existingObj.deliveryQuantity, obj.deliveryQuantity]);
                existingObj.qualifiedQuantity = this.jnpf.math('add', [existingObj.qualifiedQuantity, obj.qualifiedQuantity]);
                existingObj.outboundQuantity = this.jnpf.math('add', [existingObj.outboundQuantity, obj.outboundQuantity]);
                existingObj.ordersLineId = '';
                existingObj.id = '';
              } else {
                result.push({ ...obj, ordersLineId: obj.id });
              }
              return result;
            }, []);
            tempLinesList.forEach(line => {
              line.originalBatchNumber = ""
              line.batchNumber = ""
              line.productsId = line.productId
              line.num = line.deliveryQuantity
              line.drawingNo = line.productDrawingNo
              line.ordersLineId = line.id
              line.id = ""
              if (line.calculationDirection === 'multiplication') {
                line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
              } else {
                line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
              }
            })
            tempLinesList = tempLinesList.filter(line => line.num != '0')
            this.linesList = JSON.parse(JSON.stringify(tempLinesList))
            this.formLoading = false
          })
        } else if (sourceType === "inbound_purchase" || sourceType === "inbound_external") { // 采购收货、外协收货
          getpurPurchaseReceiptReturnGoodsdetail(id).then(res => {
            this.dataForm = {
              ...res.data,
              sourceType,
              sourceNo: res.data.orderNo,
              cooperativePartnerId: res.data.partnerId,
              notificationType: res.data.notificationType === 'external_process' ? 'external' : res.data.notificationType
            }
            detailpurPurchaseReceiptReturnGoods(id).then(res_2 => {
              let tempLinesList = res_2.data.filter(line => line.receivingStatus !== 'stopped') // 先过滤停止的明细
              tempLinesList = tempLinesList.reduce((result, obj) => {
                let existingObj = result.find(item => item.productsId === obj.productsId && item.routingLineId === obj.routingLineId);
                if (existingObj) {
                  existingObj.qualifiedQuantity = this.jnpf.math('add', [existingObj.qualifiedQuantity, obj.qualifiedQuantity]);
                  existingObj.receiptQuantity = this.jnpf.math('add', [existingObj.receiptQuantity, obj.receiptQuantity]);
                  existingObj.ordersLineId = '';
                  existingObj.id = '';
                } else {
                  result.push({ ...obj, ordersLineId: obj.id });
                }
                return result;
              }, []);
              tempLinesList.forEach(line => {
                // 如果是最后一道工序或者是返工成品，入库成品
                line.routingName = line.lastFlag && (line.reworkType === 'product' || !line.reworkType) ? '' : line.routingIdName || ""
                line.processName = line.lastFlag && (line.reworkType === 'product' || !line.reworkType) ? '' : line.processIdName || ""
                line.routingLineId = line.lastFlag && (line.reworkType === 'product' || !line.reworkType) ? '' : line.routingLineId || ""
                line.originalBatchNumber = ""
                line.batchNumber = ""
                line.deliveryQuantity = this.jnpf.math('subtract', [line.qualifiedQuantity, line.receiptQuantity]); // 入库数量 = 检验合格数量 - 已入库数量
                line.num = line.deliveryQuantity
                line.drawingNo = line.productDrawingNo
                if (line.calculationDirection === 'multiplication') {
                  line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                  line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
                } else {
                  line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                  line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
                }
              })
              tempLinesList = tempLinesList.filter(line => line.num != '0')
              this.linesList = tempLinesList
              this.formLoading = false
            })
          })
        } else if (sourceType === 'inbound_production' || sourceType === 'inbound_order_production') { // 生产工单、生产订单
          const tempFunction = (rowData) => {
            this.dataForm = { sourceType, sourceNo: rowData.orderNo, orderNo: rowData.orderNo, partnerName: rowData.partnerName }
            let deliveryQuantity
            // deliveryQuantity = this.jnpf.math('subtract', [rowData.qualifiedQuantity, rowData.receivedQuantity])
            if (sourceType === 'inbound_order_production') {
              // 入库数量 = 合格数量 - 已入库数量
              deliveryQuantity = this.jnpf.math('subtract', [rowData.qualifiedQuantity, rowData.receivedQuantity])
            } else {
              // 入库数量 = 生产完工数量 - 已入库数量
              deliveryQuantity = this.jnpf.math('subtract', [rowData.completedQuantity, rowData.receivedQuantity]) // 生产工单没有检验合格数量
            }
            let tempLinesList = [{
              ...rowData,
              ordersLineId: rowData.id,
              productsId: rowData.productsId || rowData.productId,
              productCode: rowData.productCode,
              productsName: rowData.productsName || rowData.productName,
              drawingNo: rowData.productDrawingNo,
              productDrawingNo: rowData.productDrawingNo,
              mainUnit: rowData.mainUnit,
              deliveryQuantity,
              calculationDirection: rowData.calculationDirection,
              ratio: rowData.ratio,
              deputyUnit: rowData.deputyUnit,
              deputyDeliveryQuantity: '',
              routingName: rowData.routingName,
              processName: rowData.processName,
              routingLineId: rowData.lastFlag ? '' : rowData.routingLineId
            }]
            console.log(tempLinesList, 'tempLinesList');
            tempLinesList.forEach(line => {
              line.num = line.deliveryQuantity
              if (line.calculationDirection === 'multiplication') {
                line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
              } else {
                line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
              }
            })
            this.linesList = tempLinesList
            this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
            this.formLoading = false
          }
          if (typeof id === 'object') {
            this.$nextTick(() => { tempFunction(id) })
          } else {
            if (id.indexOf("order") === 0) {
              id = id.replace('order', '')
              prodOrderInfo({ id, dispatch: 0 }).then(res => {
                tempFunction(res.data.prodOrder)
              })
            } else {
              id = id.replace('work', '')
              detailWorkData(id).then(res => {
                tempFunction(res.data)
              })
            }
          }
        } else if (sourceType === 'inbound_return_materials') { // 生产退料
          detailWithdrawal(id).then(res => {
            this.dataForm = { ...res.data.collect, sourceType, sourceNo: res.data.collect.orderNo, cooperativePartnerId: res.data.collect.partnerId, partnerName: res.data.collect.personName }
            let tempLinesList = res.data.collectLineList.map(line => {
              return { ...line, num: line.inspectionResults !== 'partially_discard' ? line.num : line.qualifiedQuantity }
            })
            tempLinesList = tempLinesList.reduce((result, obj) => {
              let existingObj = result.find(item => item.productCode === obj.productCode && item.routingLineId === obj.routingLineId);
              if (existingObj) {
                existingObj.num = this.jnpf.math('add', [existingObj.num, obj.num]); // 领退料数量
                existingObj.qualifiedQuantity = this.jnpf.math('add', [existingObj.qualifiedQuantity, obj.qualifiedQuantity]); // 检验合格数量
                existingObj.outboundQuantity = this.jnpf.math('add', [existingObj.outboundQuantity, obj.outboundQuantity]);
                existingObj.ordersLineId = '';
                existingObj.id = '';
              } else {
                result.push({ ...obj, ordersLineId: obj.id });
              }
              return result;
            }, []);
            tempLinesList.forEach(line => {
              line.routingName = line.routingName
              line.routingLineId = line.routingLineId
              line.processName = line.processName
              line.originalBatchNumber = ""
              line.batchNumber = ""
              line.productsId = line.productId
              line.num = this.jnpf.math('subtract', [line.num, line.outboundQuantity]); // 入库数量 = 总数量 - 已入库数量
              line.deliveryQuantity = line.num
              line.drawingNo = line.productDrawingNo
              if (line.calculationDirection === 'multiplication') {
                line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
              } else {
                line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
              }
            })
            tempLinesList = tempLinesList.filter(line => line.num != '0')
            this.linesList = JSON.parse(JSON.stringify(tempLinesList))
            this.formLoading = false
          })
        } else if (sourceType === 'inbound_scrap') {
          detailQcUnqualifiedData(id).then(res => {
            this.dataForm = { ...res.data.unqualified, sourceType, sourceNo: res.data.unqualified.orderNo, remark: '', approvalStatus: '' }
            let tempLinesList = res.data.lines
            tempLinesList.forEach(line => {
              line.originalBatchNumber = ""
              line.batchNumber = ""
              line.deliveryQuantity = this.jnpf.math('subtract', [line.scrapQuantity, line.scrapReceiptQuantity]); // 入库数量 = 报废数量 - 报废已入库数量
              line.num = line.deliveryQuantity
              line.drawingNo = line.productDrawingNo
              line.ordersLineId = line.id
              line.id = ""
              if (line.calculationDirection === 'multiplication') {
                line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
              } else {
                line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
              }
            })
            tempLinesList = tempLinesList.filter(line => line.num != '0')
            this.linesList = tempLinesList
            this.$nextTick(() => { this.refeshLinesListItems() })
            this.formLoading = false
          })
        } else if (sourceType === 'inbound_production_batch' || sourceType === 'inbound_order_production_batch') {
          const data = id
          this.$nextTick(() => {
            this.dataForm = { sourceType: sourceType.replace('_batch', ''), partnerName: data[0].partnerName }
            let tempLinesList = data.map(rowData => {
              let deliveryQuantity
              // deliveryQuantity = this.jnpf.math('subtract', [rowData.qualifiedQuantity, rowData.receivedQuantity])
              if (sourceType === 'inbound_order_production_batch') {
                // 入库数量 = 合格数量 - 已入库数量
                deliveryQuantity = this.jnpf.math('subtract', [rowData.qualifiedQuantity, rowData.receivedQuantity])
              } else {
                // 入库数量 = 生产完工数量 - 已入库数量
                deliveryQuantity = this.jnpf.math('subtract', [rowData.completedQuantity, rowData.receivedQuantity]) // 生产工单没有检验合格数量
              }
              return {
                ordersLineId: rowData.id,
                productsId: rowData.productId || rowData.productsId,
                productCode: rowData.productCode,
                productName: rowData.productName,
                drawingNo: rowData.productDrawingNo,
                productDrawingNo: rowData.productDrawingNo,
                mainUnit: rowData.mainUnit,
                deliveryQuantity,
                calculationDirection: rowData.calculationDirection,
                ratio: rowData.ratio,
                deputyUnit: rowData.deputyUnit,
                deputyDeliveryQuantity: '',
                routingName: rowData.routingName,
                processName: rowData.processName,
                routingLineId: rowData.lastFlag ? '' : rowData.routingLineId,
                sourceNo: rowData.orderNo,
              }
            })
            tempLinesList.forEach(line => {
              line.num = line.deliveryQuantity
              if (line.calculationDirection === 'multiplication') {
                line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
              } else {
                line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
              }
            })
            tempLinesList = tempLinesList.filter(line => line.num != '0')
            this.linesList = tempLinesList
            this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
            this.formLoading = false
          })
        } else if (sourceType === 'inbound_scrap_batch') { // 批量报废入库
          // orderNoList
          let data = id
          console.log(data);
          // 如果没有产品id，代表从主表进入
          if (!data[0].productsId) {
            const query = { orderNoList: data.map(row => row.orderNo) }
            const res = await getQcUnqualifiedLinesList(query).catch(err => false) // 根据主表单号批量获取明细
            data = res.data.records
          }
          this.$nextTick(() => {
            this.dataForm = { sourceType: 'inbound_scrap' }
            let tempLinesList = data.map(rowData => {
              return {
                ordersLineId: rowData.id,
                productsId: rowData.productsId,
                productCode: rowData.productCode,
                productName: rowData.productName,
                drawingNo: rowData.productDrawingNo,
                productDrawingNo: rowData.productDrawingNo,
                mainUnit: rowData.mainUnit,
                deliveryQuantity: this.jnpf.math('subtract', [rowData.scrapQuantity, rowData.scrapReceiptQuantity]), // 入库数量 = 报废数量 - 报废已入库数量
                calculationDirection: rowData.calculationDirection,
                ratio: rowData.ratio,
                deputyUnit: rowData.deputyUnit,
                deputyDeliveryQuantity: '',
                routingName: rowData.routingName,
                processName: rowData.processName,
                routingLineId: rowData.lastFlag ? '' : rowData.routingLineId,
                sourceNo: rowData.orderNo,
              }
            })
            tempLinesList.forEach(line => {
              line.num = line.deliveryQuantity
              if (line.calculationDirection === 'multiplication') {
                line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
              } else {
                line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
              }
            })
            tempLinesList = tempLinesList.filter(line => line.num != '0')
            this.linesList = tempLinesList
            this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
            this.formLoading = false
          })
        }
      } else {
        this.title = '新建入库单'
        this.formLoading = false
      }
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
      if (!data || !data.length) {
        this.linesList[paramsObj.scope.$index].routingName = ""
        this.linesList[paramsObj.scope.$index].routingLineId = ""
        this.linesList[paramsObj.scope.$index].processName = ""
      } else {
        this.linesList[paramsObj.scope.$index].routingName = data[0].all.routingName
        this.linesList[paramsObj.scope.$index].routingLineId = data[0].all.routingLineId
        this.linesList[paramsObj.scope.$index].processName = data[0].all.processName
      }
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
    processSelectRequestObj(rowIndex) {
      let productsId = this.linesList[rowIndex].productsId
      return { productsId }
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用

      // 校验表单
      let form_1 = this.$refs['dataForm'].$children[0]
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.$children[0].$children)
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['linesForm'].$children[0]
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      // 判断子表是否有效
      if (!this.linesList.length && submitFlag) {
        submitFlag = false
        this.$message.error('请至少选择一个产品')
      }
      if (submitFlag) {
        this.linesList.some((item, index) => {
          let num = 0
          let tempList
          if (this.sourceType.indexOf('_batch') === -1) {
            tempList = this.spaceLines.filter(line => line.productsId === item.productsId && line.routingLineId == item.routingLineId)
          } else {
            tempList = this.spaceLines.filter(line => line.productsId === item.productsId && line.routingLineId == item.routingLineId &&
              line.sourceNo == item.sourceNo)
          }
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
      // if (submitFlag) {
      //   let allBoxList = this.spaceLines.map(line => [...line.boxList])
      //   console.log(JSON.parse(JSON.stringify(allBoxList)));
      //   allBoxList = allBoxList.flat()
      //   let result = []
      //   for (let i = 0; i < allBoxList.length; i++) {
      //     let barCode = allBoxList[i].barCode;
      //     let shelfSpaceId = allBoxList[i].shelfSpaceId;
      //     let isDifferent = false; // 标记是否存在不相同的项
      //     for (let j = 0; j < allBoxList.length; j++) {
      //       if (allBoxList[j].barCode === barCode && allBoxList[j].shelfSpaceId !== shelfSpaceId) {
      //         isDifferent = true;
      //         break;
      //       }
      //     }
      //     if (isDifferent) {
      //       result.push(barCode);
      //     }
      //   }
      //   result = [...new Set(result)]
      //   if (result.length) {
      //     submitFlag = false
      //     this.$message.error(`${result.join('、')}条码箱，不允许存放在多个库位上`)
      //   }
      // }

      // 批量入库情况下，可能存在多条产品但并未合并的情况，是否 有不同产品明细同产品 使用了相同的条码箱
      // if (submitFlag && this.sourceType.indexOf('_batch')) {
      //   let allBoxList = this.spaceLines.map(line => [...line.boxList]).flat()
      //   let result = []
      //   for (let i = 0; i < allBoxList.length; i++) {
      //     let barCode = allBoxList[i].barCode;
      //     let productsId = allBoxList[i].productsId;
      //     let routingLineId = allBoxList[i].routingLineId;
      //     let sourceNo = allBoxList[i].sourceNo;
      //     let isDifferent = false; // 标记是否存在相同的项
      //     for (let j = 0; j < allBoxList.length; j++) {
      //       if (allBoxList[j].productsId === productsId && allBoxList[j].routingLineId === routingLineId && allBoxList[j].sourceNo === sourceNo) {
      //         if (i !== j && sourceNo) {
      //           isDifferent = true;
      //           break;
      //         }
      //       }
      //     }
      //     if (isDifferent) {
      //       result.push(barCode);
      //     }
      //   }
      //   result = [...new Set(result)]
      //   if (result.length) {
      //     submitFlag = false
      //     this.$message.error(`${result.join('、')}条码箱不能多次应用在同一产品上`)
      //   }
      // }

      // 条码箱物品是否全部配置入库完成
      // if (submitFlag) {
      //   let allBarCode = [...new Set(this.spaceLines.map(line => [...line.boxList]).flat().map(line => line.barCode))]
      //   let res = allBarCode.length ? await detailByBarCodes({ barCodes: allBarCode }).catch(err => false) : { data: [] }
      //   if (!res) return this.btnLoading = false

      //   let allBoxList = this.spaceLines.map(line => [...line.boxList]).flat()
      //   res.data.some(item => {
      //     return item.barcodeLineVOs.some(o => { // 依次对比barcodeLineVOs中是否每个产品都已经配置货位
      //       let hasBox = allBoxList.find(o1 => o1.productsId === o.productsId && o1.routingLineId == o.routingLineId && o1.barCode === item.barCode)
      //       if (!hasBox) {
      //         // this.$message.error(`条码箱产品未全部设置货位 —— 条码箱：${o.barCode} ${item.standardBoxName} - 产品名称：${o.productsName} - 数量：${o.realityTotalNum}`)
      //         this.$message.error(`${o.barCode}箱中的产品未全部入库，请设置一起入库`)
      //         submitFlag = false
      //         return true
      //       }
      //       return false
      //     })
      //   })
      // }

      // 自动聚焦未使用则提交
      if (submitFlag) {
        this.dataForm.documentStatus = submitModel
        this.dataForm.originNo = "io_other"
        this.dataForm.documentType = "inbound"
        this.linesList.forEach(item => item.id = "")
        // spaceLines每一项的产品id如果与linesList项的产品id相同，那么让spaceLines项的批次号也等于linesList项的批次号
        this.spaceLines.forEach(item => {
          let linesOption
          if (this.sourceType.indexOf('_batch') === -1) {
            linesOption = this.linesList.find(line => line.productsId === item.productsId && line.routingLineId == item.routingLineId)
          } else { // 批量入库时
            linesOption = this.linesList.find(line => line.productsId === item.productsId && line.routingLineId == item.routingLineId && line.sourceNo === item.sourceNo)
          }
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

        cardInbound(dataObj).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { msg = "提交成功" }
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
        if (this.sourceType.indexOf('_batch') === -1) {
          this.spaceLines = this.spaceLines.filter(item => item.productsId === data.row.productsId ? item.routingLineId !== data.row.routingLineId : true)
        } else { // 批量入库时
          this.spaceLines = this.spaceLines.filter(item =>
            item.productsId === data.row.productsId ? item.routingLineId !== data.row.routingLineId ? item.sourceNo !== data.row.sourceNo : true : true)
        }
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
        let rowDetailList
        if (this.sourceType.indexOf('_batch') === -1) {
          rowDetailList = JSON.parse(JSON.stringify(this.spaceLines.filter(line => line.productsId === scope.row.productsId && line.routingLineId == scope.row.routingLineId)))
        } else { // 批量入库时
          rowDetailList = JSON.parse(JSON.stringify(this.spaceLines.filter(line => line.productsId === scope.row.productsId && line.routingLineId == scope.row.routingLineId &&
            line.sourceNo == scope.row.sourceNo)))
        }
        this.$refs['wareSide'].init(scope, rowDetailList, this.btnType)
      })
    },
    // 抽屉提交
    sideConfirm(data, scope) {
      let tempList // 过滤掉此产品明细原货位设置
      if (this.sourceType.indexOf('_batch') === -1) {
        tempList = this.spaceLines.filter(line => !(line.productsId === scope.row.productsId && line.routingLineId === scope.row.routingLineId))
      } else { // 批量入库时
        tempList = this.spaceLines.filter(line => !(line.productsId === scope.row.productsId && line.routingLineId === scope.row.routingLineId && line.sourceNo === scope.row.sourceNo))
      }
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
    // list 中 a 不能 operator b 的校验规则
    calcValidate(list, a, b, operator, msg, callbackMethod) {
      return (rule, value, callback) => {
        let rowIndex = Number(rule.field.match(/\d+/)[0])
        msg = msg || `${a} 不能 ${operator} ${b}`
        if (!value || value == 0) { callback() }
        else {
          let flag = false
          list = this.linesList
          let num_1 = 0
          let num_2 = 0
          if (typeof a === 'string') { num_1 = Number(list[rowIndex][a]) }
          else { a.forEach(item => { num_1 += Number(list[rowIndex][item]) }) }
          if (typeof b === 'string') { num_2 = Number(list[rowIndex][b]) }
          else { b.forEach(item => { num_2 += Number(list[rowIndex][item]) }) }
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
  },
  computed: {
    openMode() {
      this.$nextTick(() => {
        this.refeshDataFormItems()
        this.refeshLinesListItems()
      });
      return this.title.includes("新建") ? '新建' : this.title.includes("编辑") ? '编辑' : '只读'
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