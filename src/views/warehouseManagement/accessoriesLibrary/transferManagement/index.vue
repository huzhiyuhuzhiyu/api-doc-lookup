<template>
  <!-- 销售订单创建 -->
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.orderNo" @keyup.enter.native="search()" placeholder="调拨单号" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="pickingDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                  start-placeholder="调拨开始日期" end-placeholder="调拨结束日期" clearable>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="form.documentStatus" placeholder="单据状态" clearable style="width: 100%;">
                  <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>

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
            <topOpts @add="addSupplier()">
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
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column>
            <el-table-column prop="orderNo" label="调拨单号" min-width="180" sortable="custom"> 
              <template slot-scope="scope">
              <el-link type="primary" @click.native="viewFun(scope.row.id, 'look')">{{
                scope.row.orderNo
              }}</el-link>
            </template>
            </el-table-column>
            <el-table-column prop="pickingDate" label="调拨日期" min-width="160" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="160" sortable="custom" />
            <el-table-column prop="documentStatus" label="单据状态" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" sortable="custom" />
            <el-table-column label="操作" min-width="200" fixed="right">
              <template slot-scope="scope">
                <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                  :delDisabled="scope.row.documentStatus == 'submit'"
                  :editDisabled="scope.row.documentStatus == 'submit'" @edit="editFun(scope.row.id, 'edit')"
                  @del="handleDel(scope.row.id)">
                  <el-dropdown hide-on-click>
                    <span class="el-dropdown-link">
                      <el-button type="text" size="mini">
                        {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="viewFun(scope.row.id, 'look')">查看详情</el-dropdown-item>

                    </el-dropdown-menu>
                  </el-dropdown>
                </tableOpts>

              </template>
            </el-table-column>
          </JNPF-table>

          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData">

          </pagination>

        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />


    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { getTransferList, deleteTransferData, getTransferLinesList } from '@/api/warehouseManagement/transferManagement'
import { excelExport } from '@/api/basicData/index'
import Form from './Form'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  name: 'salesOrderCreation',
  components: { Form, ExportForm, SuperQuery },
  data() {
    return {
      documentStatusList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" }
      ],


      columnList: ['createByName'],
      superQueryVisible: false,
      exportFormVisible: false,
      tableData: [],
      listLoading: false,
      form: {
        orderNo: "",
        pickingStartDate: "",
        pickingEndDate: "",
        documentStatus: "",
        classAttribute: "accessories",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

        superQuery: {},
      },


      pickingDateArr: [],
      total: 0,
      formVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "调拨单号",
          type: 'input'
        },
        {
          prop: 'deliverDate',
          label: '调拨日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
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
            { label: "提交", value: "submit" }
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },




      ],
      selectList: [],
    }
  },



  created() {
    this.initData()
  },
  methods: {
    viewFun(id,btnType){
      this.formVisible=true
      this.$nextTick(()=>{
          this.$refs.Form.init(id,btnType)
      })
    },
    editFun(id,btnType){
      this.formVisible=true
      this.$nextTick(()=>{
          this.$refs.Form.init(id,btnType)
      })
    },







    superQuerySearch(query) {
      this.form.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },






    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.form.orderItems[0].asc = order === "ascending"
      this.form.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },


    dataFormSubmit() {
      this.form.pageNum = 1
      Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })

      if (this.pickingDateArr && this.pickingDateArr.length > 0) {
        this.form.pickingStartDate = this.pickingDateArr[0]
        this.form.pickingEndDate = this.pickingDateArr[1]
      } else {
        this.form.pickingStartDate = ""
        this.form.pickingEndDate = ""
      }
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
    initData() {
      this.listLoading = true
      getTransferList(this.form).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },


    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.pickingDateArr = []
      this.form = {
        orderNo: "",
        pickingStartDate: "",
        pickingEndDate: "",
        documentStatus: "",
        classAttribute: "accessories",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

        superQuery: {},
      }

      this.search()
    },


    addSupplier() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init('', 'add')
      })

    },
    // 检查字段是否相同  
    areFieldsEqual(arr, fields) {
      const firstEntry = arr[0];
      const values = new Set();

      for (const field of fields) {
        values.add(firstEntry[field]);
      }

      for (let i = 1; i < arr.length; i++) {
        for (const field of fields) {
          values.add(arr[i][field]);
        }
      }

      return values.size === 1;
    },
    getCopyOrders(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })

    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype)
        })
        // }, 600);
      }
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteTransferData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
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
      const targetListQuery = this.form
      let _data = {
        ...targetListQuery,
        exportType: '1005',
        exportName: '销售订单明细',
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
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}



.JNPF-common-search-box {
  padding: 8px !important;

  margin-bottom: 5px;
}

.JNPF-common-head {
  padding: 8px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #f5f5f5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

.aaa ::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}
</style>
