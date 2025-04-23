<template>
    <div class="JNPF-common-layout">

        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-alert
                title="仅在此步骤中，点击已选中的行可取消选中，您可直接跳过此步骤，直接上传文件"
                type="info"
                center
                show-icon>
            </el-alert>
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <template v-for="item in searchList">
                        <el-col :span="item.searchType === 3 ? 6 : 4">
                            <el-form-item>
                                <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                                          @keyup.enter.native="search('basic')" />

                                <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                                           clearable>
                                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                                               :value="item2.value"></el-option>
                                </el-select>
                                <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                                                :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                                                :type="item.dateType"
                                                :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </template>
                    <el-col :span="4">
                        <el-form-item>
                            <el-select v-model="listQuery.processingType" placeholder="加工类别" clearable>
                                <el-option v-for="item in processingTypeOptions" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">{{
                                    $t("common.search")
                                }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}</el-button>
                        </el-form-item>
                    </el-col>
                    <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="moreQueries()">更多查询</el-button> -->
                </el-form>
            </el-row>

            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head" style="padding:8px">
                    <div></div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip content="高级查询" placement="top" v-if="true">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                     @click="superQueryVisible = true" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table
                    @row-click="rowClick"
                    :row-class-name="'pointer'"
                    v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
                            :hasNO="true" ref="listTable" :setColumnDisplayList="columnList">
                    <el-table-column prop="code" label="工序编码" width="180" sortable="custom">
                        <template slot-scope="scope">
                            <el-radio class="square-radio" @input="currentChange(scope.row,scope.row.id)" :label="scope.row.id" v-model="radio" >
                                {{scope.row.code}}
                            </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="工序名称" min-width="180" sortable="custom" />
                    <el-table-column prop="productCategoryIdText" label="工序分类" min-width="180" sortable="custom" />
                    <el-table-column prop="unitPrice" label="正品单价" min-width="180" />
                    <el-table-column prop="rejectUnitPrice" label="次品单价" min-width="180" />
                    <el-table-column prop="scrapUnitPrice" label="废品单价" min-width="120" />
                    <el-table-column prop="pricingTypeName" label="计价类型" width="180"> </el-table-column>
                    <el-table-column prop="timePrice" label="计时单价" min-width="120"></el-table-column>
                    <el-table-column prop="processingType" label="加工类型" width="120" sortable="custom">
                        <template slot-scope="scope">
                            <div v-if="scope.row.processingType == 'self_produced'">自制</div>
                            <div v-if="scope.row.processingType == 'external_production'">外协</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="processType" label="工序类型" width="120" sortable="custom">
                        <template slot-scope="scope">
                          <div v-if="scope.row.processType == 'normal'">正常工序</div>
                <div v-if="scope.row.processType == 'vibrate'">测振工序</div>
                <div v-if="scope.row.processType == 'heat_treatment'">热工工序</div>
                <div v-if="scope.row.processType == 'packing'">包装工序</div>
                <div v-if="scope.row.processType == 'pairs'">配对工序</div>
                <div v-if="scope.row.processType == 'typing'">打字工序</div>
                <div v-if="scope.row.processType == 'fatInjection'">注脂工序</div>
                <div v-if="scope.row.processType == 'grinding'">磨孔工序</div>
                <div v-if="scope.row.processType == 'accuracy'">精度工序</div>
                <div v-if="scope.row.processType == 'boxing'">装盒工序</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="180" />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                    <el-table-column prop="remark" label="备注" width="130" />

                </JNPF-table>
                <pagination :total="total" :page.sync="superForm.pageNum" :limit.sync="superForm.pageSize"
                            @pagination="initData" />
            </div>
        </div>

        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />
        <!-- <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" /> -->
    </div>
</template>

<script>
import { getBimProcessList, deleteBimProcess } from '@/api/bimProcess'
import { getcategoryTree } from '@/api/basicData/materialSettings'

import { excelExport } from '@/api/basicData'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
    getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement";
