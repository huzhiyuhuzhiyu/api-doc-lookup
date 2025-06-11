<template>
  <el-dialog title="选择产品历史属性" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll append-to-body
    class="JNPF-dialog JNPF-dialog_center" width="71%">
    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" customKey="JNPFTableKey_934407" @sort-change="sortChange"> 
            <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  sortable="custom" min-width="140" />
            <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  sortable="custom" min-width="120" />
            <el-table-column prop="vibrationLevel" label="振动等级" sortable="custom" min-width="120" />
            <el-table-column prop="oil" label="油脂" sortable="custom" min-width="120" />
            <el-table-column prop="clearance" label="游隙" sortable="custom" min-width="120" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"></el-table-column>
            <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  width="120" sortable="custom"></el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="selectFun(scope.row)">选择</el-button>
                <el-button type="text" @click="handleDel(scope.row.id)"  style=" color: #ff3a3a">删除</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="getdataFun" />
        </div>
      </div>
    </div> 

  </el-dialog>
</template>

<script>
import { getCooperativeInfo } from '@/api/basicData/index' 
import { getBimProductAttributesRecordList,delBimProductAttributesRecord } from '@/api/salesManagement/assemblyOrders'
import addressForm from './addressForm.vue'
import { mapGetters, mapState } from 'vuex'
export default {
  components:{
    addressForm
  },
  data() {
    return {
      depFormVisibled:false,
      listLoading: false,
      visible: false,
      tableData: [],
      orderForm: {
        keyword:"",
        pageNum: 1,
        pageSize: 20,
        userId:"",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }, 
      total: 0,
      index:"",
  
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },
  created () {
    this.orderForm.userId = this.userInfo.userId
  },
  methods: {
    init(index){
      this.visible = true
      this.index=index
      this.getdataFun()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'salesName' || prop == 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop === 'sealingRingName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.getdataFun()
    },
    getdataFun(){
      getBimProductAttributesRecordList(this.orderForm).then(res=>{
        this.tableData=res.data.records
        this.total=res.data.total
      })
    },
  selectFun(row){
    this.visible=false
    this.$emit('selectData', row,this.index)
  },
  
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delBimProductAttributesRecord(id).then(res => {
          this.getdataFun()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
  },
}
</script>

<style scoped>
.JNPF-common-head {
  padding: 10px;
}

.JNPF-common-search-box {
  padding-top: 5px;
  padding-bottom: 10px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}
::v-deep .JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body{
      padding: 10px !important;
}
::v-deep .el-dialog__body{
  padding: 10px !important;
}
</style>