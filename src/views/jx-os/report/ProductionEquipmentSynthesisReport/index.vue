<template>

    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent size="medium">
                    <el-col :span="6">
                        <el-form-item label="车间">
                            <JNPFTreeSelect v-model="query.mrpWorkshopId" placeholder="请选择"
                                            :options="mrpWorkshopIdOptions"
                                            :props="mrpWorkshopIdProps"
                                            clearable
                            />
                        </el-form-item>
                    </el-col>
                    <!--                    <el-col :span="6">
                                            <el-form-item label="工序">
                                                <JNPFTreeSelect v-model="query.mrpProcessId" placeholder="请选择"
                                                                :options="mrpProcessIdOptions"
                                                                :props="mrpProcessIdProps" clearable
                                                />
                                            </el-form-item>
                                        </el-col>-->
                    <el-col :span="6">
                        <el-form-item label="设备名称">
                            <el-input v-model="query.name" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="medium" type="primary" @click="search()">查询</el-button>
                            <el-button size="medium" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>

            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-s-tools" @click="addOrUpdateHandle">标准值设置
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
                        <!-- <screenfull isContainer/> -->


                    </div>

                </div>
                <JNPF-table id="myTable" v-loading="listLoading" :data="list" height="100%" @sort-change="sortChange"
                            :span-method="arraySpanMethod" :fixedNO="true" custom-column :cell-style="cellClassFn"
                >
                    <el-table-column prop="code" label="设备编号" align="left" min-width="170" fixed/>
                    <el-table-column prop="name" label="设备名称" align="left" min-width="170" fixed/>
                    <el-table-column prop="mrpWorkshopName" label="所属车间" align="left" min-width="120" fixed/>
                    <!--                    <el-table-column prop="processId" label="加工工序" align="left" min-width="100" fixed/>-->
                    <el-table-column prop="sbfh" label="设备负荷" align="center">
                        <el-table-column prop="stateTime.onlineDate" label="开机时间" align="left" min-width="150"/>
                        <el-table-column prop="stateTime.offlineDate" label="关机时间" align="left" min-width="150"/>
                        <el-table-column prop="fhl" label="负荷率(%)" align="center" min-width="130">
                            <template slot="header">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    content="负荷率(%)= 生产产量 / (今日经历时长 / 理论节拍)"
                                    placement="top-start"
                                >
                                    <span><i class="el-icon-question"></i> 负荷率(%) </span>
                                </el-tooltip>
                            </template>
                            <template slot-scope="{row}">
                                {{ ((row.output.sum / ((row.stateTime.onlineTime + row.stateTime.offlineTime) / row.theoryBeat)) * 100).toFixed(2) }}%
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="equipmentWorkpieceRatio" label="稼动率" align="center">
                        <el-table-column prop="equipmentWorkpieceRatio.timeRate" label="时间稼动率(%)" align="center"
                                         min-width="130"
                        >
                            <template slot-scope="{row}">
                                {{ row.equipmentWorkpieceRatio.timeRate }}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="equipmentWorkpieceRatio.performanceRate" label="性能稼动率(%)" align="center"
                                         min-width="130"
                        >
                            <template slot-scope="{row}">
                                {{ row.equipmentWorkpieceRatio.performanceRate }}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="equipmentWorkpieceRatio.realCropRate" label="实质稼动率(%)" align="center"
                                         min-width="130"
                        >
                            <template slot-scope="{row}">
                                {{ row.equipmentWorkpieceRatio.realCropRate }}%
                            </template>
                        </el-table-column>
                        <el-table-column prop="equipmentWorkpieceRatio.velocityRate" label="速度稼动率(%)" align="center"
                                         min-width="130"
                        >
                            <template slot-scope="{row}">
                                {{ row.equipmentWorkpieceRatio.velocityRate }}%
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="theoryBeat" label="节拍分析" align="center">
                        <el-table-column prop="theoryBeat" label="理论节拍" align="left" min-width="100"/>
                        <el-table-column prop="beat.amount" label="循环效率" align="left" min-width="100"/>
                        <el-table-column prop="cy" label="差异" align="left" min-width="80">
                            <template slot-scope="{row}">
                                {{ row.theoryBeat - row.beat.amount }}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column prop="cl" label="产量" align="center">
                        <el-table-column prop="output.sum" label="本日产量" align="left" min-width="100"/>
                        <el-table-column prop="thisWeekOutput.max" label="本周产量" align="left" min-width="100"/>
                        <el-table-column prop="thisMonthOutput.max" label="本月产量" align="left" min-width="100"/>
                        <!--                        <el-table-column prop="cumulativeOutput.value" label="累计产量" align="left" min-width="120">
                                                    <template slot="header" >
                                                        <el-tooltip
                                                            class="item"
                                                            effect="dark"
                                                            content="设备联网时间到今日0点的总产量"
                                                            placement="top-start"
                                                        >
                                                            <span><i class="el-icon-question"></i> 累计产量 </span>
                                                        </el-tooltip>
                                                    </template>
                                                </el-table-column>-->
                        <!--                <el-table-column prop="lpl" label="良品率(%)" align="left" min-width="100"/>-->
                    </el-table-column>
                    <el-table-column prop="equipmentWorkpieceRatio.oee" label="OEE">
                        <template slot-scope="{row}">
                            {{ row.equipmentWorkpieceRatio.oee }}%
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="操作" fixed="right" width="100">
                       <template slot-scope="scope">
                         <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                         </el-button>
                         <el-button type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
                         </el-button>
                       </template>
                     </el-table-column> -->
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                            @pagination="initData"
                />
            </div>
        </div>
        <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
        <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false"/>
        <SuperQuery v-if="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuery"/>
        <BiaoZhun v-if="formVisible" ref="JNPFForm" :objectOptions="objectOptions" :name="name" @refresh="refresh"
                  @setNormList="setNormList"
        ></BiaoZhun>

    </div>
