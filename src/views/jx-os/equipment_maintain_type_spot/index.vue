<template>

    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                    <!-- <el-col :span="6">
                                <el-form-item label="操作类型">
                                        <el-select v-model="query.type" placeholder="请选择"
                                                   clearable>
                                            <el-option v-for="(item, index) in typeOptions" :key="index"
                                                       :label="item.fullName" :value="item.id"
                                                       :disabled="item.disabled"></el-option>
                                        </el-select>
                                </el-form-item>
                            </el-col> -->
                    <el-col :span="6">
                        <el-form-item label="物件类型">
                            <el-select v-model="query.typeS" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in typeSOptions" :key="index" :label="item.name"
                                    :value="item.F_Id" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="类型名称">
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
                <el-table v-loading="listLoading" :data="list" @sort-change='sortChange'
                    :span-method="arraySpanMethod" highlight-current-row>
                    <el-table-column prop="" label="" align="left" type="expand" class="line">
                        <template slot-scope="props">
                            <JNPF-table :data="props.row.tableField113" @sort-change='sortChangeitem'
                                :span-method="arraySpanMethoditem" style="padding-left: 20px;">
                                <el-table-column prop="name" label="内容名称" align="left" />
                                <el-table-column prop="method" label="方法" align="left" width="350">
                                    <template slot-scope="scope">
                                        {{ scope.row.method | dynamicText(methodOptions) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="requirement" label="要求" align="left" />
                                <el-table-column label="是否必须" prop="isMust" algin="left">
                                    <template slot-scope="scope">
                                        {{ scope.row.isMust | dynamicText(isMustOptions) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="standard" label="标准" align="left" />
                                <el-table-column prop="note" label="备注" align="left" />
                            </JNPF-table>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序号" width="60" align="center" />
                    <el-table-column prop="name_name" label="类型名称" align="left" />
                    <el-table-column prop="typeS_name" label="物件类型" align="left" />
                    <el-table-column prop="note_name" label="备注" align="left" />
                    <el-table-column label="操作" fixed="right" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">编辑
                            </el-button>
                            <el-button type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import JNPFForm from './Form'
import ExportBox from './ExportBox'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import Detail from './Detail'
import columnList from './columnList'
import SuperQuery from '@/components/SuperQuery'
import superQueryJson from './superQueryJson'
import router from '@/router'

export default {
    components: { JNPFForm, ExportBox, Detail, SuperQuery },
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
                type: "2",
                typeS: "",
                name: undefined,
                active: 1
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
            exportBoxVisible: false,
            typeSOptions: [],
            typeSProps: { "label": "name", "value": "F_Id" },
            typeOptions: [{ "fullName": "点检", "id": "点检" }, { "fullName": "保养", "id": "保养" }],
            typeProps: { "label": "fullName", "value": "id" },
            typeId: '2',
            methodOptions:[{ "fullName": "数值", "id": "number" }, { "fullName": "是否", "id": "boolean" },{ "fullName": "文本", "id": "text" }, { "fullName": "附件", "id": "file" }],



            //子表
            listLoadingitem: false,
            listQueryitem: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "",
            },
            listitem: [],
            totalitem: 0,
            queryitem: {
                typeid: undefined,
                name: undefined,
                type: "2",
                active: 1
            },
            typeSOptionsitem: [],
            expandObjitem: {},
            columnOptionsitem: [],
            mergeListitem: [],
            isMustOptions: [{ "fullName": "是", "id": "1" }, { "fullName": "否", "id": "0" }],
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
        this.gettypeSOptions();
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
        arraySpanMethod({ column }) {
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
        gettypeSOptions() {
            getDataInterfaceRes('337916290050031685').then(res => {
                let data = res.data
                this.typeSOptions = data
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
                url: `/api/maintionType/Equipment_maintain_type/getList`,
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
        handleDel(id) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                request({
                    url: `/api/maintionType/Equipment_maintain_type/${id}`,
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
            }).catch(() => {
            });
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
            let query = { ...data, ...this.listQuery, ...this.query, menuId: this.menuId }
            request({
                url: `/api/maintionType/Equipment_maintain_type/Actions/Export`,
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
            this.initData();
        },
        refresh(isrRefresh) {
            this.formVisible = false
            if (isrRefresh) this.reset()
        },
        reset() {
            for (let key in this.query) {
                this.query[key] = undefined
            }
            this.query.type = this.typeId;
            this.query.active = 1;
            this.initDataitem();
            this.search()
        },



        //子表信息
        initDataitem() {
            this.listLoadingitem = true;
            let _query = {
                ...this.listQueryitem,
                ...this.queryitem,
                keyword: this.keyword,
                dataType: 0,
                menuId: this.menuId
            };
            console.log(_query);
            request({
                url: `/api/maintionTypeItem/Equipment_maintain_type_item/getList`,
                method: 'post',
                data: _query
            }).then(res => {
                var _list = [];
                for (let i = 0; i < res.data.list.length; i++) {
                    let _data = res.data.list[i];
                    _list.push(_data)
                }
                this.listitem = _list.map(o => ({
                    ...o,
                    ...this.expandObjitem
                }))
                this.totalitem = res.data.pagination.total
                this.listLoadingitem = false
            })
        },
        gettypeidOptions() {
            getDataInterfaceRes('340089684799522501').then(res => {
                let data = res.data
                this.typeidOptionsitem = data;
            })
        },
        sortChangeitem({ column, prop, order }) {
            this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
            this.listQuery.sidx = !order ? '' : prop
            this.initDataitem()
        },
        arraySpanMethoditem({ column }) {
            for (let i = 0; i < this.mergeList.length; i++) {
                if (column.property == this.mergeList[i].prop) {
                    return [this.mergeList[i].rowspan, this.mergeList[i].colspan]
                }
            }
        },

        getListItem(row) {
            console.log(row);
            this.listitem = [];
            this.queryitem.typeid = row.id;
            this.initDataitem();
        }
    }
}
</script>
