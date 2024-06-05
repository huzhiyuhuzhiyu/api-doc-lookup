<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form>
          <el-col :span="6">
            <el-form-item label="最高CPK">
              <el-input v-model="maxCPK" placeholder="" @input="maxCPKchange($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最低CPK">
              <el-input v-model="minCPK" placeholder="" @input="minPCKChange($event)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-select v-model="query.name" placeholder="请选择" @change="(e) => idChange(e)" filterable>
                <el-option v-for="(item, index2) in equipmentOptions" :key="item.equipmentUid" :label="item.equipmentName"
                  :value="index2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备点位">
              <el-select v-model="query.code" placeholder="请选择">
                <el-option v-for="(item, index) in codeOptions" :key="index" :label="item.codeName" :value="item.code"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="">
              <el-button size="mini" energyconsumptionanalysis type="primary" @click="search()">查询
              </el-button>
              <el-button size="mini" energyconsumptionanalysis @click="reset()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="16">
          <div id="dayCPK" style="width: 100%; height: 200px; background: #fff"></div>
        </el-col>
        <el-col :span="8">
          <JNPF-table v-loading="listLoading" :data="listday" :hasNO="false" style="height: 200px; width: 100%">
            <!-- :cell-style="cellClassFn"-->
            <el-table-column prop="maxCPK" label="最高CPK" align="center" fixed />
            <el-table-column prop="minCPK" label="最低CPK" align="left" fixed />
            <el-table-column prop="averageCPK" label="平均CPK" align="left" fixed />
          </JNPF-table>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="16">
          <div id="monthCPK" style="width: 100%; height: 200px; background: #fff"></div>
        </el-col>
        <el-col :span="8">
          <JNPF-table v-loading="listLoading" :data="listMonth" :hasNO="false" style="height: 200px">
            <!-- :cell-style="cellClassFn"-->
            <el-table-column prop="maxCPK" label="最高CPK" align="center" fixed />
            <el-table-column prop="minCPK" label="最低CPK" align="left" fixed />
            <el-table-column prop="averageCPK" label="平均CPK" align="left" fixed />
          </JNPF-table>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="16">
          <div id="yearCPK" style="width: 100%; height: 200px; background: #fff"></div>
        </el-col>
        <el-col :span="8">
          <JNPF-table v-loading="listLoading" :data="listYear" :hasNO="false" style="height: 200px">
            <!-- :cell-style="cellClassFn"-->
            <el-table-column prop="maxCPK" label="最高CPK" align="center" fixed />
            <el-table-column prop="minCPK" label="最低CPK" align="left" fixed />
            <el-table-column prop="averageCPK" label="平均CPK" align="left" fixed />
          </JNPF-table>
        </el-col>
      </el-row>
      <el-row class="JNPF-common-search-box" :gutter="10"
        style="margin-top: 20px;background-color: #fff;padding: 20px 0 0 20px;">
        <el-form>
          <el-col :span="7">
            <el-form-item label="日期">
              <el-date-picker v-model="query.time" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="">
              <el-button size="mini" energyconsumptionanalysis type="primary" @click="search()">查询
              </el-button>
              <el-button size="mini" energyconsumptionanalysis @click="resetTable()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>


      </el-row>
      <el-row>
        <el-col >
          <table class="listTab" cellspacing="0" cellpadding="0">
            <thead style="width:100%;">
              <tr>
                <th style="width: 100px;" v-for="(item, val) in tableHeadJson" :key="val">{{ item.title }}</th>
              </tr>
            </thead>
            <tbody style="width:100%;">
              <tr v-for="(item, key, index) in tableRowJson" :key="item.openId">
                <td  style="width: 100px;" v-for="(val, index) in tableHeadJson" :key="index">

                  <div >{{ item[val.key] }}</div>
                </td>
              </tr>
            </tbody>
          </table>

        </el-col>
      </el-row>
      <el-row :gutter="10" class="JNPF-common-search-box"
        style="margin-top: 20px;background-color: #fff;padding: 20px 0 0 20px;">
        <el-form>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-select v-model="query.name" placeholder="请选择" @change="(e) => idChange(e)" filterable>
                <el-option v-for="(item, index2) in equipmentOptions" :key="item.equipmentUid" :label="item.equipmentName"
                  :value="index2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备点位">
              <el-select v-model="query.code" placeholder="请选择">
                <el-option v-for="(item, index) in codeOptions" :key="index" :label="item.codeName" :value="item.code"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="粒度">
              <el-select v-model="query.granularity" placeholder="请选择">
                <el-option v-for="(item, index) in granularityList" :key="index" :label="item.granularity"
                  :value="item.value" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="日期">

              <el-date-picker v-model="xrDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-button size="mini" energyconsumptionanalysis type="primary" @click="searchXR()">查询
              </el-button>
              <el-button size="mini" energyconsumptionanalysis @click="resetXR()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="24" class="sssss" style="background-color: #fff; position: relative;">

        </el-col>
        <el-col :span="24" class="ttttt" style="background-color: #fff; position: relative;">

        </el-col>



      </el-row>
    </div>
  </div>
