<script>
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue';
import {lineSalePackingList} from "@/api/warehouseManagement/packingList";
import {confirmOrdersNotice, getQuotationsendlist} from "@/api/salesManagement";
import {getStockPickedLineList} from "@/api/batchPacking";

export default {
  name: "ConfirmBatchPacking",
  components: {TableFormProduct},
  data() {
    return {
      title: '送货单确认',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        notifyType: 'sale',
        returnDeliveryType: 'delivery',
        delivery: 'deliver_goods',
        inspectionResults: 'qualified',
        exchangeGoodsFlag: false,
        orderNo: '',
        cooperativePartnerId: '',
        partnerName: '',
        partnerCode: '',
        recipient: '',
        phone: '',
        logisticsCompany: '',
        priority: '',
        deliverDate: '',
        defaultAddress: '',
        remark: '',
        deliveryStatus: '',
      },
      linesList: [],
      batchList: [],
      packingList: [],
      batchListItems: [
        {
          prop: 'productDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户产品型号',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'warehouseName',
          label: '仓库',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'shelfSpaceName',
          label: '库位',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'view',
          minWidth: 180,
        },
        {
          prop: 'outboundQuantity',
          label: '出库数量',
          type: 'view',
          minWidth: 180,
        }
      ],
      packingListItems: [
        {
          prop: 'productDrawingNo',
          label: '产品型号',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'view',
          minWidth: 220,
        },
        {
          prop: 'customerProductDrawingNo',
          label: '客户产品型号',
          type: 'view',
          minWidth: 200,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'view',
          minWidth: 80,
        },
        {
          prop: 'waitDeliveryQuantity',
          label: '待发数量',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.getDictDataSync('packaging'),
          minWidth: 170,
        },
        {
          prop: 'totalBoxCount',
          label: '总箱数',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'boxCount',
          label: '箱数',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'singleBoxCount',
          label: '单箱数',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'remnant',
          label: '尾箱数量',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'totalQuantity',
          label: '总数量',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'view',
          minWidth: 280,
          disabled: true,
        },
        {
          prop: 'oil',
          label: '机型',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'grossWeight',
          label: '毛重',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'trayNo',
          label: '托盘号',
          type: 'view',
          minWidth: 160,
        },
        {
          prop: 'traySize',
          label: '大小',
          type: 'select',
          minWidth: 160,
          options: this.getDictDataSync('traySize'),
        }
      ],
      tableHeight: 300,
      activeNames: ['batchInfo', 'packingInfo'],
    }
  },
  methods: {
    async init(params) {
      const {id, type,} = params;
      this.btnType = type
      await this.getDetail(id)
      await this.getInitBatchPackingList(
        {documentId: id},
        {noticeId: id, documentType: 'sale_deliver'}
      )
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await getQuotationsendlist(id)
        const {msg, data} = res
        if (msg === 'Success') {
          this.dataForm = data.notice
          this.linesList = data.noticeLineList
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    async getInitBatchPackingList(batchParams, packingParams) {
      this.loading = true;
      const defaultPagination = {
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        superQuery: {},
        pageNum: 1,
        pageSize: 9999
      };

      const batchQuery = {
        ...defaultPagination,
        ...batchParams
      };

      const packingQuery = {
        ...defaultPagination,
        ...packingParams
      };
      try {
        const [batchRes, packingRes] = await Promise.all([
          getStockPickedLineList(batchQuery),
          lineSalePackingList(packingQuery)
        ]);

        this.batchList = batchRes.data.records.map(item => ({
          ...item,
          productDrawingNo: item.drawingNo,
          productName: item.productsName,
          productCode: item.productsCode,
          outboundQuantity: item.num
        }));

        this.packingList = packingRes.data.records.map(item => ({
          ...item,
          productDrawingNo: item.drawingNo,
          productName: item.productsName,
          productCode: item.productsCode,
          totalBoxCount: item.standardBox,
          boxCount: item.oddBox,
          singleBoxCount: item.packing,
          totalQuantity: item.totalNum,
        }));


        this.loading = false;
      } catch (err) {
        this.loading = false;
      }
    },

    async refreshTableHeight() {
      await this.$nextTick()
      const mainRef = this.$refs.main
      const height = mainRef.clientHeight / 2 - 100
      this.tableHeight = height > 300 ? height : 300
    },

    goBack() {
      this.$emit('close');
    },

    async handleSubmit() {
      this.btnLoading = true
      this.dataForm.deliveryStatus = 'confirmed'
      const params = {
        notice: this.dataForm,
        noticeLineList: this.linesList,
      }
      try {
        const res = await confirmOrdersNotice(params)
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success('确认成功')
          this.goBack()
        }
        this.btnLoading = false
      } catch (error) {
        this.btnLoading = false
      }
    },
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main transitionForm org-form">
            <div class="JNPF-common-page-header">
              <el-page-header @back="goBack" :content="title"/>
              <div class="options">
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">确定</el-button>
                <el-button @click="$emit('close',false)">{{ $t('common.cancelButton') }}</el-button>
              </div>
            </div>
            <div class="main" v-loading="loading" ref="main">
              <el-collapse v-model="activeNames" style="margin-top: 5px;" @change="refreshTableHeight">
                <el-collapse-item title="批次信息" name="batchInfo">
                  <TableForm-product
                    :value="batchList"
                    :hasToolbar="false"
                    ref="batchTable"
                    :tableItems="batchListItems"
                    :hasActionbar="false"
                    :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: false,
                        height: tableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }"/>
                </el-collapse-item>

                <el-collapse-item title="装箱单信息" name="packingInfo">
                  <TableForm-product
                    :value="packingList"
                    :hasToolbar="false"
                    ref="packingTable"
                    :tableItems="packingListItems"
                    :hasActionbar="false"
                    :tableProps="{
                        is: 'JNPF-table',
                        fixedNO: true,
                        hasC: false,
                        height: tableHeight,
                        rowKey: 'id',
                        defaultExpandAll: true,
                        customColumn: true,
                      }"/>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
