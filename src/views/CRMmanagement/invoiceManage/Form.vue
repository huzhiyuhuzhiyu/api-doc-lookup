<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑发票' : btntype == 'add' ? '新建发票' : '查看发票'" />
        <div class="options" v-if="btntype !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="发票申请编号" prop="invoiceNo">
                        <el-input v-model="dataForm.invoiceNo" placeholder="请输入发票申请编号" :disabled="btntype == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="负责人" prop="ownerUserId">
                        <user-select v-model="dataForm.ownerUserId" placeholder="请选择负责人" clearable style="width: 100%" :disabled="btntype == 'look'" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="客户名称" prop="customerName">
                        <ComSelect-page key="partner" v-model="dataForm.customerName" @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类" placeholder="请选择客户名称" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }" :listMethod="getPartnerList" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList" :treeNodeClick="PartnerTreeNodeClick" :isdisabled="btntype === 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="开票日期" prop="invoiceDate">
                        <el-date-picker v-model="dataForm.invoiceDate" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择开票日期" :disabled="btntype == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="开票金额" prop="invoiceMoney">
                        <el-input v-model="dataForm.invoiceMoney" placeholder="请输入开票金额" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="开票类型" prop="invoiceType">
                        <el-select v-model="dataForm.invoiceType" placeholder="请选择开票类型" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in returnTypeList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btntype == 'look'" type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="开票明细" name="productInfo">
                <div v-if="btntype !== 'look'" key="11">
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btntype == 'look' ? true : false" @click="openSeleceProductDialog()">选择合同</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btntype == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" ref="productForm" class="data-form" v-loading="productVisible">
                  <el-table class="TableForm table" ref="product" :data="dataFormTwo.lines" @selection-change="handeleProductInfoData" style="border: 1px solid #e3e7ee">
                    <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btntype != 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="2" />
                    <el-table-column prop="contractNo" label="合同编号" width="160" show-overflow-tooltip />
                    <el-table-column prop="contractMoney" label="合同金额" width="140" show-overflow-tooltip />
                    <el-table-column prop="uninvoiceMoney" label="未开票金额" width="160" show-overflow-tooltip />
                    <el-table-column prop="receivablesNo" label="回款编号" width="220">
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'receivablesNo'" :rules='productRules.receivablesNo'>
                          <el-select v-model="scope.row.receivablesNo" placeholder="请选择回款编号" style="width: 100%;" :disabled="btntype == 'look'" @change="changeTaxRate" @focus="focusnum(scope.row,scope.$index)">
                            <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="thisInvoiceMoney" label="本次开票金额" width="160">
                      <template slot="header">
                        <span class="required">*</span>本次开票金额
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'thisInvoiceMoney'" :rules='productRules.thisInvoiceMoney'>
                          <el-input v-model="scope.row.thisInvoiceMoney" placeholder="请输入开票金额" :disabled="btntype == 'look'" maxlength="20" style="width: 135px;">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="230">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btntype == 'look' ? true : false" maxlength="200" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right" v-if="btntype != 'look'" key="111">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="发票信息" name="invoiceInfo">
                <el-form ref="invoiceForm" v-loading="formLoading" :model="dataForm" :rules="invoicedataRule" label-position="top" label-width="120px">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="抬头类型" prop="titleType">
                        <el-select v-model="dataForm.titleType" placeholder="请选择抬头类型" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in [{fullName:'单位',enCode:'dw'},{fullName:'个人',enCode:'gr'}]" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="开票抬头" prop="invoiceHeader">
                        <el-input v-model="dataForm.invoiceHeader" placeholder="请输入开票抬头" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="dataForm.titleType=='dw'">
                      <el-form-item label="纳税人识别号" prop="identification">
                        <el-input v-model="dataForm.identification" placeholder="请输入纳税人识别号" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="dataForm.titleType=='dw'">
                      <el-form-item label="开户行" prop="bank">
                        <el-input v-model="dataForm.bank" placeholder="请输入开户行" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="dataForm.titleType=='dw'">
                      <el-form-item label="开户账号" prop="bankAccount">
                        <el-input v-model="dataForm.bankAccount" placeholder="请输入开户账号" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="dataForm.titleType=='dw'">
                      <el-form-item label="开票地址" prop="invoiceAddress">
                        <el-input v-model="dataForm.invoiceAddress" placeholder="请输入开票地址" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="电话" prop="phone">
                        <el-input v-model="dataForm.phone" placeholder="请输入电话" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="邮寄信息" name="mailInfo">
                <el-form ref="dataForm1" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="联系人" prop="contacts">
                        <el-input v-model="dataForm.contacts" placeholder="请输入联系人" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="联系方式" prop="contactsNumber">
                        <el-input v-model="dataForm.contactsNumber" placeholder="请输入联系方式" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="地址" prop="provincecityarea">
                        <JNPF-Address v-model="dataForm.provincecityarea" @change="actiompro" placeholder="请选择地址" :disabled="btntype == 'look' ? true : false"></JNPF-Address>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="详细地址" prop="address">
                        <el-input v-model="dataForm.address" placeholder="请输入详细地址" :disabled="btntype === 'look' ? true : false" maxlength="300" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="contractChange" :tableItems="contractTableItems" dialogTitle="选择合同" placeholder="请选择合同编号" :listMethod="getcrmContractlist" :listRequestObj="contractRequestObj" :searchList="contractSearchList" :renderTree="false" :elementShow="false" :multiple="true" />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getcrmReceivableslist, updatecrmInvoice, detailcrmInvoice, getcrmContractlist, addcrmInvoice, addcrmInvoiceInfo } from '@/api/CRMmanagement/index'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getPartnerList, getMyContactsList } from '@/api/customerManagement/index'
