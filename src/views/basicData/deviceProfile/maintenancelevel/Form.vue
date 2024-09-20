<template>
  <el-dialog :title="!dataForm.id ? '新建等级与频次' : '编辑等级与频次'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule" label-position="top" label-width="120px">
      <el-form-item label="保养等级" prop="level">
        <el-select v-model="dataForm.level" placeholder="请选择保养等级" clearable style="width: 100%;">
          <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保养频次" prop="frequency">
        <el-select v-model="dataForm.frequency" placeholder="请选择保养频次" clearable style="width: 100%;">
          <el-option v-for="item in frequencyList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
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
        frequency: '',
        id: ''
      },
      dataRule: {
        level: [
          { required: true, message: '请选择保养等级', trigger: 'blur' },
        ],
        frequency: [
          { required: true, message: '请选择保养频次', trigger: 'blur' },
        ],
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
