<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.orderNo" placeholder="请输入客户名称" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.customerProductNo" placeholder="请输入客户料号" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="5">
            <el-form-item  >
              <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
              </el-date-picker>
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
            <div>
              <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('', 'add')">
                新建
              </el-button>
              <el-button type="primary" icon="el-icon-plus" @click.native="Cancelshipment()" :loading="qxbtnLoading">
                批量取消发货
              </el-button>
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click.native="mergeorderNo()"
                :loading="hbbtnLoading">
                合并
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

          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" :setColumnDisplayList="columnList"
            @sort-change="sortChange" custom-column :checkSelectable="checkSelectable"
            @selection-change="handleSelectionChange" hasC>
            <el-table-column prop="orderNo" label="发货单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerCode" label="客户编码" width="200" sortable="custom" />
            <el-table-column prop="partnerName" label="客户名称" width="200" sortable="custom" />
            <el-table-column prop="deliverDate" label="发货日期" width="180" sortable="custom"></el-table-column>
            <el-table-column prop="recipient" label="收件人" width="140" sortable="custom" />
            <el-table-column prop="phone" label="收件人电话" width="160" />
            <el-table-column prop="delivery" label="发货方式" width="160">
              <template slot-scope="scope">
                <div v-if="scope.row.delivery == 'deliver_goods'">
                  <span>送货</span>
                </div>
                <div v-else-if="scope.row.delivery == 'self_pickup'">
                  <span>自提</span>
                </div>
                <div v-else-if="scope.row.delivery == 'express_delivery'">
                  <span>快递</span>
                </div>
                <div v-else-if="scope.row.delivery == 'freight_transport'">
                  <span>货运</span>
                </div>
                <div v-else-if="scope.row.delivery == 'collect_payment'">
                  <span>到付</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="region.countryName" label="国家" width="160" />
            <el-table-column prop="region.provinceName" label="省" width="160" />
            <el-table-column prop="region.cityName" label="市" width="160" />
            <el-table-column prop="region.areaName" label="区" width="160" />
            <el-table-column prop="address" label="地址" min-width="300" />
            <el-table-column prop="exchangeGoodsFlag" label="发货标识" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.exchangeGoodsFlag">
                  换货发货
                </div>
                <div v-else>
                  正常发货
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="deliveryStatus" label="发货状态" width="120" sortable="custom" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.deliveryStatus == 'undelivered'">
                  <el-tag type="primary">未完成</el-tag>
                </div>
                <div v-else-if="scope.row.deliveryStatus == 'delivered'">
                  <el-tag type="success">已完成</el-tag>
                </div>
                <div v-else-if="scope.row.deliveryStatus == 'canceled'">
                  <el-tag type="danger">已取消</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" width="140" sortable="custom" />
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
                    <!-- <el-dropdown-item @click.native="confirmreceipt(scope.row.id, 'qrsh')"
                          v-if="scope.row.deliveryStatus == 'delivered' && scope.row.approvalStatus == 'ok' && scope.row.fullReceiptFlag == 0">
                          确认收货
                        </el-dropdown-item> -->
                    <el-dropdown-item @click.native="splitorderNo(scope.row)"
                      :disabled="scope.row.splitNum == '1' || scope.row.deliveryStatus !== 'undelivered' || scope.row.documentStatus == 'draft'">
                      拆分
                    </el-dropdown-item>
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
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
 
  </div>
</template>

