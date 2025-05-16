<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="检验单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.producerName" placeholder="生产人" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.inspectorName" placeholder="检验人" @keyup.enter.native="search()"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="检验开始日期"
                  end-placeholder="检验结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head" style="padding:10px">
            <div>
              <!-- <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
                icon="el-icon-download" @click="exportForm">
                导出
              </el-button> -->
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table v-if="tableDataFlag" ref="dataTable" :data="dataList" :fixedNO="true" @sort-change="sortChange"
            custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="检验单号" min-width="200" sortable="custom">
              <!-- <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template> -->
            </el-table-column>
            <!-- <el-table-column prop="workReport.orderNo" label="报工单号" min-width="200" sortable="custom" /> -->
            <el-table-column prop="orderNo" label="报工单号" min-width="200" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" min-width="200" sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" width="120"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" min-width="200" sortable="custom"
              v-if="$store.getters.configData.product.enable_productName" />
                   <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="200" sortable="custom" />
            <el-table-column prop="workNo" label="工单单号" min-width="200" sortable="custom" />
            <el-table-column prop="reportingQuantity" label="报工数量" min-width="200" sortable="custom" />
            <el-table-column prop="producerName" label="生产人" min-width="200" sortable="custom" />
            <el-table-column prop="reportingTime" label="报工时间" min-width="200" sortable="custom" />
            <el-table-column prop="actualQualifiedQuantity" label="合格数量" width="120" sortable="custom" />
            <el-table-column prop="actualConcessionQuantity" label="让步接收数量" width="140" sortable="custom" />
            <el-table-column prop="actualReworkQuantity" label="返工数量" min-width="180" sortable="custom" />
            <el-table-column prop="actualResponsibilityWasteQuantity" label="责废数量" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="actualMaterialQuantity" label="料废数量" min-width="180" sortable="custom" />
            <!-- <el-table-column prop="workReport.productionOrderNo" label="生产任务单号" min-width="200" sortable="custom" />
            <el-table-column prop="workReport.workNo" label="工单单号" min-width="200" sortable="custom" />
            <el-table-column prop="workReport.reportingQuantity" label="报工数量" min-width="200" sortable="custom" />
            <el-table-column prop="workReport.producerName" label="生产人" min-width="200" sortable="custom" />
            <el-table-column prop="workReport.reportingTime" label="报工时间" min-width="200" sortable="custom" />
            <el-table-column prop="workReport.actualQualifiedQuantity" label="合格数量" width="120" sortable="custom" />
            <el-table-column prop="workReport.actualConcessionQuantity" label="让步接收数量" width="140" sortable="custom" />
            <el-table-column prop="workReport.actualReworkQuantity" label="返工数量" min-width="180" sortable="custom" />
            <el-table-column prop="workReport.actualResponsibilityWasteQuantity" label="责废数量" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="workReport.actualMaterialQuantity" label="料废数量" min-width="180" sortable="custom" /> -->
            <el-table-column prop="inspectorName" label="检验人" width="160" sortable="custom" />
            <el-table-column prop="createTime" label="检验时间" width="160" />
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row, 'add')" editText="处理" :hasEdit="false" :hasDel="false">
                  <!-- <el-button size="mini" type="text" @click.native="addOrUpdateHandle(scope.row, 'look')">
                    查看详情
                  </el-button> -->
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="dataTotal" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" :inspectionMethodList="inspectionMethodList" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm"
      :inspectionMethodList="inspectionMethodList" />
    <DetailReportWorkForm v-if="detailReportWorkFormVisible" ref="DetailReportWorkForm" @close="closeForm"
      :inspectionMethodList="inspectionMethodList" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getInspectionList, deleteInspectionData, getInspectionLinesList } from '@/api/inspectionManagement/index' // 检验单
import { documentStatusList, approvalStatusList, inspectionResultsList, inspectionMethodList } from '../data.js'

