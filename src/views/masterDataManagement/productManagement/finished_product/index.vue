<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left">
      <div class="JNPF-common-title">
        <h2>产品分类</h2>
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
            <span class="text" :title="data.name">{{ data.name }}</span>
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
              <el-select v-model="listQuery.productSource" placeholder="请选择产品来源" clearable style="width: 100%;">
                <el-option v-for="(item, index) in productSourceList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
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
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <topOpts @add="addOrUpdateHandle()">
            <el-button :disabled="tableData.length > 0 ? false : true " size="mini" type="primary" icon="el-icon-download" @click="exportForm">导出</el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          ref="dataTable">
          <el-table-column prop="code" label="产品编码" min-width="140" fixed="left" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.id, true)">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="drawingNo" label="规格型号" min-width="300" sortable="custom" />
          <el-table-column prop="name" label="产品名称" min-width="140" fixed="left" sortable="custom" />

          <el-table-column prop="productCategoryName" label="产品分类" width="120"  />
          <el-table-column prop="mainUnit" label="主单位" width="120" />
          <el-table-column prop="productSource" label="产品来源" width="120" >
            <template slot-scope="{row}">
              <template v-if="row.productSource == 'produce'">自制</template>
              <template v-else-if="row.productSource == 'purchase'">采购</template>
              <template v-else-if="row.productSource == 'out'">外协</template>
            </template>
          </el-table-column>
          <el-table-column prop="productStatus" label="产品状态" width="120"  fixed="right" align="center">
            <template slot-scope="{row}">
              <el-tag type="success" disable-transitions v-if="row.productStatus == 'enable'">启用</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="row.productStatus == 'disabled'">禁用</el-tag>
              </template>
              </el-table-column>
          <el-table-column prop="brand" label="品牌" width="120" />
          <el-table-column prop="model" label="型号" width="120" />
          <el-table-column prop="sealingCoverStructure" label="密封盖-结构" width="120" />
          <el-table-column prop="sealingCoverTyping" label="密封盖-打字" width="120" />
          <el-table-column prop="structureType" label="结构类型" width="120" />
          <el-table-column prop="clearance" label="游隙" width="120" />
          <el-table-column prop="steelBallManufacturer" label="钢球厂家" width="120" />
          <el-table-column prop="oil" label="油脂" width="120" />
          <el-table-column prop="oilQuantity" label="油脂量" width="120" />
          <el-table-column prop="noise" label="噪音" width="120" />
          <el-table-column prop="holder" label="保持架" width="120" />
          <el-table-column prop="vibrationLevel" label="振动等级" width="120" />
          <el-table-column prop="accuracyLevel" label="精度等级" width="120" />
          <el-table-column prop="colour" label="颜色" width="120" />
          <el-table-column prop="aperture" label="孔径" width="120" />
          <el-table-column prop="remark" label="备注" width="120" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" />
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId)"
                @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="btnType(scope.row.id, true)">
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
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.code" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号">
              <el-input v-model="listQuery.drawingNo" placeholder="请输入规格型号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.name" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品来源">
              <el-select v-model="listQuery.productSource" placeholder="请选择产品来源" clearable style="width: 100%;">
                <el-option v-for="item in productSourceList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品状态">
              <el-select v-model="listQuery.productStatus" placeholder="请选择产品状态" clearable style="width: 100%;">
                <el-option v-for="item in productStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable >
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
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getProductList, deleteProduct } from '@/api/masterDataManagement/productManage'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import Form from './Form'
export default {
  components: { Form, ExportForm },
  data() {
    return {
      exportFormVisible: false,
      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      userRelationListVisible: false,
      initListQuery:{
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
        productSource: "", // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: "", // 类型id
        productStatus: "", // 产品状态
        customerQueryFields: [],
        createTimeArr:[],
         classAttribute: "finish_product"
      },
      listQuery: {},
      productStatusList: [{ label: "启用", value: "enable" }, { label: "禁用", value: "disabled" }], // 产品状态
      productSourceList: [{ label: "自制", value: "produce" }, { label: "采购", value: "purchase" }, { label: "外协", value: "out" }], // 产品来源
      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
    }
  },
  created() {
    this.getcategoryTree()
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    // 导出
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
          exportType: '1200',
          exportName: '成品信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
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
      getcategoryTree({ classAttribute: "finish_product" }).then(res => {
        this.treeData = res.data.length ? res.data : []
        this.$nextTick(() => {
          this.treeLoading = false
          this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
        this.listLoading = false
      })
    },
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.listQuery.productCategoryCode = data.code
      this.search()
    },
    moreQueries() {
      this.visible = true
    },
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

    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
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
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    },

    addOrUpdateHandle(id,btnType) {
      this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(id,btnType)
        })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteProduct(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />