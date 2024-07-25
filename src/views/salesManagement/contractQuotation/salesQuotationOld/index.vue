<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.quotationNo" placeholder="请输入报价单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.cooperativePartnerIdText" placeholder="请输入客户名称" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.bidder" placeholder="请输入报价人" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
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
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('tableForm')">导出</el-button>
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
            <el-table-column prop="quotationNo" label="报价单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                  scope.row.quotationNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="deliver" label="致" width="200" />
            <el-table-column prop="cooperativePartnerCode" label="客户编码" sortable="custom" width="200" />
            <el-table-column prop="cooperativePartnerIdText" label="客户名称" sortable="custom" width="200" />
            <el-table-column prop="bidder" label="报价人" sortable="custom" width="120" />
            <el-table-column prop="quotationTime" label="报价时间" width="180" sortable="custom" />
            <el-table-column prop="validEnd" label="有效时间止" width="180" sortable="custom" />
            <el-table-column prop="address" label="地址" min-width="300" />
            <el-table-column prop="phone" label="电话" width="160" sortable="custom" />
            <el-table-column prop="fax" label="传真" width="160" sortable="custom" />
            <el-table-column prop="totalAmount" label="总金额" width="140" sortable="custom" />
            <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag>
                </div>
                <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center">
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
                      v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                      @click.native="addSupplier(scope.row.id, 'add')">
                      重新提交
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                      @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                      审批撤回
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                      查看详情
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
import { excelExport  } from '@/api/basicData/index'
export default {
  name: 'salesQuotation',
  components: { DepForm, SuperQuery,ExportForm },
  data() {
    return {
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
        quotationStartTime: "",
        quotationEndTime: '',
        approvalStatus: '',
        documentStatus: "",
        submitStartDate: '',
        submitEndDate: '',
        superQuery: {},
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
        {
          prop: 'totalAmount',
          label: "总金额",
          type: 'input'
        },
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
      quotationTime: [],
      submitDate: [],
      listLoading: false,
      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.formlist))
    this.search()
  },

  methods: {
   
    superQuerySearch(query) {
      this.formlist.superQuery = query
      this.superQueryVisible = false
      this.search()
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
      this.search()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.search()
      }
    },
    initData() {
      this.listLoading = true
      getQuotationLists(this.form).then(res => {
        this.tableDataList = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })

    },
    search() {
      if (this.submitDate && this.submitDate.length > 0) {
        this.form.submitStartDate = this.submitDate[0].replace(/ 0(?!0)/g, " ")
        this.form.submitEndDate = this.submitDate[1].replace(/ 0(?!0)/g, " ")
      } else {
        this.form.submitStartDate = ''
        this.form.submitEndDate = ''
      }
      if (this.quotationTime && this.quotationTime.length > 0) {
        this.form.quotationStartTime = this.quotationTime[0]
        this.form.quotationEndTime = this.quotationTime[1]
      } else {
        this.form.quotationStartTime = ''
        this.form.quotationEndTime = ''
      }
      Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
      this.form.pageNum = 1 // 重置页码

      this.initData()
    },
    reset() {

      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.form = JSON.parse(JSON.stringify(this.formlist))
      this.quotationTime = [],
        this.submitDate = []

      this.search()
    },
    addSupplier(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
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
        exportName:  '报价单列表',
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
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />