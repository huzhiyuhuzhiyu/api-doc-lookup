<template>
  <div class="JNPF-common-layout">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%;background-color: #fff;">
        <el-tab-pane label="供应商页面" name="supplierPage" style="margin-bottom: 5px;height: 100%;">
          <div class="JNPF-common-layout"> -->
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <JNPF-tableQuery :listQuery="form" :systemSearchView="systemSearchView" tableRef="dataTable"/>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <topOpts @add="addSupplier()"/>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
              <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                       @click="$refs.dataTable.showSortDrawer()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                       @click="columnSetFun()"/>
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                       @click="initData()"/>
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" row-key="id" highlight-current-row :data="tableData"
                    custom-column :setColumnDisplayList="columnList" @changeMove="changeMove" customKey="JNPFTableKey_496179" :listQuery="form" @queryChange="initData"
                    :queryJson="superQueryJson">
          <el-table-column prop="name" label="类别名称" width="250"/>
          <el-table-column prop="code" label="类别编码" min-width="150"/>
          <!-- <el-table-column label="仓库启用状态" width="160" align="center" prop="state">
            <template slot-scope="scope">{{ scope.row.state === 'disabled' ? '关闭' : '开启' }}</template>
          </el-table-column> -->
          <el-table-column prop="remark" label="备注" width="250"/>
          <el-table-column prop="createTime" label="创建时间" width="180"/>
          <el-table-column prop="createByName" label="创建人" width="100"/>
          <el-table-column label="操作" width="110" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)">
                <!-- <el-button v-if="scope.row.state == 'disabled'" type="text" size="mini"
                  @click="onHandle(scope.row, 'edit')">
                  开启仓库
                </el-button>
                <el-button v-else type="text" size="mini" @click="offHandle(scope.row.id)">
                  关闭仓库
                </el-button> -->
                <!-- <el-button type="text" size="mini" @click.native="copyHandle(scope.row.id, true)">
                复制
              </el-button> -->
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize" @pagination="initData()"/>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData()" @close="closeForm"/>
    <WarehouseForm v-if="warehouseFormVisible" ref="warehouseForm" @refreshDataList="initData()" @close="closeForm"/>
    <!-- 高级查询 -->

  </div>
</template>

<script>
import { delClassAttribute, disabledClassAttributeState, getclassAttributeList, updateSortBatch } from '@/api/masterDataManagement/index'
import Form from './Form'
import WarehouseForm from './WarehouseForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'

export default {
  name: 'supplierProfile',
  components: { Form, SuperQuery, WarehouseForm },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [
            {
              prop: 'code',
              symbol: 'like',
              fixed: true
            },
            {
              prop: 'name',
              symbol: 'like',
              fixed: true
            },
            {
              prop: 'createTime', // 属性*
              symbol: 'between', // 比较符*
              timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
              fixed: true // 是否在搜索栏显示
            },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'code'
            }
          ]
        },
      }],
      superQueryVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      activeName: 'supplierPage',
      visible: false,
      warehouseFormVisible: true,
      treeData: [],
      leftFlag: false,
      tableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      form: {},
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'fullName'
      },
      rules: {
        code: [{}]
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      expands: true,
      refreshTree: true,
      filterText: '',
      columnList: [],
      superQueryJson: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },

  created() {
  },
  methods: {
    changeMove(data) {
      data.forEach(item => {
        item.sort = item.sortCode
      })
      updateSortBatch(data).then(res => {
        this.$message.success("排序修改成功")
        this.initData()
      })
    },

    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },


    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },

    filterNode(value, data) {
      if (!value) return true
      return data.fullName.indexOf(value) !== -1
    },
    initData(listQuery) {
      if (listQuery) this.form = listQuery;
      if (!this.form?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      this.listLoading = true
      getclassAttributeList(this.form)
        .then((res) => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.listLoading = false
        })
    },


    handleNodeClick(data, node) {
      this.form.typeCode = node.data.enCode
      this.initData()
    },

    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init('', 'add')
      })
    },
    addOrUpdateHandle(id) {
      this.formVisible = true
      if (!id) return
      this.$nextTick(() => {
        this.$refs.Form.init(id, 'edit')
      })
    },
    onHandle(row, btn) {
      this.warehouseFormVisible = true
      this.$nextTick(() => {
        this.$refs.warehouseForm.init(row, btn)
      })


    },
    offHandle(id, btn) {
      let obj = {
        id: id,
        state: 'disabled'
      }
      this.$confirm('是否确定禁用', {
        type: 'warning'
      })
        .then(() => {
          disabledClassAttributeState(obj).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '禁用成功',
              duration: 1500
            })
            location.reload()
          })
        })
        .catch(() => {
        })
    },
    copyHandle(id) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, 'copy')
        })
        // }, 600);
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          delClassAttribute(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
            location.reload()
          })
        })
        .catch(() => {
        })
    },
    handleUserRelation(id, parentId, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, parentId, btnType)
      })
    },

  }
}
</script>
<style scoped>
::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
}

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
  height: 40px !important;
  line-height: 40px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
<style scoped>
.title_box {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
