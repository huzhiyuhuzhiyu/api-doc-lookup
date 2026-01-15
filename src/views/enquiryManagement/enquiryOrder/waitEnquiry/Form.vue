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
                  <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
                    保存草稿
                  </el-button>
                  <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
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
              <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                  <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType"/>
                </el-collapse-item>
                <el-collapse-item class="productInfo" title="产品信息" name="productInfo">
                  <div class="TableForm_title" v-if="activeType">
                    <div class="cooperative-style">
                      <span class="lable-style">供应商：</span>
                      <el-select v-model="supplierCode" @change="(val) => changeSupplier(val,'all')" placeholder="请选择供应商"
                                 style="width: 100%;">
                        <el-option v-for="(item, index) in supplierOption" :key="index" :label="item.text"
                                   :value="item.value"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <TableForm-product v-loading="productLoading" @input="contentChanges" :value="linesList"
                                     :hasToolbar="false" ref="tableForm" :tableItems="linesListItems" :btnType="btnType"
                                     :hasActionbar="false" :tableProps="{
                      is: 'JNPF-table',
                      fixedNO: true,
                      hasC: activeType,
                      height: linesTableHeight,
                      rowKey: 'id',
                      defaultExpandAll: true,
                      customColumn: true,
                    }">
                    <template #actions>
                      <el-table-column label="操作" width="120" :fixed="fixedA ? 'right' : false" v-if="activeType"
                                       key="actionBar">
                        <template slot-scope="scope">
                          <el-button type="text" @click="copyLProduct(scope)">复制</el-button>
                          <el-button type="text" class="JNPF-table-delBtn"
                                     @click="deleteLine(scope.row, scope.$index)">删除
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
      <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false"
                      @change="submitAllProduct"/>
    </div>
  </transition>
</template>
<script>
import { deepClone } from "@/utils";
import { getBasicFormSchema } from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { getcategoryTree } from "@/api/basicData/materialSettings";
import { getOrganization } from "@/api/permission/user";
import { getOrganizeInfo } from "@/api/permission/organize";
import { mapGetters } from "vuex";
import flowMixin from "@/mixins/generator/flowMixin";
import busFlow from "@/mixins/generator/busFlow";
import { getcooperativeProduct, uploadProduct } from "@/api/salesManagement/assemblyOrders";
import { getProducts } from "@/api/masterDataManagement";
import { getQuotationInfo } from "@/api/salesManagement/index";
import { submitWaitEnquiryData } from '@/api/enquiryManagement/waitEnquiry'
import { getEnquiryManagementInfo, getEnquiryManagementList } from '@/api/enquiryManagement/index'

