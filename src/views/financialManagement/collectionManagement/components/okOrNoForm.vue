<template>
  <el-dialog :title="title" :visible.sync="visibleDialog" append-to-body  class="JNPF-dialog JNPF-dialog_center">
    <!-- <div class="ant-confirm-body"> -->
     
      <!-- <div class="ant-confirm-content"> -->
        <!-- <div> -->
          <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
  
          <el-col :span="24">
            <el-form-item  prop="remark" ref="remark" :label="title + '意见'">
              <el-input type="textarea" :rows="4" v-model="dataForm.remark" placeholder="请输入审批意见" maxlength="200">
                </el-input>
            </el-form-item>
          </el-col>
      </el-form>
        <!-- </div> -->
      <!-- </div> -->
    <!-- </div> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visibleDialog = false">取消</el-button>
      <el-button type="primary" @click="confirm" :loading="btnLoading">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { inspectApproval } from '@/api/basicData/approvalAdministrator'
import { updateQcUnqualifiedData } from '@/api/inspectionManagement/index' // 更新不良品处理单
export default {
  props: {
    approvalType: { // 审批类型：不良品 defective
      type: String
    },
  },
  data() {
    return {
      visibleDialog: false,
      btnLoading: false,
      title: '',
      dataForm: {
        docId: '',
        formId: '',
        remark: "",
        state: ""
      },
      rules:{
        remark: [
          { required: true, message: '请输入审批意见', trigger: ['blur'] },
        ],
      },
    }
  },
  methods: {
    init(title, state,data) {
      this.visibleDialog = true
      this.btnLoading = false
      this.$nextTick(()=>{
        this.$refs['elForm'].resetFields()
        console.log(data);
        this.title = title
        this.dataForm.docId = data.documentId
        this.dataForm.formId = data.id
        this.dataForm.state = state
      })
    },
    confirm(){
      this.btnLoading = true
      this.$refs['elForm'].validate(async (valid) => {
        if (valid) {
          // 如果是不良品处理的审批，并且是审批人属于技术部，先向后端保存完整不良品处理单数据
          if (this.approvalType === 'defective' && this.$parent.userInfo.deptType === 'JSB') {
            // console.log(this.$parent.dataObj);
            //   this.btnLoading = false
            //   return
            const res = await updateQcUnqualifiedData(this.$parent.dataObj).catch(err => false)
            if (!res || res.msg !== 'Success') {
              this.btnLoading = false
              return
            }
          }
          inspectApproval(this.dataForm).then(res=>{
            console.log(res);
            this.$message({
              message: '审批成功',
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