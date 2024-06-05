<template>
  <div class="app-center">
    <div
      style="line-height: 50px;text-align: right; padding-right: 20px; width: 100%; background-color: #F4F4F4; position: sticky; top: 0px; z-index: 1000;">
      <span @click.self="handla" class="guanbi">×</span>
    </div>
    <div style="width: 100%;box-shadow:0px 0px 50px #E8E8E8;display: flex;justify-content: center; ">
      <div class="text" style="width:100%; padding: 20px;">
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>点位名称</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>{{ dataForm.equipmentId_name }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>点位位置</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>{{ dataForm.tableField119[0].mrpWorkshopId }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>能耗类型</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>{{ dataForm.tableField119[0].energyType }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>当日起始度数</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>{{ dataForm.startValue }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>当日终止度数</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>{{ dataForm.value }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>当日使用度数</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>{{ dataForm.useValue }}</span>
            </div>
          </el-col>
        </el-row>

      </div>
    </div>
    <div style="width: 100%;margin-top: 20px;background-color: #FFFFFF;box-shadow:0px 0px 50px #E8E8E8; padding: 20px;">
      <div class="text" style="text-align: right; padding-right: 20px;">
        <span>切换图表</span>：
        <el-select v-model="value" placeholder="请选择" @change="hendless">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="width: 100%;min-height: 60vh;" id="ecartss">
      </div>
    </div>

    <div style="width: 100%;margin-top: 20px; padding: 20px; background-color: #FFFFFF;">
      <!-- <ve-table :columns="columns" :table-data="tableData" :border-around=true :border-x=true :border-y="true" /> -->
      <JNPF-table v-loading="listLoading" :data="tableDada" height="800" :hasNO="false">
        <el-table-column label="时间段" prop="time">

        </el-table-column>
        <el-table-column prop="startValue" label="起始度数">
        </el-table-column>
        <el-table-column prop="value" label="终止度数">
        </el-table-column>
        <el-table-column prop="useValue" label="使用度数">
        </el-table-column>
      </JNPF-table>
    </div>

    <div style="width: 100%; height: 40px;"></div>
  </div>
</template>

<script>
import {
  getIot,
  getMosaicBar,
  getAggregationTimeByUidAndCategories_v1
} from '@/api/iot'


import { formatTime, formatMinute } from '@/utils/jx/jx-date'
import { getListEnergyByIds, getState } from '@/api/equipment'

import {
  mapGetters
} from 'vuex'

import moment from 'moment'

export default {
  name: 'detailspages',
  props: ['dataForm'],
  data() {
    return {

      options: [{
        value: '折线图',
        label: '折线图'
      },
      {
        value: '柱状图',
        label: '柱状图'
      }
      ],

      list: [
      ],



      value: '柱状图',
      types: 'bar',

      iot_data: {},

      //设备运行状态持续时间
      iot_state_time: {
        onlie_time: "",
        boot_time: "",
        warn_time: "",
        error_time: ""
      },
      listLoading: false,
      //运行和停机时间
      bootTimes: [],
      tableDada: [],
    }
  },
  mounted() {
    this.initData()
    console.log("666", this.dataForm
    );
  },
  computed: {
    ...mapGetters(['newDate'])
  },
  methods: {
    initData() {
      this.listLoading = true

      let _query = this.disposeQuery()
      getListEnergyByIds(_query).then(res => {
        console.log(111, res);
        if (res.code == 200) {

          let _list = res.data
          this.list = _list

          this.ecarts()
          for (var i = 0; i < _list.length; i++) {
            let la = _list[i]

            if (la.result != null) {
              for (let j = 0; j < la.result.data.length; j++) {
                la.result.data[j] = la.result.data[j].toFixed(2)
              }


              
            }
            if (la.result.data != null && la.result.timeDate != null) {
                la.result.timeDate.forEach((item, index) => {
                  let obj = {
                    time: "",
                    startValue: "",
                    value: "",
                    useValue: ""
                  }
                  obj.time = la.result.timeDate[index].substring(11, 16)
                  obj.useValue = la.result.data[index]
                  console.log("obj", obj);
                  this.tableDada.push(obj)
                });
                console.log("tableDada", this.tableDada);
                this.tableDada[0].startValue = (parseFloat(this.dataForm.value) - parseFloat(this.dataForm.useValue)).toFixed(2)
                for (let o = 0; o < this.tableDada.length; o++) {
                  this.tableDada[o].value = (parseFloat(this.tableDada[o].startValue) + parseFloat(this.tableDada[o].useValue)).toFixed(2)
                  this.tableDada[o + 1].startValue = this.tableDada[o].value
                  this.tableDada[o + 1].value = (parseFloat(this.tableDada[o + 1].startValue) + parseFloat(this.tableDada[o + 1].useValue)).toFixed(2)

                }
              }
          console.log("_list", _list);

          }
         
        }

        this.listLoading = false

      }).catch(error => {
        this.listLoading = false

      })
      console.log(_query)

    },
    //处理请求参数
    disposeQuery() {

      var reqsV3 = []
      var ids = []

      let time = new Date(this.dataForm.startTime)

      let start = moment(Number(time.getTime())).format('YYYY-MM-DD 00:00:00')
      let stop = moment(Number(time.getTime())).format('YYYY-MM-DD 23:59:59')


      ids.push(this.dataForm.equipmentId)

      let i1 = {
        uid: this.dataForm.uid,
        code: 'E000_1',
        every: 1,
        start: start,
        stop: stop,
        unit: 'h',
        fun: 'DIFF',
        filter: '',
        createEmpty: true,
        fill: '0'
      }

      reqsV3.push(i1)


      return { 'ids': ids, 'params': { 'reqsV3': reqsV3 } }
    },
    ecarts() {
      let myChart = this.$echarts.init(document.getElementById('ecartss'))

      window.addEventListener('resize', () => {
        myChart.resize()
      })

      let arrs = ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时',
        '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'
      ]
      // let str = arrs.slice(0, (new Date().getHours()+1))

      let emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      }

      let options = {
        title: {
          text: '能耗分析',
          left: '20px'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
        },
        grid: {
          left: '3%',
          right: '2%',
          bottom: '5%',
          top: '12%'
        },

        xAxis: {
          type: 'category',
          data: arrs
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }

      options.series = []

      for (var i = 0; i < this.list.length; i++) {
        let la = this.list[i]
        console.log(la)

        let item = {
          name: la.name,
          type: this.types,
          stack: 'one',
          emphasis: emphasisStyle,
          data: la.result.data
        }

        options.series.push(item)
      }

      myChart.setOption(options, true)
    },

    getBootTimes() {
      let TimeData = this.iot_data.data;

      // console.log(this.bootTimes);

      // let arr = [];
      let time = new Date();
      for (var i = 0; i < 24; i++) {
        let _item = {};
        if (i < 10) {
          _item.time = "0" + i + ":00~0" + i + ":59";
        } else {
          _item.time = i + ":00~" + i + ":59";
        }
        _item.output = TimeData[i];
        // console.log(this.bootTimes[i].boot);
        let start;
        let stop;
        if (i < 10) {
          start = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + i + ':00:00');
          stop = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + i + ':59:59');
        }
        else {
          start = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':00:00');
          stop = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':59:59');
        }
        let boot_query = {
          uid: this.dataForm.uuid,
          start: start,
          stop: stop,
          categories: ['boot']
        }
        getAggregationTimeByUidAndCategories_v1(boot_query).then(res => {
          if (res.code == '200') {
            var boot = formatMinute(res.data);
            var halt = formatMinute(3600000 - res.data);



            this.$set(_item, 'boot', boot);
            this.$set(_item, 'halt', halt);

            this.list.push(_item);

          }
        })



        // _item.boot = this.bootTimes[i].boot;
        // _item.halt = this.bootTimes[i].halt;




      }

      //this.timeOutPutList = arr;
      // console.log(this.timeOutPutList);
    },


    getTimes() {
      let time = new Date();
      let arr = [];
      for (var i = 0; i < 24; i++) {
        let start;
        let stop;
        if (i < 10) {
          start = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + i + ':00:00');
          stop = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + i + ':59:59');
        }
        else {
          start = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':00:00');
          stop = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':59:59');
        }
        let boot_query = {
          uid: this.dataForm.uuid,
          start: start,
          stop: stop,
          categories: ['boot']
        }

        getAggregationTimeByUidAndCategories_v1(boot_query).then(res => {
          if (res.code == '200') {
            var boot = formatMinute(res.data);
            var halt = formatMinute(3600000 - res.data);

            let item = {
              boot: boot,
              halt: halt
            }
            arr.push(item)
          }
        })

      }
      //this.bootTimes = arr;
      // console.log(this.bootTimes);
      //this.getBootTimes()

    },


    getEquitmentStateTime() {
      let start = moment(Number(new Date().getTime())).format('YYYY-MM-DD 00:00:00');
      let stop = moment(Number(new Date().getTime())).format('YYYY-MM-DD HH:mm:ss');

      let online_query = {
        uid: this.dataForm.uuid,
        start: start,
        stop: stop,
        categories: ['boot']
      }
      getAggregationTimeByUidAndCategories_v1(online_query).then(res => {
        if (res.code == '200') {
          var boot = formatTime(res.data);
          this.iot_state_time.boot_time = boot
        }
      })

    },



    handla() {
      // console.log('关闭详细页')
      this.$emit('handles')
    },
    hendless() {
      // console.log(this.value);
      if (this.value == '折线图') {
        this.types = 'line'
        this.ecarts()
      } else {
        this.types = 'bar'
        this.ecarts()
      }
    },
    /**
     * 格式化时间
     */
    formatterDate(row) {
      //console.log(row['time'])
      let date = new Date(row['time']);
      //let Y = date.getFullYear() + '-';
      // let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      // let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      let h1 = (date.getHours() - 1) < 10 ? '0' + (date.getHours() - 1) : (date.getHours() - 1);
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      if (date.getMinutes() == 59) {
        h1 = 23;
      }
      // let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return h1 + ':00' + "~" + h1 + ':59';

    }
  }
}
</script>


<style scoped>
.app-center {
  width: 100%;
  height: 100%;
  justify-content: center;
  /* background: #fffffb; */
  background-color: #fff;
  overflow-y: auto;
}

.el-row {
  border-top: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.bg-purple-dark {
  background: #fafafa;
}

.bg-purple {
  background: #fafafa;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: #909399;
  border-right: 1px solid #ebeef5;
}

.bg-purple-light {
  background: #ffffff;
  display: flex;
  align-items: center;
  padding-left: 20px;
  color: #606266;
}

.grid-content {
  border-radius: 4px;
  min-height: 45px;
}

.guanbi {
  /* 点击区域加大 */
  padding: 3px;
  font-size: 30px;
}

.guanbi:hover {
  cursor: pointer;
}
</style>
