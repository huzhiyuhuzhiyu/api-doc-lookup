<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.purchaseOrderNo" placeholder="请输入订单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-date-picker v-model="deliveryDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="请选择收/退货开始日期" end-placeholder="请选择收/退货结束日期">
              </el-date-picker>
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
        <div class="JNPF-common-head">
          <!-- <topOpts @add="addSupplier('', 'add')"></topOpts> -->
          <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成采购对账</el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table v-loading="listLoading" @selection-change="handeleProductInfoData" hasC highlight-current-row
          :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
          :checkSelectable="checkSelectable">

          <el-table-column prop="purchaseOrderNo" label="订单号" min-width="240"  />
          <el-table-column prop="orderNo" label="通知单号" min-width="240"  />
          <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180"  />
          <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180"  />
          <el-table-column prop="productCode" label="产品编码" min-width="180"  />
          <el-table-column prop="productName" label="产品名称" min-width="180"  />
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="180"  />
          <el-table-column prop="spec" label="规格型号" min-width="180"  />
          <el-table-column prop="receiptReturnType" label="收/退货类型" min-width="180" >
            <template slot-scope="scope">
              <div v-if="scope.row.receiptReturnType == 'receipt'">收货</div>
              <div v-else-if="scope.row.receiptReturnType == 'back'">退货</div>
            </template>
          </el-table-column>

          <el-table-column prop="purchaseQuantity" label="采购数量" min-width="180" />
          <el-table-column prop="receivedQuantity" label="计划收/退数量" min-width="180" />
          <el-table-column prop="receiptQuantity" label="实际收/退数量" min-width="180" />
          <el-table-column prop="price" label="单价" min-width="140" />
          <el-table-column prop="taxRate" label="税率%" min-width="140" />
          <el-table-column prop="excludingTaxAmount" label="金额" min-width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.receiptReturnType == 'receipt'" style="color:#67C23A">+{{ scope.row.excludingTaxAmount }}</div>
              <div v-else-if="scope.row.receiptReturnType == 'back'" style="color:red">-{{ scope.row.excludingTaxAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="deliverDate" label="收/退货日期" min-width="180" />
          <el-table-column prop="mainUnit" label="单位" min-width="180" />
          <el-table-column prop="realCreateTime" label="创建时间" min-width="180"  />
          <el-table-column prop="realCreateBy" label="创建人" min-width="180"  />


          <!-- <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="type === 'look'" @click="addOrUpdateHandle(scope.row.id, 'edit')">生成采购订单</el-button>
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
          </el-table-column> -->

        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="订单号">
              <el-input v-model="listQuery.purchaseOrderNo" placeholder="请输入订单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通知单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入通知单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="listQuery.cooperativePartnerName" placeholder="请输入供应商名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="收/退货类型">
              <el-select v-model="listQuery.receiptReturnType" placeholder="请选择收/退货类型" filterable clearable>
                <el-option v-for="(item, index) in receiptReturnTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="收/退货日期">
              <el-date-picker v-model="deliveryDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="请选择收/退货开始日期" end-placeholder="请选择收/退货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
  
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
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
import { getfinAccountGoodsList } from '@/api/ReconciliaRePayments/index'

import JNPFForm from './Form'
import moment from 'moment'
export default {
  name: 'fixedPointPricing',
  components: { JNPFForm },
  data() {
    return {
      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      formVisible: false,
      listLoading: false,
      listQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "realCreateTime"
        }],
        notificationType:'procure',
        cooperativePartnerName: "",
        createByName: "",
        deliverDate: "",
        deliverDateEnd: "",
        deliverDateStart: "",
        endTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
        purchaseOrderNo: "",
        receiptReturnType: "",
        startTime: ""
      },
      receiptReturnTypeList:[
      {
          label: '收货',
          value: 'receipt'
        },
      {
          label: '退货',
          value: 'back'
        },
      ],
      createRequirementDate: [],         // 创建需求日期区间
      deliveryDate: [],                  // 交货日期区间
      selectData: [],                    // 选中的数据 带到form页
      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    checkSelectable(row) {
      return !row.disabled
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      console.log(val);
      this.selectData = val
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      if (newProp === 'product_code') {
        newProp = 'productCode'
      }
      if (newProp === 'product_name') {
        newProp = 'productName'
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


    initData() {
      this.listLoading = true
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listQuery.createStartTime = this.createRequirementDate[0] + " 00:00:00"
        this.listQuery.createEndTime = this.createRequirementDate[1] + " 23:59:59"
      } else {
        this.listQuery.createStartTime = ''
        this.listQuery.createEndTime = ''
      }
      if (this.deliveryDate && this.deliveryDate.length > 0) {
        this.listQuery.deliverDateStart = this.deliveryDate[0]
        this.listQuery.deliverDateEnd = this.deliveryDate[1]
      } else {
        this.listQuery.deliverDateStart = ''
        this.listQuery.deliverDateEnd = ''
      }
      getfinAccountGoodsList(this.listQuery).then(res => {
        console.log(res, '采购收/退货列表');
        res.data.records.forEach(item => {
          // if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
          //   item.disabled = true
          // } else {
          //   item.disabled = fals
          // }
          item.excludingTaxAmount = this.jnpf.numberFormat(item.receiptQuantity * item.price)
        });
        
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()

      this.listQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "realCreateTime"
        }],
        cooperativePartnerName: "",
        notificationType:'procure',
        createByName: "",
        deliverDate: "",
        deliverDateEnd: "",
        deliverDateStart: "",
        endTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
        purchaseOrderNo: "",
        receiptReturnType: "",
        startTime: ""
      },
        this.createRequirementDate = []
      this.deliveryDate = []
      this.search()
    },
    // addSupplier(id, type) {
    //   this.formVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.JNPFForm.init(id, type)
    //   })
    // },
    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle() {
      if (this.selectData.length === 0) {
        this.$message({
          message: "请选择你要生成的采购对账单",
          type: "error",
          duration: 1500,
        })
      } else {
        // console.log(this.$refs);
        console.log(this.selectData, 'this.selectData')
        let  firstCode = this.selectData[0].cooperativePartnerCode
       let allCode =  this.selectData.every(obj => obj.cooperativePartnerCode === firstCode)
       if(allCode){
         this.formVisible = true
         this.$nextTick(() => {
           this.$refs.procureForm.init(this.selectData)
         })
       }else{
          this.$message.error('请选择供应商相同的通知单!') 
       }
      
      }

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
  