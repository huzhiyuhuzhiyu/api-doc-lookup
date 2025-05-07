<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="18">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="listQuery.barCode" placeholder="请输入条码" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="listQuery.productsDrawingNo" placeholder="请输入产品图号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="创建开始时间"
                      end-placeholder="创建结束时间" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
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
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts :addText="'创建新箱'" @add="addNewBox()">
                  <el-button size="mini" @click="printWithLodop(selectedData)" type="primary">批量打印条码</el-button>
                </topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO @sort-change="sortChange"
                hasC @selection-change="currentChange" custom-column customKey="JNPFTableKey_952505">
                <el-table-column prop="barCode" label="条码" fixed="left" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click="addOrUpdateHandle(scope.row.barCode, 'look')">
                      {{ scope.row.barCode }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="packingType" label="装箱类型" width="120" align="center">
                  <template slot-scope="scope">
                    {{ scope.row.packingType === 'single' ? '单装' : '混装' }}
                  </template>
                </el-table-column>
                <el-table-column prop="productsName" label="产品名称" min-width="160" />
                <el-table-column prop="drawingNo" label="产品图号" min-width="200" />
                <el-table-column prop="documentType" label="来源类型" min-width="120" :formatter="documentTypeFormat" />
                <el-table-column prop="standardBoxName" label="标准箱" min-width="160" />
                <el-table-column prop="shelvesName" label="所属库位" min-width="160" />
                <el-table-column prop="remark" label="备注" min-width="160" />
                <el-table-column prop="createByName" label="创建人" width="160" />
                <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom" />
                <el-table-column prop="boxStatus" label="箱状态" fixed="right" width="160" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.boxStatus === 'not_received'"><el-tag type="warning">待入库</el-tag></div>
                    <div v-if="scope.row.boxStatus === 'received'"><el-tag type="success">已入库</el-tag></div>
                    <div v-if="scope.row.boxStatus === 'empty'"><el-tag>空箱待入库</el-tag></div>
                    <div v-if="scope.row.boxStatus === 'direct'"><el-tag>直接装箱待入库</el-tag></div>
                    <div v-if="scope.row.boxStatus === 'voided'"><el-tag type="danger">已作废</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.boxStatus !== 'empty'" type="text"
                      @click="addOrUpdateHandle(scope.row.id, 'edit')">拆箱</el-button>
                    <el-button size="mini" v-if="scope.row.boxStatus === 'empty'" type="text"
                      @click="packBox(scope.row)">装箱</el-button>
                    <el-button size="mini" type="text"
                      @click="changeBarCodeHandle(scope.row.id, 'edit')">更换条码</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="printWithLodop(scope.row, scope.row.packingType)">
                          打条码
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.barCode, 'look')">
                          查看详情
                        </el-dropdown-item>
                        <!-- <el-dropdown-item @click.native="addNewBox()">
                          创建新箱
                        </el-dropdown-item> -->
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.barCode" placeholder="请输入条码" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" @keyup.enter.native="search()"
                      clearable />
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
                  @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts :addText="'创建新箱'" @add="addNewBox()" />
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true"
                @sort-change="sortChange" custom-column :partentOrChild="'child'">

                <el-table-column prop="barCode" label="条码" fixed="left" width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click="addOrUpdateHandle(scope.row.barCode, 'look')">
                      {{ scope.row.barCode }}
                    </el-link>
                  </template>
                </el-table-column>

                <el-table-column prop="standardBoxName" label="标准箱" min-width="160" />
                <el-table-column prop="boxStatus" label="箱状态" fixed="right" width="160" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.boxStatus === 'not_received'"><el-tag type="warning">待入库</el-tag></div>
                    <div v-if="scope.row.boxStatus === 'received'"><el-tag type="success">已入库</el-tag></div>
                    <div v-if="scope.row.boxStatus === 'empty'"><el-tag>空箱待入库</el-tag></div>
                    <div v-if="scope.row.boxStatus === 'direct'"><el-tag>直接装箱待入库</el-tag></div>
                    <div v-if="scope.row.boxStatus === 'voided'"><el-tag type="danger">已作废</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="shelvesName" label="所属库位" width="160" />

                <el-table-column prop="productsCode" label="产品编码" min-width="160" />
                <el-table-column prop="productsName" label="产品名称" min-width="160" sortable="custom" />
                <el-table-column prop="drawingNo" label="产品图号" min-width="160" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="160" />
                <el-table-column prop="processName" label="工序名称" min-width="160" />
                <el-table-column prop="documentType" label="来源类型" min-width="120" :formatter="documentTypeFormat" />
                <el-table-column prop="realityTotalNum" label="实际数量" min-width="160" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="160" />


                <el-table-column prop="remark" label="备注" width="160" />
                <el-table-column prop="createByName" label="创建人" width="160" />
                <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom" />

                <el-table-column label="操作" min-width="200" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" v-if="scope.row.boxStatus !== 'empty'"
                      @click="addOrUpdateHandle(scope.row.boxBarcodeId, 'edit')">拆箱</el-button>
                    <el-button size="mini" v-if="scope.row.boxStatus === 'empty'" type="text"
                      @click="packBox(scope.row)">装箱</el-button>
                    <el-button size="mini" type="text"
                      @click="changeBarCodeHandle(scope.row.boxBarcodeId, 'edit')">更换条码</el-button>

                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="printWithLodop(scope.row, scope.row.packingType)">
                          打条码
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addNewBox()">
                          创建新箱
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
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

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <depForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <emptyBox v-if="emptyBoxVisible" ref="emptyBox" @close="closeForm" />
    <emptyPackBox v-if="emptyPackBoxVisible" ref="emptyPackBox" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">

      <el-row :gutter="20">
        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="条码">
              <el-input v-model="linesQuery.barCode" placeholder="请输入条码" clearable />
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
            <el-form-item label="工艺路线名称">
              <el-input v-model="linesQuery.routingName" placeholder="请输入工艺路线名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="linesQuery.processName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="创建开始时间" end-placeholder="创建结束时间"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
    <ComSelect-page ref="ComSelect-page" :tableItems="barCodeBoxTableItems" dialogTitle="条码箱产品明细"
      :listMethod="detailByBarCodes" :listRequestObj="activeBarCode" :elementShow="false" :renderTree="false"
      :listDataFormatting="barCodeBoxListDataFormatting">
      <template slot="top">
        <h3 style="padding:0 0 8px 10px;">条码：{{ activeBarCode.barCodes[0] }}</h3>
      </template>
      <template slot="table-action">
        <div>1</div>
      </template>
    </ComSelect-page>

    <el-dialog title="选择生产日期" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="dateSelectVisable" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-row :gutter="20">
        <el-form label-width="120px" label-position="top">
          <el-col :span="24">
            <el-form-item>
              <el-date-picker v-model="productionDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                :picker-options="global.timePicker" placeholder="请选择生产日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dateSelectVisable = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dateSelectSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { stockBoxBarcodeList, lineStockBoxBarcode, detailByBarCodes } from '@/api/warehouseManagement/packingList'
