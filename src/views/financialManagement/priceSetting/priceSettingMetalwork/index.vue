<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productsName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productsDrawingNo" placeholder="请输入产品图号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>


          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.blankProductsDrawingNo" placeholder="请输入毛胚产品图号" clearable
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
        <div class="JNPF-common-head">
          <!-- <el-dropdown> -->
          <div>
            <el-button type="primary" icon="el-icon-plus" @click.native="batchSetPrice()">
              批量设置牌价
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
          @sort-change="sortChange" custom-column border @selection-change="handleSelectionChange" hasC>
          <el-table-column prop="productsCode" label="产品编码" min-width="150" sortable="custom" />
          <el-table-column prop="productsName" label="产品名称" min-width="120" sortable="custom" />
          <el-table-column prop="productsDrawingNo" label="产品图号" min-width="150" />
          <el-table-column prop="blankProductsName" label="毛坯产品名称" min-width="150" sortable="custom" />
          <el-table-column prop="blankProductsDrawingNo" label="毛坯产品图号" min-width="130" />
          <el-table-column prop="blankProductNo" label="毛坯料号" min-width="150" />

          <el-table-column prop="grossWeight" label="毛坯重(kg)" min-width="130" />
          <el-table-column prop="productWeight" label="成品重(kg)" min-width="130" />
          <el-table-column prop="materialCost" label="材料成本(元)" min-width="150" sortable="custom" />
          <el-table-column prop="totalLaborCost" label="总人工费用(元)" min-width="170" sortable="custom" />
          <el-table-column prop="feeAmount" label="总制造费用(元)" min-width="170" sortable="custom" />
          <el-table-column prop="totalCost" label="成本合计(元)(不含税)" min-width="200" sortable="custom" />
          <el-table-column prop="coefficient1" label="系数1" min-width="100" />
          <el-table-column prop="coefficient2" label="系数2" min-width="100" />
          <el-table-column prop="totalProfitCost" label="加利润成本合计(含税)" min-width="220" sortable="custom" />
          <el-table-column prop="excludingTaxTotalProfitCost" label="加利润成本合计(元)(不含税)" min-width="260" sortable="custom" />
          <el-table-column prop="listPriceCoefficient" label="牌价系数" min-width="100" />
          <el-table-column prop="listPrice" label="销售牌价" min-width="120" sortable="custom" />
          <el-table-column prop="listPriceUpdateTime" label="最新牌价更新时间" min-width="180" sortable="custom" >
            <template scope="scope">
              <div>{{ scope.row.listPriceUpdateTime ? scope.row.listPriceUpdateTime.substring(0, 10) : '' }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="listPriceUpdateByName" label="最新牌价更新人" min-width="140" />
          <el-table-column prop="updateTime" label="最新成本更新时间" min-width="180" sortable="custom">
            <template scope="scope">
              <div>{{ scope.row.updateTime ? scope.row.updateTime.substring(0, 10) : '' }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="updateByName" label="最新成本更新人" min-width="140" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productsCode" placeholder="请输入产品编码" min-width="150" clearable maxlength="50">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productsName" placeholder="请输入产品名称" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productsDrawingNo" placeholder="请输入产品图号" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毛坯产品名称">
              <el-input v-model="listQuery.blankProductsName" placeholder="请输入毛坯产品名称" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毛坯产品图号">
              <el-input v-model="listQuery.blankProductsDrawingNo" placeholder="请输入毛坯产品图号" width="180" clearable
                maxlength="20"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售牌价">
              <el-select placeholder="请选择销售牌价" v-model="listQuery.hasListPrice" clearable>
                <el-option v-for="(item, index) in hasListPriceList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
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
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="priceDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">

        <el-form ref="dataForm" :model="setForm" :rules="dataFormRules" label-width="120px" label-position="top">
          <el-col :span="24">
            <el-form-item label="系数1" prop="coefficient1">
              <el-input v-model="setForm.coefficient1" placeholder="请输入系数1" min-width="150" clearable maxlength="50">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="系数2" prop="coefficient2">
              <el-input v-model="setForm.coefficient2" placeholder="请输入系数2" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="税率" prop="taxRate">
              <el-input v-model="setForm.taxRate" placeholder="请输入税率" width="180" clearable maxlength="2">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="牌价系数" prop="listPriceCoefficient">
              <el-input v-model="setForm.listPriceCoefficient" placeholder="请输入牌价系数" width="180" clearable maxlength="20">
              </el-input>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">

        <span slot="footer" class="dialog-footer">
          <el-button @click="priceDialog = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitForm()">
            提交</el-button>
        </span>
      </span>
    </el-dialog>

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>
    
<script>
import { getfinSelfMadePricingList, updatetfinSelfListPrice } from '@/api/financialManagement/index'

import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
export default {
  components: { ExportForm },
  name: 'purchasePriceSetting',
  data() {
    return {
      exportFormVisible: false,
      setForm: {
        coefficient1: "",
        coefficient2: "",
        taxRate: 13,
        listPriceCoefficient: "",

      },
      hasListPriceList: [
        { label: "所有", value: "" },
        { label: "有牌价", value: 1 },
        { label: "无牌价", value: 0 },
      ],
      btnLoading: false,
      dataFormRules: {
        coefficient1: [
          { required: true, message: "请输入系数", trigger: "blur" },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('系数1：不能为0') }), trigger: 'blur' },
          { validator: this.validateInput1, trigger: 'blur' }
        ],
        coefficient2: [
          { required: true, message: "请输入系数2", trigger: "blur" },
          { validator: this.validateInput2, trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('系数2：不能为0') }), trigger: 'blur' }
        ],
        taxRate: [
          { required: true, message: "请输入税率", trigger: "blur" },
          { validator: this.formValidate('bigInt', '请输入正确的税率', (errMsg) => { this.$message.error('税率' + errMsg) }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('税率：不能为0') }), trigger: 'blur' }
        ],
        listPriceCoefficient: [
          { required: true, message: "请输入牌价系数", trigger: "blur" },
          { validator: this.formValidate({ type: 'decimal', params: [7, 6, "", (errMsg) => { this.$message.error('牌价系数' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('牌价系数：不能为0') }), trigger: 'blur' }
        ],
      },




      title: "批量设置牌价",
      background: true,//分页器背景颜色
      visible: false,
      priceDialog: false,
      tableDataList: [
      ],
      formVisible: false,
      listLoading: false,
      listQuery: {
        productsCode: "",
        productsName: "",
        productsDrawingNo: "",
        blankProductsName: "",
        blankProductsDrawingNo: "",
        hasListPrice: "",
        hasTotalCost: 1,
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "update_time"
        }],

        costType: "metalworking",
      },


      total: 0,
      formVisible: false,
      ids: [],
      selectArr: [],

    }
  },
  created() {
    this.initData()
  },
  methods: {
    validateInput1(rule, value, callback) {
      if (value && Number(value) > 10) {
        callback(new Error('输入的系数不得大于10！'));
      } else {
        callback();
      }
    },
    validateInput2(rule, value, callback) {
      if (value && Number(value) > 10) {
        callback(new Error('输入的系数不得大于10！'));
      } else {
        callback();
      }
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.listQuery
      let _data = {
        ...targetListQuery,
        exportType: "1076",
        exportName: "销售牌价设置(金工)",
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    submitForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.selectArr.forEach(item => {
            this.ids.push(item.productsId)
          });
          let obj = {
            costType: "assemble",
            pidList: this.ids,
            "coefficient1": this.setForm.coefficient1,
            "coefficient2": this.setForm.coefficient2,
            "listPriceCoefficient": this.setForm.listPriceCoefficient,
            "taxRate": this.setForm.taxRate  ,
          }
          this.btnLoading = true
          updatetfinSelfListPrice(obj).then(res => {
            this.btnLoading = false
            this.priceDialog = false
            this.initData()
            this.$message.success("批量设置牌价成功")
          }).catch(error => {
            this.btnLoading = false
            this.priceDialog = false

          })
          console.log(4563456);
        }
      })
    },
    handleSelectionChange(val) {
      this.selectArr = val
    },
    batchSetPrice() {
      console.log(this.selectArr);
      if (!this.selectArr.length) return this.$message.error("请先选择数据")
      // this.selectArr.forEach(item => {
      //   this.ids.push(item.productsId)
      // });
      // let obj = {
      //   costType: "assemble",
      //   pidList: this.ids
      // }
      this.priceDialog = true
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      })
      // updatetfinSelfMadePricing(obj).then(res => {
      //   console.log("批量设置结果", res);
      //   this.initData()
      // })
    },
    exportExcel() {

    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp = null
      // if (prop === 'productsCode' || prop === 'productsName' || prop === 'shipperName' || prop === 'createByName' || prop === 'productsName' || prop === 'drawingNo' || prop === 'createTime') {
      //   newProp = prop
      // } else {
      //   newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      // }
      // blankProductsName    totalLaborCost feeAmount totalCost totalProfitCost excludingTaxTotalProfitCost listPrice updateTime listPriceUpdateTime
      if (prop == "materialCost" ||   prop == 'totalLaborCost' || prop == 'feeAmount' || prop == 'totalCost'|| prop == 'totalProfitCost'|| prop == 'listPriceUpdateTime'  || prop == 'excludingTaxTotalProfitCost' || prop == 'listPrice' || prop == 'updateTime') {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      } else {
        newProp = prop
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },


    initData() {
      this.listLoading = true
      getfinSelfMadePricingList(this.listQuery).then(res => {
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
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        productsCode: "",
        productsName: "",
        productsDrawingNo: "",
        blankProductsName: "",
        blankProductsDrawingNo: "",
        hasListPrice: "",
        hasTotalCost: 1,
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "update_time"
        }],
        costType: "metalworking",
      },

        this.search()
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
    