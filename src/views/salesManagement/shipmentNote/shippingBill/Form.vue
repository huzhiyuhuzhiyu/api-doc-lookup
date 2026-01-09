<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')" content="创建报关单" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="submit()">{{ $t('common.submitButton') }}</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-collapse :value="['basicInfo', 'product']">
          <el-collapse-item title="基本信息" name="basicInfo" style="margin-top: 5px;">
            <JNPF-col v-model="dataForm" :tabContent="dataFormItem" ref="dataForm" :btnType="btnType" />
          </el-collapse-item>
          <el-collapse-item title="报关商品信息" name="product" style="margin-top: 5px;">
            <TableForm-product ref="LinesForm" :value="linesList" @input="tableFormTwoValueChange"
              :tableItems="tableTwoItems" :btnType="btnType" @deleteth="" :hasToolbar="false">
              <template v-slot:actions>
                <div></div>
              </template>
            </TableForm-product>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </transition>
</template>

<script>
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue'
import { addDeclared, getDeclaredDetail, getExchangeRateList } from "@/api/masterDataManagement/productManage";
import { getcategoryTrees } from "@/api/salesManagement/assemblyOrders";
import { getCooperativeData, getCounryData } from "@/api/basicData"; // 附带产品多选的表格表单组件
export default {
  components: { TableFormProduct },
  data() {
    const itemRules = [{ required: true, trigger: ['blur', 'change'] }]
    return {
      btnType: 'add',
      formLoading: false,
      btnLoading: false,
      currencySystemOptions: [],
      countryOptions: [],
      dataForm: {},
      dataFormItem: [
        { prop: "orderNo", label: "预录入单号", value: "", type: "input", sm: 8, itemRules },
        { prop: "hsCode", label: "海关编号", value: "", type: "input", sm: 8, itemRules },
        // { prop: "orderNo", label: "页码/页数", value: "", type: "input", sm: 8, itemRules },
        {
          prop: "cooperativePartnerName",
          label: "境内发货人",
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
            { prop: 'code', label: '客户编码' },
            { prop: 'name', label: '客户名称' },
            { prop: 'nameEn', label: '英文名称' },
            { prop: 'taxId', label: '税号' }
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
            { prop: 'code', label: '客户编码', type: 'input' },
            { prop: 'name', label: '客户名称', type: 'input' }
          ],
          change: (id, data) => {
            // dom更新后重新校验此元素
            this.$nextTick(() => {
              this.$refs.dataForm.$refs.main.validateField('cooperativePartnerName');
            });
            this.dataForm.cooperativePartnerId = data[0].all.id;
            this.dataForm.cooperativePartnerCode = data[0].all.code;
            this.dataForm.cooperativePartnerName = data[0].all.name;
            this.dataForm.taxId = data[0].all.taxId;
          },
          treeNodeClick: (data, node, listQuery) => {
            if (listQuery.partnerCategoryId === data.id) return listQuery
            listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
            listQuery.classAttribute = data.classAttribute
            return listQuery
          },
        },
        { prop: "cooperativePartnerTaxId", label: "发货人税号", value: "", type: "input", sm: 8, itemDisabled: true, placeholder: " " },
        { prop: "departureCustoms", label: "出境关别", value: "Ningbo", type: "input", sm: 8, itemRules },
        {
          prop: "exportDate", label: "出口日期", value: this.jnpf.getToday(),
          type: "date",
          itemRules: [{ required: true, trigger: "change" }], sm: 8
        },
        // {
        //   prop: "createTime", label: "创建时间", value: '',
        //   type: "date",
        //   itemRules: [{ required: true, trigger: "change" }], sm: 8, itemRules
        // },
        { prop: "filingNumber", label: "备案号", value: "Ningbo", type: "input", sm: 8, itemRules },
        { prop: "foreignConsignee", label: "境外收货人名称", value: "Hitachi Energy USA Inc.", type: "input", sm: 8, itemRules },
        { prop: "foreignConsigneeTaxId", label: "境外收货人税号", value: "", type: "input", sm: 8, itemRules },
        {
          prop: "transportMethod", label: "运输方式", value: "", type: "select", options: [
            { label: 'BY Sea', value: 'by_sea' },
            { label: 'BY Train', value: 'by_train' },
            { label: 'BY DHL', value: 'by_dhl' },
            { label: 'BY UPS', value: 'by_ups' },
            { label: 'BY TNT', value: 'by_tnt' },
            { label: 'BY Air', value: 'by_air' },
          ], sm: 8, itemRules
        },
        { prop: "transportNameVoyage", label: "运输工具名称及航次号", value: "", type: "input", sm: 8, itemRules },
        { prop: "billOfLadingNumber", label: "提运单号", value: "", type: "input", sm: 8, itemRules },
        { prop: "supervisionMethod", label: "监管方式(0110)", value: "一般贸易", type: "input", sm: 8, itemRules },
        { prop: "taxExemptionNature", label: "征免性质(101)", value: "一般征税", type: "input", sm: 8, itemRules },
        { prop: "licenseNumber", label: "许可证号", value: "", type: "input", sm: 8, itemRules },
        { prop: "contractAgreementNo", label: "合同协议号", value: "", type: "input", sm: 8, itemRules },
        { prop: "tradingCountry", label: "贸易国(地区)", value: "", type: "input", sm: 8, itemRules },
        { prop: "destinationCountry", label: "运抵国(地区)", value: "", type: "input", sm: 8, itemRules },
        { prop: "destinationPort", label: "指运港", value: "", type: "input", sm: 8, itemRules },
        {
          prop: "packagingType", label: "包装种类", value: "recycling_tray", type: "select", options: [
            { label: '再生托盘', value: 'recycling_tray' },
            { label: '纸箱', value: 'box' },
          ], sm: 8, itemRules
        },
        { prop: "packageCount", label: "件数", value: "", type: "input", sm: 8, itemRules },
        { prop: "grossWeight", label: "毛重(千克)", value: "", type: "input", sm: 8, itemRules },
        { prop: "transactionMethod", label: "成交方式", value: "FOB", type: "input", sm: 8, itemRules },
        { prop: "freightAmount", label: "运费", value: "", type: "input", sm: 8, itemRules },
        { prop: "insuranceAmount", label: "保费", value: "", type: "input", sm: 8, itemRules },
        { prop: "miscellaneousFee", label: "杂费", value: "", type: "input", sm: 8, itemRules },
        { prop: "supportingDocuments", label: "随附单证及编号", value: "", type: "input", sm: 8, itemRules },
        { prop: "markingRemarks", label: "标记喷码及备注", value: "", type: "input", sm: 8, itemRules },
        { prop: "specialRelationshipConfirm", label: "特殊关系确认", value: false, type: "select", options: this.global.booleanOptions, sm: 8, itemRules },
        { prop: "priceImpactConfirm", label: "价格影响确认", value: false, type: "select", options: this.global.booleanOptions, sm: 8, itemRules },
        { prop: "royaltyFeeConfirm", label: "支付特许权使用费确认", value: false, type: "select", options: this.global.booleanOptions, sm: 8, itemRules },
        { prop: "selfDeclaration", label: "自报自缴", value: '', type: "input", sm: 8 },
      ],
      linesList: [],
      tableTwoItems: [],
    }
  },
  watch: {
    dataForm: {
      handler: function (newVal, oldVal) {
        console.log(structuredClone(newVal))
      },
      deep: true
    }
  },
  created() {
    this.setTableTwoItems()
  },
  methods: {
    init(idOrData, btnType) {
      this.btnType = btnType
      if (btnType === 'look') {
        const id = idOrData
        this.formLoading = true
        getDeclaredDetail(id).then(res => {
          this.dataForm = res.data.declared
          this.linesList = res.data.declaredLineList
          this.formLoading = false
        }).catch(() => {

        })
      } else {
        const selectData = structuredClone(idOrData)
        this.linesList = selectData.reduce((result, item) => {
          item.originCostPrice = item.costPrice
          item.originTotalAmount = item.totalAmount
          item.ordersLineIds = [item.id]
          delete item.id
          const sameProductIndex = result.findIndex(item => item.hsProductsId === item.hsProductsId)
          if (sameProductIndex !== -1) {
            result[sameProductIndex].num = this.jnpf.math('+', [result[sameProductIndex].num, item.num])
            result[sameProductIndex].totalAmount = this.jnpf.math('+', [result[sameProductIndex].totalAmount, item.totalAmount])
            result[sameProductIndex].originTotalAmount = this.jnpf.math('+', [result[sameProductIndex].originTotalAmount, item.originTotalAmount])
            result[sameProductIndex].ordersLineIds.push(item.id)
          } else {
            result.push(item)
          }
          return result
        }, [])
      }
    },
    async setTableTwoItems() {
      await getExchangeRateList({
        pageNum: 1,
        pageSize: -1
      }).then(res => {
        this.currencySystemOptions = res.data.records.map(item => ({ label: item.currencySystem, value: item.id, exchangeRate: item.exchangeRate }))
      })
      await getCounryData({
        pageNum: 1,
        pageSize: -1
      }).then(res => {
        this.countryOptions = res.data.records.map(item => ({ label: item.name, value: item.id }))
      })
      const itemRules = [{ required: true, trigger: ['blur', 'change'] }]
      this.tableTwoItems = [
        { prop: 'hsProductCode', label: '商品编号', type: 'view', value: '', minWidth: '140' },
        { prop: 'hsProductName', label: '商品名称', type: 'view', value: '', minWidth: '140' },
        { prop: 'hsProductDrawingNo', label: '规格型号', type: 'view', value: '', minWidth: '200' },
        { prop: 'purpose', label: '用途', type: 'input', value: '', minWidth: '200', itemRules },
        { prop: 'num', label: '数量', type: 'view', value: '', minWidth: '120' },
        { prop: 'mainUnit', label: '单位', type: 'view', value: '', minWidth: '80' },
        { prop: 'costPrice', label: '单价', type: 'view', value: '', minWidth: '140' },
        { prop: 'totalAmount', label: '总价', type: 'view', value: '0', minWidth: '140' },
        {
          prop: 'currencySystemId', label: '币制', type: 'select',
          value: this.currencySystemOptions.find(item => item.label === '人民币')?.value,
          options: this.currencySystemOptions,
          minWidth: '140',
          clearable: false,
          change: (val, scope) => {
            const option = this.currencySystemOptions.find(item => item.value === val)
            scope.row.costPrice = this.jnpf.math('*', [scope.row.originCostPrice, option.exchangeRate], 2)
            scope.row.totalAmount = this.jnpf.math('*', [scope.row.originTotalAmount, option.exchangeRate], 2)
          }, itemRules
        },
        { prop: 'countryOfOrigin', label: '原产国(地区)', type: 'input', value: '中国', minWidth: '180', itemRules },
        { prop: 'finalDestinationCountryId', label: '最终目的国(地区)', type: 'select', value: '', options: this.countryOptions, minWidth: '180', itemRules },
        { prop: 'domesticSourceLocation', label: '境内货源地', type: 'input', value: '宁波其他', minWidth: '180', itemRules },
        { prop: 'taxExemption', label: '征免', type: 'input', value: '照章征税', minWidth: '140' },
      ]
      this.$nextTick(() => {
        this.$refs['LinesForm'].setDefaultValue()
      })
    },
    async submit() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断

      // 校验自定义属性
      let form_1 = this.$refs['dataForm'].$refs.main
      let valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      // 校验表格表单
      let form_2 = this.$refs['LinesForm'].$refs.main
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      // 判断条件后发送请求
      if (submitFlag) {
        const formMethod = addDeclared

        this.dataForm.documentStatus = 'submit'
        this.dataForm.approvalFlag = false
        let dataObj = {
          declared: this.dataForm,
          declaredLineList: this.linesList,
        }
        formMethod(dataObj).then(res => {
          this.$message.success('新建成功')
          this.$emit('close', true)
          // this.visible = false
          // this.btnLoading = false
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }

    },

    tableFormTwoValueChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.main {
  padding: 0px 10px 10px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep #sleeve .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  height: calc(100% - 48px);

}

::v-deep .el-collapse-item__content {
  height: 100%;
}

.reportInfo ::v-deep .el-collapse-item__wrap {
  padding: 0;
}

::v-deep .el-collapse-item__content {
  padding: 10px
}
</style>
