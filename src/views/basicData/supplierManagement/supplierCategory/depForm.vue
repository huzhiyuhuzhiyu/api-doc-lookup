<template>
  <el-drawer :title="!dataForm.id ? '新建供应商分类' : '编辑供应商分类'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-common-drawer" width="500px">
    <template slot="title">
      <div style="margin-left:-10px">
        {{ !dataForm.id ? '新建供应商分类' : '编辑供应商分类' }}
      </div>
    </template>
    <div style="padding:10px;">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
        label-position="top" label-width="120px" hide-required-asterisk="fasle">
        <el-form-item label="上级分类" prop="parentName">
          <ComSelect-list :isdisabled="dataForm.id ? true : false" v-model="dataForm.parentName" placeholder="请选择上级分类"
            auth @change="onOrganizeChange" :title="'选择上级分类'" :method="getcategoryTree" :requestObj="requestObjTwo"
            :paramsObj="{}" />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <template slot="label">
            分类名称<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.name" placeholder="请输入分类名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="排序值">
          <el-input v-model.number="dataForm.sortCode" placeholder="请输入排序值" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span style="display:flex;justify-content:flex-end;">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提交
        </el-button>
      </span>
    </div>
  </el-drawer>
</template>

<script>
import {
  getcategoryTree,
  addCategory,
  getCategoryInfo,
  editCategory,
  checkCategorychildNode
} from '@/api/basicData/index'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      getcategoryTree,
      requestObjTwo: {
        pageSize: -1,
        type: 'supplier'
      },
      dataForm: {
        name: '',
        remark: '',
        type: 'supplier',
        parentId: '',
        parentName: ''
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
          getCategoryInfo(this.dataForm.id).then((res) => {
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
      console.log('val', val, data)

      this.dataForm.parentId = data[0].id
      this.dataForm.parentName = data[0].name
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.dataForm.type = 'supplier'
          let formMethod = this.dataForm.id ? editCategory : addCategory
          console.log('formMethod', formMethod)
          if (formMethod == editCategory) {
            checkCategorychildNode(this.dataForm)
              .then((res) => {
                console.log(res)
                formMethod(this.dataForm)
                  .then((response) => {
                    let msg = ''
                    if (formMethod == editCategory) {
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
                this.btnLoading = false
              })
          } else {
            formMethod(this.dataForm)
              .then((res) => {
                let msg = ''
                if (formMethod == editCategory) {
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
<style lang="scss" scoped>
.custom_title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  margin-left: -12px;
}

.required {
  color: red;
  margin-left: 4px;
}
</style>