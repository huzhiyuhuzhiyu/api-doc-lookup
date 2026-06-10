<template>
  <el-dialog title="新增待对账记录" :close-on-click-modal="false" :close-on-press-escape="false" :visible="true"
    @close="$emit('close')" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="70%" append-to-body>
    <div :style="{ padding: '10px', height: btnType !== 'look' ? '60vh' : '' }" v-loading="formLoading">
      <JNPF-col v-if="btnType !== 'look'" v-model="dataForm" :tabContent="dataFormItems" ref="dataForm"
        :btnType="btnType" />
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
import { getCooperativeData, getGroupDataInfo } from '@/api/basicData/index.js'
import { getcategoryTrees } from "@/api/salesManagement/assemblyOrders";
import { addLogisticsReceivable } from "@/api/ReconciliaRePayments";

export default {
  components: { TableFormProduct },
  data() {
    return {
      formLoading: false,
      btnType: 'add',
      btnLoading: false,
      dataForm: {
        pickMaterial: '',
        deliveryMaterial: '',
        freight: '',
      },
      dataFormItems: [
        {
          prop: "cooperativePartnerName",
          label: '供应商',
          value: "",
          type: "custom",
          customComponent: "ComSelect-page",
          itemRules: [{ required: true, trigger: "change" }],
          title: `选择供应商`,
          treeTitle: `供应商分类`,
          renderTree: true,
          multiple: false,
          clearable: false,
          methodArr: { method: getcategoryTrees, requestObj: { type: 'supplier' } },
          listMethod: getCooperativeData,
          tableItems: [
            { prop: 'code', label: '供应商编码' },
            { prop: 'name', label: '供应商名称' },
            { prop: 'nameEn', label: '英文名称' },
            { prop: 'taxId', label: '税号' }
          ],
          listRequestObj: {
            code: '',
            name: '',
            type: 'supplier',
            partnerCategoryId: '',
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              {
                asc: false,
                column: ''
              },
              {
                asc: false,
                column: 'create_time'
              }
            ]
          },
          searchList: [
            { prop: 'code', label: '供应商编码', type: 'input' },
            { prop: 'name', label: '供应商名称', type: 'input' }
          ],
          change: (id, data) => {
            // dom更新后重新校验此元素
            this.$nextTick(() => {
              this.$refs.dataForm.$refs.main.validateField('cooperativePartnerName');
            });
            this.dataForm.cooperativePartnerId = data[0].all.id;
            this.dataForm.cooperativePartnerCode = data[0].all.code;
            this.dataForm.cooperativePartnerName = data[0].all.name;
          },
          treeNodeClick: (data, node, listQuery) => {
            if (listQuery.partnerCategoryId === data.id) return listQuery
            listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
            listQuery.classAttribute = data.classAttribute
            return listQuery
          },
          render: true
        },
        { prop: 'logisticsMode', label: '物流方式', value: '', type: 'input', itemRules: [{ required: true, trigger: 'blur' }], },
        { prop: 'weight', label: "重量", value: '', type: 'input', itemRules: [{ required: true, trigger: 'blur' }], },
        { prop: 'pickMaterial', label: "提货费", value: '', type: 'input', itemRules: [{ required: true, trigger: 'blur' }, { validator: this.formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }], input: this.updateTotalAmount },
        { prop: 'deliveryMaterial', label: "送货费", value: '', type: 'input', itemRules: [{ required: true, trigger: 'blur' }, { validator: this.formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }], input: this.updateTotalAmount },
        { prop: 'freight', label: "运费", value: '', type: 'input', itemRules: [{ required: true, trigger: 'blur' }, { validator: this.formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }], input: this.updateTotalAmount },
        // { prop: 'date', label: "日期", value: this.jnpf.getToday(), type: 'date', itemRules: [{ required: true, trigger: 'change' }], },
        { prop: 'totalAmount', label: "总金额", value: 0, type: 'input', itemDisabled: true },
      ],
    }
  },
  methods: {
    init() {
    },
    async updateTotalAmount() {
      await this.$nextTick()
      this.dataForm.totalAmount = this.jnpf.math('+', [
        this.dataForm.pickMaterial,
        this.dataForm.deliveryMaterial,
        this.dataForm.freight
      ])
    },
    // 提交
    async submit() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断

      // 校验表格表单
      let tableForm = this.$refs['dataForm'].$refs.main
      let valid_1 = await tableForm.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(tableForm.fields)
      }

      // 判断条件后发送请求
      if (submitFlag) {
        const _data = this.dataForm
        addLogisticsReceivable(_data).then(res => {
          this.$message.success('操作成功')
          setTimeout(() => {
            this.$emit('close', true)
          }, 1500);
        }).catch(err => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }
    },
  }
}
</script>