export default {
    name:'ChooseProcess',
    components: {   SuperQuery },
    data() {
        return {
            searchList: [
                { field: 'code', fieldValue: '', label: '工序编码', symbol: 'like', searchType: 1, width: 120 },
                { field: 'name', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },

            ],
            superForm: {},
            basicQuery: {},
            superQuery: {},
            filterText: '',
            superQueryVisible: false,
            superQueryJson: [
                {
                    prop: 'code',
                    label: '工序编码',
                    type: 'input'
                },
                {
                    prop: 'name',
                    label: '工序名称',
                    type: 'input'
                },
                {
                    prop: 'productCategoryIdText',
                    label: '工序分类',
                    type: 'input'
                },
                {
                    prop: 'unitPrice',
                    label: '正品单价',
                    type: 'input'
                },
                {
                    prop: 'scrapUnitPrice',
                    label: '次品单价',
                    type: 'input'
                },
                {
                    prop: 'timePrice',
                    label: '计时单价',
                    type: 'input'
                },
                {
                    prop: 'pricingTypeName',
                    label: '计价类型',
                    type: 'input'
                },

                {
                    prop: 'processingType',
                    label: '加工类型',
                    type: 'select',
                    options: [{ label: '自制', value: 'self_produced' }, { label: '外协', value: 'external_production' }]
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    type: 'daterange',
                    valueFormat: 'yyyy-MM-dd HH:mm:ss',
                    startPlaceholder: '开始日期',
                    endPlaceholder: '结束日期',
                    pickerOptions: this.global.timePickerOptions
                },
                {
                    prop: 'createByName',
                    label: '创建人',
                    type: 'input'
                },
                {
                    prop: 'remark',
                    label: '备注',
                    type: 'input'
                },
            ],
            visible: false,
            tableData: [],
            treeData: [],
            listLoading: false,
            listQuery: {
                name: "",
                code: "",
                processingType: "",
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                pageNum: 1,
                pageSize: 20,
                productCategoryId: '',
            },
            expands: true,
            refreshTree: true,
            total: 0,

            defaultProps: {
                children: 'childrenList',
                label: 'name'
            },
            processingTypeOptions: [
                { label: "全部", value: "" },
                { label: "自制", value: "self_produced" },
                { label: "外协", value: "external_production" },
            ],
            // 业务类型
            businessOptions: [
                { fullName: "原材料", enCode: "raw_material" },
                { fullName: "半成品", enCode: "semi_finished" },
                { fullName: "成品", enCode: "finish_product" },
                { fullName: "辅料", enCode: "accessories" },
                { fullName: "其他 ", enCode: "other" }
            ],
            columnList: ['unitPrice', 'createByName', 'rejectUnitPrice', 'scrapUnitPrice', 'createTime'],
            leftFlag: false,
        }
    },
    props:{
        chooseValue:{
            type: String,
            default: ''
        },
        chooseRow:{
            type: Object,
            default: null
        }
    },
    model:{
        prop: 'chooseValue',
        event: 'update:chooseValue'
    },
    computed:{
        radio:{
            get(){
                return this.chooseValue
            },
            set(val){
                this.$emit('update:chooseValue', val)
            }
        },
        currentRow:{
            get(){
                return this.chooseRow
            },
            set(val){
                this.$emit('update:chooseRow', val)
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.treeBox.filter(val)
        }
    },
    mounted() {
        this.getProductClassFun()
    },
    created() {
        this.superForm = this.listQuery
        this.initData()
        this.getBusinessOptions()
    },
    methods: {
        rowClick(row){
            if(this.radio === row.id) {
                this.radio = ''
                this.currentRow = null
                return
            }
            this.radio = row.id
            this.currentChange(row,row.id)
        },
        currentChange(row ,id){
            //非必填项重复点击可以取消选中
            if(this.currentRow === row){
                this.currentRow = null
                this.radio = ''
                return
            }
            this.currentRow = row
        },
        getCurrentRow(){
            return this.currentRow
        },

        superQuerySearch(query) {
            this.superQuery = query
            this.superQueryVisible = false
            this.search('super')
        },
        // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
        getProductClassFun() {

            let obj1 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: "pa007",
                orderItems: [
                    {
                        asc: false,
                        column: "",
                    },
                    {
                        asc: false,
                        column: "code",
                    },
                ],
            };

            getbimProductAttributesList(obj1).then(res => {

                let arr = []
                res.data.records.forEach(item => {
                    let obj = {
                        label: item.name,
                        value: item.name,
                    }
                    arr.push(obj)
                });
                let oilObj = this.superQueryJson.find(item => item.prop === 'sealingCoverTyping');

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr;
                }
            })
            let obj2 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: "pa006",
                orderItems: [
                    {
                        asc: false,
                        column: "",
                    },
                    {
                        asc: false,
                        column: "code",
                    },
                ],
            };


            getbimProductAttributesList(obj2).then(res => {
                let arr = []
                res.data.records.forEach(item => {
                    let obj = {
                        label: item.name,
                        value: item.name,
                    }
                    arr.push(obj)
                });
                let oilObj = this.superQueryJson.find(item => item.prop === 'accuracyLevel');

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr;
                }
            })
            let obj3 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: "pa005",
                orderItems: [
                    {
                        asc: false,
                        column: "",
                    },
                    {
                        asc: false,
                        column: "code",
                    },
                ],
            };
            getbimProductAttributesList(obj3).then(res => {

                let arr = []
                res.data.records.forEach(item => {
                    let obj = {
                        label: item.name,
                        value: item.name,
                    }
                    arr.push(obj)
                });
                let oilObj = this.superQueryJson.find(item => item.prop === 'vibrationLevel');

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr;
                }
            })
            let obj4 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: "pa002",
                orderItems: [
                    {
                        asc: false,
                        column: "",
                    },
                    {
                        asc: false,
                        column: "code",
                    },
                ],
            };
            getbimProductAttributesList(obj4).then(res => {



                let arr = []
                res.data.records.forEach(item => {
                    let obj = {
                        label: item.name,
                        value: item.name,
                    }
                    arr.push(obj)
                });
                let oilObj = this.superQueryJson.find(item => item.prop === 'oil');

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr;
                }
            })
            let obj5 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: "pa003",
                orderItems: [
                    {
                        asc: false,
                        column: "",
                    },
                    {
                        asc: false,
                        column: "code",
                    },
                ],
            };
            getbimProductAttributesList(obj5).then(res => {
                let arr = []
                res.data.records.forEach(item => {
                    let obj = {
                        label: item.name,
                        value: item.name,
                    }
                    arr.push(obj)
                });
                let oilObj = this.superQueryJson.find(item => item.prop === 'oilQuantity');

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr;
                }
            })
            let obj6 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: "pa001",
                orderItems: [
                    {
                        asc: false,
                        column: "",
                    },
                    {
                        asc: false,
                        column: "code",
                    },
                ],
            };

            getbimProductAttributesList(obj6).then(res => {
                let arr = []
                res.data.records.forEach(item => {
                    let obj = {
                        label: item.name,
                        value: item.name,
                    }
                    arr.push(obj)
                });
                let oilObj = this.superQueryJson.find(item => item.prop === 'clearance');

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr;
                }
            })
            let obj7 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: "pa015",
                orderItems: [
                    {
                        asc: false,
                        column: "",
                    },
                    {
                        asc: false,
                        column: "code",
                    },
                ],
            };
            getbimProductAttributesList(obj7).then(res => {
                let arr = []
                res.data.records.forEach(item => {
                    let obj = {
                        label: item.name,
                        value: item.name,
                    }
                    arr.push(obj)
                });
                let oilObj = this.superQueryJson.find(item => item.prop === 'packagingMethod');

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr;
                }
            })


            // 获取税率(数据字典)
            getbimProductAttributes("585438081021126405").then(res => {
                res.data.list.forEach(item => {
                    item.taxRate = item.enCode.replace('%', '') * 1
                })
                this.taxRateList = res.data.list
                console.log("税率", this.taxRateList);
            })

        },
        changeLeft() {
            this.leftFlag = !this.leftFlag
        },
        sortChange({ prop, order }) {
            let newProp = ""
            if (prop == 'steelBall' || prop == "outerCircle" || prop == "innerCircle" || prop == "createByName") {
                newProp = prop
            } else {
                newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());

            }
            this.listQuery.orderItems[0].asc = order === "ascending";
            this.listQuery.orderItems[0].column = order === null ? "" : newProp;
            this.initData();
        },
        columnSetFun() {
            console.log("this.$refs.dataTable", this.$refs.dataTable);
            this.$refs.listTable.showDrawer()
        },

        // 获取业务类型
        getBusinessOptions() {
            // getDictionaryDataList("430351197057058245").then(res => {
            //   this.businessOptions = res.data.list
            // })
            this.businessOptions = [
                { fullName: "原材料", enCode: "raw_material" },
                { fullName: "半成品", enCode: "semi_finished" },
                { fullName: "成品", enCode: "finish_product" },
                { fullName: "辅料", enCode: "accessories" },
                { fullName: "其他 ", enCode: "other" }
            ]
        },
        sortChange({ prop, order }) {
            console.log(order);
            let newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase())
            this.listQuery.orderItems[0].asc = order === "ascending"
            if (newProp === "class_attribute_text") { newProp = "baa.class_attribute" }
            if (newProp === "product_category_id_text") { newProp = "productCategoryIdText" }
            // this.listQuery.orderItems[0].column = newProp
            this.listQuery.orderItems[0].column = order === null ? "" : newProp
            this.initData()
        },
        initData() {
            this.listLoading = true
            getBimProcessList(this.superForm)
                .then((res) => {
                    console.log(res);
                    this.tableData = res.data.records
                    this.total = res.data.total
                    this.listLoading = false
                })
                .catch(() => {
                    this.listLoading = false
                })
        },
        search(type) {
            Object.keys(this.listQuery).forEach(key => {
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.listQuery.pageNum = 1
            // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
            if (type === 'basic') {
                this.basicQuery = {
                    matchLogic: 'AND',
                    condition: this.searchList
                        .filter((item) => item.fieldValue)
                        .map((item) => {
                            return {
                                ...item,
                                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                            }
                        })
                }
                this.superForm.superQuery = this.basicQuery
                this.superForm.processingType = this.listQuery.processingType
            }
            if (type === 'super') {
                this.superForm.superQuery = this.superQuery
            }
            this.initData()
        },


        reset() {
            this.$refs['listTable'].$refs.JNPFTable.clearSort()
            this.listQuery = {
                name: "",
                code: "",
                processingType: "",
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                pageNum: 1,
                pageSize: 20,
                productCategoryId: '',
            }
            this.searchList = [
                { field: 'code', fieldValue: '', label: '工序编码', symbol: 'like', searchType: 1, width: 120 },
                { field: 'name', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },

            ]
            this.superForm = JSON.parse(JSON.stringify(this.listQuery))
            this.$refs.SuperQuery.conditionList = []
            this.filterText = ''
            this.getcategoryTree()
            // this.initData()
        },
        addOrUpdateHandle(id, type) {
            console.log("132,", id, type);
            this.formVisible = true
            this.$nextTick(() => {
                this.$refs.JNPFForm.init(id, type)
            })
        },
        handleDel(id) {
            this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
                type: "warning",
            })
                .then(() => {
                    deleteBimProcess(id).then((res) => {
                        this.$message({
                            type: "success",
                            message: "删除成功",
                            duration: 1500,
                            onClose: () => {
                                this.initData()
                            },
                        })
                    })
                })
                .catch(() => { })
        },
    },
}
</script>
<style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

::v-deep .el-tabs__header {
    margin-bottom: 5px;
    padding: 0 10px;
}

.JNPF-common-search-box {
    padding: 8px 0 0 0;
    margin-left: 0 !important;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 8px !important;
}

.pagination-container {
    background-color: #f5f7fa;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
    padding: 0;
}

::v-deep.el-tree-node__content {
    height: 30px;
    line-height: 30px;
}

.JNPF-common-el-tree {
    margin: 5px 0;
}
.square-radio ::v-deep .el-radio__inner {
    border-radius: 0; /* 将圆角设置为0，实现方框效果 */
}

.square-radio ::v-deep .el-radio__input.is-checked .el-radio__inner::after {
    content: "";
    width: 10px;
    height: 5px;
    border: 2px solid white;
    border-top: transparent;
    border-right: transparent;
    text-align: center;
    display: inline-block;
    position: absolute;
    top: 2px;
    left: 1px;
    vertical-align: middle;
    transform: rotate(-45deg);
    border-radius: 0px;
    background: none;
}
</style>
