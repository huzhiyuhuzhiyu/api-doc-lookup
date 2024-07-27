<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="最新报价" name="latestprice">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.partnerName" placeholder="请输入客户名称" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.customerProductDrawingNo" placeholder="请输入客户料号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.drawingNo" placeholder="请输入品名规格" clearable
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
                <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm">导出</el-button>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('tableForm')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm"
                :data="tableDataList" @sort-change="sortChange" custom-column  :setColumnDisplayList="columnLists">
                <el-table-column prop="partnerName" label="客户名称" min-width="260" sortable="custom" />
                <el-table-column prop="partnerCode" label="客户编码" min-width="160" sortable="custom" />
                <el-table-column prop="customerProductNo" label="客户料号" min-width="180" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="400" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" min-width="160" />
                <el-table-column prop="price" min-width="120" label="销售单价(含税)" />
                <el-table-column prop="excludingTaxPrice" label="销售单价(不含税)" width="160" />
                <el-table-column prop="dateOrderStart" label="有效日期起" sortable="custom" min-width="160" />
                <el-table-column prop="dateOrderStop" label="有效日期止" sortable="custom" min-width="160" />
                <el-table-column prop="dateOrderStop" label="要求" sortable="custom" min-width="160" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />

              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史报价" name="historicalprice">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.partnerName" placeholder="请输入客户名称" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.customerProductDrawingNo" placeholder="请输入客户料号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.drawingNo" placeholder="请输入品名规格" clearable
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
                <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm">导出</el-button>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('tableForms')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForms"
                :data="tableDataList" @sort-change="sortChange" custom-column  :setColumnDisplayList="columnLists">
                <el-table-column prop="partnerName" label="客户名称" min-width="260" sortable="custom" />
                <el-table-column prop="partnerCode" label="客户编码" min-width="160" sortable="custom" />
                <el-table-column prop="customerProductNo" label="客户料号" min-width="180" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="400" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" min-width="160" />
                <el-table-column prop="price" min-width="120" label="销售单价(含税)" />

                <el-table-column prop="excludingTaxPrice" label="销售单价(不含税)" width="160" />
                <el-table-column prop="dateOrderStart" label="有效日期起" sortable="custom" min-width="160" />
                <el-table-column prop="dateOrderStop" label="有效日期止" sortable="custom" min-width="160" />
                <el-table-column prop="dateOrderStop" label="要求" sortable="custom" min-width="160" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />

              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />

  </div>
</template>

<script>
import { getBimVehicleTypeData, deleteBimVehicleType, getPartnerOrProductData } from '@/api/basicData/index'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'

export default {
  name: 'PartnerProduct',
  components: { ExportForm },
  data() {
    return {
      columnLists:["partnerCode","productName"],
      exportFormVisible: false,
      depFormVisible: false,
      background: true,//分页器背景颜色
      tableDataList: [
      ],

      listLoading: false,
      listQuery: {
        partnerType: "customer",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        customerProductNo: "",
        drawingNo: "",
        partnerName: "",



        pageNum: 1,
        pageSize: 20,

      },
     
      total: 0,
      formVisible: false,
      activeName: 'latestprice'
    }
  },
  created() {
    this.initData()
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
    columnSetFun(ref) {
      this.$refs[ref].showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tableForm.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
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
        let name = ''
        if (this.activeName == 'latestprice') {
          name = '最新报价'
        } else {
          name = '历史报价'
        }
        let _data = {
          ...this.listQuery,
          exportType: '1009',
          exportName: '客户产品' + '-' + name,
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    handleClick(e) {
      this.activeName = e.name
      // this.reset()
    },
    sortChange({ prop, order }) {
      console.log(prop);
      // let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      // console.log(newProp);
      if (prop === 'createTime') {
        prop = "create_Time"
      }
      if (prop === 'dateOrderStart') {
        prop = "date_Order_Start"
      }
      if (prop === 'dateOrderStop') {
        prop = "date_Order_Stop"
      }
      if (prop === 'customerProductDrawingNo') {
        prop = "customer_Product_Drawing_No"
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : prop
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },

    dataFormSubmit() {
      this.listQuery.pageNum = 1

      this.initData()
    },
    initData() {
      this.listLoading = true
      if (this.activeName == "historicalprice") {
        this.listQuery.historyFlag = true
      } else {
        this.listQuery.historyFlag = false

      }
      getPartnerOrProductData(this.listQuery).then(res => {
        console.log(res, '客户产品列表');
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
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
      this.listQuery.priceDateArr2 = []
      this.listQuery.priceDateArr = []
      this.listQuery.startAndEndTime = []
      this.listQuery = {
        partnerType: "customer",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        partnerId: null,
        historyFlag: false,
        customerProductNo: "",
        pageNum: 1,
        pageSize: 20,
        code: "",
        name: "",
      },
        this.search()
    },
    addSupplier(type) {

      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init("", type)
      })
    },
    addOrUpdateHandle(id, type) {
      this.depFormVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
        // }, 600);
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteBimVehicleType(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />