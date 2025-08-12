<script>
import {deepClone} from "@/utils";
import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";
import moment from "moment";
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import {addQuotationsendlist, editQuotationMsendlist, getQuotationdatasenddatalist, getQuotationsendlist} from "@/api/salesManagement";
import {getBasicFormSchema} from "./data";
import {getProducts} from "@/api/masterDataManagement";
import {getcategoryTree} from "@/api/basicData/materialSettings";

export default {
  props: {
    autoInit: {
      type: Boolean,
      default: true,
    },
  },
  name: "createdReturnOrder",
  components: {TableFormProduct},
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '销售退货单',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        exchangeGoodsFlag: false,
        returnDeliveryType: 'back',
        notifyType: 'sale',
        deliveryStatus: 'not_finished',
        orderNo: '',
        partnerName: '',
        partnerCode: '',
        cooperativePartnerId: '',
        deliverDate: '',
        remark: '',
      },
      basicFormSchema: [],
      productRefType: '',
      linesList: [],
      linesListItems: [
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productName',
          label: '产品名称',
          value: '',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'drawingNo',
          label: '产品型号',
          value: '',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          value: '',
          type: 'view',
          minWidth: 90,
        },
        {
          prop: 'outboundQuantity',
          label: '发货数量',
          value: '',
          type: 'view',
          minWidth: 90,
        },
        {
          prop: 'inventoryQuantity',
          label: '库存数量',
          value: '',
          type: 'view',
          minWidth: 90,
        },
        {
          prop: 'deliveryQuantity',
          label: '退货数量',
          type: 'input',
          value: '',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate('noZero', '退货数量不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['退货数量不能为空', (errMsg) => {
                  this.$message.error(`退货数量不能为空`)
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
            {
              validator: this.formValidate({
                type: 'calc',
                params: [
                  (rowIndex, value) => {
                    const row = this.linesList[rowIndex];
                    const maxQuantity = row.noticeId ? row.outboundQuantity : row.inventoryQuantity;
                    return +value <= +maxQuantity;
                  },
                  '',
                  (errMsg, rowIndex) => {
                    const row = this.linesList[rowIndex];
                    const err = row.noticeId ? "不能大于发货数量" : "不能大于库存数量";
                    this.$message.error(`退货清单第${ rowIndex + 1 }行：退货数量${ err }`);
                  }
                ]
              }),
              trigger: 'blur'
            },
            {required: true, message: '退货数量不能为空', trigger: ['blur', 'change'],},
          ]
        },
        {prop: 'remark', label: '备注', value: '', type: 'input', maxlength: 200, minWidth: 160}
      ],
      fileList: [],
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
        listMethod: getProducts,
        tableItems: [
          {prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom'},
          {prop: 'code', label: '产品编码', sortable: 'custom'},
          {prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
          {prop: 'mainUnit', label: '单位', sortable: 'custom'},
          {prop: 'createTime', label: '创建时间', sortable: 'custom'}
        ],
        listRequestObj: {
          partnerName: "",
          productDrawingNo: "",
          productCode: "",
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
            this.$message.error(`请进行选择！`)
            return false
          }
          return true
        },
        searchList: [
          {prop: 'productCode', label: '产品编码', type: 'input'},
          {prop: 'productDrawingNo', label: '产品型号', type: 'input'},
        ]
      },
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      linesTableHeight: 0,
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
      apiMethodActions: {
        add: addQuotationsendlist,
        edit: editQuotationMsendlist,
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
    totalNum() {
      return this.linesList.reduce((sum, item) => sum + (parseFloat(item.deliveryQuantity) || 0), 0);
    }
  },
  // 菜单进入 走activated
  activated() {
    this.btnType = ''
    this.title = '销售退货单'
    this.init('', 'add')
  },
  // 列表操作进入 走created
  created() {
    this.autoInit && this.init('', 'add')
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(id = '', type, approvalFlag = false) {
      this.btnType = type
      this.approvalFlag = approvalFlag
      this.title = this.getTitle(type)
      this.getBusInfo('b027')

      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }
      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => this.refreshTableHeight())
    },
    async getOrderNoConfig() {
      const {number} = await this.$store.dispatch('base/getOrderNoConfig', 'SRDH')
      this.dataForm.orderNo = number
      this.dataForm.deliverDate = moment(new Date()).format('YYYY-MM-DD')
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
        const res = await getQuotationsendlist(id)
        const {msg, data} = res
        if (msg === 'Success') {
          this.dataForm = data.notice
          this.fileList = this.fileListMap('', data.attachmentList)
          this.linesList = data.noticeLineList
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    selectProductRefOpenDialog(type) {
      this.productRefType = type
      if (type === 'documents') {
        this.addProductProps = {
          ...this.addProductProps,
          title: '选择单据',
          renderTree: false,
          tableItems: [
            {prop: 'partnerName', label: '客户名称', minWidth: '220px', sortable: 'custom'},
            {prop: 'productCode', label: '产品编码', minWidth: '220px', sortable: 'custom'},
            {prop: 'productDrawingNo', label: '产品型号', minWidth: '220px', sortable: 'custom'},
            {prop: 'deliverDate', label: '发货日期', minWidth: '180px', sortable: 'custom'},
            {prop: 'outboundQuantity', label: '发货数量', minWidth: '180px', sortable: 'custom'},
          ],
          listRequestObj: {
            ...this.addProductProps.listRequestObj,
          },
          searchList: [...this.addProductProps.searchList, [
            {prop: 'partnerName', label: '客户名称', type: 'input'},
          ]],
        }
      } else {
        this.addProductProps = {
          ...this.addProductProps,
          title: '选择产品',
          renderTree: true,
          tableItems: [
            {prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom'},
            {prop: 'code', label: '产品编码', sortable: 'custom'},
            {prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
            {prop: 'mainUnit', label: '单位', sortable: 'custom'},
            {prop: 'createTime', label: '创建时间', minWidth: '220px', sortable: 'custom'}
          ],
          listRequestObj: {
            ...this.addProductProps.listRequestObj,
          },
          searchList: [
            {prop: 'productCode', label: '产品编码', type: 'input'},
            {prop: 'productDrawingNo', label: '产品型号', type: 'input'},
          ],
        }
      }
      this.addProductProps.listMethod = type === 'documents' ? getQuotationdatasenddatalist : getProducts
      this.$refs.ComSelectProductRef.openDialog()
    },

    createdObj() {
      return this.linesListItems.reduce((acc, item) => {
        acc[item.prop] = '';
        return acc;
      }, {});
    },

    submitAllProduct(id, data) {
      const newData = data.map(item => ({
        ...this.createdObj(),
        ...item.all,
        productName: this.productRefType === 'documents' ? item.all.productName : item.all.name,
        productCode: this.productRefType === 'documents' ? item.all.productCode : item.all.code,
        drawingNo: this.productRefType === 'documents' ? item.all.productDrawingNo : item.all.drawingNo,
        productsId: this.productRefType === 'documents' ? item.all.productsId : item.all.id,
        ...(this.productRefType === 'documents' && {noticeId: item.all.returnDeliveryNoticeId}),
        ...(this.productRefType === 'documents' && {noticeLineId: item.all.id})
      }));

      this.linesList = [...this.linesList, ...newData]
    },

    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
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

    goBack() {
      if ('close' in this.$listeners) {
        this.$emit('close');
      } else {
        setTimeout(() => {
          this.$router.push('/salesManagement/shippingnotice/returnSalesmemo')
        }, 100)
      }
    },

    async handleSubmit(type) {
      if (!this.linesList.length) return this.$message.error('无退货信息')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false
      this.dataForm.documentStatus = type
      const attachmentList = this.fileListMap(type, this.fileList)
      const params = deepClone(this.dataForm)
      if (this.btnType === 'copy') params.id = ''
      let MSG = type === 'draft' ? '保存成功' : '提交成功'
      try {
        const apiMethod = this.apiMethodActions[this.btnType]
        const res = await apiMethod({
          notice: params,
          noticeLineList: this.linesList,
          attachmentList: attachmentList,
          flowData: this.flowData
        },)
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
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main transitionForm org-form">
          <div class="JNPF-common-page-header">
            <el-page-header :class="btnType === 'add' ? 'el-page-header_left_none' : '' " @back="goBack"
              :content="title"/>
            <div class="options">
              <template v-if="activeType">
                <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
                  保存草稿
                </el-button>
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
                  保存并提交
                </el-button>
              </template>
              <el-button v-if="btnType !== 'add'" @click="goBack">{{
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
                  <el-collapse-item class="productInfo"
                    title="退货清单"
                    name="productInfo">
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
                              <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog('documents')">
                                选择单据
                              </el-button>
                              <span>|</span>
                              <el-button type="text" icon="el-icon-plus" @click="selectProductRefOpenDialog('')">选择产品</el-button>
                              <span>|</span>
                              <el-button type="text" icon="el-icon-delete" class="JNPF-table-delBtn"
                                @click="$refs.tableForm.batchDelete()">批量删除
                              </el-button>
                            </template>
                          </div>
                        </div>
                      </template>
                    </TableForm-product>
                    <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;"
                      class="text">
                      <span style="font-weight:500;margin-right:10px">退货数量：{{ totalNum }}</span>
                    </div>
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
      <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false" @change="submitAllProduct"/>
    </div>
  </transition>
</template>

<style scoped lang="scss">
::v-deep .el-page-header_left_none {
  .el-page-header__left {
    display: none;
  }
}
</style>
