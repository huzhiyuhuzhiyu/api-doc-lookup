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
            <el-col :span="4">
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
          <div class="JNPF-common-head">
            <div>
              <el-button type="primary" size="mini" @click="recalculate()">重新计算异常工资</el-button>
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
          <JNPF-table ref="dataTable" v-loading="listLoading" hasC :data="tableData" 
            :checkSelectable="(row) => row.state != '0'" @sort-change="sortChange"
            @selection-change="handeleProductInfoData" custom-column :show-summary="false"
            :summary-method="getSummaries" customKey="JNPFTableKey_274788">
            <!-- <el-table-column prop="producerJobNumber" label="生产人工号" sortable="custom" /> -->
            <el-table-column prop="producerName" label="生产人" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.producerId, listQuery.month)">{{
                  scope.row.producerName
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="month" label="月份" />
            <el-table-column prop="wages" label="工资" sortable="custom" >  </el-table-column>
            <el-table-column prop="state" label="工资状态" sortable="custom">
              <template slot-scope="scope">
                <div v-for="(item, index) in stateList" :key="index">
                  <span v-if="item.value === scope.row.state" :style="scope.row.state == 1 ? 'color:red' : ''">{{
                    item.label
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" >
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click="addOrUpdateHandle(scope.row.producerId, listQuery.month)">查看明细</el-button>

              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData">
            工资总计：{{ totalData.wages }}
          </pagination>
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />

  </div>
</template>

<script>
import { updateSalaryList, getMonthSalaryReportList } from '@/api/salaryManagement'
import Form from './Form'
import ExportForm from '@/components/no_mount/ExportBox/index.vue';
import { excelExport } from '@/api/basicData';
export default {
  name: 'pieceRateWage',
  components: { Form, ExportForm },
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
          asc: true,
          column: "state"
        }, {
          asc: true,
          column: "producerJobNumber"
        }],
      },
      listLoading: false,
      tableData: [],
      title: "更多查询",
      producerIdList: [],
      exportFormVisible: false,
      totalData: {},
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },


  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    handeleProductInfoData(val) {
      this.producerIdList = val.map(item => item.producerId);
    },
    recalculate() {
      if (!this.producerIdList.length) return this.$message.error("请先选择数据")
      let obj = {
        month: this.listQuery.month,
        producerIdList: this.producerIdList
      }
      updateSalaryList(obj).then(res => {
        console.log("res",);
        this.$message.success("重新计算异常工资成功")
        this.selectArr = []
        this.initData()
      })
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'producerJobNumber' || prop === 'producerName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.listQuery.orderItems[0].asc = order === "ascending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    dataFormSubmit() {
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
      getMonthSalaryReportList(this.listQuery).then(res => {
    


        this.tableData = res.data.page.records
      
        this.total = res.data.page.total
        this.totalData = res.data.total || {}
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    

    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

      this.listQuery = {
        month: this.jnpf.getToday('YYYY-MM'),
        producerName: "",
        producerJobNumber: "",
        state: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }],

      }

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
          exportType: '1242',
          exportName: '工资',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalRowFlag: true,
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