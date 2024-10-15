<template>
    <div class="JNPF-common-layout">
        <div v-if="!formVisible" class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4">
                        <el-form-item>
                            <el-input  @keyup.enter.native="search" v-model="listQuery.superQuery.condition[0].fieldValue" placeholder="品名规格" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item>
                            <el-date-picker v-model="createTimeArr" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                                            style="width: 100%" start-placeholder="创建开始时间" end-placeholder="创建结束时间" clearable></el-date-picker>
                        </el-form-item>
                    </el-col>

                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                                {{ $t('common.search') }}
                            </el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
                        </el-form-item>
                    </el-col>
                    <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="moreQueries()">更多查询</el-button> -->
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
                <div class="JNPF-common-head" style="padding: 8px;display: -webkit-box">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click.native="addOrUpdateHandle(ModelType.ADD)">
                        新建
                    </el-button>
                    <div class="JNPF-common-head-right">
                        <el-tooltip content="高级查询" placement="top" v-if="true">
                            <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                                     @click="superQueryVisible = true" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
                            ref="dataTable" :setColumnDisplayList="columnList">
                    <el-table-column prop="orderNo" label="上传单编码" sortable="custom" min-width="150" />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="150" />

                    <el-table-column prop="productsCode" label="产品编码" min-width="120" />
                    <el-table-column prop="productsCategoryName" label="产品分类" width="140" />
                    <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center">
                        <template slot-scope="{row}">
                            <el-tag type="warning" v-if="row.documentStatus === 'draft'">草稿</el-tag>
                            <el-tag type="success" v-else-if="row.documentStatus === 'submit'">提交</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="version" label="版本号" width="80" />
                    <el-table-column prop="fileCount" label="文件数量" width="120" />
                    <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                    <el-table-column prop="createByName" label="创建人" width="100" />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                                       :delDisabled="scope.row.documentStatus !== 'draft'"
                                       :editDisabled="scope.row.documentStatus !== 'draft'"
                                       @edit="addOrUpdateHandle(ModelType.EDIT,scope.row.id)" @del="handleDel(scope.row.id)">
                                        <el-dropdown hide-on-click>
                                            <span class="el-dropdown-link">
                                              <el-button type="text" size="mini">
                                                {{ $t('common.moreBtn') }}
                                                <i class="el-icon-arrow-down el-icon--right"></i>
                                              </el-button>
                                            </span>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item @click.native="addOrUpdateHandle(ModelType.VIEW,scope.row.id)">
                                                    查看详情
                                                </el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                            </tableOpts>
                        </template>
                    </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData" />
            </div>
        </div>
        <EditWorkingInstructionUpload :flowCode="flowCode" :type="uploadType" :id="fileUploadId" :applicationType="applicationType" @back="editBack" v-if="formVisible"/>

        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />
        <!-- <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" /> -->
    </div>
</template>

<script>
import {
    updataBimProductsModelCheck,
    getbimProductsModelInfo,
    updataBimProductsModel,
    delBimProductsModel,
    getbimProductsModelList,
    addBimProductsModel,
    uploadDimProductsModel
} from '@/api/masterDataManagement/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import JNPFForm from './Form'
import { mapGetters, mapState } from 'vuex'
import SuperQuery from '@/components/SuperQuery/index.vue'
import EditWorkingInstructionUpload from "@/views/esop/fileUpload/workinginstruction/Form.vue";
import {deleteBimFileUpload, getBimFileUpload} from "@/api/esop/fileUpload/workinginstruction";
import moment from "moment";
import {ApplicationType, DocumentStatus, ModelType} from "@/views/esop/fileUpload/workinginstruction/utils/constant";
import {FlowCode} from "@/views/esop/utils/constants";



