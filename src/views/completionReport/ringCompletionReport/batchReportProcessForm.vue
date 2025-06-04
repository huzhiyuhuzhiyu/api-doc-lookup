<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main org-form" ref="main">
            <div :class="['JNPF-common-page-header']">
                <el-page-header @back="$emit('close',true)" content="工序批量报工"/>
                <div class="options">
                    <el-button type="primary" :disabled="!linesList.length" :loading="btnLoading"
                               @click="handleConfirm()"
                    >
                        保存并提交
                    </el-button>
                    <el-button @click="$emit('close',true)">{{ $t('common.cancelButton') }}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="JNPF-common-layout">
                    <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="formLoading">
                        <div class="JNPF-common-layout-main JNPF-flex-main">
                            <div style="height: 100%">
                                <JNPF-col-table v-keyboard-focus :value="linesList" ref="tableForm" :tableItems="linesListItems" :btnType="btnType">
                                    <template slot="actions">
                                        <el-table-column label="操作" width="220" v-if="btnType !== 'look'" fixed="right" key="actions">
                                            <template slot-scope="scope">
                                                <el-button type="text" @click="setResponsWasteM(scope.row, scope.$index)" size="mini">
                                                    设置责废原因
                                                </el-button>
                                                <el-button type="text" @click="setMaterialWasteM(scope.row, scope.$index)" size="mini">
                                                    设置料废原因
                                                </el-button>
                                            </template>
                                        </el-table-column>
                                    </template>
                                </JNPF-col-table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MaterialWasteForm v-if="materialWasteFormVisible" ref="materialWasteFormRef" @change="materialWasteData">
            </MaterialWasteForm>
            <responsWaste v-if="responsWasteFormVisible" ref="responsWasteFormRef" @change="responsWasteData">
            </responsWaste>
        </div>
    </transition>
</template>

<script>

import { deepClone } from '@/utils'
import { addWorkReport, prodOrderUpdateSort } from '@/api/productOrdes'
import MaterialWasteForm from '@/views/completionReport/ringCompletionReport/materialWasteForm.vue'
import responsWaste from '@/views/completionReport/ringCompletionReport/responsWaste.vue'
import { getbimProductAttributesListMap } from '@/api/masterDataManagement'
import TenantMinix from '@/mixins/generator/TenantMinix'

export default {
    name: 'batchReportProcessForm',
    components: { responsWaste, MaterialWasteForm },
    mixins: [TenantMinix],
    data() {
        return {
            materialWasteDataList: [],
            responsWasteDataList:[],
            materialWasteFormVisible:false,
            responsWasteFormVisible:false,
            formLoading: false,
            btnType: 'add',
            btnLoading: false,
            linesListItems: [],
            linesList: [],
            currentIndex:0,
            bimProductAttributesList:[]
        }
    },
    created() {

    },
    methods: {
        setLinesListItems() {
            this.linesListItems = [
                { prop: 'processName', label: '工序名称', value: '', type: 'view', minWidth: 160 },
                { prop: 'orderNo', label: '生产任务单号', value: '', type: 'view', minWidth: 160 },
                { prop: 'productDrawingNo', label: '品名规格', value: '', type: 'view', minWidth: 160 },
                { prop: 'productCode', label: '产品编码', value: '', type: 'view', minWidth: 160 },
                { prop: 'productName', label: '产品名称', value: '', type: 'view', minWidth: 160,render:this.$store.getters.configData.product.enable_productName },
                { prop: 'productionQuantity', label: '加工数量', value: '', type: 'view', minWidth: 160 },
                { prop: 'waitReportNum', label: '可报工数量', value: '', type: 'view', minWidth: 160 },
                // { prop: 'reportingQuantity', label: '报工数量', value: '', type: 'view', minWidth: 160 },
                { prop: 'unqualifiedQuantity', label: '不合格数量', value: '', type: 'view', minWidth: 160 },
                { prop: 'productionBarrels', label: '生产桶数', value: '', type: 'input', minWidth: 160,render:this.isJROrXY },
                { prop: 'productionWeight', label: '生产重量', value: '', type: 'input', minWidth: 160,change:this.changeQualified,render:this.isJROrXY },
                {
                    prop: 'qualifiedQuantity', label: '合格数量', value: '', type: 'input', minWidth: 160,
                    itemRules: [
                        { required: true, trigger: 'blur' },
                        {
                            validator: this.formValidate({
                                type: 'decimal', params: [20, 4, '', (errMsg, index) => {
                                    this.$message.error(`第${index + 1}行合格数量：` + errMsg)
                                }]
                            }),
                            trigger: 'blur'
                        },
                        {
                            validator: this.formValidate({
                                type: 'calc',
                                params: [(rowIndex, value) => this.jnpf.numberFormat(this.jnpf.math('add', [this.linesList[rowIndex].qualifiedQuantity, this.linesList[rowIndex].unqualifiedQuantity]),6) <= this.linesList[rowIndex].waitReportNum * 1, `不能超过对应可报工数量`, (errMsg) => {
                                    this.$message.error('合格数量：' + errMsg)
                                }]
                            }), trigger: 'blur'
                        },
                        {
                            validator: this.formValidate({
                                type: 'noEmtry',
                                params: ['合格数量不能为空', (errMsg, index) => {
                                    this.$message.error(`第${index + 1}行合格数量：` + errMsg)
                                }]
                            }), trigger: 'blur'
                        }
                    ]
                },
                { prop: 'standardValue', label: '规值', value: '', type: 'select', options: this.bimProductAttributesList['pa008'].map(item=>{
                        return {
                            label:item.name,
                            value:item.name,
                        }
                    }), minWidth: 160 },
                {
                    prop: 'accuracyLevel',
                    label: this.$store.getters.accuracyLevel,
                    value: '',
                    type: 'select',
                    options: this.bimProductAttributesList['pa006'].map(item=>{
                        return {
                            label:item.name,
                            value:item.name,
                        }
                    }),
                    minWidth: 160
                },
                { prop: 'responsibilityWasteQuantity', label: '责废数量', value: '', type: 'input', minWidth: 160,disabled:true },
                { prop: 'materialWasteQuantity', label: '料废数量', value: '', type: 'input', minWidth: 160,disabled:true },
                { prop: 'reportingTime', label: '报工时间', value: this.jnpf.getToday('YYYY-MM-DD HH:mm:ss'), type: 'date', minWidth: 180 },

                {
                    prop: 'producerId',
                    label: '生产人',
                    value: '',
                    type: 'custom',
                    customComponent: 'user-select',
                    change: this.selectProducer,
                    minWidth: 180,
                    itemRules: [
                        {
                            validator: this.formValidate({
                                type: 'noEmtry',
                                params: ['生产人不能为空', (errMsg, index) => {
                                    this.$message.error(`第${index + 1}行生产人：` + errMsg)
                                }]
                            }), trigger: 'blur'
                        },
                        { required: true, trigger: 'blur' },
                    ]
                },
                { prop: 'remark', label: '备注', value: '', type: 'input', minWidth: 160 }
            ]
            this.$nextTick(() => {
                this.$refs.tableForm.setDefaultValue()
            })
        },
        changeQualified(val,scope){
            if (this.$store.getters.configData.produce.steelBallTask) {
                if (scope.row.weight && scope.row.quantity && val){
                    let calcWQ = this.jnpf.math('divide',[scope.row.productionWeight,scope.row.weight])
                    this.linesList[scope.$index].qualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('multiply',[calcWQ,scope.row.quantity]),6)
                }
            }
        },
        setMaterialWasteM(row,index) {
            this.currentIndex = index
            console.log("this.materialWasteDataList", this.materialWasteDataList);
            this.materialWasteFormVisible = true
            this.$nextTick(() => {
                this.$refs.materialWasteFormRef.init(JSON.parse(JSON.stringify(this.materialWasteDataList)), row.materialWasteQuantity,row.projectId)
            })
        },
        // 设置责废原因
        setResponsWasteM(row,index) {
            this.currentIndex = index
            console.log("this.responsWasteDataList", this.responsWasteDataList);
            this.responsWasteFormVisible = true
            this.$nextTick(() => {
                this.$refs.responsWasteFormRef.init(JSON.parse(JSON.stringify(this.responsWasteDataList)), row.responsibilityWasteQuantity,row.projectId)
            })
        },
        materialWasteData(data,totalNums) {
            console.log("设置的设置料废原因", data,totalNums);
            if(totalNums){
                this.materialWasteDataList = data
                this.linesList[this.currentIndex].materialWasteQuantity = totalNums
                this.handleBlur2()
            }
        },
        responsWasteData(data,totalNums){
            console.log("责废数据",data,totalNums);
            this.responsWasteDataList = data
            if(totalNums){
                this.linesList[this.currentIndex].responsibilityWasteQuantity = totalNums
                this.handleBlur2()
            }
        },
        handleBlur2() {
            this.linesList[this.currentIndex].unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.linesList[this.currentIndex].materialWasteQuantity, this.linesList[this.currentIndex].responsibilityWasteQuantity]), 6)
        },
        selectProducer(val,data) {
            console.log(data,'data')
            let tempList = JSON.parse(JSON.stringify(this.linesList))
            tempList.forEach(item => {
                this.$set(item, 'producerId', item.producerId || val)
                this.$set(item, 'producerName', item.producerName || data.fullName)
            })
            this.linesList = JSON.parse(JSON.stringify(tempList))
        },
        async init(data) {
            const res = await getbimProductAttributesListMap()
            this.bimProductAttributesList = res.data
            console.log(data, 'data')
            let _data = data.map(item => {
                delete item.stockFlag
                return {
                    ...item,
                    remark:item.remark || '',
                    producerId: item.producerId || '',
                    mainProductionWeight:item.productionWeight,
                    unqualifiedQuantity:this.jnpf.numberFormat(this.jnpf.math('add', [item.materialWasteQuantity, item.responsibilityWasteQuantity]), 6),
                    qualifiedQuantity:+item.qualifiedQuantity || Math.floor((Number(item.productionWeight) / Number(item.weight) *Number(item.quantity)) * 10000) / 10000
                }
            })
            this.linesList = deepClone(_data)
            this.setLinesListItems()
        },
        async handleConfirm() {
            this.btnLoading = true
            let submitFlag = true
            if (!this.linesList.length && submitFlag) {
                submitFlag = false
                this.$message.error('请至少添加一个工序进行报工')
            }
            // 校验表单表格（子数据列表）
            let form_2 = this.$refs['tableForm'].$refs.main
            let valid_2 = await form_2.validate().catch((err) => false)
            if (!valid_2 && submitFlag) {
                submitFlag = false
                this.jnpf.focusErrValidItem(form_2.fields)
                this.btnLoading = false
            }
            if (submitFlag) {
                let _data = this.linesList.map(item=>{
                    return {
                        ...item,
                        reportingQuantity:this.jnpf.numberFormat(this.jnpf.math('add', [item.qualifiedQuantity, item.unqualifiedQuantity, item.reworkQuantity]), 6),
                        reportingType : "normal",
                        workOrderId:item.id,
                        causesList:[...this.materialWasteDataList,...this.responsWasteDataList]

                    }
                })
                addWorkReport(_data).then(res => {
                    this.$message({
                        message: '提交成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.btnLoading = false
                            this.$emit('close', true)
                        }
                    })
                }).catch((err) => {
                    this.btnLoading = false
                })
            }

        }
    }
}
</script>

<style scoped lang="scss">
::v-deep .el-form {
    height: calc(100% - 34px) !important;
}
</style>
