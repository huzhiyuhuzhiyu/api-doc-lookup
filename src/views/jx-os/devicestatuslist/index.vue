<template>
    <div class="JNPF-common-layout">
        <Detailspages v-if="!flag" :equipmentId="equipmentId" :optionDate="optionDate" @handle="handles"/>
        <div class="JNPF-common-layout-center" v-else>
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item label="所属车间">
                            <JNPFTreeSelect v-model="query.mrpWorkshopId" placeholder="请选择"
                                            :options="mrpWorkshopIdOptions" :props="mrpWorkshopIdProps"
                                            clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="设备名称">
                            <el-input v-model="query.name" placeholder="编号/名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="日期">

                            <el-date-picker v-model="query.date" type="date" format="yyyy-MM-dd"
                                            value-format="yyyy-MM-dd"
                                            :picker-options="pickerOptions" placeholder="选择日期"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="search()">查询</el-button>
                            <el-button size="mini" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col style="text-align: right; display: flex;" :span="5">
                        <el-form-item label="定时">
                            <el-select v-model="value" @change="updatetimes">
                                <el-option v-for="item in updatetime" :key="item.value" :label="item.label"
                                           :value="item.value" :clearable="false"
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


            <div class="JNPF-common-layout-main JNPF-flex-main">
                <JNPF-table v-loading="listLoading" :data="list" @sort-change="sortChange" border
                            :span-method="arraySpanMethod"
                >
                    <el-table-column prop="name" label="设备名称" align="left" min-width="100" resizable/>
                    <el-table-column prop="mrpWorkshopName" label="所属车间" align="left" />
                    <el-table-column prop="time" label="日期" align="left" />
                    <el-table-column prop="stateTimes.boot" label="运行时长" align="left">
                        <template slot="header">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="运行时长:设备正常加工产品时长"
                                placement="top-start"
                            >
                                <span><i class="el-icon-question"></i> 运行时长 </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stateTimes.halt" label="待机时长" align="left" >
                        <template slot="header">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="待机时长:设备开机但未加工产品时长"
                                placement="top-start"
                            >
                                <span><i class="el-icon-question"></i> 待机时长 </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stateTimes.error" label="故障时长" align="left" >
                        <template slot="header">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="故障时长:设备因故障导致停机时长"
                                placement="top-start"
                            >
                                <span><i class="el-icon-question"></i> 故障时长 </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stateTimes.offline" label="关机时长" align="left" >
                        <template slot="header">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="关机时长:设备关机或离线时长"
                                placement="top-start"
                            >
                                <span><i class="el-icon-question"></i> 关机时长 </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="60">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handle(scope.row.id)">详细
                            </el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total=" total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                            @pagination="initData"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { getListState } from '@/api/equipment'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'

import { formatTime, getTodayMs } from '@/utils/jx/jx-date'

import Detailspages from '../equipmentstatus/equipmentmap/detailspages.vue'
import moment from 'moment'

export default {
    components: {
        Detailspages
    },
    data() {
        return {
            expandObj: {},
            columnOptions: [],
            mergeList: [],

            superQueryVisible: false,
            detailVisible: false,
            query: {
                name: undefined,
                categoryId: undefined,
                mrpWorkshopId: undefined,
                mrpWorkshopIds: [],
                date: undefined
            },
            treeProps: {
                children: 'children',
                label: 'name',
                value: 'id'
            },
            mrpWorkshopIdOptions: [],
            mrpWorkshopIdProps: {
                'label': 'name',
                'value': 'id',
                'children': 'children'
            },

            list: [],
            listLoading: true,
            total: 0,
            listQuery: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: 'desc',
                sidx: '',
                isIot: true,//是否联网
                active: 1,
                typeS: 'CG',
            },
            formVisible: false,
            exportBoxVisible: false,

            flag: true,

            equipmentId: '',

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },

            updatetime: [{
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
            //选中的日期
            optionDate:undefined,

        }
    },
    created() {
        this.getmrpWorkshopIdOptions();

        this.query.date = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
    },
    mounted() {
        this.initData(true)
    },
    updated() {
    },
    methods: {
        //加载生产车间树
        getmrpWorkshopIdOptions() {
            getDataInterfaceRes('342715607101211205').then(res => {
                let data = res.data
                this.mrpWorkshopIdOptions = data
            })
        },
        handle(id) {
            this.equipmentId = id
            this.optionDate = this.query.date
            this.flag = false
        },
        handles() {
            this.flag = true
        },
        arraySpanMethod({
            column
        }) {
            for (let i = 0; i < this.mergeList.length; i++) {
                if (column.property == this.mergeList[i].prop) {
                    return [this.mergeList[i].rowspan, this.mergeList[i].colspan]
                }
            }
        },
        sortChange({
            column,
            prop,
            order
        }) {
            this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
            this.listQuery.sidx = !order ? '' : prop
            this.initData()
        },

        initData(boo) {
            this.listLoading = boo || false
            let _query = {
                ...this.listQuery,
                ...this.query,
                dataType: 0,
                menuId: this.menuId
            }
            let date = new Date();
            let stopDate = new Date(this.query.date);
            if (this.query.date != undefined) {
                _query.startTime =  moment(new Date(this.query.date).getTime()).format('YYYY-MM-DD 00:00:00')
                if(date.getDate()>stopDate.getDate()){
                    _query.stopTime =  moment(new Date(this.query.date).getTime()).format('YYYY-MM-DD 23:59:59')
                }else{
                    _query.stopTime =  moment(date.getTime()).format('YYYY-MM-DD HH:mm:ss')
                }
            }else{
                _query.startTime = moment(date.getTime()).format('YYYY-MM-DD 00:00:00')
                _query.stopTime = moment(date.getTime()).format('YYYY-MM-DD HH:mm:ss')
            }
            getListState(_query).then(res => {
                this.list = []
                let time = moment(stopDate.getTime()).format('YYYY-MM-DD')
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i]
                    _data.time = time

                    _data.stateTimes = {
                        offline: '',
                        halt: '',
                        boot: '',
                        online: ''
                    }

                    _data.stateTimes.offline = formatTime(_data.stateTime.offlineTime)
                    _data.stateTimes.halt = formatTime(_data.stateTime.haltTime)
                    _data.stateTimes.boot = formatTime(_data.stateTime.bootTime)
                    _data.stateTimes.online = formatTime(_data.stateTime.onlineTime)
                    _data.stateTimes.error = formatTime(_data.stateTime.errorTime)

                    this.list.push(_data)
                }

                // this.shuju();
                // this.echartsdata();
                this.total = res.data.pagination.total
                this.listLoading = false
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
            this.initData(true)
        },

        search() {
            this.listQuery.currentPage = 1
            this.listQuery.pageSize = 20
            this.listQuery.sort = 'desc'
            this.listQuery.sidx = ''
            this.initData(true)
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
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
    }
}
</script>

<style scoped>

</style>
