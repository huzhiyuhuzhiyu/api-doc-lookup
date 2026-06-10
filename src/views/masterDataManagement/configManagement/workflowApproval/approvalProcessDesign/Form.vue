<template>
  <div>
    <el-dialog append-to-body title="审批模版" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="审批模板编码" prop="code">
              <el-input v-model="dataForm.code" :disabled="type!='add'" placeholder="请输入审批模板编码" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批模板名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入审批模板名称" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批管理员" prop="adminName">
              <!-- <el-input v-model="dataForm.adminId" placeholder="请输入审批管理员ID" maxlength="20" /> -->
              <ComSelect-list v-model="dataForm.adminName" ref="userRef" placeholder="请选择审批管理员名称" auth
                @change="sureApprover" :title="'选择审批管理员名称'" :dataFormatting="dataFormatting"
                :method="getApprovalAdministratorList" :requestObj="approvalObj" :paramsObj="{}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审批业务" prop="approvalBusinessName">
              <!-- <el-input v-model="dataForm.approvalBusinessName" placeholder="请输入审批业务ID" maxlength="20" /> -->
              <ComSelect-list :isdisabled="type!='add'" v-model="dataForm.approvalBusinessName" placeholder="请选择审批业务" auth @change="changeBusine"
                :title="'选择审批业务'" :method="getApprovalList" :requestObj="requestObj" :paramsObj="{}" />
            </el-form-item>
          </el-col>
    
          <!-- <el-col :span="12">
            <el-form-item label="审批模板状态" prop="state">
              <el-select v-model="dataForm.state" placeholder="请选择审批模板状态" clearable style="width: 100%;" >
                <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="btnLoading" @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          保存草稿</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getApprovalAdministratorList, checkApprovalCode, addApprovalTemplate,getApprovalDetail,updateApprovalTemplate } from '@/api/basicData/approvalAdministrator'
import { getApprovalList } from '@/api/basicData/approvalBusinessConditions'
import formValidate from "@/utils/formValidate";
export default {
  data() {
    return {
      getApprovalList,
      getApprovalAdministratorList,
      formLoading: false,
      visible: false,
      btnLoading: false,
      dataForm: {
        adminId: "",
        adminName: "",
        approvalBusinessId: '',
        approvalBusinessName: '',
        documentStatus: 'draft',
        code: "",
        id: '',
        name: "",
        state: "disabled"
      },
      dataRule: {
        code: [
          { required: true, message: '请输入模版编码', trigger: 'blur' },
          { validator: formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id);
              checkApprovalCode(value, this.dataForm.id).then(res => {
                console.log('res===>', res);
                if (res.data) {
                  callback(new Error("审批模版编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur',
          }
        ],
        name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
        adminName: [{ required: true, message: '请选择审批管理员', trigger: 'change' }],
        approvalBusinessName: [{ required: true, message: '请选择审批业务', trigger: 'change' }],
      },
      // stateList:[
      //   {label:'启用',value:'enable '},
      //   {label:'停用',value:'disable'},
      // ],
      approvalObj: {
        createByName: "",
        endTime: "",
        keyword: "",
        name: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
      requestObj: {
        code: "",
        name: "",
        orderItems: [{
          asc: true,
          column: ""
        }],
        pageNum: 1,
        pageSize: 20
      },
      type:'',
    }
  },
  methods: {
    init(id,type) {
      this.visible = true
      this.dataForm.id = id || ''
      this.type = type
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (!this.dataForm.id) {
        } else {
          getApprovalDetail(this.dataForm.id).then(res => {
            console.log(res, '详情');
            this.dataForm = res.data.template
            if (this.type == 'copy') {
              this.dataForm.id = ''
              this.dataForm.state = 'disabled'
              this.dataForm.documentStatus = 'draft'
            }
          })
        }
      })
      // this.dataForm = data
    },
    dataFormatting(res) {
      let treeData = res.data.records.map(item => {
        item.name = item.personName;
        return item;
      });
      return treeData
    },
    sureApprover(id, data) {
      console.log(data);
      this.$nextTick(() => { this.$refs['dataForm'].validateField('adminName') })
      if (data.length === 0) {
        this.dataForm.adminName = ''
        this.dataForm.adminId = ''
      } else {
        this.dataForm.adminName = data[0].name
        this.dataForm.adminId = data[0].all.personId
      }
    },
    changeBusine(id, data) {
      console.log(data);
      this.$nextTick(() => { this.$refs['dataForm'].validateField('approvalBusinessName') })
      if (data.length === 0) {
        this.dataForm.approvalBusinessName = ''
        this.dataForm.approvalBusinessId = ''
      } else {
        this.dataForm.approvalBusinessName = data[0].all.name
        this.dataForm.approvalBusinessId = data[0].all.id
      }
    },
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = await this.$refs['dataForm'].validate().catch(err => false)
      if (submitFlag) {
        let formMethod = this.dataForm.id ? updateApprovalTemplate : addApprovalTemplate
        let res = await formMethod(this.dataForm)
        if (res.msg === 'Success') {
          res.msg = '保存成功'
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }else{
          this.btnLoading = false
        }
      }else{
        this.btnLoading = false
      }
    },
  },
}
</script>