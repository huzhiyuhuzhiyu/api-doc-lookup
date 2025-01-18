<template>
  <el-drawer :title="!dataForm.id ? '新建报废类型' : '编辑报废类型'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll width="600px" @close="handleClose" class="JNPF-common-drawer">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding: 10px;">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px" :hide-required-asterisk="true">
        <el-form-item label="报废名称" prop="name">
          <template slot="label">
            报废名称<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.name" placeholder="请输入报废名称" maxlength="20" :disabled="btntype ? true : false" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <template slot="label">
            单价<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.price" placeholder="请输入单价" maxlength="20" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
    </div>

    <span class="button-bottom">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交
      </el-button>
    </span>
  </el-drawer>
</template>

<script>
import {
  addScrapCategoryData,
  editScrapCategoryData,
  checkScrapCategoryName
} from '@/api/basicData/index'
import formValidate from '@/utils/formValidate'
export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      title: '',
      dataForm: {
        name: '',
        price: '',
        id: ''
      },
      codeConfig: {},
      btntype: false,
      dataRule: {
        name: [
          { required: true, message: '请输入报废名称', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id)
              if (this.dataForm.id) {
                checkScrapCategoryName(value, this.dataForm.id)
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('报废名称已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              } else {
                checkScrapCategoryName(value, '')
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('报废名称已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              }
            },
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '请输入单价',
            trigger: ['blur']
          },
          { validator: this.formValidate('positiveNumber','', (errMsg) => {  }), trigger: 'blur' },
        ],
      }
    }
  },
  created() { },
  methods: {
    handleClose() { },

    init(row) {

      this.visible = true

      this.title = !this.dataForm.id ? '新建报废类型' : '编辑报废类型'
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm = { ...row }
      })

    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = this.dataForm.id ? editScrapCategoryData : addScrapCategoryData
          formMethod(this.dataForm)
            .then((res) => {
              console.log(666, res)
              let msg = ''
              if (formMethod == editScrapCategoryData) {
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