import barCodePrint from '@/views/warehouseManagement/containerControl/barcodeManagement/barCodePrint.js'
import Form from './Form'
import depForm from './depForm'
import emptyBox from './emptyBox'
import emptyPackBox from './emptyPackBox'
export default {
  name: 'purchaseReBoxes',
  components: { Form, depForm, emptyBox, emptyPackBox },
  data() {
    return {
      emptyBoxVisible: false,
      emptyPackBoxVisible: false,
      activeName: 'dataTable',
      depFormVisible: false,
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      packingTypeList: [
        { label: "单装", value: "single" },
        { label: "混装", value: "mixed" },
      ],
      listQuery: {},
      initListQuery: {
        barCode: "",
        createByName: "",
        endTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        processName: "",
        productCode: "",
        productName: "",
        routingName: "",
        sourceBarCode: "",
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createTimeArr: [],
      },
      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        barCode: "",
        createByName: "",
        endTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        processName: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        routingName: "",
        sourceBarCode: "",
        startTime: "",
        createTimeArr: [],
      },
      standardBoxName: '',
      oddBoxName: '',
      total: 0,
      formVisible: false,
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      selectedData: [],
      detailByBarCodes,
      activeBarCode: { barCodes: [] },
      barCodeBoxTableItems: [
        { prop: 'productsCode', label: '产品编码', minWidth: '120' },
        { prop: 'productsName', label: '产品名称', minWidth: '120' },
        { prop: 'drawingNo', label: '产品图号', minWidth: '200' },
        { prop: 'routingName', label: '工艺路线名称', minWidth: '120' },
        { prop: 'processName', label: '工序名称', minWidth: '120' },
        { prop: 'num', label: '数量', minWidth: '120' },
        { prop: 'mainUnit', label: '单位', minWidth: '120' }
      ],

      productionDate: '',
      dateSelectVisable: false,

      sourceTypeList: [{
        label: '采购收货装箱',
        value: 'purchase_receiving'
      }, {
        label: '外协收货装箱',
        value: 'external_receiving'
      }, {
        label: '外协退料装箱',
        value: 'external_return'
      }, {
        label: '销售退货装箱',
        value: 'sale_return'
      }, {
        label: '生产入库装箱',
        value: 'inbound_production'
      }, {
        label: '生产退料装箱',
        value: 'return_production'
      }, {
        label: '货位装箱',
        value: 'goods_allocation'
      }, {
        label: '直接装箱',
        value: 'direct_allocation'
      }],
    }
  },
  watch: { activeName() { this.initData() } },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    printWithLodop(row, type) {
      if (this.dateSelectVisable) this.dateSelectVisable = false
      else {
        if (Array.isArray(row) && !this.dateSelectVisable) {
          if (this.selectedData.some(row => row.documentType === 'purchase_receiving' && row.productCategoryCode == '6' && row.productType === 'pt001')) {
            this.productionDate = this.jnpf.getToday()
            this.tempPrintData = this.selectedData // 暂存打印数据
            this.dateSelectVisable = true // 唤起日期选择框
            return
          }
        } else {
          if (row.documentType === 'purchase_receiving' && row.productCategoryCode == '6' && row.productType === 'pt001') {
            this.productionDate = this.jnpf.getToday()
            this.tempPrintData = row // 暂存打印数据
            this.dateSelectVisable = true // 唤起日期选择框
            return
          }
        }
      }
      const callBack = () => {
        this.$refs.dataTable.$refs.JNPFTable.clearSelection()
        this.$refs.linesTableData.$refs.JNPFTable.clearSelection()
        this.selectedData = []
      }
      barCodePrint(row, callBack, type)
    },
    sortChange({ prop, order }) {
      let newProp;
      if (['partnerCode', 'partnerName', 'shipperName', 'createByName', 'productsName', 'routingName', 'processName', 'submitDate'].includes(prop)) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      }
      if (prop === 'createByName') {
        newProp = "create_by"
      }
      if (this.activeName === 'dataTable') {
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (newProp === 'create_time') {
          newProp = "createTime"
        }
        if (prop === 'barCode') {
          newProp = prop
        }
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },

    moreQueries() {
      this.visible = true
    },


    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.emptyPackBoxVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        if (this.listQuery.createTimeArr && this.listQuery.createTimeArr.length > 0) {
          this.listQuery.startTime = this.listQuery.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.listQuery.endTime = this.listQuery.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.listQuery.startTime = ''
          this.listQuery.endTime = ''
        }
        this.jnpf.searchTimeFormat(this.listQuery, 'submitDateArr', 'submitStartDate', 'submitEndDate')
        stockBoxBarcodeList(this.listQuery).then(res => {
          console.log("res++", res);
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArr', 'startTime', 'endTime')
        lineStockBoxBarcode(this.linesQuery).then(res => {
          console.log("res++", res);
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }

    },
    currentChange(data) {
      this.selectedData = data
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
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
      }
      this.initData()
    },


    async addOrUpdateHandle(id, btntype) {
      if (btntype === 'look') {
        this.activeBarCode = { barCodes: [id] }
        this.$refs['ComSelect-page'].openDialog()
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype)
        })
      }
    },
    changeBarCodeHandle(id, btntype) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, btntype)
      })
    },
    addNewBox() {
      this.emptyBoxVisible = true
      this.$nextTick(() => {
        this.$refs.emptyBox.init()
      })
    },
    packBox(row) {
      this.emptyPackBoxVisible = true
      this.$nextTick(() => {
        this.$refs.emptyPackBox.init(row)
      })
    },
    // 条码详情格式化
    barCodeBoxListDataFormatting(res) {
      const data = res.data.map(box => box.barcodeLineVOs.map(boxLine => ({
        ...boxLine,
        num: boxLine.realityTotalNum
      }))).flat()
      return data
    },
    // 日期选择框提交
    dateSelectSubmit() {
      // this.dateSelectVisable = false
      if (Array.isArray(this.tempPrintData)) {
        this.tempPrintData = this.tempPrintData.map(item => ({
          ...item,
          productionDate: this.productionDate
        }))
      } else {
        this.tempPrintData.productionDate = this.productionDate
      }
      this.printWithLodop(this.tempPrintData)
      delete this.tempPrintData
    },
    // 数据转换
    documentTypeFormat(row) {
      let target = this.sourceTypeList.find(item => item.value === row.documentType)
      return target ? target.label : row.documentType
    },
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