<script>
import { getQuotationdatasendlist, deleteQuotationsendlist, getQuotationdatasenddatalist, Cancelshipmentlist, Cancelshipmentlinelist, mergelist, splitlist } from '@/api/salesManagement'
import { UserListAll, } from '@/api/permission/user'
import Form from './Form'
export default {
  name: 'foreigntradenotice',
  components: { Form },
  data() {
    return {
      columnList:["partnerCode","region.countryName","region.provinceName","region.cityName","region.areaName","address","createByName"],
      qxbtnLoading: false,
      hbbtnLoading: false,
      btnLoading: false,
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      deliveryDatefahuo: [],
      customList: [], // 列表中显示的自定义属性
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
        { label: "正常发货", value: false },
        { label: "换货发货", value: true }
      ],
      shipmentsStateList: [
        { label: "未完成", value: "undelivered" },
        { label: "已完成", value: "delivered" }
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
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" },
      ],
      paymentMethodList: [],
      paymentCycleList: [],
      orderForm: {},
      orderFormlist: {
        orderCategory: 'metalworking',
        notifyType: 'sale',
        returnDeliveryType: 'delivery',
        orderNo: "",
        partnerCode: "",
        partnerName: "",
        rdsDate: '',
        rdeDate: '',
        recipient: '',
        delivery: '',
        shipperName: '',
        deliveryStatus: '',
        documentStatus: '',
        createByName: '',
        approvalStatus: '',
        orderState: '',
        fullReceiptFlag: '',
        dfsTime: '',
        dfeDate: '',
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
      linesQuery: {},

      detailTotal: 0,
      salespersonList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      createTimeArr: [],
      deliveryDateArr: [],
      orderDateArr: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      selectArr: []
    }
  },
  created() {
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search()
    // this.getAttributeline()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  watch: {
    activeName() {
      this.search()
    }
  },
  methods: {
    //明细列表取消发货
    Cancelshipmentline(id) {
      this.$confirm('您确认取消选中的发货通知单吗（已备货商品需手动处理）？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        Cancelshipmentlinelist(id).then(res => {
          this.$message.success('取消成功')
          this.initData()
        })
      }).catch(() => { })
    },
    //禁用复选框
    checkSelectable(row) {
      if (row.deliveryStatus !== 'undelivered' || row.documentStatus == 'draft') return false
      return true
    },
    // 选中得数据
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //批量取消发货
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error("请先选择数据")
      let hasItemList = []
      this.selectArr.map(i => {
        if (i.outboundQuantity > 0) hasItemList.push(i.orderNo)
      })
      if (hasItemList.length) return this.$message.error(`已出库的订单：${hasItemList.join('、')}不能取消发货`)
      this.$confirm('您确认取消选中的发货通知单吗（已备货商品需手动处理）？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        let a = this.selectArr.map(item => {
          return item.id
        })
        this.qxbtnLoading = true
        Cancelshipmentlist(a).then(res => {
          this.qxbtnLoading = false
          this.$message.success('取消成功')
          this.initData()
        }).catch(() => {
          this.qxbtnLoading = false
        })
      }).catch(() => { })
    },
    //合并订单
    mergeorderNo() {
      if (this.selectArr.length < 2) return this.$message.error("请先选择多条订单数据")
      let hasItemList = []
      this.selectArr.map(i => {
        if (i.stockStatus == 'finished') hasItemList.push(i.orderNo)
      })
      if (hasItemList.length) return this.$message.error(`已经备货的订单：${hasItemList.join('、')}不能合并`)
      if (this.selectArr.some(item => item.partnerCode !== this.selectArr[0].partnerCode)) return this.$message.error("所选订单客户不同")
      this.$confirm('确定合并所选订单', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        let a = this.selectArr.map(item => {
          return item.id
        })
        this.hbbtnLoading = true
        mergelist(a).then(res => {
          this.hbbtnLoading = false
          this.$message.success('合并成功')
          this.initData()
        }).catch(() => {
          this.hbbtnLoading = false
        })
      }).catch(() => { })
    },
    //拆分订单
    splitorderNo(row) {
      if (row.stockStatus == 'finished') return this.$message.error(`该订单已经备货不能拆分`)
      this.$confirm('确定拆分所选订单', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        splitlist(row.id).then(res => {
          this.$message.success('拆分成功')
          this.initData()
        })
      }).catch(() => { })
    },
    handleClick(e) {
      this.activeName = e.name
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName') {
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
      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.orderForm.dfsTime = this.deliveryDateArr[0].replace(/ 0(?!0)/g, " ")
        this.orderForm.dfeDate = this.deliveryDateArr[1].replace(/ 0(?!0)/g, " ")
      } else {
        this.orderForm.dfsTime = ''
        this.orderForm.dfeDate = ''
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
      this.deliveryDateArr = []
      this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))

      this.search()
    },
    addSupplier(id, btntype) {
      console.log(id, btntype);
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
    },
    //确认收货
    confirmreceipt(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
