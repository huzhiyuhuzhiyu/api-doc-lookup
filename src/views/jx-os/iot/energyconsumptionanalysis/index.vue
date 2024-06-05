<template>
    <div class="JNPF-common-layout">
        <div style="">
            <el-row class="JNPF-common-search-box" :gutter="20" justify="space-between">
                <el-form @submit.native.prevent>

                    <el-col style="max-width: 350px;" :span="7">
                        <el-form-item label="日期">
                            <el-date-picker v-model="query.startTime" type="daterange" value-format="timestamp"
                                format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col style="max-width: 300px;" :span="5">
                        <el-form-item label="点位类型">
                            <el-select v-model="query.tableField119_energyType" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in tableField119_energyTypeOptions" :key="index"
                                    :label="item.fullName" :value="item.enCode" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="点位名称">
                            <el-input v-model="query.tableField119_name" placeholder="请输入" clearable> </el-input>
                        </el-form-item>
                    </el-col>
                    <!--  <el-col style="text-align: right;" :span="">

                    </el-col> -->
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
                    <el-table-column prop="startTime" label="日期" align="left" width="120" />
                    <el-table-column prop="tableField119.energyType" label="能耗类型" width="100" />
                    <el-table-column prop="equipmentId_name" label="点位名称" align="left" min-width="130" />
                    <el-table-column prop="startValue" label="起始度数" align="left" min-width="100" />
                    <el-table-column prop="value" label="终止度数" align="left" min-width="100" />
                    <el-table-column prop="useValue" label="使用度数" align="left" min-width="100" />
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
            </div>
        </div>

    </div>
</template>

<script>
// import Detailspages from "./detailspages";

import { getListEnergy } from '@/api/equipment'

import request from '@/utils/request'
import {
    getDictionaryDataSelector
} from '@/api/systemData/dictionary'
import {
    getDataInterfaceRes
} from '@/api/systemData/dataInterface'

import moment from 'moment'


export default {
    // components: { Detailspages },
    data() {
        return {
            value: [],
            input: "",
            options: [{
                label: "电",
                value: "电",
            },
            {
                label: "水",
                value: "水",
            },
            {
                label: "气",
                value: "气",
            }
            ],

            flag: true,
            value1: null,

            query: {
                energyType: undefined,
                name: undefined,
                tableField119_name: undefined,
                tableField119_energyType: undefined,
            },

            list: [],
            listLoading: true,
            total: 0,

            listQuery: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "startTime",
            },

            energyTypeOptions: [],
            energyTypeProps: {
                "label": "fullName",
                "value": "enCode"
            },

            echartType: 'bar',

            tableField119_energyTypeOptions: [],


        };
    },
    created() {
        this.gettableField119_energyTypeOptions();

    },
    mounted() {
        this.initData();
    },
    methods: {
        gettableField119_energyTypeOptions() {
            getDictionaryDataSelector('351649524592159941').then(res => {
                this.tableField119_energyTypeOptions = res.data.list
            })
        },
        initData() {
            this.listLoading = true;
            let _query = {
                ...this.listQuery,
                ...this.query,
                keyword: this.keyword,
                dataType: 0,
                menuId: this.menuId
            };
            request({
                url: `/api/jx/Equipment_data_cache/getList`,
                method: 'post',
                data: _query
            }).then(res => {
                var _list = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i];
                    for (let z = 0; z < _data.tableField119.length; z++) {
                        _data.tableField119 = _data.tableField119[z];
                    }
                    _data.value = parseFloat(_data.value).toFixed(2);
                    _data.useValue = parseFloat(_data.useValue).toFixed(2);
                    _data.startValue = (parseFloat(_data.value) - parseFloat(_data.useValue)).toFixed(2)

                    _data.startTime = moment((new Date(_data.startTime).getTime())).format('MM-DD')


                    _list.push(_data)
                }
                this.list = _list.map(o => ({
                    ...o,
                    ...this.expandObj
                }))
                console.log(this.list);
                this.total = res.data.pagination.total
                this.listLoading = false
                this.ecarts();
            })

        },

        ecarts() {
            let myChart = this.$echarts.init(document.getElementById("ecartss"));

            window.addEventListener("resize", () => {
                myChart.resize();
            });

            let options = {
                "title": {
                    "text": "能耗记录",
                    "left": "20px",
                },
                "tooltip": {
                    "trigger": "axis"
                },
                "legend": {

                    "right": "1%"
                },
                "grid": {
                    "left": "3%",
                    "right": "2%",
                    "bottom": "5%",
                    "top": "12%"
                },
                dataset: {
                    source: [
                        ['product', '2楼1', '2016', '2017']
                    ]
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    type: "value"
                },
                series: [{
                    type: 'bar'
                }]
            };
            options.dataset.source = [
                ['product']
            ]
            options.series = []

            // this.list.forEach(function(item){
            let tempArr = []

            for (var i = this.list.length-1; i >=0; i--) {
                let item = this.list[i]
                // console.log(item.startTime, item.useValue, item.equipmentId_name)

                if (options.dataset.source[0].indexOf(item.equipmentId_name) < 0) {
                    options.dataset.source[0].push(item.equipmentId_name)
                    options.series.push({
                        type: 'bar'
                    })
                }

                if (i == 0) {
                    tempArr.push(item.startTime)
                    tempArr.push(item.useValue)
                } else {
                    if (item.startTime != this.list[i - 1].startTime) {
                        options.dataset.source.push(tempArr)

                        tempArr = []
                        tempArr.push(item.startTime)
                        tempArr.push(item.useValue)

                    } else {
                        tempArr.push(item.useValue)
                    }
                }
            }
            options.dataset.source.push(tempArr)

            myChart.setOption(options, true);
        },

        search() {
            this.listQuery.currentPage = 1
            this.listQuery.pageSize = 20
            this.listQuery.sort = "desc"
            this.listQuery.sidx = "startTime"
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
            this.query.typeS = "NH";
            this.search()
        },


    },
};
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
