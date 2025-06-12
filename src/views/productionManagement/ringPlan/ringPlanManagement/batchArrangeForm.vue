<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-common-layout">
            <div class="JNPF-common-layout-center JNPF-flex-main">
                <div class="JNPF-preview-main org-form" ref="main">
                    <div :class="['JNPF-common-page-header']">
                        <el-page-header @back="$emit('close',true)" content="计划批量编排"  />
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
                                    <div>
                                        <el-row :gutter="30" class="custom-row">
                                            <el-col :sm="6" :xs="24">
                                                <el-input v-model="copyLength" @change="changeLineList" placeholder="请输入复制条数"></el-input>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <div style="height: 100%;overflow: auto">
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

import { getbimProductAttributesListMap } from '@/api/masterDataManagement'
import { getProductsWeightQuantityList } from '@/api/basicData/productsWeightQuantity'
import { detailProcess } from '@/api/basicData/processSettingss'
import { batchArrangeSteelPlan } from '@/api/productionManagement'

export default {
    name: 'batchArrangeForm',
    data(){
        return {
            copyLength:10,
            formLoading:false,
            btnType:'add',
            btnLoading:false,
            linesListItems: [],
            linesList:[],
            maxTaskLength:10,
            tempList:[],
            bimProductAttributesList:[],
            productWeightQuantity:{},
            wordOrderList:[]
        }
    },
    created() {

    },
    methods: {
        setLinesListItems(){
            this.linesListItems = [

                { prop: 'orderNo', label: '生产任务单号', value: '', type: 'input', minWidth: 220 ,
                    itemRules:[
                        { validator: this.formValidate({ type: 'noEmtry', params: ['', (errMsg, index) => { this.$message.error(`第${index + 1}行：生产任务单号${errMsg}`)}] }),
                            trigger: ['blur']
                        },
                        { required:true,trigger:'blur'},
                    ],
                    input: (val, scope) => {
                        this.handleOrderNoInput(val, scope);
                    }
                },
                { prop: 'productsDrawingNo', label: '品名规格', value: '', type: 'view', minWidth: 160 ,},
                { prop: 'mainUnit', label: '单位', value: '', type: 'view', minWidth: 120 ,},
                { prop: 'productionBarrels', label: '生产桶数', value: '1', type: 'input', minWidth: 120 ,itemRules: [
                        {
                            validator: this.formValidate({ type: 'noEmtry', params: ['不能为空', (msg, rowIndex) => this.$message.error(`生产桶数第${rowIndex + 1}行：${msg}`)] }),
                            trigger: 'blur'
                        },
                        { required: true, trigger: 'blur' },
                        {
                            validator: this.formValidate({ type: 'decimal', params: [20, 4, null, (msg, rowIndex) => this.$message.error(`生产桶数第${rowIndex + 1}行：${msg}`)] }),
                            trigger: 'blur'
                        },
                    ]

                },
                { prop: 'productionWeight', label: '生产重量（kg）', value: '', type: 'input', minWidth: 160 ,itemRules: [
                        {
                            validator: this.formValidate({ type: 'noEmtry', params: [null, (msg, rowIndex) => this.$message.error(`第${rowIndex + 1}行：生产重量（kg）${msg}`)] }),
                            trigger: 'blur'
                        },
                        { required: true, trigger: 'blur' },
                        {
                            validator: this.formValidate({ type: 'decimal', params: [20, 4, null, (msg, rowIndex) =>this.$message.error(`第${rowIndex + 1}行：生产重量（kg）${msg}`) ] }),
                            trigger: 'blur'
                        },
                    ],
                    input:(val, scope)=>{
                        if (scope.row.weight && scope.row.quantity){
                            scope.row.productionQuantity = Math.floor((Number(val) / Number(scope.row.weight) *Number(scope.row.quantity)) * 10000) / 10000
                        }
                    }
                },
                { prop: 'productionQuantity', label: '生产数量（万粒）', value: '', type: 'input', minWidth: 160 ,
                    itemRules: [
                        {
                            validator: this.formValidate({ type: 'noEmtry', params: [null, (msg, rowIndex) => this.$message.error(`第${rowIndex + 1}行：生产数量（万粒）${msg}`)] }),
                            trigger: 'blur'
                        },
                        { required: true, trigger: 'blur' },
                        {
                            validator: this.formValidate({ type: 'decimal', params: [20, 4, null, (msg, rowIndex) => this.$message.error(`第${rowIndex + 1}行：生产数量（万粒）${msg}`)] }),
                            trigger: 'blur'
                        },
                    ],
                },
                { prop: 'taskMethod', label: '编排任务方式', value: 'not_appoint',render:false, type: 'select',disabled:true,options:[{ label: "指定加工对象", value: "appoint" }, { label: "不指定加工对象", value: "not_appoint" }], minWidth: 160 ,},
                { prop: 'planDate', label: '计划生产日期', value: '', type: 'date_interval', minWidth: 260 ,clearable:false,},
                { prop: 'standardValue', label: '规值', value: '', type: 'select',options:this.bimProductAttributesList['pa008'].map(item=>{
                        return {
                            ...item,
                            label:item.name,
                            value:item.name,
                        }
                    }), minWidth: 160 ,},
                { prop: 'accuracyLevel', label: this.$store.getters.accuracyLevel, value: '', type: 'select',options:this.bimProductAttributesList['pa006'].map(item=>{
                        return {
                            ...item,
                            label:item.name,
                            value:item.name,
                        }
                    }), minWidth: 160 ,},
                { prop: 'wireHeatNumber', label: '钢丝炉号', value: '', type: 'input', minWidth: 160 ,
                    input: (val, scope) => {
                        this.handleWireHeatNumberInput(val, scope);
                    }
                },
                { prop: 'rawStockMill', label: '原材料厂家', value: '', type: 'select',options:this.bimProductAttributesList['pa027'].map(item=>{
                        return {
                            ...item,
                            label:item.name,
                            value:item.name,
                        }
                    }), minWidth: 160 ,
                    change: (val, scope) => {
                        if (scope.$index === 0){
                            this.linesList.forEach(item=>{
                                item.rawStockMill = val
                            })
                        }
                    }
                },
                { prop: 'remark', label: '备注', value: '', type: 'input', minWidth: 160 ,maxlength:200 },

            ]
            this.$nextTick(()=>{
                this.$refs.tableForm.setDefaultValue()
                this.formLoading = false
            })
        },
        async init(data){
            this.formLoading = true
            const res = await getbimProductAttributesListMap()
            this.bimProductAttributesList = res.data
            if (this.$store.getters.configData.produce.steelBallTask) {
                let obj = {
                    productsId: data[0].productsId
                }
                try {
                    this.productWeightQuantity = await getProductsWeightQuantityList(obj)
                } catch (error) {}
            }
            this.linesList = data.map(item=>{
                return {
                    ...item,
                    productionBarrels:1,
                    pickingWay:'none',
                    planDate:[item.planStartDate,item.planEndDate],
                    productionWeight: this.productWeightQuantity.data.records.length ? this.productWeightQuantity.data.records[0].weight : 0,
                    productionQuantity: this.productWeightQuantity.data.records.length ? this.productWeightQuantity.data.records[0].quantity : 0,
                    weight:this.productWeightQuantity.data.records.length ? this.productWeightQuantity.data.records[0].weight : 0,
                    quantity:this.productWeightQuantity.data.records.length ? this.productWeightQuantity.data.records[0].quantity : 0,
                }
            })
            this.tempList.push({...this.linesList[0],orderNo:''})
            this.setLinesListItems()
            if (data[0].routingId) {
                detailProcess(data[0].routingId).then(res=>{
                    res.data.routingLineList.forEach((item) => {
                        if (item.routingProResList && item.routingProResList.length){
                            item.routingProResList.forEach(items => {
                                items.processId = item.processId
                            })
                        }
                        if (item.routingProResMap) {
                            if (item.routingProResMap.personnel) {
                                this.$set(item, 'personId', item.routingProResMap.personnel[0].resourceId)
                                this.$set(item, 'personName', item.routingProResMap.personnel[0].resourceName)
                            }
                            if (item.routingProResMap.work_group) {
                                this.$set(item, 'workGroupId', item.routingProResMap.work_group[0].resourceId)
                                this.$set(item, 'workGroupName', item.routingProResMap.work_group[0].resourceName)
                            }
                            if (item.routingProResMap.device) {
                                this.$set(item, 'equipmentId', item.routingProResMap.device[0].resourceId)
                                this.$set(item, 'equipmentName', item.routingProResMap.device[0].resourceName)
                            }
                        } else {
                        }
                        this.$set(item,'workOrderResList',item.routingProResList)
                    });
                    this.wordOrderList = res.data.routingLineList

                }).catch(err=>{})
            }else{
                this.$message.warning('当前产品未配置工艺路线')
            }
        },
        addLine(){
            // 添加新行
            this.linesList.push({...this.tempList[0],orderNo:''});

            // 如果第一行有任务单号，自动为新行生成递增的任务单号
            if (this.linesList.length > 1 && this.linesList[0].orderNo) {
                this.autoIncrementOrderNo(this.linesList[0].orderNo);
            }
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
        changeLineList(val){
            if (val*1 > 10){
                return  this.$message.error('最大只能复制10条')
            }
            this.linesList = Array.from({length:val}, () => ({...this.tempList[0],orderNo:''}))
        },
        handleWireHeatNumberInput(val,scope){
            if (!val || !val.trim()) return;
            const currentIndex = scope.$index;
            // 只有在第一行输入时才触发自动递增
            if (currentIndex === 0) {
                this.autoIncrementWireHeat(val);
            }
        },
        autoIncrementWireHeat(val){
            // 为后续行生成递增的任务单号
            this.linesList.forEach((item, index) => {
                    // 后续行自动递增
                    item.wireHeatNumber = val
            });
            // 强制更新表格显示
            this.$nextTick(() => {
                this.$refs.tableForm.setDefaultValue();
            });
        },
        // 处理生产任务单号输入，实现自动递增
        handleOrderNoInput(val, scope) {
            if (!val || !val.trim()) return;

            const currentIndex = scope.$index;
            const currentOrderNo = val.trim();

            // 只有在第一行输入时才触发自动递增
            if (currentIndex === 0) {
                this.autoIncrementOrderNo(currentOrderNo);
            }
        },

        // 自动递增任务单号
        autoIncrementOrderNo(baseOrderNo) {
            // 提取数字部分（假设任务单号末尾是数字）
            const numberMatch = baseOrderNo.match(/(\d+)$/);

            if (!numberMatch) {
                console.warn('任务单号格式不正确，无法自动递增');
                return;
            }

            const prefix = baseOrderNo.substring(0, numberMatch.index);
            const startNumber = parseInt(numberMatch[1]);
            const numberLength = numberMatch[1].length; // 保持原有的数字位数

            // 为后续行生成递增的任务单号
            this.linesList.forEach((item, index) => {
                if (index === 0) {
                    // 第一行保持用户输入的值
                    item.orderNo = baseOrderNo;
                } else {
                    // 后续行自动递增
                    const newNumber = startNumber + index;
                    const paddedNumber = newNumber.toString().padStart(numberLength, '0');
                    item.orderNo = prefix + paddedNumber;
                }
            });

            // 强制更新表格显示
            this.$nextTick(() => {
                this.$refs.tableForm.setDefaultValue();
            });
        },

        async handleConfirm(){
            this.btnLoading = true
            let submitFlag = true
            // 判断是否有子件
            if (!this.linesList.length && submitFlag) {
                submitFlag = false
                this.$message.error('请至少复制一个计划进行编排')
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
                let _data = {
                    prodOrderList:this.linesList.map(item=>{
                        return {
                            ...item,
                            planStartDate:item.planDate[0],
                            planEndDate:item.planDate[1],
                            productionPlanId:item.id
                        }
                    }),
                    collect:{},
                    workOrderList:this.wordOrderList,
                    materialList:[]
                }
                batchArrangeSteelPlan(_data).then(res=>{
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
