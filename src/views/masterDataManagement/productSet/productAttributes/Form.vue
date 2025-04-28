<template>
  <el-drawer @closed="cancelFun" :title="!dataForm.id ? '新建产品属性' : '编辑产品属性'" :wrapperClosable="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-common-drawer" width="500px">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding:10px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px" hide-required-asterisk="fasle">
        <!-- <el-form-item label="编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入编码" maxlength="20" />
      </el-form-item> -->
        <el-form-item label="名称" prop="name">
          <template slot="label">
            名称<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.name" placeholder="请输入名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="排序" prop="sortCode">
          <template slot="label">
            排序<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.sortCode" type="text"  placeholder="请输入排序" />
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
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delBimProductAttributes,
  addBimProductAttributes,
  getbimProductAttributesList,
  checkAbnoramlTypeCode
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
        // code: '',
        typeCode: '',
        sortCode:"",
      },
      title: '',
      isdisabled: false,
      organizeIdTree: [],
      btntype: '',
      autoName: '',
      dataRule: {
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        sortCode: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (this.dataForm.name === this.autoName) {
                callback()
              } else {
                if (this.dataForm.id) {
                  checkAbnoramlTypeCode(this.dataForm.typeCode, value, this.dataForm.id)
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        callback(new Error('此类型名称已存在'))
                      }
                    })
                    .catch((err) => {
                      callback(new Error(' '))
                    })
                } else {
                  checkAbnoramlTypeCode(this.dataForm.typeCode, value, '')
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
          },

          // { validator: this.formValidate('fullName', '名称不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '名称最多为50个字符！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(code, btntype) {
      this.visible = true

      if (btntype == 'add') {
        this.dataForm = {
          name: '',
          remark: '',
          sortCode:"",
          // code: '',
          typeCode: code,
          id: ''
        }
        this.title = '新建产品属性'
      } else if (btntype == 'edit') {
        getBimProductAttributesInfo(code).then((res) => {
          // this.dataForm.code = res.data.code
          this.autoName = res.data.name
          this.dataForm.typeCode = res.data.typeCode
          this.dataForm.name = res.data.name
          this.dataForm.remark = res.data.remark
          this.dataForm.id = res.data.id
          this.title = '编辑产品属性'
        })
      } else if (btntype == 'copy') {
        getBimProductAttributesInfo(code).then((res) => {
          // this.dataForm.code = res.data.code
          this.autoName = res.data.name
          this.dataForm.typeCode = res.data.typeCode
          this.dataForm.name = res.data.name
          this.dataForm.sortCode = res.data.sortCode
          this.dataForm.remark = res.data.remark
          this.title = '新建产品属性'

        })
      }
      this.btntype = btntype
    },
    cancelFun() {
      this.visible = false
      console.log("this.$refs['dataForm']")
      this.$refs['dataForm'].resetFields()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          console.log(this.btntype, 'btntype')
          console.log(this.dataForm, 'fprm')
          let formMethod = this.btntype == 'add' ? addBimProductAttributes : updataBimProductAttributes
          console.log('formMethod', formMethod)
          if (formMethod == updataBimProductAttributes) {
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