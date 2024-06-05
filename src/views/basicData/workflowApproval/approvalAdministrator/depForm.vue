<template>
  <el-dialog :title="!dataForm.id ? '新建审批管理员' : '编辑审批管理员'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">
      <el-form-item label="管理员名称" prop="personId">
        <!-- <el-input v-model="dataForm.personId" placeholder="请选择审批人" maxlength="20" /> -->
        <user-select  v-model="dataForm.personId" :title="userTitle" :placeholder="placeholder"   @change="changeAdmin"  clearable style="width: 100%;"></user-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" />
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
import { addApprovalAdministrator } from '@/api/basicData/approvalAdministrator'

export default {
  data() {
    return {
      userTitle:'选择审批管理员',
      placeholder:'请选择审批管理员',
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        remark: '',
        personId: "",
      },
      btntype: false,
      dataRule: {
        personId: [
          { required: true, message: '请选择审批管理员名称', trigger: 'change' },
        ],
      },
    }
  },
  created() {
  },
  methods: {
    handleClose() {
    },
    changeAdmin(id,data){
      console.log(data);
    },
    init(id, warehouseId, type) {
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.warehouseId = warehouseId || ''
      if (type == "edit") {
        this.btntype = false
      } else if (type == "look") {
        this.btntype = true

      }
      this.organizeIdTree = []
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          // getStockGoodsShelvesInfo(this.dataForm.id).then(res => {
          //   this.dataForm = res.data
          //   this.organizeIdTree = res.data
          //   this.formLoading = false
          //   if(res.data.locationType!='goods_shelves'){
          //     this.tableflag=false
          //   }else{
          //     this.tableflag=true
          //   }
          // })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = addApprovalAdministrator

          formMethod(this.dataForm).then(res => {
            let msg = "新建成功"
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
