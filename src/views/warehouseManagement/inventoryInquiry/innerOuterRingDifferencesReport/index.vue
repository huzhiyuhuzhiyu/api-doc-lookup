

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
                {prop:"outerDrawingNo", label:"物料编号",minWidth:160,sortable:'custom2'},
                {prop:"outerMainUnit", label:'单位',minWidth:120,},
                {prop:"outerYclNum", label:'原材料库',minWidth:140,sortable:'custom2'},
                {prop:"outerWwNum", label:'委外库',minWidth:140,sortable:'custom2'},
                {prop:"outerMgNum", label:'磨工线边仓',minWidth:140,sortable:'custom2'},
                {prop:"outerZpNum", label:'装配线边仓',minWidth:140,sortable:'custom2'},
                {prop:"outerDzNum", label:'半成品待装库',minWidth:130,sortable:'custom2'},
                {prop:"outerRclNum", label:'半成品热处理库',minWidth:150,sortable:'custom2'},
                {prop:"outerFhNum", label:'发黑',minWidth:150,sortable:'custom2'},
                {prop:"outerBfNum", label:'报废',minWidth:120,sortable:'custom2'},
                {prop:"outerTotal", label:'总计',minWidth:120,sortable:'custom2'},
                {prop:"innerDrawingNo", label:'物料编号',minWidth:160,sortable:'custom2'},
                {prop:"innerMainUnit", label:'单位',minWidth:120,},
                {prop:"innerYclNum", label:'原材料库',minWidth:140,sortable:'custom2'},
                {prop:"innerWwNum", label:'委外库',minWidth:140,sortable:'custom2'},
                {prop:"innerMgNum", label:'磨工线边仓',minWidth:140,sortable:'custom2'},
                {prop:"innerZpNum", label:'装配线边仓',minWidth:140,sortable:'custom2'},
                {prop:"innerDzNum", label:'半成品待装库',minWidth:130,sortable:'custom2'},
                {prop:"innerRclNum", label:'半成品热处理库',minWidth:150,sortable:'custom2'},
                {prop:"innerFhNum", label:'发黑',minWidth:150,sortable:'custom2'},
                {prop:"innerBfNum", label:'报废',minWidth:120,sortable:'custom2'},
                {prop:"innerTotal", label:'总计',minWidth:120,sortable:'custom2'},
                {prop:"mgDiffNum", label:'磨工差额',minWidth:120,sortable:'custom2'},
                {prop:"zpDiffNum", label:'装配差额',minWidth:120,sortable:'custom2'},
                {prop:"totalDiff", label:'汇总差额',minWidth:120,sortable:'custom2'},
            ]
        },
        setSuperQueryJson(){
            this.superQueryJson = [
                {
                    prop: 'outerDrawingNo',
                    label: '物料编号',
                    type: 'input',
                },
                {
                    prop: 'outerMainUnit',
                    label: '单位',
                    type: 'input',
                },
                {
                    prop: 'outerYclNum',
                    label: '原材料库',
                    type: 'input',
                },
                {
                    prop: 'outerWwNum',
                    label: '委外库',
                    type: 'input',
                },
                {
                    prop: 'outerMgNum',
                    label: '磨工线边仓',
                    type: 'input'
                },
                {
                    prop: 'outerZpNum',
                    label: '装配线边仓',
                    type: 'input'
                },
                {
                    prop: 'outerDzNum',
                    label: '半成品待装库',
                    type: 'input'
                },
                {
                    prop: 'outerRclNum',
                    label: '半成品热处理库',
                    type: 'input'
                },
                {
                    prop: 'outerBfNum',
                    label: '报废',
                    type: 'input'
                },
                {
                    prop: 'outerTotal',
                    label: '总计',
                    type: 'input',
                },
                {
                    prop: 'innerDrawingNo',
                    label: '物料编号',
                    type: 'input',
                },
                {
                    prop: 'innerMainUnit',
                    label: '单位',
                    type: 'input',
                },
                {
                    prop: 'innerYclNum',
                    label: '原材料库',
                    type: 'input',
                },
                {
                    prop: 'innerWwNum',
                    label: '委外库',
                    type: 'input',
                },
                {
                    prop: 'innerMgNum',
                    label: '磨工线边仓',
                    type: 'input'
                },
                {
                    prop: 'innerZpNum',
                    label: '装配线边仓',
                    type: 'input'
                },
                {
                    prop: 'innerDzNum',
                    label: '半成品待装库',
                    type: 'input'
                },
                {
                    prop: 'innerRclNum',
                    label: '半成品热处理库',
                    type: 'input'
                },
                {
                    prop: 'innerBfNum',
                    label: '报废',
                    type: 'input'
                },
                {
                    prop: 'innerTotal',
                    label: '总计',
                    type: 'input',
                },
                {
                    prop: 'mgDiffNum',
                    label: '磨工差额',
                    type: 'input'
                },
                {
                    prop: 'zpDiffNum',
                    label: '装配差额',
                    type: 'input'
                },
                {
                    prop: 'totalDiff',
                    label: '汇总差额',
                    type: 'input'
                },
            ]
        },
        setSearchList(){
            this.searchList = [
                {
                    fieldValue: '',
                    field: 'drawingNo',
                    label: '型号',
                    prop: 'drawingNo',
                    symbol: 'like',
                    searchType: 1
                },
                {
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
