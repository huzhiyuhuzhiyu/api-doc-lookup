<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="listQuery.deliverDateArr" type="daterange" value-format="yyyy-MM-dd" :clearable="false"
                start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>
              <el-button :disabled="tableDataList.length > 0 ? false : true" type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>

        </el-form>
      </el-row>

      <div class="JNPF-common-layout-main JNPF-flex-main">

        <JNPF-table show-summary :summary-method="getSummaries" v-loading="listLoading" highlight-current-row
          :fixedNO="true" ref="dataTable" :data="tableDataList" @sort-change="sortChange" custom-column customKey="JNPFTableKey_978497">
      
          <el-table-column prop="partnerCode" label="客户编码" min-width="150" />
          <el-table-column prop="partnerName" label="客户名称" min-width="150" />
          <el-table-column prop="workOrderNo" label="工作令号" min-width="150" />
          <el-table-column prop="orderNo" label="销售订单号" min-width="180" />
          <el-table-column prop="productsCode" label="产品编码" min-width="150" />
          <el-table-column prop="productsName" label="产品名称" min-width="150" />
          <el-table-column prop="productsDrawingNo" label="型号" min-width="150" />
          <el-table-column prop="productsSpec" label="产品规格型号" min-width="150" />
          <el-table-column prop="mainUnit" label="单位" min-width="150" />
          <el-table-column prop="num" label="订单数量" min-width="150">
            <template slot-scope="scope"> 
              <div>
                {{ scope.row.num ? scope.row.num : 0 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryDate" label="交货日期" min-width="150" />
          <el-table-column prop="outboundQuantity" label="出库数量(主)" min-width="150">
            <template slot-scope="scope"> 
              <div>
                {{ scope.row.outboundQuantity ? scope.row.outboundQuantity : 0 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="inventoryQuantity" label="库存数量" min-width="150">
            <template slot-scope="scope"> 
              <div>
                {{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : 0 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="occupyQuantity" label="占用数量" min-width="150">
            <template slot-scope="scope"> 
              <div>
                {{ scope.row.occupyQuantity ? scope.row.occupyQuantity : 0 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="availableQuantity" label="可用数量" min-width="150">
            <template slot-scope="scope"> 
              <div>
                {{ scope.row.availableQuantity ? scope.row.availableQuantity : 0 }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="warehouseName" label="仓库" min-width="150" /> -->
          <!-- <el-table-column prop="shelfSpaceName" label="货位货架" min-width="150" /> -->

        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="listQuery.partnerCode" placeholder="请输入客户编码" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="工作令号">
              <el-input v-model="listQuery.workOrderNo" placeholder="请输入工作令号" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售订单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入销售订单号" min-width="150" clearable maxlength="50">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productsCode" placeholder="请输入产品编码" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productsName" placeholder="请输入产品名称" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productsDrawingNo" placeholder="请输入型号" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>

      
          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker style="width: 100%;" v-model="listQuery.deliverDateArr" type="daterange" value-format="yyyy-MM-dd" :clearable="false"
                start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期" :picker-options="pickerOptions">
              </el-date-picker>
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

  </div>
</template>
  
<script>
import { getbuyFixedPointPricingList, deletebuyFixedPointPricing, linesbuyFixedPointPricing } from '@/api/purchasingManagement/purchaseInquirySheet'
import { saleOutboundSchedule } from '@/api/reportAnalysis/saleReport.js'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'saleshouseProgress',
  components: { ExportForm },
  data() {
    return {
      exportFormVisible:false,
      title: "更多查询",
      background: true,//分页器背景颜色 
      visible: false,
      tableDataList: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        createByName: "",
        customerProductNo: "",
        deliverDateEnd: "",
        deliverDateStart: "",
        deliverDateArr:[],
        endDate: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        orderDateEnd: "",
        orderDateStart: "",
        orderDateArr: [],
        orderNo: "",
        orderType: "",
        pageNum: 1,
        pageSize: 20,
        partnerGrade: "",
        partnerName: "",
        productsCode: "",
        productsDrawingNo: "",
        productsName: "",
        startDate: "",
        startTime: "",
        startUpdateTime: "",
        totalRowFlag: false,
        workOrderNo: "",
        businessCode:'complete'
      },
      total: 0,
      totalList: [],
      orderTypeList: [
        { label: '内销', value: 'domestic_market' },
        { label: '外贸', value: 'foreign_trade' },
        { label: '总成', value: 'assembly' },
      ],
      beginDate:'',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.beginDate = minDate && minDate.getTime();
          if (maxDate) {
            this.listQuery.deliverDateArr[1] = "";
          }
        },
        disabledDate: (time) => {
          const minTime = new Date(this.beginDate).setMonth(
            new Date(this.beginDate).getMonth() - 6
          );
          const maxTime = new Date(this.beginDate).setMonth(
            new Date(this.beginDate).getMonth() + 6
          );
          return this.beginDate
            ? time.getTime() < minTime || time.getTime() > maxTime
            : false;
        },
      },
      productTypeList:[
        { label: '金工产品', value: 'metalworking' },
        { label: '组装产品', value: 'assemble' },
        { label: '总成产品', value: 'complete' },
      ],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.listQuery.deliverDateArr = this.nearMonth()  //近一个月的日期区间
    this.initData()
  },
  methods: {
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => {return { label: item.label, prop: item.prop }})
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      console.log(data);
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        console.log(includeFieldMap);
        let _data = {
          ...this.listQuery,
          exportType:'1108',
          exportName:'总成销售出库进度查询',
          includeFieldMap,
          pageSize:data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalRowFlag:true,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    // 合计处理
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = this.totalList.map(item => item[column.property] ? Number(item[column.property]) : '');
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          });
          // sums[index] += '';
        } else {
          sums[index] = null;
        }
      });
      return sums;

    },
    // 默认显示近一个月
    nearMonth() {
      const now = new Date(); // 当前日期
      const nowDayOfWeek = now.getDay(); // 今天本周的第几天
      const nowDay = now.getDate(); // 当前日
      const nowMonth = now.getMonth(); // 当前月
      const nowYear = now.getFullYear(); // 当前年 
      let startTime;
      let endTime;
      // 格式化日期为 'yyyy-MM-dd' 的形式
      function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day;
      }
      startTime = new Date(nowYear, nowMonth, nowDay - 30);
      endTime = new Date(nowYear, nowMonth, nowDay);
      return [formatDate(startTime), formatDate(endTime)]
    },
    sortChange({ prop, order }) {
      console.log(prop);
      let newProp;
      if (prop === 'cooperativePartnerCode' || prop === 'cooperativePartnerName' || prop === 'shipperName' || prop === 'createByName' || prop === 'productsName' || prop === 'drawingNo' || prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }

      if (this.activeName === 'dataTable') {
        if (newProp === 'createTime') {
          newProp = 'create_time'
        }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },

    initData() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      this.totalList = []
      this.jnpf.searchTimeFormat(this.listQuery, 'deliverDateArr', 'deliverDateStart', 'deliverDateEnd')
      saleOutboundSchedule(this.listQuery).then(res => {
        console.log(res, '明细查询列表');
        this.tableDataList = res.data.page ?  res.data.page.records : []
        res.data.total ? this.totalList.push(res.data.total) : ''
        this.total = res.data.page ? res.data.page.total : 0
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    search() {
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.listQuery.deliverDateArr = this.nearMonth()  //近一个月的日期区间
      this.initData()
    },
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
  