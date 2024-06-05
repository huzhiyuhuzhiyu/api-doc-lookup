<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="6">
                        <el-form-item label="设备名称">
                            <el-select v-model="query.name" placeholder="请选择" @change="(e)=>idChange(e)"
                                       filterable
                            >
                                <el-option v-for="(item,index2) in equipmentOptions" :key="item.equipmentUid"
                                           :label="item.equipmentName" :value="index2"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备点位">
                            <el-select v-model="query.code" placeholder="请选择">
                                <el-option v-for="(item, index) in codeOptions" :key="index"
                                           :label="item.codeName" :value="item.code" :disabled="item.disabled"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="日期">
                            <!-- <el-date-picker v-model="query.time" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                                            start-placeholder="开始日期" end-placeholder="结束日期"
                                            :picker-options="pickerOptions"
                                            @change="timeChange"
                            > -->
                            <el-date-picker v-model="query.time" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                                            start-placeholder="开始日期" end-placeholder="结束日期"

                                            @change="timeChange"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="粒度" prop="every">
                            <el-input v-model.number="query.every"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="时间单位" prop="unit">
                            <el-select v-model="query.unit" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in unitOption" :key="index" :label="item.label"
                                           :value="item.value" :disabled="item.disabled"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="汇总方式" prop="unit">
                            <el-select v-model="query.fun" placeholder="请选择" size="small">
                                <el-option v-for="item in collectOptions" :key="item.value" :label="item.label"
                                           :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="过滤表达式" prop="unit">
                            <el-input v-model="query.filter" placeholder="请输入过滤数据的表达式"></el-input>
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
            <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>
            <div class="JNPF-common-layout-main JNPF-flex-main" style="overflow: auto;">
                <div>
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="clearfix">
                            <span>设备信息</span>
                        </div>
                        <div>
                            <div style="box-shadow:0px 0px 50px #E8E8E8;display: flex;justify-content: center;">
                                <div class="text border1" style="width:100%; padding: 20px;">
                                    <el-row>
                                        <el-col :span="3">
                                            <div class="grid-content bg-purple">
                                                <span>设备名称</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="5">
                                            <div class="grid-content bg-purple-light">
                                                <span>{{equipmentItem.name}}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="grid-content bg-purple">
                                                <span>设备编码</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="5">
                                            <div class="grid-content bg-purple-light">
                                                <span>{{equipmentItem.code}}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <div class="grid-content bg-purple">
                                                <span>所属区域</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="5">
                                            <div class="grid-content bg-purple-light">
                                                <span>{{ equipmentItem.mrpWorkshopName }}</span>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                    </el-card>
                </div>
                <div class="cpk" style="display: flex">
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="card-header">
                            <span>CPK</span>
                        </div>
                        <div class="card-body">
                            {{ (cpkData.cpk.toFixed(2)) || 0 }}
                        </div>
                    </el-card>
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="card-header">
                            <span>CP</span>
                        </div>
                        <div class="card-body">
                            <i class="el-icon-time"/><span style="float: right"
                        >{{ cpkData.cp != null ? cpkData.cp.toFixed(2) : 0 }}</span>
                        </div>
                    </el-card>
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="card-header">
                            <span>CA</span>
                        </div>
                        <div class="card-body">
                            <i class="el-icon-s-data"/><span style="float: right"
                        >{{ cpkData.ca != null ? cpkData.ca.toFixed(2) : 0 }}</span>
                        </div>
                    </el-card>
                    <el-card class="box-card" shadow="always">
                        <div slot="header" class="card-header">
                            <span>运行时长</span>
                        </div>
                        <div class="card-body">
                            <i class="el-icon-bell"/><span style="float: right">08:34:02</span>
                        </div>
                    </el-card>
                </div>

                <div>
                    <JNPF-table v-loading="listLoading" :data="sampleData" height="300" :hasNO="false" show-summary
                                :summary-method="getSummaries"
                    >
                        <el-table-column prop="index" type="index" width="60" label="序号" align="center" fixed/>
                        <el-table-column v-for="(item,index1) in times" :key="index1" :label="times[index1]">
                            <template slot-scope="scope">
                                <span>{{ scope.row[index1] }}</span>
                            </template>
                        </el-table-column>

                    </JNPF-table>
                </div>
                <!-- 分割线 -->
                <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>
                <div style=" background-color: #fff;">
                    <div style="width: 98%; height: 400px;" id="ecartsX">
                    </div>
                </div>

                <!-- 分割线 -->
                <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>
                <div style=" background-color: #fff;">
                    <div style="width: 98%; height: 400px;" id="ecartsR">
                    </div>
                </div>

            </div>


        </div>

    </div>
