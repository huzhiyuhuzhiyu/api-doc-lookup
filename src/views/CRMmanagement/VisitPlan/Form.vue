<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑拜访计划' : btntype == 'add' ? '新建拜访计划' : '查看拜访计划'" />
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
                      <el-form-item label="拜访计划名称" prop="visitName">
                        <el-input v-model="dataForm.visitName" placeholder="请输入拜访计划名称" :disabled="btntype == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="预计拜访时间" prop="visitTime">
                        <el-date-picker v-model="dataForm.visitTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择预计拜访时间" :disabled="btntype == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="负责人" prop="ownerUserId">
                        <user-select v-model="dataForm.ownerUserId" placeholder="请选择负责人" clearable style="width: 100%" :disabled="btntype == 'look'">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="客户名称" prop="customerName">
                        <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.customerName" @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类" placeholder="请选择客户名称" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }" :listMethod="getPartnerList" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList" :treeNodeClick="PartnerTreeNodeClick" :isdisabled="btntype === 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="联系人" prop="contactsId">
                        <el-select v-model="dataForm.contactsId" placeholder="请选择联系人" clearable style="width: 100%;" :disabled="btntype == 'look'||!dataForm.customerName">
                          <el-option v-for="(item, index) in contactsIdList" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="商机名称" prop="businessName">
                        <ComSelect-page v-model="dataForm.businessName" @change="businessChange" :tableItems="businessIdTableItems" dialogTitle="选择商机" placeholder="请选择商机" :listMethod="getcrmBusinessList" :listRequestObj="businessRequestObj" :searchList="businessSearchList" :isdisabled="btntype === 'look'||!dataForm.customerName" :renderTree="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="拜访目的" prop="visitAim">
                        <el-select v-model="dataForm.visitAim" placeholder="请选择拜访目的" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in visitGoalList" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
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
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getPartnerList, getMyContactsList } from '@/api/customerManagement/index'
import { addcrmVisit, detailcrmVisit, updatecrmVisit, getcrmBusinessList } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      businessSearchList: [
        { prop: 'businessName', label: '商机名称', type: 'input' },
      ],
      businessRequestObj: {
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
      getcrmBusinessList,
      //商机列表字段
      businessIdTableItems: [
        { prop: 'businessName', label: '商机名称' },
        { prop: 'money', label: '商机金额' },
        { prop: 'nextTime', label: '下次联系时间' },
        { prop: 'remark', label: '备注' }
      ],
      visitGoalList: [],
      contactsIdList: [],
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
      activeNames: ["basicInfo"],
      requestObj: {
        customerStatus: 'private_sea',
      },
      getPartnerList,
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        visitName: '',
        visitTime: '',
        ownerUserId: '',
        ownerUserName: '',
        customerName: '',
        customerId: '',
        contactsId: '',
        businessName: '',
        businessId: '',
        visitAim: '',
        remark: ''
      },
      btntype: false,
      dataRule: {
        visitName: [
          { required: true, message: '请输入拜访计划名称', trigger: 'blur' },
        ],
        visitTime: [
          { required: true, message: '请选择预计拜访时间', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '请选择客户', trigger: 'blur' },
        ],
        visitAim: [
          { required: true, message: '请选择拜访目的', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
    this.getDictionaryType()
    this.dataForm.ownerUserId = this.userInfo.userId
  },
  computed:{
    ...mapGetters(['userInfo']),
  },
  methods: {
    //商机选框传值
    businessChange(val, data) {
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.businessName = data[0].all.businessName
        this.dataForm.businessId = data[0].all.id
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.businessName = ""
        this.dataForm.businessId = ""
      }
    },
    // 获取拜访数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "Purposeofvisit") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.visitGoalList = response.data.list
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
        this.businessRequestObj.customerName = this.dataForm.customerName
        this.dataForm.contactsId = ''
        this.dataForm.contactsName = ''
        this.dataForm.businessName = ""
        this.dataForm.businessId = ""
        getMyContactsList({
          cooperativePartnerName: this.dataForm.customerName, pageNum: 1,
          pageSize: -1,
        }).then(res => {
          this.contactsIdList = res.data.records
        })
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.customerId = ""
        this.dataForm.customerName = ""
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
          detailcrmVisit(this.dataForm.id).then(res => {
            this.dataForm = res.data
            getMyContactsList({
              cooperativePartnerName: this.dataForm.customerName, pageNum: 1,
              pageSize: -1,
            }).then(res => {
              this.contactsIdList = res.data.records
              this.formLoading = false
            })
          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let obj = {
            ...this.dataForm
          }
          let formMethod = this.dataForm.id ? updatecrmVisit(obj) : addcrmVisit(obj);
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
