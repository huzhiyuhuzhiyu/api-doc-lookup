<template>
  <el-dialog :title="dialogTitle" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1200px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
        <template v-if="!loading">
          <el-col :span="12">
            <el-form-item label="业务编码" prop="code" ref="code">
              <el-input v-model="dataForm.code" :disabled="type != 'add'" placeholder="请输入业务编码" clearable :style='{ "width": "100%" }'
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务名称" prop="name" ref="name">
              <el-input v-model="dataForm.name" placeholder="请输入业务名称" clearable :style='{ "width": "100%" }'
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回调方法" prop="callbackMethod">
              <el-input v-model="dataForm.callbackMethod" placeholder="请输入" maxlength="200">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-table :data="dataFormTwo" size='mini' height="200" id="table">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column prop="code" label="条件编码">
                  <template slot-scope="{row}">
                    <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                      <el-form-item prop="code" ref="code">
                        <el-input v-model="row.code" placeholder="请输入条件编码" clearable maxlength="20"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>

                <el-table-column prop="code" label="条件名称">
                  <template slot-scope="{row}">
                    <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                      <el-form-item prop="name" ref="name">
                        <el-input v-model="row.name" placeholder="请输入条件名称" clearable maxlength="20"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="dataType" label="数据类型">
                  <template slot-scope="{row}">
                    <el-form :ref="`tableForm_2_${row.index}`" :model="row" :rules="rulesTwo">
                      <el-form-item prop="dataType" ref="dataType">
                        <el-select v-model="row.dataType" placeholder="请选择数据类型">
                          <el-option label="数字" value="number"></el-option>
                          <el-option label="字符串" value="string"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="optionNames" label="值显示名称">
                  <template slot-scope="{row}">
                    <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                      <el-form-item prop="optionNames" ref="optionNames">
                        <el-input v-model="row.optionNames" placeholder="请输入值显示名称" clearable maxlength="20"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="optionValues" label="值范围值">
                  <template slot-scope="{row}">
                    <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                      <el-form-item prop="optionValues" ref="optionValues">
                        <el-input v-model="row.optionValues" placeholder="请输入值范围值" clearable maxlength="20"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="60">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      @click="delequipment_process_relList(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table-actions" @click="addequipment_process_relList()">
                <el-button type="text" icon="el-icon-plus">添加审批业务条件</el-button>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
      <!-- <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
        @select="addForSelect" @close="selectDialogVisible=false" /> -->
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="btnLoading" @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addApproval, updateApproval, getApprovalDetail } from '@/api/basicData/approvalBusinessConditions'

