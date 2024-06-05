<template>
  <el-dialog :title="!dataForm.id ? '新建胶管长度区间' : '编辑胶管长度区间'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
      <div class="interval">胶管长度区间</div>
      <el-row :gutter="5">
        <el-col :span="6">
          <el-form-item prop="startVal">
            <el-input v-model="dataForm.startVal" placeholder="请输入起始值" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="startSymbol">
            <el-select placeholder="请选择起始比较符号" v-model="dataForm.startSymbol" clearable>
              <el-option v-for="(item, index) in startSymbolList" :key="index" :label="item.label" :value="item.value"></el-option>
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
            <el-select placeholder="请选择终止比较符号" v-model="dataForm.endSymbol" clearable>
              <el-option v-for="(item, index) in endSymbolList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="endVal">
            <el-input v-model="dataForm.endVal" placeholder="请输入终止值" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" maxlength="200" :rows="2" />
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
import { addRubberhoselength } from '@/api/financialManagement/index'
import formValidate from "@/utils/formValidate";
export default {
  data () {
    return {
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
      dataForm1: {
        endSymbol: "<=",
        endVal: "",
        id: '',
        startVal: "",
        startSymbol: "<",
        remark: ''
      },
      dataForm: {},
      btntype: false,
      dataRule: {
        startSymbol: [{ required: true, message: '请选择起始比较符号', trigger: 'change' }],
        startVal: [
          { required: true, message: '请输入起始值', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, " ", (errMsg) => { this.$message.error('起始值：' + "请输入正确的数字，整数不能超过16位，小数不能超过4位") }], }), trigger: 'blur', }
        ],
        endVal: [
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, " ", (errMsg) => { this.$message.error('终止值：' + "请输入正确的数字，整数不能超过16位，小数不能超过4位") }] }), trigger: 'blur' }
        ],
      },
    }
  },
  created () {
  },
  methods: {
    handleClose () {
    },
    init (id, type) {
      this.visible = true
      this.dataForm = JSON.parse(JSON.stringify(this.dataForm1))
      this.$nextTick(()=>{
      this.$refs['dataForm'].clearValidate()

      })
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.endVal && Number(this.dataForm.endVal) < Number(this.dataForm.startVal)) {
            this.$message.error("终止值不能小于起始值")
          } else {
            this.btnLoading = true;
            addRubberhoselength(this.dataForm).then(res => {
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
