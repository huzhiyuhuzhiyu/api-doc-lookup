<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
    
       
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="listQuery.orderNo" placeholder="请输入审批单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="listQuery.submitDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 100%;" start-placeholder="审批开始时间" end-placeholder="审批结束时间"
                        :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()"  v-model="listQuery.businessName" placeholder="请输入所属业务" clearable />
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
                  @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>

            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="tableData" @sort-change="sortChange" ref="dataTable" custom-column customKey="JNPFTableKey_861848">
                <el-table-column prop="orderNo" label="审批单号" min-width="180">
                  <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, 'look', 'disabled', scope.row.approvalBusinessCode)">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="documentNo" label="业务单号" min-width="180"/>
                <el-table-column prop="businessName" label="流程标题" min-width="180">
                  <template slot-scope="scope">
                    <div>{{ scope.row.createByName }} {{ scope.row.businessName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="businessName" label="所属业务" min-width="160"/>
                <el-table-column prop="createByName" label="发起人"min-width="160" />
                <el-table-column prop="submitDate" label="发起时间"min-width="180" />
                <el-table-column prop="finishTime" label="完成时间"min-width="180" />
                <el-table-column prop="approvalFormStatus" label="流程状态" align="center" min-width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalFormStatus == 'ing'">
                      <el-tag>审批中</el-tag>
                    </div>
                    <div v-else-if="scope.row.approvalFormStatus == 'ok'">
                      <el-tag type="success">审批通过</el-tag>
                    </div>
                    <div v-else-if="scope.row.approvalFormStatus == 'rebut'">
                      <el-tag type="danger">审批拒绝</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, 'look','disabled',scope.row.approvalBusinessCode)">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                @pagination="initData" />
            </div>
          </div>
      
  

    </div>
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20" >

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="审批单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入审批单号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属业务">
              <el-input v-model="listQuery.businessName" placeholder="请输入所属业务" clearable />
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.status" placeholder="请选择审批状态" filterable clearable>
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发起时间">
              <el-date-picker v-model="listQuery.submitDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 100%;" start-placeholder="审批开始时间" end-placeholder="审批结束时间"
                        :default-time="['00:00:00', '23:59:59']" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成时间">
              <el-date-picker v-model="listQuery.finishTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: 100%;" start-placeholder="审批完成开始时间" end-placeholder="审批完成结束时间"
                        :default-time="['00:00:00', '23:59:59']" />
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

    <component :is="listPageComponent" v-if="depFormVisible" ref="depForm" @close="close" />
  </div>
</template>

<script>
import { approvalCenterList, } from '@/api/basicData/approvalAdministrator'
import SalesQuo from '../components/SalesQuo.vue'
import fixPointPrice from '../components/fixPointPrice.vue'
import defectiveProductHandlingForm from '../components/defectiveProductHandlingForm.vue'
import outsourProcessForm from '../components/outsourProcessForm.vue'
import buyingRequisitionForm from '../components/buyingRequisitionForm.vue'
import orderChangesForm from '../components/orderChangesForm.vue'
import stopTicketForm from '../components/stopTicketForm.vue'
import purchaseOrderForm from '../components/purchaseOrderForm.vue'
import outsourcingOrderForm from '../components/outsourcingOrderForm.vue'
import excessiveNoticeForm from '../components/excessiveNoticeForm.vue'
import repleNoticeForm from '../components/repleNoticeForm.vue'
import purReconciliationForm from '../components/purReconciliationForm.vue'
import outReconciliationForm from '../components/outReconciliationForm.vue'
import salesReconForm from '../components/salesReconForm.vue'
import productionBomForm from '../components/productionBomForm.vue'
import saleAdjustForm from '../components/saleAdjustForm.vue'
import moment from 'moment'
import findPage from '../findPage.js'
export default {
  name: 'quality',
  components: { SalesQuo,fixPointPrice,defectiveProductHandlingForm,outsourProcessForm,buyingRequisitionForm,orderChangesForm ,stopTicketForm,purchaseOrderForm,outsourcingOrderForm,excessiveNoticeForm,repleNoticeForm,purReconciliationForm,outReconciliationForm,salesReconForm,productionBomForm,saleAdjustForm},
  data() {
    return {
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        createByName: "",
        endTime: "",
        keyword: "",
        label: "have",    // 抄送我的
        orderNo: "",
        "orderItems": [
          {
            "asc": true,
            "column": ""
          }, {
                    asc: false,
                    column: "create_time" /* 使用倒序日期作为默认排序 */
                }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        approvalFormStatus: "",
        submitStartDate:'',
        submitEndDate:'',
        submitDate:[],
        finishStartDate:'',
        finishEndDate:'',
        finishDate:[],
      },
      total: 0,
      formVisible: false,
      statusList: [{
        label: "审批中",
        value: "ing"
      }, {
        label: "审批通过",
        value: "ok"
      }, {
        label: "审批拒绝",
        value: "rebut"
      }],
      findPageList:findPage.approvalList,
      listPageComponent:'',
    }
  },
  watch: {
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()

  },
  methods: {
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    close(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      this.visible = false
      this.jnpf.searchTimeFormat(this.listQuery, 'submitDate', 'submitStartDate', 'submitEndDate')
      this.jnpf.searchTimeFormat(this.listQuery, 'finishDate', 'finishStartDate', 'finishEndDate')
      approvalCenterList(this.listQuery).then(res => {
        console.log("货位表格", res)
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      // if (this.activeName === 'dont') {
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
      // }
      //  else {
      //   Object.keys(this.linesQuery).forEach(key => {
      //     let item = this.linesQuery[key]
      //     this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
      //   })
      //   this.linesQuery.pageNum = 1
      // }
      this.initData()
    },
    reset() {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
        this.initData()
    },
    addOrUpdateHandle(id,type,btnType,pageType) {
     let targetPage =  this.findPageList.find(item=>item.label === pageType)
      this.listPageComponent = targetPage.value
      this.depFormVisible = true
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type,btnType,targetPage.label)
        })
    },
  }
}
</script>

<style src="@/assets/scss/index-list.scss" lang="scss" scoped />