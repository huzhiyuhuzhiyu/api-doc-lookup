<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24" >
                <el-form-item  label="设备盒子ID"  
 prop="uid" >
                        <p>{{dataForm.uid}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="弹窗选择属性"  
>
                        <p>{{dataForm.uid_name}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="历程分类"  
 prop="category" >
                        <p>{{dataForm.category}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="历程编号"  
 prop="retaineruuid" >
                        <p>{{dataForm.retaineruuid}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="历程配置uuid"  
 prop="retainerconfiguuid" >
                        <p>{{dataForm.retainerconfiguuid}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="中文说明"  
 prop="lableZh" >
                        <p>{{dataForm.lableZh}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="英文说明"  
 prop="lableEn" >
                        <p>{{dataForm.lableEn}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="开始时间"  
 prop="start" >
                        <p>{{jnpf.toDate(dataForm.start,"yyyy-MM-dd HH:mm:ss")}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="结束时间"  
 prop="stop" >
                        <p>{{jnpf.toDate(dataForm.stop,"yyyy-MM-dd")}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="持续时间"  
 prop="duration" >
                        <p>{{dataForm.duration}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="状态"  
 prop="state" >
                        <p>{{dataForm.state}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="处理状态"  
 prop="disposeState" >
                        <p>{{dataForm.disposeState}}</p>
                </el-form-item>
            </el-col>
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2></h2>
            </div>
    <el-table :data="dataForm.equipmentList" size='mini'   >
        <el-table-column type="index" width="60" label="序号" align="center" />
            <el-table-column prop="name" label="设备名称">
            <template slot-scope="scope">
                            <p>{{scope.row.name}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="code" label="设备编号">
            <template slot-scope="scope">
                            <p>{{scope.row.code}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="mrpWorkshopId" label="生产车间">
            <template slot-scope="scope">
                            <p>{{scope.row.mrpWorkshopId}}</p>
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
                            uid : "OBJ20220424000099",
                            category : '',
                            retaineruuid : '',
                            retainerconfiguuid : '',
                            lableZh : '',
                            lableEn : '',
                            start : '',
                            stop : '',
                            duration : '',
                            state : '',
                            disposeState : "undisposed",
                        equipmentList:[],
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
                for(let i=0;i<_dataAll.equipmentList.length;i++){
                    var _list = _dataAll.equipmentList[i];
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
                            url: '/api/jx/Retainer/detail/'+this.dataForm.id,
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
