<template>
  <el-dialog :title="!dataForm.code ? '新建产品属性' : '编辑产品属性'" :close-on-click-modal="false" :close-on-press-escape="false"
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
      <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  getBimProductAttributesInfo,
  updataBimProductAttributes,
  delBimProductAttributes,
  addBimProductAttributes,
  getbimProductAttributesList,
} from "@/api/masterDataManagement/index";

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        name: '',
        remark: '',
        code: '',
        typeCode:"",
      },
      isdisabled: false,
      organizeIdTree: [],
      btntype:"",
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
    init(code,btntype) {
      console.log(code);
      this.visible = true
      if(btntype=='add'){
        this.dataForm.typeCode=code
      }else{
        getBimProductAttributesInfo(code).then(res=>{
          console.log("res=>详情",res);
          this.dataForm.code=res.data.code
          this.dataForm.typeCode=res.data.typeCode
          this.dataForm.name=res.data.name
          this.dataForm.remark=res.data.remark
        })
      }
      this.btntype=btntype
   
     
    },
    cancelFun(){
      this.visible=false
      console.log("this.$refs['dataForm']",);
      this.$refs['dataForm'].resetFields()
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true

          let formMethod = this.btntype=='add' ? addBimProductAttributes :  updataBimProductAttributes
          console.log("formMethod", formMethod);
          if (formMethod == updataBimProductAttributes) {
            formMethod(this.dataForm).then(response => {
                this.$message({
                  message: "修改成功",
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
          } else {
            formMethod(this.dataForm).then(res => {
            
              this.$message({
                message: "新建成功",
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
