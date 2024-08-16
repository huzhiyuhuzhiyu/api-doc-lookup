<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
        <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
          <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
          <div class="text-one-line">客户转化率分析</div>
        </div>
        <div class="xr-radio-menu-wrap" style="width: 250px;">
          <selectdate @change="datechange"></selectdate>
        </div>
        <div class="xr-radio-menu-wrap">
          <selectdepartment @change="departmentchange"></selectdepartment>
        </div>
        <div class="xr-radio-menu-wrap select-chart">
          <el-select v-model="dataForm.chart" placeholder="请选择" @change="chartchange">
            <el-option v-for="item in optionschart" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" icon="el-icon-search" @click="search()">
          {{ $t('common.search') }}</el-button>
      </div>
      <div class="content-table-main" v-loading="listLoading">
        <div class="axis-content">
          <div id="CustomerAnaly" :option="option" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="table-content">
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
import { getCustomerconversionrate } from "@/api/CRMmanagement/instrumentPanel/index";
import selectdate from "../components/selectdate";
import selectdepartment from "../components/selectdepartment";
export default {
  components: {
    selectdate,
    selectdepartment
  },
  data() {
    return {
      headerCellStyle: {
        backgroundColor: '#f5f7fa',
        fontWeight: 'bold'
      },
      datas: [],
      listLoading: false,
      tableList: [],
      dataForm: {
        startTime: "",
        endTime: "",
        type: "year",
        userIds: [],
        chart: '3'
      },
      optionschart: [
        { label: '线条', value: '1' },
        { label: '饼状图', value: '2' },
        { label: '柱状图', value: '3' }
      ],
      chartInstance: null,
      option: {},
      columnsData: []
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
    // this.init()
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
    chartchange(val) {
      if (val == '1') {
        this.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b} : {c}%'
          },
          grid: {
            top: '10%',
            left: '1%',
            right: '1%',
            bottom: '15%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            },
            showTitle: false
          },
          color: ['#0052cc', '#42526e'],
          legend: {
            show: false
          },
          xAxis: [{
            type: 'category',
            show: true,
            data: this.datas.map(item => item.type),
            axisTick: {
              show: false
            }
          }],
          yAxis: [{
            type: 'value',
            max: 100,
            splitNumber: 5,
            axisLabel: {
              formatter: '{value}%'
            },
            axisLine: {
              show: false
            }
          }],
          series: [
            {
              name: '客户转化率',
              data: this.datas.map(item => item.dealCustomerRate),
              type: 'line',
              smooth: true
            }
          ]
        }
      } else if (val == '2') {
        this.option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            show: true,
            orient: 'horizontal',
            bottom: "10",
            type: "scroll"
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            },
            showTitle: false
          },
          xAxis: [{
            show: false
          }],
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: this.datas.map(item => {
                return {
                  value: item.dealCustomerRate, name: item.type
                }
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      } else {
        this.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b} : {c}%'
          },
          grid: {
            top: '10%',
            left: '1%',
            right: '1%',
            bottom: '15%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            },
            showTitle: false
          },
          color: ['#42526e', '#0052cc'],
          legend: {
            show: false
          },
          xAxis: [
            {
              type: 'category',
              show: true,
              data: this.datas.map(item => item.type),
              axisTick: {
                alignWithLabel: true,
                show: false
              }
            }
          ],
          yAxis: [
            {
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              type: 'value',
              max: 100,
              splitNumber: 5,
              axisLabel: {
                formatter: '{value}%'
              }
            }
          ],
          series: [
            {
              name: '客户转化率',
              barWidth: '20%',
              type: 'bar',
              data: this.datas.map(item => item.dealCustomerRate)
            }
          ]
        }
      }
    },
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
      this.listLoading = true
      getCustomerconversionrate(this.dataForm).then(res => {
        this.option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b} : {c}%'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            },
            showTitle: false
          },
          grid: {
            top: '10%',
            left: '1%',
            right: '1%',
            bottom: '15%',
            containLabel: true
          },
          color: ['#42526e', '#0052cc'],
          legend: {
            show: false
          },
          xAxis: [
            {
              type: 'category',
              show: true,
              data: res.data.map(item => item.type),
              axisTick: {
                alignWithLabel: true,
                show: false
              }
            }
          ],
          yAxis: [
            {
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              type: 'value',
              max: 100,
              splitNumber: 5,
              axisLabel: {
                formatter: '{value}%'
              }
            }
          ],
          series: [
            {
              name: '客户转化率',
              barWidth: '20%',
              type: 'bar',
              data: res.data.map(item => item.dealCustomerRate)
            }
          ]
        }
        this.datas = res.data
        this.listLoading = false
        this.init()
      }).catch(() => {
        this.listLoading = false
      })
    },
    init() {
      const _this = this
      const columnObj1 = {}
      _this.tableList = []
      _this.columnsData = []
      columnObj1.label = '日期'
      columnObj1.prop = 'title'
      _this.columnsData.push(columnObj1)
      _this.tableList.push({ 'title': '转化率' })
      _this.tableList.push({ 'title': '成交客户数' })
      _this.tableList.push({ 'title': '新增客户数' })
      var props = 'prop'
      _this.datas.forEach((item, index) => {
        const columnObj = {}
        columnObj.label = item.type
        columnObj.prop = props + index
        _this.columnsData.push(columnObj)
        _this.$set(_this.tableList[0], columnObj.prop, item.dealCustomerRate)
        _this.$set(_this.tableList[1], columnObj.prop, item.dealCustomerNum)
        _this.$set(_this.tableList[2], columnObj.prop, item.customerNum)
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
  .select-chart {
    width: 120px;
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