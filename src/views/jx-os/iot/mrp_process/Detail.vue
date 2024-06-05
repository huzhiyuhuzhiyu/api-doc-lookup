<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="1000px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="12" >
                <el-form-item  label="工序名称"  
 prop="name" >
                        <p>{{dataForm.name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="工序类别"  
 prop="type" >
                        <p>{{dataForm.type}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="计件单价"  
 prop="unitPrice" >
                        <p>{{dataForm.unitPrice}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="单价系数"  
 prop="coefficientPrice" >
                        <p>{{dataForm.coefficientPrice}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="计时单价"  
 prop="timePrice" >
                        <p>{{dataForm.timePrice}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="备注"  
 prop="note" >
                        <p>{{dataForm.note}}</p>
                </el-form-item>
            </el-col>
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2>关联设备</h2>
            </div>
    <el-table :data="dataForm.equipment_process_relList" size='mini'   >
        <el-table-column type="index" width="50" label="序号" align="center" />
            <el-table-column prop="equipmentId" label="设备名称">
            <template slot-scope="scope">
                            <p>{{scope.row.equipmentId}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="" label="设备编码">
            <template slot-scope="scope">
                            <p>{{scope.row.equipmentId_code}}</p>
        </template>
        </el-table-column>
    </el-table>
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
                            type : "",
                            unitPrice : '',
                            coefficientPrice : '',
                            timePrice : '',
                            note : '',
                            creatoruserid : "",
                            creatortime : "",
                            lastmodifyuserid : "",
                            lastmodifytime : "",
                        equipment_process_relList:[],
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
                for(let i=0;i<_dataAll.equipment_process_relList.length;i++){
                    var _list = _dataAll.equipment_process_relList[i];
                }
                this.dataForm = _dataAll
            },

            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/mrp_process/Mrp_process/detail/'+this.dataForm.id,
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
