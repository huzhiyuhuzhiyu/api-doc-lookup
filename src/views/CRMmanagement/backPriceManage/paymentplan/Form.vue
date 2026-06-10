<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑回款计划' : btntype == 'add' ? '新建回款计划' : '查看回款计划'" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()" v-if="btntype !== 'look'">
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
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="负责人" prop="ownerUserId">
                        <user-select v-model="dataForm.ownerUserId" placeholder="请选择负责人" clearable style="width: 100%" :disabled="btntype == 'look'" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="客户名称" prop="customerName">
                        <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.customerName" @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类" placeholder="请选择客户" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }" :listMethod="getCooperativeData" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList" :treeNodeClick="PartnerTreeNodeClick" :isdisabled="btntype === 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="合同编号" prop="contractNo">
                        <ComSelect-page v-model="dataForm.contractNo" @change="contractChange" :tableItems="contractTableItems" dialogTitle="选择合同" placeholder="请选择合同编号" :listMethod="getcrmContractlist" :listRequestObj="contractRequestObj" :searchList="contractSearchList" :isdisabled="btntype === 'look'||!dataForm.customerName" :renderTree="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="计划回款金额" prop="planReceivablesMoney">
                        <el-input v-model="dataForm.planReceivablesMoney" placeholder="请输入计划回款金额" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="计划回款日期" prop="planReceivablesData">
                        <el-date-picker v-model="dataForm.planReceivablesData" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择计划回款日期" :disabled="btntype == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="前几天提醒" prop="remindInAdvance">
                        <el-input v-model="dataForm.remindInAdvance" placeholder="请输入前几天提醒" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="回款方式" prop="receivablesType">
                        <el-select v-model="dataForm.receivablesType" placeholder="请选择回款方式" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in returnTypeList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btntype == 'look'" type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch=='1'">
            <UploadWj v-model="datafilelist" :disabled="btntype=='look'" :detailed="btntype=='look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getBimBusinessDetail } from '@/api/basicData/index'
import { mapGetters } from 'vuex'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeData } from '@/api/basicData/index'
import { addcrmReceivablesPlan, detailcrmReceivablesPlan, updatecrmReceivablesPlan, getcrmContractlist } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      datafilelist: [],
      isattachmentswitch: '',
      categoryId: '',
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
        type: "customer",
        partnerCategoryId: '',
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
      activeNames: ["basicInfo"],
      requestObj: {
        customerStatus: 'private_sea',
      },
      getCooperativeData,
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        ownerUserId: '',
        ownerUserName: '',
        customerName: '',
        customerId: '',
        contractNo: '',
        contractId: '',
        planReceivablesMoney: '',
        planReceivablesData: '',
        remindInAdvance: '',
        receivablesType: '',
        remark: ''
      },
      btntype: false,
      dataRule: {
        ownerUserId: [
          { required: true, message: '请选择负责人', trigger: 'blur' },
        ],
        planReceivablesMoney: [
          { required: true, message: '请输入计划回款金额', trigger: 'blur' },
        ],
        planReceivablesData: [
          { required: true, message: '请选择计划回款日期', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '请选择客户', trigger: 'blur' },
        ],
        contractNo: [
          { required: true, message: '请选择合同编号', trigger: 'blur' },
        ]
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getBimBusinessDetail()
    this.getDictionaryType()
  },
  methods: {
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_hkjh'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    //负责人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("ownerUserId") });
    },
    //合同选框传值
    contractChange(val, data) {
      if (data && data.length) {
        this.dataForm.contractNo = data[0].all.no
        this.dataForm.contractId = data[0].all.id
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.contractNo = ""
        this.dataForm.contractId = ""
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
        this.dataForm.contractNo = ""
        this.dataForm.contractId = ""
        this.contractRequestObj.customerName = this.dataForm.customerName
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.customerId = ""
        this.dataForm.customerName = ""
        this.dataForm.contractNo = ""
        this.dataForm.contractId = ""
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
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailcrmReceivablesPlan(this.dataForm.id).then(res => {
            this.dataForm = res.data
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
          this.dataForm.ownerUserId = this.userInfo.userId
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: 'system_attachment',
            configKey: 'fj_hkjh',
            categoryId: this.categoryId,
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj = {
            ...this.dataForm,
            attachmentList: this.datafilelist,
          }
          let formMethod = this.dataForm.id ? updatecrmReceivablesPlan(obj) : addcrmReceivablesPlan(obj);
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
      })
    }
  }
}
</script>
<style scoped lang="scss">
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
::v-deep .el-form-item__content p {
  border: none;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
