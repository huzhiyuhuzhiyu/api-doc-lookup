<template>
  <el-dialog :visible.sync="visible" fullscreen lock-scroll class="JNPF-full-dialog" :show-close="false" :modal="false">
    <div class="JNPF-full-dialog-header">
      <div class="header-title">
        <el-image class="header-logo imagesClass" :src="define.comUrl + systemVO.iconUrl"
          v-if="systemVO && systemVO.iconUrl">
          <template slot="error">
            <img class="header-logo" :class="headClass" src="@/assets/images/jnpf.png" alt="">
          </template>
        </el-image>
        <img src="@/assets/images/jnpf.png" :class="headClass" class="header-logo" v-else />
        <p class="header-txt"> · 系统异常模版</p>
      </div>
      <el-steps :active="activeStep" finish-status="success" simple class="steps steps2" v-if="!loading">
        <el-step title="基础设置" @click.native="stepChick(0)" />
        <el-step title="异常提醒设置" @click.native="stepChick(1)" />
      </el-steps>
      <div class="options" style="width:auto">
        <el-button size="mini" @click="prev" :disabled="activeStep <= 0">{{ $t('common.prev') }}</el-button>
        <el-button size="mini" @click="next" :disabled="activeStep >= 1 || loading" :loading="nextBtnLoading">
          {{ $t('common.next') }}
        </el-button>
        <el-button v-if="btnType !== 'look'" size="mini" type="primary" @click="dataFormSubmit()"
          :disabled="activeStep != 1" :loading="btnLoading">{{ $t('common.confirmButton') }}</el-button>
        <el-button size="mini" @click="closeDialog()">{{ $t('common.cancelButton') }}</el-button>
      </div>
    </div>
    <div class="main" v-loading="loading">
      <el-row type="flex" justify="center" align="middle" v-if="!activeStep" class="basic-box">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="10" class="basicForm">
          <JNPF-col :label-width="'120px'" :labelPosition="'left'" v-model="dataForm" :tabContent="dataFormItems"
            ref="dataForm" v-loading="loading" :btnType="btnType" />
          <el-button type="primary" @click="testSql">测试SQL</el-button>
        </el-col>
      </el-row>
      <template v-if="activeStep == 1">
        <AbnormalProcess ref="processDesign" :conf="flowTemplateJson" :flowType="0" :planPersonId="dataForm.planPersonId" :planPersonName="dataForm.planPersonName" />
      </template>
    </div>
    <el-dialog title="Cron表达式" :visible.sync="showCron" :close-on-click-modal="false"
      class="JNPF-dialog JNPF-dialog_center" lock-scroll append-to-body width="700px" @closed="showCrontab = false">
      <vcrontab ref="vcrontab" @hide="showCron = false" @fill="crontabFill" :expression="dataForm.cron"
        :hideComponent="['second']" v-if="showCrontab" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCron = false">{{ $t('common.cancelButton') }}
        </el-button>
        <el-button type="warning" @click="resetCrontab">重 置</el-button>
        <el-button type="primary" @click="getCrontabValue">{{ $t('common.confirmButton') }}
        </el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { checkSystemCode, checkSystemValidSql, updateSystemData, addSystemAbnoramlData, detailSystemAbnoram } from '@/api/abnormalManagement/index.js'
