<template>
<el-dialog :title="!dataForm.id ? '新建' :'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="60px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24"  >
                <el-form-item  label="名称"  
 prop="name" >
                    <el-input   v-model="dataForm.name"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="编码"  
 prop="code" >
                    <el-input   v-model="dataForm.code"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="排序"  
 prop="sortcode" >
                    <el-input-number   v-model="dataForm.sortcode"
 placeholder="数字文本"  :max="10"  :step="1"  controls-position='right' >

                </el-input-number>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="参数"  
 prop="arg" >
                    <el-input   v-model="dataForm.arg"
 placeholder="请输入"  :style='{"width":"100%"}' true  type="textarea"  :autosize='{"minRows":4,"maxRows":4}' >

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="描述"  
 prop="description" >
                    <el-input   v-model="dataForm.description"
 placeholder="请输入"  :style='{"width":"100%"}' true  type="textarea"  :autosize='{"minRows":4,"maxRows":4}' >

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8"  >
                <el-form-item  label="颜色"  
 prop="color" >
                    <el-color-picker   v-model="dataForm.color"
 size="small" >

                </el-color-picker>
                </el-form-item>
            </el-col>
            <el-col :span="10"  >
                <el-form-item  label="启用"  
 prop="active" >
                    <el-switch   v-model="dataForm.active"
 :active-value="1"  :inactive-value="0" >

                </el-switch>
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
            },
                tableRows:{
                },
            currVmodel:"",
            dataForm: {
                                    name : '',
                                    code : '',
                                sortcode : 0,
                                    arg : '',
                                    description : '',
                                    color : '',
                                active : 0,
                                creatoruserid : "",
                                creatortime : "",
                                lastmodifyuserid : "",
                                lastmodifytime : "",
            },
            rules:
            {



            },

        }
        },
        computed: {},
        watch: {},
        created() {
        },
        mounted() {},
        methods: {
            clearData(){
                               this.dataForm.name = '';
                               this.dataForm.code = '';
                                 this.dataForm.sortcode = 0;
                               this.dataForm.arg = '';
                               this.dataForm.description = '';
                               this.dataForm.color = '';
                                 this.dataForm.active = 0;
                               this.dataForm.creatoruserid = "";
                               this.dataForm.creatortime = "";
                               this.dataForm.lastmodifyuserid = "";
                               this.dataForm.lastmodifytime = "";
            },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/jx/Equipment_state/'+this.dataForm.id,
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
                sessionStorage.removeItem("equipmentStateColor");
                this.$refs['elForm'].validate((valid) => {
                    if (valid) {
                            this.request()
                    }
                })
            },
            request() {
                this.btnLoading = true
                let _data =this.dataList()
                if (!this.dataForm.id) {
                    request({
                        url: '/api/jx/Equipment_state',
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
                        url: '/api/jx/Equipment_state/'+this.dataForm.id,
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
        _data.active = parseInt(_data.active)
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
        _dataAll.active = parseInt(_dataAll.active)
                this.dataForm = _dataAll
            },
        },
    }

</script>
