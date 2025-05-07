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
                <el-input v-model="form.batchNumber" placeholder="请输入批次号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()" v-model="form.partnerName" placeholder="请输入供应商名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.shelfSpaceName" placeholder="请输入库位" @keyup.enter.native="search()" clearable />
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
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table v-loading="listLoading" v-if="showflag" :setColumnDisplayList="columnList" :data="tableDataList"
            custom-column ref="dataTable" :fixedNO="true" customKey="JNPFTableKey_626076">
            <el-table-column prop="batchNumber" label="批次号" sortable="custom" min-width="180"></el-table-column>
            <el-table-column prop="partnerName" label="供应商名称" sortable="custom" min-width="180"></el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" sortable="custom" min-width="120" />
            <el-table-column prop="shelfSpaceName" label="库位" sortable="custom" min-width="120" />
            <el-table-column prop="inventoryQuantity" label="库存数量" sortable="custom" min-width="120" />
            <el-table-column prop="inspectionResults" label="检验结果" sortable="custom" min-width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.inspectionResults == 'qualified'">合格</div>
                <div v-if="scope.row.inspectionResults == 'unqualified'">不合格</div>
                <div v-if="scope.row.inspectionResults == 'partially_qualified'">部分合格</div>
                <div v-if="scope.row.inspectionResults == 'discard'">报废</div>
                <div v-if="scope.row.inspectionResults == 'concessive_acceptance'">让步接收</div>
              </template>
            </el-table-column>
            <el-table-column prop="availableQuantity" label="可用数量" sortable="custom" min-width="120" />
            <el-table-column prop="occupancyQuantity" label="占用数量" sortable="custom" min-width="120" />
            <el-table-column prop="weight" label="重量" min-width="120" />
            <el-table-column prop="proportion" label="比重" min-width="120" />
            <el-table-column prop="discount" label="折扣" min-width="120" />
            <el-table-column prop="productCategoryName" label="产品分类" sortable="custom" min-width="120" />
            <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" />

            <el-table-column prop="specSize" label="规格/尺寸" width="120" sortable="custom" :key="601"></el-table-column>
            <el-table-column prop="logo" label="logo" width="120" sortable="custom" :key="602"></el-table-column>
            <el-table-column prop="divideEqually" :label="$store.getters.divideEqually" width="120" sortable="custom"
              :key="603"></el-table-column>
            <el-table-column prop="material" label="材质" width="120" sortable="custom" :key="603"></el-table-column>
            <el-table-column prop="standardValue" label="规值" min-width="120" sortable="custom"></el-table-column>
            <el-table-column prop="colour" :label="$store.getters.colour"  min-width="120" sortable="custom"></el-table-column>
            <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  min-width="140" v-if="sealingCoverTypingFlag == 1"
              sortable="custom"></el-table-column>
            <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  min-width="120" v-if="accuracyLevelFlag == 1"
              sortable="custom"></el-table-column>
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" v-if="vibrationLevelFlag == 1"
              sortable="custom"></el-table-column>
            <el-table-column prop="oil" label="油脂" min-width="120" v-if="oilFlag == 1"
              sortable="custom"></el-table-column>
            <el-table-column prop="clearance" label="游隙" min-width="120" v-if="clearanceFlag == 1"
              sortable="custom"></el-table-column>
            <el-table-column prop="aperture" label="孔径" min-width="120" v-if="apertureFlag == 1"
              sortable="custom"></el-table-column>
            <el-table-column prop="packagingMethod" label="包装方式" min-width="120" v-if="packagingMethodFlag == 1"
              sortable="custom"></el-table-column>
            <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  min-width="120" v-if="specialRequireFlag == 1"
              sortable="custom"></el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
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
import { getBatchNumber, getOrderFiledMap } from '@/api/basicData/index'
export default {
  data() {
    return {
      columnList: [],
      showflag: false,
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
        partnerName: "",
        batchNumber: "",
        warehouseId: "",
        vibrationLevel: "",
        sealingCoverTyping: "",
        availableBatch: 1,
        oil: "",
        clearance: "",
        accuracyLevel: "",
        productsId: "",
        inspectStockFlag: true,
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
      isProductNameSwitch: "",
    }
  },
  async created() {
    await this.getOrderFiledMap()
  },
  methods: {
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop == 'warehouseName' || prop == 'shelfSpaceName') {
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
        this.showflag = true
      })
    },
    init(data, index) {
      console.log(data, index);
      this.customerVisible = true
      this.cpData = JSON.parse(JSON.stringify(data))
      this.cpIndex = JSON.parse(JSON.stringify(index))
      this.form.productsId = data.productsId
      this.form.vibrationLevel = data.vibrationLevel
      this.form.sealingCoverTyping = data.sealingCoverTyping
      this.form.oil = data.oil
      this.form.clearance = data.clearance
      this.form.accuracyLevel = data.accuracyLevel
      this.form.warehouseId = data.warehouseId

      this.form.productsId = data.productsId
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
        this.tableDataList = res.data.records
        this.total = res.data.total
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
        inspectStockFlag: true,
      }
      this.init(this.cpData, this.cpIndex)
    },
  }
}
</script>