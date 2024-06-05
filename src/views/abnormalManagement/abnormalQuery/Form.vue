<template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px" @close="$emit('close')">
    <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" v-loading="formLoading"
      :btnType="btnType" />
    <span slot="footer" class="dialog-footer" v-if="btnType !== 'look'">
      <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
        {{ $t('common.submitButton') }}
      </el-button>
    </span>
  </el-dialog>
</template>
  
<script>
import { addAbnoramlData, updateAbnoramlData, detailAbnoramlData, getAbnoramlTypeData } from '@/api/abnormalManagement/index.js'
import { stateEquEquipment } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getprodOrderList } from '@/api/productOrdes/finishedProductOrders' // 生产订单列表

export default {
  data() {
    return {
      title: "",
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {},
      btnType: 'add',
      dataFormItems: []
    }
  },
  methods: {
    setDataFormItems() {
      this.dataFormItems = [
        // 异常内容
        {
          prop: "abnormalContentName",
          label: "异常内容",
          type: "custom",
          customComponent: "ComSelect-page",
          itemRules: [{ required: true, trigger: "change" }],
          sm: 12,
          dialogTitle: "选择异常内容",
          treeTitle: '异常类型',
          methodArr: {
            method: getAbnoramlTypeData,
            requestObj: {
              parentId: '-1',
              orderItems: [{
                asc: false,
                column: "create_time"
              }],
              pageSize: -1
            }
          },
          treeNodeClick: (data, node, listQuery) => {
            return { ...listQuery, parentId: data.id }
          },
          listMethod: getAbnoramlTypeData,
          listRequestObj: {
            code: '',
            name: '',
            contentFlag: true,
            orderItems: [{
              asc: false,
              column: ""
            }, {
              asc: false,
              column: "create_time"
            }],
            pageNum: 1,
            pageSize: 20
          },
          tableItems: [
            { prop: 'code', label: '异常编码' },
            { prop: 'name', label: '异常名称' },
            { prop: 'parentName', label: '所属类型' },
            { prop: 'createTime', label: '创建时间', width: 180 },
            { prop: 'createByName', label: '创建人', width: 120 }
          ],
          searchList: [
            { prop: 'code', label: '异常编码', type: 'input' },
            { prop: 'name', label: '异常名称', type: 'input' }
          ],
          change: (val, data, paramsObj) => {
            this.$nextTick(() => { this.$refs['dataForm'].$refs.main.validateField('abnormalContentName') })
            if (!data || !data.length) {
              this.dataForm.abnormalTypeId = ''
              this.dataForm.abnormalTypeName = ''
              this.dataForm.abnormalContentId = ''
              this.dataForm.abnormalContentName = ''
            } else {
              let changeFlag = this.dataForm.abnormalContentName !== data[0].all.name
              this.dataForm.abnormalTypeId = data[0].all.parentId
              this.dataForm.abnormalTypeName = data[0].all.parentName
              this.dataForm.abnormalContentId = data[0].all.id
              this.dataForm.abnormalContentName = data[0].all.name
              if (!changeFlag) return
              if (this.dataForm.abnormalTypeName === '设备异常') {
                this.dataForm.productionOrder = ''
                this.dataForm.productionOrderId = ''
              } else if (this.dataForm.abnormalTypeName === '生产异常') {
                this.dataForm.equipmentId = ''
                this.dataForm.equipmentName = ''
              }
              this.setDataFormItems()
            }
          },
          itemDisabled: this.btnType !== 'add'
        },
        // 异常类型（自动）
        {
          prop: "abnormalTypeName",
          label: "异常类型",
          placeholder: "选择异常内容后自动生成",
          type: "input",
          sm: 12,
          itemDisabled: true
        },
        // 设备
        {
          prop: "equipmentName",
          label: "设备名称",
          placeholder: '请选择设备',
          type: "custom",
          customComponent: "ComSelect-page",
          sm: 12,
          dialogTitle: "选择设备",
          treeTitle: '设备',
          methodArr: { method: getcategoryTree, requestObj: { classAttribute: 'equipment' } },
          listMethod: stateEquEquipment,
          listRequestObj: {
            "pageNum": 1,
            "pageSize": 20,
            "orderItems": [{
                "asc": false,
                "column": "createTime"
              }],
            "code": "",
            "name": "",
            "state": "normal",
            "deviceType": "normal",
            "classAttribute": "equipment"
          },
          tableItems: [
            { prop: 'code', label: '设备编码', fixed: 'left' },
            { prop: 'name', label: '设备名称', fixed: 'left' },
          ],
          searchList: [
            { prop: "code", label: "设备编码", type: 'input' },
            { prop: "name", label: "设备名称", type: 'input' }
          ],
          change: (val, data, paramsObj) => {
            this.$nextTick(() => { this.$refs['dataForm'].$refs.main.validateField('equipmentName') })
            if (!data || !data.length) {
              this.dataForm.equipmentId = ''
              this.dataForm.equipmentName = ''
            } else {
              this.dataForm.equipmentId = data[0].all.id
              this.dataForm.equipmentName = data[0].all.name
            }
          },
          render: this.dataForm.abnormalTypeName === '设备异常',
          itemDisabled: this.btnType !== 'add'
        },
        // 生产订单
        {
          prop: "productionOrderNo",
          label: "生产订单号",
          placeholder: '请选择生产订单',
          type: "custom",
          customComponent: "ComSelect-page",
          sm: 12,
          dialogTitle: "选择生产订单",
          renderTree: false,
          listMethod: getprodOrderList,
          listRequestObj: {
            orderItems: [{
              asc: false,
              column: ""
            }, {
              asc: false,
              column: "create_time"
            }],
            documentStatus: "submit",
            approvalStatus: "ok", // 审批状态,可用值:ing,no,ok
            receiveStatus: "received",
            orderStatus: "normal",
            pageNum: 1,
            pageSize: 20
          },
          tableItems: [
            { prop: 'orderNo', label: '生产订单号' },
            { prop: 'productCode', label: '产品编码' },
            { prop: 'productName', label: '产品名称' },
            { prop: 'productDrawingNo', label: '产品图号' }
          ],
          searchList: [
            { prop: 'orderNo', label: '生产订单号', type: 'input' },
            { prop: 'productCode', label: '产品编码', type: 'input' },
            { prop: 'productName', label: '产品名称', type: 'input' },
          ],
          change: (val, data, paramsObj) => {
            this.$nextTick(() => { this.$refs['dataForm'].$refs.main.validateField('productionOrderNo') })
            if (!data || !data.length) {
              this.dataForm.productionOrderNo = ''
              this.dataForm.productionOrderId = ''
            } else {
              this.dataForm.productionOrderNo = data[0].all.orderNo
              this.dataForm.productionOrderId = data[0].all.id
            }
          },
          render: this.dataForm.abnormalTypeName === '生产异常',
          itemDisabled: this.btnType !== 'add'
        },
        {
          prop: "personId",
          label: "处理人员",
          type: "custom",
          customComponent: "user-select",
          itemRules: [{ required: true, trigger: "change" }],
          change: (val, data, paramsObj) => {
            this.$nextTick(() => { this.$refs['dataForm'].$refs.main.validateField('personId') })
          },
          sm: 12,
          render: this.btnType === 'edit'
        },
        {
          prop: "processDate",
          label: "处理时间",
          value: this.btnType !== 'add' ? this.jnpf.getToday('YYYY-MM-DD HH:mm:ss') : '',
          type: "dateTime",
          pickerOptions: this.global.timePicker,
          itemRules: [{ required: true, trigger: "change" }],
          sm: 12,
          render: this.btnType !== 'add'
        },
        {
          prop: "abnormalDescription",
          label: "处理描述",
          type: "textarea",
          render: this.btnType === 'edit'
        }
      ]
    },
    init(row, btnType) {
      this.visible = true
      this.btnType = btnType
      this.formLoading = true
      if (row) {
        this.dataForm = { ...row }
        this.title = '处理异常'
        this.dataForm.processStatus = 'processed'
      } else {
        this.title = '新建异常'
        this.dataForm.processStatus = 'processing'
      }
      this.setDataFormItems()
      this.formLoading = false
    },
    async handleConfirm(submitModel) {
      this.btnLoading = true;
      let submitFlag = true
      let form = this.$refs['dataForm'].$refs.main
      let valid_1 = await form.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        let formItems = form.$children[0].$children
        formItems.some(item => {
          if (!item.$children[0]) return false
          let formItem = item.$children[0].$children[0]
          if (formItem.validateState === 'error') {
            submitFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }
      if (submitFlag) {
        let formMethod = this.dataForm.id ? updateAbnoramlData : addAbnoramlData;
        this.dataForm.documentStatus = submitModel
        formMethod(this.dataForm).then(res => {
          let msg = formMethod == updateAbnoramlData ? '处理成功' : '新建成功'
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
    }
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
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
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
</style>