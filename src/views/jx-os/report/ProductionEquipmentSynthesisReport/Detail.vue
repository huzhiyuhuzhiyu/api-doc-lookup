<template>
<el-dialog title="详情"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="60%">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" size="small" label-width="120px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24">
                <el-tabs  v-model="activeuwxmxg"  tab-position="top" class="mb-20">
                <el-tab-pane  label="基本">
        <el-col :span="12">
        <el-row :gutter="15">
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
                <el-form-item  label="设备分类"  
 prop="categoryId" >
                        <p>{{dataForm.categoryId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="购置日期"  
 prop="purchaseDate" >
                        <p>{{jnpf.toDate(dataForm.purchaseDate,"yyyy-MM-dd")}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="启用日期"  
 prop="effectiveDate" >
                        <p>{{jnpf.toDate(dataForm.effectiveDate,"yyyy-MM-dd")}}</p>
                </el-form-item>
            </el-col>
        </el-row>
        </el-col>
        <el-col :span="12">
        <el-row :gutter="15">
            <el-col :span="24" >
                <el-form-item  
 prop="pic" >
                    <JNPF-UploadImg    v-model="dataForm.pic"
 disabled
 detailed  :fileSize="10"  sizeUnit="MB"  :limit="1"  >
                </JNPF-UploadImg>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="所属车间"  
 prop="mrpWorkshopId" >
                        <p>{{dataForm.mrpWorkshopId}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="外径范围"  
 prop="portraitMin" >
                        <p>{{dataForm.portraitMin}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="~"  label-width="30px" 
 prop="portraitMax" >
                        <p>{{dataForm.portraitMax}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="宽度范围"  
 prop="axialMin" >
                        <p>{{dataForm.axialMin}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12" >
                <el-form-item  label="~"  label-width="30px" 
 prop="axialMax" >
                        <p>{{dataForm.axialMax}}</p>
                </el-form-item>
            </el-col>
        </el-row>
        </el-col>
            <el-col :span="24" >
                <el-form-item  label="说明"  
 prop="note" >
                        <p>{{dataForm.note}}</p>
                </el-form-item>
            </el-col>
            </el-tab-pane >
                <el-tab-pane  label="出厂">
        <el-col :span="12">
        <el-row :gutter="15">
            <el-col :span="24" >
                <el-form-item  label="制造日期"  
 prop="productDate" >
                        <p>{{jnpf.toDate(dataForm.productDate,"yyyy-MM-dd")}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="保修截至日期"  
 prop="warrantyDate" >
                        <p>{{jnpf.toDate(dataForm.warrantyDate,"yyyy-MM-dd")}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="品牌"  
 prop="brank" >
                        <p>{{dataForm.brank}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="重量"  
 prop="weight" >
                        <p>{{dataForm.weight}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="额定功率"  
 prop="power" >
                        <p>{{dataForm.power}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="额定电压"  
 prop="voltage" >
                        <p>{{dataForm.voltage}}</p>
                </el-form-item>
            </el-col>
        </el-row>
        </el-col>
        <el-col :span="12">
        <el-row :gutter="15">
            <el-col :span="24" >
                <el-form-item  label="生产厂家"  
 prop="supplier" >
                        <p>{{dataForm.supplier}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="成本"  
 prop="cost" >
                        <p>{{dataForm.cost}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="行业"  
 prop="trade" >
                        <p>{{dataForm.trade}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="用途"  
 prop="usin" >
                        <p>{{dataForm.usin}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="额定电流"  
 prop="electricCurrent" >
                        <p>{{dataForm.electricCurrent}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24" >
                <el-form-item  label="使用年限"  
 prop="serviceLife" >
                        <p>{{dataForm.serviceLife}}</p>
                </el-form-item>
            </el-col>
        </el-row>
        </el-col>
            </el-tab-pane >
                <el-tab-pane  label="备件">
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2></h2>
            </div>
    <el-table :data="dataForm.equipment_product_relList" size='mini'   >
        <el-table-column type="index" width="60" label="序号" align="center" />
            <el-table-column prop="productId" label="编号">
            <template slot-scope="scope">
                            <p>{{scope.row.productId}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="" label="名称">
            <template slot-scope="scope">
                            <p>{{scope.row.productId_name}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="" label="规格">
            <template slot-scope="scope">
                            <p>{{scope.row.productId_specification}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="qty" label="需求数量">
            <template slot-scope="scope">
                            <p>{{scope.row.qty}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="" label="现有库存">
            <template slot-scope="scope">
                            <p>{{scope.row.productId_repertory}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="note" label="备注">
            <template slot-scope="scope">
                            <p>{{scope.row.note}}</p>
        </template>
        </el-table-column>
    </el-table>
    </el-form-item>
    </el-col>
            </el-tab-pane >
                <el-tab-pane  label="保养">
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2></h2>
            </div>
    <el-table :data="dataForm.equipment_task_generationList" size='mini'   >
        <el-table-column type="index" width="60" label="序号" align="center" />
            <el-table-column prop="equimentMaintainTypeId" label="内容">
            <template slot-scope="scope">
                            <p>{{scope.row.equimentMaintainTypeId}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="frequency" label="频次">
            <template slot-scope="scope">
                            <p>{{scope.row.frequency}}</p>
        </template>
        </el-table-column>
            <el-table-column prop="frequencyType" label="频次类型">
            <template slot-scope="scope">
                        <p>{{ scope.row.frequencyType | dynamicText(frequencyTypeOptions) }}</p>
        </template>
        </el-table-column>
            <el-table-column prop="lastTime" label="上次保养时间">
            <template slot-scope="scope">
                            {{scope.row.lastTime}}
        </template>
        </el-table-column>
    </el-table>
    </el-form-item>
    </el-col>
            </el-tab-pane >
                <el-tab-pane  label="点检">
            </el-tab-pane >
                <el-tab-pane  label="工序">
            </el-tab-pane >
                <el-tab-pane  label="附件">
            <el-col :span="24" >
                <el-form-item  label="附件"  
 prop="file" >
                    <JNPF-UploadFz    v-model="dataForm.file"
 disabled
 detailed  :fileSize="10"  sizeUnit="MB"  :limit="9"  buttonText="点击上传"  >
                </JNPF-UploadFz>
                </el-form-item>
            </el-col>
            </el-tab-pane >
            </el-tabs>
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
                            categoryId : "",
                            purchaseDate : '',
                            effectiveDate : '',
                            pic : [],
                            mrpWorkshopId : "1",
                            portraitMin : '',
                            portraitMax : '',
                            axialMin : '',
                            axialMax : '',
                            note : '',
                            active : 1,
                            productDate : '',
                            warrantyDate : '',
                            brank : '',
                            weight : '',
                            power : '',
                            voltage : '',
                            supplier : '',
                            cost : '',
                            trade : '',
                            usin : '',
                            electricCurrent : '',
                            serviceLife : '',
                            file : [],
                        equipment_product_relList:[],
                        equipment_task_generationList:[],
            },
                            activeuwxmxg:'2',
                        categoryIdProps:{"label":"name","value":"id"  ,"children":"children" },

                                    frequencyTypeOptions:[{"fullName":"天数","id":"1"},{"fullName":"次数","id":"2"}],
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
                        _dataAll.pic = _dataAll.pic ? JSON.parse( _dataAll.pic):[]
                        _dataAll.file = _dataAll.file ? JSON.parse( _dataAll.file):[]
                for(let i=0;i<_dataAll.equipment_product_relList.length;i++){
                    var _list = _dataAll.equipment_product_relList[i];
                }
                for(let i=0;i<_dataAll.equipment_task_generationList.length;i++){
                    var _list = _dataAll.equipment_task_generationList[i];
                            _list.frequencyType = _list.frequencyType? JSON.parse(_list.frequencyType):[]
                             _list.lastTime = _list.lastTime ? jnpf.toDate(_list.lastTime,"yyyy-MM-dd HH:mm:ss") : ''
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
                            url: '/api/equipment/Equipment/detail/'+this.dataForm.id,
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
