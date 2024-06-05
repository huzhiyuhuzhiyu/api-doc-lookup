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
                    <el-input v-model="listQuery.orderNo" placeholder="请输入出库单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="listQuery.originType" placeholder="请选择来源类型" clearable style="width: 100%;">
                      <el-option v-for="item in searchOriginTypeList" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.originNo" placeholder="请输入来源单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}
                    </el-button>
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
              <JNPF-table v-loading="listLoading" :data="tableData" fixedNO @sort-change="sortChange" custom-column
                ref="dataTable">
                <el-table-column prop="orderNo" label="出库单号" min-width="200" fixed="left" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true, scope.row.sourceType)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceType" label="来源类型" min-width="120" fixed="left" sortable="custom"
                  :formatter="sourceTypeFormatter" />
                <el-table-column prop="sourceNo" label="来源单号" min-width="200" fixed="left" sortable="custom" />
                <el-table-column prop="partnerCode" label="合作伙伴编码" min-width="160" sortable="custom" />
                <el-table-column prop="partnerName" label="合作伙伴名称" min-width="160" sortable="custom" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="160" />
                <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                    <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <el-tag type="warning"
                      v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus != 'draft'">审批中</el-tag>
                    <el-tag type="success"
                      v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus != 'draft'">审批通过</el-tag>
                    <el-tag type="danger"
                      v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus != 'draft'">审批拒绝</el-tag>
                  </template>
                </el-table-column> -->
                <el-table-column prop="printFlag" label="打印状态" width="120" align="center" fixed="right">
                  <template slot-scope="scope" v-if="scope.row.sourceType === 'outbound_sale_send'">
                    <el-tag type="warning" v-if="!scope.row.printFlag">未打印</el-tag>
                    <el-tag type="success" v-else-if="scope.row.printFlag">已打印</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)"
                      :editDisabled="scope.row.documentStatus === 'submit'"
                      :delDisabled="scope.row.documentStatus === 'submit'">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true, scope.row.sourceType)">
                            查看详情
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.sourceType === 'outbound_sale_send'"
                            @click.native="printOrder(scope.row.id, scope.row.printFlag)">
                            打印发货清单
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.sourceType === 'outbound_sale_send'"
                            @click.native="exportFile(scope.row.id, 'downLoad')">
                            下载发货清单
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.sourceType === 'outbound_sale_send'"
                            @click.native="printPack(scope.row.id, scope.row.printFlag, scope.row.barcode)">
                            打印装箱清单
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.sourceType === 'outbound_sale_send'"
                            @click.native="exportPackFile(scope.row.id, scope.row.barcode, 'downLoad')">
                            下载装箱清单
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
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入出库单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="linesQuery.originType" placeholder="请选择来源类型" clearable style="width: 100%;">
                      <el-option v-for="item in originTypeList" :key="item.value" :label="item.label"
                        :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.originNo" placeholder="请输入来源单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}
                    </el-button>
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
              <JNPF-table v-loading="listLoading" :data="linesTableData" fixedNO @sort-change="sortChange" custom-column
                ref="linesDataTable" :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="出库单号" min-width="200" fixed="left" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary"
                      @click.native="addOrUpdateHandle(scope.row.moveId, true, scope.row.sourceType)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceType" label="来源类型" min-width="120" sortable="custom"
                  :formatter="sourceTypeFormatter" />
                <el-table-column prop="sourceNo" label="来源单号" min-width="200" sortable="custom" />
                <el-table-column prop="partnerCode" label="合作伙伴编码" fixed="left" min-width="160" sortable="custom" />
                <el-table-column prop="partnerName" label="合作伙伴名称" fixed="left" min-width="160" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productName" label="产品名称" min-width="120" sortable="custom" />
                <el-table-column prop="drawingNo" label="产品图号" min-width="120" sortable="custom" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="140" />
                <el-table-column prop="processName" label="工序名称" min-width="120" />
                <el-table-column prop="num" label="数量（主）" min-width="120" />
                <el-table-column prop="mainUnit" label="单位（主）" min-width="120" />
                <el-table-column prop="deputyNum" label="数量（副）" min-width="120" />
                <el-table-column prop="deputyUnit" label="单位（副）" min-width="120" />
                <el-table-column prop="originalBatchNumber" label="产品原批号" min-width="180" />
                <el-table-column prop="batchNumber" label="批次号" min-width="180" sortable="custom" />
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="160" />
                <el-table-column prop="printFlag" label="打印状态" width="120" align="center" fixed="right">
                  <template slot-scope="scope" v-if="scope.row.sourceType === 'outbound_sale_send'">
                    <el-tag type="warning" v-if="!scope.row.printFlag">未打印</el-tag>
                    <el-tag type="success" v-else-if="scope.row.printFlag">已打印</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.moveId)" @del="handleDel(scope.row.moveId)"
                      :editDisabled="scope.row.documentStatus === 'submit'"
                      :delDisabled="scope.row.documentStatus === 'submit'">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            @click.native="addOrUpdateHandle(scope.row.moveId, true, scope.row.sourceType)">
                            查看详情
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.sourceType === 'outbound_sale_send'"
                            @click.native="printOrder(scope.row.moveId, scope.row.printFlag)">
                            打印发货清单
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.sourceType === 'outbound_sale_send'"
                            @click.native="exportFile(scope.row.moveId, 'downLoad')">
                            下载发货清单
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.sourceType === 'outbound_sale_send'"
                            @click.native="printPack(scope.row.moveId, scope.row.printFlag, scope.row.barcode)">
                            打印装箱清单
                          </el-dropdown-item>
                          <el-dropdown-item v-if="scope.row.sourceType === 'outbound_sale_send'"
                            @click.native="exportPackFile(scope.row.moveId, scope.row.barcode, 'downLoad')">
                            下载装箱清单
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
        <el-form :model="listQuery" label-width="120px" label-position="top" v-if="activeName === 'dataTable'">
          <el-col :span="12">
            <el-form-item label="出库单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入出库单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源类型">
              <el-select v-model="listQuery.originType" placeholder="请选择来源类型" clearable style="width: 100%;">
                <el-option v-for="item in searchOriginTypeList" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="listQuery.originNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作伙伴编码">
              <el-input v-model="listQuery.partnerCode" placeholder="请输入合作伙伴编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作伙伴名称">
              <el-input v-model="listQuery.partnerName" placeholder="请输入合作伙伴名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;">
                <el-option v-for="item in [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]"
                  :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;">
                <el-option
                  v-for="item in [{ label: '审批中', value: 'ing' }, { label: '审批通过', value: 'ok' }, { label: '审批拒绝', value: 'rebut' }]"
                  :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="请选择开始时间"
                end-placeholder="请选择结束时间" :picker-options="global.timePickerOptions"
                :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
        <!-- 明细表 -->
        <el-form :model="linesQuery" label-width="120px" label-position="top" v-else>
          <el-col :span="12">
            <el-form-item label="出库单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入出库单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源类型">
              <el-select v-model="linesQuery.originType" placeholder="请选择来源类型" clearable style="width: 100%;">
                <el-option v-for="item in originTypeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="linesQuery.originNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作伙伴编码">
              <el-input v-model="linesQuery.partnerCode" placeholder="请输入合作伙伴编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作伙伴名称">
              <el-input v-model="linesQuery.partnerName" placeholder="请输入合作伙伴名称" clearable />
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
              <el-input v-model="linesQuery.drawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批次号">
              <el-input v-model="linesQuery.batchNumber" placeholder="请输入批次号" clearable />
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
        <el-button type="primary" @click="search()">{{ $t('common.search') }}</el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm"
      :originTypeList="originTypeList" />
    <OutboundOrdersForm v-if="outboundOrdersFormVisible" ref="OutboundOrdersForm" @close="closeForm"
      :originTypeList="originTypeList" />
    <!-- 打印页面 -->
    <PrintForm ref="PrintForm" :value="printData" :dataValue="printForm" :pages="pages" />
    <!-- 装箱打印页面 -->
    <PrintPackForm ref="PrintPackForm" :value="printData" :dataValue="printForm" :pages="pages" />
    <!-- 选择条码页面 -->
    <el-dialog title="选择装箱条码" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="barcodeDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <JNPF-table ref="workerDialog" v-loading="listLoading" :data="barcodeList" border height="400">
        <el-table-column prop="barCode" label="条码" min-width="280"/>
        <el-table-column label="操作" width="90" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="selectBarcode(scope.row.barCode)">选择</el-button>
          </template>
        </el-table-column>
      </JNPF-table>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="barcodeDialog = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="getPrintPack()">确定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>

