<template>
    <div class="app-center">
        <div style="line-height: 50px;  padding:0 20px; background-color: #F4F4F4; position: sticky; top: 0px; z-index: 1000;display:flex;justify-content: space-between;" >
            <div class="grid-content" style='padding-top:5px;'>
                <el-date-picker v-model="time" type="date" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions" start-placeholder="开始日期"
                                end-placeholder="结束日期" :clearable="false"
                >
                </el-date-picker>
                <el-button style="margin-left: 10px" size="mini" type="primary" @click="init()">查询 </el-button>
            </div>
            <span  @click.self="handla" class="guanbi" >×</span>
        </div>
        <div style="width: 100%;box-shadow:0px 0px 50px #E8E8E8;display: flex;justify-content: center; ">
            <div class="text" style="width:100%; padding: 20px;">
                <el-row>
                    <el-col :span="8">
                        <div class="grid-content bg-purple-light">

                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content ">
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>设备名称</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.name }}</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>今日产量</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iot_data.sum }}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>当日运行时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.bootDate }}</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>当日待机时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.haltDate }}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>当日故障时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.errorDate }}</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>当日关机时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.offlineDate }}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div
            style="width: 100%;margin-top: 20px;background-color: #FFFFFF;box-shadow:0px 0px 50px #E8E8E8; padding: 20px;"
        >
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
            <!--      <ve-table :columns="columns" :table-data="tableData" :border-around=true :border-x=true :border-y="true"/>-->
            <el-table :data="timeOutPutList" height="800">
                <el-table-column prop="time" label="时间段">
                </el-table-column>
                <el-table-column prop="boot" label="运行时长(分钟)">
                </el-table-column>
                <el-table-column prop="halt" label="待机时长(分钟)">
                </el-table-column>
                <el-table-column prop="error" label="故障时长(分钟)">
                </el-table-column>
                <el-table-column prop="offline" label="关机时长(分钟)">
                </el-table-column>
                <el-table-column prop="output" label="产量">
                </el-table-column>
            </el-table>
        </div>

        <div style="width: 100%; height: 40px;"></div>
    </div>
</template>

<script>
import { getBatchAggregationTimeByUidAndCategories, getMosaicBar } from '@/api/iot'

import { formatMinute, formatTime, getTodayMs } from '@/utils/jx/jx-date'

import { mapGetters } from 'vuex'

import moment from 'moment'
import { getState ,getStateByDate} from '@/api/equipment'

