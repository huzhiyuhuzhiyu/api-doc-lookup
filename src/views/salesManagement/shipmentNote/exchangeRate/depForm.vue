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
        label-position="top" label-width="120px">
        <el-form-item label="币制" prop="currencySystem">
          <el-input v-model="dataForm.currencySystem" placeholder="请输入币制" maxlength="20" />
        </el-form-item>
        <el-form-item label="兑换比" prop="exchangeRate">
          <el-input v-model="dataForm.exchangeRate" placeholder="请输入兑换比" maxlength="20" />
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
import { detailCategory, updateCategory, checkCategoryCode } from '@/api/basicData/materialSettings'
import { addExchangeRate } from "@/api/masterDataManagement/productManage"

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        exchangeRate: '',
        currencySystem: '',
      },
      title: '',
      btntype: false,
      codeConfig: {},
      dataRule: {
        currencySystem: [{ required: true, message: '请输入币制', trigger: 'blur' }],
        exchangeRate: [
          { required: true, message: '请输入兑换比', trigger: 'blur' },
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
            this.formLoading = false
          })
        } else {
          // this.fetchData('bm_gy_gxfl', true)
          this.formLoading = false
        }
      })
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
