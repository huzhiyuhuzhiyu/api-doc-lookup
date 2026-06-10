<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.orderNo" placeholder="请输入定点定价单号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerCode" placeholder="请输入供应商编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable
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
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>

        </el-form>
      </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">

              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList"
          @sort-change="sortChange" custom-column customKey="JNPFTableKey_993977">
          <el-table-column prop="orderNo" label="定点定价单号" min-width="180">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandles(scope.row.id, 'look')">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="150" sortable="custom" />
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="170" sortable="custom" />

          <el-table-column prop="listPriceFlag" label="是否设置牌价" align="left" min-width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.listPriceFlag == 0"><el-tag type="warning">否</el-tag> </div>
              <div v-if="scope.row.listPriceFlag == 1"><el-tag type="success">是</el-tag></div>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="200" />
          <el-table-column prop="createByName" label="创建人" />

          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="scope.row.listPriceFlag === 1"
                @click="addOrUpdateHandle(scope.row.id, 'edit')">设置牌价</el-button>
              <!-- <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled=""
                  @click="handleDel(scope.row.id)">删除</el-button> -->
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
              <el-input v-model.trim="listQuery.productsCode" placeholder="请输入产品编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productsName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productsDrawingNo" placeholder="请输入型号" clearable
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
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>

        </el-form>
      </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList"
          @sort-change="sortDetailChange" custom-column :partentOrChild="'child'">
          <el-table-column prop="orderNo" label="定点定价单号" min-width="200">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandles(scope.row.fixedPointPricingId, 'look')">{{
                scope.row.orderNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="150" sortable="custom" />
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="150" sortable="custom" />
          <el-table-column prop="listPriceFlag" label="是否设置牌价" align="left" min-width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.listPriceFlag == 0"><el-tag type="warning">否</el-tag> </div>
              <div v-if="scope.row.listPriceFlag == 1"><el-tag type="success">是</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="productsCode" label="产品编码" align="left" min-width="150" sortable="custom" />
          <el-table-column prop="productsName" label="产品名称" min-width="150" sortable="custom" />
          <el-table-column prop="drawingNo" label="型号" min-width="150" sortable="custom" />
          <el-table-column prop="spec" label="规格型号" align="left" min-width="120" />
          <el-table-column prop="bargaining" label="协议价" min-width="150" />
          <el-table-column prop="taxRate" label="税率(%)" min-width="150" />
          <el-table-column prop="excludingTaxPrice" label="不含税价" align="left" min-width="120" />
          <el-table-column prop="targetPrice" label="目标价" min-width="150"  />
          <el-table-column prop="historicalPrice" label="历史价格" min-width="150"  />
          <el-table-column prop="effectiveTimeStart" label="有效起始时间" align="left" min-width="150" sortable="custom" />
          <el-table-column prop="effectiveTimeEnd" label="有效结束时间" align="left" min-width="150" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="200"  />
          <!-- <el-table-column prop="createByName" label="创建人" /> -->

          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="scope.row.listPriceFlag === 1"
                @click="addOrUpdateHandle(scope.row.fixedPointPricingId, 'edit')">设置牌价</el-button>
              <!-- <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled=""
                  @click="handleDel(scope.row.id)">删除</el-button> -->
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.fixedPointPricingId, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>

        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>


      </el-tabs>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <FIxForm v-if="FIxVisible" ref="FIxForm"  @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="定点定价单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入定点定价单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商编码">
              <el-input v-model="listQuery.cooperativePartnerCode" placeholder="请输入供应商编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" 
                style="width: 100%;" start-placeholder="请选择创建开始日期" end-placeholder="请选择创建结束日期"
                :default-time="['00:00:00', '23:59:59']">
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
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="detailVisible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="定点定价单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入定点定价单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商编码">
              <el-input v-model="listQuery.cooperativePartnerCode" placeholder="请输入供应商编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productsCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productsName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productsDrawingNo" placeholder="请输入型号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效起始时间">
              <el-date-picker v-model="listQuery.effectiveTimeStart" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择有效起始时间的开始" end-placeholder="请选择有效起始时间的结束">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效结束时间">
              <el-date-picker v-model="listQuery.effectiveTimeEnd" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择有效结束时间的开始" end-placeholder="请选择有效结束时间的结束">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.time" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" 
                style="width: 100%;" start-placeholder="请选择创建开始日期" end-placeholder="请选择创建结束日期"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
    
          
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>

  </div>
</template>
  
