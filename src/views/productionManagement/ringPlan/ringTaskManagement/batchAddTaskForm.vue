<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-common-layout">
            <div class="JNPF-common-layout-center JNPF-flex-main">
                <div class="JNPF-preview-main org-form" ref="main">
                    <div :class="['JNPF-common-page-header']">
                        <el-page-header @back="$emit('close',true)" content="任务批量复制"  />
                        <div class="options">
                            <el-button type="primary" :disabled="!linesList.length" :loading="btnLoading" @click="handleConfirm()">
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
                                        <div v-if="btnType !== 'look'">
                                            <el-button :disabled="linesList.length >= maxTaskLength" type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus"
                                                       @click="addLine">新增一行</el-button>
                                        </div>
                                        <JNPF-col-table v-keyboard-focus  :value="linesList"  ref="tableForm" :tableItems="linesListItems" :btnType="btnType"  @deleteth="addOrDelLinesItem" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>

import { deepClone } from '@/utils'
import { batchCopyTask, prodOrderUpdateSort } from '@/api/productOrdes'

export default {
    name: 'batchAddTaskForm',
    data(){
        return {
            formLoading:false,
            btnType:'add',
            btnLoading:false,
            linesListItems: [
                { prop: 'orderNo', label: '生产任务单号', value: '', type: 'input', minWidth: 180 ,
                    itemRules:[
                        { validator: this.formValidate({ type: 'noEmtry', params: ['', (errMsg, index) => { this.$message.error(`第${index + 1}行：生产任务单号${errMsg}`)}] }),
                            trigger: ['blur']
                        },
                        { required:true,trigger:'blur'},
                    ],
                },
                { prop: 'productName', label: '产品名称', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'productDrawingNo', label: '品名规格', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'mainUnit', label: '单位', value: '', type: 'view', minWidth: 120 ,},
                { prop: 'productionBarrels', label: '生产桶数', value: '', type: 'view', minWidth: 120 ,},
                { prop: 'productionWeight', label: '生产重量（kg）', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'productionQuantity', label: '生产数量（万粒）', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'productionQuantity', label: '生产数量（万粒）', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'taskMethod', label: '编排任务方式', value: '', type: 'select',disabled:true,options:[{ label: "指定加工对象", value: "appoint" }, { label: "不指定加工对象", value: "not_appoint" }], minWidth: 160 ,},
                { prop: 'planStartDate', label: '计划生产开始日期', value: '', type: 'view', minWidth: 180 ,},
                { prop: 'planEndDate', label: '计划生产结束日期', value: '', type: 'view', minWidth: 180 ,},
                { prop: 'routingName', label: '工艺路线名称', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'standardValue', label: '规值', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'accuracyLevel', label: this.$store.getters.accuracyLevel, value: '', type: 'view', minWidth: 160 ,},
                { prop: 'wireHeatNumber', label: '钢丝炉号', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'rawStockMill', label: '原材料厂家', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'remark', label: '备注', value: '', type: 'view', minWidth: 160 ,},
            ],
            linesList:[],
            maxTaskLength:10,
        }
    },
    created() {

    },
    methods: {
        init(data){
            this.linesList = deepClone(data)
        },
        addLine(){
            this.linesList.push({...this.linesList[0],orderNo:''})
        },
        addOrDelLinesItem(data) {
            let type = Array.isArray(data) ? 'Array' : 'Object'

            if (type === 'Object') {
                this.linesList.splice(data.$index, 1)
            } else {
                let tempList = JSON.parse(JSON.stringify(this.linesList))
                this.linesList = JSON.parse(JSON.stringify(tempList))
                this.$nextTick(() => {
                    this.$refs.tableForm.setDefaultValue()
                })
            }
        },
        async handleConfirm(){
            this.btnLoading = true
            let submitFlag = true
            // 判断是否有子件
            if (!this.linesList.length && submitFlag) {
                submitFlag = false
                this.$message.error('请至少复制一个任务')
            }
            // 校验表单表格（子数据列表）
            let form_2 = this.$refs['tableForm'].$refs.main
            let valid_2 = await form_2.validate().catch((err) => false)
            if (!valid_2 && submitFlag) {
                submitFlag = false
                this.jnpf.focusErrValidItem(form_2.fields)
                this.btnLoading = false
            }
            if (submitFlag){
                batchCopyTask(this.linesList).then(res=>{
                    this.$message({
                        message: '提交成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.btnLoading = false
                            this.$emit('close', true)
                        }
                    })
                }).catch((err)=>{this.btnLoading = false})
            }

        },
    },
};
</script>

<style scoped lang="scss">
::v-deep .el-form{
    height: calc(100% - 34px) !important;
}
</style>
