<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="pageTitle" />
      </div>
      <div class="main">
        <JNPF-table ref="popupTitleData" v-loading="listLoading" border :data="popupList">
          <el-table-column prop="productDrawingNo" label="品名规格" min-width="320" />
          <el-table-column prop="productCode" label="产品编码" width="130"></el-table-column>
          <el-table-column prop="mainUnit" label="单位" width="80" />
          <el-table-column prop="qty" label="数量" />
          <el-table-column prop="lossRate" label="损耗率(%)" />
          <el-table-column prop="fixedLoss" label="固定损耗" />
        </JNPF-table>
      </div>
    </div>
  </transition>
</template>

<script>

import {
  BOMLineList,
  getDemandList
} from "@/api/calculationList/MRPOperation";
export default {
  data() {
    return {
      pageTitle: "",
      popupList: [],
      listLoading: false,
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {

  },
  methods: {

    init(id, type) {
      if (type == "product") {
        this.pageTitle = "生产需求——查看子件"
      }

      if (type == 'out') {
        this.pageTitle = "外协需求——查看子件"
      }
      if (type == 'assemble') {
        this.pageTitle = "组装需求——查看子件"
      }
      this.listLoading = true
      BOMLineList(id).then(res => {
        this.popupList = res.data
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false

      })
    },
    goBack() {
      this.$emit('close')
    },

  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

.el-button--small {
  // padding: 1;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;

}

::v-deep .el-table__body-wrapper {
  height: auto !important;
}
</style>