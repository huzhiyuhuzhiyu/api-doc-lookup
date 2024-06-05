<template>
  <el-dialog :title="dialogTitle" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
    <el-row :gutter="15" class="" v-loading="loading">
      <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="top">
        <template>
          <el-col :span="12">
            <el-form-item label="业务名称" prop="businessCode" ref="businessCode">
              <el-input :value="'产品'" placeholder="请输入业务名称" clearable :style='{ "width": "100%" }' maxlength="20"
                disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="属性编码" prop="code" ref="code">
              <el-input v-model="dataForm.code" placeholder="请输入属性编码" clearable :style='{ "width": "100%" }'
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="属性名称" prop="name" ref="name">
              <el-input v-model="dataForm.name" placeholder="请输入属性名称" clearable :style='{ "width": "100%" }'
                maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="属性类型" prop="type" ref="type">
              <el-select v-model="dataForm.type" placeholder="请选择属性类型">
                <el-option v-for="item in typeOptions" :key="item.type" :label="item.name" :value="item.type"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="!addButtonFlag">
            <el-form-item label-width="0">
              <el-table :data="dataFormTwo" size='mini' height="200" id="table">
                <el-table-column type="index" width="60" label="序号" align="center" />
                <el-table-column prop="itemKey" label="请选择项名称">
                  <template slot-scope="{row}">
                    <el-form :ref="`tableForm_1_${row.index}`" :model="row" :rules="rulesTwo">
                      <el-form-item prop="itemKey" ref="itemKey">
                        <el-input v-model="row.itemKey" placeholder="请输入选择项名称" clearable maxlength="20"></el-input>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="itemVal" label="请选择项值">
                  <template slot-scope="{row}">
                    <el-form :ref="`tableForm_2_${row.index}`" :model="row" :rules="rulesTwo">
                      <el-form-item prop="itemVal" ref="itemVal">
                        <el-input v-model="row.itemVal" placeholder="请输入选择项值" clearable maxlength="20"></el-input>
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
                <el-button type="text" icon="el-icon-plus">添加</el-button>
              </div>
            </el-form-item>
          </el-col>
        </template>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false"> 取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updateattribute, addattribute, detailattribute, checkAttributeCode } from '@/api/basicData/materialSettings'

