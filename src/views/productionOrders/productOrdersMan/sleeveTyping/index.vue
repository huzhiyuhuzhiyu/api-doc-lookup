  <!-- 成品订单返工管理 -->
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.customerProductNo" @keyup.enter.native="initData()" placeholder="请输入客户物料号"
                clearable />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.sleeveModel" @keyup.enter.native="initData()" placeholder="请输入套筒图号"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="dataForm.hoseModel" @keyup.enter.native="initData()" placeholder="请输入胶管图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="initData()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
              <!-- <el-button type="text" icon="el-icon-download" @click="importFun('dataTable')">导出</el-button> -->
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
            @click="moreQueries()">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button size="mini" @click="importFun('dataTable')" icon="el-icon-download" type="primary">导出</el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable"  :data="tableData" custom-column :fixedNO="true">
          <el-table-column prop="customerProductNo" label="客户物料号"> </el-table-column>
          <el-table-column prop="sleeveModel" label="套筒图号"> </el-table-column>
          <el-table-column prop="hoseModel" label="胶管图号"></el-table-column>
          <el-table-column prop="contractNo" label="合同号"></el-table-column>
          <el-table-column prop="mainUnit" label="单位"></el-table-column>
          <el-table-column prop="productionQuantity" label="数量"></el-table-column>
          <el-table-column prop="productDrawingNo" label="胶管总成图号" min-width="350"></el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <!-- 更多查询弹框 -->
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="dataForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="客户物料号">
              <el-input v-model="dataForm.customerProductNo" placeholder="请输入客户物料号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套筒图号">
              <el-input v-model="dataForm.sleeveModel" placeholder="请输入套筒图号" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="胶管图号">
              <el-input v-model="dataForm.hoseModel" placeholder="请输入胶管图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同号">
              <el-input v-model="dataForm.contractNo" placeholder="请输入合同号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="胶管总成图号">
              <el-input v-model="dataForm.productDrawingNo" placeholder="请输入胶管总成图号" clearable />
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="initData()">
          搜索</el-button>
      </span>
    </el-dialog>

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { excelExport } from '@/api/basicData/index'
import { flowCardList } from "@/api/productOrdes/index"
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  name: 'carrierProfile',
  components: { ExportForm },
  data() {
    return {
      exportFormVisible:false,
      tableData:[],
      visible:false,
      title:"更多查询",
        total:0,
      dataForm: {
        customerProductNo: "",
        sleeveModel: "",
        hoseModel: "",
        contractNo: "",
        productDrawingNo: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": true,
            "column": "customer_product_no"
          },
          {
            "asc": true,
            "column": "sleeve_model"
          },
        ],
        orderStatus: "normal",
      }
    }
  },
  watch: {

  },
  created() {
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
  
    // 导出
    importFun(exportTableRef) {
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
        exportType: "1122",
        exportName: "套筒打字查询",
        includeFieldMap,
        pageSize: targetListQuery.pageSize 
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },



    initData() {
      flowCardList(this.dataForm).then(res => {
        console.log("数据", res);
        this.tableData=res.data.records
        this.total=res.data.total
        this.visible = false
      })
    },
    moreQueries() {
      this.visible = true
    },
    reset() {
      this.dataForm = {
        customerProductNo: "",
        sleeveModel: "",
        hoseModel: "",
        contractNo: "",
        productDrawingNo: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": true,
            "column": "customer_product_no"
          },
          {
            "asc": true,
            "column": "sleeve_model"
          },
        ],
        orderStatus: "normal",
      }
      this.initData()
    },

  },
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
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
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


::v-deep.el-table__body-wrapper {
  height: auto !important;
}

.required {
  color: red;
  margin-right: 4px;
}
</style>

