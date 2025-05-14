<!-- <template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px" @close="$emit('close')">
    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" v-loading="formLoading"
      :openMode="openMode" />
    <span slot="footer" class="dialog-footer" v-show="!readOnly">
      <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
      <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
    </span>
  </el-dialog>1
</template> -->
<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', !readOnly ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')" :content="title" />
        <div class="options" v-if="!readOnly">
          <el-button  size="mini" type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button  size="mini" type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button  size="mini" @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
         <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" v-if="!approvalFlag" @tab-click="handleClick" >
          <el-tab-pane label="基础信息" name="orderInfo" >
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" v-loading="formLoading"
                        :openMode="openMode" />
              </el-collapse-item>
         
            </el-collapse>
          </el-tab-pane>
     
         <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
            <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'">
            </UploadWj>
          </el-tab-pane>
        </el-tabs>
     
      </div>
      <div class="main" v-loading="formLoading">
     
      </div>
    </div>
  </transition>
</template>
  
<script>
import { addPFIData, updatePFIData, detailPFIDatalist } from '@/api/inspectionManagement/productionFirstInspection'
import { getWorkList } from "@/api/productOrdes/index"
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeNames: ["basicInfo",],
      datafilelist: [],
      activeName: 'orderInfo',
      title: "",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {},
      readOnly: false,
      dataFormItems: [],
      dialogListRequestObj: {
        firstInspection: true,
        processInspectCanFlag: localStorage.getItem('sys').includes('jz'), // 是否展示已经完工的工单
        processName: "",
        productName: "",
        productionOrderNo: "",
        workOrderNo: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }]
      }, // 弹出框列表请求参数
      dialogTableItems: [
        { prop: 'orderNo', label: '工单号', minWidth: 200 },
        { prop: 'productCode', label: '产品编码' },
        { prop: 'productName', label: '产品名称' },
        { prop: 'productDrawingNo', label: '产品图号', minWidth: 200 },
        { prop: 'processCode', label: '工序编码' },
        { prop: 'processName', label: '工序名称' },
        { prop: 'dispatchedQuantity', label: '派工数量' },
        { prop: 'productionOrderNo', label: '生产订单号', minWidth: 200 },
        // { prop: 'workOrderNo', label: '工作令号', minWidth: 200 },
        { prop: 'firstInspectionStatus', label: '上次首检结果' },
        { prop: 'firstInspectionDate', label: '上次首检时间', width: 180 },
      ], // 弹出框表单展示字段
      dialogTableSearchList: [
        { prop: "orderNo", label: "工单号", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "productDrawingNo", label: "产品图号", type: 'input' },
        { prop: "processName", label: "工序名称", type: 'input' },
        { prop: "productionOrderNo", label: "生产订单号", type: 'input' },
        { prop: "workOrderNo", label: "工作令号", type: 'input' },
      ], // 弹出框搜索条件
    }
  },
  created() {
    this.setDataFormItems()
  },
  watch: {
    visible(val) {
      // !val ? this.$emit('close') : ""
    },
  },
  methods: {
    setDataFormItems() {
      this.dataFormItems = [
        {
          prop: "workOrder", label: "工单", value: "", type: "custom", customComponent: "ComSelect-page", itemRules: [{ required: true, trigger: "change" }], renderTree: false, sm: 12,
          dialogTitle: "选择工单", listMethod: getWorkList, listRequestObj: this.dialogListRequestObj, tableItems: this.dialogTableItems, searchList: this.dialogTableSearchList,
          change: this.workOrderChange, listDataFormatting: this.dialogListDataFormatting
        },
        { prop: "inspectorId", label: "检验员", value: "", type: "custom", customComponent: "user-select", itemRules: [{ required: true, trigger: "change" }], change: this.inspectorIdChange, sm: 12 },
        { prop: "inspectionResults", label: "检验结果", value: "", type: "select", options: [{ label: "通过", value: "1" }, { label: "未通过", value: "0" }], change: this.resultsChange, itemRules: [{ required: true, trigger: "blur" }], sm: 12 },
        { prop: "firstInspectionDate", label: "首检日期", value: this.jnpf.getToday(), type: "date", pickerOptions: this.global.timePicker, itemRules: [{ required: true, trigger: "change" }], sm: 12 },
        { prop: "problemDescription", label: "问题描述", value: "", type: "textarea", itemRules: [] },
      ]
    },
    init(row, readOnly,businessCode) {
      this.visible = true
      this.readOnly = readOnly
      this.formLoading = true
      this.dialogListRequestObj.businessCode = businessCode
      if (row) {
        this.dataForm = { ...row,businessCode }
        this.title = this.readOnly ? '查看首检记录' : '编辑首检记录'
        detailPFIDatalist(row.id).then(res => {
          this.formLoading = false
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push(
                {
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                }
              )
            })
          }
        })
      } else {
        this.title = '新建首检记录'
        this.formLoading = false
      }
      this.dataForm.businessCode = businessCode
      this.dataForm.inspectorId = this.dataForm.inspectorId ? this.dataForm.inspectorId : this.userInfo.userId
      // this.$nextTick(() => {
      //   if (row) {
      //     this.dataForm = { ...row }
      //     this.title = this.readOnly ? '查看首检记录' : '编辑首检记录'
      //     this.formLoading = false
      //     // detailPFIData(this.dataForm.id).then(res => {
      //     //   this.dataForm = res.data
      //     //   this.formLoading = false
      //     // })
      //   } else {
      //     this.title = '新建首检记录'
      //     this.formLoading = false
      //   }
      // })
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true;
      let focusFlag = true
      let form = this.$refs['dataForm'].$children[0]
      let valid_1 = await form.validate().catch(err => false)
      if (!valid_1 && focusFlag) {
        let formItems = form.$children[0].$children
        formItems.some(item => {
          let formItem = item.$children[0].$children[0]
          if (formItem.validateState === 'error') {
            focusFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }
      if (focusFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: '',
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        this.dataForm.attachmentList = this.datafilelist
        let formMethod = this.dataForm.id ? updatePFIData : addPFIData;
        this.dataForm.documentStatus = submitModel
        formMethod(this.dataForm).then(res => {
          let msg = formMethod == updatePFIData ? '修改成功' : '新建成功'
          this.visible = false
          this.$emit('close', true)
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
            }
          })
        }).catch(err => { this.btnLoading = false })
      } else {
        this.btnLoading = false
      }
    },
    workOrderChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].$refs.main.validateField('workOrder') })
      if (!data || !data.length) {
        this.dataForm.workOrderId = ''
        this.dataForm.workOrder = ''
      } else {
        this.dataForm.workOrderId = data[0].all.id
        this.dataForm.workOrder = data[0].all.orderNo
      }
    },
    inspectorIdChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].$refs.main.validateField('inspectorId') })
    },
    resultsChange(e) {
      const item = this.dataFormItems.find(o => o.prop === "problemDescription")
      if (e == 0) { item.itemRules = [{ required: true, trigger: 'blur' }] }
      else { item.itemRules = [] }
    },
    dialogListDataFormatting(res) {
      let list = res.data.records.map(item => {
        item.firstInspectionStatus = item.firstInspectionStatus ? '通过' : '不通过';
        return item;
      });
      return list
    }
  },
  computed: {
    openMode() {
      return this.title.includes("新建") ? '新建' : this.title.includes("编辑") ? '编辑' : '只读'
    },
    ...mapGetters(['userInfo']),
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  /* // background: #dcdfe6; */
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  /* // border-bottom:none; */
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
  padding-bottom: 0px
}

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
}
.JNPF-preview-main .main {
  padding-top: 0;
}
::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px
}
</style>