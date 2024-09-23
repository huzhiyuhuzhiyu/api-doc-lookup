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
                    <el-input v-model.trim="listQuery.drawingNo" placeholder="品名规格" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.partnerName" placeholder="供应商名称" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                      {{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
                    icon="el-icon-download" @click="exportForm">
                    导出
                  </el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top" v-if="true">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm"
                :data="tableDataList" @sort-change="sortChange" custom-column>
                <el-table-column prop="partnerName" label="供应商名称" min-width="160" sortable="custom" />
                <el-table-column prop="partnerCode" label="供应商编码" min-width="160" sortable="custom" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="160" />
                <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
                <el-table-column prop="productCode" label="单位" width="160" sortable="custom" />
                <el-table-column prop="productCode" label="协议价(含税)" width="160" sortable="custom" />
                <el-table-column prop="productCode" label="协议价(不含税)" width="160" sortable="custom" />
                <el-table-column prop="productCode" label="税率" width="160" sortable="custom" />
                <el-table-column prop="dateOrderStart" label="有效日期起" sortable="custom" min-width="180" />
                <el-table-column prop="dateOrderStop" label="有效日期止" sortable="custom" min-width="180" />

                <el-table-column prop="standardValue" label="规值" width="180" sortable="custom" />
                <el-table-column prop="drawingNo" label="颜色" min-width="160" />
                <el-table-column prop="sealingCoverTyping" width="140" label="打字内容" sortable="custom" />
                <el-table-column prop="accuracyLevel" label="精度等级" width="140" sortable="custom" />
                <el-table-column prop="vibrationLevel" label="振动等级" width="140" sortable="custom" />
                <el-table-column prop="oil" label="油脂" width="120" sortable="custom" />
                <el-table-column prop="oilQuantity" label="油脂量" width="140" sortable="custom" />
                <el-table-column prop="clearance" label="游隙" width="120" sortable="custom" />
                <el-table-column prop="packagingMethod" label="包装方式" width="140" sortable="custom" />
                <el-table-column prop="price" min-width="140" label="特殊要求"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史价格" name="historicalprice">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.drawingNo" placeholder="请输入产品图号" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="listQuery.partnerName" placeholder="请输入供应商名称" clearable
                      @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                      {{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
                    icon="el-icon-download" @click="exportForm">
                    导出
                  </el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" highlight-current-row :fixedNO="true" ref="tableForm"
                :data="tableDataList" @sort-change="sortChange" custom-column>
                <el-table-column prop="partnerName" label="供应商名称" min-width="160" sortable="custom" />
                <el-table-column prop="partnerCode" label="供应商编码" min-width="160" sortable="custom" />

                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" min-width="160" />
                <el-table-column prop="drawingNo" label="产品图号" min-width="160" />
                <el-table-column prop="dateOrderStart" label="价格起始日期" sortable="custom" min-width="180" />
                <el-table-column prop="dateOrderStop" label="价格到期日期" sortable="custom" min-width="180" />

                <el-table-column prop="price" min-width="140" label="采购成本价"></el-table-column>
                <el-table-column prop="purchasePrice" min-width="140" label="销售牌价"></el-table-column>
                <el-table-column prop="orderProportion" min-width="140" label="订购比例(%)"></el-table-column>
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
      exportFormVisible: false,
      depFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],

      listLoading: false,
      listQuery: {
        partnerType: 'supplier',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_Time'
          }
        ],
        createByName: '',
        customerProductDrawingNo: '',
        customerProductNo: '',
        drawingNo: '',
        endTime: '',
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        partnerCode: '',
        partnerId: null,
        partnerName: '',
        productCode: '',
        productName: '',
        productStatus: '',
        startEndDate: '',
        startStartDate: '',
        startTime: '',
        stopEndDate: '',
        stopStartDate: '',
        historyFlag: false,
        priceDateArr: [],
        priceDateArr2: [],
        startAndEndTime: []
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上个月',
            onClick(picker) {
              const end = new Date(moment(new Date().getTime()).format('YYYY-MM-01 00:00:00'))
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
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
      let columnList = this.$refs.tableForm.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        console.log(includeFieldMap)
        let name = ''
        if (this.activeName == 'latestprice') {
          name = '最新价格'
        } else {
          name = '历史价格'
        }
        let _data = {
          ...this.listQuery,
          exportType: '1009',
          exportName: '供应商产品' + '-' + name,
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },
    handleClick(e) {
      this.activeName = e.name
      // this.reset()
    },
    sortChange({ prop, order }) {
      if (prop === 'createTime') {
        prop = 'create_Time'
      }
      if (prop === 'dateOrderStart') {
        prop = 'date_Order_Start'
      }
      if (prop === 'dateOrderStop') {
        prop = 'date_Order_Stop'
      }
      if (prop === 'customerProductDrawingNo') {
        prop = 'customer_Product_Drawing_No'
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : prop
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
        this.listQuery.startTime = this.listQuery.startAndEndTime[0] + ' 00:00:00'
        this.listQuery.endTime = this.listQuery.startAndEndTime[1] + ' 23:59:59'
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
      if (this.activeName == 'historicalprice') {
        this.listQuery.historyFlag = true
      }
      getPartnerOrProductData(this.listQuery)
        .then((res) => {
          console.log(res, '供应商产品列表')
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      Object.keys(this.listQuery).forEach((key) => {
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
        ; (this.listQuery = {
          partnerType: 'supplier',
          partnerId: null,
          pageNum: 1,
          pageSize: 20,
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 'create_Time'
            }
          ],
          historyFlag: false,
          code: '',
          name: ''
        }),
          this.search()
    },
    addSupplier(type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init('', type)
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
      })
        .then(() => {
          deleteBimVehicleType(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
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
