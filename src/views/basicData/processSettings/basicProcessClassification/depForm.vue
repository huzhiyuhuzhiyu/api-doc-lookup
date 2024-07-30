<template>
  <el-drawer :title="title" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-common-drawer" width="500px" @close="$emit('close')">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding:10px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
      label-position="top" label-width="120px">
      <!-- <el-form-item label="上级分类" prop="parentName">
        <ComSelect3 v-model="dataForm.parentName" placeholder="请选择上级分类" auth @change="onOrganizeChange"
          :currOrgId="dataForm.id" :type="dataForm.type" :classAttribute="dataForm.classAttribute" />
      </el-form-item> -->
      <el-form-item label="分类编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入分类编码" maxlength="20" :disabled="btntype ? true : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true ? false : true" />
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入分类名称" maxlength="20" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" maxlength="200" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <span style="display:flex;justify-content: flex-end;">
      <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t('common.submitButton') }}
      </el-button>
    </span>
  </div>
  </el-drawer>
</template>

<script>
import { detailCategory, updateCategory, addCategory, checkCategoryCode } from "@/api/basicData/materialSettings"

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        parentId: '',
        parentName: "",
        code: '',
        name: '',
        remark: '',
        classAttribute: "process"
      },
      autoCode: '',
      title:'',
      btntype: false,
      codeConfig: {},
      dataRule: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入分类编码', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) { callback() }
              else if (value === this.autoCode) { callback() }
              else {
                checkCategoryCode({ code: value, parentId: this.dataForm.parentId, classAttribute: this.dataForm.classAttribute }).then((res) => {
                  if (!res.data) { callback() }
                  else { callback(new Error('此分类编码已存在')) }
                }).catch((err) => { callback(new Error(" ")) })
              }
            },
            trigger: 'blur'
          }]
      }
    }
  },
  methods: {
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (!data.modifyFlag && data.codeWay == 'auto') {
          this.dataForm.code = data.number
        }
      } catch (error) {}
    },
    init(id, parentId) {
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.parentId = parentId || '-1'
      this.formLoading = true
      this.title = !this.dataForm.id ? '新建工序分类' : '编辑工序分类'
      this.$nextTick(() => {
        if (this.dataForm.id) {
          detailCategory(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.autoCode = res.data.code
            this.formLoading = false
          })
        } else {
           this.fetchData('bm_gy_gxfl')
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
      let valid = await this.$refs['dataForm'].validate().catch(err => false)
      this.btnLoading = true
      if (valid) {
        if (!this.dataForm.parentId) this.dataForm.parentId = '-1'
        let formMethod = this.dataForm.id ? updateCategory : addCategory
        formMethod(this.dataForm).then(res => {
          this.$emit('close', true)
          this.$message({
            message: this.dataForm.id ? '修改成功' : '新建成功',
            type: 'success',
            duration: 1500
          })
        }).catch(() => { this.btnLoading = false })
      } else { this.btnLoading = false }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom_title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
}
</style>