

<template>
    <wareHouseQuery :superQueryJson="superQueryJson" v-loading="!indexFlag" v-if="indexFlag"  :list-request-obj="listRequestObj" :list-method="wareHouseBalanceQuery" :tableItems="tableItems" :searchList="searchList" :exportType="exportType" :export-name="exportName"/>
</template>

<script>
import { wareHouseBalanceQuery, canStockBalance } from '@/api/balances'
import WareHouseQuery from '@/views/warehouseManagement/inventoryInquiry/warehouseBalanceQuery/wareHouseQuery.vue'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'

export default {
    name: 'warehouseBalanceQuery',
    components: { WareHouseQuery},
    mixins:[AbProjectMixin],
    data(){
        return {
            wareHouseBalanceQuery,
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
                    column: 'drawingNo',
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
            exportType:'1233',
            exportName:'仓库汇总结存查询',
            isProductNameSwitch:'',
            accountPeriod:'',
            indexFlag:false,
            defaultProjectId:''
        }
    },
    async created() {
        await this.awaitAbProject()
        this.defaultProjectId = this.abProjectNoCommonList.find(item=>item.value === this.abProjectId) ? this.abProjectId : this.abProjectNoCommonList[0].id
        this.listRequestObj.projectId = this.defaultProjectId
        await this.getProductNameSwitch('product', 'enable_productName')
        const res = await canStockBalance(this.defaultProjectId)
        this.accountPeriod = res.data
        this.listRequestObj.accountPeriod = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.jnpf.getToday('YYYY-MM')
        // const listRes = await wareHouseBalanceQuery(this.listRequestObj)
        // console.log(listRes)
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
                {prop:"账期", label:"账期",minWidth:160,props:'accountPeriod'},
                {prop:"品名规格", label:'品名规格',minWidth:160,sortable:'custom',props:'drawingNo'},
                {prop:"产品名称", label:'产品名称',minWidth:140,render:this.isProductNameSwitch === '1',sortable:'custom',props:'productsName'},
                {prop:"产品编码", label:'产品编码',minWidth:140,sortable:'custom',props:'productsCode'},
                {prop:"工序名称", label:'工序名称',minWidth:140,sortable:'custom',props:'processName'},
            ]
        },
        setSuperQueryJson(){
            this.superQueryJson = [
                {
                    prop: '账期',
                    label: '账期',
                    type: 'month',
                    valueFormat: 'yyyy-MM',
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
            ]
        },
        setSearchList(){
            this.searchList = [
                {
                    fieldValue: this.defaultProjectId,
                    field: 'projectId',
                    label: '所属项目',
                    prop: 'projectId',
                    symbol: 'like',
                    searchType: 4,
                    options:this.abProjectNoCommonList,
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
                },
            ]
        },
    }

};
</script>

<style scoped lang="scss">

</style>
