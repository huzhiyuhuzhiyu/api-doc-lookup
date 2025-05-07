<template>
  <!-- 总成 -->
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="dataForm.productsCode" placeholder="请输入产品编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="dataForm.productsName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="dataForm.productsDrawingNo" placeholder="请输入产品图号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>

        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <!-- <div class="JNPF-common-head">
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div> -->
        <div class="JNPF-common-head">
          <!-- <el-dropdown> -->
          <div>
            <el-button type="primary" icon="el-icon-plus" @click.native="batchSetPrice()">
              批量更新价格
            </el-button>
            <el-button type="primary" icon="el-icon-plus" @click.native="exportForm('tableForm')">
              导出
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList"
          @sort-change="sortChange" custom-column border @selection-change="handleSelectionChange" hasC customKey="JNPFTableKey_879574">

          <el-table-column prop="productsCode" label="产品编码" min-width="130" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="productsName" label="产品名称" min-width="110" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="productsDrawingNo" label="产品图号" min-width="200" show-overflow-tooltip />
          <el-table-column prop="hoseLength" label="胶管长度" min-width="100" show-overflow-tooltip />
          <el-table-column prop="materialCost" label="材料成本(元)" min-width="140" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="totalLaborCost" label="总人工费用(元)" min-width="160" sortable="custom" />
          <el-table-column prop="feeAmount" label="总制造费用(元)" min-width="160" sortable="custom" />
          <el-table-column prop="totalCost" label="成本合计(元)(不含税)" min-width="200" sortable="custom" />
          <el-table-column prop="updateTime" label="最新成本更新时间" min-width="170"  >
            <template scope="scope">
              <div>{{ scope.row.updateTime?scope.row.updateTime.substring(0,10):'' }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="updateByName" label="最新成本更新人" min-width="130" />
          <el-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.productsId, 'look')">查看详情</el-button>

            </template>
          </el-table-column>

        </JNPF-table>
        <pagination :total="total" :page.sync="dataForm.pageNum" :background="background" :limit.sync="dataForm.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />

    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="dataForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="dataForm.productsCode" placeholder="请输入产品编码" min-width="150" clearable maxlength="50">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="dataForm.productsName" placeholder="请输入产品名称" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="dataForm.productsDrawingNo" placeholder="请输入产品图号" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="材料成本">
              <el-select placeholder="请选择材料成本" v-model="dataForm.hasMaterialCost" clearable>
                <el-option v-for="(item, index) in hasMaterialCostList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="总人工费用">
              <el-select placeholder="请选择总人工费用" v-model="dataForm.hasTotalCost" clearable>
                <el-option v-for="(item, index) in hasTotalLaborCostList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总制造费用">
              <el-select placeholder="请选择总制造费用" v-model="dataForm.hasFeeAmount" clearable>
                <el-option v-for="(item, index) in hasFeeAmountList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本合计">
              <el-select placeholder="请选择成本合计" v-model="dataForm.hasTotalCost" clearable>
                <el-option v-for="(item, index) in hasTotalCostList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最新更新时间" prop="planStartDate">
              <el-date-picker v-model="costDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                :picker-options="global.timePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>
  
<script>
import { getbuyFixedPointPricingList, deletebuyFixedPointPricing } from '@/api/purchasingManagement/purchaseInquirySheet'
import { getfinSelfMadePricingList, updatetfinSelfMadePricing, getfinSelfMadePricingInfo } from '@/api/financialManagement/index'
import JNPFForm from './Form'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import moment from 'moment'
export default {
  name: 'purchasePriceSetting',
  components: { JNPFForm,ExportForm },
  data() {
    return {
      exportFormVisible:false,
      hasGrossWeightList: [
        { label: "所有", value: "" },
        { label: "有重量", value: 1 },
        { label: "无重量", value: 0 },
      ],
      hasMaterialCostList: [
        { label: "所有", value: "" },
        { label: "有价格", value: 1 },
        { label: "无价格", value: 0 },
      ],
      costWeightList: [
        { label: "所有", value: "" },
        { label: "有重量", value: 1 },
        { label: "无重量", value: 0 },
      ],
      hasTotalWorkingHoursList: [
        { label: "所有", value: "" },
        { label: "有工时", value: 1 },
        { label: "无工时", value: 0 },
      ],
      hasTotalLaborCostList: [
        { label: "所有", value: "" },
        { label: "有费用", value: 1 },
        { label: "无费用", value: 0 },
      ],
      hasFeeAmountList: [
        { label: "所有", value: "" },
        { label: "有费用", value: 1 },
        { label: "无费用", value: 0 },
      ],
      hasTotalCostList: [
        { label: "所有", value: "" },
        { label: "有金额", value: 1 },
        { label: "无金额", value: 0 },
      ],
      costDateArr: [],
      dataForm: {
        productsCode: "",
        productsName: "",
        productsDrawingNo: "",
        hasMaterialCost: "",
        hasTotalLaborCost: "",
        hasFeeAmount: "",
        hasTotalCost: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "productsName"
        }],
        startUpdateTime: "",
        endUpdateTime: "",
        costType: "complete",
      },
      selectArr: [],




      title: "更多查询",
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [],
      formVisible: false,
      listLoading: false,



      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.initData()
  },
  methods: {
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.dataForm
      let _data = {
        ...targetListQuery,
        exportType: "1076",
        exportName: "自制成本价格计算(总成)",
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    batchSetPrice() {
      console.log(this.selectArr);
      if (!this.selectArr.length) return this.$message.error("请先选择数据")
      let arr = []
      this.selectArr.forEach(item => {
        arr.push(item.productsId)
      });
      let obj = {
        costType: "complete",
        pidList: arr
      }
      updatetfinSelfMadePricing(obj).then(res => {
        console.log("批量设置结果", res);
        this.$message.success("价格更新成功")

        this.initData()
      })
    },
    // 选中得数据
    handleSelectionChange(val) {
      this.selectArr = val
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp = null
      if (prop == "productsCode" || prop == "productsName" || prop == "blankProductsName") {
        newProp = prop

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.dataForm.orderItems[0].asc = order !== 'descending'
      this.dataForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },


    initData() {
      this.listLoading = true
      if (this.costDateArr && this.costDateArr.length > 0) {
        this.dataForm.startUpdateTime = this.costDateArr[0] + " 00:00:00"
        this.dataForm.endUpdateTime = this.costDateArr[1] + " 23:59:59"
      }
      getfinSelfMadePricingList(this.dataForm).then(res => {
        console.log(res, '牌价列表');
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.dataForm).forEach(key => {
        let item = this.dataForm[key]
        this.dataForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.dataForm.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.costDateArr=[]

      this.dataForm = {
        productsCode: "",
        productsName: "",
        productsDrawingNo: "",
        hasMaterialCost: "",
        hasTotalLaborCost: "",
        hasFeeAmount: "",
        hasTotalCost: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "productsName"
        }],
        startUpdateTime: "",
        endUpdateTime: "",
        costType: "complete",
      },

        this.search()
    },
    // addSupplier(id, type) {
    //   this.formVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.JNPFForm.init(id, type)
    //   })
    // },
    addOrUpdateHandle(id, type) {
      this.formVisible = true
      if (id) {
        this.$nextTick(() => {
          this.$refs.JNPFForm.init(id, type)
        })
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletebuyFixedPointPricing(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
  