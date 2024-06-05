<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="8">
                        <el-form-item label="设备名称">
                            <el-select v-model="query.nameCode" placeholder="请选择" @change="codeChange" filterable>
                                <el-option v-for="(item, index) in codeOptions" :key="index"
                                           :label="item.name+'('+item.code+')'" :value="index"
                                           :disabled="item.disabled"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="4">
                        <el-form-item label="设备名称">
                            <el-input v-model="query.name" placeholder="" disabled></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="4">
                        <el-form-item label="时间单位">
                            <el-select v-model="query.unit" placeholder="请选择" clearable style="width: 90%;" @change="unitChange">
                                <el-option v-for="(item, index) in unitOption" :key="index" :label="item.label"
                                           :value="item.value" :disabled="item.disabled"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="日期">
                            <el-date-picker v-if="query.unit == 'h'" v-model="query.time" type="daterange"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            start-placeholder="开始日期" end-placeholder="结束日期"
                                            :picker-options="pickerOptions"
                            >
                            </el-date-picker>

                            <el-date-picker v-if="query.unit == 'd'" v-model="query.time" type="monthrange"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            start-placeholder="开始日期" end-placeholder="结束日期"
                                            :picker-options="pickerOptions2"
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
            <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>
            <div class="JNPF-common-layout-main " style="overflow: auto;">
                <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-s-tools" @click="addOrUpdateHandle()">标准值设置
                        </el-button>
                        <!-- <el-button type="primary" icon="el-icon-copy-document" @click="">导出Excel
                         </el-button> -->
                    </div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip
                            effect="dark"
                            content="刷新"
                            placement="top"
                        >
                            <el-link
                                icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
                                :underline="false"
                                @click="reset()"
                            />
                        </el-tooltip>
                        <!-- <screenfull isContainer /> -->
                    </div>

                </div>
                <div style="overflow: auto;">
                    <JNPF-table v-loading="listLoading" :data="list" height="400" :hasNO="false"
                                @cell-click="tableClick" :cell-style="cellClassFn"
                    >
                        <el-table-column prop="index" type="index" width="60" label="序号" align="center" fixed/>
                        <el-table-column prop="time" label="日期" align="left" min-width="170" fixed/>

                        <!-- <el-table-column key="年" label="生产数量"> -->
                        <el-table-column v-for="(item,index2) in timeBucket" :key="index2" :label="item"
                                         style="background-color: aqua;"
                        >
                            <template slot-scope="scope">
                                <span>{{ scope.row.data[index2] }}</span>
                            </template>
                        </el-table-column>
                        <!-- </el-table-column> -->
                    </JNPF-table>

                </div>
                <!-- <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
             @pagination="initData" /> -->
                <!-- 分割线 -->
                <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>
                <div style=" background-color: #fff;">
                    <div style="width: 98%; height: 400px;" id="ecartss">
                    </div>
                </div>

            </div>
        </div>
        <BiaoZhun v-if="formVisible" ref="JNPFForm" :objectOptions="objectOptions" :name="name" @refresh="refresh"
                  @setNormList="setNormList"
        />
    </div>
</template>

<script>

import { getOutputAnalysis } from '@/api/iot'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

import BiaoZhun from '../components/biaozhun'

import moment from 'moment'