export default {
  data() {
    return {
      dialogTitle: '',
      visible: false,
      loading: false,
      btnLoading: false,
      addButtonFlag: true,
      parentData: [],
      dataForm: {
        id: "",
        attributeItemName: "", // 属性选择项名称
        attributeItemVal: "", // 属性选择项值
        businessCode: "product", // 业务编码 - product（产品）
        code: "",
        name: "",
        type: ""
      },
      autoCode: undefined,
      dataFormTwo: [],
      dataFormTwoTemp: [],
      rules: {
        businessCode: [{
          required: true,
          message: '请输入业务名称',
          trigger: ['blur']
        }],
        code: [{
          required: true,
          message: '请输入属性编码',
          trigger: ['blur']
        }, {
          validator: this.formValidate('enCode'),
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            // 没有value不进行此校验
            if (!value) { callback() }
            else if (this.dataForm.code === this.autoCode) { callback() }
            else {
              checkAttributeCode({ code: this.dataForm.code, businessCode: this.dataForm.businessCode }).then((res) => {
                if (!res.data) { callback() }
                else { callback(new Error('当前属性编码已存在')) }
              }).catch((err) => { callback(new Error(" ")) })
            }
          },
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入属性名称',
          trigger: ['blur']
        }],
        type: [{
          required: true,
          message: '请选择属性类型',
          trigger: ['blur']
        }]
      },
      rulesTwo: {
        itemKey: [{
          required: true,
          message: '请输入选择项名称',
          trigger: ['blur']
        }],
        itemVal: [{
          required: true,
          message: '请输入选择项值',
          trigger: ['change']
        }],
      },
      formItems: [
        { ref: 'businessCode', message: '请输入业务名称' },
        { ref: 'code', message: '请输入属性编码' },
        { ref: 'name', message: '请输入属性名称' },
        { ref: 'type', message: '请选择属性类型' },
      ],
      typeOptions: [{
        name: '文本',
        type: 'text'
      }, {
        name: '下拉选',
        type: 'select'
      }, {
        name: '复选项',
        type: 'multiple'
      }]
    }
  },
  watch: {
    dataForm: {
      handler: function (val) {
        if (val.type === "text" || val.type === "") {
          this.addButtonFlag = true
          this.dataFormTwoTemp = this.dataFormTwo
          this.dataFormTwo = []
        } else {
          this.addButtonFlag = false
          this.dataFormTwoTemp.length ? this.dataFormTwo = this.dataFormTwoTemp : ''
        }
      },
      deep: true
    },
  },
  methods: {
    clearData() {
      this.dataForm = {
        id: "",
        attributeItemName: "", // 属性选择项名称
        attributeItemVal: "", // 属性选择项值
        businessCode: "product", // 业务编码 - product（产品）
        code: "",
        name: "",
        type: ""
      }
      this.dataFormTwo = [];
    },
    init(id, parentData) {
      this.parentData = parentData
      this.dataForm.id = id ? id : ""
      this.dialogTitle = id ? '编辑属性' : '新增属性'
      this.visible = true;
      this.autoCode = undefined
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields();
        if (this.dialogTitle === "新增属性") { this.clearData() }
        else {
          this.loading = true
          // 获取当前项详情
          detailattribute(id).then(res => {
            this.dataForm = res.data
            this.dataFormTwo = []
            this.autoCode = res.data.code
            this.loading = false
            let tempName, tempVal
            if (res.data.attributeItemName === "") { return }
            else if (!res.data.attributeItemName.includes(',')) {
              tempName = [res.data.attributeItemName]
              tempVal = [res.data.attributeItemVal]
            } else {
              tempName = res.data.attributeItemName.split(',')
              tempVal = res.data.attributeItemVal.split(',')
            }
            for (let i = 0; i < tempName.length; i++) { this.dataFormTwo.push({ index: i, itemKey: tempName[i], itemVal: tempVal[i] }) }
          })
        }
      });
      // this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    // 表单提交
    async dataFormSubmit() {
      this.btnLoading = true
      // 一些校验的方法
      let isOk = true // 决定是否满足发送请求的条件
      let focu = true // 判断自动聚焦是否已经使用了

      // 校验dataForm
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
      let valid = await this.$refs['elForm'].validate().catch(() => false)
      if (!valid) {
        isOk = false
        focu = false
        // 表单验证失败，聚焦到第一个验证失败的表单项
        for (let i = 0; i < this.formItems.length; i++) {
          const formItem = this.$refs[this.formItems[i].ref];
          if (formItem.validateState === 'error') {
            focusFirstChild(formItem.$children[1].$el)
            break
          }
        }
      }


      // 校验tableForm
      // 生成一个对应多个ratio和targetName的数组
      let refTotal = this.dataFormTwo.length
      for (let i = 0; i < refTotal; i++) {
        let refList = [this.$refs['tableForm_1_' + i], this.$refs['tableForm_2_' + i]]
        refList.forEach(item => {
          item.validate(valid => {
            if (!valid) {
              if (focu) {
                if (item.$children[0].validateMessage == "请选择属性类型") {
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

      if (isOk) {
        // 表单验证通过，处理数据关系后提交表单
        let attributeItemName = ""
        let attributeItemVal = ""
        this.dataFormTwo.forEach(item => {
          attributeItemName += item.itemKey + ','
          attributeItemVal += item.itemVal + ','
        })
        attributeItemName = attributeItemName.slice(0, attributeItemName.length - 1)
        attributeItemVal = attributeItemVal.slice(0, attributeItemVal.length - 1)
        this.dataForm = { ...this.dataForm, attributeItemName, attributeItemVal, businessCode: "product" }
        this.request()
      } else {
        this.btnLoading = false
      }

    },

    request() {
      let requestMethod = this.dialogTitle === "新增属性" ? addattribute : updateattribute
      let successTip = this.dialogTitle === "新增属性" ? "新增" : "修改"
      requestMethod(this.dataForm).then(res => {
        this.$message({
          message: successTip + '成功',
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
    },
    // 添加项
    addequipment_process_relList() {
      let ind = this.dataFormTwo.length
      let item = {
        index: ind,
        ratio: "",
        targetUnitCode: ""
      }
      this.dataFormTwo.push(item)
    },
    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.splice(index, 1);
    }
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>