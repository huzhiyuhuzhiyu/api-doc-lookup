<script>
import SuperQuery from '@/components/SuperQuery/index.vue'

import {buttonList, getColumns} from "./data";
import {getPrintBusInfo} from "@/api/system/printDev";
import Form from '../module/Form.vue'
import PrintDialog from '@/components/no_mount/printDialog/index.vue';
import BatchPrintBrowse from "@/components/PrintBrowse/BatchPrintBrowse.vue";
import {closeProducePlan, getProductionPlanList} from "@/api/productionManagement";
import {uploadProduct} from "@/api/customerManagement";

export default {
  name: "index",
  components: {
    BatchPrintBrowse,
    PrintDialog,
    SuperQuery,
    Form
  },
  data() {
    return {
      loading: false,
      visible: false,
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
      superQueryJson: [],
      initListQuery: {
        planType: 'package_plan',
        productionPlanNo: '',
        productsName: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        superQuery: {},
        pageNum: 1,
        pageSize: 20
      },
      listQuery: {},
      btnList: buttonList,
      columnList: [],
      columnsConfig: getColumns(),
      selectedRow: [],
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      try {
        const res = await getProductionPlanList(this.listQuery);
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
        case 'print':
          if (!this.validateSelectedRows()) return;
          this.printView(this.selectedRow[0], 'p006', '打印');
          break;
        case 'import':
          break;
        default:
      }
    },

    handleColumnClick(row, type) {
      switch (type) {
        case 'look':
        case 'edit':
        case 'copy':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init(row.id, type)
          })
          break;
        case 'arrange':
          this.visible = true
          this.$nextTick(() => {
            this.$refs.Form.init('', type, row)
          })
          break;
        case 'close':
          this.handleClose(row.id)
          break;
        default:
      }
    },

    handleClose(id) {
      this.$confirm('您确定关闭当前计划吗, 是否继续？', '提示', {
        type: 'warning'
      }).then(async () => {
        const res = await closeProducePlan([id]);
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success('关闭成功')
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

    sortChange({prop, order}) {
      let newProp = ''
      if (prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    getAlign(align) {
      return align || 'center'
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
  }
}
</script>

<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center  JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16" style="margin-bottom: 5px !important;">
        <el-form @submit.native.prevent @keyup.enter.native="search()">
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productionPlanNo"
                placeholder="包装计划单号"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productsName"
                placeholder="产品名称"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search"
                @click="search()">查询
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding: 8px">
          <div class="JNPF-common-head-left">
            <CustomButton
              :btnList="btnList"
              @click="handleButtonClick"
            />
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true"/>
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
          @sort-change="sortChange"
          ref="dataTable"
          custom-column>
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
          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="{ row }">
              <el-button size="mini" type="text" :disabled="row.orderType === 'rework'"
                @click="handleColumnClick(row, 'arrange')">
                编排
              </el-button>
              <el-button class="JNPF-table-delBtn" size="mini" type="text" :disabled="row.documentStatus !== 'draft'"
                @click="handleColumnClick(row, 'close')">
                关闭
              </el-button>
              <el-button size="mini" type="text" @click="handleColumnClick(row, 'look')">
                详情
              </el-button>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery partentOrChild="PackagingPlans" :show="superQueryVisible" ref="SuperQuery"
      table-ref="dataTable"
      :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false"/>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate"/>
    <BatchPrintBrowse ref="batchPrint" :fullName="fullName"/>
    <!--  导入-->
    <UploadImportData ref="uploadRef" v-if="uploadVisible" :extraFormData="extraFormData" :uploadApi="uploadProduct" @success="importDataSuccess"
      @close="uploadVisible = false" templateDownLoadPath="/static/销售订单导入模板.xlsx"/>

    <Form ref="Form" v-if="visible" @close="close"/>
  </div>
</template>