</template>

<script>

import { getDataInterfaceRes,getCpkXREquipment } from '@/api/systemData/dataInterface'

import BiaoZhun from '../components/biaozhun'

import moment from 'moment'
import { getState } from '@/api/equipment'
import { selectCPK } from '@/api/report'

export default {
    components: {
        BiaoZhun
    },
    data() {
        return {

            query: {
                name: undefined,
                uid: '',
                code: '',
                time: [],
                every: 1,
                unit: 'h',
                fun: 'last',
                filter: '[v]>0.0'
            },

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },

            collectOptions: [
                {
                    value: 'diff',
                    label: '时段差异'
                },
                {
                    value: 'sum',
                    label: '时段求和'
                },
                {
                    value: 'mean',
                    label: '平均值'
                },
                {
                    value: 'median',
                    label: '中位数'
                },
                {
                    value: 'stddev',
                    label: '平方差'
                },
                {
                    value: 'spread',
                    label: '极差'
                },
                {
                    value: 'max',
                    label: '最大值'
                },
                {
                    value: 'min',
                    label: '最小值'
                },
                {
                    value: 'inc',
                    label: '增长统计'
                },
                {
                    value: 'first',
                    label: '第一个'
                },
                {
                    value: 'last',
                    label: '最后一个'
                }

            ],

            list: [],

            listLoading: false,

            codeOptions: [],

            equipmentOptions: [],

            echartType: 'bar',

            unitOption: [
                {
                    label: '小时',
                    value: 'h',
                    disabled: false
                },
                {
                    label: '天',
                    value: 'd',
                    disabled: false
                },
                // {
                //     label: '周',
                //     value: 'w'
                // },
                // {
                //     label: '月',
                //     value: 'M'
                // },
                {
                    label: '秒', //不小于5秒
                    value: 's',
                    disabled: false
                },
                {
                    label: '分钟',
                    value: 'm',
                    disabled: false
                }
            ],

            myChartX: undefined,
            myChartR: undefined,

            activeData: {},

            formVisible: false,
            times: [],
            times_new: [],

            //日期段
            dateBucket: [],
            outputDateBucket: [],

            //设备信息
            equipmentItem:{},
            cpkData: {
                cpk: 0,
                cp: 0,
                ca: 0
            },
            sampleData: []

        }
    },
    created() {
        this.selectEquipmentList()

        this.query.time[0] = moment((new Date().getTime()) - 604800000).format('YYYY-MM-DD 00:00:00')
        this.query.time[1] = moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')

        this.timeChange(null, true)

    },

    mounted() {

    },
    methods: {
        //搜索设备列表
        selectEquipmentList() {
            getCpkXREquipment().then(res => {
                console.log("res+++",res);
                let data = res.data
                this.equipmentOptions = data
                // console.log(this.equipmentOptions)
            })
        },

        // 设备改变事件
        idChange(e, index) {
            console.log("log》",e);
            this.query.uid = this.equipmentOptions[e].equipmentUid
            this.codeOptions= this.equipmentOptions[e].codeInfos
            // let id = this.equipmentOptions[e].F_Id

            // getState(id).then(res => {
            //     this.codeOptions = res.data.result.mapping.mappingLines//.splice(index, 0, res.data.result.mapping.mappingLines)


            //     for (let i = res.data.result.mapping.mappingLines.length-1;i>-1;i--){

            //         if (res.data.result.mapping.mappingLines[i].cpkConfig==null){
            //             this.codeOptions.splice(i,1)

            //         }else{

            //         }
            //     }
            // })
        },

        //日期改变时间
        timeChange(e, update) {
            let t1 = new Date(moment((new Date(this.query.time[0]).getTime())).format('YYYY-MM-DD 00:00:00')).getTime()
            let add = 86400000
            let t2 = new Date(moment((new Date(this.query.time[1]).getTime())).format('YYYY-MM-DD 23:59:59')).getTime()

            let arr = []
            let columnList = []
            columnList.push({
                prop: 'name',
                label: '设备名称'
            })
            let i = 0
            while (t1 < t2) {
                let time = moment(t1).format('MM-DD')

                arr.push(time)
                columnList.push({
                    prop: i,
                    label: time
                })
                t1 = parseInt(t1) + parseInt(add)
                i++
            }

            this.columnList = columnList
            this.times_new = arr
            if (update) {
                this.times = this.times_new
            }
        },

        initData() {
            let res = this.disposeQuery(this.query)
            selectCPK(res).then(res => {
                if (res.code == 200) {
                    console.log(res.data)
                    this.timeChange(null, true);
                    this.equipmentItem = res.data;

                    let sampleData = res.data.result.sampleData
                    var newArray = sampleData[0].map(function(col, i) {
                        return sampleData.map(function(row) {
                            return row[i]
                        })
                    })
                    this.sampleData = newArray
                    this.cpkData = res.data.result;
                    console.log(this.cpkData)

                    this.getSummaries()

                    this.ecartsX()
                    this.ecartsR()
                }
            })

        },

        //处理请求参数
        disposeQuery(query) {
            let times = []

            let startDate = new Date(moment((new Date(this.query.time[0]).getTime())).format('YYYY-MM-DD 00:00:00'))
            let stopDate = new Date(moment((new Date(this.query.time[1]).getTime())).format('YYYY-MM-DD 23:59:59'))
            while (startDate.getTime() < stopDate.getTime()) {
                let time = {
                    start: moment(startDate).format('YYYY-MM-DD 00:00:00'),
                    stop: moment(startDate).format('YYYY-MM-DD 23:59:59')
                }
                times.push(time)

                startDate = new Date((startDate.getTime() + 86400000))
            }

            var res = []

            let i1 = {
                uid: query.uid,
                code: query.code,
                every: query.every,
                times: times,
                unit: query.unit,
                fun: query.fun,
                filter: query.filter
            }

            res.push(i1)

            return res
        },

        //
        getSummaries(param) {
            const columns = ['ΣX']
            let sumSampleData = this.cpkData.sumSampleData;

            for (let i = 0; i < sumSampleData; i++) {
                return sumSampleData[i]
            }
            return columns
        },

        //给echarts赋值
        setOptionsX() {
            let options = JSON.parse(JSON.stringify(this.options))

            options.xAxis.data = this.dateBucket

            options.series[0].data = this.outputDateBucket

            this.myChartX.setOption(options, true)
        },

        ecartsX() {
            let myChart = this.$echarts.init(document.getElementById('ecartsX'))
            this.myChart = myChart
            window.addEventListener('resize', () => {
                myChart.resize()
            })

            let UCLData = [];
            let UCLXData = [];
            let LCLXData = [];
            let TLCLData = [];
            let avgSampleDataXData = this.cpkData.avgSampleData;
            for (let i = 0; i < this.times.length; i++) {
                UCLData.push(this.cpkData.ucl);
                UCLXData.push(this.cpkData.uclx);
                LCLXData.push(this.cpkData.lclx);
                TLCLData.push(this.cpkData.tlcl);
            }

            let options = {
                title: {
                    text: 'x̅管制图'
                },
                legend: {
                    show: true,
                    orient: 'vertical',
                    right: 20,
                    data: ['TUCL:UCL', 'UCLX', 'LCLX', 'TLCL:LCL', 'TCL',"avgSampleDataX"]
                },
                xAxis: {
                    type: 'category',
                    data: this.times
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'TUCL:UCL',
                        data: UCLData,
                        type: 'line',
                        symbol: 'triangle',
                        symbolSize: 10,
                        lineStyle: {
                            width: 4,
                            type: 'dashed'
                        }
                    },
                    {
                        name: 'UCLX',
                        data: UCLXData,
                        type: 'line',
                        symbolSize: 10,
                        lineStyle: {
                            width: 4,
                            type: 'dotted'
                        }
                    },
                    {
                        name: 'LCLX',
                        data: LCLXData,
                        type: 'line',
                        symbolSize: 0,
                        lineStyle: {
                            width: 4,
                            type: 'solid'
                        }
                    },
                    {
                        name: 'TLCL:LCL',
                        data: TLCLData,
                        type: 'line',
                        symbolSize: 0,
                        lineStyle: {
                            width: 4,
                            type: 'solid'
                        }
                    },
                    {
                        name: 'avgSampleDataX',
                        data: avgSampleDataXData,
                        type: 'line',
                        symbol: 'square',
                        symbolSize: 10,
                        lineStyle: {
                            width: 4,
                            type: 'solid'
                        }
                    }
                ]
            }


            this.myChart.setOption(options, true)
        },
        ecartsR() {
            let myChart = this.$echarts.init(document.getElementById('ecartsR'))
            this.myChartR = myChart
            window.addEventListener('resize', () => {
                myChart.resize()
            })

            let RUCLData = [];
            let UCLRData = [];
            let LCLRData = [];
            let CLRData = [];
            let rangeSampleData = this.cpkData.rangeSampleData;
            for (let i = 0; i < this.times.length; i++) {
                UCLRData.push(this.cpkData.uclr);
                LCLRData.push(this.cpkData.lclr);
                CLRData.push(this.cpkData.clr);
                RUCLData.push(this.cpkData.rucl);
            }


            let options = {
                title: {
                    text: 'R管制图'
                },
                legend: {
                    show: true,
                    orient: 'vertical',
                    right: 20,
                    data: ['R', 'UCLR', 'LCLR', 'CLR','RUCL']
                },
                xAxis: {
                    type: 'category',
                    data: this.times
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'R',
                        data: rangeSampleData,
                        type: 'line',
                        symbol: 'triangle',
                        symbolSize: 10,
                        lineStyle: {
                            width: 4,
                            type: 'dashed'
                        }
                    },
                    {
                        name: 'UCLR',
                        data: UCLRData,
                        type: 'line',
                        symbolSize: 10,
                        lineStyle: {
                            width: 4,
                            type: 'dotted'
                        }
                    },
                    {
                        name: 'LCLR',
                        data: LCLRData,
                        type: 'line',
                        symbolSize: 0,
                        lineStyle: {
                            width: 4,
                            type: 'solid'
                        }
                    },
                    {
                        name: 'CLR',
                        data: CLRData,
                        type: 'line',
                        symbolSize: 0,
                        lineStyle: {
                            width: 4,
                            type: 'solid'
                        }
                    },
                    {
                        name: 'RUCL',
                        data: RUCLData,
                        type: 'line',
                        symbol: 'square',
                        symbolSize: 10,
                        lineStyle: {
                            width: 4,
                            type: 'solid'
                        }
                    }
                ]
            }

            console.log(options)

            this.myChartR.setOption(options, true)
        },

        search() {
            this.initData()
        },
        reset() {
            for (let key in this.query) {
                this.query[key] = undefined
            }
            this.query.time = [
                moment((new Date().getTime()) - 604800000).format('YYYY-MM-DD 00:00:00'),
                moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')
            ]
            this.ecarts()
        }

    }
}
</script>

<style scoped>


.JNPF-common-layout {
    flex-direction: column;
    background-color: #fff;
}

.border1 .el-row:nth-of-type(3) {
    border-bottom: 1px solid #ebeef5;

}

.grid-content {
    border-radius: 4px;
    min-height: 45px;
}

.bg-purple {
    background-color: #FDF5E6;
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

.cpk .box-card {
    width: 30%;
}

.box-card {
    margin: 10px 10px;
}

.card-header {

}

>>> .el-card__header {
    padding: 5px 20px !important;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #7bbfea;
    color: #FFFFFF;
}

.cpk .card-body {
    font-size: 30px;
}


</style>
