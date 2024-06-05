<template>
  <el-dialog title="岗位调动" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
    <div v-loading="formLoading" >
      <el-row :gutter="15" class="">
        <el-form ref="dataForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
          <template>
            <el-col :span="24">
              <el-form-item label="调动日期" prop="changeDate" ref="changeDate">
                <el-date-picker v-model="dataForm.changeDate" type="date" placeholder="请选择调动日期" style="width: 100%;"
                  value-format="timestamp">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原组织" prop="departmentName" ref="departmentName">
                <el-select v-model="dataForm.departmentName" placeholder="请选择原组织" style="width: 100%;" filterable clearable
                  @change="departmentNameChange">
                  <el-option v-for="item in organizeIdTree" :key="item.id" :label="item.fullName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原岗位" prop="postName" ref="postName">
                <el-select v-model="dataForm.postName" placeholder="请选择岗位" style="width: 100%;"
                  @visible-change="visibleChange" filterable clearable @change="selectChange">
                  <el-option v-for="item in postName" :key="item.id" :label="item.fullName" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="现组织" prop="departmentName2" ref="departmentName2">
                <ComSelect v-model="dataForm.departmentName2" placeholder="请选择现组织" @change="onOrganizeChange" clearable
                  auth />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="现岗位" prop="postName2" ref="postName2">
                <el-select v-model="dataForm.postName2" placeholder="请选择现岗位" style="width: 100%;" @change="selectChange2"
                  @visible-change="visibleChange2" filterable clearable>
                  <el-option-group v-for="group in positionTreeData2" :key="group.id"
                    :label="group.fullName + (group.num ? '【' + group.num + '】' : '')">
                    <el-option v-for="item in group.children" :key="group.id + item.id" :label="item.fullName"
                      :value="item.id">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="调动原因" prop="changeReason">
                <el-input v-model="dataForm.changeReason" placeholder="请输入调动原因" :style='{ "width": "100%" }' true
                  type="textarea" :autosize='{ "minRows": 4, "maxRows": 4 }' maxlength="200">
                </el-input>
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
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { userTransfer, getUserInfo } from '@/api/permission/user'
import { getPositionByOrganize } from '@/api/permission/position'
import { getDepartmentSelectorByAuth } from "@/api/permission/department";

