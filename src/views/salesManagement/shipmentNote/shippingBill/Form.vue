<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')" content="创建报关单" />
        <div class="options" v-if="!btnType">
          <el-button type="primary" :loading="btnLoading" @click="submit()">{{ $t('common.submitButton') }}</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-collapse :value="['basicInfo', 'product']">
          <el-collapse-item title="基本信息" name="basicInfo" style="margin-top: 5px;">
            <JNPF-col v-model="dataForm" :tabContent="dataFormItem" ref="dataForm" :btnType="btnType" />
          </el-collapse-item>
          <el-collapse-item title="报关产品信息" name="product" style="margin-top: 5px;">
            <TableForm-product ref="TableFormTwo" :value="tableFormTwoList" @input="tableFormTwoValueChange"
              :tableItems="tableTwoItems" :btnType="btnType" @deleteth="" :hasToolbar="false">
            </TableForm-product>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </transition>
</template>

<script>
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue' // 附带产品多选的表格表单组件
export default {
  components: { TableFormProduct },
  data() {
    return {
      btnType: null,
      formLoading: false,
      btnLoading: false,
      dataForm: {},
      dataFormItem: [
        { prop: "orderNo", label: "报工单号", value: "", type: "input", sm: 8, itemDisabled: true },
        { prop: "processName", label: "工序名称", value: "", type: "input", sm: 8, itemDisabled: true },
        { prop: "processCode", label: "工序编码", value: "", type: "input", sm: 8, itemDisabled: true },
      ],
      tableFormTwoList: [],
      tableTwoItems: [
        { prop: 'orderNo', label: '分卡组别号', type: 'input', minWidth: '200', itemDisabled: true },
        {
          prop: 'productionQuantity', label: '计划数量', value: '', type: 'input', placeholder: '请输入计划数量', minWidth: '120',
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: [null, (errMsg, index) => { this.$message.error(`分卡信息第${index + 1}行：计划数量${errMsg}`) }], }), trigger: 'blur' },
            { required: true, trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', null, (errMsg, index) => { this.$message.error(`分卡信息第${index + 1}行：计划数量${errMsg}`) }), trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, null, (errMsg, index) => { this.$message.error(`分卡信息第${index + 1}行：计划数量${errMsg}`) }], }), trigger: 'blur' },
          ],
        },
        {
          prop: 'personId', label: '配置人员', value: [], type: 'multiple', minWidth: '200', options: () => this.personList.map(item => ({ label: item.personnelIdText, value: item.personnelId, })),
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: [null, (errMsg, index) => { this.$message.error(`分卡信息第${index + 1}行：配置人员${errMsg}`) }] }), trigger: 'change' },
            { required: true, trigger: 'change' },
          ],
        },
      ],
    }
  },
  methods: {
    init(id, btnType) {
      // this.formLoading = true
      this.btnType = btnType
      if(btnType){
      workReportDetail(id).then(res => {
        this.formLoading = false
        this.dataForm = res.data
      }).catch(() => {

      })
      } else {

      }
    },
    async submit() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断


      // 校验自定义属性
      let attributeForm = this.$refs['attributeLine'].$refs.main
      let valid_2 = await attributeForm.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.activeName = 'customAttribute'
        let formItems = attributeForm.fields
        this.jnpf.focusErrValidItem(attributeForm.fields)
      }

      // 校验表格表单（套筒属性）
      let sleeveForm = this.$refs['sleeveForm'].$refs.main
      let valid_3 = await sleeveForm.validate().catch(err => false)
      if (!valid_3 && submitFlag) {
        submitFlag = false
        this.activeName = 'sleeve'
        this.jnpf.focusErrValidItem(sleeveForm.fields)
      }

      // 判断条件后发送请求
      if (submitFlag) {
        const formMethod = this.dataForm.id ? updateProductData : addProductData

        let dataObj = {}
        formMethod(dataObj).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { msg = formMethod == addProductData ? "新建成功" : "修改成功" }
          this.$message.success(msg)
          this.$emit('close', true)
          this.visible = false
          this.btnLoading = false
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }

    },

    tableFormTwoValueChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.tableFormTwoList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.tableFormTwoList[dataOrIndex][prop] = value
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.main {
  padding: 0px 10px 10px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep #sleeve .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  height: calc(100% - 48px);

}

::v-deep .el-collapse-item__content {
  height: 100%;
}

.reportInfo ::v-deep .el-collapse-item__wrap {
  padding: 0;
}

::v-deep .el-collapse-item__content {
  padding: 10px
}
</style>
