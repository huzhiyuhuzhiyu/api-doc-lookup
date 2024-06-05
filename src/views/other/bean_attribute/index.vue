<template>

    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-left">
            <div class="JNPF-common-title">
                <h2>表单</h2>
                <el-link icon="icon-ym" :icon="!expandsTree ? 'el-icon-folder' : 'el-icon-folder-opened'"
                    :underline="false" @click.native="toggleTreeExpand()" />
            </div>
            <el-tree :data="treeData" :props="treeProps" highlight-current :default-expand-all="expandsTree"
                v-if="refreshTree" ref="treeBox" :expand-on-click-node="false" @node-click="handleNodeClick"
                class="JNPF-common-el-tree" node-key="F_Id">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <i :class="data.icon"></i>
                    <span class="text">{{node.label}}</span>
                </span>
            </el-tree>
        </div>

        <div class="JNPF-common-layout-center">
            <!-- <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row> -->
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增
                        </el-button>
                    </div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" content="刷新" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                @click="reset()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="list" @sort-change='sortChange' customColumn
                    :span-method="arraySpanMethod">
                    <!-- <el-table-column prop="content_name" label="字段JSON" align="left" /> -->
                    <el-table-column prop="content.label" label="标题"/>
                    <el-table-column prop="content.prop" label="编码"/>
                    <el-table-column prop="content.jnpfKey" label="类型" />
                    <el-table-column prop="content.__config__.span" label="表单栅格" align="center" />
                    <el-table-column prop="content.width" label="列表宽度" align="center" />
                    <el-table-column prop="content.__config__.required" label="是否必填" align="center" />
                    <el-table-column prop="content.isblock" label="结尾换行" align="center" />

                    <el-table-column prop="sortCode" label="排序" align="left" width="50" />
                    <el-table-column label="操作" fixed="right" width="150">
                        <template slot-scope="scope">
                           <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                            </el-button>
                            <el-button type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
                            </el-button> -->
                            <el-button type="text" @click="goDetail(scope.row.id)">详情
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
    </div>
</template>

<script>
    import request from '@/utils/request'
    import {
        getDictionaryDataSelector
    } from '@/api/systemData/dictionary'
    import JNPFForm from './index/Home'
    import ExportBox from './ExportBox'
    import {
        getDataInterfaceRes
    } from '@/api/systemData/dataInterface' 
    import Detail from './Detail'
    import columnList from './columnList'

    export default {
        components: {
            JNPFForm,
            ExportBox,
            Detail
        },
        data() {
            return {
                expandObj: {},
                columnOptions: [],
                mergeList: [],
                columnList,

                detailVisible: false,
                query: {},
                expandsTree: true,
                refreshTree: true,
                treeProps: {
                    children: 'children',
                    label: 'name',
                    value: 'F_Id'
                },
                list: [],
                listLoading: true,
                total: 0,
                listQuery: {
                    superQueryJson: '',
                    currentPage: 1,
                    pageSize: 20,
                    sort: "asc",
                    sidx: "sortcode",
                },
                formVisible: false,
                exportBoxVisible: false,
                propTreeData: [],
                treeData: [],
                treeActiveId: '',
            }
        },
        computed: {
            menuId() {
                return this.$route.meta.modelId || ''
            }
        },
        created() {
            this.getColumnList();
            this.getTreeView();
            this.getChildrenTreeView();
        },
        methods: {
            toggleTreeExpand() {
                this.refreshTree = false
                this.expandsTree = !this.expandsTree
                this.$nextTick(() => {
                    this.refreshTree = true
                    this.$nextTick(() => {
                        this.$refs.treeBox.setCurrentKey(this.listQuery.categoryId)
                    })
                })
            },
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
            getTreeView() {
                getDataInterfaceRes('403464870466422661').then(res => {
                    let data = res.data
                    this.treeData = data
                    this.initData()
                })
            },
            getChildrenTreeView() {
                console.log('getTreeView')
                getDataInterfaceRes('403572620777228165').then(res => {
                    let data = res.data
                    this.propTreeData = data
                })
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
                this.treeActiveId = data.F_id
                for (let key in this.query) {
                    this.query[key] = undefined
                }
                this.query.categoryId = data.F_id
                // this.listQuery = {
                //     currentPage: 1,
                //     pageSize: 20,
                //     sort: "asc",
                //     sidx: "",
                // }
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
                    url: `/api/com.jx/Bean_attribute/getList`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    var _list = [];
                    for (let i = 0; i < res.data.list.length; i++) {
                        let _data = res.data.list[i];

                        _data.content = JSON.parse(_data.content.replace("\\",""))

                        _data.content.__config__.required = (_data.content.__config__.required ==0 ? '否' : '是')
                        _data.content.isblock = (_data.content.isblock ==0 ? '否' : '是')

                        var t={
                            'address':'地址',
                            'cascader':'级联选择',
                            'comSelect':'应用',
                            'depSelect':'部门',
                            'groupSelect':'groupSelect',
                            'popupSelect':'popupSelect',
                            'popupTableSelect':'popupTableSelect',
                            'posSelect':'posSelect',
                            'rate':'rate',
                            'relationForm':'relationForm',
                            'roleSelect':'角色选择',
                            'selet':'下拉',
                            'slider':'slider',
                            'table':'表格',
                            'treeSelect':'树形选择',
                            'userSelect':'用户',
                            'comInput':'文本框',
                            'radio':'单选',
                            'checkbox':'复选',
                            'textarea':'大文本框',
                            'numInput':'数字输入框',
                            'switch':'开关',
                            'date':'日期',
                            'time':'时间',
                        }

                        var x = _data.content.jnpfKey

                        _data.content.jnpfKey = t[x]


                        // for (let j = 0; j < _data.content.length; j++) {
                        //     var x = _data.content[j].fieldName
                        //     _data[x] = _data.content[j].value
                        // }



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
            },
            handleDel(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/com.jx/Bean_attribute/${id}`,
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
            addOrUpdateHandle(id, isDetail) {
                this.formVisible = true
                this.$nextTick(() => {
                    // this.$refs.JNPFForm.init(id, isDetail)
                    this.$refs.JNPFForm.init(id, this.propTreeData, this.treeActiveId, isDetail)
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
                    url: `/api/com.jx/Bean_attribute/Actions/Export`,
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
                // this.listQuery.currentPage = 1
                // this.listQuery.pageSize = 20
                // this.listQuery.sort = "desc"
                // this.listQuery.sidx = ""
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
