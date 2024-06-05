<template>
  <el-dialog :title="!dataForm.id ? '新建电镀价格' :'编辑电镀价格'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm"  :rules="dataRule"
      label-position="top" label-width="120px">
       
      <el-form-item label="编码" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入编码" maxlength="20" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入名称" maxlength="20"/>
      </el-form-item>
      <el-form-item label="单价" prop="price">
        <el-input v-model="dataForm.price" placeholder="请输入单价" maxlength="20"/>
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
import {addSurfaceTreatment, updateSurfaceTreatment, checkSurfaceTreatmentCode, getSurfaceTreatmentInfo} from '@/api/financialManagement/index'
import formValidate from "@/utils/formValidate";
export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
       name:"",
       code:"",
       price:"",
      },
      btntype: false,
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入单价', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 6, "", (errMsg) => { this.$message.error('单价：' + errMsg) }] }), trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          { validator: formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id);
              checkSurfaceTreatmentCode(value, this.dataForm.id).then(res => {
                if (res.data) {
                  callback(new Error("编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
    
      },
    }
  },
  created() {
  },
  methods: {
    handleClose() {
    },
    init(id,type) {
      this.visible = true
      this.dataForm.id = id || ''
  
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getSurfaceTreatmentInfo(this.dataForm.id).then(res => {
            console.log(123321,res);
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
          let formMethod = this.dataForm.id ?  updateSurfaceTreatment :  addSurfaceTreatment;
          
          formMethod(this.dataForm).then(res => {
            console.log(666,res);
            let msg = ""
            if (formMethod == updateSurfaceTreatment) {
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
