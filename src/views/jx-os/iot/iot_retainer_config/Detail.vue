<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="110px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="异常编码"  
 prop="uuid" >
                        <p>{{dataForm.uuid}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="异常名称"  
 prop="name" >
                        <p>{{dataForm.name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="自定义编码"  
 prop="customUuid" >
                        <p>{{dataForm.customUuid}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="自定义名称"  
 prop="customName" >
                        <p>{{dataForm.customName}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="是否激活"  
 prop="state" >
                        <p>{{dataForm.state}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="历程类型"  
 prop="type" >
                         <p>{{ dataForm.type | dynamicText(typeOptions) }} </p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="生效设备"  
 prop="uidList" >
                        <p>{{dataForm.uidList}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="规则脚本"  
 prop="expression" >
                        <p>{{dataForm.expression}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="备注"  
 prop="remark" >
                        <p>{{dataForm.remark}}</p>
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
                            uuid : '',
                            name : '',
                            customUuid : '',
                            customName : '',
                            state : 1,
                            type : "",
                            uidList : ["OBJ1945518001120","OBJ20220424000099","OBJ20220614000006","OBJ20220423000216"],
                            expression : '',
                            remark : '',
                            active : 1,
            },
                                typeOptions:[{"fullName":"EVENT","id":"EVENT"},{"fullName":"WARN","id":"WARN"},{"fullName":"ERROR","id":"ERROR"}],

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
                        _dataAll.type = _dataAll.type ? JSON.parse( _dataAll.type):[]
                this.dataForm = _dataAll
            },

            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/jx/Iot_retainer_config/detail/'+this.dataForm.id,
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
