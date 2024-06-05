<template>
    <div class="JNPF-common-layout">
        <div style="">
            <el-row class="JNPF-common-search-box" :gutter="20" justify="space-between">
                <el-form @submit.native.prevent>
                    <el-col :span="8">
                        <el-form-item label="设备编号">
                            <el-select v-model="query.nameCode" placeholder="请选择" @change="codeChange" filterable>
                                <el-option v-for="(item, index) in codeOptions" :key="index"
                                           :label="item.name+'('+item.code +')'" :value="index"
                                           :disabled="item.disabled"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="设备名称">
                            <el-input v-model="query.name" placeholder="" disabled></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="7">
                        <el-form-item label="日期">
                            <el-date-picker v-model="query.time" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                                            start-placeholder="开始日期" end-placeholder="结束日期"
                                            :picker-options="pickerOptions"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-button size="mini" energyconsumptionanalysis type="primary" @click="search()">查询
                            </el-button>
                            <el-button size="mini" energyconsumptionanalysis @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>

                </el-form>
            </el-row>
        </div>
        <!-- 分割线 -->
        <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>

        <div style="overflow: auto; height: 100%;">
            <div style="width: 98%;height:100%;" id="ecartss">
            </div>


        </div>

    </div>
</template>

<script>

import { getRunningRate } from '@/api/iot'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

import moment from 'moment'

export default {
    data() {
        return {

            query: {
                code: undefined,
                name: undefined,
                nameCode:"",
                time: []
            },

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

            list: [],
            listLoading: true,
            total: 0,

            listQuery: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: 'desc',
                sidx: 'startTime'
            },

            codeOptions: [],
            codeProps: { 'label': 'code', 'value': 'code' },

            echartType: 'bar',

            options: {
                title: {
                    show: true,
                    text: '设备运转率分析',
                    left: '20px'
                },
                tooltip: {
                    'trigger': 'axis'
                },
                legend: {

                    'right': '1%'
                },
                grid: {
                    'left': '5%',
                    'right': '2%',
                    'bottom': '5%',
                    'top': '12%'
                },
                dataset: {
                    source: [
                        ['']
                    ]
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: 'value',
                    name: '百分比(%)',
                    max: '100',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: []
            },

            dataOption: [],

            myChart: undefined
        }
    },
    created() {
        this.getcodeOptions()
        this.query.time[0] = moment((new Date().getTime())).format('YYYY-MM-DD 00:00:00')
        this.query.time[1] = moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')

    },

    mounted() {

        this.ecarts()
    },
    methods: {
        getcodeOptions() {
            getDataInterfaceRes('361119942185063685').then(res => {
                let data = res.data
                this.codeOptions = data
            })
        },
        codeChange(e) {
            this.query.code = this.codeOptions[e].code
            this.query.name = this.codeOptions[e].name
            this.query.nameCode = this.codeOptions[e].name+"("+this.codeOptions[e].code+")"
            this.query.uid = this.codeOptions[e].uuid
        },

        initData() {
            this.listLoading = true
            let _query = {
                uids: [this.query.uid],
                start: new Date(moment((new Date(this.query.time[0]).getTime())).format('YYYY-MM-DD 00:00:00')).getTime(),
                stop: new Date(moment((new Date(this.query.time[1]).getTime())).format('YYYY-MM-DD 23:59:59')).getTime(),
                categories: [
                    [
                        'online'
                    ],
                    [
                        'online',
                        'boot'
                    ],
                    [
                        'online',
                        'warn'
                    ],
                    [
                        'online',
                        'error'
                    ]
                ]
            }

            getRunningRate(_query).then(res => {
                this.dataOption = res.data.state

                var _list = []
                for (let i = 0; i < res.data.data.length; i++) {
                    let _data = res.data.data[i]
                    _data.stateTime.onlineRatio = parseFloat(_data.stateTime.onlineRatio).toFixed(0)
                    _data.stateTime.bootRatio = parseFloat(_data.stateTime.bootRatio).toFixed(0)
                    _data.stateTime.warnRatio = parseFloat(_data.stateTime.warnRatio).toFixed(0)
                    _data.stateTime.errorRatio = parseFloat(_data.stateTime.errorRatio).toFixed(0)
                    _data.stateTime.offlineRatio = parseFloat(_data.stateTime.offlineRatio).toFixed(0)

                    _list.push(_data)
                }

                this.list = _list

                this.setOptions()
            })

        },
        //给echarts赋值
        setOptions() {
            let options = JSON.parse(JSON.stringify(this.options))

            for (let i = 0; i < this.dataOption.length; i++) {
                let data = this.dataOption[i]
                options.dataset.source[0].push(data.name)

                let item = {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: data.color,
                            label: { show: true, position: 'top', textStyle: { color: 'black', fontSize: 16 } }
                        }
                    }
                }
                options.series.push(item)

            }

            for (var i = 0; i < this.list.length; i++) {
                let item = this.list[i]

                let tempArr = []

                tempArr.push(item.date)
                tempArr.push(item.stateTime.onlineRatio)
                tempArr.push(item.stateTime.bootRatio)
                // tempArr.push(item.stateTime.warnRatio)
                tempArr.push(item.stateTime.errorRatio)
                tempArr.push(item.stateTime.offlineRatio)

                options.dataset.source.push(tempArr)
            }

            this.myChart.setOption(options, true)
        },

        ecarts() {
            this.myChart = this.$echarts.init(document.getElementById('ecartss'))

            window.addEventListener('resize', () => {
                myChart.resize()
            })

            let options = JSON.parse(JSON.stringify(this.options))

            this.myChart.setOption(options, true)
        },

        search() {
            this.listQuery.currentPage = 1
            this.listQuery.pageSize = 20
            this.listQuery.sort = 'desc'
            this.listQuery.sidx = 'startTime'
            this.initData()
        },
        refresh(isrRefresh) {
            this.formVisible = false
            if (isrRefresh) this.reset()
        },
        reset() {
            for (let key in this.query) {
                this.query[key] = undefined
            }
            this.query.typeS = 'NH'
            // this.search()
            this.ecarts()
        }

    }
}
</script>

<style scoped>

.JNPF-common-search-box {
    margin-bottom: 0px;
}


.JNPF-common-search-box {
    background-color: transparent;
}

.app-center {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 0.8vw;
}

.JNPF-common-layout {
    flex-direction: column;
    background-color: #fff;
}


.tabs {
    width: 98%;
    margin-top: 20px;
    box-shadow: 0px 0px 9px #e9e9e9;
    background-color: white;
    /* overflow-y: auto; */
    border-radius: 5px;
    height: calc(100vh - 680px);
    min-height: 332px;
}

.biaotou {
    margin-left: 50px;
    color: white;
}

.ve-table-header-th {
    font-weight: bold !important;
}
</style>
