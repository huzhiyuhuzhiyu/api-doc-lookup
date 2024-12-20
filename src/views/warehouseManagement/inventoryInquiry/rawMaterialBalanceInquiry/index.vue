

<template>
    <ReportTypeTable :superQueryJson="superQueryJson" v-loading="!indexFlag" v-if="indexFlag" :list-request-obj="listRequestObj" :list-method="balanceQueryReport" :tableItems="tableItems" :searchList="searchList" :exportType="exportType" :export-name="exportName"/>
</template>

<script>
import ReportTypeTable from '@/components/no_mount/ReportTypeTable/index.vue';
import { balanceQueryReport, canStockBalance } from '@/api/balances'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'

export default {
    name: 'rawMaterialBalanceInquiry',
    components: {ReportTypeTable},
    mixins:[AbProjectMixin],
    data(){
        return {
            balanceQueryReport,
            listRequestObj:{
                accountPeriod: '',
                classAttribute: "raw_material",
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
                    column: 'drawingNo',
                }],
                orderStartDate: "",
                pageNum: 1,
                pageSize: 20,
                productCategoryId: '',
                productsCode: "",
                productsName: "",
                projectId: this.abProjectId,
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
            exportName:'原材料结存查询',
            isProductNameSwitch:'',
            accountPeriod:'',
            indexFlag:false
        }
    },
    async created() {
        await this.awaitAbProject()
        this.listRequestObj.projectId = this.abProjectId
        await this.getProductNameSwitch('product', 'enable_productName')
        const res = await canStockBalance()
        this.accountPeriod = res.data
        this.listRequestObj.accountPeriod = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.jnpf.getToday('YYYY-MM')
        this.setTableItems()
        this.setSuperQueryJson()
        this.setSearchList()
        this.searchList[1].fieldValue = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.jnpf.getToday('YYYY-MM')
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
                {prop:"accountPeriod", label:"账期",minWidth:160},
                {prop:"balanceState", label:"结存状态",minWidth:160,formatter:(row, column, cellValue)=>{
                    if (row.balanceState === 'not_finished'){
                        return '未完成'
                    }else{
                        return '已完成'
                    }
                }
                },
                {prop:"drawingNo", label:'品名规格',minWidth:160,sortable:'custom'},
                {prop:"productsName", label:'产品名称',minWidth:140,render:this.isProductNameSwitch === '1',sortable:'custom'},
                {prop:"productsCode", label:'产品编码',minWidth:140,sortable:'custom'},
                {prop:"processName", label:'工序名称',minWidth:140,sortable:'custom'},
                {prop:"warehouseName", label:'仓库名称',minWidth:140,sortable:'custom'},
                {prop:"warehouseCode", label:'仓库编码',minWidth:140,sortable:'custom'},
                {prop:"mainUnit", label:'单位',minWidth:120},
                {prop:"initInventoryQuantity", label:'期初数量',minWidth:120,sortable:'custom'},
                {prop:"purchaseReceivedQuantity", label:'采购入库数量',minWidth:160,sortable:'custom'},
                {prop:"outsourcingReceivedQuantity", label:'委外入库数量',minWidth:160,sortable:'custom'},
                {prop:"inboundQuantity", label:'入库合计数量',minWidth:160,sortable:'custom'},
                {prop:"purchaseReturnQuantity", label:'采购退货数量',minWidth:160,sortable:'custom'},
                {prop:"outsourcingIssuedQuantity", label:'委外发料数量',minWidth:160,sortable:'custom'},
                {prop:"productionRequisitionQuantity", label:'生产领料数量',minWidth:160,sortable:'custom'},
                {prop:"outboundQuantity", label:'出库合计数量',minWidth:160,sortable:'custom'},
                {prop:"endInventoryQuantity", label:'期末数量',minWidth:160,sortable:'custom'},
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
                    fieldValue: this.abProjectId,
                    field: 'projectId',
                    label: '所属项目',
                    prop: 'projectId',
                    symbol: 'like',
                    searchType: 4,
                    options:this.abProjectList,
                    clearable:false,
                },
                {
                    fieldValue: '',
                    field: 'accountPeriod',
                    label: '账期',
                    prop: 'accountPeriod',
                    symbol: 'like',
                    searchType: 2
                },{
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
                    render:this.isProductNameSwitch === '1'
                },
            ]
        },
    }

};
</script>

<style scoped lang="scss">

</style>
