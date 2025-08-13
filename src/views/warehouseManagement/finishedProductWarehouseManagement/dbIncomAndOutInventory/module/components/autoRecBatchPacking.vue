<script>
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import {
  addStockedList,
  addStockPackingList,
  allocationBatch,
  allocationPacking,
  getBatchPackingList,
  getStockPackingListNoticeDetail,
  updateStockPackingList
} from "@/api/batchPacking";
import {getPackingBasicFormSchema} from "@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/module/data";
import * as _ from "highcharts";

export default {
  name: "AutoRecBatch",
  components: {TableFormProduct},
  data() {
    return {
      title: '',
      btnType: '',
      formType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        notifyType: 'sale',
        returnDeliveryType: 'delivery',
        delivery: 'deliver_goods',
        inspectionResults: 'qualified',
        documentType: 'sale_deliver',
        exchangeGoodsFlag: false,
        orderNo: '',
        cooperativePartnerId: '',
        partnerName: '',
        partnerCode: '',
        recipient: '',
        phone: '',
        logisticsCompany: '',
        priority: '',
        deliverDate: '',
        defaultAddress: '',
        remark: '',
        deliveryStatus: '',
      },
      fileList: [],
      basicFormSchema: [],
      collapseTitle: '',
      linesInventoryList: [],
      linesInventoryListItems: [
        {
          prop: 'productDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'warehouseName',
          label: '仓库',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'shelfSpaceName',
          label: '库位',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'batchNumber',
          label: '批次',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'orderDate',
          label: '入库日期',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'brand',
          label: '品牌',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'inventoryQuantity',
          label: '库存数量',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'outboundQuantity',
          label: '出库数量',
          type: 'input',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`库存信息第${ rowIndex + 1 }行：出库数量${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
          ],
        }
      ],
      linesList: [],
      linesListItems: [
        {
          prop: 'productDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户产品型号',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'warehouseName',
          label: '仓库',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'shelfSpaceName',
          label: '库位',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'batchNumber',
          label: '批次',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'waitDeliveryQuantity',
          label: '待发数量',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.getDictDataSync('packaging'),
          minWidth: 170,
        },
        {
          prop: 'totalBoxCount',
          label: '总箱数',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.collapseTitle }第${ rowIndex + 1 }行：总箱数${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          prop: 'boxCount',
          label: '箱数',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.collapseTitle }第${ rowIndex + 1 }行：箱数${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          prop: 'singleBoxCount',
          label: '单箱数',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.collapseTitle }第${ rowIndex + 1 }行：单箱数${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          prop: 'remnant',
          label: '尾箱数量',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.collapseTitle }第${ rowIndex + 1 }行：尾箱数量${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          prop: 'totalQuantity',
          label: '总数量',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.collapseTitle }第${ rowIndex + 1 }行：总数量${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'view',
          minWidth: 280,
          disabled: true,
        },
        {
          prop: 'oil',
          label: '机型',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'grossWeight',
          label: '毛重',
          type: 'view',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.collapseTitle }第${ rowIndex + 1 }行：毛重${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          prop: 'trayNo',
          label: '托盘号',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['托盘号不能为空', (errMsg, rowIndex) => {
                  this.$message.error(`${ this.collapseTitle }第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur',
            },
          ],
        },
        {
          prop: 'traySize',
          label: '大小',
          type: 'select',
          minWidth: 160,
          options: this.getDictDataSync('traySize'),
        },
        {
          prop: 'outboundQuantity',
          label: '出库数量',
          type: 'input',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg, rowIndex) => {
                  this.$message.error(`${ this.collapseTitle }第${ rowIndex + 1 }行：出库数量${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
          ],
        }
      ],
      distributionList: [],
      packingProps: new Set(['waitDeliveryQuantity', 'totalBoxCount', 'boxCount', 'singleBoxCount', 'remnant', 'totalQuantity', 'remark', 'oil', 'grossWeight', 'trayNo', 'traySize']),
      nonPackingProps: new Set(['warehouseName', 'shelfSpaceName', 'batchNumber', 'outboundQuantity']),
      linesTableHeight: 200,
      activeNames: ['basicInfo', 'productInfo'],
      apiMethodActions: {
        packing: {
          add: addStockPackingList,
          edit: updateStockPackingList
        },
        autoRecommend: {
          add: addStockedList,
          edit: null
        }
      },
    }
  },
  computed: {
    isTypeAdd() {
      return this.btnType === 'add'
    },
    isPacking() {
      return this.formType === 'packing'
    },
    totalNum() {
      return this.linesInventoryList.reduce((sum, item) => sum + (parseFloat(item.outboundQuantity) || 0), 0);
    },
  },
  mounted() {
    this.basicFormSchema = getPackingBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(params) {
      const {id, formType, type, formData = {}} = params;
      this.formType = formType
      this.btnType = type
      this.dataForm = _.merge({}, this.dataForm, formData)
      this.title = this.getTitle(formType)
      this.updateLinesListItems()
      if (type === 'add') {
        await this.getInitBatchPackingList(id)
      } else {
        await this.getDetail(id)
      }
    },

    updateLinesListItems() {
      this.linesListItems = this.linesListItems.map(item => {
        if (this.nonPackingProps.has(item.prop)) {
          return {...item, render: !this.isPacking};
        }

        if (this.packingProps.has(item.prop)) {
          return {...item, render: this.isPacking};
        }

        return item;
      });
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await getStockPackingListNoticeDetail(id)
        const {msg, data} = res
        if (msg === 'Success') {
          const {notice, packingListLines} = data
          this.dataForm = notice
          this.dataForm.id = data.id
          this.linesList = packingListLines.map(item => ({
            ...item,
            productDrawingNo: item.drawingNo,
            productName: item.productsName,
            productCode: item.productsCode,
            totalBoxCount: item.standardBox,
            boxCount: item.oddBox,
            singleBoxCount: item.packing,
            totalQuantity: item.totalNum,
          }))
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    async getInitBatchPackingList(id) {
      this.loading = true
      try {
        const res = await getBatchPackingList(id, this.isPacking)
        const {msg, data} = res
        if (msg === 'Success') {
          const {batchNumberList, distributionList, stockInventoryList} = data
          this.linesInventoryList = stockInventoryList
          this.linesList = this.formType === 'packing' ? distributionList : batchNumberList
          this.distributionList = distributionList
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    async handleAssign(isAuto) {
      this.loading = true
      try {
        const params = {
          autoAllocation: isAuto,
          distributionList: this.isPacking ? this.linesList : this.distributionList,
          stockInventoryList: this.linesInventoryList,
        }
        const apiMethod = this.isPacking ? allocationPacking : allocationBatch;
        const res = await apiMethod(params)
        const {msg, data} = res
        if (msg === 'Success') {
          const {batchNumberList, distributionList, stockInventoryList} = data
          this.linesInventoryList = stockInventoryList
          this.linesList = this.formType === 'packing' ? distributionList : batchNumberList
          this.loading = false
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },

    contentInventoryChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesInventoryList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesInventoryList[dataOrIndex][prop] = value
      }
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    linesDelete(row) {
      this.linesList.splice(row.$index, 1)
    },

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    getTitle(type) {
      const actionText = this.btnType === 'edit' ? '编辑' : this.btnType === 'detail' ? '详情' : '';
      const baseTitle = type === 'packing' ? '装箱清单' : '智能推荐批次';
      this.collapseTitle = type === 'packing' ? '产品分配信息' : '批次推荐信息';

      return actionText ? `${ actionText }${ baseTitle }` : baseTitle;
    },

    goBack() {
      this.$emit('close');
    },

    async handleSubmit() {
      this.btnLoading = true
      const valid = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid) return this.btnLoading = false
      if (this.isTypeAdd && this.isPacking && this.dataForm.packingStatus === 'boxed') {
        this.$message.warning('已装箱，请勿重复装箱')
        this.btnLoading = false
      }

      this.dataForm.documentId = this.dataForm.id
      this.dataForm.sourceOrderNo = this.dataForm.orderNo

      const linesFieldName = this.formType === 'autoRecommend' ? 'stockPickedLines' : 'stockPackingListLines';
      const mainFieldName = this.formType === 'autoRecommend' ? 'stockPicked' : 'stockPackingList';
      const linesData = this.isPacking ? this.linesList.map(item => ({
        ...item,
        standardBox: item.totalBoxCount,
        oddBox: item.boxCount,
        packing: item.singleBoxCount,
        totalNum: item.totalQuantity,
      })) : this.linesList.map(item => ({
        ...item,
        num: item.outboundQuantity,
        documentId: this.dataForm.id,
        storageDate: item.orderDate,
        documentLineId: item.returnDeliveryNoticeLineId
      }))

      const params = {
        [mainFieldName]: this.dataForm,
        [linesFieldName]: linesData
      };
      let MSG = '提交成功'
      try {
        const apiMethod = this.apiMethodActions[this.formType][this.btnType];
        const res = await apiMethod(params)
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch (error) {
        this.btnLoading = false
      }
    },


  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main transitionForm org-form">
            <div class="JNPF-common-page-header">
              <el-page-header @back="goBack" :content="title"/>
              <div class="options">
                <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading" @click="handleSubmit()">确定</el-button>
                <el-button @click="$emit('close',false)">{{ $t('common.cancelButton') }}</el-button>
              </div>
            </div>
            <div class="main" v-loading="loading" ref="main">
              <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                <el-collapse-item :title="isTypeAdd ? '库存信息' : '基本信息'" name="basicInfo" :class="isTypeAdd ? 'productInfo' : 'orderInfo'" ref="dataFormRegion">
                  <template v-if="isTypeAdd">
                    <TableForm-product
                      @input="contentInventoryChanges"
                      :value="linesInventoryList"
                      :hasToolbar="false"
                      ref="tableInventoryForm"
                      :tableItems="linesInventoryListItems"
                      :hasActionbar="false"
                      :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: false,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }">
                      <template slot="top">
                        <div class="tableTopContainer">
                          <div class="left">
                            <el-button type="text" @click="handleAssign(true)">自动分配</el-button>
                            <span>|</span>
                            <el-button type="text" @click="handleAssign(false)">手动分配</el-button>
                          </div>
                          <div class="right">
                          </div>
                        </div>
                      </template>
                    </TableForm-product>
                    <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;"
                      class="text">
                      <span style="font-weight:500;margin-right:10px">出库数量：{{ totalNum }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
                      btnType="look"/>
                  </template>
                </el-collapse-item>
                <el-collapse-item class="productInfo" :title="collapseTitle" name="productInfo">
                  <TableForm-product
                    @input="contentChanges"
                    :value="linesList"
                    :hasToolbar="false"
                    ref="tableForm"
                    :tableItems="linesListItems"
                    :hasActionbar="false"
                    :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: false,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }">
                    <template slot="actions">
                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                          <el-button type="text" class="JNPF-table-delBtn"
                            @click="linesDelete(scope)">
                            {{ $t(`common.delBtn`) }}
                          </el-button>
                        </template>
                      </el-table-column>
                    </template>
                  </TableForm-product>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
