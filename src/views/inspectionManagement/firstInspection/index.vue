<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 3">
                <el-form-item>
                  <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                    @keyup.enter.native="search('basic')" />

                  <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                    clearable>
                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                    :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                    :type="item.dateType"
                    :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                </el-form-item>
              </el-col>
            </template>
       
          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.workOrder" placeholder="请输入工单号" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.processName" placeholder="请输入工序名称" @keyup.enter.native="search()"
                clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="listQuery.firstInspectionDateArr" type="daterange" value-format="yyyy-MM-dd"
                start-placeholder="请选择首检开始日期" end-placeholder="请选择首检结束日期" :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
         
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addOrUpdateHandle()" />
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" ref="dataTable" :data="tableData" @sort-change="sortChange" custom-column
          fixedNO>
          <el-table-column prop="workOrder" label="工单号" width="200" fixed="left">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true)">
                {{ scope.row.workOrder }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="400" />
          <el-table-column prop="productDrawingNo" label="型号" min-width="400" />
          <el-table-column prop="processName" label="工序名称" sortable="custom" min-width="120" />
          <el-table-column prop="productionQuantity" label="生产数量" min-width="120" />
          <el-table-column prop="firstInspectionDate" label="首检日期" sortable="custom" width="140" />
          <el-table-column prop="inspectorIdName" label="检验员" min-width="120" />
          <el-table-column prop="inspectionResults" label="检验结果" sortable="custom" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.inspectionResults == '1'">通过</div>
              <div v-if="scope.row.inspectionResults == '0'">未通过</div>
            </template>
          </el-table-column>
          <el-table-column prop="problemDescription" label="问题描述" min-width="200" />
          <el-table-column prop="reasonRejection" label="驳回理由" min-width="180" />
          <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" />
          <el-table-column prop="submitDate" label="提交时间" width="180" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center"
            >
            <template slot-scope="scope">
              <el-tag type="warning" disable-transitions v-if="scope.row.documentStatus === 'draft'">草稿</el-tag>
              <el-tag type="success" disable-transitions v-else-if="scope.row.documentStatus === 'submit'">提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center">
            <template slot-scope="scope">
              <el-tag type="warning" disable-transitions
                v-if="scope.row.approvalStatus === 'ing' && scope.row.documentStatus !== 'draft'">审批中</el-tag>
              <el-tag type="success" disable-transitions
                v-else-if="scope.row.approvalStatus === 'ok' && scope.row.documentStatus !== 'draft'">审批通过</el-tag>
              <el-tag type="danger" disable-transitions
                v-else-if="scope.row.approvalStatus === 'rebut' && scope.row.documentStatus !== 'draft'">审批拒绝</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row)" @del="handleDel(scope.row.id)"
                :editDisabled="scope.row.documentStatus === 'submit'"
                :delDisabled="scope.row.documentStatus === 'submit'">
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
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
 
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
  </div>
</template>

<script>
import { getPFIList, deletePFIData } from '@/api/inspectionManagement/productionFirstInspection'
import Form from './Form.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  name:"firstInspection",
  components: { Form,SuperQuery },
  data() {
    return {
      superQueryVisible: false,
     superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'workOrder', fieldValue: '', label: '工单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productsName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
      ], 
      formVisible: false,
      background: true,//分页器背景颜色
      moreQueryVisible: false,
      tableData: [],
      listQuery: {},
      initListQuery: {
        firstInspectionDateStart:"",
        firstInspectionDateEnd:"",
        workOrder:"",
        processName:"",
        productsName:"",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        firstInspectionDateArr: [],
          superQuery: {
          condition: [],
          matchLogic: ""
        },
      },
      listLoading: false,
      total: 0,
      formVisible: false
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    initData() {
      this.jnpf.searchTimeFormat(this.listQuery, 'firstInspectionDateArr', 'firstInspectionDateStart', 'firstInspectionDateEnd')
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      this.moreQueryVisible = false
      getPFIList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })
    },
      superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    search(type) {
        Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
        if (this.initListQuery.firstInspectionDateArr.length) {
        this.listQuery.firstInspectionDateStart = this.initListQuery.firstInspectionDateArr[0]
        this.listQuery.firstInspectionDateEnd = this.initListQuery.firstInspectionDateArr[1]
      } else {
        this.listQuery.firstInspectionDateStart = ""
        this.listQuery.firstInspectionDateEnd = ""
      }
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.listQuery.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.listQuery.superQuery = this.superQuery
      }
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.superForm = this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.searchList = [
          { field: 'workOrder', fieldValue: '', label: '工单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productsName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },

      ]
      this.initData()
    },
    addOrUpdateHandle(row, readOnly) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(row, readOnly, this.listQuery.businessCode) })
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'plasticCapName' || prop === 'processName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletePFIData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />