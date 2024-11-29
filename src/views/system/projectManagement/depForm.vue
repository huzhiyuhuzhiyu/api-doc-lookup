<template>
  <el-drawer :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-common-drawer" width="500px" @close="$emit('close')">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding:10px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
        label-position="top" label-width="120px" :hide-required-asterisk="true">
        <el-form-item label="项目名称" prop="name">
          <template slot="label">
            项目名称
            <span class="required">*</span>
          </template>
          <el-input v-model="dataForm.name" placeholder="请输入项目名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="项目编码" prop="code">
          <template slot="label">
            项目编码
            <span class="required">*</span>
          </template>
          <el-input v-model="dataForm.code" placeholder="请输入项目编码" maxlength="20" :disabled="btntype" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="dataForm.remark" type="textarea" maxlength="200" placeholder="请输入项目描述" />
        </el-form-item>
      </el-form>
      <span class="button-bottom">
        <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          {{ $t('common.submitButton') }}
        </el-button>
      </span>
    </div>
  </el-drawer>
</template>

<script>
import { detailCategory, updateProjectList, addProjectList, checkProjectCode } from '@/api/system/projectManagement'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        parentId: '',
        parentName: '',
        code: '',
        name: '',
        remark: '',
        type: 'process'
      },
      autoCode: '',
      title: '',
      btntype: false,
      codeConfig: {},
      dataRule: {
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入项目编码', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (value === this.autoCode) {
                callback()
              } else {
                checkProjectCode({
                  code: value,
                  id: this.dataForm.id
                })
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('此项目编码已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (flag) {
          this.dataForm.code = data.number
        }
      } catch (error) { }
    },
    sortChange(val) {
      console.log(val, 'klk')
    },
    init(row, parentId) {
      console.log(row, 'rr')
      this.visible = true

      this.dataForm.id = row ? row.id : ''
      this.formLoading = true
      this.title = !this.dataForm.id ? '新建项目管理' : '编辑项目管理'
      console.log(123)
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.btntype = true
          this.dataForm = {...row}
          this.formLoading = false
        } else {
          this.fetchData('bm_gy_xmgl', true)
          this.formLoading = false
        }
      })
    },
    onOrganizeChange(val, data) {
      if (!data) {
        this.dataForm.parentId = ''
        this.dataForm.parentName = ''
      } else {
        this.dataForm.parentId = data[0].id
        this.dataForm.parentName = data[0].name
      }
    },
    async dataFormSubmit() {
      let valid = await this.$refs['dataForm'].validate().catch((err) => false)
      this.btnLoading = true
      if (valid) {
        if (!this.dataForm.parentId) this.dataForm.parentId = '-1'
        let formMethod = this.dataForm.id ? updateProjectList : addProjectList
        formMethod(this.dataForm)
          .then((res) => {
            this.$emit('close', true)
            this.$message({
              message: this.dataForm.id ? '修改成功' : '新建成功',
              type: 'success',
              duration: 1500
            })
          })
          .catch(() => {
            this.btnLoading = false
          })
      } else {
        this.btnLoading = false
      }
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
