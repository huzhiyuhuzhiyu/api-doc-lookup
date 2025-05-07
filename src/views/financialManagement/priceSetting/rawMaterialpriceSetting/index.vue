<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>物料分类</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
      <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
          v-if="refreshTree" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
            <i
              :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
            <span class="text" :title="data.name">{{ `${data.fullCode} - ${data.name}` }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="请输入产品编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="请输入产品名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.drawingNo" placeholder="请输入产品图号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <el-button type="primary" @click="handleBatch">批量设置价格</el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          ref="dataTable" hasC @selection-change="currentChange" customKey="JNPFTableKey_681035">
          <el-table-column prop="code" label="产品编码" min-width="140" fixed="left" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, true)">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="产品名称" min-width="140" fixed="left" sortable="custom" />
          <el-table-column prop="drawingNo" label="产品图号" min-width="200" sortable="custom" />
          <el-table-column prop="spec" label="规格型号" width="120" sortable="custom" />
          <el-table-column prop="productCategoryIdText" label="物料分类" width="120" sortable="custom" />
          <el-table-column prop="mainUnit" label="主单位" width="120" />
          <el-table-column prop="deputyUnit" label="副单位" width="120" />
          <el-table-column prop="ratio" label="转换系数" width="120" />
          <el-table-column prop="calculationDirection" label="计算方向" width="120">
            <template slot-scope="{row}">
              <template v-if="row.calculationDirection == 'multiplication'">乘</template>
              <template v-else-if="row.calculationDirection == 'division'">除</template>
            </template>
          </el-table-column>
          <el-table-column prop="standardPrice" label="标准单价(kg/元)" width="180" sortable="custom">
            <template slot-scope="scope">
              <div>{{ scope.row.standardPrice ? scope.row.standardPrice : 0 }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column label="操作" width="90" fixed="right">
            <template slot-scope="scope">
              <tableOpts :hasEdit="false" :hasDel="false">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, true)">
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
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.code" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.name" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.drawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有无价格">
              <el-select v-model="listQuery.hasStandardPrice" placeholder="请选择有无价格" clearable style="width: 100%;">
                <el-option v-for="(item, index) in [{ label: '有价格', value: true }, { label: '无价格', value: false }]"
                  :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" :picker-options="global.timePickerOptions">
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

    <!-- 批量设置价格 -->
    <el-dialog v-if="analyseDialog" title="批量设置价格" :close-on-click-modal="false" append-to-body
      :visible.sync="analyseDialog" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
      <el-row :gutter="15" style="margin-top: 0px;">
        <el-form ref="elForm" :model="dataForm" label-position="top" :rules="dataFormRules">
          <el-row :gutter="30">
            <el-col :sm="24">
              <el-form-item prop="standardPrice" label="标准单价(kg/元)">
                <el-input v-model="dataForm.standardPrice" placeholder="请输入标准单价" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="analyseDialog = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
          {{ $t('common.submitButton') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getProductList, deleteProductData, productsCalculateGross, batchSetProductPrice } from '@/api/basicData/materialFiles'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import Form from '@/views/basicData/materialFiles/raw_material/Form.vue'
export default {
  components: { Form },
  data() {
    return {
      visible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {
        code: "",
        name: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        drawingNo: "", // 图号
        productSource: "purchase", // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: "", // 类型id
        productStatus: "enable", // 产品状态
        hasStandardPrice: '',
        showExtra: true
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },

      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      attributeLines: [],
      analyseDialog: false,
      btnLoading: false,
      dataForm: {
        standardPrice: ''
      },
      dataFormRules: {
        standardPrice: [
          { validator: this.formValidate('noZero', '', (errMsg) => { }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 6, "", (errMsg) => { }] }), trigger: 'blur' },
          { required: true, message: '标准单价不能为空', trigger: 'blur' },
        ]
      },
      selectedData: []
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
    this.getcategoryTree()
  },
  methods: {
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
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
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取指定树状列表
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = "" // 重置数据类型id筛选
      this.listQuery.productCategoryCode = '6' // 原材料标记：6
      getcategoryTree({ classAttribute: "material", code: '6' }).then(res => {
        this.treeData = res.data.length ? res.data[0].childrenList : []
        this.$nextTick(() => {
          this.treeLoading = false
          this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
        this.listLoading = false
      })
    },
    initData() {
      this.listLoading = true
      this.jnpf.searchTimeFormat(this.listQuery, 'startAndEndTime', 'startTime', 'endTime')
      getProductList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      // this.search()
      this.getcategoryTree()
    },
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.listQuery.productCategoryCode = data.code
      this.search()
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType, true)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteProductData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    currentChange(data) {
      this.selectedData = data
    },
    async handleBatch() {
      if (!this.selectedData.length) return this.$message.error('请至少选择一条产品数据')
      this.dataForm.standardPrice = ''
      this.btnLoading = false
      this.analyseDialog = true
    },
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true

      const form_1 = this.$refs.elForm
      const valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      if (submitFlag) {
        let _data = this.selectedData.map(item => { return { id: item.id, standardPrice: this.dataForm.standardPrice } })
        batchSetProductPrice(_data).then(res => {
          this.$message.success('操作成功')
          this.selectedData = []
          this.$refs.dataTable.$refs.JNPFTable.clearSelection()
          this.analyseDialog = false
          this.search()
        }).catch(err => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }
    }
  }
}
</script>
<style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

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
