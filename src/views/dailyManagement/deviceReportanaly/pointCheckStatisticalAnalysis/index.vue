<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div style="overflow: auto;">
        <div class="group-container-body section has-hover">
          <div style="height: 65px;width: 100%;padding: 10px;">
            <div class="dash-rich-text">
              <div class="rich-text-content">点检统计分析</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px;min-width: 1080px;">
          <el-tabs type="border-card" style="height: 100%;" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="点检概况" name="djgk">
              <div class="statistical">
                <div class="analysis-content">
                  <card class="card-item" bodyheight="240px" title="今日已检分布（台）" :datalist="datalistChecked"></card>
                  <card class="card-item" bodyheight="240px" title="今日各设备点检次数" :datalist="datalistInspection"></card>
                </div>
                <div class="table-content">
                  <div style="margin-top: 15px;">
                    <el-row :gutter="16">
                      <el-form @submit.native.prevent>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="listQuery.equipmentIdCode" placeholder="请输入设备编码" clearable @keydown.enter.native="search()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="listQuery.equipmentIdName" placeholder="请输入设备名称" clearable @keydown.enter.native="search()" />
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
                  </div>
                  <div style="height: 672px;" class="JNPF-flex-main" v-loading="listLoading">
                    <JNPF-table ref="dataTable" v-if="istable" :data="tableData" @sort-change="sortChange" fixedNO custom-column customKey="JNPFTableKey_900092">
                      <el-table-column prop="equipmentIdCode" label="设备编码" width="200" />
                      <el-table-column prop="equipmentIdName" label="设备名称" width="200" sortable="custom" />
                      <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                      <el-table-column prop="factoryFloor" label="使用车间" min-width="140" />
                      <el-table-column prop="mountedPlaces" label="安装地点" min-width="140" />
                      <!-- <el-table-column prop="cycle" label="周期" width="90" />
                      <el-table-column prop="unit" label="单位" width="90" /> -->
                      <el-table-column prop="departmentIdText" label="计划点检部门" width="150" />
                      <el-table-column prop="maintainerIdText" label="计划点检人" width="120"></el-table-column>
                      <el-table-column prop="planMaintenanceDate" label="计划点检日期" width="180" sortable="custom"></el-table-column>
                      <el-table-column prop="actualDepartmentIdText" label="实际点检部门" width="150" />
                      <el-table-column prop="actualMaintenanceIdText" label="实际点检人" width="120"></el-table-column>
                      <el-table-column prop="actualMaintenanceDate" label="实际点检日期" width="180" sortable="custom"></el-table-column>
                      <el-table-column prop="picList" label="点检拍照" min-width="160">
                        <template slot-scope="scope">
                          <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.picList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
                        </template>
                      </el-table-column>
                      <el-table-column prop="inspectionResults" label="点检结果" width="120" fixed="right" align="center">
                        <template slot-scope="scope">
                          <div v-if="scope.row.inspectionResults == 'normal'"><el-tag type="success">正常</el-tag></div>
                          <div v-else-if="scope.row.inspectionResults == 'abnormal'">
                            <el-tag type="danger">异常</el-tag>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="cycleType" label="周期类型" width="120" sortable="custom" fixed="right" align="center">
                        <template slot-scope="scope">
                          <div v-if="scope.row.cycleType == 'cycle'"><el-tag type="success">周期</el-tag></div>
                          <div v-else-if="scope.row.cycleType == 'disposable'">
                            <el-tag type="success">一次</el-tag>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                      <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                    </JNPF-table>
                    <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData" />
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="点检次数分析" name="djcsfx">
              <div class="inspectionnum">
                <div class="frequencychart">
                  <div class="chart-line has-hover">
                    <chart id="djchartline" :option="djchartlineoption"></chart>
                  </div>
                  <div class="chart-bar has-hover">
                    <chart id="djchartbar" :option="djchartbaroption"></chart>
                  </div>
                </div>
                <div class="frequency-table">
                  <div style="margin-top: 15px;">
                    <el-row :gutter="16">
                      <el-form @submit.native.prevent>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="listQueryInspection.totalCode" placeholder="请输入设备编码" clearable @keydown.enter.native="search()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="listQueryInspection.totalName" placeholder="请输入设备名称" clearable @keydown.enter.native="search()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchInspection()">
                              {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="resetInspection()">{{ $t('common.reset') }}
                            </el-button>
                          </el-form-item>
                        </el-col>
                      </el-form>
                    </el-row>
                  </div>
                  <div style="height: 672px;" class="JNPF-flex-main" v-loading="listLoadingInspection">
                    <JNPF-table ref="dataTableInspection" v-if="istable" :data="tableInspectionresults" fixedNO custom-column customKey="JNPFTableKey_424462">
                      <el-table-column prop="totalCode" label="设备编码" min-width="200" />
                      <el-table-column prop="totalName" label="设备名称" min-width="200" />
                      <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                      <el-table-column prop="normalNum" label="正常次数" min-width="140" />
                      <el-table-column prop="abnormalNum" label="异常次数" min-width="140" />
                    </JNPF-table>
                    <pagination :total="totalInspection" :page.sync="listQueryInspection.pageNum" :limit.sync="listQueryInspection.pageSize" @pagination="initDataInspection" />
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart from "@/views/dailyManagement/deviceReportanaly/components/chart.vue";
import { equMaintenanceList, inspectionMonthTotalchart, dailyMaintenanceNum, dailyEquMaintenanceNum, equMaintenanceTime } from '@/api/dailyManagement/Maintenance'
import { getdailyInspectionMonthTotal } from "@/api/basicData/materialSettings";
import card from "@/views/dailyManagement/deviceReportanaly/components/card.vue";
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],
  components: { card, chart },
  data() {
    return {
      istable: false,
      isProjectSwitch: '',
      totalInspection: 0,
      tableInspectionresults: [],
      listLoadingInspection: false,
      listQueryInspection: {},
      listQuerytwo: {
        totalName: '',
        totalCode: '',
        classAttribute: "equipment",
        recordType: 'inspection',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      datalistChecked: {},
      datalistInspection: {},
      total: 0,
      djchartbaroption: {},
      djchartlineoption: {},
      listLoading: false,
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      ],
      listQuery: {},
      activeName: 'djgk',
      listQueryone: {
        recordType: 'inspection',
        equipmentIdCode: '',
        equipmentIdName: '',
        actualMaintenanceIdText: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.istable = true
    this.listQuery = JSON.parse(JSON.stringify(this.listQueryone))
    this.listQueryInspection = JSON.parse(JSON.stringify(this.listQuerytwo))
    this.initDatadjgk()
  },
  methods: {
    //点检次数分析
    initDatachart() {
      let obj = {
        classAttribute: "equipment"
      }
      getdailyInspectionMonthTotal(obj).then(res => {
        this.djchartlineoption = {
          title: {
            text: '每日点检次数',
            textStyle: {
              fontWeight: '450',
              fontSize: 14
            },
            top: 12
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: res.data.map(item => item.totalName)
            }
          ],
          yAxis: [
            {
              type: 'value',
              minInterval: 1,
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              }
            }
          ],
          color: ['#307deb'],
          series: [
            {
              name: '点检次数',
              type: 'line',
              label: {
                show: true
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#3883ec' // 0% 处的颜色
                  }, {
                    offset: 1, color: '#fff' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              },
              emphasis: {
                focus: 'series'
              },
              smooth: true,
              data: res.data.map(item => item.totalNum)
            }
          ]
        }
      })
      inspectionMonthTotalchart(obj).then(res => {
        this.djchartbaroption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          title: {
            text: '本月各设备点检次数',
            textStyle: {
              fontWeight: '450',
              fontSize: 14
            },
            top: 12
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          color: ['#0052cc'],
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
              label: {
                show: true,
                position: 'top'
              },
              data: res.data.map(item => item.totalNum)
            }
          ]
        }
      })
      this.initDataInspection()
    },
    initDataInspection() {
      Object.keys(this.listQueryInspection).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQueryInspection[key]
        this.listQueryInspection[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoadingInspection = true
      equMaintenanceTime(this.listQueryInspection).then(res => {
        this.tableInspectionresults = res.data
        this.totalInspection = res.data.length
        this.listLoadingInspection = false
      }).catch(() => {
        this.listLoadingInspection = false
      })
    },
    resetInspection() {
      this.listQueryInspection = JSON.parse(JSON.stringify(this.listQuerytwo))
      this.$refs['dataTableInspection'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.searchInspection()
    },
    searchInspection() {
      this.listQueryInspection.pageNum = 1 // 重置页码
      this.initDataInspection()
    },
    //tab事件
    handleClick({ name }) {
      if (name == 'djgk') {
        this.initDatadjgk()
      } else {
        this.initDatachart()
      }
    },
    bigimg(url) {
      this.srcList[0] = url
    },
    initDatadjgk() {
      let obj = {
        classAttribute: "equipment",
        recordType: 'inspection'
      }
      dailyMaintenanceNum(obj).then(res => {
        this.datalistChecked = res.data
      })
      dailyEquMaintenanceNum(obj).then(res => {
        this.datalistInspection = res.data
      })
      this.initData()
    },
    reset() {
      this.listQuery = JSON.parse(JSON.stringify(this.listQueryone))
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.search()
    },
    search() {
      this.listQuery.pageNum = 1 // 重置页码
      this.initData()
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order !== "descending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      equMaintenanceList(this.listQuery).then(res => {
        this.tableData = res.data.records.map(item => {
          if (item.picList && item.picList.length) item.picList = item.picList.map(o => { return JSON.parse(`{${o}}`) })
          return item
        })
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.inspectionnum {
  .frequencychart {
    display: flex;
    justify-content: start;
    .chart-line {
      width: 60%;
      height: 292px;
    }
    .chart-bar {
      width: calc(40% - 10px);
      margin-left: 10px;
      height: 292px;
    }
  }
}
.statistical {
  .analysis-content {
    display: flex;
    justify-content: space-between;
    .card-item {
      width: calc(50% - 5px);
    }
  }
}
.has-hover:hover {
  box-shadow: 0 6px 14px 0 rgba(84, 48, 132, 0.15) !important;
}
.section {
  min-width: 1080px;
  background-color: #fff;
  border-radius: 3px;
}
.group-container-body {
  background-image: url('../equipmenthome/imgs/tjbjt.png');
  background-size: 100% 100%;
  .dash-rich-text {
    width: 100%;
    height: 100%;
    .rich-text-content {
      word-wrap: break-word;
      background: 0 0;
      height: 100%;
      overflow: auto;
      padding-right: 10px;
      word-break: break-word;
      text-align: center;
      font-weight: bold;
      line-height: 1.6;
      font-size: 28px;
      color: #fff;
    }
  }
}
</style>