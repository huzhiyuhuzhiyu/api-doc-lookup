<template>
  <div class="app-center">
    <div style="line-height: 50px;text-align: right; padding-right: 20px; width: 100%; background-color: #F4F4F4; position: sticky; top: 0px; z-index: 1000;"><span
        @click.self="handla" class="guanbi">×</span></div>
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
              <span>{{dataForm.equipmentId_name}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>点位位置</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>{{dataForm.tableField119[0].mrpWorkshopId}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>环境类型</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>{{dataForm.tableField119[0].energyType}}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <span>值</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <span>{{dataForm.value}}</span>
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
      <div style="width: 100%;min-height: 60vh;" id="main">
      </div>
    </div>

    <div style="width: 100%;margin-top: 20px; padding: 20px; background-color: #FFFFFF;">
      <!-- <ve-table :columns="columns" :table-data="tableData" :border-around=true :border-x=true :border-y="true" /> -->
       <JNPF-table :data="timeOutPutList" height="800" :hasNO="false" >
          <el-table-column prop="time"  label="时间段">
          </el-table-column>
          <el-table-column prop="value" label="值">
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


  import {formatTime,formatMinute} from '@/utils/jx/jx-date'

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

        timeOutPutList: [
          /* {
            time: "00:00-00:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "01:00-01:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "02:00-02:59",
           startValue: "589",
           value: "589",
           useValue: "0",
          },
          {
            time: "03:00-03:59",
           startValue: "589",
           value: "589",
           useValue: "0",
          },
          {
            time: "04:00-04:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "05:00-05:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "06:00-06:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "07:00-07:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "08:00-08:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "09:00-09:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "10:00-10:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "11:00-11:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "12:00-12:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "13:00-13:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "14:00-14:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "15:00-15:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "16:00-16:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "17:00-17:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "18:00-18:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "19:00-19:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "20:00-20:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "21:00-21:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "22:00-22:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          },
          {
            time: "23:00-23:59",
            startValue: "589",
            value: "589",
            useValue: "0",
          }, */
        ],



        value: '',
        types: 'bar',

        iot_data: {},

        //设备运行状态持续时间
        iot_state_time:{
            onlie_time:"",
            boot_time:"",
            warn_time:"",
            error_time:""
        },

        //运行和停机时间
        bootTimes:[],


      }
    },
    mounted() {

      this.operation();

      console.log(this.dataForm);
    },
    computed: {
      ...mapGetters(['newDate'])
    },
    methods: {
      operation() {
        var chartDom = document.getElementById("main");
        var myChart = this.$echarts.init(chartDom);
        var option;
        window.addEventListener("resize", function () {
          myChart.resize();
        });
        option = {
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: [
              "0时",
              "1时",
              "2时",
              "3时",
              "4时",
              "5时",
              "6时",
              "7时",
              "8时",
              "9时",
              "10时",
              "11时",
              "12时",
              "13时",
              "14时",
              "15时",
              "16时",
              "17时",
              "18时",
              "19时",
              "20时",
              "21时",
              "22时",
              "23时",
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
          yAxis: {
            type: "value",
          },
          tooltip: {
            trigger: "axis",
          },
          series: [
           /* {
              name: "Direct",
              type: this.types,
              barWidth: "60%",
              data: [10, 52, 200, 334, 390, 330, 220],
              color: "#5470C6",
            }, */
          ],
        };
        option && myChart.setOption(option);
      },

        //设置echarts图表
      setOption(data){
          var chartDom = document.getElementById('main')
          var myChart = this.$echarts.init(chartDom)
          window.addEventListener('resize', function() {
            myChart.resize()
          })

          let _data = data;
          var option = {
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时',
                  '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'
                ],
                axisTick: {
                  alignWithLabel: true
                }
              },
              yAxis: {
                type: 'value'
              },
              tooltip: {
                trigger: 'axis'
              },
              series: [{
                name: '产量',
                type: this.types,
                barWidth: '60%',
                data: _data.data,
                color: '#5470C6',
                label: {
                  show: true,
                  position: 'top',
                  fontWeight: 'bold',
                  color: '#000',
                }
              }]
            }
            option && myChart.setOption(option)

      },

       getBootTimes(){
            let TimeData = this.iot_data.data;

            // console.log(this.bootTimes);

            // let arr = [];
            let time = new Date();
            for (var i = 0; i < 24; i++) {
                let _item = {};
                if(i<10){
                    _item.time = "0"+i +":00~0"+i+":59";
                }else{
                    _item.time = i +":00~"+i+":59";
                }
                _item.output = TimeData[i];
                // console.log(this.bootTimes[i].boot);
                let start;
                let stop;
                if(i<10){
                    start = moment(Number(time.getTime())).format('YYYY-MM-DD 0'+i+':00:00');
                    stop = moment(Number(time.getTime())).format('YYYY-MM-DD 0'+i+':59:59');
                }
                else{
                    start = moment(Number(time.getTime())).format('YYYY-MM-DD '+i+':00:00');
                    stop = moment(Number(time.getTime())).format('YYYY-MM-DD '+i+':59:59');
                }
                let boot_query ={
                    uid: this.dataForm.uuid,
                    start: start,
                    stop: stop,
                    categories: ['boot']
                }
                getAggregationTimeByUidAndCategories_v1(boot_query).then(res =>{
                      if(res.code == '200'){
                          var boot = formatMinute(res.data);
                          var halt = formatMinute(3600000-res.data);



                         this.$set(_item,'boot',boot);
                         this.$set(_item,'halt',halt);

                         this.timeOutPutList.push(_item);

                      }
                })



                // _item.boot = this.bootTimes[i].boot;
                // _item.halt = this.bootTimes[i].halt;




            }

            //this.timeOutPutList = arr;
            // console.log(this.timeOutPutList);
      },


      getTimes(){
          let time = new Date();
           let arr = [];
          for (var i = 0; i < 24; i++) {
              let start;
              let stop;
              if(i<10){
                  start = moment(Number(time.getTime())).format('YYYY-MM-DD 0'+i+':00:00');
                  stop = moment(Number(time.getTime())).format('YYYY-MM-DD 0'+i+':59:59');
              }
              else{
                  start = moment(Number(time.getTime())).format('YYYY-MM-DD '+i+':00:00');
                  stop = moment(Number(time.getTime())).format('YYYY-MM-DD '+i+':59:59');
              }
              let boot_query ={
                  uid: this.dataForm.uuid,
                  start: start,
                  stop: stop,
                  categories: ['boot']
              }

              getAggregationTimeByUidAndCategories_v1(boot_query).then(res =>{
                    if(res.code == '200'){
                        var boot = formatMinute(res.data);
                        var halt = formatMinute(3600000-res.data);

                        let item ={
                            boot:boot,
                            halt:halt
                        }
                        arr.push(item)
                    }
              })

          }
          //this.bootTimes = arr;
          // console.log(this.bootTimes);
          //this.getBootTimes()

      },


      getEquitmentStateTime(){
          let start = moment(Number(new Date().getTime())).format('YYYY-MM-DD 00:00:00');
          let stop = moment(Number(new Date().getTime())).format('YYYY-MM-DD HH:mm:ss');

          let online_query ={
              uid: this.dataForm.uuid,
              start: start,
              stop: stop,
              categories: ['boot']
          }
          getAggregationTimeByUidAndCategories_v1(online_query).then(res =>{
                if(res.code == '200'){
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
          this.operation()
        } else {
          this.types = 'bar'
          this.operation()
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
    overflow-y:auto;
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

  .guanbi{
    /* 点击区域加大 */
    padding: 3px;
    font-size: 30px;
  }

  .guanbi:hover {
    cursor: pointer;
  }
</style>
