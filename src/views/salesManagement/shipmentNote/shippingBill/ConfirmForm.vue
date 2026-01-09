<template>
  <el-dialog title="批量确认" :close-on-click-modal="false" :close-on-press-escape="false" :visible="true"
    @close="$emit('close')" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="70%" append-to-body>
    <div :style="{ padding: '10px', height: btnType !== 'look' ? '60vh' : '' }" v-loading="formLoading">

      <JNPF-col v-if="btnType !== 'look'" v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
        :btnType="btnType" />

      <TableForm-product ref="TableForm" :value="linesList" @input="tableFormValueChange"
        :checkSelectable="checkSelectable" :selectionChange="selectionChange" :hasActionbar="false"
        :tableItems="tableItems" :btnType="'add'" :hasC="false">
        <template v-slot:top>
          <div></div>
        </template>
      </TableForm-product>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
      <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading" @click="submit()">
        {{ $t('common.submitButton') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue' // 附带产品多选的表格表单组件
import { getGroupDataInfo } from '@/api/basicData/index.js'
import { getCompanyPage } from "@/api/customerAndFactory";
import { batchConfirmDeliveryLine } from "@/api/masterDataManagement/productManage";

export default {
  components: { TableFormProduct },
  data() {
    const companyProp = {
      prop: "companyName", label: "公司抬头", value: "", type: 'custom',
      customComponent: 'ComSelect-page', renderTree: false,

      tableItems: [
        {
          prop: "name",
          label: "公司抬头",
          minWidth: 200,
        },
        {
          prop: "address",
          label: "地址",
          minWidth: 200,
        },
        {
          prop: "contactNumber",
          label: "联系电话",
          minWidth: 120,
        },
        {
          prop: "fax",
          label: "传真",
          minWidth: 120,
        },
        {
          prop: "taxNumber",
          label: "信用代码",
          minWidth: 120,
        },
        {
          prop: "remark",
          label: "备注",
          minWidth: 220,
        },
      ], placeholder: "请选择公司抬头", title: "选择公司抬头",
      listMethod: getCompanyPage,
      listRequestObj: {
        "type": "customer",
        "pageNum": 1,
        "orderItems": [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "createTime"
          }
        ],
        "pageSize": 20,
      },
      searchList: [
        { prop: "name", label: "公司抬头", type: 'input' },
        // { prop: "code", label: "编码", type: 'input' },
      ],
    }
    return {
      formLoading: false,
      btnType: 'add',
      btnLoading: false,
      dataForm: {},
      dataFormItems: [
        {
          prop: 'foreignInvoiceNo', label: '外销发票号', type: 'input', sm: 8,
          change: (val) => {
            this.linesList.forEach(item => {
              item.foreignInvoiceNo = val
            })
            this.$message.success('批量更新发票号成功')
          }
        },
        {
          ...companyProp,
          change: (val, data, paramsObj) => {
            // this.$nextTick(() => { this.$refs['dataForm'].validateField('name') }) // 校验操作的元素(name是组件绑定的value)
            if (data && data.length) { // 数据有效，进行更新
              this.dataForm.companyId = data[0].id // 或者this.dataForm['id'] = data[0].all.id
              this.dataForm.companyName = data[0].name // 或者this.dataForm['name'] = data[0].all.name
            } else { // 不选择任何内容，置空绑定的值
              this.dataForm.companyId = ""
              this.dataForm.companyName = ""
            }
            this.linesList.forEach(item => {
              item.companyId = this.dataForm.companyId
              this.$set(item, 'companyName', this.dataForm.companyName)
            })
            this.$message.success('批量更新公司抬头成功')
          },
        },
      ],
      linesList: [],
      tableItems: [
        { prop: 'orderNo', label: '发货单号', type: 'view', minWidth: '180' },
        {
          prop: 'foreignInvoiceNo', label: '外销发票号', type: 'input', minWidth: '180',
          itemRules: [
            { required: true, trigger: 'blur' },
          ],
        },
        {
          ...companyProp,
          minWidth: '200',
          itemRules: [
            { required: true, trigger: 'change' },
          ],
          change: (val, data, paramsObj) => {
            const { scope } = paramsObj
            // this.$nextTick(() => { this.$refs['dataForm'].validateField('name') }) // 校验操作的元素(name是组件绑定的value)
            if (data && data.length) { // 数据有效，进行更新
              this.$set(scope.row, 'companyId', data[0].id)
              this.$set(scope.row, 'companyName', data[0].name)
            } else { // 不选择任何内容，置空绑定的值
              this.$set(scope.row, 'companyId', "")
              this.$set(scope.row, 'companyName', "")
            }
          },
        },
        { prop: 'partnerCode', label: '客户编码', type: 'view', minWidth: '180' },
        { prop: 'drawingNo', label: '品名规格', type: 'view', minWidth: '180' },
        { prop: 'hsProductDrawingNo', label: '报关品名', type: 'view', minWidth: '180' },
        { prop: 'num', label: '发货数量', type: 'view', minWidth: '180' },
        { prop: 'mainUnit', label: '单位', type: 'view', minWidth: '180' },
        // { prop: 'foreignInvoiceNo', label: '工厂号', type: 'view', minWidth: '180' },
        { prop: 'costPrice', label: '工厂单价', type: 'view', minWidth: '180' },
        { prop: 'totalAmount', label: '工厂总价', type: 'view', minWidth: '180' },
        { prop: 'createTime', label: '发货时间', type: 'view', minWidth: '180' },
      ],
    }
  },
  methods: {
    init(data) {
      this.dataForm = {
        ...this.dataForm,
      }
      this.linesList = JSON.parse(JSON.stringify(data));
    },
    tableFormValueChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.linesList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        // this.linesList[dataOrIndex][prop] = value
        this.$set(this.linesList[dataOrIndex], prop, value)
      }
    },
    // 提交
    async submit() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断

      // 校验表格表单
      let tableForm = this.$refs['TableForm'].$refs.main
      let valid_3 = await tableForm.validate().catch(err => false)
      if (!valid_3 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(tableForm.fields)
      }

      // 判断条件后发送请求
      if (submitFlag) {
        batchConfirmDeliveryLine(this.linesList).then(res => {
          this.$message.success('操作成功')
          this.$emit('close', true)
        }).catch(err => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }
    },
    checkSelectable(row) {
      if (this.activeRow) return this.activeRow.id === row.id // 选择行后禁用其他行选项
      return row.qualifiedQuantity === '0' && row.reportFlag && row.workGroupName
    },
    selectionChange(data) {
      if (data.length) {
        this.activeRow = data[0]
        this.formLoading = true
        getGroupDataInfo(this.activeRow.workGroupId).then(res => {
          this.dataFormTwo.productionQuantity = this.activeRow.productionQuantity
          this.personList = res.data.returnLines
          this.dataFormTwo.personTotal = this.personList.length
          this.formLoading = false
        }).catch(err => {
          this.selectionChange([])
          this.formLoading = false
        })
      } else {
        this.activeRow = null
        this.personList = []
        this.dataFormTwo.personTotal = 0
        this.dataFormTwo.productionQuantity = ''
      }
      this.tableFormTwoList = []
    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'
      if (type === 'Object') {
        this.tableFormTwoList.splice(data.$index, 1)
      } else {
        let tempList = JSON.parse(JSON.stringify(this.tableFormTwoList))
        let hasItemList = []
        // for (let i = 0; i < data.length; i++) {
        //   let item = data[i]
        //   item.remark = ''
        //   const hasFlag = this.tableFormTwoList.some((i) => item.productId === i.productId)
        //   if (hasFlag) {
        //     hasItemList.push(item.productName)
        //   } else {
        //     tempList.push(item)
        //   }
        //   if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        // }
        this.tableFormTwoList = JSON.parse(JSON.stringify(tempList))
      }
    },
  }
}
</script>
