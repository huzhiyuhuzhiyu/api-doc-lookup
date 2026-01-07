<script>
import {deepClone} from "@/utils";
import {getBasicFormSchema} from "./data";
import {addBusinessComponent, getBusinessComponent, updateBusinessComponent} from "@/api/assemblyMaintenance";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import {getcategoryTree} from "@/api/basicData/materialSettings";
import {getProductList} from "@/api/masterDataManagement/productManage";

export default {
  name: "Form",
  components: {TableFormProduct},
  data() {
    return {
      title: '组合件',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        name: '',
        cooperativePartnerId: '',
        cooperativePartnerName: '',
        cooperativePartnerCode: '',
      },
      basicFormSchema: getBasicFormSchema(this.$refs.dataForm, this),
      linesList: [],
      linesListItems: [
        {
          prop: 'productsName',
          label: '产品名称',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'productsCode',
          label: '产品编码',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'productsDrawingNo',
          label: '型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'qty',
          label: '比例',
          type: 'input',
          value: '',
          minWidth: 120,
          itemRules: [
            {
              validator: this.formValidate('noZero', '比例不能为0', (errMsg,rowIndex) => {
                this.$message.error(`产品信息第${ rowIndex + 1 }行：${ errMsg }`)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['比例不能为空', (errMsg, rowIndex) => {
                  this.$message.error(`产品信息第${ rowIndex + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg,rowIndex) => {
                  this.$message.error(`产品信息第${ rowIndex + 1 }行：比例${ errMsg }`)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            {required: true, message: '比例不能为空', trigger: ['blur', 'change'],},
          ]
        },
      ],
      linesTableHeight: 0,
      addProductProps: {
        title: '选择产品',
        activeType: '',
        renderTree: true,
        multiple: true,
        treeTitle: '产品分类',
        methodArr: {
          method: getcategoryTree,
          requestObj: {
            classAttribute: ''
          },
        },
        listMethod: getProductList,
        tableItems: [
          {prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom'},
          {prop: 'code', label: '产品编码', sortable: 'custom'},
          {prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
          {prop: 'mainUnit', label: '单位', sortable: 'custom'},
          {prop: 'createTime', label: '创建时间', sortable: 'custom'}
        ],
        listRequestObj: {
          hsProductsId: "",
          productCode: "",
          productName: "",
          productDrawingNo: "",
          productStatus: 'enable',
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
        beforeSubmit: (data, paramsObj) => {
          if (!data || !data.length) {
            this.$message.error(`请进行产品选择！`)
            return false
          }
          return true
        },
        searchList: [
          {prop: 'productName', label: '产品名称', type: 'input'},
          {prop: 'productCode', label: '产品编码', type: 'input'},
          {prop: 'productDrawingNo', label: '型号', type: 'input'},
        ]
      },

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      actions: {
        edit: async (id) => {
          await this.getDetail(id);
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        copy: async (id) => {
          await this.getDetail(id);
        },
        default: async () => {
        },
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
  methods: {
    async init(id = '', type) {
      this.btnType = type
      this.title = this.getTitle(type)
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

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    selectProductRefOpenDialog() {
      this.$refs.ComSelectProductRef.openDialog()
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },

    async submitAllProduct(id, data) {
      const newData = data.map(item => ({
        ...item.all,
        productsName: item.name,
        productsCode: item.code,
        productsDrawingNo: item.drawingNo,
        productsId: item.id,
        qty: 1
      }))
      this.linesList = [...this.linesList, ...newData]
    },

    getTitle(type) {
      switch (type) {
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
        const res = await getBusinessComponent(id)
        const {msg, data} = res
        if (msg === 'Success') {
          this.dataForm = data.businessComponent
          this.linesList = data.businessComponentLineList
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    async handleSubmit() {
      if (!this.linesList.length) return this.$message.error('无产品信息，请添加产品！')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      if (!valid_1) return this.btnLoading = false
      const deepParams = deepClone(this.dataForm)
      const params = {
        businessComponent: deepParams,
        businessComponentLineList: this.linesList
      }
      let MSG = '提交成功'
      try {
        const apiMethod = this.dataForm.id ? updateBusinessComponent : addBusinessComponent
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
              <el-page-header @back="goBack" :content="title"/>
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
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                      <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
                        :btnType="btnType"/>
                    </el-collapse-item>
                    <el-collapse-item class="productInfo"
                      title="产品信息"
                      name="productInfo">
                      <div class="TableForm_title">
                      </div>
                      <TableForm-product
                        @input="contentChanges"
                        :value="linesList"
                        :hasToolbar="false"
                        ref="tableForm" :tableItems="linesListItems"
                        :btnType="btnType"
                        :hasActionbar="false"
                        :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: activeType,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                    }">
                        <template slot="top">
                          <div class="tableTopContainer">
                            <div class="left">
                              <template v-if="activeType">
                                <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog">选择产品</el-button>
                                <span>|</span>
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
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false" @change="submitAllProduct"/>
    </div>
  </transition>
</template>
