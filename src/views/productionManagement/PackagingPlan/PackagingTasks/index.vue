<script>
import {buttonList, getColumns} from "./data";
import {getPrintBusInfo} from "@/api/system/printDev";
import Form from '../module/Form.vue'
import Info from "./info.vue";
import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import {uploadProduct} from "@/api/customerManagement";
import {ordershengchanList} from "@/api/productOrdes";
import {prodOrderClose} from "@/api/productOrdes/finishedProductOrders";

export default {
  name: "index",
  components: {
    BatchPrintBrowse,
    PrintDialog,
    Form,
    Info
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
            {prop: 'productionPlanNo', symbol: 'like', fixed: true},
            {prop: 'orderNo', symbol: 'like', fixed: true},
            {prop: 'productionLineName', symbol: '==', fixed: true},
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      loading: false,
      visible: false,
      infoVisible: false,
      printVisible: false,
      uploadProduct,
      uploadVisible: false,
      extraFormData: {},
      printQuery: {
        category: ''
      },
      fullName: '',
      enCode: '',
      tableData: [],
      total: 0,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'productionLineName',
          label: '产线',
          type: 'select',
          options: this.productionLineOptions
        },
      ],
      listQuery: {
        source: 'package_plan',
      },
      productionLineOptions: [],
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),
      selectedRow: [],
    }
  },
  created() {

  },
  methods: {
    async initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();

      this.loading = true
      try {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
        const res = await ordershengchanList(this.listQuery);
        const {total, records} = res.data
        this.tableData = records;
        this.total = total
      } finally {
        this.loading = false
      }
    },

    closePrint() {
      this.printVisible = false
    },

    printView(row, enCode, fullName) {
      this.selectArr = [row]
      this.enCode = enCode
      this.fullName = fullName
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(enCode)
      })
    },

    async printOrder(enCode) {
      try {
        const res = await getPrintBusInfo(enCode)
        if (!res.data) {
          return this.$message.warning('未找到相应打印模版')
        }
        const id = res.data.id
        const printData = this.selectArr.map(item => ({
          formId: item.id,
          id: id
        }))
        this.$refs.batchPrint.print(printData);
      } catch (e) {
      }
    },

    validateSelectedRows() {
      if (!this.selectedRow.length) {
        this.$message.warning('请至少选择一条数据');
        return false;
      }
      if (this.selectedRow.length > 1) {
        this.$message.warning('只能选择一条数据');
        return false;
      }
      return true;
    },

    handleButtonClick(type) {
      switch (type) {
        case 'add':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', 'add')
          })
          break;
        case 'assemblePrinter':
          if (!this.validateSelectedRows()) return;
          this.printView(this.selectedRow[0], 'p035', '装配单');
          break;
        case 'flowPrinter':
          if (!this.validateSelectedRows()) return;
          this.printView(this.selectedRow[0], 'p020', '流转卡');
          break;
        case 'close':
          if (!this.selectedRow.length) return this.$message.error("请选择您要关单的任务")
          this.handleClose()
          break;
        default:
      }
    },

    handleColumnClick(row, type) {
      switch (type) {
        case 'feed':
        case 'work':
        case 'report':
          this.infoVisible = true
          this.$nextTick(() => {
            this.$refs.Info.init(row.id, type)
          })
          break;
        default:
      }
    },

    handleClose() {
      this.$confirm('关闭任务将会把领料单一起关闭, 是否继续？', '提示', {
        type: 'warning'
      }).then(async () => {
        const ids = this.selectedRow.map(item => item.id)
        const res = await prodOrderClose(ids);
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success('关单成功')
          this.initData()
        }
      }).catch(() => {
      })
    },

    importDataSuccess(res, file, fileList) {
      if (!res.data) {
        this.$message.success(`导入成功`)
      }
      this.uploadVisible = false
    },

    close(isInitData = true) {
      this.visible = false
      this.BindingVisible = false
      if (!isInitData) return
      this.initData()
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    getAlign(align) {
      return align || 'center'
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable"/>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <CustomButton
              :btnList="btnList"
              @click="handleButtonClick"
            />
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
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                @click="initData()"/>
            </el-tooltip>
          </div>
        </div>
        <JNPF-table customKey="PackagingPlans"
          v-loading="loading"
          :data="tableData"
          :has-c="true"
          @selection-change="(val) => selectedRow = val"
          :row-key="'id'"
          fixedNO
          :setColumnDisplayList="columnList"
          ref="dataTable"
          custom-column :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <template v-for="column in columnsConfig">
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
          <el-table-column label="操作" width="260" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" @click="handleColumnClick(row, 'feed')">
                投料信息
              </el-button>
              <el-button size="mini" type="text" @click="handleColumnClick(row, 'work')">
                工单信息
              </el-button>
              <el-button size="mini" type="text" @click="handleColumnClick(row, 'report')">
                报工信息
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData()"
        />
      </div>
    </div>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate"/>
    <BatchPrintBrowse ref="batchPrint" :fullName="fullName"/>
    <!--  导入-->
    <UploadImportData ref="uploadRef" v-if="uploadVisible" :extraFormData="extraFormData" :uploadApi="uploadProduct" @success="importDataSuccess"
      @close="uploadVisible = false" templateDownLoadPath="/static/销售订单导入模板.xlsx"/>

    <Form ref="Form" v-if="visible" @close="close"/>
    <Info ref="Info" v-if="infoVisible" @close="infoVisible = false"/>
  </div>
</template>
