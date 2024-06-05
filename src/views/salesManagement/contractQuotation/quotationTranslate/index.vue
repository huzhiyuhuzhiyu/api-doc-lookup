<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.orderNo" placeholder="请输入申请单号" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.processStatus" placeholder="请选择处理状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in processStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="listQuery.startAndEndTimeArr" type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;"
                start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" :picker-options="global.timePickerOptions">
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
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
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
          <el-table-column prop="orderNo" label="申请单号" min-width="200">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'look')">
                {{ scope.row.orderNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="applyDesc" label="申请说明" min-width="200" />
          <el-table-column prop="processDate" label="处理时间" width="180" />
          <el-table-column prop="processName" label="处理人" width="120" />
          <el-table-column prop="processDesc" label="处理说明" min-width="200" />
          <el-table-column prop="submitDate" label="提交时间" width="180" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
              <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="processStatus" label="处理状态" width="120" sortable="custom" align="center" fixed="right">
            <template slot-scope="{row}">
              <el-tag type="warning" disable-transitions v-if="row.processStatus == 'processing'">待处理</el-tag>
              <el-tag type="success" disable-transitions v-else-if="row.processStatus == 'processed'">已处理</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row, 'edit')" @del="handleDel(scope.row.id)"
                :editDisabled="scope.row.documentStatus === 'submit'"
                :delDisabled="scope.row.documentStatus === 'submit'">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="申请单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入申请单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理状态">
              <el-select v-model="listQuery.processStatus" placeholder="请选择处理状态" clearable style="width: 100%;">
                <el-option v-for="item in processStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;">
                <el-option v-for="item in global.documentStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理时间">
              <el-date-picker v-model="listQuery.processDateArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择处理开始时间"
                end-placeholder="请选择处理结束时间" :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTimeArr" type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;"
                start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" :picker-options="global.timePickerOptions">
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

    <Form v-if="formVisible" ref="Form" @close="closeForm" />

  </div>
</template>
  
<script>
import {
  getQuotaionTranslateList,
  deleteQuotaionTranslateData
} from '@/api/salesManagement/quotationTranslate.js'
import Form from './Form.vue'
export default {
  components: { Form },
  data() {
    return {
      visible: false,
      tableData: [],
      listQuery: {},
      initListQuery: {
        documentStatus: "", // 单据状态
        createByName: '', //	创建人名称
        endTime: '', //	创建结束时间（yyyy-MM-dd HH:mm:ss）
        orderNo: '', //	单号
        processEndDate: '', //	处理时间-结束			
        processStartDate: '', //	处理时间-开始			
        processStatus: '', //	处理状态,可用值:processed,processing			
        productionOrderNo: '', //	生产订单号			
        startTime: '', //	创建开始时间（yyyy-MM-dd HH:mm:ss）
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        processDateArr: [],
        startAndEndTimeArr: []
      },
      listLoading: false,
      total: 0,
      formVisible: false,
      processStatusList: [
        { label: '待处理', value: 'processing' },
        { label: '已处理', value: 'processed' }
      ]
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    initData() {
      this.visible = false
      this.listLoading = true
      getQuotaionTranslateList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.listQuery = this.jnpf.searchTimeFormat(this.listQuery, 'processDateArr', 'processStartDate', 'processEndDate')
      this.listQuery = this.jnpf.searchTimeFormat(this.listQuery, 'startAndEndTimeArr', 'startTime', 'endTime')
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },
    addOrUpdateHandle(row, btnType) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(row, btnType || 'add') })
    },
    sortChange({ prop, order }) {
      let newProp
      if ([].includes(prop)) { newProp = prop }
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
        deleteQuotaionTranslateData(id).then(res => {
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