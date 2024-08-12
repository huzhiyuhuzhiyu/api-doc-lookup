<template>
  <el-dialog title="收货地址" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll append-to-body
    class="JNPF-dialog JNPF-dialog_center" width="71%">
    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
   
        <div class="JNPF-common-layout-center JNPF-flex-main">

          <div class="JNPF-common-layout-main JNPF-flex-main">
            <div class="JNPF-common-head">
              <topOpts @add="addSupplier('', 'add')" />
              <div class="JNPF-common-head-right">
                <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                  <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData(id)" />
                </el-tooltip>
              </div>
            </div>

            <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" custom-column>
              <!-- <el-table-column prop="orderNo" label="发货单号" width="190" fixed="left" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column> -->

                <el-table-column prop="recipient" label="收件人"  min-width="140"  />
              <el-table-column prop="phone" label="收件人电话"  min-width="140"  />
              <el-table-column prop="countryText" label="国家"  min-width="140"  />
              <el-table-column prop="provinceText" label="省"  min-width="140"  />
              <el-table-column prop="cityText" label="市" min-width="140"  />
              <el-table-column prop="areaText" label="区" min-width="140" />
              <el-table-column prop="defaultFlag" label="是否默认" min-width="120">
                <template slot-scope="scope">
                    <div v-if="scope.row.defaultFlag == '1'">
                      <span>是</span>
                    </div>
                    <div v-else-if="scope.row.defaultFlag == '0'">
                      <span>否</span>
                    </div>
              
                  </template>
              </el-table-column>
              <el-table-column prop="address" label="地址" width="310" />

              <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="changeVal(scope.row)">选择</el-button>
                  <el-button size="mini" type="text" 
                    @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                  <el-button size="mini" type="text" class="JNPF-table-delBtn"
                    
                    @click="handleDel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </JNPF-table>
            <!-- <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
              @pagination="initData" /> -->
          </div>
        </div>
   
    </div>
    <addressForm v-if="depFormVisibled" ref="depFormRef" @initData="initData(id)"></addressForm>

  </el-dialog>
</template>

<script>
import { getCooperativeInfo } from '@/api/basicData/index'
import { addPartnerAddress, editaddress, getAddressInfo, deleteAddress,detailAddress } from '@/api/basicData/index'
import addressForm from './addressForm.vue'
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
        address: '',
        province: '',
        city: '',
        area: '',
        pageNum: 1,
        pageSize: 20,
      },
      id:'',
      cooperativePartnerId: '',
      total: 0,

    }
  },
  methods: {
    // 获取列表数据
    initData(id) {
      this.visible = true
        this.listLoading  = true

      this.id = id
      this.cooperativePartnerId = id
      console.log(id,'oooo9999-----')
      getAddressInfo(id).then(res => {
        console.log(res);
        this.listLoading  = false
        this.tableData = res.data
        
      })
    },
    changeVal(val) {
      if (val) {
        console.log(111);
        this.visible = false
        this.$emit('getChangeAddress',val)
      }
    },
    addSupplier(id,type){
      this.depFormVisibled = true
      this.$nextTick(()=>{
        this.$refs.depFormRef.init(id,type,this.cooperativePartnerId)
      })
    },
    addOrUpdateHandle(id,type) {
      this.depFormVisibled = true
      this.$nextTick(()=>{
        this.$refs.depFormRef.init(id,type,this.cooperativePartnerId)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteAddress(id).then(res => {
          this.initData(this.id)
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