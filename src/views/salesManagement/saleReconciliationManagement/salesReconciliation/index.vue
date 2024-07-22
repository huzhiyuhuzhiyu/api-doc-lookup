<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.ordersNo" placeholder="请输入销售订单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.partnerName" placeholder="请输入客户名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
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
          <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成销售对账</el-button>
          <el-button v-has="'btn_export'" :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
            icon="el-icon-download" @click="exportForm">导出</el-button>
          <div class="JNPF-common-head-right">
            
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table v-loading="listLoading" @selection-change="handeleProductInfoData" hasC highlight-current-row
          :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column :setColumnDisplayList="columnList"
          :checkSelectable="checkSelectable">
          <el-table-column prop="orderNo" label="出入库单号" min-width="240"  sortable="custom"/>
          <el-table-column prop="partnerName" label="客户名称" min-width="180"  sortable="custom"/>
          <el-table-column prop="partnerCode" label="客户编码" min-width="180"  sortable="custom"/>
          <el-table-column prop="productCode" label="产品编码" min-width="180"  sortable="custom"/>
          <el-table-column prop="productName" label="产品名称" min-width="180"  sortable="custom"/>
          <el-table-column prop="productDrawingNo" label="规格型号" min-width="180"  sortable="custom"/>
          <el-table-column prop="returnDeliveryType" label="发/退货类型" min-width="180" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.returnDeliveryType == 'delivery'">发货</div>
              <div v-else-if="scope.row.returnDeliveryType == 'back'">退货</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" label="单位" min-width="180" />
          <el-table-column prop="num" label="出入库数量" min-width="180" />
          <el-table-column prop="price" label="单价(含税)" min-width="140" />
          <el-table-column prop="taxRate" label="税率(%)" min-width="140" />
          <el-table-column prop="excludingTaxAmount" label="金额" min-width="140">
            <template slot-scope="scope">
              <div v-if="scope.row.returnDeliveryType == 'delivery'" style="color: #67C23A">+{{ scope.row.excludingTaxAmount }}</div>
              <div v-else-if="scope.row.returnDeliveryType == 'back'" style="color:red">-{{ scope.row.excludingTaxAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180"  sortable="custom"/>
          <el-table-column prop="createByName" label="创建人" min-width="180"  sortable="custom"/>


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
              <el-input v-model="listQuery.ordersNo" placeholder="请输入订单号" clearable
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
            <el-form-item label="客户名称">
              <el-input v-model="listQuery.partnerName" placeholder="请输入客户名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="发/退货类型">
              <el-select v-model="listQuery.returnDeliveryType" placeholder="请选择发/退货类型" filterable clearable>
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

 <!-- 高级查询 -->
 <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>
  
<script>
import { getsalefinAccountList } from '@/api/ReconciliaRePayments/index' 
import SuperQuery from '@/components/SuperQuery/index.vue'

import ExportForm from '@/components/no_mount/ExportBox/index'
import JNPFForm from './Form'
import moment from 'moment'
export default {
  name: 'salefinAccount',
  components: { JNPFForm,ExportForm,SuperQuery },
  data() {
    return {
      columnList:["partnerCode","productCode","productName","createByName"],
          
      superQueryVisible: false,
      title: "更多查询",
      exportFormVisible: false,
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
          column: "create_time"
        }],
        createByName: "",
        endTime: "",
        keyword: "",
        ordersNo: "",
        pageNum: 1,
        pageSize: 20,
        partnerCode: "",
        partnerName: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        rdeDate: "",
        startTime: "",
        returnDeliveryType: "",
        rdsDate: "",
      },
      receiptReturnTypeList: [
        {
          label: '发货',
          value: 'delivery'
        },
        {
          label: '退货',
          value: 'back'
        },
      ],
      createRequirementDate:[],
      deliveryDate:[],
      selectData: [],                    // 选中的数据 带到form页
      total: 0,
      formVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "出入库单号",
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: "规格型号",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'num',
          label: "出入库数量",
          type: 'input'
        },
        {
          prop: 'price',
          label: "单价(含税)",
          type: 'input'
        },
        {
          prop: 'taxRate',
          label: "税率(%)",
          type: 'input'
        },
        {
          prop: 'excludingTaxAmount',
          label: "金额",
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
        }
       
       
      ],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef);
        let columnList = domRef.columnList.filter(item => !!item.label && !!item.prop)
        columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
        this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
      } else {
        this.$message({
          message: "暂无数据导出",
          type: "error",
          duration: 1500,
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableDataList, 'tableForm')


    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1201',
          exportName: '销售订单对账',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
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
        this.listQuery.startTime = this.createRequirementDate[0] + " 00:00:00"
        this.listQuery.endTime = this.createRequirementDate[1] + " 23:59:59"
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      if (this.deliveryDate && this.deliveryDate.length > 0) {
        this.listQuery.rdsDate = this.deliveryDate[0]
        this.listQuery.rdeDate = this.deliveryDate[1]
      } else {
        this.listQuery.rdsDate = ''
        this.listQuery.rdeDate = ''
      }
      getsalefinAccountList(this.listQuery).then(res => {
        console.log(res, '销售发/退货列表');
        res.data.records.forEach(item => {
          // if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
          //   item.disabled = true
          // } else {
          //   item.disabled = fals
          // }
          item.excludingTaxAmount = this.jnpf.numberFormat(item.actualQuantity * item.price)
        });

        this.tableDataList = res.data.records
        console.log("this.tableDataList ",this.tableDataList );
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
          column: "create_time"
        }],
        createByName: "",
        endTime: "",
        keyword: "",
        ordersNo: "",
        pageNum: 1,
        pageSize: 20,
        partnerCode: "",
        partnerName: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        rdeDate: "",
        startTime: "",
        returnDeliveryType: "",
        rdsDate: "",
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
          message: "请选择你要生成的销售对账单",
          type: "error",
          duration: 1500,
        })
      } else {
        // console.log(this.$refs);
        console.log(this.selectData, 'this.selectData')
        let firstCode = this.selectData[0].partnerCode
        let allCode = this.selectData.every(obj => obj.partnerCode === firstCode)
        if (allCode) {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.procureForm.init(this.selectData)
          })
        } else {
          this.$message.error('请选择客户相同的通知单!')
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
  