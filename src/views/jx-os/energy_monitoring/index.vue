<template>
    <div class="JNPF-common-layout">
        <Detailspages v-if="flag" :dataForm="dataForm" @handles="handles" ></Detailspages>
        <div v-show="!flag" class="JNPF-common-layout-center">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="6">
                        <el-form-item label="能耗类型">
                            <el-select v-model="query.tableField119_energyType" placeholder="请选择" clearable>
                                <el-option v-for="(item, index) in tableField119_energyTypeOptions" :key="index"
                                    :label="item.fullName" :value="item.enCode" :disabled="item.disabled"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item label="点位名称">
                            <el-input v-model="query.tableField119_name" placeholder="请输入" clearable> </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="search()">查询</el-button>
                            <el-button size="mini" @click="reset()">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>

            <div class="JNPF-common-layout-main JNPF-flex-main">
                <JNPF-table v-loading="listLoading" :data="list">
                    <!-- @sort-change='sortChange' :span-method="arraySpanMethod" -->
                    <el-table-column prop="startTime" label="日期" :formatter="formatDate" align="center" width="120" />
                    <el-table-column prop="tableField119[0].energyType" label="能耗类型"  align="center" width="90" />
                    <el-table-column prop="equipmentId_name" label="点位名称" align="left" min-width="120" />
                      <el-table-column prop="tableField119[0].mrpWorkshopId" label="点位位置" align="left" min-width="120" />
                    <el-table-column prop="startValue" label="起始度数" align="left" min-width="100">
                    </el-table-column>
                    <el-table-column prop="value" label="终止度数" align="left" min-width="100"/>
                    <el-table-column prop="useValue" label="使用度数" align="left" min-width="100"/>
                    <el-table-column label="操作" fixed="right" width="70">
                        <template slot-scope="scope">

                            <el-button size="mini" type="text" @click="goDetail(scope.row)">详情
                            </el-button>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getListEnergy
    } from '@/api/equipment'
    import {
        getIot
    } from '@/api/iot'
    import {
        mapGetters
    } from 'vuex'

    import request from '@/utils/request'
    import {
        getDictionaryDataSelector
    } from '@/api/systemData/dictionary'
    import {
        getDataInterfaceRes
    } from '@/api/systemData/dataInterface'

    import Detailspages from './detailspages'

    import moment from 'moment'

    export default {
        components: {
            Detailspages
        },
        data() {
            return {
                query: {
                    tableField119_name: undefined,
                    tableField119_energyType:undefined,
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
                    sidx: "startTime",
                    name:"getNowMosaicItem",
                    code:"E000_1"
                },
                formVisible: false,
                exportBoxVisible: false,
                categoryIdOptions: [],
                categoryIdProps: {
                    "label": "name",
                    "value": "id",
                    "children": "children"
                },

                flag: false,
                dataForm: {},

                energyTypeOptions: [],
                energyTypeProps: {
                    "label": "fullName",
                    "value": "enCode"
                },

                tableField119_energyTypeOptions: [],


            }
        },
        computed: {
            ...mapGetters(['iot_data', 'newDate']),
            menuId() {
                return this.$route.meta.modelId || ''
            }
        },
        created() {
            // this.getColumnList(),
            this.initData()
            this.getcategoryIdOptions();
            this.gettableField119_energyTypeOptions();
        },
        methods: {

            getenergyTypeOptions() {
                getDictionaryDataSelector('351649524592159941').then(res => {
                    this.energyTypeOptions = res.data.list
                })
            },

            getcategoryIdOptions() {
                getDataInterfaceRes('339308611257762501').then(res => {
                    let data = res.data
                    this.categoryIdOptions = data
                })
            },

            gettableField119_energyTypeOptions() {
                getDictionaryDataSelector('351649524592159941').then(res => {
                    this.tableField119_energyTypeOptions = res.data.list
                })
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

            initData() {
                this.listLoading = true;
                let _query = {
                    ...this.listQuery,
                    ...this.query,
                    keyword: this.keyword,
                    dataType: 0,
                    menuId: this.menuId
                };
                //TODO
                // console.log(_query);
                request({
                    url: `/api/jx/Equipment_data_cache/getList`,
                    method: 'post',
                    data: _query
                }).then(res => {
                    var _list = [];
                    for (let i = 0; i < res.data.list.length; i++) {
                        let _data = res.data.list[i];
                        for (let z = 0; z < _data.tableField119.length; z++) {
                            let tableField119 = _data.tableField119[z];
                        }
                        _data.value = parseFloat(_data.value).toFixed(2);
                        _data.useValue = parseFloat(_data.useValue).toFixed(2);
                        _data.startValue = (parseFloat(_data.value) - parseFloat(_data.useValue)).toFixed(2)

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

            //方法区
            formatDate(row, column) {
                // 获取单元格数据
                let data = row[column.property]
                if (data == null) {
                    return null
                }
                let dt = new Date(data)
                return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
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

            search() {
                this.listQuery.currentPage = 1
                this.listQuery.pageSize = 20
                this.listQuery.sort = "desc"
                this.listQuery.sidx = "startTime"
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
            },

            /**
             * 打开详细页
             * @param {Object} id
             * @param {Object} output
             */
            goDetail(row) {
                // console.log('打开详细页');

                this.flag = true;
                this.dataForm = row;
            },

            handle() {
                this.flag = false;
            },
            handles() {
                this.flag = !this.flag;
                this.initData();
            },

        }
    }
</script>
