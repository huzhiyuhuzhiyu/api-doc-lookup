<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-17 12:35:26
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-28 13:08:56
 * @FilePath: \os-web-zgt4.0\src\views\customerManagement\serviceRecords\Form.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog :title="'自定义表设置'" :visible.sync="visibleDialog" append-to-body class="JNPF-dialog JNPF-dialog_center"
    width="600px">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
      <el-col :span="24">
        <el-form-item label="表名" prop="tableName">
        <el-input v-model="dataForm.tableName" placeholder="请输入表名" maxlength="100" />
      </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="显示状态" prop="state" >
        <el-switch v-model="states" active-color="#13ce66" inactive-color="#ff4949"  >
        </el-switch>
      </el-form-item>
      </el-col>
      
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visibleDialog = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="confirm" :loading="btnLoading">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
getbimDataCustomTableList,addbimDataCustomTableList,editbimDataCustomTableList,deletebimDataCustomTableList,detailbimDataCustomTableList
} from "@/api/masterDataManagement/index";
export default {
  data() {
    return {
      visibleDialog: false,
      btnLoading: false,
      btnType: '',
      dataForm: {
        tableName:'',
       state:'',
      },
      states:true,
      rules: {
        tableName: [
          { required: true, message: '请输入表名', trigger: ['blur'] },
        ],
      
      },
    }
  },
  methods: {
    init(id,btnType) {
      this.visibleDialog = true
      this.btnLoading = false
      this.btnType = btnType
   
    },
  
    confirm() {
      this.btnLoading = true
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if(this.states==true){
            this.dataForm.state='enable'
          }else{
            this.dataForm.state='disabled'
          }
          addbimDataCustomTableList(this.dataForm).then(res => {
            this.$message({
              message:  '新建成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visibleDialog = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => { this.btnLoading = false })
        } else {
          this.btnLoading = false
        }
      })
    },
  },
}
</script>