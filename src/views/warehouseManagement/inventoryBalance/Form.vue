<template>
  <el-dialog :title="(this.type === 'normal' ? '' : '反') + '结存'" :close-on-click-modal="false" append-to-body :visible.sync="balVisible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-position="top">
        <el-row :gutter="30" class="custom-row">
          <el-col :sm="24" :xs="24">
            <el-form-item label="账期" prop="accountPeriod">
              <el-date-picker v-model="dataForm.accountPeriod" type="month" style="width: 100%;" value-format="yyyy-MM"
                disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="balVisible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
        {{ $t('common.submitButton') }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { stockBalance ,stockBalanceNegate} from '@/api/balances/index'
export default {
  data() {
    return {
      btnLoading: false,
      dataForm: {
        accountPeriod: '',
        projectId:''
      },
      type: '',
      balVisible: false,
    }
  },
  methods: {
    init(accountPeriod,type,projectId) {
      this.type = type
      this.balVisible = true
      this.dataForm.accountPeriod = accountPeriod
      this.dataForm.projectId = projectId

    },
    dataFormSubmit() {
      this.btnLoading = true
      const apiMethod = this.type === 'normal' ? stockBalance : stockBalanceNegate
      apiMethod(this.dataForm).then(res => {
        this.$message({
          message: (this.type === 'normal' ? '' : '反') + '结存成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.balVisible = false
            this.btnLoading = false
            this.$emit('close', true)
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
}

::v-deep .el-dialog__body {
  margin-bottom: 10px;
}

::v-deep .el-dialog__footer {
  padding: 0 20px 10px;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}

.noPaddingLeft {
  padding-left: 0 !important;
}

.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}

.tableContainer {
  overflow: initial
}
</style>
