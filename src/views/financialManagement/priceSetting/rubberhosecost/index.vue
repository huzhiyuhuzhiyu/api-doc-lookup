<template>
  <div class="JNPF-preview-main">
    <div :class="['JNPF-common-page-header']">
      <div style="font-size:18px">胶管制造费单价设置</div>
      <div class="options">
        <el-button type="primary" :loading="btnLoading" @click="Updateprices()">
          保存并提交</el-button>
      </div>
    </div>
    <div class="main" v-loading="formLoading">
      <el-tabs v-model="activeName" class=".el-table">
        <el-tab-pane label="基础信息" name="orderInfo">
          <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
            <h5>单价信息</h5>
          </div>
          <el-form :model="formInline" :rules="dataRule" label-width="160px" label-position="top" ref="productForm">
            <el-row :gutter="30" class="custom-row">
              <el-col :sm="12" :xs="24">
                <el-form-item label="单价(米/元)" prop="price">
                  <el-input v-model="formInline.price" placeholder="请输入单价" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30" class="custom-row">
              <el-col :sm="12" :xs="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="formInline.remark" placeholder="请输入备注" type="textarea" maxlength="200" :rows="2" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { setManufacturingPrice, ManufacturingupdataPrice } from '@/api/basicData/index'
export default {
  data () {
    return {
      formLoading: false,
      btnLoading: false,
      activeName: 'orderInfo',
      formInline: {
        price: '',
        remark: ''
      },
      dataRule: {
        price: [{ required: true, message: '单价不能为空', trigger: 'blur' }, { validator: this.formValidate({ type: 'decimal', params: [10, 4, "", (errMsg) => { this.$message.error('单价' + errMsg) }] }), trigger: 'blur' }, { validator: this.formValidate('positiveNumber'), trigger: 'blur' }],
      },
    }
  },
  created () {
    this.initData()
  },
  methods: {
    async Updateprices () {
      const valid = await this.$refs['productForm'].validate().catch(err => false)
      if (!valid) return
      this.btnLoading = true
      setManufacturingPrice(this.formInline).then(res => {
        this.btnLoading = false
        this.$message.success('单价设置成功')
        this.initData()
      })
    },
    initData () {
      this.formLoading = true
      ManufacturingupdataPrice().then(res => {
        this.formLoading = false
        this.formInline = res.data
      }).catch(() => {
        this.formLoading = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>
    