<template>
    <div>
        <template v-for="item in attrDictionaryData" v-if="dataLoaded">
            <el-table-column
                :prop="item.prop"
                :label="item.label"
                min-width="150"
                v-if="item.render"
                :key="item.prop"
            >
                <template slot-scope="scope">
                    <el-select
                        v-if="isSlot"
                        v-model="scope.row[item.prop]"
                        :placeholder="item.label"
                        :disabled="isView"
                        style="width: 100%;"
                    >
                        <el-option
                            v-for="(option, index) in item.list"
                            :key="index"
                            :label="option.label"
                            :value="option.value"
                        />
                    </el-select>
                    <template v-else>
                        {{ scope.row[item.prop] }}
                    </template>
                </template>
            </el-table-column>
        </template>
    </div>
</template>
<script>

export default {
    name: 'AttributeColumns',
    props:{
        isSlot:{
            type:Boolean,
            default:true
        },
        attributeCode:{
            type:Array,
            default:()=>[]
        },
        // 哪个模块的业务参数
        moduleConfig:{
            type:String | Array,
            default:'orderField'
        },
        btnType:{
            type:String,
            default:''
        },
        // 产品数据
        productData:{
            type:Array,
            default:()=>[]
        }
    },
    computed: {
        isView: {
            get() {
                return this.btnType === 'look';
            },
        }
    },
    data(){
        return {
            bimProductAttributesList:[],
            attrDictionaryData:[],
            dataLoaded: false
        }
    },
    async created() {
        try {
            this.bimProductAttributesList = this.$store.getters.bimProductAttributesList
            console.log(this.bimProductAttributesList,'this.bimProductAttributesList')
            const productAttribute = await this.$store.dispatch('base/getDictionaryData', { sort: 'productAttributes'})

            this.attrDictionaryData = productAttribute
                .filter(item => !this.attributeCode.includes(item.enCode))
                .map(item => {
                    const attributeList = this.bimProductAttributesList[item.enCode] || [];
                    let renderFlag = false
                    // if (Array.isArray(this.moduleConfig)){
                    //     this.moduleConfig
                    // }
                    return {
                        ...item,
                        prop: item.description,
                        label: this.$store.getters[item.description] || item.fullName,
                        options: item.list,
                        render: this.$store.getters.configData[this.moduleConfig][item.description],
                        list: attributeList.map(attr => ({
                            label: attr.name,
                            value: attr.name,
                        }))
                    }
                });

            this.dataLoaded = true;

            // 数据加载完成后，为 productData 设置响应性字段
            this.$nextTick(() => {
                this.initializeProductDataFields();
            });
        } catch (error) {
            console.error('AttributeColumns 数据加载失败:', error);
            this.dataLoaded = true; // 即使失败也要设置为 true，避免阻塞渲染
        }
    },

    methods: {
        // 为 productData 初始化响应性字段
        initializeProductDataFields() {
            if (!this.productData || !this.productData.length) return;

            // 获取所有需要设置的属性字段
            const attributeProps = this.attrDictionaryData
                .filter(item => item.render)
                .map(item => item.prop);

            // 为每一行数据设置响应性字段
            this.productData.forEach((row, index) => {
                attributeProps.forEach(prop => {
                    // 如果字段不存在，使用 $set 添加响应性字段
                    if (!row.hasOwnProperty(prop)) {
                        this.$set(row, prop, '');
                    }
                });
            });

            console.log('AttributeColumns: 已为 productData 设置响应性字段', attributeProps);
        },

        // 为新增的行设置响应性字段
        setFieldsForNewRow(row) {
            if (!this.attrDictionaryData.length) return;

            const attributeProps = this.attrDictionaryData
                .filter(item => item.render)
                .map(item => item.prop);

            attributeProps.forEach(prop => {
                if (!row.hasOwnProperty(prop)) {
                    this.$set(row, prop, '');
                }
            });
        },

        // 手动触发字段初始化（供外部调用）
        refreshFields() {
            this.initializeProductDataFields();
        }
    },

    watch: {
        // 监听 productData 变化，为新数据设置字段
        productData: {
            handler(newData, oldData) {
                if (this.dataLoaded && newData && newData.length) {
                    // 检查是否有新增的行
                    if (!oldData || newData.length > oldData.length) {
                        this.$nextTick(() => {
                            this.initializeProductDataFields();
                        });
                    }
                }
            },
            deep: true,
            immediate: false
        },

        // 监听属性数据加载完成，初始化字段
        attrDictionaryData: {
            handler() {
                if (this.dataLoaded) {
                    this.$nextTick(() => {
                        this.initializeProductDataFields();
                    });
                }
            },
            deep: true
        }
    },
}
</script>
