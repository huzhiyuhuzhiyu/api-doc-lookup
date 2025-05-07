<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="listQuery.productCode" placeholder="产品编码" clearable @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input v-model="listQuery.productDrawingNo" placeholder="品名规格" clearable
                                      @keyup.enter.native="search()" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="4">
                        <el-form-item>
                            <el-select v-model="listQuery.productSource" placeholder="产品来源" clearable style="width: 100%;">
                                <el-option v-for="(item, index) in productSourceList" :key="index" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}
                            </el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
                        </el-form-item>
                    </el-col>
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
                <JNPF-table v-loading="listLoading"
                            :data="tableData"
                            :fixedNO="true"
                            @sort-change="sortChange"
                            custom-column
                            @row-click="rowClick"
                            :row-class-name="'pointer'"
                            ref="dataTable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_455817">
                    <el-table-column prop="code" label="产品编码" min-width="140" sortable="custom">
                        <template slot-scope="scope">
<!--                            <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">-->
                            <el-radio class="square-radio" v-model="radio"  @input="currentChange(scope.row)" :label="scope.row.id">{{ scope.row.code }}</el-radio>
<!--                            </el-link>-->
                        </template>
                    </el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
                    <el-table-column prop="name" label="产品名称" min-width="140" sortable="custom" />

                    <el-table-column prop="productCategoryName" label="产品分类" width="120" />
                    <el-table-column prop="mainUnit" label="主单位" width="120" />
                    <el-table-column prop="productSource" label="产品来源" width="120">
                        <template slot-scope="{ row }">
                            <template v-if="row.productSource == 'produce'">
                                生产
                            </template>
                            <template v-else-if="row.productSource == 'purchase'">
                                采购
                            </template>
                            <template v-else-if="row.productSource == 'out'">
                                外协
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brand" label="品牌" width="120" />
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                            :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
        </div>
        <!-- 高级查询 -->
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />

    </div>
</template>

<script>

import { getProductList} from '@/api/masterDataManagement/productManage'

import SuperQuery from '@/components/SuperQuery/index.vue'
import {
    getbimProductAttributesList,
    getbimProductAttributes,
    getbimProductsModelList
} from '@/api/masterDataManagement'
import { getUnitData } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getCooperativeData } from '@/api/basicData'


