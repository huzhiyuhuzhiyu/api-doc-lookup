<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable"/>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head" style="padding:10px">
            <div>
<!--              <el-button v-has="'inspection:withdraw'" :disabled="tableData.length<=0" size="mini" type="primary" icon="iconfont-menu icon-chehui" @click="withdrawFun">-->
<!--                撤回-->
<!--              </el-button>-->
              <el-button :disabled="tableData.length<=0" size="mini" type="primary"
                         icon="el-icon-download" @click="exportForm">
                导出
              </el-button>
            </div>
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
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()"/>
              </el-tooltip>
            </div>
          </div>
          <JNPF-table
            v-if="tableDataFlag"
            ref="dataTable"
            :hasC="['inspection:withdraw']"
            :data="tableData"
            :fixedNO="true"
            custom-column
            :setColumnDisplayList="columnList"
            customKey="JNPFTableKey_139872"
            @selection-change="handleSelectionChange"
            :listQuery="listQuery"
            @queryChange="initData"
            :queryJson="superQueryJson"
          >
            <template v-for="column in columnsConfig">
              <el-table-column
                v-if="typeof column.show === 'function' ? column.show() : (column.show !== undefined ? column.show : true)"
                :key="column.prop"
                :prop="column.prop"
                :label="column.label"
                :min-width="column.minWidth"
                :fixed="column.fixed"
                :align="getAlign(column.align)"
              >
                <template v-if="column.slot" v-slot="scope">
                  <template v-if="column.prop === 'orderNo'">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'look')">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
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
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="{row}">
                <tableOpts @edit="addOrUpdateHandle(row, 'add')" editText="处理" :hasEdit="false" :hasDel="false">
                  <el-button :disabled="row.status !== 'wait_confirmed'" v-has="'inspection:confirm'" size="mini" type="text" @click.native="handleConfirm(row)">
                    确认
                  </el-button>
                  <el-button size="mini" type="text" @click.native="addOrUpdateHandle(row, 'look')">
                    查看详情
                  </el-button>
                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"/>
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" :inspectionMethodList="inspectionMethodList"/>
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm"
                :inspectionMethodList="inspectionMethodList"/>
    <DetailReportWorkForm v-if="detailReportWorkFormVisible" ref="DetailReportWorkForm" @close="closeForm"
                          :inspectionMethodList="inspectionMethodList"/>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download"/>
  </div>
</template>

<script>
import { confirmedInspection, deleteInspectionData, getInspectionList, inspectionRevoke } from '@/api/inspectionManagement/index' // 检验单
import { approvalStatusList, documentStatusList, inspectionMethodList, inspectionResultsList } from '../data.js'
import Form from './defectiveProductHandlingForm.vue'
import DetailForm from './inspectionFormManagementDetail.vue'
import DetailReportWorkForm from '../reportWorkInspection/inspectionFormManagementDetail.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData'
import getProjectList from '@/mixins/generator/getProjectList'
import { getQueryConfirm } from "@/utils";

