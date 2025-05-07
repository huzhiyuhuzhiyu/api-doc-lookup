<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item>
                <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="linesQuery.productDrawingNo" placeholder="请输入产品图号" @keyup.enter.native="search()" clearable />
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
            <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <!-- <el-dropdown> -->
            <div>
              <el-button type="primary" icon="el-icon-plus" @click.native="batchupPrice()">
                批量更新价格
              </el-button>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="linesTableData" v-loading="listLoading" @selection-change="handleSelectionChange" hasC :data="linesTableData" :fixedNO="true" custom-column customKey="JNPFTableKey_336178">
            <el-table-column prop="productCode" label="产品编码" min-width="140" />
            <el-table-column prop="productName" label="产品名称" min-width="140" />
            <el-table-column prop="drawingNo" label="产品图号" min-width="140" />

            <el-table-column prop="routingName" label="工艺路线名称" min-width="140" />
            <el-table-column prop="processCode" label="工序编码" min-width="140" />
            <el-table-column prop="processName" label="工序名称" min-width="140" />
            <el-table-column prop="pricingType" label="计价类型" min-width="140">
              <template slot-scope="scope">
                <div v-if="scope.row.pricingType === 'by_time'">计时</div>
                <div v-else>计件</div>
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" min-width="140" label="计件单价" />
            <!-- <el-table-column label="操作" width="90" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="UpdateOrUpdateHandle(scope.row.id)">更新价格</el-button>
              </template>
            </el-table-column> -->
          </JNPF-table>
          <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize" @pagination="initData" />
        </div>
      </div>

    </div>
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序编码">
              <el-input v-model="linesQuery.processCode" placeholder="请输入工序编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="linesQuery.processName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计件单价">
              <el-select v-model="linesQuery.hasUnitPrice" placeholder="请选择计件单价" clearable style="width: 100%;">
                <el-option v-for="(item, index) in documentList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { autoUpdatePriceitem, priceResourceLine } from '@/api/bimProcess/index'
export default {
  name: 'processpriceassembly',
  data () {
    return {
      documentList: [
        { label: "有", value: 1 },
        { label: "无", value: 0 },
      ],
      visible: false,
      listLoading: false,
      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        businessCode: 'complete',
        processingType: "self_produced",
        hasUnitPrice: "",
        processCode: "",
        processName: "",
        productDrawingNo: "",
        createByName: "",
        endTime: "",
        keyword: "",
        orderItems: [{
          asc: false,
          column: ""
        }],
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        routingName: "",
        productName: ""
      },
      selectArr: []
    }
  },
  created () {
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    batchupPrice () {
      if (!this.selectArr.length) return this.$message.error("请先选择数据")
      let arr = []
      this.selectArr.forEach(item => {
        arr.push(item.id)
      });
      this.listLoading = true
      autoUpdatePriceitem(arr).then(res => {
        this.$message.success('价格更新成功')
        this.initData()
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 选中得数据
    handleSelectionChange (val) {
      this.selectArr = val
    },
    initData () {
      this.listLoading = true
      priceResourceLine(this.linesQuery).then(res => {
        this.linesTableData = res.data.records
        this.linesTotal = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search () {
      Object.keys(this.linesQuery).forEach(key => {
        let item = this.linesQuery[key]
        this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.linesQuery.pageNum = 1
      this.initData()
    },
    reset () {
      this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
      this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
      this.initData()
    },
  }
}
</script>
<style  scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

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

::v-deep.el-range-editor--small.el-input__inner {
  height: 34px;
}
</style>

