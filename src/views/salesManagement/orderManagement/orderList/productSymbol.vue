<template>
    <el-dialog title="选择代号" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll append-to-body
               class="JNPF-dialog JNPF-dialog_center" width="71%">
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
            <div class="JNPF-common-layout-center JNPF-flex-main">
                <div class="JNPF-common-layout-main JNPF-flex-main">
                    <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" customKey="JNPFTableKey_934407symbol">
                        <el-table-column prop="code" label="代号"   min-width="140" />
                        <el-table-column prop="remark" label="备注"   min-width="140" />
                        <el-table-column label="操作" width="160" fixed="right">
                            <template slot-scope="scope">
                                <el-button type="text" @click="selectFun(scope.row)">选择</el-button>
                            </template>
                        </el-table-column>
                    </JNPF-table>
                    <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                                @pagination="getData" />
                </div>
            </div>
        </div>

    </el-dialog>
</template>

<script>
import { productAttributeCodeRelated } from '@/api/masterDataManagement'
export default {
    name:'productSymbolForm',
    props:{
        productId:{
            type:String,
            default:'',
        }
    },
    data() {
        return {
            listLoading: false,
            visible: false,
            tableData: [],
            orderForm: {
                "code": "",
                "createByName": "",
                "endTime": "",
                "endUpdateTime": "",
                "keyword": "",
                "orderEndDate": "",
                orderItems: [{
                    asc: false,
                    column: ""
                }, {
                    asc: false,
                    column: "create_time"
                }],
                "orderStartDate": "",
                "pageNum": 1,
                "pageSize": 20,
                "productId": this.productId,
                "projectId": '',
                "startTime": "",
                "startUpdateTime": "",
                "superQuery": {},
                "totalRowFlag": false
            },
            total: 0,
            index:"",
            dataFormTwo:[]
        }
    },
    created () {

    },
    methods: {
        init(index,dataFormTwo,id){
            this.visible = true
            this.dataFormTwo = dataFormTwo
            this.index = index
            this.orderForm.productId = id
            this.getData()
        },
        getData(){
            productAttributeCodeRelated(this.orderForm).then(res=>{
                this.tableData = res.data.records
                this.total = res.data.total
            })
        },
        selectFun(row){
            this.visible = false
            this.$emit('selectProductSymbolData', row,this.index,this.dataFormTwo)
        },
    },
}
</script>

<style scoped>
.JNPF-common-head {
    padding: 10px;
}

.JNPF-common-search-box {
    padding-top: 5px;
    padding-bottom: 10px;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 0px !important;
}

.pagination-container {
    background-color: #ebeef5;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.main {
    padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
    padding: 0 !important;
    padding-bottom: 10px !important;
    margin-bottom: 0;
    padding-left: 10px !important;
    background: #fff;
}

.el-button--small {
    padding: 1;
}

::v-deep .JNPF-common-page-header {
    padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
    padding-bottom: 0;
}
::v-deep .JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body{
    padding: 10px !important;
}
::v-deep .el-dialog__body{
    padding: 10px !important;
}
</style>
