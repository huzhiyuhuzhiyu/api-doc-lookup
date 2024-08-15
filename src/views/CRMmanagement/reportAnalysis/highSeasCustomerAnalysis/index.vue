<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
        <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
          <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
          <div class="text-one-line">公海客户分析</div>
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
          <div class="handle-bar">
            <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download">导出</el-button>
          </div>
          <div style="height: 400px;">
            <JNPF-table ref="tabForm" show-summary :summary-method="getSummaries" :data="tableList" custom-column row-key="id" :hasNO="false" style="border:1px solid #ebeef5;border-right:none;">
              <el-table-column prop="realName" label="姓名" min-width="120" />
              <el-table-column prop="deptName" label="部门" min-width="120" />
              <el-table-column prop="receiveNum" label="公海池领取客户数" min-width="160" />
              <el-table-column prop="putInNum" label="进入公海客户数" min-width="160" />
            </JNPF-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getpoolStats, getpoolTable } from "@/api/CRMmanagement/instrumentPanel/index";
import selectdate from "../components/selectdate";
import selectdepartment from "../components/selectdepartment";
export default {
  components: {
    selectdate,
    selectdepartment
  },
  data() {
    return {
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
      option: {},
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
      this.chartLoading = false
      this.listLoading = true
      getpoolStats(this.dataForm).then(res1 => {
        this.option = {
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
          color: ['#42526e', '#0052cc'],
          legend: {
            data: ['进入公海客户数', '公海池领取客户数'],
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
              name: '进入公海客户数',
              type: 'value',
              axisLabel: {
                formatter: '{value} 个'
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
              name: '公海池领取客户数',
              axisLabel: {
                formatter: '{value} 次'
              },
              minInterval: 1
            }
          ],
          series: [
            {
              barWidth: '20%',
              name: '进入公海客户数',
              type: 'bar',
              data: res1.data.map(item => item.putInNum)
            },
            {
              barWidth: '20%',
              name: '公海池领取客户数',
              type: 'bar',
              yAxisIndex: 1,
              data: res1.data.map(item => item.receiveNum)
            }
          ]
        }
        this.chartLoading = false
      }).catch((error) => {
        this.chartLoading = false
      })
      getpoolTable(this.dataForm).then(res2 => {
        this.tableList = res2.data
        this.listLoading = false
      }).catch((error) => {
        this.listLoading = false
      })
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
        const values = this.tableList.map(item => item[column.property] ? Number(item[column.property]) : '');
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
    },
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