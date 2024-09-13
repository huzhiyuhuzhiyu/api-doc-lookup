<template>
  <el-dialog title="重新入职" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
    <div v-loading="formLoading">
      <el-row :gutter="15" class="">
        <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top"
          style="min-height: 100px;">
          <template>
            <el-col :span="12">
              <el-form-item label="入职日期" prop="entryDate" ref="entryDate">
                <el-date-picker v-model="dataForm.entryDate" type="date" placeholder="请选择入职日期" style="width: 100%;"
                  value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="入职组织" prop="organizeId" ref="organizeId">
                <ComSelect v-model="dataForm.organizeId" placeholder="请选择入职组织" @change="onOrganizeChange" clearable
                  auth />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入职岗位" prop="positionId" ref="positionId">
                <el-select v-model="dataForm.positionId" placeholder="请选择入职岗位" style="width: 100%;"
                  @visible-change="visibleChange" filterable clearable>
                  <el-option-group v-for="group in positionTreeData" :key="group.id"
                    :label="group.fullName + (group.num ? '【' + group.num + '】' : '')">
                    <el-option v-for="item in group.children" :key="group.id + item.id" :label="item.fullName"
                      :value="item.id">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色" prop="roleId">
                <el-select v-model="roleId" placeholder="选择角色" @change="onChange('roleId')" style="width: 100%;"
                  @visible-change="visibleChange" multiple filterable clearable>
                  <el-option-group v-for="group in roleTreeData" :key="group.id"
                    :label="group.fullName + (group.num ? '【' + group.num + '】' : '')">
                    <el-option v-for="item in group.children" :key="group.id + item.id" :label="item.fullName"
                      :value="item.id">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="dataForm.remark" placeholder="请输入备注" :style='{ "width": "100%" }' true type="textarea"
                  :autosize='{ "minRows": 4, "maxRows": 4 }' maxlength="200">
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
import { userReHired } from '@/api/permission/user'

import { getPositionByOrganize } from '@/api/permission/position'
import { getRoleByOrganize } from '@/api/permission/role'
export default {
  data() {
    return {
      visible: false,
      loading: true,
      formLoading: true,
      btnLoading: false,
      dataForm: {
        entryDate: "",
        id: "",
        organizeId: "",
        positionId: "",
        remark: "",
        roleId: ""
      },

      roleTreeData: [],
      positionTreeData: [],
      roleId: [],

      rules: {
        entryDate: [{
          required: true,
          message: '请选择入职日期',
          trigger: ['change']
        }],
        organizeId: [{
          required: true,
          message: '请选择入职组织',
          trigger: ['change']
        }],
        positionId: [{
          required: true,
          message: '请选择入职岗位',
          trigger: ['change']
        }]
      },
    }
  },
  methods: {
    onChange(key) {
      this.dataForm[key] = this[key].join()
    },
    init(id) {
      this.visible = true
      this.loading = true
      this.formLoading = true
      this.dataForm.id = id

      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
        this.loading = false
        this.formLoading = false
      })
    },
    clearData() {
      this.dataForm = {
        entryDate: "",
        id: "",
        organizeId: "",
        positionId: "",
        remark: "",
        roleId: ""
      }
    },

    // 表单提交
    dataFormSubmit() {
      if (!this.checkAndFocus()) {}
      else {
        this.request()
      }
    },

    request() {
      let temp = this.dataForm.organizeId
      temp = temp[temp.length - 1]

      let dataForm = {
        id: this.dataForm.id,
        entryDate: this.dataForm.entryDate,
        organizeId: temp,
        positionId: this.dataForm.positionId,
        remark: this.dataForm.remark,
        roleId: this.dataForm.roleId
      }
      userReHired(dataForm).then((res) => {
        if (res.msg === 'Success') res.msg = '修改成功'
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1000,
          onClose: () => {
            this.clearData()
            this.visible = false
            this.btnLoading = false
            this.$emit('close', true)
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })

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
    // 选择新组织之后触发
    onOrganizeChange(data) {
      this.dataForm.positionId = ''
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate(['organizeId']);
      })
      if (!data || !data.length) return
      this.getOptionsByOrgIds([data])
    },
    // 根据组织id树获取岗位
    getOptionsByOrgIds(organizeIdTree2) {
      const organizeIds = organizeIdTree2.map(o => o[o.length - 1])
      // 获取岗位
      getPositionByOrganize(organizeIds).then(res => {
        this.positionTreeData = res.data.list.filter(o => o.children && Array.isArray(o.children) && o.children.length)
      })
      // 获取角色
      getRoleByOrganize(organizeIds).then(res => {
        this.roleTreeData = res.data.list.filter(o => o.children && Array.isArray(o.children) && o.children.length)
      })
    },
    visibleChange(val) {
      if (!val) return
      if (!this.dataForm.organizeId) this.$message.warning('请先选择入职组织')
    },
  },
}
</script>
<style scoped>
::v-deep .el-select__tags {
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
