<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderNoS" placeholder="领料单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="orderForm.receiveType" placeholder="领料类型" style="width: 100%;">
                  <el-option v-for="(item, index) in receiveTypeList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="personNameS" placeholder="领料人" clearable @keyup.enter.native="search()" />
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
            <topOpts @add="addSupplier('', 'add')">
              <el-button type="primary" size="mini" icon="el-icon-download"
                @click="exportForm('dataTable')">导出</el-button>
            </topOpts>
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            header-cell-class-name="all-select" @sort-change="sortChange" custom-column
            :setColumnDisplayList="columnList">
            <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="200" sortable="custom">
            </el-table-column>
            <el-table-column prop="orderNo" label="领料单号" min-width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="viewDetailsFun(scope.row.id,'look')">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="receiveType" label="领料类型" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.receiveType == 'order'">订单物料</div>
                <div v-if="scope.row.receiveType == 'process'">工序物料</div>
              </template>
            </el-table-column>

            <el-table-column prop="personName" label="领料人" min-width="80" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="80" sortable="custom" />
            <el-table-column prop="documentStatus" label="单据状态" min-width="140" sortable="custom"
              :showOverflowTooltip="false" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="handleDel(scope.row.id)">删除</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="viewDetailsFun(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>

    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>

<script> 
import { WithdrawalList,deleteWithdrawal } from '@/api/productOrdes/index.js'
import ExportForm from '@/components/no_mount/ExportBox/index'
import Form from './Form.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport } from '@/api/basicData/index'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'assemblyplanManagement',
  components: { SuperQuery, ExportForm,Form },
  data() {
    return {
      formVisible:false,
      columnList: ["productionOrderNo", "createByName"],
      receiveTypeList: [
        { label: "订单物料", value: "order" },
        { label: "工序物料", value: "process" },
      ],
      personNameS: "",
      orderNoS: "",
      superQueryVisible: false,
      exportFormVisible: false,

      btnLoading: false,

      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,

      orderForm: {},
      orderFormlist: {
        receiveType: "",
        orderNo: "",
        personName: "",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        classAttribute: "finish_product",
        pickingStatus: "not_finished",
        notifyType: 'picking',
      },



      total: 0, 
      selectArr: [],

      superQueryJson: [
        {
          prop: 'productionOrderNo',
          label: "生产任务单号",
          type: 'input'
        },

        {
          prop: 'orderNo',
          label: "领料单号",
          type: 'input'
        },
        {
          prop: 'receiveType',
          label: "领料类型",
          type: 'select',
          options: [
            { label: "订单物料", value: "order" },
            { label: "工序物料", value: "process" },
          ]
        },
        {
          prop: 'personName',
          label: "领料人",
          type: 'input'
        },

        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'select',
          options: [
            { label: "草稿", value: "draft" },
            { label: "提交", value: "submit" },
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
      ],


    }
  },
  created() {
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search()
  },
   
  mounted() {
  },
  methods: {
    // 新增
    addSupplier(id,btnType){
      this.formVisible=true
      this.$nextTick(()=>{
        this.$refs.Form.init(id,btnType,'pick')
      })
    },
    // 查看详情
    viewDetailsFun(id,btnType){
      this.formVisible=true
      this.$nextTick(()=>{
        this.$refs.Form.init(id,btnType,'pick')
      })
    },
    // 编辑
    addOrUpdateHandle(id,btnType){
      this.formVisible=true
      this.$nextTick(()=>{
        console.log(6666);
        this.$refs.Form.init(id,btnType,'pick')
      })
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 删除
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteWithdrawal(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName'||prop=='personName') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp

      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.search()
    },
    initData() {
      this.listLoading = true




      if (this.orderNoS) {

        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("orderNo"));
          filteredData.push({ "field": "orderNo", "fieldValue": this.orderNoS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push(
            { "field": "orderNo", "fieldValue": this.orderNoS, "symbol": "like" }
          )
        }
      }
      if (this.personNameS) {
        // this.orderForm.superQuery.condition.push(
        //   { "field": "productDrawingNo", "fieldValue": this.productDrawingNo, "symbol": "like" }
        // )
        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("personName"));
          filteredData.push({ "field": "personName", "fieldValue": this.personNameS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push(
            { "field": "personName", "fieldValue": this.personNameS, "symbol": "like" }
          )
        }
      }
      if (this.orderNoS || this.personNameS) {
        this.$set(this.orderForm.superQuery, 'matchLogic', 'AND')
      }else{
        if (!this.orderForm.superQuery.condition.length) {
          this.orderForm.superQuery = {
            condition: [],
            matchLogic: ""
          }
        }
      }
      WithdrawalList(this.orderForm).then(res => {
        res.data.records.forEach(item => {
          item.selectFlag = false
        })
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    search() {

      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

      this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))

      this.orderNoS = ""
      this.personNameS = ""
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },





    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm(exportTableRef) {
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
      const targetListQuery = this.orderForm
      let _data = {
        ...targetListQuery,
        exportType: "1094",
        exportName: '装配领料',
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
<style scoped>
::v-deep .all-select .cell .el-checkbox__inner {
  display: none;
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}
</style>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
