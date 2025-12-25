<template>
  <el-dialog
    title="分卡"
    :visible.sync="dialogVisible"
    width="40%"
    lock-scroll
    append-to-body
    :close-on-click-modal="false"
    class="JNPF-dialog JNPF-dialog_center"
    @close="handleClose"
  >
    <div class="dialog-content">
      <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" btnType="add"/>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getProductionLineList } from "@/api/basicData";
import { getProcessList } from "@/api/basicData/processSettingss";
import { divideTransferCard } from "@/api/purchasingAndOutsourcingOrders";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      dataForm: {},
      dataFormItems: [],
      productionLinesList: [],
    }
  },
  watch: {
    async visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        await this.fetchProductionLines()
        this.updateDataFormItems()
        const { waitSplitQuantity, id } = this.formData;
        this.dataForm = {
          id,
          waitSplitQuantity,
          splitQuantity: waitSplitQuantity,
          productionLineId: '',
          routingId: '',
          routingName: '',
        };
      }
    }
  },
  methods: {
    updateDataFormItems() {
      this.dataFormItems = [
        {
          prop: 'waitSplitQuantity',
          label: '可分卡数量',
          type: 'input',
          disabled: true,
          sm: 24
        },
        {
          prop: 'splitQuantity',
          label: '分卡数量',
          type: 'input',
          itemRules: [
            // {
            //   validator: this.formValidate('noZero', '分卡数量不能为0', (errMsg) => {
            //     this.$message.error(errMsg)
            //   }), trigger: ['blur', 'change']
            // },
            {
              validator: this.formValidate({
                type: 'noEmtry', params: ['分卡数量不能为空', (errMsg) => {
                  this.$message.error(`分卡数量不能为空`)
                }]
              }), trigger: 'blur',
            },
            {
              validator: this.formValidate({
                type: 'decimal', params: [20, 4, null, (errMsg) => {
                  this.$message.error(errMsg)
                }]
              }),
              trigger: ['blur', 'change'],
            },
            {
              validator: this.formValidate({
                type: 'calc',
                params: [(rowIndex, value) => +value <= +this.dataForm.waitSplitQuantity, "不能大于可分卡数量", (errMsg, rowIndex) => {
                  this.$message.error(`分卡数量${ errMsg }`)
                }]
              }), trigger: 'blur'
            },
            { required: true, message: '分卡数量不能为空', trigger: ['blur', 'change'], },
          ],
          sm: 24,
        },
        {
          prop: "productionLineId",
          label: "产线",
          value: "",
          type: 'select',
          options: this.productionLinesList,
          sm: 24,
        },
        {
          prop: "routingName",
          label: "工艺路线",
          value: "",
          type: "custom",
          customComponent: "ComSelect-page",
          itemRules: [{ required: true, trigger: "change" }],
          title: '选择工艺路线',
          renderTree: false,
          multiple: false,
          clearable: true,
          listMethod: getProcessList,
          tableItems: [
            { prop: 'name', label: '工艺路线名称', minWidth: '220px', sortable: 'custom' },
            { prop: 'code', label: '工艺路线编码', minWidth: '220px', sortable: 'custom' },
          ],
          listRequestObj: {
            code: "",
            name: "",
            documentStatus: "submit",
            source: "production",
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
            { prop: 'name', label: '工艺路线名称', type: 'input' },
            { prop: 'code', label: '工艺路线编码', type: 'input' },
          ],
          change: (id, data) => {
            this.dataForm.routingId = data[0].all.id;
            this.dataForm.routingName = data[0].all.name;
          },
          sm: 24,
        },
      ]
    },
    async fetchProductionLines() {
      try {
        const { data } = await getProductionLineList({
          pageNum: -1,
          pageSize: -1
        });
        this.productionLinesList = data.records.map(item => ({
          label: item.name,
          value: item.id,
        }))
      } catch ( error ) {
        this.$message.error("获取产线列表失败，请稍后重试");
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleConfirm() {
      await this.$refs.dataForm.$refs.main.validate()
      try {
        this.loading = true
        const res = await divideTransferCard(this.dataForm)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success('分卡成功')
          this.dialogVisible = false
          this.$emit('initData')
        } else {
          this.$message.error(msg || '分卡失败')
        }
      } catch ( error ) {
        this.$message.error('分卡数据出错')
      } finally {
        this.loading = false
      }
    },
  }
}
</script>
