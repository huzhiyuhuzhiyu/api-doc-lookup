

<template>
    <ReportTypeTable :need-super-query="false" :superQueryJson="superQueryJson" v-loading="!indexFlag" v-if="indexFlag" :list-request-obj="listRequestObj" :list-method="balanceQueryReport" :tableItems="tableItems" :searchList="searchList" :exportType="exportType" :export-name="exportName" />
</template>

<script>
import ReportTypeTable from '@/components/no_mount/ReportTypeTable/index.vue';
import {getcategoryTree} from '@/api/basicData/materialSettings';
import { balanceQueryReport, canStockBalance } from '@/api/balances'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
export default {
    name: 'innerOuterRingDifferencesReport',
    components: {ReportTypeTable},
    mixins:[AbProjectMixin],
    data(){
        return {
            balanceQueryReport,
            listRequestObj:{
                accountPeriod: '',
                classAttribute: "",
                createByName: "",
                drawingNo: "",
                endTime: "",
                endUpdateTime: "",
                keyword: "",
                orderEndDate: "",
                orderItems: [{
                    asc: false,
                    column: ''
                }, {
                    asc: false,
                    column: '',
                }],
                orderStartDate: "",
                pageNum: 1,
                pageSize: 20,
                productCategoryId: '',
                productsCode: "",
                productsName: "",
                projectId: '',
                startTime: "",
                startUpdateTime: "",
                superQuery: {},
                totalRowFlag: false,
                warehouseCode: "",
                warehouseName: ""
            },
            tableItems:[],
            columnList:['productsCode','warehouseCode'],
            searchList:[],
            superQueryJson:[],
            exportType:'1232',
            exportName:'结存查询',
            isProductNameSwitch:'',
            accountPeriod:'',
            indexFlag:false,
            defaultProjectId:''
        }
    },
    async created() {
        await this.awaitAbProject()
        this.defaultProjectId = this.abProjectNoCommonList.find(item=>item.value === this.abProjectId) ? this.abProjectId : this.abProjectNoCommonList[0].id
        console.log(this.abProjectId,'this.defaultProjectId')
        this.listRequestObj.projectId = this.defaultProjectId
        await this.getProductNameSwitch('product', 'enable_productName')
        this.setTableItems()
        this.setSuperQueryJson()
        this.setSearchList()
        this.indexFlag = true
    },
    methods: {
        async getProductNameSwitch(code, type) {
            try {
                this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
            } catch (error) { }
        },
        setTableItems(){
            this.tableItems = [
                {prop:"accountPeriod", label:"外圈01",minWidth:160,sortable:'custom'},
                {prop:"drawingNo", label:'单位01',minWidth:160,},
                {prop:"productsName", label:'原材料01',minWidth:140,sortable:'custom'},
                {prop:"productsCode", label:'委外01',minWidth:140,sortable:'custom'},
                {prop:"processName", label:'磨工01',minWidth:140,sortable:'custom'},
                {prop:"warehouseName", label:'装配01',minWidth:140,sortable:'custom'},
                {prop:"warehouseCode", label:'待装区01',minWidth:140,sortable:'custom'},
                {prop:"mainUnit", label:'热处理01',minWidth:120,sortable:'custom'},
                {prop:"initInventoryQuantity", label:'报废01',minWidth:120,sortable:'custom'},
                {prop:"inboundQuantity", label:'总计01',minWidth:120,sortable:'custom'},
                {prop:"outboundQuantity", label:'内圈02',minWidth:120,sortable:'custom'},
                {prop:"drawingNo", label:'单位02',minWidth:160,},
                {prop:"productsName", label:'原材料02',minWidth:140,sortable:'custom'},
                {prop:"productsCode", label:'委外02',minWidth:140,sortable:'custom'},
                {prop:"processName", label:'磨工02',minWidth:140,sortable:'custom'},
                {prop:"warehouseName", label:'装配02',minWidth:140,sortable:'custom'},
                {prop:"warehouseCode", label:'待装区02',minWidth:140,sortable:'custom'},
                {prop:"mainUnit", label:'热处理02',minWidth:120,sortable:'custom'},
                {prop:"initInventoryQuantity", label:'报废02',minWidth:120,sortable:'custom'},
                {prop:"inboundQuantity", label:'总计02',minWidth:120,sortable:'custom'},
                {prop:"initInventoryQuantity", label:'磨工01/02差额',minWidth:120,sortable:'custom'},
                {prop:"initInventoryQuantity", label:'装配01/02差额',minWidth:120,sortable:'custom'},
                {prop:"initInventoryQuantity", label:'汇总01/02差额',minWidth:120,sortable:'custom'},
            ]
        },
        setSuperQueryJson(){
            this.superQueryJson = [
                {
                    prop: 'accountPeriod',
                    label: '账期',
                    type: 'month',
                    valueFormat: 'yyyy-MM',
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
                {
                    prop: 'drawingNo',
                    label: '品名规格',
                    type: 'input',
                },
                {
                    prop: 'productsName',
                    label: '产品名称',
                    type: 'input',
                    render:this.isProductNameSwitch === '1'
                },
                {
                    prop: 'productsCode',
                    label: '产品编码',
                    type: 'input'
                },
                {
                    prop: 'processName',
                    label: '工序名称',
                    type: 'input'
                },
                {
                    prop: 'warehouseName',
                    label: '仓库名称',
                    type: 'input'
                },
                {
                    prop: 'warehouseCode',
                    label: '仓库编码',
                    type: 'input'
                },
                {
                    prop: 'mainUnit',
                    label: '单位',
                    type: 'input'
                }
            ]
        },
        setSearchList(){
            this.searchList = [
                {
                    fieldValue: '',
                    field: 'drawingNo',
                    label: '品名规格',
                    prop: 'drawingNo',
                    symbol: 'like',
                    searchType: 1
                },{
                    fieldValue: '',
                    field: 'productsName',
                    label: '产品名称',
                    prop: 'productsName',
                    symbol: 'like',
                    searchType: 1,
                },
            ]
        },
    }

};
</script>

<style scoped lang="scss">

</style>
