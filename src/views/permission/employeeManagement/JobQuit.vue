<template>
  <el-dialog title="办理离职" :close-on-click-modal="false" append-to-body :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
    <div v-loading="formLoading">
      <el-row :gutter="15" class="">
        <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top" style="min-height: 100px;">
          <template>
            <el-col :span="24">
              <el-form-item label="离职日期" prop="changeDate" ref="changeDate">
                <el-date-picker v-model="dataForm.changeDate" type="date" placeholder="请选择离职日期" style="width: 100%;" value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="离职原因" prop="changeReason">
                <el-input v-model="dataForm.changeReason" placeholder="请输入离职原因" :style='{ "width": "100%" }' true type="textarea" :autosize='{ "minRows": 4, "maxRows": 4 }' maxlength="200">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-checkbox v-model="dataForm.checked">同步停用账号</el-checkbox>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="dataForm.remark" placeholder="请输入备注" :style='{ "width": "100%" }' true type="textarea" :autosize='{ "minRows": 4, "maxRows": 4 }' maxlength="200">
                </el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-form>
        <!-- <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
        @select="addForSelect" @close="selectDialogVisible=false" /> -->
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        {{ $t('common.confirmButton') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updatebaseEmployee, getbaseEmployeeInfo } from '@/api/permission/user'
export default {
  data() {
    return {
      visible: false,
      loading: true,
      formLoading: true,
      btnLoading: false,
      dataForm: {
        checked: true,
        id: '',
        changeDate: "",
        changeReason: "",
        code: "",
        realName: "",
        remark: "",
      },
      rules: {
        changeDate: [{
          required: true,
          message: '请选择离职日期',
          trigger: ['change']
        }],
      }
    }
  },
  methods: {
    init(id) {
      this.visible = true
      this.loading = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
        getbaseEmployeeInfo(id).then(res => {
          this.copylist = res.data
          this.dataForm.id = res.data.employeeVO.id
          this.dataForm.realName = res.data.employeeVO.realName
          this.loading = false
          this.formLoading = false
        }).catch(() => {
          this.loading = false
          this.formLoading = false
        })
      })
    },
    clearData() {
      this.dataForm = {
        id: '',
        changeDate: "",
        changeReason: "",
        code: "",
        realName: "",
        remark: "",
      }
    },

    // 表单提交
    dataFormSubmit() {
      if (!this.checkAndFocus()) { }
      else {
        this.request()
      }
    },

    // 校验与聚焦
    checkAndFocus() {
      // 一些校验的方法
      let isOk = true // 决定是否满足发送请求的条件

      // 校验dataForm
      let checkDataForm = () => {
        // 聚焦到dataForm第一个校验失败的dom
        let focusFirstChild = (el) => {
          if (el && el.nodeType === 1) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.focus() }
            else {
              const children = el.childNodes;
              for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child.nodeType === 1) {
                  focusFirstChild(child);
                  break;
                }
              }
            }
          }
        }
        this.$refs['dataForm'].validate(valid => {
          if (!valid) {
            isOk = false
            // 表单验证失败，聚焦到第一个验证失败的表单项
            let refList = Object.keys(this.rules)
            for (let i = 0; i < refList.length; i++) {
              const formItem = this.$refs[refList[i]];
              if (formItem.validateState === 'error') {
                focusFirstChild(formItem.$children[1].$el)
                break
              }
            }
          }
        });
      }
      checkDataForm()
      return isOk
    },
    request() {
      this.btnLoading = true
      this.dataForm.code = this.dataForm.id
      this.copylist.employeeVO = this.dataForm
      updatebaseEmployee(this.dataForm).then((res) => {
        if (res.msg === 'Success') res.msg = '修改成功'
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1000,
          onClose: () => {
            this.visible = false
            this.btnLoading = false
            this.clearData()
            this.$emit('close', true)
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })

    }
  },
}
</script>