<script>
import { getbuyFixedPointPricingList,buyFixedPointPricingDetailList, deletebuyFixedPointPricing } from '@/api/purchasingManagement/purchaseInquirySheet'
import JNPFForm from './Form'
import moment from 'moment'
import FIxForm from './FIxForm.vue'
export default {
  name: 'purchasePriceSetting',
  components: { JNPFForm,FIxForm },
  data() {
    return {
      title: "更多查询",
      activeName: "dataTable",
      background: true,//分页器背景颜色
      visible: false,
      detailVisible:false,
      FIxVisible: false,
      tableDataList: [
      ],
      listPriceFlagList: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        },
      ],
      formVisible: false,
      listLoading: false,
      listQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        approvalStatus: "ok",    // 审批状态 审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: "",  //	供应商编码
        cooperativePartnerId: '',      // 供应商id
        cooperativePartnerName: "",   // 	供应商名称

        documentStatus: "",           // 单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
        startAndEndTime: '',
        listPriceFlag: '',             // 是否设置牌价:0否1是
        orderNo: "",                  // 单号
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        submitEndTime: "",            //提交时间-结束
        submitStartTime: "",
        time:'',
        effectiveTimeStart:'',
        effectiveTimeEnd:''
      },

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick(picker) {
            const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    handleClick(e) {
      this.activeName = e.name
      if(this.activeName == 'dataTable'){
        this.listQuery.orderItems[1].column ="create_time"
      }else {
        this.listQuery.orderItems[1].column ="createTime"
      }
      this.search()
    },
    moreQueries() {
      if(this.activeName == 'dataTable'){
        this.visible = true
        this.detailVisible = false
      }else {
        this.detailVisible = true
        this.visible = false
      }
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      if (newProp === 'cooperative_partner_name') {
        newProp = "cooperativePartnerName"
      }
      if (newProp === 'cooperative_partner_code') {
        newProp = "cooperativePartnerCode"
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    sortDetailChange({ prop, order }) {
      if (prop === 'effectiveTimeStart') {
        prop = "effective_time_start"
      }
      if (prop === 'effectiveTimeEnd') {
        prop = "effective_time_end"
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : prop
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.FIxVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },


    initData() {
      this.listLoading = true
      if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
        this.listQuery.startTime = this.listQuery.startAndEndTime[0] + " 00:00:00"
        this.listQuery.endTime = this.listQuery.startAndEndTime[1] + " 23:59:59"
      }
      this.listQuery.listPriceFlag = 0

      if(this.activeName == 'dataTable'){
           getbuyFixedPointPricingList(this.listQuery).then(res => {

           this.tableDataList = res.data.records
           this.total = res.data.total
           this.listLoading = false
           this.visible = false
           this.detailVisible= false
         }).catch(() => {
           this.listLoading = false
         })
      } else{
           buyFixedPointPricingDetailList(this.listQuery).then(res => {
           this.tableDataList = res.data.records
           this.total = res.data.total
           this.listLoading = false
           this.visible = false
           this.detailVisible = false
         }).catch(() => {
           this.listLoading = false
         })
      }
      
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      if(this.listQuery.time){
        this.listQuery.startTime = this.listQuery.time[0]
        this.listQuery.endTime = this.listQuery.time[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      if(this.listQuery.effectiveTimeStart){
        this.listQuery.effectiveTimeStartStart = this.listQuery.effectiveTimeStart[0]
        this.listQuery.effectiveTimeStartEnd = this.listQuery.effectiveTimeStart[1]
      } else {
        this.listQuery.effectiveTimeStartStart = ''
        this.listQuery.effectiveTimeStartEnd = ''
      }
      if(this.listQuery.effectiveTimeEnd){
        this.listQuery.effectiveTimeEndStart = this.listQuery.effectiveTimeEnd[0]
        this.listQuery.effectiveTimeEndEnd = this.listQuery.effectiveTimeEnd[1]
      } else {
        this.listQuery.effectiveTimeEndStart = ''
        this.listQuery.effectiveTimeEndEnd = ''
      }
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      if(this.activeName == 'dataTable'){
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
          approvalStatus: "ok", 
        }
      } else{
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "createTime"
          }],
          approvalStatus: "ok", 
        }
      }
      this.search()
    },
    // addSupplier(id, type) {
    //   this.formVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.JNPFForm.init(id, type)
    //   })
    // },
    addOrUpdateHandle(id, type) {

      this.formVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(id, type)
        })
      }


    },
    addOrUpdateHandles(id, type) {
      this.FIxVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.FIxForm.init(id, type)
        })
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletebuyFixedPointPricing(id).then(res => {
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
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />