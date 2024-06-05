<template>
    <div class="app-container JNPF-common-layout">
        <div style="">
            <el-row class="JNPF-common-search-box" :gutter="16" justify="space-between">
                <el-form @submit.native.prevent>

                    <el-col :span="6">
                        <el-form-item label="车间">
                            <JNPFTreeSelect v-model="query.mrpWorkshopId" placeholder="请选择"
                                            :options="mrpWorkshopIdOptions"
                                            :props="mrpWorkshopIdProps" clearable
                                            :default-checked-keys="[1]"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备">
                            <el-input v-model="query.name" placeholder="编号/名称" clearable></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="search()">查询</el-button>
                            <el-button size="mini" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                    <!--  <el-col style="text-align: right;" :span="5">

                          </el-col> -->

                    <el-col style="text-align: right; display: flex;" :span="6">
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
        </div>

        <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>

        <div v-loading="loading"
             :element-loading-text="loadingText"
             :element-loading-spinner="loadingSpinner"
             :element-loading-background="loadingBackground"
             style="background-color: #FFFFFF; padding-left: 10px;"
        >
            <div style="display: flex; padding: 1vh 0;">
                <!-- 五个小方块 -->
                <div style="display: flex; align-items: center; flex: 1; ">
                    <div style="min-width: 118px; overflow: hidden; display: flex; align-items: center;"
                        :style="{ backgroundColor: settings.parentBgc, marginRight: settings.marginRight, borderRadius: settings.radius }"
                        v-for="(item, index) in stateNumberList" :key="index" >
                        <div class="tags" :style="{ backgroundColor: item.color }">
                            <strong style="transform: scale(1.2); display: inline-block;">{{ item.number }}</strong>
                        </div>
                        <div style="text-align: center;" :style="{ width: settings.rightWidth }">
                            <p style="line-height: 22px; ">{{ item.name }}</p>
                            <p style="line-height: 22px; " v-show="item.code != 'all'">{{ item.ratio }}%</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- echarts列表 -->
            <div style="height: 100%; background-color: #fff;" v-if="dataFlag">
                <div style="height: calc(100vh - 244px); overflow: auto; transform: translateX(-0.35%) " :class="{quanping:quanping}">
                    <div v-for="(item, index) in list" id="chartdata" :key="index"
                    style="width: 24%; border: 1px solid #A7A7A7; box-sizing: border-box; padding: 10px; max-height: 30vh; display: inline-block; margin: 0 0.5% 20px;">

                        <div style="width: 100%;display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; " >
                            <div style="width: 40px;">
                                <div class="circle">
                                    <div class="content" :style="{ backgroundColor: item.state_color }">
                                        <div class="color">
                                            <div class="light"></div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div style="flex: 1;">
                                <div
                                    style="color: #949499; font-size: 12px;overflow: hidden;text-overflow:ellipsis; white-space: nowrap;"
                                >{{ item.name }}
                                </div>
                                <div style="color: #383635; font-size: 12px;">{{ item.uuid }}</div>
                            </div>

                            <div
                                style="width: 40px; display: flex; justify-content: space-between; align-items: center;"
                            >
                                <!-- 状态 -->
                                <!-- <div style="">
                                <el-tag color="{}">{{ }}</el-tag>

                              </div> -->

                                <span style="font-size: 25px;font-weight: bold; color: gray; padding: 0 5px ; "
                                      class="em-span"
                                      title="详情" @click="handles(item)"
                                >···</span>
                            </div>
                        </div>


                        <div style="display: flex; align-items: center;">
                            <div style="width: 50%;">
                                <div style="color: #949499; font-size: 12px;">小时最高：<b style="color: #000;"
                                >{{ item.output.max }}</b>
                                </div>
                                <div style="color: #949499; font-size: 12px;">本日产量：<b style="color: #2BA245;"
                                >{{ item.output.sum }}</b>
                                </div>
                            </div>
                            <div style="width: 50%;">
                                <div style="color: #949499; font-size: 12px;">本周产量：<b style="color: #000;"
                                >{{ item.thisWeekOutput.max }}</b></div>
                                <div style="color: #949499; font-size: 12px;">本月产量：<b style="color: #2BA245;"
                                >{{ item.thisMonthOutput.max }}</b></div>
                            </div>
                        </div>

                        <!-- 折线图 -->
                        <div style="width: 100%; min-height: 12.5vh; padding-left: 5px;" class="equipment-operations"
                             id="equipment-operation" ref="echarts"></div>
                    </div>


                </div>
            </div>
            <el-empty description="暂无数据" :image-size="120" v-else style="position: absolute; left: 50%; top: 30%; transform: translate(-50%,-50%);"></el-empty>

            <!-- 产量分析详情页 -->
            <div id="mson"
                 style="position: absolute; top: 0; width: 100%; right: -100%; max-height: 93vh; background-color: #EBEEF5; overflow: hidden; "
                 :class="{ animate__animated: true, animate__bounceInRight: active, animate__slideOutRight: actives }"
            >

                <div
                    style="line-height: 50px; text-align: right; padding-right: 20px; background-color: #F4F4F4; position: sticky; top: 0px; z-index: 1000;"
                >
                    <span @click.self="handleclose" class="guanbi">×</span>
                </div>

                <div style="width: 100%; max-height: 87vh; overflow-y: auto;">

                    <div class="mson-oee">
                        <el-row :gutter="10">

                            <el-col :span="12">
                                <div class="box" style="height: 200px;background-color: #6B3BB7;color: white;">
                                    <div class="title"><h1 style="font-size: 80px;line-height: 0px;margin-right:20px;">
                                        OEE</h1><span class="text" style="font-size:27px !important;">设备综合效率</span>
                                    </div>
                                    <h2 class="value" style="font-size: 80px;">
                                        {{ (equipmentWorkpieceRatio.oee * 100).toFixed(0) }}%</h2>
                                </div>
                            </el-col>
                            <!-- <el-col :span="8"><h3>时间稼动率 {{equipmentWorkpieceRatio.timeEfficency}}%</h3><br /><h3>性能稼动率 {{equipmentWorkpieceRatio.performanceEfficency}}%</h3></el-col>
                            <el-col :span="8"><h4>实质稼动率 {{equipmentWorkpieceRatio.essenceEfficency}}%</h4><br /><h4>速度稼动率 {{equipmentWorkpieceRatio.speedEfficency}}%</h4></el-col> -->
                            <el-col :span="6">
                                <div class="box" style="background-color: #67C23A;">
                                    <div class="title"><h3>Availability</h3><span class="text">时间稼动率</span></div>
                                    <h2 class="value">{{ (equipmentWorkpieceRatio.timeRate * 100).toFixed(0) }}%</h2>
                                </div>
                                <div class="box" style="background-color: #E6A23C;">
                                    <div class="title"><h3>Performance</h3><span class="text">性能稼动率</span></div>
                                    <h2 class="value">
                                        {{ (equipmentWorkpieceRatio.performanceRate * 100).toFixed(0) }}%</h2>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="box" style="background-color: #F56C6C;">
                                    <div class="title"><h4>Parenchyma</h4><span class="text">实质稼动率</span></div>
                                    <h2 class="value">
                                        {{ (equipmentWorkpieceRatio.realCropRate * 100).toFixed(0) }}%</h2>
                                </div>
                                <div class="box" style="background-color: #909399;">
                                    <div class="title"><h4>Velocity</h4><span class="text">速度稼动率</span></div>
                                    <h2 class="value">
                                        {{ (equipmentWorkpieceRatio.velocityRate * 100).toFixed(0) }}%</h2>
                                </div>
                            </el-col>
                        </el-row>
                    </div>

                    <div style="padding-top: 20px; background-color: #fff;">
                        <div style="display: flex; padding: 0 20px;">

                            <div style="width: 50%; color: #6B3BB7; ">
                                <div style="font-size: 2.5vw;">设备产量统计</div>
                                <div style="">equipmentOutputStatistics</div>
                            </div>

                            <div style="width: 50%;display: flex;align-items:center;justify-content: flex-end; ">
                                <div style="color: #6B3BB7;font-size: 1.3vw;">
                                    <b>合计</b><br>
                                    Sum
                                </div>
                                <div style="font-size: 2vw;margin-left: 1vw;" id="totaloutput">
                                    {{ today.sum }}
                                </div>
                            </div>

                        </div>
                        <!-- 柱状图 -->
                        <div id="main" style="width: 100%;max-height: 70vh;min-height: 50vh; "></div>
                    </div>

                    <div class="mson-move">
                        <div style="display: flex;">
                            <div>
                                <div>今日产量</div>
                                <div style="font-size: 1vw;">todaysOutput</div>
                            </div>
                            <div
                                style="color: #000000; margin-left: 15px;display: flex;align-items: center;justify-content: center;"
                            >
                                <div>
                                    {{ today.sum }}
                                </div>
                            </div>
                        </div>
                        <div style="display: flex;">
                            <div>
                                <div>本周产量</div>
                                <div style="font-size: 1vw;">thisWeeksOutput</div>
                            </div>
                            <div
                                style="color: #000000; margin-left: 15px;display: flex;align-items: center;justify-content: center;"
                            >
                                <div>
                                    {{ thisWeek.sum }}
                                </div>
                            </div>
                        </div>
                        <div style="display: flex;">
                            <div>
                                <div>本月产量</div>
                                <div style="font-size: 1vw;">thisMonthsOutput</div>
                            </div>
                            <div
                                style="color: #000000; margin-left: 15px;display: flex;align-items: center;justify-content: center;"
                            >
                                <div>
                                    {{ thisMonth.sum }}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div style="width: 100%; color: #6B3BB7; padding: 20px; margin-top: 20px; background-color: #fff;">
                        <div style="font-size: 2.5vw; ">设备运行信息</div>
                        <div style="">equipmentOperationInformation</div>
                    </div>


                    <div style="width: 100%; display: flex; padding: 20px; background-color: #fff;">
                        <div style="width: 40%;height: 300px;" id="mains"></div>
                        <div style="flex:1; display: flex;margin-top: 60px;">
                            <div style="flex:1;text-align: center;">
                                <h1>生产时间</h1>
                                <div style="font-size: 3vw; color: #6B3BB7;">{{ stateTime.boot }}</div>
                            </div>
                            <div style="flex:1;text-align: center;">
                                <h1>非生产时间</h1>
                                <div style="font-size: 3vw; color: #F72585;">{{ stateTime.offline }}</div>
                            </div>
                        </div>
                    </div>

                    <div style="width: 100%; padding: 20px; margin-top: 20px; background-color: #fff;">
                        <div style="width: 100%;color: #6B3BB7;">
                            <div style="font-size: 2.5vw;">自动循环时间占比</div>
                            <div style="font-size: 1vw;">equipmentRatioOfCycleTime</div>
                        </div>
                        <div style="height: 150px;margin-top: 40px;" id="customize"></div>
                    </div>


                    <div style="width: 100%; padding: 20px; margin-top: 20px; background-color: #fff;">

                        <div style="width: 100%;color: #6B3BB7;">
                            <div style="font-size: 2.5vw;">设备节拍分析</div>
                            <div style="font-size: 1vw;">equipmentBeatAnalysis</div>
                        </div>


                        <div
                            style="width: 100%;display: flex;justify-content: space-around;text-align: center; margin-top: 40px;"
                        >
                            <div style="width: 33%;">
                                <div>
                                    最近一小时平均循环时间
                                </div>
                                <div style="width: 100%;height: 400px;" id="dashboardone">

                                </div>
                            </div>
                            <div style="width: 33%;">
                                <div>
                                    今日平均循环时间
                                </div>
                                <div style="width: 100%;height: 400px;" id="dashboardtwo">
                                </div>
                            </div>
                            <div style="width: 33%;">
                                <div>
                                    5分钟内最后一个循环时间
                                </div>
                                <div style="width: 100%;height: 400px;" id="dashboardthree">
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    </div>
</template>

