<script>
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import { getBasicFormSchema } from '../pendingTransition/data';
import RecordList from "@/views/workFlow/components/RecordList.vue";
import Process from "@/components/Process/Preview";
import { detaInventorymodalShiftData, InventorymodalShiftdata, updateInventorymodalShift } from "@/api/warehouseManagement/modalShift";
import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";
import { getQuotationsendlist } from "@/api/salesManagement";
import { getBatchNumber, getWarehouseInfo, getWarehouseList } from "@/api/basicData";
import { createEmptyObject } from "@/utils";

export default {
  name: "Form",
  components: { TableFormProduct, Process, RecordList },
  mixins: [flowMixin, busFlow],
  props: {
    warehouseCode: {
      type: String,
      default: 'finish_product'
    }
  },
  data() {
    return {
      title: '形态转换',
      btnType: '',
      loading: false,
      btnLoading: false,
      isOrderNoEditable: false,
      locationEnabled: false,
      sourceDataId: '',
      dataForm: {
        approvalFlag: false,
      },
      basicFormSchema: [],
      linesList: [],
      linesListItems: [],
      linesTableHeight: 0,
      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      actions: {
        edit: async (id) => {
          await this.getDetail(id);
          await this.getOrderNoConfig()
        },
        resubmit: async (id) => {
          await this.getDetail(id);
          await this.getOrderNoConfig()
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        default: async () => {
          await this.loadSourceData();
          await this.getOrderNoConfig();
          await this.fetchAndSetWarehouseInfo();
        },
      },
      apiMethodActions: {
        add: InventorymodalShiftdata,
        edit: updateInventorymodalShift,
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    totalTargetNum() {
      return this.linesList.reduce((total, item) =>
        this.jnpf.math('add', [total, Number(item.targetNum) || 0]), 0);
    }
  },
  mounted() {},
  methods: {
    async init(id = '', type, approvalFlag = false, sourceDataId = '') {
      this.loading = true
      this.btnType = type
      this.sourceDataId = sourceDataId;
      this.approvalFlag = approvalFlag
      this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
      this.setLinesListItems()
      this.title = this.getTitle(type)
      this.getBusInfo('b064')
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }

      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },
    calculateTargetNum(row) {
      row.targetNum = row.num && row.unitConversionRatio
        ? this.jnpf.math('multiply', [row.num, row.unitConversionRatio])
        : '';
    },
    async fetchAndSetWarehouseInfo() {
      try {
        const { data: warehouses } = await getWarehouseList({ code: this.warehouseCode });
        if (!warehouses || warehouses.length === 0) {
          this.$message.error('未找到匹配的仓库');
        }

        const primaryWarehouse = warehouses[0];
        this.dataForm.warehouseName = primaryWarehouse.name;
        this.dataForm.warehouseId = primaryWarehouse.id;

        const { data: warehouseDetails } = await getWarehouseInfo(primaryWarehouse.id);
        this.wareHouseInfo = warehouseDetails;
        this.dataForm.warehouseType = warehouseDetails.type;
        this.locationEnabled = warehouseDetails.locationStatus !== 'disabled';
      } catch ( error ) {
      }
    },
    setLinesListItems() {
      const getRealRowIndex = (index) => {
        let result = 0
        for (let i = 0; i < index[0]; i++) {
          result++
          result += this.linesList[i].children.length
        }
        return result + index[1]
      }
      const validErrorMessage = (...args) => {
        let [label, errMsg, index] = args
        if (Array.isArray(index)) index = getRealRowIndex(index)
        this.$message.error(`产品信息第${ index + 1 }行：${ label }${ errMsg }`)
      }

      this.linesListItems = [
        {
          prop: "targetProductsCode",
          label: "目标产品编码",
          type: 'view',
          minWidth: 160,
        },
        {
          prop: "targetProductsName",
          label: "目标产品名称",
          type: 'view',
          minWidth: 160,
        },
        {
          prop: "targetProductDrawingNo",
          label: "目标型号",
          type: 'view',
          minWidth: 350,
        },
        {
          prop: 'targetProductsMainUnit',
          label: '目标单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'targetPackagingMethod',
          label: '目标包装方式',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'num',
          label: '出库数量',
          type: 'input',
          value: '',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate({ type: 'noEmtry', params: [null, (...args) => validErrorMessage(`出库数量`, ...args)] }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate({ type: 'decimal', params: [20, 4, null, (...args) => validErrorMessage(`出库数量`, ...args)] }),
              trigger: 'blur'
            },
            { required: true, trigger: "blur" },
          ],
          change: (val, scope) => {
            const row = scope.row;
            this.calculateTargetNum(row);
          }
        },
        {
          prop: 'unitConversionRatio',
          label: '单位换算比例',
          type: 'input',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate({ type: 'noEmtry', params: [null, (...args) => validErrorMessage(`单位换算比例`, ...args)] }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate({ type: 'decimal', params: [20, 4, null, (...args) => validErrorMessage(`单位换算比例`, ...args)] }),
              trigger: 'blur'
            },
            { required: true, trigger: "blur" },
          ],
          change: (val, scope) => {
            const row = scope.row;
            this.calculateTargetNum(row);
          }
        },
        {
          prop: 'targetNum',
          label: '入库数量',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'productName',
          label: '源产品名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'productCode',
          label: '源产品编码',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'productDrawingNo',
          label: '源型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'mainUnit',
          label: '源单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'storageDate',
          label: '入库日期',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'shelfSpaceName',
          label: '源库位',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'originBatchNumber',
          label: '源批次号',
          type: 'custom',
          customComponent: 'ComSelect-page',
          minWidth: 220,
          renderTree: false,
          listRequestObj: () => {
            return {
              warehouseId: this.dataForm.warehouseId,
              pageNum: 1,
              pageSize: 20,
              orderItems: [
                { asc: false, column: '' }
              ]
            }
          },
          dialogTitle: '选择批次',
          listMethod: getBatchNumber,
          searchList: [
            { prop: 'batchNumber', label: '批次号', type: 'input' },
            { prop: 'shelfSpaceName', label: '库位', type: 'input' }
          ],
          tableItems: [
            { prop: 'storageDate', label: '入库日期', minWidth: 160 },
            { prop: 'batchNumber', label: '批次号', minWidth: 180 },
            { prop: 'shelfSpaceName', label: '库位', minWidth: 120 },
            { prop: 'packagingMethod', label: '包装方式', minWidth: 160 },
            { prop: 'inventoryQuantity', label: '库存数量', minWidth: 160 },
            { prop: 'availableQuantity', label: '可用库存数量', minWidth: 160 },
            { prop: 'occupancyQuantity', label: '占用库存数量', minWidth: 160 },
            { prop: 'remark', label: '备注', minWidth: 100 }
          ],
          change: (val, data, paramsObj) => {
            const _data = data[0].all
            Object.assign(paramsObj.scope.row, _data, {
              originProductsId: _data.productsId,
              originBatchNumber: _data.batchNumber,
              originPackagingMethod: _data.packagingMethod,
            });
          },
          itemRules: [
            {
              validator: this.formValidate({ type: 'noEmtry', params: [null, (...args) => validErrorMessage(`批次`, ...args)] }),
              trigger: 'blur'
            },
            { required: true, trigger: "blur" },
          ]
        },
        {
          prop: 'originPackagingMethod',
          label: '源包装方式',
          type: 'view',
          minWidth: 170,
        },
        {
          prop: 'oil',
          label: '机型',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'accuracyLevel',
          label: '制令号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'saleLineRemark',
          label: '销售备注',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'noticeNum',
          label: '通知数量',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'onlineNum',
          label: '线上数',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'onlineInventoryNum',
          label: '线上库存',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'inventoryQuantity',
          label: '当前库存',
          type: 'view',
          minWidth: 120,
        }
      ];
    },
    async getOrderNoConfig() {
      const { number, modifyFlag, codeWay } = await this.$store.dispatch('base/getOrderNoConfig', 'MSDH')
      this.isOrderNoEditable = codeWay === 'auto' ? !modifyFlag : false
      if (this.btnType === 'add') {
        this.dataForm.orderNo = `${ number }`
      }
    },
    getTitle(type) {
      switch ( type ) {
        case 'add':
          return `创建${ this.title }`
        case 'edit':
          return `编辑${ this.title }`
        case 'look':
          return `查看${ this.title }`
      }
    },
    async loadSourceData() {
      try {
        const res = await getQuotationsendlist(this.sourceDataId)
        const { msg, data } = res
        if (msg === 'Success') {
          const { country, countryName, provinceName, cityName, areaName, address } = data.notice
          this.dataForm = {
            ...this.dataForm,
            ...data.notice,
            ...{
              approvalStatus: '',
              orderNo: '',
            }
          };
          this.linesList = data.noticeLineList.map(item => ({
            ...createEmptyObject(this.linesListItems),
            ...item,
            targetProductsId: item.productsId,
            targetProductsCode: item.productCode,
            targetProductsName: item.productName,
            targetProductDrawingNo: item.productDrawingNo,
            targetProductsMainUnit: item.mainUnit,
            targetPackagingMethod: item.packagingMethod,
            targetShelfSpaceName: item.shelfSpaceName,
            targetBatchNumber: item.batchNumber,
            unitConversionRatio: '1',
            productName: '',
            productCode: '',
            productDrawingNo: '',
            mainUnit: '',
            shelfSpaceName: '',
            originBatchNumber: '',
            originPackagingMethod: '',
            targetNum: this.jnpf.math('multiply', [item.num || 0, 1])
          }))
          this.dataForm.defaultAddress = country === 'CN'
            ? `${ countryName }${ provinceName }${ cityName }${ areaName }${ address }`
            : `${ countryName }${ address }`
        }
      } catch ( err ) {
        this.loading = false
      } finally {
        this.loading = false
      }
    },
    async getDetail(id) {
      try {
        const res = await detaInventorymodalShiftData(id)
        const { msg, data } = res
        if (msg === 'Success') {
          const { shift, shiftLineList } = data
          this.dataForm = shift
          this.linesList = shiftLineList
        }
      } catch ( err ) {
        this.loading = false
      } finally {
        this.loading = false
      }
    },
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
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },
    async handleSubmit(type) {
      this.btnLoading = true
      try {
        await Promise.all([
          this.$refs.dataForm.$refs.main.validate(),
          this.$refs.tableForm.$refs.main.validate()
        ]);

        this.dataForm.documentStatus = type
        const submitLinesList = this.btnType === 'add' ? this.linesList.map(item => ({
          ...item,
          sourceId: this.dataForm.id,
          sourceLineId: item.id
        })) : this.linesList
        const params = {
          shift: this.dataForm,
          shiftLineList: submitLinesList,
          flowData: this.flowData
        }

        let MSG = type === 'draft' ? '保存成功' : '提交成功'
        const apiMethod = this.apiMethodActions[this.btnType]
        const res = await apiMethod(params)
        const { msg } = res

        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }

      } catch ( error ) {
        if (error.message) {
          this.$message.error(error.message)
        }
      } finally {
        this.btnLoading = false
      }
    },
    goBack() {
      this.$emit('close', this.activeType);
    }
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
              <el-page-header @back="$emit('close',false)" :content="title"/>
              <div class="options">
                <template v-if="activeType">
                  <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
                    保存草稿
                  </el-button>
                  <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
                    保存并提交
                  </el-button>
                </template>
                <el-button @click="$emit('close',false)">{{
                    $t('common.cancelButton')
                  }}
                </el-button>
              </div>
            </div>
            <div class="main" v-loading="loading" ref="main">
              <el-tabs v-model="activeName" v-if="!approvalFlag">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                      <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
                                :btnType="btnType"/>
                    </el-collapse-item>
                    <el-collapse-item class="productInfo" title="产品信息" name="productInfo">
                      <div class="TableForm_title">
                      </div>
                      <TableForm-product
                        @input="contentChanges"
                        :value="linesList"
                        :hasToolbar="false"
                        ref="tableForm"
                        :tableItems="linesListItems"
                        :btnType="btnType"
                        :hasActionbar="false"
                        :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: activeType,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true
                      }">
                        <template slot="top">
                          <div class="tableTopContainer">
                            <div class="left">
                              <template v-if="activeType">
                                <el-button type="text" icon="el-icon-delete" class="JNPF-table-delBtn" @click="$refs.tableForm.batchDelete()">批量删除</el-button>
                              </template>
                            </div>
                            <div class="right">
                              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                         @click="$refs.tableForm.$refs.tableRef.showDrawer()"/>
                              </el-tooltip>
                            </div>
                          </div>
                        </template>
                      </TableForm-product>
                      <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
                        <span style="font-weight:500;margin-right:10px">总入库数量：{{ totalTargetNum }}</span>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow">
                  <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId"
                           style="margin-top: 5px;"/>
                </el-tab-pane>
                <el-tab-pane v-if="!activeType && dataForm.approvalFlag" label="流转记录"
                             name="transferList">
                  <recordList :list='flowTaskOperatorRecordList' :endTime='endTime'/>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
