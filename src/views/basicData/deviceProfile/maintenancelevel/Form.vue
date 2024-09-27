<template>
  <el-dialog :title="!dataForm.id ? '新建等级与频次' : '编辑等级与频次'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule" label-position="top" label-width="120px">
      <el-form-item label="保养等级" prop="level">
        <el-select v-model="dataForm.level" placeholder="请选择保养等级" clearable style="width: 100%;">
          <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="保养频次" prop="frequency">
        <el-select v-model="dataForm.frequency" placeholder="请选择保养频次" clearable style="width: 100%;">
          <el-option v-for="item in frequencyList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="周期" prop="cycle">
        <el-input v-model="dataForm.cycle" placeholder="请输入周期" maxlength="50" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-select v-model="dataForm.unit" placeholder="请选择单位" clearable>
          <el-option v-for="(item, index) in unitStateList" :key="index" :label="item.label" :value="item.label"></el-option>
        </el-select>
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
import { detailequMaintenanceLevel, updateequMaintenanceLevel, addequMaintenanceLevel } from "@/api/basicData/materialSettings"
export default {
  data() {
    return {
      unitStateList: [
        { label: '天' },
        { label: '周' },
        { label: '月' },
        { label: '季' },
        { label: '年' }
      ],
      levelList: [
        { label: "日常保养", value: "日常保养", color: "#EB5050" },
        { label: "二级保养", value: "二级保养", color: "#F0A800" },
        { label: "三级保养", value: "三级保养", color: "#46C26F" },
        { label: "四级保养", value: "四级保养", color: "#A2C204" },
        { label: "年度保养", value: "年度保养", color: "#00AED1" }

      ],
      frequencyList: [
        { label: "每天一次", value: "每天一次", color: "#EB5050" },
        { label: "每月一次", value: "每月一次", color: "#F0A800" },
        { label: "每季度一次", value: "每季度一次", color: "#46C26F" },
        { label: "每半年一次", value: "每半年一次", color: "#A2C204" },
        { label: "每年一次", value: "每年一次", color: "#00AED1" }
      ],
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        level: '',
        cycle: '',
        unit: '',
        id: ''
      },
      dataRule: {
        level: [
          { required: true, message: '请选择保养等级', trigger: 'blur' },
        ],
        cycle: [
          { required: true, message: '周期不能为空', trigger: 'change' },
          { validator: this.formValidate('bigInt'), trigger: 'change' }
        ],
        unit: [
          { required: true, message: '单位不能为空', trigger: 'change' }
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
          detailequMaintenanceLevel(this.dataForm.id).then(res => {
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
          let formMethod = this.dataForm.id ? updateequMaintenanceLevel : addequMaintenanceLevel
          formMethod(this.dataForm).then(res => {
            let msg = ""
            if (formMethod == updateequMaintenanceLevel) {
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
