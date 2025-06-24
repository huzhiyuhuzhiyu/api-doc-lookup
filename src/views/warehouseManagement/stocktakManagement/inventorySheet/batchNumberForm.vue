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
                <el-input @keyup.native.enter="search()"  v-model="form.partnerName" placeholder="请输入供应商名称" clearable />
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
          <div class="JNPF-common-head">
            <div></div>
            <div></div>
          <div class="JNPF-common-head-right">

            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
          </div>
        </div>
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true" @sort-change="sortChange"  v-if="showflag"  :setColumnDisplayList="columnList"  custom-column ref="dataTable" customKey="JNPFTableKey_650465">
            <el-table-column prop="batchNumber" label="批次号" sortable="custom" min-width="140"></el-table-column>
            <el-table-column prop="partnerName" label="供应商名称" sortable="custom" min-width="180"></el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" sortable="custom" min-width="120"/>
            <el-table-column prop="shelfSpaceName" label="库位" sortable="custom" min-width="120"/>
            <el-table-column prop="inventoryQuantity" label="库存数量" sortable="custom" min-width="120"/>
            <el-table-column prop="inspectionResults" label="检验结果" sortable="custom" min-width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.inspectionResults=='qualified'">合格</div>
                    <div v-if="scope.row.inspectionResults=='unqualified'">不合格</div>
                    <div v-if="scope.row.inspectionResults=='partially_qualified'">部分合格</div>
                    <div v-if="scope.row.inspectionResults=='discard'">报废</div>
                    <div v-if="scope.row.inspectionResults=='concessive_acceptance'">让步接收</div>
                  </template>
                </el-table-column>
            <el-table-column prop="availableQuantity" label="可用数量" sortable="custom" min-width="120"/>
            <el-table-column prop="occupancyQuantity" label="占用数量" sortable="custom" min-width="120"/>
            <AttributeColumns :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'warehouse'" />
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
import { getBatchNumber,getOrderFiledMap } from '@/api/basicData/index'
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
        partnerName:"",
        warehouseId: "",
        vibrationLevel: "",
        sealingCoverTyping: "",
        availableBatch:1,
        oil: "",
        clearance: "",
        accuracyLevel: "",
        productsId:"",
        packagingMethod:"",
        specialRequire:"",
        inspectStockFlag :true,
        processId:"",
      },
      refreshTree: true,
      listLoading: false,
      total: 0,
      tableDataList: [],
      cpData: {},
      cpIndex: "",
       // 属性字段  控制属性字段显示隐藏
       accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      bimProductAttributesList: [],
      standardValueFlag: "",
      colourFlag: "",
      processFlag: "",
      columnList:[],
      showflag:false,
    }
  },
  async created () {
    await this.getOrderFiledMap()

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
    getOrderFiledMap() {
      getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.showflag=true
      })
      getOrderFiledMap('purchase').then(res => {
        this.standardValueFlag = res.data.standardValue
        this.colourFlag = res.data.colour
        this.processFlag = res.data.process
      })
    },
    init(data, index) {
      console.log(data,index);
      this.customerVisible = true
      this.cpData = JSON.parse(JSON.stringify(data))
      this.cpIndex = JSON.parse(JSON.stringify(index))
      this.form.productsId=data.productsId
      this.form.vibrationLevel=data.vibrationLevel
      this.form.sealingCoverTyping=data.sealingCoverTyping
      this.form.oil=data.oil
      this.form.processId=data.processId?data.processId:""
      this.form.clearance=data.clearance
      this.form.accuracyLevel=data.accuracyLevel
      this.form.warehouseId=data.warehouseId
      this.form.packagingMethod=data.packagingMethod
      this.form.specialRequire=data.specialRequire
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
        packagingMethod:"",
        specialRequire:"",
        inspectStockFlag :true,
      }
      this.init(this.cpData, this.cpIndex)
    },
  }
}
</script>
