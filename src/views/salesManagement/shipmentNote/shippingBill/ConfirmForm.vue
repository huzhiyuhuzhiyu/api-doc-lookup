<template>
  <el-dialog title="批量确认" :close-on-click-modal="false" :close-on-press-escape="false" :visible="true"
    @close="$emit('close')" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="70%" append-to-body>
    <div :style="{ padding: '10px', height: btnType !== 'look' ? '60vh' : '' }" v-loading="formLoading">

      <JNPF-col v-if="btnType !== 'look'" v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
        :btnType="btnType" />

      <TableForm-product v-if="btnType !== 'look'" ref="TableForm" :value="tableFormList" @input="tableFormValueChange"
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
export default {
  components: { TableFormProduct },
  data() {
    return {
      formLoading: false,
      btnType: 'add',
      btnLoading: false,
      dataForm: {},
      dataFormItems: [
        { prop: 'foreignInvoiceNo', label: '外销发票号', type: 'input', sm: 8 },
        { prop: 'companyId', label: '公司抬头', type: 'input', sm: 8 },
      ],
      tableFormList: [],
      tableItems: [
        { prop: 'orderNo', label: '发货单号', type: 'view', minWidth: '180' },
        { prop: 'foreignInvoiceNo', label: '外销发票号', type: 'input', minWidth: '180' },
        { prop: 'processingType', label: '公司抬头', type: 'select', options: [{ label: "自制", value: "self_produced" }, { label: "外协", value: "external_production" }], minWidth: '120', itemDisabled: true },
        { prop: '客户编码', label: '客户编码', type: 'view', minWidth: '180' },
        { prop: 'drawingNo', label: '品名规格', type: 'view', minWidth: '180' },
        { prop: 'hsProductDrawingNo', label: '报关品名', type: 'view', minWidth: '180' },
        { prop: 'num', label: '发货数量', type: 'view', minWidth: '180' },
        { prop: 'mainUnit', label: '单位', type: 'view', minWidth: '180' },
        { prop: 'foreignInvoiceNo', label: '工厂号', type: 'view', minWidth: '180' },
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
      this.tableFormList = JSON.parse(JSON.stringify(data));
    },
    tableFormValueChange(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.tableFormList = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.tableFormList[dataOrIndex][prop] = value
      }
    },
    // 提交
    async submit() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断

      // 校验表格表单
      let tableForm = this.$refs['TableFormTwo'].$refs.main
      let valid_3 = await tableForm.validate().catch(err => false)
      if (!valid_3 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(tableForm.fields)
      }

      if (!this.activeRow && submitFlag) {
        this.$message.error('请选择需要分卡的工序！')
        submitFlag = false
      }

      if (submitFlag) {
        // 将所有 personId 提取到一个数组中
        const allPersonIds = this.tableFormTwoList.flatMap(item => item.personId);

        // 使用 reduce 统计每个 personId 出现的次数
        const countMap = allPersonIds.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1; // 统计每个 id 出现的次数
          return acc;
        }, {});

        // 找出重复的 personId（出现次数大于 1）
        let duplicates = Object.keys(countMap).filter(id => countMap[id] > 1);
        if (duplicates.length) {
          duplicates = duplicates.map(item => this.personList.find(person => person.personnelId === item).personnelIdText)
          this.$message.error(`${duplicates.join('、')} 重复出现在多组分卡记录！`)
          submitFlag = false
        }
      }
      // 判断条件后发送请求
      if (submitFlag) {
        const _data = {
          productionOrderId: this.dataForm.productionOrderId,
          workOrderId: this.activeRow.id,
          splitCardTaskList: this.tableFormTwoList.map(item => ({
            ...item,
            // orderNo: item.orderNo,
            personList: item.personId.map(personId => ({
              personId,
              workGroupId: this.activeRow.workGroupId
            })),
            productionOrderId: this.dataForm.productionOrderId,
            // productionQuantity: item.productionQuantity,
            qualifiedQuantity: 0,
            unqualifiedQuantity: 0,
            workOrderId: this.activeRow.id,
          })),
        }
        splitCardTaskExec(_data).then(res => {
          this.$message.success('操作成功')
          setTimeout(() => {
            this.$parent.init(this.dataForm.productionOrderId)
            this.$emit('close')
          }, 1500);
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
