<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form" ref="main">

      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')" :content="title" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            {{ $t('common.submitButton') }}
          </el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <div class="subtitle">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="itemRules" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="12" :xs="24">
                    <el-form-item label="模板名称" prop="templateName">
                      <el-select v-model="dataForm.templateName" placeholder="请选择模板名称" style="width: 100%;" @change="changeclick" :disabled="btnType == 'look'">
                        <el-option v-for="(item, index) in templateList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="对象类型" prop="objectType">
                      <el-select v-model="dataForm.objectType" placeholder="请选择对象类型" style="width: 100%;" @change="changeobjectType" :disabled="btnType == 'look'">
                        <el-option v-for="(item, index) in optionsobjectType" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <div style="margin: 10px 0;width: 300px;" v-if="!!src">
                    <el-image :src="require(`./image/${src}.jpg`)">
                    </el-image>
                  </div>
                </el-col>
              </el-row>
            </el-form>
            <!-- <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :btnType="btnType" /> -->
            <div class="subtitle">
              <h5>{{ dataForm.objectType === 'custom' ? '客户' : '生产订单' }}信息</h5>
            </div>
            <TableForm :value="linesList" @input="contentChanges" ref="linesForm" :tableItems="linesListItems"
              :btnType="btnType" @addth="addOrDelLinesItem" @deleteth="addOrDelLinesItem" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import TableForm from './TableForm.vue'
import {
  addOrUpdateBatchLPTData,
  detailLabelPrintTemplateData
} from '@/api/basicData/index.js'
export default {
  components: { TableForm },
  beforeCreate() {
    this.templateList = [
      { label: '模板1', value: 'lt1' },
      { label: '模板2', value: 'lt2' },
      { label: '模板3', value: 'lt3' }
    ]
  },
  data() {
    return {
      src: '',
      optionsobjectType:[{ label: '客户', value: 'custom' }, { label: '生产订单', value: 'produce_order' }],
      title: "",
      btnType: "",
      btnLoading: false,
      formLoading: true,
      dataForm: {
        code:'',
        name:'',
        templateName:'',
        objectType:''
      },
      itemRules:{
        templateName: [
          { required: true, message: '模板名称不能为空', trigger: 'change' }
        ],
        objectType: [
          { required: true, message: '对象类型不能为空', trigger: 'change' }
        ]
      },
      dataFormItems: [{ // 模板名称
        prop: "templateName",
        label: "模板名称",
        value: undefined,
        type: "select",
        options: this.templateList,
        itemRules: [{ required: true, trigger: "change" }],
        sm: 12,
        change: (val) => {
          this.dataForm.code = val
          this.dataForm.name = this.templateList.find(item => item.value === val).label
        }
      },
      { // 对象类型
        prop: "objectType",
        label: "对象类型",
        value: 'custom',
        type: "select",
        options: [{ label: '客户', value: 'custom' }, { label: '生产订单', value: 'produce_order' }],
        itemRules: [{ required: true, trigger: "change" }],
        sm: 12,
        clearable: false,
        change: (val) => {
          this.linesList = []
          this.refeshLinesListItems()
        }
      }],

      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
    }
  },
  methods: {
    changeclick(val){
      this.src = val
      this.dataForm.code = val
      this.dataForm.name = this.templateList.find(item => item.value === val).label
    },
    changeobjectType(){
      this.linesList = []
      this.refeshLinesListItems()
    },
    refeshLinesListItems() {
      if (this.dataForm.objectType === 'custom') {
        this.linesListItems = [
          { // 客户编码
            prop: "code",
            label: '客户编码',
            value: '',
            type: "view",
          },
          { // 客户名称
            prop: "name",
            label: '客户名称',
            value: '',
            type: "view",
          },
        ]
      } else {
        this.linesListItems = [
          { // 生产订单号
            prop: "orderNo",
            label: '生产订单号',
            type: "view",
            minWidth: 200
          },
          { // 工作令号
            prop: "workOrderNo",
            label: '工作令号',
            type: "view",
          },
          { // 产品编码
            prop: "productCode",
            label: '产品编码',
            type: "view",
          },
          { // 产品名称
            prop: "productName",
            label: '产品名称',
            type: "view",
          },
          { // 产品图号
            prop: "productDrawingNo",
            label: '产品图号',
            type: "view",
            minWidth: 300
          },
        ]
      }
      this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() })
    },
    init(id, btnType) {
      this.btnType = btnType
      this.formLoading = false
      this.dataForm.objectType = 'custom'
      this.title = '新建标签打印模板'
      this.refeshLinesListItems()
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用

      const form_1 = this.$refs.dataForm
      const valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      const form_2 = this.$refs.linesForm.$refs.main
      const valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      // 判断子表是否有效
      if (!this.linesList.length && submitFlag) {
        submitFlag = false
        if (this.dataForm.objectType === 'custom') {
          this.$message.error('请至少选择一个客户')
        } else {
          this.$message.error('请至少选择一个生产订单')
        }
      }

      if (submitFlag) {
        let dataObj = this.linesList.map(line => {
          return {
            code: this.dataForm.code,
            name: this.dataForm.name,
            objectType: this.dataForm.objectType,
            objectId: line.id,
            templateType:'cutting'
          }
        })
        // console.log(dataObj);
        // this.btnLoading = false
        // return
        addOrUpdateBatchLPTData(dataObj).then(res => {
          this.$message.success('新建成功')
          this.$emit('close', true)
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }

    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let paramType = Array.isArray(data) ? 'Array' : 'Object'
      if (paramType === 'Object') {
        this.linesList.splice(data.$index, 1)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.linesList))
        let hasItemList = []
        if (this.dataForm.objectType === 'custom') {
          for (let i = 0; i < data.length; i++) {
            let item = data[i]
            const hasFlag = this.linesList.find(i => item.id === i.id)
            if (hasFlag) { hasItemList.push(item.name) }
            else { tempList.push(item) }
            if (hasItemList.length) this.$message.error(`已经存在的客户：${hasItemList.join('、')}`)
          }
        } else {
          for (let i = 0; i < data.length; i++) {
            let item = data[i]
            const hasFlag = this.linesList.find(i => item.id === i.id)
            if (hasFlag) { hasItemList.push(item.orderNo) }
            else { tempList.push(item) }
            if (hasItemList.length) this.$message.error(`已经存在的生产订单：${hasItemList.join('、')}`)
          }
        }
        this.linesList = tempList.map(item => { return { ...item } })
        // this.$nextTick(() => { this.$refs.linesForm.setDefaultValue() });
      }
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.linesList[dataOrIndex][prop] = value
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.contain {
  position: relative;
  height: calc(100% - 47px);
  overflow-y: auto;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px 30px;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}
</style>