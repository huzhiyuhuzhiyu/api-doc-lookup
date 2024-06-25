<!--
 * @Author: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @Date: 2024-06-17 12:35:26
 * @LastEditors: DESKTOP-5E76NPE\tiger 1909446527@qq.com
 * @LastEditTime: 2024-06-25 17:14:46
 * @FilePath: \os-web-zgt4.0\src\views\customerManagement\serviceRecords\Form.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog title="服务说明" :visible.sync="visibleDialog" append-to-body class="JNPF-dialog JNPF-dialog_center"
    width="600px">
    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
      <el-col :span="24">
        <el-form-item prop="name" ref="cooperativePartnerName" label="客户名称">
          <ComSelect-list :isdisabled="btnType=== 'look'" v-model="dataForm.name" placeholder="请选择客户名称"
            @change="onPartnerChange" :title="'选择客户'" :method="getPartnerList" :requestObj="requestObj" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="serviceDescription" ref="serviceDescription" label="服务说明">
          <el-input type="textarea" :rows="4" :disabled="btnType=== 'look'" v-model="dataForm.serviceDescription" placeholder="请输入服务说明" maxlength="200">
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
        name: [
          { required: true, message: '请选择客户', trigger: ['change'] },
        ],
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
      this.dataForm.id = id || ''
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
      console.log(data);
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