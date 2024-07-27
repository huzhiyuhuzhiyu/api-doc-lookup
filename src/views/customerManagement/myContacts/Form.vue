<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑客户联系人' : btntype == 'add' ? '新建客户联系人' : '查看客户联系人'" />
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
                      <el-form-item label="姓名" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入姓名" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="性别" prop="sex">
                        <el-select v-model="dataForm.sex" placeholder="请选择性别" clearable style="width: 100%;" :disabled="btntype == 'look' ? true : false">
                          <el-option v-for="(item, index) in sexList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="客户名称" prop="cooperativePartnerName">
                        <ComSelect-list :isdisabled="btntype=== 'look'" v-model="dataForm.cooperativePartnerName" placeholder="请选择客户名称" @change="onPartnerChange" :title="'选择客户'" :method="getPartnerList" :requestObj="requestObj" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="电话" prop="phone">
                        <el-input v-model="dataForm.phone" placeholder="请输入电话" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="邮箱" prop="email">
                        <el-input v-model="dataForm.email" placeholder="请输入邮箱" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="地址" prop="address">
                        <el-input v-model="dataForm.address" placeholder="请输入地址" :disabled="btntype === 'look' ? true : false" maxlength="300" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="职务" prop="displayName">
                        <el-input v-model="dataForm.displayName" placeholder="请输入职务" :disabled="btntype === 'look' ? true : false" maxlength="300" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="部门" prop="departmentName">
                        <el-input v-model="dataForm.departmentName" placeholder="请输入部门" :disabled="btntype === 'look' ? true : false" maxlength="300" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="爱好" prop="hobby">
                        <el-input v-model="dataForm.hobby" placeholder="请输入爱好" :disabled="btntype === 'look' ? true : false" maxlength="300" />
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
import { getPartnerList } from '@/api/customerManagement/index'
import { addcustomercontact, detailcustomercontact, updatecustomercontact } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      activeNames: ["basicInfo"],
      requestObj: {
        customerStatus: 'private_sea',
      },
      getPartnerList,
      sexList: [
        {
          value: "男",
          label: "男"
        },
        {
          value: "女",
          label: "女"
        }, {
          value: "-",
          label: "-"
        },
      ],
      activeName: "jcInfo",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        cooperativePartnerName: '',
        cooperativePartnerId: '',
        id: '',
        sex: '',
        phone: '',
        remark: '',
        email: '',
        name: '',
        hobby: '',
        departmentName: '',
        displayName: '',
        address: ''
      },
      btntype: false,
      dataRule: {
        cooperativePartnerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
  },
  methods: {
    onPartnerChange(id, data) {
      if (!data.length) return
      this.$nextTick(() => this.$refs['dataForm'].validateField('cooperativePartnerName'))
      if (data) {
        this.dataForm.cooperativePartnerId = data[0].id
        this.dataForm.cooperativePartnerName = data[0].name
      } else {
        this.dataForm.cooperativePartnerId = ''
        this.dataForm.cooperativePartnerName = ''
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
          detailcustomercontact(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
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
          let formMethod = this.dataForm.id ? updatecustomercontact(obj) : addcustomercontact(obj);
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
