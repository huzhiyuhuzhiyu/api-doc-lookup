<template>
    <div class="app-center">
        <div style="line-height: 50px;  padding:0 20px; background-color: #F4F4F4; position: sticky; top: 0px; z-index: 1000;display:flex;justify-content: space-between;" >
                <div class="grid-content" style='padding-top:5px;'>
                    <el-date-picker v-model="times" type="datetimerange"  range-separator="至"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    :picker-options="pickerOptions" start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']"
                    >
                    </el-date-picker>
                    <el-button style="margin-left: 10px" size="mini" type="primary" @click="init()">查询 </el-button>
                </div>
            <span  @click.self="handla" class="guanbi" >×</span>
        </div>
        <div style="box-shadow:0px 0px 50px #E8E8E8;display: flex;justify-content: center;">
            <div class="text border1" style="width:100%; padding: 20px;">
                <!-- <el-row>
                    <el-col :span="8" >
                        <div class="grid-content bg-purple-light">
                            <el-date-picker v-model="times" type="datetimerange" format="yyyy-MM-dd" range-separator="至"
                                            value-format="yyyy-MM-dd"
                                            :picker-options="pickerOptions" start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                            >
                            </el-date-picker>
                            <el-button style="margin-left: 10px" size="mini" type="primary" @click="init()">查询
                            </el-button>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="grid-content ">
                        </div>
                    </el-col>
                </el-row> -->
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
                            <span>所属区域</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.mrpWorkshopName }}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>运行时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.bootDate }}</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>待机时长</span>
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
                            <span>故障时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.errorDate }}</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>关机时长</span>
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

        <div style="box-shadow:0px 0px 50px #E8E8E8;margin-top: 20px;padding-top: 20px;height: 200px;" id="main">
        </div>
        <div
            style="margin-top: 20px;box-shadow:0px 0px 50px #E8E8E8;padding-left: 50px;padding-top: 20px; min-height:750px;"
        >
            <el-timeline>
                <el-timeline-item v-for="(iotTime, index) in iotTimeData" :key="index" :color="iotTime.color"
                                  :timestamp="iotTime.time" placement="top"
                >
                    <el-card class="timelineCard">
                        <h4>{{ iotTime.lableZh }}</h4>
                        <p>开始时间：{{iotTime.start}}</p>
                        <p>结束时间：{{iotTime.stop}}</p>
                        <p>持续时间：{{iotTime.duration}}</p>
                    </el-card>
                </el-timeline-item>

            </el-timeline>
        </div>
    </div>
</template>

<script>
import {getColorListApi, getStateByDate } from '@/api/equipment'
import { getStateTimeLine } from '@/api/iot'

import { formatTime } from '@/utils/jx/jx-date'

import moment from 'moment'

