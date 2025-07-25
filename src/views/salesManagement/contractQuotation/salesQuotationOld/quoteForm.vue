<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main transitionForm org-form">
            <div class="JNPF-common-page-header">
              <el-page-header @back="goBack" :content="title" />
              <div class="options">
                <template>
                  <el-button type="success" :loading="btnLoading" @click="handleSubmit('submit')">
                    报价
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
                  <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType" />
                </el-collapse-item>
                <el-collapse-item class="productInfo" title="产品信息" name="productInfo">
                  <div class="TableForm_title">
                  </div>
                  <TableForm-product @input="contentChanges" :value="computedLinesList" :hasToolbar="false"
                    ref="tableForm" :tableItems="linesListItems" :btnType="btnType" :hasActionbar="false" :tableProps="{
                      is: 'JNPF-table',
                      fixedNO: true,
                      hasC: true,
                      height: linesTableHeight,
                      rowKey: 'id',
                      defaultExpandAll: true,
                      customColumn: true,
                    }">
                    <template slot="top">
                      <div class="tableTopContainer">
                        <div class="left">
                          <template>
                            <el-button type="text" icon="el-icon-plus"
                              @click="selectProductRefOpenDialog">选择产品</el-button>
                          </template>
                        </div>
                        <div class="right">
                        </div>
                      </div>
                    </template>
                  </TableForm-product>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
      <ComSelect-page v-bind="addProductProps" ref="ComSelectProductRef" :element-show="false"
        @change="submitAllProduct" />
      <el-dialog title="采购询价信息" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="enquiryDialog" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
        append-to-body>
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table :data="enquiryData" hasC ref="dataTable" custom-column customKey="JNPFTableKey_861731">
                <el-table-column prop="supplierCode" label="供应商" />
                <el-table-column prop="productsCode" label="产品型号" />
                <el-table-column prop="productsName" label="产品名称" />
                <el-table-column prop="mainUnit" label="单位" />
                <el-table-column prop="numStr" label="数量" />
                <el-table-column prop="sampleNumStr" label="样品量" />
                <el-table-column prop="minNumStr" label="起订量" />
                <el-table-column prop="minNumStr1" label="采购价" />
                <el-table-column prop="sampleAmounts" label="样品价" />
                <el-table-column prop="moldAmounts" label="模具费" />
                <el-table-column prop="deliveryDate" label="交期" />
                <el-table-column prop="remark" label="备注" />
              </JNPF-table>
              <pagination :total="enquiryTotal" :page.sync="enquiryObj.pageNum"
                :limit.sync="enquiryObj.pageSize" @pagination="getHistoryPriceFun" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="enquiryDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitSelectEnquiryList">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
import { deepClone } from "@/utils";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { getQuotationInfo } from "@/api/salesManagement/index";
import { getEnquiryDetailList } from '@/api/enquiryManagement/enquiryDetail'

