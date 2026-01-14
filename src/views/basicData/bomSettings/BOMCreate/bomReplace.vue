<template>
<!--    <div>-->
        <el-drawer :title="btnType === 'look' ? '查看替代产品' : '设置替代产品'" :visible.sync="drawer"  :wrapperClosable="false" append-to-body
                    size="45%" columnSettings-drawer class="JNPF-common-drawer columnSettings-drawer">
            <div ref="main" class="JNPF-flex-main">
                <el-scrollbar  class="column-list" style="height: 100%;">
                    <TableForm-product :value="replaceLines" @input="contentChanges" ref="tableForm"
                                       :tableItems="replaceListItems" :btnType="btnType" @addth="addOrDelLinesItem"
                                       @deleteth="addOrDelLinesItem"  :isProjectSwitch="isProjectSwitch"
                                       :projectId="projectId" :isProductNameSwitch="isProductNameSwitch"
                    />
                </el-scrollbar>
                <div class="footer">
                    <el-button @click="drawer = false">{{ $t('common.cancelButton') }}</el-button>
                    <el-button :loading="btnLoading" type="primary" @click="submitBomReplace()" v-if="btnType !== 'look'">
                        {{ $t('common.confirmButton') }}
                    </el-button>
                </div>
            </div>
        </el-drawer>
<!--    </div>-->
</template>
<script>
import TableFormProduct from '@/views/basicData/bomSettings/BOMCreate/component/TableForm-product/index.vue'

export default {
    name: 'bomReplace',
    components: { TableFormProduct },
    props:['projectId','isProjectSwitch','isProductNameSwitch','btnType','dataForm'],
    data(){
        return {
            drawer: false,
            replaceLines:[],
            replaceListItems: [
                { prop: 'drawingNo', label: '型号', value: '', type: 'view', minWidth: 340 },
                { prop: 'classTypeName', label: '产品类型', value: '', type: 'view', minWidth: 160 },
                { prop: 'productCode', label: '产品编码', value: '', type: 'view', minWidth: 160 },
                {
                    prop: 'qty',
                    label: '数量',
                    value: '1',
                    type: 'input',
                    disabled: this.btnType === 'look',
                    itemRules: [
                        { required: true, trigger: 'blur' },
                        {
                            validator: this.formValidate({
                                type: 'decimal',
                                params: [
                                    20,
                                    4,
                                    '',
                                    (errMsg) => {
                                        this.$message.error('数量：' + errMsg)
                                    }
                                ]
                            }),
                            trigger: 'blur'
                        }
                    ],
                    minWidth: 120
                },
                { prop: 'mainUnit', label: '单位', value: '', type: 'view', minWidth: 60 },
                {
                    prop: 'lossRate',
                    label: '损耗率(%)',
                    value: '0',
                    type: 'input',
                    placeholder: '请输入损耗率',
                    disabled: this.btnType === 'look',
                    itemRules: [
                        { required: true, trigger: 'blur' },
                        {
                            validator: this.formValidate({
                                type: 'decimal',
                                params: [
                                    10,
                                    2,
                                    '',
                                    (errMsg) => {
                                        this.$message.error('损耗率：' + errMsg)
                                    }
                                ]
                            }),
                            trigger: 'blur'
                        }
                    ],
                    minWidth: 120
                },
                {
                    prop: 'fixedLoss',
                    label: '固定损耗',
                    value: '0',
                    type: 'input',
                    disabled: this.btnType === 'look',
                    itemRules: [
                        { required: true, trigger: 'blur' },
                        {
                            validator: this.formValidate({
                                type: 'decimal',
                                params: [
                                    10,
                                    2,
                                    '',
                                    (errMsg) => {
                                        this.$message.error('固定损耗：' + errMsg)
                                    }
                                ]
                            }),
                            trigger: 'blur'
                        }
                    ],
                    minWidth: 120
                },
                {
                    prop: 'reduceType',
                    label: '扣减料方式',
                    value: 'picking',
                    type: 'select',
                    disabled: this.btnType === 'look',
                    options: [
                        { label: '生成领料单', value: 'picking' },
                        { label: '自动扣减料', value: 'auto' },
                        { label: '都不是', value: 'none' }
                    ],
                    itemRules: [{ required: true, trigger: 'change' }],
                    minWidth: 160,
                },
                { prop: 'remark', label: '备注', value: '', type: 'input', maxlength: 200, minWidth: 160,disabled: this.btnType === 'look', }
            ],
            bomLineIndex:null,
            btnLoading:false,
        }
    },
    methods:{
        init(data,replaceLines){
            console.log('init')
            console.log('data',data)
            this.bomLineIndex = data.$index
            this.replaceLines = replaceLines
            this.drawer = true
            this.btnLoading = false
        },
        contentChanges(dataOrIndex, prop, value) {
            if (Array.isArray(dataOrIndex)) {
                this.replaceLines = JSON.parse(JSON.stringify(dataOrIndex))
            } else if (prop) {
                this.replaceLines[dataOrIndex][prop] = value
            }
        },
        // 对应子数据新增或删除行
        addOrDelLinesItem(data) {
            let type = Array.isArray(data) ? 'Array' : 'Object'

            if (type === 'Object') {
                this.replaceLines.splice(data.$index, 1)
            } else {
                if (this.dataForm.classAttribute === 'semi_finished' && this.dataForm.productSource === 'out') {
                    if (this.replaceLines.length === 0) {
                        if (data.length > 1) return this.$message.error('半成品产品来源是外协时，创建BOM的子件，只能选择一个子件')
                    } else {
                        return this.$message.error('半成品产品来源是外协时，创建BOM的子件，只能选择一个子件')
                    }
                }
                let tempList = JSON.parse(JSON.stringify(this.replaceLines))
                let hasItemList = []
                for (let i = 0; i < data.length; i++) {
                    let item = data[i]
                    item.productCode = item.code
                    item.remark = ''
                    const hasFlag = this.replaceLines.some((i) => item.productId === i.productId)
                    if (hasFlag) {
                        hasItemList.push(item.productName)
                    } else {
                        tempList.push(item)
                    }
                    if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
                }
                this.replaceLines = JSON.parse(JSON.stringify(tempList))
                this.$nextTick(() => {
                    this.$refs.tableForm.setDefaultValue()
                    // 审批
                    // this.getApproverData()
                })
            }
        },
        async submitBomReplace(){
            let submitFlag = true
            this.btnLoading = true
            // 校验表单表格（子数据列表）
            let form_2 = this.$refs['tableForm'].$refs.main
            let valid_2 = await form_2.validate().catch((err) => false)
            if (!valid_2 && submitFlag) {
                submitFlag = false
                this.jnpf.focusErrValidItem(form_2.fields)
                this.btnLoading = false
            }
            let index = this.replaceLines.findIndex((line) => line.productId === this.dataForm.productId)
            if (index !== -1) {
                this.$message.error(`替代产品第${index + 1}行：替换产品不能与主产品相同`)
                submitFlag = false
            }
            if (submitFlag) {
                this.drawer = false
                this.$emit('submitBomReplace', this.replaceLines,this.bomLineIndex)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.columnSettings-drawer {
    font-size: 16px;

    .JNPF-flex-main {
        overflow: hidden;
    }

    .columnSetting-head {
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        font-size: 14px;
        color: #303133;
    }

    .column-list {
        height: 100%;
        padding: 8px 10px 0;

        .column-item {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0;
            font-size: 12px;
            color: #303133;
            cursor: pointer;
            border-bottom: 1px solid #e3e6eb;

            &:hover {
                background: rgba(25, 144, 250, 0.1);
            }

            .column-item-icon {
                margin: auto 8px auto 10px;
                color: #909399;
                cursor: move;
                font-size: 14px;
            }

            .el-switch {
                transform: scale(0.8);
            }

            .column-item-label {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                word-break: break-all;
                display: flex;
                align-items: center;
            }

            .check-box {
                margin-right: 16px;
            }
        }
    }

    .footer {
        margin: 4px 20px 20px;
        display: flex;
        justify-content: flex-end;
    }

    .topButton {
        margin-right: 8px;
        margin-left: 8px;
        font-size: 14px !important;
    }

    .noDataTip {
        text-align: center;
        padding: 10%;
        color: #aaa;
    }

    .viewData {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
