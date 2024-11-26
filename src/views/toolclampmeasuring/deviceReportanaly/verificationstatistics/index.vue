
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div style="overflow: auto;">
        <div class="group-container-body section has-hover">
          <div style="height: 65px;width: 100%;padding: 10px;">
            <div class="dash-rich-text">
              <div class="rich-text-content">检定统计分析</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px;min-width: 1080px;">
          <el-tabs type="border-card" style="height: 100%;" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="检定统计分析" name="djcsfx">
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
                            <el-input v-model="listQueryInspection.verificationAgency" placeholder="请输入检定机构" clearable @keyup.enter.native="search()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="listQueryInspection.actualMaintenanceIdText" placeholder="请输入实际执行人" clearable @keyup.enter.native="search()" />
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
                  <div style="height: 672px;" class="JNPF-flex-main">
                    <JNPF-table ref="dataTableInspection" v-loading="listLoadingInspection" :data="tableInspectionresults" fixedNO custom-column>
                      <el-table-column prop="verificationAgency" label="检定机构" width="200" sortable="custom" />
                      <el-table-column prop="departmentIdText" label="计划执行部门" width="150" />
                      <el-table-column prop="maintainerIdText" label="计划执行人" width="120"></el-table-column>
                      <el-table-column prop="planMaintenanceDate" label="计划检定日期" width="180" sortable="custom"></el-table-column>
                      <el-table-column prop="actualDepartmentIdText" label="实际执行部门" width="150" />
                      <el-table-column prop="actualMaintenanceIdText" label="实际执行人" width="120"></el-table-column>
                      <el-table-column prop="actualMaintenanceDate" label="实际检定日期" width="180" sortable="custom"></el-table-column>
                      <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                      <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
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
import { getmouthVerificationNum, getdailyVerificationNum, VerificationrecordsList } from '@/api/dailyManagement/Maintenance'
import card from "@/views/dailyManagement/deviceReportanaly/components/card.vue";
export default {
  name: 'verificationstatistics',
  components: { card, chart },
  data() {
    return {
      totalInspection: 0,
      tableInspectionresults: [],
      listLoadingInspection: false,
      listQueryInspection: {},
      listQuerytwo: {
        verificationAgency: '',
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
      total: 0,
      djchartbaroption: {},
      djchartlineoption: {},
      activeName: 'djcsfx'
    }
  },
  created() {
    this.listQueryInspection = JSON.parse(JSON.stringify(this.listQuerytwo))
    this.initDatachart()
  },
  methods: {
    //检定统计分析
    initDatachart() {
      let obj = {
        equipmentType: "tool"
      }
      getmouthVerificationNum(obj).then(res => {
        this.djchartlineoption = {
          title: {
            text: '每月检定次数',
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
              name: '检定次数',
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
      getdailyVerificationNum(obj).then(res => {
        this.djchartbaroption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          title: {
            text: '本月各工具检定次数',
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
              name: '工具数量',
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
      VerificationrecordsList(this.listQueryInspection).then(res => {
        this.tableInspectionresults = res.data.records
        this.totalInspection = res.data.total
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
    handleClick() { }
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
  background-image: url('~@/views/dailyManagement/deviceReportanaly/equipmenthome/imgs/tjbjt.png');
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