</template>

<script>

import { getProductionEquipmentSynthesisReport } from '@/api/report'

import request from '@/utils/request'
import ExportBox from './ExportBox'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import Detail from './Detail'
import columnList from './columnList'
import SuperQuery from '@/components/SuperQuery'
import superQueryJson from './superQueryJson'

import BiaoZhun from '../components/biaozhun'

import { formatTime } from '@/utils/jx/jx-date'

import moment from 'moment'

export default {
    components: {
        ExportBox,
        Detail,
        SuperQuery,
        BiaoZhun
    },
    data() {
        return {
            name: 'ProductionEquipmentSynthesisReport',
            expandObj: {},
            columnOptions: [],
            mergeList: [],
            columnList,

            superQueryVisible: false,
            superQueryJson,
            detailVisible: false,
            query: {
                name: undefined,
                mrpWorkshopId: undefined,
                mrpWorkshopIds: [],
                mrpProcessId: undefined
            },
            treeProps: {
                children: 'children',
                label: 'name',
                value: 'id'
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
                isIot: true,
                active: 1,
                typeS: 'CG'
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

            mrpProcessIdOptions: [],
            mrpProcessIdProps: {
                'label': 'name',
                'value': 'F_Id'
            },

            //标准值下拉参数
            objectOptions: [
                {
                    value: 'equipmentWorkpieceRatio.timeRate',//时间稼动率
                    label: '时间稼动率'
                },
                {
                    value: 'equipmentWorkpieceRatio.performanceRate',//性能稼动率
                    label: '性能稼动率'
                },
                {
                    value: 'equipmentWorkpieceRatio.realCropRate',//实质稼动率
                    label: '实质稼动率'
                },
                {
                    value: 'equipmentWorkpieceRatio.velocityRate',//速度稼动率
                    label: '速度稼动率'
                },
                {
                    value: 'beat.amount',//循环效率
                    label: '循环效率'
                },
                /* {
                    value: 'cy',//差异
                    label: '差异'
                }, */
                {
                    value: 'output.sum',//本日产量
                    label: '本日产量'
                },
                {
                    value: 'thisWeekOutput.max',//本周产量
                    label: '本周产量'
                },
                {
                    value: 'thisMonthOutput.max',//本月产量"
                    label: '本月产量'
                },
                {
                    value: 'cumulativeOutput.value',//累计产量
                    label: '累计产量'
                },
                {
                    value: 'lpl',//良品率(%)
                    label: '良品率(%)'
                },
                {
                    value: 'equipmentWorkpieceRatio.oee',
                    label: 'oee'
                }
            ],

            normList: [],

            normList_List: [],

            thisRow: 0,
            ColIndex: 7

        }
    },
    computed: {
        menuId() {
            return this.$route.meta.modelId || ''
        }
    },
    created() {

        this.normList = JSON.parse(localStorage.getItem(`${this.name}NormList`)) || []

        this.normList_List = this.groupBy(this.normList, function(item) {
            return [item.object]
        })

        this.getColumnList()
        this.initData()
        this.getmrpWorkshopIdOptions()
        this.getmrpProcessIdOptions()


    },
    mounted() {

    },
    methods: {
        //给单元格设置背景颜色
        cellClassFn({ row, column, rowIndex, columnIndex }) {
            if (this.thisRow != rowIndex) {
                this.ColIndex = 7
            }

            if (columnIndex > this.ColIndex) {
                for (var i = 0; i < this.normList_List.length; i++) {
                    let normList = this.normList_List[i]
                    var backgroundcolor = ''
                    for (var j = 0; j < normList.length; j++) {
                        let _norm = normList[j]
                        if (_norm.object == column.property) {
                            let propertyNames = _norm.object.split('.')
                            switch (propertyNames.length) {
                                case 1:
                                    backgroundcolor = this.calculateValue(_norm, row[propertyNames[0]])
                                    break
                                case 2:
                                    backgroundcolor = this.calculateValue(_norm, row[propertyNames[0]][propertyNames[1]])
                                    break
                                case 3:
                                    backgroundcolor = this.calculateValue(_norm, row[propertyNames[0]][propertyNames[1]][propertyNames[2]])
                                    break
                                case 4:
                                    backgroundcolor = this.calculateValue(_norm, row[propertyNames[0]][propertyNames[1]][propertyNames[2]][propertyNames[3]])
                                    break

                            }
                        }

                        if (backgroundcolor != '' && backgroundcolor != undefined) {
                            return backgroundcolor
                        }
                    }

                }
            }
        },

        //计算值
        calculateValue(_norm, _data) {
            let backgroundcolor = undefined
            if (_norm.operator == 'in') {
                if (_data >= _norm.value && _data <= _norm.value2) {
                    backgroundcolor = `background:${_norm.color};`
                }
                return backgroundcolor
            }
            if (_norm.operator == '>=') {
                if (_data >= _norm.value) {
                    backgroundcolor = `background:${_norm.color};`
                }
                return backgroundcolor
            }
            if (_norm.operator == '<=') {
                if (_data <= _norm.value) {
                    backgroundcolor = `background:${_norm.color};`
                }
                return backgroundcolor
            }
            if (_norm.operator == '>') {
                if (_data > _norm.value) {
                    backgroundcolor = `background:${_norm.color};`
                }
                return backgroundcolor
            }
            if (_norm.operator == '<') {
                if (_data < _norm.value) {

                    backgroundcolor = `background:${_norm.color};`
                }
                return backgroundcolor
            }
            if (_norm.operator == '==') {
                if (_data == _norm.value) {
                    backgroundcolor = `background:${_norm.color};`
                }
                return backgroundcolor
            }
        },

        //设置颜色
        setNormList(normList) {
            this.normList = JSON.parse(JSON.stringify(normList))

            localStorage.setItem('ProductionEquipmentSynthesisNormList', this.normList)

            var sorted = this.groupBy(normList, function(item) {
                return [item.object]
            })
            this.normList_List = sorted
            this.initData()
        },
        //分组
        groupBy(array, f) {
            var groups = {}
            array.forEach(function(o) {
                var group = JSON.stringify(f(o))
                groups[group] = groups[group] || []
                groups[group].push(o)
            })
            return Object.keys(groups).map(function(group) {
                return groups[group]
            })
        },

        //加载生产车间树
        getmrpWorkshopIdOptions() {
            getDataInterfaceRes('342715607101211205').then(res => {
                let data = res.data
                this.mrpWorkshopIdOptions = data
            })
        },
        //车间下拉框改变事件
        mrpWorkshopIdChange(e) {
            let id = e
            if (id != undefined && id != '') {
                //查子ID数组
                let _query = {
                    paramList: [{
                        field: 'ID',
                        fieldName: '',
                        dataType: 'varchar',
                        required: 0,
                        defaultValue: id
                    }],
                    tenantId: '',
                    origin: 'preview'
                }
                getDataInterfaceRes('365461198570824901', _query).then(res => {
                    let data = res.data
                    let _list = []
                    for (let i = 0; i < res.data.length; i++) {
                        let _data = res.data[i]
                        _list.push(_data.F_Id)
                    }
                    this.query.mrpWorkshopIds = _list
                })
            }
        },

        //加载生产工序
        getmrpProcessIdOptions() {
            getDataInterfaceRes('360816814696961221').then(res => {
                let data = res.data
                this.mrpProcessIdOptions = data
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
        sortChange({
            column,
            prop,
            order
        }) {
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
                start: moment(Number(new Date().getTime())).format('YYYY-MM-DD 00:00:00'),
                stop: moment(Number(new Date().getTime())).format('YYYY-MM-DD 23:59:59'),
                yield: 1,
                rate: 2500
            }

            getProductionEquipmentSynthesisReport(_query).then(res => {
                var _list = []
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i]
                    //格式化oee、稼动率
                    _data.equipmentWorkpieceRatio.oee = (_data.equipmentWorkpieceRatio.oee * 100).toFixed(0) || 0
                    _data.equipmentWorkpieceRatio.timeRate = (_data.equipmentWorkpieceRatio.timeRate * 100).toFixed(0) || 0
                    _data.equipmentWorkpieceRatio.performanceRate = (_data.equipmentWorkpieceRatio.performanceRate * 100).toFixed(0) || 0
                    _data.equipmentWorkpieceRatio.realCropRate = (_data.equipmentWorkpieceRatio.realCropRate * 100).toFixed(0) || 0
                    _data.equipmentWorkpieceRatio.velocityRate = (_data.equipmentWorkpieceRatio.velocityRate * 100).toFixed(0) || 0
                    //格式开机时间。。。
                    _data.stateTime.offlineDate = formatTime(_data.stateTime.offlineTime)
                    _data.stateTime.haltDate = formatTime(_data.stateTime.haltTime)
                    _data.stateTime.bootDate = formatTime(_data.stateTime.bootTime)
                    _data.stateTime.onlineDate = formatTime(_data.stateTime.onlineTime)
                    //格式化实际节拍
                    _data.beat.amount = (_data.beat.data[_data.beat.data.length - 1] || 0).toFixed(0)

                    _list.push(_data)
                }
                this.list = _list.map(o => ({
                    ...o,
                    ...this.expandObj
                }))

                this.total = res.data.pagination.total
                this.listLoading = false
            })

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
        //打开标准值弹框
        addOrUpdateHandle(id, isDetail) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.JNPFForm.init(this.normList)
            })
        },
        exportData() {
            this.exportBoxVisible = true
            this.$nextTick(() => {
                this.$refs.ExportBox.init(this.normList)
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
            this.search()
        }
    }
}
</script>

<style lang="scss">

</style>
