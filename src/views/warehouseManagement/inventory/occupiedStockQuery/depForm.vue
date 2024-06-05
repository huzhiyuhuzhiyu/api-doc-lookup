<template>
  <el-dialog title="解除占用" :close-on-click-modal="false" append-to-body :visible.sync="balVisible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-position="top" :rules="dataRule">
        <el-row :gutter="30" class="custom-row">
          <el-col :sm="24" :xs="24">
            <el-form-item label="解除数量" prop="num">
              <el-input v-model="dataForm.num" placeholder="请输入解除数量" clearable />
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
import { occupyRestore } from '@/api/warehouseManagement/inventory'
import formValidate from "@/utils/formValidate";
export default {
  data() {
    return {
      btnLoading: false,
      dataForm: {
        recordsId: '',
        recordsLineId: '',
        num: '',
        noAuto: true,
        occupyObjId: '',
        productsId: '',
        routingLineId: '',
      },
      limitNum: '',
      dataRule: {
        num: [
          { required: true, message: '解除数量不能为空', trigger: 'blur' },
          // { validator: formValidate('number', '请输入一个有效的数字（非零）', (errMsg) => { }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "请输入正确的解除数量，整数不能超过16位，小数不能超过4位", (errMsg) => {  }] }), trigger: 'blur' },
          { validator: this.limitN(), trigger: ['blur'] },
        ],
      },
      balVisible: false,
    }
  },
  methods: {
    limitN() {
      return (rule, value, callback) => {
        let msg = '解除占用数量不能超过占用数量'
        if (!value) { callback() }
        else {
          if (!isNaN(value) && value) {
            if (Number(value) > this.limitNum) {
              callback(new Error(msg));
            } else {
              callback()
            }
          } else { callback() }
        }
      };
    },
    init(row) {
      this.btnLoading = false
      this.balVisible = true
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        this.limitNum = row.num
        this.dataForm = { ...row, num: row.num, noAuto: true }
      })
    },
    dataFormSubmit() {
      this.btnLoading = true
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          let _data = [this.dataForm]
          occupyRestore(_data).then(res => {
            this.$message({
              message: '解除成功',
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
        } else {
          this.btnLoading = false
        }
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