<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="车间名称"  
 prop="name" >
                        <p>{{dataForm.name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="父ID"  
 prop="parentId" >
                        <p>{{dataForm.parentId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="负责人"  
 prop="employeeId" >
                        <p>{{dataForm.employeeId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="描述"  
 prop="description" >
                        <p>{{dataForm.description}}</p>
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
                            parentId : "",
                            employeeId : '',
                            description : '',
                            creatoruserid : "",
                            creatortime : "",
                            lastmodifyuserid : "",
                            lastmodifytime : "",
            },
                        parentIdProps:{"label":"name","value":"id"  ,"children":"children" },

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
                            url: '/api/mrp_workshop/Mrp_workshop/detail/'+this.dataForm.id,
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
