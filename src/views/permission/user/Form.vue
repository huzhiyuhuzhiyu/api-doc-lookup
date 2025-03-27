<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="onlyRead ? '查看用户信息' : !this.dataForm.id ? '新建用户' : '编辑用户信息'" />
        <div class="options" v-if="!onlyRead">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName">
          <el-alert title="注意：密码默认为123456" type="warning" :closable="false" show-icon style="margin-bottom: 3px;"
            v-if="!this.dataForm.id" />
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="basicInfo">
              <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
                label-width="120px">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="8" :xs="24" v-if="isval">
                    <el-form-item label="所属员工" prop="name">
                      <ComSelect-page :dataFormatting="dataFormatting" v-model="dataForm.name" @change="partnerChange"
                        :tableItems="partnerTableItems" dialogTitle="选择员工" treeTitle="部门" placeholder="请选择员工"
                        :methodArr="ProductMethodArr" :listMethod="getbaseEmployee" :listRequestObj="partnerRequestObj"
                        :searchList="partnerSearchList" :treeNodeClick="PartnerTreeNodeClick" :isdisabled="onlyRead" :listDataFormatting="listDataFormatting"/>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="isval ? 8 : 12" :xs="24">
                    <el-form-item label="姓名" prop="realName">
                      <el-input v-model="dataForm.realName" placeholder="请输入姓名" :disabled="onlyRead || isval" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="isval ? 8 : 12" :xs="24" v-if="isProjectSwitch === '1'">
                    <el-form-item label="所属项目" prop="projectId">
                      <el-select v-model="dataForm.projectId" placeholder="请选择所属项目" :disabled="onlyRead"
                        style="width: 100%;">
                        <el-option v-for="item in projectIdData" :key="item.id" :label="item.name"
                          :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="isval ? 8 : 12" :xs="24">
                    <el-form-item label="所属组织" prop="organizeIdTree" ref="organizeIdTree">
                      <ComSelect v-model="dataForm.organizeIdTree" placeholder="请选择所属组织"
                        :disabled="onlyRead  || isval" multiple @change="onOrganizeChange"
                        clearable auth />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="isval ? 8 : 12" :xs="24">
                      <el-form-item label="直属主管" prop="managerId">
                        <user-select v-model="dataForm.managerId" placeholder="请选择直属主管" :disabled="onlyRead" />
                      </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="账户" prop="account">
                      <el-input v-model="dataForm.account" placeholder="请输入账户" :disabled="onlyRead" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="!dataForm.id">
                    <el-form-item label="密码" prop="password">
                      <el-input v-model="dataForm.password" placeholder="请输入密码" show-password :disabled="onlyRead" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24" v-if="!dataForm.id">
                    <el-form-item label="确认密码" prop="submitpassword">
                      <el-input placeholder="请输入确认密码" v-model="dataForm.submitpassword" show-password
                        :disabled="onlyRead"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="角色" prop="roleId">
                      <el-select v-model="roleId" placeholder="请选择角色" :disabled="onlyRead" @change="onChange('roleId')"
                        style="width: 100%;" @visible-change="visibleChange" multiple filterable clearable>
                        <el-option-group v-for="group in roleTreeData" :key="group.id"
                          :label="group.fullName + (group.num ? '【' + group.num + '】' : '')">
                          <el-option v-for="item in group.children" :key="group.id + item.id" :label="item.fullName"
                            :value="item.id"></el-option>
                        </el-option-group>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="手机号" prop="mobilePhone">
                      <el-input v-model="dataForm.mobilePhone" placeholder="请输入手机号" :disabled="onlyRead" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="dataForm.email" placeholder="请输入邮箱" :disabled="onlyRead" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="8" :xs="24">
                    <el-form-item label="状态" prop="enabledMark">
                      <el-select v-model="dataForm.enabledMark" filterable placeholder="请选择状态" :disabled="onlyRead"
                        clearable style="width: 100%;">
                        <el-option v-for="item in enabledMarkList" :key="item.id" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="onlyRead" type="textarea"
                        maxlength="200" :rows="2" />
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
import { getRoleByOrganize } from '@/api/permission/role'
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import { getbaseEmployee } from '@/api/permission/user'
import { createUser, updateUser, getUserInfo } from '@/api/permission/user'
import { getProjectList } from '@/api/system/projectManagement'
import { getBimBusinessSwitchConfigList } from "@/api/basicData/index";
import { mapGetters } from "vuex"
export default {
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.getProjectSwitch()
    this.getProjectList()
  },
  data() {
    return {
      isProjectSwitch: '',
      enabledMarkList: [{ label: '启用', value: 1 }, { label: '锁定', value: 2 }, { label: '禁用', value: 0 }],
      isval: false,
      roleTreeData: [],
      roleId: [],
      projectIdData: [],
      ProductMethodArr: { method: getDepartmentSelectorByAuth, requestObj: 0 },
      getDepartmentSelectorByAuth,
      partnerSearchList: [
        { prop: 'jobNumber', label: '工号', type: 'input' },
        { prop: 'name', label: '姓名', type: 'input' }
      ],
      partnerRequestObj: {
        account: '',
        userFlag: 1,
        employeeStatus: '',
        employeeType: '',
        orderItems: [
          {
            asc: true,
            column: 'job_number'
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        organizeId: '',
        pageNum: 1,
        pageSize: 20,
        realName: '',
        userFlag: false
      },
      // 客户列表字段
      partnerTableItems: [
        { prop: 'jobNumber', label: '工号' },
        { prop: 'name', label: '姓名' },
        { prop: 'sexText', label: '性别' },
        { prop: 'organizeName', label: '所属部门' }
      ],
      activeNames: ['basicInfo'],
      requestObj: {
        customerStatus: 'private_sea'
      },
      getbaseEmployee,
      activeName: 'jcInfo',
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        enabledMark: 1,
        submitpassword: '',
        roleId: '', //角色id
        id: '',
        account: '',
        name: '',
        projectId: '', //所属项目
        realName: '',
        mobilePhone: '',
        email: '',
        password: '',
        remark: '',
        organizeIdTree: [],
        employeeId: '',
        employeeType: '',
        employeeStatus: '',
        remark: ''
      },
      dataRule: {
        name: [{ required: true, message: '请选择所属员工', trigger: 'blur' }],
        projectId: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
        account: [{ required: true, message: '请输入账户', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        mobilePhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.formValidate('iphone'), trigger: 'blur' }
        ],
        organizeIdTree: [{ required: true, message: '请选择所属组织', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        enabledMark: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        submitpassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    listDataFormatting(res) {
      let treeData = res.data.records.map((item) => {
        if (item.sex == '1') {
          item.sexText = '男'
        } else if (item.sex == '2') {
          item.sexText = '女'
        } else {
          item.sexText = '保密'
        }
        return item
      })
      return treeData
    },
    getProjectSwitch() {
      let obj = {
        businessCode: 'system',
        pageSize: -1
      }
      getBimBusinessSwitchConfigList(obj).then((res) => {
        res.data.system.forEach((item) => {
          if (item.configKey == 'project') {
            this.isProjectSwitch = item.configValue1

          }
        })
      })
    },
    getProjectList() {
      let query = {
        pageNum: 1,
        pageSize: -1
      }
      getProjectList(query)
        .then((res) => {
          this.projectIdData = res.data.records
        })
        .catch(() => { })
    },
    onChange(key) {
      this.dataForm[key] = this[key].join()
    },
    onOrganizeChange(val) {
      this.dataForm.roleId = ''
      this.dataForm.organizeId = ''
      this.roleId = []
      this.roleTreeData = []
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate(['organizeIdTree'])
      })
      if (!val || !val.length) return
      this.getOptionsByOrgIds(val)
    },
    getOptionsByOrgIds(organizeIdTree) {
      const organizeIds = organizeIdTree.map((o) => o[o.length - 1])
      this.dataForm.organizeId = organizeIds.join()
      getRoleByOrganize(organizeIds).then((res) => {
        this.roleTreeData = res.data.list.filter((o) => o.children && Array.isArray(o.children) && o.children.length)
      })
    },
    visibleChange(val) {
      if (!val) return
      if (!this.dataForm.organizeIdTree || !this.dataForm.organizeIdTree.length) {
        this.positionTreeData = []
        this.positionId = []
        this.$message.warning('请先选择所属组织')
      }
    },
    dataFormatting(res) {
      let treeData = res.data.list.map((item) => {
        item.name = item.fullName
        item.childrenList = item.children ? this.transform(item.children) : []
        return item
      })
      return treeData
    },
    transform(nodes) {
      return nodes.map((node) => {
        if (node.children) {
          node.childrenList = this.transform(node.children)
          delete node.children // 删除原来的children属性
        }
        node.name = node.fullName
        return node
      })
    },
    PartnerTreeNodeClick(data, node, listQuery) {
      if (listQuery.organizeId === data.id) return listQuery
      listQuery.organizeId = data.id
      return listQuery
    },
    partnerChange(val, data, paramsObj) {
      if (data && data.length) {
        // 数据有效，进行更新
        console.log(data, '[]')
        this.dataForm.name = data[0].all.name
        this.dataForm.employeeStatus = data[0].all.employeeStatus
        this.dataForm.employeeType = data[0].all.employeeType
        this.dataForm.employeeId = data[0].all.id
        this.projectId = data[0].all.projectId
        this.dataForm.projectId = data[0].all.projectId
        if (data[0].all.postId) this.dataForm.organizeIdTree = data[0].all.organizeIdTree
        if (this.dataForm.organizeIdTree && this.dataForm.organizeIdTree.length) {
          this.getOptionsByOrgIds(this.dataForm.organizeIdTree)
        }
        this.dataForm.mobilePhone = data[0].all.mobileNumber
        this.dataForm.realName = data[0].all.name
        this.dataForm.managerId = data[0].all.managerId
      } else {
        // 不选择任何内容，置空绑定的值
        this.dataForm.employeeStatus = ''
        this.dataForm.employeeType = ''
        this.dataForm.employeeId = ''
        this.dataForm.organizeIdTree = []
        this.dataForm.mobilePhone = ''
        this.dataForm.realName = ''
        this.dataForm.name = ''
        this.dataForm.managerId = ''
      }
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type, onlyRead, val) {
      this.isval = val
      this.dataForm.organizeIdTree = []
      this.roleId = []
      this.roleTreeData = []
      this.visible = true
      this.dataForm.id = id || ''
      this.onlyRead = onlyRead
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getUserInfo(this.dataForm.id)
            .then((res) => {
              this.dataForm = res.data
              if (this.dataForm.roleId) this.roleId = this.dataForm.roleId.split(',')
              if (this.dataForm.organizeIdTree && this.dataForm.organizeIdTree.length) {
                this.getOptionsByOrgIds(this.dataForm.organizeIdTree)
              }
              this.formLoading = false
            })
            .catch(() => (this.formLoading = false))
        } else {
          this.dataForm.password = '123456'
          this.dataForm.submitpassword = '123456'
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.submitpassword != this.dataForm.password) return this.$message.error('两次密码输入不一致')
          let submitFlag = false
          console.log(this.userInfo.projectId, 'this.userInfo.projectId123')
          if (this.isProjectSwitch === '1') {

            if (this.projectId && this.dataForm.projectId !== this.projectId) {
              this.$confirm('所属项目已更改是否确定修改, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  console.log(123)
                  this.btnLoading = true
                  let obj = {
                    ...this.dataForm
                  }
                  let formMethod = this.dataForm.id ? updateUser : createUser
                  formMethod(obj)
                    .then((res) => {
                      let msg = ''
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
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  })
                })
            } else {
              this.btnLoading = true
              let obj = {
                ...this.dataForm
              }
              let formMethod = this.dataForm.id ? updateUser : createUser
              formMethod(obj)
                .then((res) => {
                  let msg = ''
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
                })
                .catch(() => {
                  this.btnLoading = false
                })
            }
          } else {
            this.btnLoading = true
            let obj = {
              ...this.dataForm
            }
            let formMethod = this.dataForm.id ? updateUser : createUser
            formMethod(obj)
              .then((res) => {
                let msg = ''
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
              })
              .catch(() => {
                this.btnLoading = false
              })
          }

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
