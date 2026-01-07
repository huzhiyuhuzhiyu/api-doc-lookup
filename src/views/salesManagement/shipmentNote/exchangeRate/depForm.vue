<template>
  <el-drawer :title="title" :wrapperClosable="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-common-drawer" width="500px" @close="$emit('close')">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding:10px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule"
        label-position="top" label-width="120px" :hide-required-asterisk="true">
        <el-form-item label="兑换比" prop="code">
          <el-input v-model="dataForm.code" placeholder="请输入兑换比" maxlength="20" />
        </el-form-item>
        <el-form-item label="币制" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入币制" maxlength="20" />
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
import { detailCategory, updateCategory, addExchangeRate, checkCategoryCode } from '@/api/basicData/materialSettings'

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        code: '',
        name: '',
      },
      autoCode: '',
      title: '',
      btntype: false,
      codeConfig: {},
      dataRule: {
        name: [{ required: true, message: '请输入币制', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入兑换比', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    // async fetchData(code, flag) {
    //   try {
    //     const data = await this.jnpf.getBillRuleConfigFun(code)
    //     this.codeConfig = data
    //     if (flag) {
    //       this.dataForm.code = data.number
    //     }
    //   } catch (error) { }
    // },
    init(id, parentId) {
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.parentId = parentId || '-1'
      this.formLoading = true
      this.title = !this.dataForm.id ? '新建外币汇率' : '编辑外币汇率'
      console.log(123)
      this.$nextTick(() => {
        if (this.dataForm.id) {
          // this.fetchData('bm_gy_gxfl', false)
          detailCategory(this.dataForm.id).then((res) => {
            this.dataForm = res.data
            this.autoCode = res.data.code
            this.formLoading = false
          })
        } else {
          // this.fetchData('bm_gy_gxfl', true)
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
        let formMethod = this.dataForm.id ? updateCategory : addExchangeRate
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
