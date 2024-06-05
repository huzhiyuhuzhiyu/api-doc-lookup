<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                   <!-- <el-col :span="6">
                        <el-form-item label="设备编号">
                            <el-select v-model="query.code" placeholder="请选择" @change="codeChange" filterable>
                                <el-option v-for="(item, index) in codeOptions" :key="index"
                                           :label="item.code" :value="index"
                                           :disabled="item.disabled"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    -->
                    <el-col :span="7">
                        <el-form-item label="日期">
                            <el-date-picker v-model="query.time" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                                            start-placeholder="开始日期" end-placeholder="结束日期"
                                            :picker-options="pickerOptions"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备名称">
                            <el-input v-model="query.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="">
                            <el-button  energyconsumptionanalysis type="primary" @click="search()">查询
                            </el-button>
                            <el-button  energyconsumptionanalysis @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>

                </el-form>
            </el-row>
            <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>

            <div style="overflow: auto;">
                <div class="JNPF-common-layout-main" style="flex: 0 1 auto; height: auto;">
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

                    <div style="background-color: #fff;">
                        <div style="width: 98%; height: 300px;" id="ecartss">
                        </div>
                    </div>
                </div>
                <!-- 分割线 -->
                <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>
                <div style="min-height: 300px; height: calc(100vh - 585px);">
                    <JNPF-table v-loading="listLoading" :data="list"  :hasNO="false"
                                @cell-click="tableClick" > <!-- :cell-style="cellClassFn"-->
                        <el-table-column prop="index" type="index" width="60" label="序号" align="center" fixed/>
                         <el-table-column prop="name"  min-width="150" label="不良品类型" align="left" fixed/>
                        <el-table-column prop="equipmentName"  min-width="150" label="设备名称" align="left" fixed/>
                        <el-table-column prop="max"  min-width="100" label="数量" align="left" fixed/>
                        <el-table-column prop="time" label="日期" align="center" min-width="170" fixed/>

                    </JNPF-table>

                </div>



            </div>

        </div>
        <BiaoZhun v-if="formVisible" ref="JNPFForm" :objectOptions="objectOptions" @refresh="refresh"
                  @setNormList="setNormList"
        />
    </div>
</template>

<script>

