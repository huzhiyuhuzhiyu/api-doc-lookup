<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="800px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <el-form-item label="工单号" prop="name">
                            <el-input v-model="dataForm.name" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="订单编号" prop="productionId">
                            <el-input v-model="dataForm.productionId" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="产品名称" prop="productId">
                            <popupSelect v-model="dataForm.productId" placeholder="请选择" clearable field="productId"
                                interfaceId="360815715508294853" :columnOptions="productIdcolumnOptions"
                                propsValue="F_Id" relationField="name" popupType="dialog" popupTitle="选择数据"
                                popupWidth="800px">

                            </popupSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="工序名称" prop="processId">
                            <popupSelect v-model="dataForm.processId" placeholder="请选择" clearable field="processId"
                                interfaceId="360816814696961221" :columnOptions="processIdcolumnOptions"
                                propsValue="F_Id" relationField="name" popupType="dialog" popupTitle="选择数据"
                                popupWidth="800px">

                            </popupSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="设备名称" prop="equipmentId">
                            <popupSelect v-model="dataForm.equipmentId" placeholder="请选择" clearable field="equipmentId"
                                interfaceId="349818079917646597" :columnOptions="equipmentIdcolumnOptions"
                                propsValue="F_Id" relationField="name" popupType="dialog" popupTitle="选择数据"
                                popupWidth="800px">

                            </popupSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="操作工" prop="userId">
                            <el-input v-model="dataForm.userId" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="状态" prop="state">
                            <el-select v-model="dataForm.state" placeholder="请选择" clearable :style='{"width":"100%"}'>
                                <el-option v-for="(item, index) in stateOptions" :key="index" :label="item.fullName"
                                    :value="item.enCode" :disabled="item.disabled"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="计划数量" prop="qtyOrder">
                            <el-input v-model="dataForm.qtyOrder" placeholder="数字文本" :step="100">

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="报工数量" prop="qtyProduced">
                            <el-input-number v-model="dataForm.qtyProduced" placeholder="数字文本" :step="100">

                            </el-input-number>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="12">
                        <el-form-item label="上工时间" prop="dateStart">
                            <el-date-picker v-model="dataForm.dateStart" placeholder="请选择" clearable
                                :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                value-format="timestamp">

                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下工时间" prop="dateEnd">
                            <el-date-picker v-model="dataForm.dateEnd" placeholder="请选择" clearable
                                :style='{"width":"100%"}' type="datetime" format="yyyy-MM-dd HH:mm:ss"
                                value-format="timestamp">

                            </el-date-picker>
                        </el-form-item>
                    </el-col> -->
                </template>
            </el-form>
            <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
                @select="addForSelect" @close="selectDialogVisible=false" />
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false"> 取 消</el-button>
            <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading"> 确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import request from '@/utils/request'
    import {
        getDataInterfaceRes
    } from '@/api/systemData/dataInterface'
    import {
        getDictionaryDataSelector
    } from '@/api/systemData/dictionary'

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
                addTableConf: {},
                tableRows: {},
                currVmodel: "",
                dataForm: {
                    name: '',
                    productionId: '',
                    productId: "",
                    processId: "",
                    equipmentId: "",
                    userId: '',
                    state: "wait",
                    qtyOrder: undefined,
                    qtyProduced: 0,
                    dateStart: '',
                    dateEnd: '',
                    active:1,
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    productionId: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    productId: [{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }, ],
                    processId: [{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }, ],
                    equipmentId: [{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }, ],
                    userId: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    state: [{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }, ],
                    qtyOrder: [{
                        required: true,
                        message: '数字文本',
                        trigger: ["blur", "change"]
                    }, ],



                },
                productIdcolumnOptions: [{
                    "label": "产品名称",
                    "value": "name"
                }, ],
                processIdcolumnOptions: [{
                    "label": "工序名称",
                    "value": "name"
                }, ],
                equipmentIdcolumnOptions: [{
                    "label": "设备名称",
                    "value": "name"
                }, ],
                stateOptions: [],

            }
        },
        computed: {},
        watch: {},
        created() {
            this.getstateOptions();
        },
        mounted() {},
        methods: {
            getstateOptions() {
                getDictionaryDataSelector('360813212683211973').then(res => {
                    // this.stateOptions = res.data.list
                    let _list = res.data.list;
                    for (var i = 0; i < _list.length; i++) {
                        if(_list[i].enCode !='wait' && _list[i].enCode != 'ready'){
                            console.log("123");
                            _list[i].disabled = true
                        }
                    }

                    this.stateOptions = _list;

                })
            },
            clearData() {
                this.dataForm.name = '';
                this.dataForm.productionId = '';
                this.dataForm.productId = "";
                this.dataForm.processId = "";
                this.dataForm.equipmentId = "";
                this.dataForm.userId = '';
                this.dataForm.state = "wait";
                this.dataForm.qtyOrder = undefined,
                this.dataForm.qtyProduced = 0;
                this.dataForm.dateStart = '';
                this.dataForm.dateEnd = '';
                this.dataForm.active = 1;
            },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if (this.dataForm.id) {
                        this.loading = true
                        request({
                            url: '/api/jx/Mrp_workorder/' + this.dataForm.id,
                            method: 'get'
                        }).then(res => {
                            this.dataInfo(res.data)
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
                        url: '/api/jx/Mrp_workorder',
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
                    }).catch(() => {
                        this.btnLoading = false
                    })
                } else {
                    request({
                        url: '/api/jx/Mrp_workorder/' + this.dataForm.id,
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
                    }).catch(() => {
                        this.btnLoading = false
                    })
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
                    let item = {
                        ...this.tableRows[this.currVmodel],
                        ...data[i]
                    }
                    this.dataForm[this.currVmodel].push(item)
                }
            },
            dataList() {
                var _data = JSON.parse(JSON.stringify(this.dataForm));
                return _data;
            },
            dataInfo(dataAll) {
                let _dataAll = dataAll
                this.dataForm = _dataAll
            },
        },
    }
</script>
