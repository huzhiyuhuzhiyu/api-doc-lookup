<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">

      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.partnerName" placeholder="供应商名称" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productDrawingNo" placeholder="品名规格" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head" style="padding:10px">
            <div>
              <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
                icon="el-icon-download" @click="exportForm">
                导出
              </el-button>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true)">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerName" label="供应商名称" min-width="160" sortable="custom" />
            <el-table-column prop="partnerCode" label="供应商编码" min-width="120" sortable="custom" />
            <el-table-column prop="deliverDate" label="收货日期" width="180" sortable="custom" />
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="120" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" min-width="120" sortable="custom" />
            <el-table-column prop="warehouseName" label="仓库" min-width="120" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="120" />
            <el-table-column prop="receivedQuantity" label="收货数量" min-width="120" sortable="custom" />
            <el-table-column prop="ordersNo" label="订单号" min-width="120" sortable="custom" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" sortable="custom" />

            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row)" editText="检验" :hasDel="false">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, true)">
                        查看详情
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { purPurchaseReceiptReturnGoodsDetailList, linesReceiptReturn } from '@/api/purchasingManagement/purchaseInquirySheet'
import Form from '../components/inspectionNoticeForm.vue'
// import DetailForm from '@/views/externalProcessManagement/productAcceptReturnGoods/outsourcingReceiptNote/Form.vue'
import DetailForm from './DetailForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getUnitData } from '@/api/basicData/materialSettings'
export default {
  components: { Form, DetailForm, ExportForm, SuperQuery, ExportForm },
  data() {
    return {
      superQueryVisible: false,
      exportFormVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '单号',
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: '供应商编码',
          type: 'input'
        },
        {
          prop: 'deliverDate',
          label: '收货日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'warehouseName',
          label: '仓库',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'select'
        },
        {
          prop: 'receivedQuantity',
          label: '收货数量',
          type: 'input'
        },

        {
          prop: 'ordersNo',
          label: '订单号',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ],
      columnList: ["partnerCode", "createByName"],
      visible: false,
      detailFormVisible: false,
      exportFormVisible: false,
      activeName: "dataTable",
      listLoading: false,
      formVisible: false,

      tableData: [],
      listQuery: {},
      initListQuery: {
        approvalStatus: "ok", // 审批状态
        documentStatus: "submit", // 单据状态
        inspectionStatus: "unInspect", // 检验状态
        orderNo: "", // 收货单号
        purchaseOrderNo: "", // 业务单号
        notificationType: "external", // 通知单类型(采购 procure、外协 external、生产检验（入库检验） produce、退货检验 back、退料检验 back_material、在库检验 library、换料检验 refuelling、工序检验process)
        // notificationTypeList: ["external", "external_process"],
        pageNum: 1,
        pageSize: 20,
        receiptReturnType: 'receipt',
        // receivingStatus: "receiving",      //收货状态
        salesman: "", // 业务员
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        createTimeArr: []
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},

      linesTotal: 0,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

    this.initData()
  },
  watch: { activeName() { this.initData() } },
  methods: {
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        console.log(includeFieldMap);
        let _data = {
          ...this.listQuery,
          exportType: '1073',
          exportName: '外协待检收货单',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalRowFlag: true,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
  
    initData() {
      this.listLoading = true

      purPurchaseReceiptReturnGoodsDetailList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => { this.listLoading = false })

    },
    search() {
      this.visible = false

      this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
      Object.keys(this.listQuery).forEach(key => { this.listQuery[key] = typeof this.listQuery[key] === 'string' ? this.listQuery[key].trim() : this.listQuery[key] })
      this.listQuery.pageNum = 1

      this.initData()
    },
    reset() {

      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));

      this.initData()
    },
    addOrUpdateHandle(row, readOnly) {
      if (readOnly) {
        this.detailFormVisible = true
        this.$nextTick(() => { this.$refs.DetailForm.init(row.purchaseReceiptReturnGoodsId, 'look') })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(row, readOnly, 'external', 'notice', 'QCDH') })
      }
    },
    sortChange({ prop, order }) {
      let newProp

      if (prop === 'inspectorName') { newProp = 'inspector_id' }
      else if (['purchaseOrderNo'].includes(prop)) { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()

      this.search()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      this.initData()
      // if (isRefresh) { this.initData() }
    },
  }
}
</script>
<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->