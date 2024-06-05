<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.orderNo" placeholder="请输入异常单号" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.abnormalTypeId" placeholder="请选择异常类型" clearable style="width: 100%;"
                @change="abnormalTypeChange">
                <el-option v-for="(item, index) in abnormalTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.abnormalContentId" placeholder="请选择异常内容" clearable style="width: 100%;">
                <el-option v-for="(item, index) in abnormalContentList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
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
          <el-table-column prop="orderNo" label="异常单号" min-width="220" />
          <el-table-column prop="abnormalTypeName" label="异常类型" min-width="120" />
          <el-table-column prop="abnormalContentName" label="异常内容" min-width="120" />
          <el-table-column prop="equipmentName" label="设备名称" min-width="200" />
          <el-table-column prop="productionOrderNo" label="生产订单编号" min-width="200" />
          <el-table-column prop="abnormalDescription" label="处理描述" min-width="200" />
          <el-table-column prop="processDate" label="处理时间" width="180" />
          <el-table-column prop="personName" label="处理人员" min-width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column prop="processStatus" label="处理状态" width="120" align="center" fixed="right">
            <template slot-scope="{row}">
              <el-tag type="warning" disable-transitions v-if="row.processStatus == 'processing'">待处理</el-tag>
              <el-tag type="success" disable-transitions v-else-if="row.processStatus == 'processed'">已处理</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row, 'edit')" @del="handleDel(scope.row.id)" editText="处理"
                :editDisabled="scope.row.processStatus === 'processed'"></tableOpts>
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
            <el-form-item label="异常单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入异常单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异常类型">
              <el-select v-model="listQuery.abnormalTypeId" placeholder="请选择异常类型" clearable style="width: 100%;"
                @change="abnormalTypeChange">
                <el-option v-for="item in abnormalTypeList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异常内容">
              <el-select v-model="listQuery.abnormalContentId" placeholder="请选择异常内容" clearable style="width: 100%;">
                <el-option v-for="item in abnormalContentList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称">
              <el-input v-model="listQuery.equipmentName" placeholder="请输入设备名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产订单编号">
              <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单编号" clearable />
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
            <el-form-item label="处理时间">
              <el-date-picker v-model="listQuery.processTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
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
import { getAbnoramlData, deleteAbnoramlData, getAbnoramlTypeData } from '@/api/abnormalManagement/index.js'
import Form from './Form.vue'
export default {
  components: { Form },
  data() {
    return {
      visible: false,
      tableData: [],
      listQuery: {},
      initListQuery: {
        abnormalContentId: '', //	异常内容ID
        abnormalTypeId: '', //	异常类型ID
        createByName: '', //	创建人名称
        endTime: '', //	创建结束时间（yyyy-MM-dd HH:mm:ss）
        equipmentName: '', //	设备名称
        orderNo: '', //	异常申请单号
        processEndTime: '', //	处理时间-结束			
        processStartTime: '', //	处理时间-开始			
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
        pageSize: 20
      },
      listLoading: false,
      total: 0,
      formVisible: false,
      abnormalTypeList: [],
      abnormalContentList: [],
      processStatusList: [
        { label: '待处理', value: 'processing' },
        { label: '已处理', value: 'processed' }
      ],
      processTimeArr: [],
      startAndEndTimeArr: []
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    // 获取搜索条件异常类型
    getAbnoramlTypeData({
      parentId: '-1',
      orderItems: [{
        asc: false,
        column: "create_time"
      }],
      pageSize: -1
    }).then(res => {
      this.abnormalTypeList = res.data.records.map(item => {
        return { label: item.name, value: item.id }
      })
    })
    this.initData()
  },
  methods: {
    abnormalTypeChange(val) {
      this.listQuery.abnormalContentId = ''
      if (!val) return this.abnormalContentList = []
      getAbnoramlTypeData({
        parentId: val,
        contentFlag: true,
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
        pageSize: -1
      }).then(res => {
        this.abnormalContentList = res.data.records.map(item => {
          return { label: item.name, value: item.id }
        })
      })
    },
    initData() {
      this.visible = false
      this.listLoading = true
      getAbnoramlData(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.listQuery = this.jnpf.searchTimeFormat(this.listQuery, 'processTimeArr', 'processStartTime', 'processEndTime')
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
      this.abnormalContentList = []
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
      this.search()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteAbnoramlData(id).then(res => {
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