<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-date-picker v-model="listQuery.month" type="month" value-format="yyyy-MM" style="width: 100%;"
                  :clearable='false' placeholder="请选择月份" popper-class="date_form">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.producerName" @keyup.enter.native="search()" placeholder="请输入生产人"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.producerJobNumber" @keyup.enter.native="search()" placeholder="请输入生产人员工号"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="listQuery.state" placeholder="请选择工资状态" :clearable="true">
                  <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
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
          <div class="JNPF-common-head">
            <div>
              <!-- <el-button type="primary" @click="recalculate()">重新计算异常工资</el-button> -->
              <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download" @click="exportForm"
                :disabled="!tableData.length">导出</el-button>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="$refs.dataTable.showDrawer()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :hasC="false" :data="tableData" :fixedNO="true"
            :checkSelectable="(row) => row.state != '0'" @sort-change="sortChange"
            @selection-change="handeleProductInfoData" custom-column :show-summary="false"
            :summary-method="getSummaries" :setColumnDisplayList="setColumnDisplayList">

            <el-table-column prop="producerJobNumber" label="生产人工号" min-width="180" />
            <el-table-column prop="producerName" label="生产人名称" min-width="120" />
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="250" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom" />
              <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom" />
            <el-table-column prop="processCode" label="工序编码" min-width="160" sortable="custom" />
            <el-table-column prop="reportingType" label="报工类型" min-width="110" sortable="custom">
              <template slot-scope="scope">
                <div v-for="(item, index) in reportingTypeList" :key="index">
                  <span v-if="item.value == scope.row.reportingType">{{ item.label }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="inspectionObject" label="检验对象" min-width="110" sortable="custom">
              <template slot-scope="scope">
                <div v-for="(item, index) in inspectionObjectList" :key="index">
                  <span v-if="item.value == scope.row.inspectionObject">{{ item.label }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="pricingType" label="计价类型" min-width="110" sortable="custom">
              <template slot-scope="scope">
                <div v-for="(item, index) in pricingTypeList" :key="index">
                  <span v-if="item.value == scope.row.pricingType">{{ item.label }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="timePrice" label="单价(元)" min-width="140">
              <template slot-scope="scope">
                <div v-if="scope.row.pricingType == 'by_time'"
                  :style="{ color: Number(scope.row.timePrice) <= 0 ? 'red' : '' }">{{ scope.row.timePrice }}</div>
                <div v-else-if="scope.row.pricingType == 'by_piece'"
                  :style="{ color: Number(scope.row.unitPrice) <= 0 ? 'red' : '' }">{{ scope.row.unitPrice }}</div>
                <div v-else>无计价类型</div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="timePrice" label="单价(元)" min-width="140">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.pricingType == 'by_time'" v-model="scope.row.timePrice"
                  @input="watchNum(scope.row, scope.$index)" @blur="blurFun(scope.row, scope.$index)" maxlength="22"
                  pattern="\d{1,18}(\.\d{0,2})?"></el-input>
                  <el-input v-if="scope.row.pricingType == 'by_piece'" v-model="scope.row.unitPrice"
                  @input="watchNum(scope.row, scope.$index)" @blur="blurFun(scope.row, scope.$index)" maxlength="22"
                  pattern="\d{1,18}(\.\d{0,2})?"></el-input>
                </template>
              </el-table-column> -->
            <el-table-column prop="reportingQuantity" label="报工合格数量" min-width="160" sortable="custom" />
            <!-- <el-table-column prop="reportingWages" label="报工金额" min-width="140" sortable="custom" /> -->
            <el-table-column prop="reportingWages" label="工资(元)" min-width="140" sortable="custom">
              <template slot-scope="scope">
                <div :style="{ color: Number(scope.row.reportingWages) <= 0 ? 'red' : '' }">{{
                  scope.row.reportingWages }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="reportingTime" label="报工时间" min-width="180" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="140" sortable="custom" />
            <el-table-column prop="aperture" label="孔径" min-width="140" sortable="custom" />
            <el-table-column prop="orderNo" label="工单单号" min-width="200" sortable="custom" />

          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData">
            <span style="font-weight:500;margin-right:10px">数量总计：{{ totalData.reportingQuantity }}</span>
            <span style="font-weight:500;margin-right:10px">工资总计：{{ totalData.reportingWages }}</span>
          </pagination>
        </div>
      </div>

    </div>

    <!-- <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" /> -->
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />

  </div>
</template>

<script>
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { getSalaryWagesDetailList } from '@/api/salaryManagement'
import { mapGetters } from "vuex"
// import Form from './Form'
export default {
  name: 'mySalary',
  components: { ExportForm },
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() {
    return {
      formVisible: false,
      total: 0,
      stateList: [
        // { value: "", label: "所有" },
        { value: 0, label: "正常" },
        { value: 1, label: "异常" },
      ],
      listQuery: {},
      initListQuery: {
        month: this.jnpf.getToday('YYYY-MM'),
        producerName: "",
        producerJobNumber: "",
        state: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "reporting_time"
        }],
      },
      reportingTypeList: [
        { value: "normal", label: "正常报工", },
        { value: "inspection", label: "检验报工", }
      ],
      inspectionObjectList: [
        { label: '人工检验', value: 'manual' },
        { label: '机器检验', value: 'machines' }
      ],
      pricingTypeList: [
        { value: "by_time", label: "计时", },
        { value: "by_piece", label: "计件", }
      ],
      listLoading: false,
      tableData: [],
      title: "更多查询",
      producerIdList: [],
      exportFormVisible: false,
      totalData: {},
      setColumnDisplayList: [
        'producerJobNumber',
        // 'producerName',
        // 'productDrawingNo',
        'productName',
        'productCode',
        // 'processName',
        // 'processCode',
        // 'pricingType',
        // 'timePrice',
        // 'reportingQuantity',
        // 'reportingWages',
        // 'reportingTime',
        'vibrationLevel',
        'aperture',
        'orderNo',
      ],
    }
  },
  created() {
    this.initListQuery.producerId = this.userInfo.userId
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    handeleProductInfoData(val) {
      this.producerIdList = val.map(item => item.id);
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode' || prop === 'productName' || prop === 'productSpec' || prop === 'processName'
        || prop === 'productDrawingNo'
        || prop === 'productName'
        || prop === 'productCode'
        || prop === 'processCode'
      ) { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    search() {
      this.listQuery.pageNum = 1
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      getSalaryWagesDetailList(this.listQuery).then(res => {
        this.tableData = res.data.page.records
        this.total = res.data.page.total
        this.totalData = res.data.total || {}
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
      this.search()
    },

    addOrUpdateHandle(id, month) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, month)

        })
        // }, 600);
      }
    },
    // 合计处理
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0 || true) {
          sums[index] = '总计';
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
    //导出
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
          exportType: '1238',
          exportName: '工资明细',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url, res.data.name)
        }).catch(() => { })
      }
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />