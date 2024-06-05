<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">

            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent size="medium">
                    <el-col style="max-width: 350px;" :span="8">
                        <el-form-item label="时间">
                            <el-date-picker v-model="query.start" type="daterange" value-format="timestamp"
                                            format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!--  <el-col :span="5">
                        <el-form-item label="设备">
                            <el-input v-model="query.name" placeholder="请输入" clearable> </el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="medium" type="primary" @click="search()">查询</el-button>
                            <el-button size="medium" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>

                </el-form>
            </el-row>

            <div class="JNPF-common-layout-main" style="overflow: auto;">
                <div
                    style="width: 45%; display: inline-block; vertical-align: top; height: calc(100vh - 245px); overflow: auto;"
                >
                    <div class="echartsss" id="ecartss"></div>
                    <div style="line-height: 10px; background-color: #EBEEF5;">&nbsp;</div>
                    <div class="echartsss" id="ecartss2"></div>

                </div>
                <div style="width: 10px;height: 100%; display: inline-block;  vertical-align: top; background-color: #EBEEF5;"></div>
                <div style="width: 54%; display: inline-block; vertical-align: top;">
                    <JNPF-table v-loading="listLoading" height="calc(100vh - 255px)" :data="list">
                        <el-table-column prop="lableZh" label="异常内容" align="left" min-width="120"/>
                        <el-table-column prop="tableField113[0].name" label="设备名称" align="left" min-width="140"/>
                        <el-table-column prop="retaineruuid_name" label="异常编码" align="left" min-width="100"/>
                        <el-table-column prop="start" label="开始时间" align="left" min-width="170"/>
                        <el-table-column prop="duration_name" label="持续时间" align="left" :formatter="formatDate"
                                         min-width="130"
                        />
                        <!-- <el-table-column prop="tableField113[0].mrpWorkshopId" label="所属车间" align="left" /><!-- 运行时间 -->
                        -->
                    </JNPF-table>
                    <pagination :total="total" :page.sync="query.currentPage" :limit.sync="query.pageSize"
                                @pagination="initData"
                    />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
// import Detailspages from "./detailspages";
import { formatTime } from '@/utils/jx/jx-date'

import request from '@/utils/request'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

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
                name: undefined,
                category: undefined,
                start: undefined,
                stop: undefined,
                retaineruuid: undefined,
                tableField113_mrpWorkshopId: undefined
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
                sort: 'asc',
                sidx: 'disposeState'
            },
            formVisible: false,
            exportBoxVisible: false,
            tableField113_mrpWorkshopIdOptions: [],
            tableField113_mrpWorkshopIdProps: {
                'label': 'name',
                'value': 'id',
                'children': 'children'
            },
            disposeStateOptions: [],
            disposeStateProps: {
                'label': 'fullName',
                'value': 'enCode'
            },

            count_query: {
                paramList: [{
                    field: 'startTime',
                    fieldName: '',
                    dataType: 'varchar',
                    required: 0,
                    defaultValue: ''
                },
                    {
                        field: 'stopTime',
                        fieldName: '',
                        dataType: 'varchar',
                        required: 0,
                        defaultValue: ''
                    },
                    {
                        field: 'name',
                        fieldName: '',
                        dataType: 'varchar',
                        required: 0,
                        defaultValue: ''
                    }
                ],
                'tenantId': '',
                'origin': 'preview'
            },
            iot_count: [],
            UUIDList: [],
            TimeList: []

        }
    },
    created() {
        this.initData()
        this.getCountByTime()
    },
    mounted() {
    },

    methods: {
        getCountByTime() {
            let _query = this.count_query

            _query.paramList[0].defaultValue = this.query.start == undefined ? '' : moment(this.query.start[0])
                .format('YYYY-MM-DD') //moment.famt(this.query.start);
            _query.paramList[1].defaultValue = this.query.start == undefined ? '' : moment(this.query.start[1])
                .format('YYYY-MM-DD')
            _query.paramList[2].defaultValue = this.query.name == undefined ? '' : this.query.name

            getDataInterfaceRes('357790531268406021', _query).then(res => {
                console.log(res.data);
                this.iot_count = res.data

                let uuidarr = []

                let times = []

                for (var i = 0; i < res.data.length; i++) {
                    uuidarr.push(res.data[i].name)
                }

                uuidarr = Array.from(new Set(uuidarr))

                this.UUIDList = uuidarr

                this.ecarts()

                this.ecarts2()
            })
        },

        handle() {
            this.flag = false
        },
        handles() {
            this.flag = true
        },

        initData() {
            this.listLoading = true
            let _query = {
            ...this.listQuery,
            ...this.query,
             keyword:
             this.keyword,
             dataType: 0,
             menuId:
             this.menuId 
             }
             console.log(_query);
            request({ url: `/api/jx/Retainer/getList`, method: 'post', data: _query }).then(res => {
                console.log(res);
                var _list = []
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i]
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
            this.listQuery.sort = 'asc'
            this.listQuery.sidx = 'disposeState'
            this.initData()
            this.getCountByTime()
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

            let time = formatTime(ms)

            return time
        },

        ecarts() {
            let myChart = this.$echarts.init(document.getElementById('ecartss'))

            window.addEventListener('resize', () => {
                myChart.resize()
            })

            var option = {
                title: {
                    text: '报警类型占比统计',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                     bottom: -5,
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '0%',
                    containLabel: true
                },
                series: []
            }
            /* option.xAxis[0].data = []
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
*/

            option.series.push({
                name: '类型',
                type: 'pie',
                radius: '50%',
                label: {
                    normal: {
                        show: true,
                        formatter: '{b}:{c} ({d}%)' //自定义显示格式(b:name, c:value, d:百分比)
                    }
                },
                data: []
            })

            var arr = []
            for (var i = 0; i < this.UUIDList.length; i++) {
                let item = {
                    name: this.UUIDList[i],
                    value: 0
                }

                for (var j = 0; j < this.iot_count.length; j++) {
                    if (this.iot_count[j].name == this.UUIDList[i]) {
                        item.value = item.value + 1
                    }
                }

                arr.push(item)
            }

            option.series[0].data = arr

            myChart.setOption(option)
        },

        ecarts2() {
            let myChart = this.$echarts.init(document.getElementById('ecartss2'))

            window.addEventListener('resize', () => {
                myChart.resize()
            })

            var option = {
                title: {
                    text: '每日报警次数统计',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    // orient: 'vertical',
                    bottom: -5,
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '17%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    data: []
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: []
            }
            option.xAxis[0].data = []
            for (var j = this.iot_count.length - 1; j >= 0; j--) {
                let item = this.iot_count[j]
                if (j > 0) {
                    if (this.iot_count[j - 1].date != item.date) {
                        option.xAxis[0].data.push(item.date)
                    }
                } else {
                    option.xAxis[0].data.push(item.date)
                }
            }

            for (var i = 0; i < this.UUIDList.length; i++) {
                option.series.push({
                    name: this.UUIDList[i],
                    type: 'bar',
                    stack: '1',
                    emphasis: {
                        focus: 'series'
                    },
                    data: []
                })

                for (var j = 0; j < this.iot_count.length; j++) {
                    let item = this.iot_count[j]

                    if (this.iot_count[j].name == this.UUIDList[i]) {
                        option.series[i].data.push([this.iot_count[j].date, this.iot_count[j].number])
                    }
                }

            }

            myChart.setOption(option)
        }

    }
}
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
    /* height: calc(100vh - 657px); */
    min-height: 332px;
}

.echartsss {
    /* border: 1px solid #000; */
    width: 100%;
    height: 350px;
    background-color: #fff;
    padding: 20px;
    /* margin-bottom: 10px; */

}

.biaotou {
    margin-left: 50px;
    color: white;
}

.ve-table-header-th {
    font-weight: bold !important;
}
</style>
