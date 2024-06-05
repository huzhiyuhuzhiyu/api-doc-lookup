<template>
    <div class="JNPF-common-layout">

        <div v-loading="loading"
         :element-loading-text="loadingText"
         :element-loading-spinner="loadingSpinner"
         :element-loading-background="loadingBackground"
         class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="12">
                <el-form style="display: flex;" @submit.native.prevent>
                    <el-col :span="5">
                        <el-form-item label="车间">
                            <JNPFTreeSelect v-model="query.mrpWorkshopId" placeholder="请选择"
                                            :options="mrpWorkshopIdOptions" :props="mrpWorkshopIdProps"
                                             clearable
                            />
                        </el-form-item>
                    </el-col>

                    <el-col :span="5">
                        <el-form-item label="时间">

                            <el-date-picker v-model="query.date" type="date" format="yyyy-MM-dd"
                                            :picker-options="pickerOptions" placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="5">
                        <el-form-item label="设备">
                            <el-input v-model="query.name" placeholder="编号/名称" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col  :span="4">
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="search()">查询</el-button>
                            <el-button size="mini" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>

                    <el-col style="text-align: right; display: flex;" :span="5">
                        <el-form-item label="定时">
                            <el-select v-model="value" @change="updatetimes">
                                <el-option v-for="item in updatetime" :key="item.value" :label="item.label" 
                                           :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div>
                            <el-button style="margin-left: 5px;" icon="el-icon-refresh" size="mini" type="primary"
                                       @click="refreshnow()"
                            >
                            </el-button>
                        </div>


                    </el-col>

                </el-form>
            </el-row>

            <div class="JNPF-common-layout-main JNPF-flex-main" style="overflow-y: auto;width: 100%;max-height: 100vh;"
                 @scroll="" c1
            >
                <!-- <div style="text-align: right;">
                   <screenfull style="margin: 14px;" isContainer/>
                 </div> -->
                <div>
                    <div class="item_" v-for="(item, index) in list" :key="item.id">

                        <div class="box_right">
                            <div style="">OEE:</div>
                            <div v-if="item.equipmentWorkpieceRatio">{{ (item.equipmentWorkpieceRatio.oee * 100).toFixed(0) }}%</div>
                        </div>

                        <div class="mson-oee">
                            <div style="display: flex; ">
                                <div class="box" style="background-color: #67C23A;">
                                    <div class="text">时间稼动率</div>
                                    <h2 class="value" v-if="item.equipmentWorkpieceRatio">
                                        {{ (item.equipmentWorkpieceRatio.timeRate * 100).toFixed(0) }}%</h2>
                                </div>
                                <div class="box" style="background-color: #E6A23C;">
                                    <div class="text">性能稼动率</div>
                                    <h2 class="value" v-if="item.equipmentWorkpieceRatio">
                                        {{ (item.equipmentWorkpieceRatio.performanceRate * 100).toFixed(0) }}%</h2>
                                </div>
                            </div>

                            <div style="display: flex; ">
                                <div class="box" style="background-color: #F56C6C;">
                                    <div class="text">实质稼动率</div>
                                    <h2 class="value" v-if="item.equipmentWorkpieceRatio">
                                        {{ (item.equipmentWorkpieceRatio.realCropRate * 100).toFixed(0) }}%</h2>
                                </div>
                                <div class="box" style="background-color: #909399;">
                                    <div class="text">速度稼动率</div>
                                    <h2 class="value" v-if="item.equipmentWorkpieceRatio">
                                        {{ (item.equipmentWorkpieceRatio.velocityRate * 100).toFixed(0) }}%</h2>
                                </div>
                            </div>

                        </div>

                        <div class="box_left">
                            <h3>{{ item.name }}</h3>
                            <div :id="`echart${index}`"></div>
                        </div>

                        <div class="box_center" :id="`echarta11${index}`"></div>

                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { getColorListApi, getListStateLine } from '@/api/equipment'

import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

import { mapGetters } from 'vuex'

import * as echarts from 'echarts'

import moment from 'moment'


