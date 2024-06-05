<template>

    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                    <el-col :span="6">
                        <el-form-item label="维修单号">
                            <el-input v-model="query.name" placeholder="请输入" clearable> </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备名称">
                            <el-select v-model="query.equimentId" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in equimentIdOptions" :key="index" :label="item.name"
                                    :value="item.F_Id" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="删除">
                            <el-input v-model="query.active" placeholder="请输入" clearable> </el-input>
                        </el-form-item>
                    </el-col> -->
                    <template v-if="true">
                        <el-col :span="6">
                            <el-form-item label="状态">
                                <el-select v-model="query.state" placeholder="请选择" clearable>
                                    <el-option v-for="(item, index) in stateOptions" :key="index" :label="item.fullName"
                                        :value="item.enCode" :disabled="item.disabled"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                            <!-- <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">
                                展开
                            </el-button>
                            <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>
                                收起
                            </el-button> -->
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head">
                    <div>
                        <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增报修单
                        </el-button>
                        <el-button v-show="query.state == '3'?true:false" type="primary" icon="el-icon-s-tools" @click="handleBatchRemoveDel()">验收
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
                    :span-method="arraySpanMethod" has-c @selection-change="handleSelectionChange" custom-column>
                    <el-table-column prop="name_name" label="维修单号" align="left" width="210" />
                    <el-table-column prop="equimentId_name" label="设备名称" align="left" width="200" />
                    <el-table-column prop="partnerId_name" label="申请人" align="left" />
                    <el-table-column prop="requestTime_name" label="申请时间" align="left" width="200" />
                    <!-- <el-table-column prop="responseTime_name" label="响应时间" align="left" />
                    <el-table-column prop="reviewerId_name" label="响应人" align="left" />
                    <el-table-column prop="repairerId_name" label="维修人" align="left" />
                    <el-table-column prop="completionTime_name" label="完成时间" align="left" /> -->
                    <el-table-column prop="equipmentTroubleId_name" label="故障原因" align="left" />
                    <el-table-column prop="state_name" label="状态" align="left" />
                    <!-- <el-table-column prop="solution_name" label="解决措施" align="left" /> -->
                    <el-table-column prop="note_name" label="备注" align="left" />
                    <el-table-column label="操作" fixed="right" width="150">
                        <template slot-scope="scope">

                            <el-button type="text" v-show="scope.row.state == '1'?true:false " @click="addOrUpdateHandles(scope.row)">编辑
                            </el-button>
                            <el-button type="text"  @click="addOrUpdateHandles(scope.row,1)">详情
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

            showAll: false,
            superQueryVisible: false,
            superQueryJson,
            detailVisible: false,
            query: {
                name: undefined,
                equimentId: undefined,
                active: 1,
                state: '',
            },
            treeProps: {
                children: 'children',
                label: 'fullName',
                value: 'id'
            },
            list: [],
            listLoading: true,
            multipleSelection: [], total: 0,
            listQuery: {
                superQueryJson: '',
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "requestTime",
            },
            formVisible: false,
            exportBoxVisible: false,
            equimentIdOptions: [],
            equimentIdProps: { "label": "name", "value": "F_Id" },
            faultIdOptions: [],
            faultIdProps: { "label": "name", "value": "F_Id" },
            equipmentTroubleIdOptions: [],
            equipmentTroubleIdProps: { "label": "name", "value": "F_Id" },
            reviewerIdOptions: [],
            reviewerIdProps: { "label": "name", "value": "F_Id" },
            repairerIdOptions: [],
            repairerIdProps: { "label": "name", "value": "F_Id" },
            stateOptions: [],
            stateProps: { "label": "fullName", "value": "enCode" },
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
        this.getequimentIdOptions();
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
        getequimentIdOptions() {
            getDataInterfaceRes('337912333508542533').then(res => {
                let data = res.data
                this.equimentIdOptions = data
            })
        },
        getstateOptions() {
            getDictionaryDataSelector('345099974142336005').then(res => {
                this.stateOptions = res.data.list
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
                url: `/api/equipmentRepair/Equipment_repair/getList`,
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
                    url: `/api/equipmentRepair/Equipment_repair/${id}`,
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

            request({
                url: `/api/equipmentRepair/Equipment_repair/check/${ids}`,
                method: 'get',
            }).then(res => {
                this.$message({
                    type: 'success',
                    message: res.msg,
                    onClose: () => {
                        this.initData()
                    }
                });
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
        addOrUpdateHandle(item, isDetail) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.JNPFForm.init(item, isDetail)
            })
        },
        addOrUpdateHandles(item,id) {
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.JNPFForm.init(item.id,id)
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
                url: `/api/equipmentRepair/Equipment_repair/Actions/Export`,
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
            this.listQuery.sidx = "requestTime"
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
            this.query.active = 1;
            // this.query.state = '1';
            this.search()
        },

        repair(item) {
            if (item.repairerId != null || item.repairerId != "") {
                this.$message({
                    type: 'warning',
                    message: "报修单已有人维修",
                });
                return;
            }
            let data = {
                id: item.id,
                reviewerId: this.$store.state.user.userInfo.userId
            }
            request({
                url: '`/api/equipmentRepair/Equipment_repair/updateRepairStop`',
                method: 'post',
                data
            }).then(res => {
                this.$message({
                    type: 'success',
                    message: res.msg,
                    onClose: () => {
                        this.initData()
                    }
                });
            })
        },

        check(id) {
            request({
                url: '/api/equipmentRepair/Equipment_repair/check/' + id,
                method: 'get'
            }).then(res => {
                this.$message({
                    type: 'success',
                    message: res.msg,
                    onClose: () => {
                        this.initData()
                    }
                });
            })
        }
    }
}
</script>
