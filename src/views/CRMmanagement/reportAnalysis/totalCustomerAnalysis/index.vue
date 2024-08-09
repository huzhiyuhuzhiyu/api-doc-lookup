<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
        <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
          <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
          <div class="text-one-line">客户总量分析</div>
        </div>
        <div class="xr-radio-menu-wrap">
          <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="xr-radio-menu-wrap">
          <el-select v-model="value1" placeholder="请选择">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" icon="el-icon-search" @click="search()">
          {{ $t('common.search') }}</el-button>
      </div>
      <div class="content-table-main">
        <div class="axis-content">
          <div id="CustomerAnaly" :option="option" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="table-content">
          <div class="handle-bar">
            <el-button type="primary" size="mini" v-has="'btn_export'" icon="el-icon-download">导出</el-button>
          </div>
          <div style="height: 400px;">
            <JNPF-table ref="tabForm" show-summary :summary-method="getSummaries" :data="tableList" custom-column row-key="id" :hasNO="false" style="border:1px solid #ebeef5;border-right:none;">
              <el-table-column prop="realname" label="员工姓名" width="120" />
              <el-table-column prop="customerNum" label="当前客户数" min-width="120" />
              <el-table-column prop="customerSumNum" label="新增客户数" min-width="120" />
              <el-table-column prop="dealCustomerNum" label="成交客户数" min-width="120" />
              <el-table-column prop="dealCustomerRate" label="客户成交率(%)" min-width="120" />
              <el-table-column prop="contractMoney" label="合同总金额(元)" min-width="120" />
              <el-table-column prop="receivablesMoney" label="回款金额(元)" min-width="120" />
            </JNPF-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableList: [
        { realname: 'admin', customerNum: '1', customerSumNum: '1', dealCustomerNum: '1', dealCustomerRate: '100', contractMoney: '105000', receivablesMoney: '10000' }
      ],
      value: '选项1',
      value1: '选项1',
      options: [
        {
          value: '选项1',
          label: '仅本人'
        },
        {
          value: '选项2',
          label: '本人及下属'
        }
      ],
      options1: [
        {
          value: '选项1',
          label: '本月'
        }
      ],
      chartInstance: null,
      option: {
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
          data: ['成交客户数', '新增客户数'],
          bottom: 10
        },
        xAxis: [
          {
            type: 'category',
            data: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'],
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
            name: '个',
            type: 'value'
          }
        ],
        series: [
          {
            barWidth: '20%',
            name: '成交客户数',
            type: 'bar',
            data: [0, 0, 0, 10, 2, 0, 20, 0, 0, 12, 30, 3]
          },
          {
            barWidth: '20%',
            name: '新增客户数',
            type: 'bar',
            data: [0, 0, 0, 5, 12, 0, 20, 0, 0, 12, 25, 1]
          }
        ]
      },
    }
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

<style lang="scss">
//公共样式
.vux-flex-row {
  -webkit-box-orient: horizontal;
  flex-direction: row;
}
.vux-flexbox {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  text-align: left;
}
</style>
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