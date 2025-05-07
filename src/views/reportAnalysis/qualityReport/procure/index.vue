<template>
  <!-- 组装 -->

  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="inspectDate" type="daterange" value-format="yyyy-MM-dd" :clearable="false"
                start-placeholder="请选择检验开始日期" end-placeholder="请选择检验结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.partnerName" placeholder="请输入供应商名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productsDrawingNo" placeholder="请输入产品图号" clearable
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
              <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>

        </el-form>
      </el-row>

      <div class="JNPF-common-layout-main JNPF-flex-main">

        <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="dataTable" :data="tableDataList"
          custom-column customKey="JNPFTableKey_649177">
          <el-table-column prop="inspectionDate" label="检验日期" min-width="180"> </el-table-column>
          <el-table-column prop="weekIndex" label="周" min-width="180"> </el-table-column>
          <el-table-column prop="partnerCode" label="供应商编码" min-width="180"> </el-table-column>
          <el-table-column prop="partnerName" label="供应商名称" min-width="180"> </el-table-column>
          <el-table-column prop="productsCode" label="产品编码" min-width="180"> </el-table-column>
          <el-table-column prop="productsName" label="产品名称" min-width="180"> </el-table-column>
          <el-table-column prop="productsDrawingNo" label="产品图号" min-width="180"> </el-table-column>
          <el-table-column prop="mainUnit" label="单位" min-width="180"> </el-table-column>
          <el-table-column prop="receivedQuantity" label="来货数量" min-width="180"> </el-table-column>
          <el-table-column prop="inspectionMethod" label="检验类型" min-width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.inspectionMethod == 'exempt'">免检</div>
              <div v-if="scope.row.inspectionMethod == 'spot_check'">抽检</div>
              <div v-if="scope.row.inspectionMethod == 'all'">全检</div>
            </template>
          </el-table-column>
          <el-table-column prop="inspectionQuantity" label="检验数量" min-width="150" />
          <el-table-column prop="inspectionResults" label="检验结果" min-width="150">
            <template slot-scope="scope">
              <!-- <div v-if="scope.row.inspectionResults == 'discard'">报废</div>
              <div v-if="scope.row.inspectionResults == 'partially_discard'">部分报废</div>
              <div v-if="scope.row.inspectionResults == 'partially_qualified'">部分合格</div> -->
              <div v-if="scope.row.inspectionResults == 'qualified'">合格</div>
              <div v-if="scope.row.inspectionResults == 'unqualified'">不合格</div>
            </template>
          </el-table-column>
          <el-table-column prop="treatmentResults" label="处理结果" min-width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.treatmentResults == 'discard'">报废</div>
              <div v-if="scope.row.treatmentResults == 'concessive_acceptance'">让步接收</div>
              <div v-if="scope.row.treatmentResults == 'select'">挑选</div>
              <div v-if="scope.row.treatmentResults == 'qualified'">合格</div>
              <div v-if="scope.row.treatmentResults == 'unqualified'">不合格</div>
            </template>
          </el-table-column>
          <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="150" />
          <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="150" />
          <el-table-column prop="lossUnitPrice" label="损失单价" min-width="150" />
          <el-table-column prop="lossAmount" label="损失金额" min-width="150" />
          <el-table-column prop="otherLossAmount" label="其他损失金额" min-width="150" />
          <el-table-column prop="totalLossAmount" label="损失金额合计" min-width="150" />
          <el-table-column prop="claimAmount" label="索赔金额" min-width="150" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />

      </div>
      <div style="height: 40px; line-height: 40px; background: #f5f7fa;text-align:end" class="text">
        <span style="font-weight:500;margin-right:10px">总来货数量：{{ totalData.receivedQuantity }}</span>
        <span style="font-weight:500;margin-right:10px">总检验数量：{{ totalData.inspectionQuantity }}</span>
        <span style="font-weight:500;margin-right:10px">总合格数量：{{ totalData.qualifiedQuantity }}</span>
        <span style="font-weight:500;margin-right:10px">总不合格数量：{{ totalData.unqualifiedQuantity }}</span>
        <span style="font-weight:500;margin-right:10px">总损失金额：{{ totalData.lossAmount }}</span>
        <span style="font-weight:500;margin-right:10px">总其他损失金额：{{ totalData.otherLossAmount }}</span>
        <span style="font-weight:500;margin-right:10px">总损失金额合计：{{ totalData.totalLossAmount }}</span>
        <span style="font-weight:500;margin-right:10px">总索赔金额：{{ totalData.claimAmount }}</span>
      </div>
    </div>
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="检验日期">
              <el-date-picker v-model="inspectDate" type="daterange" value-format="yyyy-MM-dd" :clearable="false"
                start-placeholder="请选择检验开始日期" end-placeholder="请选择检验结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商编码">
              <el-input v-model="listQuery.partnerCode" placeholder="请输入供应商编码" min-width="150" clearable maxlength="50">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="listQuery.partnerName" placeholder="请输入供应商名称" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productsCode" placeholder="请输入产品编码" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productsName" placeholder="请输入产品名称" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productsDrawingNo" placeholder="请输入产品图号" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来货数量">
              <el-input v-model="listQuery.receivedQuantity" placeholder="请输入来货数量" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验类型">
              <el-select v-model="listQuery.inspectionMethod" placeholder="请选择检验类型" clearable style="width: 100%;">
                <el-option v-for="(item, index) in inspectionMethodList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="检验结果">
              <el-select v-model="listQuery.inspectionResults" placeholder="请选择检验结果" clearable style="width: 100%;">
                <el-option v-for="(item, index) in inspectionResultsList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理结果">
              <el-select v-model="listQuery.treatmentResults" placeholder="请选择处理结果" clearable style="width: 100%;">
                <el-option v-for="(item, index) in treatmentResultsList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
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
import { getProduceReportList } from '@/api/reportAnalysis/qualityReport.js'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'purOrderLineQuery',
  components: { ExportForm },
  data() {
    return {
      totalData: {
        receivedQuantity: "",
        inspectionQuantity: "",
        qualifiedQuantity: "",
        unqualifiedQuantity: "",
        lossAmount: "",
        otherLossAmount: "",
        totalLossAmount: "",
        claimAmount: "",
      },
      totalDataCopy: {
        receivedQuantity: 0,
        inspectionQuantity: 0,
        qualifiedQuantity: 0,
        unqualifiedQuantity: 0,
        lossAmount: 0,
        otherLossAmount: 0,
        totalLossAmount: 0,
        claimAmount: 0,
      },
      inspectDate: [],
      exportFormVisible: false,
      title: "更多查询",
      background: true,//分页器背景颜色 
      visible: false,
      tableDataList: [],
      listLoading: false,
      listQuery: {},
      inspectionResultsList: [
        { label: "合格", value: "qualified" },
        { label: "不合格", value: "unqualified" },
      ],
      inspectionMethodList: [
        { label: "免检", value: "exempt" },
        { label: "抽检", value: "spot_check" },
        { label: "全检", value: "all" },
      ],
      treatmentResultsList: [
        { label: '合格', value: 'qualified' }, 
        { label: '不合格', value: 'unqualified' }, 
        { label: '让步接收', value: 'concessive_acceptance' }, 
        { label: '报废', value: 'discard' }, 
        { label: '挑选', value: 'select' }
      ],
      initListQuery: {
        "businessCode": "",
        "createByName": "",
        "endTime": "",
        "endUpdateTime": "",
        "inspectDateEnd": "",
        "inspectDateStart": "",
        "inspectionMethod": null,
        "inspectionResults": null,
        treatmentResults:null,
        "keyword": "",
        "orderItems": [
          {
            "asc": true,
            "column": ""
          }
        ],
        "pageNum": 1,
        "pageSize": 20,
        "partnerCode": "",
        "partnerName": "",
        "receivedQuantity": null,
        "productsCode": "",
        "productsDrawingNo": "",
        "productsName": "",
        "startTime": "",
        "startUpdateTime": "",
      },
      total: 0,
      totalList: [],
      pickerOptions: {
        disabledDate(time) {
          // 获取当前日期
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // 获取6个月前的日期
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          sixMonthsAgo.setHours(0, 0, 0, 0);
          // 如果选择的日期范围超过6个月，或者结束日期不是当前日期，则禁用
          return time.getTime() < sixMonthsAgo;
        }
      },

    }
  },
  created() {
    let endDate = new Date().toISOString().slice(0, 10);
    let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10);
    this.inspectDate[0] = startDate
    this.inspectDate[1] = endDate
    this.initListQuery.inspectDateStart = startDate
    this.initListQuery.inspectDateEnd = endDate
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
          exportType: '1115',
          exportName: '采购收货检验查询',
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


    initData() {
      this.listQuery.inspectDateStart = this.inspectDate[0]
    this.listQuery.inspectDateEnd = this.inspectDate[1]
      console.log("inspectDate",this.inspectDate);
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      this.totalList = []
      getProduceReportList(this.listQuery).then(res => {
        console.log('组装列表', res);
        this.tableDataList = res.data.page.records
        console.log("this.tableDataList", this.tableDataList);
        this.total = res.data.page.total
        this.listLoading = false
        this.totalData = res.data.total ? res.data.total : this.totalDataCopy
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
      let endDate = new Date().toISOString().slice(0, 10);
      let startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10);
      let arr=[]
      arr[0] = startDate
      arr[1] = endDate
      this.inspectDate=arr
      this.$forceUpdate()
      this.initListQuery.inspectDateStart = startDate
      this.initListQuery.inspectDateEnd = endDate
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

      this.initData()
    },
  }
}
</script>
  
  <style src="@/assets/scss/index-list.scss" lang="scss" scoped />
    