export default {
    components: {  SuperQuery },
    name: 'ChooseProduct',
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
    props: {
        chooseRow:{
            type: Object,
            default: null
        },
        chooseValue:{
            type: String,
            default: ''
        },
        productCategoryId: {
            type: String,
            default: ''
        },
        initListQuery: {
            type: Object,
            default() {
                return {
                    code: '',
                    name: '',
                    orderItems: [
                        {
                            asc: false,
                            column: ''
                        },
                        {
                            asc: false,
                            column: 'create_time'
                        }
                    ],
                    pageNum: 1,
                    pageSize: 20,
                    drawingNo: '', // 图号
                    productSource: '', // 产品来源
                    startAndEndTime: [], // 创建时间
                    productCategoryId: '', // 类型id
                    productStatus: '', // 产品状态
                    customerQueryFields: [],
                    createTimeArr: [],
                    classAttribute: 'raw_material'
                }
            }
        },
        productName: {
            type: String,
            default: ''
        },
        busSetId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            quickVisible: false,
            quickForm: {
                code: '',
                drawingNo: '',
                unit: '',
                productCategoryName: '',
                productSource: ''
            },
            codeConfig: {},
            quickRules: {
                code: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
                drawingNo: [{ required: true, message: '请输入品名规格', trigger: 'blur' }],
                unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
                productCategoryName: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
                productSource: [{ required: true, message: '请选择产品来源', trigger: 'change' }]
            },
            productSourceOptions: [
                // { label: '组装', value: 'assemble' },
                { label: '生产', value: 'produce' },
                { label: '采购', value: 'purchase' },
                { label: '外协', value: 'out' }
            ],
            quickRequestObj: {
                classAttribute: this.initListQuery.classAttribute
            },
            filterText: '',
            superQueryVisible: false,
            superQueryJson: [
                {
                    prop: 'code',
                    label: '产品编码',
                    type: 'input'
                },
                {
                    prop: 'drawingNo',
                    label: '品名规格',
                    type: 'input'
                },

                {
                    prop: 'name',
                    label: '产品名称',
                    type: 'input'
                },
                {
                    prop: 'productCategoryName',
                    label: '产品分类',
                    type: 'input'
                },
                {
                    prop: 'mainUnit',
                    label: '主单位',
                    type: 'select'
                },
                {
                    prop: 'productSource',
                    label: '产品来源',
                    type: 'select',
                    options: [
                        { label: '生产', value: 'produce' },
                        { label: '采购', value: 'purchase' },
                        { label: '外协', value: 'out' }
                    ]
                },
                {
                    prop: 'productStatus',
                    label: '产品状态',
                    type: 'select',
                    options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }]
                },
                {
                    prop: 'brand',
                    label: '品牌',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'model',
                    label: '型号',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'sealingCoverStructure',
                    label: '密封盖-结构',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'sealingCoverTyping',
                    label: '密封盖-打字',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'structureType',
                    label: '结构类型',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'clearance',
                    label: '游隙',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'steelBallManufacturer',
                    label: '钢球厂家',
                    type: 'select',
                    options: []
                },

                {
                    prop: 'oil',
                    label: '油脂',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'oilQuantity',
                    label: '油脂量',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'noise',
                    label: '噪音',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'holder',
                    label: '保持架',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'accuracyLevel',
                    label: '精度等级',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'vibrationLevel',
                    label: '振动等级',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'colour',
                    label: '颜色',
                    type: 'select',
                    options: []
                },
                {
                    prop: 'aperture',
                    label: '孔径',
                    type: 'select',
                    options: []
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
                }
            ],
            columnList: ['remark', 'createTime', 'createByName'],
            exportFormVisible: false,
            title: '更多查询',
            background: true, //分页器背景颜色
            treeData: [],
            tableData: [],
            treeLoading: false,
            listLoading: false,
            loadingText: false,
            listQuery: {},
            productStatusList: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }], // 产品状态
            productSourceList: [
                { label: '生产', value: 'produce' },
                { label: '采购', value: 'purchase' },
                { label: '外协', value: 'out' }
            ], // 产品来源
            total: 0,
            formVisible: false,
            expands: true,
            refreshTree: true,
            defaultProps: {
                children: 'childrenList',
                label: 'name'
            },
            uploadVisib: false,
            leftFlag: false,
            unitOptions: []
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
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
        this.listQuery.productCategoryId = this.productCategoryId
        this.listQuery.classAttribute = ''

        this.initData()

    },

    methods: {
        rowClick(row){
            this.radio = row.id
            this.currentChange(row)
        },
        currentChange(row){
            this.currentRow = row
        },



        superQuerySearch(query) {
            this.listQuery.superQuery = query
            this.superQueryVisible = false
            this.search()
        },
        // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
        getProductClassFun() {
            let obj1 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa007',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }

            getbimProductAttributesList(obj1).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverTyping')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj2 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa006',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }

            getbimProductAttributesList(obj2).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'accuracyLevel')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj3 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa005',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj3).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'vibrationLevel')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj4 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa002',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj4).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'oil')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj5 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa003',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj5).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'oilQuantity')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj6 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa001',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }

            getbimProductAttributesList(obj6).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'clearance')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj7 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa015',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj7).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let oilObj = this.superQueryJson.find((item) => item.prop === 'packagingMethod')

                if (oilObj) {
                    // 将options赋值为5
                    oilObj.options = arr
                }
            })
            let obj8 = {
                pageNum: 1,
                pageSize: 100
            }
            getUnitData(obj8).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                this.unitOptions = arr
                // let oilObj = this.superQueryJson.find((item) => item.prop === 'mainUnit')
                this.superQueryJson.forEach((tc) => {
                    if (tc.prop === 'mainUnit') {
                        tc.options = arr
                    }
                })
            })
            let obj9 = {
                pageNum: -1,
                pageSize: 20
            }
            getbimProductsModelList(obj9).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.model,
                        value: item.model
                    }
                    arr.push(obj)
                })
                let modelObj = this.superQueryJson.find((item) => item.prop === 'model')

                if (modelObj) {
                    // 将options赋值为5
                    modelObj.options = arr
                }
            })

            let obj10 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa011',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj10).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let brandObj = this.superQueryJson.find((item) => item.prop === 'brand')

                if (brandObj) {
                    // 将options赋值为5
                    brandObj.options = arr
                }
            })

            let obj11 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa013',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj11).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let tcObj = this.superQueryJson.find((item) => item.prop === 'structureType')

                if (tcObj) {
                    // 将options赋值为5
                    tcObj.options = arr
                }
            })
            let obj12 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa012',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj12).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let tcObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverStructure')

                if (tcObj) {
                    // 将options赋值为5
                    tcObj.options = arr
                }
            })
            let obj13 = {
                pageNum: -1,
                pageSize: 20,
                type: 'supplier'
            }
            getCooperativeData(obj13).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.id
                    }
                    arr.push(obj)
                })
                let tcObj = this.superQueryJson.find((item) => item.prop === 'steelBallManufacturer')

                if (tcObj) {
                    // 将options赋值为5
                    tcObj.options = arr
                }
            })
            let obj14 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa014',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj14).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let tcObj = this.superQueryJson.find((item) => item.prop === 'noise')

                if (tcObj) {
                    // 将options赋值为5
                    tcObj.options = arr
                }
            })
            let obj15 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa004',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj15).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let tcObj = this.superQueryJson.find((item) => item.prop === 'holder')

                if (tcObj) {
                    // 将options赋值为5
                    tcObj.options = arr
                }
            })

            let obj16 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa010',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj16).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let tcObj = this.superQueryJson.find((item) => item.prop === 'colour')

                if (tcObj) {
                    // 将options赋值为5
                    tcObj.options = arr
                }
            })

            let obj17 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa009',
                orderItems: [
                    {
                        asc: false,
                        column: ''
                    },
                    {
                        asc: false,
                        column: 'code'
                    }
                ]
            }
            getbimProductAttributesList(obj17).then((res) => {
                let arr = []
                res.data.records.forEach((item) => {
                    let obj = {
                        label: item.name,
                        value: item.name
                    }
                    arr.push(obj)
                })
                let tcObj = this.superQueryJson.find((item) => item.prop === 'aperture')

                if (tcObj) {
                    // 将options赋值为5
                    tcObj.options = arr
                }
            })

            // 获取税率(数据字典)
            getbimProductAttributes('585438081021126405').then((res) => {
                res.data.list.forEach((item) => {
                    item.taxRate = item.enCode.replace('%', '') * 1
                })
                this.taxRateList = res.data.list
            })
        },

        columnSetFun() {
            this.$refs.dataTable.showDrawer()
        },

        sortChange({ prop, order }) {
            const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
            this.listQuery.orderItems[0].asc = order === 'ascending'
            this.listQuery.orderItems[0].column = order === null ? '' : newProp
            this.initData()
        },


        initData() {
            this.listLoading = true
            Object.keys(this.listQuery).forEach((key) => {
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            // this.listQuery.pageNum = 1
            this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
            getProductList(this.listQuery)
                .then((res) => {
                    this.tableData = res.data.records
                    this.total = res.data.total
                    this.listLoading = false

                })
                .catch(() => {
                    this.listLoading = false
                })
        },
        search() {
            this.initData()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
            this.$refs.SuperQuery.conditionList = []
            this.filterText = ''
            this.search()
        },

    }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
.custom_title {
    line-height: 24px;
    font-size: 18px;
    color: #303133;
    margin-left: -12px;
}

.required {
    color: red;
    margin-left: 4px;
}

::v-deep .el-dialog__body {
    padding: 0px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
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
