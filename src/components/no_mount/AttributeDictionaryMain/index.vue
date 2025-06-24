<template>
    <div>
            <template v-for="item in attrDictionaryData">
                <el-col :sm="sm" :xs="24"  :key="item.prop" v-if="item.render">
                    <el-form-item :label="item.label" >
                        <el-select v-model="dataForm[item.prop]" :placeholder="item.label" :disabled="isView" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in item.list" :key="index"
                                       :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>
    </div>

</template>
<script>

export default {
    name: 'AttributeDictionaryMain',
    props:{
        sm:{
            type:Number,
            default:8
        },
        attributeCode:{
            type:Array,
            default:()=>[]
        },
        // 哪个模块的业务参数
        moduleConfig:{
            type:String,
            default:'orderField'
        },
        // 表单数据对象
        formData: {
            type: Object,
            default: () => {}
        },
        dataForm:{
            type:Object,
            default:()=>{}
        },
        btnType:{
            type:String,
            default:'add'
        }
    },
    data(){
        return {
            bimProductAttributesList:[],
            attrDictionaryData:[],
        }
    },
    computed: {
        // 创建一个计算属性来双向绑定表单数据
        dataForm: {
            get() {
                return this.formData;
            },
            set(value) {
                this.$emit('update:formData', value);
            }
        },
        isView: {
            get() {
                return this.btnType === 'look';
            },
        }
    },
    async created() {
        this.bimProductAttributesList = this.$store.getters.bimProductAttributesList
        const productAttribute = await this.$store.dispatch('base/getDictionaryData', { sort: 'productAttributes'})
        this.attrDictionaryData = productAttribute.filter(item=>!this.attributeCode.includes(item.enCode)).map(item=>{
            return {
                ...item,
                prop:item.description,
                label:this.$store.getters[item.description] || item.fullName,
                options:item.list,
                render:this.$store.getters.configData[this.moduleConfig][item.description],
                list:this.bimProductAttributesList[item.enCode].map(item=>{
                    return {
                        label:item.name,
                        value:item.name,
                    }
                })
            }
        })
    },
}
</script>
