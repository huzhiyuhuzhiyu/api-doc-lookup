

<template>
    <ReportTypeTable :superQueryJson="superQueryJson" v-loading="!indexFlag" v-if="indexFlag" :treeTitle="treeTitle" renderTree :methodArr="methodArr" :list-request-obj="listRequestObj" :list-method="purchaseLineReport" :tableItems="tableItems" :searchList="searchList" :exportType="exportType" :export-name="exportName"/>
</template>

<script>
import ReportTypeTable from '@/components/no_mount/ReportTypeTable/index.vue';
import {getcategoryTree} from '@/api/basicData/materialSettings';
import {  purchaseLineReport } from '@/api/balances'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'

export default {
    name: 'purchaseDetails',
    mixins:[AbProjectMixin],
    components: {ReportTypeTable},
    data(){
        return {
            purchaseLineReport,
            listRequestObj:{
                orderItems: [{
                    asc: false,
                    column: ''
                }, {
                    asc: false,
                    column: '',
                }],
                createByName: "",
                month: this.jnpf.getToday('YYYY-MM'),
                orderStartDate: "",
                pageNum: 1,
                pageSize: 20,
                projectId: '',
                superQuery: {},
                totalRowFlag: false,
                productCategoryId: '',
                productsCode: "",
                productsName: "",
                businessType:'inbound_purchase'
            },
            treeTitle:'产品分类',
            methodArr:{ method:getcategoryTree,requestObj:{classAttribute: "", type: "material"} },
            tableItems:[],
            columnList:[],
            searchList:[],
            superQueryJson:[],
            exportType:'1236',
            exportName:'进货明细报表',
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
        // await this.getProjectList()
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
                {prop:"orderDate", label:"单据日期",minWidth:160},
                {prop:"partnerName", label:'供应商名称',minWidth:160,sortable:'custom'},
                {prop:"productsCode", label:'产品编码',minWidth:140,sortable:'custom'},
                {prop:"productsName", label:'产品名称',minWidth:140,render:this.isProductNameSwitch === '1',sortable:'custom'},
                {prop:"productsDrawingNo", label:'品名规格',minWidth:140,sortable:'custom'},
                {prop:"mainUnit", label:'单位',minWidth:120},
                {prop:"num", label:'数量',minWidth:140,sortable:'custom'},
                {prop:"costPrice", label:'单价',minWidth:140,sortable:'custom'},
                {prop:"totalAmount", label:'金额',minWidth:140,sortable:'custom'},
                {prop:"remark", label:'备注',minWidth:160,},
            ]
        },
        setSuperQueryJson(){
            this.superQueryJson = [
                {
                    prop: 'orderDate',
                    label: '单据日期',
                    type: 'month',
                    valueFormat: 'yyyy-MM',
                },
                {
                    prop: 'partnerName',
                    label: '供应商名称',
                    type: 'input',
                },
                {
                    prop: 'productsDrawingNo',
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
                    prop: 'mainUnit',
                    label: '单位',
                    type: 'input'
                }
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
                    fieldValue: this.jnpf.getToday('YYYY-MM'),
                    field: 'month',
                    label: '月份',
                    prop: 'month',
                    symbol: 'like',
                    searchType: 2
                },
            ]
        },
    }

};
</script>

<style scoped lang="scss">

</style>