export default {
  components: { Form, ExportForm, DetailForm, DetailReportWorkForm },
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
    },
    queryParams: {
      // 页面查询参数
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            { prop: 'orderNo', symbol: 'like', fixed: true },
            { prop: 'docNo', symbol: 'like', fixed: true },
            { prop: 'status', symbol: '==', fixed: true, value: 'wait_confirmed' },
            {
              prop: 'inspectionDate', // 属性*
              symbol: 'between', // 比较符*
              timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
              fixed: true // 是否在搜索栏显示
            },
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            },
            {
              asc: false,
              column: 'orderNo'
            }
          ]
        },
      }],
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      superQueryJson: [
        {
          prop: 'inspectionMethod',
          label: '检验方式',
          type: 'select',
          options: inspectionMethodList
        },
        {
          prop: 'inspectionResults',
          label: '检验结果',
          type: 'select',
          options: inspectionResultsList
        },
        {
          prop: 'processingStatus',
          label: '处理状态',
          type: 'select',
          options: this.global.processingStatusType
        },
        {
          prop: 'status',
          label: '检验确认状态',
          type: 'select',
          options: this.global.workReportInspection
        },
      ],
      columnList: [],
      visible: false,
      formVisible: false,
      detailFormVisible: false,
      detailReportWorkFormVisible: false,
      listLoading: false,
      documentStatusList, // 单据状态
      approvalStatusList, // 审批状态
      inspectionResultsList, // 检验结果
      inspectionMethodList, // 检验方法
      tableData: [],
      listQuery: {
        ...this.queryParams,
        notificationType: this.pageData.type,
        businessCode: this.pageData.businessCode,
      },
      total: 0,
      linesQuery: {},
      exportFormVisible: false,
      selectArr: [],
      columnsConfig: [
        {
          prop: "orderNo",
          label: "检验单号",
          minWidth: 220,
          slot: true
        },
        {
          prop: "docNo",
          label: "业务单号",
          minWidth: 220,
        },
        {
          prop: "inspectorName",
          label: "检验人",
          minWidth: 120,
        },
        {
          prop: "inspectionDate",
          label: "检验日期",
          minWidth: 120,
        },
        {
          prop: 'productCode',
          label: '产品编码',
          minWidth: 220,
        },
        {
          prop: 'productName',
          label: '产品名称',
          minWidth: 220,
        },
        {
          prop: 'productDrawingNo',
          label: '型号',
          minWidth: 220,
        },
        {
          prop: 'productCategoryName',
          label: '产品分类',
          minWidth: 150,
        },
        {
          prop: 'mainUnit',
          label: '单位',
          minWidth: 90,
        },
        {
          prop: 'inspectionQuantity',
          label: '报检数量',
          minWidth: 120,
        },
        {
          prop: 'inspectionMethod',
          label: '检验方式',
          minWidth: 120,
          slot: true,
          dictType: 'inspectionMethod'
        },
        {
          prop: 'samplingQuantity',
          label: '检验数量',
          minWidth: 120,
        },
        {
          prop: 'inspectionResults',
          label: '检验结果',
          minWidth: 120,
          slot: true,
          dictType: 'inspectionResultsType'
        },
        {
          prop: 'unqualifiedQuantity',
          label: '不合格数量',
          minWidth: 140,
        },
        {
          prop: 'processingStatus',
          label: '处理状态',
          minWidth: 120,
          slot: true,
          dictType: 'processingStatusType'
        },
        {
          prop: 'status',
          label: '检验确认状态',
          minWidth: 160,
          slot: true,
          dictType: 'workReportInspection'
        },
        {
          prop: "documentStatus",
          label: "单据状态",
          minWidth: 120,
          slot: true,
          dictType: 'documentStatusList',
        },
        {
          prop: "remark",
          label: "备注",
          minWidth: 180,
        },
        {
          prop: "createTime",
          label: "创建时间",
          minWidth: 180,
        },
        {
          prop: "createByName",
          label: "创建人",
          minWidth: 120,
        }
      ],
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    this.tableDataFlag = true
  },
  methods: {
    async handleConfirm(row) {
      try {
        await getQueryConfirm(this, '此操作将确认检验单，是否继续？')

        await confirmedInspection(row.id)
        this.$message.success('确认成功')
        this.initData()
      } catch ( error ) {
        if (error !== 'cancel') {
          this.$message.error(error.message || '确认失败');
        }
      }
    },
    handleSelectionChange(val) {
      this.selectArr = val
    },
    withdrawFun() {
      if (!this.selectArr.length) return this.$message.error("请选择你要撤回的数据")
      // if(this.selectArr.length>1) return this.$message.error("只支持单条数据撤回")
      const ids = this.selectArr.map(item => item.id);
      this.$confirm("您确定撤回所选的数据吗?", "提示", {
        type: 'warning'
      }).then(() => {
        inspectionRevoke(ids).then(res => {
          this.$message.success('撤回成功')
          this.initData()
        })
      }).catch(() => {

      })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch ( error ) {
      }
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
          .catch(() => {
          })
      }
    },
    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期
      this.listLoading = true
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
    addOrUpdateHandle(row, btnType) {
      if (btnType === 'look') {
        this.detailFormVisible = true
        this.$nextTick(() => {
          this.$refs.DetailForm.init(row.id, btnType, false, this.pageData.type)
        })
        // if (row.notificationType === 'work_report') {
        //   this.detailReportWorkFormVisible = true
        //   this.$nextTick(() => {
        //     this.$refs.DetailReportWorkForm.init(row.id, btnType, false, this.pageData.type)
        //   })
        // } else {
        //   this.detailFormVisible = true
        //   this.$nextTick(() => {
        //     this.$refs.DetailForm.init(row.id, btnType, false, this.pageData.type)
        //   })
        // }

      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row.id, btnType, false, this.pageData.type)
        })
      }
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
        .catch(() => {
        })
    },
    getAlign(align) {
      return align || 'left'
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
