<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main org-form transitionForm">
            <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
                <el-page-header @back="$emit('close',true)" :content="btnType === 'look' ? '查看代号' : btnType === 'add' ? '新建代号' : '编辑代号'" />
                <div class="options">
                    <el-button type="primary" v-if="btnType !== 'look'" size="mini" :loading="btnLoading"
                               @click="handleConfirm('submit')">
                        保存并提交</el-button>
                    <el-button @click="$emit('close',true)">{{ $t('common.cancelButton') }}</el-button>
                </div>
            </div>
            <div class="main" v-loading="formLoading">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                                <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :btnType="btnType" />
                            </el-collapse-item>

                        </el-collapse>
            </div>
        </div>
    </transition>
</template>
<script>

import {
    addProductAttributeCode, checkProductAttributesCode,
    detailProductAttributeCode, getbimProductAttributesListMap, updateProductAttributeCode
} from '@/api/masterDataManagement'
import { checkCodeExist } from '@/api/masterDataManagement/productManage'

export default {
    name: 'productAttributeSymbolForm',
    data(){
        return {
            formLoading:false,
            btnLoading:false,
            activeName:'basicInfo',
            activeNames: ['productInfo', 'basicInfo'],
            dataForm:{},
            dataFormItems:[],
            btnType:'add',
            attrDictionaryData:[],
            bimProductAttributesList:[],
            autoCode:''
        }
    },
    async created() {

    },
    methods:{
        async setDataForm(){
            const res = await getbimProductAttributesListMap()
            this.bimProductAttributesList = res.data
            const productAttribute = await this.$store.dispatch('base/getDictionaryData', { sort: 'productAttributes'})
            this.attrDictionaryData = productAttribute.filter(item=>!['pa014','pa017','pa018','pa021','pa022'].includes(item.enCode)).map(item=>{
                return {
                    ...item,
                    list:this.bimProductAttributesList[item.enCode].map(item=>{
                        return {
                            label:item.name,
                            value:item.name,
                        }
                    })
                }
            })
            let codeProp = { prop: 'code', label: '代号', value: '', type: 'input', sm: 6,itemRules:[{required:true,message:'代号不能为空',trigger:'blur'},{
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback()
                        } else if (this.dataForm.code === this.autoCode) {
                            callback()
                        } else {
                            checkProductAttributesCode({ id: this.dataForm.id || '', code: this.dataForm.code })
                                .then((res) => {
                                    if (!res.data) {
                                        callback()
                                    } else {
                                        callback(new Error('此代号已存在'))
                                    }
                                })
                                .catch((err) => {
                                    callback(new Error(' '))
                                })
                        }
                    },
                    trigger: 'blur'
                }], itemDisabled: this.btnType === 'look' }
            let remarkProp = { prop: 'remark', label: '备注', value: '', type: 'textarea', sm: 12, itemDisabled: this.btnType === 'look' }
            this.dataFormItems = this.attrDictionaryData.map(item=>{
                return {
                    ...item,
                    prop:item.description,
                    label:this.$store.getters[item.description] || item.fullName,
                    type: 'select',
                    options:item.list,
                    itemDisabled: this.btnType === 'look',
                    sm: 6,
                    value:''
                }
            })
            this.dataFormItems.unshift(codeProp)
            this.dataFormItems.push(remarkProp)
            this.$nextTick(()=>{
                this.$refs.dataForm.setDefaultValue()
            })
        },

        async handleConfirm(){
            this.btnLoading = true;
            let submitFlag = true
            // 校验表单
            let form_1 = this.$refs['dataForm'].$refs.main
            let valid_1 = await form_1.validate().catch(() => false)
            if (!valid_1 && submitFlag) {
                submitFlag = false
                this.btnLoading = false
                this.jnpf.focusErrValidItem(form_1.fields)
            }
            if (submitFlag){
                let formMethod = this.btnType === 'add' ? addProductAttributeCode : updateProductAttributeCode
                formMethod(this.dataForm).then(res=>{
                    this.$message({
                        message: '提交成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.btnLoading = false
                            this.$emit('close', true)
                        }
                    })

                }).catch(err=>this.btnLoading = false)
            }
        },
        async init(id,btnType){
            this.btnType = btnType;
            this.formLoading = true;

            if (id){
                detailProductAttributeCode(id).then(async res=>{
                    this.dataForm = res.data
                    this.autoCode = res.data.code
                    await this.setDataForm()
                })
            }else{
                await this.setDataForm()
            }

            this.formLoading = false
        },
    }
}


</script>
