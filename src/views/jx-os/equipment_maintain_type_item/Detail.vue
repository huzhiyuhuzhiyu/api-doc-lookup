<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="保养类型"  
 prop="typeid" >
                        <p>{{dataForm.typeid}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="内容名称"  
 prop="name" >
                        <p>{{dataForm.name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="方法"  
 prop="method" >
                        <p>{{dataForm.method}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="要求"  
 prop="requirement" >
                        <p>{{dataForm.requirement}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="是否必须"  
 prop="isMust" >
                         <p>{{ dataForm.isMust | dynamicText(isMustOptions) }} </p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="标准"  
 prop="standard" >
                        <p>{{dataForm.standard}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="备注"  
 prop="note" >
                        <p>{{dataForm.note}}</p>
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
                            typeid : "",
                            name : '',
                            method : '',
                            requirement : '',
                            isMust : '',
                            standard : '',
                            note : '',
            },
                                isMustOptions:[{"fullName":"是","id":"true"},{"fullName":"否","id":"false"}],

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
                        _dataAll.isMust = _dataAll.isMust ? JSON.parse( _dataAll.isMust):[]
                this.dataForm = _dataAll
            },

            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/maintionTypeItem/Equipment_maintain_type_item/detail/'+this.dataForm.id,
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
