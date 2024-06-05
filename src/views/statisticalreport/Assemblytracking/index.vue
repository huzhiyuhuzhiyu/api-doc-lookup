<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.producerName" placeholder="请输入操作员" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.workOrderNo" placeholder="请输入工作令号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.dispatchNo" placeholder="请输入派工单号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>
              <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary" icon="el-icon-download" @click="exportForm">导出</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="dataTable" :data="tableDataList" @sort-change="sortChange" custom-column>
          <el-table-column prop="createDate" label="日期" min-width="130" />
          <el-table-column prop="producerName" label="操作员" min-width="110" />
          <el-table-column prop="orderNo" label="派工单号" min-width="180" />
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="200" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" min-width="140" sortable="custom" />
          <el-table-column prop="dispatchQuantity" label="派工数量" min-width="110" sortable="custom" />
          <el-table-column prop="completedQuantity" label="完成数量" min-width="110" sortable="custom" />
          <el-table-column prop="industrialWasteQuantity" label="工废数量" min-width="110" />
          <el-table-column prop="notCompletedQuantity" label="剩余未加工数" min-width="120" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background" :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>
  
<script>
import { getMetalworkingtrackList } from '@/api/statisticalreport/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'Assemblytracking',
  components: { ExportForm },
  data() {
    return {
      exportFormVisible: false,
      background: true,//分页器背景颜色 
      tableDataList: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        workOrderNo:"",
        producerName: "",
        dispatchNo: "",
        productDrawingNo: "",
        endDate: "",
        startDate: "",
        businessCode: 'assemble',
        pageNum: 1,
        pageSize: 20,
        deliverDateArr: [],
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": ""
          }
        ]
      },
      total: 0,
      totalList: [],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.listQuery.deliverDateArr = this.nearMonth()  //近2个月的日期区间
    this.initData()
  },
  methods: {
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
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
          exportType: '1112',
          exportName: '生产报表-派工单组装跟踪报表',
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
    // 默认显示近一个月
    nearMonth() {
      const now = new Date(); // 当前日期
      const nowDay = now.getDate(); // 当前日
      const nowMonth = now.getMonth(); // 当前月
      const nowYear = now.getFullYear(); // 当前年 
      let startDate;
      let endDate;
      // 格式化日期为 'yyyy-MM-dd' 的形式
      function formatDate(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day;
      }
      startDate = new Date(nowYear, nowMonth, nowDay - 60);
      endDate = new Date(nowYear, nowMonth, nowDay);
      return [formatDate(startDate), formatDate(endDate)]
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productDrawingNo' || prop === 'processName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      this.totalList = []
      this.jnpf.searchTimeFormat(this.listQuery, 'deliverDateArr', 'startDate', 'endDate')
      getMetalworkingtrackList(this.listQuery).then(res => {
        console.log(res, '查询列表');
        this.tableDataList = res.data.page ? res.data.page.records : []
        res.data.total ? this.totalList.push(res.data.total) : ''
        this.total = res.data.page ? res.data.page.total : 0
        this.listLoading = false
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
      this.listQuery.deliverDateArr = this.nearMonth()  //近2个月的日期区间
      this.initData()
    },
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
  