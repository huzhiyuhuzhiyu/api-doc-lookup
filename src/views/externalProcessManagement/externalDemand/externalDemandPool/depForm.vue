<template>
  <el-dialog id="look" title="查看发料清单" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px" @close="handleClose">
    <div class="JNPF-common-layout">

      <div class="JNPF-common-layout-main JNPF-flex-main">
        <!-- <div class="JNPF-common-head">
          <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成外协订单</el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div> -->
        <JNPF-table v-loading="listLoading"  highlight-current-row :fixedNO="true" ref="tableForm"
          :data="tableDataList" @sort-change="sortChange" >
          <el-table-column prop="productCode" label="产品编码" min-width="160" show-overflow-tooltip/>
          <el-table-column prop="productName" label="产品名称" min-width="160" show-overflow-tooltip/>
          <el-table-column prop="demandQuantity" label="计划发料数量" min-width="140" />
          <el-table-column prop="undeliveredQuantity" label="待出库数量" min-width="100" />

          <el-table-column prop="issuedQuantity" label="已出库数量" min-width="100" />
          <el-table-column prop="mainUnit" label="单位(主)" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="qty" label="基本数量" min-width="100" />
        </JNPF-table>

      </div>

    </div>
  </el-dialog>
</template>

<script>
import { purProcurementDemandPoolexternal } from '@/api/purchasingManagement/purchaseInquirySheet'


export default {
  data() {
    return {
      total: 0,
      visible: false,
      background: true,//分页器背景颜色
      listLoading: false,
      tableDataList: [],
      listQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createByName: "",
        createEndTime: "",
        createRequirementDate: "",      //创建日期
        createStartTime: "",
        deliveryDate: "",               //交期
        deliveryEndTime: "",
        deliveryStartTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 20,
        poolType: "external",           //外协池类型  采购 procure、外协 external,可用值:external,procure
        processCode: "",                //工序编码
        processName: "",                //工序名称
        productCode: "",                //产品编码
        productName: "",                //产品名称
        source: "",                     //来源
        sourceOrderNo: "",              //来源单号
        startTime: "",                  //创建开始时间
      },

    }
  },
  created() {
  },
  methods: {
    handleClose() {
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      if (newProp === 'product_code') {
        newProp = 'productCode'
      }
      if (newProp === 'product_name') {
        newProp = 'productName'
      }
      if (newProp === 'process_name') {
        newProp = 'processName'
      }
      if (newProp === 'process_code') {
        newProp = 'processCode'
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData(id) {
      this.visible = true
      this.listLoading = true
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listQuery.createStartTime = this.createRequirementDate[0] + " 00:00:00"
        this.listQuery.createEndTime = this.createRequirementDate[1] + " 23:59:59"
      } else {
        this.listQuery.createStartTime = ''
        this.listQuery.createEndTime = ''
      }
      if (this.deliveryDate && this.deliveryDate.length > 0) {
        this.listQuery.deliveryStartTime = this.deliveryDate[0] + " 00:00:00"
        this.listQuery.deliveryEndTime = this.deliveryDate[1] + " 23:59:59"
      } else {
        this.listQuery.deliveryStartTime = ''
        this.listQuery.deliveryEndTime = ''
      }
      purProcurementDemandPoolexternal(id).then(res => {
        console.log(res, '发料清单列表');
        this.tableDataList = res.data
        // this.total = res.data.total
        this.listLoading = false
        // this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },

  }
}
</script>
<style scoped>
::v-deep #table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}
.JNPF-common-layout{
  height:600px;
}
.JNPF-common-layout-main.JNPF-flex-main{
  width:100%;
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
::v-deep  .el-dialog__body {
  margin-top: 10px !important;
}


</style>