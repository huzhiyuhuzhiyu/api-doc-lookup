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

                            <el-date-picker v-else-if="item.type === 'date'" v-model="listQuery.reconciliationDateArr"
                                            type="daterange" value-format="yyyy-MM-dd" style="width: 100%;" :start-placeholder="item.label + '开始日期'"
                                            :end-placeholder="item.label + '结束日期'"></el-date-picker>
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
                        <el-button size="mini" type="primary" icon="el-icon-plus" @click="importForm">导入</el-button>
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
                    <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row, 'look')">查看详情</el-button>
                        </template>
                    </el-table-column>
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
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
                    @superQuery="superQuerySearch" @close="superQueryVisible = false" />
        <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
        <!-- 导入产品 -->
        <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
                   :http-request="UploadProduct" />

        <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
                   :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
            <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
                       :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text"><em>点击选取文件上传</em></div>
                <div class="el-upload__tip" slot="tip">
                    只能上传.xls/.xlsx文件
                    <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">
                        下载模板
                    </el-button>
                </div>
            </el-upload>

            <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="saveSubmit()">
          提交
        </el-button>
      </span>
        </el-dialog>
        <depForm :priceType="priceType" :listMethod="listMethod" :delMethod="delMethod" :tableItems="detailTableItems"
                 :superQueryJson="superQueryJson" :columnList="columnList" v-if="formVisible" ref="depForm" @close="closeForms" />
    </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import depForm from './depForm.vue'
