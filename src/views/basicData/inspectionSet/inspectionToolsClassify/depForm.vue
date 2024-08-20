<template>
  <el-drawer :title="!dataForm.id ? '新建检验工具分类' : '编辑检验工具分类'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-common-drawer" width="500px">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding: 10px;">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
        label-position="top" label-width="120px">
        <el-form-item label="上级分类" prop="parentName">
          <!-- <ComSelect3  v-model="dataForm.parentName" :isdisabled="isdisabled" placeholder="请选择上级分类" auth
          @change="onOrganizeChange" :currOrgId="dataForm.id" :type="dataForm.type"
          :classAttribute="dataForm.classAttribute" /> -->
          <ComSelect-list :isdisabled="isdisabled" v-model="dataForm.parentName" placeholder="请选择上级分类" auth
            @change="onOrganizeChange" :title="'选择上级分类'" :method="getCategoryTrees" :requestObj="requestObjTwo"
            :paramsObj="{}" />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入分类名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span class="button-bottom">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提交
        </el-button>
      </span>
    </div>
  </el-drawer>
</template>

<script>
import { updateDepartment } from '@/api/permission/department'
import { detailCategory, updateCategory, addCategory } from '@/api/basicData/materialSettings'

import { getCategoryTrees, getUserList, checkEquEquipmentCode } from '@/api/basicData/index'

export default {
  data() {
    return {
      getCategoryTrees,
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      title: '',
      dataForm: {
        name: '',
        remark: '',
        parentId: '',
        parentName: '',
        classAttribute: 'ispection_tools'
      },
      requestObjTwo: {
        page: 1,
        limit: 999,
        keyword: '',
        classAttribute: 'ispection_tools'
      },
      parentId: '',
      organizeIdTree: [],
      dataRule: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { validator: this.formValidate('fullName', '分类名称不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '分类名称最多为50个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, parentId) {
      this.visible = true
      this.dataForm.id = id || ''
      this.parentId = parentId || ''
      this.title = !this.dataForm.id ? '新建检验工具分类' : '编辑检验工具分类'
      if (parentId == '-1') {
        this.isdisabled = true
      } else {
        this.isdisabled = false
      }
      this.organizeIdTree = []
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailCategory(this.dataForm.id).then((res) => {
            this.dataForm = res.data
            this.organizeIdTree = res.data
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    onOrganizeChange(val, data) {
      console.log(data)
      if (data.length === 0) {
        this.dataForm.parentId = ''
        this.dataForm.parentName = ''
      } else {
        this.dataForm.parentId = data[0].id
        this.dataForm.parentName = data[0].name
      }
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = this.dataForm.id ? updateCategory : addCategory
          formMethod(this.dataForm)
            .then((res) => {
              let msg = ''
              if (formMethod == updateCategory) {
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
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.custom_title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  margin-left: -52px;
}

.required {
  color: red;
  margin-left: 4px;
}

.button-bottom {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>
