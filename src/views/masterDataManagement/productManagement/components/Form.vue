<script>
import { createEmptyObject, deepClone, standardizeFields } from "@/utils";
import { getBasicFormSchema } from "@/views/masterDataManagement/productManagement/components/data";
import { addProduct, detailProduct, updateProductData } from "@/api/masterDataManagement/productManage";
import { getUnitData } from "@/api/basicData/materialSettings";
import { getcategoryTrees } from "@/api/salesManagement/assemblyOrders";
import { getCooperativeData } from "@/api/basicData";

import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";

export default {
  name: "Form",
  components: { TableFormProduct },
  props: {
    classAttribute: {
      type: String,
      default: ''
    },
    productName: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      title: this.productName,
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        classAttribute: this.classAttribute,
        name: '',
        code: '',
        drawingNo: '',
        material: '',
        insideDiameter: '',
        externalDiameter: '',
        width: '',
        hoseInternalDiameter: '',
        hoseOd: '',
        grossWeight: '',
        mainUnit: '套',
        productionLineId: '',
        productCategoryId: '',
        productCategoryName: '',
        hsProductsId: '',
        routingId: '',
        routingName: '',
        productSource: 'assemble',
        sealingCoverTyping: '',
        remark: '',
      },
      basicFormSchema: [],
      linesList: [],
      linesListItems: [
        {
          prop: "cooperativePartnerName",
          label: "客户",
          value: "",
          type: "custom",
          customComponent: "ComSelect-page",
          itemRules: [{ required: true, trigger: "change" }],
          title: '选择客户',
          treeTitle: '客户分类',
          renderTree: true,
          multiple: false,
          clearable: true,
          methodArr: { method: getcategoryTrees, requestObj: { type: 'customer' } },
          listMethod: getCooperativeData,
          tableItems: [
            { prop: 'code', label: '客户编码', minWidth: 180, sortable: 'custom' },
            { prop: 'name', label: '客户名称', minWidth: 180, sortable: 'custom' },
            { prop: 'nameEn', label: '英文名称', minWidth: 180, sortable: 'custom' },
            { prop: 'taxId', label: '税号', minWidth: 120, sortable: 'custom' }
          ],
          listRequestObj: {
            code: '',
            name: '',
            type: 'customer',
            partnerCategoryId: '',
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              {
                asc: false,
                column: ''
              },
              {
                asc: false,
                column: 'create_time'
              }
            ]
          },
          searchList: [
            { prop: 'code', label: '供应商编码', type: 'input' },
            { prop: 'name', label: '供应商名称', type: 'input' }
          ],
          change: (val, data, paramsObj) => {
            if (!data.length) return

            const index = paramsObj.scope.$index
            const row = paramsObj.scope.row
            const _data = data[0]
            row.cooperativePartnerId = _data.id;
            row.cooperativePartnerName = _data.name;

            this.$nextTick(() => {
              this.$refs.dataForm.$refs.main.validateField(`data.${ index }.cooperativePartnerName`);
            });
          },
          treeNodeClick: (data, node, listQuery) => {
            if (listQuery.partnerCategoryId === data.id) return listQuery
            listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
            listQuery.classAttribute = data.classAttribute
            return listQuery
          },
          minWidth: 220,
        },
        {
          prop: 'customerProductNo',
          label: '客户料号（编码）',
          type: 'input',
          minWidth: 220,
          itemRules: [{ required: true, trigger: "blur" }],
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户型号',
          type: 'input',
          minWidth: 220,
        },
        {
          prop: 'customerProductName',
          label: '客户产品名称',
          type: 'input',
          minWidth: 220,
        }
      ],
      linesTableHeight: 0,
      fileList: [],
      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      approvalFlag: false,
      actions: {
        edit: async (id) => {
          await this.getDetail(id);
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        copy: async (id) => {
          await this.getDetail(id);
          await this.getOrderNoConfig();
        },
        default: async () => {
          await this.getOrderNoConfig();
        },
      },

      standardizeFields: {
        cooperativePartnerName: { from: 'partnerName' },
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
  },
  created() {
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, approvalFlag = false) {
      this.btnType = type
      this.approvalFlag = approvalFlag
      this.title = this.getTitle(type)
      await this.getUnitData()
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },
    async getUnitData() {
      const response = await getUnitData({ pageNum: 1, pageSize: 100 });
      this.basicFormSchema = this.basicFormSchema.map(item => {
        if (item.prop === 'mainUnit') {
          item.options = response.data.records.map(unit => ({
            label: unit.name,
            value: unit.name
          }))
        }
        return item
      })
    },
    async getOrderNoConfig() {
      const { number, modifyFlag } = await this.$store.dispatch('base/getOrderNoConfig', 'CPBM')
      this.basicFormSchema = this.basicFormSchema.map(item => {
        if (item.prop === 'code') {
          item.itemDisabled = !modifyFlag
        }
        return item
      })
      this.dataForm.code = number
    },
    getTitle(type) {
      switch ( type ) {
        case 'add':
        case 'copy':
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
        const res = await detailProduct(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = data
          this.linesList = standardizeFields(data?.partnerProductVoList || [], this.standardizeFields)
          this.fileList = this.fileListMap('', data.attachmentList)
          this.loading = false
        }
      } catch ( err ) {
        this.loading = false
      }
    },

    addLineForm() {
      this.linesList.push(createEmptyObject(this.linesListItems));
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex));
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value;
      }
    },

    deleteLines(scope) {
      this.linesList.splice(scope.$index, 1)
    },

    fileListMap(type, fileList) {
      if (!fileList && !fileList?.length) return
      if (['submit', 'draft'].includes(type)) {
        return fileList.map((item, index) => ({
          ...item,
          bimAttachments: {
            businessType: '',
            configKey: '',
            documentId: item.id,
            fileFlag: '',
            sort: index
          }
        }))
      } else {
        return fileList.map((item, index) => ({
          ...item,
          name: item.document.fullName,
          fileSize: item.document.fileSize,
          filename: item.document.filePath,
          id: item.document.id,
          url: item.url
        }))
      }

    },
    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 100 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    async handleSubmit() {
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      if (!valid_1) return this.btnLoading = false

      const params = {
        ...deepClone(this.dataForm),
        attachmentList: this.fileListMap('submit', this.fileList),
        cooperativePartnerProductList: this.linesList
      };

      if (this.btnType === 'copy') params.id = ''
      let MSG = '提交成功'
      try {
        const apiMethod = params.id ? updateProductData : addProduct
        const res = await apiMethod(params)
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
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main transitionForm org-form">
            <div class="JNPF-common-page-header">
              <el-page-header :class="btnType === 'add' ? 'el-page-header_left_none' : '' " @back="goBack"
                              :content="title"/>
              <div class="options">
                <template v-if="activeType">
                  <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
                    保存并提交
                  </el-button>
                </template>
                <el-button @click="goBack">{{
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
                    <el-collapse-item class="productInfo" title="客户型号信息" name="productInfo">
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
                        hasC: activeType,
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
                                <el-button type="text" icon="el-icon-plus" @click="addLineForm">新增一行</el-button>
                                <span>|</span>
                                <el-button :disabled="!linesList.length" type="text" icon="el-icon-delete" class="JNPF-table-delBtn" @click="$refs.tableForm.batchDelete()">
                                  批量删除
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
                <el-tab-pane label="附件" name="annex">
                  <UploadWj v-model="fileList" :disabled="!activeType" :detailed="!activeType"></UploadWj>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
