<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="vux-flexbox filtrate-content filtrate-bar vux-flex-row" style="justify-content: flex-start;">
        <div class="vux-flexbox title-box vux-flex-row" style="justify-content: flex-start;">
          <div class="icon-box"><i class="icon-ym icon-ym-tree-department"></i></div>
          <div class="text-one-line">客户城市分布分析</div>
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
      <div class="content-main vux-flexbox vux-flex-row" v-loading="chartLoading">
        <div class="vux-flexbox-item">
          <div class="axis-content">
            <div id="allChart" :option="option" style="width: 100%; height: 400px;"></div>
          </div>
        </div>
        <div class="vux-flexbox-item" style="margin-left: 8px;">
          <div class="axis-content">
            <div id="dealChart" :option="option" style="width: 100%; height: 400px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { getaddressAnalyse } from "@/api/CRMmanagement/instrumentPanel/index";
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
      dataForm: {
        startTime: "",
        endTime: "",
        type: "year",
        userIds: []
      },
      tableList: [],
      chartInstance: null,
      chartInstance1: null,
      option: {},
      option1: {}
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
    this.chartInstance = this.$echarts.init(document.getElementById('allChart'));
    this.chartInstance1 = this.$echarts.init(document.getElementById('dealChart'));
    axios.get("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json").then(res => {
      this.$echarts.registerMap('china', res.data);
    })
    window.onresize = () => {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.chartInstance.resize()
        this.chartInstance1.resize()
      }, 100);
    }
  },
  beforeDestroy() {
    window.onresize = null
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
      this.chartLoading = true
      getaddressAnalyse(this.dataForm).then(res => {
        res.data.forEach(o => {
          if (o.type == '西藏' || o.type == '内蒙古') {
            o.type = o.type + '自治区'
          } else if (o.type == '广西') {
            o.type = o.type + '壮族自治区'
          } else if (o.type == '宁夏') {
            o.type = o.type + '回族自治区'
          } else if (o.type == '新疆') {
            o.type = o.type + '维吾尔自治区'
          } else if (o.type == '香港' || o.type == '澳门') {
            o.type = o.type + '特别行政区'
          } else if (o.type == '北京' || o.type == '天津' || o.type == '上海' || o.type == '重庆') {
            o.type = o.type + '市'
          } else {
            o.type = o.type + '省'
          }
        })
        let a = res.data.filter(item => item.allCustomer)
        let b = res.data.filter(item => item.dealCustomer)
        this.option = {
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params.value ? params.name + '<br>' + params.value + '(个)' : ''
            }
          },
          title: {
            text: '全部客户',
            left: 'center',
            top: 'bottom'
          },
          visualMap: {
            left: 'left',
            min: 0,
            max: 50,
            inRange: {
              color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
              ]
            },
            text: ['多', '少'],
            calculable: true
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            top: 'center',
            right: 16,
            itemGap: 16,
            feature: {
              dataView: {
                optionToContent: function (opt) {
                  var axisData = opt.series[0].data
                  var table = '<table style="width:100%;text-align:center"><tbody><tr>'
                    + '<td>城市</td>'
                    + '<td>客户数</td>'
                    + '</tr>';
                  for (var i = 0, l = axisData.length; i < l; i++) {
                    table += '<tr>'
                      + '<td>' + axisData[i].name + '</td>'
                      + '<td>' + axisData[i].value + '</td>'
                      + '</tr>';
                  }
                  table += '</tbody></table>';
                  return table;
                },
                contentToOption: function (row) { }
              },
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              scaleLimit: {
                min: 1
              },
              top: 100,
              zoom: 1.5,
              type: 'map',
              roam: true,
              map: 'china',
              label: {
                show: true,
                formatter: function (params) {
                  return params.name == '黑龙江省' || params.name == '内蒙古自治区' ? params.name.slice(0, 3) : params.name.slice(0, 2)
                }
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              data: a.map(item => {
                return { name: item.type, value: item.allCustomer }
              })
            }
          ]
        }
        this.chartInstance.setOption(this.option);
        this.option1 = {
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              return params.value ? params.name + '<br>' + params.value + '(个)' : ''
            }
          },
          title: {
            text: '成交客户',
            left: 'center',
            top: 'bottom'
          },
          visualMap: {
            left: 'left',
            min: 0,
            max: 50,
            inRange: {
              color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
              ]
            },
            text: ['多', '少'],
            calculable: true
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            top: 'center',
            right: 16,
            itemGap: 16,
            feature: {
              dataView: {
                optionToContent: function (opt) {
                  var axisData = opt.series[0].data
                  var table = '<table style="width:100%;text-align:center"><tbody><tr>'
                    + '<td>城市</td>'
                    + '<td>客户数</td>'
                    + '</tr>';
                  for (var i = 0, l = axisData.length; i < l; i++) {
                    table += '<tr>'
                      + '<td>' + axisData[i].name + '</td>'
                      + '<td>' + axisData[i].value + '</td>'
                      + '</tr>';
                  }
                  table += '</tbody></table>';
                  return table;
                },
                contentToOption: function (row) { }
              },
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              scaleLimit: {
                min: 1
              },
              top: 100,
              zoom: 1.5,
              type: 'map',
              roam: true,
              map: 'china',
              label: {
                show: true,
                formatter: function (params) {
                  return params.name == '黑龙江省' || params.name == '内蒙古自治区' ? params.name.slice(0, 3) : params.name.slice(0, 2)
                }
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              data: b.map(item => {
                return { name: item.type, value: item.allCustomer }
              })
            }
          ]
        }
        this.chartInstance1.setOption(this.option1);
        this.chartLoading = false
      }).catch(() => {
        this.chartLoading = false
      })
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
.vux-flexbox {
  .vux-flexbox-item:first-child {
    margin-top: 0 !important;
    margin-left: 0 !important;
  }
  .vux-flexbox-item {
    -webkit-box-flex: 1;
    flex: 1;
    width: 0;
    min-width: 20px;
    .axis-content {
      position: relative;
      margin-right: 40px;
      margin-bottom: 24px;
    }
  }
}
.content-main {
  height: calc(100% - 54px);
  padding-bottom: 24px;
  margin-top: 24px;
  overflow-y: auto;
}
</style>