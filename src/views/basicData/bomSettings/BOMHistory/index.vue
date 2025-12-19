<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" v-if="!leftFlag">
        <h2>产品分类</h2>
        <span class="options" v-if="!leftFlag">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree(true)">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
              <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <div v-if="!leftFlag">
        <el-input placeholder="请输入" v-model="filterText" style="width:200px;margin:10px auto;display:block"
          suffix-icon="el-icon-search" clearable></el-input>
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
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
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="tableForm" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:8px">
          <div>
            <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.tableForm.showSortDrawer()" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="tableForm" :data="tableData" custom-column
          fixedNO @selection-change="selectionChange" :element-loading-text="loadingText"
          :setColumnDisplayList="columnList" customKey="JNPFTableKey_620872" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="productCode" label="产品编码" min-width="200">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                {{ scope.row.productCode }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="drawNo" label="品名规格" min-width="160" />
          <el-table-column prop="productCategoryName" label="产品分类" width="160" />

          <el-table-column prop="pickingWay" label="领料方式" min-width="180">
            <template slot-scope="{ row }">
              <template v-if="row.pickingWay == 'production_order'">
                按生产订单领料
              </template>
              <template v-else-if="row.pickingWay == 'dispatch_list'">
                按工单领料
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" />
          <el-table-column prop="documentStatus" label="单据状态" width="120" align="center">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
              <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="120" align="center">
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
          <el-table-column prop="version" label="版本号" min-width="180" />
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click.native="addOrUpdateHandle(scope.row.id, 'look', scope.row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()" />
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData()" @close="closeForm" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getBomList, deleteBomData, batchCalculateLen } from '@/api/basicData/index'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import Form from '../productionBom/Form.vue'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'BOMHistory',
  components: { Form, ExportForm },
  mixins: [getProjectList],
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            // { prop: 'orderNo', symbol: 'like', fixed: true },
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableFlag: false,
      filterText: '',
      superQueryVisible: false,
      superQueryJson: [{
        prop: 'pickingWay',
        label: '领料方式',
        type: 'select',
        options: [{
          label: '按生产订单领料',
          value: 'production_order'
        }, {
          label: '按工单领料',
          value: 'dispatch_list'
        }]
      }],
      formVisible: false,
      exportFormVisible: false,
      leftFlag: false,
      tableData: [],

      listLoading: false,
      listQuery: {
        historyFlag: 1,
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
      columnList: ['pickingWay', 'createByName', 'createTime']
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    this.getcategoryTree()
    if (localStorage.getItem("BOMHistoryFlag")) {
      let roleFlag = JSON.parse(localStorage.getItem('BOMHistoryFlag'))
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
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
    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
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


    addOrUpdateHandle(id, btnType, approvalStatus) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType || 'add', false, approvalStatus)
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

    getcategoryTree(refreshFlag) {
      this.treeLoading = true
      this.listLoading = true
      this.listQuery.productCategoryId = '' // 重置数据类型id筛选

      let methodArr = { method: getcategoryTree, requestObj: { classAttribute: '' } }
      getcategoryTree({ classAttribute: '', type: 'material' }).then((res) => {
        this.treeData = res.data
        if (refreshFlag) this.$refs.tableForm.queryChange(this.listQuery)
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
    // // 设置默认展开
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("BOMHistoryFlag", expands)
      })
    },
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      this.initData()
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
  /* padding: 0 10px; */
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
