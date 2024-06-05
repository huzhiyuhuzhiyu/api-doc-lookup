<template>
    <el-dialog :title="title"  :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
        <el-row :gutter="22" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="medium" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="12">
                        <el-form-item label="设备" prop="equimentId">
                            <popupSelect v-model="dataForm.equimentId" placeholder="请选择" clearable field="equimentId"
                                interfaceId="337912333508542533" :columnOptions="equimentIdcolumnOptions"
                                propsValue="F_Id" relationField="name" popupType="dialog" popupTitle="选择数据"
                                popupWidth="1000px" hasPage :pageSize="20" :disabled="this.id != undefined?true:false">
                            </popupSelect>


                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请人" prop="partnerId">
                            <jnpf-open-data v-model="dataForm.partnerId" readonly type="currUser">

                            </jnpf-open-data>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-show="!dataForm.id?false:true" label="申请时间" prop="requestTime">
                            <el-date-picker v-model="dataForm.requestTime" placeholder="请选择" clearable
                                :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                value-format="timestamp" :readonly="this.id != undefined?true:false">

                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="故障类型" prop="faultId">
                            <el-select v-if="this.id == undefined?true:false" v-model="dataForm.faultId" placeholder="请选择" clearable :style='{"width":"100%"}' >
                                <el-option v-for="(item, index) in faultIdOptions" :key="index" :label="item.name"
                                    :value="item.F_Id" :disabled="item.disabled"></el-option>
                            </el-select>

                            <el-input v-if="this.id == undefined?false:true" v-model="dataForm.faultId" placeholder="请输入" readonly clearable
                                :style='{"width":"100%"}'>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="故障原因" prop="equipmentTroubleId">
                            <el-select v-if="this.id == undefined?true:false" v-model="dataForm.equipmentTroubleId" placeholder="请选择" clearable
                                :style='{"width":"100%"}' @change="measure(dataForm.equipmentTroubleId)" >
                                <el-option v-for="(item, index) in equipmentTroubleIdOptions" :key="index"
                                    :label="item.name" :value="item.F_Id" :disabled="item.disabled"></el-option>
                            </el-select>

                            <el-input v-if="this.id == undefined?false:true" v-model="dataForm.equipmentTroubleId" placeholder="请输入" readonly clearable
                                :style='{"width":"100%"}'>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-show="!dataForm.id?false:true">
                        <el-form-item label="响应人" prop="reviewerId">
                            <el-select v-if="this.id == undefined?true:false" v-model="dataForm.reviewerId" placeholder="请选择" clearable
                                :style='{"width":"100%"}' >
                                <el-option v-for="(item, index) in reviewerIdOptions" :key="index" :label="item.name"
                                    :value="item.F_Id" :disabled="item.disabled"></el-option>
                            </el-select>

                            <el-input v-if="this.id == undefined?false:true" v-model="dataForm.reviewerId" placeholder="请输入" readonly clearable
                                :style='{"width":"100%"}'>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-show="!dataForm.id?false:true">
                        <el-form-item label="响应时间" prop="responseTime">
                            <el-date-picker v-model="dataForm.responseTime" placeholder="请选择" clearable
                                :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                value-format="timestamp" :readonly="this.id != undefined?true:false">

                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-show="!dataForm.id?false:true">
                        <el-form-item label="维修人" prop="repairerId">
                            <el-select v-if="this.id == undefined?true:false" v-model="dataForm.repairerId" placeholder="请选择" clearable
                                :style='{"width":"100%"}' >
                                <el-option v-for="(item, index) in repairerIdOptions" :key="index" :label="item.name"
                                    :value="item.F_Id" :disabled="item.disabled"></el-option>
                            </el-select>

                            <el-input v-if="this.id == undefined?false:true" v-model="dataForm.repairerId" placeholder="请输入" readonly clearable
                                :style='{"width":"100%"}'>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-show="!dataForm.id?false:true" label="响应时长" prop="responseTimes">
                            <el-input v-model="dataForm.responseTimes" placeholder="请输入" readonly clearable
                                :style='{"width":"100%"}'>
                                <template slot="append">分钟</template>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-show="!dataForm.id?false:true"  label="维修时长" prop="maintenanceTime">
                            <el-input v-model="dataForm.maintenanceTime" placeholder="请输入" readonly clearable
                                :style='{"width":"100%"}'>
                                <template slot="append">分钟</template>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-show="!dataForm.id?false:true">
                        <el-form-item label="完成时间" prop="completionTime">
                            <el-date-picker v-model="dataForm.completionTime" placeholder="请选择" clearable
                                :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                value-format="timestamp" :readonly="this.id != undefined?true:false">

                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-show="!dataForm.id?false:true">
                        <el-form-item label="解决措施" prop="solution">
                            <el-input v-model="dataForm.solution" placeholder="请输入" :style='{"width":"100%"}' true
                                type="textarea" :autosize='{"minRows":4,"maxRows":4}' :readonly="this.id != undefined?true:false">

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="note">
                            <el-input v-model="dataForm.note" placeholder="请输入" :style='{"width":"100%"}' true
                                type="textarea" :autosize='{"minRows":4,"maxRows":4}' :readonly="this.id != undefined?true:false">

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="附件" prop="file">
                            <JNPF-UploadImg v-model="dataForm.file" :fileSize="10" sizeUnit="MB" :limit="9" :disabled="this.id != undefined?true:false">

                            </JNPF-UploadImg>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="24">
                        <el-form-item label="状态" prop="state">
                            <el-select v-model="dataForm.state" placeholder="请选择" clearable :style='{"width":"100%"}'>
                                <el-option v-for="(item, index) in stateOptions" :key="index" :label="item.fullName"
                                    :value="item.enCode" :disabled="item.disabled"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col> -->
                </template>
            </el-form>
            <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
                @select="addForSelect" @close="selectDialogVisible=false" />
        </el-row>
        <span slot="footer" v-show="id == undefined?true:false" class="dialog-footer">
            <el-button @click="visible = false"> 取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