export default {
    name: 'detailspages',
    props: ['equipmentId'],
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
            value: '',
            types: 'bar',

            iot_data: {},

            //设备运行状态持续时间
            iot_state_time: {
                onlie_time: '',
                boot_time: '',
                warn_time: '',
                error_time: ''
            },

            //运行和停机时间
            bootTimes: [],

            timeOutPutList: [],

            //设备状态对象信息
            iotData: {
                stateTime: {
                    boot: '',
                    halt: '',
                    error: '',
                    offline: ''
                }
            },

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },

            time: undefined
        }
    },
    mounted() {
        this.time = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
        this.init()

    },
    computed: {
        ...mapGetters(['newDate'])
    },
    methods: {

        init() {
            let _query = {
                startTime: moment(new Date(this.time).getTime()).format('YYYY-MM-DD 00:00:00'),
                stopTime: moment(new Date(this.time).getTime()).format('YYYY-MM-DD 23:59:59')
            }
            console.log(_query)
            getStateByDate(this.equipmentId,_query).then(res => {
                let _data = res.data

                // _data.stateTime = {}
                //
                // let todayMs = getTodayMs()
                // //给设备运行状态赋值
                // let offTime = parseInt(todayMs) - parseInt(_data.stateTimeMap.online)
                // _data.stateTime.offline = formatTime(offTime)
                //
                // let haltTime = parseInt(_data.stateTimeMap.online) - parseInt(_data.stateTimeMap.boot)
                // _data.stateTime.halt = formatTime(haltTime)
                //
                // _data.stateTime.boot = formatTime(_data.stateTimeMap.boot)
                //
                // _data.stateTime.online = formatTime(_data.stateTimeMap.online)
                //
                // _data.stateTime.warn = formatTime(_data.stateTimeMap.warn)
                //
                // _data.stateTime.error = formatTime(_data.stateTimeMap.error)

                _data.stateTime.offlineDate = formatTime(_data.stateTime.offlineTime)
                _data.stateTime.haltDate = formatTime(_data.stateTime.haltTime)
                _data.stateTime.bootDate = formatTime(_data.stateTime.bootTime)
                _data.stateTime.onlineDate = formatTime(_data.stateTime.onlineTime)
                _data.stateTime.warnDate = formatTime(_data.stateTime.warnDate)
                _data.stateTime.errorDate = formatTime(_data.stateTime.errorTime)


                this.iotData = _data

                console.log(this.iotData)

                this.operation()
            })
        },

        operation() {
            let start = moment(Number(new Date(this.time).getTime())).format('YYYY-MM-DD 00:00:00')
            let stop = moment(Number(new Date(this.time).getTime())).format('YYYY-MM-DD 23:59:59')

            let _query = {
                uid: this.iotData.uuid,
                code: 'S232_61',
                start: start,
                stop: stop,
                every: 1,
                unit: 'h',
                fun: 'DIFF'
            }
            getMosaicBar(_query).then(res => {
                if (res.code == 200) {
                    var _data = res.data
                    let list = []
                    for (let i = 0; i < _data.data.length; i++) {
                        let item = {}
                        item.output = _data.data[i]
                        item.time = _data.timeDate[i]
                        list.push(item)
                    }
                    _data.list = list

                    this.iot_data = _data

                    this.setOption(_data)

                    this.getBootTimes()

                }
            })

        },
        //设置echarts图表
        setOption(data) {
            var chartDom = document.getElementById('main')
            var myChart = this.$echarts.init(chartDom)
            window.addEventListener('resize', function() {
                myChart.resize()
            })

            let _data = data
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
                        color: '#000'
                    }
                }]
            }
            option && myChart.setOption(option)

        },

        getBootTimes() {
            this.timeOutPutList = [];

            let TimeData = this.iot_data.data
            let time = new Date()

            let forn = time.getHours()
            if (time.getDate() != new Date(this.time).getDate()) {
                time = new Date(this.time)
                forn = 23
            }
            for (var i = 0; i <= forn; i++) {
                let _item = {}
                if (i < 10) {
                    if (i + 1 == 10) {
                        _item.time = '0' + i + ':00~' + (i + 1) + ':00'
                    } else {
                        _item.time = '0' + i + ':00~0' + (i + 1) + ':00'
                    }

                } else {
                    if (i + 1 == 24) {
                        _item.time = i + ':00~' + i + ':59'
                    } else {
                        _item.time = i + ':00~' + (i + 1) + ':00'
                    }
                }
                _item.output = TimeData[i]

                this.timeOutPutList.push(_item)

                let start
                let stop
                if (i < 10) {
                    start = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + i + ':00:00')
                    if (i + 1 == 10) {
                        stop = moment(Number(time.getTime())).format('YYYY-MM-DD ' + (i + 1) + ':00:00')
                    } else {
                        stop = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + (i + 1) + ':00:00')
                    }

                } else {
                    start = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':00:00')
                    if (i + 1 == 24) {
                        stop = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':59:59')
                    } else {
                        stop = moment(Number(time.getTime())).format('YYYY-MM-DD ' + (i + 1) + ':00:00')
                    }
                }
                let boot_query = {
                    uid: this.iotData.uuid,
                    start: start,
                    stop: stop,
                    categories: [['online'], ['online', 'boot'], ['online', 'error']]
                }
                getBatchAggregationTimeByUidAndCategories(boot_query).then(res => {
                    if (res.code == '200') {

                        var data = res.data.data || [0, 0, 0, 60]


                        let online = formatMinute(data[0])
                        let boot = formatMinute(data[1])
                        let error = formatMinute(data[2])
                        let time = data[3]



                        if (online > time) {
                            online = time
                        }

                        if ( boot > online) {
                            boot = online
                            console.log("进来了："+boot)
                        }

                        let halt = parseInt(online) - parseInt(boot) - parseInt(error)
                        let offline = time - (parseInt(boot) + parseInt(halt))

                        console.log("在线："+online+"运行："+boot +"待机："+ halt +"故障："+error+"关机："+offline+"time:"+time)


                        this.$set(_item, 'boot', boot)
                        this.$set(_item, 'halt', halt)
                        this.$set(_item, 'error', error)
                        this.$set(_item, 'offline', offline)

                    }
                })
            }
        },

        handla() {
            this.$emit('handles')
        },
        hendless() {
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
            let date = new Date(row['time'])
            let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            let h1 = (date.getHours() - 1) < 10 ? '0' + (date.getHours() - 1) : (date.getHours() - 1)
            let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            if (date.getMinutes() == 59) {
                h1 = 23
            }
            return h1 + ':00' + '~' + h1 + ':59'

        }
    }
}
</script>


<style scoped>
.app-center {
    width: 100%;
    height: 100%;
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
