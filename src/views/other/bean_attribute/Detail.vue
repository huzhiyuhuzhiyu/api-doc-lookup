<template>
<el-drawer title="详情" :visible.sync="visible" :wrapperClosable="false"
           size="600px" append-to-body class="JNPF-common-drawer">
<div class="JNPF-flex-main">
<div class="dynamicForm dynamicDetail" >
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="表单ID"  
 prop="categoryId" >
                        <p>{{dataForm.categoryId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="字段JSON"  
 prop="content" >
                        <p>{{dataForm.content}}</p>
                </el-form-item>
            </el-col>
    </template>
</el-form>
    </div>
    <div class="drawer-footer">
        <el-button @click="visible = false"> 取 消</el-button>
    </div>
    </div>
    </el-drawer>
</template>
<script>
    import request from '@/utils/request'
    import PrintBrowse from '@/components/PrintBrowse'
    import jnpf from '@/utils/jnpf'
    export default {
        components: {PrintBrowse},
        props: [],
        data() {
            return {
                visible: false,
                loading: false,
                printBrowseVisible: false,
                printId: '',
            dataForm: {
                id :'',
                            categoryId : '',
                            content : '',
                            creatoruserid : "",
                            creatortime : "",
                            lastmodifyuserid : "",
                            lastmodifytime : "",
            },

        }
        },
        computed: {},
        watch: {},
        created() {

        },
        mounted() {},
        methods: {
            dataInfo(dataAll){
                let _dataAll =dataAll
                this.dataForm = _dataAll
            },

            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/com.jx/Bean_attribute/detail/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
                            this.loading = false
                        })
                    }

                })
            },
        },
    }

</script>
