<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="请输入模板名称" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" @keyup.enter.native="search()"
                clearable />
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
          <topOpts @add="addOrUpdateHandle()">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDel(selectedData)">批量删除</el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableData" @sort-change="sortChange" custom-column
          fixedNO hasC @selection-change="currentChange">
          <el-table-column prop="name" label="模板名称" min-width="180" sortable="custom" />
          <el-table-column prop="objectType" label="类型" width="180" :formatter="typeFormat" />
          <el-table-column prop="partnerCode" label="客户编码" min-width="180" />
          <el-table-column prop="partnerName" label="客户名称" min-width="180" sortable="custom" />
          <el-table-column prop="productionOrderNo" label="生产订单号" min-width="200" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column label="操作" width="90" fixed="right">
            <template slot-scope="scope">
              <tableOpts :hasEdit="false" @del="handleDel(scope.row.id)" />
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
            <el-form-item label="模板名称">
              <el-input v-model="listQuery.name" placeholder="请输入模板名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="listQuery.objectType" placeholder="请选择类型" filterable clearable>
                <el-option v-for="(item, index) in objectTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="listQuery.partnerCode" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产订单号">
              <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
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
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
  </div>
</template>
  
<script>
import {
  getLabelPrintTemplateList,
  addOrUpdateBatchLPTData,
  delBatchLPTData,
  detailLabelPrintTemplateData
} from '@/api/basicData/index.js'
import Form from './Form.vue'
export default {
  components: { Form },
  data() {
    return {
      visible: false,
      objectTypeList: [{ label: '客户', value: 'custom' }, { label: '生产订单', value: 'produce_order' }],
      formVisible: false,
      tableData: [],
      listQuery: {},
      initListQuery: {
        templateType:'cutting',
        name: '',
        partnerName: '',
        productionOrderNo: '',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      listLoading: false,
      total: 0,
      selectedData: [],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      getLabelPrintTemplateList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    sortChange({ prop, order }) {
      let newProp
      if (['partnerName', 'productionOrderNo'].includes(prop)) { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.search()
    },
    search() {
      this.visible = false
      this.jnpf.searchTimeFormat(this.listQuery, 'startAndEndTime', 'startTime', 'endTime')
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
      this.search()
    },
    addOrUpdateHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType || 'add')
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },
    handleDel(id) {
      if (!Array.isArray(id)) id = [id]
      else {
        if (!id.length) return this.$message.error('请先选择要删除的数据')
        else id = id.map(row => row.id)
      }
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delBatchLPTData(id).then(res => {
          this.search()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    typeFormat(row) {
      if (row.objectType === 'custom') return '客户'
      return '生产订单'
    },
    currentChange(data) {
      this.selectedData = data
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />