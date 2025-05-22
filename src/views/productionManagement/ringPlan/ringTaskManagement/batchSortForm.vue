<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-common-layout">
            <div class="JNPF-common-layout-center JNPF-flex-main">
                <div class="JNPF-preview-main org-form" ref="main">
                    <div :class="['JNPF-common-page-header']">
                        <el-page-header @back="$emit('close',true)" content="任务批量排序"  />
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
                                        <JNPF-col-table  :value="linesList"  ref="tableForm" :tableItems="linesListItems" :btnType="btnType"  @deleteth="addOrDelLinesItem" />
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
import { prodOrderUpdateSort } from '@/api/productOrdes'

export default {
    name: 'batchSortForm',
    data(){
        return {
            formLoading:false,
            btnType:'add',
            btnLoading:false,
            linesListItems: [
                { prop: 'orderNo', label: '生产任务单号', value: '', type: 'view', minWidth: 160 },
                { prop: 'sort', label: '排序', value: '', type: 'input', maxlength: 200, minWidth: 160,
                    itemRules:[
                        { required:true,trigger:'blur'},
                        { validator: this.formValidate('number','',(errMsg,index)=>{this.$message.error(`任务信息第${index + 1}行：排序值${errMsg}`)}), trigger: 'blur' }
                    ],
                }
            ],
            linesList:[],
        }
    },
    created() {

    },
    methods: {
        init(data){
            this.linesList = deepClone(data)

        },
        addOrDelLinesItem(data) {
            let type = Array.isArray(data) ? 'Array' : 'Object'

            if (type === 'Object') {
                this.linesList.splice(data.$index, 1)
            } else {
                let tempList = JSON.parse(JSON.stringify(this.linesList))
                let hasItemList = []
                for (let i = 0; i < data.length; i++) {
                    let item = data[i]
                    item.productCode = item.code
                    item.remark = ''
                    const hasFlag = this.linesList.some((i) => item.productId === i.productId)
                    if (hasFlag) {
                        hasItemList.push(item.productName)
                    } else {
                        tempList.push(item)
                    }
                    if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
                }
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
                this.$message.error('请至少添加一个任务进行修改排序')
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
                prodOrderUpdateSort(this.linesList).then(res=>{
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
