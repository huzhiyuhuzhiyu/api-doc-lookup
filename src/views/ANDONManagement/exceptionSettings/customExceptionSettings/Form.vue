<template>
  <el-dialog :title="dialogTitle" :close-on-click-modal="false" append-to-body :visible.sync="visible"
    class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px" @close="$emit('refresh')">
    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" v-loading="loading" :btnType="btnType" />
    <JNPF-col-table v-model="dataFormTwo" ref="tableForm" :tableItems="linesListItems" :openMode="openMode"
      @addth="addequipment_process_relList" @deleteth="delequipment_process_relList" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('refresh')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
        {{ $t('common.submitButton') }}
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import { addAbnoramlTypeData, updateAbnoramlTypeData, detailAbnoramlTypeData, checkAbnoramlTypeCode } from '@/api/abnormalManagement/index.js'
export default {
  data() {
    return {
      dialogTitle: '',
      visible: false,
      loading: false,
      btnLoading: false,
      dataForm: {},
      btnType: 'add',
      dataFormItems: [],
      dataFormTwo: [],
      linesListItems: [],
      codeConfig: {},
    }
  },
  computed: {
    openMode() {
      return this.dialogTitle === '新建异常' ? '新建' : this.dialogTitle === '编辑异常' ? '编辑' : '只读'
    }
  },
  created() {
  },
  methods: {
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.code = data.number
        }
        this.setDataFormItems()
      } catch (error) {
      }
    },
    setDataFormItems() {
      this.dataFormItems = [
        {
          prop: "code", label: "类型编码", value: "", type: "input",
          itemRules: [
            { required: true, trigger: "blur" },
            { validator: this.formValidate('enCode'), trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!value) { callback() }
                else if (this.dataForm.code === this.autoCode) { callback() }
                else {
                  checkAbnoramlTypeCode(value,(this.dataForm.id || '')).then((res) => {
                    if (!res.data) { callback() }
                    else { callback(new Error('此类型编码已存在')) }
                  }).catch((err) => { callback(new Error(" ")) })
                }
              },
              trigger: 'blur'
            }
          ], sm: 12, itemDisabled:this.btnType === 'look' ? true : this.codeConfig.codeWay == 'auto' && !this.codeConfig.modifyFlag ? true : false
        },
        { prop: "module", label: "异常模块", value: "", type: "select", itemRules: [{ required: true, message: '异常模块不能为空', trigger: "change" }], 
          sm: 12,itemDisabled:this.btnType === 'look' ? true : false ,
          options: [{ label: '质量异常', value: 'quality' },{ label: '物料异常', value: 'material' },{ label: '生产异常', value: 'produce' },{ label: '设备异常', value: 'facility' }]
        },
        { prop: "name", label: "类型名称", value: "", type: "input", itemRules: [{ required: true, message: '类型名称不能为空', trigger: "blur" }], 
          sm: 12,itemDisabled:this.btnType === 'look' ? true : false 
        },
        { prop: "remark", label: "类型说明", value: "", type: "textarea", itemRules: [{ required: true, message: '类型说明不能为空', trigger: "blur" }],
          sm: 24 ,itemDisabled:this.btnType === 'look' ? true : false
        },
      ]
    },
    setLinesListItems() {
      this.linesListItems = [
        {
          prop: 'code',
          label: '内容编码',
          value: '',
          type: 'input',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['', (errMsg, index) => {
                  this.$message.error(`异常内容第${index + 1}行：内容编码${errMsg}`)
                  return
                }
                ]
              }),
              trigger: 'blur'
            },
            {
              validator: (rule, value, callback) => {
                let temp = rule.field.match(/\d+/)
                let index = temp ? Number(temp[0]) : undefined
                let count = 0
                this.dataFormTwo && this.dataFormTwo.forEach(item => {
                  if (item.code === value) {
                    count++
                  }
                })
                if (!value) { callback() }
                else if (this.dataForm.code === value) {
                  this.$message.error(`异常内容第${index + 1}行：内容编码已存在`)
                  callback(new Error(''))
                } else if (this.dataFormTwo.length > 1 && count > 1) {
                  this.$message.error(`内容编码不能重复`)
                  callback(new Error(''))
                } else {
                  console.log(this.dataFormTwo[index].id);
                  
                  checkAbnoramlTypeCode(value,(this.dataFormTwo[index].id || '')).then((res) => {
                    if (!res.data) { callback() }
                    else {
                      this.$message.error(`异常内容第${index + 1}行：内容编码已存在`)
                      callback(new Error(''))
                    }
                  }).catch((err) => { callback(new Error(" ")) })
                }
              },
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
          ],
          itemDisabled:this.btnType === 'look' ? true : false
        },
        {
          prop: 'name',
          label: '内容名称',
          value: '',
          type: 'input',
          itemRules: [
            {
              validator: this.formValidate({ type: 'noEmtry', params: ['', (errMsg, index) => { this.$message.error(`异常内容第${index + 1}行：内容名称${errMsg}`) }] }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
          ],
          itemDisabled:this.btnType === 'look' ? true : false
        },
        {
          prop: 'remark',
          label: '内容说明',
          value: '',
          type: 'input',
          itemRules: [],
          itemDisabled:this.btnType === 'look' ? true : false
        },
      ]
    },
    clearData() {
      this.dataForm = {}
      this.dataFormTwo = [{code:'',name:'',remark:'',category: 'content',id: ''}]
    },
    init(id, btntype) {
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.visible = true
      this.btnType = btntype
      this.$nextTick(() => {
        this.$refs['dataForm'].$children[0].resetFields()
        if (btntype == 'add') {
          this.dialogTitle = '新建异常'
          this.clearData()
          this.fetchData('ExceptionType',true)
          // this.setDataFormItems()
          this.setLinesListItems()
          console.log(this.dataForm);
          
        } else {
          detailAbnoramlTypeData(id).then(res => {
            this.dialogTitle = `编辑异常`
            this.dataForm = res.data.type
            this.dataFormTwo = res.data.contentList
            this.loading = false
            // this.setDataFormItems()
            this.fetchData('ExceptionType',false)
            this.setLinesListItems()
          }).catch(error => { })
        }

      })
    },
    // 表单提交
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否已经使用过

      // 校验基本信息
      const form_1 = this.$refs['dataForm'].$children[0]
      const valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        // 聚焦第一个失败的表单元素
        let formItems = form_1.fields
        for (let j = 0; j < formItems.length; j++) {
          let formItem = formItems[j]
          if (formItem.validateState === 'error') {
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => {
              this.jnpf.formItemValidate(formItem)
            })
            break
          }
        }
      }
      // 校验表格表单
      const form_2 = this.$refs['tableForm'].$children[0]
      let valid_2 = await form_2.validate().catch((err) => false)
      if (!valid_2 && submitFlag) {
        let formItems = form_2.fields
        for (let j = 0; j < formItems.length; j++) {
          let formItem = formItems[j]
          if (formItem.validateState === 'error') {
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => {
              this.jnpf.formItemValidate(formItem)
            })
            break
          }
        }
      }
      if (submitFlag) {
        let _data = {
          type: JSON.parse(JSON.stringify({ ...this.dataForm, category: 'type' })),
          contentList: JSON.parse(JSON.stringify(this.dataFormTwo))
        }
        console.log(_data)
        let queryMehtod = this.dataForm.id ? updateAbnoramlTypeData : addAbnoramlTypeData
        queryMehtod(_data).then((res) => {
          if (res.msg === 'Success') {
            this.$message({
              message: this.dataForm.id ? '修改成功' : '新建成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.btnLoading = false
              }
            })
            this.$emit('refresh', true)
          }
        }).catch((err) => { this.btnLoading = false })
      } else {
        this.btnLoading = false
      }
    },
    // 添加项
    addequipment_process_relList() {
      let ind = this.dataFormTwo.length
      let item = {
        index: ind,
        name: '',
        code: '',
        remark: '',
        category: 'content',
        id: ''
      }
      this.dataFormTwo.push(item)

    },
    // 删除项
    delequipment_process_relList(scope) {
      let index = scope.$index
      this.dataFormTwo.splice(index, 1)
    }
  }
}
</script>

