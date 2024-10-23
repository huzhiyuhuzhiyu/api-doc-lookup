<script>
import {
    ApplicationType2FileManagementUrl,
    ApprovalStatus,
    DocumentStatus,
    ModelType,
    PageType,
} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {getBimFileUpload, switchEnableMark} from "@/api/esop/fileUpload/workinginstruction";
import {trim} from "@/utils";
import {executeQueryTime} from "@/views/esop/utils/utils";

export default {
    name: "CheckVersionCountDialog",
    data() {
        return {
            listLoading: false,
            tableData: [],
            total: 0,
            columnList: ['remark', 'createByName'],
            listQuery: this.getOriginListQuery(),
        }
    },
    methods:{
        async initData() {
            this.listLoading = true
            const params ={...this.listQuery}
            params.superQuery.condition[0].fieldValue === '' && delete params.superQuery
            this.executeUploadPageParams(params)
            const {data} = await getBimFileUpload(params)
            this.tableData = data.records
            this.total = data.total
            this.listLoading = false
        },
        getOriginListQuery() {
            console.log(this.applicationType)
            return {
                applicationType:this.applicationType,
                approvalStatus: ApprovalStatus.OK,
                createByName: "",
                documentStatus: DocumentStatus.SUBMIT,
                endTime: "",
                endUpdateTime: "",
                keyword: "",
                orderItems: [
                    {
                        asc: false,
                        column: "create_time"
                    }
                ],
                orderNo: "",
                pageNum: 1,
                pageSize: 20,
                startTime: "",
                startUpdateTime: "",
                superQuery: {
                    condition: [
                        {
                            field: "drawingNo",
                            fieldValue: "",
                            symbol: "like"
                        },
                    ],
                    matchLogic: ""
                },
                totalRowFlag: false
            }
        },
        getDetail(type,id) {
            if(this.currentId === id){
                this.$message.info('您已在此版本详情页')
                return
            }
            console.log(this.applicationType,ApplicationType2FileManagementUrl[this.applicationType])
            this.$router.push({
                path: ApplicationType2FileManagementUrl[this.applicationType],
                query:{
                    id,
                    type:ModelType.VIEW
                }
            })
        },
        async changeState({productsCode,id,enabledMark}) {
            const {data} = await switchEnableMark(id)
            this.$message.success('操作成功')
            this.initData()
        },
        searchVersion(drawingNo){
            this.createTimeArr =[]
            this.listQuery.superQuery.condition[0].fieldValue = drawingNo
            this.search()
        },
        executeUploadPageParams(params){
            if(this.isFileUploadPage){
                params.uploadListFlag = 1
                delete params.documentStatus
            }
        },
        sortChange({ prop, order }) {
            let newProp = ''
            if (prop == 'steelBall' || prop == 'outerCircle' || prop == 'innerCircle' || prop == 'createByName') {
                newProp = prop
            } else {
                newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
            }
            this.listQuery.orderItems[0].asc = order === 'ascending'
            this.listQuery.orderItems[0].column = order === null ? '' : newProp
            this.initData()
        },
        search() {
            trim(executeQueryTime(this.listQuery,this.createTimeArr))
            this.listQuery.pageNum = 1
            this.initData()
        },
    },
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        searchDrawingNo:{
            type:String,
            required:true
        },
        applicationType:{
            type:String,
            required:true
        },
        currentId:{
            type:String,
            required:true
        }

    },
    computed:{
        ModelType() {
            return ModelType
        },
        PageType() {
            return PageType
        },
        dialogVisible:{
            get(){
                return this.visible;
            },
            set(val){
                this.$emit('update:visible',val);
            }
        }
    },
    created() {
        this.searchVersion(this.searchDrawingNo)
    }
}
</script>

<template>
    <el-dialog
        top="5vh"
        title="查看关联版本"
        :visible.sync="dialogVisible"
        modal-append-to-body
        append-to-body
        lock-scroll
        width="80%"
    >
        <JNPF-table
            style="height: 70vh"
            v-loading="listLoading"
            :data="tableData"
            :fixedNO="true"
            @sort-change="sortChange"
            custom-column
            enabled-checkbox-plus
            ref="dataTable" :setColumnDisplayList="columnList">
            <!--                    <el-table-column prop="orderNo" label="上传单编码" sortable="custom" min-width="150" />-->
            <el-table-column prop="drawingNo" label="品名规格" min-width="305" />
            <el-table-column prop="productsCode" label="产品编码" min-width="120" />
            <el-table-column prop="productsCategoryName" label="产品分类" width="140" />
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center">
                <template slot-scope="{row}">
                    <el-tag type="warning" v-if="row.documentStatus === 'draft'">草稿</el-tag>
                    <el-tag type="success" v-else-if="row.documentStatus === 'submit'">提交</el-tag>
                    <el-tag type="danger"  v-else-if="row.documentStatus === 'back'">退回</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="version" label="版本号" width="80" />
            <el-table-column prop="fileCount" label="文件数量" width="120" />
            <el-table-column prop="versionCount" label="关联版本" width="120">
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary" @click="searchVersion(scope.row.drawingNo)">{{scope.row.versionCount}}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
            <el-table-column prop="createByName" label="创建人" width="100" />
            <el-table-column prop="status" label="启用状态" width="120" align="center">
                <template slot-scope="scope">
                    <el-switch @change="changeState(scope.row)" v-model="scope.row.enabledMark"
                               :active-value="true" :inactive-value="false">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">

                    <el-button  type="text" size="mini" @click="getDetail(ModelType.VIEW,scope.row.id)">查看详情</el-button>
                </template>
            </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
    </el-dialog>
</template>

<style scoped lang="scss">

</style>