import { getWarehouseList, deleteWarehouseData, getWarehouseLinesList, exportOutboundOrder, WarehousePrintData, WarehousePrintFlag, packPrintData, packExportData, packBarCodeData } from '@/api/warehouseManagement/inboundAndOutbound'
import originTypeList from "../originTypeList.js"
import Form from './Form.vue'
import OutboundOrdersForm from '../outboundOrders/Form.vue'
import PrintForm from './printForm.vue'
import PrintPackForm from './printPackForm.vue'
export default {
  name: 'outbound',
  components: { Form, PrintForm, OutboundOrdersForm, PrintPackForm },
  data() {
    return {
      activeName: "dataTable",
      visible: false,
      listLoading: false,
      originTypeList: originTypeList.outboundList, // 出库来源类型
      searchOriginTypeList: [
        { label: "采购退货出库", value: "outbound_purchase" },
        { label: "外协退货出库", value: "outbound_external" },
        { label: "销售发货出库", value: "outbound_sale_send" },
        { label: "外协发料出库", value: "outbound_external_send" },
        { label: "生产领料出库", value: "outbound_pick_out" },
        { label: "调拨出库", value: "outbound_transfer" },
        { label: "移库出库", value: "outbound_move" },
        { label: "组装出库", value: "outbound_merge" },
        { label: "拆卸出库", value: "outbound_split" },
        { label: "形态转换出库", value: "outbound_shift" },
        { label: "销售备货出库", value: "outbound_stock_up" },
        { label: "其他", value: "io_other" }
      ],
      formVisible: false,
      outboundOrdersFormVisible: false,

      tableData: [],
      listQuery: {},
      initListQuery: {
        approvalStatus: "", // 审批状态
        documentStatus: "", // 单据状态
        orderNo: "", // 出入库单号
        originNo: "", // 来源单号
        originType: "", // 来源类型
        partnerCode: "", // 合作伙伴编码
        partnerName: "", // 合作伙伴名称
        documentType: "outbound", // 单据类型
        warehouseType: "normal", // 仓库类型 正常仓库 normal , 报废仓库 scrap
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        startAndEndTime: [], // 创建时间
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},
      initLinesQuery: {
        originType: "",
        originNo: "",
        batchNumber: "",
        createByName: "",
        orderNo: "",
        partnerCode: "",
        partnerName: "",
        productCode: "",
        drawingNo: "",
        productName: "",
        showStock: false,
        sourceNo: "",
        sourceType: "",
        documentType: "outbound", // 单据类型
        warehouseType: "normal", // 仓库类型 正常仓库 normal , 报废仓库 scrap
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
        startAndEndTime: [], // 创建时间
      },
      linesTotal: 0,
      pages: 0,      // 总页数
      printData: [], // 表格数据
      printForm: {}, // 表单数据
      barcodeDialog: false,
      barcodeList: [],
      selectId: '',   // 选择的id
      printFlag: '',   // 选择的打印标识
      printPackFlag: '',   // 区分打印和下载
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery));
    this.initData()
  },
  watch: { activeName() { this.initData() } },
  methods: {
    sortChange({ prop, order }) {
      let newProp
      if (this.activeName === 'dataTable') {
        if (['partnerCode', 'partnerName'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.listQuery.orderItems[0].asc = order === 'ascending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (['partnerCode', 'partnerName', 'createTime', 'productName'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.linesQuery.orderItems[0].asc = order === 'ascending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        getWarehouseList(this.listQuery).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
      } else {
        getWarehouseLinesList(this.linesQuery).then(res => {
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
    addOrUpdateHandle(id, btnType, sourceType) {
      if (['outbound_stock_up'].includes(sourceType)) {
        this.outboundOrdersFormVisible = true
        this.$nextTick(() => { this.$refs.OutboundOrdersForm.init(id, btnType, sourceType, id) })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(id, btnType) })
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteWarehouseData(id).then(res => {
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
      this.outboundOrdersFormVisible = false
      if (isRefresh) { this.initData() }
    },
    sourceTypeFormatter(row) {
      let data = this.originTypeList.find(item => item.value === row.sourceType)
      return data ? data.label : row.sourceType
    },
    exportFile(id, type) {
      exportOutboundOrder(id).then(res => {
        if (type === 'print') {
          printJS({ printable: location.origin + res.data.url, type: 'pdf' })
        } else if (type === 'downLoad') {
          this.jnpf.downloadFile(res.data.url, res.data.name)
        }
      })
    },
    // 打印发货单
    printOrder(id, printFlag) {
      this.printData = []
      this.printForm = {}
      if (!printFlag) {
        WarehousePrintFlag(id).then(res => {
        })
      }
      WarehousePrintData(id).then(res => {
        // this.printVisible = true

        this.printData = res.data.lines
        let type = this.printData.some(item => item.productType === 'pt001')
        this.printForm = { ...res.data.stockMove, type }
        // 复制数据测试 打印分页
        // for (var i = 0; i < 6; i++) {
        //   this.printData = this.printData.concat(this.printData); 
        // }
        // console.log(Math.ceil(this.printData.length/20));
        this.pages = Math.ceil(this.printData.length / 20)
        this.printData = this.printPageDataFn(this.printData, 20)
        this.$nextTick(() => {
          let oldStr = window.document.body.innerHTML;
          let newStr = this.$refs.PrintForm.$el.innerHTML;

          const iframe = document.createElement('iframe');
          iframe.setAttribute('style', 'position: absolute; width: 0;height: 0;');
          document.body.appendChild(iframe);
          const doc = iframe.contentWindow.document;
          // 4. 写入内容
          doc.write('<style media="print"> @page {size: portrait;margin: 5mm; padding: 0;}</style>');
          doc.write(`<link href="./printForm.scss" media="print" rel="stylesheet" />`);
          doc.write(newStr);
          const link = doc.getElementsByTagName('link')[0];
          link.onload = () => { // 样式文件加载完毕后打印// 5.执行打印
            iframe.contentWindow.print();
            iframe.contentWindow.location.reload(true)
            // 6.重置工作
            document.body.removeChild(iframe);
            this.$refs.PrintForm.$el.removeAttribute('style');
          }
          iframe.contentWindow.addEventListener('afterprint', () => {
            this.$message.success('打印完成')
            this.initData()
          });
        });



      })
    },
    // 处理分页
    printPageDataFn(data, pageSize = 20) {
      const printTable = []
      if (data && data.length > 0) {
        let remainderLength = Math.floor(data.length / pageSize) * pageSize
        let pagedata = []
        let pageNum = 0
        for (let i = 0; i < data.length; i++) {
          if (pageNum < pageSize) {
            pagedata.push(data[i])
          }
          pageNum++
          if (pageNum === pageSize || (i > remainderLength && i === data.length - 1)) {
            printTable.push({
              // total: pagedata.reduce((accumulator, currentValue) => accumulator + currentValue.totalAmount * 1, 0),
              // UpperMoney: this.digitUppercase(pagedata.reduce((accumulator, currentValue) => accumulator + currentValue.totalAmount * 1, 0).toFixed(2)),
              pagedata: pagedata
            })
            pagedata = []
            pageNum = 0
          }
        }
        if (pageSize > data.length && pagedata && pagedata.length > 0) {
          printTable.push({
            // total: pagedata.reduce((accumulator, currentValue) => accumulator + currentValue.totalAmount, 0),
            // UpperMoney: this.digitUppercase(pagedata.reduce((accumulator, currentValue) => accumulator + currentValue.totalAmount * 1, 0).toFixed(2)),
            pagedata: pagedata
          })
        }
      }
      return printTable
    },
    // 处理金额
    digitUppercase(n) {
      var fraction = ['角', '分'];
      var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
      ];
      var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ];
      var head = n < 0 ? '欠' : '';
      n = Math.abs(n);
      var s = '';
      for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
      }
      s = s || '整';
      n = Math.floor(n);
      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
      }
      return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
    },

    // 选择条码
    selectBarcode(barcode) {
      this.barcodeDialog = false
      if (this.printPackFlag === 'print') {
        this.getPrintPack(this.selectId, this.printFlag, barcode)
      }
      if (this.printPackFlag === 'download') {
        this.downloadPack(this.selectId,barcode)
      }
    },
    // 装箱清单打印
    getPrintPack(id, printFlag, barCode) {
      this.printData = []
      this.printForm = {}
      let data = {
        id,
        barcode: barCode
      }
      if (!printFlag) {
        WarehousePrintFlag(id).then(res => {
        })
      }
      packPrintData(data).then(res => {
        // this.printVisible = true

        this.printData = res.data.lines
        let type = this.printData.some(item => item.productType === 'pt001')
        this.printForm = { ...res.data.stockMove, type, barCode }
        // 复制数据测试 打印分页
        // for (var i = 0; i < 6; i++) {
        //   this.printData = this.printData.concat(this.printData); 
        // }
        // console.log(Math.ceil(this.printData.length/20));
        this.pages = Math.ceil(this.printData.length / 20)
        this.printData = this.printPageDataFn(this.printData, 20)
        this.$nextTick(() => {
          let oldStr = window.document.body.innerHTML;
          let newStr = this.$refs.PrintPackForm.$el.innerHTML;

          const iframe = document.createElement('iframe');
          iframe.setAttribute('style', 'position: absolute; width: 0;height: 0;');
          document.body.appendChild(iframe);
          const doc = iframe.contentWindow.document;
          // 4. 写入内容
          doc.write('<style media="print"> @page {size: portrait;margin: 5mm; padding: 0;}</style>')
          doc.write(`<link href="./printForm.scss" media="print" rel="stylesheet" />`);
          doc.write(newStr);
          const link = doc.getElementsByTagName('link')[0];
          link.onload = () => { // 样式文件加载完毕后打印// 5.执行打印
            iframe.contentWindow.print();
            iframe.contentWindow.location.reload(true)
            // 6.重置工作
            document.body.removeChild(iframe);
            this.$refs.PrintPackForm.$el.removeAttribute('style');
          }
          iframe.contentWindow.addEventListener('afterprint', () => {
            this.$message.success('打印完成')
            this.initData()
          });
        });
      })
    },
    // 打印装箱清单
    async printPack(id, printFlag, barcode) {
      this.printPackFlag = 'print'
      this.selectId = id
      this.printFlag = printFlag
      const res = await packBarCodeData(id)
      if (res.data) {
        this.barcodeList = res.data
        if (this.barcodeList.length > 1) {
          this.barcodeDialog = true
        } else {
          this.getPrintPack(this.selectId, this.printFlag, this.barcodeList[0].barCode)
        }
      } else {
        this.$message.warning('暂无装箱条码')
      }
    },
    // 进行条码筛选
    async exportPackFile(id, barcode) {
      this.printPackFlag = 'download'
      this.selectId = id
      const res = await packBarCodeData(id)
      if (res.data) {
        this.barcodeList = res.data
        if (this.barcodeList.length > 1) {
          this.barcodeDialog = true
        } else {
          this.downloadPack(id,this.barcodeList[0].barCode)
        }
      } else {
        this.$message.warning('暂无装箱条码')
      }
    },
    downloadPack(id, barcode) {
      let data = {
        id,
        barcode
      }
      packExportData(data).then(res => {
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
::v-deep .JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body{
  padding: 10px 20px 10px !important
}
  
</style>