<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="title" />
        <div class="options" v-if="btnType != '查看成品变更流程卡'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">

          <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <div
                    style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                    <h5>基本信息</h5>
                  </div>
                  <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="openMode" />
                </el-tab-pane>

              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { finishChangeList, delFinishChange, flowCardList, addFinishChange, updateFinishChange, detailFinishChange } from "@/api/productOrdes/index"
// import { getprodOrderList } from '@/api/productOrdes/finishedProductOrders'
import formValidate from "@/utils/formValidate";
export default {
  // components: { TableFormProduct },
  data() {
    return {
      flowCardList,
      activeName: "jcInfo",
      btnType: false,
      visible: true,
      btnLoading: false,
      formLoading: true,
      title: "",
      // 选择生产订单
      ProductListRequestObj: {
        createByName: "",
        demandType: " finish_product",
        endTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productionOrderNo: "",
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      ProductTableItems: [
        { prop: 'productionOrderNo', label: '生产订单号', fixed: 'left' },
        { prop: 'productName', label: '产品名称', fixed: 'left' },
        { prop: 'productCode', label: '产品编码', fixed: 'left' },
        { prop: 'productDrawingNo', label: '产品图号', fixed: 'left' },
      ],
      productionTableSearchList: [
        { prop: 'productionOrderNo', label: '生产订单号', type: 'input' },
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productName', label: '产品名称', type: 'input' },
      ],

      firstId: "",
      dataForm: {},
      documentStatus: "",
      dataFormItems: [

      ],

    }
  },
  created() {

  },
  watch: {
    // 'dataForm': {
    //   handler: function (newVal) {
    //     if (Number(newVal.newLeftCoreLength) && Number(newVal.newRightCoreLength) && Number(newVal.newCompressionElongation)) {
    //       newVal.newHoseLength = Number(newVal.totalLength) - Number(newVal.newLeftCoreLength) - Number(newVal.newRightCoreLength) - Number(newVal.newCompressionElongation)
    //     }
    //   },
    // }
  },
  methods: {
    refreach() {
      this.dataFormItems = [{ prop: "productionOrderNo", label: "成品流程卡", value: "", type: 'custom', customComponent: "ComSelect-page", itemRules: [{ required: true, message: '请选择成品流程卡', trigger: "blur" }], sm: 8, renderTree: false, dialogTitle: '选择生产订单号' },
      { prop: "productCode", label: "产品编码", value: "", type: 'input', sm: 8, readOnly: true, placeholder: ' ', itemDisabled: true },
      { prop: "productName", label: "产品名称", value: "", type: 'input', sm: 8, readOnly: true, placeholder: ' ', itemDisabled: true },
      { prop: "productDrawingNo", label: "产品图号", value: "", type: 'input', sm: 8, readOnly: true, placeholder: ' ', itemDisabled: true },
      { prop: "totalLength", label: "总成长", value: "", type: "input", sm: 8, readOnly: true, placeholder: ' ', itemDisabled: true },
      { prop: "leftCoreLength", label: "左芯子长", value: "", type: "input", sm: 8, readOnly: true, placeholder: ' ', itemDisabled: true },
      { prop: "rightCoreLength", label: "右芯子长", value: "", type: "input", sm: 8, readOnly: true, placeholder: ' ', itemDisabled: true },
      { prop: "compressionElongation", label: "扣压伸长量", value: "", type: "input", sm: 8, readOnly: true, placeholder: ' ', itemDisabled: true },
      { prop: "hoseLength", label: "软管净长", value: "", type: "input", sm: 8, readOnly: true, placeholder: ' ', itemDisabled: true },
      {
        prop: "newLeftCoreLength", label: "新左芯子长", value: "", type: "input", renderTree: this.dataForm.newLeftCoreLength ? true : false, sm: 8, change: this.changeNewLeftCoreLength,
        itemRules: [{ required: true, message: '', trigger: "blur" },
        { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { }] }), trigger: 'blur' },]
      },
      { prop: "newRightCoreLength", label: "新右芯子长", value: "", renderTree: this.dataForm.newRightCoreLength ? true : false, type: "input", sm: 8, change: this.changenewRightCoreLength, itemRules: [{ required: true, message: '', trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { }] }), trigger: 'blur' }] },
      { prop: "newCompressionElongation", label: "新扣压伸长量", value: "", type: "input", sm: 8, change: this.changenewnewCompressionElongation, itemRules: [{ required: true, message: '', trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { }] }), trigger: 'blur' }] },
      {
        prop: "newHoseLength", label: "新软管净长", value: "", type: "input", sm: 8, itemDisabled: true, itemRules: [
          { required: true, message: '新软管净长整数不能超过8位，小数不能超过2位', trigger: "blur" },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "新软管净长不能超过总成长且整数不能超过8位，小数不能超过2位", (errMsg) => { }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '新软管净长整数不能超过8位，小数不能超过2位', (errMsg) => { }), trigger: 'change' },
        ]
      },
      { prop: "applyReason", label: "申请理由", value: "", type: 'textarea', sm: 24, itemRules: [{ required: true, message: '请输入申请理由', trigger: "blur" }] },]
      this.dataFormItems.forEach(tc => {
        this.dataForm[tc.prop] = tc.value || ""; // 设置默认value
        // 添加自定义表单元素方法和参数
        if (tc.type == "custom") {
          // 若干需要选择的产品
          if (tc.prop === 'productionOrderNo') {
            tc.listMethod = flowCardList
            tc.listRequestObj = this.ProductListRequestObj
            tc.tableItems = this.ProductTableItems
            tc.searchList = this.productionTableSearchList
            tc.change = this.ProductChange
            tc.paramsObj = {}
          }
        }
      })
    },
    changeNewLeftCoreLength(val) {
      console.log(val);
      let newRightCoreLength =  Number(this.dataForm.newRightCoreLength) ? Number(this.dataForm.newRightCoreLength) : 0
      if (Number(val)) {
        this.dataForm.newHoseLength = Number(this.dataForm.totalLength) - Number(val) - newRightCoreLength - Number(this.dataForm.newCompressionElongation) - Number(this.dataForm.economize)
      }
    },
    changenewRightCoreLength(val) {
      console.log(val);
      let newLeftCoreLength =  Number(this.dataForm.newLeftCoreLength) ? Number(this.dataForm.newLeftCoreLength) : 0
      if (Number(val)) {
        this.dataForm.newHoseLength = Number(this.dataForm.totalLength) - newLeftCoreLength - Number(val) - Number(this.dataForm.newCompressionElongation) - Number(this.dataForm.economize)
      }
    },
    changenewnewCompressionElongation(val) {
      let newLeftCoreLength =  Number(this.dataForm.newLeftCoreLength) ? Number(this.dataForm.newLeftCoreLength) : 0
      let newRightCoreLength =  Number(this.dataForm.newRightCoreLength) ? Number(this.dataForm.newRightCoreLength) : 0
      if (Number(val)) {
        this.dataForm.newHoseLength = Number(this.dataForm.totalLength) - newLeftCoreLength - newRightCoreLength - Number(val)
      } else {
        // this.dataForm.newHoseLength
      }
    },
    init(id, btnType) {
      this.visible = true
      this.formLoading = true
      this.btnType = btnType
      this.dataForm.id = id
      this.refreach()
      if (this.dataForm.id) {
        this.title = btnType === 'look' ? '查看成品变更流程卡' : '编辑成品变更流程卡'
        // 获取详情
        detailFinishChange(this.dataForm.id).then(res => {
          this.formLoading = false
          console.log(res);
          this.dataForm = res.data.change
        })

      } else {
        this.title = '新建成品变更流程卡'
        this.formLoading = false
      }
    },
    ProductChange(id, data) {
      console.log(data);
      let list = data[0].all
      this.dataForm = list
      console.log(this.dataForm);
      this.dataForm.productionOrderId = list.productionOrderId
      this.dataForm.flowCardId = list.id
      if (this.title === '新建成品变更流程卡') {
        this.dataForm.id = ''
      }
      this.dataForm.newLeftCoreLength = this.dataForm.leftCoreLength
      this.dataForm.newRightCoreLength = this.dataForm.rightCoreLength
      this.dataForm.newCompressionElongation = this.dataForm.compressionElongation
      this.dataForm.newHoseLength = this.dataForm.hoseLength
      this.dataForm.applyReason = ''
      // this.refreach()
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true
      let submitFlag = true // 自动聚焦是否可用
      // 校验表单
      let form_1 = this.$refs['dataForm'].$children[0]
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && submitFlag) {
        // 校验失败，聚焦第一失败项，继续校验后续项
        if (submitFlag) {
          // 聚焦第一个失败的表单元素
          let formItems = form_1.$children[0].$children
          for (let j = 0; j < formItems.length; j++) {
            let formItem = formItems[j].$children[0].$children[0]
            if (formItem.validateState === 'error') {
              submitFlag = false
              this.jnpf.focusItem(formItem.$children[1].$el)
              this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
              break
            }
          }
        }
      }
      this.dataForm.documentStatus = submitModel
      const formMethod = this.dataForm.id ? updateFinishChange : addFinishChange

      let data = {
        change: this.dataForm
      }
      if (submitFlag) {
        formMethod(data).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }

    },


    goBack() {
      this.$emit('close')
    },

  },
  computed: {
    openMode() {
      return this.title === '新建成品变更流程卡' ? '新建' : this.title === '编辑成品变更流程卡' ? '编辑' : '只读'
    }
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
  padding: 10px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
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

.disabled-span {
  pointer-events: none;
  color: #999;
  /* 添加其他禁用样式 */
}
</style>