<template>
<el-dialog :title="!dataForm.id ? '新建' :'编辑'"
           :close-on-click-modal="false" append-to-body
           :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center" lock-scroll
           width="600px">
<el-row :gutter="15" class="">
<el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px" label-position="right" >
    <template v-if="!loading">
            <el-col :span="24"  >
                <el-form-item  label="设备"  
 prop="equipmentId" >
                    <el-select   v-model="dataForm.equipmentId"
 placeholder="请选择"  clearable  :style='{"width":"100%"}'>
                            <el-option v-for="(item, index) in equipmentIdOptions" :key="index" :label="item.name" :value="item.F_Id" :disabled="item.disabled" ></el-option>

                </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="产品"  
 prop="productId" >
                    <el-select   v-model="dataForm.productId"
 placeholder="请选择"  clearable  :style='{"width":"100%"}'>
                            <el-option v-for="(item, index) in productIdOptions" :key="index" :label="item.name" :value="item.F_Id" :disabled="item.disabled" ></el-option>

                </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="需求数量"  
 prop="qty" >
                    <el-input   v-model="dataForm.qty"
 placeholder="请输入"  clearable  :style='{"width":"100%"}'>

                </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24"  >
                <el-form-item  label="备注"  
 prop="note" >
                    <el-input   v-model="dataForm.note"
 placeholder="请输入"  :style='{"width":"100%"}' true  type="textarea"  :autosize='{"minRows":4,"maxRows":4}' >

                </el-input>
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
                                equipmentId : "",
                                productId : "",
                                    qty : '',
                                    note : '',
                                active : 1,
            },
            rules:
            {
                equipmentId: [
                                {
                                    required: true,
                                    message: '请选择',
                                    trigger: 'change'
                                },
                        ],
                            productId: [
                                {
                                    required: true,
                                    message: '请选择',
                                    trigger: 'change'
                                },
                        ],
                            qty: [
                                {
                                    required: true,
                                    message: '请输入',
                                    trigger: 'blur'
                                },
                        ],



            },
                        equipmentIdOptions:[],
                        productIdOptions:[],

        }
        },
        computed: {},
        watch: {},
        created() {
                    this.getequipmentIdOptions();
                    this.getproductIdOptions();
        },
        mounted() {},
        methods: {
                    getequipmentIdOptions() {
                        getDataInterfaceRes('337912333508542533').then(res => {
                            let data = res.data
                            this.equipmentIdOptions = data
                        })
                    },
                    getproductIdOptions() {
                        getDataInterfaceRes('340388223601609541').then(res => {
                            let data = res.data
                            this.productIdOptions = data
                        })
                    },
            clearData(){
                               this.dataForm.equipmentId = "";
                               this.dataForm.productId = "";
                               this.dataForm.qty = '';
                               this.dataForm.note = '';
                                 this.dataForm.active = 1;
            },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if(this.dataForm.id){
                        this.loading = true
                        request({
                            url: '/api/equipmentProductRel/Equipment_product_rel/'+this.dataForm.id,
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
                            this.request()
                    }
                })
            },
            request() {
                this.btnLoading = true
                let _data =this.dataList()
                if (!this.dataForm.id) {
                    request({
                        url: '/api/equipmentProductRel/Equipment_product_rel',
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
                        url: '/api/equipmentProductRel/Equipment_product_rel/'+this.dataForm.id,
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
                return _data;
            },
            dataInfo(dataAll){
                let _dataAll =dataAll
                this.dataForm = _dataAll
            },
        },
    }

</script>
