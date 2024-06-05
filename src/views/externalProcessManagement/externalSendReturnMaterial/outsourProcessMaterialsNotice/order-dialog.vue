<template>
  <el-dialog title="选择外协订单" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="5">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="请输入外协订单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-input v-model="listQuery.cooperativePartnerCode" placeholder="请输入外协供应商编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入外协供应商名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="listQuery.shipmentStatus" placeholder="请选择发料状态">
                  <el-option v-for="(item, index) in deliveryList" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <!-- <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                  :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
                </el-date-picker>
              </el-form-item>
            </el-col> -->

            <el-col :span="5">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="searchAllProduct()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="resetAllProduct()">{{ $t('common.reset')
                }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="allorderData" @row-dblclick="seleceCustomerdd" @selection-change="seleceCustomerdd">
            <el-table-column prop="orderNo" label="外协订单号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="外协供应商编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cooperativePartnerName" label="外协供应商名称" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="orderType" label="订单类型">
              <template slot-scope="scope">
                <div v-if="scope.row.orderType == 'procure'">采购</div>
                <div v-if="scope.row.orderType == 'external'">外协</div>
                <div v-if="scope.row.orderType == 'external_process'">外协工序</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="deliveryDate" label="交货日期" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="seleceCustomerdd(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData2(listQuery.cooperativePartnerCode,dataTwo)" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { purchaseOrderList, detailpurchaseOrderList } from '@/api/purchasingAndOutsourcingOrders/index'
export default {
  data() {
    return {
      deliveryList:[
        {label:'发料未完成',value:'not_finish'},
        {label:'发料已完成',value:'finished'},
        {label:'全部',value:''}
      ],
      allProVisible: false,
      listLoading: false,
      allorderData: [],
      listQuery: {
        shipmentStatus:'not_finish',
        approvalStatus: "ok",             //审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: "",     //供应商编码
        cooperativePartnerName: "",     // 	供应商名称
        createByName: "",
        delivery: "",                   //发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        deliveryEndDate: "",            //交货结束日期
        deliveryStartDate: "",
        deliveryDate: '',
        endTime: "",
        orderNo: "",                    //订单号
        orderType: "external_process",                  //	订单类型 采购 procure、外协 external
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        // receivingStatus:'receiving',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      total: 0,
      dataTwo: [],
    }
  },
  methods: {
    initData2(code,data) {
      this.listLoading = true
      this.allProVisible = true
      // this.listQuery.cooperativePartnerCode = code
      this.dataTwo = data
      purchaseOrderList(this.listQuery).then(res => {
        if (Array.isArray(res.data)) {
          this.allorderData = res.data
        } else {
          this.allorderData = res.data.records
        }
        console.log("res", res);
        this.total = res.data.total
        this.$forceUpdate()
        this.listLoading = false
      })
    },
    //选择订单
    seleceCustomerdd(e) {
      console.log('订单信息', e);
      let orderArr = []
      orderArr.push({
        id: e.id,
        orderNo: e.orderNo,
        cooperativePartnerName: e.cooperativePartnerName,
        cooperativePartnerId: e.cooperativePartnerId,
        cooperativePartnerCode: e.cooperativePartnerCode
      })
      if (this.dataTwo.length) {
        this.$confirm('已选择过外协订单，是否切换订单，切换后更新产品信息!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '更换成功!'
          });
          this.allProVisible = false
          // this.btnLoading = false
          this.$emit('changeOrder', orderArr)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          this.allProVisible = true
          // this.btnLoading = false
          orderArr = []
          // this.$emit('changeOrder', this.dataTwo)

        })
      } else {
        this.allProVisible = false
        this.$emit('changeOrder', orderArr)
      }

    },
    searchAllProduct() {
      this.listQuery.pageNum = 1
      // if (this.orderDateArr && this.orderDateArr.length > 0) {
      //   this.listQuery.orderStartDate = this.orderDateArr[0]
      //   this.listQuery.orderEndDate = this.orderDateArr[1]
      // } else {
      //   this.listQuery.orderStartDate = ""
      //   this.listQuery.orderEndDate = ""
      // }
      this.initData2(this.listQuery.cooperativePartnerCode,this.dataTwo)
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      // this.orderDateArr = []
      this.listQuery = {
        shipmentStatus:'not_finish',
        approvalStatus: "ok",             //审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: '',     //供应商编码
        cooperativePartnerName: "",     // 	供应商名称
        createByName: "",
        delivery: "",                   //发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        deliveryEndDate: "",            //交货结束日期
        deliveryStartDate: "",
        deliveryDate: '',
        endTime: "",
        orderNo: "",                    //订单号
        orderType: "external_process",                  //	订单类型 采购 procure、外协 external
        // receivingStatus:'receiving',
        pageNum: 1,
        pageSize: 20,
        startTime: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
        this.searchAllProduct()
    },
  },
}
</script>
<style scoped>
::v-deep .el-dialog__body {
  padding: 0px  10px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}
::v-deep .el-table .el-table__cell.gutter{
  background-color: #f5f7fa !important;
}
</style>