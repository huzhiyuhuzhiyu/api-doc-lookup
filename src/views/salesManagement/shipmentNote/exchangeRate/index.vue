<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable" />
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <topOpts @add="addOrUpdateHandle">
<!--            <el-button :disabled="treeList.length > 0 ? false : true" size="mini" type="primary" icon="el-icon-download"-->
<!--              @click="exportForm">-->
<!--              导出-->
<!--            </el-button>-->
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.dataTable.showSortDrawer()" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="treeList" v-if="refreshTable" fixedNO
          :setColumnDisplayList="columnList" :default-expand-all="expands" ref="dataTable"
          custom-column customKey="JNPFTableKey_619371" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="currencySystem" label="币制" min-width="200"></el-table-column>
          <el-table-column prop="exchangeRate" label="兑换比" min-width="120" />
          <el-table-column prop="num" label="num1" min-width="120" />
          <el-table-column prop="symbol" label="符号" min-width="120" />
<!--          <el-table-column prop="createTime" label="创建时间" width="180" />-->
<!--          <el-table-column prop="createByName" label="创建人" width="180" />-->
<!--          <el-table-column prop="remark" label="备注" min-width="200" />-->

          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, scope.row.parentId)"
                :has-edit="false"
                @del="handleDel(scope.row.id, scope.row.parentId)"></tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeDepForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { productPlmSync } from '@/api/basicData/materialSettings'
import DepForm from './depForm'
import { getExchangeRateList, batchDelExchangeRate } from "@/api/masterDataManagement/productManage";
export default {
  components: { DepForm, ExportForm },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            { prop: 'currencySystem', symbol: 'like', fixed: true },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 999, // 每页条数*
          orderItems: [
            // {
            //   asc: false,
            //   column: 'createTime'
            // }
          ]
        },
      }],
      superQueryJson: [],
      exportFormVisible: false,
      listQuery: {},
      treeList: [],
      expands: true,
      refreshTable: true,
      btnLoading: false,
      listLoading: false,
      depFormVisible: false,
      columnList: ['createByName', 'createTime']
    }
  },
  methods: {
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      console.log(columnList, 'columnList')
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
          exportType: '1028',
          exportName: '工序分类信息',
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
    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      this.listLoading = true
      this.loading = true
      getExchangeRateList(this.listQuery)
        .then((res) => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.treeList = res.data.records
          this.listLoading = false
          this.btnLoading = false
        })
        .catch(() => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期
          this.listLoading = false
          this.btnLoading = false
        })
    },

    // 树形列表index层级，实现方法（可复制直接调用）
    setTableIndex(arr, index) {
      arr.forEach((item, key) => {
        item.index = key + 1
        if (index) {
          item.index = index + 1
        }
        if (item.childrenList.length > 0) {
          this.setTableIndex(item.childrenList, item.index)
        }
      })
    },

    addOrUpdateHandle(id, parentId) {
      this.addOrUpdateDep(id, parentId)
    },
    addOrUpdateDep(id, parentId) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, parentId)
      })
    },
    closeDepForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    toggleExpand() {
      this.refreshTable = false
      this.expands = !this.expands
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    PLMchange(id) {
      this.listLoading = true
      productPlmSync(id)
        .then((res) => {
          if (res.msg === 'Success') {
            this.$message.success('同步成功')
            this.initData()
          }
          this.listLoading = false
        })
        .catch((err) => {
          this.listLoading = false
        })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          batchDelExchangeRate([id]).then((res) => {
            if (res.msg === 'Success') {
              this.initData()
              this.$message({
                type: 'success',
                message: '删除成功',
                duration: 1500
              })
            }
          })
        })
        .catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-icon {
  vertical-align: bottom;
  font-size: 16px;
  margin-right: 6px;
  line-height: 23px;
}
</style>
