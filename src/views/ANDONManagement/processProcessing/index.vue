<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <template v-for="item in searchList">
            <el-col :span="4" :key="item.prop">
              <el-form-item>
                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="'请输入' + item.label"
                  clearable @keyup.enter.native="search('basic')" />
                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="'请输入' + item.label"
                  clearable>
                  <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">查询</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts :icon="'el-icon-remove-outline'" @add="handleCancel" :addText="'批量取消'"></topOpts>
          <div></div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange" class="dataTable" border
          ref="listTable" custom-column hasC @selection-change="handleSelectAb">
          <el-table-column prop="orderNo" label="申请单号" min-width="200" sortable="custom" />
          <el-table-column prop="type" label="申请类型" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 'custom'">自定义异常</div>
              <div v-else>系统异常</div>
            </template>
          </el-table-column>
          <el-table-column prop="abnormalType" label="异常类型" min-width="120" sortable="custom" />
          <el-table-column prop="abnormalContent" label="异常内容" min-width="120" sortable="custom" />
          <el-table-column prop="equipmentName" label="关联设备" min-width="120" sortable="custom" />
          <el-table-column prop="productDrawingNo" label="关联产品" min-width="160" sortable="custom" />
          <el-table-column prop="createByName" label="发起人" min-width="120" sortable="custom" />
          <el-table-column prop="createTime" label="发起时间" min-width="180" sortable="custom" />
          <!-- <el-table-column prop="personId" label="响应人" min-width="160" sortable="custom" />
          <el-table-column prop="processDate" label="响应时间" min-width="160" sortable="custom" /> -->
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.id)">处理</el-button>
              <el-button size="mini" type="text" @click="handleCancel(scope.row.flowTaskOperatorId)">取消</el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData"
          class="pagination" style="text-align: left; padding-left: 20px;" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @close="refresh" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
    <el-dialog title="取消" :close-on-click-modal="false" :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center"
      lock-scroll append-to-body width='600px'>
      <el-form ref="dealForm" :model="dealForm" label-width="120px">
        <el-form-item label="取消描述：" prop="processDescription">
          <el-input v-model="dealForm.processDescription" placeholder="请输入取消描述" type="textarea" :rows="4" />
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="handleApproval()" :loading="approvalBtnLoading">
          {{ $t('common.confirmButton') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import JNPFForm from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getAbnoramlData } from '@/api/abnormalManagement/index.js'
import { Reject, batchReject } from '@/api/workFlow/FlowBefore'
export default {
  components: { SuperQuery, JNPFForm },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '申请单号',
          type: 'input'
        },
        {
          prop: 'type',
          label: '申请类型',
          type: 'select',
          options: [
            { label: '自定义异常', value: 'custom' },
            { label: '系统异常', value: 'system' }
          ]
        },
        {
          prop: 'abnormalType',
          label: '异常类型',
          type: 'input'
        },
        {
          prop: 'abnormalContent',
          label: '异常内容',
          type: 'input'
        },
        {
          prop: 'equipmentName',
          label: '关联设备',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '关联产品',
          type: 'input'
        },
        {
          prop: 'createByName',
          label: '发起人',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '发起时间',
          type: 'datetime',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
        },
        {
          prop: 'personId',
          label: '响应人',
          type: 'input'
        },
      ],
      visible: false,
      approvalBtnLoading: false,
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        abnormalContent: "",
        abnormalContentId: '',
        abnormalType: "",
        abnormalTypeId: '',
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        equipmentName: "",
        keyword: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        processEndTime: "",
        processStartTime: "",
        processStatus: "processing",
        productionOrderNo: "",
        startTime: "",
        startUpdateTime: "",
        superQuery: {},
        totalRowFlag: false,
        type: "",
        module: ''
      },
      typeList: [
        { label: '自定义异常', value: 'custom' },
        { label: '系统异常', value: 'system' }
      ],
      formVisible: false,
      basicQuery: {},
      superQuery: {},
      searchList: [
        { fieldValue: '', field: 'orderNo', label: '申请单号', prop: 'orderNo', symbol: 'like', searchType: 1 },
        { fieldValue: '', field: 'type', label: '申请类型', prop: 'type', symbol: 'like', searchType: 4, options: [{ label: '自定义异常', value: 'custom' }, { label: '系统异常', value: 'system' }] },
        {
          fieldValue: '', field: 'module', label: '异常模块', prop: 'module', symbol: 'like', searchType: 4,
          options: [{ label: '质量异常', value: 'quality' },
          { label: '物料异常', value: 'material' },
          { label: '生产异常', value: 'produce' },
          { label: '设备异常', value: 'facility' },
          { label: '系统异常', value: 'system' }]
        },
        { fieldValue: '', field: 'abnormalContent', label: '异常内容', prop: 'abnormalContent', symbol: 'like', searchType: 1 },
      ],
      selectAb: [],
      dealForm: {
        processDescription: '',
      },
      batchId: ''
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  watch: {
    '$route.query.module': {
      immediate: true,
      handler(val) {
        if (val) {
          this.initListQuery.module = val
          this.searchList.forEach(item=>{
            if (item.field === 'module') item.fieldValue = val
          })
        }
      },
      deep: true
    },
  },
  methods: {
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.listTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp = ''
      if (['equipmentName', 'productDrawingNo', 'createByName'].includes(prop)) {
        newProp = prop === 'createByName' ? 'create_by' : prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      getAbnoramlData(this.listQuery).then((res) => {
        this.list = res.data.records || []
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => this.listLoading = false)
    },
    // 新增数据
    addOrUpdateHandle(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id)
      })
    },
    search(type) {
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList.filter(item => item.fieldValue).map(item => {
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
      this.initData()
    },
    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.reset()
    },
    reset() {
      this.$refs['listTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.initListQuery.module = ''
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.searchList.forEach(item => { item.fieldValue = '' })
      this.search()
    },
    handleSelectAb(val) {
      this.selectAb = val
    },
    handleCancel(id) {
      if (!id) {
        if (!this.selectAb.length) return this.$message.error("请选择您要取消的数据!")
        this.batchFlag = ''
      } else {
        this.batchId = id
      }
      this.visible = true
      this.$nextTick(() => { this.$refs.dealForm.resetFields() })
    },
    handleApproval() {
      this.approvalBtnLoading = true

      let flowModel = {
        ids: !this.batchId ? this.selectAb.map(item => item.flowTaskOperatorId) : [this.batchId],
        handleOpinion: this.dealForm.processDescription
      }
      batchReject(flowModel).then(res => {
        this.$message({ type: 'success', message: '处理成功', duration: 1000 })
        this.approvalBtnLoading = false
        this.visible = false
        this.initData()
      }).catch(() => { this.approvalBtnLoading = false })
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
