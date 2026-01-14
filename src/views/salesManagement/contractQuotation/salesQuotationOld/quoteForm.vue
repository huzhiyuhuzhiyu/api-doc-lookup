<script>
import { standardizeFields } from "@/utils";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { getQuotationInfo, quotationSale } from "@/api/salesManagement";
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
      dataForm: {},
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
          prop: "createByName",
          label: "制单人",
          value: "",
          type: "input",
          disabled: true,
        },
        {
          prop: "purchaseUserId",
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
          prop: 'customerProductDrawingNo',
          label: '客户产品型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'supplierCode',
          label: '供应商编号',
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
          itemRules: [
            {
              validator: this.formValidate('noZero', '报价不能为0', (errMsg) => {
                this.$message.error(errMsg)
              }), trigger: ['blur', 'change']
            },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['报价不能为空', (errMsg) => {
                  this.$message.error(`	报价不能为空`)
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
            { required: true, message: '报价不能为空', trigger: ['blur', 'change'], },
          ]
        },
        {
          prop: 'taxRate',
          label: '税率',
          type: 'select',
          options: this.getDictDataSync('taxrate'),
          minWidth: 160,
          itemRules: [
            { required: true, message: '税率不能为空', trigger: 'change', },
          ]
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
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'moldAmounts',
          label: '模具费',
          type: 'input',
          minWidth: 180,
        },
        // {
        //   prop: 'moldAmounts11',
        //   label: '采购报模具费',
        //   type: 'input',
        //   minWidth: 180,
        // },
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
          prop: 'material',
          label: '材质',
          type: 'input',
          minWidth: 180,
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
      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
      currentSelectedProduct: null,
      currentSelectedIndex: -1,
      addProductProps: {
        title: '采购询价信息',
        activeType: '',
        renderTree: false,
        multiple: false,
        listMethod: getEnquiryDetailList,
        tableItems: [
          { prop: 'supplierName', label: '供应商名称', minWidth: 180, sortable: 'custom' },
          { prop: 'supplierCode', label: '供应商编码', minWidth: 180, sortable: 'custom' },
          { prop: 'productsName', label: '产品名称', minWidth: 180, sortable: 'custom' },
          { prop: 'productsCode', label: '产品编码', minWidth: 180, sortable: 'custom' },
          { prop: 'productsDrawingNo', label: '型号', minWidth: 180, sortable: 'custom' },
          { prop: 'mainUnit', label: '单位', minWidth: 90, sortable: 'custom' },
          { prop: 'numStr', label: '数量', minWidth: 120, sortable: 'custom' },
          { prop: 'sampleNumStr', label: '样品量', minWidth: 120, sortable: 'custom' },
          { prop: 'minNumStr', label: '起订量', minWidth: 120, sortable: 'custom' },
          { prop: 'procurementAmounts', label: '采购价', minWidth: 120, sortable: 'custom' },
          { prop: 'sampleAmounts', label: '样品价', minWidth: 120, sortable: 'custom' },
          { prop: 'moldAmounts', label: '模具费', minWidth: 120, sortable: 'custom' },
          { prop: 'deliveryDate', label: '交期', minWidth: 160, sortable: 'custom' },
          { prop: 'remark', label: '备注', minWidth: 180, sortable: 'custom' }
        ],
        listRequestObj: {
          quotationId: '',
          productsId: '',
          pageNum: 1,
          pageSize: 20,
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 't1.create_time'
            }
          ]
        },
        beforeSubmit: (data, paramsObj) => {
          if (!data) {
            this.$message.error(`请进行询价信息选择！`)
            return false
          }
          return true
        },
        searchList: [
          { prop: 'supplierCode', label: '供应商', type: 'input' },
          { prop: 'productsName', label: '产品名称', type: 'input' },
          { prop: 'productsCode', label: '产品编码', type: 'input' },
        ]
      },
      productFieldMap: {
        productsName: ['productsName', 'productName'],
        productsCode: ['productsCode', 'productCode'],
        drawingNo: ['productsDrawingNo', 'productDrawingNo', 'drawingNo'],
        productsId: ['productsId', 'productId'],
        lineId: ['id'],
        taxRate: { value: '13' },
        lineKey: { value: this.jnpf.idGenerator() },
      },
    }
  },
  computed: {
    computedLinesList() {
      return this.linesList.map(item => {
        // 计算未税价 = 报价 / (1 + 税率)
        const excludingTaxAmounts = this.jnpf.numberFormat(
          this.calcExcludingTaxAmounts(item.amounts, item.taxRate), 2);

        return {
          ...item,
          excludingTaxAmounts,
        };
      });
    },
  },
  methods: {
    async init(id = '', type) {
      this.btnType = type
      this.title = '销售报价'
      await this.getDetail(id);
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },
    handleColumnClick(row, index, type) {
      switch ( type ) {
        case 'copy':
          this.linesList.push({ ...row, lineId: '', lineKey: this.jnpf.idGenerator() })
          break;
        case 'delete':
          this.linesList.splice(index, 1)
          break;
        default:
      }
    },
    calcExcludingTaxAmounts(amounts, taxRate) {
      if (!amounts || !taxRate) return 0;
      const rate = parseFloat(taxRate) / 100 || 0;
      return amounts / (1 + rate);
    },
    handleCurrentChange(row) {
      if (row) {
        this.currentSelectedProduct = row;
        this.currentSelectedIndex = this.linesList.findIndex(item => item.lineKey === row.lineKey);
      }
    },
    selectProductRefOpenDialog() {
      this.addProductProps.listRequestObj.quotationId = this.dataForm.id;
      this.addProductProps.listRequestObj.productsId = this.currentSelectedProduct.productsId;

      this.$refs.ComSelectProductRef.openDialog();
    },
    async submitAllProduct(id, data) {
      if (!this.currentSelectedProduct || this.currentSelectedIndex === -1) {
        this.$message.error('未找到对应的产品，请重新选择产品');
        return;
      }

      if (!data || data.length === 0) {
        this.$message.error('未选择任何采购询价信息');
        return;
      }

      const enquiryData = data[0].all;
      const updatedProduct = {
        ...this.linesList[this.currentSelectedIndex],
        ...enquiryData,
        remark2: enquiryData.remark1,
        supplierPartnerId: enquiryData.cooperativePartnerId,
      };

      this.linesList.splice(this.currentSelectedIndex, 1, updatedProduct);
      this.$message.success('采购询价信息已应用');
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
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
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
          this.linesList = standardizeFields(data.lines, this.productFieldMap)
        }
        this.loading = false
      } catch ( err ) {
        this.loading = false
      }
    },
    async handleSubmit() {
      if (!this.linesList.length) return this.$message.error('无产品信息，请添加产品！')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      const valid_2 = await this.$refs['tableForm'].$refs.main.validate().catch(err => false)
      if (!valid_1 || !valid_2) return this.btnLoading = false

      try {
        const apiMethod = quotationSale
        const res = await apiMethod(this.computedLinesList)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success('报价成功')
          this.goBack()
        }
        this.btnLoading = false
      } catch ( error ) {
        this.btnLoading = false
      }
    },
    goBack() {
      this.$emit('close', this.activeType);
    },
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main transitionForm">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="title"/>
        <div class="options">
          <template>
            <el-button type="success" :loading="btnLoading" @click="handleSubmit">
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
            <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm" :btnType="btnType"/>
          </el-collapse-item>
          <el-collapse-item class="productInfo" title="产品信息" name="productInfo">
            <div class="TableForm_title">
            </div>
            <TableForm-product
              @input="contentChanges"
              :value="computedLinesList"
              :hasToolbar="false"
              ref="tableForm"
              :tableItems="linesListItems"
              :btnType="btnType"
              :hasActionbar="false"
              :tableProps="{
                      is: 'JNPF-table',
                      fixedNO: true,
                      single: true,
                      hasC: false,
                      height: linesTableHeight,
                      rowKey: 'id',
                      defaultExpandAll: true,
                      customColumn: true,
                    }"
              highlight-current-row
              @currentChange="handleCurrentChange"
            >
              <template slot="top">
                <div class="tableTopContainer">
                  <div class="left">
                    <template>
                      <el-button
                        type="text"
                        icon="el-icon-plus"
                        @click="selectProductRefOpenDialog"
                        :disabled="!currentSelectedProduct"
                      >
                        选择采购询价
                      </el-button>
                      <div v-if="currentSelectedProduct" class="selected-product-info">
                        <span>已选中: {{ currentSelectedProduct.productsCode }} - {{ currentSelectedProduct.productsName }}</span>
                      </div>
                    </template>
                  </div>
                  <div class="right">
                  </div>
                </div>
              </template>
              <template slot="actions">
                <el-table-column label="操作" width="120" fixed="right">
                  <template slot-scope="{ row, $index }">
                    <el-button size="mini" type="text" @click="handleColumnClick(row, $index, 'copy')">
                      复制
                    </el-button>
                    <el-button class="JNPF-table-delBtn" size="mini" type="text" @click="handleColumnClick(row, $index, 'delete')">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </template>
            </TableForm-product>
          </el-collapse-item>
        </el-collapse>
      </div>
      <ComSelect-page
        v-bind="addProductProps"
        ref="ComSelectProductRef"
        :element-show="false"
        @change="submitAllProduct"
      />
    </div>
  </transition>
</template>

<style scoped>
.selected-product-info {
  display: inline-block;
  margin-right: 15px;
  padding: 5px 10px;
  background-color: #f0f9ff;
  border: 1px solid #c6e2ff;
  border-radius: 4px;
  color: #409eff;
  font-size: 14px;
}

.tableTopContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