import DetailReportWorkForm from './inspectionFormManagementDetail.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import getProjectList from '@/mixins/generator/getProjectList'

import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  components: { ExportForm, DetailReportWorkForm, SuperQuery },
  mixins: [getProjectList],

  props: {
    pageData: {
      // 页面配置
      type: Object,
      required: true,
      default: {
        type: '', // 通知单类型
        businessCode: '', // 业务编码
        showRouting: false, // 是否显示工艺路线
        showProcess: false // 是否显示工序
      }
    }
  },
  data() {
    return {
      dataTotal:20,
      dataList:
  [
  {
    "orderNo": "QCDH24453538",
    "workReport": "RRDH97120294",
    "processName": "02精孔",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "6704-2RS",
    "productName": "6704-2RS",
    "productionOrderNo": "PROD38481916",
    "workNo": "WODH13450046",
    "reportingQuantity": 488,
    "producerName": "凌新萍",
    "reportingTime": "2024-05-07 09:53:18",
    "actualQualifiedQuantity": 488,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "方霞",
    "createTime": "2024-05-07 11:22:47"
  },
  {
    "orderNo": "QCDH22794549",
    "workReport": "RRDH23124029",
    "processName": "02精沟",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "6705-2RS",
    "productName": "6705-2RS",
    "productionOrderNo": "PROD58217661",
    "workNo": "WODH71937139",
    "reportingQuantity": 777,
    "producerName": "张志安",
    "reportingTime": "2024-05-08 12:15:59",
    "actualQualifiedQuantity": 777,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "成俊龙",
    "createTime": "2024-05-08 13:36:12"
  },
  {
    "orderNo": "QCDH29384607",
    "workReport": "RRDH59635204",
    "processName": "02精平面",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "689ZZ",
    "productName": "689ZZ",
    "productionOrderNo": "PROD38321568",
    "workNo": "WODH77521944",
    "reportingQuantity": 726,
    "producerName": "罗利",
    "reportingTime": "2024-05-09 13:21:04",
    "actualQualifiedQuantity": 726,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "方霞",
    "createTime": "2024-05-09 14:47:32"
  },
  {
    "orderNo": "QCDH69801235",
    "workReport": "RRDH74170283",
    "processName": "02粗孔",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "MR148",
    "productName": "MR148",
    "productionOrderNo": "PROD95362016",
    "workNo": "WODH58739388",
    "reportingQuantity": 558,
    "producerName": "李小敏",
    "reportingTime": "2024-05-09 15:45:52",
    "actualQualifiedQuantity": 558,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "余瑞奇",
    "createTime": "2024-05-09 17:08:19"
  },
  {
    "orderNo": "QCDH69393459",
    "workReport": "RRDH56530881",
    "processName": "02半精沟",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "60/22-ZZ",
    "productName": "60/22-ZZ",
    "productionOrderNo": "PROD47319842",
    "workNo": "WODH02288049",
    "reportingQuantity": 309,
    "producerName": "罗利",
    "reportingTime": "2024-05-10 11:39:54",
    "actualQualifiedQuantity": 309,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "方霞",
    "createTime": "2024-05-10 12:51:37"
  },
  {
    "orderNo": "QCDH67902995",
    "workReport": "RRDH25852054",
    "processName": "02粗沟",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "6802.2RS",
    "productName": "6802.2RS",
    "productionOrderNo": "PROD92883743",
    "workNo": "WODH10754691",
    "reportingQuantity": 647,
    "producerName": "蔡想云",
    "reportingTime": "2024-05-11 14:09:30",
    "actualQualifiedQuantity": 647,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "余瑞奇",
    "createTime": "2024-05-11 15:38:45"
  },
  {
    "orderNo": "QCDH19388880",
    "workReport": "RRDH04347138",
    "processName": "02精外径",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "6801.2RS",
    "productName": "6801.2RS",
    "productionOrderNo": "PROD62900360",
    "workNo": "WODH51288054",
    "reportingQuantity": 459,
    "producerName": "罗利",
    "reportingTime": "2024-05-12 12:4 2:05",
    "actualQualifiedQuantity": 459,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "方霞",
    "createTime": "2024-05-12 14:11:27"
  },
  {
    "orderNo": "QCDH98802623",
    "workReport": "RRDH59081323",
    "processName": "02粗平面",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "796-16B",
    "productName": "796-16B",
    "productionOrderNo": "PROD32037655",
    "workNo": "WODH03238863",
    "reportingQuantity": 512,
    "producerName": "蔡想云",
    "reportingTime": "2024-05-13 08:34:22",
    "actualQualifiedQuantity": 512,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "成俊龙",
    "createTime": "2024-05-13 10:09:55"
  },
  {
    "orderNo": "QCDH08807966",
    "workReport": "RRDH44959304",
    "processName": "02精孔",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "BNAT355-46.02",
    "productName": "BNAT355-46.02",
    "productionOrderNo": "PROD17246612",
    "workNo": "WODH72840393",
    "reportingQuantity": 406,
    "producerName": "罗利",
    "reportingTime": "2024-05-14 14:15:44",
    "actualQualifiedQuantity": 406,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "成俊龙",
    "createTime": "2024-05-14 15:47:18"
  },
  {
    "orderNo": "QCDH76398270",
    "workReport": "RRDH74636127",
    "processName": "02精沟",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "BNAT805-91.02",
    "productName": "BNAT805-91.02",
    "productionOrderNo": "PROD19350474",
    "workNo": "WODH66400843",
    "reportingQuantity": 201,
    "producerName": "张志安",
    "reportingTime": "2024-05-15 16:03:04",
    "actualQualifiedQuantity": 201,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "成俊龙",
    "createTime": "2024-05-15 17:28:37"
  },
 {
    "orderNo": "QCDH77764779",
    "workReport": "RRDH38196062",
    "processName": "02精平面",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "6200ZZ",
    "productName": "6200ZZ",
    "productionOrderNo": "PROD70788772",
    "workNo": "WODH31752095",
    "reportingQuantity": 401,
    "producerName": "张志安",
    "reportingTime": "2024-05-16 14:49:18",
    "actualQualifiedQuantity": 401,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "余瑞奇",
    "createTime": "2024-05-16 16:21:45"
  },
  {
    "orderNo": "QCDH13810361",
    "workReport": "RRDH74372394",
    "processName": "02粗孔",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "6804-2RSV",
    "productName": "6804-2RSV",
    "productionOrderNo": "PROD77045996",
    "workNo": "WODH85631451",
    "reportingQuantity": 238,
    "producerName": "李小敏",
    "reportingTime": "2024-05-17 14:36:57",
    "actualQualifiedQuantity": 238,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "成俊龙",
    "createTime": "2024-05-17 16:07:12"
  },
  {
    "orderNo": "QCDH63337572",
    "workReport": "RRDH27731432",
    "processName": "02半精沟",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "6812-2RZ",
    "productName": "6812-2RZ",
    "productionOrderNo": "PROD40916197",
    "workNo": "WODH95713709",
    "reportingQuantity": 408,
    "producerName": "李小敏",
    "reportingTime": "2024-05-18 10:11:19",
    "actualQualifiedQuantity": 408,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "余瑞奇",
    "createTime": "2024-05-18 11:43:27"
  },
  {
    "orderNo": "QCDH13404276",
    "workReport": "RRDH31595990",
    "processName": "02粗沟",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "BMT40滚齿刀座-轴承套",
    "productName": "BMT40",
    "productionOrderNo": "PROD14451545",
    "workNo": "WODH13745750",
    "reportingQuantity": 728,
    "producerName": "罗利",
    "reportingTime": "2024-05-19 16:24:59",
    "actualQualifiedQuantity": 728,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "成俊龙",
    "createTime": "2024-05-19 17:55:03"
  },
  {
    "orderNo": "QCDH89193923",
    "workReport": "RRDH32117237",
    "processName": "02精外径",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "7900FMV",
    "productName": "7900FMV",
    "productionOrderNo": "PROD10433739",
    "workNo": "WODH97022314",
    "reportingQuantity": 605,
    "producerName": "罗利",
    "reportingTime": "2024-05-20 08:44:22",
    "actualQualifiedQuantity": 605,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "李喜梅",
    "createTime": "2024-05-20 10:15:38"
  },
  {
    "orderNo": "QCDH35180714",
    "workReport": "RRDH18307545",
    "processName": "02粗平面",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "BRAU5005-61",
    "productName": "BRAU5005-61",
    "productionOrderNo": "PROD66592351",
    "workNo": "WODH85871368",
    "reportingQuantity": 289,
    "producerName": "罗利",
    "reportingTime": "2024-05-21 15:14:35",
    "actualQualifiedQuantity": 289,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "余瑞奇",
    "createTime": "2024-05-21 16:45:49"
  },
  {
    "orderNo": "QCDH74237813",
    "workReport": "RRDH39495965",
    "processName": "02精孔",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "7013ACDB(65 * 100 * 18) P5",
    "productName": "7013ACDB(65 * 100 * 18) P5",
    "productionOrderNo": "PROD43688993",
    "workNo": "WODH92096550",
    "reportingQuantity": 417,
    "producerName": "罗利",
    "reportingTime": "2024-05-22 14:56:31",
    "actualQualifiedQuantity": 417,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "方霞",
    "createTime": "2024-05-22 16:28:47"
  },
  {
    "orderNo": "QCDH69239537",
    "workReport": "RRDH06893048",
    "processName": "凸出量",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "32005DB+43GQ轴承配隔圈",
    "productName": "32005DB+43GQ",
    "productionOrderNo": "PROD74728638",
    "workNo": "WODH01853439",
    "reportingQuantity": 784,
    "producerName": "凌新萍",
    "reportingTime": "2024-05-23 09:57:12",
    "actualQualifiedQuantity": 784,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "李喜梅",
    "createTime": "2024-05-23 11:29:25"
  },
  {
    "orderNo": "QCDH82850488",
    "workReport": "RRDH26624191",
    "processName": "02精平面",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "K5X8X8",
    "productName": "K5X8X8",
    "productionOrderNo": "PROD89531098",
    "workNo": "WODH70333028",
    "reportingQuantity": 531,
    "producerName": "罗利",
    "reportingTime": "2024-05-24 16:12:15",
    "actualQualifiedQuantity": 531,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "余瑞奇",
    "createTime": "2024-05-24 17:43:29"
  },
  {
    "orderNo": "QCDH07541167",
    "workReport": "RRDH51944628",
    "processName": "02粗孔",
    "projectName": "角接触项目",
    "productCategoryName": "套圈",
    "productDrawingNo": "799ACTN",
    "productName": "799ACTN",
    "productionOrderNo": "PROD06579054",
    "workNo": "WODH39225444",
    "reportingQuantity": 577,
    "producerName": "张志安",
    "reportingTime": "2024-05-25 14:30:58",
    "actualQualifiedQuantity": 577,
    "actualConcessionQuantity": 0,
    "actualReworkQuantity": 0,
    "actualResponsibilityWasteQuantity": 0,
    "actualMaterialQuantity": 0,
    "inspectorName": "成俊龙",
    "createTime": "2024-05-25 16:02:13"
  },
  
],
      isProjectSwitch: '',
      tableDataFlag: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '检验单号',
          type: 'input'
        },
        {
          prop: 'inspectorName',
          label: '检验人',
          type: 'input'
        },
        {
          prop: 'inspectionDate',
          label: '检验日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },

        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },

        {
          prop: 'inspectionMethod',
          label: '检验方式',
          type: 'select',
          options: [{ label: '免检', value: 'exempt' }, { label: '抽检', value: 'spot_check' }, { label: '全检', value: 'all' }]
        },
        {
          prop: 'inspectionResults',
          label: '检验结果',
          type: 'select',
          options: [
            { label: '合格', value: 'qualified' },
            { label: '不合格', value: 'unqualified' },
            { label: '审批拒绝', value: 'rebut' },
            { label: '审批撤回', value: 'withdrawn' }
          ]
        },
        {
          prop: 'inspectionResults',
          label: '处理状态',
          type: 'select',
          options: [
            { label: '未处理', value: 'untreated' },
            { label: '处理中', value: 'processing' },
            { label: '已处理', value: 'processed' }
          ]
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },

      ],
      columnList: ["remark", "productCode", "processingStatus", "createByName"],
      visible: false,
      activeName: 'dataTable',
      formVisible: false,
      detailFormVisible: false,
      detailReportWorkFormVisible: false,
      listLoading: false,
      documentStatusList, // 单据状态
      approvalStatusList, // 审批状态
      inspectionResultsList, // 检验结果
      inspectionMethodList, // 检验方法
      time: null,
      tableData: [],
      listQuery: {},
      initListQuery: {
        orderNo: '',
        originOrderNo: '',
        inspectorName: '',
        documentStatus: '',
        approvalStatus: '',
        notificationType: 'work_report',
        businessCode: this.pageData.businessCode,
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          },
          {
            asc: false,
            column: 'order_no'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        createTimeArr: [],
        inspectionDateArr: []
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},
      exportFormVisible: false,
      linesTotal: 0
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    if (this.$store.getters.configData.product.enable_productName) {
      this.superQueryJson.splice(4, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.tableDataFlag = true

    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  methods: {
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
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
          exportType: '1097',
          exportName: '采购检验通知单',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalRowFlag: true
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
    initData() {
      this.listLoading = true
      if (this.time) {
        this.listQuery.inspectionStartDate = this.time[0]
        this.listQuery.inspectionEndDate = this.time[1]
      } else {
        this.listQuery.inspectionStartDate = ''
        this.listQuery.inspectionEndDate = ''
      }
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      getInspectionList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      this.visible = false
      this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
      this.jnpf.searchTimeFormat(this.listQuery, 'inspectionDateArr', 'inspectionStartDate', 'inspectionEndDate')
      Object.keys(this.listQuery).forEach((key) => {
        this.listQuery[key] = typeof this.listQuery[key] === 'string' ? this.listQuery[key].trim() : this.listQuery[key]
      })
      this.listQuery.pageNum = 1

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.time = []
      this.initData()
    },
    addOrUpdateHandle(row, btnType) {
      if (btnType == 'look') {
        console.log(row, '对对对')
        if (row.notificationType === 'work_report') {
          this.detailReportWorkFormVisible = true
          this.$nextTick(() => {
            this.$refs.DetailReportWorkForm.init(row.id, btnType, false, this.pageData.type)
          })
        } else {
          this.detailFormVisible = true
          this.$nextTick(() => {
            this.$refs.DetailForm.init(row.id, btnType, false, this.pageData.type)
          })
        }

      } else {

        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row.id, btnType, false, this.pageData.type)
        })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'inspectorName' || prop === 'productDrawingNo' || prop === 'productCode' || prop === 'createTime' ||
        prop === 'createByName') {
        newProp = 'inspector_id'
      } else if ([].includes(prop)) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp

      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      this.detailReportWorkFormVisible = false
      this.initData()
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteInspectionData(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    inspectionResultsFormatter(row) {
      let option = this.inspectionResultsList.find((item) => item.value === row.inspectionResults)
      return option ? option.label : row.inspectionResults
    },
    inspectionMethodFormatter(row) {
      let option = this.inspectionMethodList.find((item) => item.value === row.inspectionMethod)
      return option ? option.label : row.inspectionMethod
    }
  }
}
</script>
