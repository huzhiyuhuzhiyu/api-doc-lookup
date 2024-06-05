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
                    <el-input v-model="listQuery.transferOutWarehouseName" @keyup.enter.native="search()"
                      placeholder="请输入调出仓库名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.transferInWarehouseName" @keyup.enter.native="search()"
                      placeholder="请输入调入仓库名称" clearable />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="listQuery.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;">
                      <el-option v-for="item in approvalStatusList" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col> -->
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
              <div class="JNPF-common-head" style="padding:10px">
                <topOpts @add="addOrUpdateHandle()" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" ref="dataTable" :data="tableData" @sort-change="sortChange"
                custom-column fixedNO>
                <el-table-column prop="orderNo" label="调拨单号" width="200" fixed="left" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true, scope.row.inboundId)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="transferOutWarehouseCode" label="调出仓库编码" min-width="200" />
                <el-table-column prop="transferOutWarehouseName" label="调出仓库名称" min-width="200" sortable="custom" />
                <el-table-column prop="transferInWarehouseCode" label="调入仓库编码" min-width="200" />
                <el-table-column prop="transferInWarehouseName" label="调入仓库名称" min-width="200" sortable="custom" />
                <el-table-column prop="reasonRejection" label="驳回理由" min-width="200" />
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" min-width="200" sortable="custom" />
                <el-table-column prop="submitDate" label="提交时间" min-width="180" sortable="custom" />
                <el-table-column prop="receiveName" label="接收人" min-width="120" />
                <el-table-column prop="receiveTime" label="接收时间" min-width="180" sortable="custom" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column prop="documentStatus" label="单据状态" width="120" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                    <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="approvalStatus" label="审批状态" width="120" align="center" fixed="right">
                  <template slot-scope="scope">
                    <el-tag type="warning"
                      v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus !== 'draft'">审批中</el-tag>
                    <el-tag type="success"
                      v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus !== 'draft'">审批通过</el-tag>
                    <el-tag type="danger"
                      v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus !== 'draft'">审批拒绝</el-tag>
                  </template>
                </el-table-column> -->
                <el-table-column prop="receiveStatus" label="接收状态" width="120" sortable="custom" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <el-tag type="warning"
                      v-if="scope.row.receiveStatus == 'not_received' && scope.row.documentStatus !== 'draft'">待接收</el-tag>
                    <el-tag type="success"
                      v-else-if="scope.row.receiveStatus == 'received' && scope.row.documentStatus !== 'draft'">已接收</el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.id, false)" @del="handleDel(scope.row.id)"
                      :editDisabled="scope.row.documentStatus === 'submit' && scope.row.approvalStatus === 'ok'"
                      :delDisabled="scope.row.documentStatus === 'submit' && scope.row.approvalStatus === 'ok'">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">
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
                    <el-input v-model="linesQuery.orderNo" @keyup.enter.native="search()" placeholder="请输入调拨单号"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.transferOutWarehouseName" @keyup.enter.native="search()"
                      placeholder="请输入调出仓库名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.transferInWarehouseName" @keyup.enter.native="search()"
                      placeholder="请输入调入仓库名称" clearable />
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
              <div class="JNPF-common-head" style="padding:10px">
                <topOpts @add="addOrUpdateHandle()" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" ref="linesDataTable" :data="linesTableData" @sort-change="sortChange"
                custom-column fixedNO :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="调拨单号" width="200" fixed="left" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary"
                      @click.native="addOrUpdateHandle(scope.row.pickingId, true, scope.row.inboundId)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="transferOutWarehouseCode" label="调出仓库编码" min-width="200" />
                <el-table-column prop="transferOutWarehouseName" label="调出仓库名称" min-width="200" sortable="custom" />
                <el-table-column prop="transferInWarehouseCode" label="调入仓库编码" min-width="200" />
                <el-table-column prop="transferInWarehouseName" label="调入仓库名称" min-width="200" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productName" label="产品名称" min-width="120" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="120" sortable="custom" />
                <el-table-column prop="num" label="数量（主）" min-width="120" />
                <el-table-column prop="mainUnit" label="单位（主）" min-width="120" />
                <el-table-column prop="deputyNum" label="数量（副）" min-width="120" />
                <el-table-column prop="deputyUnit" label="单位（副）" min-width="120" />
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="160" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.pickingId, false)" @del="handleDel(scope.row.pickingId)"
                      :editDisabled="scope.row.documentStatus === 'submit' && scope.row.approvalStatus === 'ok'"
                      :delDisabled="scope.row.documentStatus === 'submit' && scope.row.approvalStatus === 'ok'">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.pickingId, true)">
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
        <el-form v-model="listQuery" label-width="120px" label-position="top" v-if="activeName === 'dataTable'">
          <el-col :span="12">
            <el-form-item label="调出仓库名称">
              <el-input v-model="listQuery.transferOutWarehouseName" placeholder="请输入调出仓库名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调入仓库名称">
              <el-input v-model="listQuery.transferInWarehouseName" placeholder="请输入调入仓库名称" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;">
                <el-option v-for="item in approvalStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;">
                <el-option v-for=" item in [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }] "
                  :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收状态">
              <el-select v-model="listQuery.receiveStatus" placeholder="请选择接收状态" clearable style="width: 100%;">
                <el-option v-for=" item in receiveStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 明细表 -->
        <el-form v-model="linesQuery" label-width="120px" label-position="top" v-else>
          <el-col :span="12">
            <el-form-item label="调拨单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入调拨单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调出仓库名称">
              <el-input v-model="linesQuery.transferOutWarehouseName" placeholder="请输入调出仓库名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调入仓库名称">
              <el-input v-model="linesQuery.transferInWarehouseName" placeholder="请输入调入仓库名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
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

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>
  
<script>
import { getTransferList, deleteTransferData, getTransferLinesList } from '@/api/warehouseManagement/transferManagement'
import Form from './Form.vue'
export default {
  components: { Form },
  data() {
    return {
      activeName: "dataTable",
      formVisible: false,
      visible: false,
      approvalStatusList: [{ label: '审批中', value: 'ing' }, { label: '审批通过', value: 'ok' }, { label: '审批拒绝', value: 'rebut' }],
      receiveStatusList: [{ label: "待接收", value: "not_received" }, { label: "已接收", value: "received" }],
      listLoading: false,

      tableData: [],
      listQuery: {},
      initListQuery: {
        code: "",
        name: "",
        drawNo: "",
        productCode: "",
        productName: "",
        startTime: "",
        endTime: "",
        startAndEndTime: [],
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        approvalStatus: "",
        documentStatus: "",
        transferType: "allocate_transfer",
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},
      initLinesQuery: {
        approvalStatus: "",
        batchNumber: "",
        createByName: "",
        documentStatus: "",
        noneWarehouse: false,
        orderNo: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        receiveStatus: "",
        transferInWarehouseName: "",
        transferOutWarehouseCode: "",
        transferOutWarehouseName: "",
        transferType: "allocate_transfer",
        type: "",
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
        getTransferList(this.listQuery).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
      } else {
        getTransferLinesList(this.linesQuery).then(res => {
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
        if (['productCode', 'productName', 'drawNo', 'transferOutWarehouseName', 'transferInWarehouseName'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.listQuery.orderItems[0].asc = order === 'ascending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (['transferOutWarehouseName', 'transferInWarehouseName', 'productName', 'productDrawingNo', 'createTime'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.linesQuery.orderItems[0].asc = order === 'ascending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    addOrUpdateHandle(id, readOnly) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(id, readOnly) })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteTransferData(id).then(res => {
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