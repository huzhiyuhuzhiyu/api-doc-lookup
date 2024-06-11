<template>
  <el-dialog :title="!dataForm.id ? '新建物料分类' : '编辑物料分类'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px" @close="$emit('close')">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
      label-position="top" label-width="120px">
      <el-form-item label="上级分类" prop="parentName">
        <ComSelect3 v-model="dataForm.parentName" placeholder="请选择上级分类" auth @change="onOrganizeChange"
          :currOrgId="dataForm.id" :type="dataForm.type" :classAttribute="dataForm.classAttribute" />
      </el-form-item>
      <el-form-item label="类别属性" prop="classType">
        <el-select v-model="dataForm.classType" placeholder="请选择类别属性" clearable style="width: 100%;">
          <el-option v-for="(item, index) in categoryPropertList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入分类编码" maxlength="20" />
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入分类名称" maxlength="20" />
      </el-form-item>
      <el-form-item label="类型" prop="classType">
        <el-select v-model="dataForm.classType" placeholder="请选择类型" clearable style="width: 100%;">
          <el-option v-for="(item, index) in classTypelist" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" maxlength="200" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t('common.submitButton') }}
      </el-button>
    </span>
  </el-dialog>
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
        classType: '',
        code: '',
        name: '',
        remark: '',
        classAttribute: "material"
      },
      categoryPropertList:[
        {
          label:"原材料",
          value:"1",
        }, {
          label:"半成品",
          value:"1",
        }, {
          label:"成品",
          value:"1",
        }, {
          label:"辅料",
          value:"1",
        },
      ],
      autoCode: '',
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
      },
      classTypelist: [
        { label: "包装物", value: "packaging" }
      ]
    }
  },
  methods: {
    init(id, parentId) {
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.parentId = parentId || '-1'
      this.formLoading = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          detailCategory(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.autoCode = res.data.code
            this.formLoading = false
          })
        } else {
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
