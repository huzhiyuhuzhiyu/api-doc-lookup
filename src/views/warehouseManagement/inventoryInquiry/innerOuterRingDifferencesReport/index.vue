

<template>
    <ReportTypeTable :need-super-query="false" :superQueryJson="superQueryJson" v-loading="!indexFlag" v-if="indexFlag" :list-request-obj="listRequestObj" :list-method="innerOuterRingReport" :tableItems="tableItems" :searchList="searchList" :exportType="exportType" :export-name="exportName" :pageSizes="[50, 100, 500,1000]" :renderSummary="false" :renderPage="false" :renderSearch="false" />
</template>

<script>
import ReportTypeTable from '@/components/no_mount/ReportTypeTable/index.vue';
import { innerOuterRingReport } from '@/api/warehouseManagement/inventory'
export default {
    name: 'innerOuterRingDifferencesReport',
    components: {ReportTypeTable},
    mixins:[],
    data(){
        return {
            innerOuterRingReport,
            listRequestObj:{
                orderItems: [{
                    asc: false,
                    column: ''
                }, {
                    asc: false,
                    column: '',
                }],
                pageNum: 1,
                pageSize: 50,
                
            },
            tableItems:[],
            columnList:[],
            searchList:[],
            superQueryJson:[],
            exportType:'1246',
            exportName:'内外圈差异报表',
            accountPeriod:'',
            indexFlag:false,
        }
    },
    async created() {
        this.setTableItems()
        this.setSuperQueryJson()
        this.setSearchList()
        this.indexFlag = true
    },
    methods: {
        setTableItems(){
            this.tableItems = [
                {prop:"outerDrawingNo", label:"外圈图号",minWidth:160,sortable:'custom'},
                {prop:"outerMainUnit", label:'外圈单位',minWidth:160,},
                {prop:"outerYclNum", label:'原材料库',minWidth:140,sortable:'custom'},
                {prop:"outerWwNum", label:'委外库',minWidth:140,sortable:'custom'},
                {prop:"outerMgNum", label:'磨工线边仓',minWidth:140,sortable:'custom'},
                {prop:"outerZpNum", label:'装配线边仓',minWidth:140,sortable:'custom'},
                {prop:"outerDzNum", label:'半成品待装库',minWidth:130,sortable:'custom'},
                {prop:"outerRclNum", label:'半成品热处理库',minWidth:150,sortable:'custom'},
                {prop:"outerBfNum", label:'报废',minWidth:120,sortable:'custom'},
                {prop:"outerTotal", label:'总计',minWidth:120,sortable:'custom'},
                {prop:"innerDrawingNo", label:'内圈图号',minWidth:120,sortable:'custom'},
                {prop:"innerMainUnit", label:'内圈单位',minWidth:160,},
                {prop:"innerYclNum", label:'原材料库',minWidth:140,sortable:'custom'},
                {prop:"innerWwNum", label:'委外库',minWidth:140,sortable:'custom'},
                {prop:"innerMgNum", label:'磨工线边仓',minWidth:140,sortable:'custom'},
                {prop:"innerZpNum", label:'装配线边仓',minWidth:140,sortable:'custom'},
                {prop:"innerDzNum", label:'半成品待装库',minWidth:130,sortable:'custom'},
                {prop:"innerRclNum", label:'半成品热处理库',minWidth:150,sortable:'custom'},
                {prop:"innerBfNum", label:'报废',minWidth:120,sortable:'custom'},
                {prop:"innerTotal", label:'总计',minWidth:120,sortable:'custom'},
                {prop:"mgDiffNum", label:'磨工差额',minWidth:120,sortable:'custom'},
                {prop:"zpDiffNum", label:'装配差额',minWidth:120,sortable:'custom'},
                {prop:"totalDiff", label:'汇总差额',minWidth:120,sortable:'custom'},
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
                    render:this.$store.getters.configData.product.enable_productName
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
