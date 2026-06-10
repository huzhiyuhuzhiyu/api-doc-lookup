<template>
  <el-dialog :title="!dataForm.id ? '新建组装系列单价' : '编辑组装系列单价'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
      <el-form-item label="系列类型" prop="type">
        <el-select placeholder="请选择系列类型" v-model="dataForm.type" clearable @change="change">
          <el-option v-for="(item, index) in productTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系列名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入系列名称" maxlength="100" :disabled="dataForm.type=='other'" />
      </el-form-item>
      <el-form-item label="系列代号" prop="code">
        <el-input v-model="dataForm.code" placeholder="请输入系列代号" maxlength="20" :disabled="dataForm.type=='other'" />
      </el-form-item>
      <el-form-item label="系列单价（件/元）" prop="price">
        <el-input v-model="dataForm.price" placeholder="请输入系列单价" />
      </el-form-item>
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
import { addassemblyseries, getassemblyseriesInfo, assemblyseriesTreatmentCode, updatetassemblyseries } from '@/api/financialManagement/index'
import formValidate from "@/utils/formValidate";
export default {
  data() {
    return {
      productTypeList: [
        {
          label: "常规系列",
          value: "convention",
        },
        {
          label: "其他系列",
          value: "other",
        }
      ],
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm1: {
        type: '',
        code: '',
        name: '',
        price: '',
        remark: '',
        id: ''
      },
      type: '',
      dataForm: {},
      btntype: false,
      dataRule: {
        name: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入系列代号', trigger: 'blur' }, { validator: formValidate('enCode'), trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            console.log(value, this.dataForm.id);
            assemblyseriesTreatmentCode(value, this.dataForm.id).then(res => {
              if (res.data) {
                callback(new Error("系列代号重复"));
              } else {
                callback();
              }
            }).catch(error => {
            })
          }, trigger: 'blur'
        }],
        price: [
          { required: true, message: '请输入系列单价', trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [10, 4, "", (errMsg) => { this.$message.error('数量：' + errMsg) }] }), trigger: 'blur' }
        ]
      },
    }
  },
  created() {
  },
  methods: {
    change(val) {
      if (val == 'other') {
        this.dataForm.name = '其他系列'
        this.dataForm.code = 'other'
      } else {
        this.dataForm.name = ''
        this.dataForm.code = ''
      }
    },
    handleClose() {
    },
    init(id, type) {
      this.visible = true
      this.dataForm = JSON.parse(JSON.stringify(this.dataForm1))
      this.type = type
      this.dataForm.id = id || ''
      if (this.dataForm.id) {
        getassemblyseriesInfo(this.dataForm.id).then(res => {
          this.dataForm = res.data
          if (this.dataForm.code == 'other') {
            this.$set(this.dataForm, 'type', 'other')
          } else {
            this.$set(this.dataForm, 'type', 'convention')
          }
        })
      } else {
        this.formLoading = false
      }
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let formMethod = null;
          if (this.type == 'edit') {
            formMethod = updatetassemblyseries
          } else if (this.type == 'add') {
            formMethod = addassemblyseries
          }
          formMethod(this.dataForm).then(res => {
            let msg = "";
            if (formMethod == addassemblyseries) {
              msg = "新建成功"
            } else {
              msg = '提交成功'
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
