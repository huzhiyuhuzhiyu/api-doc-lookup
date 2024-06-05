<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="800px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="工单号"  
 prop="name" >
                        <p>{{dataForm.name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="订单编号"  
 prop="productionId" >
                        <p>{{dataForm.productionId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="产品名称"  
 prop="productId" >
                        <p>{{dataForm.productId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="工序名称"  
 prop="processId" >
                        <p>{{dataForm.processId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="设备名称"  
 prop="equipmentId" >
                        <p>{{dataForm.equipmentId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="操作工"  
 prop="userId" >
                        <p>{{dataForm.userId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="状态"  
 prop="state" >
                        <p>{{dataForm.state}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="计划数量"  
 prop="qtyOrder" >
                        <p>{{dataForm.qtyOrder}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="报工数量"  
 prop="qtyProduced" >
                        <p>{{dataForm.qtyProduced}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="上工时间"  
 prop="dateStart" >
                        <p>{{jnpf.toDate(dataForm.dateStart,"yyyy-MM-dd HH:mm:ss")}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="下工时间"  
 prop="dateEnd" >
                        <p>{{jnpf.toDate(dataForm.dateEnd,"yyyy-MM-dd HH:mm:ss")}}</p>
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
                            productionId : '',
                            productId : "",
                            processId : "",
                            equipmentId : "",
                            userId : '',
                            state : "",
                            qtyOrder : '',
                            qtyProduced : 0,
                            dateStart : '',
                            dateEnd : '',
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
                            url: '/api/jx/Mrp_workorder/detail/'+this.dataForm.id,
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
