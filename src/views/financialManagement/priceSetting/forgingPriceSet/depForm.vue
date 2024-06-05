<template>
  <el-dialog :title="!dataForm.id ? '新建锻打价格' : '编辑锻打价格'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">

      <el-form-item label="产品类型" prop="productType">
        <el-select placeholder="请选择产品类型" v-model="dataForm.productType" clearable>
          <el-option v-for="(item, index) in productTypeList" :key="index" :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <div class="interval">重量区间</div>
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item prop="startVal">
            <el-input v-model="dataForm.startVal" placeholder="请输入起始值" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="startSymbol">
            <el-select placeholder="请选择起始比较符号" v-model="dataForm.startSymbol" >
              <el-option v-for="(item, index) in startSymbolList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item class="fuhao">
            <el-input value="？" placeholder="" maxlength="20" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="endSymbol">
            <el-select placeholder="请选择终止比较符号" v-model="dataForm.endSymbol" >
              <el-option v-for="(item, index) in endSymbolList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="endVal">
            <el-input v-model="dataForm.endVal" placeholder="请输入终止值" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>








      <el-form-item label="单价(元)" prop="price">
        <el-input v-model="dataForm.price" placeholder="请输入单价" maxlength="20" />
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
import { addForgingPrice, getForgingPriceInfo, updatetForgingPrice } from '@/api/financialManagement/index'
import formValidate from "@/utils/formValidate";
export default {
  data() {
    return {
      productTypeList: [
        {
          label: " 套筒",
          value: "pt004",
        },
        {
          label: "接头",
          value: "pt008",
        }

      ],
      startSymbolList: [
        {
          label: "小于",
          value: "<",
        },
        {
          label: "小于等于",
          value: "<=",
        }
      ],
      endSymbolList: [
        {
          label: "小于",
          value: "<",
        },
        {
          label: "小于等于",
          value: "<=",
        }
      ],
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        productType: "",
        startVal: "",
        startSymbol: "<",
        endSymbol: "<=",
        endVal: "",
        price: "",
      },
      btntype: false,
      dataRule: {
        productType: [
          { required: true, message: '请选择产品类型', trigger: 'change' },
        ],

        startVal: [
          { required: true, message: '请输入起始值', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('起始值：' + errMsg) }] }), trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入单价', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 6, "", (errMsg) => { this.$message.error('单价：' + errMsg) }] }), trigger: 'blur' }
        ],
        endVal: [
          { required: true, message: '请输入终止值', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('终止值：' + errMsg) }] }), trigger: 'blur' }
        ],

      },
    }
  },
  created() {
  },
  methods: {
    handleClose() {
    },
    init(id, type) {
      this.visible = true
      this.dataForm.id = id || ''

      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getForgingPriceInfo(this.dataForm.id).then(res => {
            console.log(123321, res);
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
          if (Number(this.dataForm.endVal) < Number(this.dataForm.startVal)) {
            this.$message.error("终止值不能小于起始值")
          }else if(Number(this.dataForm.endVal) == Number(this.dataForm.startVal)){
            this.$message.error("终止值不能等于起始值")

          } else {
            this.btnLoading = true;
            let formMethod = this.dataForm.id ? updatetForgingPrice : addForgingPrice;

            formMethod(this.dataForm).then(res => {
              console.log(666, res);
              let msg = ""
              if (formMethod == updatetForgingPrice) {
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

        }
      })
    }
  }
}
</script>
<style scoped>
::v-deep .fuhao .el-form-item__label {
  color: #fff;
}

.interval {
  line-height: 32px;
  font-weight: 700;
  color: #606266;
  font-size: 16px;
}
</style>
