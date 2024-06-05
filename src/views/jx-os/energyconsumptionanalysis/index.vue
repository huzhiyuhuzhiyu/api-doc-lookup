<template>
    <div class="JNPF-common-layout">
        <div style="">
            <el-row class="JNPF-common-search-box" :gutter="20" justify="space-between">
                <el-form @submit.native.prevent>

                    <el-col  :span="6">
                        <el-form-item label="日期">
                            <el-date-picker v-model="times" type="date" value-format="timestamp"
                                            format="yyyy-MM-dd"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col style="max-height: 32px;" :span="6">
                        <el-form-item label="点位">
                            <el-select v-model="indexs" placeholder="请选择" multiple collapse-tags clearable>
                                <el-option v-for="(item, index) in energyEquipmentOptions" :key="index"
                                           :label="item.name" :value="index" :disabled="item.disabled"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!--                    <el-col :span="6">-->
                    <!--                        <el-form-item label="点位名称">-->
                    <!--                            <el-input v-model="query.tableField119_name" placeholder="请输入" clearable></el-input>-->
                    <!--                        </el-form-item>-->
                    <!--                    </el-col>-->
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
            <div style="width: 98%;height:400px;padding-top: 1vw;margin-bottom: 1vw;" class="echartsss" id="ecartss">
            </div>

            <div class="tabs">
                <JNPF-table v-loading="listLoading" :data="list">
                    <el-table-column prop="name" label="点位名称" align="left" width="150"/>
                    <el-table-column prop="code" label="点位编码" width="150"/>
                    <el-table-column prop="mrpWorkshopName" label="所属车间" align="left" width="150"/>
                    <el-table-column label="小时平均使用度数" align="left" min-width="200">
                        <template slot-scope="{row}">
                            {{ (row.result.avg).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="小时最高使用度数" align="left" min-width="200">
                        <template slot-scope="{row}">
                            {{ (row.result.max).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="今日使用度数" align="left" min-width="200">
                        <template slot-scope="{row}">
                            {{ (row.result.sum).toFixed(2) }}
                        </template>
                    </el-table-column>
                </JNPF-table>
<!--                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"-->
<!--                            @pagination="initData"-->
<!--                />-->
            </div>
        </div>

    </div>
</template>

<script>

import { getDictionaryDataSelector } from '@/api/systemData/dictionary'

import moment from 'moment'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import { getListEnergyByIds, getState } from '@/api/equipment'

export default {
    data() {
        return {
            indexs: [],
            times: undefined,

            flag: true,
            value1: null,

            query: {
                ids: [],
                params: undefined
            },

            list: [],
            listLoading: false,
            total: 0,

            listQuery: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: 'desc',
                sidx: 'startTime',
                name: 'getNowMosaicItem',
                code: 'E000_1'
            },

            energyTypeOptions: [],
            energyTypeProps: {
                'label': 'fullName',
                'value': 'enCode'
            },

            echartType: 'bar',

            tableField119_energyTypeOptions: [],

            energyEquipmentOptions: []

        }
    },
    created() {

        this.gettableField119_energyTypeOptions()
        this.getEnergyEquipment()

    },
    mounted() {
        this.times = new Date();
    },
    methods: {
        gettableField119_energyTypeOptions() {
            getDictionaryDataSelector('351649524592159941').then(res => {
                this.tableField119_energyTypeOptions = res.data.list
            })
        },

        /**
         * 得到能耗设备
         */
        getEnergyEquipment() {
            getDataInterfaceRes('391513553640634437').then(res => {
                console.log(res)
                this.energyEquipmentOptions = res.data

            })
        },

        initData() {
            this.listLoading = true

            let _query = this.disposeQuery()
            if(this.indexs.length<1){
            this.listLoading = false

                  this.$message({
                        type: 'error',
                        message: "请先选择点位",
                        onClose: () => {
                        }
                    })
                    return
            }else{
                 getListEnergyByIds(_query).then(res => {
                if (res.code == 200) {

                    let _list = res.data

                    for (var i = 0; i < _list.length; i++) {
                        let la = _list[i]

                        if(la.result != null){
                            for (let j = 0; j < la.result.data.length; j++) {
                                la.result.data[j] = la.result.data[j].toFixed(2)
                            }
                        }
                    }

                    this.list = _list

                    this.ecarts()
                }

                this.listLoading = false

            }).catch(error=>{
            this.listLoading = false

            })
            }
            console.log(_query)

        },

        //处理请求参数
        disposeQuery() {

            var reqsV3 = []
            var ids = []

            let time = new Date(this.times)


            let start = moment(Number(time.getTime())).format('YYYY-MM-DD 00:00:00')
            let stop = moment(Number(time.getTime())).format('YYYY-MM-DD 23:59:59')

            for (let i = 0; i < this.indexs.length; i++) {
                let e = this.energyEquipmentOptions[this.indexs[i]]

                ids.push(e.F_Id)

                let i1 = {
                    uid: e.uuid,
                    code: 'E000_1',
                    every: 1,
                    start: start,
                    stop: stop,
                    unit: 'h',
                    fun: 'DIFF',
                    filter: '',
                    createEmpty: true,
                    fill: '0'
                }

                reqsV3.push(i1)

            }

            return { 'ids': ids, 'params': { 'reqsV3': reqsV3 } }
        },

        ecarts() {
            let myChart = this.$echarts.init(document.getElementById('ecartss'))

            window.addEventListener('resize', () => {
                myChart.resize()
            })

            let arrs = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
            // let str = arrs.slice(0, (new Date().getHours()+1))

            let emphasisStyle = {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.3)'
                }
            }

            let options = {
                title: {
                    text: '能耗分析',
                    left: '20px'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                },
                grid: {
                    left: '3%',
                    right: '2%',
                    bottom: '5%',
                    top: '12%'
                },
                toolbox: {
                    feature: {
                        magicType: {
                            type: ['stack']
                        },
                        dataView: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    data: arrs
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            }

            options.series = []

            for (var i = 0; i < this.list.length; i++) {
                let la = this.list[i]
                console.log(la)

                let item = {
                    name: la.name,
                    type: 'bar',
                    stack: 'one',
                    emphasis: emphasisStyle,
                    data: la.result.data
                }

                options.series.push(item)
            }

            myChart.setOption(options, true)
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
            this.times = new Date();
            this.indexs=[]
            this.query.typeS = 'NH'
            this.list=[]
            this.ecarts()
            // this.search()
        }

    }
}
</script>

<style scoped>
.JNPF-common-search-box .el-form-item {
    margin-bottom: 0px !important;
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