</template>
<script>
import { getCPKdata, getCPKXRData } from "@/api/equipment";
import { getCpkXREquipment } from "@/api/systemData/dataInterface"
import moment from "moment";
import settings from '@/store/modules/settings';
export default {
  data() {
    return {
      listLoading: false,
      listday: [{ maxCPK: "", minCPK: "", averageCPK: "" }],
      listMonth: [{ maxCPK: "", minCPK: "", averageCPK: "" }],
      listYear: [{ maxCPK: "", minCPK: "", averageCPK: "" }],
      minCPK: "",
      maxCPK: "",
      xrDate: undefined,
      query: {
        name: "",
        uid: "",
        code: "",
        time: [],
        date: undefined,
        granularity: '5'
      },
      granularityList: [
        {
          granularity: "5分钟",
          value: "5"
        },
        {
          granularity: "10分钟",
          value: "10"
        }, {
          granularity: "15分钟",
          value: "15"
        }, {
          granularity: "20分钟",
          value: "20"
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick(picker) {
            const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      cpkdata: [],
      equipmentOptions: [],
      codeOptions: [],
      cpkDatas: [],
      timesDay: [
        "00:00",
        "00:30",
        "01:00",
        "01:30",
        "02:00",
        "02:30",
        "03:00",
        "03:30",
        "04:00",
        "04:30",
        "05:00",
        "05:30",
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30",
        "24:00",
      ],
      tableHeadJson: [],
      tableRowJson: [],
      timesMonth: [],
      timesYear: ['01', '02', "03", "04", "05", '06', '07', '08', "09", 10, 11, 12],
      // charMaxCPK: [],
      // charMinCPK: [],
      dataXMonth: [],
      dataXYear: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      dataXDay: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      charMaxCPKday: [],
      charMaxCPKMon: [],
      charMaxCPKYear: [],
      charMinCPKday: [],
      charMinCPKMon: [],
      charMinCPKYear: [],


      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      tableList: [],
      clr: [],
      lclr: [],
      r: [],
      rucl: [],
      uclr: [],
      XcontrolTime: [],
      RcontrolList: [],
      tucl: [],
      uclx: [],
      lclx: [],
      clx: [],
      tlcl: [],
      tcl: [],
      x: [],
      xCharts: [],
      rCharts: []
    };
  },
  created() {
    console.log("timesDay", this.timesDay.length);
    this.query.time[0] = moment((new Date().getTime()) - 604800000).format('YYYY-MM-DD 00:00:00')
    this.query.time[1] = moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')

    // 获取当月天数
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let d = new Date(year, month, 0);
    let n = +d.getDate();

    for (var i = 1; i < n + 1; i++) {
      if (i < 10) {
        i = '0' + i
      }
      this.dataXMonth.push(0)
      this.timesMonth.push(i);
    }
  },
  mounted() {
    let that = this;
    that.xrDate = new Date();

    console.log("11111", that.query.date);
    that.selectEquipmentList()

  },
  methods: {
    resetTable() {
      this.query.time[0] = moment((new Date().getTime()) - 604800000).format('YYYY-MM-DD 00:00:00')
      this.query.time[1] = moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')
      this.tableHeadJson = [],
        this.tableRowJson = [];
    },
    resetXR() {
      this.query.date = new Date()
      this.query.granularity = "5"
      this.query.name = ""
      this.query.code = ""
      this.query.uid = ""
      this.codeOptions = []
      this.xCharts = [],
        this.rCharts = [],
        this.drawLineXcontrol()
      this.drawLineRcontrol()
    },
    searchXR() {
      let time = new Date(this.xrDate)
      let start = moment(Number(time.getTime())).format('YYYY-MM-DD 00:00:00')
      let stop = moment(Number(time.getTime())).format('YYYY-MM-DD 23:59:59')
      let obj = {
        start: start,
        stop: stop,
        uid: this.query.uid,
        code: this.query.code,
        "minute": this.query.granularity,
      }
      if (!this.query.uid || !this.query.code) {
        this.$message({
          type: 'error',
          message: "请先选择设备",
          onClose: () => {
          }
        })
      } else {
        getCPKXRData(obj).then(res => {
          let data = res.data.datas
          for (let i = 0; i < data.length; i++) {
            let element = data[i];
            let rdatas = element[Object.keys(element)[0]]

            this.rCharts[i] = {}
            this.rCharts[i].hour = Object.keys(element)[0]
            this.rCharts[i].xline = []
            this.rCharts[i].clr = []
            this.rCharts[i].lclr = []
            this.rCharts[i].r = []
            this.rCharts[i].rucl = []
            this.rCharts[i].uclr = []

            this.xCharts[i] = {}
            this.xCharts[i].hour = Object.keys(element)[0]
            this.xCharts[i].xline = []
            this.xCharts[i].x = []
            this.xCharts[i].clx = []
            this.xCharts[i].lclx = []
            this.xCharts[i].tcl = []
            this.xCharts[i].tlcl = []
            this.xCharts[i].tucl = []
            this.xCharts[i].uclx = []

            rdatas.rdatas.forEach((item, index) => {

              let key = Object.keys(item)[0]
              this.rCharts[i].xline.push(key.substring(11, 19));
              let cc = item[Object.keys(item)]
              // console.log("cc", cc);
              if (cc) {
                this.rCharts[i].clr.push(cc.clr)
                this.rCharts[i].lclr.push(cc.lclr)
                this.rCharts[i].r.push(cc.r)
                this.rCharts[i].rucl.push(cc.rucl)
                this.rCharts[i].uclr.push(cc.uclr)
              } else {
                this.rCharts[i].clr.push(undefined)
                this.rCharts[i].lclr.push(undefined)
                this.rCharts[i].r.push(undefined)
                this.rCharts[i].rucl.push(undefined)
                this.rCharts[i].uclr.push(undefined)
              }

            });
            console.log("rCharts", this.rCharts);
            rdatas.xdatas.forEach((item, index) => {
              let key = Object.keys(item)[0]
              this.xCharts[i].xline.push(key.substring(11, 19));
              let cc = item[Object.keys(item)]
              if (cc) {
                this.xCharts[i].clx.push(cc.clx)
                this.xCharts[i].lclx.push(cc.lclx)
                this.xCharts[i].tcl.push(cc.tcl)
                this.xCharts[i].tlcl.push(cc.tlcl)
                this.xCharts[i].tucl.push(cc.tucl)
                this.xCharts[i].uclx.push(cc.uclx)
                this.xCharts[i].x.push(cc.x)
              } else {

                this.xCharts[i].clx.push(undefined)
                this.xCharts[i].lclx.push(undefined)
                this.xCharts[i].tcl.push(undefined)
                this.xCharts[i].tlcl.push(undefined)
                this.xCharts[i].tucl.push(undefined)
                this.xCharts[i].uclx.push(undefined)
                this.xCharts[i].x.push(undefined)
              }

            });


            // this.drawLineXcontrol()

          }

          if (this.rCharts.length > 0) {
            var el = document.getElementsByClassName('ttttt');
            console.log("el333", el);

            el[0].innerHTML = "";
            var els = document.getElementsByClassName('sssss');
            console.log("el333", el);

            els[0].innerHTML = "";
            this.drawLineRcontrol()

            this.drawLineXcontrol()

          }
          // setTimeout(() => {
          // }, 1000);

        })
      }
    },
    drawLineRcontrol() {


      setTimeout(() => {
        let hhh = document.getElementsByClassName("ttttt")[0]
        this.rCharts.forEach((item, index) => {
          console.log("cccccccc", item);
          var newCharDom = document.createElement('div')
          newCharDom.id = 'Rcontrol' + index
          newCharDom.style.cssText = 'height:200px;background:#fff;width:25%;display:inline-block'
          // var ccc = echarts.init(newCharDom);
          hhh.appendChild(newCharDom)
          const myChart = this.$echarts.init(document.getElementById(`Rcontrol${index}`))
          var option;

          option = {
            title: {
              text: "R管制图 " + item.hour,
              left: "center",
              top: 20,
            },
            tooltip: {
              trigger: "axis",
            },
            legend: {
              data: ['R', 'UCLR', 'LCLR', 'CLR', 'RUCL'],
              top: "4%",
              textStyle: {
                color: "#1FC3CE",
                fontSize: 14
              },
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },

            xAxis: {

              type: "category",
              boundaryGap: true,
              data: item.xline,


            },
            yAxis: {
              type: "value",
              interval: 10
            },

            series: [
              {
                name: "clr",
                type: "line",
                // stack: "Total",
                data: item.clr,
                symbol: 'none',
                smooth: true,
                itemStyle: {
                  normal: {
                    color: "#008000",
                    lineStyle: {
                      color: '#008000', //改变折线颜色
                      type: 'solid',
                    }
                  }
                },
              }, {
                name: "lclr",
                type: "line",
                symbol: 'none',
                // stack: "Total",
                data: item.lclr,
                itemStyle: {
                  normal: {
                    color: '#FF0000', //改变折线颜色
                    lineStyle: {
                      color: '#FF0000', //改变折线颜色
                      type: "dotted",
                    }
                  }
                },
              }, {
                name: "r",
                type: "line",
                // stack: "Total",
                data: item.r,
                itemStyle: {
                  normal: {
                    color: '#030380', //改变折线点的颜色
                    lineStyle: {
                      color: '#030303', //改变折线颜色
                      type: "solid",
                    }
                  }
                },
              }, {
                name: "rucl",
                type: "line",
                // stack: "Total",
                symbol: 'none',
                data: item.rucl,
                itemStyle: {
                  normal: {

                    color: '#FF0000', //改变折线点的颜色
                    lineStyle: {
                      color: '#FF0000', //改变折线颜色
                      type: "solid",
                    }
                  }
                },
              }, {
                name: "uclr",
                type: "line",
                // stack: "Total",
                data: item.uclr,
                symbol: 'none',
                itemStyle: {
                  normal: {
                    color: '#FF0000', //改变折线点的颜色
                    lineStyle: {
                      color: '#FF0000', //改变折线颜色
                      type: "dotted",
                    }
                  }
                },
              },

            ],
          };

          option && myChart.setOption(option);
        })

      }, 500);
    },
    drawLineXcontrol() {
      // var chartDom = document.getElementById("Rcontrol");
      // console.log("chartDom", chartDom);
      // var myChart = echarts.init(chartDom);
      // var option;
      // window.addEventListener('resize', () => {
      //   myChart.resize()
      // })
      var el = document.getElementsByClassName('sssss');
      console.log("el222", el);
      el.innerHTML = "";

      this.xCharts.forEach(((item, index) => {
        let hhh = document.getElementsByClassName("sssss")[0]
        var newCharDom = document.createElement('div')
        newCharDom.id = 'Xcontrol' + index
        newCharDom.style.cssText = 'height:200px;background:#fff;width:25%;display:inline-block'
        // var ccc = echarts.init(newCharDom);
        hhh.appendChild(newCharDom)
        const myChart = this.$echarts.init(document.getElementById(`Xcontrol${index}`))
        var option;
        option = {
          title: {
            text: "X管制图 " + item.hour,
            left: "center",
            top: 20,
          },
          tooltip: {
            trigger: "axis",
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },

          xAxis: {
            type: "category",
            boundaryGap: true,
            data: item.xline,

          },
          yAxis: {
            type: "value",
            minInterval: 1
          },

          series: [
            {
              name: "tucl",
              type: "line",
              // stack: "Total",
              data: item.tucl,
              symbol: 'none',
              smooth: true,
              itemStyle: {
                normal: {
                  color: "#FF0000",
                  lineStyle: {
                    color: '#FF0000', //改变折线颜色
                    type: 'solid',
                  }
                }
              },
            },
            {
              name: "uclx",
              type: "line",
              // stack: "Total",
              data: item.uclx,
              symbol: 'none',
              smooth: true,
              itemStyle: {
                normal: {
                  color: "#FF0000",
                  lineStyle: {
                    color: '#FF0000', //改变折线颜色
                    type: 'dotted',
                  }
                }
              },
            }, {
              name: "lclx",
              type: "line",
              symbol: 'none',
              // stack: "Total",
              data: item.lclx,
              itemStyle: {
                normal: {
                  color: '#FF0000', //改变折线颜色
                  lineStyle: {
                    color: '#FF0000', //改变折线颜色
                    type: "dotted",
                  }
                }
              },
            }, {
              name: "clx",
              type: "line",
              // stack: "Total",
              data: item.clx,
              symbol: 'none',
              itemStyle: {
                normal: {
                  color: '#359999', //改变折线点的颜色
                  lineStyle: {
                    color: '#359999', //改变折线颜色
                    type: "solid",
                  }
                }
              },
            }, {
              name: "tlcl",
              type: "line",
              // stack: "Total",
              symbol: 'none',
              data: item.tlcl,
              itemStyle: {
                normal: {

                  color: '#FF0000', //改变折线点的颜色
                  lineStyle: {
                    color: '#FF0000', //改变折线颜色
                    type: "solid",
                  }
                }
              },
            }, {
              name: "x",
              type: "line",
              // stack: "Total",
              data: item.x,
              symbol: 'none',
              itemStyle: {
                normal: {
                  color: '#000', //改变折线点的颜色
                  lineStyle: {
                    color: '#000', //改变折线颜色
                    type: "solid",
                  }
                }
              },
            }, {
              name: "tcl",
              type: "line",
              // stack: "Total",
              data: item.tcl,
              symbol: 'none',
              itemStyle: {
                normal: {
                  color: '#FF0000', //改变折线点的颜色
                  lineStyle: {
                    color: '#FF0000', //改变折线颜色
                    type: "dotted",
                  }
                }
              },
            },

          ],
        };
        option && myChart.setOption(option, true);

      }))

    },



    //搜索设备列表
    selectEquipmentList() {
      getCpkXREquipment().then(res => {
        console.log("res+++", res);
        let data = res.data
        this.equipmentOptions = data
        // console.log(this.equipmentOptions)
      })
    },
    // 设备改变事件
    idChange(e, index) {
      console.log("log》", e);
      this.query.uid = this.equipmentOptions[e].equipmentUid
      this.codeOptions = this.equipmentOptions[e].codeInfos
    },
    search() {
      console.log("tt", this.query
      );
      if (!this.query.uid || !this.query.code) {
        this.$message({
          type: 'error',
          message: "请先选择设备",
          onClose: () => {
          }
        })
      } else {
        this.getCPKdata()
      }
    },
    reset() {
      this.query.name = ""
      this.query.code = ""
      this.query.uid = ""
      this.listday = [{ maxCPK: "", minCPK: "", averageCPK: "" }],
        this.listMonth = [{ maxCPK: "", minCPK: "", averageCPK: "" }],
        this.listYear = [{ maxCPK: "", minCPK: "", averageCPK: "" }];
      this.dataXDay = []
      this.dataXMonth = [];
      this.dataXYear = [];
      this.drawLineDay(); //执行方法
      this.drawLineMonth(); //执行方法
      this.drawLineYear(); //执行方法
    },
    getCPKdata() {
      var date1 = new Date();
      var year1 = date1.getFullYear();
      var firstMonth = year1 + '-' + '01' + '-' + '01' + " " + "00:00:00";
      let obj = {
        uid: this.query.uid,
        code: this.query.code,
        start: firstMonth,
        stop: this.query.time[1],
      };
      getCPKdata(obj)
        .then((res) => {
          console.log("res", res);
          let cpkdata = res.data.cpkDatas
          if (cpkdata.length > 0) {

            // 日CPK数据处理
            let currentDay = moment().format('YYYY-MM-DD')
            // let currentDay = "2023-05-16"
            let SameDateDay = [];
            cpkdata.forEach(item => {

              if (item.time.substring(0, 10) == currentDay) {
                SameDateDay.push(item)
              }
              for (let i = 0; i < this.timesDay.length; i++) {
                let value = undefined;
                for (let j = 0; j < SameDateDay.length; j++) {
                  let s = SameDateDay[j].time.substring(11, 16)
                  if (s == this.timesDay[i]) {
                    value = SameDateDay[j].value
                    //this.dataXDay[i] = SameDateDay[j].value
                    break
                  }
                }
                this.dataXDay[i] = value;

              }
              // let sumday = 0, maxDay = SameDateDay[0].value, minDay = SameDateDay[0].value;
              if (SameDateDay.length > 0) {
                let sumday = 0, maxDay = SameDateDay[0].value, minDay = SameDateDay[0].value;
                for (let j = 0; j < SameDateDay.length; j++) {
                  sumday += SameDateDay[j].value;
                  if (SameDateDay[j].value >= maxDay) {
                    maxDay = SameDateDay[j].value; //把刚取到比较大的值赋值到max变量中 =是把右边的值赋值给左边的变量，固定用法
                  }
                  if (SameDateDay[j].value <= minDay) {
                    minDay = SameDateDay[j].value; //把刚取到比较小的值赋值到min变量中
                  }
                }
                this.listday[0].averageCPK = (sumday / SameDateDay.length).toFixed(2);
                this.listday[0].maxCPK = maxDay;
                this.listday[0].minCPK = minDay;
              }

            })










            let arr = [];
            let newArr = [], ccc = [], SameDateMonth = [];
            let currentMonth = moment().format('YYYY-MM-DD').substring(0, 7)
            for (let i = 0; i < cpkdata.length; i++) {
              // 月份数据处理
              if (currentMonth == cpkdata[i].time.substring(0, 7)) {
                SameDateMonth.push(cpkdata[i])
              }
              if (SameDateMonth.length > 0) {
                let sumMonth = 0, maxMonth = SameDateMonth[0].value, minMonth = SameDateMonth[0].value;
                for (let j = 0; j < SameDateMonth.length; j++) {
                  sumMonth += SameDateMonth[j].value;
                  if (SameDateMonth[j].value >= maxMonth) {
                    maxMonth = SameDateMonth[j].value; //把刚取到比较大的值赋值到max变量中 =是把右边的值赋值给左边的变量，固定用法
                  }
                  if (SameDateMonth[j].value <= minMonth) {
                    minMonth = SameDateMonth[j].value; //把刚取到比较小的值赋值到min变量中
                  }
                }
                this.listMonth[0].averageCPK = (sumMonth / SameDateMonth.length).toFixed(2);
                this.listMonth[0].maxCPK = maxMonth;
                this.listMonth[0].minCPK = minMonth;
              }
              if (i == cpkdata.length - 1) {
                arr.push(newArr)
                console.log(7777, arr);
                for (let idx = 0; idx < arr.length; idx++) {
                  let s = 0, c = 0, b = 0;

                  for (let n = 0; n < arr[idx].length; n++) {
                    let ob = {
                      value: 0,
                      time: ""
                    }
                    s += arr[idx][n].value
                    ob.value = (s / arr[idx].length).toFixed(2)
                    ob.time = arr[idx][n].time
                    if (n == arr[idx].length - 1) {

                      ccc.push(ob)

                    }

                  }

                  console.log("ccc", ccc);
                  for (let o = 0; o < this.timesMonth.length; o++) {
                    let value = undefined;
                    let cMonth = this.timesMonth[o]
                    for (let g = 0; g < ccc.length; g++) {
                      const element = ccc[g].time.substring(8, 10);
                      if (cMonth == element) {
                        value = ccc[g].value
                        break
                      }
                    }
                    this.dataXMonth[o] = value
                  }
                }
              } else {
                let currdataTime = cpkdata[i].time.substring(0, 10)
                if (currdataTime == cpkdata[i + 1].time.substring(0, 10)) {
                  newArr.push(cpkdata[i])
                }
                else {
                  newArr.push(cpkdata[i])
                  arr.push(newArr)
                  newArr = []
                  newArr.push(cpkdata[i + 1])
                }
              }


            }





            let currentYear = moment().format('YYYY-MM-DD').substring(0, 4)
            let arrYear = [], t = [], bbb = [], SameDateYear = [];
            for (let r = 0; r < cpkdata.length; r++) {
              if (currentYear == cpkdata[r].time.substring(0, 4)) {
                SameDateYear.push(cpkdata[r])
              }
              if (SameDateYear.length > 0) {
                let sumYear = 0, maxYear = SameDateYear[0].value, minYear = SameDateYear[0].value;
                for (let j = 0; j < SameDateYear.length; j++) {
                  sumYear += SameDateYear[j].value;
                  if (SameDateYear[j].value >= maxYear) {
                    maxYear = SameDateYear[j].value; //把刚取到比较大的值赋值到max变量中 =是把右边的值赋值给左边的变量，固定用法
                  }
                  if (SameDateYear[j].value <= minYear) {
                    minYear = SameDateYear[j].value; //把刚取到比较小的值赋值到min变量中
                  }
                }
                this.listYear[0].averageCPK = (sumYear / SameDateYear.length).toFixed(2);
                this.listYear[0].maxCPK = maxYear;
                this.listYear[0].minCPK = minYear;
              }





              if (r == cpkdata.length - 1) {
                arrYear.push(t)
                console.log(7777, arrYear);
                for (let idx = 0; idx < arrYear.length; idx++) {
                  let s = 0, c = 0, b = 0;

                  for (let n = 0; n < arrYear[idx].length; n++) {
                    let gg = arrYear[idx]
                    let ob = {
                      value: 0,
                      time: ""
                    }
                    s += gg[n].value
                    ob.time = gg[n].time.substring(5, 7)
                    if (n == gg.length - 1) {
                      ob.value = (s / gg.length).toFixed(2)
                      bbb.push(ob)

                    }



                  }

                  for (let q = 0; q < this.timesYear.length; q++) {
                    let value = undefined;
                    let cYear = this.timesYear[q]
                    for (let g = 0; g < bbb.length; g++) {
                      const element = bbb[g].time;
                      if (cYear == element) {
                        value = bbb[g].value
                        break
                      }
                    }
                    this.dataXYear[q] = value
                  }
                }
              } else {
                let currdataTime = cpkdata[r].time.substring(0, 7)
                if (currdataTime == cpkdata[r + 1].time.substring(0, 7)) {
                  t.push(cpkdata[r + 1])
                }
                else {
                  arrYear.push(t)
                  t = []
                  t.push(cpkdata[r + 1])
                }
              }
            }








          }

          this.drawLineDay(); //执行方法
          this.drawLineMonth(); //执行方法
          this.drawLineYear(); //执行方法
          let arrDate = [],
            startTime = moment(this.query.time[0]).format('YYYY-MM-DD'),
            endTime = moment(obj.stop).format('YYYY-MM-DD');
          while (moment(startTime).isBefore(endTime)) {
            arrDate.push(startTime)
            startTime = moment(startTime).add(1, 'days').format('YYYY-MM-DD')
          }
          console.log("arr", arrDate);
          let tableDays = ['时间'];
          tableDays = [...tableDays, ...arrDate]
          this.tableHeadJson = [];
          this.tableRowJson = [];
          for (let index = 0; index < tableDays.length; index++) {
            let element = tableDays[index];
            let key = "key" + index;
            let tableHead = {};
            tableHead.key = key;
            tableHead.title = element;

            this.tableHeadJson.push(tableHead);
          }


          for (let j = 0; j < this.timesDay.length; j++) {
            let rowValue = "{\"key0\":\"" + this.timesDay[j] + "\"";
            for (let index = 0; index < tableDays.length; index++) {
              if (index == 0) {
                continue;
              }
              let timeStr = tableDays[index] + " " + this.timesDay[j]

              let valueOfDateTime = undefined;
              for (let jj = 0; jj < cpkdata.length; jj++) {
                if (cpkdata[jj].time == timeStr + ":00") {
                  let key = "key" + index;
                  rowValue = rowValue + ",\"" + key + "\":" + cpkdata[jj].value;
                  break;
                }
              }
            }
            rowValue = rowValue + "}";
            let rowValueObject = JSON.parse(rowValue);
            this.tableRowJson.push(rowValueObject);
          }



          // tableHead:[
          //       {key:"name",title:'姓名'},
          //       {key:"sex",title:'性别'},
          //       {key:"phone",title:'手机号'},
          //       {key:"state",title:'状态'},
          //       {key:"address",title:'地址'}
          //   ],
          //   tableData:[
          //       {name:"张三",phone:undefined,state:1,sex:1,address:"北京"},
          //       {name:"王晓飞",phone:"15634567922",state:0,sex:2,address:"天津"},
          //       {name:"李浩",phone:"15634567922",state:0,sex:0,address:"北京"},
          //       {name:"张明",phone:"15634567922",state:0,sex:1,address:"北京"},
          //   ]

        })
        .catch((error) => { });

    },
    maxCPKchange(e) {
      console.log("最高", e);
      this.charMaxCPKday = []
      this.charMaxCPKMon = []
      this.charMaxCPKYear = []
      this.timesDay.forEach(item => {
        this.charMaxCPKday.push(e)
      })
      this.timesMonth.forEach(item => {
        this.charMaxCPKMon.push(e)
      })
      this.timesYear.forEach(item => {
        this.charMaxCPKYear.push(e)

      })

      //   console.log("111",this.charMaxCPKday,this.charMaxCPKMon,this.charMaxCPKYear);
      this.$nextTick(() => {
        this.drawLineDay();
        this.drawLineMonth();
        this.drawLineYear();
      })

    },
    minPCKChange(e) {
      this.charMinCPKday = []
      this.charMinCPKMon = []
      this.charMinCPKYear = []
      console.log("this.timesMonth", this.timesMonth);
      this.timesDay.forEach(item => {
        this.charMinCPKday.push(e)
      })
      this.timesMonth.forEach(item => {
        this.charMinCPKMon.push(e)
      })
      this.timesYear.forEach(item => {
        this.charMinCPKYear.push(e)

      })
      console.log("最低", this.charMinCPKday, this.charMinCPKMon, this.charMinCPKYear,);

      this.drawLineDay();
      this.drawLineMonth();
      this.drawLineYear();
    },

    drawLineDay() {
      var chartDom = document.getElementById("dayCPK");
      var myChart = echarts.init(chartDom);
      var option;
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      option = {
        title: {
          text: "日CPK",
          left: "center",
          top: 20,
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.timesDay,
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "日CPK",
            type: "line",
            data: this.dataXDay,
          },
          {
            name: "最高CPK",
            type: "line",
            data: this.charMaxCPKday,
          },
          {
            name: "最低CPK",
            type: "line",
            data: this.charMinCPKday,
          },
        ],
      };

      option && myChart.setOption(option);
    },
    drawLineMonth() {
      var chartDom = document.getElementById("monthCPK");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: "月CPK",
          left: "center",
          top: 20,
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },

        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.timesMonth,

        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "月CPK",
            type: "line",
            data: this.dataXMonth,
          },
          {
            name: "最高CPK",
            type: "line",
            data: this.charMaxCPKMon,
          },
          {
            name: "最低CPK",
            type: "line",
            data: this.charMinCPKMon,
          },

        ],
      };

      option && myChart.setOption(option);
    },
    drawLineYear() {
      var chartDom = document.getElementById("yearCPK");
      console.log("chartDom", chartDom);
      var myChart = echarts.init(chartDom);
      var option;
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      option = {
        title: {
          text: "年CPK",
          left: "center",
          top: 20,
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },

        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.timesYear,
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "年CPK",
            type: "line",
            data: this.dataXYear,
          },
          {
            name: "最高CPK",
            type: "line",
            data: this.charMaxCPKYear,
          },
          {
            name: "最低CPK",
            type: "line",
            data: this.charMinCPKYear,
          },
        ],
      };

      option && myChart.setOption(option, true);
    },
  },
};
</script>
<style scoped>
.listTab {
  width: 100%;
  font-size: 14px;
  color: #6a6a6a;
  border: 1px solid #ececed;
  padding: 1px;
  background-color: #fff;
  height: 400px;
  overflow: auto;
 display: inline-grid;;
}

