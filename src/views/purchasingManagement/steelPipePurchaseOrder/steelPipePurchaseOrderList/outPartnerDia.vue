<template>

  <el-dialog title="选择委外关联产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.outProductName" placeholder="请输入产品名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.outProductCode" placeholder="请输入产品编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.outPartnerName" placeholder="请输入外协供应商名称" clearable />
              </el-form-item>
            </el-col>
   
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <div></div>
            <div></div>
          <div class="JNPF-common-head-right">
        
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
          </div>
        </div>
            <JNPF-table :partentOrChild="'dataTable'" ref="dataTable" :data="tableDataList"  
            :fixedNO="true"  
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="purchasePartnerName" label="采购供应商名称" min-width="180" sortable="custom" />
            <el-table-column prop="outPartnerName" label="外协供应商名称" min-width="180" sortable="custom" />
            <el-table-column prop="outProductName" label="产品名称" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="outProductCode" label="产品编码" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="outProductDrawingNo" label="品名规格" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="yieldRate" label="成材率" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="buyBackPrice" label="回购单价" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="buyBackRate" label="回购税率(%)" min-width="140" sortable="custom"> </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="200" sortable="custom"> </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope" >
                <el-button type="text" @click="selectBatchNum(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
            @pagination="getbatchNumList" />
        </div>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import {  outRelatedProductList,addOutRelatedProduct,editOutRelatedProduct,delOutRelatedProduct} from '@/api/purchasingAndOutsourcingOrders/index'; 
export default {
  data() {
    return {
 
      customerVisible: false,
 
      form: {
        purchasePartnerId:"",
        outProductName:"",
        outProductCode:"",
        outPartnerName:"",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      listLoading: false,
      total: 0,
      tableDataList: [],
      cpData: {},
      cpIndex: "",
     
      columnList:[],
      showflag:false,
    }
  },
  async created () {
    
  },
  methods: {
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop == 'warehouseName' || prop == 'shelfSpaceName' ) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.form.orderItems[0].asc = order === 'ascending'
      this.form.orderItems[0].column = order === null ? "" : newProp
      this.search()
    },
 
    init(id) {
      this.form.purchasePartnerId=id
      this.customerVisible = true
      this.getbatchNumList()
    },
    // 选择批次
    selectBatchNum(row) {
      this.$emit("selectOut", row,)
      this.customerVisible = false
    },
    getbatchNumList() {
      this.listLoading = true
      outRelatedProductList(this.form).then(res => {
        console.log("批次号数据", res);
        this.tableDataList=res.data.records
        this.total=res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    search() {
      this.getbatchNumList()
    },
    reset() {
      this.form = {
        purchasePartnerId:this.form.purchasePartnerId,
        outProductName:"",
        outProductCode:"",
        outPartnerName:"",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
      this.init()
    },
  }
}
</script>