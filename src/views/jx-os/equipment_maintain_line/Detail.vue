<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="主表id"  
 prop="equipmentMaintainId" >
                        <p>{{dataForm.equipmentMaintainId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="内容id"  
 prop="equimentMaintainTypeItemId" >
                        <p>{{dataForm.equimentMaintainTypeItemId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="正常/异常"  
 prop="normal" >
                         <p>{{ dataForm.normal | dynamicText(normalOptions) }} </p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="实测值"  
 prop="measuredValue" >
                        <p>{{dataForm.measuredValue}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="备注"  
 prop="note" >
                        <p>{{dataForm.note}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="附件"  
 prop="file" >
                    <JNPF-UploadImg    v-model="dataForm.file"
 disabled
 detailed  :fileSize="10"  sizeUnit="MB"  :limit="9"  >
                </JNPF-UploadImg>
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
                            equipmentMaintainId : '',
                            equimentMaintainTypeItemId : '',
                            normal : '',
                            measuredValue : '',
                            note : '',
                            file : [],
            },
                                normalOptions:[{"fullName":"正常","id":"正常"},{"fullName":"异常","id":"异常"}],

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
                        _dataAll.normal = _dataAll.normal ? JSON.parse( _dataAll.normal):[]
                        _dataAll.file = _dataAll.file ? JSON.parse( _dataAll.file):[]
                this.dataForm = _dataAll
            },

            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/equipmentMaintainLine/Equipment_maintain_line/detail/'+this.dataForm.id,
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
