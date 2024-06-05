<template>

    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                    <el-col :span="6">
                        <el-form-item label="状态">
                            <el-select v-model="query.state" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in stateOptions" :key="index" :label="item.fullName"
                                    :value="item.enCode" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="工单号">
                            <el-input v-model="query.name" placeholder="请输入" clearable> </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
                        </el-button>
                    </div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip content="高级查询" placement="top" v-if="true">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                @click="openSuperQuery()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange'
                    :span-method="arraySpanMethod">
                    <el-table-column prop="name_name" label="工单号" align="left" min-width="130" />
                    <el-table-column prop="productionId_name" label="订单编号" align="left" min-width="130" />
                    <el-table-column prop="productId_name" label="产品名称" align="left" min-width="120"/>
                    <el-table-column prop="processId_name" label="工序名称" align="left" min-width="120"/>
                    <el-table-column prop="equipmentId_name" label="设备名称" align="left" min-width="120"/>
                    <el-table-column prop="userId_name" label="操作工" align="left" min-width="90"/>
                    <el-table-column prop="state_name" label="状态" align="center" min-width="80">
                        <template slot-scope="{row}">
                             <el-tag type="info" >
                                {{ row.state_name }}
                              </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="qtyOrder_name" label="计划数量" align="left" min-width="100"/>
                    <el-table-column prop="qtyProduced_name" label="报工数量" align="left" min-width="100"/>
                    <el-table-column label="操作" fixed="right" width="170">
                        <template slot-scope="scope">
                            <template v-if="scope.row.state == 'wait' || scope.row.state == 'ready'">
                                <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                                </el-button>
                            </template>

                            <template v-if="scope.row.state == 'progress'">
                                <el-button type="text" @click="ReportiongWork(scope.row.id)">报工
                                </el-button>
                            </template>
                            <template v-if="scope.row.state == 'wait' || scope.row.state == 'ready' || scope.row.state == 'suspend'">
                                <el-button type="text" @click="startWork(scope.row)">上工
                                </el-button>
                            </template>
                            <template v-if="scope.row.state == 'wait' || scope.row.state == 'ready'">
                                <el-button type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
                                </el-button>
                            </template>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
            </div>
        </div>
        <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
        <ReportingWork v-if="reportingVisible" ref="reporting" @refresh="refresh" />
        <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
        <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false" />
        <SuperQuery v-if="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
            @superQuery="superQuery" />
    </div>
</template>

<script>
    import request from '@/utils/request'
    import {
        getDictionaryDataSelector
    } from '@/api/systemData/dictionary'
    import JNPFForm from './Form'
    import ReportingWork from './ReportingWork'
    import ExportBox from './ExportBox'
    import {
        getDataInterfaceRes
    } from '@/api/systemData/dataInterface'
    import Detail from './Detail'
    import columnList from './columnList'
    import SuperQuery from '@/components/SuperQuery'
    import superQueryJson from './superQueryJson'

    export default {
        components: {
            JNPFForm,
            ReportingWork,
            ExportBox,
            Detail,
            SuperQuery
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
                    state: undefined,
                    name: undefined,
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
                    sort: "desc",
                    sidx: "",
                },
                formVisible: false,
                //报工
                reportingVisible:false,
                exportBoxVisible: false,
                stateOptions: [],
                stateProps: {
                    "label": "fullName",
                    "value": "enCode"
                },
            }
        },
        computed: {
            menuId() {
                return this.$route.meta.modelId || ''
            }
        },
        created() {
            this.getColumnList(),
                this.initData()
            this.getstateOptions();
        },
        methods: {
            getColumnList() {
                // 没有开启权限
                this.columnOptions = this.transformColumnList(this.columnList)
            },
            transformColumnList(columnList) {
                let list = []
                for (let i = 0; i < columnList.length; i++) {
                    const e = columnList[i];
                    if (!e.prop.includes('-')) {
                        list.push(e)
                    } else {
                        let prop = e.prop.split('-')[0]
                        let label = e.label.split('-')[0]
                        let vModel = e.prop.split('-')[1]
                        let newItem = {
                            align: "center",
                            jnpfKey: "table",
                            prop,
                            label,
                            children: []
                        }
                        e.vModel = vModel
                        if (!this.expandObj.hasOwnProperty(`${prop}Expand`)) this.$set(this.expandObj, `${prop}Expand`,
                            false)
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
            getstateOptions() {
                getDictionaryDataSelector('360813212683211973').then(res => {
                    this.stateOptions = res.data.list
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
                    url: `/api/jx/Mrp_workorder/getList`,
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
                    this.total = res.data.pagination.total
                    this.listLoading = false
                })
            },
            startWork(row){
                let data ={
                    id:row.id,
                    state : 'progress',
                    equipmentId:row.equipmentId
                }
                request({url: `/api/jx/Mrp_workorder/startWork/${row.id}`,method: 'PUT',data}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })

            },
            handleDel(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({url: `/api/jx/Mrp_workorder/${id}`,method: 'DELETE'}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })
                }).catch(() => {});
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
            addOrUpdateHandle(id, isDetail) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.JNPFForm.init(id, isDetail)
                })
            },
            //报工
            ReportiongWork(id,isDetail){
                this.reportingVisible = true
                this.$nextTick(() => {
                    this.$refs.reporting.init(id, isDetail)
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
                    url: `/api/jx/Mrp_workorder/Actions/Export`,
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
                this.listQuery.sort = "desc"
                this.listQuery.sidx = ""
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
