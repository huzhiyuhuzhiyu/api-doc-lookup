<template>

    <div class="JNPF-common-layout">
        <Detailspages v-if="flag" :equipmentId="equipmentId" @handles="handles"/>
        <div v-else="!flag" class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                    <!--          <el-col :span="5">
                                <el-form-item label="分类">
                                  <JNPFTreeSelect v-model="query.categoryId" placeholder="请选择" :options="categoryIdOptions"
                                    :props="categoryIdProps" clearable />
                                </el-form-item>
                              </el-col>-->
                    <el-col :span="6">
                        <el-form-item label="车间">
                            <JNPFTreeSelect v-model="query.mrpWorkshopId" placeholder="请选择"
                                            :options="mrpWorkshopIdOptions" :props="mrpWorkshopIdProps"
                                            clearable
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="设备">
                            <el-input v-model="query.name" placeholder="编号/名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="search()">查询</el-button>
                            <el-button size="mini" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>

                    <el-col style="text-align: right; display: flex;" :span="6">
                        <el-form-item label="定时">
                            <el-select v-model="value" @change="updatetimes">
                                <el-option v-for="item in updatetime" :key="item.value" :label="item.label"
                                           :value="item.value"
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
                <JNPF-table v-loading="listLoading" :data="list" border @sort-change="sortChange"
                            :span-method="arraySpanMethod"
                >
                    <el-table-column prop="name" label="设备名称" align="left" min-width="100" resizable/>
                    <el-table-column prop="code" label="设备编号" align="left" />
                    <el-table-column prop="mrpWorkshopName" label="所属车间" align="left" />
                    <el-table-column prop="output.avg" label="平均产量(个/小时)" align="left" /><!-- 运行时间 -->
                    <el-table-column prop="output.sum" label="生产数量" align="left" />
                    <el-table-column label="操作" fixed="right" width="60">
                        <template slot-scope="scope">
                            <el-button type="text" @click="goDetail(scope.row.id)">详情
                            </el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                            @pagination="initData"
                />
            </div>
        </div>
        <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh"/>
        <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download"/>
        <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false"/>
        <SuperQuery v-if="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuery"/>
    </div>
</template>

<script>
import { getListTodayOutPut } from '@/api/equipment'

import { mapGetters } from 'vuex'

import request from '@/utils/request'
import JNPFForm from './Form'
import ExportBox from './ExportBox'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import Detail from './Detail'
import columnList from './columnList'
import SuperQuery from '@/components/SuperQuery'
import superQueryJson from './superQueryJson'

import Detailspages from './detailspages'

export default {
    components: {
        JNPFForm,
        ExportBox,
        Detail,
        SuperQuery,
        Detailspages
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
                categoryId: undefined,
                name: undefined,
                mrpWorkshopId: undefined,
                mrpWorkshopIds: []
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
                sort: 'desc',
                sidx: '',
                isIot: true,//是否联网
                typeS: 'CG',
                active: 1
            },
            formVisible: false,
            exportBoxVisible: false,
            categoryIdOptions: [],
            categoryIdProps: {
                'label': 'name',
                'value': 'id',
                'children': 'children'
            },
            mrpWorkshopIdOptions: [],
            mrpWorkshopIdProps: {
                'label': 'name',
                'value': 'id',
                'children': 'children'
            },

            flag: false,
            dataForm: {},
            equipmentId:'',

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
            timer: null

        }
    },
    computed: {
        ...mapGetters(['iot_data', 'newDate']),
        menuId() {
            return this.$route.meta.modelId || ''
        }
    },
    created() {
        this.getColumnList()
        this.initData(true)
        this.getcategoryIdOptions()
        this.getmrpWorkshopIdOptions()
    },
    mounted() {
    },
    methods: {

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
            if(id != undefined && id != ''){
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

        getColumnList() {
            // 没有开启权限
            this.columnOptions = this.transformColumnList(this.columnList)
        },
        transformColumnList(columnList) {
            var ist = []
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
        getcategoryIdOptions() {
            let _query = {
                paramList: [{
                    field: 'parentId',
                    fieldName: '父ID',
                    dataType: 'int',
                    required: 0,
                    defaultValue: -1
                }, {
                    field: 'type',
                    fieldName: '类型',
                    dataType: 'varchar',
                    required: 0,
                    defaultValue: '生产设备'
                }],
                tenantId: '',
                origin: 'preview'
            }
            getDataInterfaceRes('339308611257762501', _query).then(res => {
                let data = res.data
                this.categoryIdOptions = data
            })
        },
        sortChange({
            column,
            prop,
            order
        }) {
            this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
            this.listQuery.sidx = !order ? '' : prop
            this.initData(true)
        },

        // 分页请求函数
        initData(boo) {
            this.listLoading = boo || false
            let _query = {
                ...this.listQuery,
                ...this.query,
                keyword: this.keyword,
                dataType: 0,
                menuId: this.menuId
            }
            getListTodayOutPut(_query).then(res => {
                var _list = []

                for (let i = 0; i < res.data.list.length; i++) {

                    let _data = res.data.list[i]
                    let count = 0
                    for (var j = 0; j < _data.output.data.length; j++) {
                        if (_data.output.data[j] > 0) {
                            count++
                        }
                    }
                    if (count > 0) {
                        _data.output.avg = (_data.output.sum / count).toFixed(2)
                    }

                    // console.log(_data);
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
            console.log('刷新')
            this.initData(true)
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
                            this.initData(true)
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
            this.initData(true)
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
            this.query.typeS = 'CG'
            this.search()
        },

        /**
         * 打开详细页
         * @param {Object} id
         * @param {Object} output
         */
        goDetail(id) {
            this.flag = true
            this.equipmentId = id
            // console.log(this.$refs.detail);
            // this.detailVisible = true
            // this.$nextTick(() => {
            //   this.$refs.Detail.init(id)
            // })
        },

        handle() {
            this.flag = false
        },
        handles() {
            this.flag = !this.flag
            this.initData(true)
        }

    },
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null
    }

}
</script>

<style>

</style>
