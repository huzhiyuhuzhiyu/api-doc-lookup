<template>
  <div class="tableList" id="printContent" style="display:none">
    <!-- <el-table v-loading="listLoading" :data="list" id="myTable" ref="myTable" :hasNO="false" class="tyTable" :cell-style="{ borderColor: '#202123' }" :header-cell-style="{ borderColor: '#202123' }">
      <template v-for="(item, index) in tableList">

        <el-table-column align="left" :key="item.prop" :prop="item.prop" :label="item.label" :min-width="item.minWidth">
        </el-table-column>
      </template>
    </el-table> -->
    <table border="1" cellspacing="0" cellpadding="0" width="100%">
          <thead>
            <tr style="height:30px;box-sizing: border-box;">
              <th style="height:30px;min-width:225px;padding:10px">产品图号</th>
              <th style="height:30px;min-width:150px;padding:10px">工作令号</th>
              <th style="height:30px;min-width:60px;padding:10px">项次</th>
              <th style="height:30px;min-width:170px;padding:10px">客户物料号</th>
              <th style="height:30px;min-width:60px;padding:10px">数量</th>
              <th style="height:30px;min-width:130px;padding:10px">压力</th>
              <th style="height:30px;min-width:130px;padding:10px">要求</th>
              <th style="height:30px;min-width:130px;padding:10px">备注1</th>
              <th style="height:30px;min-width:130px;padding:10px">备注2</th>
              <th style="height:30px;min-width:130px;padding:10px">订单主表备注</th>
            </tr>
          </thead>
          <tbody style="page-break-after: always;padding: 30px;">
            <tr v-for="(item,index) in list" :key="index" style="height:30px;">
              <td style="padding:10px;text-align:center">{{item.productDrawingNo}}</td>
              <td style="padding:10px;text-align:center">{{item.workOrderNo}}</td>
              <td style="padding:10px;text-align:center">{{item.itemNumber}}</td>
              <td style="padding:10px;text-align:center">{{item.customerProductNo}}</td>
              <td style="padding:10px;text-align:center">{{item.num}}</td>
              <td style="padding:10px;text-align:center">{{item.pressure}}</td>
              <td style="padding:10px;text-align:center">{{item.ask}}</td>
              <td style="padding:10px;text-align:center">{{item.ordersLineRemark}}</td>
              <td style="padding:10px;text-align:center">{{item.ordersLineRemark2}}</td>
              <td style="padding:10px;text-align:center">{{item.ordersRemark}}</td>
            </tr>
          </tbody>
        </table>
  </div>
</template>

<script>
export default {
  name: 'printTable',
  data() {
    return {
      list: this.value,
      listLoading: false
    }
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    tableList: {
      type: Array,
      required: true
    },
    isShow: {
      type: Boolean,
      required: false
    },
  },
  watch: {
    value(newValue) {
      this.list = newValue;
    }
  },
}

</script>
<style scoped lang="scss">
.tableList {
  flex: 1 0 0;
  height: 100%;
  // overflow: hidden;
  // width: 100%;
  // height: 100%;
  // transform: scale(0.68);
  border: none !important;
  display: none !important;
  // page-break-after: always;
}

//  size: landscape;//横向 portrait;//纵向

@media print {
  @page {
    // size: landscape !important;
    size: auto; 
    margin: 3mm;
  }

  body {
    height: auto !important;
    // margin: 3mm;
  }
  //   #printContent {
  //   width: 100%;
  //   transform: scale(0.68);
  //   zoom: 0.5;
  //   border: none !important;
  //   border: 1px solid #EBEEF5 !important;
  //   font-size: 3mm !important;

  //   overflow: hidden;
  //   page-break-after: always;
  // }

  .tyTable {
    width: 100%;
    border: none !important;
    border-top: 1px solid #202123 !important;
    font-size: 3mm !important;
    color:#202123!important;
    zoom: 0.87;
    border-collapse: collapse !important;
    table-layout: auto;

  }
}
</style>