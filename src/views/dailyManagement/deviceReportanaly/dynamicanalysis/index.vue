<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="group-container-body section">
        <div class="react-grid-layout" style="height: 220px;position: relative;background: #fff;">
          <div style="height: 65px;position: absolute;transform: translate(10px, 10px);width: 100%;">
            <div class="dash-container has-hover">
              <div class="dash-rich-text">
                <div class="rich-text-content">设备动态看板</div>
              </div>
            </div>
          </div>
          <div style="height: 125px;position: absolute;bottom: 20px;left: 10px;width: calc(50% - 10px);">
            <div class="dash-container has-hover">
              <div class="speedy-entry-wrapper">
                <ul class="entry-lists">
                  <li v-for="item in flexlist" :key="item.label">
                    <div class="node-wrapper"><img :src="item.icon" alt=""><span style="margin-left: 10px;">{{item.label}}</span></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div style="height: 125px;position: absolute;bottom: 20px;right: 0;width: calc(50% - 10px);">
            <div class="dash-container has-hover">
              <div class="speedy-entry-wrapper">
                <ul class="entry-lists">
                  <li v-for="item in rightflexlist" :key="item.label">
                    <div class="node-wrapper"><img :src="item.icon" alt=""><span style="margin-left: 10px;">{{item.label}}</span></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="JNPF-common-layout-center JNPF-flex-main" style="margin-top: 10px;background-color: #fff;">
        <el-tabs type="border-card" style="height: 100%;">
          <el-tab-pane label="设备台账">
            <div class="JNPF-common-layout">
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
                <div class="JNPF-common-layout-main JNPF-flex-main">
                  <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" fixedNO custom-column>
                    <el-table-column prop="departmentIdName" label="申请部门" width="120" />
                    <el-table-column prop="applicantIdName" label="申请人" width="120"></el-table-column>
                    <el-table-column prop="applicantTime" label="申请日期" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="reasonScrapping" label="报废理由" min-width="200"></el-table-column>
                    <el-table-column prop="approvalStatus" label="审批状态" width="120" fixed="right" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'"><el-tag type="success">审批通过</el-tag></div>
                        <div v-else-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'"><el-tag type="warning">审批中</el-tag></div>
                        <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'"><el-tag type="danger">审批拒绝</el-tag></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="reasonRejection" label="驳回理由" min-width="200"></el-table-column>
                    <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="documentStatus" label="单据状态" width="120" fixed="right" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                        <div v-else-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="submitDate" label="提交时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                  </JNPF-table>
                  <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData" />
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设备概况">
            <div class="JNPF-common-layout">
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
                <div class="JNPF-common-layout-main JNPF-flex-main">
                  <div class="vux-flexbox container-content vux-flex-row">
                    <div class="left-content">
                      <div class="react-grid-item dash-container has-hover" v-for="item in datalist" :key="item.id">
                        <div class="container-header">{{item.name}}</div>
                        <div class="metric-view">
                          <div class="text-line">
                            <span style="font-size:34px;margin-right: 5px;">{{item.value}}</span>
                            <span>{{item.unit}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="right-content"></div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="点检分布">点检分布</el-tab-pane>
          <el-tab-pane label="维修分布">维修分布</el-tab-pane>
          <el-tab-pane label="保养分布">保养分布</el-tab-pane>
        </el-tabs>
      </div>
      <!--  -->
      <!-- <div class="JNPF-common-layout-center JNPF-flex-main" style="overflow: auto;margin-top: 10px;">
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
      </div> -->
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
      total: 0,
      listLoading: false,
      tableData: [],
      flexlist: [
        { label: '设备档案', icon: require('./imgs/shebei.png') },
        { label: '设备点检单', icon: require('./imgs/dianjian.png') },
        { label: '设备巡检单', icon: require('./imgs/xunjian.png') },
        { label: '设备维修单', icon: require('./imgs/weixiu.png') },
        { label: '保养计划表', icon: require('./imgs/baoyangbiao.png') },
        { label: '设备保养单', icon: require('./imgs/baoyangdan.png') }
      ],
      rightflexlist: [
        { label: '设备动态看板', icon: require('./imgs/sbdt.png') },
        { label: '点检统计看板', icon: require('./imgs/djtj.png') },
        { label: '巡检统计看板', icon: require('./imgs/xjtj.png') },
        { label: '维修统计看板', icon: require('./imgs/wxtj.png') },
        { label: '保养统计看板', icon: require('./imgs/bytj.png') },
        { label: '备件库存看板', icon: require('./imgs/bjtj.png') }
      ],
      datalist: [
        { name: '累计点检次数', unit: '次', id: 'inspectionNum', value: '0' },
        { name: '累计报废数量', unit: '个', id: 'scrappingNum', value: '0' },
        { name: '累计报修次数', unit: '次', id: 'repairNum', value: '0' },
        { name: '累计保养次数', unit: '次', id: 'maintenanceNum', value: '0' }
      ],
      loadingfactoryFloorid: false,
      chartlistLoading: false,
      leftlistLoading: false,
      rightlistLoading: false,
      deliveryDateArr: [],
      mountedPlacesList: [],
      factoryFloorList: [],
      listQuery: {
        pageNum: 1,
        pageSize: 20,
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
::v-deep .el-tabs--border-card > .el-tabs__content {
  height: calc(100% - 38px);
  padding: 0;
  .el-tab-pane {
    height: 100%;
  }
}
.dash-container.has-hover:hover {
  box-shadow: 0 6px 14px 0 rgba(84, 48, 132, 0.15) !important;
}
.group-container-body {
  .dash-rich-text {
    width: 100%;
    height: 100%;
    padding: 10px 0 10px 10px;
    width: 100%;
    .rich-text-content {
      word-wrap: break-word;
      background: 0 0;
      height: 100%;
      overflow: auto;
      padding-right: 10px;
      word-break: break-word;
      text-align: center;
      line-height: 1.5;
      font-weight: bold;
      font-size: 28px;
      color: rgb(237, 237, 239);
    }
  }
  .speedy-entry-wrapper {
    height: 100%;
    overflow: hidden;
    padding: 8px 10px;
    width: 100%;
    .entry-lists {
      display: flex;
      flex-wrap: wrap;
      li {
        border-radius: 2px;
        cursor: pointer;
        display: inline-block;
        text-align: center;
        list-style-type: none;
        width: calc(33% - 12px);
        margin: 4px 6px;
        .node-wrapper {
          -webkit-box-align: center;
          align-items: center;
          border: 1px solid transparent;
          border-radius: 4px;
          display: flex;
          height: 46px;
          overflow: hidden;
          padding: 10px 12px;
        }
        .node-wrapper:hover {
          background-color: #f5f6f8;
        }
      }
    }
  }
}
.container-content {
  padding: 5px;
  height: 320px;
  .left-content {
    display: flex;
    flex-wrap: wrap;
  }
  .react-grid-item {
    margin: 0 5px;
    height: 155px;
    width: calc(50% - 10px);
    .metric-view {
      -webkit-box-align: center;
      -webkit-box-pack: center;
      align-items: center;
      display: flex;
      height: calc(100% - 40px);
      justify-content: center;
      padding: 0 15px;
      .text-line {
        justify-content: center;
        -webkit-box-flex: 1;
        -webkit-box-align: baseline;
        -webkit-box-pack: start;
        align-items: baseline;
        color: #000;
        display: flex;
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.container-header {
  text-align: center;
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