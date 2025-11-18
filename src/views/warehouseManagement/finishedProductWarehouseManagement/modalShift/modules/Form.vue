<script>
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import { getBasicFormSchema } from '../pendingTransition/data';
import RecordList from "@/views/workFlow/components/RecordList.vue";
import Process from "@/components/Process/Preview";
import { detaInventorymodalShiftData, InventorymodalShiftdata, updateInventorymodalShift } from "@/api/warehouseManagement/modalShift";
import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";
import { getQuotationsendlist } from "@/api/salesManagement";
import { getWarehouseInfo, getWarehouseList } from "@/api/basicData";

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
          await this.getOrderNoConfig();
          await this.fetchAndSetWarehouseInfo();
          await this.loadSourceData();
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
    totalNum() {
      return this.linesList.reduce((total, item) =>
        this.jnpf.math('add', [total, Number(item.num) || 0]), 0);
    }
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, approvalFlag = false, sourceDataId = '') {
      this.loading = true
      this.btnType = type
      this.sourceDataId = sourceDataId;
      this.approvalFlag = approvalFlag
      this.title = this.getTitle(type)
      this.getBusInfo('b064')
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }
      this.setLinesListItems()
      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
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
          label: '源品名规格',
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
          prop: 'shelfSpaceName',
          label: '源库位',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'originBatchNumber',
          label: '源批次号',
          type: 'view',
          minWidth: 160,
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
        },
        {
          prop: "targetProductCode",
          label: "目标产品编码",
          type: 'view',
          minWidth: 160,
        },
        {
          prop: "targetProductName",
          label: "目标产品名称",
          type: 'view',
          minWidth: 160,
        },
        {
          prop: "targetProductDrawingNo",
          label: "目标品名规格",
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
          prop: 'targetShelfSpaceName',
          label: '目标库位',
          type: 'view',
          render: this.locationEnabled
        },
        {
          prop: 'targetBatchNumber',
          label: '目标批次号',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['', (...args) => validErrorMessage('目标批次号', ...args)]
              }), trigger: 'no'
            },
            { required: true, trigger: 'no' }
          ],
        },
        {
          prop: 'targetInventoryQuantity',
          label: '目标库存数量',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'num',
          label: '出库数量',
          type: 'input',
          minWidth: 160,
          sortable: true,
          itemRules: [
            {
              validator: this.formValidate({ type: 'noEmtry', params: [null, (...args) => validErrorMessage(`出库数量`, ...args)] }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate({ type: 'decimal', params: [20, 4, null, (...args) => validErrorMessage(`出库数量`, ...args)] }),
              trigger: 'blur'
            },
          ]
        },
        {
          prop: 'unitConversionRatio',
          label: '单位换算比例',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate({ type: 'noEmtry', params: [null, (...args) => validErrorMessage(`出库数量`, ...args)] }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate({ type: 'decimal', params: [20, 4, null, (...args) => validErrorMessage(`出库数量`, ...args)] }),
              trigger: 'blur'
            },
          ]
        },
        {
          prop: 'targetNum',
          label: '入库数量',
          type: 'view',
          minWidth: 160,
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
          this.dataForm = { ...this.dataForm, ...data.notice };
          this.linesList = data.noticeLineList.map(item => ({
            ...item,
            urgentNumber: item.urgentNumber || 0,
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
        await this.$refs['dataForm'].$refs.main.validate()

        this.dataForm.documentStatus = type
        const params = {
          shift: this.dataForm,
          shiftLineList: this.linesList,
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
                        <span style="font-weight:500;margin-right:10px">总数量：{{ totalNum }}</span>
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
