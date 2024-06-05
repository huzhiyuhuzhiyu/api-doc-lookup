<template>
  <el-dialog :title="!dataForm.id ? '新建车型工位对照表' : '编辑车型工位对照表'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule" label-position="top" label-width="120px">
      <el-form-item label="客户物料号" prop="customerProductNo">
        <el-input v-model="dataForm.customerProductNo" placeholder="请输入客户物料号" :disabled="!!dataForm.id"/>
      </el-form-item>
      <el-form-item label="计划模板" prop="templateCode">
        <!-- <el-input v-model="dataForm.templateCode" placeholder="请输入计划模板" clearable :disabled="!!dataForm.id"/> -->
        <el-select v-model="dataForm.templateCode" placeholder="请选择计划模板" clearable style="width: 100%;" :disabled="!!dataForm.id">
          <el-option v-for="(item, index) in templateCodeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车型号" prop="vehicleModelNo">
        <el-input v-model="dataForm.vehicleModelNo" placeholder="请输入车型号" maxlength="50" :disabled="!!dataForm.id"/>
      </el-form-item>
      <el-form-item label="组别" prop="group">
        <el-input v-model="dataForm.group" placeholder="请输入组别" maxlength="10" />
      </el-form-item>
      <el-form-item label="OP*" prop="op2">
        <el-input v-model="dataForm.op2" placeholder="请输入OP*" maxlength="10" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addVehicle, updateVehicle, packVehicle } from '@/api/calculationList/packagePlan'
export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      templateCodeList:[
        {label:'通用模板',value:'t001'},
        {label:'科尼模板',value:'t002'}
      ],
      dataForm: {
        customerProductNo: '',
        group: '',
        op2: '',
        templateCode: '',
        vehicleModelNo: ''
      },
      dataRule: {
        customerProductNo: [
          { required: true, message: '请输入客户物料号', trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: '请选择计划模板', trigger: 'blur' }
        ],
        vehicleModelNo: [
          { required: true, message: '请输入车型号', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '请输入组别', trigger: 'blur' }
        ],
        op2: [
          { required: true, message: '请输入OP*', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, type) {
      this.visible = true
      this.dataForm.id = id || ''
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          packVehicle(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = this.dataForm.id ? updateVehicle : addVehicle
          formMethod(this.dataForm).then(res => {
            let msg = ""
            if (formMethod == updateVehicle) {
              msg = '修改成功'
            } else {
              msg = '新建成功'
            }
            this.$message({
              message: msg,
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
      })
    }
  }
}
</script>
