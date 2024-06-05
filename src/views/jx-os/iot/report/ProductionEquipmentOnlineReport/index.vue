<template>

    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent size="medium">
                    <el-col :span="6">
                        <el-form-item label="车间">
                            <JNPFTreeSelect v-model="query.mrpWorkshopId" placeholder="请选择"
                                            :options="mrpWorkshopIdOptions"
                                            :props="mrpWorkshopIdProps" clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col style="max-width: 350px;" :span="8">
                        <el-form-item label="日期">
                            <el-date-picker v-model="query.time" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                                            start-placeholder="开始日期" end-placeholder="结束日期"
                                            :picker-options="pickerOptions" @change="timeChange"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item>
                            <el-button type="primary"  @click="search()" size="medium">查询</el-button>
                            <el-button  @click="reset()" size="medium">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-s-tools" @click="addOrUpdateHandle()">标准值设置
                        </el-button>
                        <el-button type="primary" icon="el-icon-copy-document" @click="">导出Excel
                        </el-button>
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
                        <!-- <screenfull isContainer/> -->
                    </div>

                </div>
                <JNPF-table v-loading="listLoading" :data="list" height="100%" @sort-change="sortChange"
                            :span-method="arraySpanMethod" :hasNO="false" :cell-style="cellClassFn"
                            :element-loading-text="loadingText"
                            :element-loading-spinner="loadingSpinner"
                            :element-loading-background="loadingBackground">
                    <el-table-column prop="index" type="index" width="60" label="序号" align="center" fixed/>
                    <el-table-column prop="name" label="设备名称" align="left" min-width="170" fixed/>
                    <el-table-column v-for="(item,index2) in times" :key="item" :label="item" min-width="90">
                        <template slot-scope="scope">
                            <span><strong>{{ scope.row.stateTimes[index2].onlineRatio }}%</strong></span>
                        </template>
                    </el-table-column>


                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                            @pagination="initData"
                />
            </div>
        </div>
        <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
        <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false"/>
        <SuperQuery v-if="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuery"/>

        <BiaoZhun v-if="formVisible" ref="JNPFForm" :objectOptions="objectOptions" @refresh="refresh"
                  @setNormList="setNormList"
        />
    </div>
</template>

<script>


import { getEquipmentOnline } from '@/api/report'

import { mapGetters } from 'vuex'

import request from '@/utils/request'
import JNPFForm from './Form'
import ExportBox from './ExportBox'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import Detail from './Detail'
import columnList from './columnList'
import SuperQuery from '@/components/SuperQuery'
import superQueryJson from './superQueryJson'

import BiaoZhun from '../components/biaozhun'

import moment from 'moment'

export default {
    components: {
        JNPFForm,
        ExportBox,
        Detail,
        SuperQuery,
        BiaoZhun
    },
    data() {
        return {
            expandObj: {},
            columnOptions: [],
            mergeList: [],
            columnList,

            superQueryVisible: false,
            superQueryJson,
            detailVisible: false,
            query: {
                name: undefined,
                active: 1,
                typeS: 'CG',
                time: []
            },

            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now()
                }
            },

            list: [],
            listLoading: true,
            total: 0,
            listQuery: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: 'desc',
                sidx: ''
            },
            formVisible: false,
            exportBoxVisible: false,
            treeData: [],
            treeActiveId: '',

            mrpWorkshopIdOptions: [],
            mrpWorkshopIdProps: {
                'label': 'name',
                'value': 'id',
                'children': 'children'
            },

            times: [],
            times_new: [],

            //标准值下拉参数
            objectOptions: [
                {
                    label: '开机率',
                    value: '开机率'
                }
            ],

            normList: [
                {
                    object: '开机率',
                    operator: 'in',
                    value: 80,
                    value2: 100,
                    color: '#67C23A'
                },
                {
                    object: '开机率',
                    operator: 'in',
                    value: 60,
                    value2: 79,
                    color: '#409EFF'
                },
                {
                    object: '开机率',
                    operator: 'in',
                    value: 1,
                    value2: 59,
                    color: '#E6A23C'
                },
                {
                    object: '开机率',
                    operator: '==',
                    value: 0,
                    color: '#F56C6C'
                }

            ]

        }
    },
    computed: {
        ...mapGetters(['loadingText', 'loadingBackground', 'loadingSpinner']),
        menuId() {
            return this.$route.meta.modelId || ''
        }
    },
    created() {
        this.getColumnList()
        this.query.time[0] = moment((new Date().getTime())).format('YYYY-MM-DD 00:00:00')
        this.query.time[1] = moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')

        this.times_new = [moment((new Date().getTime())).format('MM-DD')]
        this.initData()
        this.getmrpWorkshopIdOptions()

    },
    methods: {
        //给单元格设置背景颜色
        cellClassFn({ row, column, rowIndex, columnIndex }) {
            // console.log(row);
            if (columnIndex > 1) {
                for (var i = 0; i < row.stateTimes.length; i++) {
                    if (i == columnIndex - 2) {
                        var backgroundcolor = ''
                        for (var j = 0; j < this.normList.length; j++) {

                            if (this.normList[j].operator == 'in') {
                                if (row.stateTimes[i].onlineRatio >= this.normList[j].value && row.stateTimes[i].onlineRatio <= this.normList[j].value2) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }

                            if (this.normList[j].operator == '>=') {
                                if (row.stateTimes[i].onlineRatio >= this.normList[j].value) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }
                            if (this.normList[j].operator == '<=') {
                                //console.log(row.stateTimes[i].onlineRatio);
                                if (row.stateTimes[i].onlineRatio <= this.normList[j].value) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }
                            if (this.normList[j].operator == '>') {
                                if (row.stateTimes[i].onlineRatio > this.normList[j].value) {
                                    //console.log(this.normList[j].value);
                                    // console.log(row.stateTimes[i].onlineRatio);
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }
                            if (this.normList[j].operator == '<') {
                                if (row.stateTimes[i].onlineRatio < this.normList[j].value) {
                                    backgroundcolor = `background:${this.normList[j].color};`
                                    return backgroundcolor
                                }
                            }
                            if (this.normList[j].operator == '==') {
                                if (parseInt(row.stateTimes[i].onlineRatio) == this.normList[j].value) {
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

        //日期改变时间
        timeChange(e) {
            let t1 = new Date(moment((new Date(this.query.time[0]).getTime())).format('YYYY-MM-DD 00:00:00')).getTime()
            let add = 86400000
            let t2 = new Date(moment((new Date(this.query.time[1]).getTime())).format('YYYY-MM-DD 23:59:59')).getTime()

            let arr = []
            while (t1 < t2) {
                let time = moment(t1).format('MM-DD')

                arr.push(time)
                t1 = parseInt(t1) + parseInt(add)
            }

            this.times_new = arr
        },

        //加载生产车间树
        getmrpWorkshopIdOptions() {
            getDataInterfaceRes('342715607101211205').then(res => {
                let data = res.data
                this.mrpWorkshopIdOptions = data
            })
        },

        getColumnList() {
            // 没有开启权限
            this.columnOptions = this.transformColumnList(this.columnList)
        },
        transformColumnList(columnList) {
            let list = []
            for (let i = 0; i < columnList.length; i++) {
                const e = columnList[i]
                if (!e.prop.includes('-')) {
                    list.push(e)
                } else {
                    let prop = e.prop.split('-')[0]
                    let label = e.label.split('-')[0]
                    let vModel = e.prop.split('-')[1]
                    let newItem = {
                        align: 'center',
                        jnpfKey: 'table',
                        prop,
                        label,
                        children: []
                    }
                    e.vModel = vModel
                    if (!this.expandObj.hasOwnProperty(`${prop}Expand`)) this.$set(this.expandObj, `${prop}Expand`, false)
                    if (!list.some(o => o.prop === prop)) list.push(newItem)
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].prop === prop) {
                            list[i].children.push(e)
                            break
                        }
                    }
                }
            }
            this.getMergeList(list)
            return list
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
        getMergeList(list) {
            let newList = JSON.parse(JSON.stringify(list))
            newList.forEach(item => {
                if (item.children && item.children.length) {
                    let child = {
                        prop: item.prop + '-child-first'
                    }
                    item.children.unshift(child)
                }
            })
            newList.forEach(item => {
                if (item.children && item.children.length) {
                    item.children.forEach((child, index) => {
                        if (index == 0) {
                            this.mergeList.push({
                                prop: child.prop,
                                rowspan: 1,
                                colspan: item.children.length
                            })
                        } else {
                            this.mergeList.push({
                                prop: child.prop,
                                rowspan: 0,
                                colspan: 0
                            })
                        }
                    })
                } else {
                    this.mergeList.push({
                        prop: item.prop,
                        rowspan: 1,
                        colspan: 1
                    })
                }
            })
        },

        goDetail(id) {
            this.detailVisible = true
            this.$nextTick(() => {
                this.$refs.Detail.init(id)
            })
        },
        sortChange({ column, prop, order }) {
            this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
            this.listQuery.sidx = !order ? '' : prop
            this.initData()
        },
        getNodePath(node) {
            let fullPath = []
            const loop = (node) => {
                if (node.level) fullPath.unshift(node.data)
                if (node.parent) loop(node.parent)
            }
            loop(node)
            return fullPath
        },
        handleNodeClick(data, node) {
            this.treeActiveId = data.id
            for (let
                key in this.query) {
                this.query[key] = undefined
            }
            this.query.categoryId = data.id
            this.listQuery = {
                currentPage: 1,
                pageSize: 20,
                sort: 'desc',
                sidx: ''
            }
            this.initData()
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
                stop:  new Date(moment((new Date(this.query.time[1]).getTime())).format('YYYY-MM-DD 23:59:59')).getTime(),
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
            console.log(_query)

            getEquipmentOnline(_query).then(res => {
                console.log(res)
                var _list = []
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i]

                    _list.push(_data)
                }

                this.times = this.times_new
                this.list = _list.map(o => ({
                    ...o,
                    ...this.expandObj
                }))
                console.log(this.list)

                this.total = res.data.pagination.total
                this.listLoading = false

            })

            /* getProductionEquipmentSynthesisReport(_query).then(res =>{
                  var _list = [];
                  for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i];
                        //格式化oee、稼动率
                        _data.equipmentWorkpieceRatio.oee = (_data.equipmentWorkpieceRatio.oee * 100).toFixed(0) || 0;
                        _data.equipmentWorkpieceRatio.timeRate = (_data.equipmentWorkpieceRatio.timeRate * 100).toFixed(0) || 0;
                        _data.equipmentWorkpieceRatio.performanceRate = (_data.equipmentWorkpieceRatio.performanceRate * 100).toFixed(0) || 0;
                        _data.equipmentWorkpieceRatio.realCropRate = (_data.equipmentWorkpieceRatio.realCropRate * 100).toFixed(0) || 0;
                        _data.equipmentWorkpieceRatio.velocityRate = (_data.equipmentWorkpieceRatio.velocityRate * 100).toFixed(0) || 0;
                        //格式开机时间。。。
                        _data.stateTime.offlineDate = formatTime(_data.stateTime.offlineTime);
                        _data.stateTime.haltDate = formatTime(_data.stateTime.haltTime);
                        _data.stateTime.bootDate = formatTime(_data.stateTime.bootTime);
                        _data.stateTime.onlineDate = formatTime(_data.stateTime.onlineTime);
                        //格式化实际节拍
                        _data.beat.amount = (_data.beat.data[_data.beat.data.length-1] || 0).toFixed(0);

                    _list.push(_data)
                  }
                  this.list = _list.map(o => ({
                    ...o,
                    ...this.expandObj
                  }))
                  console.log(this.list);

                  this.total = res.data.pagination.total
                  this.listLoading = false
            })
     */

        },
        handleDel(id) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                request({
                    url: `/api/equipment/Equipment/${id}`,
                    method: 'DELETE'
                }).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.msg,
                        onClose: () => {
                            this.initData()
                        }
                    })
                })
            }).catch(() => {
            })
        },
        openSuperQuery() {
            this.superQueryVisible = true
            this.$nextTick(() => {
                this.$refs.SuperQuery.init()
            })
        },
        superQuery(queryJson) {
            this.listQuery.superQueryJson = queryJson
            this.listQuery.currentPage = 1
            this.initData()
        },
        //打开form表单
        addOrUpdateHandle() {
            this.formVisible = true
            this.$nextTick(() => {
                console.log('init')
                this.$refs.JNPFForm.init(this.normList)
            })
        },
        exportData() {
            this.exportBoxVisible = true
            this.$nextTick(() => {
                this.$refs.ExportBox.init(this.columnList)
            })
        },
        download(data) {
            let query = {
                ...data,
                ...this.listQuery,
                ...this.query,
                menuId: this.menuId
            }
            request({
                url: `/api/equipment/Equipment/Actions/Export`,
                method: 'post',
                data: query
            }).then(res => {
                if (!res.data.url) return
                this.jnpf.downloadFile(res.data.url)
                this.$refs.ExportBox.visible = false
                this.exportBoxVisible = false
            })
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
            this.query.time = [
                moment((new Date().getTime())).format('YYYY-MM-DD 00:00:00'),
                moment((new Date().getTime())).format('YYYY-MM-DD 23:59:59')
            ]

            this.times_new = [moment((new Date().getTime())).format('MM-DD')]


            this.query.active = 1
            this.query.typeS = 'CG'
            this.search()
        }
    }
}
</script>

<style lang="scss">

</style>
