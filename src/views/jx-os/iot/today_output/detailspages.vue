<template>
    <div class="app-center">
        <div
            style="line-height: 50px; text-align: right; padding-right: 20px; width: 100%; background-color: #F4F4F4; position: sticky; top: 0px; z-index: 1000;"
        ><span
            @click.self="handla" class="guanbi"
        >×</span></div>
        <div style="width: 100%;box-shadow:0px 0px 50px #E8E8E8;display: flex;justify-content: center; ">
            <div class="text" style="width:100%; padding: 20px;">
                <el-row>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>设备名称</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ dataForm.name }}</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>所属区域</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ dataForm.mrpWorkshopName }}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>今日运行时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iot_state_time.boot_time }}</span>
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
                <el-table-column prop="halt" label="停机时长(分钟)">
                </el-table-column>
                <el-table-column prop="output" label="产量">
                </el-table-column>
            </el-table>
        </div>

        <div style="width: 100%; height: 40px;"></div>
    </div>
</template>

<script>
import { getAggregationTimeByUidAndCategories_v1, getMosaicBar } from '@/api/iot'

import { formatMinute, formatTime } from '@/utils/jx/jx-date'

import { mapGetters } from 'vuex'

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

            timeOutPutList: []

        }
    },
    mounted() {

        this.operation()

        this.getEquitmentStateTime()

    },
    computed: {
        ...mapGetters(['newDate'])
    },
    methods: {
        operation() {
            let start = moment(Number(new Date().getTime())).format('YYYY-MM-DD 00:00:00')
            let stop = moment(Number(new Date().getTime())).format('YYYY-MM-DD 23:59:59')

            let _query = {
                uid: this.dataForm.uuid,
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
            let TimeData = this.iot_data.data

            // console.log(this.bootTimes);

            // let arr = [];
            let time = new Date()
            for (var i = 0; i < 24; i++) {
                let _item = {}
                if (i < 10) {
                    _item.time = '0' + i + ':00~0' + i + ':59'
                } else {
                    _item.time = i + ':00~' + i + ':59'
                }
                _item.output = TimeData[i]
                // console.log(this.bootTimes[i].boot);
                let start
                let stop
                if (i < 10) {
                    start = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + i + ':00:00')
                    stop = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + i + ':59:59')
                } else {
                    start = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':00:00')
                    stop = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':59:59')
                }
                let boot_query = {
                    uid: this.dataForm.uuid,
                    start: start,
                    stop: stop,
                    categories: ['boot']
                }
                getAggregationTimeByUidAndCategories_v1(boot_query).then(res => {
                    if (res.code == '200') {
                        var boot = formatMinute(res.data)
                        var halt = formatMinute(3600000 - res.data)

                        this.$set(_item, 'boot', boot)
                        this.$set(_item, 'halt', halt)

                        this.timeOutPutList.push(_item)

                    }
                })

                // _item.boot = this.bootTimes[i].boot;
                // _item.halt = this.bootTimes[i].halt;

            }

            //this.timeOutPutList = arr;
            console.log(this.timeOutPutList)
        },

        getTimes() {
            let time = new Date()
            let arr = []
            for (var i = 0; i < 24; i++) {
                let start
                let stop
                if (i < 10) {
                    start = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + i + ':00:00')
                    stop = moment(Number(time.getTime())).format('YYYY-MM-DD 0' + i + ':59:59')
                } else {
                    start = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':00:00')
                    stop = moment(Number(time.getTime())).format('YYYY-MM-DD ' + i + ':59:59')
                }
                let boot_query = {
                    uid: this.dataForm.uuid,
                    start: start,
                    stop: stop,
                    categories: ['boot']
                }

                getAggregationTimeByUidAndCategories_v1(boot_query).then(res => {
                    if (res.code == '200') {
                        var boot = formatMinute(res.data)
                        var halt = formatMinute(3600000 - res.data)

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
            let start = moment(Number(new Date().getTime())).format('YYYY-MM-DD 00:00:00')
            let stop = moment(Number(new Date().getTime())).format('YYYY-MM-DD HH:mm:ss')

            let online_query = {
                uid: this.dataForm.uuid,
                start: start,
                stop: stop,
                categories: ['boot']
            }
            getAggregationTimeByUidAndCategories_v1(online_query).then(res => {
                if (res.code == '200') {
                    var boot = formatTime(res.data)
                    this.iot_state_time.boot_time = boot
                }
            })

        },

        handla() {
            console.log('关闭详细页')
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
            let date = new Date(row['time'])
            //let Y = date.getFullYear() + '-';
            // let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
            // let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
            let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
            let h1 = (date.getHours() - 1) < 10 ? '0' + (date.getHours() - 1) : (date.getHours() - 1)
            let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            if (date.getMinutes() == 59) {
                h1 = 23
            }
            // let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return h1 + ':00' + '~' + h1 + ':59'

        }
    }
}
</script>


<style scoped>
.app-center {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    font-size: 0.8vw;
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
