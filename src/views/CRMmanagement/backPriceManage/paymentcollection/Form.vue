<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑回款' : btntype == 'add' ? '新建回款' : '查看回款'" />
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
                      <el-form-item label="回款编号" prop="receivablesNo">
                        <el-input v-model="dataForm.receivablesNo" placeholder="请输入回款编号" :disabled="btntype == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
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
                      <el-form-item label="回款日期" prop="receivablesData">
                        <el-date-picker v-model="dataForm.receivablesData" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择回款日期" :disabled="btntype == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="回款金额" prop="receivablesMoney">
                        <el-input v-model="dataForm.receivablesMoney" placeholder="请输入回款金额" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="回款方式" prop="receivablesType">
                        <el-select v-model="dataForm.receivablesType" placeholder="请选择回款方式" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
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
              <el-collapse-item title="合同信息" name="productInfo">
                <div v-if="btntype !== 'look'" key="11">
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btntype == 'look' ? true : false" @click="openSeleceProductDialog()">选择合同</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btntype == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" ref="productForm" class="data-form" v-loading="productVisible">
                  <el-table class="TableForm table" ref="product" :data="dataFormTwo.lines" @selection-change="handeleProductInfoData" style="border: 1px solid #e3e7ee">
                    <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btntype != 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="2" />
                    <el-table-column prop="contractNo" label="合同编号" width="160" show-overflow-tooltip />
                    <el-table-column prop="contractName" label="合同名称" width="160" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contractMoney" label="合同金额" width="140" show-overflow-tooltip />
                    <el-table-column prop="unreceivedMoney" label="未回款金额" width="160" show-overflow-tooltip />
                    <el-table-column prop="thisReceivablesMoney" label="本次回款金额" width="160">
                      <template slot="header">
                        <span class="required">*</span>本次回款金额
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'thisReceivablesMoney'" :rules='productRules.thisReceivablesMoney'>
                          <el-input v-model="scope.row.thisReceivablesMoney" placeholder="请输入回款金额" :disabled="btntype == 'look'" maxlength="20" style="width: 135px;">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="num" label="回款计划期数" width="180">
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                          <el-select v-model="scope.row.num" placeholder="请选择回款计划期数" style="width: 100%;" :disabled="btntype == 'look'" @change="changeTaxRate" @focus="focusnum(scope.row,scope.$index)">
                            <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                          </el-select>
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
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch=='1'">
            <UploadWj v-model="datafilelist" :disabled="btntype=='look'" :detailed="btntype=='look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="contractChange" :tableItems="contractTableItems" dialogTitle="选择合同" placeholder="请选择合同编号" :listMethod="getcrmContractlist" :listRequestObj="contractRequestObj" :searchList="contractSearchList" :renderTree="false" :elementShow="false" :multiple="true" />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getPartnerList, getMyContactsList } from '@/api/customerManagement/index'
import { getcrmReceivablesPlanlist, updatecrmReceivables, detailcrmReceivables, getcrmContractlist, addcrmReceivables } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      isattachmentswitch: '1',
      datafilelist:[],
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
      activeNames: ["basicInfo", "productInfo"],
      requestObj: {
        customerStatus: 'private_sea',
      },
      getPartnerList,
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        contractId: '',
        receivablesNo: '',
        id: '',
        ownerUserId: '',
        ownerUserName: '',
        customerName: '',
        customerId: '',
        receivablesData: '',
        receivablesMoney: '',
        receivablesType: '',
        remark: ''
      },
      btntype: false,
      productRules: {
        thisReceivablesMoney: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["回款金额不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('回款金额：' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '', (errMsg) => { this.$message.error(errMsg) }), trigger: 'blur' }
        ],
      },
      dataRule: {
        receivablesNo: [
          { required: true, message: '请输入回款编号', trigger: 'blur' },
        ],
        ownerUserId: [
          { required: true, message: '请选择负责人', trigger: 'blur' },
        ],
        receivablesMoney: [
          { required: true, message: '请输入回款金额', trigger: 'blur' },
        ],
        receivablesData: [
          { required: true, message: '请选择回款日期', trigger: 'blur' },
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
        totalMoney = this.jnpf.math('add', [totalMoney, this.dataFormTwo.lines[i].thisReceivablesMoney * 1])
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
        this.dataForm.receivablesMoney = newVal
      }
    }
  },
  methods: {
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (this.btntype === 'add') { this.dataForm.receivablesNo = data.number }
      } catch (error) {
      }
    },
    changeTaxRate(val) {
      let a = this.taxRateList.filter(item => item.enCode == val)
      this.dataFormTwo.lines[this._index].thisReceivablesMoney = a[0].thisReceivablesMoney * 1
      this.dataFormTwo.lines[this._index].receivablesPlanId = a[0].receivablesPlanId
    },
    focusnum(val, index) {
      let obj = {
        no: val.contractNo,
        pageNum: 1,
        pageSize: -1,
      }
      this._index = index
      this.taxRateList = []
      getcrmReceivablesPlanlist(obj).then(res => {
        this.taxRateList = res.data.records.map(item => {
          return { fullName: item.num, enCode: item.num, thisReceivablesMoney: item.planReceivablesMoney, receivablesPlanId: item.id }
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
            contractId: item.all.id,
            contractNo: item.all.no,
            contractName: item.all.contractName,
            contractMoney: item.all.money,
            unreceivedMoney: item.all.unreceivedMoney,
            receivablesPlanId: '',
            thisReceivablesMoney: '',
            num: '',
            remark: '',
          }
          this.dataFormTwo.lines.push(a)
        })
      }
    },
    // 获取回款方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "paymentMethod") {
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
      if (listQuery.categoryId === data.id) return listQuery
      listQuery.categoryId = data.id
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
      if (this.btntype === 'add' || this.btntype === 'edit') this.fetchData('HKBH')
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailcrmReceivables(this.dataForm.id).then(res => {
            this.dataForm = res.data.receivables
            this.dataFormTwo.lines = res.data.lines
            if (res.data.attachmentList) {
              res.data.attachmentList.forEach((item) => {
                this.datafilelist.push(
                  {
                    name: item.document.fullName,
                    fileSize: item.document.fileSize,
                    filename: item.document.filePath,
                    id: item.document.id,
                    url: item.url
                  }
                )
              })
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
      if (this.dataFormTwo.lines.length > 1) {
        this.$message.error('当前只能选择一份合同')
        return
      }
      if (submitFlag) {
        this.btnLoading = true;
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'customer',
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        this.dataForm.contractId = this.dataFormTwo.lines[0].contractId
        let obj = {
          receivables: this.dataForm,
          lines: this.dataFormTwo.lines,
          attachmentList: this.datafilelist
        }
        let formMethod = this.dataForm.id ? updatecrmReceivables(obj) : addcrmReceivables(obj);
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