export default {
    data() {
        return {
            list: [],
            listQuery: {
                currentPage: 1,
                pageSize: 1,
                sort: 'desc',
                sidx: 'name',
                // dataType: 0,
                active:1,
                isIot: true,//是否联网
                typeS: 'CG',
            },
            loading: true,
            query: {
                name: undefined,
                active: 1,
                mrpWorkshopId: undefined,
                mrpWorkshopIds: [],
                state: undefined,

                date: [],
                params: {
                    uid: null,
                    yield: '1',
                    // rate: "5000",
                    start: '', //'2022-11-03 00:00:00', //
                    stop: '', //'2022-11-03 23:59:59', //
                    categories: [
                        'online', 'boot', 'warn', 'error'
                    ]
                }
            },

            //设备颜色集合
            colorList: [],

            options: [
                {
                value: 'error',
                label: '故障'
                },
                {
                    value: 'boot',
                    label: '生产中'

                },
                {
                    value: 'warn',
                    label: '警报'
                },
                {
                    value: 'online',
                    label: '在线'
                },
                {
                    value: 'lixian',
                    label: '离线'
                }
            ],

            mrpWorkshopIdOptions: [],
            mrpWorkshopIdProps: {
                'label': 'name',
                'value': 'id',
                'children': 'children'
            },

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },

            colors: [], //['#409EFF', '#67C23A', '#E6A23C', '#c23531','#909399'],
            stateColorList:[],
            //状态比例
            stateRatioData: [
                {
                name: '在线',
                value: 0,
                ratio: '0%'
                },
                {
                    name: '生产',
                    value: 0,
                    ratio: '0%'
                },
                {
                    name: '报警',
                    value: 0,
                    ratio: '0%'
                },
                {
                    name: '故障',
                    value: 0,
                    ratio: '0%'
                },
                {
                    name: '离线',
                    value: 0,
                    ratio: '0%'
                }
            ],

            updatetime: [
                {
                value: '不刷新',
                label: '不刷新'
                },
                {
                    value: '5',
                    label: '5s'
                },
                {
                    value: '10',
                    label: '10s'
                },
                {
                    value: '30',
                    label: '30s'
                },
                {
                    value: '60',
                    label: '1m'
                },
                {
                    value: '300',
                    label: '5m'
                },
                {
                    value: '900',
                    label: '15m'
                },
                {
                    value: '1800',
                    label: '30m'
                },
                {
                    value: '3600',
                    label: '1h'
                },
                {
                    value: '7200',
                    label: '2h'
                },
                {
                    value: '86400',
                    label: '1d'
                }],
            value: '',
            timer: null,

            myChartsList: [],

            observer: null,
            firedNum: 0,
            recordOldValue: { // 记录下旧的宽高数据，避免重复触发回调函数
                width: '0',
                height: '0'
            }

        }
    },
    watch: {
        sidebar: {
            handler(newName, oldName) {
                setTimeout(() => {
                    this.myChartsList.forEach(item => {
                        item.resize()
                    })
                }, 100)

            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        ...mapGetters([
            'sidebar','loadingText', 'loadingBackground','loadingSpinner'
        ])
    },

    created() {
        this.getmrpWorkshopIdOptions()

        getColorListApi(colorList => {
            this.stateColorList = colorList;
            colorList.forEach(el => {
                this.colors.push(el.color)
            })
        })

        this.query.date = moment(Number(new Date().getTime())).format('YYYY-MM-DD')

    },
    updated() {
        // this.operation()
    },
    mounted() {
        this.initData(true)
        window.onresize = () => {
            // console.log("窗口发生变化时会打印该条");
            this.myChartsList.forEach(item => {
                item.resize()
            })
        }

    },

    methods: {
        //加载生产车间树
        getmrpWorkshopIdOptions() {
            getDataInterfaceRes('342715607101211205').then(res => {
                let data = res.data
                this.mrpWorkshopIdOptions = data
            })
        },
        //车间下拉框改变事件
        mrpWorkshopIdChange(e) {
            let id = e
            if(id != undefined && id != ''){
                //查子ID数组
                let _query = {
                    paramList: [{
                        field: 'ID',
                        fieldName: '',
                        dataType: 'varchar',
                        required: 0,
                        defaultValue: id
                    }],
                    tenantId: '',
                    origin: 'preview'
                }
                getDataInterfaceRes('365461198570824901', _query).then(res => {
                    let data = res.data
                    let _list = []
                    for (let i = 0; i < res.data.length; i++) {
                        let _data = res.data[i]
                        _list.push(_data.F_Id)
                    }
                    this.query.mrpWorkshopIds = _list
                })
            }
        },
        //搜索
        search() {
            this.listQuery.currentPage = 1
            this.listQuery.pageSize = 20
            this.listQuery.sort = 'desc'
            this.listQuery.sidx = 'name'
            this.initData(true)
        },
        //重置
        refresh(isrRefresh) {
            this.formVisible = false
            if (isrRefresh) this.reset()
        },
        reset() {
            for (let key in this.query) {
                this.query[key] = undefined
            }
            this.query.typeS = 'CG'
            this.search()
        },

        // 分页请求函数
        initData(boo) {
            this.loading = boo || false
            this.list = []
            this.myChartsList = []
            let _query = {
                ...this.listQuery,
                ...this.query,
                menuId: this.menuId
            }

            if (moment(Number(new Date(_query.date).getTime())).format('YYYY-MM-DD') == moment(Number(new Date().getTime())).format('YYYY-MM-DD')) {
                _query.params.start = moment(Number(new Date(_query.date).getTime())).format('YYYY-MM-DD 00:00:00.000')
                _query.params.stop = moment(Number(new Date().getTime())).format('YYYY-MM-DD HH:mm:ss.SSS')
            } else {
                _query.params.start = moment(Number(new Date(_query.date).getTime())).format('YYYY-MM-DD 00:00:00.000')
                _query.params.stop = moment(Number(new Date(_query.date).getTime())).format('YYYY-MM-DD 23:59:59.999')
            }
            getListStateLine(_query).then(res => {
                var res_list = res.data.list
                for (var i = 0; i < res_list.length; i++) {
                    let item = res_list[i]

                    if (item.stateTimeLine != null && item.stateTimeLine.length > 0) {
                        item.stateTimeLine_dispose = this.disposeIotTimeData(item.stateTimeLine)
                    } else {
                        item.stateTimeLine_dispose = []
                    }

                    if (!item.stateTime) {
                        item.stateTime = {
                            onlineTime: 0,
                            bootTime: 0,
                            warnTime: 0,
                            errorTime: 0,
                            offlineTime: 0
                        }
                    }

                }
                console.log("res_list",this.list);
                if(res_list.length>0){
                this.list = res_list

                }

                this.loading = false

                var t = this
                let timer1 = setInterval(function() {
                    var chartDom = document.getElementById(`echart${res_list.length - 1}`)
                    if (chartDom != null) {
                        t.operation()
                        window.clearInterval(timer1)
                    }
                }, 50)
            })

        },

        // 定时触发函数
        updatetimes(e) {
            clearInterval(this.timer)
            this.timer = null
            this.listQuery.currentPage = 1
            if (e != '不刷新') {
                this.timer = setInterval(this.initData, e * 1000)
            }
        },

        // 立即刷新按钮
        refreshnow() {
            //console.log("刷新");
            this.initData(true)
        },

        disposeIotTimeData(arr){
            let list = arr;
            list.forEach(item => {
                for (let i = 0; i < this.stateColorList.length; i++) {
                    let el = this.stateColorList[i]
                    if (item.category == el.code) {
                        item.color = el.color;
                        item.colorIndex = 0;
                    }
                }
            })
            return list;
        },


        //加载eacharts
        eacharts() {
            this.myChart = this.$echarts.init(document.getElementById('ecartss'))


            window.addEventListener('resize', () => {
                myChart.resize()
            })

            let options = JSON.parse(JSON.stringify(this.options))

            this.myChart.setOption(options, true)
        },

        operation() {
            var list = this.list

            var colors = this.colors //三种状态的颜色

            for (let i = 0; i < list.length; i++) {
                var chartDom = document.getElementById(`echart${i}`)
                var myChart = echarts.init(chartDom)
                this.myChartsList.push(myChart)
                // echart配置
                var option = {
                    color: colors,
                    tooltip: { //提示框
                        formatter: function(params) {
                            return params.name + ':' + params.value[1] + '~' + params.value[2]
                        } //数据的值
                    },
                    legend: { //图例
                        // top:"170",
                        bottom: '10',
                        selectedMode: false, // 图例设为不可点击
                        textStyle: {
                            color: '#000'
                        }
                    },
                    grid: { //绘图网格
                        left: '1%',
                        right: '3%',
                        top: '5%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'time',
                        interval: 3600 * 1000, //以一个小时递增
                        min: moment(Number(new Date(this.query.date).getTime())).format('YYYY-MM-DD 00:00:00'),
                        max: moment(Number(new Date(this.query.date).getTime())).add(1, 'd').format('YYYY-MM-DD 00:00:00'),
                        axisLabel: {
                            formatter: function(value) {
                                var date = new Date(value)
                                return moment(Number(date.getTime())).format('H')
                            }
                        }
                    },
                    yAxis: {
                        data: []
                    },
                    series: []
                }

                let _iotData = {
                    type: 'custom',
                    renderItem: function(params, api) {
                        var categoryIndex = api.value(0)
                        var start = api.coord([api.value(1),
                            categoryIndex
                        ])
                        var end = api.coord([api.value(2), categoryIndex])
                        var height = api.size([0, 1])[1]

                        return {
                            type: 'rect',
                            shape: echarts.graphic.clipRectByRect({
                                x: start[0],
                                y: start[1] - height / 2,
                                width: end[0] - start[0],
                                height: height
                            }, {
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
                        y: 0 // data 中『维度0』对应到 Y 轴
                    },
                    data: []
                }
                let iotStateTimeLine = list[i].stateTimeLine_dispose
                for (var j = 0; j < iotStateTimeLine.length; j++) {
                    let item = {
                        itemStyle: {
                            normal: {
                                color: iotStateTimeLine[j].color
                            }
                        },
                        name: iotStateTimeLine[j].lableZh,
                        value: [0, iotStateTimeLine[j].start, iotStateTimeLine[j].stop]
                    }
                    _iotData.data.push(item)
                }

                option.series.push(_iotData)
                myChart.setOption(option)

                var chartDom11 = document.getElementById(`echarta11${i}`)
                var myChart11 = echarts.init(chartDom11)
                let option11 = {
                    title: {
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}:{c} ({d}%)'
                    },
                    legend: {
                        show: false
                    },
                    series: [{
                        name: '持续毫秒',
                        type: 'pie',
                        labelLine: {
                            show: false
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                formatter: function(data) {
                                    if (data.percent > 0) {
                                        return data.percent.toFixed(0) + '%'
                                    }
                                    return ''
                                }//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                            }
                        },
                        data: []
                    }],
                }

                for (let j = 0; j<this.stateColorList.length; j++) {
                    let el = this.stateColorList[j];
                    if('all' != el.code){
                        let item = {
                            itemStyle: { normal: { color: el.color } },
                            name: el.name,
                            value: list[i].stateTime[`${el.code}Time`]
                        };
                        option11.series[0].data.push(item);
                    }
                }

                //给扇形赋值
               /* option11.series[0].data = [
                    {
                    name: '在线',
                    value: list[i].stateTime.onlineTime,
                    },
                    {
                        name: '生产',
                        value: list[i].stateTime.bootTime
                    },
                    {
                        name: '报警',
                        value: list[i].stateTime.warnTime
                    },
                    {
                        name: '故障',
                        value: list[i].stateTime.errorTime
                    },
                    {
                        name: '离线',
                        value: list[i].stateTime.offlineTime
                    }
                ]*/
                myChart11.setOption(option11)

            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
    }

}
</script>

<style scoped>
.box_left {
    flex: 1;
    padding-top: 10px;
}

.box_left h3 {
    line-height: 21px;
}

.box_left div {
    height: 69px;
}

.box_center {
    width: 100px;
}

.box_right {
    width: 200px;
    display: flex;
    font-size: 28px;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    background-color: #6B3BB7;
    color: white;
    background-image: url(/static/img/bg.ee8baecb.png);
    background-size: cover;
    background-position: 100%;
}

.item_ {
    border: 1px solid rgba(0, 0, 0, 0.3);
    box-shadow: 4px 4px 4px silver;
    display: flex;
    margin: 10px 20px 20px;
    /* padding: 0 0 0 10px; */
}

.mson-oee {
    width: 240px;
    height: 100px;
    /* border: 1px solid #000; */
    margin-right: 10px;
}

.mson-oee .box {
    width: 120px;
    height: 50px;
    text-align: center;
    color: white;
    background-image: url(/static/img/bg.ee8baecb.png);
    background-size: cover;
    background-position: 100%;
}

.mson-oee .title {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
    min-width: 140px;
}
</style>
