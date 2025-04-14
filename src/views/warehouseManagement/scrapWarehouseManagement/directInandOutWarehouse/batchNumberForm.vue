<template>

  <el-dialog title="选择批次号" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.batchNumber" placeholder="请输入批次号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.shelfSpaceName" placeholder="请输入库位" clearable />
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
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true">
            <el-table-column prop="batchNumber" label="批次号" sortable="custom" min-width="140"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" sortable="custom" min-width="120"/>
            <el-table-column prop="productName" label="产品名称" sortable="custom" min-width="120"/>
            <el-table-column prop="productDrawingNo" label="品名规格" sortable="custom" min-width="120"/>
            <el-table-column prop="availableQuantity" label="可用数量" sortable="custom" min-width="120"/>
            <el-table-column prop="occupancyQuantity" label="占用数量" sortable="custom" min-width="120"/>
            <el-table-column prop="sealingCoverTyping" label="打字内容" sortable="custom" min-width="120"/>
            <el-table-column prop="accuracyLevel" label="精度等级" sortable="custom" min-width="120"/>
            <el-table-column prop="vibrationLevel" label="振动等级" sortable="custom" min-width="120"/>
            <el-table-column prop="oil" label="油脂" sortable="custom" min-width="120"/>
            <el-table-column prop="clearance" label="游隙" sortable="custom" min-width="120"/>
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
import { getBatchNumber } from '@/api/basicData/index'
export default {
  data() {
    return {
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      customerVisible: false,
      treeLoading: false,
      treeData: [],
      form: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        },],
        shelfSpaceName: "",
        batchNumber: "",
        warehouseId: "",
        vibrationLevel: "",
        sealingCoverTyping: "",
        availableBatch:1,
        oil: "",
        clearance: "",
        accuracyLevel: "",
        productsId:"",
      },
      refreshTree: true,
      listLoading: false,
      total: 0,
      tableDataList: [],
      cpData: {},
      cpIndex: "",

    }
  },
  methods: {
    init(data, index) {
      console.log(data,index);
      this.customerVisible = true
      this.cpData = JSON.parse(JSON.stringify(data))
      this.cpIndex = JSON.parse(JSON.stringify(index))
      this.form.productsId=data.productsId
      this.form.vibrationLevel=data.vibrationLevel
      this.form.sealingCoverTyping=data.sealingCoverTyping
      this.form.oil=data.oil
      this.form.clearance=data.clearance
      this.form.accuracyLevel=data.accuracyLevel
      this.form.warehouseId=data.warehouseId
    
      this.form.productsId=data.productsId
      this.getbatchNumList()
    },
    // 选择批次
    selectBatchNum(row) {
      this.$emit("selectBatchNumberFun", row, this.cpIndex)
      this.customerVisible = false
    },
    getbatchNumList() {
      this.listLoading = true
      getBatchNumber(this.form).then(res => {
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
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        },],
        shelfSpaceName: "",
        batchNumber: "",
        warehouseId: "",
        vibrationLevel: "",
        sealingCoverTyping: "",
        oil: "",
        clearance: "",
        accuracyLevel: "",
      }
      this.init(this.cpData, this.cpIndex)
    },
  }
}
</script>