<template>
    <div class="app-center">
        <div
            style="line-height: 50px; text-align: right; padding-right: 20px; background-color: #F4F4F4; position: sticky; top: 0px; z-index: 1000;"
        ><span
            @click.self="handla" class="guanbi"
        >×</span></div>
        <div style="box-shadow:0px 0px 50px #E8E8E8;display: flex;justify-content: center;">
            <div class="text border1" style="width:100%; padding: 20px;">
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
                            <span>今日运行时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.boot }}</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>今日停机时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.halt }}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>今日开机时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.online }}</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple">
                            <span>今日关机时长</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="grid-content bg-purple-light">
                            <span>{{ iotData.stateTime.offline }}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div style="box-shadow:0px 0px 50px #E8E8E8;margin-top: 20px;padding-top: 20px;height: 200px;" id="main">
        </div>
        <div style="margin-top: 20px;box-shadow:0px 0px 50px #E8E8E8;padding-left: 50px;padding-top: 20px; min-height:750px">
            <el-timeline>
                <el-timeline-item v-for="(iotTime, index) in iotTimeData" :key="index" :color="iotTime.color"
                                  :timestamp="iotTime.start"
                >
                    {{ iotTime.lableZh }}
                </el-timeline-item>

            </el-timeline>
            <!-- <el-timeline>
               <el-timeline-item v-for="(item, index) in retainerList" :key="index" :type="item.category" :color="item.color"
                 :size="item.size" :timestamp="item.start">
                 {{item.lableZh}}
               </el-timeline-item>
             </el-timeline> -->
        </div>
    </div>
</template>

<script>
import { getState } from '@/api/equipment'
import { getStateTimeLine } from '@/api/iot'

import { formatTime, getTodayMs } from '@/utils/jx/jx-date'

import moment from 'moment'

export default {
    name: 'detailspages',
    props: ['equipmentId'],
    data() {
        return {
            iotData: {
                stateTime: {}
            },
            iotTimeData: [],
            retainerList: [],

            colors: [],//'#909399', '#409EFF', '#67C23A', '#E6A23C', '#c23531'
            states: [],


        }
    },
    created() {
        // 拿出状态的颜色
        if (JSON.parse(localStorage.getItem("colorList"))) {
            let arr = JSON.parse(localStorage.getItem("colorList"))
            for (let i = 0; i < arr.length - 1; i++) {
                const el = arr[i];
                this.colors.push(el.bgc);
                this.states.push(el.name);
            }
            // console.log(this.colors);
        };


    },
    updated() {
        // this.operation();
    },
    mounted() {
        this.operation()
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
            var colors = this.colors; //三种状态的颜色

            var state = this.states; //5种状态 顺序为'在线', '生产', '报警', '故障', '离线'

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
                    bottom: '10',
                    selectedMode: false, // 图例设为不可点击
                    textStyle: {
                        color: '#000'
                    }
                },
                grid: { //绘图网格
                    left: '3%',
                    right: '3%',
                    top: '1%',
                    bottom: '30%',
                    containLabel: true
                },
                xAxis: {
                    type: 'time',
                    interval: 3600 * 1000, //以一个小时递增
                    min: moment(Number(new Date().getTime())).format('YYYY-MM-DD 00:00:00'), //将data里最小时间的整点时间设为min,否则min会以data里面的min为开始进行整点递增
                    max: moment(Number(new Date().getTime())).format('YYYY-MM-DD HH:mm:ss'),
                    axisLabel: {
                        formatter: function(value) {
                            var date = new Date(value)
                            return moment(Number(date.getTime())).format('HH:mm')//getzf(date.getHours()) + ':00'
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

            let _iotData =   {
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
                    y:  0// data 中『维度0』对应到 Y 轴
                },
                data: [ // 维度0 维度1 维度2
                ]
            }

            for (var i = 0; i < this.iotTimeData.length; i++) {
                let item = {
                    itemStyle: { normal: { color: colors[this.iotTimeData[i].colorIndex] } },
                    name: this.iotTimeData[i].lableZh,
                    value: [0, this.iotTimeData[i].start, this.iotTimeData[i].stop]
                };

                _iotData.data.push(item);


            }

            option.series.push(_iotData)



            option && myChart.setOption(option)
        },

        init() {
            getState(this.equipmentId).then(res => {
                // console.log(res.data);
                let _data = res.data

                _data.stateTime = {}

                let todayMs = getTodayMs()
                // console.log(todayMs);
                //给设备运行状态赋值
                // console.log(_data.stateTimeMap.online);
                let offTime = parseInt(todayMs) - parseInt(_data.stateTimeMap.online)
                _data.stateTime.offline = formatTime(offTime)

                let haltTime = parseInt(_data.stateTimeMap.online) - parseInt(_data.stateTimeMap.boot)
                _data.stateTime.halt = formatTime(haltTime)

                _data.stateTime.boot = formatTime(_data.stateTimeMap.boot)

                _data.stateTime.online = formatTime(_data.stateTimeMap.online)

                _data.stateTime.warn = formatTime(_data.stateTimeMap.warn)

                _data.stateTime.error = formatTime(_data.stateTimeMap.error)

                this.iotData = _data
                // console.log(this.iotData);
                this.getEquipmentTimeLine(this.iotData.uuid)

            })
        },
        getEquipmentTimeLine(uid) {
            let time = new Date()
            let start = moment(Number(time.getTime())).format('YYYY-MM-DD 00:00:00')
            let stop = moment(Number(time.getTime())).format('YYYY-MM-DD HH:mm:ss')

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

                    this.iotTimeData = this.disposeIotTimeData(_list);

                    this.operation()
                }
            })
        },

        disposeIotTimeData(arr){
            let list = arr;
            for (var i = 0; i < list.length; i++) {
                let item = list[i]
                if (item.category == 'online') {
                    item.color = this.colors[0]
                    item.colorIndex = 0;
                } else if (item.category == 'boot') {
                    item.color = this.colors[1]
                     item.colorIndex = 1;
                } else if (item.category == 'warn') {
                    item.color = this.colors[2]
                     item.colorIndex = 2;
                } else if (item.category == 'error') {
                    item.color = this.colors[3]
                     item.colorIndex = 3;
                } else {
                    item.color = this.colors[4]
                     item.colorIndex = 4;
                }

            }
            return list;
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
</style>
