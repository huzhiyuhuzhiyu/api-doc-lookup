<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!depFormVisible">
        <el-row class="JNPF-common-search-box" :gutter="16">
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

            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                  $t('common.reset') }}
                </el-button>

              </el-form-item>

            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <!-- <el-dropdown> -->
            <topOpts @add="addSupplier('', 'add')">
              <el-button type="primary" size="mini" icon="el-icon-download"
                @click="exportForm('tableForm')">导出</el-button>
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
          <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" :fixedNO="true"
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column>
            <el-table-column prop="quotationNo" label="报价单号" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                  scope.row.quotationNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="deliver" label="致" width="200" />
            <el-table-column prop="cooperativePartnerCode" label="客户编码" sortable="custom" min-width="120" />
            <el-table-column prop="cooperativePartnerIdText" label="客户名称" sortable="custom" min-width="160" />
            <el-table-column prop="bidder" label="报价人" sortable="custom" width="100" />
            <el-table-column prop="quotationTime" label="报价时间" width="130" sortable="custom" />
            <el-table-column prop="validEnd" label="有效时间止" width="130" sortable="custom" />
            <el-table-column prop="address" label="地址" min-width="300" />
            <el-table-column prop="phone" label="电话" width="120" sortable="custom" />
            <el-table-column prop="fax" label="传真" width="120" sortable="custom" />
            <el-table-column prop="totalAmount" label="总金额" width="100" sortable="custom" />
            <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag>
                </div>
                <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center"
              v-if="showAppCodeFlag">
              <template slot-scope="scope">
                <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'">
                  <el-tag>审批中</el-tag>
                </div>
                <div v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'">
                  <el-tag type="success">审批通过</el-tag>
                </div>
                <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'">
                  <el-tag type="danger">审批拒绝</el-tag>
                </div>
                <div v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                  <el-tag type="warning">审批撤回</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="reasonRejection" label="驳回理由" min-width="230" />


            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" width="110" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="280" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')" size="mini"
                  :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
                <el-button type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini"
                  @click="handleDel(scope.row.id,)" class="JNPF-table-delBtn">删除</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="(scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn') && showAppCodeFlag"
                      @click.native="addSupplier(scope.row.id, 'add')">
                      重新提交
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag"
                      @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                      审批撤回
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="copyFun(scope.row.id, 'copy')">
                      复制
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="downloadOrder(scope.row.id)">
                      下载报价单
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>
    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getQuotationLists, deleteQuotationData, getQuotationmxLists, exportSaleQuotation } from '@/api/salesManagement/index'
import DepForm from './depForm'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport } from '@/api/basicData/index'
export default {
  name: 'salesQuotation',
  components: { DepForm, SuperQuery, ExportForm },
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'quotationNo', fieldValue: '', label: '报价单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerIdText', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'bidder', fieldValue: '', label: '报价人', symbol: 'like', searchType: 1, width: 120 },

      ],


      columnList: ["deliver", "cooperativePartnerCode", "address", "fax", "reasonRejection", "createByName", "remark"],
      superQueryVisible: false,

      deliveryDatefahuo: [],
      createTimeArrfahuo: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      exportFormVisible: false,
      approvalStatusList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
        { label: "审批撤回", value: "withdrawn" },
      ],
      documentStatusList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      depFormVisible: false,
      background: true,//分页器背景颜色
      tableDataList: [],
      form: {},
      formlist: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
        quotationNo: "",
        cooperativePartnerIdText: "",
        deliver: "",
        bidder: "",

        approvalStatus: '',
        documentStatus: "",
        submitStartDate: '',
        submitEndDate: '',
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      },
      superQueryJson: [
        {
          prop: 'quotationNo',
          label: "报价单号",
          type: 'input'
        },
        {
          prop: 'deliver',
          label: "致",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerIdText',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'bidder',
          label: "报价人",
          type: 'input'
        },
        {
          prop: 'quotationTime',
          label: "报价时间",
          type: 'input'
        },
        {
          prop: 'validEnd',
          label: "有效时间止",
          type: 'input'
        },
        {
          prop: 'address',
          label: "地址",
          type: 'input'
        },
        {
          prop: 'phone',
          label: "电话",
          type: 'input'
        },
        {
          prop: 'fax',
          label: "传真",
          type: 'input'
        },
        // {
        //   prop: 'totalAmount',
        //   label: "总金额",
        //   type: 'input'
        // },
        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'input'
        },
        {
          prop: 'approvalStatus',
          label: "审批状态",
          type: 'input'
        },
        {
          prop: 'reasonRejection',
          label: "驳回理由",
          type: 'input'
        },
        {
          prop: 'createTime',
          label: "创建时间",
          type: 'input'
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },





      ], 
      submitDate: [],
      listLoading: false,
      total: 0,
      formVisible: false,
      bidderS: "",
      cooperativePartnerIdTextS: "",
      quotationNoS: "",
      showAppCodeFlag: true
    }
  },
  async created() {
    this.form = JSON.parse(JSON.stringify(this.formlist))
    this.superForm = this.form
    const res = await this.jnpf.getBusInfo('b001')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    this.search('basic')
  },

  methods: {

    superQuerySearch(query) {
      this.form.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },

    sortChange({ prop, order }) {
      let newProp
      if (prop == 'cooperativePartnerIdText') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.form.orderItems[0].asc = order !== 'descending'
      this.form.orderItems[0].column = newProp
      this.search('basic')
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
        this.search('basic')
    },
    initData() {
      this.listLoading = true


      getQuotationLists(this.superForm).then(res => {
        this.tableDataList = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })

    },
    search(type) {


      Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
      this.form.pageNum = 1 // 重置页码
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
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
      console.log(this.$refs);
      this.$refs.tableForm.$refs.JNPFTable.clearSort()
      this.superForm=this.form = JSON.parse(JSON.stringify(this.formlist))
      this.$refs.SuperQuery.conditionList = []
      this.searchList= [
        { field: 'quotationNo', fieldValue: '', label: '报价单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerIdText', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'bidder', fieldValue: '', label: '报价人', symbol: 'like', searchType: 1, width: 120 },

      ],
      this.search('basic')
    },
    addSupplier(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    copyFun(id, type) {
      this.depFormVisible = true


      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
        // }, 600);
      }
    },
    // 编辑
    addOrUpdateHandle(res, type) {
      this.depFormVisible = true


      let id = res.id
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
        // }, 600);
      }
    },


    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteQuotationData(id).then(res => {
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    downloadOrder(id) {
      exportSaleQuotation(id).then(res => {
        this.jnpf.downloadFile(res.data.url, res.data.name)
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
      const targetListQuery = this.formlist
      let _data = {
        ...targetListQuery,
        exportType: '1054',
        exportName: '销售报价单',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        withdrawn(_data).then(res => {
          this.$message({
            type: 'success',
            message: "撤回成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
}

.JNPF-common-head {
  padding: 8px;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />