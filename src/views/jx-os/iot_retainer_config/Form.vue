<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="110px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <el-form-item label="异常编码" prop="uuid">
                            <el-input v-model="dataForm.uuid" placeholder="请输入" clearable :style='{"width":"100%"}' readonly="true">

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="异常名称" prop="name">
                            <el-input v-model="dataForm.name" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
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
                    uuid: '',
                    name: '',
                    customUuid: '',
                    customName: '',
                    state: 1,
                    type: "",
                    uidList: [],
                    expression: '',
                    remark: '',
                    active: 1,
                },
                rules: {
                    uuid: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    name: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    customUuid: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    customName: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    type: [{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }, ],
                    uidList: [{
                        required: true,
                        message: '请至少选择一个',
                        trigger: 'change'
                    }, ],



                },
                typeOptions: [{
                    "fullName": "EVENT",
                    "id": "EVENT"
                }, {
                    "fullName": "WARN",
                    "id": "WARN"
                }, {
                    "fullName": "ERROR",
                    "id": "ERROR"
                }],
                uidListOptions: [],

            }
        },
        computed: {},
        watch: {},
        created() {
            this.getuidListOptions();
        },
        mounted() {},
        methods: {
            getuidListOptions() {
                getDataInterfaceRes('349818079917646597').then(res => {
                    let data = res.data
                    this.uidListOptions = data
                })
            },
            clearData() {
                this.dataForm.uuid = '';
                this.dataForm.name = '';
                this.dataForm.customUuid = '';
                this.dataForm.customName = '';
                this.dataForm.state = 1;
                this.dataForm.type = "";
                this.dataForm.uidList = [];
                this.dataForm.expression = '';
                this.dataForm.remark = '';
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
                            url: '/api/jx/Iot_retainer_config/' + this.dataForm.id,
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
                        url: '/api/jx/Iot_retainer_config',
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
                        url: '/api/jx/Iot_retainer_config/' + this.dataForm.id,
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
                _data.state = parseInt(_data.state)
                _data.uidList = Array.isArray(_data.uidList) ? JSON.stringify(_data.uidList) : '[]'
                return _data;
            },
            dataInfo(dataAll) {
                let _dataAll = dataAll
                _dataAll.state = parseInt(_dataAll.state)
                _dataAll.uidList = _dataAll.uidList ? JSON.parse(_dataAll.uidList) : []
                this.dataForm = _dataAll
            },
        },
    }
</script>
