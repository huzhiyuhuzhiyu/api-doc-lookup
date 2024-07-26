<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main"> 
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.orderNo" placeholder="请输入退货单号" clearable @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.partnerCode" placeholder="请输入客户编码" clearable @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.partnerName" placeholder="请输入客户名称" clearable @keyup.enter.native="search()" />
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('', 'add')">
                    新建
                  </el-button>
                  <el-button type="primary" icon="el-icon-plus" @click.native="Cancelshipment()">
                    批量取消退货
                  </el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="false" @sort-change="sortChange" custom-column :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" hasC>
                <el-table-column prop="orderNo" label="退货单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>

                <el-table-column prop="partnerCode" label="客户编码" width="200" sortable="custom" />
                <el-table-column prop="partnerName" label="客户名称" width="200" sortable="custom" />
                <el-table-column prop="deliverDate" label="退货日期" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createTime" label="申请日期" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="申请人" width="140" sortable="custom" />

                <el-table-column prop="reasonRejection" label="驳回理由" min-width="300" />
                <el-table-column prop="approvalCompletionDate" label="审批完成日期" width="180"></el-table-column>
                <el-table-column prop="exchangeGoodsFlag" label="换货标识" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.exchangeGoodsFlag">
                      换货
                    </div>
                    <div v-else>
                      退货
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="deliveryStatus" label="退货状态" width="120" sortable="custom"  align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.deliveryStatus == 'not_returned'">
                      <el-tag type="primary">未完成</el-tag>
                    </div>
                    <div v-else-if="scope.row.deliveryStatus == 'returned'">
                      <el-tag type="success">已完成</el-tag>
                    </div>
                    <div v-else-if="scope.row.deliveryStatus == 'canceled'">
                      <el-tag type="danger">已取消</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="inspectionStatus" label="检验状态" width="120" sortable="custom"  align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.inspectionStatus == 'unInspect'">
                      <el-tag type="primary">待检验</el-tag>
                    </div>
                    <div v-else-if="scope.row.inspectionStatus == 'inspected'">
                      <el-tag type="success">已检验</el-tag>
                    </div>
                    <div v-else-if="scope.row.inspectionStatus == 'inspecting'">
                      <el-tag type="warning">检验中</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120"  align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                    <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" fixed="right" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag type="warning">审批中</el-tag></div>
                    <div v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag type="success">审批通过</el-tag></div>
                    <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag type="danger">审批拒绝</el-tag></div>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="handleDel(scope.row.id)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                          查看详情
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="addSupplier(scope.row.id, 'copy')">
                          复制通知单
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
            </div>
          </div>  
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20" v-if="activeName === 'orderList'">

        <el-form ref="diaForm" :model="orderForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="退货单号">
              <el-input v-model="orderForm.orderNo" placeholder="请输入退货单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="orderForm.partnerCode" placeholder="请输入客户编码" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="orderForm.partnerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退货日期">
              <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人">
              <el-input v-model="orderForm.createByName" placeholder="请输入申请人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="换货标识">
              <el-select v-model="orderForm.exchangeGoodsFlag" placeholder="请选择换货标识" filterable clearable>
                <el-option v-for="(item, index) in exchangeList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
              <el-form-item label="发货方式">
                <el-select v-model="orderForm.delivery" placeholder="请选择发货方式" filterable clearable>
                  <el-option v-for="(item, index) in departMentList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          <!-- <el-col :span="12">
              <el-form-item label="发货人">
                <el-input v-model="orderForm.shipperName" placeholder="请输入发货人" clearable />
              </el-form-item>
            </el-col> -->
          <!-- <el-col :span="12">
              <el-form-item label="发货状态">
                <el-select v-model="orderForm.deliveryStatus" placeholder="请选择发货状态" filterable clearable>
                  <el-option v-for="(item, index) in shipmentsStateList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="orderForm.documentStatus" placeholder="请选择单据状态" filterable clearable>
                <el-option v-for="(item, index) in documentStateList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
              <el-form-item label="申请人">
                <el-input v-model="orderForm.createByName" placeholder="请输入申请人" clearable />
              </el-form-item>
            </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="orderForm.approvalStatus" placeholder="请选择审批状态" filterable clearable>
                <el-option v-for="(item, index) in approvalStateList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="检验状态">
              <el-select v-model="orderForm.inspectionStatus" placeholder="请选择检验状态" filterable clearable>
                <el-option v-for="(item, index) in orderStateList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
              <el-form-item label="是否全部收货">
                <el-select v-model="orderForm.fullReceiptFlag" placeholder="请选择是否全部收货" filterable clearable>
                  <el-option v-for="(item, index) in isfullReceiptFlag" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发货完成日期">
                <el-date-picker v-model="deliveryDateArr" type="datetimerange" format="yyyy-MM-dd hh:mm:ss"
                  value-format="yyyy-MM-dd hh:mm:ss" style="width: 100%;" start-placeholder="开始时间" end-placeholder="结束时间"
                  clearable>
                </el-date-picker>
              </el-form-item>
            </el-col> -->
          <el-col :span="12">
            <el-form-item label="申请时间">
              <el-date-picker v-model="createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" style="width: 100%;" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row> >
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import { getQuotationdatasendlist, deleteQuotationsendlist, getQuotationdatasenddatalist, Cancelshipmentlist, Cancelshipmentlinelist } from '@/api/salesManagement'
import Form from './Form'
export default {
  components: { Form },
  data() {
    return {
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      deliveryDatefahuo: [],
      visible: false,
      detailVisible: false,
      treeData: [],
      tableData: [],
      detailTableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      activeName: "orderList",
      salespersonList: [],
      detailFlag: false,
      exchangeList: [
        { label: "退货", value: false },
        { label: "换货", value: true }
      ],
      shipmentsStateList: [
        { label: "待发货", value: "undelivered" },
        { label: "已发货", value: "delivered" }
      ],
      orderStateList: [
        { label: "待检验", value: "unInspect" },
        { label: "已检验", value: "inspected" },
      ],
      isfullReceiptFlag: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: " 审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],

      departMentList: [
        { lebel: "送货", value: "deliver_goods" },
        { lebel: "自提", value: "self_pickup" },
        { lebel: "快递", value: "express_delivery" },
        { lebel: "货运", value: "freight_transport" },
        { lebel: "到付", value: "collect_payment" },
      ],
      paymentMethodList: [],
      paymentCycleList: [],
      orderForm: {},
      initOrderForm: {
        notifyType: 'sale',
        returnDeliveryType: 'back',
        orderNo: "",
        partnerCode: "",
        partnerName: "",
        rdsDate: '',
        rdeDate: '',
        inspectionStatus: '',
        documentStatus: '',
        createByName: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      
      detailTotal: 0,
      salespersonList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      createTimeArr: [],
      // deliveryDateArr: [],
      orderDateArr: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      btnLoading: false,
      selectArr: []
    }
  },
  created() {
    this.orderForm = JSON.parse(JSON.stringify(this.initOrderForm)) 
    this.search()
  },
  watch: {
    activeName() {
      this.search()
    }
  },
  methods: {
    columnSetFun(){ 
      this.$refs.dataTable.showDrawer()
    },
   
    //禁用复选框
    checkSelectable(row) {
      if (row.documentStatus == 'submit' && row.deliveryStatus == 'not_returned' && row.receivedQuantity == 0 && row.inspectionStatus !== 'inspected') return true
      return false
    },
    // 选中得数据
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //批量取消退货
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error("请先选择数据")
      this.$confirm('您确认取消选中的退货通知单吗？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        let a = this.selectArr.map(item => {
          return item.id
        })
        Cancelshipmentlist(a).then(res => {
          this.$message.success('取消成功')
          this.initData()
        })
      }).catch(() => { })
    },
    handleClick(e) {
      this.activeName = e.name
    },
    //   sortChange({ prop, order }) {
    //   const newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
    //   this.listQuery.orderItems[0].asc = order !== 'descending'
    //   this.listQuery.orderItems[0].column = order === null ? "" : newProp
    //   this.initData()
    // },
    //排序
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' || prop === 'partnerName' || prop === 'createByName' || prop === 'productCode' || prop === 'productName' || prop === 'productDrawingNo') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      } 
        this.orderForm.orderItems[0].asc = order !== "descending"
     
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.search()
      }
    },
    initData() {
      this.listLoading = true 
        getQuotationdatasendlist(this.orderForm).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
     
    },
    search() { 
        if (this.orderDateArr && this.orderDateArr.length > 0) {
          this.orderForm.rdsDate = this.orderDateArr[0]
          this.orderForm.rdeDate = this.orderDateArr[1]
        } else {
          this.orderForm.rdsDate = ''
          this.orderForm.rdeDate = ''
        }
        if (this.createTimeArr && this.createTimeArr.length > 0) {
          this.orderForm.startTime = this.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.orderForm.endTime = this.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.orderForm.startTime = ''
          this.orderForm.endTime = ''
        }
        Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.orderForm[key]
          this.orderForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.orderForm.pageNum = 1 // 重置页码
   
      this.initData()
    },
    reset() { 
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.createTimeArr = []
        this.orderDateArr = []
        this.orderForm = JSON.parse(JSON.stringify(this.initOrderForm))
       
      this.search()
    },
    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        console.log(id);
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
        deleteQuotationsendlist(id).then(res => {
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
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
:v-deep .el-table__body-wrapper {
  height: auto !important;
}
</style>
  
  