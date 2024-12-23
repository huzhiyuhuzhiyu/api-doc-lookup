<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-left treeBox" v-if="renderTree">
            <div class="JNPF-common-title">
                <h2>{{ treeName }}</h2>
                <span class="options">
              <el-dropdown>
                <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="getData()">刷新数据</el-dropdown-item>
                  <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                  <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                  <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                  <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
            </div>
            <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
                <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                         highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                         class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
              <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                <i
                    :class="[data.childrenList && data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                <span class="text" :title="data.name">{{ data.name }}</span>
              </span>
                </el-tree>
            </el-scrollbar>
        </div>
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                    <template v-for="item in searchList">
                        <el-col :span="4" :key="item.prop" v-if="item.hasOwnProperty('render') ? item.render : true">
                            <el-form-item>
                                <el-input v-if="item.searchType === 1" v-model="item.fieldValue"
                                          :placeholder="'请输入' + item.label"
                                          clearable @keyup.enter.native="search('basic')"
                                />
                                <el-date-picker v-else-if="item.searchType === 2" v-model="item.fieldValue" type="month"
                                                value-format="yyyy-MM" style="width: 100%;" :clearable="false"
                                                popper-class="date_form"
                                                @change="search('basic')"
                                />
                                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue" type="date"
                                                value-format="yyyy-MM-dd" style="width: 100%;" :clearable="false"
                                                popper-class="date_form"
                                                @change="search('basic')"
                                />
                                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue"
                                           :placeholder="'请选择' + item.label"
                                           :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
                                >
                                    <el-option v-for="(item2, index2) in item.options" :key="index2"
                                               :label="item2.label"
                                               :value="item2.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </template>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                                {{ $t('common.search') }}
                            </el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                                    $t('common.reset')
                                }}
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head" style="padding:10px">
                    <div>
                        <el-button type="primary" size="mini" :disabled="!tableData.length" icon="el-icon-download"
                                   @click="exportForm"
                        >导出
                        </el-button>
                    </div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip content="高级查询" placement="top">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                     @click="superQueryVisible = true"
                            />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                                     @click="columnSetFun()"
                            />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                                     @click="initData()"
                            />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table  v-if="tableData.length" @sort-change="sortChange"  ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO custom-column :setColumnDisplayList="columnList">
                    <template v-for="item in tableItems">
                        <el-table-column :formatter="item.formatter || toFormatter" v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop" :label="item.label"
                                         :fixed="item.fixed || false" :min-width="item.minWidth || 120" :sortable="item.sortable ? 'custom' : false"
                        />
                    </template>
                    <el-table-column v-for="item in mapTableItems" :prop="item" :key="item" :label="item" min-width="140" />
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData"
                />
            </div>
        </div>
        <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download"/>
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    </div>
</template>
<script>

import ExportForm from '@/components/no_mount/ExportBox/index.vue';
import { excelExport, summaryExcelExport } from '@/api/basicData'
import SuperQuery from '@/components/SuperQuery/index.vue';

