<template>
  <el-dialog :title="!dataForm.id ? '新建产品属性' : '编辑产品属性'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">
      <el-form-item label="业务分类" prop="listCategoryName" >
        <ComSelect-list :isdisabled="dataForm.id ? true : false" v-model="dataForm.listCategoryName" placeholder="请选择业务分类" auth
          @change="onOrganizeChange" :title="'选择业务分类'" :method="getBusinessListCategoryAPI" :requestObj="requestObjTwo"
          :paramsObj="{}" />
      </el-form-item>

      <el-form-item label="属性名称" prop="attributeName">
        <el-input v-model="dataForm.attributeName" placeholder="请输入属性名称" maxlength="20" :disabled="btntype=='edit'"/>

      </el-form-item>
      <el-form-item label="默认显示名称" prop="defaultDisplayName">
        <el-input v-model="dataForm.defaultDisplayName" placeholder="请输入默认显示名称" maxlength="20" :disabled="btntype=='edit'"/>
      </el-form-item>
      <el-form-item label="自定义显示名称" prop="customDisplayName">
        <el-input v-model="dataForm.customDisplayName" placeholder="请输入自定义显示名称" maxlength="20" />
      </el-form-item>
      <el-form-item label="显示状态" prop="state" >
        <el-switch v-model="state" active-color="#13ce66" inactive-color="#ff4949" :disabled="btntype=='edit'">
        </el-switch>
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
  getColumnList,editColumnList,addColumnList,checkAttributeexist,detailColumnList,batchAttributeSort,editAttributState,getBusinessListCategoryAPI
} from "@/api/masterDataManagement/index";
export default {
  data() {
    return {
      requestObjTwo: {
        pageSize: -1,
        name: ''
      },
      getBusinessListCategoryAPI,
      visible: false,
      formLoading: false,
      btnLoading: false,
      state:true,
      dataForm: { 
        displayState:"",
        customDisplayName:"",
        defaultDisplayName:"",
        attributeName:"",
        listCategoryId:"1",

      },
      isdisabled: false,
      organizeIdTree: [],
      btntype: "",
      dataRule: {
        attributeName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let obj={
                // listCategoryId:this.dataForm.listCategoryId,
                listCategoryId:'1',
                id:this.dataForm.id,
                attributeName:value,
              }
              checkAttributeexist(obj).then(res => {
                if (res.data) { callback(new Error("属性名称重复")); }
                else { callback(); }
              }).catch(error => { })
            }, trigger: 'blur'
          },
        ],
        defaultDisplayName: [
          { required: true, message: '请输入默认显示名称', trigger: 'blur' },
          { max: 50, message: '名称最多为50个字符！', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    onOrganizeChange(val, data) {
      console.log("data", data);
      if (!data) {
        this.dataForm.parentId = ''
        this.dataForm.parentName = ''
      } else {
        this.dataForm.listCategoryId = data[0].id
        this.dataForm.listCategoryName = data[0].name 
      }
    },
    init(id, btntype) {
      console.log(btntype);
      this.visible = true
      if (btntype == 'add') {
        this.dataForm.id = id
      } else {
        detailColumnList(id).then(res => {
          console.log("res=>详情", res);
          this.dataForm=res.data
        })
      }
      this.btntype = btntype


    },
    cancelFun() {
      this.visible = false
      console.log("this.$refs['dataForm']",);
      this.$refs['dataForm'].resetFields()
    },
    dataFormSubmit() {
      console.log(this.state);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          if(this.state){
            this.dataForm.displayState='show'
          }else{
            this.dataForm.displayState='hidden'

          }
          let formMethod = this.btntype == 'add' ? addColumnList : editColumnList
          console.log("formMethod", formMethod);
          if (formMethod == editColumnList) {
            let obj={
              attributeName:this.dataForm.attributeName,
              customDisplayName:this.dataForm.customDisplayName,
              defaultDisplayName:this.dataForm.defaultDisplayName,
              displayState:this.dataForm.displayState,
              id:this.dataForm.id,
              listCategoryId:this.dataForm.listCategoryId,
              sort:this.dataForm.sort,
            }
            formMethod(obj).then(response => {
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
            let obj={
              attributeName:this.dataForm.attributeName,
              customDisplayName:this.dataForm.customDisplayName,
              defaultDisplayName:this.dataForm.defaultDisplayName,
              displayState:this.dataForm.displayState,
              id:this.dataForm.id,
              listCategoryId:this.dataForm.listCategoryId,
              sort:0,
            }
            formMethod(obj).then(res => {

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
