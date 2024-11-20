<template>
  <div>
    <el-dialog title="转为客户" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
        <el-form-item label="客户分类" prop="partnerCategoryIdText">
          <ComSelect-list v-model="dataForm.partnerCategoryIdText" placeholder="请选择客户分类" auth @change="onOrganizeChange" :title="'选择分类'" :method="getcategoryTree" :requestObj="requestObjTwo" :paramsObj="{}" />
        </el-form-item>
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
import { Transfercustomer, getcategoryTree } from '@/api/basicData/index'
export default {
  data() {
    return {
      getcategoryTree,
      requestObjTwo: {
        keyword: '',
        type: "customer"
      },
      visible: false,
      btnLoading: false,
      idlist: [],
      dataForm: {
        partnerCategoryIdText: "",
        partnerCategoryId: ''
      },
      isdisabled: false,
      dataRule: {
        partnerCategoryIdText: [
          { required: true, message: '请选择客户分类', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    onOrganizeChange(val, data) {
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('partnerCategoryIdText')
      })
      this.dataForm.partnerCategoryId = data ? data[0].id : ''
      this.dataForm.partnerCategoryIdText = data ? data[0].name : ''
    },
    init(idlist) {
      this.idlist = idlist
      this.visible = true
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let obj = {
            clueIdList: this.idlist,
            code: 'ZGTKHBM',
            partnerCategoryId: this.dataForm.partnerCategoryId
          }
          Transfercustomer(obj).then(res => {
            this.visible = false
            this.btnLoading = false
            this.$message({
              message: '提交成功',
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
<style scoped>
.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}
</style>