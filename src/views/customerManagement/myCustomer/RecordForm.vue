<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-17 12:35:26
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-25 17:14:28
 * @FilePath: \os-web-zgt4.0\src\views\customerManagement\serviceRecords\RecordForm.vue
 * @Description: 我的客户写记录
-->
<template>
  <el-dialog title="服务说明" :visible.sync="visibleDialog" append-to-body class="JNPF-dialog JNPF-dialog_center"
    width="600px">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
      <el-col :span="24">
        <el-form-item prop="serviceDescription" ref="serviceDescription" label="服务说明">
          <el-input type="textarea" :rows="4" v-model="dataForm.serviceDescription" placeholder="请输入服务说明" maxlength="200">
          </el-input>
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
import { getPartnerList , detailServiceRecord , addServiceRecord , updateServiceRecord} from '@/api/customerManagement/index'
export default {
  data() {
    return {
      getPartnerList,
      visibleDialog: false,
      btnLoading: false,
      btnType: '',
      dataForm: {
       id:'',
       cooperativePartnerId:'',
       name:'',
       serviceDescription:'',
      },
      requestObj:{
        customerStatus: 'private_sea',
      },
      rules: {
        serviceDescription: [
          { required: true, message: '请输入服务说明', trigger: ['blur'] },
        ],
      },
    }
  },
  methods: {
    init(id,btnType) {
      this.visibleDialog = true
      this.btnLoading = false
      this.btnType = btnType
      this.dataForm.cooperativePartnerId = id || ''
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (this.dataForm.id) {
          detailServiceRecord(this.dataForm.id).then(res => {
            this.dataForm = res.data
          })
        }
      })
    },
    onPartnerChange(id,data){
      if (!data.length) return
      this.$nextTick(() => this.$refs['elForm'].validateField('name'))
      if (data){
        this.dataForm.cooperativePartnerId = data[0].id
        this.dataForm.name = data[0].name
      }else{
        this.dataForm.cooperativePartnerId = ''
        this.dataForm.name = ''
      } 
    },
    confirm() {
      this.btnLoading = true
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          let formMethod = this.dataForm.id ? updateServiceRecord : addServiceRecord
          formMethod(this.dataForm).then(res => {
            this.$message({
              message:  this.dataForm.id ? '修改成功' : '新建成功',
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