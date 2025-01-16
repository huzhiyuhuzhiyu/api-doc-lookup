<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="dialogTitle + `价格`" />
        </div>
        <div class="main" ref="main">
          <div class="JNPF-common-layout-main JNPF-flex-main" :style="{ height: height + 'px' }">
            <div class="JNPF-common-head">
              <el-row class="JNPF-common-search-box" style="margin-left: -27px;" :gutter="16">
                <el-form @submit.native.prevent>
                  <el-col :span="14">
                    <el-form-item>
                      <el-date-picker v-model="timeArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                        start-placeholder="请选择生效开始日期" end-placeholder="请选择生效结束日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                        {{ $t('common.search') }}
                      </el-button>
                      <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset')
                        }}</el-button>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>

              <div class="JNPF-common-head-right">
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
            <JNPF-table v-loading="listLoading" :fixedNO="true" ref="detailTableForm" :data="tableData" custom-column
              :partentOrChild="'detailTableForm'" :setColumnDisplayList="columnList">
              <template v-for="item in tableItems">
                <el-table-column v-if="item.prop == 'effectiveDate'" :prop="item.prop" :key="item.prop"
                  :label="item.label" :fixed="item.fixed || false" :min-width="item.minWidth || 130" align="center"
                  :sortable="item.sortable" :formatter="jnpf.tableDateFormatStrDay">
                </el-table-column>
                <el-table-column v-else-if="item.prop == 'expiringDate'" :prop="item.prop" :key="item.prop"
                  :label="item.label" :fixed="item.fixed || false" :min-width="item.minWidth || 130" align="center"
                  :sortable="item.sortable" :formatter="jnpf.tableDateFormatStrDay">
                </el-table-column>
                <el-table-column v-else-if="item.prop == 'pricingType'" :prop="item.prop" :key="item.prop"
                  :label="item.label" :fixed="item.fixed || false" :min-width="item.minWidth || 130"
                  :sortable="item.sortable">
                  <template slot-scope="{ row }">
                    <template v-if="row.pricingType == 'by_time'">
                      计时
                    </template>
                    <template v-else-if="row.pricingType == 'by_piece'">
                      计件
                    </template>
                  </template>
                </el-table-column>
                <el-table-column v-else :key="item.prop" :prop="item.prop" :label="item.label"
                  :fixed="item.fixed || false" :min-width="item.minWidth || 130" :sortable="item.sortable" />
              </template>
              <el-table-column label="操作" width="80" fixed="right">
                <template slot-scope="scope">
                  <tableOpts :hasEdit="false" @del="handleDel(scope.row.id)"></tableOpts>
                </template>
              </el-table-column>
            </JNPF-table>
            <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
              @pagination="initData" />
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>
<script>
export default {
  components: {
  },
  props: {
    priceType: {
      type: String,
      required: true
    },
    /* 列表数据请求方法 */
    listMethod: {
      required: true
    },
    /* 设置数据请求方法 */
    delMethod: {
      required: true
    },
    tableItems: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    searchList: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    searchListMore: {
      type: Array,
      default: () => []
      /* [
          {prop:'code',label:'编码'},
          {prop:'name',label:'名称'}
        ] */
    },
    superQueryJson: {
      type: Array,
      default: () => []
    },
    columnList: {
      type: Array,
      default: () => []
    }

  },
  data() {
    return {
      timeArr: [],
      dialogTitle: '',
      loading: false,
      btnLoading: false,
      index: null,
      listLoading: false,


      // 收款列表参数
      listQuery: {},


      tableData: [],

      total: 0,
      makeouttotal: 0,
      height: 0
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    console.log(this.tableItems, 'tableItems123')
    this.columnList.push('expiringDate')
  },
  mounted() {
    this.switchStyle()
  },
  methods: {
    init(listQuery, type) {
      console.log(listQuery, type);
      this.listQuery = JSON.parse(listQuery)
      this.dialogTitle = `查看`
      this.type = type
      this.initData()

    },
    columnSetFun() {
      this.$refs.detailTableForm.showDrawer()
    },
    //自适应窗口
    async switchStyle() {
      await this.$nextTick();
      console.log(this.$refs.main, 'this.$refs.main')
      let allHeight = this.$refs.main.clientHeight
      console.log(allHeight, 'allHeight')
      // let HeightstoclInfo = this.$refs.stoclInfo.clientHeight
      // let Heightradio = this.$refs.radio.clientHeight
      this.height = (allHeight - 10) < 500 ? 500 : (allHeight - 10)
      console.log(this.height, 'oooo')
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },

    initData() {
      this.listLoading = true

      this.listMethod(this.listQuery).then(res => {
        console.log(res, 'jjkk')
        this.tableData = res.data.records
        if (['process', 'inspection'].includes(this.priceType)) {
          this.tableData.forEach((item) => {
            if (item.pricingType === 'by_time') {
              item.price = item.timePrice
            } else if (item.pricingType === 'by_piece') {
              item.price = item.unitPrice
            }
          })
        }
        console.log(this.tableData, 'this.tableData')
        this.total = res.data.total
        this.listLoading = false
      })
    },
    search(type) {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      if (this.timeArr && this.timeArr.length) {
        this.listQuery.startTime = this.timeArr[0]
        this.listQuery.endTime = this.timeArr[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }

      this.initData()
    },
    // 删除数据
    handleDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        this.delMethod(id).then((res) => {
          if (res.msg === 'Success') res.msg = '删除成功'
          this.initData()
          this.$message({
            type: 'success',
            message: res.msg
          })
        })
      }).catch(() => { })
    },
    reset() {
      this.$refs['detailTableForm'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
      this.timeArr = []
      this.initData()
    },
    goBack() {
      this.$emit('close')
    },
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 0 10px 10px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
}

::v-deep .el-tabs__header {
  /* padding-left: 10px !important; */
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.red {
  color: red
}

.green {
  color: #67C23A;
}

::v-deep #pane-payInfo {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}

::v-deep #pane-collectionInfo {
  height: calc(100% - 10px) !important;
  display: flex;
  flex-direction: column;
}

::v-deep .el-tabs__content {
  /* height: calc(100% - 40px) !important; */
}

.el-tabs {
  height: 100%;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}
</style>