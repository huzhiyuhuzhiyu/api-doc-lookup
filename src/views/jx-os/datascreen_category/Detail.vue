<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="800px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="分类名称"  
 prop="name" >
                        <p>{{dataForm.name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="上级分类"  
 prop="pId" >
                         <p>{{ dataForm.pId | dynamicText(pIdOptions) }} </p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="描述"  
 prop="description" >
                        <p>{{dataForm.description}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="启用"  
 prop="active" >
                        <p>{{dataForm.active}}</p>
                </el-form-item>
            </el-col>
    </template>
</el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false"> 取 消</el-button>
    </span>
    </el-dialog>
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
                            name : '',
                            pId : "",
                            description : '',
                            active : 1,
                            creatoruserid : "",
                            creatortime : "",
                            lastmodifyuserid : "",
                            lastmodifytime : "",
            },
                                pIdOptions:[],

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
                        _dataAll.pId = _dataAll.pId ? JSON.parse( _dataAll.pId):[]
                this.dataForm = _dataAll
            },

            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/base_datascreen_category/Base_datascreen_category/detail/'+this.dataForm.id,
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
