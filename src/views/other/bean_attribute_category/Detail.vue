<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
        <el-col :span="8">
        <el-row :gutter="15">
            <el-col :span="24" >
                <el-form-item  label="创建时间"  
 prop="creatortime" >
                        <p>{{dataForm.creatortime}}</p>
                </el-form-item>
            </el-col>
        </el-row>
        </el-col>
        <el-col :span="16">
        <el-row :gutter="15">
            <el-col :span="24" >
                <el-form-item  label="名称"  
 prop="name" >
                        <p>{{dataForm.name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="描述"  
 prop="description" >
                         <p>{{ dataForm.description | dynamicText(descriptionOptions) }} </p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="字段"  
 prop="content" >
                        <p>{{dataForm.content}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="排序码"  
 prop="sortcode" >
                    <el-slider    v-model="dataForm.sortcode"
 disabled
 :min="1"  :max="24"  :step="1"  >
                </el-slider>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="启用"  
 prop="active" >
                        <p>{{dataForm.active}}</p>
                </el-form-item>
            </el-col>
        </el-row>
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
                            creatortime : "comInput",
                            name : '',
                            description : '',
                            content : '',
                            sortcode : 24,
                            active : 0,
            },
                                descriptionOptions:[{"fullName":"选项一","id":"1"},{"fullName":"选项二","id":"2"}],

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
                        _dataAll.description = _dataAll.description ? JSON.parse( _dataAll.description):[]
                this.dataForm = _dataAll
            },

            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/jx/Bean_attribute_category/detail/'+this.dataForm.id,
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
