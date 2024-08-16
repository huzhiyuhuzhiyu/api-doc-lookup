<template>
  <el-drawer @closed="cancelFun" :title="!dataForm.id ? '新建类别属性' : '编辑类别属性'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll width="500px" class="JNPF-common-drawer">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding:10px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px" :hide-required-asterisk="true">
        <el-form-item label="类别名称" prop="name">
          <template slot="label">
            类别名称<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.name" placeholder="请输入类别名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="类别编码" prop="code">
          <template slot="label">
            类别编码<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.code" placeholder="请输入类别编码" maxlength="20" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span class="button-bottom">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提交
        </el-button>
      </span>
    </div>
  </el-drawer>
</template>

<script>
import {
  getClassAttributeInfo,
  updataClassAttribute,
  delBimProductAttributes,
  addClassAttributes,
  getbimProductAttributesList,
  checkClassAttributeCode
} from '@/api/masterDataManagement/index'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        name: '',
        remark: '',
        code: ''
      },
      title: '',
      isdisabled: false,
      organizeIdTree: [],
      btntype: '',
      autoCode: '',
      dataRule: {
        code: [
          { required: true, message: '请输入类别编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (this.dataForm.code === this.autoCode) {
                callback()
              } else {
                if (this.dataForm.id) {
                  checkClassAttributeCode(value, this.dataForm.id)
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        callback(new Error('此类型编码已存在'))
                      }
                    })
                    .catch((err) => {
                      callback(new Error(' '))
                    })
                } else {
                  checkClassAttributeCode(value, '')
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        callback(new Error('此类型编码已存在'))
                      }
                    })
                    .catch((err) => {
                      callback(new Error(' '))
                    })
                }
              }
            },
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入类别名称', trigger: 'blur' },
          // { validator: this.formValidate('fullName', '名称不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '名称最多为50个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, btntype) {
      this.visible = true
      if (btntype == 'add') {
        this.dataForm = {
          name: '',
          remark: '',
          code: ''
        }
        this.title = '新建类别属性'
      } else if (btntype == 'edit') {
        getClassAttributeInfo(id).then((res) => {
          this.dataForm.code = res.data.code
          this.autoCode = res.data.code

          this.dataForm.name = res.data.name
          this.dataForm.remark = res.data.remark
          this.dataForm.id = res.data.id
          this.title = '编辑类别属性'
        })
      } else if (btntype == 'copy') {
        getClassAttributeInfo(id).then((res) => {
          this.dataForm.code = res.data.code
          this.autoCode = res.data.code

          this.dataForm.name = res.data.name
          this.dataForm.remark = res.data.remark
          this.title = '新增类别属性'
          // this.dataForm.id = res.data.id
        })
      }
      this.btntype = btntype
    },
    cancelFun() {
      this.visible = false

      this.$refs['dataForm'].resetFields()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true

          let formMethod = this.btntype == 'edit' ? updataClassAttribute : addClassAttributes
          this.dataForm.warehouseCode = this.dataForm.code
          this.dataForm.warehouseName = this.dataForm.name
          if (formMethod == updataClassAttribute) {
            formMethod(this.dataForm)
              .then((response) => {
                this.$message({
                  message: '修改成功',
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
          } else {
            formMethod(this.dataForm)
              .then((res) => {
                this.$message({
                  message: '新建成功',
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

.button-bottom {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>