export default {
    components: {EditWorkingInstructionUpload, JNPFForm, ExportForm, SuperQuery },

    props:{
        applicationType:{
            type:String,
            default:ApplicationType.WORK
        },
        flowCode:{
            type: String,
            default: FlowCode.WORK
        },
    },
    data() {
        return {
            ModelType,
            uploadType:ModelType.ADD,
            fileUploadId:"",
            tableFormVisible: false,
            exportFormVisible: false,
            columnList: ['remark', 'createByName'],
            createTimeArr: [],
            title: '更多查询',
            visible: false,
            tableData: [],
            listLoading: false,
            listQuery: this.getOriginListQuery(),
            formType:ModelType.ADD,
            total: 0,
            formVisible: false,
            selectList: [],
            uploadVisib: false,
            superQueryVisible: false,
            superQueryJson: [
                {
                    prop: '上传单编码',
                    label: '型号',
                    type: 'orderNo'
                },
                {
                    prop: 'drawingNo',
                    label: '品名规格',
                    type: 'input'
                },

                {
                    prop: 'productsCode',
                    label: '产品编码',
                    type: 'input'
                },
                {
                    prop: 'productsCategoryName',
                    label: '产品分类',
                    type: 'input'
                },

            ]
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
        ...mapState('user', ['token'])
    },
    async created() {
        this.initData()

    },
    methods: {
        getOriginListQuery() {
            return {
                applicationType:this.applicationType,
                approvalStatus: "",
                createByName: "",
                documentStatus: DocumentStatus.DRAFT,
                endTime: "",
                endUpdateTime: "",
                keyword: "",
                orderItems: [
                    {
                        asc: true,
                        column: ""
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
                        }
                    ],
                    matchLogic: ""
                },
                totalRowFlag: false
            }
        },
        editBack(){
            this.formVisible = false
            this.search()
        },
        superQuerySearch(query) {
            this.listQuery.superQuery = query
            this.superQueryVisible = false
            this.search()
        },
        // 批量新建
        batchAdd() {
            this.formType = ModelType.ADD
            this.formVisible = true
        },
        handleSelectionChange(val) {
            this.selectList = val
        },
        batchEditFun() {
            if (!this.selectList.length) return this.$message.error('请先选择您要修改的数据!')
            this.tableFormVisible = true
            this.$nextTick(() => {
                this.$refs.TableForm.init(this.selectList, 'edit')
            })
        },
        exportType(data, ref) {
            if (data.length) {
                this.exportFormVisible = true
                let domRef = this.$refs[`${ref}`]
                console.log(domRef)
                let columnList = domRef.columnList.filter((item) => !!item.label && !!item.prop)
                columnList = columnList.map((item) => {
                    return { label: item.label, prop: item.prop }
                })
                this.$nextTick(() => {
                    this.$refs.exportForm.init(columnList)
                })
            } else {
                this.$message({
                    message: '暂无数据导出',
                    type: 'error',
                    duration: 1500
                })
            }
        },
        // 导出
        exportForm() {
            this.exportType(this.tableData, 'dataTable')
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
        },
        handlePreview(file) {
            console.log(file)
        },
        handleFileChange(file) {
            console.log('所选文件:', file)
            this.file = file.raw
        },
        saveSubmit() {
            this.UploadProduct(this.file)
        },
        download(data) {
            if (data) {
                this.exportFormVisible = false
                let includeFieldMap = {}
                for (let i = 0; i < data.selectKey.length; i++) {
                    includeFieldMap[data.selectKey[i]] = data.selectVal[i]
                }
                let query = this.listQuery
                let _data = {
                    ...query,
                    exportType: '1202',
                    exportName: '型号管理',
                    includeFieldMap,
                    pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
                }
                excelExport(_data)
                    .then((res) => {
                        this.exportFormVisible = false
                        if (!res.data.url) return
                        this.jnpf.downloadFile(res.data.url)
                    })
                    .catch(() => { })
            }
        },

        distributionFun() {
            if (!this.selectArr.length) return this.$message.error('请先选择要分配的数据')
            this.customerVisi = true
        },
        // 下载模板
        downLoadTemplate() {
            const a = document.createElement('a')
            a.setAttribute('download', '')
            a.setAttribute('href', location.origin + '/static/型号导入模板.xlsx')
            a.click()
        },
        importFun() {
            // this.$refs.UploadProduct.$el.querySelector('input').click()
            this.uploadVisib = true
        },
        // 上传产品
        UploadProduct(data) {
            console.log('data', data)
            this.loadingText = '正在导入数据'
            this.formLoading = true
            var formData = new FormData()
            formData.append('file', data)
            //调用上传文件接口
            uploadDimProductsModel(formData)
                .then((res) => {
                    if (!res.data) {
                        this.$message.success(`导入成功`)
                        this.initData()
                        this.formLoading = false
                        this.loadingText = ''
                    } else {
                        this.handleMessage(res.data)
                    }
                })
                .catch((err) => {
                    this.$message.error(`文件上传失败`)
                    this.formLoading = false
                    this.loadingText = ''
                })
        },
        // 提示
        handleMessage(data) {
            const h = this.$createElement
            this.$message({
                type: 'error',
                duration: 0,
                showClose: true,
                customClass: 'my-message', // 自定义类名，用于设置样式
                message: h(
                    'div',
                    {
                        style: 'padding-right:20px;display:flex;align-items:center;color:#f56c6c;'
                    },
                    [
                        h('p', { style: 'font-size:14px;' }, '导入成功，存在型号相关信息错误！'),
                        h(
                            'el-button',
                            {
                                props: {
                                    type: 'text',
                                    size: 'mini',
                                    icon: 'el-icon-download'
                                },
                                on: {
                                    click: () => {
                                        this.downNoProduct(data)
                                    }
                                },
                                style: {
                                    border: 'none',
                                    textAlign: 'center',
                                    // width:"20%",
                                    margin: '0 5px 0 5px '
                                }
                            },
                            '下载导入错误数据'
                        )
                    ]
                )
            })
            return
        },
        cancelFun() {
            this.uploadVisib = false
            this.$refs['uploadRef'].clearFiles()
        },
        // 导入产品  下载导入错误数据
        downNoProduct(res) {
            this.jnpf.downloadFile(res.url, res.name)
        },
        columnSetFun() {
            console.log('this.$refs.dataTable', this.$refs.dataTable)
            this.$refs.dataTable.showDrawer()
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
       async initData() {
            this.listLoading = true
           const {data} = await getBimFileUpload(this.listQuery)
           this.tableData = data.records
           this.total = data.total
           this.listLoading = false

        },
        search() {
            if (this.createTimeArr && this.createTimeArr.length > 0) {
                this.listQuery.startTime = moment(Number(this.createTimeArr[0])).format('YYYY-MM-DD hh:mm:ss')
                this.listQuery.endTime = moment(Number(this.createTimeArr[1])).format('YYYY-MM-DD hh:mm:ss')
            } else {
                this.listQuery.startTime = ''
                this.listQuery.endTime = ''
            }
            Object.keys(this.listQuery).forEach((key) => {
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.listQuery.pageNum = 1
            this.initData()
        },
        refresh(isrRefresh) {
            this.formVisible = false
            this.tableFormVisible = false
            if (isrRefresh) this.reset()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.createTimeArr = []
            this.listQuery =this.getOriginListQuery()
            this.$refs.SuperQuery.conditionList = []
            this.initData()
        },
        addOrUpdateHandle(type,id) {
            this.fileUploadId = id
            this.uploadType = type
            this.formVisible = true
        },
        handleDel(id) {
            this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
                type: 'warning'
            })
                .then(() => {
                    deleteBimFileUpload(id).then((res) => {
                        if (res.msg === 'Success') {
                            this.initData()
                            this.$message({
                                type: 'success',
                                message: '删除成功',
                                duration: 1500
                            })
                        }
                    })
                })
                .catch(() => { })
        },

    }
}
</script>
<style scoped>
/* .JNPF-common-layout-left {
    margin-right: 0;
    border-right: 1px solid #cacaca;
  }

  ::v-deep .el-tabs__content {
    height: calc(100vh - 163px);
  } */

::v-deep .el-tabs__header {
    margin-bottom: 5px;
    padding: 0 10px;
}

.JNPF-common-search-box {
    padding: 8px 0 0 0;
    margin-left: 0 !important;
    margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
    margin-bottom: 8px !important;
}

.pagination-container {
    background-color: #f5f7fa;
    margin-top: 0px;
    padding-right: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
    padding: 0;
}

::v-deep.el-tree-node__content {
    height: 30px;
    line-height: 30px;
}

.JNPF-common-el-tree {
    margin: 5px 0;
}

::v-deep .icon-piliang-copy {
    margin-right: 8px;
}
</style>