export default {
  data() {
    return {
      visible: false,
      loading: true,
      formLoading: true,
      btnLoading: false,
      dataForm: {
        id: '',
        account: '',
        realName: "",
        changeDate: "",
        departmentName: "",
        departmentName2: "",
        postName: "",
        postName2: "",
        changeReason: "",
        remark: "",

        newDepartmentName: "旧组织名",
        newDepartmentName2: "新组织名",
        newPostName: "旧岗位名",
        newPostName2: "新岗位名",
      },
      organizeIdTree: [], //原组织
      positionTreeData2: [], // 现组织
      postName: [],
      postName2: [],
      rules: {
        changeDate: [{
          required: true,
          message: '请选择调动日期',
          trigger: ['change']
        }],
        departmentName: [{
          required: true,
          message: '请选择原组织',
          trigger: ['change']
        }],
        postName: [{
          required: true,
          message: '请选择原岗位',
          trigger: ['change']
        }],
        departmentName2: [{
          required: true,
          message: '请选择现组织',
          trigger: ['change']
        }],
        postName2: [{
          required: true,
          message: '请选择现岗位',
          trigger: ['change']
        }],
      }
    }
  },
  methods: {
    init({ id }) {
      this.visible = true
      this.loading = true
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
        this.organizeIdTree2 = []
        getUserInfo(id).then(res => {
          this.dataForm.id = res.data.id
          this.dataForm.realName = res.data.realName

          getDepartmentSelectorByAuth().then(res2 => { // 获取全部组织
            this.origanizeTree = res2.data.list[0]

            // 根据岗位id匹配岗位名称
            function findFullNameById(obj, key, targetId) {
              if (obj[key] == targetId) { return obj.organize }
              if (!obj.children) { return '' }
              for (let i = 0; i < obj.children.length; i++) {
                const childObj = obj.children[i]
                const fullName = findFullNameById(childObj, key, targetId)
                if (fullName) { return fullName }
              }
              return ''
            }


            // 获取原组织列表
            if (res.data.organizeIdTree.length) {
              let organizeIdList = res.data.organizeIdTree.map(item => item.join(","))
              this.organizeIdTree = organizeIdList.map(item => {
                let obj = {
                  id: item,
                  fullName: findFullNameById(this.origanizeTree, "organizeIdTree", item)
                }
                return obj
              })

              // console.log("======全部组织======");
              // console.log(this.origanizeTree);
              // console.log("======this.organizeIdTree原组织列表======");
              // console.log(this.organizeIdTree);
              // 获取组织内岗位
              let positionIdArr = res.data.positionId ? res.data.positionId.split(',') : []
              this.organizeIdTree.forEach(item => {
                let organizeIdTree = [item.id ? item.id.split(",") : []]
                const organizeIds = organizeIdTree.map(o => o[o.length - 1])

                getPositionByOrganize(organizeIds).then(res2 => {
                  let temp = res2.data.list.filter(o => o.children && Array.isArray(o.children) && o.children.length)
                  let departmentId = temp[0].id
                  // 过滤不属于此账户的岗位
                  temp = temp[0].children.filter(departments => positionIdArr.includes(departments.id));
                  // 过滤后的岗位以children形式添加到对应组织中
                  this.organizeIdTree.forEach(item => {
                    let ids = item.id ? item.id.split(',') : []
                    if (ids[ids.length - 1] === departmentId) {
                      item.children = temp
                    }
                  })
                  this.$nextTick(() => {
                    this.loading = false
                    this.formLoading = false
                  })
                })
              })
            }
          })
        }).catch(() => {
          this.loading = false
          this.formLoading = false
        })
      })
    },
    selectChange(postionId) {
      // 根据岗位id匹配岗位名称
      this.organizeIdTree.forEach(item => {
        let temp = item.children.filter(item => item.id == postionId)
        if (temp.length) {
          this.dataForm.newPostName = item.children[0].fullName
          return
        }
      })
    },
    selectChange2(postionId) {
      // 根据岗位id匹配岗位名称
      let temp = this.positionTreeData2[0].children.filter(item => item.id === postionId)[0]
      this.dataForm.newPostName2 = temp.fullName
    },
    departmentNameChange(val) {
      this.dataForm.postName = ''

      this.organizeIdTree.forEach(item => {
        if (item.id === val) {
          this.postName = item.children
          this.dataForm.newDepartmentName = item.fullName
          // this.dataForm.postName = this.postName.length ? this.postName[0].id : ''
        }
      })
    },
    clearData() {
      this.dataForm = {
        realName: "",
        changeDate: "",
        departmentName: "",
        departmentName2: "",
        postName: "",
        postName2: "",
        changeReason: "",
        remark: ""
      }
    },

    // 表单提交
    dataFormSubmit() {
      if (!this.checkAndFocus()) {}
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

      let newDepartmentName = this.dataForm.departmentName.split(',')
      newDepartmentName = newDepartmentName[newDepartmentName.length - 1]

      let formData = {
        code: this.dataForm.id,
        changeDate: this.dataForm.changeDate,
        changeReason: this.dataForm.changeReason,
        departmentCode: newDepartmentName,
        departmentCode2: this.dataForm.departmentName2[this.dataForm.departmentName2.length - 1],
        departmentName: this.dataForm.newDepartmentName,
        departmentName2: this.dataForm.newDepartmentName2,
        postCode: this.dataForm.postName,
        postCode2: this.dataForm.postName2,
        postName: this.dataForm.newPostName,
        postName2: this.dataForm.newPostName2,
        realName: this.dataForm.realName,
        remark: this.dataForm.remark
      }
      userTransfer(formData).then((res) => {
        if (res.msg === 'Success') res.msg = '修改成功'
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1000,
          onClose: () => {
            this.visible = false
            this.btnLoading = false
            this.$emit('close', true)
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })

    },
    // 选择新组织之后触发
    onOrganizeChange(data, data2) {
      this.dataForm.postName2 = ''
      this.postName2 = []
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate(['departmentName2']);
      })
      if (!data || !data.length) return
      this.getOptionsByOrgIds([data])
      let temp = []
      data2.forEach(item => {
        temp.push(item.fullName)
      })
      this.dataForm.newDepartmentName2 = temp.join('/')
    },
    // 根据组织id树获取岗位
    getOptionsByOrgIds(organizeIdTree2) {
      const organizeIds = organizeIdTree2.map(o => o[o.length - 1])
      getPositionByOrganize(organizeIds).then(res => {
        this.positionTreeData2 = res.data.list.filter(o => o.children && Array.isArray(o.children) && o.children.length)
      })
    },
    visibleChange(val) {
      if (!val) return
      if (!this.dataForm.departmentName) this.$message.warning('请先选择原组织')
    },
    visibleChange2(val) {
      if (!val) return
      if (!this.dataForm.departmentName2) this.$message.warning('请先选择现组织')
    },
    onChange(key) {
      this.dataForm[key] = this[key].join()
    },
  },
}
</script>