export default {
  data() {
    return {
      codeConfig: {},//单据规则配置
      _index: '',
      taxRateList: [],
      productVisible: false,
      selectRows: [],
      dataFormTwo: {
        lines: []
      },
      getcrmContractlist,
      //合同列表字段
      contractTableItems: [
        { prop: 'no', label: '合同编号' },
        { prop: 'contractName', label: '合同名称' },
        { prop: 'customerName', label: '客户名称' },
        { prop: 'businessName', label: '商机名称' },
        { prop: 'money', label: '合同金额' },
        { prop: 'orderTime', label: '下单日期' },
      ],
      //合同列表搜索
      contractSearchList: [
        { prop: 'contractName', label: '合同名称', type: 'input' },
      ],
      //合同请求条件
      contractRequestObj: {
        customerName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      returnTypeList: [],
      getcategoryTrees,
      // 客户搜索条件
      partnerSearchList: [
        { prop: 'code', label: '客户编码', type: 'input' },
        { prop: 'name', label: '客户名称', type: 'input' },
        { prop: 'taxId', label: '税号', type: 'input' }
      ],
      // 客户列表
      partnerRequestObj: {
        taxId: "",
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        customerStatus: 'private_sea',
        totalRowFlag: false,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      // 客户列表字段
      partnerTableItems: [
        { prop: 'code', label: '客户编码' },
        { prop: 'name', label: '客户名称' },
        { prop: 'taxId', label: '税号' },
      ],
      activeNames: ["basicInfo", "productInfo", "mailInfo", "invoiceInfo"],
      requestObj: {
        customerStatus: 'private_sea',
      },
      getPartnerList,
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        titleType: 'dw',
        invoiceHeader: '',
        identification: '',
        bank: '',
        bankAccount: '',
        invoiceAddress: '',
        phone: '',
        id: '',
        invoiceNo: '',
        ownerUserId: '',
        customerName: '',
        customerId: '',
        invoiceDate: '',
        invoiceMoney: '',
        invoiceType: '',
        remark: '',
        contacts: '',
        contactsNumber: '',
        province: '',
        city: '',
        area: '',
        provincecityarea: [],
        address: ''
      },
      btntype: false,
      productRules: {
        thisInvoiceMoney: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["开票金额不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('开票金额：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '', (errMsg) => { this.$message.error(errMsg) }), trigger: 'blur' }
        ],
      },
      invoicedataRule: {},
      dataRule: {
        ownerUserId: [
          { required: true, message: '请选择负责人', trigger: 'blur' },
        ],
        invoiceType: [
          { required: true, message: '请输入开票类型', trigger: 'blur' },
        ],
        invoiceDate: [
          { required: true, message: '请选择开票日期', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '请选择客户名称', trigger: 'blur' },
        ]
      },
    }
  },
  computed: {
    returnmoney: function () {
      var totalMoney = 0;
      for (var i = 0; i < this.dataFormTwo.lines.length; i++) {
        totalMoney = this.jnpf.math('add', [totalMoney, this.dataFormTwo.lines[i].thisInvoiceMoney * 1])
      }
      return totalMoney
    },
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getDictionaryType()
    this.dataForm.ownerUserId = this.userInfo.userId
  },
  watch: {
    returnmoney: {
      deep: true,
      handler(newVal, oldVal) {
        this.dataForm.invoiceMoney = newVal
      }
    }
  },
  methods: {
    changeTaxRate(val) {
      let a = this.taxRateList.filter(item => item.enCode == val)
      this.dataFormTwo.lines[this._index].receivablesId = a[0].id
    },
    actiompro(value) {
      if (value) {
        this.dataForm.province = value[0]
        this.dataForm.city = value[1]
        this.dataForm.area = value[2]
      } else {
        this.dataForm.province = ''
        this.dataForm.city = ''
        this.dataForm.area = ''
      }
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        this.dataForm.invoiceNo = data.number

      } catch (error) {
      }
    },
    focusnum(val, index) {
      let obj = {
        contractNo: val.contractNo,
        pageNum: 1,
        pageSize: -1,
      }
      this._index = index
      this.taxRateList = []
      getcrmReceivableslist(obj).then(res => {
        this.taxRateList = res.data.records.map(item => {
          return { fullName: item.receivablesNo, enCode: item.receivablesNo, id: item.id }
        })
      })
    },
    handleDel(row) {
      this.dataFormTwo.lines.splice(row.$index, 1)
    },
    //批量删除
    batchDelete() {
      if (!this.selectRows.length) return this.$message.error('请选择要删除的合同')
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.lines.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.lines.splice(index, 1); // 从tableData中删除选中的行
        }
      }
    },
    // 合同列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    //打开合同弹框
    openSeleceProductDialog() {
      if (!this.dataForm.customerName) return this.$message.error('请先选择客户')
      this.$refs["ComSelect-page"].openDialog()
    },
    //负责人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("ownerUserId") });
    },
    //合同选框传值
    contractChange(val, data) {
      if (data && data.length) {
        data.forEach(item => {
          let a = {
            contractNo: item.all.no,
            contractMoney: item.all.money,
            uninvoiceMoney: this.jnpf.math('subtract', [item.all.money, item.all.invoicedMoney * 1]),
            receivablesPlanId: '',
            receivablesId: '',
            receivablesNo: '',
            thisInvoiceMoney: '',
            remark: '',
            contractId: item.all.id,
          }
          this.dataFormTwo.lines.push(a)
        })
      }
    },
    // 获取发票方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "CWGL") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "billingType") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.returnTypeList = response.data.list
                })
              }
            })
          }
        })
      })
    },
    // 客户分类节点点击
    PartnerTreeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.id
      return listQuery
    },
    // 客户选框传值
    partnerChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('customerName') }) // 校验操作的元素(name是组件绑定的value)
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.customerName = data[0].all.name
        this.dataForm.customerId = data[0].all.id
        this.dataForm.contractNum = ""
        this.contractRequestObj.customerName = this.dataForm.customerName
        this.dataFormTwo.lines = []
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.customerId = ""
        this.dataForm.customerName = ""
        this.dataForm.contractNum = ""
      }
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      this.visible = true
      this.btntype = type
      this.dataForm.id = id || ''
      this.formLoading = true
      if (this.btntype === 'add') this.fetchData('FPBH')
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailcrmInvoice(this.dataForm.id).then(res => {
            this.dataForm = { ...res.data.invoice, ...res.data.invoiceInfo }
            this.dataFormTwo.lines = res.data.lines
            this.dataForm.provincecityarea = []
            if (res.data.invoice.province) {
              this.dataForm.provincecityarea.push(res.data.invoice.province)
              this.dataForm.provincecityarea.push(res.data.invoice.city)
              this.dataForm.provincecityarea.push(res.data.invoice.area)
            }
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    async dataFormSubmit() {
      let submitFlag = true
      const form_1 = this.$refs.dataForm
      const valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        let formItems = form_1.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }
      const form_2 = this.$refs.productForm
      const valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }
      // 校验子表
      if (!this.dataFormTwo.lines.length) {
        this.$message.error('请选择合同')
        return
      }
      if (submitFlag) {
        this.btnLoading = true;
        let obj = {
          invoice: this.dataForm,
          lines: this.dataFormTwo.lines
        }
        // addcrmInvoiceInfo(obj1).then(res => { })
        let formMethod = this.dataForm.id ? updatecrmInvoice(obj) : addcrmInvoice(obj);
        formMethod.then(res => {
          let msg = ""
          if (this.btntype == "edit") {
            msg = '修改成功'
          } else {
            msg = '新建成功'
          }
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.required {
  color: red;
  margin-right: 4px;
}
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
.JNPF-preview-main .main {
  padding-top: 0;
}
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
