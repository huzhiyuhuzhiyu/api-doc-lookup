<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker v-model="listQuery.accountPeriod" type="month" value-format="yyyy-MM" style="width: 100%;"
                :clearable='false' placeholder="请选择账期" popper-class="date_form">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productsDrawingNo" @keyup.enter.native="search()" placeholder="请输入产品图号"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.warehouseName" @keyup.enter.native="search()" placeholder="请输入仓库名称"
                clearable />
            </el-form-item>
          </el-col>



          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
              <el-button :disabled="tableData.length > 0 ? false : true" type="text" icon="el-icon-download"
                @click="exportForm">导出</el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
            @click="visible = true">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px" v-if="listQuery.accountPeriod === accountPeriod">
          <topOpts :addText="'结存'" @add="addOrUpdateHandle(listQuery.accountPeriod)" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" custom-column fixedNO>
          <el-table-column prop="accountPeriod" label="账期" min-width="160" />
          <el-table-column prop="productsCode" label="产品编码" min-width="160" />
          <el-table-column prop="productsName" label="产品名称" min-width="160" />
          <el-table-column prop="productsDrawingNo" label="产品图号" min-width="400" />
          <el-table-column prop="productsSpec" label="规格型号" min-width="180" />
          <el-table-column prop="mainUnit" label="单位" min-width="140" />
          <el-table-column prop="warehouseCode" label="仓库编码" min-width="160" />
          <el-table-column prop="warehouseName" label="仓库名称" min-width="160" />
          <el-table-column prop="initInventoryQuantity" label="期初数量" min-width="140" />
          <el-table-column prop="initPrice" label="期初单价" min-width="140" />
          <el-table-column prop="initAmount" label="期初金额" min-width="140">
            <template slot-scope="scope">
              <el-link v-if="scope.row.productSource === 'produce'" type="primary"
                @click.native="actualCostLine(scope.row)">
                {{ scope.row.initAmount }}
              </el-link>
              <div v-else>{{ scope.row.initAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="inboundQuantity" label="入库数量" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="inboundAndOutboundLine('inbound', scope.row.id)">
                {{ scope.row.inboundQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="inboundPrice" label="入库单价" min-width="140" />
          <el-table-column prop="inboundAmount" label="入库金额" min-width="140">
            <template slot-scope="scope">
              <el-link v-if="scope.row.productSource === 'produce'" type="primary"
                @click.native="actualCostLine(scope.row)">
                {{ scope.row.inboundAmount }}
              </el-link>
              <div v-else>{{ scope.row.inboundAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="outboundQuantity" label="出库数量" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="inboundAndOutboundLine('outbound', scope.row.id)">
                {{ scope.row.outboundQuantity }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="outboundPrice" label="出库单价" min-width="140" />
          <el-table-column prop="outboundAmount" label="出库金额" min-width="140">
            <template slot-scope="scope">
              <el-link v-if="scope.row.productSource === 'produce'" type="primary"
                @click.native="actualCostLine(scope.row)">
                {{ scope.row.outboundAmount }}
              </el-link>
              <div v-else>{{ scope.row.outboundAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="endInventoryQuantity" label="期末数量" min-width="140" />
          <el-table-column prop="endPrice" label="期末单价" min-width="140" />
          <el-table-column prop="endAmount" label="期末金额" min-width="140">
            <template slot-scope="scope">
              <el-link v-if="scope.row.productSource === 'produce'" type="primary"
                @click.native="actualCostLine(scope.row)">
                {{ scope.row.endAmount }}
              </el-link>
              <div v-else>{{ scope.row.endAmount }}</div>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <inboundAndOutboundLine v-if="lineVisible" ref="lineForm" @close="closeForm" :listMethod="stockBalanceLineList"
      :listRequestObj="inboundAndOutboundQuery" :tableItems="tableItems" :searchList="searchList"
      :documentType='inboundAndOutboundQuery.documentType' />

    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="账期">
              <el-date-picker v-model="listQuery.accountPeriod" type="month" value-format="yyyy-MM" style="width: 100%;"
                :clearable="false" placeholder="请选择账期" popper-class="date_form">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model.trim="listQuery.productCode" placeholder="请输入产品编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model.trim="listQuery.productName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productsDrawingNo" placeholder="请输入产品图号" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库编码">
              <el-input v-model="listQuery.warehouseCode" placeholder="请输入仓库编码" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库名称">
              <el-input v-model="listQuery.warehouseName" placeholder="请输入仓库名称" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <actualCostIndex v-if="businessCode === 'metalworking'" ref="actualCostForm" @close="closeForm"
      :listMethod="actualCostList" :listRequestObj="actualCostQuery" :tableItems="costTableItems"
      :searchList="costSearchList" :businessCode='businessCode' />
    <actualCostIndex v-if="businessCode === 'complete'" ref="actualCostForm" @close="closeForm"
      :listMethod="actualCostList" :listRequestObj="actualCostQuery" :tableItems="completeTableItems"
      :businessCode='businessCode' />
    <actualCostIndex v-if="businessCode === 'assemble'" ref="actualCostForm" @close="closeForm"
      :listMethod="actualCostList" :listRequestObj="actualCostQuery" :tableItems="assembleTableItems"
      :businessCode='businessCode' />
  </div>
</template>

<script>
import { stockBalanceList, canStockBalance, stockBalanceReport, stockBalanceLineList, actualCostList } from '@/api/balances/index'
import Form from './Form'
import inboundAndOutboundLine from './inboundAndOutboundLine.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import actualCostIndex from './actualCostIndex.vue'
export default {
  name: 'stockBalanceList',
  components: { Form, inboundAndOutboundLine, ExportForm ,actualCostIndex},
  data() {
    return {
      stockBalanceLineList,
      actualCostList,
      actualCostLineVisible:false,
      title: '更多查询',
      tableData: [],
      listLoading: false,
      exportFormVisible: false,
      visible: false,
      lineVisible: false,
      listQuery: {},
      initListQuery: {
        accountPeriod: this.jnpf.getToday('YYYY-MM'),
        balanceId: '',
        batchNumber: "",
        createByName: "",
        documentType: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        moveOrderNo: "",
        pageNum: 1,
        pageSize: 20,
        productsCode: "",
        productsDrawingNo: "",
        productsName: "",
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        warehouseCode: "",
        warehouseName: ""
      },
      total: 0,
      formVisible: false,
      accountPeriod: '',
      // 出入库明细参数
      inboundAndOutboundQuery: {
        accountPeriod: "",
        balanceId: '',
        batchNumber: "",
        createByName: "",
        documentType: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        moveOrderNo: "",
        "orderItems": [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        productsCode: "",
        productsDrawingNo: "",
        productsName: "",
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        warehouseCode: "",
        warehouseName: "",
        createTimeArr: []
      },
      tableItems: [
        { prop: 'moveOrderNo', label: '出库单号', minWidth: '180' },
        { prop: 'productsCode', label: '产品编码' },
        { prop: 'productsName', label: '产品名称' },
        { prop: 'productsDrawingNo', label: '产品图号', minWidth: '180' },
        { prop: 'batchNumber', label: '批次号' },
        { prop: 'mainUnit', label: '单位' },
        { prop: 'num', label: '数量' },
        { prop: 'costPrice', label: '单价(含税)' },
        { prop: 'excludingTaxCostPrice', label: '单价(不含税)' },
        { prop: 'taxRate', label: '税率' },
        { prop: 'taxAmount', label: '税额' },
        { prop: 'totalAmount', label: '金额' },
        { prop: 'createTime', label: '出库时间', minWidth: '180' },
      ],
      searchList: [
        { prop: 'moveOrderNo', label: '出库单号', type: 'input' },
        { prop: 'batchNumber', label: '批次号', type: 'input' },
        { prop: 'createTimeArr', label: '出库', type: 'date' },
      ],
      // 金工
      actualCostQuery: {
        blankProductsDrawingNo: "",
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "group_batch_number"
          },
        ],
        pageNum: 1,
        pageSize: 20,
        productsId: '',
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false
      },
      costTableItems: [
        { prop: 'productsCode', label: '产品编码' },
        { prop: 'productsName', label: '产品名称' },
        { prop: 'productsDrawingNo', label: '产品图号', minWidth: '180' },
        { prop: 'inboundQuantity', label: '数量' },
        { prop: 'blankProductsName', label: '毛坯产品名称' },
        { prop: 'blankProductsDrawingNo', label: '毛坯产品图号', minWidth: '180' },
        { prop: 'blankProductsCode', label: '毛坯料号' },
        { prop: 'grossWeight', label: '毛坯重(kg)' },
        { prop: 'materialCost', label: '材料成本(元)' },
        { prop: 'productWeight', label: '成品重(kg)' },
        { prop: 'drillWorkingHours', label: '钻孔工时(s)' },
        { prop: 'totalWorkingHours', label: '总工时(s)' },
        { prop: 'totalLaborCost', label: '总人工费用(元)', minWidth: '160' },
        { prop: 'feeAmount', label: '总制造费用(元)', minWidth: '160' },
        { prop: 'totalCostAmount', label: '成本总金额(元)',fixed:'right',minWidth: '160' },
        { prop: 'groupBatchNumber', label: '物料组批次号',minWidth: '160' },
      ],
      costSearchList: [
        { prop: 'blankProductsDrawingNo', label: '毛坯产品图号', type: 'input' },
      ],
      businessCode:'',
      // 组装
      assembleTableItems: [
        { prop: 'productsCode', label: '产品编码' },
        { prop: 'productsName', label: '产品名称' },
        { prop: 'productsDrawingNo', label: '产品图号', minWidth: '180' },
        { prop: 'inboundQuantity', label: '数量' },
        { prop: 'materialCost', label: '材料成本(元)' },
        { prop: 'totalLaborCost', label: '总人工费用(元)', minWidth: '160' },
        { prop: 'feeAmount', label: '总制造费用(元)', minWidth: '160' },
        { prop: 'totalCostAmount', label: '成本总金额(元)',fixed:'right',minWidth: '160'  },
        { prop: 'groupBatchNumber', label: '物料组批次号',minWidth: '160'  },
      ],
      // 总成
      completeTableItems: [
        { prop: 'productsCode', label: '产品编码' },
        { prop: 'productsName', label: '产品名称' },
        { prop: 'productsDrawingNo', label: '产品图号', minWidth: '180' },
        { prop: 'hoseLength', label: '胶管长度', },
        { prop: 'inboundQuantity', label: '数量' },
        { prop: 'materialCost', label: '材料成本(元)' },
        { prop: 'totalLaborCost', label: '总人工费用(元)' , minWidth: '160'},
        { prop: 'feeAmount', label: '总制造费用(元)' , minWidth: '160'},
        { prop: 'totalCostAmount', label: '成本总金额(元)',fixed:'right',minWidth: '160'  },
        { prop: 'groupBatchNumber', label: '物料组批次号',minWidth: '160'  },
      ],
    }
  },

  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      newProp = newProp === 'partner_name' ? 'partnerName' : newProp
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.lineVisible = false
      this.actualCostLineVisible = false
      this.businessCode = ''
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.visible = false
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      // this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
      stockBalanceReport(this.listQuery).then(res => {
        this.tableData = res.data.page ? res.data.page.records : []
        // 合计 以后用到放开即可
        // res.data.total ? this.totalList.push(res.data.total) : ''     
        this.total = res.data.page ? res.data.page.total : 0
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
      canStockBalance().then(res => {
        console.log(res);
        this.accountPeriod = res.data
      })
    },

    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },

    addOrUpdateHandle(accountPeriod) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(accountPeriod)
      })
    },

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
        let _data = {
          ...this.listQuery,
          exportType: '1116',
          exportName: '仓库存货结存查询',
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
    // 明细列表
    inboundAndOutboundLine(type, id) {
      this.lineVisible = true
      this.inboundAndOutboundQuery.documentType = type
      this.inboundAndOutboundQuery.balanceId = id
      this.tableItems[0].label = type == 'inbound' ? '入库单号' : '出库单号'
      this.searchList[0].label = type == 'inbound' ? '入库单号' : '出库单号'
      this.$nextTick(() => {
        this.$refs.lineForm.getData()
      })
    },
    // 实际成本 列表
    actualCostLine(row){
      this.actualCostLineVisible = true
      this.businessCode = row.businessCode
      this.actualCostQuery.productsId = row.productsId
      this.$nextTick(() => {
        this.$refs.actualCostForm.getData()
      })
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />

