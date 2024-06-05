<template>

    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="6">
                        <el-form-item label="任务类型">
                            <el-select v-model="query.maintenanceLevel" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in maintenanceLevelOptions" :key="index"
                                    :label="item.fullName" :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <template v-if="showAll">
                        <el-col :span="6">
                            <el-form-item label="状态">
                                <el-select v-model="query.state" placeholder="请选择" clearable>
                                    <el-option v-for="(item, index) in stateOptions" :key="index" :label="item.fullName"
                                        :value="item.id" :disabled="item.disabled"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>
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
                        <el-button type="primary" icon="el-icon-plus"  @click="addOrUpdateHandle()">新增
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
                    :span-method="arraySpanMethod" custom-column>
                    <el-table-column prop="equipmentId_name" label="设备名称" align="left" width="200"/>
                    <el-table-column prop="equimentMaintainTypeId_name" label="点检类型" align="left" width="150"/>
                    <el-table-column prop="userId_name" label="负责人" align="left" width="150"/>
                    <el-table-column prop="startDate_name" label="开始时间" align="left" width="180"/>
                    <el-table-column prop="endDate_name" label="结束时间" align="left" width="180"/>
                    <el-table-column label="状态" prop="state" algin="left">
                        <template slot-scope="scope">
                            {{ scope.row.state | dynamicText(stateOptions) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="note_name" label="备注" align="left" width="200"/>
                    <el-table-column label="操作" fixed="right" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="goDetail(scope.row)">点检
                            </el-button>

                             <el-button type="text"  @click="goDetails(scope.row,1)">详情
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
        <Detail v-if="detailVisible" ref="Detail" @refresh="refresh" />
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

export default {
    components: { JNPFForm, ExportBox, Detail, SuperQuery },
    data() {
        return {
            expandObj: {},
            columnOptions: [],
            mergeList: [],
            columnList,

            showAll: true,
            superQueryVisible: false,
            superQueryJson,
            detailVisible: false,
            query: {
                state:undefined,
                name: undefined,
                maintenanceLevel: undefined,
                typeS: undefined,
                type: 2,
                active: 1,
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
            maintenanceLevelOptions: [{ "fullName": "预防", "id": "预防" }, { "fullName": "日常", "id": "日常" }, { "fullName": "计划", "id": "计划" }],
            maintenanceLevelProps: { "label": "fullName", "value": "id" },
            typeOptions: [{ "fullName": "保养", "id": "1" }, { "fullName": "点检", "id": "2" }],
            typeProps: { "label": "fullName", "value": "id" },
            equimentMaintainTypeIdOptions: [],
            equimentMaintainTypeIdProps: { "label": "name", "value": "F_Id" },
            typeSOptions: [{ "fullName": "量具", "id": "量具" }, { "fullName": "工装", "id": "工装" }, { "fullName": "设备", "id": "设备" }],
            typeSProps: { "label": "fullName", "value": "id" },
            stateOptions: [{ "fullName": "待点检", "id": "1" }, { "fullName": "已点检", "id": "2" }],
            stateProps: { "label": "fullName", "value": "id" },
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
        goDetail(item) {
                if(item.state == '2'){
                    this.$message({
                        message:'已点检的任务,无需点检',
                        type:'warning'
                    })
                    return;
                }            
            this.detailVisible = true
            this.$nextTick(() => {
                this.$refs.Detail.init(item)
            })
        },
        goDetails(item,id) {
            this.detailVisible = true
            this.$nextTick(() => {
                this.$refs.Detail.init(item,id)
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
                url: `/api/equipmentMaintain/Equipment_maintain/getList`,
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
                    url: `/api/equipmentMaintain/Equipment_maintain/${id}`,
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
                url: `/api/equipmentMaintain/Equipment_maintain/Actions/Export`,
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
            this.formVisible = false;
            this.detailVisible = false;
            if (isrRefresh) this.reset()
        },
        reset() {
            for (let key in this.query) {
                this.query[key] = undefined
            }
            this.query.active = 1;
            this.query.type = 2;
            this.search()
        },


        /**
         * 
         * @param {响应} item 
         */
        response(item){
            console.log(item);
            if(item.state == "待响应"){
                let data = {
                    userId:this.$store.state.user.userInfo.userId,
                    id:item.id
                }
                request({
                    url: `/api/equipmentMaintain/Equipment_maintain/updateByUserId`,
                    method: 'get',
                    data: data
                }).then(res => {
                    if (res.code == 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1000,
                            onClose: () => {
                                this.initData();
                            }
                        })
                    } else {
                        this.$message.error(res.msg);
                    }
                })          
            }else{
                this.$message({
                    message:'已处理的任务,无需响应',
                    type:'warning'
                })
            }
            console.log(this.$store.state.user.userInfo.userName);  
        }

    }
}
</script>
