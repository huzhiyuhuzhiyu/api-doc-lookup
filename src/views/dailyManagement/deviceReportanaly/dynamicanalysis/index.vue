<template>
  <div class="JNPF-common-layout crmDashboard">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.factoryFloorid" filterable placeholder="请选择车间" @focus="focusfactoryFloor" clearable :loading="loadingfactoryFloorid">
                <el-option v-for="item in factoryFloorList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.mountedPlacesid" filterable placeholder="请选择安装地点" @focus="focusfactoryFloor" clearable :loading="loadingfactoryFloorid">
                <el-option v-for="item in mountedPlacesList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-center JNPF-flex-main" style="overflow: auto;">
        <div class="vux-flexbox section vux-flex-row">
          <div class="left" v-loading="leftlistLoading">
            <div class="left-content">
              <div class="content-item" v-for="item in datalist" :key="item.id">
                <div class="container-header text">
                  <div class="header-title">{{item.name}}</div>
                </div>
                <div class="show-raw-data">
                  <div class="content-wrapper">
                    <span>{{item.value}}</span>
                    <span>{{item.unit}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right" v-loading="rightlistLoading">
            <div class="right-content">
              <div class="container-header text">
                <div class="header-title">设备状态分布</div>
              </div>
              <div class="new-engine-chart">
                <div id="equipmentstatus" :option="option" style="width: 100%; height: 100%;"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="vux-flexbox cssTransforms vux-flex-row" v-loading="chartlistLoading">
          <div class="dash-container" v-for="item in datasetList" :key="item.id">
            <div class="container-header text">
              <div class="header-title">{{item.name}}</div>
            </div>
            <div class="new-engine-chart">
              <chart :id="item.id" :option="item.option"></chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getequMountedPlaces, gettotalOverview, gettotalEquStats, getequReporttotalNum } from "@/api/basicData/materialSettings";
import chart from "@/views/dailyManagement/deviceReportanaly/components/chart.vue";
export default {
  components: { chart },
  data() {
    return {
      loadingfactoryFloorid: false,
      chartlistLoading: false,
      leftlistLoading: false,
      rightlistLoading: false,
      deliveryDateArr: [],
      mountedPlacesList: [],
      factoryFloorList: [],
      listQuery: {
        factoryFloorid: '',
        mountedPlacesid: '',
        maintenanceType: '',
        classAttribute: "equipment"
      },
      datasetList: [
        { name: '点检设备数量分布', id: 'inspectionquipment', option: {} },
        { name: '维修设备数量分布', id: 'maintenanceequipment', option: {} },
        { name: '报废设备数量分布', id: 'scrapequipment', option: {} },
        { name: '保养设备数量分布', id: 'serviceequipment', option: {} }
      ],
      chartInstance: null,
      timeout: null,
      option: {},
      datalist: [
        { name: '累计点检次数', unit: '次', id: 'inspectionNum', value: '0' },
        { name: '累计报废数量', unit: '个', id: 'scrappingNum', value: '0' },
        { name: '累计报修次数', unit: '次', id: 'repairNum', value: '0' },
        { name: '累计保养次数', unit: '次', id: 'maintenanceNum', value: '0' }
      ],
    }
  },
  mounted() {
    this.chartInstance = this.$echarts.init(document.getElementById('equipmentstatus'));
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
  created() {
    this.initData()
  },
  methods: {
    focusfactoryFloor() {
      let obj = {
        pageNum: 1,
        pageSize: -1,
      }
      this.loadingfactoryFloorid = true
      getequMountedPlaces(obj).then(res => {
        this.factoryFloorList = res.data.records.filter(item => item.type == 'workshop')
        this.mountedPlacesList = res.data.records.filter(item => item.type == 'location')
        this.loadingfactoryFloorid = false
      })
    },
    reset() {
      this.listQuery = {
        factoryFloorid: '',
        mountedPlacesid: '',
        maintenanceType: '',
        classAttribute: "equipment"
      }
      this.search()
    },
    search() {
      this.initData()
    },
    initData() {
      this.leftlistLoading = true
      gettotalOverview(this.listQuery).then(res => {
        this.datalist.forEach(item => {
          item.value = res.data[item.id]
        })
        this.leftlistLoading = false
      }).catch(() => {
        this.leftlistLoading = false
      })
      this.rightlistLoading = true
      gettotalEquStats(this.listQuery).then(res => {
        this.option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            top: 'middle',
            left: 'right'
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '80%'],
              avoidLabelOverlap: false,
              label: {
                formatter: '{c} ({d}%)'
              },
              data: res.data.map(item => {
                return { value: item.totalNum, name: item.totalName }
              })
            }
          ]
        }
        this.rightlistLoading = false
      }).catch(() => {
        this.rightlistLoading = false
      })
      this.chartlistLoading = true
      this.datasetList.forEach(item => {
        if (item.id == 'inspectionquipment') {
          this.listQuery.maintenanceType = 'inspection'
        } else if (item.id == 'maintenanceequipment') {
          this.listQuery.maintenanceType = 'repair'
        } else if (item.id == 'scrapequipment') {
          this.listQuery.maintenanceType = 'discard'
        } else {
          this.listQuery.maintenanceType = 'maintenance'
        }
        const querylist = { ...this.listQuery }
        getequReporttotalNum(querylist).then(res => {
          item.option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              top: '10%',
              left: '1%',
              right: '1%',
              bottom: '15%',
              containLabel: true
            },
            color: ['#0052cc'],
            legend: {
              data: ['设备数量'],
              bottom: 10
            },
            xAxis: [
              {
                type: 'category',
                data: res.data.map(item => item.totalName),
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
                minInterval: 1
              }
            ],
            series: [
              {
                barWidth: '30%',
                name: '设备数量',
                type: 'bar',
                data: res.data.map(item => item.totalNum)
              }
            ]
          }
          this.chartlistLoading = false
        }).catch(() => {
          this.chartlistLoading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container-header {
  font-weight: 400;
  height: 40px;
  line-height: 30px;
  padding: 5px;
  box-sizing: border-box;
  .header-title {
    overflow: hidden;
    padding: 0 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.new-engine-chart {
  flex: 1;
  padding: 0 10px;
}
.section {
  min-width: 1080px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 3px 5px rgba(13, 20, 36, 0.18), 0 0 1px rgba(13, 20, 36, 0.29);

  .left {
    width: calc(40% - 5px);
    .left-content {
      display: flex;
      flex-wrap: wrap;
      .content-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
        margin-bottom: 15px;
        .show-raw-data {
          height: 105px;
          line-height: 105px;
          display: flex;
          justify-content: center;
          padding: 0 15px;
          .content-wrapper {
            overflow: hidden;
            span {
              padding-left: 5px;
              font-size: 16px;
            }
            span:first-child {
              padding-left: 0;
              font-size: 30px;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
  .right {
    margin-left: 10px;
    width: calc(60% - 5px);
    .right-content {
      height: 320px;
      display: flex;
      flex-direction: column;
    }
  }
}
.cssTransforms {
  min-width: 1080px;
  flex-wrap: wrap;
  .dash-container {
    margin-top: 10px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 3px 5px rgba(13, 20, 36, 0.18), 0 0 1px rgba(13, 20, 36, 0.29);
    height: 390px;
    width: calc(50% - 5px);
    &:nth-child(even) {
      margin-left: 10px;
    }
    display: flex;
    flex-direction: column;
  }
}
</style>