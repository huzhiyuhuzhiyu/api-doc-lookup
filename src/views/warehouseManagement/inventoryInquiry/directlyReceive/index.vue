

<template>
    <ReportTypeTable :needSuperQuery="false" :isProductNameSwitch="isProductNameSwitch" :superQueryJson="superQueryJson"  v-loading="!indexFlag" v-if="indexFlag"  :list-request-obj="listRequestObj" :list-method="lineEdgeReport" :tableItems="tableItems" :searchList="searchList" :exportType="exportType" :export-name="exportName"/>
</template>

<script>
import ReportTypeTable from '@/components/no_mount/ReportTypeTable/index.vue';
import {  lineEdgeReport } from '@/api/balances'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'

export default {
    name: 'materialOutbound',
    mixins:[AbProjectMixin],
    components: {ReportTypeTable},
    data(){
        return {
            lineEdgeReport,
            listRequestObj:{
                classType: "",
                createByName: "",
                endTime: "",
                endUpdateTime: "",
                keyword: "",
                orderEndDate: "",
                orderStartDate: "",
                pageNum: 1,
                pageSize: 20,
                projectId: this.abProjectId,
                orderDate: [],
                startTime: "",
                startUpdateTime: "",
                superQuery: {},
                totalRowFlag: false,
                warehouseId: ''
            },
            tableItems:[],
            columnList:[],
            searchList:[],
            superQueryJson:[],
            exportType:'1234',
            exportName:'直接领用明细',
            isProductNameSwitch:'',
            accountPeriod:'',
            indexFlag:false
        }
    },
    async created() {
        await this.awaitAbProject()
        this.listRequestObj.projectId = this.abProjectId
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
                {prop:"warehouseName", label:"仓库名称",minWidth:160},
                {prop:"abrasive", label:"磨料",minWidth:160},
                {prop:"oil", label:"油料",minWidth:160},
                {prop:"accessory", label:"配件",minWidth:160},
                {prop:"turnoverBox", label:"周转箱",minWidth:160},
                {prop:"total", label:"合计金额",minWidth:160},
            ]
        },
        setSuperQueryJson(){
            this.superQueryJson = [
                // {
                //     prop: 'orderDate',
                //     label: '单据日期',
                //     type: 'daterange',
                //     valueFormat: 'yyyy-MM-dd',
                // },
                {
                    prop: 'warehouseName',
                    label: '仓库名称',
                    type: 'input'
                },
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
                    field: '',
                    label: '',
                    prop: 'orderDate',
                    symbol: '',
                    searchType: 5,
                    noNeedSuper: true,
                },
            ]
        },
    }

};
</script>

<style scoped lang="scss">

</style>