export default {
    name: 'detailspages',
    props: {
        equipmentId: {
            type: String
        },
        // 序号 默认有
        optionDate: {
            type: String,
            default: moment(Number(new Date().getTime())).format('YYYY-MM-DD')
        }
    },
    data() {
        return {
            iotData: {
                stateTime: {}
            },
            iotTimeData: [],
            retainerList: [],

            colors: [],//'#909399', '#409EFF', '#67C23A', '#E6A23C', '#c23531'
            states: [],

            stateColorList: [],

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },

            times: []

        }
    },
    created() {
        // 拿出状态的颜色
        getColorListApi(colorList => {
            this.colors = [];
            this.states = [];
            for (var value of colorList) {
                if ('all' != value.code) {
                    this.colors.push(value.color)
                    this.states.push(value.name)
                }
            }
            this.stateColorList = colorList
        })


        this.times[0] = moment(Number(new Date(this.optionDate).getTime())).format('YYYY-MM-DD 00:00:00')
        this.times[1] = moment(Number(new Date(this.optionDate).getTime())).format('YYYY-MM-DD 23:59:59')

    },
    mounted() {
        this.init()
    },
    methods: {
        operation() {
            var chartDom = document.getElementById('main')
            var myChart = this.$echarts.init(chartDom)
            // var option;
            window.addEventListener('resize', function() {
                myChart.resize()
            })
            var colors = this.colors //三种状态的颜色
            var state = this.states //5种状态 顺序为'在线', '生产', '报警', '故障', '离线'

            let start = new Date(moment(Number(new Date(this.times[0]).getTime())).format('YYYY-MM-DD HH:mm:ss'))
            let stop = new Date(moment(Number(new Date(this.times[1]).getTime())).format('YYYY-MM-DD HH:mm:ss'))
            var n = 1
            if (stop.getDate() - start.getDate() > 0) {
                n = 2
                if (stop.getDate() - start.getDate() > 2) {
                    n = 3
                }
                if (stop.getDate() - start.getDate() > 3) {
                    n = 6
                }
                if (stop.getDate() - start.getDate() > 7) {
                    n = 12
                }
            }

            var x = 0;

            // echart配置
            var option = {
                color: colors,
                tooltip: { //提示框
                    trigger: 'item',
                    formatter: function(params) {
                        return params.name + ':' + params.value[1] + '~' + params.value[2]
                    } //数据的值
                },
                legend: { //图例
                    data: state,
                    // top:"170",
                    top: '10',
                    selectedMode: false, // 图例设为不可点击
                    textStyle: {
                        color: '#000'
                    }
                },
                grid: { //绘图网格
                    left: '3%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: 'time',
                    interval: 3600 * 1000 * n, //以一个小时递增
                    min: moment(Number(new Date(this.times[0]).getTime())).format('YYYY-MM-DD HH:mm:ss'), //将data里最小时间的整点时间设为min,否则min会以data里面的min为开始进行整点递增
                    max: moment(Number(new Date(this.times[1]).getTime())).format('YYYY-MM-DD HH:mm:ss'),
                    axisLabel: {
                        interval: 0,
                        formatter: function(value) {
                            var date = new Date(value)
                            let returnValue = moment(Number(date.getTime())).format('MM-DDHH:mm')

                            var ret = '' //拼接加\n返回的类目项
                            var max = 5  //每行显示的文字字数
                            var val = returnValue.length  //X轴内容的文字字数
                            var rowN = Math.ceil(val / max)  //需要换的行数
                            if (rowN > 1) {
                                for (var i = 0; i < rowN; i++) {
                                    var temp = ''  //每次截取的字符串
                                    var start = i * max  //开始截取的位置
                                    var end = start + max  //结束截取的位置
                                    temp = returnValue.substring(start, end) + '\n'
                                    ret += temp  //最终的字符串
                                }
                                return ret
                            } else {

                            }

                        }
                    }
                },
                yAxis: {
                    data: ['状态']
                },
                series: [
                    // 用空bar来显示三个图例
                    {
                        name: state[0],
                        type: 'bar',
                        data: []
                    },
                    {
                        name: state[1],
                        type: 'bar',
                        data: []
                    },
                    {
                        name: state[2],
                        type: 'bar',
                        data: []
                    },
                    {
                        name: state[3],
                        type: 'bar',
                        data: []
                    },
                    {
                        name: state[4],
                        type: 'bar',
                        data: []
                    }
                ]
            }

            let _iotData = {
                type: 'custom',
                renderItem: function(params, api) { //开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
                    var categoryIndex = api.value(0) //这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
                    var start = api.coord([api.value(1),
                        categoryIndex
                    ]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
                    var end = api.coord([api.value(2), categoryIndex])
                    var height = api.size([0, 1])[1]

                    return {
                        type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
                        shape: echarts.graphic.clipRectByRect({ // 矩形的位置和大小。
                            x: start[0],
                            y: start[1] - height / 2,
                            width: end[0] - start[0],
                            height: height
                        }, { // 当前坐标系的包围盒。
                            x: params.coordSys.x,
                            y: params.coordSys.y,
                            width: params.coordSys.width,
                            height: params.coordSys.height
                        }),
                        style: api.style()
                    }
                },
                encode: {
                    x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
                    y: 0// data 中『维度0』对应到 Y 轴
                },
                data: [ // 维度0 维度1 维度2
                ]
            }

            for (var i = 0; i < this.iotTimeData.length; i++) {
                let item = {
                    itemStyle: { normal: { color: this.iotTimeData[i].color } },
                    name: this.iotTimeData[i].lableZh,
                    value: [0, this.iotTimeData[i].start, this.iotTimeData[i].stop]
                }

                _iotData.data.push(item)

            }

            option.series.push(_iotData)

            option && myChart.setOption(option)
        },

        init() {
            let _query = {
                startTime: moment(new Date(this.times[0]).getTime()).format('YYYY-MM-DD HH:mm:ss'),
                stopTime: moment(new Date(this.times[1]).getTime()).format('YYYY-MM-DD HH:mm:ss')
            }

            // console.log(_query)
            getStateByDate(this.equipmentId, _query).then(res => {
                let _data = res.data

                _data.stateTime.offlineDate = formatTime(_data.stateTime.offlineTime)
                _data.stateTime.haltDate = formatTime(_data.stateTime.haltTime)
                _data.stateTime.bootDate = formatTime(_data.stateTime.bootTime)
                _data.stateTime.onlineDate = formatTime(_data.stateTime.onlineTime)
                _data.stateTime.warnDate = formatTime(_data.stateTime.warnDate)
                _data.stateTime.errorDate = formatTime(_data.stateTime.errorTime)

                this.iotData = _data
                this.getEquipmentTimeLine(this.iotData.uuid)

            })
        },
        getEquipmentTimeLine(uid) {
            let time = new Date()
            let stopDate = new Date(this.times[1])

            let start = moment(Number(new Date(this.times[0]).getTime())).format('YYYY-MM-DD HH:mm:ss.000')
            let stop = moment(Number(new Date(this.times[1]).getTime())).format('YYYY-MM-DD HH:mm:ss.SSS')

            if(stopDate.getDate() == time.getDate() && stopDate.getHours() >= time.getHours() && stopDate.getMinutes() >= time.getMinutes()){
                stop = moment(Number(time.getTime())).format('YYYY-MM-DD HH:mm:ss.SSS')
            }

            let query = {
                uid: uid,
                start: start,
                stop: stop,
                categories: [
                    'online', 'boot', 'warn', 'error'
                ]
            }
            getStateTimeLine(query).then(res => {
                if (res.code == '200') {
                    let _list = res.data

                    this.iotTimeData = this.disposeIotTimeData(_list)

                    this.operation()
                }
            })
        },

        disposeIotTimeData(arr) {
            let list = arr
            list.forEach(item => {

                item.time = item.start.substring(0,10);
                item.duration = formatTime(item.duration)

                for (let i = 0; i < this.stateColorList.length; i++) {
                    let el = this.stateColorList[i]
                    if (item.category == el.code) {
                        item.color = el.color
                    }
                }
            })
            return list
        },

        getSeriesData() {
            var colors = this.colors

            var _list = this.retainerList
            var arr = []
            for (var i = 0; i < _list.length; i++) {
                let _item = {
                    itemStyle: {
                        normal: {
                            color: _list[i].category == 'EVENT' ? colors[0] : colors[1]
                        }
                    },
                    name: '清醒',
                    value: [2, '2009/6/1 14:52', '2009/6/1 17:00']
                }

            }
        },

        handla() {
            this.$emit('handle')
        }
    }
}
</script>

<style scoped>
.app-center {
    width: 100%;
    background-color: white;
    overflow-y: auto;
}

.el-row {
    border-top: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
}

.border1 .el-row:nth-of-type(3) {
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

.timelineCard p{
    margin: 10px 0 0 0;
}
</style>
