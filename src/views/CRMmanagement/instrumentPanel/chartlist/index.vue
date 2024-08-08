
<template>
  <div class="content-crm">
    <div v-if="type=='contractamount'">
      <div class="left-content card">
        <div class="vux-flexbox card-title vux-flex-row">
          <div class="card-title-center">
            合同金额目标及完成情况
          </div>
          <div class="card-title-right">
            <div class="wk-toggle-button__bd">
              <div class="wk-toggle-item selected">线条</div>
              <div class="wk-toggle-item">柱状图</div>
            </div>
          </div>
        </div>
        <div class="filter-bar vux-flexbox vux-flex-row">
          <span class="filter-tag">本人及下属</span>
          <span class="filter-tag">本月</span>
          <div class="el-select">
            <el-select v-model="dataForm.titleType" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item, index) in [{fullName:'合同金额',enCode:'dw'},{fullName:'回款金额',enCode:'gr'}]" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="true" class="sale-statistics">
          <moneychart :option="optionmoney"></moneychart>
        </div>
        <div v-else></div>
      </div>
    </div>
    <div v-else-if="type=='rankinglist'">
      <div class="left-content card rankingtable">
        <div class="vux-flexbox card-title vux-flex-row">
          <div class="card-title-center">
            排行榜
          </div>
        </div>
        <div class="filter-bar vux-flexbox vux-flex-row">
          <span class="filter-tag">本人及下属</span>
          <span class="filter-tag">本月</span>
          <div class="el-select">
            <el-select v-model="rankingForm.titleType" placeholder="请选择" style="width: 100%;" @change="changeranking">
              <el-option v-for="(item, index) in rankingFormlist" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="true" class="ranking-table">
          <div style="height: 320px;">
            <JNPF-table ref="tabForm" :data="tableList" custom-column row-key="id" :hasNO="false" :setColumnDisplayList="columnList">
              <el-table-column prop="clueName" label="排名" min-width="100" />
              <el-table-column prop="nextTime" label="姓名" width="120" />
              <el-table-column prop="mobile6" label="回款金额（元）" min-width="140" v-if="rankingForm.titleType=='hkje'" />
              <el-table-column prop="telephone" label="回款目标完成率（%）" min-width="170" v-if="rankingForm.titleType=='hkje'" />
              <el-table-column prop="mobile" label="合同金额（元）" min-width="140" v-if="rankingForm.titleType=='htje'" />
              <el-table-column prop="telephone5" label="合同目标完成率（%）" min-width="160" v-if="rankingForm.titleType=='htje'" />
              <el-table-column prop="email1" label="合同数（个）" min-width="130" v-if="rankingForm.titleType=='hts'" />
              <el-table-column prop="email2" label="新增客户数（个）" min-width="160" v-if="rankingForm.titleType=='xzkhs'" />
              <el-table-column prop="email3" label="新增联系人（个）" min-width="160" v-if="rankingForm.titleType=='xzlxr'" />
              <el-table-column prop="email4" label="新增跟进记录数（条）" min-width="170" v-if="rankingForm.titleType=='xzgjjls'" />
            </JNPF-table>
          </div>
          <!-- <div class="my-ranking"></div> -->
        </div>
        <div v-else></div>
      </div>
    </div>
    <div v-else-if="type=='salesfunnel'">
      <div class="left-content card">
        <div class="vux-flexbox card-title vux-flex-row">
          <div class="card-title-center">
            销售漏斗
          </div>
          <div class="card-title-right">
            <div class="wk-toggle-button__bd">
              <div class="wk-toggle-item selected">金额</div>
              <div class="wk-toggle-item">数量</div>
            </div>
          </div>
        </div>
        <div class="filter-bar vux-flexbox vux-flex-row">
          <span class="filter-tag">本人及下属</span>
          <span class="filter-tag">本月</span>
          <!-- <div class="el-select">
            <el-select v-model="dataForm.titleType" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item, index) in [{fullName:'合同金额',enCode:'dw'},{fullName:'回款金额',enCode:'gr'}]" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
            </el-select>
          </div> -->
        </div>
        <div v-if="true" class="sale-statistics">
          <salesfunnelchart :option="optionsales"></salesfunnelchart>
        </div>
        <div v-else></div>
      </div>
    </div>
    <div v-else-if="type=='datasummary'">
      <div class="right-content card statistics-card">
        <div class="vux-flexbox card-title vux-flex-row">
          <div class="card-title-center">
            数据汇总
          </div>
        </div>
        <div class="filter-bar vux-flexbox vux-flex-row">
          <span class="filter-tag">本人及下属</span>
          <span class="filter-tag">本月</span>
        </div>
        <div v-if="true" class="sale-statistics-content">
          <datasummary></datasummary>
        </div>
        <div v-else></div>
      </div>
    </div>
    <div v-else-if="type=='targetcompletionrate'">
      <div class="right-content card statistics-card">
        <div class="vux-flexbox card-title vux-flex-row">
          <div class="card-title-center">
            目标完成率
          </div>
        </div>
        <div class="filter-bar vux-flexbox vux-flex-row">
          <span class="filter-tag">本人及下属</span>
          <span class="filter-tag">本月</span>
          <div class="el-select">
            <el-select v-model="dataForm.titleType" placeholder="请选择" style="width: 100%;">
              <el-option v-for="(item, index) in [{fullName:'合同金额',enCode:'dw'},{fullName:'回款金额',enCode:'gr'}]" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="true" class="performance-chart">
          <performancechart :option="optionperformance"></performancechart>
        </div>
        <div v-else></div>
      </div>
    </div>
    <div v-else-if="type=='forgettingreminder'">
      <div class="right-content card statistics-card">
        <div class="vux-flexbox card-title vux-flex-row">
          <div class="card-title-center">
            客户遗忘提醒
          </div>
        </div>
        <div class="filter-bar vux-flexbox vux-flex-row">
          <span class="filter-tag">本人及下属</span>
          <span class="filter-tag">本月</span>
          <div class="el-select">

          </div>
        </div>
        <div v-if="true" class="forgettreminder">
          <forget></forget>
        </div>
        <div v-else></div>
      </div>
    </div>
  </div>
