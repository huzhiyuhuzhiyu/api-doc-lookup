<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="每日生产" name="produce">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                  <el-col :span="4">
                <el-form-item>
                  <el-date-picker v-model="productionDate" type="daterange" value-format="yyyy-MM-dd"
                    style="width: 100%;" start-placeholder="请选择生产开始日期" end-placeholder="请选择生产结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
               <template v-for="item in searchList1">
                <el-col :span="item.searchType === 3 ? 6 : 3">
                  <el-form-item>
                    <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                      @keyup.enter.native="search('basic')" />
                  
                    <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                      clearable>
                      <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                        :value="item2.value"></el-option>
                    </el-select>
                    <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                      :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                      :type="item.dateType"
                      :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                  </el-form-item>
                </el-col>
              </template>
           
                <el-col :span="4">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col> 
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableProduce','1250')"> 导出</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFunProduce()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
 
              <JNPF-table ref="dataTableProduce" v-loading="listLoading" :data=" produceData" :fixedNO="true" @sort-change="sortChange" custom-column>
                <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="productionOrderNo" label="生产任务单号" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="workNo" label="工单单号" min-width="180" />
                <el-table-column prop="orderNo" label="报工单号" min-width="180" />
                <el-table-column prop="reportingTime" label="报工时间" min-width="180" />
                <el-table-column prop="producerName" label="生产人" min-width="120" />
                <el-table-column prop="processName" label="工序名称" min-width="120" />
                <el-table-column prop="processCode" label="工序编码" min-width="120" />
                <el-table-column prop="equipmentName" label="设备名称" min-width="120" />
                <el-table-column prop="equipmentCode" label="设备编码" min-width="120" />
                <el-table-column prop="productName" label="产品名称" min-width="120" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="120" />
                <el-table-column prop="reportingQuantity" label="报工数量" min-width="120" />
                <el-table-column prop="actualQualifiedQuantity" label="实际合格数量" width="160" sortable="custom"></el-table-column>
                <AttributeDictionaryLine :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'produce'" />
                <el-table-column prop="pairingModeName" label="配对方式" width="120" sortable="custom"></el-table-column>
                <AttributeDictionaryLine :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'produce'" />
                <el-table-column prop="greaseMethod" label="注脂方式" width="120" sortable="custom"></el-table-column>
                <AttributeDictionaryLine :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'produce'" />
                <el-table-column prop="mainUnit" label="单位" width="100" sortable="custom"></el-table-column>
              </JNPF-table>
              <pagination :total="produceTotal" :page.sync="productForm.pageNum" :limit.sync="productForm.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryProduceVisible" ref="SuperQuery" :columnOptions="superQueryProduct" @superQuery="superQuerySearchProduce" @close="superQueryProduceVisible = false" />
           <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
          </div>
       
        </el-tab-pane>
        <el-tab-pane label="每日生产入库" name="inbound">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                  <el-col :span="4">
                <el-form-item>
                  <el-date-picker v-model="inboundDate" type="daterange" value-format="yyyy-MM-dd"
                    style="width: 100%;" start-placeholder="请选择单据开始日期" end-placeholder="请选择单据结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
               <template v-for="item in searchList2">
                <el-col :span="item.searchType === 3 ? 6 : 4">
                  <el-form-item>
                    <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                      @keyup.enter.native="search('basic')" />
                  
                    <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                      clearable>
                      <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                        :value="item2.value"></el-option>
                    </el-select>
                    <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                      :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                      :type="item.dateType"
                      :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                  </el-form-item>
                </el-col>
              </template> 
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col> 
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableInbound','1251')"> 导出</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFunInbound()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
            
              <JNPF-table ref="dataTableInbound" v-loading="listLoading" :data="inboundData" :fixedNO="true" @sort-change="sortChange" custom-column>
                <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="productionOrderNo" label="生产任务单号" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="orderNo" label="入库单号" min-width="180" />
                <el-table-column prop="batchNumber" label="批次号" min-width="180" />
                <el-table-column prop="productName" label="产品名称" min-width="120" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="120" />
                <el-table-column prop="num" label="入库数量" min-width="120" />
                <el-table-column prop="warehouseName" label="仓库" min-width="120" />
                <el-table-column prop="shelfSpaceName" label="库位" min-width="120" />
                <el-table-column prop="pairingModeName" label="配对方式" width="120" sortable="custom"></el-table-column>
                <AttributeDictionaryLine :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'produce'" />
                <el-table-column prop="mainUnit" label="单位" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="orderDate" label="单据日期" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="创建人" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="remark" label="备注" width="120" sortable="custom"></el-table-column>
              </JNPF-table>
              <pagination :total="inboundTotal" :page.sync="inboundForm.pageNum" :limit.sync="inboundForm.pageSize" @pagination="initData" />
            </div>
           
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryInboundVisible" ref="SuperQuery" :columnOptions="superQueryInbound" @superQuery="superQuerySearchInbound" @close="superQueryInboundVisible = false" />
           <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />

          </div>
        </el-tab-pane>
        <el-tab-pane label="当日工单进度" name="work">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                  <el-col :span="4">
                <el-form-item>
                  <el-date-picker v-model="workForm.orderDate" type="date" value-format="yyyy-MM-dd"
                    style="width: 100%;" placeholder="请选择日期" >
                  </el-date-picker>
                </el-form-item>
              </el-col>
               <template v-for="item in searchList3">
                <el-col :span="item.searchType === 3 ? 6 : 4">
                  <el-form-item>
                    <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                      @keyup.enter.native="search('basic')" />
                  
                    <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                      clearable>
                      <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                        :value="item2.value"></el-option>
                    </el-select>
                    <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                      :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                      :type="item.dateType"
                      :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                  </el-form-item>
                </el-col>
              </template> 
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
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableWork','1252')"> 导出</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFunWork()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTableWork" v-loading="listLoading" :data="workData" :fixedNO="true" @sort-change="sortChange" custom-column>
                <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="productionOrderNo" label="生产任务单号" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="workNo" label="工单单号" min-width="180" />
                <el-table-column prop="productName" label="产品名称" min-width="120" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" />
                <el-table-column prop="mainUnit" label="单位" min-width="100" />
                <el-table-column prop="processName" label="工序名称" min-width="120" />
                <el-table-column prop="processCode" label="工序编码" min-width="120" />
                <el-table-column prop="productionQuantity" label="计划数量" min-width="120" />
                <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" />
                <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" />
                <el-table-column prop="qualifiedTotalQuantity" label="当日生产合格总数" min-width="180" />
                <el-table-column prop="proportion" label="当日生产占计划数量百分比" min-width="200" >
                     <template slot-scope="scope">
                    <el-progress :percentage="scope.row.qualifiedTotalQuantity?jnpf.numberFormat(jnpf.math('divide', [scope.row.qualifiedTotalQuantity, scope.row.productionQuantity])*100, 2):0"></el-progress>
                  </template>
                </el-table-column>
              </JNPF-table>
     
              <pagination :total="workTotal" :page.sync="workForm.pageNum" :limit.sync="workForm.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryWorkVisible" ref="SuperQuery" :columnOptions="superQueryWork" @superQuery="superQuerySearchWork" @close="superQueryWorkVisible = false" />
           <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="工序料合计" name="process">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
               <template v-for="item in searchList4">
                <el-col :span="item.searchType === 3 ? 6 : 4">
                  <el-form-item>
                    <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                      @keyup.enter.native="search('basic')" />
                  
                    <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                      clearable>
                      <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                        :value="item2.value"></el-option>
                    </el-select>
                    <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                      :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                      :type="item.dateType"
                      :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                  </el-form-item>
                </el-col>
              </template> 
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
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTableProcess','1253')"> 导出</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFunProcess()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTableProcess" v-loading="listLoading" :data="processData" :fixedNO="true" @sort-change="sortChange" custom-column>
                <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="productName" label="产品名称" min-width="180" />
                <el-table-column prop="productCode" label="产品编码" min-width="180" />
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" />
                <el-table-column prop="processName" label="工序名称" min-width="180" />
                <el-table-column prop="processCode" label="工序编码" min-width="180" />
                <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="180" />
                <el-table-column prop="warehouseName" label="所属线边仓" min-width="180" />
           
              </JNPF-table>
              <pagination :total="processTotal" :page.sync="processForm.pageNum" :limit.sync="processForm.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryProcessVisible" ref="SuperQuery" :columnOptions="superQueryProcess" @superQuery="superQuerySearchProcess" @close="superQueryProcessVisible = false" />
           <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { produceDataReport,produceInboundReport,produceWorkOrderReport,produceProcessReport } from '@/api/productOrdes/index.js'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  // name: 'modalShift',
  components: { SuperQuery,ExportForm },

  mixins: [getProjectList],
  data() {
    return {
      productionDate:[],
      produceData:[],
      produceTotal:0,
      superProductForm: {},
      productForm:{},
      productFormList:{
        produceStartDate: "",
        produceEndDate: "",
        productName: "",
        processName: "",
        producerName: "",
        equipmentName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
            {
                "asc": false,
                "column": ""
            },
            {
                "asc": false,
                "column": "createTime"
            }
        ],
        superQuery: {
            matchLogic: "AND",
            condition: []
        }
      }, 
      searchList1:[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'producerName', fieldValue: '', label: '生产人', symbol: 'like', searchType: 1, width: 120 },
        { field: 'equipmentName', fieldValue: '', label: '设备名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryProduce: [
        {
          prop: 'projectName',
          label: "所属项目",
          type: 'input'
        },
        {
          prop: 'productionOrderNo',
          label: "生产任务单号",
          type: 'input'
        }, 
        {
          prop: 'workNo',
          label: "工单单号",
          type: 'input'
        }, 
        {
          prop: 'orderNo',
          label: "报工单号",
          type: 'input'
        }, 
        { 
          prop: 'reportingTime',
          label: '报工时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'producerName',
          label: "生产人",
          type: 'input'
        }, 
        {
          prop: 'processName',
          label: "工序名称",
          type: 'input'
        },
          {
          prop: 'processCode',
          label: "工序编码",
          type: 'input'
        }, 
          {
          prop: 'equipmentName',
          label: "设备名称",
          type: 'input'
        }, 
             {
          prop: 'equipmentCode',
          label: "设备编码",
          type: 'input'
        }, 
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },   
          {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        }, 
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        }, 
        {
          prop: 'vibrationLevel',
          label: "振动等级",
          type: 'input'
        }, 
        {
          prop: 'accuracyLevel',
          label: "精度等级",
          type: 'input'
        },
         {
          prop: 'pairingModeName',
          label: "配对方式",
          type: 'input'
        },
         {
          prop: 'packagingMethod',
          label: "包装方式",
          type: 'input'
        },
       {
          prop: 'greaseMethod',
          label: "注脂方式",
          type: 'input'
        },
       {
          prop: 'sealingCoverTyping',
          label: "打字内容",
          type: 'input'
        },
       {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },  
      ],
      superQueryProduceVisible: false,



      inboundDate:[],
      inboundData:[],
      inboundTotal:0,
      superInboundForm: {},
      inboundForm:{},
      inboundFormList:{
        classAttribute: "finish_product",
        businessType: "inbound_mock_production",
        produceStartDate: "",
        produceEndDate: "",
        productName: "",
        productionOrderNo: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
            {
                "asc": false,
                "column": ""
            },
            {
                "asc": false,
                "column": "createTime"
            }
        ],
        superQuery: {
            matchLogic: "AND",
            condition: []
        }
      }, 
      searchList2:[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productionOrderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '入库单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      
      superQueryInbound: [
        {
          prop: 'projectName',
          label: "所属项目",
          type: 'input'
        },
        {
          prop: 'productionOrderNo',
          label: "生产任务单号",
          type: 'input'
        }, 
          {
          prop: 'orderNo',
          label: "入库单号",
          type: 'input'
        }, 
        {
          prop: 'batchNumber',
          label: "批次号",
          type: 'input'
        }, 
       {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },   
          {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        }, 
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        }, 
       
        {
          prop: 'warehouseName',
          label: "仓库",
          type: 'input'
        },
        {
          prop: 'warehouseName',
          label: "库位",
          type: 'input'
        },
           {
          prop: 'pairingModeName',
          label: "配对方式",
          type: 'input'
        },
        {
          prop: 'accuracyLevel',
          label: "精度等级",
          type: 'input'
        },

       {
          prop: 'oil',
          label: "油脂",
          type: 'input'
        },
        {
          prop: 'clearance',
          label: "游隙",
          type: 'input'
        },
        {
          prop: 'packagingMethod',
          label: "包装方式",
          type: 'input'
        },
        {
          prop: 'specialRequire',
          label: "特殊要求",
          type: 'input'
        },
         {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
    { 
          prop: 'reportingTime',
          label: '单据日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '创建开始日期',
          endPlaceholder: '创建结束日期',
          pickerOptions: this.global.timePickerOptions
        },
      ],
      superQueryInboundVisible: false,


      workForm:{},
      superWorkForm: {},
      workTotal:0,
      workData:[],
      workFormList:{
        orderDate: "",
        productName: "",
        processName: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
            {
                "asc": false,
                "column": ""
            },
            {
                "asc": false,
                "column": "createTime"
            }
        ],
        superQuery: {
            matchLogic: "AND",
            condition: []
        }
      }, 
      searchList3:[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '工单单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryInbound: [
        {
          prop: 'projectName',
          label: "所属项目",
          type: 'input'
        },
        {
          prop: 'productionOrderNo',
          label: "生产任务单号",
          type: 'input'
        }, 
         {
          prop: 'orderNo',
          label: "工单单号",
          type: 'input'
        }, 
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },   
          {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        }, 
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        }, 
        {
          prop: 'maunit',
          label: "单位",
          type: 'input'
        },
          {
          prop: 'processName',
          label: "工序名称",
          type: 'input'
        },
          {
          prop: 'processCode',
          label: "工序编码",
          type: 'input'
        }, 
         { 
          prop: 'planStartDate',
          label: '计划开始日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        { 
          prop: 'planEndDate',
          label: '计划结束日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        }, 
      ],
      superQueryWorkVisible: false,





      superProcessForm: {},
      processForm:{},
      processData:[],
      processTotal:0,
      processFormList:{
        productName: "",
        processName: "",
        warehouseName: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
            {
                "asc": false,
                "column": ""
            },
            {
                "asc": false,
                "column": "productName"
            }
        ],
        superQuery: {
            matchLogic: "AND",
            condition: []
        }
      }, 
      searchList4:[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'warehouseName', fieldValue: '', label: '线边仓名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryProcess: [
         {
          prop: 'projectName',
          label: "所属项目",
          type: 'input'
        },
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },   
          {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        }, 
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },  
             {
          prop: 'processName',
          label: "工序名称",
          type: 'input'
        },
          {
          prop: 'processCode',
          label: "工序编码",
          type: 'input'
        },
          {
          prop: 'warehouseName',
          label: "所属线边仓",
          type: 'input'
        },    
      ],
      superQueryProcessVisible: false,
 
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      activeName: "produce",
      reportCode:'',
    
    
      total: 0,
      formVisible: false,
      exportFormVisible:false,
    }
  },
  async created() { 
 
    this.superProductForm=this.productForm = JSON.parse(JSON.stringify(this.productFormList))
    this.superInboundForm=this.inboundForm = JSON.parse(JSON.stringify(this.inboundFormList))
    this.superWorkForm=this.workForm = JSON.parse(JSON.stringify(this.workFormList))
    this.superProcessForm=this.processForm = JSON.parse(JSON.stringify(this.processFormList))
   this.search()
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
    columnSetFunProduce(){
      this.$refs['dataTableProduce'].showDrawer()
    },
    columnSetFunInbound(){
      this.$refs['dataTableInbound'].showDrawer()
    },
    columnSetFunWork(){
      this.$refs['dataTableWork'].showDrawer()
    },
    columnSetFunProcess(){
      this.$refs['dataTableProcess'].showDrawer()
    },
    superQuerySearchProduce(query) {
      this.superProductForm = query
      this.superQueryProduceVisible = false
      this.search()
    },
       superQuerySearchInbound(query) {
      this.superInboundForm = query
      this.superQueryInboundVisible = false
      this.search()
    },
      superQuerySearchWork(query) {
      this.superWorkForm = query
      this.superQueryWorkVisible = false
      this.search()
    },
      superQuerySearchProcess(query) {
      this.superProcessForm = query
      this.superQueryProcessVisible = false
      this.search()
    },
    handleClick(e) {
      this.activeName = e.name
      // this.reset()
    },
    //排序
    sortChange({ prop, order }) {
      let newProp;
      if (this.activeName == "orderList") {
        if (prop === 'partnerCode' || prop === 'partnerName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.orderForm.orderItems[0].asc = order !== "descending"
        this.orderForm.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (prop === 'warehouseName' || prop === 'productName' || prop === 'targetProductsName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.linesQuery.orderItems[0].asc = order !== "descending"
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    initData() {
      this.listLoading = true
      if (this.activeName == "produce") {
        produceDataReport(this.productForm).then(res => {
          this.produceData = res.data.records
          this.produceTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }else if(this.activeName == "inbound"){
         produceInboundReport(this.inboundForm).then(res => {
          this.inboundData = res.data.records
          this.inboundTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }else if(this.activeName == "work"){
         produceWorkOrderReport(this.workForm).then(res => {
          this.workData = res.data.records
          this.workTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }else if(this.activeName == "process"){
         produceProcessReport(this.processForm).then(res => {
          this.processData = res.data.records
          this.processTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }
       
    }, 
  
    search(type) {
      if (this.activeName == "produce") {
        if (this.productionDate && this.productionDate.length > 0) {
          this.productForm.produceStartDate = this.productionDate[0].replace(/ 0(?!0)/g, " ")
          this.productForm.produceEndDate = this.productionDate[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.productForm.produceStartDate = ''
          this.productForm.produceEndDate = ''
        }
        Object.keys(this.productForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.productForm[key]
          this.productForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.productForm.pageNum = 1 // 重置页码
        if (type === 'basic') {
          this.superProductForm.superQuery  = {
            matchLogic: 'AND',
            condition: this.searchList1
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          } 
        }
        if (type === 'super') {
          this.superProductForm.superQuery = this.superQuery
        }
      } else if (this.activeName == "inbound") {
        if (this.inboundDate && this.inboundDate.length > 0) {
          this.inboundForm.produceStartDate = this.inboundDate[0].replace(/ 0(?!0)/g, " ")
          this.inboundForm.produceEndDate = this.inboundDate[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.inboundForm.produceStartDate = ''
          this.inboundForm.produceEndDate = ''
        }
        Object.keys(this.inboundForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.inboundForm[key]
          this.inboundForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.inboundForm.pageNum = 1 // 重置页码
         if (type === 'basic') {
          this.superInboundForm.superQuery  = {
            matchLogic: 'AND',
            condition: this.searchList2
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          } 
        }
        if (type === 'super') {
          this.superInboundForm.superQuery = this.superQuery
        }
      } else if (this.activeName == "work") {
        Object.keys(this.workForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.workForm[key]
          this.workForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.workForm.pageNum = 1 // 重置页码
         if (type === 'basic') {
          this.superWorkForm.superQuery  = {
            matchLogic: 'AND',
            condition: this.searchList3
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          } 
        }
        if (type === 'super') {
          this.superWorkForm.superQuery = this.superQuery
        }
      } else if (this.activeName == "process") {
        Object.keys(this.processForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.processForm[key]
          this.processForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.processForm.pageNum = 1 // 重置页码
         if (type === 'basic') {
          this.superProcessForm.superQuery  = {
            matchLogic: 'AND',
            condition: this.searchList4
              .filter((item) => item.fieldValue)
              .map((item) => {
                return {
                  ...item,
                  fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                }
              })
          } 
        }
        if (type === 'super') {
          this.superProcessForm.superQuery = this.superQuery
        }
      }
      
    
      this.initData()
    },
    reset() {
      if (this.activeName == "produce") {
        this.$refs['dataTableProduce'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.productionDate = []
       this.superProductForm= this.productForm = JSON.parse(JSON.stringify(this.productFormList))
        this.searchList1=[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'producerName', fieldValue: '', label: '生产人', symbol: 'like', searchType: 1, width: 120 },
        { field: 'equipmentName', fieldValue: '', label: '设备名称', symbol: 'like', searchType: 1, width: 120 },
      ]
      }else if(this.activeName == "inbound"){
        this.$refs['dataTableInbound'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.inboundDate = []
        this.superInboundForm= this.inboundForm = JSON.parse(JSON.stringify(this.inboundFormList)) 
         this.searchList2=[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productionOrderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '入库单号', symbol: 'like', searchType: 1, width: 120 },
      ]
      } else if(this.activeName == "work"){
        this.$refs['dataTableWork'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
     
        this.superWorkForm= this.workForm = JSON.parse(JSON.stringify(this.workFormList))
          this.searchList3=[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '工单单号', symbol: 'like', searchType: 1, width: 120 },
      ]
      } else if(this.activeName == "process"){
        this.$refs['dataTableProcess'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.superProcessForm= this.processForm = JSON.parse(JSON.stringify(this.processFormList))
         this.searchList4=[
        { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'warehouseName', fieldValue: '', label: '线边仓名称', symbol: 'like', searchType: 1, width: 120 },
      ]
      } 
      this.search('basic')
    },
      // 导出
    exportForm(exportTableRef,code) {
      this.reportCode=code
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      let targetListQuery={},exportName="";
      if(this.reportCode=='1250'){
        targetListQuery=this.productForm
        exportName='每日生产'
      }
       if(this.reportCode=='1251'){
        targetListQuery=this.inboundForm
        exportName='每日生产入库'
      }
       if(this.reportCode=='1252'){
        targetListQuery=this.workForm
        exportName='当日工单进度'
      }
 
       if(this.reportCode=='1253'){
        targetListQuery=this.processForm
        exportName='工序料合计'
      }
         
      let _data = {
        ...targetListQuery,
        exportType: this.reportCode,
        exportName: exportName,
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />

