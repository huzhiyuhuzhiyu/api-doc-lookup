<template>
  <el-dialog :title="!dataForm.id ? '新建材质设置' : '编辑材质设置'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">

      <el-form-item label="材质编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入材质编码" maxlength="20" :disabled="btntype ? true : false" />
      </el-form-item>
      <el-form-item label="材质描述" prop="description">
        <el-input v-model="dataForm.description" type="textarea" placeholder="请输入材质描述" :rows="3" maxlength="100"
          :disabled="btntype ? true : false" />
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
import { addMaterialList, editMaterialList, getMaterialInfo, checkMaterialCode } from "@/api/basicData/index";

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        description: '',
        code: "",
      },
      btntype: false,
      dataRule: {
        code: [
          { required: true, message: '请输入材质编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id);
              checkMaterialCode(value, this.dataForm.id).then(res => {
                console.log('res===>', res);
                if (res.data) {
                  callback(new Error("材质编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          }, {
            validator: this.formValidate('enCode'),
            trigger: 'blur'
          }],
        description: [
          { required: true, message: '请输入材质描述', trigger: 'blur' },
        ],


      },
    }
  },
  created() {
  },
  methods: {
    handleClose() {
      this.btnLoading = false
    },
    init(id, warehouseId, type) {
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.warehouseId = warehouseId || ''
      if (type == "edit") {
        this.btntype = false
      } else if (type == "look") {
        this.btntype = true

      }
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getMaterialInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false

          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let formMethod = this.dataForm.id ? editMaterialList : addMaterialList;

          formMethod(this.dataForm).then(res => {
            console.log(666, res);
            let msg = ""
            if (formMethod == editMaterialList) {
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
      })
    }
  }
}
</script>