import request from '@/utils/request'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'

export default {
    components: {},
    props: [],
    data() {
        return {
            visible: false,
            loading: false,
            btnLoading: false,
            selectDialogVisible: false,
            currTableConf: {},
            addTableConf: {
            },
            tableRows: {
            },
            currVmodel: "",
            dataForm: {
                name: '',
                equimentId: "",
                partnerId: "",
                requestTime: '',
                faultId: "",
                equipmentTroubleId: "",
                reviewerId: "",
                responseTime: '',
                responseTimes: '',
                repairerId: "",
                completionTime: '',
                maintenanceTime: '',
                solution: '',
                note: '',
                file: [],
                active: 1,
                repairType: "设备",
                typeS: "1",
                state: "1",
            },
            rules:
            {
                equimentId: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    },
                ],
                // requestTime: [
                //     {
                //         required: true,
                //         message: '请选择',
                //         trigger: 'change'
                //     },
                // ],
                faultId: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    },
                ],
                equipmentTroubleId: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    },
                ],



            },
            equimentIdcolumnOptions:[ {"label":"名称","value":"name"}, {"label":"编码","value":"code"},],
            equimentIdOptions: [],
            faultIdOptions: [],
            equipmentTroubleIdOptions: [],
            reviewerIdOptions: [],
            repairerIdOptions: [],
            stateOptions: [],
            id:'',
            title:''
        }
    },
    computed: {},
    watch: {},
    created() {
        let myDate = new Date();
        let time = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + (myDate.getDate()) + ' ' + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
        this.dataForm.requestTime = time;
        this.getequimentIdOptions();
        this.getfaultIdOptions();
        this.getequipmentTroubleIdOptions();
        this.getreviewerIdOptions();
        this.getrepairerIdOptions();
        this.getstateOptions();
    },
    mounted() { },
    methods: {
        getequimentIdOptions() {
            getDataInterfaceRes('337912333508542533').then(res => {
                let data = res.data
                this.equimentIdOptions = data
            })
        },
        getfaultIdOptions() {
            getDataInterfaceRes('339743300552492357').then(res => {
                let data = res.data
                this.faultIdOptions = data
            })
        },
        getequipmentTroubleIdOptions() {
            getDataInterfaceRes('339742994766759237').then(res => {
                let data = res.data
                this.equipmentTroubleIdOptions = data
            })
        },
        getreviewerIdOptions() {
            getDataInterfaceRes('339740346177029445').then(res => {
                let data = res.data
                this.reviewerIdOptions = data
            })
        },
        getrepairerIdOptions() {
            getDataInterfaceRes('339740346177029445').then(res => {
                let data = res.data
                this.repairerIdOptions = data
            })
        },
        getstateOptions() {
            getDictionaryDataSelector('345099974142336005').then(res => {
                this.stateOptions = res.data.list
            })
        },
        clearData() {
            this.dataForm.name = '';
            this.dataForm.equimentId = "";
            this.dataForm.partnerId = "";
            this.dataForm.requestTime = '';
            this.dataForm.faultId = "";
            this.dataForm.equipmentTroubleId = "";
            this.dataForm.reviewerId = "";
            this.dataForm.responseTime = '';
            this.dataForm.responseTimes = '';
            this.dataForm.repairerId = "";
            this.dataForm.completionTime = '';
            this.dataForm.maintenanceTime = '';
            this.dataForm.solution = '';
            this.dataForm.note = '';
            this.dataForm.file = [];
            this.dataForm.active = 1;
            this.dataForm.repairType = "设备";
            this.dataForm.typeS = "1";
            this.dataForm.state = "1";
        },
        init(item,id) {
            this.id = id;
            this.dataForm.id = item || 0;
            if(item != undefined && this.id != undefined){
                this.title = "详情";
            }else if(item != undefined){
                this.title = "编辑"
            }else{
                this.title = "新建"
            }
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['elForm'].resetFields();
                if (this.dataForm.id) {
                    this.loading = true
                    request({
                        url: '/api/equipmentRepair/Equipment_repair/' + this.dataForm.id,
                        method: 'get'
                    }).then(res => {
                        this.dataInfo(res.data)

                        if(this.id != undefined){
                            this.faultIdOptions.forEach(el =>{
                                if(this.dataForm.faultId == el.F_Id){
                                    this.dataForm.faultId = el.name
                                }
                            })
                            this.equipmentTroubleIdOptions.forEach(al =>{
                                if(this.dataForm.equipmentTroubleId == al.F_Id){
                                    this.dataForm.equipmentTroubleId = al.name
                                }
                            })
                            this.reviewerIdOptions.forEach(bl =>{
                                if(this.dataForm.reviewerId == bl.F_Id){
                                    this.dataForm.reviewerId = bl.name
                                }
                                if(this.dataForm.repairerId == bl.F_Id){
                                    this.dataForm.repairerId = bl.name
                                }
                            })
                        }
                        this.loading = false
                    });
                } else {
                    this.clearData()
                }
            });
            this.$store.commit('generator/UPDATE_RELATION_DATA', {})
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['elForm'].validate((valid) => {
                if (valid) {
                    this.request()
                }
            })
        },
        request() {
            this.btnLoading = true
            let _data = this.dataList()
            if (!this.dataForm.id) {
                request({
                    url: '/api/equipmentRepair/Equipment_repair',
                    method: 'post',
                    data: _data
                }).then((res) => {
                    this.$message({
                        message: res.msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.visible = false
                            this.btnLoading = false
                            this.$emit('refresh', true)
                        }
                    })
                }).catch(() => { this.btnLoading = false })
            } else {
                request({
                    url: '/api/equipmentRepair/Equipment_repair/' + this.dataForm.id,
                    method: 'PUT',
                    data: _data
                }).then((res) => {
                    this.$message({
                        message: res.msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.visible = false
                            this.btnLoading = false
                            this.$emit('refresh', true)
                        }
                    })
                }).catch(() => { this.btnLoading = false })
            }
        },
        openSelectDialog(key) {
            this.currTableConf = this.addTableConf[key]
            this.currVmodel = key
            this.selectDialogVisible = true
            this.$nextTick(() => {
                this.$refs.selectDialog.init()
            })
        },
        addForSelect(data) {
            for (let i = 0; i < data.length; i++) {
                let item = { ...this.tableRows[this.currVmodel], ...data[i] }
                this.dataForm[this.currVmodel].push(item)
            }
        },
        dataList() {
            var _data = JSON.parse(JSON.stringify(this.dataForm));
            _data.file = Array.isArray(_data.file) ? JSON.stringify(_data.file) : '[]'
            return _data;
        },
        dataInfo(dataAll) {
            let _dataAll = dataAll
            _dataAll.file = _dataAll.file ? JSON.parse(_dataAll.file) : []
            this.dataForm = _dataAll
        },
        measure(id) {
			this.equipmentTroubleIdOptions.forEach(res => {
				if (res.F_Id == id) {
					this.dataForm.solution = res.describes;
				}
			});
		}
    },
}

</script>
    