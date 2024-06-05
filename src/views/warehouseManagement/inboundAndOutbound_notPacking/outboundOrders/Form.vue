<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="title" />
        <div class="options" v-if="!btnType">
          <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button> -->
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
              <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
                :openMode="sourceType === 'outbound_sale_send' ? '只读' : openMode" />
              <div class="subtitle">
                <h5>产品信息</h5>
              </div>
              <TableForm-product :value="linesList" @input="linesChange" ref="linesForm" :tableItems="linesListItems"
                :openMode="sourceType === 'outbound_sale_send' ? '只读' : openMode" @addth="addOrDelLinesItem"
                @deleteth="addOrDelLinesItem" @openSide="openSide" customStyle />
            </div>
          </div>
        </div>
      </div>

      <WareSide v-if="wareVisibled" ref="wareSide" @confirm="sideConfirm"
        :openMode="sourceType === 'outbound_sale_send' ? '只读' : openMode" @markAllocated="markAllocated"
        :autoDistributeMethod="autoDistributeMethod" />
    </div>
  </transition>
</template>

<script>
import { detailWarehouseData, cardOutbound, autoDistribute, recordsAutoDistribute, transferAutoDistribute, getProductRoutingList, getEffectWareLocation } from "@/api/warehouseManagement/inboundAndOutbound" // 出库单详情、卡片出库、自动分配、按单据自动分配、工序列表
import { detailTransferData } from '@/api/warehouseManagement/transferManagement' // 调拨单详情
import { getQuotationsendlist } from "@/api/salesManagement/index" // 销售、外协退发货通知单详情
import { getpurPurchaseReceiptReturnGoodsdetail, detailpurPurchaseReceiptReturnGoods } from '@/api/purchasingManagement/purchaseInquirySheet' // 采购通知单详情
import { detailWithdrawal } from '@/api/productOrdes/index' // 生产领退料详情
import { detailByBarCodes } from '@/api/warehouseManagement/packingList'
import { getWarehouseList, getStockGoodsShelves, getStockGoodsShelvesList } from '@/api/basicData/index' // 库位分类和列表
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
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */], // 表格表单展示列字段
      linesList: [], // 表格表单数据
      spaceLines: [],
      productionLotList: [],
      sourceType: "",



      WareListRequestObj: {
        code: "",
        locationType: "goods_allocation",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": true,
          "column": ""
        }],
        pageNum: 1,
        pageSize: 20,
        //
      }, // 货位选择弹出框列表请求参数
      WareTableItems: [
        { prop: 'name', label: '货位名称', fixed: 'left' },
        { prop: 'code', label: '货位编码', fixed: 'left' },
        { prop: 'warehouseName', label: '仓库名称' },
        { prop: "unitVolume", label: "货位容量(m³)", minWidth: 140 },
        { prop: "usedVolume", label: "已用容量(m³)", minWidth: 140 },
        { prop: "residualVolume", label: "剩余容量(m³)", minWidth: 140 },
        { prop: 'remark', label: '备注' }
      ], // 货位选择弹出框表单展示字段
      WareTableSearchList: [
        { prop: "code", label: "货位编码", type: 'input' },
        { prop: "name", label: "货位名称", type: 'input' }
      ], // 货位选择弹出框搜索条件
    }
  },
  created() { },
  computed: {
    openMode() {
      this.$nextTick(() => {
        this.refeshDataFormItems()
        this.refeshLinesListItems()
      });
      return this.title.includes("新建") ? '新建' : this.title.includes("编辑") ? '编辑' : '只读'
    },
    autoDistributeMethod() {
      if (['outbound_sale_send', 'outbound_stock_up', 'outbound_external_send', 'outbound_pick_out'].includes(this.sourceType)) return recordsAutoDistribute
      else if (['outbound_transfer'].includes(this.sourceType)) return { sourceType: this.sourceType, method: transferAutoDistribute, warehouseType: 'normal' }
      return autoDistribute
    }
  },
  methods: {
    refeshDataFormItems() {
      let sm = this.sourceType !== "outbound_transfer" ? 8 : 8
      let partnerName = '合作伙伴'
      let tempLabel = this.sourceType === "outbound_stock_up" ? '备货' : '出库'
      if (this.sourceType === "outbound_purchase" || this.sourceType === "outbound_external") partnerName = '供应商名称'
      else if (this.sourceType === "outbound_sale_send" || this.sourceType === "outbound_stock_up" || this.sourceType === "outbound_external_send") partnerName = '客户名称'
      else if (this.sourceType === "outbound_pick_out") partnerName = '领料人'
      let tempDataFormItems = [
        { prop: "sourceType", label: "来源类型", value: "", type: "select", options: this.originTypeList, itemRules: [{ required: true, trigger: "blur" }], itemDisabled: true, sm },
        { prop: "sourceNo", label: "来源单号", value: "", type: "input", itemDisabled: true, sm },
        { prop: "partnerName", label: partnerName, value: "", type: "select", itemDisabled: true, render: this.sourceType !== 'outbound_transfer', sm },
        { prop: "transferOutWarehouseName", label: "出库仓库", value: "", type: "select", itemRules: [{ required: true, trigger: "change" }], itemDisabled: true, render: this.sourceType === "outbound_transfer", sm },
        { prop: "submitDate", label: tempLabel + "时间", value: "", type: "dateTime", itemDisabled: true, render: !(['io_other', 'outbound_scrap'].includes(this.dataForm.sourceType)), sm },
        { prop: "createByName", label: tempLabel + "人", value: "", type: "input", itemDisabled: true, render: !(['io_other', 'outbound_scrap'].includes(this.dataForm.sourceType)), sm },
        {
          prop: "warehouseName", label: "入库仓库", value: "", type: "custom", customComponent: "ComSelect-list", method: getWarehouseList, change: this.warehouseChange,
          requestObj: { chooseUserFlag: true, type: 'normal' }, itemRules: [{ required: true, trigger: "no" }], dialogTitle: '选择仓库', sm,
          render: this.sourceType === 'outbound_stock_up'
        },
        {
          prop: "shelfSpaceName", label: "入库库位", value: "", type: "custom", customComponent: "ComSelect-page",
          tableItems: this.WareTableItems, listMethod: getStockGoodsShelvesList, listRequestObj: { ...this.WareListRequestObj, warehouseId: this.dataForm.warehouseId },
          searchList: this.WareTableSearchList, change: this.shelfSpaceChange, itemRules: [{ required: true, trigger: "no" }],
          dialogTitle: '选择库位', sm, render: this.sourceType === 'outbound_stock_up', itemDisabled: !this.dataForm.warehouseName || this.openMode === '只读', renderTree: false
        },
        { prop: "remark", label: "备注", value: "", type: "textarea", itemDisabled: this.openMode === '只读' }
      ]
      this.dataFormItems = [...tempDataFormItems]
    },
    refeshLinesListItems() {
      if (this.sourceType === 'outbound_sale_send') {
        this.linesListItems = [
          { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 140 },
          { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 140 },
          { prop: "drawingNo", label: "产品图号", value: "", type: 'view', minWidth: 300 },
          { prop: "mainUnit", label: "单位(主)", value: "", type: "view", minWidth: 100 },
          { prop: "deliveryQuantity", label: "发货数量(主)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' },
          { prop: "num", label: "备货数量(主)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' },
          { prop: "num", label: "出库数量(主)", value: "", type: "input", minWidth: 180, itemDisabled: true, itemRules: [{ required: true, trigger: 'blur' }] },
          { prop: "deputyUnit", label: "单位(副)", value: "", type: "view", minWidth: 100 },
          { prop: "deputyDeliveryQuantity", label: "发货数量(副)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' },
          { prop: "deputyNum", label: "备货数量(副)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' },
          { prop: "deputyNum", label: "出库数量(副)", value: "", type: "input", itemDisabled: true, itemRules: [{ required: true, trigger: 'blur' },], minWidth: 180 },
          { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200, minWidth: 160, itemDisabled: this.openMode === '只读' },
        ]
      } else {
        this.linesListItems = [
          { prop: "productCode", label: "产品编码", value: "", type: 'view', minWidth: 140 },
          { prop: "productName", label: "产品名称", value: "", type: 'view', minWidth: 140 },
          { prop: "drawingNo", label: "产品图号", value: "", type: 'view', minWidth: 300 },
          { prop: "routingName", label: "工艺路线名称", value: "", type: "view", minWidth: 160, render: this.sourceType === 'outbound_external_send' || this.sourceType === 'outbound_external' || this.sourceType === 'outbound_pick_out' },
          {
            prop: "processName", label: "工序名称", value: "", type: "view", minWidth: 160,
            // customComponent: "ComSelect-page", dialogTitle: "选择工序", renderTree: false,
            // tableItems: [{ prop: "routingName", label: "工艺路线名称" }, { prop: "processName", label: "工序名称" }],
            // listMethod: getProductRoutingList, listRequestObj: this.processSelectRequestObj,
            // change: this.processChange, placeholder: "请选择工序", clearable: true, listDataFormatting: (res) => {
            //   if (!res.data.records.length) this.$message.warning('此产品没有工序')
            //   return res.data.records
            // },
            render: this.sourceType === 'outbound_external_send' || this.sourceType === 'outbound_external' || this.sourceType === 'outbound_pick_out'
          },
          { prop: "mainUnit", label: "单位(主)", value: "", type: "view", minWidth: 100 },
          {
            prop: "num", label: "数量(主)", value: "", type: "input", minWidth: 180, itemDisabled: this.sourceType === 'outbound_transfer' || this.sourceType === 'outbound_sale_send' || this.openMode === '只读',
            input: (val, scope) => {
              if (scope.row.calculationDirection === 'multiplication') { scope.row.deputyNum = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
              else { scope.row.deputyNum = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
            },
            change: (val, scope) => {
              scope.row.allocated = false
              this.linesList.splice(scope.$index, 1, this.linesList[scope.$index])
              this.spaceLines = this.spaceLines.filter(line =>
                line.productsId !== scope.row.productsId || !this.jnpf.isSame(line.routingLineId, scope.row.routingLineId))
            },
            itemRules: [
              { required: true, trigger: 'blur' },
              { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }] }), trigger: 'blur' },
              { validator: this.formValidate('positiveNumber', '', (errMsg) => { this.$message.error('数量(主)：' + errMsg) }), trigger: 'blur' },
              this.sourceType !== 'outbound_transfer' ? { validator: this.calcValidate(this.linesList, 'num', 'deliveryQuantity', '<=', "不能超过对应待出库数量", (errMsg) => { this.$message.error('数量(主)：' + errMsg) }), trigger: 'blur' } : {},
              this.sourceType === 'outbound_sale_send' || this.sourceType === 'outbound_external_send' || this.sourceType === 'outbound_pick_out' || this.sourceType === 'outbound_stock_up' ?
                { validator: this.calcValidate(this.linesList, 'num', ['availableQuantity', 'occupancyQuantity'], '<=', '不能超过对应可用数量+占用数量', (errMsg) => { this.$message.error('数量(主)：' + errMsg) }), trigger: 'blur' }
                : { validator: this.calcValidate(this.linesList, 'num', ['availableQuantity'], '<=', '不能超过对应可用数量', (errMsg) => { this.$message.error('数量(主)：' + errMsg) }), trigger: 'blur' },
            ]
          },
          { prop: "deliveryQuantity", label: "待出库数量(主)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' },
          { prop: "availableQuantity", label: "可用数量(主)", value: "", type: 'view', minWidth: 120, render: this.openMode !== '只读' },
          { prop: "inventoryQuantity", label: "总库存数量(主)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' && this.sourceType !== 'outbound_purchase' && this.sourceType !== 'outbound_transfer' },
          { prop: "occupancyQuantity", label: "占用数量(主)", value: "", type: 'view', minWidth: 120, render: this.openMode !== '只读' && this.sourceType !== 'outbound_purchase' && this.sourceType !== 'outbound_transfer' },
          { prop: "deputyUnit", label: "单位(副)", value: "", type: "view", minWidth: 100 },
          {
            prop: "deputyNum", label: "数量(副)", value: "", type: "input", itemDisabled: this.sourceType === 'outbound_transfer' || this.sourceType === 'outbound_sale_send' || this.openMode === '只读',
            input: (val, scope) => {
              if (scope.row.calculationDirection === 'division') { scope.row.num = this.jnpf.numberFormat(val * scope.row.ratio, 4) }
              else { scope.row.num = this.jnpf.numberFormat(val / scope.row.ratio, 4) }
            },
            change: (val, scope) => {
              scope.row.allocated = false
              this.linesList.splice(scope.$index, 1, this.linesList[scope.$index])
              this.spaceLines = this.spaceLines.filter(line =>
                line.productsId !== scope.row.productsId || !this.jnpf.isSame(line.routingLineId, scope.row.routingLineId))
            },
            itemRules: [
              { required: true, trigger: 'blur' },
              { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }] }), trigger: 'blur' },
              { validator: this.formValidate('positiveNumber', '', (errMsg) => { this.$message.error('数量(副)：' + errMsg) }), trigger: 'blur' },
              this.sourceType !== 'outbound_transfer' ? { validator: this.calcValidate(this.linesList, 'deputyNum', 'deputyDeliveryQuantity', '<=', "不能超过对应待出库数量", (errMsg) => { this.$message.error('数量(副)：' + errMsg) }), trigger: 'blur' } : {},
              this.sourceType === 'outbound_sale_send' || this.sourceType === "outbound_stock_up" || this.sourceType === 'outbound_external_send' || this.sourceType === 'outbound_pick_out' ?
                { validator: this.calcValidate(this.linesList, 'deputyNum', ['deputyAvailableQuantity', 'deputyOccupancyQuantity'], '<=', '不能超过对应可用数量+占用数量', (errMsg) => { this.$message.error('数量(副)：' + errMsg) }), trigger: 'blur' }
                : { validator: this.calcValidate(this.linesList, 'deputyNum', ['deputyAvailableQuantity'], '<=', '不能超过对应可用数量', (errMsg) => { this.$message.error('数量(副)：' + errMsg) }), trigger: 'blur' },
            ], minWidth: 180
          },
          { prop: "deputyDeliveryQuantity", label: "待出库数量(副)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' },
          { prop: "deputyAvailableQuantity", label: "可用数量(副)", value: "", type: 'view', minWidth: 120, render: this.openMode !== '只读' },
          { prop: "deputyInventoryQuantity", label: "总库存数量(副)", value: "", type: 'view', minWidth: 140, render: this.openMode !== '只读' && this.sourceType !== 'outbound_purchase' && this.sourceType !== 'outbound_transfer' },
          { prop: "deputyOccupancyQuantity", label: "占用数量(副)", value: "", type: 'view', minWidth: 120, render: this.openMode !== '只读' && this.sourceType !== 'outbound_purchase' && this.sourceType !== 'outbound_transfer' },
          { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200, minWidth: 160 },
        ]
      }


      this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
    },
    init(id, btnType = false, sourceType, outboundId) {
      let option = this.originTypeList.find(item => item.value === sourceType)
      this.visible = true
      this.formLoading = true
      this.sourceType = sourceType
      this.btnType = btnType
      this.refeshDataFormItems()
      if (id) {
        this.title = btnType ? '查看' : '新建'
        this.title += option.label + '单'
        if (outboundId) {
          detailWarehouseData(outboundId).then(res => {

            this.documentStatus = res.data.stockMove.documentStatus
            this.dataForm = { ...res.data.stockMove, warehouseName: res.data.spaceLines[0].warehouseName }

            let tempLinesList = res.data.lines
            tempLinesList.forEach(item => { item.allocated = true })
            this.linesList = res.data.lines

            // 合并同产品、同库位、同批次的库位数据
            this.spaceLines = res.data.spaceLines.reduce((result, obj) => {
              let existingObj = result.find(item =>
                item.productsId === obj.productsId &&
                this.jnpf.isSame(item.routingLineId, obj.routingLineId) &&
                item.shelfSpaceId === obj.shelfSpaceId &&
                item.batchNumber === obj.batchNumber);
              if (existingObj) {
                existingObj.availableQuantity = this.jnpf.math('add', [existingObj.availableQuantity, obj.availableQuantity]);
                existingObj.occupyAvailableQuantity = this.jnpf.math('add', [existingObj.occupyAvailableQuantity, obj.occupyAvailableQuantity]);
                existingObj.documentObjId = existingObj.documentObjId || obj.documentObjId;
              } else {
                result.push(obj);
              }
              return result;
            }, []);
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
            this.refeshLinesListItems()
            this.formLoading = false
          }).catch(() => { this.formLoading = false })
        } else {
          if (sourceType === "outbound_transfer") {
            detailTransferData(id).then(res => {
              this.dataForm = { ...res.data.picking, sourceType, sourceNo: res.data.picking.orderNo }
              let tempLinesList = res.data.lines
              tempLinesList.forEach(line => {
                line.drawingNo = line.drawingNo !== undefined ? line.drawingNo : line.productDrawingNo
                line.deliveryQuantity = line.num
                if (line.calculationDirection === 'multiplication') {
                  line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
                } else {
                  line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
                }
              })
              this.linesList = tempLinesList.filter(line => line.num != '0')
              this.formLoading = false
            }).catch(() => { this.formLoading = false })
          } else if (sourceType === "outbound_sale_send" || sourceType === "outbound_external_send" || sourceType === "outbound_stock_up") { // 销售发货 外协发料 销售备货
            getQuotationsendlist(id).then(res => {
              this.dataForm = { ...res.data.notice, sourceType, sourceNo: res.data.notice.orderNo }
              // 使用 reduce() 方法进行合并和求和操作
              let tempLinesList = res.data.noticeLineList.reduce((result, obj) => {
                let existingObj = result.find(item => item.productCode === obj.productCode && this.jnpf.isSame(item.routingLineId, obj.routingLineId));
                if (existingObj) {
                  existingObj.deliveryQuantity = this.jnpf.math('add', [existingObj.deliveryQuantity, obj.deliveryQuantity]);
                  existingObj.outboundQuantity = this.jnpf.math('add', [existingObj.outboundQuantity, obj.outboundQuantity]);
                  existingObj.ordersLineId = '';
                  existingObj.id = '';
                } else {
                  result.push({ ...obj, ordersLineId: obj.id });
                }
                return result;
              }, []);
              tempLinesList.forEach(line => {
                line.ordersLineId = line.id
                line.drawingNo = line.productDrawingNo
                line.productsId = line.productId
                line.fullNum = line.deliveryQuantity
                // line.deliveryQuantity -= (line.outboundQuantity ? line.outboundQuantity : 0)
                line.deliveryQuantity = this.jnpf.math('subtract', [line.deliveryQuantity, line.outboundQuantity ? line.outboundQuantity : 0])
                line.num = line.deliveryQuantity
                if (line.calculationDirection === 'multiplication') {
                  line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                  line.deputyOccupancyQuantity = this.jnpf.numberFormat(line.occupancyQuantity * line.ratio, 4)
                  line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
                } else {
                  line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                  line.deputyOccupancyQuantity = this.jnpf.numberFormat(line.occupancyQuantity / line.ratio, 4)
                  line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
                }
              })
              // this.linesList = tempLinesList.filter(line => line.num != '0')
              // 销售发货出库，获取其备货数据，自动填写出库数据
              if (sourceType === "outbound_sale_send" && res.data.stockPicking) {
                detailWarehouseData(res.data.stockPicking.outboundId).then(res2 => {

                  // 提取货位明细中的条码箱
                  // let allBoxBarCode = res2.data.spaceLines.map(line => line.boxVoList.map(boxLine => boxLine.barCode))

                  // this.documentStatus = res2.data.stockMove.documentStatus
                  // this.dataForm = { ...res2.data.stockMove, warehouseName: res2.data.spaceLines[0].warehouseName }

                  // let tempLinesList = res2.data.lines
                  // tempLinesList.forEach(item => { item.allocated = true })
                  // this.linesList = res2.data.lines
                  this.dataForm.remark = res2.data.stockMove.remark
                  this.linesList = tempLinesList.map(line => {
                    // 主副数量重新计算
                    let targetLine = res2.data.lines.find(line2 => line2.productsId === line.productsId && this.jnpf.isSame(line2.routingLineId, line.routingLineId)) || {
                      num: 0,
                      deputyNum: 0
                    }
                    return {
                      ...line,
                      allocated: true, // 不使用自动分配
                      num: targetLine.num,
                      deputyNum: targetLine.deputyNum,
                      remark: targetLine.remark
                    }
                  })
                  this.linesList = this.linesList.filter(line => line.num != '0')

                  if (this.linesList.length === 1) this.$refs.linesForm.switchStyle('notip') // 如果子数据只有1条，切换子表展示模式

                  this.spaceLines = res2.data.spaceLines
                  this.spaceLines.forEach(item => {
                    // item.boxList = item.boxVoList
                    // delete item.boxVoList
                    // item.barCodeIds = item.boxList.map(box => box.id)
                    // item.barCodeList = item.boxList.map(box => box.barCode)
                    // item.boxList.forEach(box => {
                    //   box.name = box.barCode
                    // })
                    // 由于数据是备货出库时的出库数据，所以把出库仓库与出库库位替换成备货后仓库与库位
                    item.goodsShelvesId = res2.data.stockMove.goodsShelvesId
                    item.goodsShelvesName = res2.data.stockMove.goodsShelvesName
                    item.warehouseId = res2.data.stockMove.warehouseId
                    item.warehouseName = res2.data.stockMove.warehouseName
                    item.shelfSpaceId = res2.data.stockMove.shelfSpaceId
                    item.shelfSpaceName = res2.data.stockMove.shelfSpaceName
                  });
                  // 合并同产品、同库位、同批次的库位数据
                  this.spaceLines = this.spaceLines.reduce((result, obj) => {
                    let existingObj = result.find(item =>
                      item.productsId === obj.productsId &&
                      this.jnpf.isSame(item.routingLineId, obj.routingLineId) &&
                      item.shelfSpaceId === obj.shelfSpaceId &&
                      item.batchNumber === obj.batchNumber);
                    if (existingObj) {
                      existingObj.availableQuantity = this.jnpf.math('add', [existingObj.availableQuantity, obj.availableQuantity]);
                      existingObj.occupyAvailableQuantity = this.jnpf.math('add', [existingObj.occupyAvailableQuantity, obj.occupyAvailableQuantity]);
                      existingObj.documentObjId = existingObj.documentObjId || obj.documentObjId;

                      // existingObj.boxList = existingObj.boxList.concat(obj.boxList);
                      // existingObj.barCodeIds = existingObj.barCodeIds.concat(obj.barCodeIds);
                      // existingObj.barCodeList = existingObj.barCodeList.concat(obj.barCodeList);
                    } else {
                      result.push(obj);
                    }
                    return result;
                  }, []);

                  // this.refeshDataFormItems()
                  this.refeshLinesListItems()


                  this.formLoading = false
                })
              } else if (sourceType === "outbound_sale_send" && !res.data.stockPicking) {
                this.$message.warning("此销售发货通知单尚未备货，请先进行备货后再出库")
                this.init(id, false, "outbound_stock_up")
              } else {
                this.linesList = tempLinesList.filter(line => line.num != '0')
                this.formLoading = false
                if (this.linesList.length === 1) this.$refs.linesForm.switchStyle('notip') // 如果子数据只有1条，切换子表展示模式
              }
            }).catch(() => { this.formLoading = false })
          } else if (sourceType === "outbound_purchase" || sourceType === "outbound_external") { // 采购退货、外协退货
            getpurPurchaseReceiptReturnGoodsdetail(id).then(res => {
              this.dataForm = { ...res.data, sourceType, sourceNo: res.data.orderNo, cooperativePartnerId: res.data.partnerId }
              detailpurPurchaseReceiptReturnGoods(this.dataForm.id).then(res => {
                let tempLinesList = res.data.reduce((result, obj) => {
                  let existingObj = result.find(item => item.productCode === obj.productCode && this.jnpf.isSame(item.routingLineId, obj.routingLineId));
                  if (existingObj) {
                    existingObj.receivedQuantity = this.jnpf.math('add', [existingObj.receivedQuantity, obj.receivedQuantity]);
                    existingObj.receiptQuantity = this.jnpf.math('add', [existingObj.receiptQuantity, obj.receiptQuantity]);
                    existingObj.ordersLineId = '';
                    existingObj.id = '';
                  } else {
                    result.push({ ...obj, ordersLineId: obj.id, receivingStatus: '' });
                  }
                  return result;
                }, []);
                tempLinesList.forEach(line => {
                  // 如果是最后一道工序或者是返工成品，出库成品
                  line.routingName = line.lastFlag && (line.reworkType === 'product' || !line.reworkType) ? '' : line.routingName || line.routingIdName || ''
                  line.processName = line.lastFlag && (line.reworkType === 'product' || !line.reworkType) ? '' : line.processName || line.processIdName || ''
                  line.routingLineId = line.lastFlag && (line.reworkType === 'product' || !line.reworkType) ? '' : line.routingLineId || ""

                  line.drawingNo = line.productDrawingNo
                  line.deliveryQuantity = line.receivedQuantity - (line.receiptQuantity ? line.receiptQuantity : 0)
                  line.num = line.deliveryQuantity
                  line.occupancyQuantity = 0
                  if (line.calculationDirection === 'multiplication') {
                    line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                    line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
                  } else {
                    line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                    line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
                  }
                })
                this.linesList = tempLinesList.filter(line => line.num != '0')
                this.formLoading = false
              })
            }).catch(() => { this.formLoading = false })
          } else if (sourceType === "outbound_pick_out") {
            detailWithdrawal(id).then(res => {
              this.dataForm = { ...res.data.collect, sourceType, sourceNo: res.data.collect.parentOrderNo, partnerName: res.data.collect.personName }
              let tempLinesList = res.data.collectLineList.reduce((result, obj) => {
                let existingObj = result.find(item => item.productCode === obj.productCode && this.jnpf.isSame(item.routingLineId, obj.routingLineId));
                if (existingObj) {
                  existingObj.deliveryQuantity = this.jnpf.math('add', [existingObj.deliveryQuantity, obj.deliveryQuantity]);
                  existingObj.outboundQuantity = this.jnpf.math('add', [existingObj.outboundQuantity, obj.outboundQuantity]);
                  existingObj.ordersLineId = '';
                  existingObj.id = '';
                } else {
                  result.push({ ...obj, ordersLineId: obj.id });
                }
                return result;
              }, []);
              tempLinesList.forEach(line => {
                line.ordersLineId = line.id
                line.drawingNo = line.productDrawingNo
                line.productsId = line.productId
                line.deliveryQuantity = this.jnpf.math('subtract', [line.num, line.outboundQuantity])
                line.num = line.deliveryQuantity
                if (line.calculationDirection === 'multiplication') {
                  line.deputyNum = this.jnpf.numberFormat(line.num * line.ratio, 4)
                  line.deputyOccupancyQuantity = this.jnpf.numberFormat(line.occupancyQuantity * line.ratio, 4)
                  line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity * line.ratio, 4)
                } else {
                  line.deputyNum = this.jnpf.numberFormat(line.num / line.ratio, 4)
                  line.deputyOccupancyQuantity = this.jnpf.numberFormat(line.occupancyQuantity / line.ratio, 4)
                  line.deputyDeliveryQuantity = this.jnpf.numberFormat(line.deliveryQuantity / line.ratio, 4)
                }
              })
              this.linesList = tempLinesList.filter(line => line.num != '0')
              this.formLoading = false
            }).catch(() => { this.formLoading = false })
          } else this.$message.error('缺少sourceType')
        }
      } else {
        this.title = '新建出库单'
        this.formLoading = false
      }
    },
    warehouseChange(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField('warehouseName') })
      if (data[0].id !== this.dataForm.warehouseId || !data || !data.length) { // 入库仓库变动重置入库库位
        this.dataForm.shelfSpaceId = ''
        this.dataForm.shelfSpaceName = ''
      }
      if (!val && data.length) return
      if (!data || !data.length) {
        this.dataForm['warehouseId'] = ""
        this.dataForm['warehouseName'] = ""
      } else {
        this.dataForm['warehouseId'] = data[0].id
        this.dataForm['warehouseName'] = data[0].name
      }
      this.refeshDataFormItems()
    },
    shelfSpaceChange(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].$children[0].validateField('shelfSpaceName') })
      if (!val && data.length) return
      if (!data || !data.length) {
        this.dataForm['shelfSpaceId'] = ""
        this.dataForm['shelfSpaceName'] = ""
      } else {
        this.dataForm['shelfSpaceId'] = data[0].id
        this.dataForm['shelfSpaceName'] = data[0].name
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
      let form_2 = this.$refs['linesForm'].$children[0]
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      // 判断出库单是否有效
      if (!this.linesList.length && submitFlag) {
        submitFlag = false
        this.$message.error('请至少选择一个产品')
      }
      if (this.linesList.length && submitFlag) {
        console.log(this.linesList);
        console.log(this.spaceLines);
        this.linesList.some((item, index) => {
          let num = 0
          let tempList = this.spaceLines.filter(line => line.productsId === item.productsId && this.jnpf.isSame(line.routingLineId, item.routingLineId))
          tempList.forEach(line => {
            num += line.num ? Number(line.num) : 0
          })
          if (item.num != num) {
            submitFlag = false
            this.$message.error(`产品信息第${index + 1}行：请先完善出库产品货位设置`)
            return true
          }
          return false
        })
      }

      // 同一条码箱是否在同一货位上
      // if (submitFlag) {
      //   let allBoxList = this.spaceLines.map(line => [...line.boxList]).flat()
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

      // 条码箱物品是否全部配置出库完成
      // if (!['outbound_pick_out'].includes(this.sourceType) && submitFlag) {
      //   let allBarCode = [...new Set(this.spaceLines.map(line => [...line.boxList]).flat().map(line => line.barCode))]
      //   let res = allBarCode.length ? await detailByBarCodes({ barCodes: allBarCode }).catch(err => false) : { data: [] }
      //   if (!res) return this.btnLoading = false

      //   let allBoxList = this.spaceLines.map(line => [...line.boxList]).flat()
      //   res.data.some(item => {
      //     return item.barcodeLineVOs.some(o => { // 依次对比barcodeLineVOs中是否每个产品都已经配置货位
      //       let hasBox = allBoxList.find(o1 => o1.productsId === o.productsId && this.jnpf.isSame(o1.routingLineId, o.routingLineId) && o1.barCode === item.barCode)
      //       if (!hasBox) {
      //         // this.$message.error(`条码箱产品未全部设置货位 —— 条码箱：${o.barCode} ${item.standardBoxName} - 产品名称：${o.productsName} - 数量：${o.realityTotalNum}`)
      //         this.$message.error(`${o.barCode}箱中的产品未全部出库，请设置一起出库`)
      //         submitFlag = false
      //         return true
      //       }
      //       return false
      //     })
      //   })
      // }

      // 自动聚焦未使用则提交
      if (submitFlag) {
        let dataObj = {
          stockMove: JSON.parse(JSON.stringify(this.dataForm)),
          lines: JSON.parse(JSON.stringify(this.linesList)),
          spaceLines: JSON.parse(JSON.stringify(this.spaceLines))
        }
        dataObj.stockMove.documentStatus = submitModel
        dataObj.stockMove.originNo = "io_other"
        dataObj.stockMove.documentType = "outbound"
        dataObj.stockMove.sourceNo = dataObj.stockMove.orderNo
        dataObj.stockMove.orderNo = ""
        dataObj.spaceLines.forEach(item => {
          item.id = ""
          if (item.occupyObjId) {
            item.occupyNum = Number(item.num) < Number(item.occupyAvailableQuantity) ? item.num : item.occupyAvailableQuantity
          }
          // 如果货位明细列表中有占用的数据，并且出库数量大于占用数(从占用库位数据上拆分非占用库位数据)
          // if (item.documentObjId && item.num > item.occupyAvailableQuantity) {
          //   dataObj.spaceLines.push({
          //     ...item, // 继承
          //     num: this.jnpf.math('subtract', [item.num, item.occupyAvailableQuantity]), // 出库数量
          //     availableQuantity: this.jnpf.math('subtract', [item.availableQuantity, item.occupyAvailableQuantity]), // 总可用数
          //     documentObjId: '', // 占用单据id
          //     occupyObjId: '', // 占用对象id
          //     occupyAvailableQuantity: '', // 占用可用数
          //   })
          //   item.num = item.occupyAvailableQuantity
          //   item.availableQuantity = item.occupyAvailableQuantity
          // }
        })

        if (this.sourceType === 'outbound_pick_out') {
          // 找到库位列表中有合并的占用数据，分成多条库位
          dataObj.spaceLines = dataObj.spaceLines.reduce((result, obj) => {
            obj.originNum = obj.num
            let temp = []
            if (obj.occupyList && obj.occupyList.length) {
              obj.occupyList.forEach(spaceLineOccupyData => {
                if (obj.originNum) {
                  // 把占用库位分离出来
                  temp.push({
                    ...obj,
                    occupyObjId: spaceLineOccupyData.occupyObjId,
                    num: spaceLineOccupyData.occupyAvailableQuantity,
                    occupyNum: spaceLineOccupyData.occupyAvailableQuantity,
                    occupyAvailableQuantity: spaceLineOccupyData.occupyAvailableQuantity,
                    occupyList: undefined,
                  })
                  obj.originNum = this.jnpf.math('subtract', [obj.originNum, spaceLineOccupyData.occupyAvailableQuantity])
                }
                if (obj.originNum > obj.occupyAvailableQuantity) {
                  temp.push({
                    ...obj,
                    num: obj.originNum,
                    occupyObjId: '',
                    occupyNum: 0,
                    occupyAvailableQuantity: 0,
                    occupyList: undefined,
                  })
                }
              })
            } else {
              temp.push(obj)
            }
            result.push(...temp)
            return result
          }, [])
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

        cardOutbound(dataObj).then(res => {
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
        this.linesList = JSON.parse(JSON.stringify(tempList))
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
        let rowDetailList = JSON.parse(JSON.stringify(this.spaceLines.filter(line => line.productsId === scope.row.productsId &&
          this.jnpf.isSame(line.routingLineId, scope.row.routingLineId))))
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
    // 标记已分配库存的行
    markAllocated(scope) {
      this.linesList[scope.$index].allocated = true
      this.linesList.splice(scope.$index, 1, this.linesList[scope.$index])
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
    processSelectRequestObj(rowIndex) {
      let productsId = this.linesList[rowIndex].productsId
      return { productsId }
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