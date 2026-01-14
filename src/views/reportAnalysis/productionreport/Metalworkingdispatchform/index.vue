<!-- 金工派工单跟踪报表 -->
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker v-model="createDate" type="daterange" value-format="yyyy-MM-dd" :clearable="false" start-placeholder="创建开始日期" end-placeholder="创建结束日期" @change="changePicker" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.productName" @keydown.enter.native="search()" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.productDrawingNo" @keydown.enter.native="search()" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
              <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table ref="dataTable" show-summary :summary-method="getSummaries" v-loading="listLoading" :data="tableData" custom-column :fixedNO="true" customKey="JNPFTableKey_167482">
          <el-table-column prop="orderNo" label="派工单号" min-width="180" />
          <el-table-column prop="productCode" label="产品编码" min-width="180">
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="180" />
          <el-table-column prop="productDrawingNo" label="型号" min-width="160" />
          <el-table-column prop="productSpec" label="产品规格型号" min-width="180" />
          <el-table-column prop="mainUnit" label="单位" min-width="120" />
          <el-table-column prop="dispatchQuantity" label="派工数量" min-width="140" />
          <el-table-column prop="completedQuantity" label="完工数量" min-width="140" />
          <el-table-column prop="notCompletedQuantity" label="未完工数" min-width="140" />
          <el-table-column prop="materialCode" label="材料编码" min-width="180" />
          <el-table-column prop="materialName" label="材料名称" min-width="180" />
          <el-table-column prop="materialDrawingNo" label="材料图号" min-width="160" />
          <el-table-column prop="materialSpec" label="材料规格型号" min-width="180" />
          <el-table-column prop="materialMainUnit" label="材料单位" min-width="120" />
          <el-table-column prop="materialsUsedQuantity" label="需求数量" min-width="140" />
          <!-- <el-table-column prop="receivedQuantity" label="已领料数量" min-width="140">
            <template slot-scope="scope">
              <div>{{ scope.row.receivedQuantity ? scope.row.receivedQuantity : 0 }}</div>
            </template>
          </el-table-column> -->
          <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" />
          <el-table-column prop="planEndDate" label="计划完成日期" min-width="160" />
          <el-table-column prop="productionOrderNo" label="生产订单号" min-width="180" />
          <el-table-column prop="workOrderNo" label="工作令号" min-width="180" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column prop="createDate" label="创建日期" min-width="160" />
        </JNPF-table>
        <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize" @pagination="initData" />
      </div>
    </div>
    <!-- 更多搜索 -->
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <el-form :model="dataForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="派工单号">
              <el-input v-model="dataForm.dispatchNo" placeholder="请输入派工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="dataForm.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="dataForm.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="dataForm.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料编码">
              <el-input v-model="dataForm.materialCode" placeholder="请输入材料编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料名称">
              <el-input v-model="dataForm.materialName" placeholder="请输入材料名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料图号">
              <el-input v-model="dataForm.materialDrawingNo" placeholder="请输入材料图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建日期">
              <el-date-picker v-model="createDate" type="daterange" value-format="yyyy-MM-dd" :clearable="false" start-placeholder="请选择创建开始日期" end-placeholder="请选择创建结束日期" @change="changePicker" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>
  
<script>
import { getdispatchlist } from '@/api/reportAnalysis/saleReport'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'Metalworkingdispatchform',
  components: { ExportForm },
  data() {
    return {
      exportFormVisible: false,
      createDate: [],
      limit: 0,
      visible: false,
      tableData: [],
      listLoading: false,
      dataForm: {},
      dataFormlist: {
        businessCode: 'metalworking',
        productSource: 'produce',
        startDate: '',
        dispatchNo: '',
        endDate: '',
        productCode: '',
        productName: '',
        productDrawingNo: '',
        materialDrawingNo: '',
        materialCode: '',
        materialName: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }],
      },
      total: 0,
      totalList: [],
      beginDate: '',
      //时间限制
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.beginDate = minDate && minDate.getTime();
          if (maxDate) {
            this.createDate[1] = "";
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
        }
      }
    }
  },
  created() {
    this.dataForm = JSON.parse(JSON.stringify(this.dataFormlist))
    this.createDate = this.nearMonth()  //近一个月的日期区间
    this.initData()
  },
  methods: {
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
        } else {
          sums[index] = null;
        }
      });
      return sums;
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
          ...this.dataForm,
          exportType: '1112',
          exportName: '金工派工单跟踪报表',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.dataForm.pageSize : -1,
          totalRowFlag: true,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    changePicker() {
      this.beginDate = ''
    },
    // 默认显示近一个月
    nearMonth() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [this.jnpf.dateFormat(start, 'YYYY-MM-DD'), this.jnpf.dateFormat(end, 'YYYY-MM-DD')]
    },
    // sortChange ({ prop, order }) {
    //   let newProp;
    //   if (prop === 'partnerCode' || prop === 'partnerName') {
    //     newProp = prop
    //   } else {
    //     newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
    //   }
    //   this.dataForm.orderItems[0].asc = order === "ascending"
    //   this.dataForm.orderItems[0].column = order === null ? "" : newProp
    //   this.initData()
    // },
    search() {
      this.dataForm.pageNum = 1
      this.initData()
    },
    initData() {
      this.jnpf.searchTimeFormat(this.dataForm, this.createDate, 'startDate', 'endDate')
      Object.keys(this.dataForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.dataForm[key]
        this.dataForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.totalList = []
      this.listLoading = true
      getdispatchlist(this.dataForm).then(res => {
        this.tableData = res.data.page.records
        this.total = res.data.page.total
        if (res.data.total) this.totalList.push(res.data.total)
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
        this.visible = false
      })
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.dataForm = JSON.parse(JSON.stringify(this.dataFormlist))
      this.createDate = this.nearMonth()  //近一个月的日期区间
      this.initData()
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
.JNPF-common-search-box {
  padding: 8px 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}
</style>