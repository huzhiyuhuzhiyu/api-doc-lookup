<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" >
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.orderNo" placeholder="请输入询价单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.supplierName" placeholder="请输入供应商名称" clearable
                      @keyup.enter.native="search()" />
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
                <topOpts @add="addOrUpdateHandle('', 'add')"></topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="dataTable"
                :data="tableDataList" @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="询价单号" min-width="180" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商名称" min-width="180" sortable="custom" />
                <el-table-column prop="inquiryDate" label="询价日期" min-width="180" sortable="custom" />
                <el-table-column prop="effectiveDate" label="报价有效期" min-width="180" />
                <el-table-column prop="bidder" label="报价人" min-width="180" />
                <el-table-column prop="address" label="地址" min-width="180" />
                <el-table-column prop="phone" label="电话" min-width="180" />
                <el-table-column prop="fax" label="传真" min-width="180" />
                <el-table-column prop="remark" label="备注" min-width="160"/>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                <el-table-column prop="createByName" label="创建人" />


                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                      @del="handleDel(scope.row.id, scope.row.parentId)">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>

                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="linesQuery.orderNo" placeholder="请输入询价单号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="linesQuery.supplierName" placeholder="请输入供应商名称" clearable
                      @keyup.enter.native="search()" />
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addOrUpdateHandle('', 'add')"></topOpts>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="linesTableData"
                :data="linesTableData" @sort-change="sortChange" :partentOrChild="'child'" custom-column>
                <el-table-column prop="orderNo" label="询价单号" min-width="150" sortable="custom" fixed="left">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.inquirySheetId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商名称" width="140" show-overflow-tooltip sortable="custom"
                  fixed="left" />
                <el-table-column prop="inquiryDate" label="询价日期" width="140" sortable="custom" />
                <el-table-column prop="effectiveDate" label="报价有效期" width="140" />
                <el-table-column prop="bidder" label="报价人" width="100" />
                <el-table-column prop="productsCode" label="产品编码" min-width="140" show-overflow-tooltip />
                <el-table-column prop="productsName" label="产品名称" min-width="140" show-overflow-tooltip
                  sortable="custom" />
                <el-table-column prop="productsDrawingNo" label="产品图号" min-width="370" show-overflow-tooltip
                  sortable="custom" />
                <el-table-column prop="materialPrice" label="产品价格" min-width="120" show-overflow-tooltip />
                <el-table-column prop="taxRate" label="税率%" min-width="100" show-overflow-tooltip />
                <el-table-column prop="remark" label="备注"  min-width="180"/>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                <el-table-column prop="createByName" label="创建人" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.inquirySheetId, 'edit')"
                      @del="handleDel(scope.row.inquirySheetId)">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.inquirySheetId, 'look')">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>

                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :background="background"
                :limit.sync="linesQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>


      </el-tabs>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />

    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="询价单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入询价单号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="linesQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productsCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productsName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productsDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报价人">
              <el-input v-model="linesQuery.bidder" placeholder="请输入报价人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="linesQuery.phone" placeholder="请输入电话" clearable />
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="询价日期">
              <el-date-picker v-model="linesQuery.inquiryDate" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择询价开始日期" end-placeholder="请选择询价结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报价有效期">
              <el-date-picker v-model="linesQuery.effectiveDate" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择报价开始日期" end-placeholder="请选择报价结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.createDate" type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;"
                start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" clearable
                :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>
  
<script>
import { getbuyInquirySheetList, deletebuyInquirySheet, linesBuyInquirySheetLine } from '@/api/purchasingManagement/purchaseInquirySheet'
import JNPFForm from './Form'

export default {
  name: 'purchaseInquirySheet',
  components: { JNPFForm },
  data() {
    return {
      title: "更多查询",
      activeName: 'dataTable',
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      linesTableData: [],
      formVisible: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {
        active: true,
        address: "",
        bidder: "",    // 报价人
        createByName: "",
        createEndTime: "",
        createStartTime: "",
        effectiveEndTime: "", //报价有效日期-结束
        effectiveStartTime: "", // 报价有效日期-开始
        endTime: "",
        fax: "",                //	传真
        inquiryEndTime: "",     //询价日期-结束
        inquiryStartTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        orderNo: "",  //单号
        pageNum: 1,
        pageSize: 20,
        phone: "",
        startTime: "",
        supplierName: "",
        
      },
      total: 0,
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {

        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],


        bidder: "",
        createByName: "",
        effectiveEndTime: "",
        effectiveStartTime: "",
        endTime: "",
        inquiryEndTime: "",
        inquiryStartTime: "",
        keyword: "",

        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        phone: "",
        productsCode: "",
        productsDrawingNo: "",
        productsName: "",
        startTime: "",
        supplierName: "",
        inquiryDate:[],
        effectiveDate:[],
        createDate:[]
      },

      formVisible: false,
    }
  },
  watch:{activeName() { this.initData() }},
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {

    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productsName' || prop === 'productsDrawingNo' || prop === 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (this.activeName === 'dataTable') {
        if (newProp === 'createTime') {
          newProp = 'create_time'
        }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },
    moreQueries() {
      this.visible = true
    },

    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        getbuyInquirySheetList(this.listQuery).then(res => {
          console.log(res, '询价单列表');
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery,'inquiryDate','inquiryStartTime','inquiryEndTime')
        this.jnpf.searchTimeFormat(this.linesQuery,'effectiveDate','effectiveStartTime','effectiveEndTime')
        this.jnpf.searchTimeFormat(this.linesQuery,'createDate','startTime','endTime')
        linesBuyInquirySheetLine(this.linesQuery).then(res => {
          console.log(res, '询价单列表');
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },

    search() {
      if (this.activeName === 'dataTable') {
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
      } else {
        Object.keys(this.linesQuery).forEach(key => {
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1
      }
      this.initData()
    },

    reset() {
      if (this.activeName === 'dataTable') {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()

        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
        this.linesQuery.inquiryDate = []
        this.linesQuery.effectiveDate = []
        this.linesQuery.createDate = []
      }
      this.initData()
    },

    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletebuyInquirySheet(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },

  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
  