</template>
 
<script>
import forget from "./forget.vue";
import datasummary from "./datasummary.vue";
import moneychart from "./moneychart.vue";
import salesfunnelchart from "./salesfunnelchart.vue";
import performancechart from "./performancechart.vue";
export default {
  components: {
    moneychart,
    salesfunnelchart,
    datasummary,
    performancechart,
    forget
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      rankingFormlist: [
        { fullName: '回款金额', enCode: 'hkje' },
        { fullName: '合同金额', enCode: 'htje' },
        { fullName: '合同数', enCode: 'hts' },
        { fullName: '新增客户数', enCode: 'xzkhs' },
        { fullName: '新增联系人', enCode: 'xzlxr' },
        { fullName: '新增跟进记录数', enCode: 'xzgjjls' },
      ],
      rankingForm: {
        titleType: 'hkje'
      },
      columnList: [],//隐藏表格列
      tableList: [],
      dataForm: {
        titleType: 'dw'
      },
      //目标完成率
      optionperformance: {
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 4
            },
            splitNumber: 4,
            axisLine: {
              lineStyle: {
                width: 4
              }
            },
            pointer: {
              length: '40%'
            },
            axisTick: {
              show: false
            },
            splitLine: {
              distance: 10,
              length: 10,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            axisLabel: {
              distance: 6,
              color: '#999',
              fontSize: 15
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              fontSize: 20,
              offsetCenter: [0, '55%'],
              formatter: '{value}%'
            },
            data: [
              {
                value: 70,
                name: '完成率'
              }
            ]
          }
        ]
      },
      //销售漏斗
      optionsales: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '8%',
          left: '1%',
          right: '1%',
          bottom: '15%',
          containLabel: true
        },
        color: ['#0052cc'],
        xAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        }],
        yAxis: [{
          type: 'category',
          data: ['输单', '赢单', '验证客户'],
          axisTick: {
            show: false
          }
        }],
        series: [
          {
            name: '商机金额',
            type: 'bar',
            barWidth: '30%',
            data: [18203, 23489, 29034]
          },
        ]
      },
      //合同金额目标及完成情况
      optionmoney: {
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
        color: ['#0052cc', '#42526e'],
        legend: {
          data: ['实际完成金额', '当月目标金额'],
          bottom: 10
        },
        xAxis: [{
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            show: false
          }
        }],
        yAxis: [{
          type: 'value',
          name: '元',
          axisLine: {
            show: false
          }
        }],
        series: [
          {
            name: '实际完成金额',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      },
      //合同金额目标及完成情况柱状图
      optionmoneyzz: {
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
        color: ['#0052cc', '#42526e'],
        legend: {
          data: ['实际完成金额', '当月目标金额'],
          bottom: 10
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true,
              show: false
            }
          }
        ],
        yAxis: [
          {
            name: '元',
            type: 'value'
          }
        ],
        series: [
          {
            barWidth: '30%',
            name: '实际完成金额',
            type: 'bar',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      },
    };
  },
  methods: {
    changeranking(e) {
      this.rankingForm.titleType = e
      this.$refs.tabForm.$refs.JNPFTable.clearSelection()
    }
  }
};
</script>
<style lang="scss" scoped>
.content-crm + .content-crm {
  margin-top: 18px;
}
.wk-toggle-button__bd {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: max-content;
  max-width: 100%;
  padding: 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3333;
  text-transform: uppercase;
  background-color: #ebecf0;
  border-radius: 3px;
  .wk-toggle-item {
    display: block;
    padding: 0 5px;
    line-height: 24px;
    cursor: pointer;
    background-color: #dfe1e6;
    border-radius: 3px;
    & + & {
      margin-left: 4px;
    }
    &.selected {
      background-color: #fff;
      border-radius: 3px;
      box-shadow: 0 3px 5px rgba(13, 20, 36, 0.18),
        0 0 1px rgba(13, 20, 36, 0.29) !important;
    }
  }
}
.left-content {
  height: 440px;
}
.rankingtable {
  height: 460px !important;
}
.ranking-table {
  margin-top: 16px;
  width: 100%;
}
.sale-statistics {
  margin-top: 16px;
  height: 320px;
  width: 100%;
}
.performance-chart {
  width: 100%;
  height: 260px;
  margin-top: 10px;
}
.forgettreminder {
  width: 100%;
  margin-top: 16px;
}
.sale-statistics-content {
  width: 100%;
  margin-top: 24px;
  overflow-y: auto;
}
.right-content {
  height: 440px;
}
.card {
  position: relative;
  padding: 16px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgb(9 30 66 / 25%), 0 0 1px 1px rgb(9 30 66 / 13%);
  &::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 4px;
    content: ' ';
    background-color: #0052cc;
    border-radius: 3px 3px 0 0;
  }
  .card-title {
    display: flex;
    .card-title-center {
      -webkit-box-flex: 1;
      flex: 1;
      font-size: 16px;
      font-weight: 700;
    }
    .card-title-right {
      flex-shrink: 0;
    }
  }
  .filter-bar {
    margin-top: 16px;
  }
  .filter-tag {
    display: inline-block;
    height: 32px;
    padding: 0 8px;
    line-height: 32px;
    color: #a5adba;
    background-color: #ebecf0;
    border-radius: 3px;
    margin-right: 8px;
  }
  .el-select {
  }
  &.statistics-card {
    height: auto !important;
  }
}
.vux-flexbox {
  width: 100%;
  text-align: left;
  -webkit-box-align: center;
  display: flex;
  align-items: center;
}
</style>