import { getRejectsReport } from '@/api/report'
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

            query: {
                active: 1,
                dataType: 0,
                typeS:"SCJC",
                code: undefined,
                name: undefined,
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
            listLoading: false,
            total: 0,

            listQuery: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: 'desc',
                sidx: ''
            },

            codeOptions: [],
            codeProps: { 'label': 'code', 'value': 'code' },

            echartType: 'bar',

            options:{
                title: {
                    text: "不良品分析",
                    left: "20px",
                },
                tooltip: {
                   trigger: 'axis',
                   axisPointer: {
                     type: 'shadow'
                   }
                 },
                legend: {
                   data: []
                 },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisTick: { show: false },
                    data: []
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        type: 'bar',
                        itemStyle:{
                            normal:{
                                color:function(params){
                                    var colorList = ["#FF3300","#CC8033","#CCCC33","#CC6600","#6600CC","#0000CC","#FF850A","#47A3FF","#FF850A","#663366","#666633","#4D6633"
                                            ,"#B063B0","#488E48","#33664D","#E4FF7A","#660033","#660000","#663300","#666600","#A30052","#E00070","#00A352","#00E070"
                                        ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        data:[],
                    }

                ]
            },
            myChart: undefined,

            activeData: {},

            //时间段 //'0-1','1-2','2-3','3-4','4-5','5-6','6-7',
            timeBucket: ['7-8', '8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'],

            formVisible: false,
            times: [],
            times_new: [],

            //标准值下拉参数
            objectOptions: [
                {
                    label: '数量',
                    value: '数量'
                }
            ],


            normList: [
                {
                    object: '数量',
                    operator: 'in',
                    value: 1,
                    value2: 1000,
                    color: '#67C23A'
                },
                {
                    object: '数量',
                    operator: '>',
                    value: 0,
                    color: '#F56C6C'
                }

            ],

            //日期段
            dateBucket: [],
            outputDateBucket: [],
            //不良品类型集合
            rejectsTypeList: [],
            //日期集合
            dateList:[],



        }
    },
    created() {
        this.getcodeOptions()
        this.query.time[0] = moment((new Date().getTime())).format('YYYY-MM-DD 00:00:00')
        this.query.time[1] = moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')
        this.initData();
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
            this.query.uid = this.codeOptions[e].uuid
        },

        initData() {
            this.listLoading = true
            let _query = {
                ...this.listQuery,
                ...this.query,
                keyword: this.keyword,
                dataType: 0,
                menuId: this.menuId
            }

            _query.params = {
                start: new Date(moment((new Date(this.query.time[0]).getTime())).format('YYYY-MM-DD 00:00:00')).getTime(),
                stop: new Date(moment((new Date(this.query.time[1]).getTime())).format('YYYY-MM-DD 23:59:59')).getTime(),
            }

            getRejectsReport(_query).then(res =>{
               var _list = []

               var rejectsTypeList = [];
               var dateList = [];
               for (let i = 0; i < res.data.list.length; i++) {
                   let _data = res.data.list[i]

                   rejectsTypeList.push(_data.name);

                   let time = moment((new Date(_data.start).getTime())).format('YYYY-MM-DD');
                    _data.time = time;
                   dateList.push(time)

                   _list.push(_data)
               }
               //去重保存
               this.rejectsTypeList = Array.from(new Set(rejectsTypeList))
               this.dateList = Array.from(new Set(dateList))

               this.times = this.times_new
               this.list = _list.map(o => ({
                   ...o,
                   ...this.expandObj
               }))

               this.total = res.data.pagination.total
               this.listLoading = false

               this.setOptions();
            })

        },
        //分组
        groupBy(array, f) {
                var groups = {};
                array.forEach(function (o) {
                    var group = JSON.stringify(f(o));
                    groups[group] = groups[group] || [];
                    groups[group].push(o);
                });
                return Object.keys(groups).map(function (group) {
                    return groups[group];
                });
        },

        //给echarts赋值
        setOptions() {
           // let options = JSON.parse(JSON.stringify(this.options))
            var sorted = this.groupBy(this.list,function(item){
                return [item.name]
            })
            let options = {
                title: {
                    text: "不良品分析",
                    left: "20px",
                },
                tooltip: {
                   trigger: 'axis',
                   axisPointer: {
                     type: 'shadow'
                   }
                 },
                legend: {
                   data: []
                 },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisTick: { show: false },
                    data: []
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        type: 'bar',
                        itemStyle:{
                            normal:{
                                color:function(params){
                                    var colorList = ["#FF3300","#CC8033","#CCCC33","#CC6600","#6600CC","#0000CC","#FF850A","#47A3FF","#FF850A","#663366","#666633","#4D6633"
                                            ,"#B063B0","#488E48","#33664D","#E4FF7A","#660033","#660000","#663300","#666600","#A30052","#E00070","#00A352","#00E070"
                                        ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        data:[],
                    }

                ]
            };

            options.xAxis.data = this.rejectsTypeList;

            let dataList = [];
            for (var i = 0; i < sorted.length; i++) {
              let sor =  sorted[i];
              let ito = {
                  name:sor[0].name,
                  value:0,
              }
            for (var j = 0; j< sor.length; j++) {
                let l = sor[j]
                ito.value += l.max;
             }
             dataList.push(ito)
            }
            options.series[0].data = dataList;





            this.myChart.setOption(options, true)
        },

        choseRgb() {

              let r = Math.floor(Math.random() * 256);

              let g = Math.floor(Math.random() * 256);

              let b = Math.floor(Math.random() * 256);

              // 拼接返回
              return `rgb(${r},${g},${b})`;

        },

        tableClick(row, column) {
            if (row.time != this.activeData.time) {
                this.activeData = row

                //this.setOptions();
            }

        },

        ecarts() {
            let myChart = this.$echarts.init(document.getElementById('ecartss'))

            this.myChart = myChart

            window.addEventListener('resize', () => {
                myChart.resize()
            })

            let options = {
                title: {
                    text: "不良品分析",
                    left: "20px",
                },
                tooltip: {
                   trigger: 'axis',
                   axisPointer: {
                     type: 'shadow'
                   }
                 },
                legend: {
                   data: []
                 },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisTick: { show: false },
                    data: []
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        type: 'bar',
                        itemStyle:{
                            normal:{
                                color:function(params){
                                    var colorList = ["#FF3300","#CC8033","#CCCC33","#CC6600","#6600CC","#0000CC","#FF850A","#47A3FF","#FF850A","#663366","#666633","#4D6633"
                                            ,"#B063B0","#488E48","#33664D","#E4FF7A","#660033","#660000","#663300","#666600","#A30052","#E00070","#00A352","#00E070"
                                        ];
                                    return colorList[params.dataIndex]
                                }
                            }
                        },
                        data:[],
                    }

                ]
            };


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
            this.query.active = 1
            this.query.typeS = "SCJC",
            this.query.time = [
                moment((new Date().getTime())).format('YYYY-MM-DD 00:00:00'),
                moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')
            ]
            this.list = [];
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
    margin-bottom: 0px;
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
