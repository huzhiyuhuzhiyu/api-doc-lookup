<template>
  <el-dialog :title="!dataForm.id ? '新建我的联系人' : '编辑我的联系人'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">
      <el-form-item label="编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入编码" maxlength="20" />

      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入名称" maxlength="20" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateDepartment } from '@/api/permission/department'
import { addCategory, getCategoryInfo, editCategory, checkCategorychildNode } from "@/api/basicData/index";

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        name: '',
        remark: '',
        type: 'customer',
        parentId: '',
        parentName: ""
      },
      isdisabled: false,
      organizeIdTree: [],
      dataRule: {
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     checkCode(value, this.dataForm.id,).then(res => {
          //       if (res.data) { callback(new Error("编码重复")); }
          //       else { callback(); }
          //     }).catch(error => { })
          //   }, trigger: 'blur'
          // },
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { validator: this.formValidate('fullName', '名称不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '名称最多为50个字符！', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    init(id, parentId) {
      this.visible = true
      this.dataForm.id = id || ''
      this.parentId = parentId || ''
      this.organizeIdTree = []
      this.formLoading = true
      if (parentId == '-1') {
        this.isdisabled = true
      } else {
        this.isdisabled = false
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getCategoryInfo(this.dataForm.id).then(res => {
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
      console.log("val", val, data);

      this.dataForm.parentId = data[0].id
      this.dataForm.parentName = data[0].name
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true

          let formMethod = this.dataForm.id ? editCategory : addCategory
          console.log("formMethod", formMethod);
          if (formMethod == editCategory) {
            checkCategorychildNode(this.dataForm).then(res => {
              console.log(res);
              formMethod(this.dataForm).then(response => {
                let msg = ""
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
              }).catch(() => {
                this.btnLoading = false
              })
            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            formMethod(this.dataForm).then(res => {
              let msg = ""
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
            }).catch(() => {
              this.btnLoading = false
            })
          }
        }
      })
    }
  }
}
</script>