.JNPF-common-layout-center {
  overflow: auto;
  overflow-x: hidden;
}

table.listTab th {
  background-color: #ecf0f4;
  padding: 14px 8px;
  text-align: left;
  font-size: 14px;
  border: 1px solid #ecf0f4;
  min-width: 40px;
  color: #292d31;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

table.listTab th.check {
  min-width: 20px;
}

table.listTab tbody>tr td {
  padding: 16px 8px;
  text-align: left;
  font-size: 14px;
  border-bottom: 1px solid #ececed;
  vertical-align: middle;
  word-break: break-all;
  min-width: 50px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

table.listTab tbody>tr td.check {
  min-width: 20px;
}

table.listTab tbody>tr td:first-child {
  width: 20px;
}

table.listTab tbody>tr:hover {
  background-color: #dfeefc;
}

table.listTab tbody>tr.check {
  background-color: #dfeefc;
}

table.listTab tbody>tr:last-child td {
  border-bottom: 0px;
}

table.listTab tbody>tr td a {
  color: #248bfc;
}

table.listTab tbody>tr td input {
  border: 1px solid #248bfc;
}

table.listTab tbody>tr td .green {
  color: #72d34b;
  font-weight: bold;
}

table.listTab tbody>tr td .red {
  color: #f00;
  font-weight: bold;
}
.listTab tbody {
            display: block;
            height: 300px;
            overflow-y: scroll;
            overflow-x: clip;
        }
 
        table thead tr,
        table tbody tr {
            display: table;
            width: 100%;
            table-layout: fixed;
            text-align: center;
        }
 
        thead th,
        tbody td {
            width: 50px;
        }
 
        table thead {
            width: calc( 100% - 1em);
        }
</style>
