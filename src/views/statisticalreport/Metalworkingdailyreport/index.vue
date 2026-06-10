<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.equipmentCode" placeholder="请输入设备编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.producerName" placeholder="请输入操作员" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.dispatchNo" placeholder="请输入派工单号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入型号" clearable @keyup.enter.native="search()" />
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
        <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="dataTable" :data="tableDataList" @sort-change="sortChange" custom-column customKey="JNPFTableKey_392062">
          <el-table-column prop="reportingDate" label="日期" min-width="130" />
          <el-table-column prop="equipmentCode" label="设备编码" min-width="150" sortable="custom" />
          <el-table-column prop="producerName" label="操作员" min-width="110" />
          <el-table-column prop="dispatchNo" label="派工单号" min-width="180" />
          <el-table-column prop="productDrawingNo" label="型号" min-width="200" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" min-width="140" sortable="custom" />
          <el-table-column prop="dispatchQuantity" label="派工数量" min-width="110" sortable="custom" />
          <el-table-column prop="producerReportNum" label="完成数量" min-width="110" sortable="custom" />
          <el-table-column prop="producerMaterialWasteQuantity" label="料废" min-width="110" />
          <el-table-column prop="producerIndustrialWasteQuantity" label="工废数量" min-width="110" />
          <el-table-column prop="upTime" label="上线时间" min-width="180" />
          <el-table-column prop="downTime" label="下线时间" min-width="180" />
          <el-table-column prop="standardProductionCapacity" label="标准产能" min-width="110" />
          <el-table-column prop="actualProductionCapacity" label="实际产能" min-width="110" />
          <el-table-column prop="completeRate" label="完成率(%)" min-width="100" />
          <el-table-column prop="producerWages" label="计件薪资" min-width="100" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background" :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>
  
<script>
import { getreportList } from '@/api/statisticalreport/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'Metalworkingdailyreport',
  components: { ExportForm },
  data() {
    return {
      exportFormVisible: false,
      background: true,//分页器背景颜色 
      tableDataList: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        equipmentCode: "",
        producerName: "",
        dispatchNo: "",
        productDrawingNo: "",
        reportStartDate:"",
        reportEndDate:"",
        businessCode: 'metalworking',
        pageNum: 1,
        pageSize: 20,
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
          exportType: '1110',
          exportName: '生产报表-金工生产日报表',
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
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productDrawingNo' || prop === 'equipmentCode' || prop === 'processName' || prop ==='producerReportNum') {
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
      this.listQuery.reportStartDate=this.jnpf.getToday()
      this.listQuery.reportEndDate=this.jnpf.getToday()
      getreportList(this.listQuery).then(res => {
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
      this.initData()
    },
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
  