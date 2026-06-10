<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div style="overflow: auto;">
        <div class="group-container-body section has-hover">
          <div style="height: 65px;width: 100%;padding: 10px;">
            <div class="dash-rich-text">
              <div class="rich-text-content">工具领用归还分析</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px;min-width: 1080px;">
          <el-tabs type="border-card" style="height: 100%;" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="工具领用归还分析" name="djcsfx">
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
                            <el-input v-model="listQueryInspection.orderNo" placeholder="请输入单号" clearable @keydown.enter.native="search()" />
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
                    <JNPF-table ref="dataTableInspection" v-loading="listLoadingInspection" :data="tableInspectionresults" fixedNO custom-column customKey="JNPFTableKey_708432">
                      <el-table-column prop="requisitionType" label="状态" width="120" align="center">
                        <template slot-scope="scope">
                          <div v-if="scope.row.requisitionType == 'requisition'"><el-tag>领用</el-tag>
                          </div>
                          <div v-else-if="scope.row.requisitionType == 'back'"><el-tag type="success">归还</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="orderNo" label="单号" min-width="200">
                      </el-table-column>
                      <el-table-column prop="collectionTime" label="日期" min-width="180"></el-table-column>
                      <el-table-column prop="maintainerIdText" label="领用/归还人" min-width="120"></el-table-column>
                      <el-table-column prop="productName" label="工具名称" min-width="200"></el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="180"></el-table-column>
                      <el-table-column prop="createTime" label="创建时间" min-width="200"></el-table-column>
                      <el-table-column prop="createByName" label="创建人" min-width="120"></el-table-column>
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
import { getdailyRequisitionNum, getmouthRequisitionNum, CollectionandreturnList } from '@/api/dailyManagement/Maintenance'
import card from "@/views/dailyManagement/deviceReportanaly/components/card.vue";
export default {
  name:'toolcollectionreturn',
  components: { card, chart },
  data() {
    return {
      totalInspection: 0,
      tableInspectionresults: [],
      listLoadingInspection: false,
      listQueryInspection: {},
      listQuerytwo: {
        equipmentType: "tool",
        orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }],
        orderNo: "",
        pageNum: 1,
        pageSize: 20
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
    //领用归还分析
    initDatachart() {
      let obj = {
        equipmentType: "tool"
      }
      getmouthRequisitionNum(obj).then(res => {
        this.djchartlineoption = {
          title: {
            text: '每月领用归还数',
            textStyle: {
              fontWeight: '450',
              fontSize: 14
            },
            top: 8
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          // toolbox: {
          //   feature: {
          //     saveAsImage: {}
          //   },
          //   showTitle: false
          // },
          grid: {
            top: '23%',
            left: '3%',
            right: '3%',
            bottom: '2%',
            containLabel: true
          },
          color: ['#03a9f4', '#0052cc'],
          // legend: {
          //   data: ['领用次数', '归还次数'],
          //   bottom: 10
          // },
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
              name: '领用次数',
              axisLabel: {
                formatter: '{value} 次'
              },
              minInterval: 1
            },
            {
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              type: 'value',
              name: '归还次数',
              axisLabel: {
                formatter: '{value} 次'
              },
              minInterval: 1
            }
          ],
          series: [
            {
              barWidth: '20%',
              name: '领用次数',
              type: 'bar',
              barWidth: '20%',
              data: res.data.map(item => item.requisitionNum)
            },
            {
              barWidth: '20%',
              name: '归还次数',
              type: 'bar',
              barWidth: '20%',
              yAxisIndex: 1,
              data: res.data.map(item => item.backNum)
            }
          ]
        }
      })
      getdailyRequisitionNum(obj).then(res => {
        this.djchartbaroption = {
          title: {
            text: '本月各工具领用归还数',
            textStyle: {
              fontWeight: '450',
              fontSize: 14
            },
            top: 8
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          // toolbox: {
          //   feature: {
          //     saveAsImage: {}
          //   },
          //   showTitle: false
          // },
          grid: {
            top: '23%',
            left: '3%',
            right: '3%',
            bottom: '2%',
            containLabel: true
          },
          color: ['#03a9f4', '#0052cc'],
          // legend: {
          //   data: ['跟进客户数', '跟进次数'],
          //   bottom: 10
          // },
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
              name: '领用次数',
              axisLabel: {
                formatter: '{value} 次'
              },
              minInterval: 1
            },
            {
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              type: 'value',
              name: '归还次数',
              axisLabel: {
                formatter: '{value} 次'
              },
              minInterval: 1
            }
          ],
          series: [
            {
              barWidth: '20%',
              name: '领用次数',
              type: 'bar',
              barWidth: '20%',
              data: res.data.map(item => item.requisitionNum)
            },
            {
              barWidth: '20%',
              name: '归还次数',
              type: 'bar',
              barWidth: '20%',
              yAxisIndex: 1,
              data: res.data.map(item => item.backNum)
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
      CollectionandreturnList(this.listQueryInspection).then(res => {
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