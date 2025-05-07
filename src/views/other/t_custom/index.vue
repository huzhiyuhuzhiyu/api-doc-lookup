<template>

    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                    <el-col :span="6">
                        <el-form-item label="名称">
                            <el-input v-model="query.name" placeholder="请输入" clearable> </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="性别">
                            <el-input v-model="query.sex" placeholder="请输入" clearable> </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="类型">
                            <num-range v-model="query.type"></num-range>
                        </el-form-item>
                    </el-col>
                    <template v-if="showAll">
                        <el-col :span="6">
                            <el-form-item label="扩展字段模板数据">
                                <el-input v-model="query.templedata" placeholder="请输入" clearable> </el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                            <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">
                                展开
                            </el-button>
                            <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
                                收起
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
                        </el-button>
                        <el-button type="text" icon="el-icon-download" @click="exportData()">导出
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" @click="handleBatchRemoveDel()">批量删除
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
                <JNPF-table v-loading="listLoading" customColumn :data="list" @sort-change='sortChange'
                    :span-method="arraySpanMethod" has-c @selection-change="handleSelectionChange" customKey="JNPFTableKey_833144">
                    <el-table-column prop="name_name" label="名称" align="left" />
                    <el-table-column prop="sex_name" label="性别" align="left" />
                    <el-table-column prop="type_name" label="类型" align="left" />
                    <!-- <el-table-column prop="templedata_name" label="扩展字段模板数据" align="left" /> -->

                    <!-- <el-table-column label="item.label" v-for="(item,index) in attrLabelList" :key="index" :label="item">
                        <template slot-scope="scope">
                            {{ scope.row.templedata[index].value }}
                        </template>
                    </el-table-column> -->

                    <el-table-column v-for="(item,index) in attrLabelList" :key="index" :prop="item.prop" :label="item.label" />

                    <el-table-column label="操作" fixed="right" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                            </el-button>
                            <el-button type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
            </div>
        </div>
        <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" />
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

                showAll: false,
                superQueryVisible: false,
                superQueryJson,
                detailVisible: false,
                query: {
                    name: undefined,
                    sex: undefined,
                    type: undefined,
                    templedata: undefined,
                },
                treeProps: {
                    children: 'children',
                    label: 'fullName',
                    value: 'id'
                },
                list: [],
                attrLabelList :[],
                listLoading: true,
                multipleSelection: [],
                total: 0,
                listQuery: {
                    superQueryJson: '',
                    currentPage: 1,
                    pageSize: 20,
                    sort: "desc",
                    sidx: "",
                },
                formVisible: false,
                exportBoxVisible: false,
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
            getAttrAll(){
                let _query = {
                    ...this.listQuery,
                    ...this.query,
                    keyword: this.keyword,
                    dataType: 0,
                    menuId: this.menuId
                };
                request({
                    url: `/api/os.jx/T_businiss_template/getList`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    var _list = [];
                    for (let i = 0; i < res.data.list.length; i++) {
                        let _data = res.data.list[i];
                        _list.push(_data)
                    }
                    var relList = _list.map(o => ({
                        ...o,
                        ...this.expandObj
                    }))
                    localStorage.setItem("relList",JSON.stringify(relList))
                })

                request({
                    url: `/api/os.jx/T_custom_field_template/getList`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    var _list = [];
                    for (let i = 0; i < res.data.list.length; i++) {
                        let _data = res.data.list[i];
                        _list.push(_data)
                    }
                    var attrList = _list.map(o => ({
                        ...o,
                        ...this.expandObj
                    }))
                    localStorage.setItem("attrList",JSON.stringify(attrList))

                })
            },
            getAttr(type){
                var relList = JSON.parse(localStorage.getItem("relList"))
                var attrList = JSON.parse(localStorage.getItem("attrList"))

                var labelList = []

                relList.forEach(function(item,index){
                    if(item.type = type){
                        attrList.forEach(function(item1,index1){
                            if(item1.id = item.temId){
                                var x = JSON.parse(item1.content.replace("\\",""))
                                x.forEach(function(item2,index2){
                                    labelList.push({
                                        label:item2.label,
                                        prop:item2.fieldName
                                    })
                                })
                            }
                        })

                    }
                })
                return labelList;
            },


            initData() {
                // this.getAttrAll()

                this.attrLabelList = this.getAttr(1)
                this.listLoading = true;
                let _query = {
                    ...this.listQuery,
                    ...this.query,
                    keyword: this.keyword,
                    dataType: 0,
                    menuId: this.menuId
                };
                request({
                    url: `/api/os.jx/T_custom/getList`,
                    method: 'post',
                    data: _query
                }).then(res => {

                    var _list = [];
                    for (let i = 0; i < res.data.list.length; i++) {
                        let _data = res.data.list[i];

                        _data.templedata = JSON.parse(_data.templedata.replace("\\",""))
                        for (let j = 0; j < _data.templedata.length; j++) {
                            var x = _data.templedata[j].fieldName
                            _data[x] = _data.templedata[j].value
                        }

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
                        url: `/api/os.jx/T_custom/${id}`,
                        method: 'DELETE'
                    }).then(res => {
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
            handleSelectionChange(val) {
                const res = val.map(item => item.id)
                this.multipleSelection = res
            },
            handleBatchRemoveDel() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        type: 'error',
                        message: '请选择一条数据',
                        duration: 1500,
                    })
                    return
                }
                const ids = this.multipleSelection.join()
                this.$confirm('您确定要删除这些数据吗, 是否继续？', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/os.jx/T_custom/batchRemove/${ids}`,
                        method: 'DELETE'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })
                }).catch(() => {})
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
                    url: `/api/os.jx/T_custom/Actions/Export`,
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