export default {
  name: "QuoteForm",
  components: { TableFormProduct },
  data() {
    return {
      title: '销售订单',
      btnType: '',
      loading: false,
      btnLoading: false,
      uploadVisible: false,
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
        remark: '',
        remark1: '',
      },
      extraFormData: {},
      fileList: [],
      basicFormSchema: [
        {
          prop: "quotationNo",
          label: "报价单号",
          value: "",
          type: "input",
          disabled: true,
          itemRules: [{ required: true, trigger: "blur" }],
        },
        {
          prop: "cooperativePartnerIdText",
          label: "所属客户",
          value: "",
          type: "input",
          disabled: true,
          itemRules: [{ required: true, trigger: "blur" }],
        },
        {
          prop: "bidder",
          label: "业务员",
          value: "",
          type: "input",
          disabled: true,
        },
        {
          prop: "quotationTime",
          label: "报价日期",
          value: "",
          type: "date",
          itemDisabled: true,
        },
        {
          prop: "bidder2",
          label: "制单人",
          value: "",
          type: "input",
          disabled: true,
        },
        {
          prop: "bidder1",
          label: "采购负责人",
          value: "",
          type: "input",
          disabled: true,
        },
        {
          prop: "quotationStatusDes",
          label: "单据状态",
          value: "",
          type: "input",
          disabled: true,
        },
      ],
      linesList: [],
      linesListItems: [
        {
          prop: 'productsCode',
          label: '产品型号',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'productsName',
          label: '产品名称',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'productsName1',
          label: '客户型号',
          type: 'view',
          minWidth: 150,
        },
        {
          prop: 'supplierName',
          label: '已选工厂',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'tidai',
          label: '是否被替代',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'numStr',
          label: '数量',
          type: 'input',
          minWidth: 160,
          itemRules: [
            {
              validator: this.formValidate('noZero', '数量不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['数量不能为空', (errMsg) => {
                  this.$message.error(`	数量不能为空`)
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
        {
          prop: 'sampleNumStr',
          label: '样品数',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'minNumStr',
          label: '起订量',
          type: 'input',
          minWidth: 150,
        },
        {
          prop: 'procurementAmounts',
          label: '采购价',
          type: 'input',
          minWidth: 160,
        },
        {
          prop: 'amounts',
          label: '报价',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'sampleAmounts',
          label: '样品价',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'excludingTaxAmounts',
          label: '未税价',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'moldAmounts',
          label: '模具费',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'moldAmounts11',
          label: '采购报模具费',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'deliveryDate',
          label: '交货日期',
          type: 'date',
          minWidth: 180,
          itemRules: [
            { required: true, message: '交货日期不能为空', trigger: 'change', },
          ]
        },
        {
          prop: 'remark2',
          label: '反馈备注',
          type: 'input',
          minWidth: 180,
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input',
          minWidth: 180,
        },
      ],
      linesTableHeight: 0,
      approvalFlag: false,
      flowData: {},
      flowTemplateJson: {},
      flowTaskOperatorRecordList: [],
      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      computedLinesList: [],
      enquiryDialog: false,
      enquiryData: [],
      enquiryObj: {
        inquiryNo: '',
        quotationTimeArr: [],
        cooperativePartnerIdText: '',
        cooperativePartnerId: '',
        quotationStatus: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 't1.create_time'
          }
        ],
        superQuery: {},
        pageNum: 1,
        pageSize: 20
      },
      enquiryTotal: 0
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 提交表单
    submitSelectEnquiryList () {
      // 获取选中的数据
      const checkedRows = this.$refs.dataTable.selection
      if (checkedRows.length === 0) {
        this.$message.error('请至少选择一条询价单')
        return
      }
      // 将选中的数据添加到产品信息中
      this.computedLinesList = [...this.computedLinesList, ...checkedRows]
      console.log(this.computedLinesList);
      this.enquiryDialog = false
    },
    async init(id = '', type) {
      this.btnType = type
      this.title = '销售报价'
      await this.getDetail(id);
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

    createdObj() {
      return this.linesListItems.reduce((acc, item) => {
        acc[item.prop] = '';
        return acc;
      }, {});
    },

    addLineForm() {
      this.linesList.push(this.createdObj());
    },

    async selectProductRefOpenDialog() {
      this.enquiryDialog = true
      const res = await getEnquiryDetailList({ ...this.enquiryObj, quotationId:this.dataForm.id });
      const { total, records } = res.data
      this.enquiryData = records;
      this.enquiryTotal = total
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


    async getDetail(id) {
      this.loading = true
      try {
        const res = await getQuotationInfo(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = Object.assign(this.dataForm, {
            ...data.sale,
            quotationStatusDes: '已反馈',
          })
          this.originalFormData = deepClone(this.dataForm)
        }
        this.loading = false
      } catch (err) {
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
      const attachmentList = this.fileListMap(type, this.fileList)
      const params = {
        order: deepParams,
        orderLineList: this.linesList,
        attachmentList: attachmentList,
        flowData: this.flowData
      }
      let MSG = '提交成功'
      try {
        const apiMethod = this.dataForm.id ? editOrders : addOrders
        const res = await apiMethod(params)
        const { msg } = res
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