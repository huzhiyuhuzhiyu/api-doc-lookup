<script>
import { getBasicFormSchema } from "./data";
import { addStockChangePackage } from "@/api/stockChangePackage";
import { standardizeFields } from "@/utils";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";

import RecordList from "@/views/workFlow/components/RecordList.vue";
import Process from "@/components/Process/index.vue";

export default {
  name: "Form",
  components: { Process, RecordList, TableFormProduct },
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '重检单',
      btnType: '',
      loading: false,
      btnLoading: false,
      isOrderNoEditable: false,
      dataForm: {
        orderNo: '',
        approvalFlag: false,
        changePackageType: 'flipping',
        documentStatus: 'submit',
      },
      basicFormSchema: [],
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
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          minWidth: 170,
          options: this.getDictDataSync('packaging'),
        },
        {
          prop: 'num',
          label: `数量`,
          type: 'input',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate('noZero', '数量不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['数量不能为空', (errMsg) => {
                  this.$message.error(`数量不能为空`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg) => {
                  this.$message.error(errMsg)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            { required: true, message: '数量不能为空', trigger: ['blur', 'change'], },
          ]
        },
      ],
      linesTableHeight: 0,

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      actions: {
        look: async (id) => {
        },
        default: async (prefillData) => {
          this.defaultInit(prefillData);
          await this.getOrderNoConfig();
        },
      },
      apiMethodActions: {
        add: addStockChangePackage
      },

      productFieldMap: {
        productsName: ['productsName', 'productName'],
        productsCode: ['productsCode', 'productCode'],
        drawingNo: ['productsDrawingNo', 'productDrawingNo', 'drawingNo'],
        productsId: ['productsId', 'productId'],
        num: ['inventoryQuantity'],
        sourceId: ['id'],
        sourceLineId: ['id'],
        inventoryLineId: ['id'],
        id: {
          value: ''
        }
      },
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, approvalFlag = false, prefillData = []) {
      this.loading = true
      this.btnType = type
      this.title = this.getTitle(type)
      this.getBusInfo('b0128')
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default(prefillData);
      }

      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
        this.loading = false
      })
    },
    async defaultInit(prefillData) {
      this.dataForm.sourceId = prefillData[0].id
      this.linesList = standardizeFields(prefillData, this.productFieldMap)
    },
    async getOrderNoConfig() {
      const { number, modifyFlag, codeWay } = await this.$store.dispatch('base/getOrderNoConfig', 'CJDH')
      this.isOrderNoEditable = codeWay === 'auto' ? !modifyFlag : false
      if (this.btnType === 'add') {
        this.dataForm.orderNo = `${ number }`
      }
    },
    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const formRegionRef = this.$refs.dataFormRegion

      let maxHeight = mainRef.clientHeight - formRegionRef.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },
    getTitle(type) {
      switch ( type ) {
        case 'add':
          return `生成${ this.title }`
        case 'look':
          return `查看${ this.title }`
      }
    },
    async getDetail(id) {
      // this.loading = true
      // try {
      //   const res = await (id)
      //   const { msg, data } = res
      //   if (msg === 'Success') {
      //     this.dataForm = data.notice
      //     this.linesList = data.noticeLineList
      //     this.loading = false
      //   }
      // } catch ( err ) {
      //   this.loading = false
      // }
    },
    deleteLines(scope) {
      this.linesList.splice(scope.$index, 1)
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex));
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value;
      }
    },
    async handleSubmit() {
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false
      const deepDataForm = {
        ...this.dataForm,
        ...this.flowData
      }
      const params = {
        stockChangePackage: deepDataForm,
        stockChangePackageLineList: this.linesList,
        stockChangePackageWarehouseLineList: this.linesList,
      }
      let MSG = '提交成功'
      try {
        const res = await this.apiMethodActions[this.btnType](params)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch ( error ) {
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
    <div class="JNPF-preview-main transitionForm">
      <div class="JNPF-common-page-header">
        <el-page-header @back="$emit('close',false)" :content="title"/>
        <div class="options">
          <template v-if="activeType">
            <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
              保存
            </el-button>
          </template>
          <el-button @click="$emit('close',false)">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="loading" ref="main">
        <el-tabs v-model="activeName" v-if="!approvalFlag">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType"/>
              </el-collapse-item>
              <el-collapse-item class="productInfo" title="产品信息" name="productInfo">
                <TableForm-product
                  @input="contentChanges"
                  :value="linesList"
                  :hasToolbar="false"
                  ref="tableForm"
                  :tableItems="linesListItems"
                  :btnType="btnType"
                  @deleteth="deleteLines"
                  :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: btnType,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }"
                >
                  <template slot="top">
                    <div class="tableTopContainer">
                      <div class="left">
                        <template v-if="activeType">
                          <el-button :disabled="!linesList.length" type="text" icon="el-icon-delete" class="JNPF-table-delBtn" @click="$refs.tableForm.batchDelete()">批量删除
                          </el-button>
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
        <el-collapse v-else v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
            <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType"/>
          </el-collapse-item>
          <el-collapse-item class="productInfo" title="产品信息" name="productInfo">
            <TableForm-product
              @input="contentChanges"
              :value="linesList"
              :hasToolbar="false"
              ref="tableForm"
              :tableItems="linesListItems"
              :btnType="btnType"
              @deleteth="deleteLines"
              :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: btnType,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }"
            >
              <template slot="top">
                <div class="tableTopContainer">
                  <div class="left">
                    <template v-if="activeType">
                      <el-button :disabled="!linesList.length" type="text" icon="el-icon-delete" class="JNPF-table-delBtn" @click="$refs.tableForm.batchDelete()">批量删除
                      </el-button>
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
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </transition>
</template>
