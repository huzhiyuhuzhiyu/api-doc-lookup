<script>
import { getBasicFormSchema } from '../data';
import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";
import { editPurchaseOrder, insertPurchaseOrder, purPurchaseOrderdetail } from "@/api/purchasingAndOutsourcingOrders";
import { createEmptyObject } from "@/utils";

export default {
  name: "Form",
  components: { TableFormProduct },
  data() {
    return {
      title: '重收单',
      btnType: '',
      loading: false,
      btnLoading: false,
      isOrderNoEditable: false,
      dataForm: {},
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
        look: async (id) => {
          await this.getDetail(id);
        },
        default: async (sourceData = null) => {
          await this.assignSourceData(sourceData);
          await this.getOrderNoConfig()
        },
      },
      apiMethodActions: {
        add: insertPurchaseOrder,
        resubmit: insertPurchaseOrder,
        edit: editPurchaseOrder,
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    totalPurchaseQuantity() {
      return this.linesList.reduce((total, item) =>
        this.jnpf.math('add', [total, Number(item.purchaseQuantity) || 0]), 0);
    }
  },
  mounted() {
  },
  methods: {
    async init(id = '', type, sourceData = null) {
      this.btnType = type
      this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
      this.setLinesListItems()
      this.title = this.getTitle(type)
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default(sourceData);
      }

      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },
    async assignSourceData(sourceData) {
      if (!sourceData || !Array.isArray(sourceData) || sourceData.length === 0) {
        return;
      }
      const mainData = sourceData[0];
      this.dataForm = {
        ...this.dataForm,
        ...mainData,
        cooperativePartnerCode: mainData.partnerCode,
        cooperativePartnerName: mainData.partnerName,
        cooperativePartnerId: mainData.cooperativePartnerId,
        source: 'return_receipt',
        orderType: 'procure',
      };

      this.linesList = sourceData.map(item => ({
        ...createEmptyObject(this.linesListItems),
        ...item,
        procurementDemandPoolId: item.id,
        ordersId: item.saleOrdersId,
        ordersLineId: item.saleOrdersLineId,
      }));
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
          label: '产品名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'productDrawingNo',
          label: '型号',
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
          prop: 'receivedQuantity',
          label: '退货数量',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'purchaseQuantity',
          label: '收货数量',
          type: 'input',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate({ type: 'noEmtry', params: [null, (...args) => validErrorMessage(`收货数量`, ...args)] }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate({ type: 'decimal', params: [20, 4, null, (...args) => validErrorMessage(`收货数量`, ...args)] }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [(rowIndex, value) => Number(value) <= Number(this.linesList[rowIndex].receivedQuantity), `收货数量不能大于退货数量`, (...args) => validErrorMessage('收货数量', ...args)]
              }), trigger: 'blur'
            },
            { required: true, trigger: "blur" },
          ],
        },
        {
          prop: 'returnReason',
          label: '退货原因',
          type: 'input',
          minWidth: 180
        }
      ]
    },
    async getOrderNoConfig() {
      const { number, modifyFlag, codeWay } = await this.$store.dispatch('base/getOrderNoConfig', 'CGDH')
      this.isOrderNoEditable = codeWay === 'auto' ? !modifyFlag : false
      if (this.btnType === 'add') {
        this.dataForm.orderNo = `${ number }`
      }
    },
    getTitle(type) {
      switch ( type ) {
        case 'add':
        case 'resubmit':
          return `创建${ this.title }`
        case 'edit':
          return `编辑${ this.title }`
        case 'look':
          return `查看${ this.title }`
      }
    },
    async getDetail(id) {
      this.loading = true
      try {
        const res = await purPurchaseOrderdetail(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = Object.assign(this.dataForm, data)
          this.linesList = data.purchaseOrderLineVOList
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
        const params = {
          ...this.dataForm,
          purchaseOrderLines: this.linesList,
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
              <el-tabs v-model="activeName">
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
<!--                              <template v-if="activeType">-->
<!--                                <el-button type="text" icon="el-icon-delete" class="JNPF-table-delBtn" @click="$refs.tableForm.batchDelete()">批量删除</el-button>-->
<!--                              </template>-->
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
                        <span style="font-weight:500;margin-right:10px">总收货数量：{{ totalPurchaseQuantity }}</span>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