<script>
import { getColorListApi, getEquipmentNumberByState, getListOutPut } from '@/api/equipment'

import {
    getAggregationTimeByUidAndCategories_v1,
    getEquipmentWorkpieceRatio,
    getMosaicBar,
    getStateTimeLine
} from '@/api/iot'

import { formatTime, getDateJSON, getTodayMs } from '@/utils/jx/jx-date'

import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

import * as echarts from 'echarts'
import moment from 'moment'

import sett from '@/settings'

import { mapGetters } from 'vuex'

export default {
    name: 'equipmentinformation',
    data() {
        return {
            list: [],
            percent: '0%',
            valuess: null,
            timess: null,
            active: false,
            actives: false,
            dialogVisible: false,
            time: new Date(),
            query: {
                name: undefined,
                mrpWorkshopId: undefined
            },
            c: [],
            value: ['', ''],
            listQuery: {
                currentPage: 1,
                pageSize: 20,
                sort: 'desc',
                sidx: '',
                // dataType: 0,
                isIot: true,//是否联网
                active: 1,
                typeSList: ["SCJC", "CG", "JC"]
            },
            optionss: [],
            querys: {
                code: undefined,
                name: undefined
            },
            uidss: [],
            lists: [],
            chartdataset: [],
            devicedetails: [],
            loading: true,
            datarelay: [],
            el: null,

            boot: 0,
            error: 0,
            online: 0,
            warn: 0,
            offline: 0,

            boot_ratio: '0%',
            error_ratio: '0%',
            online_ratio: '0%',
            warn_ratio: '0%',
            offline_ratio: '0%',

            mrpWorkshopIdOptions: [],
            mrpWorkshopIdProps: {
                'label': 'name',
                'value': 'id',
                'children': 'children'
            },

            newRow: {
                result: {
                    sum: 0
                }
            },
            quanping: false,

            //今日数据
            today: {
                sum: 0
            },
            //本周数据
            thisWeek: {
                sum: 0
            },
            //本月数据
            thisMonth: {
                sum: 0
            },

            //设备状态数组  在线 生产 报警 故障 离线 总数
            stateList: [],
            stateNumberList: [],
            settings: {},

            totalNum: null, //总数

            //1小时节拍
            hourMeter: '',
            //今日节拍
            todayMeter: '',
            //最近五分钟节拍
            minuteMeter: '',

            //设备状态时间
            stateTime: {
                online: '',
                boot: '',
                wanr: '',
                error: '',
                offline: ''
            },

            colors: ['#409EFF', '#67C23A', '#E6A23C', '#c23531', '#909399'],
            stateColorList: [],
            //时间轴数据
            iotTimeData: [],

            //状态比例
            stateRatioData: [
                {
                    name: '在线',
                    code: 'online',
                    value: 0,
                    ratio: '0%'
                },
                {
                    name: '生产',
                    code: 'boot',
                    value: 0,
                    ratio: '0%'
                },
                {
                    name: '故障',
                    code: 'error',
                    value: 0,
                    ratio: '0%'
                },
                {
                    name: '离线',
                    code: 'offline',
                    value: 0,
                    ratio: '0%'
                }

            ],

            //设备OEE、稼动率
            equipmentWorkpieceRatio: {
                oee: 0,
                timeRate: 0,
                realCropRate: 0,
                velocityRate: 0,
                performanceRate: 0
            },

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
            timer: null,

            //eacharts实例对象数组
            myChartsList: [],
            // 是否有结果数据
            dataFlag:true,
            // echarts列表
            echartsList: [],
        }
    },
    computed: {
        ...mapGetters(['loadingText', 'loadingBackground', 'loadingSpinner']),
        menuId() {
            return this.$route.meta.modelId || ''
        }
    },
    created() {
        this.settings = sett

        // 查询颜色数组
        getColorListApi(colorList => {
            this.colors = []
            colorList.forEach(el => {
                this.colors.push(el.color)
                this.stateList.push({
                    name: el.name,
                    bgc: el.color,
                    number: 0,
                    ratio: '',
                    code: el.code
                })
            })
            // 拿到颜色之后 在请求设备列表
            this.stateColorList = colorList
            // this.initData(true)
        })


        this.getmrpWorkshopIdOptions()
        window.addEventListener('resize', this.equipmentoperation);

    },
    updated() {
        this.equipmentoperation()
    },
    mounted() {
    },
    methods: {

        //车间下拉框改变事件
        mrpWorkshopIdChange(e) {
            let id = e
            if (id != undefined && id != '') {
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

        // 分页请求函数
        initData(boo) {
            this.dataFlag = true
            this.loading = boo || false
            let _query = {
                ...this.listQuery,
                ...this.query,
                keyword: this.keyword,
                menuId: this.menuId
            }
            // if(!_query.mrpWorkshopId && !_query.name && this.mrpWorkshopIdOptions.length>=3) {
            if(!_query.mrpWorkshopId) {
                this.$message.warning('请选择一个车间')
                this.loading = false
                return
            }
            else if(_query.mrpWorkshopId == "noHas") delete _query.mrpWorkshopId
            getEquipmentNumberByState(_query).then(res => {
                this.stateNumberList = res.data
                
                getListOutPut(_query).then(res => {
                    this.totalNum = res.data.list.length
                    var _list = []
                    for (let i = 0; i < res.data.list.length; i++) {
                        let _data = res.data.list[i]
                        _data.thisMonthOutput = _data.thisMonthOutput || { sum: 0 }
                        _data.thisWeekOutput = _data.thisWeekOutput || { sum: 0 }
                        _list.push(_data)
                    }
                    this.list = _list.map(o => ({
                        ...o,
                        ...this.expandObj
                    }))
                    // 把颜色和状态 加到数据数组中
                    if (this.list.length > 0 && this.stateNumberList.length > 0) {
                        this.list.forEach(item => {
                            for (let i = 0; i < this.stateNumberList.length; i++) {
                                let el = this.stateNumberList[i]
                                if (item.result.online) { //在线
                                    if (item.result.boot && el.code == 'boot') {
                                        this.$set(item, 'state_tit', el.name)
                                        this.$set(item, 'state_color', el.color)
                                        break
                                    } else if (item.result.warn && el.code == 'warn') {
                                        this.$set(item, 'state_tit', el.name)
                                        this.$set(item, 'state_color', el.color)
                                        break
                                    } else if (item.result.error && el.code == 'error') {
                                        this.$set(item, 'state_tit', el.name)
                                        this.$set(item, 'state_color', el.color)
                                        break
                                    } else {
                                        if (el.code == 'online') {
                                            this.$set(item, 'state_tit', el.name)
                                            this.$set(item, 'state_color', el.color)
                                            break
                                        }
                                    }
                                } else {
                                    if (el.code == 'offline') {
                                        this.$set(item, 'state_tit', el.name)
                                        this.$set(item, 'state_color', el.color)
                                        break
                                    }
                                }
                            }
                        })

                    }
                    setTimeout(() => {
                        if(!this.list.length) this.dataFlag = false
                    }, 500);
                    this.total = res.data.pagination.total
                    this.loading = false
                })
            })
        },

        //加载生产车间树
        getmrpWorkshopIdOptions() {
            getDataInterfaceRes('342715607101211205').then(res => {
                let data = res.data || []
                this.mrpWorkshopIdOptions = data
                // 避免请求数据量过大，默认选择第一项并触发search
                if (!!data.length) this.query.mrpWorkshopId = data[0].id
                else this.query.mrpWorkshopId = 'noHas'
                this.search()
            })
        },

        //加载设备状态时间
        getEquitmentStateTime() {
            let start = moment(Number(new Date().getTime())).format('YYYY-MM-DD 00:00:00')
            let stop = moment(Number(new Date().getTime())).format('YYYY-MM-DD HH:mm:ss')

            let boot_query = {
                uid: this.newRow.uuid,
                start: start,
                stop: stop,
                categories: ['online', 'boot']
            }
            getAggregationTimeByUidAndCategories_v1(boot_query).then(res => {
                let todayMs = getTodayMs()

                if (res.code == '200') {

                    this.stateTime.boot = formatTime(res.data)

                    this.stateTime.offline = formatTime(todayMs - res.data)
                }
            })

        },

        // 设备图表
        equipmentoperation() {
            this.myChartsList = []
            let equipmentoperation = document.querySelectorAll(
                '#equipment-operation'
            )
            let arrs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            let str = arrs.slice(0, this.time.getHours())
            for (let i = 0; i < equipmentoperation.length; i++) {
                let myChart = this.$echarts.init(equipmentoperation[i])
                //一个组件内有多个图表都有响应式
                myChart.setOption({
                    xAxis: {
                        type: 'category',
                        data: str,
                        axisLabel: {
                            interval: 0,
                            rotate: 0
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            label: {
                                formatter: '{value}:00'
                            }
                        }
                    },
                    grid: {
                        left: '14%',
                        right: '2%',
                        top: '10%',
                        bottom: '20%'
                    },
                    series: [{
                        data: this.list[i].output.data.slice(0, (this.time.getHours() + 1)),
                        type: 'line',
                        smooth: true,
                        itemStyle: {
                            color: '#5370C6'
                        }
                    }]
                })
                myChart.resize()
                this.myChartsList.push(myChart)
            }
        },

        // 统计状态台数
        shuju() {
            let boot = 0
            let error = 0
            let online = 0
            let warn = 0
            let offline = 0

            if (0 == this.list.length) {
                this.boot = boot
                this.error = error
                this.online = online
                this.warn = warn
                this.offline = offline
                return
            }

            for (let a = 0; a < this.list.length; a++) {
                if (this.list[a].result.online) {
                    if (this.list[a].result.boot) {
                        boot += 1
                    } else if (this.list[a].result.error) {
                        error += 1
                    } else if (this.list[a].result.warn) {
                        warn += 1
                    } else {
                        online += 1
                    }
                } else {
                    offline += 1
                }
            }
            this.boot = boot
            this.error = error
            this.online = online
            this.warn = warn
            this.offline = offline

            this.boot_ratio = ((boot / this.list.length * 100).toFixed(0)) + '%'
            this.error_ratio = ((error / this.list.length * 100).toFixed(0)) + '%'
            this.online_ratio = ((online / this.list.length * 100).toFixed(0)) + '%'
            this.warn_ratio = ((warn / this.list.length * 100).toFixed(0)) + '%'
            this.offline_ratio = ((offline / this.list.length * 100).toFixed(0)) + '%'

        },

        //搜索
        search() {
            this.listQuery.currentPage = 1
            this.listQuery.pageSize = 20
            this.listQuery.sort = 'desc'
            this.listQuery.sidx = ''
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
            if (this.mrpWorkshopIdOptions.length) this.query.mrpWorkshopId = this.mrpWorkshopIdOptions[0].id
            else this.query.mrpWorkshopId = 'noHas'
            this.search()
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
            this.initData(true)
        },
        hu() {
            this.quanping = !this.quanping

            setTimeout(() => {
                this.myChartsList.forEach(item => {
                    item.resize()
                })
            }, 100)
        },

        //打开弹框
        handles(row) {
            this.devicedetails = []
            let mson = document.querySelector('#mson')
            mson.style.right = 0 + '%'
            this.active = true
            this.actives = false

            this.newRow = row

            this.getTodayOutput()
            this.getThisWeekOutput()
            this.getThisMonthOutput()

            this.getLoop()

            this.getEquitmentStateTime()

            this.getEquipmentTimeLine(row.uuid)

            this.getEquipmentWorkpieceRatio(row.uuid)

        },

        handleclose() {
            let mson = document.querySelector('#mson')
            this.active = false
            this.actives = true
            this.initData(true)
            setTimeout(() => {
                mson.style.right = -100 + '%'
            }, 500)
        },

        // <!-- 设备产量统计 -->
        getLoadEchartss() {
            let myChart = this.$echarts.init(document.getElementById('main'))
            //一个组件内有多个图表都有响应式
            let arrs = [
                '0:00-1:00',
                '1:00-2:00',
                '2:00-3:00',
                '3:00-4:00',
                '4:00-5:00',
                '5:00-6:00',
                '6:00-7:00',
                '7:00-8:00',
                '8:00-9:00',
                '9:00-10:00',
                '10:00-11:00',
                '11:00-12:00',
                '12:00-13:00',
                '13:00-14:00',
                '14:00-15:00',
                '15:00-16:00',
                '16:00-17:00',
                '17:00-18:00',
                '18:00-19:00',
                '19:00-20:00',
                '20:00-21:00',
                '21:00-22:00',
                '22:00-23:59'
            ]
            let str = arrs.slice(0, (this.time.getHours() + 1))
            window.addEventListener('resize', function() {
                myChart.resize()
            })
            myChart.setOption({
                xAxis: {
                    type: 'category',
                    data: str
                },
                yAxis: {
                    type: 'value'
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '10%',
                    bottom: '20%'
                },
                series: [{
                    data: this.today.data.slice(0, (this.time.getHours() + 1)),
                    type: 'bar',
                    itemStyle: {
                        color: '#6B3BB7'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        color: '#333',
                        fontSize: 18
                    }
                }]
            })
        },

        //得到今日产量统计
        getTodayOutput() {
            let startTime = getDateJSON(this.time, '00:00:00')
            let stopTime = getDateJSON(this.time, '23:59:59')

            let _query = {
                uid: this.newRow.uuid,
                code: 'S232_61',
                start: startTime,
                stop: stopTime,
                every: 1,
                unit: 'h',
                fun: 'DIFF',
            }
            getMosaicBar(_query).then(res => {
                this.today = res.data
                this.getLoadEchartss()
            })

        },
        // 得到本周产量
        getThisWeekOutput() {
            let start = new Date()
            var weekday = start.getDay() || 7 //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
            start.setDate(start.getDate() - weekday + 1) //往前算（weekday-1）天，年份、月份会自动变化

            let startTime = getDateJSON(start, '00:00:00')
            let stopTime = getDateJSON(this.time, '23:59:59')

            let _query = {
                uid: this.newRow.uuid,
                code: 'S232_61',
                start: startTime,
                stop: stopTime,
                every: 1,
                unit: 'h',
                fun: 'DIFF'
            }

            getMosaicBar(_query).then(res => {

                this.thisWeek = res.data
            })
        },
        // 得到本月产量
        getThisMonthOutput() {
            let start = new Date()
            start.setDate(1)

            let startTime = getDateJSON(start, '00:00:00')
            let stopTime = getDateJSON(this.time, '23:59:59')

            let _query = {
                uid: this.newRow.uuid,
                code: 'S232_61',
                start: startTime,
                stop: stopTime,
                every: 1,
                unit: 'd',
                fun: 'DIFF'
            }

            getMosaicBar(_query).then(res => {
                this.thisMonth = res.data
            })
        },

        //得到扇形状态时间图
        getLoadEchartsss() {
            let iotTimeList = this.iotTimeData
            for (var i = 0; i < iotTimeList.length; i++) {
                iotTimeList[i].category
            }

            let myChart = this.$echarts.init(document.getElementById('mains'))
            let option = {
                title: {
                    text: '设备状态占比',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}:{c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data:[]
                },
                series: [
                    {
                    name: '持续毫秒',
                    type: 'pie',
                    // radius: '50%',
                    data: [],
                    labelLine: {
                        show: false
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            formatter: function(data) {
                                if (data.percent > 0) {
                                    return data.name + ':' + data.percent.toFixed(0) + '%'
                                }
                                return ''
                            }//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            }


            for (let i = 0; i < this.stateRatioData.length; i++) {
                let iter = this.stateRatioData[i];
                // console.log(iter.name +"----"+iter.value)

                if (iter.code != 'all') {
                    option.legend.data.push(iter.name);

                    var item = {
                        value: iter.value,
                        name: iter.name,
                        itemStyle: {
                            color: iter.color
                        }
                    }
                    option.series[0].data.push(item);
                }
            }
            // console.log(option)


            //一个组件内有多个图表都有响应式
            window.addEventListener('resize', function() {
                myChart.resize()
            })
            myChart.setOption(option)
        },

        customchart() {
            let chartDom = document.getElementById('customize')
            let myChart = echarts.init(chartDom)
            // let option

            // var myChart = this.$echarts.init(document.getElementById("customize"));
            //一个组件内有多个图表都有响应式
            window.addEventListener('resize', function() {
                myChart.resize()
            })

            var colors = this.colors //5种状态的颜色
            var state = ['在线', '生产', '报警', '故障', '离线'] //5种状态

            // echart配置
            var option = {
                color: colors,
                tooltip: { //提示框
                    formatter: function(params) {
                        return params.name + ':' + params.value[1] + '~' + params.value[2]
                    } //数据的值
                },
                legend: { //图例
                    data: [],
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
                    top: '5%',
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

        //查询设备OEE
        getEquipmentWorkpieceRatio(uid) {
            let time = new Date()
            let start = moment(Number(time.getTime())).format('YYYY-MM-DD 00:00:00')
            let stop = moment(Number(time.getTime())).format('YYYY-MM-DD HH:mm:ss')
            let query = {
                uids: [uid],
                start: start,
                stop: stop,
                yield: '1',
                rate: '1500',
                filter: '[v]<10000'
            }
            getEquipmentWorkpieceRatio(query).then(res => {
                this.equipmentWorkpieceRatio = res.data
            })
        },

        getEquipmentTimeLine(uid) {

            let time = new Date()
            let start = moment(Number(time.getTime())).format('YYYY-MM-DD 00:00:00.000')
            let stop = moment(Number(time.getTime())).format('YYYY-MM-DD HH:mm:ss.SSS')

            let query = {
                uid: uid,
                start: start,
                stop: stop,
                categories: [
                    'online', 'boot', 'warn', 'error'
                ]
            }
            // console.log(query)

            getStateTimeLine(query).then(res => {
                if (res.code == '200') {
                    let _list = res.data
                    this.iotTimeData = this.disposeIotTimeData(_list)

                    //自循环占比
                    this.customchart()
                    this.getLoadEchartsss()
                }
            })

        },

        disposeIotTimeData(arr) {
            let list = arr

            this.stateRatioData = []
            for (let i = 0; i < this.stateColorList.length; i++) {
                let el = {
                    name: this.stateColorList[i].name,
                    code: this.stateColorList[i].code,
                    color:this.stateColorList[i].color,
                    value: 0,
                    ratio: '0%'
                }
                this.stateRatioData.push(el)
            }

            list.forEach(item => {
                for (let i = 0; i < this.stateColorList.length; i++) {
                    let el = this.stateColorList[i]
                    if (item.category == el.code) {
                        item.color = el.color
                        item.colorIndex = 0

                        this.stateRatioData[i].value += item.duration
                    }
                }
            })
            return list
        },

        //  最近一小时平均循环时间
        getLoop() {
            let time = new Date()

            let startTime1 = moment(Number(time.getTime()) - 3600000).format('YYYY-MM-DD HH:mm:ss')
            let stopTime1 = moment(Number(time.getTime())).format('YYYY-MM-DD HH:mm:ss')

            let _query1 = {
                uid: this.newRow.uuid,
                code: 'CYCLE_TIME',
                start: startTime1,
                stop: stopTime1,
                every: 1,
                unit: 'h',
                fun: 'MEAN'
            }
            //近1小时
            getMosaicBar(_query1).then(res => {
                let _data = res.data

                if (_data.data.length > 0) {
                    this.hourMeter = _data.data[_data.data.length - 1].toFixed(2)
                } else {
                    this.hourMeter = 0
                }
                this.dashboardone()

            })

            let startTime2 = moment(Number(time.getTime())).format('YYYY-MM-DD 00:00:00')
            let stopTime2 = moment(Number(time.getTime())).format('YYYY-MM-DD HH:mm:ss')

            let _query2 = {
                uid: this.newRow.uuid,
                code: 'CYCLE_TIME',
                start: startTime2,
                stop: stopTime2,
                every: 1,
                unit: 'd',
                fun: 'MEAN'
            }
            //今日
            getMosaicBar(_query2).then(res => {
                let _data = res.data

                if (_data.data.length > 0) {
                    this.todayMeter = _data.data[_data.data.length - 1].toFixed(2)
                } else {
                    this.todayMeter = 0
                }
                this.dashboardtwo()

            })

            let startTime3 = moment(Number(time.getTime()) - 300000).format('YYYY-MM-DD HH:mm:ss')
            let stopTime3 = moment(Number(time.getTime())).format('YYYY-MM-DD HH:mm:ss')

            let _query3 = {
                uid: this.newRow.uuid,
                code: 'CYCLE_TIME',
                start: startTime1,
                stop: stopTime1,
                every: 1,
                unit: 'm',
                fun: 'LAST'
            }
            //近5分钟
            getMosaicBar(_query3).then(res => {
                let _data = res.data

                if (_data.data.length > 0) {
                    this.minuteMeter = _data.data[_data.data.length - 1].toFixed(2)
                } else {
                    this.minuteMeter = 0
                }
                this.dashboardthree()

            })

        },

        // 三个仪表图(1)
        dashboardone() {
            let myChart = this.$echarts.init(document.getElementById('dashboardone'))
            //一个组件内有多个图表都有响应式
            window.addEventListener('resize', function() {
                myChart.resize()
            })

            var option = {
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                series: [{
                    name: this.newRow.name,
                    type: 'gauge',
                    progress: {
                        show: true
                    },
                    detail: {
                        valueAnimation: true,
                        formatter: '{value}'
                    },
                    data: [{
                        value: this.hourMeter,
                        name: 'SCORE'
                    }],
                    axisLine: {
                        // 坐标轴线
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: [
                                [1, '#5470C6']
                            ]
                        }
                    }
                }]
            }

            myChart.setOption(option)
        },
        // 三个仪表图(2)
        dashboardtwo() {
            let myChart = this.$echarts.init(document.getElementById('dashboardtwo'))
            //一个组件内有多个图表都有响应式
            window.addEventListener('resize', function() {
                myChart.resize()
            })
            myChart.setOption({
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                series: [{
                    name: 'Pressure',
                    type: 'gauge',
                    progress: {
                        show: true
                    },
                    detail: {
                        valueAnimation: true,
                        formatter: '{value}'
                    },
                    data: [{
                        value: this.todayMeter,
                        name: 'SCORE'
                    }],
                    axisLine: {
                        // 坐标轴线
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: [
                                [1, '#5470C6']
                            ]
                        }
                    }
                }]
            })
        },
        // 三个仪表图(3)
        dashboardthree() {
            let myChart = this.$echarts.init(
                document.getElementById('dashboardthree')
            )
            //一个组件内有多个图表都有响应式
            window.addEventListener('resize', function() {
                myChart.resize()
            })
            myChart.setOption({
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                series: [{
                    name: 'Pressure',
                    type: 'gauge',
                    progress: {
                        show: true
                    },
                    detail: {
                        valueAnimation: true,
                        formatter: '{value}'
                    },
                    data: [{
                        value: this.minuteMeter,
                        name: 'SCORE'
                    }],
                    axisLine: {
                        // 坐标轴线
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: [
                                [1, '#5470C6']
                            ]
                        }
                    }
                }]
            })
        }

    },
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
        window.removeEventListener('resize',this.equipmentoperation);
    }

}

</script>

<style scoped>
.app-container {
    width: 100%;
    height: 100%;

    /* 覆盖掉 padding: 0 10px 10px; */
    padding: 0px;
    /* 覆盖掉 background-color: #fff; */
    background-color: transparent;
}


.JNPF-common-layout {
    flex-direction: column;
    background-color: #fff;
}

.el-form-item {
    margin: 0 !important;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 0px !important;
}

.tohome {
    background-color: #f0f0f0;
    margin-left: 3vw;
}

.tohome:hover {
    background-color: #d8d8d8;
    cursor: pointer;
}

.zhexiantu:hover {
    cursor: pointer;
}

.mson-move {
    width: 100%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #6b3bb7;
    font-size: 1.5vw;
    margin-top: 20px;
    background-color: #fff;
}


.mson-oee {
    width: 100%;
    /* padding: 20px; */
    /*align-items: center;
    justify-content: space-around; */
    color: #6b3bb7;
    font-size: 1.5vw;
    margin-top: 20px;
    /* background-color: #fff; */
    /* margin-bottom: 20px; */
    /* font-weight: 900; */
}


.mson-oee .box {
    border-radius: 4px;
    height: 90px;
    /* background-color: #fff; */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
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

/* .mson-oee .value{
    color: #000;
} */

em {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #8f8f8f;

}

.em-span:hover {
    cursor: pointer;
}


.tags {
    min-width: 46px;
    height: 46px;
    text-align: center;
    line-height: 46px;
    color: #000;
    padding: 0 10px;
}


.guanbi {
    /* 点击区域加大 */
    padding: 3px;
    font-size: 30px;
}

.guanbi:hover {
    cursor: pointer;
}

.circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(130deg, black 0%, white 100%);
    position: relative;
}

.content {
    position: absolute;
    border-radius: 50%;
    left: 12%;
    top: 12%;
    width: 76%;
    height: 76%;
    opacity: .8;
}

.color {
    position: absolute;
    border-radius: 50%;
    left: 8%;
    top: 8%;
    width: 84%;
    height: 84%;
    background: gray;
    opacity: .4;
}

.light {
    position: absolute;
    border-radius: 50%;
    width: 25%;
    height: 40%;
    right: 15%;
    top: 8%;
    background: linear-gradient(90deg, white 0%, transparent 90%);
    transform: rotate(135deg);

}

.quanping {
    border: 1px solid #000;
    height: calc(100vh - 145px) !important;
}


</style>
