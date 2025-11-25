<script>
import { deepClone } from "@/utils";
import { getBasicFormSchema } from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { getBomByProductBomLine } from "@/api/basicData";
import { addPurProcurementDemandPool } from "@/api/salesOrderPool";

export default {
  name: "Form",
  components: { TableFormProduct },
  data() {
    return {
      title: '',
      btnType: '',
      loading: false,
      btnLoading: false,
      isLinesShow: false,
      dataForm: {
        drawingNo: '',
        productName: '',
        issuanceNum: '',
      },
      basicFormSchema: [],
      linesList: [],
      linesListItems: [
        {
          prop: 'productDrawingNo',
          label: '物料型号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'productName',
          label: '物料名称',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'deliveryDate',
          label: '订单交期',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'planDemandQuantity',
          label: '数量',
          type: 'view',
          minWidth: 90,
        },
      ],
      linesTableHeight: 0,
      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],
    }
  },
  created() {
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
  },
  methods: {
    async init(row, type) {
      this.btnType = type
      this.isLinesShow = row.productSource === 'assemble'
      this.title = this.getTitle(type)
      this.dataForm = deepClone(row)
      if (this.isLinesShow) {
        await this.getBomLine(row.productsId)
      } else {
        this.linesList = [row].map(item => {
          return {
            ...item,
            planDemandQuantity: item.issuanceNum
          }
        })
      }
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
        this.refreshTableHeight()
      })
    },

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500))
      const mainRef = this.$refs.main
      const dataFormRegion = this.$refs.dataFormRegion
      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight
      maxHeight -= 160 // 安全距离
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.linesTableHeight = maxHeight
    },

    getTitle(type) {
      return type === 'purchase' ? '成品需求' : '物料需求'
    },

    calcQuantity(a, b, c, d) {
      const _a = !a ? 1 : a
      const _c = !c ? 1 : c
      const result = +_a * +b * (1 + (+_c / 100)) + +d;
      if (isNaN(result)) return
      return Math.floor(result.toFixed(4));
    },

    async getBomLine(id) {
      this.loading = true
      try {
        const res = await getBomByProductBomLine(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.linesList = this.formatLinesList(data);
          this.loading = false
        }
      } catch ( err ) {
        this.loading = false
      }
    },

    formatLinesList(data) {
      return data.map(item => ({
        ...item,
        productsId: item.productId,
        deliveryDate: this.dataForm.deliveryDate,
        planDemandQuantity: this.calcQuantity(
          item.qty,
          this.dataForm.issuanceNum,
          item.lossRate,
          item.fixedLoss
        ),
      }));
    },

    updatePlanDemandQuantity() {
      this.linesList = this.formatLinesList(this.linesList);
    },

    async handleSubmit() {
      if (!this.linesList.length) return this.$message.error('无产品信息，请添加产品！')
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      if (!valid_1) return this.btnLoading = false
      const deepParams = deepClone(this.dataForm)
      const params = {
        orderNo: deepParams.orderNo,
        ordersId: deepParams.ordersId,
        ordersLineId: deepParams.id,
        productsId: deepParams.productsId,
        poolList: this.linesList
      }
      let MSG = '提交成功'
      try {
        const apiMethod = addPurProcurementDemandPool
        const res = await apiMethod(params)
        const { msg } = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch ( error ) {
        this.btnLoading = false
      }
    },

    goBack() {
      this.$emit('close', this.activeType);
    }
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main transitionForm org-form">
          <div class="JNPF-common-page-header">
            <el-page-header @back="goBack" :content="title"/>
            <div class="options">
              <template>
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
                  保存并提交
                </el-button>
              </template>
              <el-button @click="goBack">{{
                  $t('common.cancelButton')
                }}
              </el-button>
            </div>
          </div>
          <div class="main" v-loading="loading" ref="main">
            <el-tabs v-model="activeName">
              <el-tab-pane label="基础信息" name="jcInfo">
                <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                  <el-collapse-item title="基本信息" name="basicInfo" :class="isLinesShow ? 'orderInfo' : ''" ref="dataFormRegion">
                    <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"/>
                  </el-collapse-item>
                  <el-collapse-item class="productInfo" title="产品信息" name="productInfo" v-if="isLinesShow">
                    <div class="TableForm_title">
                    </div>
                    <TableForm-product
                      :value="linesList"
                      :hasToolbar="false"
                      ref="tableForm" :tableItems="linesListItems"
                      :hasActionbar="false"
                      :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: false,
                        height: linesTableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                    }">
                      <template slot="top">
                        <div class="tableTopContainer">
                          <div class="left">
                          </div>
                          <div class="right">
                            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                       @click="$refs.tableForm.$refs.tableRef.showDrawer()"/>
                            </el-tooltip>
                          </div>
                        </div>
                      </template>
                    </TableForm-product>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
