<template>
  <el-dialog :title="dialogTitle" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
          <el-col :span="20">
            <el-form-item label="业务状态" prop="state" ref="state">
              <el-select v-model="dataForm.state" placeholder="业务状态" clearable style="width: 100%;">
                  <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="20" v-if="dataForm.state === 'condition'">
            <el-form-item label="条件公式" prop="condExpress" ref="condExpress">
                <template>
                  <div class="condition">
                      <el-select v-model="dataForm.condition1" placeholder="请选择条件1" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in conditionList1" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                      </el-select>
                
                      <el-select v-model="dataForm.condition" placeholder="条件符号" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in conditionList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                      </el-select>
                      <el-select v-model="dataForm.condition2" placeholder="请选择条件2" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in conditionList2" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                      </el-select>
                  </div>
                </template>

            </el-form-item>
          </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="btnLoading" @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addApproval, updateApproval, getApprovalDetail } from '@/api/basicData/approvalBusinessConditions'
import { updateBusState } from '@/api/basicData/approvalAdministrator'
export default { 
  data() {
    return {
      dialogTitle: '',
      visible: false,
      loading: false,
      btnLoading: false,
      dataForm: {
        id: '',
        condExpress:'',
        state:'',
        condition:'',
        condition1:'',
        condition2:'',
      }, 
      rules: {
        state:[{required: true, message: '请选择业务状态', trigger: ['change']}],
        condExpress: [{required: true,message: '请配置条件公式',trigger: ['blur']}],
        condition1:[{required: true, message: '请选择条件1', trigger: ['change']}],
        condition2:[{required: true, message: '请选择条件2', trigger: ['change']}],
        condition:[{required: true, message: '请选择条件符号', trigger: ['change']}],
      },
      type:'',
      statusList:[
        {label:'直接启用',value:'enable'},
        {label:'直接停用',value:'disabled'},
        {label:'条件启用',value:'condition'},
      ],
      conditionList:[
        {label:'大于',value:'>'},
        {label:'小于',value:'<'},
        {label:'等于',value:'='},
        {label:'大于等于',value:'>='},
        {label:'小于等于',value:'<='},
      ],
      conditionList1:[],
      conditionList2:[],
    }
  },
  methods: {
 
    clearData() {
    },
    init(row) {
      // this.type = type
      // // 此处判断用户选择新增还是编辑
      console.log(row);
      this.dataForm.id = row.id || ''
      this.visible = true
      this.dialogTitle = '设置业务状态'
      this.conditionList1 = []
      this.conditionList2 = []
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        this.dataForm.state = row.state || ''
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          // 获取当前项详情
          getApprovalDetail(row.id).then(res => {
            console.log(res,'dasdasdasd');
            res.data.forEach(item=>{
              this.conditionList1.push({
                label:item.name,
                value:item.code
              })
              this.conditionList2.push({
                label:item.name,
                value:item.code
              })
            })
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true
      if (this.dataForm.state == 'condition') {
        if (!this.dataForm.condition1) {
          submitFlag = false
          this.$message.error('请选择条件1')
          this.btnLoading = false
          return
        }
        if (!this.dataForm.condition) {
          submitFlag = false
          this.$message.error('请选择条件符号')
          this.btnLoading = false
          return
        }
        if (!this.dataForm.condition2) {
          submitFlag = false
          this.$message.error('请选择条件2')
          this.btnLoading = false
          return
        }
        if (this.dataForm.condition1 == this.dataForm.condition2) {
          submitFlag = false
          this.$message.error('条件公式配置错误')
          this.btnLoading = false
          return
        }
        if (this.dataForm.condition1 && this.dataForm.condition && this.dataForm.condition2) {
          this.dataForm.condExpress = this.dataForm.condition1 + this.dataForm.condition + this.dataForm.condition2
          console.log( this.dataForm.condExpress,' this.dataForm.condExpress');
        }
      }
    
      if (submitFlag) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            updateBusState(this.dataForm).then(res=>{
              console.log(res);
              if (res.msg == 'Success') {
                this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.visible = false
                      this.btnLoading = false
                      this.$emit('refresh')
                    }
                  })
              }
            })
          }else{
            this.btnLoading = false
          }
        })
      }
    },
 
  
 
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
.condition{
  width:100%;
  display:flex;
  justify-content:space-between;
}
.condition>div{
  margin-right:5px;
}
::v-deep  .el-dialog {
  height: 400px !important;
}
::v-deep  .el-dialog__body{
  height: 278px !important;
}
::v-deep .el-row{
  margin-top:10px!important;
}
</style>