

<template>
    <ReportTypeTable :need-super-query="false" :columnList="columnList"  :superQueryJson="superQueryJson" v-loading="!indexFlag" v-if="indexFlag" :treeTitle="treeTitle" renderTree :methodArr="methodArr" :list-request-obj="listRequestObj" :list-method="balanceQueryReport" :tableItems="tableItems" :searchList="searchList" :exportType="exportType" :export-name="exportName"/>
</template>

<script>
import ReportTypeTable from '@/components/no_mount/ReportTypeTable/index.vue';
import {getcategoryTree} from '@/api/basicData/materialSettings';
import { balanceQueryReport, canStockBalance } from '@/api/balances'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'

export default {
    name: 'balanceQuiry',
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
            treeTitle:'产品分类',
            methodArr:{ method:getcategoryTree,requestObj:{classAttribute: "", type: "material"} },
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

         if(this.abProjectSwitchVisible){

          this.defaultProjectId = this.abProjectNoCommonList.find(item=>item.value === this.abProjectId) ? this.abProjectId : this.abProjectNoCommonList[0].id
          this.listRequestObj.projectId = this.defaultProjectId
        }else{
          this.defaultProjectId='1'
        }

        // this.defaultProjectId = this.abProjectNoCommonList.find(item=>item.value === this.abProjectId) ? this.abProjectId : this.abProjectNoCommonList[0].id
        // console.log(this.abProjectId,'this.defaultProjectId')
        // this.listRequestObj.projectId = this.defaultProjectId

        await this.getProductNameSwitch('product', 'enable_productName')
        const res = await canStockBalance(this.defaultProjectId)
        this.accountPeriod = res.data
        this.listRequestObj.accountPeriod = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.jnpf.getToday('YYYY-MM')
        this.setTableItems()
        this.setSuperQueryJson()
        this.setSearchList()
        // this.searchList[1].fieldValue = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.jnpf.getToday('YYYY-MM')
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
                            return '未结存'
                        }else{
                            return '已结存'
                        }
                    }
                },
                {prop:"drawingNo", label:'型号',minWidth:160,sortable:'custom'},
                {prop:"productsName", label:'产品名称',minWidth:140,render:this.isProductNameSwitch === '1',sortable:'custom'},

                {prop:"standardValue", label:'规值',minWidth:140,sortable:'custom'},
                {prop:"productsCode", label:'产品编码',minWidth:140,sortable:'custom'},
                {prop:"processName", label:'工序名称',minWidth:140,sortable:'custom'},
                {prop:"warehouseName", label:'仓库名称',minWidth:140,sortable:'custom'},
                {prop:"warehouseCode", label:'仓库编码',minWidth:140,sortable:'custom'},
                {prop:"mainUnit", label:'单位',minWidth:120},
                {prop:"initInventoryQuantity", label:'期初数量',minWidth:120,sortable:'custom'},
                {prop:"inboundQuantity", label:'入库数量',minWidth:120,sortable:'custom'},
                {prop:"outboundQuantity", label:'出库数量',minWidth:120,sortable:'custom'},
                {prop:"endInventoryQuantity", label:'期末数量',minWidth:120,sortable:'custom'},
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
                    label: '型号',
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
                // {
                //     fieldValue: this.defaultProjectId,
                //     field: 'projectId',
                //     disabled:this.abProjectId === '1' ? false : true,
                //     label: '所属项目',
                //     prop: 'projectId',
                //     symbol: 'like',
                //     searchType: 4,
                //     options:this.abProjectNoCommonList,
                //     clearable:false,
                // },
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
                    label: '型号',
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
              if(this.abProjectSwitchVisible){
              let arr=[
                    {
                    fieldValue: this.defaultProjectId,
                    field: 'projectId',
                    label: '所属项目',
                    prop: 'projectId',
                    disabled:this.abProjectId === '1' ? false : true,
                    symbol: 'like',
                    searchType: 4,
                    options:this.abProjectNoCommonList,
                    clearable:false,
                },
              ]
              this.searchList=[...arr,...this.searchList]
              this.searchList[1].fieldValue = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.listQuery.accountPeriod
            }else{
              this.searchList[0].fieldValue = this.accountPeriod.length ? this.accountPeriod[this.accountPeriod.length - 1] : this.listQuery.accountPeriod

            }
        },
    }

};
</script>

<style scoped lang="scss">

</style>
