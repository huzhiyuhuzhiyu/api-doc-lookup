<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="1000px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="产品编码"  
 prop="code" >
                        <p>{{dataForm.code}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="产品名称"  
 prop="name" >
                        <p>{{dataForm.name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="产品规格"  
 prop="specification" >
                        <p>{{dataForm.specification}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="长"  
 prop="length" >
                        <p>{{dataForm.length}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="最低库存"  
 prop="minimum" >
                        <p>{{dataForm.minimum}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="宽"  
 prop="width" >
                        <p>{{dataForm.width}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="安全库存"  
 prop="safety" >
                        <p>{{dataForm.safety}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="高"  
 prop="height" >
                        <p>{{dataForm.height}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="最高库存"  
 prop="maximum" >
                        <p>{{dataForm.maximum}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="体积"  
 prop="volumn" >
                        <p>{{dataForm.volumn}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="重量"  
 prop="weight" >
                        <p>{{dataForm.weight}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="描述"  
 prop="description" >
                        <p>{{dataForm.description}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="附件"  
 prop="files" >
                    <JNPF-UploadFz    v-model="dataForm.files"
 disabled
 detailed  :fileSize="10"  sizeUnit="MB"  :limit="9"  buttonText="点击上传"  >
                </JNPF-UploadFz>
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
                            code : '',
                            name : '',
                            specification : "",
                            length : "",
                            minimum : "",
                            width : '',
                            safety : "",
                            height : '',
                            maximum : "",
                            volumn : '',
                            weight : '',
                            description : '',
                            files : [],
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
                        _dataAll.files = _dataAll.files ? JSON.parse( _dataAll.files):[]
                this.dataForm = _dataAll
            },

            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/jx/Product_product/detail/'+this.dataForm.id,
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
