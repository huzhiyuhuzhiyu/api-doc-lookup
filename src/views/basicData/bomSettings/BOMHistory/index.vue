<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" v-if="!leftFlag">
        <h2>产品分类</h2>
        <span class="options" v-if="!leftFlag">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="reset()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading"  v-if="!leftFlag">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i :class="[
              data.childrenList && data.childrenList.length > 0
                ? 'icon-ym icon-ym-tree-organization3'
                : 'icon-ym icon-ym-systemForm'
            ]" />
            <span class="text" :title="data.name">{{ data.name }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div v-if="!leftFlag" class="retract" style="position: absolute">
        <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
      </div>
      <div v-if="leftFlag" class="expand" style="position: absolute">
        <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
      </div>
    </div>

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productCode" @keyup.enter.native="search()" placeholder="请输入产品编码"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productName" @keyup.enter.native="search()" placeholder="请输入产品名称"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.drawNo" @keyup.enter.native="search()" placeholder="请输入品名规格" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;">
                <el-option v-for="item in global.documentStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
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
        <div class="JNPF-common-head" style="padding:10px">
          <!-- <topOpts @add="add()">
            <el-button icon="el-icon-s-data" type="primary" size="mini" @click="handleBatch"
              :loading="btnLoading">计算胶管长</el-button>
          </topOpts> -->
          <div>
            <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </div>
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
        <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableData" @sort-change="sortChange" custom-column
          fixedNO hasC @selection-change="selectionChange" :element-loading-text="loadingText"
          :setColumnDisplayList="columnList">
          <el-table-column prop="productCode" label="产品编码" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.productId, 'look')">
                {{ scope.row.productCode }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="200" sortable="custom" />
          <el-table-column prop="drawNo" label="品名规格" min-width="600" sortable="custom" />
          <el-table-column prop="pickingWay" label="领料方式" min-width="180">
            <template slot-scope="{ row }">
              <template v-if="row.pickingWay == 'production_order'">
                按生产订单领料
              </template>
              <template v-else-if="row.pickingWay == 'dispatch_list'">
                按派工单领料
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
              <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus !== 'draft'">审批中</el-tag>
              <el-tag type="success"
                v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus !== 'draft'">
                审批通过
              </el-tag>
              <el-tag type="danger"
                v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus !== 'draft'">
                审批拒绝
              </el-tag>
              <div v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                <el-tag type="warning">审批撤回</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click.native="addOrUpdateHandle(scope.row.productId, 'look', scope.row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getBomList, deleteBomData, batchCalculateLen } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import Form from './Form'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
export default {
  components: { Form, ExportForm, SuperQuery },
  data() {
    return {
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'productName',
          label: '产品名称',
          type: 'input'
        },

        {
          prop: 'drawNo',
          label: '品名规格',
          type: 'input'
        },

        {
          prop: 'pickingWay',
          label: '领料方式',
          type: 'select',
          options: [
            { label: '按生产订单领料', value: 'production_order' },
            { label: '按派工单领料', value: 'dispatch_list' }
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
        },

        {
          prop: 'approvalStatus',
          label: '审批状态',
          type: 'select',
          options: [
            { label: '审批中', value: 'ing' },
            { label: '审批通过', value: 'ok' },
            { label: '审批拒绝', value: 'rebut' },
            { label: '审批撤回', value: 'withdrawn' }
          ]
        }
      ],
      formVisible: false,
      exportFormVisible: false,
      leftFlag:false,
      tableData: [],

      listLoading: false,
      listQuery: {
        code: '',
        name: '',
        drawNo: '',
        productCode: '',
        productName: '',
        startTime: '',
        endTime: '',
        historyFlag: 1,
        startAndEndTime: [],
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        approvalStatus: '',
        documentStatus: '',
        pageNum: 1,
        pageSize: 20
      },
      total: 0,

      treeLoading: true,
      treeData: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      expands: true,
      refreshTree: true,

      loadingText: '',
      btnLoading: false,
      selectedData: [],
      columnList: ['productName', 'pickingWay', 'createByName']
    }
  },
  created() {
    this.getcategoryTree()
    // this.initData()
  },
  methods: {
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode' || prop === 'productName' || prop === 'drawNo') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tableForm.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
 
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {

      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.listQuery,
          exportType: '1035',
          exportName: '历史BOM信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
        this.listQuery.startTime = this.listQuery.startAndEndTime[0].replace(/ 0(?!0)/g, ' ')
        this.listQuery.endTime = this.listQuery.startAndEndTime[1].replace(/ 0(?!0)/g, ' ')
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      getBomList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.treeLoading = false
          this.listLoading = false
        })
        .catch(() => {
          this.treeLoading = false
          this.listLoading = false
        })
    },
    search() {
    
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        code: '',
        name: '',
        drawNo: '',
        productCode: '',
        productName: '',
        startTime: '',
        endTime: '',
        startAndEndTime: [],
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        approvalStatus: '',
        documentStatus: '',
        pageNum: 1,
        pageSize: 20
      }
      this.getcategoryTree()
    },
    addOrUpdateHandle(productId, btnType, approvalStatus) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(productId, btnType || 'add', approvalStatus)
      })
    },
    add() {
      this.$router.push({
        path: '/basicData/bomSettings/BOMCreate'
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteBomData(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },

    getcategoryTree() {
      this.treeLoading = true
      this.listLoading = true
      let methodArr = { method: getcategoryTree, requestObj: { classAttribute: '' } }
      getcategoryTree({ classAttribute: '' }).then((res) => {
        this.treeData = res.data
        this.initData()
      })
    },

    // 展开或折叠全部
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },

    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      // this.listQuery.classAttribute = data.classAttribute
      this.search()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          withdrawn(_data).then((res) => {
            this.$message({
              type: 'success',
              message: '撤回成功',
              duration: 1500,
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => { })
    },
    selectionChange(data) {
      this.selectedData = data
    },
    // 批量操作
    handleBatch() {
      if (!this.selectedData.length) return this.$message.error('请先选择数据')
      this.loadingText = '正在计算，请稍等'
      this.btnLoading = true
      this.listLoading = true
      batchCalculateLen(this.selectedData.map((item) => item.id))
        .then((res) => {
          this.selectedData = []
          this.$refs['tableForm'].$refs.JNPFTable.clearSelection()
          this.$message.success('操作成功')
          this.btnLoading = false
          this.listLoading = false
          this.loadingText = ''
        })
        .catch((err) => {
          this.btnLoading = false
          this.listLoading = false
          this.loadingText = ''
          // let msg = err.substring(err.indexOf('Error: ') + 7, err.indexOf('at') - 2)
          // this.$confirm(msg, this.$t('common.tipTitle'), { type: 'error' }).then(() => { }).catch(() => { })
        })
    }
  }
}
</script>
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
