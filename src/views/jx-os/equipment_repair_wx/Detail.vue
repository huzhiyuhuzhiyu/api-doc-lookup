<template>
<transition name="el-zoom-in-center">
<div class="JNPF-preview-main">
    <div class="JNPF-common-page-header">
        <el-page-header @back="goBack"
                        content="详情"/>
        <div class="options">
            <el-button @click="goBack">取 消</el-button>
        </div>
    </div>
<el-row :gutter="22" class=" main" :style="{margin: '0 auto',width: '1000px'}">
<el-form ref="elForm" :model="dataForm" size="medium" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="12" >
                <el-form-item  label="设备名称"  
 prop="equimentId" >
                        <p>{{dataForm.equimentId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="申请人"  
 prop="partnerId" >
                        <p>{{dataForm.partnerId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="申请时间"  
 prop="requestTime" >
                        <p>{{jnpf.toDate(dataForm.requestTime,"yyyy-MM-dd HH:mm:ss")}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="故障类型"  
 prop="faultId" >
                        <p>{{dataForm.faultId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="故障原因"  
 prop="equipmentTroubleId" >
                        <p>{{dataForm.equipmentTroubleId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="响应人"  
 prop="reviewerId" >
                        <p>{{dataForm.reviewerId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="响应时间"  
 prop="responseTime" >
                        <p>{{jnpf.toDate(dataForm.responseTime,"yyyy-MM-dd HH:mm:ss")}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="维修人"  
 prop="repairerId" >
                        <p>{{dataForm.repairerId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="完成时间"  
 prop="completionTime" >
                        <p>{{jnpf.toDate(dataForm.completionTime,"yyyy-MM-dd HH:mm:ss")}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="解决措施"  
 prop="solution" >
                        <p>{{dataForm.solution}}</p>
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
            <el-col :span="24" >
                <el-form-item  label="状态"  
 prop="state" >
                        <p>{{dataForm.state}}</p>
                </el-form-item>
            </el-col>
    </template>
</el-form>
    </el-row>
    </div>
</transition>
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
                            equimentId : "",
                            partnerId : "",
                            requestTime : '',
                            faultId : "",
                            equipmentTroubleId : "",
                            reviewerId : "",
                            responseTime : '',
                            responseTimes : '',
                            repairerId : "",
                            completionTime : '',
                            maintenanceTime : '',
                            solution : '',
                            note : '',
                            file : [],
                            active : 1,
                            repairType : "设备",
                            typeS : "设备",
                            state : "1",
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
                        _dataAll.file = _dataAll.file ? JSON.parse( _dataAll.file):[]
                this.dataForm = _dataAll
            },

                goBack() {
                    this.$emit('refresh')
                },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/equipmentRepair/Equipment_repair/detail/'+this.dataForm.id,
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
