<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="BOMForm.customerProductNo" @keyup.enter.native="search()" placeholder="请输入客户物料号"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="BOMForm.materialCode" @keyup.enter.native="search()" placeholder="请输入主产品图号"
                  clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="BOMForm.priceType" placeholder="请选择子件价格" clearable>
                  <el-option v-for="(item, index) in priceTypeList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="3">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t("common.search") }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-button style="float: left; margin-right: 20px" type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
            <el-button style="float: right; margin-right: 20px" size="mini" type="primary" icon="el-icon-search"
              @click="moreQueries()">更多查询</el-button>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="BOMList" :fixedNO="true" custom-column customKey="JNPFTableKey_498796">
            <!-- <el-table-column prop="code" label="BOM编码" min-width="240"></el-table-column>
            <el-table-column prop="name" label="BOM名称" min-width="240"></el-table-column> -->
            <el-table-column prop="customerProductNo" label="客户物料号" min-width="240" />
            <el-table-column prop="customerDrawingNumber" label="客户图号" min-width="240" />
            <el-table-column prop="materialCode" label="主产品图号" min-width="400"></el-table-column>
            <el-table-column prop="productsCode" label="产品编码" min-width="140"></el-table-column>
            <el-table-column prop="productsName" label="产品名称" width="160"></el-table-column>
            <el-table-column prop="productsDrawingNo" label="产品图号" min-width="160" />
            <el-table-column prop="qty" label="数量" width="120"></el-table-column>
            <el-table-column prop="mainUnit" label="单位" width="120" />
            <el-table-column prop="provisionalEstimate" label="暂估价" width="120">
            </el-table-column>
            <el-table-column prop="listPrice" label="销售牌价" width="100">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="BOMForm.pageNum" :limit.sync="BOMForm.pageSize" @pagination="initData" />
        </div>
      </div>
    </div>
    <!-- 更多查询 -->
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="BOMForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="BOM编码">
              <el-input v-model="BOMForm.code" placeholder="请输入BOM编码" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="BOM名称">
              <el-input v-model="BOMForm.name" placeholder="请输入BOM名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户物料号">
              <el-input v-model="BOMForm.customerProductNo" placeholder="请输入客户物料号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="客户图号">
              <el-input v-model="BOMForm.customerDrawingNumber" placeholder="请输入客户图号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="主产品图号">
              <el-input v-model="BOMForm.materialCode" placeholder="请输入主产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="BOMForm.productsCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="BOMForm.productsName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="BOMForm.productsDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="子件价格">
              <el-select v-model="BOMForm.priceType" placeholder="请选择子件价格">
              <el-option v-for="(item, index) in priceTypeList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            </el-form-item>
          </el-col>
            

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button type="primary" @click="search()"> 搜索</el-button>
      </span>
    </el-dialog>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>
  
<script>
import { getWorkReportList } from "@/api/productOrdes/index";
import { getBOMPriceList } from "@/api/salesManagement/index"
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import moment from "moment";
export default {
  name: "carrierProfile",
  components: {  ExportForm },
  data() {
    return {
      BOMList: [],
      BOMForm: {
        code: "",
        name: "",
        customerProductNo: "",
        customerDrawingNumber: "",
        materialCode: "",
        productsCode: "",
        productsName: "",
        productsDrawingNo: "",
        priceType: "noPrice",

        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
      },
      title: "更多查询",
      visible: false,
      listLoading: false,
      priceTypeList: [
        { label: "无价格", value: 'noPrice' },
        { label: "有价格", value: 'havePrice' },
        { label: "有牌价", value: 'listPrice' },
      ],

      total: 0,
      exportFormVisible: false,
    };
  },
  created() {
    this.initData();
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {


    moreQueries() {
      this.visible = true;
    },

    initData() {
      this.listLoading = true;

      getBOMPriceList(this.BOMForm)
        .then((res) => {
          console.log("res++", res, this.BOMForm);
          this.BOMList = res.data.records;
          this.total = res.data.total;
          this.listLoading = false;
          this.visible = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    search() {
      Object.keys(this.BOMForm).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.BOMForm[key];
        this.BOMForm[key] =
          typeof item === "string" ? item.trim() : item;
      });
      this.BOMForm.pageNum = 1;
      this.initData();
    },
    reset() {
      this.$refs["dataTable"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮

      this.BOMForm = {
        code: "",
        name: "",
        customerProductNo: "",
        customerDrawingNumber: "",
        materialCode: "",
        productsCode: "",
        productsName: "",
        productsDrawingNo: "",
        priceType: "noPrice",

        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
      };

      this.search();
    },
     // 导出
     exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => {return { label: item.label, prop: item.prop }})
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        console.log(includeFieldMap);
        let _data = {
          ...this.BOMForm,
          exportType:'1124',
          exportName:'报价BOM价格',
          includeFieldMap,
          pageSize:data.dataType == 0 ? this.BOMForm.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
  },
};
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

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-dialog .el-dialog__body {
  padding: 30px 20px !important;
}
</style>
  
  