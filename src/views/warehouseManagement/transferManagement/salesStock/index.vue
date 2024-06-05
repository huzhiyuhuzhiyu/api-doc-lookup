<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName">
        <!-- 主表 -->
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.orderNo" @keyup.enter.native="search()" placeholder="请输入备货单号"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.sourceNo" @keyup.enter.native="search()" placeholder="请输入来源单号"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="请选择创建开始时间"
                      end-placeholder="请选择创建结束时间" :picker-options="global.timePickerOptions"
                      :default-time="['00:00:00', '23:59:59']" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                      {{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button> -->
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" ref="dataTable" :data="tableData" @sort-change="sortChange"
                custom-column fixedNO>
                <el-table-column prop="orderNo" label="备货单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.sourceId, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="stockType" label="备货类型" width="120" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.stockType == 'sales'">销售备货</div>
                    <div v-else-if="scope.row.stockType == 'production'">生产备料</div>
                    <div v-else-if="scope.row.stockType == 'external'">外协备料</div>
                  </template>
                </el-table-column>
                <el-table-column prop="targetWarehouseName" label="目标仓库" min-width="200" />
                <el-table-column prop="targetShelfSpaceName" label="目标库位" min-width="200" />
                <el-table-column prop="submitDate" label="提交时间" width="180" sortable="custom" />
                <el-table-column prop="sourceNo" label="来源单号" min-width="200" sortable="custom" />
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column prop="documentStatus" label="单据状态" width="120" align="center" fixed="right"
                  sortable="custom">
                  <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                    <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="220" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.sourceId, false, true)" @del="handleDel(scope.row.id)"
                      :editDisabled="scope.row.documentStatus === 'submit'"
                      :delDisabled="scope.row.documentStatus === 'submit'" editText="继续备货">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.sourceId, true)">
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
        </el-tab-pane>
        <!-- 明细表 -->
        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.productsCode" placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.productsName" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.productsDrawingNo" placeholder="请输入产品图号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
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
              <JNPF-table v-loading="listLoading" ref="linesDataTable" :data="linesTableData" @sort-change="sortChange"
                custom-column fixedNO :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="备货单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.sourceId, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="targetWarehouseName" label="目标仓库" min-width="200" sortable="custom" />
                <el-table-column prop="targetShelfSpaceName" label="目标库位" min-width="200" sortable="custom" />
                <el-table-column prop="productsCode" label="产品编码" min-width="120" sortable="custom" />
                <el-table-column prop="productsName" label="产品名称" min-width="120" sortable="custom" />
                <el-table-column prop="productsDrawingNo" label="产品图号" min-width="200" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位（主）" min-width="120" />
                <el-table-column prop="num" label="数量（主）" min-width="120" />
                <el-table-column prop="deputyUnit" label="单位（副）" min-width="120" />
                <el-table-column prop="deputyNum" label="数量（副）" min-width="120" />
                <el-table-column prop="sourceNo" label="来源单号" min-width="200" sortable="custom" />
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column prop="documentStatus" label="单据状态" width="120" align="center" fixed="right"
                  sortable="custom">
                  <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                    <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="220" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.sourceId, false, true)" @del="handleDel(scope.row.stockUpId)"
                      :editDisabled="scope.row.documentStatus === 'submit'"
                      :delDisabled="scope.row.documentStatus === 'submit'" editText="继续备货">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.sourceId, true)">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <!-- 主表 -->
        <!-- <el-form v-model="listQuery" label-width="120px" label-position="top" v-if="activeName === 'dataTable'">
          <el-col :span="12">
            <el-form-item label="备货单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入备货单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in global.documentStatusList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提交时间">
              <el-date-picker v-model="listQuery.startAndEndSubmitTime" type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="请选择开始时间"
                end-placeholder="请选择结束时间" :picker-options="global.timePickerOptions"
                :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="listQuery.sourceNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="请选择开始时间"
                end-placeholder="请选择结束时间" :picker-options="global.timePickerOptions"
                :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form> -->
        <!-- 明细表 -->
        <el-form v-model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="备货单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入备货单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="linesQuery.sourceNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productsCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productsName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productsDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.startAndEndTime" type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="请选择开始时间"
                end-placeholder="请选择结束时间" :picker-options="global.timePickerOptions"
                :default-time="['00:00:00', '23:59:59']" clearable>
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

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm"
      :originTypeList="originTypeList" />
  </div>
</template>

<script>
import { getStockUpList, getStockUpLinesList, deleteStockUpData, } from "@/api/warehouseManagement/inboundAndOutbound"
import originTypeList from "@/views/warehouseManagement/inboundAndOutbound/originTypeList.js"
import Form from '@/views/warehouseManagement/inboundAndOutbound/outboundOrders/Form.vue'
export default {
  components: { Form },
  data() {
    return {
      originTypeList: originTypeList.outboundList,
      activeName: "dataTable",
      formVisible: false,
      visible: false,
      listLoading: false,

      tableData: [],
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        stockType: 'sales',
        pageNum: 1,
        pageSize: 20,
        startAndEndTime: [],
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},
      initLinesQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        startAndEndTime: [],
        pageNum: 1,
        pageSize: 20,
      },
      linesTotal: 0,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery));
    this.initData()
  },
  watch: { activeName() { this.initData() } },
  methods: {
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        getStockUpList(this.listQuery).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
      } else {
        getStockUpLinesList(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
      }
    },
    search() {
      this.visible = false
      if (this.activeName === 'dataTable') {
        this.jnpf.searchTimeFormat(this.listQuery, 'startAndEndTime', 'startTime', 'endTime')
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'startAndEndTime', 'startTime', 'endTime')
        this.jnpf.searchTimeFormat(this.listQuery, 'startAndEndSubmitTime', 'startUpdateTime', 'endUpdateTime')
        Object.keys(this.linesQuery).forEach(key => {
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1
      }
      this.initData()
    },
    reset() {
      if (this.activeName === 'dataTable') {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort()
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
      } else {
        this.$refs['linesDataTable'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery));
      }
      this.initData()
    },
    sortChange({ prop, order }) {
      let newProp
      if (this.activeName === 'dataTable') {
        if ([].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.listQuery.orderItems[0].asc = order === 'ascending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (['createTime', 'documentStatus', 'orderNo', 'processName', 'productsCode','productsName', 'productsDrawingNo',
          'remark', 'routingName', 'sourceNo', 'targetShelfSpaceName', 'targetWarehouseName'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.linesQuery.orderItems[0].asc = order === 'ascending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    addOrUpdateHandle(id, readOnly, continueStockUpFlag) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(id, readOnly, 'outbound_stock_up', continueStockUpFlag ? undefined : undefined) })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteStockUpData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />