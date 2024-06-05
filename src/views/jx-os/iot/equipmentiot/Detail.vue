<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="800px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="设备名称"  
 prop="name" >
                        <p>{{dataForm.name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="设备编号"  
 prop="code" >
                        <p>{{dataForm.code}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="盒子ID"  
 prop="uuid" >
                        <p>{{dataForm.uuid}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="生产车间"  
 prop="mrpWorkshopId" >
                        <p>{{dataForm.mrpWorkshopId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="理论节拍"  
 prop="theoryBeat" >
                        <p>{{dataForm.theoryBeat}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="长"  
 prop="length" >
                        <p>{{dataForm.length}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="X坐标"  
 prop="axisX" >
                        <p>{{dataForm.axisX}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="宽"  
 prop="width" >
                        <p>{{dataForm.width}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="y坐标"  
 prop="axisY" >
                        <p>{{dataForm.axisY}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="高"  
 prop="height" >
                        <p>{{dataForm.height}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="z坐标"  
 prop="axisZ" >
                        <p>{{dataForm.axisZ}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="删除"  
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
                            code : '',
                            uuid : '',
                            mrpWorkshopId : "",
                            theoryBeat : '',
                            length : '',
                            axisX : '',
                            width : '',
                            axisY : '',
                            height : '',
                            axisZ : "",
                            effectiveDate : "",
                            typeS : "CG",
                            active : 1,
            },
                        mrpWorkshopIdProps:{"label":"name","value":"id"  ,"children":"children" },

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
                            url: '/api/jx/EquipmentIot/detail/'+this.dataForm.id,
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
