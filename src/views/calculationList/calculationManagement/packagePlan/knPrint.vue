<template>
  <div class="tableList" id="printContent" style="display:none">
    <table border="1" cellspacing="0" cellpadding="0" width="100%">
      <thead>
        <!-- 一级表头 -->
        <tr style="height:30px;box-sizing: border-box;">
          <th style="height:30px;min-width:80px;padding:10px" colspan="1">ArtNr</th>
          <th style="height:30px;min-width:160px;padding:10px" colspan="5">{{ dataForm.contractNo }}</th>
          <th style="height:30px;min-width:160px;padding:10px" colspan="7" rowspan="2">{{ dataForm.ordersRemark }}</th>
        </tr>
        <!-- 二级表头 -->
        <tr style="height:30px;box-sizing: border-box;">
          <th colspan="1">Sats</th>
          <th colspan="5">1</th>
        </tr>
        <!-- 三级表头 -->
        <tr style="height:30px;box-sizing: border-box;">
          <th>ItemNo</th>
          <th colspan="5">Description</th>
          <th colspan="1">OP</th>
          <th colspan="1">Unit</th>
          <th colspan="1">Quantity</th>
          <th colspan="1">合同号</th>
          <th colspan="1">项次</th>
          <th colspan="1">组别</th>
          <th colspan="1">OP*</th>
        </tr>
      </thead>
      <tbody style="page-break-after: always;padding: 30px;">
        <tr v-for="(item, index) in list" :key="index" style="height:30px;">
          <td style="padding:10px;text-align:center;">{{ item.customerProductNo }}</td>
          <td style="padding:10px;text-align:center;min-width:160px;" colspan="5">{{ item.customerProductDrawingNo }}</td>
          <td style="padding:10px;text-align:center;min-width:60px;">{{ item.ask }}</td>
          <td style="padding:10px;text-align:center;min-width:60px;">{{ item.mainUnit }}</td>
          <td style="padding:10px;text-align:center;min-width:60px;">{{ item.num }}</td>
          <td style="padding:10px;text-align:center;min-width:100px;">{{ item.contractNo }}</td>
          <td style="padding:10px;text-align:center;min-width:60px;">{{ item.itemNumber }}</td>
          <td style="padding:10px;text-align:center;min-width:60px;">{{ item.vehicleGroup }}</td>
          <td style="padding:10px;text-align:center;min-width:60px;">{{ item.vehicleOp2 }}</td>
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
      listLoading: false,
      dataForm: this.dataValue,
    }
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    dataValue: {
      type: Object,
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
    },
    dataValue(newValue) {
      this.dataForm = newValue;
    },
  },
}

</script>
<style scoped lang="scss">
.tableList {
  flex: 1 0 0;
  height: 100%;
  border: none !important;
  display: none !important;
}



@media print {
  @page {
    // size: portrait !important; // 纵向
    size: auto; // 纵向
    margin: 3mm;
  }

  .tyTable {
    width: 100%;
    border: none !important;
    border-top: 1px solid #202123 !important;
    // border-right: 1px solid #202123 !important;
    color: #202123 !important;
    font-size: 3mm !important;
    zoom: 0.973;
    border-collapse: collapse !important;
    table-layout: auto;
  }

  .tyTable tr {
    border-bottom: 1px solid #202123 !important;
    border-top: 1px solid #202123 !important;
    border-right: 1px solid #202123 !important;
  }

  // .el-table td,
  // .el-table th.is-leaf,
  // .el-table--border,
  // .el-table--group {
  //   border-color: #202123!important;
  // }

  // .el-table--border::after,
  // .el-table--group::after,
  // .el-table::before {
  //   background-color: #202123!important;
  // }

  // .el-table-column {
  //   border: 1px solid #202123 !important;
  //   color: #202123 !important;
  // }

  // .el-table td.el-table__cell {
  //   border: 1px solid #202123 !important;
  // }

  // .el-table_4_column_49  is-center   .el-table__cell{
  //   border: none !important;
  // }
}

// #printContent {
//   width: 100%;
//   margin-top: 20px;
//   transform: scale(1);
//   zoom: 1;
// }

// #printContent table {
//   table-layout: auto !important;
// }

// #printContent .el-table__header-wrapper .el-table__header {
//   width: 100% !important;
// }

// #printContent .el-table__body-wrapper .el-table__body {
//   width: 100% !important;
// }

// #printContent table {
//   width: 100%;
//   border: 1px solid #000;
//   border-right: none;
//   border-bottom: none;
//   page-break-inside: avoid;
//   page-break-after: avoid;
//   page-break-before: avoid;
// }

// // ::v-deep .el-table>.el-table__header-wrapper>.el-table__header>thead>tr>th {
// //   font-size: 3.4mm !important;
// //   // text-align:center;
// // }

// ::v-deep .el-table>.el-table__body-wrapper>.el-table__body>tbody>tr>td.el-table__cell div {
//   transform: scale(0.8);
//   text-align: left;
// }

// ::v-deep .el-table_19_column_221  is-center   .el-table__cell {
//   border-bottom: none !important;
// }
::v-deep .el-table_4_column_49 is-center .el-table__cell {
  border: none !important;
}
</style>
