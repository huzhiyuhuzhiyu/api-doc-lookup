<template>
  <div style="overflow: hidden;">
    <el-dialog v-if="category === 'type'" :title="dialogTitle" :close-on-click-modal="false" append-to-body
      :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px" @close="$emit('refresh')">
      <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" v-loading="loading" :btnType="btnType" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('refresh')">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
          {{ $t('common.submitButton') }}
        </el-button>
      </span>
    </el-dialog>
    <el-drawer v-else :title="dialogTitle" :visible.sync="visible" :wrapperClosable="false" ref="drawer" size="30%"
      :before-close="handleDrawerClose" class="JNPF-common-drawer columnSettings-drawer" append-to-body>
      <div class="JNPF-flex-main">
        <el-scrollbar class="column-list" v-loading="loading">
          <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" v-loading="loading"
            :btnType="btnType" />
        </el-scrollbar>
        <div class="footer">
          <el-button @click="$emit('refresh')">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
            {{ $t('common.submitButton') }}
          </el-button>
        </div>
      </div>
    </el-drawer>
    <icon-box :visible.sync="iconBoxVisible" ref="iconBox" :current="dataForm.icon" @choiceIcon="choiceIcon" />
  </div>
</template>
<script>
import iconBox from '@/components/JNPF-iconBox'
import { addAbnoramlTypeData, updateAbnoramlTypeData, detailAbnoramlTypeData, checkAbnoramlTypeCode } from '@/api/abnormalManagement/index.js'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: { iconBox },
  mixins:[getProjectList],
  props: {
    parentId: {
      type: String,
      default: '-1'
    },
    category: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      iconBoxVisible: false,
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
      isProjectSwitch:'',
      projectIdData:[]
    }
  },
  computed: {
    openMode() {
      return this.btnType === 'add' ? '新建' : this.btnType === 'edit' ? '编辑' : '只读'
    }
  },
  created() {
  },
  methods: {
    async getProjectSwitch(code, type) {
      try {
        this.isProjectSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    handleDrawerClose(done) {
      done();
      this.$emit('refresh', true)
    },
    async getProject(){
      await this.getProjectSwitch('system', 'project')
      if (this.isProjectSwitch === '1') {
        await this.getProjectList()
        this.setDataFormItems()
      }
    },
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
          prop: "code", label: this.category === 'type' ? "类型编码" : '内容编码', value: "", type: "input",
          itemRules: [
            { required: true, trigger: "blur" },
            { validator: this.formValidate('enCode'), trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!value) { callback() }
                else if (this.dataForm.code === this.autoCode) { callback() }
                else {
                  checkAbnoramlTypeCode(value, (this.dataForm.id || '')).then((res) => {
                    if (!res.data) { callback() }
                    else { callback(new Error('此编码已存在')) }
                  }).catch((err) => { callback(new Error(" ")) })
                }
              },
              trigger: 'blur'
            }
          ], sm: this.category === 'type' ? 12 : 24, itemDisabled: this.btnType === 'look' ? true : this.codeConfig.codeWay == 'auto' && !this.codeConfig.modifyFlag ? true : false,
             mb:this.category === 'type' ? 0 : '15px'
        },
        // { prop: "module", label: "异常模块", value: "", type: "select", itemRules: [{ required: true, message: '异常模块不能为空', trigger: "change" }], 
        //   sm: 12,itemDisabled:this.btnType === 'look' ? true : false ,
        //   options: [{ label: '质量异常', value: 'quality' },{ label: '物料异常', value: 'material' },{ label: '生产异常', value: 'produce' },{ label: '设备异常', value: 'facility' }]
        // },
        {
          prop: "name", label: this.category === 'type' ? "类型名称" : '内容名称', value: "", type: "input", itemRules: [{ required: true, message: this.category === 'type' ? "类型名称" : '内容名称' + '不能为空', trigger: "blur" }],
          sm: this.category === 'type' ? 12 : 24, itemDisabled: this.btnType === 'look' ? true : false,mb:this.category === 'type' ? 0 : '15px'
        },
        {
          prop: "planPersonId", label: "处理人", value: '', type: "custom", customComponent:'UserSelect',itemRules:[{ required: true, message: '处理人不能为空', trigger: 'blur' }],
          sm: 24, itemDisabled: this.btnType === 'look' ? true : false,clearable:false,change:this.selectPlanPerson, render: this.category === 'type' ? false : true
        },
        {
          prop: "projectId", label: "所属项目", value: this.userInfo.projectId||'', type: "select",itemRules:[{ required: true, message: '所属项目不能为空', trigger: 'blur' }],
          sm: 24, itemDisabled: this.btnType === 'look' || this.projectId !== '1' ? true : false,clearable:false,options:this.projectIdData, render: this.isProjectSwitch === '1' ? true : false
        },
        {
          prop: "enName", label: "类型英文名称", value: "", type: "input", itemRules: [{ required: true, message: '类型英文名称不能为空', trigger: "blur" }],
          sm: 12, itemDisabled: this.btnType === 'look' ? true : false, render: this.category === 'type' ? true : false
        },
        {
          prop: "icon", label: "类型图标", value: "", type: "input", itemRules: [{ required: true, message: '类型图标不能为空', trigger: "click" }], clearable: false,
          sm: 12, itemDisabled: this.btnType === 'look' ? true : false, readonly: true, itemSlot: { position: 'append', click: this.openIconBox, content: '选择' }, suffixIcon: this.dataForm.icon,
          render: this.category === 'type' ? true : false
        },
        {
          prop: "remark", label: "类型说明", value: "", type: "textarea", itemRules: [{ required: true, message: '类型说明不能为空', trigger: "blur" }],
          sm: 24, itemDisabled: this.btnType === 'look' ? true : false, render: this.category === 'type' ? true : false
        },
      ]
          this.$nextTick(()=>{
            console.log("project",this.projectId);
            this.$refs.dataForm.setDefaultValue()
          })

    },
    selectPlanPerson(id,data){
      this.$nextTick(() => this.$refs['dataForm'].$children[0].validateField('planPersonId'))
      this.dataForm.planPersonId = data.id
      this.dataForm.planPersonName = data.fullName
    },
    openIconBox() {
      this.iconBoxVisible = true
    },
    choiceIcon(value) {
      this.dataForm.icon = value
      this.setDataFormItems()

    },
    clearData() {
      this.dataForm = {}
    },
    async init(id, btntype) {
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.visible = true
      this.btnType = btntype
      let code = this.category === 'type' ? 'ExceptionType' : 'ExceptionContent'
      this.$nextTick(() => {
        this.$refs['dataForm'].$children[0].resetFields()
        if (btntype == 'add') {
          this.dialogTitle = this.category === 'type' ? '新建异常类型' : '新建异常内容'
          this.clearData()
          this.fetchData(code, true)
          this.getProject()
          // this.setDataFormItems()
          // this.setLinesListItems()
          console.log(this.dataForm);

        } else {
          let projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
          detailAbnoramlTypeData(id,projectId).then(res => {
            this.dialogTitle = this.category === 'type' ? '编辑异常类型' : '编辑异常内容'
            this.dataForm = res.data.type
            // this.dataFormTwo = res.data.contentList
            this.loading = false
            // this.setDataFormItems()
            this.fetchData(code, false)
            this.getProject()
            // this.setLinesListItems()
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
      if (submitFlag) {
        let _data = {
          type: JSON.parse(JSON.stringify({ ...this.dataForm, category: this.category, parentId: this.parentId })),
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
  }
}
</script>
<style lang="scss" scoped>
.columnSettings-drawer {
  font-size: 16px;

  .JNPF-flex-main {
    overflow: hidden;

    ::v-deep .el-form-item--small.el-form-item {
      margin-bottom: 0px;
    }

    .column-list {
      height: 100%;
      padding: 8px 10px 0;
      ::v-deep .el-scrollbar__wrap{
        margin-bottom: 0px !important;
        overflow-x: hidden;
      }
    }

    .footer {
      margin: 4px 20px 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
::v-deep .el-scrollbar:hover>.el-scrollbar__bar {
    opacity: 0;
}
</style>

