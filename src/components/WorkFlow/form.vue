<template>
  <div>
    <el-dialog append-to-body title="审批模版" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="审批管理员ID" prop="adminId">
              <el-input v-model="dataForm.adminId" placeholder="请输入审批管理员ID" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批业务ID" prop="approvalBusinessId">
              <el-input v-model="dataForm.approvalBusinessId" placeholder="请输入审批业务ID" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批模板编码" prop="code">
              <el-input v-model="dataForm.code" placeholder="请输入审批模板编码" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批模板名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入审批模板名称" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批模板状态" prop="state">
              <!-- <el-input v-model="dataForm.name" placeholder="请输入审批模板状态" maxlength="20" /> -->
              <el-select v-model="dataForm.state" placeholder="请选择审批模板状态" clearable style="width: 100%;" >
                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formLoading: false,
      visible:false,
      btnLoading:false,
      dataForm: {
        adminId: "",
        approvalBusinessId: 1,
        code: "",
        id: '',
        name: "",
        state: ""
      },
      dataRule:{
        code:[ { required: true, message: '请输入模版编码', trigger: 'blur' }],
      },
      stateList:[
        {label:'启用',value:'enable '},
        {label:'停用',value:'disable'},
      ],
    }
  },
  methods:{
    init(data){
      this.dataForm = data
      this.visible = true
    },
    dataFormSubmit(){
      this.$emit('update:dataForm', this.dataForm)
      this.visible = false
    },
  },
}
</script>