export default {
  name: "Form",
  components: { TableFormProduct },
  mixins: [flowMixin, busFlow],
  data() {
    return {
      title: '待询价',
      btnType: '',
      loading: false,
      btnLoading: false,
      showDialog: false,
      departments: [],
      salesList: [],
      globalPackagingMethod: '',
      globalBrand: '',
      originalFormData: {},
      dataForm: {
        orderNo: '',
        orderType: '',
        departments: [],
        cooperativePartnerId: '',
        cooperativePartnerName: '',
        cooperativePartnerCode: '',
        departmentId: '',
        salesId: '',
        orderDate: '',
        deliveryDate: '',
        inquiryTime: '',
        remark: '',
        remark1: '',
      },
      fileList: [],
      basicFormSchema: [],
      linesList: [],
      linesListItems: [],
      lookLinesListItems: [
        {
          prop: 'productCode',
          label: '产品型号',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'drawingNo',
          label: '客户型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'view',
          minWidth: 160,
        },
      ],
      linesTableHeight: 0,
      uploadProduct,
      addProductProps: {
        title: '选择产品',
        activeType: '',
        renderTree: false,
        multiple: true,
        treeTitle: '产品分类',
        methodArr: {
          method: getcategoryTree,
          requestObj: {
            classAttribute: ''
          },
        },
        listMethod: getcooperativeProduct,
        tableItems: [
          { prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom' },
          { prop: 'code', label: '产品编码', sortable: 'custom' },
          { prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom' },
          { prop: 'mainUnit', label: '单位', sortable: 'custom' },
          { prop: 'createTime', label: '创建时间', sortable: 'custom' }
        ],
        listRequestObj: {
          productCode: "",
          productName: "",
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
          { prop: 'productName', label: '产品名称', type: 'input' },
          { prop: 'productCode', label: '产品编码', type: 'input' },
        ]
      },

      approvalFlag: false,
      flowData: {},
      flowTemplateJson: {},
      flowTaskOperatorRecordList: [],

      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      actions: {
        edit: async (id) => {
          await this.getDetail(id);
          this.setTableItems('edit'); // 重新设置表格属性
        },
        look: async (id) => {
          await this.getDetail(id);
          this.setTableItems('look');
        },
      },
      supplierCode: '',
      supplierOption: [],
      editFormListItems: [
        {
          prop: 'numStr',
          label: '数量',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'sampleNumStr',
          label: '样品数',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'sampleAmounts',
          label: '样品报价',
          type: 'input',
          minWidth: 180,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ["样品报价不能为空", (errMsg, index) => {
                  this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate('positiveNumber', '样品报价必须大于0', (errMsg, index) => {
                this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
              }), trigger: 'blur'
            }]
        },
        {
          prop: 'procurementAmounts',
          label: '采购价',
          type: 'input',
          minWidth: 180,
          itemRules: [{
            validator: this.formValidate({
              type: 'noEmtry', params: ["采购价不能为空", (errMsg, index) => {
                this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
              }]
            }), trigger: 'blur'
          },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate('positiveNumber', '采购价必须大于0', (errMsg, index) => {
                this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
              }), trigger: 'blur'
            }]
        },
        {
          prop: 'moldAmounts',
          label: '模具费',
          type: 'input',
          minWidth: 180,
          itemRules: [{
            validator: this.formValidate({
              type: 'noEmtry', params: ["模具费不能为空", (errMsg, index) => {
                this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
              }]
            }), trigger: 'blur'
          },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate('positiveNumber', '模具费必须大于0', (errMsg, index) => {
                this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
              }), trigger: 'blur'
            }]
        },
        {
          prop: 'minNumStr',
          label: '起订量',
          type: 'input',
          minWidth: 180,
          itemRules: [{
            validator: this.formValidate({
              type: 'noEmtry', params: ["起订量不能为空", (errMsg, index) => {
                this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
              }]
            }), trigger: 'blur'
          },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate('positiveNumber', '起订量必须大于0', (errMsg, index) => {
                this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
              }), trigger: 'blur'
            }]
        },
        {
          prop: 'deliveryDate',
          label: '交期',
          type: 'input',
          minWidth: 180,
          itemRules: [{
            validator: this.formValidate({
              type: 'noEmtry', params: ["交期不能为空", (errMsg, index) => {
                this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
              }]
            }), trigger: 'blur'
          },
            { required: true, trigger: 'blur' }]
        },
      ],
      formData: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
        quotationId: "",
        quotationNo: "",
        cooperativePartnerIdText: "",
        deliver: "",
        bidder: "",
        approvalStatus: '',
        documentStatus: "",
        submitStartDate: '',
        submitEndDate: '',
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      },
      productLoading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
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
    async getSupplierQuotationForSingle(product, id) {
      try {
        const response = await getEnquiryManagementInfo(id);
        const { inquiryLineList } = response.data;

        if (!inquiryLineList || !inquiryLineList.length) {
          this.$message.warning('该供应商暂无报价信息');
          return null;
        }

        return inquiryLineList.find(line => line.quotationLineId === product.id);
      } catch ( error ) {
        console.error('获取供应商报价信息失败:', error);
        return null;
      }
    },

    async getEnquiryManagementInfo(id) {
      try {
        const response = await getEnquiryManagementInfo(id);
        const { inquiryLineList } = response.data;

        if (!inquiryLineList || !inquiryLineList.length) {
          this.$message.warning('该供应商暂无报价信息');
          return [];
        }

        return inquiryLineList;
      } catch ( error ) {
        console.error('获取供应商报价信息失败:', error);
        return [];
      }
    },

    // 改变供应商
    async changeSupplier(val, scope) {
      const selectedSupplier = this.supplierOption.find(item => item.value === val);

      if (!selectedSupplier) return;

      if (scope === 'all') {
        this.linesList.forEach(element => {
          element.cooperativePartnerId = val;
        });

        const inquiryLineList = await this.getEnquiryManagementInfo(selectedSupplier.id);

        if (inquiryLineList.length > 0) {
          let updatedCount = 0;

          this.linesList.forEach(product => {
            const matchedLine = inquiryLineList.find(line => line.quotationLineId === product.id);

            if (matchedLine) {
              product.sampleAmounts = matchedLine.sampleAmounts;
              product.procurementAmounts = matchedLine.procurementAmounts;
              product.moldAmounts = matchedLine.moldAmounts;
              product.minNumStr = matchedLine.minNumStr;
              product.deliveryDate = matchedLine.deliveryDate;
              product.material = matchedLine.material;
              product.remark1 = matchedLine.remark1;
              updatedCount++;
            }
          });

          if (updatedCount > 0) {
            this.$message.success(`已加载该供应商的报价信息，成功更新${ updatedCount }条产品`);
          } else {
            this.$message.warning('未找到匹配的报价信息');
          }
        }
      } else {
        const row = scope.row;
        const index = scope.$index;
        this.linesList[index].cooperativePartnerId = val;

        const matchedLine = await this.getSupplierQuotationForSingle(row, selectedSupplier.id);

        if (matchedLine) {
          this.linesList[index].sampleAmounts = matchedLine.sampleAmounts;
          this.linesList[index].procurementAmounts = matchedLine.procurementAmounts;
          this.linesList[index].moldAmounts = matchedLine.moldAmounts;
          this.linesList[index].minNumStr = matchedLine.minNumStr;
          this.linesList[index].deliveryDate = matchedLine.deliveryDate;
          this.linesList[index].material = matchedLine.material;
          this.linesList[index].remark1 = matchedLine.remark1;

          this.$message.success('已加载该供应商的报价信息');
        }
      }
    },

    // 获取供应商下拉框
    async getSupplierOption() {
      try {
        const res = await getEnquiryManagementList(this.formData)
        const records = res.data.records
        let supplierOption = []
        if (records?.length) {
          records.forEach(element => {
            const findIndex = supplierOption.findIndex(item => item.supplierCode === element.supplierCode)
            if (findIndex === -1) {
              supplierOption.push({
                ...element,
                label: element.supplierName,
                text: element.supplierName,
                value: element.cooperativePartnerId,
                disabled: false,
              })
            }
          })
        }
        this.supplierOption = supplierOption

        // 为供应商列添加change事件处理器
        const supplierColumn = {
          type: 'select',
          prop: 'cooperativePartnerId',
          label: '供应商',
          minWidth: '220px',
          options: supplierOption,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ["供应商不能为空", (errMsg, index) => {
                  this.$message.error(`产品信息第${ index + 1 }行：${ errMsg }`)
                }]
              }), trigger: 'change'
            },
            { required: true, trigger: 'change' }
          ],
          change: (val, scope) => this.changeSupplier(val, scope)
        }

        // 将供应商列插入到表格列配置中
        const supplierIndex = this.linesListItems.findIndex(item => item.prop === 'supplierCode' || item.prop === 'cooperativePartnerId')
        if (supplierIndex === -1) {
          this.linesListItems.splice(0, 0, supplierColumn)
        }
      } catch ( error ) {
        console.error(error)
      } finally {
        this.productLoading = false
      }
    },

    // 重置表格属性
    setTableItems(type) {
      let linesListItems = deepClone(this.lookLinesListItems)
      if (type === 'edit') {
        this.productLoading = true
        // 获取供应商下拉框
        this.getSupplierOption()
        const remarkIndex = linesListItems.findIndex(item => item.prop === 'remark')
        linesListItems.splice(remarkIndex, 0, ...this.editFormListItems)
      }
      this.linesListItems = linesListItems
    },

    // 删除
    deleteLine(row, index) {
      // 判断行数 至少保留一条数据
      if (this.linesList.length <= 1) {
        this.$message.warning('至少保留一条数据')
        return
      }
      this.$confirm(`是否删除该行？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.linesList.splice(index, 1)
      })
    },

    // 复制一行数据
    copyLProduct(scope) {
      this.linesList.push(deepClone(scope.row))
    },

    async init(id = '', type) {
      this.btnType = type
      this.title = this.getTitle(type)
      this.getBusInfo('b025')
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

    async fetchDepartment() {
      const res = await getOrganizeInfo(this.dataForm.departmentId);
      this.dataForm.departments = [...res.data.organizeIdTree, this.dataForm.departmentId]
      await this.$nextTick()
      this.$refs.tableForm.setDefaultValue()
    },

    async fetchOrganization() {
      try {
        const params = {
          keyword: "",
          organizeId: this.dataForm.departmentId
        };
        const res = await getOrganization(params);
        this.salesList = res.data?.length
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

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    createdObj() {
      return this.linesListItems.reduce((acc, item) => {
        acc[item.prop] = '';
        return acc;
      }, {});
    },

    addLineForm() {
      this.linesList.push(this.createdObj());
    },

    selectProductRefOpenDialog(type) {
      if (type === 'customer') {
        if (!this.dataForm.cooperativePartnerId) return this.$message.error("请先选择客户")
        this.addProductProps = {
          ...this.addProductProps,
          renderTree: false,
          tableItems: [
            { prop: 'customerProductNo', label: ' 客户料号', fixed: 'left' },
            { prop: 'customerProductName', label: ' 客户产品名称', fixed: 'left' },
            { prop: 'customerProductDrawingNo', label: '客户型号', minWidth: '220px', sortable: 'custom' },
            { prop: 'productName', label: '产品名称', minWidth: '220px', sortable: 'custom' },
            { prop: 'productCode', label: '产品编码', sortable: 'custom' },
            { prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom' },
            { prop: 'mainUnit', label: '单位', sortable: 'custom' },
            { prop: 'createTime', label: '创建时间', sortable: 'custom' }
          ],
          listRequestObj: {
            ...this.addProductProps.listRequestObj,
            partnerId: this.dataForm.cooperativePartnerId,
            partnerType: 'customer'
          }
        }
        delete this.addProductProps.listRequestObj.saleFlag
      } else {
        this.addProductProps = {
          ...this.addProductProps,
          renderTree: true,
          tableItems: [
            { prop: 'name', label: '产品名称', minWidth: '220px', sortable: 'custom' },
            { prop: 'code', label: '产品编码', sortable: 'custom' },
            { prop: 'drawingNo', label: '型号', minWidth: '220px', sortable: 'custom' },
            { prop: 'mainUnit', label: '单位', sortable: 'custom' },
            { prop: 'createTime', label: '创建时间', sortable: 'custom' }
          ],
          listRequestObj: {
            ...this.addProductProps.listRequestObj,
            saleFlag: true,
          }
        }
        delete this.addProductProps.listRequestObj.partnerId
        delete this.addProductProps.listRequestObj.partnerType
      }
      this.addProductProps.listMethod = type === 'customer' ? getcooperativeProduct : getProducts
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
        ...this.createdObj(),
        ...item.all,
        productName: item.name,
        productCode: item.code,
        productsDrawingNo: item.drawingNo,
        productsId: item.id,
        cooperativePartnerProductId: item?.productsId || '',
      }))
      this.linesList = [...this.linesList, ...newData]
    },

    getTitle(type) {
      switch ( type ) {
        case 'edit':
          return '询价'
        case 'look':
          return `查看${ this.title }`
      }
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await getQuotationInfo(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = Object.assign(this.dataForm, data.sale, {
            inquiryTime: this.jnpf.getToday()
          })
          this.formData.quotationId = data.sale.id
          this.originalFormData = deepClone(this.dataForm)
          this.linesList = data.lines.map(item => ({
            ...item,
            cooperativePartnerId: '',
            quotationId: data.sale.id,
            quotationLineId: item.id,
          }))
          await this.fetchDepartment()
          await this.fetchOrganization()
        }
      } catch ( err ) {
        this.loading = false
      }
    },

    async handleSubmit(type) {
      if (!this.linesList.length) return this.$message.error('无产品信息，请添加产品！')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false
      this.dataForm.documentStatus = type
      const deepParams = deepClone(this.dataForm)
      const params = {
        purchaseInquiry: {
          ...deepParams,
          inquiryNo: deepParams.quotationNo,
          quotationId: deepParams.id
        },
        purchaseInquiryLineList: this.linesList,
        flowData: this.flowData
      }
      let MSG = '提交成功'
      console.log(params);
      try {
        const res = await submitWaitEnquiryData(params)
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
<style lang="scss" scoped>
.cooperative-style {
  width: 30%;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .lable-style {
    width: 100px;
    text-align: left;
  }
}
</style>
