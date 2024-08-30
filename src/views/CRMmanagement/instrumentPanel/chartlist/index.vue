
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
              <div class="wk-toggle-item" :class="{'selected':charttitles=='xt'}" @click="charttype('xt')">线条</div>
              <div class="wk-toggle-item" :class="{'selected':charttitles=='zzt'}" @click="charttype('zzt')">柱状图</div>
            </div>
          </div>
        </div>
        <div class="filter-bar vux-flexbox vux-flex-row">
          <span class="filter-tag">{{personnelcontent}}</span>
          <span class="filter-tag">{{daterangecontent}}</span>
          <div class="el-select">
            <el-select v-model="dataForm.label" placeholder="请选择" style="width: 100%;" @change="changelabel">
              <el-option v-for="(item, index) in [{fullName:'合同金额',enCode:'1'},{fullName:'回款金额',enCode:'2'}]" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
            </el-select>
          </div>
        </div>
        <div v-if="charttitles=='xt'" class="sale-statistics" v-loading="saleloading">
          <moneychart :option="optionmoney"></moneychart>
        </div>
        <div v-else class="sale-statistics" v-loading="saleloading">
          <moneychart :option="optionmoneyzz"></moneychart>
        </div>
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
          <span class="filter-tag">{{personnelcontent}}</span>
          <span class="filter-tag">{{daterangecontent}}</span>
          <div class="el-select">
            <el-select v-model="rankingForm.label" placeholder="请选择" style="width: 100%;" @change="changeranking">
              <el-option v-for="(item, index) in rankingFormlist" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
            </el-select>
          </div>
        </div>
        <div class="ranking-table" v-loading="rankloading">
          <div :style="{'height': rankVO.userName?'304px':'346px'}">
            <JNPF-table ref="tabForm" :border="true" :data="tableList" :key="Math.random()" custom-column row-key="id" :hasNO="false" :setColumnDisplayList="columnList" style="border:1px solid #ebeef5;border-right:none;">
              <el-table-column prop="rank" label="排名" min-width="160" />
              <el-table-column prop="userName" label="姓名" min-width="160" />
              <el-table-column prop="rankMoney" label="回款金额(元)" min-width="160" v-if="rankingForm.label=='1'" />
              <el-table-column prop="rankNum" label="回款目标完成率(%)" min-width="160" v-if="rankingForm.label=='1'" />
              <el-table-column prop="rankMoney" label="合同金额(元)" min-width="160" v-if="rankingForm.label=='2'" />
              <el-table-column prop="rankNum" label="合同目标完成率(%)" min-width="160" v-if="rankingForm.label=='2'" />
              <el-table-column prop="rankNum" label="合同数(个)" min-width="160" v-if="rankingForm.label=='3'" />
              <el-table-column prop="rankNum" label="新增客户数(个)" min-width="160" v-if="rankingForm.label=='4'" />
              <el-table-column prop="rankNum" label="新增联系人(个)" min-width="160" v-if="rankingForm.label=='5'" />
              <el-table-column prop="rankNum" label="新增跟进记录数(条)" min-width="160" v-if="rankingForm.label=='6'" />
            </JNPF-table>
            <div class="my-ranking" v-if="rankVO.userName">
              <div v-for="(value,key,index) in rankVO" :key="index"><span style="margin-left: 10px;font-weight:bold;">{{value}}</span></div>
            </div>
          </div>
        </div>
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
              <div class="wk-toggle-item" :class="{'selected':charttitlefunnel=='je'}" @click="charttypefunnel('je')">金额</div>
              <div class="wk-toggle-item" :class="{'selected':charttitlefunnel=='sl'}" @click="charttypefunnel('sl')">数量</div>
            </div>
          </div>
        </div>
        <div class="filter-bar vux-flexbox vux-flex-row">
          <span class="filter-tag">{{personnelcontent}}</span>
          <span class="filter-tag">{{daterangecontent}}</span>
        </div>
        <div v-if="charttitlefunnel=='je'" class="sale-statistics">
          <salesfunnelchart :option="optionsales"></salesfunnelchart>
        </div>
        <div v-else class="sale-statistics">
          <salesfunnelchart :option="sloptionsales"></salesfunnelchart>
        </div>
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
          <span class="filter-tag">{{personnelcontent}}</span>
          <span class="filter-tag">{{daterangecontent}}</span>
        </div>
        <div class="sale-statistics-content">
          <datasummary :data="datasum"></datasummary>
        </div>
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
          <span class="filter-tag">{{personnelcontent}}</span>
          <span class="filter-tag">{{daterangecontent}}</span>
          <div class="el-select">
            <el-select v-model="dataFormtarge.label" placeholder="请选择" style="width: 100%;" @change="changelabeltarge">
              <el-option v-for="(item, index) in [{fullName:'合同金额',enCode:'1'},{fullName:'回款金额',enCode:'2'}]" :key="index" :label="item.fullName" :value="item.enCode"></el-option>
            </el-select>
          </div>
        </div>
        <div class="performance-chart">
          <performancechart :option="optionperformance"></performancechart>
          <div class="vux-flexbox info-box vux-flex-row">
            <div class="info-item">
              <span class="mark">目标金额</span>
              <span class="value">{{mbformancemoney}}元</span>
            </div>
            <div class="info-item">
              <span class="mark lighr">完成金额</span>
              <span class="value">{{formancemoney}}元</span>
            </div>
          </div>
        </div>
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
          <span class="filter-tag">{{personnelcontent}}</span>
          <span class="filter-tag">{{daterangecontent}}</span>
          <div class="el-select">

          </div>
        </div>
        <div v-if="true" class="forgettreminder">
          <forget :data="dataforget"></forget>
        </div>
        <div v-else></div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { getsalesTrendList, getqueryDataInfo, getqueryPerformance, getsellFunneldata, getforgottenCustomerCount, getranking } from "@/api/CRMmanagement/instrumentPanel/index";
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
    },
    Requestparameters: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rankloading: false,
      rankVO: {},
      dataforget: {},
      charttitlefunnel: 'je',
      formancemoney: 0,
      mbformancemoney: 0,
      dataFormtarge: {},
      datasum: {},
      daterangecontent: '本年度',
      personnelcontent: '仅本人',
      charttitles: 'xt',
      saleloading: false,
      rankingFormlist: [
        { fullName: '回款金额', enCode: '1' },
        { fullName: '合同金额', enCode: '2' },
        { fullName: '合同数', enCode: '3' },
        { fullName: '新增客户数', enCode: '4' },
        { fullName: '新增联系人', enCode: '5' },
        { fullName: '新增跟进记录数', enCode: '6' },
      ],
      rankingForm: {},
      columnList: [],//隐藏表格列
      tableList: [],
      dataForm: {},
      //目标完成率
      optionperformance: {},
      //销售漏斗
      optionsales: {},
      sloptionsales: {},
      //合同金额目标及完成情况
      optionmoney: {},
      //合同金额目标及完成情况柱状图
      optionmoneyzz: {},
    };
  },
  watch: {
    Requestparameters: {
      handler(newOption) {
        this.daterangecontent = newOption.daterangecontent ? newOption.daterangecontent : '本年度'
        this.personnelcontent = newOption.personnelcontent ? newOption.personnelcontent : '仅本人'
        if (this.type == 'contractamount') {
          this.dataForm = { ...newOption, label: '1' }
          this.initDatasalesTrend()
        } else if (this.type == 'datasummary') {
          this.getqueryData()
        } else if (this.type == 'targetcompletionrate') {
          this.dataFormtarge = { ...newOption, label: '1' }
          this.initDatatarge()
        } else if (this.type == 'salesfunnel') {
          this.initDatasalesfunnel()
        } else if (this.type == 'forgettingreminder') {
          this.initDataforget()
        } else if (this.type == 'rankinglist') {
          this.rankingForm = { ...newOption, label: '1' }
          this.initDatarankinglist()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {

  },
  methods: {
    charttype(val) {
      this.charttitles = val
    },
    charttypefunnel(val) {
      this.charttitlefunnel = val
    },
    changelabel(e) {
      this.initDatasalesTrend()
    },
    changelabeltarge(e) {
      this.initDatatarge()
    },
    //客户遗忘提醒
    initDataforget() {
      getforgottenCustomerCount(this.Requestparameters).then(res => {
        this.dataforget = res.data
      })
    },
    //排行榜
    initDatarankinglist() {
      this.rankloading = true
      this.rankVO = {}
      getranking(this.rankingForm).then(res => {
        this.tableList = res.data.rankList
        if (res.data.rankVO.userName) {
          if (res.data.rankVO.rankMoney) {
            this.rankVO = { rank: res.data.rankVO.rank, userName: res.data.rankVO.userName, rankMoney: res.data.rankVO.rankMoney, rankNum: res.data.rankVO.rankNum }
          } else {
            this.rankVO = { rank: res.data.rankVO.rank, userName: res.data.rankVO.userName, rankNum: res.data.rankVO.rankNum }
          }
        }
        this.rankloading = false
      }).catch(() => {
        this.rankloading = false
      })
    },
    //销售漏斗
    initDatasalesfunnel() {
      getsellFunneldata(this.Requestparameters).then(res => {
        this.optionsales = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params[0].name + '<br>商机金额: ' + params[0].data.value + '元' + '<br>商机个数: ' + params[0].data.businessNum
            }
          },
          grid: {
            top: '8%',
            left: '1%',
            right: '3%',
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
            data: res.data.map(item => item.settingName),
            axisTick: {
              show: false
            }
          }],
          series: [
            {
              type: 'bar',
              barWidth: '30%',
              data: res.data.map(item => {
                return {
                  value: item.businessMoney,
                  businessNum: item.businessNum
                }
              })
            },
          ]
        }
        this.sloptionsales = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params[0].name + '<br>商机金额: ' + params[0].data.businessMoney + '元' + '<br>商机个数: ' + params[0].data.value
            }
          },
          grid: {
            top: '8%',
            left: '1%',
            right: '3%',
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
            },
            minInterval: 1
          }],
          yAxis: [{
            type: 'category',
            data: res.data.map(item => item.settingName),
            axisTick: {
              show: false
            }
          }],
          series: [
            {
              type: 'bar',
              barWidth: '30%',
              data: res.data.map(item => {
                return {
                  value: item.businessNum,
                  businessMoney: item.businessMoney
                }
              })
            },
          ]
        }
      })
    },
    //目标完成率
    initDatatarge() {
      getqueryPerformance(this.dataFormtarge).then(res => {
        this.optionperformance = {
          series: [
            {
              radius: "82%",
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
                length: '30%'
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
                distance: 5,
                color: '#999',
                fontSize: 13
              },
              title: {
                show: true,
                fontSize: '12',
                offsetCenter: [0, '60%']
              },
              detail: {
                valueAnimation: true,
                fontSize: 18,
                fontWeight: 'bold',
                offsetCenter: [0, '40%'],
                formatter: '{value}%'
              },
              data: [
                {
                  value: 100,
                  name: '完成率'
                }
              ]
            }
          ]
        }
        this.formancemoney = res.data.money
      })
    },
    //合同金额目标
    initDatasalesTrend() {
      this.saleloading = true
      getsalesTrendList(this.dataForm).then(res => {
        this.saleloading = false
        this.optionmoney = {
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
            data: res.data.list.map(item => item.type),
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
              data: res.data.list.map(item => item.money),
              type: 'line',
              smooth: true
            }
          ]
        }
        this.optionmoneyzz = {
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
              data: res.data.list.map(item => item.type),
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
              data: res.data.list.map(item => item.money)
            }
          ]
        }
      })
    },
    //数据汇总
    getqueryData() {
      getqueryDataInfo(this.Requestparameters).then(res => {
        this.datasum = res.data
      })
    },
    changeranking(e) {
      this.rankingForm.label = e
      this.initDatarankinglist()
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
  .my-ranking {
    display: flex;
    width: 100%;
    font-size: 14px;
    table-layout: fixed;
    background-color: #ebecf0;
    border: 1px solid #dfe1e6;
    border-top: none;
    justify-content: start;
    div {
      flex: 1;
      line-height: 40px;
    }
  }
}
.sale-statistics {
  margin-top: 16px;
  height: 320px;
  width: 100%;
}
.performance-chart {
  width: 100%;
  height: 267px;
  margin-top: 10px;
  .info-box {
    position: absolute;
    bottom: 24px;
    left: 0;
    width: 100%;
    justify-content: center;
    .info-item {
      position: relative;
      margin: 0 5px;
      .mark::before {
        position: absolute;
        top: 4px;
        left: -12px;
        width: 8px;
        height: 8px;
        content: ' ';
        background-color: #a0a5ba;
        border-radius: 4px;
      }
      .value {
        margin-left: 12px;
        color: #172b4d;
      }
    }
    .info-item + .info-item {
      margin-left: 32px;
    }
  }
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
      line-height: 1.15;
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