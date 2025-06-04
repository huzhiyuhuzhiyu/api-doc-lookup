<template>
    <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="4" v-for="item in searchList" :key="item.prop">
                        <el-form-item>
                            <el-input @keyup.native.enter="search()" v-if="item.type === 'input'" v-model="listQuery[item.prop]"
                                      :placeholder="'请输入' + item.label" clearable />
                            <el-select v-else-if="item.type === 'select'" @change="selectChange" v-model="listQuery[item.prop]"
                                       :placeholder="'请选择' + item.label" style="width: 100%;" clearable>
                                <el-option v-for="item2 in item.options" :key="item2.value" :label="item2.label"
                                           :value="item2.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                                {{ $t('common.search') }}
                            </el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
                <div class="JNPF-common-head" style="padding:10px">
                    <div>
                        <el-button size="mini" type="primary" @click="handleBatch">批量设置重量</el-button>
                        <UploadDataButton style="margin-right: 10px" :buttonType="'primary'" :uploadApi="uploadProductProcess" @success="importDataSuccess" templateDownLoadPath="/static/产品工序重量导入模板.xlsx" />
                        <el-button :disabled="tableData.length <= 0" size="mini" type="primary" icon="el-icon-download" @click="exportForm">
                            导出
                        </el-button>
                    </div>
                    <div class="JNPF-common-head-right">
                        <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                            <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                            <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                        </el-tooltip>
                    </div>
                </div>
                <JNPF-table  :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
                            ref="dataTable" hasC @selection-change="currentChange" customKey="JNPFTableKey_441014weight">
                    <template v-for="item in tableItems">
                        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" :fixed="item.fixed || false"
                                         :min-width="item.minWidth || 130" :sortable="item.sortable" />
                    </template>
                </JNPF-table>
                <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                            @pagination="initData" />
            </div>
        </div>
        <!-- 批量设置价格 -->
        <el-dialog v-if="analyseDialog" title="批量设置重量" :close-on-click-modal="false" append-to-body
                   :visible.sync="analyseDialog" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
            <el-row :gutter="15" style="margin-top: 0px;">
                <el-form ref="elForm" :model="dataForm" label-position="top" :rules="dataFormRules">
                    <el-row :gutter="30">
                            <el-col :sm="24">
                                <el-form-item prop="weight" label="重量">
                                    <el-input v-model="dataForm.weight" placeholder="请输入重量" />
                                </el-form-item>
                            </el-col>
                            <el-col :sm="24">
                                <el-form-item prop="remark" label="备注">
                                    <el-input type="textarea" :rows="2" v-model="dataForm.remark" placeholder="请输入备注" />
                                </el-form-item>
                            </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel">{{ $t('common.cancelButton') }}</el-button>
                <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
                  {{ $t('common.submitButton') }}
                </el-button>
            </span>
        </el-dialog>
        <!-- 高级查询 -->
        <SuperQuery :tableRef="'dataTable'" :show="superQueryVisible" ref="SuperQuery" :columnOptions="[]"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />
        <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { batchAddProductProcessWeight, productProcessWeightList, uploadProductProcess } from '@/api/bimProcess'
