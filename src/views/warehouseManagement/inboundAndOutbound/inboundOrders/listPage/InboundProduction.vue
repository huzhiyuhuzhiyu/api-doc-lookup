<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName">

        <el-tab-pane label="生产订单入库" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.orderNo" placeholder="请输入生产单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.processName" placeholder="请输入工序名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
                  @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <el-page-header @back="$emit('close', true)" :content="'生产入库'" />
                <el-button size="mini" @click="inboundBatch" type="primary">批量入库</el-button>
              </div>
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column hasC @selection-change="currentChange">
                <el-table-column prop="orderNo" label="生产单号" width="200" fixed="left" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true, 'order')">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productName" label="产品名称" min-width="120" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="120" sortable="custom" />
                <el-table-column prop="partnerName" label="客户名称" min-width="120" sortable="custom" />
                <el-table-column prop="completedQuantity" label="待入库数量" min-width="120" :formatter="numFormat" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />

                <el-table-column label="操作" width="140" fixed="right">

                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row, false, 'order')" :editText="'入库'" :hasDel="false">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, true, 'order')">
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

        <el-tab-pane label="生产工单入库" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入工单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.productionOrderNo" placeholder="请输入生产单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.processName" placeholder="请输入工序名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
                  @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <el-page-header @back="$emit('close', true)" :content="'生产入库'" />
                <el-button size="mini" @click="inboundBatch" type="primary">批量入库</el-button>
              </div>
              <JNPF-table ref="linesTable" v-loading="listLoading" :data="linesTableData" :fixedNO="true"
                @sort-change="sortChange" custom-column hasC @selection-change="currentChange">
                <el-table-column prop="orderNo" label="工单号" width="200" fixed="left" sortable="custom">

                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true, 'work')">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productName" label="产品名称" min-width="120" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="120" sortable="custom" />
                <el-table-column prop="productionOrderNo" label="生产单号" min-width="200" sortable="custom" />
                <el-table-column prop="processCode" label="工序编码" min-width="120" />
                <el-table-column prop="processName" label="工序名称" min-width="120" sortable="custom" />
                <el-table-column prop="completedQuantity" label="待入库数量" min-width="120" :formatter="numFormat" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />

                <el-table-column label="操作" width="140" fixed="right">

                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row, false, 'work')" :editText="'入库'" :hasDel="false">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, true, 'work')">
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
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm"
      :originTypeList="originTypeList" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" />
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form :model="listQuery" label-width="120px" label-position="top" v-if="activeName === 'dataTable'">
          <el-col :span="12">
            <el-form-item label="生产单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入生产单号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="listQuery.partnerCode" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="工单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="工序编码">
              <el-input v-model="listQuery.processCode" placeholder="请输入工序编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="listQuery.processName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col> -->
        </el-form>
        <el-form :model="linesQuery" label-width="120px" label-position="top" v-else>
          <el-col :span="12">
            <el-form-item label="工单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入工单号" clearable />
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
            <el-form-item label="生产单号">
              <el-input v-model="linesQuery.productionOrderNo" placeholder="请输入生产单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序编码">
              <el-input v-model="linesQuery.processCode" placeholder="请输入工序编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="linesQuery.processName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWorkList } from "@/api/productOrdes/index"
import Form from '../Form.vue'
import DetailForm from '../detailForm/InboundProduction.vue'
import { ordershengchanList } from '@/api/productOrdes/index'
export default {
  components: { Form, DetailForm },
  props: {
    originTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeName: "dataTable",
      visible: false,
      listLoading: false,
      formVisible: false,
      detailFormVisible: false,
      selectedData: [],

      tableData: [],
      listQuery: {},
      initListQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "packing_time"
        }],
        pageNum: 1,
        pageSize: 20,
        stockFlag: 1,
        orderNo: "",
        partnerName: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        packingNumFlag: true, // 是否装箱数量大于入库数量
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},
      initLinesQuery: {
        // firstInspection: false,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "packing_time"
        }],
        pageNum: 1,
        pageSize: 20,
        stockFlag: 1,
        productionOrderNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        processingType: "self_produced",
        orderNo: "",
        processCode: "",
        processName: "",
        packingNumFlag: true, // 是否装箱数量大于入库数量
      },
      linesTotal: 0,
    }
  },
  watch: { activeName() { this.initData() } },
  created() {
    if (this.$parent.productionCard === 'work') this.activeName = 'linesTable'
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      if (this.activeName == "dataTable") {
        ordershengchanList(this.listQuery).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        getWorkList(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    currentChange(data) {
      this.selectedData = data
    },
    inboundBatch() {
      if (!this.selectedData.length) return this.$message.error('请先选择要入库的数据')
      if (this.activeName == "dataTable") {
        let flag = this.selectedData.every(item => item.cooperativePartnerId === this.selectedData[0].cooperativePartnerId);
        if (flag) {
          this.formVisible = true
          this.$nextTick(() => { this.$refs.Form.init(this.selectedData, undefined, "inbound_order_production_batch") })
        } else {
          this.$message.error('生产订单批量入库所选数据的客户必须是同一个')
        }
      } else {
        let flag = this.selectedData.every(item => item.processId === this.selectedData[0].processId);
        if (flag || true) {
          this.formVisible = true
          this.$nextTick(() => { this.$refs.Form.init(this.selectedData, undefined, "inbound_production_batch") })
        } else {
          this.$message.error('生产工单批量入库所选数据的生产工序必须相同')
        }
      }
    },
    sortChange({ prop, order }) {
      let newProp;
      if (this.activeName === 'dataTable') {
        if (['productName', 'productDrawingNo', 'processName', 'partnerName'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (['productionOrderNo', 'productName', 'productDrawingNo', 'processName'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      if (isRefresh) { this.initData() }
    },
    search() {
      if (this.activeName === 'dataTable') {
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
      } else {
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
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
      }
      this.initData()
    },
    addOrUpdateHandle(rowData, readOnly, type) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(rowData, readOnly, type === 'order' ? 'inbound_order_production' : `inbound_production`) })
      return
      if (readOnly) {
        this.detailFormVisible = true
        this.$nextTick(() => { this.$refs.DetailForm.init(id, readOnly) })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(rowData, undefined, "inbound_production") })
      }
    },
    numFormat(row) {
      // if (this.activeName === 'dataTable') {
      //   // 检验合格数量-已入库数量
      //   return this.jnpf.math('subtract', [row.qualifiedQuantity, row.receivedQuantity])
      // }
      // 完工数量-已入库数量
      return this.jnpf.math('subtract', [row.completedQuantity, row.receivedQuantity])
    }
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />