<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
        <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
          <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
          <div class="text-one-line">客户行业分析</div>
        </div>
        <div class="xr-radio-menu-wrap" style="width: 250px;">
          <selectdate @change="datechange"></selectdate>
        </div>
        <div class="xr-radio-menu-wrap">
          <selectdepartment @change="departmentchange"></selectdepartment>
        </div>
        <el-button type="primary" icon="el-icon-search" @click="search()">
          {{ $t('common.search') }}</el-button>
      </div>
      <div class="content-table-main">
        <div class="axis-content" v-loading="chartLoading">
          <div id="CustomerAnaly" :option="option" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="table-content" v-loading="listLoading">
          <!-- <div class="handle-bar">
            <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download">导出</el-button>
          </div> -->
          <div style="height: 400px;">
            <el-table ref="tabForm" :header-cell-style="headerCellStyle" :data="tableList" border>
              <el-table-column v-for="item in columnsData" :label="item.label" :key="item.prop" min-width="120">
                <template slot-scope="scope">
                  {{scope.row[item.prop]}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getportrait } from "@/api/CRMmanagement/instrumentPanel/index";
import selectdate from "../components/selectdate";
import selectdepartment from "../components/selectdepartment";
export default {
  components: {
    selectdate,
    selectdepartment
  },
  data() {
    return {
      datas: [],
      headerCellStyle: {
        backgroundColor: '#f5f7fa',
        fontWeight: 'bold'
      },
      columnsData: [],
      chartLoading: false,
      listLoading: false,
      dataForm: {
        startTime: "",
        endTime: "",
        type: "year",
        userIds: []
      },
      tableList: [],
      chartInstance: null,
      option: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.dataForm.userIds = [this.userInfo.userId]
    this.initData()
  },
  mounted() {
    this.chartInstance = this.$echarts.init(document.getElementById('CustomerAnaly'));
    this.chartInstance.setOption(this.option);
    window.onresize = () => {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.chartInstance.resize()
      }, 100);
    }
  },
  beforeDestroy() {
    window.onresize = null
  },
  watch: {
    option: {
      handler(newOption) {
        if (this.chartInstance) {
          this.chartInstance.setOption(newOption);
        }
      },
      deep: true
    }
  },
  methods: {
    search() {
      this.initData()
    },
    datechange(data) {
      this.dataForm.startTime = data.dateStart
      this.dataForm.endTime = data.dateEnd
      this.dataForm.type = data.value
    },
    departmentchange(data) {
      this.dataForm.userIds = data
    },
    initData() {
      this.chartLoading = true
      this.listLoading = true
      getportrait(this.dataForm).then(res1 => {
        this.option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c}'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            },
            showTitle: false
          },
          title: [
            {
              text: '全部客户',
              left: '25%',
              bottom: 0,
              textAlign: 'center'
            },
            {
              text: '成交客户',
              left: '75%',
              bottom: 0,
              textAlign: 'center'
            }
          ],
          grid: {
            top: '10%',
            left: '1%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          series: [
            {
              name: '全部客户',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['25%', '50%'],
              avoidLabelOverlap: false,
              data: res1.data.map(item => {
                return { value: item.allCustomer, name: item.type }
              })
            },
            {
              name: '成交客户',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['75%', '50%'],
              avoidLabelOverlap: false,
              data: res1.data.map(item => {
                return { value: item.dealCustomer, name: item.type }
              })
            }
          ]
        }
        this.datas = res1.data
        this.init()
        this.listLoading = false
        this.chartLoading = false
      }).catch(() => {
        this.listLoading = false
        this.chartLoading = false
      })
    },
    init() {
      const _this = this
      const columnObj1 = {}
      _this.tableList = []
      _this.columnsData = []
      columnObj1.label = '客户行业'
      columnObj1.prop = 'title'
      _this.columnsData.push(columnObj1)
      _this.tableList.push({ 'title': '全部客户(个)' })
      _this.tableList.push({ 'title': '成交客户(个)' })
      var props = 'prop'
      _this.datas.forEach((item, index) => {
        const columnObj = {}
        columnObj.label = item.type
        columnObj.prop = props + index
        _this.columnsData.push(columnObj)
        _this.$set(_this.tableList[0], columnObj.prop, item.allCustomer)
        _this.$set(_this.tableList[1], columnObj.prop, item.dealCustomer)

      })
    }
  }
}
</script>
<style lang="scss" scoped>
.JNPF-flex-main {
  padding: 14px 0 0 14px;
}
.JNPF-common-layout {
  background-color: #fff;
}
.filtrate-content {
  ::v-deep .el-button--small {
    padding: 8px 15px;
  }
  .title-box {
    width: auto;
    max-width: 250px;
    margin-right: 24px;
    .icon-box {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      margin-right: 10px;
      line-height: 34px;
      color: #0052cc;
      text-align: center;
      background-color: #dfe8ff;
      border-radius: 50%;
    }
    .text-one-line {
      font-size: 20px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .xr-radio-menu-wrap {
    margin-right: 16px;
  }
}
.content-table-main {
  height: calc(100% - 54px);
  padding-bottom: 24px;
  margin-top: 24px;
  overflow-y: auto;
  .axis-content {
    margin-right: 40px;
    margin-bottom: 24px;
  }
  .table-content {
    padding-right: 40px;
    .handle-bar {
      margin-bottom: 8px;
      text-align: right;
    }
  }
}
</style>