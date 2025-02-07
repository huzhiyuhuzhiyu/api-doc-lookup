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

                    <template v-for="item in domSearchList">
                        <el-col :span="4" :key="item.prop" v-if="item.hasOwnProperty('render') ? item.render : true">
                            <el-form-item>
                                <el-input v-if="item.searchType === 1" v-model="item.fieldValue"
                                          :placeholder="'请输入' + item.label"
                                          :clearable="item.hasOwnProperty('clearable') ? item.clearable : true" @keyup.enter.native="search('basic')"
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
                                <el-date-picker v-else-if="item.searchType === 5" v-model="item.fieldValue" type="daterange"
                                                value-format="yyyy-MM-dd" style="width: 100%;" :clearable="false"
                                                popper-class="date_form" start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                @change="search('basic')"
                                />
                                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue"
                                           :placeholder="'请选择' + item.label" :disabled="item.disabled"
                                           :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
                                >
                                    <el-option v-for="(item2, index2) in item.options" :key="index2"
                                               :label="item2.label"
                                               :value="item2.value"
                                    ></el-option>
                                </el-select>
                                <el-autocomplete v-else-if="item.searchType === 6" v-model="item.fieldValue"
                                :fetch-suggestions="((queryString,cb)=>{querySearchAsync(queryString,cb,item)})" :placeholder="'请选择' + item.label" 
                                     prefix-icon="el-icon-search"></el-autocomplete>
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
                        <el-tooltip content="高级查询" placement="top" v-if="needSuperQuery">
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
                <JNPF-table  v-if="tableItems.length" @sort-change="sortChange" :show-summary="renderSummary" :summary-method="getSummaries" ref="dataTable" v-loading="listLoading" :data="tableData" fixedNO custom-column :setColumnDisplayList="columnList">
                    <template v-for="item in tableItems">
                        <template v-if="['abrasive','oil','accessory','turnoverBox','total'].includes(item.prop)">
                            <el-table-column :formatter="item.formatter || toFormatter" v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop" :label="item.label"
                                             :fixed="item.fixed || false" :min-width="item.minWidth || 120" :sortable="item.sortable ? 'custom' : false" >
                                <template slot-scope="scope">
                                    <el-link type="primary" @click.native="goDetail(scope.row,item.prop)">
                                        {{ scope.row[item.prop] }}
                                    </el-link>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-else>
                            <el-table-column :formatter="item.formatter || toFormatter" v-if="item.hasOwnProperty('render') ? item.render : true" :key="item.prop" :prop="item.prop" :label="item.label"
                                             :fixed="item.fixed || false" :min-width="item.minWidth || 120" :sortable="item.sortable ? 'custom' : false"
                            />
                        </template>
                    </template>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData"
                />
            </div>
        </div>
        <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download"/>
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />
        <ReportLineTable ref="ReportLineTable" @closeLine="closeLine" v-if="reportLineVisible" :superQueryJson="lineSuperQueryJson"   :list-request-obj="lineListRequestObj" :list-method="lineEdgeLineReport" :tableItems="lineTableItems" :searchList="lineSearchList" :exportType="lineExportType" :export-name="lineExportName"></ReportLineTable>
    </div>
</template>
<script>

import ExportForm from '@/components/no_mount/ExportBox/index.vue';
import {excelExport} from '@/api/basicData';
import SuperQuery from '@/components/SuperQuery/index.vue';
import ReportLineTable from '@/components/no_mount/ReportLineTable/index.vue';
import { lineEdgeLineReport } from '@/api/balances'
export default {
    name:'ReportTypeTable',
    components: {SuperQuery, ExportForm,ReportLineTable},
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
        needSuperQuery:{
            type:Boolean,
            default:true
        },
        isProductNameSwitch:{
            type: String,
            default: ""
        },
        renderSummary:{
            type:Boolean,
            default:true
        },
         /* 列表数据请求方法 */
         queryRequestMethon: {
            required: true,
        },
    },
    data() {
        return {
            lineEdgeLineReport,
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
            reportLineVisible:false,
            domSearchList:[],
            lineSuperQueryJson:[],
            lineListRequestObj:{},
            lineTableItems:[],
            lineSearchList:[],
            lineExportType:'1235',
            lineExportName:'',
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
        querySearchAsync(queryString, cb, item) {
            console.log(item,'item')
            console.log(queryString,'q')
            console.log(cb,'cn')
            console.log(this.queryRequestMethon)
      // if (!this.dataForm.cooperativePartnerId) {
      //   let air = []
      //   cb(air)
      //   this.$message.error("请先选择客户!")
      // } else {
      if (queryString && queryString.length >= 3) {
        item.queryRequestObj.productDrawingNo = queryString
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.queryRequestMethon(item.queryRequestObj).then(res => {
            let datas = res.data.records
            if (datas !== []) {
              var restaurants = datas
              var arr = []
              restaurants.forEach((item, index) => {
                arr.push({
                  value: item.drawingNo,
                  data: item,
                })
              })
              cb(arr)
            } else {
              let air = []
              this.$message.error("您输入的品名规格暂未匹配到对应的产品数据，请重新输入!")
              queryString = ""
              cb(air)
            }
          })
            .catch(res => {
              this.$message({
                type: 'error',
                message: '获取数据失败'
              })
            })
        }, 500)
      } else {
        let air = []
        cb(air)
      }
      // }
    },
        sortChange({ prop, order }) {
            let newProp = ''
            console.log(prop)
            if (['productsDrawingNo','productsCode','productsName','warehouseName','partnerName','costPrice','processName','warehouseCode'].includes(prop)) {
                newProp = prop
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
        // 总计处理
        getSummaries(param) {
            return param.columns.map((column, index) => {
                if (index === 0) return '总计'
                if (!column.property) return ''
                return this.totalData[column.property]
            })
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
            this.domSearchList = JSON.parse(JSON.stringify(this.searchList))
            this.initData()
        },
        initData() {
            this.visible = false
            this.listLoading = true
            Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.jnpf.searchDateFormat(this.listQuery, 'orderDate', 'startDate', 'endDate')
            this.jnpf.searchDateFormat(this.listQuery, 'orderDate', 'orderStartDate', 'orderEndDate')
            this.listMethod(this.listQuery).then(res => {
                this.tableData = res.data.page ? res.data.page.records : res.data.list ? res.data.list : []
                this.totalData = res.data.total || {}
                // 合计 以后用到放开即可
                // res.data.total ? this.totalList.push(res.data.total) : ''
                this.total = res.data.page ? res.data.page.total : 0
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
                    condition: this.domSearchList.filter(item => item.fieldValue).map(item => {
                        this.listQuery[item.field] = item.fieldValue
                        this.listQuery['accountPeriod'] = item.field === 'accountPeriod' ? item.fieldValue : this.listQuery['accountPeriod']
                        this.listQuery['projectId'] = item.field === 'projectId' ? item.fieldValue : this.listQuery['projectId']
                        this.listQuery['month'] = item.field === 'month' ? item.fieldValue : this.listQuery['month']
                        this.listQuery['orderDate'] = item.prop === 'orderDate' ? item.fieldValue : []
                        return {
                            ...item,
                            fieldValue: item.hasOwnProperty('noNeedSuper') ? '' : Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
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
                excelExport(_data).then(res => {
                    this.exportFormVisible = false
                    if (!res.data.url) return
                    this.jnpf.downloadFile(res.data.url)
                }).catch(() => {
                })
            }
        },
        goDetail(row,classType){
            this.lineListRequestObj = {
                classType:classType === 'total' ? '' : classType === 'turnoverBox' ? 'turnover_box' : classType,
                warehouseId:row.warehouseId,
                orderStartDate:this.listQuery.orderStartDate,
                orderEndDate:this.listQuery.orderEndDate,
                totalRowFlag:false,
                pageSize:20,
                pageNum:1,
            }
            this.lineExportName = row.warehouseName + '领用明细'
            this.lineTableItems = [
                {prop:"productCode", label:"产品编码",minWidth:160},
                {prop:"productName", label:"产品名称",minWidth:160 ,render:this.isProductNameSwitch === '1'},
                {prop:"drawingNo", label:"品名规格",minWidth:160},
                {prop:"num", label:"出库数量",minWidth:160},
                {prop:"mainUnit", label:"单位",minWidth:120},
                {prop:"totalAmount", label:"出库金额",minWidth:160},
                {prop:"classType", label:"类别",minWidth:160,formatter:this.formatterClassType},
            ]
            this.lineSuperQueryJson = [
                {
                    prop: 'drawingNo',
                    label: '品名规格',
                    type: 'input',
                },
                {
                    prop: 'productCode',
                    label: '产品编码',
                    type: 'input',
                },
                {
                    prop: 'productName',
                    label: '产品名称',
                    type: 'input',
                },
            ]
            this.reportLineVisible = true
        },
        closeLine(){
            this.reportLineVisible = false
            this.getData()
        },
        formatterClassType(row){
            let arr = [
                { label: '磨料', value: 'abrasive' },
                { label: '油料', value: 'oil' },
                { label: '配件', value: 'accessory' },
                { label: '周转箱', value: 'turnover_box' },
            ]
            return arr.find(item=>item.value === row.classType).label
        },

    },
};

</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped/>
