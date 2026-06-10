<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
        <el-form @submit.native.prevent>

          <template v-for="item in searchList">
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
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.businessType" placeholder="业务类型" style="width: 100%;">
                <el-option v-for="(item, index) in list" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

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
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">导出</el-button>
          </div>

          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>

            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table   ref="dataTable" v-loading="listLoading" :data="tableData"
          border :setColumnDisplayList="columnList" :fixedNO="true" @sort-change="sortChange" custom-column customKey="JNPFTableKey_469799">
          <el-table-column prop="orderNo" label="单号" sortable="custom" min-width="160">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="viewFun(scope.row.id, 'look')">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="businessType" label="业务类型" sortable="custom" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'outbound_sale_send'">销售发货</div>
              <div v-if="scope.row.businessType == 'inbound_sale_return'">销售退货</div>
              <div v-if="scope.row.businessType == 'inbound_purchase'">采购收货</div>
              <div v-if="scope.row.businessType == 'outbound_purchase'">采购退货</div>
              <div v-if="scope.row.businessType == 'outbound_pick_out'">生产领料</div>
              <div v-if="scope.row.businessType == 'inbound_return_materials'">生产退料</div>
              <div v-if="scope.row.businessType == 'outbound_external_send'">外协发料</div>
              <div v-if="scope.row.businessType == 'inbound_external_return'">外协退料</div>
              <div v-if="scope.row.businessType == 'inbound_external'">外协收货</div>
              <div v-if="scope.row.businessType == 'outbound_external'">外协退货</div>
              <div v-if="scope.row.businessType == 'inbound_other'">直接入库</div>
              <div v-if="scope.row.businessType == 'outbound_other'">直接出库</div>
            </template>
          </el-table-column>

          <el-table-column prop="documentStatus" label="单据状态" min-width="120">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
              <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
            </template>

          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="180" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="180" />
          <el-table-column prop="createByName" label="创建人" min-width="120" sortable="custom" />
          <el-table-column label="操作" min-width="200" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                :delDisabled="scope.row.documentStatus == 'submit'" :editDisabled="scope.row.documentStatus == 'submit'"
                @edit="editFun(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="viewFun(scope.row.id, 'look')">查看详情</el-dropdown-item>
                    <el-dropdown-item @click.native="PrintFun(scope.row.id)" :disabled="scope.row.businessType=='inbound_other'">打印</el-dropdown-item>

                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>

            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData">
        </pagination>
      </div>
    </div>


    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
      <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
  </div>
</template>

<script>
import { getInventoryDetailList, getInventorySummaryData } from '@/api/warehouseManagement/inventory'
import { getWarehouseList,deleteWarehouseData } from '@/api/warehouseManagement/inboundAndOutbound'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import Form from '../directInandOutWarehouse/index.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo, getPrintDeliveryNote } from '@/api/system/printDev'
export default {
  name: 'finishedProductWarehouseManagement',
  components: { Form, ExportForm, SuperQuery,  PrintBrowse,
    PrintDialog, },
  props:{
    classAttribute:"",
  },
  mixins: [getProjectList],
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      columnList: ["partnerCode", "documentStatus", "remark", "createByName",],

      exportFormVisible: false,
      visible: false,
      tableData: [],
      listLoading: false,

      list: [

        { label: "直接入库", value: "inbound_other" },
        { label: "直接出库", value: "outbound_other" },
      ],
      superQueryVisible: false,

      initListQuery: {
        businessType: "",
        orderNo: "",
        pageNum: 1,
        partnerName: "",
        pageSize: 20,
        classAttribute: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        warehouseType:"scrap",
      },
      listQuery: {},
      total: 0,
      formVisible: false,
      selectData: [],
      totalList: [],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "单号",
          type: 'input'
        },
        {
          prop: 'businessType',
          label: "业务类型",
          type: 'select',
          options: [
            { label: "销售发货", value: "outbound" },
            { label: "销售退货", value: "inbound_return" },
            { label: "采购收货", value: "inbound_purchase" },
            { label: "采购退货", value: "outbound_purchase" },
            { label: "生产领料", value: "outbound_pick_out" },
            { label: "生产退料", value: "inbound_return_materials" },
            { label: "外协发货", value: "outbound_sale_send" },
            { label: "外协退料", value: "inbound_external" },
            { label: "外协收货", value: "inbound_outsourcing" },
            { label: "外协退货", value: "outbound_external" },
            { label: "直接出库", value: "outbound_other" },
            { label: "直接入库", value: "inbound_other" },
          ],
        },
        {
          prop: 'partnerName',
          label: "客户/供应商",
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: "客户/供应商编码",
          type: 'input'
        },
        {
          prop: 'inspectionResults',
          label: "检验标志",
          type: 'select',
          options: [
            { label: "合格", value: "qualified" },
            { label: "不合格", value: "unqualified" },
            { label: "待检验", value: "unInspect" },
          ]
        },
        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'select',
          options: [
            { label: "草稿", value: "draft" },
            { label: "提交", value: "submit" }
          ]
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input',
        }, {
          prop: 'remark',
          label: "备注",
          type: 'input',
        }, {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },

      ],
      isProjectSwitch: '',
      printVisible: false,
      printBrowseVisible: false,
      prindId: '',
      formId: '',
      enCode: "",
    }
  },

  computed: {
    ...mapGetters(['userInfo'])
  },

  async created() {
    await this.getProjectSwitch('system', 'project')
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.superForm=this.listQuery
    this.search('basic')
  },
  methods: {
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.printBrowseVisible = true
          this.printVisible = false

          this.printVisible = false
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    // 打印
    PrintFun(row) {
      console.log(this.arr, row);
      this.enCode = 'p031' // 筛选出 businessType 等于 type 的项
      this.formId = row.id
      this.fullName = "报废出库单" // 筛选出 businessType 等于 type 的项
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    nbwPrintFun(row) {
      getPrintDeliveryNote(row.id).then(res => {
        console.log(res, 'res')
        this.jnpf.downloadFile(res.data.url)
      })
    },
    closePrint() {
      this.printVisible = false
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    viewFun(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type)
      })
    },
    editFun(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type)
      })
    },
    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init("", 'add')
      })
    },
    // 合计处理

    getInventorySummaryDataFun() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.listQuery.classAttribute=this.classAttribute

      this.listQuery.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getWarehouseList(this.listQuery).then(res => {

        this.tableData = res.data.records ? res.data.records : []
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef);
        let columnList = domRef.columnList.filter(item => !!item.label && !!item.prop)
        columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
        this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
      } else {
        this.$message({
          message: "暂无数据导出",
          type: "error",
          duration: 1500,
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableData, 'dataTable')


    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        this.initListQuery.classAttribute=this.classAttribute
        let query = this.initListQuery
        let _data = {
          ...query,
          exportType: '1012',
          exportName: '出入库列表',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.initListQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },











    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    handeleInfoData(val) {
      this.selectData = val
    },
    initData() {
      this.getInventorySummaryDataFun()
    },
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    search(type) {
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.superForm=this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'productDrawingNo', fieldValue: '', label: '型号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.initData()
    },

    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
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
    releaseFun() {
      if (this.selectData.length) {
        let idList = this.selectData.map(item => item.id)
        releasePartner(idList).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "释放成功",
            duration: 1500,
          })
        }).catch(() => { })
      } else {
        this.$message.warning('请选择您要释放的客户数据！')
      }
    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style scoped>
 .JNPF-common-search-box {
  padding: 8px 0 0 0!important;
  margin-left: 0!important;

  margin-bottom: 5px;
}
</style>
