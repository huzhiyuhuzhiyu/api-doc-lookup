<template>
  <el-dialog title="转审" :visible.sync="visibleDialog" append-to-body  class="JNPF-dialog JNPF-dialog_center">
          <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
          <el-col :span="24">
            <el-form-item  prop="transferBy" ref="transferBy" label="转审人员">
              <!-- <el-input type="textarea" :rows="4" v-model="dataForm.formId" placeholder="请输入审批意见" maxlength="200">
                </el-input> -->
                <user-select placeholder="请选择转审人员" v-model="dataForm.transferBy"  ref="userRef"  @change="sureApprover" clearable style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item  prop="remark" ref="remark" label="转审意见">
              <el-input type="textarea" :rows="4" v-model="dataForm.remark" placeholder="请输入转审意见" maxlength="200">
                </el-input>
            </el-form-item>
          </el-col>
      </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visibleDialog = false">取消</el-button>
      <el-button type="primary" @click="confirm" :loading="btnLoading">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { inspectApproval } from '@/api/basicData/approvalAdministrator'
export default {
  data() {
    return {
      visibleDialog: false,
      btnLoading: false,
      title: '',
      dataForm: {
        formId: '',
        docId:'',
        state:'',
        remark:'',
        transferBy:'',
      },
      rules:{
        transferBy: [
          { required: true, message: '请选择转审人员', trigger: ['change'] },
        ],
        remark: [
          { required: true, message: '请输入转审意见', trigger: ['blur'] },
        ],
      },
    }
  },
  methods: {
    init(title,state,data) {
      this.visibleDialog = true
      this.$nextTick(()=>{
        this.$refs['elForm'].resetFields()
        this.title = title
        this.dataForm.docId = data.documentId
        this.dataForm.formId = data.id
        this.dataForm.state = state
      })
    },
    sureApprover(id,data){
      this.$nextTick(()=>this.$refs['elForm'].validateField('transferBy'))
      if (id) {
        this.dataForm.transferBy = id
      }else{
        this.dataForm.transferBy = ''
      }
    },
    confirm(){
      this.btnLoading = true
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          inspectApproval(this.dataForm).then(res=>{
            console.log(res);
            this.$message({
              message: '转审成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visibleDialog = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(()=>{this.btnLoading = false})
        }else{
          this.btnLoading = false
        }
      })
    },
  },
}
</script>

<style scoped>
.ant-confirm-body .ant-confirm-title {
  color: rgba(0, 0, 0, .85);
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
  display: block;
  overflow: hidden
}

.ant-confirm-body .ant-confirm-content {
  margin-left: 38px;
  font-size: 14px;
  color: rgba(0, 0, 0, .65);
  margin-top: 8px
}

.ant-confirm-body>.anticon {
  font-size: 22px;
  margin-right: 16px;
  float: left
}
</style>