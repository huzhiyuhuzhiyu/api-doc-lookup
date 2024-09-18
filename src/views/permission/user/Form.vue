<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="onlyRead ? '查看用户信息' : !this.dataForm.id ? '新建用户' : '编辑用户信息'" />
        <div class="options" v-if="!onlyRead">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="basicInfo">
              <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="账户" prop="account">
                      <el-input v-model="dataForm.account" placeholder="请输入账户" :disabled="onlyRead" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="所属员工" prop="name">
                      <ComSelect-page :dataFormatting="dataFormatting" v-model="dataForm.name" @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择员工" treeTitle="部门" placeholder="请选择员工" :methodArr="ProductMethodArr" :listMethod="getbaseEmployee" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList" :treeNodeClick="PartnerTreeNodeClick" :isdisabled="onlyRead" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="姓名" prop="realName">
                      <el-input v-model="dataForm.realName" placeholder="请输入姓名" :disabled="onlyRead" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="手机号" prop="mobilePhone">
                      <el-input v-model="dataForm.mobilePhone" placeholder="请输入手机号" :disabled="onlyRead" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="dataForm.email" placeholder="请输入邮箱" :disabled="onlyRead" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="所属组织" prop="organizeIdTree" ref="organizeIdTree">
                      <ComSelect v-model="dataForm.organizeIdTree" placeholder="请选择所属组织" :disabled="onlyRead || !!this.dataForm.id" multiple @change="onOrganizeChange" clearable auth />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="onlyRead" type="textarea" maxlength="200" :rows="2" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import {
  getbaseEmployee
} from '@/api/permission/user'
import { createUser, updateUser, getUserInfo } from '@/api/permission/user'
export default {
  data() {
    return {
      ProductMethodArr: { method: getDepartmentSelectorByAuth, requestObj: 0 },
      getDepartmentSelectorByAuth,
      partnerSearchList: [
        { prop: 'jobNumber', label: '工号', type: 'input' },
        { prop: 'name', label: '姓名', type: 'input' }
      ],
      partnerRequestObj: {
        account: "",
        employeeStatus: "",
        employeeType: "",
        orderItems: [{
          asc: true,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        organizeId: '',
        pageNum: 1,
        pageSize: 20,
        realName: ""
      },
      // 客户列表字段
      partnerTableItems: [
        { prop: 'jobNumber', label: '工号' },
        { prop: 'name', label: '姓名' },
        { prop: 'sex', label: '性别' },
        { prop: 'organizeName', label: '所属部门' }
      ],
      activeNames: ["basicInfo"],
      requestObj: {
        customerStatus: 'private_sea',
      },
      getbaseEmployee,
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        account: '',
        name: '',
        realName: '',
        mobilePhone: '',
        email: '',
        remark: '',
        organizeIdTree: [],
        remark: ''
      },
      dataRule: {
        account: [
          { required: true, message: '请输入账户', trigger: 'blur' },
        ],
        realName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        mobilePhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        organizeIdTree: [
          { required: true, message: '请选择所属组织', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    dataFormatting(res) {
      let treeData = res.data.list.map(item => {
        item.name = item.fullName;
        item.childrenList = this.transform(item.children)
        return item;
      });
      return treeData
    },
    transform(nodes) {
      return nodes.map(node => {
        if (node.children) {
          node.childrenList = this.transform(node.children);
          delete node.children; // 删除原来的children属性
        }
        node.name = node.fullName;
        return node;
      });
    },
    PartnerTreeNodeClick(data, node, listQuery) {
      if (listQuery.organizeId === data.id) return listQuery
      listQuery.organizeId = data.id
      return listQuery
    },
    partnerChange(val, data, paramsObj) {
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.name = data[0].all.name
        if (data[0].all.postId) this.dataForm.organizeIdTree = data[0].all.organizeIdTree
        this.dataForm.realName = data[0].all.name
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.organizeIdTree = []
        this.dataForm.realName = ''
        this.dataForm.name = ''
      }
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type, onlyRead) {
      this.visible = true
      this.dataForm.id = id || ''
      this.onlyRead = onlyRead
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getUserInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
          }).catch(() => this.formLoading = false)
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
          let formMethod = this.dataForm.id ? updateUser : createUser
          formMethod(obj).then(res => {
            let msg = ""
            if (formMethod == updateUser) {
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