import { productProcessWeightList } from '@/api/bimProcess'
export default {
    components: { SuperQuery, ExportForm, depForm },
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
                    options: [{ label: '无重量', value: 0 }, { label: '有重量', value: 1 }, { label: '所有', value: '' }]
                },
                { prop: 'drawingNo', label: '品名规格', type: 'input' },
                { prop: 'processName', label: '工序名称', type: 'input' }
            ],
            superQueryVisible: false,
            tableData: [],
            tableItems:[
                { prop: 'productsCode', label: '产品编码', minWidth: '160', sortable: 'custom' },
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
            processFlag: false,
            inspectionFlag: false,
            dataForm: {
                pricingType: '',
                effectiveDate: '',
                timePrice: '',
                unitPrice: ''
            },
            dataFormRules: {
                pricingType: [{ required: true, message: '计价类型不能为空', trigger: 'change' }],
                timePrice: [
                    { validator: this.formValidate({ type: 'decimal', params: [10, 4, '', (errMsg) => { }] }), trigger: 'blur' },
                    {
                        validator: this.formValidate('noZero', '', (errMsg) => {
                            this.$message.error('计时单价不能为0')
                        }),
                        trigger: 'blur'
                    },
                    { required: true, message: '计时单价不能为空', trigger: 'blur' }
                ],
                unitPrice: [
                    { validator: this.formValidate({ type: 'decimal', params: [10, 4, '', (errMsg) => { }] }), trigger: 'blur' },
                    {
                        validator: this.formValidate('noZero', '', (errMsg) => {
                            this.$message.error('正品单价不能为0')
                        }),
                        trigger: 'blur'
                    },
                    { required: true, message: '正品单价不能为空', trigger: 'blur' }
                ],
                machinesPrice: [
                    { validator: this.formValidate({ type: 'decimal', params: [10, 4, '', (errMsg) => { }] }), trigger: 'blur' },
                    {
                        validator: this.formValidate('noZero', '', (errMsg) => {
                            this.$message.error('机器检验价格不能为0')
                        }),
                        trigger: 'blur'
                    },
                    { required: true, message: '机器检验价格不能为空', trigger: 'blur' }
                ],
                effectiveDate: [{ required: true, message: '生效日期不能为空', trigger: 'change' }]
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

        // 导入
        importForm() {
            this.uploadVisib = true
        },
        handleRemove(file, fileList) { },
        handlePreview(file) { },
        handleFileChange(file) {
            this.file = file.raw
        },
        // 下载模板
        downLoadTemplate() {
            const a = document.createElement('a')
            a.setAttribute('download', '')

            a.setAttribute('href', location.origin + `/static/产品工序重量导入模板.xlsx`)

            a.click()
        },
        // 上传产品
        UploadProduct(data) {
            this.loadingText = '正在导入数据'
            this.formLoading = true
            var formData = new FormData()
            formData.append('file', data)
            //调用上传文件接口
            this.uploadMethod(formData)
                .then((res) => {
                    if (!res.data) {
                        this.$message.success(`导入成功`)
                        this.uploadVisib = false
                        this.$refs['UploadProduct']
                        this.initData()
                    } else {
                        this.uploadVisib = false
                        this.handleMessage(res.data)
                    }
                    this.formLoading = false
                    this.loadingText = ''
                })
                .catch((err) => {
                    this.uploadVisib = false
                    this.$message.error(`导入失败`)
                    this.formLoading = false
                    this.loadingText = ''
                })
        },
        // 导入产品  下载导入错误数据
        downNoProduct(res) {
            this.jnpf.downloadFile(res.url, res.name)
            this.uploadVisib = false
            this.$refs['uploadRef'].clearFiles()
        },
        cancelFun() {
            this.uploadVisib = false
            this.$refs['uploadRef'].clearFiles()
        },
        saveSubmit() {
            if (!this.file) return this.$message.error('请上传文件')
            this.UploadProduct(this.file)
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
                        h('p', { style: 'font-size:14px;' }, '导入成功，存在产品工序重量导入相关错误！'),
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
        sortChange({ prop, order }) {
            let newProp
            if (this.processFlag) {
                if (['productsCode', 'productsName', 'processName', 'processCode'].includes(prop)) {
                    newProp = prop
                } else {
                    newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
                }
            } else {
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
            // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
            if (type === 'basic') {
                this.basicQuery = {
                    matchLogic: 'AND',
                    condition: this.searchList
                        .filter((item) => item.fieldValue)
                        .map((item) => {
                            return {
                                ...item,
                                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
                            }
                        })
                }
                this.listQuery.superQuery = this.basicQuery
            }
            if (type === 'super') {
                this.listQuery.superQuery = this.superQuery
            }

            this.initData()
        },
        reset() {
            this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
            this.searchList = [
                { prop: 'weightFlag', label: '是否有重量', type: 'select', options: [{ label: '无重量', value: 0 }, { label: '有重量', value: 1 }, { label: '所有', value: '' }] },
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
                let arr = [...this.selectedData]
                arr.forEach((item) => {
                    item.pricingType = this.dataForm.pricingType
                    item.effectiveDate = this.dataForm.effectiveDate + ' 00:00:00'
                    if (this.inspectionFlag) {
                        item.priceType = this.priceType
                        if (item.pricingType === 'by_time') {
                            item.timePrice = this.dataForm.timePrice
                        } else if (item.pricingType === 'by_piece') {
                            item.unitPrice = this.dataForm.unitPrice
                            item.machinesPrice = this.dataForm.machinesPrice
                        }
                    } else {
                        if (this.processFlag) {
                            item.priceType = this.priceType
                            if (item.pricingType === 'by_time') {
                                item.timePrice = this.dataForm.timePrice
                            } else if (item.pricingType === 'by_piece') {
                                item.unitPrice = this.dataForm.unitPrice
                            }
                        } else {
                            item.attributeType = this.priceType
                            item.unitPrice = this.dataForm.unitPrice
                        }
                    }

                })

                this.batchMethod(arr)
                    .then((res) => {
                        this.$message.success('单价设置成功')
                        this.selectedData = []
                        this.$refs.dataTable.$refs.JNPFTable.clearSelection()
                        this.analyseDialog = false
                        this.dataForm = {
                            pricingType: '',
                            timePrice: '',
                            unitPrice: ''
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
        pricingTypeChange(val) {
            this.dataForm.pricingType = val
            this.$nextTick(() => {
                this.$refs['elForm'].clearValidate()
            })
        },
        addOrUpdateHandle(row, type) {
            this.formVisible = true
            let listDetailQuery = { ...this.listQuery }
            delete listDetailQuery.effectFlag
            listDetailQuery.productsId = row.productsId
            listDetailQuery.processId = row.processId
            listDetailQuery.pricingFlag = ''
            listDetailQuery.orderItems = [
                {
                    asc: true,
                    column: 'effective_date'
                }
            ]
            console.log(this.tableItems, 'this.tableItems')
            this.detailTableItems = []
            this.detailTableItems = [...this.tableItems]
            console.log(this.detailTableItems, 'deee')
            let index = this.detailTableItems.findIndex((obj) => obj.prop === 'effectiveDate')
            this.detailTableItems.splice(index + 1, 0, { prop: 'expiringDate', label: '失效日期', minWidth: '160' })
            this.$nextTick(() => {
                this.$refs.depForm.init(JSON.stringify(listDetailQuery), type)
            })
        },
        // 关闭 收款新建、编辑页面
        closeForms(isRefresh) {
            this.collectionVisibled = false
            this.makeVisibled = false
            this.formVisible = false
            if (isRefresh) {
                this.initData()
            }
        }
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
