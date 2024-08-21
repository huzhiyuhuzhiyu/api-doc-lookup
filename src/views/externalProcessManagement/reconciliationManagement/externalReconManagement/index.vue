<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.orderNo" placeholder="请输入出入库单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.partnerName" placeholder="请输入客户名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <!-- <topOpts @add="addSupplier('', 'add')"></topOpts> -->
          <div>
            <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成外协对账</el-button>
            <el-button v-has="'btn_export'" :disabled="tableDataList.length > 0 ? false : true" size="mini"
              type="primary" icon="el-icon-download" @click="exportForm">导出</el-button>
          </div>
          <div class="JNPF-common-head-right">


            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table v-loading="listLoading" @selection-change="handeleProductInfoData" hasC highlight-current-row
          :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
          :setColumnDisplayList="columnList" :checkSelectable="checkSelectable">
          <el-table-column prop="orderNo" label="出入库单号" min-width="240" sortable="custom" />
          <el-table-column prop="partnerName" label="供应商名称" min-width="180" sortable="custom" />
          <el-table-column prop="partnerCode" label="供应商编码" min-width="180" sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" min-width="180" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" min-width="180" sortable="custom" />
          <el-table-column prop="drawingNo" label="品名规格" min-width="180" sortable="custom" />
          <el-table-column prop="businessType" label="收/退货类型" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'outbound_purchase'">退货</div>
              <div v-else-if="scope.row.businessType == 'inbound_purchase'">收货</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" label="单位" min-width="180" />
          <el-table-column prop="num" label="出入库数量" min-width="180" />
          <el-table-column prop="costPrice" label="单价(含税)" min-width="140" />
          <el-table-column prop="taxRate" label="税率(%)" min-width="140" />
          <el-table-column prop="totalAmount" label="金额" min-width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'outbound_purchase'" style="color: #67C23A">+{{
                scope.row.totalAmount }}</div>
              <div v-else-if="scope.row.businessType == 'inbound_purchase'" style="color:red">-{{
                scope.row.totalAmount
              }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="180" sortable="custom" />




        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />


    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getsalefinAccountList } from '@/api/ReconciliaRePayments/index'
import SuperQuery from '@/components/SuperQuery/index.vue'

import ExportForm from '@/components/no_mount/ExportBox/index'
import JNPFForm from './Form'
import moment from 'moment'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'salefinAccount',
  components: { JNPFForm, ExportForm, SuperQuery },
  data() {
    return {

      columnList: ["partnerCode", "productCode", "productName", "createByName"],
      superQueryVisible: false,
      title: "更多查询",
      exportFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      formVisible: false,
      listLoading: false,
      listQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        endTime: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        partnerName: "",
        startTime: "",
        businessType: 'outside_delivery_return',
        superQuery: {},
      },
      receiptReturnTypeList: [
        {
          label: '退货',
          value: 'outbound_purchase'
        },
        {
          label: '收货',
          value: 'inbound_purchase'
        },
      ],
      createRequirementDate: [],
      deliveryDate: [],
      selectData: [],                    // 选中的数据 带到form页
      total: 0,
      formVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "出入库单号",
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'num',
          label: "出入库数量",
          type: 'input'
        },
        {
          prop: 'price',
          label: "单价(含税)",
          type: 'input'
        },
        {
          prop: 'taxRate',
          label: "税率(%)",
          type: 'input'
        },
        {
          prop: 'excludingTaxAmount',
          label: "金额",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },

        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        }


      ],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef);
        let columnList = domRef.columnList.filter(item => !!item.label && !!item.prop)
        columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
        this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
      } else {
        this.$message({
          message: "暂无数据导出",
          type: "error",
          duration: 1500,
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableDataList, 'tableForm')


    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1204',
          exportName: '出入库对账',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    checkSelectable(row) {
      return !row.disabled
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      console.log(val);
      this.selectData = val
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      if (newProp === 'product_code') {
        newProp = 'productCode'
      }
      if (newProp === 'product_name') {
        newProp = 'productName'
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },


    initData() {
      this.listLoading = true
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listQuery.startTime = this.createRequirementDate[0] + " 00:00:00"
        this.listQuery.endTime = this.createRequirementDate[1] + " 23:59:59"
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }

      getsalefinAccountList(this.listQuery).then(res => {
        console.log(res, '采购发/退货列表');
        res.data.records.forEach(item => {
          // if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
          //   item.disabled = true
          // } else {
          //   item.disabled = fals
          // }
          item.excludingTaxAmount = this.jnpf.numberFormat(item.actualQuantity * item.price)
        });

        this.tableDataList = res.data.records
        console.log("this.tableDataList ", this.tableDataList);
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()

      this.listQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        endTime: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        partnerName: "",
        startTime: "",
        businessType: 'outside_delivery_return',
        superQuery: {},
      }
      this.createRequirementDate = []
      this.deliveryDate = []
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },
    // addSupplier(id, type) {
    //   this.formVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.JNPFForm.init(id, type)
    //   })
    // },
    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle() {
      if (this.selectData.length === 0) {
        this.$message({
          message: "请选择你要生成的采购对账单",
          type: "error",
          duration: 1500,
        })
      } else {
        // console.log(this.$refs);
        console.log(this.selectData, 'this.selectData')
        let firstCode = this.selectData[0].partnerCode
        let allCode = this.selectData.every(obj => obj.partnerCode === firstCode)
        if (allCode) {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.procureForm.init(this.selectData)
          })
        } else {
          this.$message.error('请选择客户相同的通知单!')
        }

      }

    },

  }
}
</script>
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>