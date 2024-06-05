<template>
<el-dialog :title="!dataForm.id ? '新建' :'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24"  >
                <el-form-item  label="设备盒子ID"  
 prop="uid" >
                    <popupSelect   v-model="dataForm.uid"
 placeholder="请选择"  clearable                         field="uid" interfaceId="349818079917646597" :columnOptions="uidcolumnOptions" propsValue="uuid" relationField="name" popupType="dialog"
 popupTitle="选择数据"  popupWidth="800px"
  >

                </popupSelect>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="弹窗选择属性"  
>
                    <popupAttr 
 relationField="uid"  showField="name" >

                </popupAttr>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="历程分类"  
 prop="category" >
                    <el-input   v-model="dataForm.category"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="历程编号"  
 prop="retaineruuid" >
                    <el-input   v-model="dataForm.retaineruuid"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="历程配置uuid"  
 prop="retainerconfiguuid" >
                    <el-input   v-model="dataForm.retainerconfiguuid"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="中文说明"  
 prop="lableZh" >
                    <el-input   v-model="dataForm.lableZh"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="英文说明"  
 prop="lableEn" >
                    <el-input   v-model="dataForm.lableEn"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="开始时间"  
 prop="start" >
                    <el-date-picker   v-model="dataForm.start"
 placeholder="请选择"  clearable  :style='{"width":"100%"}' type="datetime"  format="yyyy-MM-dd HH:mm:ss"  value-format="timestamp" >

                </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="结束时间"  
 prop="stop" >
                    <el-date-picker   v-model="dataForm.stop"
 placeholder="请选择"  clearable  :style='{"width":"100%"}' type="date"  format="yyyy-MM-dd"  value-format="timestamp" >

                </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="持续时间"  
 prop="duration" >
                    <el-input   v-model="dataForm.duration"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="状态"  
 prop="state" >
                    <el-input   v-model="dataForm.state"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="处理状态"  
 prop="disposeState" >
                    <el-select   v-model="dataForm.disposeState"
 placeholder="请选择"  clearable  :style='{"width":"100%"}'>
                            <el-option v-for="(item, index) in disposeStateOptions" :key="index" :label="item.fullName" :value="item.enCode" :disabled="item.disabled" ></el-option>

                </el-select>
                </el-form-item>
            </el-col>
    <el-col :span="24"  >
    <el-form-item label-width="0">
            <div class="JNPF-common-title">
                <h2></h2>
            </div>
    <el-table :data="dataForm.equipmentList" size='mini'   >
        <el-table-column type="index" width="60" label="序号" align="center" />
            <el-table-column prop="name" label="设备名称" >
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.name"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="code" label="设备编号" >
                <template slot-scope="scope">
                    <el-input   v-model="scope.row.code"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>
                </el-input>
            </template>
        </el-table-column>
            <el-table-column prop="mrpWorkshopId" label="生产车间" >
                <template slot-scope="scope">
                    <JNPFTreeSelect   v-model="scope.row.mrpWorkshopId"
 placeholder="请选择"  clearable  :options="equipmentmrpWorkshopIdOptions" :props="equipmentmrpWorkshopIdProps" >
                </JNPFTreeSelect>
            </template>
        </el-table-column>
    <el-table-column label="操作" width="60" >
        <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="delequipmentList(scope.$index)">删除</el-button>
        </template>
    </el-table-column>
    </el-table>
        <div class="table-actions" @click="addequipmentList()">
            <el-button type="text" icon="el-icon-plus">添加</el-button>
        </div>
    </el-form-item>
    </el-col>
    </template>
