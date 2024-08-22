<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType === 'add' ? '批量设置检验方式' : '查看产品检验明细'" />
        <div class="options" v-if="!btnType">
          <el-button type="primary" :loading="btnLoading" @click="handleBatchConfirm()">
            {{ $t('common.submitButton') }}
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div style="padding: 10px;">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
            <el-form v-loading="formLoading" ref="dataForm" :model="dataForm" label-width="120px" label-position="top"
              :rules="dataFormRules">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="检验方式" prop="inspectionMethod">
                    <el-select v-model="dataForm.inspectionMethod" placeholder="请选择检验方式"
                      @change="inspectionMethodChange" :disabled="btnType === 'look'" style="width: 100%;">
                      <el-option v-for="o in inspectionMethodList" v-bind="o" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item title="抽检规则" name="productInfo" v-if="spotCheckFlag">
            <template>
              <JNPF-col-table v-model="linesForm" ref="linesForm" :tableItems="linesFormItems" :btnType="btnType"
                @addth="addth" @deleteth="deleteth" />
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </transition>
</template>
<script>
import { batchSetProducts, detailInspectionLine } from '@/api/basicData/materialFiles'
export default {
  props: {
    selectedData: {}
  },
  data() {
    return {
      btnType: '',
      formLoading: false,
      activeNames: ['productInfo', 'basicInfo'],
      visible: true,
      /**主表数据 */
      dataForm: {},
      dataFormRules: {
        inspectionMethod: [{ required: true, message: '请选择检验方式', trigger: 'change' }]
      },
      inspectionMethodList: [
        { label: '免检', value: 'exempt' },
        { label: '抽检', value: 'spot_check' },
        { label: '全检', value: 'all' }
      ],
      btnLoading: false,
      /**子表数据 */
      linesForm: [],
      linesFormItems: [],
      startSymbolList: [
        // {
        //   label: '等于',
        //   value: 'eq'
        // },
        // {
        //   label: '大于等于',
        //   value: 'ge'
        // },
        // {
        //   label: '大于',
        //   value: 'gt'
        // },
        {
          label: '小于等于',
          value: 'le'
        }, {
          label: '小于',
          value: 'lt'
        }
      ],
      endSymbolList: [
        // {
        //   label: '等于',
        //   value: 'eq'
        // },
        // {
        //   label: '大于等于',
        //   value: 'ge'
        // },
        // {
        //   label: '大于',
        //   value: 'gt'
        // },
        {
          label: '小于等于',
          value: 'le'
        }, {
          label: '小于',
          value: 'lt'
        }
      ],
      samplingMethodList: [
        // {
        //   label: '等于',
        //   value: 'eq'
        // },
        // {
        //   label: '大于等于',
        //   value: 'ge'
        // },
        // {
        //   label: '大于',
        //   value: 'gt'
        // },
        {
          label: '按总数比例',
          value: 'proportion'
        }, {
          label: '固定抽检数',
          value: 'fixed_quantity'
        }
      ],
    }
  },
  computed: {
    /**表单检验方式是否为抽检 */
    spotCheckFlag() {
      return this.dataForm.inspectionMethod === 'spot_check'
    }
  },
  created() {
    this.refreshLinesFormItems()
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id, btnType) {
      console.log(id, btnType)
      this.btnType = btnType
      this.formLoading = true
      if (id) {
        detailInspectionLine(id)
          .then((res) => {
            this.$set(this.dataForm, 'inspectionMethod', res.data.inspectionMethod)
            res.data.rulesList &&
              (this.linesForm = res.data.rulesList.map((line) => ({
                ...line,
                inspectionQuantity: '？',
                samplingRatio: line.samplingRatio + (line.samplingMethod === 'proportion' ? '%' : '')
              })))
            this.formLoading = false
            // this.$nextTick(() => this.$refs.dataForm.validate())
          })
          .catch((err) => {
            this.formLoading = false
          })
      } else {
        this.formLoading = false
      }
    },
    /**刷新子表结构 */
    refreshLinesFormItems() {
      this.linesFormItems = [
        {
          prop: 'startVal',
          label: '起始值',
          type: 'input',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '',
                  (errMsg, index) => {
                    this.$message.error(`抽检规则第${index + 1}行：起始值${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
            {
              validator: this.formValidate({
                type: 'decimal',
                params: [
                  20,
                  4,
                  '',
                  (errMsg, index) => {
                    this.$message.error(`抽检规则第${index + 1}行：起始值${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ]
        },
        {
          prop: 'startSymbol',
          label: '起始比较符号',
          type: 'select',
          options: this.startSymbolList,
          clearable: false,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '',
                  (errMsg, index) => {
                    this.$message.error(`抽检规则第${index + 1}行：起始比较符号${errMsg}`)
                  }
                ]
              }),
              trigger: 'change'
            },
            { required: true, trigger: 'change' }
          ]
        },
        { prop: 'inspectionQuantity', label: '报检数量', type: 'view', width: 90, itemDisabled: true, clearable: false, },
        {
          prop: 'endSymbol',
          label: '终止比较符号',
          type: 'select',
          options: this.endSymbolList,
          clearable: false,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '',
                  (errMsg, index) => {
                    this.$message.error(`抽检规则第${index + 1}行：终止比较符号${errMsg}`)
                  }
                ]
              }),
              trigger: 'change'
            },
            { required: true, trigger: 'change' }
          ]
        },
        {
          prop: 'endVal',
          label: '终止值',
          type: 'input',
          itemRules: [
            // { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`抽检规则第${index + 1}行：终止值${errMsg}`) }] }), trigger: 'blur' },
            // { required: true, trigger: "blur" },
            {
              validator: this.formValidate({
                type: 'decimal',
                params: [
                  20,
                  4,
                  '',
                  (errMsg, index) => {
                    this.$message.error(`抽检规则第${index + 1}行：终止值${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [
                  (rowIndex, value) => {
                    if (value === '') return true
                    return Number(this.linesForm[rowIndex].endVal) >= Number(this.linesForm[rowIndex].startVal)
                  },
                  '不能低于对应起始值',
                  (errMsg, index) => {
                    this.$message.error(`抽检规则第${index + 1}行：终止值${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            }
          ]
        },
        {
          prop: 'samplingMethod',
          label: '方式',
          type: 'select',
          options: this.samplingMethodList,
          change: this.samplingMethodChange,
          clearable: false,
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '',
                  (errMsg, index) => {
                    this.$message.error(`抽检规则第${index + 1}行：起始比较符号${errMsg}`)
                  }
                ]
              }),
              trigger: 'change'
            },
            { required: true, trigger: 'change' }
          ]
        },
        {
          prop: 'samplingRatio',
          label: '抽检比例或数量',
          type: 'input',
          placeholder: '请输入',
          itemRules: [
            {
              validator: this.formValidate({
                type: 'noEmtry',
                params: [
                  '',
                  (errMsg, index) => {
                    this.$message.error(`抽检规则第${index + 1}行：抽检比例或数量${errMsg}`)
                  }
                ]
              }),
              trigger: 'blur'
            },
            { required: true, trigger: 'blur' },
            { validator: this.checkSamplingRatio, trigger: 'blur' }
          ]
        }
      ]
    },
    inspectionMethodChange(val) {
      // 检验方式抽检，必须设置抽检比例
      // this.dataFormRules.startVal[0].required = this.spotCheckFlag
      // this.dataFormRules.startSymbol[0].required = this.spotCheckFlag
      // this.dataFormRules.endSymbol[0].required = this.spotCheckFlag
      // this.dataFormRules.endVal[0].required = this.spotCheckFlag
    },
    samplingMethodChange(val, data) {
      console.log(val, data, 'ppppp')
    },

    // 批量处理提交
    async handleBatchConfirm() {
      this.btnLoading = true
      let submitFlag = true

      const form = this.$refs.dataForm
      const valid = await form.validate().catch((err) => false)
      if (!valid) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form.fields)
      }

      if (this.spotCheckFlag) {
        if (!this.linesForm.length && submitFlag) {
          submitFlag = false
          this.$message.error('抽检至少需要添加一条抽检规则！')
        }

        const form_2 = this.$refs.linesForm.$refs.main
        const valid_2 = await form_2.validate().catch((err) => false)
        if (!valid_2 && submitFlag) {
          submitFlag = false
          this.jnpf.focusErrValidItem(form_2.fields)
        }
      }

      // 判断区间范围是否重复
      if (submitFlag) {
        let inspLineList = this.linesForm.map((line) => ({
          ...line,
          endVal:
            line.endVal !== '' && line.endVal !== null && line.endVal !== undefined ? line.endVal : 999999999999999
        }))
        let errIndex, errIndex2
        errIndex = inspLineList.findIndex((line, i) => {
          errIndex2 = inspLineList.findIndex((line2, i2) => {
            let flag2
            if (i2 > i) {
              const startValSameFlag =
                eval(
                  `Number(line2.startVal) ${line2.startSymbol} Number(line.startVal) && Number(line.startVal) ${line2.endSymbol
                  } Number(line2.endVal)`
                ) && line.startSymbol.indexOf('=') !== -1
                  ? true
                  : line.startVal == line2.startVal
              const endValSameFlag =
                eval(
                  `Number(line2.startVal) ${line2.startSymbol} Number(line.endVal) && Number(line.endVal) ${line2.endSymbol
                  } Number(line2.endVal)`
                ) && line.endSymbol.indexOf('=') !== -1
                  ? true
                  : line.endVal == line2.endVal
              if (startValSameFlag || endValSameFlag) flag2 = true
            }
            return flag2
          })

          return errIndex2 !== -1
        })
        if (errIndex !== -1) {
          this.$message.error(`抽检规则第${errIndex + 1}行和第${errIndex2 + 1}行的区间范围有重，请检查后提交！`)
          submitFlag = false
        }
      }

      if (submitFlag) {
        let rulesList = []
        if (this.spotCheckFlag) {
          rulesList = this.linesForm.map((line) => ({
            ...line,
            productsId: line.id,
            samplingMethod: line.samplingRatio.indexOf('%') !== -1 ? 'proportion' : 'fixed_quantity', // 抽检方式;按总数比例 proportion、固定抽检数fixed_quantity
            samplingRatio: line.samplingRatio.replace('%', '')
          }))
        }
        let _data = this.selectedData.map((item) => ({
          productsId: item.id,
          inspectionMethod: this.dataForm.inspectionMethod,
          rulesList
        }))
        console.log(_data, 'daaaa')
        batchSetProducts(_data)
          .then((res) => {
            this.$message.success('操作成功')
            // this.selectedData = []
            // this.$refs.dataTable.$refs.JNPFTable.clearSelection()
            // this.visible = false
            // this.btnLoading = false
            // this.visible = false
            this.$emit('close', true)
          })
          .catch((err) => {
            this.btnLoading = false
          })
      } else {
        this.btnLoading = false
      }
    },
    /**抽检比例校验规则 */
    checkSamplingRatio(rule, value, callback) {
      if (value == '0') return callback()
      function getIndex(rule) {
        let temp = rule.field.match(/\d+/)
        return temp ? Number(temp[0]) : undefined
      }
      function judgeSampling(line) {
        const { samplingRatio, startVal, startSymbol, endSymbol } = line
        // samplingRatio最大可以输入startVal
        return Number(samplingRatio) < Number(startVal)
        // if (startSymbol === '<') return Number(samplingRatio) <= Number(startVal)
        // else return Number(samplingRatio) < Number(startVal)

        // const endVal = line.endVal || 999999999999999
        // let startFlag = eval(`Number(samplingRatio) ${startSymbol.replace('<', '>')} Number(startVal)`)
        // let endFlag = eval(`Number(samplingRatio) ${endSymbol} Number(endVal)`)
        // return startFlag && endFlag
      }
      const index = getIndex(rule)
      let errMsg
      if (value && value.indexOf('%') !== -1 && !/^([0-9]\d{0,1}|100[%]{1}$)(\.\d{1,2})?%?$/.test(value)) {
        errMsg = '比例只能输入0%-100%以内的值，最多保留两位小数！'
      } else if (value.indexOf('%') === -1 && !/^(0|[1-9](\d{0,15}))((.\d{1,4})?)$/.test(value)) {
        errMsg = '具体数量请输入正数，小数不能超过4位！'
      } else if (value.indexOf('%') === -1 && Number(value) > Number(this.linesForm[index].startVal)) {
        errMsg = '具体数量不能超过起始值！'
      }
      if (errMsg) {
        this.$message.error(`抽检规则第${index + 1}行：抽检比例或数量 ${errMsg}`)
        callback(new Error(errMsg))
      } else callback()
    },
    // 新增子表行
    addth() {
      // let index = this.linesForm.length
      this.linesForm.push({
        // index,
        startVal: '',
        startSymbol: 'le',
        inspectionQuantity: '？',
        endSymbol: 'le',
        endVal: '',
        samplingRatio: ''
      })
    },
    // 删除子表行
    deleteth(row, index) {
      this.linesForm.splice(row.$index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
