<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main org-form transitionForm">
            <div :class="['JNPF-common-page-header']">
                <el-page-header @back="$emit('close',true)" content="新建钢球计划" />
                <div class="options">
                    <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
                        {{ $t('common.submitButton') }}
                    </el-button>
                    <el-button @click="$emit('close',true)">{{ $t('common.cancelButton') }}</el-button>
                </div>
            </div>
            <div class="main" v-loading="formLoading">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="计划信息" name="planInfo" class="orderInfo">
                        <JNPF-col v-model="dataForm" ref="dataForm" :tabContent="dataFormItems" :openMode="openMode" />
                    </el-collapse-item>
                </el-collapse>

            </div>
        </div>
    </transition>
</template>
<script>

import { getProducts } from '@/api/masterDataManagement'
import { addSteelPlan } from '@/api/productionManagement'

export default {
    name: 'steelForm',
    data(){
        return {
            btnLoading:false,
            formLoading:false,
            activeNames: ['planInfo'],
            dataForm:{},
            dataFormItems:[],
            ProductListRequestObj: {
                classAttribute: 'semi_finished',
                productCategoryId: '',
                code: '',
                name: '',
                orderItems: [
                    {
                        asc: false,
                        column: 'create_time'
                    }
                ],
                productStatus: 'enable',
                pageNum: 1,
                pageSize: 20
            }, // 产品选择弹出框列表请求参数
            ProductTableItems: [
                { prop: 'drawingNo', label: '品名规格'  },
                { prop: 'code', label: '产品编码', sortable: 'custom' },
                { prop: 'productCategoryName', label: '产品分类', sortable: 'custom' },
                { prop: 'mainUnit', label: '单位' },
                { prop: 'createTime', label: '创建时间', sortable: 'custom', width: 180 }
            ], // 产品选择弹出框表单展示字段
            ProductTableSearchList: [
                { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
                { prop: 'productCode', label: '产品编码', type: 'input' }
            ],
        }
    },
    computed: {
        openMode() {
            return '新建'
        },
    },
    methods:{
        init(){
            this.setDataFormItems()
        },
        setDataFormItems(){
            this.dataFormItems = [
                { prop: "productionPlanNo", label: "生产计划单号", value: "",maxlength: 100, type: 'input', itemRules: [{ required: true, trigger: "blur" }], },
                { prop: "productDrawingNo", label: "品名规格", value: "", type: "custom", customComponent: 'ComSelect-page', itemRules: [{ required: true,message:'品名规格不能为空', trigger: "change" }],
                    dialogTitle: '选择产品',treeTitle: '产品分类', renderTree:false,
                    listMethod : getProducts,
                    listRequestObj : this.ProductListRequestObj,
                    tableItems : this.ProductTableItems,
                    searchList : this.ProductTableSearchList,
                    change : (val,data)=>{
                        // dom更新后重新校验此元素
                        this.$nextTick(() => {
                            console.log(this.$refs['dataForm'])
                            this.$refs['dataForm'].$refs.main.validateField('productDrawingNo')
                        })
                        if (!val && data.length) return
                        if (!data || !data.length) return
                        this.dataForm['productsId'] = data[0].id
                        this.dataForm['productDrawingNo'] = data[0].all.drawingNo
                        this.dataForm['bomId'] = data[0].all.bomId
                        this.dataForm['mainUnit'] = data[0].all.mainUnit
                    },
                },
                { prop:'planProductionQuantity',label:'计划生产数量',value:'',type:'input',itemRules: [{ required: true,message:'计划生产数量不能为空', trigger: "blur" }], },
                { prop: 'planDate', label: '计划开始日期', value: '', type: 'date_interval', minWidth: 180 ,width:'100%',sm:8},

                { prop: 'remark', label: '备注', value: '', type: 'textarea', minWidth: 180 ,},
            ]
            this.$nextTick(() => {
                this.$refs.dataForm.setDefaultValue()
            })
        },
       async handleConfirm(){
            this.btnLoading = true
            let submitFlag = true
            // 校验表单
            let form_1 = this.$refs['dataForm'].$refs.main
            let valid_1 = await form_1.validate().catch(() => false)
            if (!valid_1 && submitFlag) {
                submitFlag = false
                this.btnLoading = false
                this.jnpf.focusErrValidItem(form_1.fields)
            }
            const _data = {
                ...this.dataForm,
                planStartDate: this.dataForm.planDate[0],
                planEndDate: this.dataForm.planDate[1],
                classAttribute: 'semi_finished',
                planType:'steel_ball_plan'
            }
            if (submitFlag){
                addSteelPlan(_data).then(res=>{
                    this.$message({
                        message: '提交成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.btnLoading = false
                            this.$emit('close', true)
                        }
                    })
                }).catch(err=>{this.btnLoading = false})
            }
        },
    },
}
</script>

