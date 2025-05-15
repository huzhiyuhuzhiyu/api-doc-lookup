<template>
  <transition name="el-zoom-in-center">

    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header noButtons">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" content="工资明细" />

      </div>
      <div class="main" v-loading="formLoading">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="4">
                <el-form-item>
                  <!-- <el-date-picker v-model="reportDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                        start-placeholder="报工开始日期" end-placeholder="报工结束日期" clearable>
                    </el-date-picker> -->
                  <el-date-picker v-model="listQuery.month" type="month" value-format="yyyy-MM" style="width: 100%;"
                    :clearable='false' placeholder="请选择月份" popper-class="date_form" disabled>
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="4">
                <el-form-item>
                  <el-input v-model="listQuery.productDrawingNo" @keyup.enter.native="search()" placeholder="请输入品名规格"
                    clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-input v-model="listQuery.processName" @keyup.enter.native="search()" placeholder="请输入工序名称"
                    clearable />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-select v-model="listQuery.reportWagesFlag" placeholder="请选择工资">
                    <el-option v-for="(item, index) in reportWagesFlagList" :key="index" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->

              <el-col :span="4">
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                    {{ $t('common.search') }}</el-button>
                  <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                  </el-button>
                </el-form-item>
              </el-col>
              <!-- <el-button style="float: right;margin-right: 10px;" size="mini" type="primary"
                icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button> -->
            </el-form>
          </el-row>
          <div class="JNPF-common-layout-main JNPF-flex-main">
            <div class="JNPF-common-head">
              <div>
                <!-- <el-button type="primary" @click="recalculate()">重新计算异常工资</el-button> -->
                <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download" @click="exportForm"
                  :disabled="!tableData.length">导出</el-button>
              </div>
              <div class="JNPF-common-head-right">
                <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                  <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                    @click="$refs.dataTable.showDrawer()" />
                </el-tooltip>
              </div>
            </div>
            <JNPF-table :partentOrChild="'child'" ref="dataTable" v-loading="listLoading" :data="tableData"
              :fixedNO="true" @sort-change="sortChange" custom-column :setColumnDisplayList="setColumnDisplayList"
              partentOrChild="Form">
              <el-table-column prop="producerJobNumber" label="生产人工号" min-width="180" />
              <el-table-column prop="producerName" label="生产人名称" min-width="120" />
              <el-table-column prop="productDrawingNo" label="品名规格" min-width="250" sortable="custom" />
              <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom" />
              <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
              <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom" />
              <el-table-column prop="processCode" label="工序编码" min-width="160" sortable="custom" />
              <el-table-column prop="packagingMethod" label="包装方式" min-width="160" sortable="custom" />
              <el-table-column prop="pricingType" label="计价类型" min-width="110" sortable="custom">
                <template slot-scope="scope">
                  <div v-for="(item, index) in pricingTypeList" :key="index">
                    <span v-if="item.value == scope.row.pricingType">{{ item.label }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="timePrice" label="单价(元)" min-width="140">
                <template slot-scope="scope">
                  <div v-if="scope.row.pricingType == 'by_time'"
                    :style="{ color: Number(scope.row.timePrice) <= 0 ? 'red' : '' }">{{ scope.row.timePrice }}</div>
                  <div v-else-if="scope.row.pricingType == 'by_piece'"
                    :style="{ color: Number(scope.row.unitPrice) <= 0 ? 'red' : '' }">{{ scope.row.unitPrice }}</div>
                  <div v-else>无计价类型</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column prop="timePrice" label="单价(元)" min-width="140">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.pricingType == 'by_time'" v-model="scope.row.timePrice"
                  @input="watchNum(scope.row, scope.$index)" @blur="blurFun(scope.row, scope.$index)" maxlength="22"
                  pattern="\d{1,18}(\.\d{0,2})?"></el-input>
                  <el-input v-if="scope.row.pricingType == 'by_piece'" v-model="scope.row.unitPrice"
                  @input="watchNum(scope.row, scope.$index)" @blur="blurFun(scope.row, scope.$index)" maxlength="22"
                  pattern="\d{1,18}(\.\d{0,2})?"></el-input>
                </template>
              </el-table-column> -->
              <el-table-column prop="reportingQuantity" label="报工合格数量" min-width="160" sortable="custom" />
              <!-- <el-table-column prop="reportingWages" label="报工金额" min-width="140" sortable="custom" /> -->
              <!-- <el-table-column prop="reportingWages" label="工资(元)" min-width="140" sortable="custom">
                <template slot-scope="scope">
                  <div :style="{ color: Number(scope.row.reportingWages) <= 0 ? 'red' : '' }">{{
                    scope.row.reportingWages }}</div>
                </template>
              </el-table-column> -->
              <el-table-column prop="reportingTime" label="报工时间" min-width="180" sortable="custom" />
              <el-table-column prop="vibrationLevel" label="振动等级" min-width="140" sortable="custom" />
              <el-table-column prop="aperture" label="孔径" min-width="140" sortable="custom" />
              <el-table-column prop="orderNo" label="工单单号" min-width="200" sortable="custom" />
            </JNPF-table>
            <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
              @pagination="initData">
              <div style="background: #f5f7fa;" class="text">

                <span style="font-weight:500;margin-right:10px">数量总计：{{ reportingQuantity }}</span>
                <span style="font-weight:500;margin-right:10px">工资总计：{{ reportingWages }}</span>
              </div>
            </pagination>

          </div>
        </div>
      </div>
      <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
        :modal-append-to-body="false" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
        <el-row :gutter="20">
          <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
            <el-col :span="12">
              <el-form-item label="报工时间">
                <!-- <el-date-picker v-model="reportDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                            start-placeholder="报工开始日期" end-placeholder="报工结束日期" clearable>
                    </el-date-picker> -->
                <el-date-picker v-model="listQuery.month" type="month" value-format="yyyy-MM" style="width: 100%;"
                  :clearable='false' placeholder="请选择月份" popper-class="date_form" disabled>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品编码">
                <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品名称">
                <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品名规格">
                <el-input v-model="listQuery.productDrawingNo" placeholder="请输入品名规格" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工序编码">
                <el-input v-model="listQuery.processCode" placeholder="请输入工序编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工序名称">
                <el-input v-model="listQuery.processName" placeholder="请输入工序名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工资">
                <el-select v-model="listQuery.reportWagesFlag" placeholder="请选择工资">
                  <el-option v-for="(item, index) in reportWagesFlagList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="search()">
            搜 索</el-button>
        </span>
      </el-dialog>
      <!-- <productForm v-if="productFormVisible" ref="productForm" @refresh="refresh" /> -->
      <ExportForm v-if="exportFormVisible || true" ref="exportForm" @download="download" />
    </div>
  </transition>
</template>

<script>

import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { getSalaryWagesDetailList, editPrice } from '@/api/salaryManagement'

export default {
  components: {
    ExportForm,
  },
  props: {
    customList: {
      require: true,
      type: Array
    }
  },

  data() {
    return {
      visible: false,
      reportingQuantity: "",
      reportingWages: "",
      formLoading: false,
      listLoading: false,
      total: 0,
      tableData: [],
      initListQuery: {
        productName: "",
        productCode: "",
        productDrawingNo: "",
        reportStartDate: "",
        reportEndDate: "",
        processCode: "",
        processName: "",
        reportWagesFlag: "",
        producerId: "",
        pageNum: 1,
        pageSize: 20,
        month: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "reporting_time"
        }, {
          asc: true,
          column: "producerJobNumber"
        }],
      },
      reportDateArr: [],
      reportWagesFlagList: [
        { value: "", label: "所有" },
        { value: 0, label: "金额大于0" },
        { value: 1, label: "金额等于0" },
      ],
      pricingTypeList: [
        { value: "by_time", label: "计时", },
        { value: "by_piece", label: "计件", }
      ],
      listQuery: {},
      month: "",
      producerId: "",
      setColumnDisplayList: [
        'producerJobNumber',
        // 'producerName',
        // 'productDrawingNo',
        'productName',
        'productCode',
        // 'processName',
        // 'processCode',
        // 'pricingType',
        // 'timePrice',
        // 'reportingQuantity',
        // 'reportingWages',
        // 'reportingTime',
        'vibrationLevel',
        'aperture',
        'orderNo',
      ],
      exportFormVisible: false,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
  },
  methods: {
    watchNum(row, index) {
      let data;
      if (row.pricingType == 'by_time') {
        data = row.timePrice = row.timePrice.replace(/[^\d.]/g, '');

      }
      if (row.pricingType == 'by_piece') {
        data = row.unitPrice = row.unitPrice.replace(/[^\d.]/g, '');

      }
      if (data.length == 1 && data == '.') {
        // 如果第一位是小数点，则清空输入框
        data = '';
        row.assistanttimePrice = '';
      } else if (data.length == 2 && data[0] == '0' && data[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        data = data.slice(0, 1) + '.' + data.slice(1);
      } else if (data.length > 2 && data[0] == '0' && data[1] != '.') {
        data = data.substring(1, data.length)
      }


      if (data.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果

        for (let i = 0; i < data.length; i++) {
          const char = data[i];
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char;
              dotCount++;
            }
          } else {
            result += char;
          }
        }

        data = result;
        let arr = data.split('.')
        if (arr[0].length > 15) {
          arr[0] = arr[0].substring(0, 15)
        }
        if (arr[1].length > 4) {
          arr[1] = arr[1].substring(0, 4)
        }
        data = arr[0] + '.' + arr[1]
      } else {
        if (data.length > 15) {
          data = data.substring(0, 15);
        }
      }
    },
    blurFun(row, index) {
      console.log("row", row);
      let obj = {
        id: row.id,
        price: row.pricingType == 'by_time' ? row.timePrice : row.unitPrice,

      }
      editPrice(obj).then(res => {
        console.log(res);
        this.$message.success("更新单价成功")
        this.getSalaryDetailFun()
      })
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productCode' || prop === 'productName' || prop === 'productSpec' || prop === 'processName'
        || prop === 'productDrawingNo'
        || prop === 'productName'
        || prop === 'productCode'
        || prop === 'processCode'
      ) { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.getSalaryDetailFun()
    },
    init(id, month) {
      console.log("id", month);
      this.listQuery.producerId = id
      this.producerId = id
      this.listQuery.month = month
      this.month = month
      this.getSalaryDetailFun()
    },
    search() {
      this.listQuery.pageNum = 1
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      if (this.reportDateArr && this.reportDateArr.length > 0) {
        this.listQuery.reportStartDate = this.reportDateArr[0]
        this.listQuery.reportEndDate = this.reportDateArr[1]
      } else {
        this.listQuery.reportStartDate = ""
        this.listQuery.reportEndDate = ""
      }
      this.getSalaryDetailFun()
    },
    getSalaryDetailFun() {
      this.listQuery.producerId = this.producerId
      this.listQuery.month = this.month

      this.listLoading = true

      getSalaryWagesDetailList(this.listQuery).then(res => {
        this.tableData = res.data.page.records
        this.total = res.data.page.total
        this.reportingQuantity = res.data.total ? res.data.total.reportingQuantity : 0
        this.reportingWages = res.data.total ? res.data.total.reportingWages : 0
        this.listLoading = false
        this.visible = false
      }).catch(error => {
        this.listLoading = false
        this.visible = false
      })
    },
    reset() {
      this.reportDateArr = []
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
    initData() {
      this.listLoading = true
      this.getSalaryDetailFun()
    },
    goBack() {
      this.$emit('close')
    },
    //导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => {
        console.log(this.$refs);
      })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.listQuery,
          exportType: '1238',
          exportName: '工资明细',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url, res.data.name)
        }).catch(() => { })
      }
    },
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

//.el-button--small {
// padding: 1;
//}</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}
</style>
<style scoped lang="scss">
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}

.el-table__footer {
  display: none;
}

::v-deep.has-gutter {
  display: none;
}
</style>