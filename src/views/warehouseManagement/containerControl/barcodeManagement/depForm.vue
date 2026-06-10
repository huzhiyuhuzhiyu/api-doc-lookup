<template>
  <el-dialog :title="'更换条码'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">


      <el-form-item label="原条码" prop="barCode" ref="barCode">
        <el-input v-model="dataForm.barCode" placeholder="" disabled>
        </el-input>
      </el-form-item>

      <el-form-item label="新条码" prop="newBarCode" ref="newBarCode">
        <el-input v-model="dataForm.newBarCode" placeholder="" disabled>
        </el-input>
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

import { detailStockBoxBarcode, modifyBarcode } from '@/api/warehouseManagement/packingList'
export default {
  components: {
  },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,

      onlyRead: false,
      dataForm: {
        id: '',
        barCode: '',
        newBarCode:'',
      },
      sourceBarCodeForm:{},
      dataFormTwo:{
        data:[]
      },
      dataRule: {
        newBarCode:[
          { required: true, message: '新条码不能为空', trigger: 'no' },
        ],
      },
    }
  },
  created() {
  },

  methods: {

    init(id, type) {
      this.dataForm.id = id || ''
      this.visible =  true
      this.formLoading =  true
      this.type = type
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.dataForm.newBarCode = this.dataForm.newBarCode ? this.dataForm.newBarCode : new Date().getTime() + '001'
          console.log(this.dataForm.newBarCode);
          detailStockBoxBarcode(this.dataForm.id).then(res => {
            console.log(res, '详情');
            this.sourceBarCodeForm = res.data
            this.dataForm.barCode = res.data.barCode
            this.dataFormTwo.data = JSON.parse(JSON.stringify(res.data.barcodeLineVOs))

            this.dataFormTwo.data.forEach((item, index) => {
              this.$set(this.dataFormTwo.data[index], 'newBoxnum', '')
            })
            this.formLoading =  false
          }).catch(() => { })

        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid);
        if (valid) {
          this.btnLoading = true;
          this.sourceBarCodeForm.barCode = this.dataForm.newBarCode
          let _data = {
            barcode:this.sourceBarCodeForm
          }
          modifyBarcode(_data).then(res => {
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
::v-deep .el-input__inner {
  height: 40px;
}

::v-deep .el-select .el-tag {
  margin: 5px 0 2px 6px;
}

::v-deep .el-select__tags {

  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
}
</style>