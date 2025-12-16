<script>
import {deepClone, standardizeFields} from "@/utils";
import TableFormProduct from "@/components/no_mount/TableForm-product/index.vue";
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import {getBasicFormSchema} from "./data";
import {getcategoryTree} from "@/api/basicData/materialSettings";
import {getOrganizeInfo} from "@/api/permission/organize";
import {getOrganization} from "@/api/permission/user";
import {mapGetters} from "vuex";
import RecordList from "@/views/workFlow/components/RecordList.vue";
import Process from "@/components/Process/index.vue";
import {addpurProcurementRequire, editpurProcurementRequire, getpurProcurementRequireDetail, purProcurementRequirementsList} from "@/api/purchasingManagement/purchaseInquirySheet";
import {getProductList} from "@/api/basicData/materialFiles";

export default {
  props: {
    autoInit: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'procure',
    },
  },
  name: "createdBuyingRequisition",
  components: {Process, RecordList, TableFormProduct},
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '请购单',
      btnType: '',
      loading: false,
      btnLoading: false,
      userList: [],
      prefillData: [],
      dataForm: {
        type: this.type,
        orderNo: '',
        deliveryDate: '',
        organizeIdTrees: [],
        applicationUserId: '',
        applicationReason: '',
        approvalStatus: ''
      },
      basicFormSchema: [],
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
          prop: 'productDrawingNo',
          label: '产品型号',
          value: '',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productCategoryName',
          label: '产品分类',
          value: '',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          value: '',
          type: 'view',
          minWidth: 90,
        },
        {
          prop: 'material',
          label: '材质',
          value: '',
          type: 'view',
          minWidth: 120,
        },
        {
          prop: 'planQuantity',
          label: '数量',
          type: 'input',
          value: '',
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
            {required: true, message: '数量不能为空', trigger: ['blur', 'change'],},
          ]
        },
        {
          prop: "deliveryDate",
          label: "交货日期",
          value: "",
          type: "date",
          minWidth: 180,
          itemRules: [{required: true, trigger: "blur"}],
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
            classAttribute: '',
            type: 'material'
          },
        },
        listMethod: getProductList,
        tableItems: [
          {prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom'},
          {prop: 'code', label: '产品编码', sortable: 'custom'},
          {prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom'},
          {prop: 'mainUnit', label: '单位', sortable: 'custom'},
          {prop: 'createTime', label: '创建时间', minWidth: '220px', sortable: 'custom'}
        ],
        listRequestObj: {
          partnerName: "",
          productDrawingNo: "",
          productCode: "",
          pageNum: 1,
          pageSize: 20,
          productStatus: 'enable',
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
            this.$message.error(`请选择产品！`)
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
          await this.initOrganizeAndUser();
        },
      },
      apiMethodActions: {
        add: addpurProcurementRequire,
        edit: editpurProcurementRequire,
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    activeType() {
      return this.btnType !== 'look'
    },
    showBackAndCancel() {
      return this.btnType !== 'add' || this.prefillData.length > 0
    }
  },
  // 菜单进入 走activated
  activated() {
    this.btnType = ''
    this.title = '请购单'
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
    async init(id = '', type, approvalFlag = false, prefillData = []) {
      this.btnType = type
      this.approvalFlag = approvalFlag
      this.title = this.getTitle(type)
      this.getBusInfo('b015')

      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
        this.handlePrefillData(prefillData);
      }
      this.dataForm.approvalFlag && this.getFlowDetail(id)
      this.$nextTick(() => this.refreshTableHeight())
    },

    handlePrefillData(prefillData) {
      this.prefillData = prefillData
      if (!prefillData || !prefillData.length) return;
      const productFieldMap = {
        productName: ['code'],
        productCode: ['name'],
        productDrawingNo: ['drawingNo'],
        productsId: ['id'],
      };

      const unifiedData = standardizeFields(prefillData, productFieldMap);

      this.linesList = unifiedData.map(item => ({
        ...this.createdObj(),
        ...item,
        planQuantity: item.planQuantity || '',
        deliveryDate: item.deliveryDate || ''
      }));
    },

    async initOrganizeAndUser() {
      const response = await getOrganizeInfo(this.userInfo.departmentId)
      this.dataForm.organizeIdTrees = response.data.parentId === '-1'
        ? [this.userInfo.departmentId]
        : [...response.data.organizeIdTree, this.userInfo.departmentId];
      this.dataForm.applicationDepartmentId = this.userInfo.departmentId
      await this.fetchOrganization()
      this.dataForm.applicationUserId = this.userInfo.userId
    },

    async getOrderNoConfig() {
      const {number, codeWay, modifyFlag} = await this.$store.dispatch('base/getOrderNoConfig', 'QGD')
      this.basicFormSchema = this.basicFormSchema.map(item => {
        if (item.prop === 'orderNo') {
          item.disabled = !(codeWay === 'auto' && modifyFlag)
        }
        return item
      })
      this.dataForm.orderNo = number
    },

    async fetchDepartment() {
      const res = await getOrganizeInfo(this.dataForm.applicationDepartmentId);
      this.dataForm.organizeIdTrees = [...res.data.organizeIdTree, this.dataForm.applicationDepartmentId]
      await this.$nextTick()
      this.$refs.tableForm.setDefaultValue()
    },

    async fetchOrganization() {
      try {
        const params = {
          keyword: "",
          organizeId: this.dataForm.applicationDepartmentId
        };
        const res = await getOrganization(params);
        this.userList = res.data?.length
          ? res.data.map(item => ({
            ...item,
            label: item.fullName?.split('/')[0] || '',
            value: item.id
          }))
          : [];
      } finally {
        this.loading = false
      }
    },

    getTitle(type) {
      this.title = this.type === 'factory' ? '工厂请购单' : this.title
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
      this.loading = true;
      try {
        const [detailRes, requirementsRes] = await Promise.all([
          getpurProcurementRequireDetail(id),
          purProcurementRequirementsList(id)
        ]);

        if (detailRes.msg === 'Success') {
          this.dataForm = detailRes.data;
          this.fileList = this.fileListMap('', detailRes.data.attachmentList);
        }

        if (requirementsRes.msg === 'Success') {
          this.linesList = requirementsRes.data;
        }

        await Promise.all([
          this.fetchDepartment(),
          this.fetchOrganization()
        ]);
      } finally {
        this.loading = false;
      }
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
        productName: item.all.name,
        productCode: item.all.code,
        productDrawingNo: item.all.drawingNo,
        productsId: item.all.id,
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
            businessType: 'system_attachment',
            configKey: 'fj_qgd',
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
        this.$emit('close', this.activeType);
      } else {
        const path = this.type === 'factory' ? '/purchasingManagement/factoryPurchase/myFactoryPurchaseOrder' : '/purchasingManagement/purchasingDemand/myBuyingRequisition'
        setTimeout(() => {
          this.$router.push(path)
        }, 100)
      }
    },

    async handleSubmit(type) {
      if (!this.linesList.length) return this.$message.error('无产品信息')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false
      this.dataForm.documentStatus = type
      const attachmentList = this.fileListMap(type, this.fileList)
      const params = deepClone(this.dataForm)
      let MSG = type === 'draft' ? '保存成功' : '提交成功'
      try {
        const apiMethod = this.apiMethodActions[this.btnType]
        const res = await apiMethod({
          purProcurementRequirements: params,
          lines: this.linesList,
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
    <div class="JNPF-common-layout JNPF-preview-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main transitionForm org-form">
          <div class="JNPF-common-page-header">
            <el-page-header :class="!showBackAndCancel ? 'el-page-header_left_none' : '' " @back="$emit('close',false)"
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
              <el-button v-if="showBackAndCancel" @click="$emit('close',false)">{{
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
                    title="产品信息"
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
                              <el-button type="text" icon="el-icon-plus" @click="$refs.ComSelectProductRef.openDialog()">选择产品</el-button>
                              <span>|</span>
                              <el-button type="text" icon="el-icon-delete" class="JNPF-table-delBtn"
                                @click="$refs.tableForm.batchDelete()">批量删除
                              </el-button>
                            </template>
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