import { mapState } from 'vuex'
import vcrontab from "vcrontab"
import AbnormalProcess from '@/components/AbnormalProcess'
export default {
  components: { vcrontab, AbnormalProcess},
  data() {
    return {
      showCron: false,
      showCrontab: true,
      visible: false,
      loading: false,
      sqlFlag: false,
      nextBtnLoading: false,
      activeStep: 0,
      dataForm: {
        code: "",
        cron: "",
        executionSql: "",
        id: '',
        name: "",
        remark: "",
        planPersonId:'',
        planPersonName:'',
      },
      dataFormItems: [],
      btnType: "",
      btnLoading: false,
      flowTemplateJson: {},
      codeConfig: {},
      orderConfig: {},
      flowEngine: null
    }
  },
  computed: {
    ...mapState({
      headClass: state => state.settings.headClass,
    }),
    sysConfig() {
      return this.$store.state.settings.sysConfig
    },
    systemVO() {
      return this.$store.state.settings.systemVO
    },
  },
  created() {
  },
  methods: {
    setDataFormItems() {
      this.dataFormItems = [
        {
          prop: "code", label: "异常编码", value: "", type: "input",
          itemRules: [
            { required: true, trigger: "blur" },
            { validator: this.formValidate('enCode'), trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (!value) { callback() }
                else if (this.dataForm.code === this.autoCode) { callback() }
                else {
                  checkSystemCode(value, (this.dataForm.id || '')).then((res) => {
                    if (!res.data) { callback() }
                    else { callback(new Error('此异常编码已存在')) }
                  }).catch((err) => { callback(new Error(" ")) })
                }
              },
              trigger: 'blur'
            }
          ], sm: 24, itemDisabled: this.btnType === 'look' ? true : this.codeConfig.codeWay == 'auto' && !this.codeConfig.modifyFlag ? true : false
        },
        {
          prop: "name", label: "异常名称", value: "", type: "input", itemRules: [{ required: true, message: '异常名称不能为空', trigger: "blur" }],
          sm: 24, itemDisabled: this.btnType === 'look' ? true : false
        },
        {
          prop: "planPersonId", label: "处理人", value: '', type: "custom", customComponent:'UserSelect',itemRules:[{ required: true, message: '处理人不能为空', trigger: 'blur' }],
          sm: 24, itemDisabled: this.btnType === 'look' ? true : false,clearable:false,change:this.selectPlanPerson
        },
        { prop: "cron", label: "执行周期", value: "", type: "input", itemSlot: { position: 'append', content: '执行周期', click: this.showDialog }, sm: 24, itemDisabled: this.btnType === 'look' ? true : false, itemRules: [{ required: true, message: '执行周期不能为空', trigger: 'click' }] },
        { prop: "remark", label: "异常说明", value: "", type: "textarea", sm: 24, rows: '4', itemDisabled: this.btnType === 'look' ? true : false },
        {
          prop: "executionSql", label: "执行SQL", value: "", type: "textarea", sm: 24, rows: '6', itemDisabled: this.btnType === 'look' ? true : false,
          itemRules: [
            { required: true, trigger: "blur" },
            {
              validator: (rule, value, callback) => {
                let data = {
                  executionSql: value
                }
                if (!value) { callback() }
                else {
                  checkSystemValidSql(data).then((res) => {
                    if (!res.data) { callback() }
                    else { callback(new Error('此执行SQL不合法，请检查SQL')) }
                  }).catch((err) => { callback(new Error(" ")) })
                }
              },
              trigger: 'blur'
            }
          ],resize:"vertical"
        },

      ]
    },
    selectPlanPerson(id,data){
      this.$nextTick(() => this.$refs['dataForm'].$children[0].validateField('planPersonId'))
      this.dataForm.planPersonId = data.id
      this.dataForm.planPersonName = data.fullName
    },
    testSql() {
      if (!this.dataForm.executionSql) return this.$message.warning('请先填写SQL')
      let data = { executionSql: this.dataForm.executionSql }
      checkSystemValidSql(data).then((res) => {
        if (!res.data) { 
          this.$message.success('此执行SQL合法') 
          this.sqlFlag = true
        }
        else { 
          this.$message.error('此执行SQL不合法，请检查SQL') 
          this.sqlFlag = false
        }
      }).catch((err) => { this.sqlFlag = false })
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
    getCrontabValue() {
      this.$refs.vcrontab && this.$refs.vcrontab.submitFill()
    },
    resetCrontab() {
      this.$refs.vcrontab && this.$refs.vcrontab.clearCron()
    },
    crontabFill(value) {
      this.dataForm.cron = value
    },
    showDialog() {
      this.showCron = true
      this.showCrontab = true
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      this.visible = true

      this.$nextTick(() => {
        console.log(this.$refs['dataForm']);
        this.$refs['dataForm'].$children[0].resetFields()
        if (btnType == 'add') {
          this.dialogTitle = '新建异常'
          this.fetchData('ExceptionType', true)
        } else {
          detailSystemAbnoram(id).then(res => {
            this.dialogTitle = `编辑异常`
            this.dataForm = res.data.exception
            res.data.flowEngine && (this.flowTemplateJson = JSON.parse(res.data.flowEngine.flowTemplateJson))
            this.flowEngine = res.data.flowEngine
            this.loading = false
            this.fetchData('ExceptionType', false)
          }).catch(error => { })
        }
      })
    },
    dataFormSubmit() {
      this.$refs['processDesign'].getData().then(res => {
        this.btnLoading = true
        this.flowTemplateJson = JSON.stringify(res.formData)
        let _data = {
          exception: this.dataForm,
          flowEngine: this.flowEngine ? { ...this.flowEngine, flowTemplateJson: this.flowTemplateJson } : {
            busCallBack: "AbApplyRecordCallback",
            category: "exception",
            flowTemplateJson: this.flowTemplateJson,
            enCode: this.dataForm.code,
            formType: 5,
            fullName: this.dataForm.name,
          }
        }
        const formMethod = this.dataForm.id ? updateSystemData : addSystemAbnoramlData
        formMethod(_data).then((res) => {
          this.$message({
            message: this.dataForm.id ? '编辑成功' : '新建成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
              this.visible = false
              this.$emit('close', true)
            }
          })
        }).catch(() => { this.btnLoading = false })
      }).catch(err => {
        err.msg && this.$message.warning(err.msg)
      })
    },
    next() {
      if (this.activeStep < 1) {
        this.$refs['dataForm'].$children[0].validate((valid)=>{
          if (valid){
            this.activeStep += 1
            this.nextBtnLoading = false
          }else{
            this.nextBtnLoading = false
          }
        })
    
      }
    },
    closeDialog(isRefresh) {
      this.visible = false
      this.$emit('close', isRefresh)
    },
    prev() {
      this.activeStep -= 1
    },
    stepChick(key) {
      if (this.activeStep <= key) return
      this.activeStep = key
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .pop_btn {
  display: none;
}
</style>