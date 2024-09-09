<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="el-tabs__headermain">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="员工客户成交周期" name="ygkhcjzq">
            <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
              <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
                <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
                <div class="text-one-line">员工客户成交周期分析</div>
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
                <div class="content-title">员工客户成交周期（根据合同下单时间和客户创建时间计算）</div>
                <div id="CustomerAnaly" :option="option" style="width: 100%; height: 400px;"></div>
              </div>
              <div class="table-content" v-loading="listLoading">
                <div class="handle-bar">
                  <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download" @click="exportForm" :disabled="!tableList.length">导出</el-button>
                </div>
                <div style="height: 400px;">
                  <JNPF-table ref="tabForm" show-summary :summary-method="getSummaries" :data="tableList" custom-column row-key="id" :hasNO="false" style="border:1px solid #ebeef5;border-right:none;">
                    <el-table-column prop="realName" label="姓名" min-width="120" />
                    <el-table-column prop="cycle" label="平均成交周期(天)" min-width="150" />
                    <el-table-column prop="customerNum" label="成交客户数" min-width="150" />
                  </JNPF-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="地区成交周期" name="dqcjzq">
            <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
              <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
                <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
                <div class="text-one-line">地区成交周期分析</div>
              </div>
              <div class="xr-radio-menu-wrap" style="width: 250px;">
                <selectdate @change="datechange2"></selectdate>
              </div>
              <div class="xr-radio-menu-wrap">
                <selectdepartment @change="departmentchange2"></selectdepartment>
              </div>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
            </div>
            <div class="content-table-main">
              <div class="axis-content" v-loading="chartLoading">
                <div class="content-title">地区成交周期（根据合同下单时间和客户创建时间计算）</div>
                <div id="CustomerAnaly2" :option="option2" style="width: 100%; height: 400px;"></div>
              </div>
              <div class="table-content" v-loading="listLoading">
                <div class="handle-bar">
                  <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download" @click="exportForm2" :disabled="!tableList2.length">导出</el-button>
                </div>
                <div style="height: 400px;">
                  <JNPF-table ref="tabForm2" show-summary :summary-method="getSummaries" :data="tableList2" custom-column row-key="id" :hasNO="false" style="border:1px solid #ebeef5;border-right:none;">
                    <el-table-column prop="type" label="地区" min-width="120" />
                    <el-table-column prop="cycle" label="平均成交周期(天)" min-width="150" />
                    <el-table-column prop="customerNum" label="成交客户数" min-width="150" />
                  </JNPF-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="产品成交周期" name="cpcjzq">
            <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
              <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
                <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
                <div class="text-one-line">产品成交周期分析</div>
              </div>
              <div class="xr-radio-menu-wrap" style="width: 250px;">
                <selectdate @change="datechange3"></selectdate>
              </div>
              <div class="xr-radio-menu-wrap">
                <selectdepartment @change="departmentchange3"></selectdepartment>
              </div>
              <el-button type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
            </div>
            <div class="content-table-main">
              <div class="axis-content" v-loading="chartLoading">
                <div class="content-title">产品成交周期（根据合同下单时间和客户创建时间计算）</div>
                <div id="CustomerAnaly3" :option="option3" style="width: 100%; height: 400px;"></div>
              </div>
              <div class="table-content" v-loading="listLoading">
                <div class="handle-bar">
                  <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download" @click="exportForm3" :disabled="!tableList3.length">导出</el-button>
                </div>
                <div style="height: 400px;">
                  <JNPF-table show-summary :summary-method="getSummaries" :data="tableList3" custom-column row-key="id" :hasNO="false" style="border:1px solid #ebeef5;border-right:none;">
                    <el-table-column prop="productName" label="产品名称" min-width="120" />
                    <el-table-column prop="cycle" label="平均成交周期(天)" min-width="150" />
                    <el-table-column prop="customerNum" label="成交客户数" min-width="150" />
                  </JNPF-table>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" :exportHidden="true" />
    <ExportForm v-if="exportFormVisible2" ref="exportForm2" @download="download2" :exportHidden="true" />
    <ExportForm v-if="exportFormVisible3" ref="exportForm3" @download="download3" :exportHidden="true" />
  </div>
</template>

