<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="pageTitle" />
      </div>
      <div class="main">
        <JNPF-table ref="popupTitleData" v-loading="listLoading" border :data="popupList" show-summary
          :summary-method="getSummaries" >
          <el-table-column prop="productCode" label="来源产品编码" min-width="130"></el-table-column>
          <el-table-column prop="productName" label="来源产品名称" min-width="120" />
          <el-table-column prop="productDrawingNo" label="型号" min-width="320" />
          <el-table-column prop="projectName" label="所属项目" min-width="120" 
          v-if="isProjectSwitch == 1" />
          <el-table-column prop="mainUnit" label="单位" min-width="80" />


          <el-table-column prop="demandQuantity" label="子件需求数量" min-width="120" />
          <el-table-column prop="createTime" label="创建时间" min-width="180"/>

        </JNPF-table>
        <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
          @pagination="initData" />



      </div>
    </div>
  </transition>
</template>

<script>
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import {

  demandSourceReport
} from "@/api/calculationList/MRPOperation";
export default {
  mixins:[getProjectList],
  data() {
    return {
      total: 0,
      pageTitle: "",
      popupList: [],
      listLoading: false,
      orderForm: {
        pageNum: 1,
        pageSize: 100,
        materialDemandId: ""
      },
      NumTotal: 0,
      isProjectSwitch:'',

    }
  },
  watch: {
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    await this.getProjectSwitch('system', 'project') 
  
   
  },
  mounted() {

  },
  methods: {
    // 合计处理
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
       
        const values = this.popupList.map(item => item[column.property] ? Number(item[column.property]) : '');
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          });
          // sums[index] += '';
        } else {
          sums[index] = null;
        }
      });
      return sums;

    },
    initData() {

    },
    init(id, type) {
      if (type == "produce") {
        this.pageTitle = "生产需求——追溯"
      }
      if (type == 'purchase') {
        this.pageTitle = "采购需求——追溯"
      }
      if (type == 'out') {
        this.pageTitle = "外协需求——追溯"
      }
      
      this.orderForm.materialDemandId = id
      this.listLoading = true
      demandSourceReport(this.orderForm).then(res => {
        console.log(res);
        this.total = res.data.page.total
        this.popupList = res.data.page.records
        this.NumTotal = res.data.total.demandQuantity
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

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.tableContainer {
  height: inherit;
}
::v-deep  .gutter{
  display: none;
}
</style>