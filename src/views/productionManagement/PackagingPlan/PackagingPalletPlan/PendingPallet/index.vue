<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import {buttonList, getBatchColumns, getSingleBoxColumns} from "./data";
import {getStockPlanWaitPalletPage} from "@/api/PackagingPalletPlan";

export default {
  name: "index",
  components: {
    SuperQuery,
  },
  data() {
    return {
      loading: false,
      visible: false,
      batchData: [],
      singleBoxData: [],
      superQueryVisible: false,
      superQueryJson: [],
      initListQuery: {
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
        superQuery: {},
        productsName: ''
      },
      listQuery: {},
      btnList: buttonList,
      columnList: [],
      batchColumns: getBatchColumns(),
      singleBoxColumns: getSingleBoxColumns(),
      selectedBatchList: [],
      selectedSingleBoxList: [],
      superQueryTableRef: 'batchTable',
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        const res = await getStockPlanWaitPalletPage(this.listQuery);
        const {data} = res
        this.batchData = data.map(item => {
          return {
            ...item.stockPlanPackage,
            lineList: item.lineList
          };
        });
        this.singleBoxData = data.flatMap(item => item.lineList)
      } finally {
        this.loading = false
      }
    },

    selectedBatch(val) {
      this.selectedBatchList = val
      this.selectedSingleBoxList = val.flatMap(item => item.lineList)
      this.selectedSingleBoxList.forEach(row => {
        this.$refs.singleBoxTable.$refs.JNPFTable.toggleRowSelection(row, true);
      });
    },

    validateSelectedRows() {
      if (this.selectedSingleBoxList.length === 0) {
        this.$message.warning('请至少选择一条数据（整批或单箱）');
        return false;
      }
      return true;
    },

    handleButtonClick(type) {
      switch (type) {
        case 'support':
          if (!this.validateSelectedRows()) return;
          break;
        default:
      }
    },

    onBatchSortChange({prop, order}) {
      let newProp = ''
      if (prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },

    onSingleBoxSortChange({prop, order}) {
      let newProp = ''
      if (prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },

    openSuperQuery(ref) {
      this.superQueryVisible = true
      this.superQueryTableRef = ref
    },

    showBatchColumnSettings() {
      this.$refs.batchTable.showDrawer()
    },

    showSingleBoxColumnSettings() {
      this.$refs.singleBoxTable.showDrawer()
    },

    getAlign(align) {
      return align || 'center'
    },

    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },

    search() {
      this.initData()
    },

    reset() {
      this.$refs.batchTable.$refs.JNPFTable.clearSort()
      this.$refs.singleBoxTable.$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" style="display: flex; flex-direction: column; height: 100%;">
      <el-row class="JNPF-common-search-box" :gutter="16" style="margin-bottom: 5px !important;">
        <el-form @submit.native.prevent @keyup.enter.native="search()">
          <el-col :span="6">
            <el-form-item>
              <el-input v-model.trim="listQuery.productsName"
                placeholder="产品型号"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search"
                @click="search()">查询
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <div class="table-container" style="flex: 1; display: flex; flex-direction: column;">
        <div class="table-section" style="flex: 1; display: flex; flex-direction: column;">
          <div class="JNPF-common-head" style="padding: 8px; position: relative;">
            <div class="JNPF-common-head-left">
              <!-- 这里保留功能按钮区域 -->
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="openSuperQuery('batchTable')"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="showBatchColumnSettings()"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="initData()"/>
              </el-tooltip>
            </div>
            <span class="table-title" style="position: absolute; left: 50%; transform: translateX(-50%);">整批</span>
          </div>
          <div class="table-content" style="flex: 1;">
            <JNPF-table customKey="BatchTable"
              v-loading="loading"
              :data="batchData"
              :has-c="true"
              @selection-change="selectedBatch"
              :row-key="'id'"
              fixedNO
              :setColumnDisplayList="columnList"
              @sort-change="onBatchSortChange"
              ref="batchTable"
              custom-column>
              <template v-for="column in batchColumns">
                <el-table-column
                  v-if="typeof column.show === 'function' ? column.show() : true"
                  :key="column.prop"
                  :prop="column.prop"
                  :label="column.label"
                  :min-width="column.minWidth"
                  :sortable="column.sortable"
                  :fixed="column.fixed"
                  :align="getAlign(column.align)"
                >
                  <template v-if="column.slot" v-slot="scope">
                    <template v-if="column.dictType">
                      <span>
                        <el-tag
                          :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">{{
                            global.getDictLabelGlobal(column.dictType, scope.row[column.prop])
                          }}</el-tag>
                      </span>
                    </template>
                  </template>
                </el-table-column>
              </template>
            </JNPF-table>
          </div>
        </div>
        <div class="table-section" style="flex: 1; display: flex; flex-direction: column; margin-top: 20px;">
          <div class="JNPF-common-head" style="padding: 8px; position: relative;">
            <div class="JNPF-common-head-left">
              <!-- 这里保留功能按钮区域 -->
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="openSuperQuery('singleBoxTable')"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="showSingleBoxColumnSettings()"/>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                  @click="initData()"/>
              </el-tooltip>
            </div>
            <span class="table-title" style="position: absolute; left: 50%; transform: translateX(-50%);">单箱</span>
          </div>
          <div class="table-content" style="flex: 1;">
            <JNPF-table customKey="SingleBoxTable"
              v-loading="loading"
              :data="singleBoxData"
              :has-c="true"
              @selection-change="(val) => selectedSingleBoxList = val"
              :row-key="'id'"
              fixedNO
              :setColumnDisplayList="columnList"
              @sort-change="onSingleBoxSortChange"
              ref="singleBoxTable"
              custom-column>
              <template v-for="column in singleBoxColumns">
                <el-table-column
                  v-if="typeof column.show === 'function' ? column.show() : true"
                  :key="column.prop"
                  :prop="column.prop"
                  :label="column.label"
                  :min-width="column.minWidth"
                  :sortable="column.sortable"
                  :fixed="column.fixed"
                  :align="getAlign(column.align)"
                >
                  <template v-if="column.slot" v-slot="scope">
                    <template v-if="column.dictType">
                      <span>
                        <el-tag
                          :type="global.getDictLabelGlobal(column.dictType, scope.row[column.prop], { withType: true }).type">{{
                            global.getDictLabelGlobal(column.dictType, scope.row[column.prop])
                          }}</el-tag>
                      </span>
                    </template>
                  </template>
                </el-table-column>
              </template>
            </JNPF-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery :partentOrChild="superQueryTableRef" :show="superQueryVisible" ref="SuperQuery"
      :tableRef="superQueryTableRef"
      :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
  </div>
</template>

<style scoped>
.table-container {
  height: calc(100% - 50px); /* 减去搜索栏高度 */
}

.table-section {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
  height: 50%; /* 每个表格区域占一半高度 */
}

.JNPF-common-head {
  position: relative;
}

.table-title {
  font-size: 16px;
  font-weight: bold;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.table-content {
  overflow: hidden;
}

.JNPF-table {
  height: 100%;
}
</style>