<script>
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { mapGetters } from 'vuex'
import { getcustomerRecordStats, getproductCycle, getcustomerRecordInfo, getemployeeCycle, getemployeeCycleInfo, getdistrictCycle } from "@/api/CRMmanagement/instrumentPanel/index";
import selectdate from "../components/selectdate";
import selectdepartment from "../components/selectdepartment";
export default {
  components: {
    ExportForm,
    selectdate,
    selectdepartment
  },
  data() {
    return {
      exportFormVisible: false,
      exportFormVisible2: false,
      exportFormVisible3: false,
      activeName: 'ygkhcjzq',
      chartLoading: false,
      listLoading: false,
      dataForm: {
        startTime: "",
        endTime: "",
        type: "year",
        userIds: []
      },
      dataForm2: {
        startTime: "",
        endTime: "",
        type: "year",
        userIds: []
      },
      dataForm3: {
        startTime: "",
        endTime: "",
        type: "year",
        userIds: []
      },
      tableList: [],
      tableList2: [],
      tableList3: [],
      chartInstance: null,
      chartInstance2: null,
      chartInstance3: null,
      option: {},
      option2: {},
      option3: {},
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.dataForm.userIds = [this.userInfo.userId]
    this.dataForm2.userIds = [this.userInfo.userId]
    this.dataForm3.userIds = [this.userInfo.userId]
    this.initData('ygkhcjzq')
  },
  beforeDestroy() {
    window.onresize = null
  },
  methods: {
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tabForm.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.dataForm,
          exportType: '1215',
          exportName: '员工客户成交周期分析',
          includeFieldMap,
          pageSize: -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    // 导出
    exportForm2() {
      this.exportFormVisible2 = true
      let columnList = this.$refs.tabForm2.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm2.init(columnList) })
    },
    download2(data) {
      if (data) {
        this.exportFormVisible2 = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.dataForm2,
          exportType: '1218',
          exportName: '地区成交周期分析',
          includeFieldMap,
          pageSize: -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    // 导出
    exportForm3() {
      this.exportFormVisible3 = true
      let columnList = this.$refs.tabForm3.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm3.init(columnList) })
    },
    download3(data) {
      if (data) {
        this.exportFormVisible3 = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.dataForm3,
          exportType: '1219',
          exportName: '产品成交周期分析',
          includeFieldMap,
          pageSize: -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    // 切换table
    handleClick(tab, event) {
      this.initData(tab.name)
    },
    search() {
      this.initData(this.activeName)
    },
    datechange(data) {
      this.dataForm.startTime = data.dateStart
      this.dataForm.endTime = data.dateEnd
      this.dataForm.type = data.value
    },
    departmentchange(data) {
      this.dataForm.userIds = data
    },
    datechange2(data) {
      this.dataForm2.startTime = data.dateStart
      this.dataForm2.endTime = data.dateEnd
      this.dataForm2.type = data.value
    },
    departmentchange2(data) {
      this.dataForm2.userIds = data
    },
    datechange3(data) {
      this.dataForm3.startTime = data.dateStart
      this.dataForm3.endTime = data.dateEnd
      this.dataForm3.type = data.value
    },
    departmentchange3(data) {
      this.dataForm3.userIds = data
    },
    initData(val) {
      this.chartLoading = false
      this.listLoading = true
      if (val == 'ygkhcjzq') {
        this.$nextTick(() => {
          this.chartInstance = this.$echarts.init(document.getElementById('CustomerAnaly'));
        })
        getemployeeCycle(this.dataForm).then(res1 => {
          this.option = {
            // title: {
            //   text: '员工客户成交周期（根据合同下单时间和客户创建时间计算）',
            //   textStyle: {
            //     fontWeight: "normal"
            //   },
            //   padding: [0, 40, 8, 40]
            // },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
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
              right: '3%',
              bottom: '15%',
              containLabel: true
            },
            color: ['#42526e', '#0052cc'],
            legend: {
              data: ['成交周期', '成交客户数'],
              bottom: 10
            },
            xAxis: [
              {
                type: 'category',
                data: res1.data.map(item => item.type),
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
                name: '成交周期',
                axisLabel: {
                  formatter: '{value} 天'
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
                name: '成交客户数',
                axisLabel: {
                  formatter: '{value} 个'
                },
                minInterval: 1
              }
            ],
            series: [
              {
                barWidth: '20%',
                name: '成交周期',
                type: 'bar',
                data: res1.data.map(item => item.cycle)
              },
              {
                barWidth: '20%',
                name: '成交客户数',
                yAxisIndex: 1,
                type: 'bar',
                data: res1.data.map(item => item.customerNum)
              }
            ]
          }
          this.chartInstance.setOption(this.option);
          window.onresize = () => {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              this.chartInstance.resize()
            }, 100);
          }
          this.chartLoading = false
        }).catch((error) => {
          this.chartLoading = false
        })
        getemployeeCycleInfo(this.dataForm).then(res2 => {
          this.tableList = res2.data
          this.listLoading = false
        }).catch((error) => {
          this.listLoading = false
        })
      } else if (val == 'dqcjzq') {
        this.$nextTick(() => {
          this.chartInstance2 = this.$echarts.init(document.getElementById('CustomerAnaly2'));
        })
        getdistrictCycle(this.dataForm2).then(res1 => {
          this.option2 = {
            // title: {
            //   text: '地区成交周期（根据合同下单时间和客户创建时间计算）',
            //   textStyle: {
            //     fontWeight: "normal"
            //   },
            //   padding: [0, 40, 8, 40]
            // },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
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
              right: '3%',
              bottom: '15%',
              containLabel: true
            },
            color: ['#42526e', '#0052cc'],
            legend: {
              data: ['成交周期', '成交客户数'],
              bottom: 10
            },
            xAxis: [
              {
                type: 'category',
                data: res1.data.map(item => item.type),
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
                name: '成交周期',
                axisLabel: {
                  formatter: '{value} 天'
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
                name: '成交客户数',
                axisLabel: {
                  formatter: '{value} 个'
                },
                minInterval: 1
              }
            ],
            series: [
              {
                barWidth: '20%',
                name: '成交周期',
                type: 'bar',
                data: res1.data.map(item => item.cycle)
              },
              {
                barWidth: '20%',
                name: '成交客户数',
                yAxisIndex: 1,
                type: 'bar',
                data: res1.data.map(item => item.customerNum)
              }
            ]
          }
          this.chartInstance2.setOption(this.option2);
          window.onresize = () => {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              this.chartInstance2.resize()
            }, 100);
          }
          this.tableList2 = res1.data
          this.listLoading = false
          this.chartLoading = false
        }).catch((error) => {
          this.listLoading = false
          this.chartLoading = false
        })
      } else if (val == 'cpcjzq') {
        this.$nextTick(() => {
          this.chartInstance3 = this.$echarts.init(document.getElementById('CustomerAnaly3'));
        })
        getproductCycle(this.dataForm3).then(res1 => {
          this.option3 = {
            // title: {
            //   text: '产品成交周期（根据合同下单时间和客户创建时间计算）',
            //   textStyle: {
            //     fontWeight: "normal"
            //   },
            //   padding: [0, 40, 8, 40]
            // },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
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
              right: '3%',
              bottom: '15%',
              containLabel: true
            },
            color: ['#42526e', '#0052cc'],
            legend: {
              data: ['成交周期', '成交客户数'],
              bottom: 10
            },
            xAxis: [
              {
                type: 'category',
                data: res1.data.map(item => item.productName),
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
                name: '成交周期',
                axisLabel: {
                  formatter: '{value} 天'
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
                name: '成交客户数',
                axisLabel: {
                  formatter: '{value} 个'
                },
                minInterval: 1
              }
            ],
            series: [
              {
                barWidth: '20%',
                name: '成交周期',
                type: 'bar',
                data: res1.data.map(item => item.cycle)
              },
              {
                barWidth: '20%',
                name: '成交客户数',
                yAxisIndex: 1,
                type: 'bar',
                data: res1.data.map(item => item.customerNum)
              }
            ]
          }
          this.chartInstance3.setOption(this.option3);
          window.onresize = () => {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              this.chartInstance3.resize()
            }, 100);
          }
          this.tableList3 = res1.data
          this.listLoading = false
          this.chartLoading = false
        }).catch((error) => {
          this.listLoading = false
          this.chartLoading = false
        })
      }
    },
    // 合计处理
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        let arr = this.activeName == 'ygkhcjzq' ? this.tableList : this.activeName == 'dqcjzq' ? this.tableList2 : this.tableList3
        const values = arr.map(item => item[column.property] ? Number(item[column.property]) : item[column.property] == '0' ? 0 : '');
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          });
          // sums[index] += '';
        } else {
          sums[index] = null;
        }
      });
      return sums;
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}
::v-deep .el-tabs__header {
  padding: 0 !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}
::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
.JNPF-flex-main {
  padding: 14px 0 0 14px;
  .el-tabs__headermain {
    height: 100%;
    padding: 0 14px 0 0;
    position: relative;
    margin: 0 0 15px 0;
    ::v-deep .el-tab-pane {
      height: 100%;
    }
    ::v-deep .el-tabs--top {
      height: 100%;
    }
    ::v-deep .el-tabs__content {
      height: 100%;
    }
  }
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
  height: calc(100% - 100px);
  padding-bottom: 24px;
  margin-top: 24px;
  overflow-y: auto;
  .axis-content {
    margin-right: 40px;
    margin-bottom: 24px;
    .content-title {
      padding: 8px 40px;
      font-size: 16px;
    }
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