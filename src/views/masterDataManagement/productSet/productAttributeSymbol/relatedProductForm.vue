<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main org-form transitionForm">
            <div :class="['JNPF-common-page-header']">
                <el-page-header @back="$emit('close',true)" content="代号绑定产品" />
                <div class="options">
                    <el-button @click="$emit('close',true)">{{ $t('common.cancelButton') }}</el-button>
                </div>
            </div>
            <div class="main" v-loading="formLoading">
                        <JNPF-table ref="dataTable" v-loading="listLoading" highlight-current-row :data="tableData" custom-column customKey="JNPFTableKey_26735678567Form">
                            <el-table-column prop="code" label="代号" />
                            <el-table-column prop="drawingNo" label="品名规格" />
                            <el-table-column prop="productCode" label="产品编码" />
                            <el-table-column v-if="$store.getters.configData.product.enable_productName" prop="productName" label="产品名称" />
                            <el-table-column prop="remark" label="备注" />
                            <el-table-column label="操作" width="100" fixed="right">
                                <template slot-scope="scope">
                                    <tableOpts :hasEdit="false" :isJudgePer="true"  :delPerCode="'btn_remove'" @del="handleDel(scope.row.id)">
                                    </tableOpts>
                                </template>
                            </el-table-column>
                        </JNPF-table>
                        <pagination :total="total" :page.sync="listQuery.pageNum" :background="true" :limit.sync="listQuery.pageSize"
                                    @pagination="init" />
            </div>
        </div>
    </transition>
</template>
<script>
import {
    delProductAttributesCodeRelated,
    productAttributeCodeRelated,
} from '@/api/masterDataManagement'

export default {
    name: 'relatedProductForm',
    props:{
        mainCode:{
            type:String,
            default:''
        },
    },
    data(){
        return {
            formLoading: false,
            listLoading: false,
            tableData:[],
            listQuery:{},
            total:0,
            initListQuery:{
                "code": this.mainCode,
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
                "productId": '',
                "projectId": '',
                "startTime": "",
                "startUpdateTime": "",
                "superQuery": {},
                "totalRowFlag": false
            },
        }
    },
    created() {
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
    },
    methods:{
        init(){
            this.listLoading = true
            productAttributeCodeRelated(this.listQuery)
                .then((res) => {
                    this.tableData = res.data.records
                    this.total = res.data.total
                    this.listLoading = false
                    this.visible = false
                })
                .catch(() => {
                    this.listLoading = false
                })
        },
        handleDel(id){
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            }).then(() => {
                delProductAttributesCodeRelated(id).then((res) => {
                    this.init()
                    this.$message({
                        type: 'success',
                        message: '删除成功',
                        duration: 1500
                    })
                })
            }).catch(() => { })
        },
    },
}
</script>
<style scoped lang="scss">
::v-deep .tableContainer{
    height: calc(100% - 47px);
}
</style>