export default {
    components: {
        BiaoZhun
    },
    data() {
        return {
            name: 'ProduzioneoOutputReport',
            query: {
                uid: '',
                code: undefined,
                name: undefined,
                unit: 'h',//时间单位
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

            pickerOptions2: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },

            list: [],
            listLoading: false,
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

            unitOption: [
                {
                    label: '小时',
                    value: 'h',
                    disabled: false
                },
                {
                    label: '天',
                    value: 'd'
                }
            ],
            echartType: 'bar',

            options: {
                title: {
                    show: true,
                    text: '生产产量分析',
                    left: '20px'
                },
                //柱形图和折线图相互切换
                toolbox: {
                    show: true,
                    feature: {
                        /* line是折线图，bar是柱形图*/
                        magicType: { show: true, type: ['line', 'bar'] }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: [],
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
                    type: 'bar',
                    barWidth: '60%',
                    data: [],
                    color: '#5470C6',
                    label: {
                        show: true,
                        position: 'top',
                        fontWeight: 'bold',
                        color: '#000'
                    }
                }]

            },

            myChart: undefined,

            activeData: {},

            //时间段 //
            timeBucket: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'],

            formVisible: false,
            times: [],
            times_new: [],

            //标准值下拉参数
            objectOptions: [
                {
                    label: '产量',
                    value: '产量'
                }
            ],

            normList: [],
            nameCode:"",
            //日期段
            dateBucket: [],
            outputDateBucket: []

        }
    },
    created() {
        this.getcodeOptions()
        this.query.time[0] = moment((new Date().getTime()) - 604800000).format('YYYY-MM-DD 00:00:00')
        this.query.time[1] = moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')

        this.normList = JSON.parse(localStorage.getItem(`${this.name}NormList`)) || []

    },

    mounted() {

        this.ecarts()
    },
    methods: {
        //给单元格设置背景颜色
        cellClassFn({ row, column, rowIndex, columnIndex }) {
            if (columnIndex > 1) {
                for (var i = 0; i < row.data.length; i++) {
                    if (i == columnIndex - 2) {

                        for (var j = 0; j < this.normList.length; j++) {
                            var backgroundcolor = ''
                            let _data = row.data[i]

                            if (this.normList[j].operator == 'in') {
                                if (_data >= this.normList[j].value && _data <= this.normList[j].value2) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }

                            if (this.normList[j].operator == '>=') {
                                if (_data >= this.normList[j].value) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }
                            if (this.normList[j].operator == '<=') {
                                if (_data <= this.normList[j].value) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }
                            if (this.normList[j].operator == '>') {
                                if (_data > this.normList[j].value) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }
                            if (this.normList[j].operator == '<') {
                                if (_data < this.normList[j].value) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }
                            if (this.normList[j].operator == '==') {
                                if (_data == this.normList[j].value) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }

                        }
                    }
                }
                return ''
            }
        },

        //设置颜色
        setNormList(normList) {
            this.normList = JSON.parse(JSON.stringify(normList))
            this.initData()
        },

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

        unitChange(e){
            if(e == 'h'){
                this.query.time[0] = moment((new Date().getTime()) - 604800000).format('YYYY-MM-DD 00:00:00')
                this.query.time[1] = moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')
            }else if(e == 'd'){
                this.query.time[0] = moment((new Date().getTime())).format('YYYY-MM-01 00:00:00')
                this.query.time[1] = moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')
            }
        },

        initData() {
            this.listLoading = true

            this.dateBucket = []
            this.outputDateBucket = []

            let _query = {
                uids: [this.query.uid],
                start: new Date(moment((new Date(this.query.time[0]).getTime())).format('YYYY-MM-DD 00:00:00')).getTime(),
                stop: new Date(moment((new Date(this.query.time[1]).getTime())).format('YYYY-MM-DD 23:59:59')).getTime(),
                code: 'S232_61',
                fun: 'DIFF',
                every: 1,
                unit: this.query.unit
            }
            this.settimeBucket(_query.unit)
            getOutputAnalysis(_query).then(res => {

                var _list = []
                for (let i = 0; i < res.data.length; i++) {
                    let _data = res.data[i]
                    if (_query.unit == 'd') {
                        _data.time = moment(new Date(_data.start).getTime()).format('YYYY年MM月')
                    } else if (_query.unit == 'h') {
                        _data.time = moment(new Date(_data.start).getTime()).format('MM月DD日')
                    }
                    this.dateBucket.push(_data.time)
                    this.outputDateBucket.push(_data.sum)
                    _list.push(_data)
                }
                this.list = _list

                this.listLoading = false

                this.activeData = this.list[0]

                this.setOptions(0)
            })

        },
        //给echarts赋值
        setOptions() {
            let options = JSON.parse(JSON.stringify(this.options))

            //options.title.text = options.title.text+` (${this.activeData.time})`
            options.xAxis.data = this.dateBucket

            options.series[0].data = this.outputDateBucket

            this.myChart.setOption(options, true)
        },

        settimeBucket(unit) {
            if (unit == 'd') {
                this.timeBucket = []
                for (let i = 1; i <= 31; i++) {
                    this.timeBucket.push(i + '号')
                }

            } else if (unit == 'h') {
                this.timeBucket = []
                for (let i = 0; i < 24; i++) {
                    this.timeBucket.push(i + '-' + (i + 1))
                }
            }
        },

        tableClick(row, column) {
            if (row.time != this.activeData.time) {
                this.activeData = row
            }
        },

        ecarts() {
            let myChart = this.$echarts.init(document.getElementById('ecartss'))

            this.myChart = myChart

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
            this.listQuery.sidx = ''
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
            this.query.unit = 'h'
            this.query.time = [
                moment((new Date().getTime()) - 604800000).format('YYYY-MM-DD 00:00:00'),
                moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')
            ]
            this.list = []
            this.ecarts()
        },

        //打开form表单
        addOrUpdateHandle() {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.JNPFForm.init(this.normList)
            })
        }

    }
}
</script>

<style scoped>


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

.tableContainer {
    -webkit-box-flex: 1;
    -ms-flex: 1 0 0px;
    flex: 1 0 0;
    height: 400px;
    overflow: hidden;
}
</style>