export default {
    components: {SuperQuery, ExportForm},
    props: {
        treeTitle: {
            type: String,
            default: "未设置treeTitle"
        },
        methodArr: {
            /*
              数组写法：[
                { label: "原材料分类", classAttribute: "raw_material", method: getcategoryTree, requestObj: { classAttribute: "raw_material" } },
                { label: "半成品分类", classAttribute: "semi_finished", method: getcategoryTree, requestObj: { classAttribute: "semi_finished" } },
                { label: "成品分类", classAttribute: "finish_product", method: getcategoryTree, requestObj: { classAttribute: "finish_product" } },
                { label: "辅料分类", classAttribute: "accessories", method: getcategoryTree, requestObj: { classAttribute: "accessories" } },
                { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
              ]
              对象写法：{ method: getWarehouseList, requestObj: { chooseUserFlag: true } }
            */
        },
        renderTree: {
            type: Boolean,
            default: false
        },
        columnList:{
            type: Array,
            default: ()=>[]
        },
        tableItems: {
            type: Array,
            default: () => [],
            /* [
                {prop:'code',label:'编码'},
                {prop:'name',label:'名称'}
              ] */
        },
        searchList: {
            type: Array,
            default: () => [],
            /* [
               {
                    fieldValue: '',
                    field: 'accountPeriod',
                    label: '账期',
                    prop: 'accountPeriod',
                    symbol: 'like',
                    searchType: 2
                },
              ] */
        },
        /* 列表数据请求方法 */
        listMethod: {
            required: true,
        },
        /* 列表数据请求体 */
        listRequestObj: {
            type: Object | Function,
            required: true,
            /*
              对象写法：{ code: "", name: "", orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
              函数写法：(rowIndex) => {
                let id = this.linesList[rowIndex].id
                return { id, orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }], pageNum: 1, pageSize: 20 }
              }
            */
        },
        superQueryJson: {
            type: Array,
            default: () => [],
            /*
            *  高级查询配置项
            superQueryJson: [
                {
                    prop: 'accountPeriod',
                    label: '账期',
                    type: 'month',
                    valueFormat: 'yyyy-MM'
                },
                {
                    prop: 'balanceState',
                    label: '结存状态',
                    type: 'select',
                    options: [
                        { label: '未结存', value: 'not_finished' },
                        { label: '已结存', value: 'finished' }
                    ]
                },
            ],
            *
            *
            * */
        },
        exportType:{
            type: String,
        },
        exportName:{
            type: String,
        },
        treeNodeClick: {
            type: Function,
            default: (data, node, listQuery) => {
                console.log(data)
                console.log(listQuery)
                if (listQuery.productCategoryId === data.id) return listQuery
                listQuery.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
                listQuery.productCategoryCode = data.hasOwnProperty('code') ? data.code : ""
                listQuery.classAttribute = data.classAttribute
                return listQuery
            }
        },
    },
    name:'wareHouseQuery',
    data() {
        return {
            refreshTree:true,
            tableData: [],
            listLoading: false,
            visible: false,
            listQuery: {},
            total: 0,
            exportFormVisible: false,
            superQueryVisible: false,
            basicQuery: {},
            superQuery: {},
            treeName:this.treeTitle,
            treeLoading: false,
            defaultProps: {
                children: 'childrenList',
                label: 'name'
            },
            treeData: [],
            expands: true,
            totalData:{},
            mapTableItems:[],
        };
    },
    created() {
        this.getData()
        if (localStorage.getItem(`${this.treeName}Flag`)) {
            let locationInventoryFlag = JSON.parse(localStorage.getItem(`${this.treeName}Flag`))
            this.expands = locationInventoryFlag
            this.toggleExpand(locationInventoryFlag)
        }
    },
    computed: {

    },
    methods: {
        sortChange({ prop, order }) {
            let newProp = ''
            console.log(prop)
            let sortArr = [
                {label:'drawingNo',name:'品名规格'},
                {label:'productsCode',name:'产品编码'},
                {label:'productsName',name:'产品名称'},
                {label:'processName',name:'工序名称'},
            ]
            if (['品名规格','产品编码','产品名称','工序名称'].includes(prop)) {
                newProp = sortArr.find(item=>item.name === prop).label
            } else {
                newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
            }
            this.listQuery.orderItems[0].asc = order === 'ascending'
            this.listQuery.orderItems[0].column = order === null ? '' : newProp
            this.initData()
        },
        toFormatter(row, column, cellValue, index) {
            return cellValue
        },
        toggleExpand(expands) {
            this.refreshTree = false
            this.expands = expands
            this.$nextTick(() => {
                this.refreshTree = true
                this.$nextTick(() => {
                    this.$refs.treeBox.setCurrentKey(this.companyId)
                })
            })
        },
        // 设置默认展开
        setexpand(expands) {
            this.refreshTree = false
            this.expands = expands
            this.$nextTick(() => {
                this.refreshTree = true
                localStorage.setItem(`${this.treeName}Flag`, expands)

            })
        },
        handleNodeClick(data, node) {
            this.listQuery = this.treeNodeClick(data, node, this.listQuery)
            this.search('basic')
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        superQuerySearch(query) {
            this.superQuery = query
            this.superQueryVisible = false
            this.search('super')
        },
        columnSetFun() {
            this.$refs.dataTable.showDrawer()
        },
        async getData() {
            this.treeLoading = true
            this.listLoading = true
            if (this.renderTree) {
                const treeRes = await  this.methodArr.method(this.methodArr.requestObj)
                if (Array.isArray(treeRes.data)) { this.treeData = treeRes.data }
                else { this.treeData = treeRes.data.records }
                console.log(this.treeData,'treeData')
                this.treeLoading = false
            }
            this.listQuery = JSON.parse(JSON.stringify(this.listRequestObj))
            this.initData()
        },
        initData() {
            this.visible = false
            Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
            this.listMethod(this.listQuery).then(res => {
                console.log(res)
                const mapArr = ['账期','结存状态','品名规格','产品名称','产品编码','工序名称']
                const legendData =  Object.keys(res.data.records[0]).filter(item=> !mapArr.includes(item))
                this.mapTableItems = legendData
                this.tableData = res.data.records ? res.data.records : []
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading = false
            })
        },
        search(type) {
            // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
            if (type === 'basic') {
                this.basicQuery = {
                    matchLogic: 'AND',
                    condition: this.searchList.filter(item => item.fieldValue).map(item => {
                        this.listQuery.accountPeriod = item.field === 'accountPeriod' ? item.fieldValue : this.listQuery.accountPeriod
                        this.listQuery['projectId'] = item.field === 'projectId' ? item.fieldValue : this.listQuery['projectId']
                        return {
                            ...item,
                            fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                        }
                    })
                }
                this.listQuery.superQuery = this.basicQuery
            }
            if (type === 'super') {
                this.listQuery.superQuery = this.superQuery
            }
            this.initData()
        },
        reset() {
            this.getData()
        },
        // 导出
        exportForm() {
            this.exportFormVisible = true
            let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
            columnList = columnList.map(item => {
                return { label: item.label, prop: item.prop }
            })
            this.$nextTick(() => {
                this.$refs.exportForm.init(columnList)
            })
        },
        download(data) {
            if (data) {
                this.exportFormVisible = false
                let includeFieldMap = {}
                for (let i = 0; i < data.selectKey.length; i++) {
                    includeFieldMap[data.selectKey[i]] = data.selectVal[i]
                }
                console.log(includeFieldMap)
                let _data = {
                    ...this.listQuery,
                    exportType: this.exportType,
                    exportName: this.exportName,
                    includeFieldMap,
                    pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
                    totalRowFlag: true
                }
                summaryExcelExport(_data).then(res => {
                    this.exportFormVisible = false
                    if (!res.data.url) return
                    this.jnpf.downloadFile(res.data.url)
                }).catch(() => {
                })
            }
        },

    },
};

</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped/>
