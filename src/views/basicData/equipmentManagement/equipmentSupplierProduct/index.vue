<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="最新价格" name="latestprice">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.drawingNo" placeholder="请输入产品图号" clearable @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.partnerName" placeholder="请输入供应商名称" clearable @keyup.enter.native="search()" />
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                  <topOpts @add="addSupplier()">
                    <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
                  </topOpts>
                  <div class="JNPF-common-head-right">
                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                    </el-tooltip>
                  </div>
                </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column>
                <el-table-column prop="partnerCode" label="供应商编码" min-width="160" sortable="custom" fixed="left" />
                <el-table-column prop="partnerName" label="供应商名称" min-width="160" sortable="custom" fixed="left" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" min-width="160" />
                <el-table-column prop="drawingNo" label="产品图号" min-width="160" />
                <el-table-column prop="dateOrderStart" label="价格起始日期" sortable="custom" min-width="180" />
                <el-table-column prop="dateOrderStop" label="价格到期日期" sortable="custom" min-width="180" />

                <el-table-column prop="price" min-width="140" label="采购成本价"></el-table-column>
                <el-table-column prop="purchasePrice" min-width="140" label="销售牌价"></el-table-column>
                <el-table-column prop="orderProportion" min-width="140" label="订购比例(%)"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />

                <!-- <el-table-column label="操作" width="220" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                style=" color: #ff3a3a">删除</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column> -->
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background" :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史价格" name="historicalprice">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.drawingNo" placeholder="请输入产品图号" clearable @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.partnerName" placeholder="请输入供应商名称" clearable @keyup.enter.native="search()" />
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                  <topOpts @add="addSupplier()">
                    <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
                  </topOpts>
                  <div class="JNPF-common-head-right">
                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                    </el-tooltip>
                  </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column>
                <el-table-column prop="partnerCode" label="供应商编码" min-width="160" sortable="custom" fixed="left" />
                <el-table-column prop="partnerName" label="供应商名称" min-width="160" sortable="custom" fixed="left" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" min-width="160" />
                <el-table-column prop="drawingNo" label="产品图号" min-width="160" />
                <el-table-column prop="dateOrderStart" label="价格起始日期" sortable="custom" min-width="180" />
                <el-table-column prop="dateOrderStop" label="价格到期日期" sortable="custom" min-width="180" />

                <el-table-column prop="price" min-width="140" label="采购成本价"></el-table-column>
                <el-table-column prop="purchasePrice" min-width="140" label="销售牌价"></el-table-column>
                <el-table-column prop="orderProportion" min-width="140" label="订购比例(%)"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />

                <!-- <el-table-column label="操作" width="220" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.id, scope.row.parentId)"
                style=" color: #ff3a3a">删除</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column> -->
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background" :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="供应商编码">
              <el-input v-model="listQuery.partnerCode" placeholder="请输入供应商编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称">
              <el-input v-model="listQuery.partnerName" placeholder="请输入供应商名称" clearable />
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
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.drawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格起始日期">
              <el-date-picker v-model="listQuery.priceDateArr2" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="请选择价格起始日期" end-placeholder="请选择价格起始日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格到期日期">
              <el-date-picker v-model="listQuery.priceDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="请选择价格到期日期" end-placeholder="请选择价格结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTime" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()">
          搜索
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
<script>
import { getBimVehicleTypeData, deleteBimVehicleType, getPartnerOrProductData } from '@/api/basicData/index'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'

export default {
  // name: 'PartnerProduct',
  components: { ExportForm },
  data() {
    return {
      title: "更多查询",
      exportFormVisible: false,
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],

      listLoading: false,
      listQuery: {
        partnerType: 'supplier',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_Time"
        }],
        createByName: "",
        customerProductDrawingNo: "",
        customerProductNo: "",
        drawingNo: "",
        endTime: "",
        keyword: "",
        pageNum: 1,
        pageSize: 20,
        partnerCode: "",
        partnerId: null,
        partnerName: "",
        productCode: "",
        productName: "",
        productStatus: "",
        startEndDate: "",
        startStartDate: "",
        startTime: "",
        stopEndDate: "",
        stopStartDate: "",
        historyFlag: false,
        priceDateArr: [],
        priceDateArr2: [],
        startAndEndTime: []
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick(picker) {
            const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
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
     // 导出
     exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tableForm.columnList.filter(item => !!item.label && !!item.prop)
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
        let name = ''
        if(this.activeName == 'latestprice'){
          name = '最新价格'
        } else {
          name = '历史价格'
        }
        let _data = {
          ...this.listQuery,
          exportType:'1009',
          exportName:'供应商产品'+ '-'+ name,
          includeFieldMap,
          pageSize:data.dataType == 0 ? this.listQuery.pageSize : -1
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
    moreQueries() {
      this.visible = true
    },
    dataFormSubmit() {
      this.listQuery.pageNum = 1
      if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
        this.listQuery.startTime = this.listQuery.startAndEndTime[0] + " 00:00:00"
        this.listQuery.endTime = this.listQuery.startAndEndTime[1] + " 23:59:59"
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      if (this.listQuery.priceDateArr && this.listQuery.priceDateArr.length > 0) {
        this.listQuery.stopStartDate = this.listQuery.priceDateArr[0]
        this.listQuery.stopEndDate = this.listQuery.priceDateArr[1]
      } else {
        this.listQuery.stopStartDate = ''
        this.listQuery.stopEndDate = ''
      }
      if (this.listQuery.priceDateArr2 && this.listQuery.priceDateArr2.length > 0) {
        this.listQuery.startStartDate = this.listQuery.priceDateArr2[0]
        this.listQuery.startEndDate = this.listQuery.priceDateArr2[1]
      } else {
        this.listQuery.startStartDate = ''
        this.listQuery.startEndDate = ''
      }
      this.initData()
    },
    initData() {
      this.listLoading = true
      if (this.activeName == "historicalprice") {
        this.listQuery.historyFlag = true
      }
      getPartnerOrProductData(this.listQuery).then(res => {
        console.log(res, '供应商产品列表');
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
      this.listQuery.priceDateArr2 = []
      this.listQuery.priceDateArr = []
      this.listQuery.startAndEndTime = []
      this.listQuery = {
        partnerType: 'supplier',
        partnerId: null,
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_Time"
        }],
        historyFlag: false,
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
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
  