export default {
  components: {},
  props: [],
  data() {
    return {
      dialogTitle: '',
      visible: false,
      loading: false,
      btnLoading: false,
      dataForm: {
        id: 0,
        code: "",
        name: "",
        callbackMethod: "",
      },
      dataFormTwo: [],
      rules: {
        name: [{
          required: true,
          message: '请输入业务名称',
          trigger: ['blur']
        }],
        code: [{
          required: true,
          message: '请输入业务编码',
          trigger: ['blur']
        }],
        callbackMethod: [{
          required: true,
          message: '请输入回调方法',
          trigger: ['blur']
        }],
      },
      rulesTwo: {
        ratio: [{
          required: true,
          message: '请输入转换系数',
          trigger: ['blur']
        }, {
          validator: (rule, value, callback) => {
            const num = parseFloat(value)
            if (!isNaN(num) && Math.abs(num) <= 9999999.999999) {
              callback()
            } else {
              this.$message.error('转换系数只能是数字')
              callback(new Error('请输入-9999999.999999到9999999.999999之间的值'))
            }
          },
          trigger: ['blur']
        }],
        targetName: [{
          required: true,
          message: '请选择转换后单位名称',
          trigger: ['change']
        }]
      },
      formItems: [
        { ref: 'code', message: '请输入业务编码' },
        { ref: 'name', message: '请输入单位名称' }
      ],
      typeOptions: [],
      type:'',
    }
  },
  methods: {
    // 提交校验
    equipment_process_relExist() {
      let isOk = true
      return isOk
    },
    clearData() {
      this.dataForm.id = ""
      this.dataForm.name = ''
      this.dataForm.code = ''
      this.dataForm.callbackMethod = ''
      this.dataFormTwo = []
    },
    init(rowData,type) {
      rowData = JSON.parse(rowData)
      this.type = type
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = Object.keys(rowData).length ? rowData.id : 0
      this.visible = true
      this.dialogTitle = !this.dataForm.id ? '新增业务条件' : `编辑业务条件`
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          this.dataForm = rowData
          // 获取当前项详情
          getApprovalDetail(rowData.id).then(res => {
            this.dataFormTwo = res.data
            let ind = 0
            this.dataFormTwo.forEach(item => {
              item.index = ind++
            })
            this.loading = false
          })
        }
      })
      // this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    // 表单提交
    dataFormSubmit() {
      if (!this.checkAndFocus()) {}
      else {
        // 表单验证通过，处理数据关系后提交表单
        if (!this.equipment_process_relExist()) return
        this.dataFormTwo.forEach(item => {
          this.typeOptions.forEach(item2 => {
            if (item.targetName == item2.name) {
              item.targetUnitCode = item2.code
              return
            }
          })
        })
        this.request()
      }
    },
    // 校验与聚焦
    checkAndFocus() {
      let isOk = true // 决定是否满足发送请求的条件
      let focu = true // 判断自动聚焦是否已经使用了

      // 校验dataForm
      let checkDataForm = () => {
        this.$refs['elForm'].validate(valid => {
          let focusFirstChild = (el) => {
            if (el && el.nodeType === 1) {
              if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.focus()
              } else {
                const children = el.childNodes
                for (let i = 0; i < children.length; i++) {
                  const child = children[i]
                  if (child.nodeType === 1) {
                    focusFirstChild(child)
                    break
                  }
                }
              }
            }
          }
          if (!valid) {
            isOk = false
            focu = false
            // 表单验证失败，聚焦到第一个验证失败的表单项
            for (let i = 0; i < this.formItems.length; i++) {
              const formItem = this.$refs[this.formItems[i].ref]
              if (formItem.validateState === 'error') {
                focusFirstChild(formItem.$children[1].$el)
                break
              }
            }
          }
        })
      }
      checkDataForm()

      // 校验tableForm
      let checkTableForm = () => {
        // 生成一个对应多个ratio和targetName的数组
        let refTotal = this.dataFormTwo.length
        for (let i = 0; i < refTotal; i++) {
          let refList = [this.$refs['tableForm_1_' + i], this.$refs['tableForm_2_' + i]]
          refList.forEach(item => {
            item.validate(valid => {
              if (!valid) {
                if (focu) {
                  if (item.$children[0].validateMessage == "请选择转换后单位名称") {
                    // 聚焦并展开el-select
                    // item.$children[0].focus()
                    // item.$children[0].showPopper()
                    // item.$children[0].showMessage()
                  }
                  item.$el[0].focus()
                  focu = false
                }
                isOk = false
              }
            })
          })
        }
      }
      checkTableForm()
      return isOk
    },
    request() {
      this.btnLoading = true
      let _data = {
        approval: this.dataForm,
        approvalCondList: this.dataFormTwo
      }
      // this.btnLoading = false
      if (!this.dataForm.id) {
        addApproval(_data).then(res => {
          if (res.msg === 'Success') res.msg = '新建成功'
          // this.btnLoading = false
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
              this.$emit('refresh', true)
            }
          })
          this.init(res.data)
          // this.visible = false
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        updateApproval(_data).then((res) => {
          if (res.msg === 'Success') res.msg = '修改成功'
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
              this.$emit('refresh', true)
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      }
    },
    // 添加项
    addequipment_process_relList() {
      let ind = this.dataFormTwo.length
      let item = {
        index: ind,
        code: "",
        name: "",
        dataType: "",
        optionNames: "",
        optionValues: "",
      }
      this.dataFormTwo.push(item)
    },
    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.splice(index, 1)
    }
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>