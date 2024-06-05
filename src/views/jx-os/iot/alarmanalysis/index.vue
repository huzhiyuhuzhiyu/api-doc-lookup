<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">

            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col style="max-width: 350px;" :span="8">
                        <el-form-item label="时间">
                            <el-date-picker v-model="query.start" type="daterange" value-format="timestamp"
                                format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="4">
                        <el-form-item label="统计方式">
                            <el-select v-model="query.energyType" placeholder="请选择" clearable>
                               <el-option v-for="(item, index) in energyTypeOptions" :key="index" :label="item.fullName"
                               :value="item.enCode" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="5">
                        <el-form-item label="设备">
                            <el-input v-model="query.name" placeholder="请输入" clearable> </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="search()">查询</el-button>
                            <el-button size="mini" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>

                </el-form>
            </el-row>

            <div style="overflow: auto; height: 100%;">
                <div class="echartsss" id="ecartss"></div>

                <div class="tabs">
                    <!-- <div style="">
                    <el-button type="primary" icon="el-icon-plus" @click="handle">新增</el-button>
                </div> -->
                    <JNPF-table v-loading="listLoading" :data="list">
                        <!-- @sort-change='sortChange'
                        :span-method="arraySpanMethod" -->
                        <el-table-column prop="" label="状态" align="left" width="90">
                            <template slot-scope="{row}">
                                <el-tag v-show="row.disposeState == '1'" type="warning">{{row.disposeState_name}}</el-tag>
                                <el-tag v-show="row.disposeState == '3'">{{row.disposeState_name}}</el-tag>
                                <el-tag v-show="row.disposeState == '2'" type="success">{{row.disposeState_name}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="duration_name" label="持续时间" align="left" :formatter="formatDate"
                             width="140" />

                        <el-table-column prop="tableField113[0].name" label="设备名称" align="left" />
                        <el-table-column prop="tableField113[0].mrpWorkshopId" label="所属车间" align="left" /><!-- 运行时间 -->
                        <el-table-column prop="retaineruuid_name" label="异常编码" align="left" />
                        <el-table-column prop="lableZh" label="异常内容" align="left" />
                        <el-table-column prop="category" label="报警类型" align="left" width="100" />
                        <!-- <el-table-column label="操作" fixed="right" width="150">
                            <template slot-scope="scope">
                                <el-button type="text" @click="goDetail(scope.row)">详情
                                </el-button>
                            </template>
                        </el-table-column> -->
                    </JNPF-table>
                    <pagination style="margin-top: 0; padding: 10px;" :total="total" :page.sync="query.currentPage"
                        :limit.sync="query.pageSize" @pagination="initData" />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    // import Detailspages from "./detailspages";
    import {
        formatTime
    } from '@/utils/jx/jx-date'

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
                expandObj: {},
                columnOptions: [],
                mergeList: [],
                // columnList,

                showAll: false,
                superQueryVisible: false,
                // superQueryJson,
                detailVisible: false,
                query: {
                    name:undefined,
                    category: undefined,
                    start: undefined,
                    stop: undefined,
                    retaineruuid: undefined,
                    tableField113_mrpWorkshopId: undefined,
                },
                treeProps: {
                    children: 'children',
                    label: 'fullName',
                    value: 'id'
                },
                list: [],
                listLoading: true,
                total: 0,
                listQuery: {
                    superQueryJson: '',
                    currentPage: 1,
                    pageSize: 20,
                    sort: "asc",
                    sidx: "disposeState",
                },
                formVisible: false,
                exportBoxVisible: false,
                tableField113_mrpWorkshopIdOptions: [],
                tableField113_mrpWorkshopIdProps: {
                    "label": "name",
                    "value": "id",
                    "children": "children"
                },
                disposeStateOptions: [],
                disposeStateProps: {
                    "label": "fullName",
                    "value": "enCode"
                },

                count_query:{
                    paramList: [
                        {
                            field: "startTime",
                            fieldName: "",
                            dataType: "varchar",
                            required: 0,
                            defaultValue: ""
                        },
                        {
                            field: "stopTime",
                            fieldName: "",
                            dataType: "varchar",
                            required: 0,
                            defaultValue: ""
                        },
                        {
                            field: "name",
                            fieldName: "",
                            dataType: "varchar",
                            required: 0,
                            defaultValue: ""
                        }
                    ],
                    "tenantId": "",
                    "origin": "preview"
                },
                iot_count: [],
                UUIDList:[]


            };
        },
        created() {
            this.initData()
            this.getCountByTime();
        },
        mounted() { },

        methods: {
            getCountByTime() {
                let _query = this.count_query;
                // console.log(moment(this.query.start).format('YYYY-MM-DD'));
                // console.log(this.query.start);

                _query.paramList[0].defaultValue = this.query.start==undefined?"":moment(this.query.start[0]).format('YYYY-MM-DD');//moment.famt(this.query.start);
                _query.paramList[1].defaultValue = this.query.start==undefined?"":moment(this.query.start[1]).format('YYYY-MM-DD');
                _query.paramList[2].defaultValue = this.query.name==undefined?"":this.query.name;

                getDataInterfaceRes('357790531268406021', _query).then(res => {
                    // console.log(res.data);
                    this.iot_count = res.data;

                    let uuidarr = []

                    for (var i = 0; i < res.data.length; i++) {
                        uuidarr.push(res.data[i].name)
                    }

                    uuidarr = Array.from(new Set(uuidarr))

                    this.UUIDList = uuidarr;

                    this.ecarts();
                })
            },


            handle() {
                this.flag = false;
            },
            handles() {
                this.flag = true;
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
                // console.log(_query);
                request({
                    url: `/api/jx/Retainer/getList`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    var _list = [];
                    for (let i = 0; i < res.data.list.length; i++) {
                        let _data = res.data.list[i];
                        _list.push(_data)
                    }
                    this.list = _list.map(o => ({
                        ...o,
                        ...this.expandObj
                    }))
                    // console.log(this.list);
                    this.total = res.data.pagination.total
                    this.listLoading = false
                })
            },

            search() {
                this.listQuery.currentPage = 1
                this.listQuery.pageSize = 20
                this.listQuery.sort = "asc"
                this.listQuery.sidx = "disposeState"
                this.initData()
                this.getCountByTime();
            },
            refresh(isrRefresh) {
                this.formVisible = false
                if (isrRefresh) this.reset()
            },
            reset() {
                for (let key in this.query) {
                    this.query[key] = undefined
                }
                this.search()
            },

            //方法区
            formatDate(row, column) {
                // 获取单元格数据
                let ms = row[column.property]

                let time = formatTime(ms);

                return time;
            },



            ecarts() {
                let myChart = this.$echarts.init(document.getElementById("ecartss"));

                window.addEventListener("resize", () => {
                    myChart.resize();
                });

                var option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {},
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['2022-11-02', '2022-11-01', '2022-10-31', '2022-10-30', '2022-10-29',
                            '2022-10-28', '2022-10-27'
                        ]
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [
                        /* {
                            name: '报警',
                            type: 'bar',
                            stack: '1',
                            emphasis: {
                                focus: 'series'
                            },
                            itemStyle: {
                                normal: {
                                    color: "#E6A23C"
                                }
                            },
                            data: []
                        },
                        {
                            name: '故障',
                            type: 'bar',
                            stack: '1',
                            emphasis: {
                                focus: 'series'
                            },
                            itemStyle: {
                                normal: {
                                    color: "#EF4136"
                                }
                            },
                            data: []
                        }, */
                    ]
                };
                 option.xAxis[0].data = []
                 for (var j = this.iot_count.length-1; j>=0  ; j--) {
                     let item = this.iot_count[j]
                     if(j>0){
                         if(this.iot_count[j-1].date != item.date){
                             option.xAxis[0].data.push(item.date);
                         }
                     }else{
                          option.xAxis[0].data.push(item.date);
                     }
                 }

                for (var i = 0; i < this.UUIDList.length; i++) {
                    console.log(this.UUIDList[i]);
                    option.series.push({
                            name: this.UUIDList[i],
                            type: 'bar',
                            stack: '1',
                            emphasis: {
                                focus: 'series'
                            },
                            // itemStyle: {
                            //     normal: {
                            //         color: "#E6A23C"
                            //     }
                            // },
                            data: []
                        })

                    for (var j= 0; j < this.iot_count.length; j++) {
                        let item = this.iot_count[j]



                        // console.log(this.iot_count[i].category);
                        if (this.iot_count[j].name == this.UUIDList[i]) {
                            option.series[i].data.push([this.iot_count[j].date, this.iot_count[j].number])
                        }
                        //  else if (this.iot_count[i].category == 'error') {
                        //     option.series[1].data.push([this.iot_count[j].date, this.iot_count[j].number])
                        // }
                    }


                }







                // console.log(option);

                myChart.setOption(option);
            },
        },
    };
</script>

<style scoped>
    .app-center {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }

    .tabs {
        background-color: #fff;
        height: calc(100vh - 657px);
        min-height: 332px;
    }

    .echartsss {
        /* border: 1px solid #000; */
        width: 100%;
        height: 400px;
        background-color: #fff;
        padding: 20px;
        margin-bottom: 10px;

    }

    .biaotou {
        margin-left: 50px;
        color: white;
    }

    .ve-table-header-th {
        font-weight: bold !important;
    }
</style>