</el-form>
    <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm"
              ref="selectDialog" @select="addForSelect" @close="selectDialogVisible=false"/>
    </el-row>
    <span slot="footer" class="dialog-footer">
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
                currTableConf:{},
                addTableConf:{
                        equipmentList :{"popupType":"dialog","hasPage":true,"popupTitle":"选择数据","pageSize":20,"columnOptions":[],"interfaceId":"","interfaceName":"","relationOptions":[],"templateJson":[],"popupWidth":"800px"},
            },
                tableRows:{
                            equipmentList:{
                                    name : '',
                                    code : '',
                            enabledmark:undefined
                    },
                },
            currVmodel:"",
            dataForm: {
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
            rules:
            {



            },
                    uidcolumnOptions:[ {"label":"设备名称","value":"name"}, {"label":"盒子ID","value":"uuid"},],
                        disposeStateOptions:[],

                        equipmentmrpWorkshopIdOptions:[],
                                equipmentmrpWorkshopIdProps:{"label":"name","value":"id"  ,"children":"children" },
        }
        },
        computed: {},
        watch: {},
        created() {
                    this.getdisposeStateOptions();
                        this.getequipmentmrpWorkshopIdOptions();
        },
        mounted() {},
        methods: {
				equipmentExist() {
				let isOk = true;
					for(let i=0;i<this.dataForm.equipmentList.length;i++){
						const e = this.dataForm.equipmentList[i];
					}
				return isOk;
			},
                    getdisposeStateOptions() {
                        getDictionaryDataSelector('356784053652840837').then(res => {
                            this.disposeStateOptions = res.data.list
                        })
                    },
                        getequipmentmrpWorkshopIdOptions() {
                            getDataInterfaceRes('342715607101211205').then(res => {
                                let data = res.data
                                this.equipmentmrpWorkshopIdOptions = data
                            })
                        },
            clearData(){
                               this.dataForm.uid = "OBJ20220424000099";
                               this.dataForm.category = '';
                               this.dataForm.retaineruuid = '';
                               this.dataForm.retainerconfiguuid = '';
                               this.dataForm.lableZh = '';
                               this.dataForm.lableEn = '';
                               this.dataForm.start = '';
                               this.dataForm.stop = '';
                               this.dataForm.duration = '';
                               this.dataForm.state = '';
                               this.dataForm.disposeState = "undisposed";
                        this.dataForm.equipmentList=[];
            },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/jx/Retainer/'+this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
                            this.loading = false
                        });
                    }else{
                       this.clearData()
                    }
                });
                this.$store.commit('generator/UPDATE_RELATION_DATA', {})
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['elForm'].validate((valid) => {
                    if (valid) {
                            if (!this.equipmentExist()) return
                            this.request()
                    }
                })
            },
            request() {
                this.btnLoading = true
                let _data =this.dataList()
                if (!this.dataForm.id) {
                    request({
                        url: '/api/jx/Retainer',
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
                    }).catch(()=>{  this.btnLoading = false  })
                }else{
                    request({
                        url: '/api/jx/Retainer/'+this.dataForm.id,
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
                    }).catch(()=>{  this.btnLoading = false  })
                }
            },
                addequipmentList(){
                let item = {
                            name:undefined,
                            code:undefined,
                            mrpWorkshopId:'',
            }
                this.dataForm.equipmentList.push(item)
            },
                delequipmentList(index) {
                    this.dataForm.equipmentList.splice(index, 1);
                },
            openSelectDialog(key) {
                this.currTableConf=this.addTableConf[key]
                this.currVmodel=key
                this.selectDialogVisible = true
                this.$nextTick(() => {
                    this.$refs.selectDialog.init()
                })
            },
            addForSelect(data) {
                for (let i = 0; i < data.length; i++) {
                    let item={...this.tableRows[this.currVmodel],...data[i]}
                    this.dataForm[this.currVmodel].push(item)
                }
            },
            dataList(){
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                    for(let i=0;i<_data.equipmentList.length;i++){
                        var _list = _data.equipmentList[i];
                    }
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                    for(let i=0;i<_dataAll.equipmentList.length;i++){
                        var _list = _dataAll.equipmentList[i];
                    }
                this.dataForm = _dataAll
            },
        },
    }

</script>
