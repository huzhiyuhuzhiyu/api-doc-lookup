<script>
import { deepClone } from "@/utils";
import { getBasicFormSchema } from "./data";
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import { getBomByProductBomLine } from "@/api/basicData";
import { addPurProcurementDemandPool, saleTransferProduction } from "@/api/salesOrderPool";

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
        waitIssuanceNum: '',
        source: '',
      },
      basicFormSchema: [],
      linesList: [],
      linesListItems: [
        { prop: 'productDrawingNo', label: '物料型号', type: 'view', minWidth: 160 },
        { prop: 'productName', label: '物料名称', type: 'view', minWidth: 160 },
        { prop: 'deliveryDate', label: '订单交期', type: 'view', minWidth: 160 },
        { prop: 'planDemandQuantity', label: '数量', type: 'view', minWidth: 90 },
      ],
      linesTableHeight: 0,
      activeName: 'jcInfo',
      activeNames: ['basicInfo', 'productInfo'],

      demandTypeMap: {
        product: {
          label: '成品需求',
          value: 'sale_order_finished_product',
          api: addPurProcurementDemandPool,
          hasBom: false,
        },
        component: {
          label: '子件需求',
          value: 'sale_order_material',
          api: addPurProcurementDemandPool,
          hasBom: true,
        },
        mainComponent: {
          label: '主子件需求',
          value: 'sale_order_finished_material',
          api: addPurProcurementDemandPool,
          hasBom: true,
        },
        productionTransfer: {
          label: '转生产',
          value: '',
          api: saleTransferProduction,
          hasBom: false,
          submitMode: 'transfer-array',
        },
      },
      currentConfig: null,
    };
  },

  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this);
  },

  methods: {
    async init(row, type, productSource) {
      const config = this.demandTypeMap[productSource];
      if (!config) {
        this.$message.error(`不支持的操作类型: ${ productSource }`);
        return;
      }

      this.currentConfig = config;
      this.btnType = type;
      this.isLinesShow = config.hasBom;
      this.title = config.label;
      this.dataForm = deepClone(row);
      this.dataForm.source = config.value;

      if (config.hasBom) {
        await this.getBomLine(row.productsId);
      } else {
        this.linesList = [{
          ...row,
          planDemandQuantity: row.issuanceNum,
        }];
      }

      this.$nextTick(() => {
        this.$refs.dataForm?.$refs.main?.clearValidate?.();
        this.refreshTableHeight();
      });
    },

    async refreshTableHeight(...args) {
      if (args.length) await new Promise(resolve => setTimeout(resolve, 500));
      const mainRef = this.$refs.main;
      const dataFormRegion = this.$refs.dataFormRegion;
      if (!mainRef || !dataFormRegion) return;

      let maxHeight = mainRef.clientHeight - dataFormRegion.$el.offsetHeight - 160;
      this.linesTableHeight = Math.max(maxHeight, 300);
    },

    calcQuantity(a, b, c, d) {
      const qty = parseFloat(a) || 1;
      const lossRate = parseFloat(c) || 0;
      const fixedLoss = parseFloat(d) || 0;
      const result = qty * b * (1 + lossRate / 100) + fixedLoss;
      return isNaN(result) ? 0 : Math.floor(result.toFixed(4));
    },

    async getBomLine(id) {
      this.loading = true;
      try {
        const res = await getBomByProductBomLine(id);
        const { msg, data } = res
        if (msg === 'Success') {
          this.linesList = this.formatLinesList(data);
        }
      } catch ( err ) {
        console.error('获取BOM失败:', err);
      } finally {
        this.loading = false;
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

    async handleSubmit() {
      const { currentConfig, dataForm, linesList } = this;

      // 校验表单
      this.btnLoading = true;
      try {
        const valid = await this.$refs.dataForm.$refs.main.validate().catch(() => false);
        if (!valid) return;

        let params;

        if (currentConfig.submitMode === 'transfer-array') {
          params = [{
            saleOrdersLineId: dataForm.id,
            issueQuantity: dataForm.issuanceNum,
          }];
        } else {
          if (!linesList.length) {
            return this.$message.error('无有效子件信息，无法提交！');
          }
          params = {
            ...deepClone(dataForm),
            orderNo: dataForm.orderNo,
            ordersId: dataForm.ordersId,
            ordersLineId: dataForm.id,
            productsId: dataForm.productsId,
            poolList: linesList,
          };
        }

        const res = await currentConfig.api(params);
        if (res.msg === 'Success') {
          this.$message.success('提交成功');
          this.$emit('close', true);
        }
      } catch ( error ) {
        console.error('提交失败:', error);
        this.$message.error('提交失败，请重试');
      } finally {
        this.btnLoading = false;
      }
    },

    goBack() {
      this.$emit('close', false);
    }
  }
};
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main transitionForm org-form">
          <div class="JNPF-common-page-header">
            <el-page-header @back="$emit('close', false)" :content="title"/>
            <div class="options">
              <template>
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
                  保存并提交
                </el-button>
              </template>
              <el-button @click="$emit('close', false)">{{
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