import UploadDataButton from '@/components/UploadDataButton/index.vue'
export default {
    components: { UploadDataButton, SuperQuery, ExportForm },
    name:'productProcessWeight',
    data() {
        return {
            priceTypeName: '',
            uploadVisib: false,
            exportFormVisible: false,
            searchList: [
                {
                    prop: 'weightFlag',
                    label: '是否有重量',
                    type: 'select',
                    options: [{ label: '无重量', value: false }, { label: '有重量', value: true }, { label: '所有', value: '' }]
                },
                { prop: 'drawingNo', label: '品名规格', type: 'input' },
                { prop: 'processName', label: '工序名称', type: 'input' }
            ],
            superQueryVisible: false,
            tableData: [],
            tableItems:[
                { prop: 'productsCode', label: '产品编码', minWidth: '160', sortable: 'custom' },
                { prop: 'productsName', label: '产品名称', minWidth: '160', sortable: 'custom' },
                { prop: 'drawingNo', label: '品名规格', minWidth: '160', sortable: 'custom' },
                { prop: 'processName', label: '工序名称', minWidth: '140', sortable: 'custom' },
                { prop: 'processCode', label: '工序编码', minWidth: '140', sortable: 'custom' },
                { prop: 'weight', label: '重量', minWidth: '140', sortable: 'custom' },
            ],
            listLoading: false,
            listQuery: {},
            initListQuery: {
                "createByName": "",
                "drawingNo": "",
                "endTime": "",
                "endUpdateTime": "",
                "keyword": "",
                "orderEndDate": "",
                "orderItems": [
                    {
                        "asc": true,
                        "column": ""
                    }
                ],
                "orderStartDate": "",
                "pageNum": 1,
                "pageSize": 20,
                "processId": '',
                "processName": "",
                "productsCode": "",
                "productsId": '',
                "productsName": "",
                "startTime": "",
                "startUpdateTime": "",
                "superQuery": {},
                "totalRowFlag": false,
                "weightFlag": false
            },
            total: 0,
            formVisible: false,
            analyseDialog: false,
            btnLoading: false,
            dataForm: {
                weight: '',
                remark: ''
            },
            dataFormRules: {
                weight: [
                    { validator: this.formValidate({ type: 'decimal', params: [10, 4, '', (errMsg) => { }] }), trigger: 'blur' },
                    {
                        validator: this.formValidate('noZero', '', (errMsg) => {
                            this.$message.error('重量不能为0')
                        }),
                        trigger: 'blur'
                    },
                    { required: true, message: '重量不能为空', trigger: 'blur' }
                ],
            },
            selectedData: [],
            basicQuery: {},
            superQuery: {},
            detailTableItems: []
        }
    },
    async created() {
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
        this.initData()
    },
    methods: {
        uploadProductProcess,
        superQuerySearch(query) {
            this.superQuery = query
            this.superQueryVisible = false
            this.search('super')
        },
        columnSetFun() {
            this.$refs.dataTable.showDrawer()
        },

        // 导出
        exportForm() {
            this.exportFormVisible = true
            let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
            columnList = columnList.map((item) => {
                return { label: item.label, prop: item.prop }
            })
            this.$nextTick(() => {
                this.$refs.exportForm.init(columnList)
            })
        },
        download(data) {
            if (data) {
                this.exportFormVisible = false
                let includeFieldMap = {}
                for (let i = 0; i < data.selectKey.length; i++) {
                    includeFieldMap[data.selectKey[i]] = data.selectVal[i]
                }
                let _data = {
                    ...this.listQuery,
                    exportType: '1260',
                    exportName: `产品工序重量信息`,
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

        importDataSuccess(){
            this.initData()
        },
        sortChange({ prop, order }) {
            let newProp
                if (['productsCode', 'productsName', 'processName', 'processCode'].includes(prop)) {
                    newProp = prop
                } else {
                    newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
                }
            this.listQuery.orderItems[0].asc = order === 'ascending'
            this.listQuery.orderItems[0].column = order === null ? '' : newProp
            this.initData()
        },


        initData() {
            this.listLoading = true
            productProcessWeightList(this.listQuery).then((res) => {
                    this.tableData = res.data.records
                    this.total = res.data.total
                    this.listLoading = false
                })
                .catch(() => {
                    this.listLoading = false
                })
        },
        selectChange(val) {
            this.initData()
        },
        search(type) {
            Object.keys(this.listQuery).forEach((key) => {
                let item = this.listQuery[key]
                this.listQuery[key] = typeof item === 'string' ? item.trim() : item
            })
            this.listQuery.pageNum = 1
            this.initData()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.searchList = [
                { prop: 'weightFlag', label: '是否有重量', type: 'select', options: [{ label: '无重量', value: false }, { label: '有重量', value: true }, { label: '所有', value: '' }] },
                { prop: 'drawingNo', label: '品名规格', type: 'input' },
                { prop: 'processName', label: '工序名称', type: 'input' }
            ]
            this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
            this.initData()
        },
        currentChange(data) {
            this.selectedData = data
        },
        async handleBatch() {
            if (!this.selectedData.length) return this.$message.error('请至少选择一条工序数据')
            this.btnLoading = false
            this.dataForm = {
                weight: '',
                remark:''
            }
            this.analyseDialog = true
        },
        async dataFormSubmit() {
            this.btnLoading = true
            let submitFlag = true
            const form_1 = this.$refs.elForm
            const valid_1 = await form_1.validate().catch((err) => false)
            if (!valid_1 && submitFlag) {
                submitFlag = false
                this.jnpf.focusErrValidItem(form_1.fields)
            }
            if (submitFlag) {
                let arr = this.selectedData.map(item=>{
                    return {
                        ...item,
                        weight: this.dataForm.weight,
                        remark: this.dataForm.remark,
                    }
                })
                batchAddProductProcessWeight(arr)
                    .then((res) => {
                        this.$message.success('设置成功')
                        this.selectedData = []
                        this.$refs.dataTable.$refs.JNPFTable.clearSelection()
                        this.analyseDialog = false
                        this.dataForm = {
                            weight: '',
                            remark:''
                        }
                        this.search()
                    })
                    .catch((err) => {
                        this.btnLoading = false
                    })
            } else {
                this.btnLoading = false
            }
        },
        cancel(){
            this.analyseDialog = false
            this.initData()
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

.el-tabs__nav-scroll {
    padding-left: 0;
}
</style>
