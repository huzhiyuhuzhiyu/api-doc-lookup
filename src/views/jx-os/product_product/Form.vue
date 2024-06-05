<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <el-form-item label="产品编码" prop="code">
                            <el-input v-model="dataForm.code" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="产品名称" prop="name">
                            <el-input v-model="dataForm.name" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="产品规格" prop="specification">
                            <el-input v-model="dataForm.specification" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                   <!-- <el-col :span="12">
                        <el-form-item label="长" prop="length">
                            <el-input v-model="dataForm.length" placeholder="请输入" clearable :style='{"width":"100%"}'>
                                <template slot="append">mm</template>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最低库存" prop="minimum">
                            <el-input v-model="dataForm.minimum" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="宽" prop="width">
                            <el-input v-model="dataForm.width" placeholder="请输入" clearable :style='{"width":"100%"}'>
                                <template slot="append">mm</template>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="安全库存" prop="safety">
                            <el-input v-model="dataForm.safety" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="高" prop="height">
                            <el-input v-model="dataForm.height" placeholder="请输入" clearable :style='{"width":"100%"}'>
                                <template slot="append">mm</template>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="最高库存" prop="maximum">
                            <el-input v-model="dataForm.maximum" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="体积" prop="volumn">
                            <el-input v-model="dataForm.volumn" placeholder="请输入" clearable :style='{"width":"100%"}'>
                                <template slot="append">mm³</template>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="重量" prop="weight">
                            <el-input v-model="dataForm.weight" placeholder="请输入" clearable :style='{"width":"100%"}'>
                                <template slot="append">g</template>

                            </el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="描述" prop="description">
                            <el-input v-model="dataForm.description" placeholder="请输入" :style='{"width":"100%"}' true
                                type="textarea" :autosize='{"minRows":4,"maxRows":4}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="附件" prop="files">
                            <JNPF-UploadFz v-model="dataForm.files" :fileSize="10" sizeUnit="MB" :limit="9"
                                buttonText="点击上传">

                            </JNPF-UploadFz>
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
                    code: '',
                    name: '',
                    specification: "",
                    length: "",
                    minimum: "",
                    width: '',
                    safety: "",
                    height: '',
                    maximum: "",
                    volumn: '',
                    weight: '',
                    description: '',
                    files: [],
                },
                rules: {
                    code: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    name: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    specification: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    length: [],
                    minimum: [],
                    width: [],
                    safety: [],
                    height: [],
                    maximum: [],



                },

            }
        },
        computed: {},
        watch: {},
        created() {},
        mounted() {},
        methods: {
            clearData() {
                this.dataForm.code = '';
                this.dataForm.name = '';
                this.dataForm.specification = "";
                this.dataForm.length = "";
                this.dataForm.minimum = "";
                this.dataForm.width = '';
                this.dataForm.safety = "";
                this.dataForm.height = '';
                this.dataForm.maximum = "";
                this.dataForm.volumn = '';
                this.dataForm.weight = '';
                this.dataForm.description = '';
                this.dataForm.files = [];
            },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if (this.dataForm.id) {
                        this.loading = true
                        request({
                            url: '/api/jx/Product_product/' + this.dataForm.id,
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
                        url: '/api/jx/Product_product',
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
                        url: '/api/jx/Product_product/' + this.dataForm.id,
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
                _data.files = Array.isArray(_data.files) ? JSON.stringify(_data.files) : '[]'
                return _data;
            },
            dataInfo(dataAll) {
                let _dataAll = dataAll
                _dataAll.files = _dataAll.files ? JSON.parse(_dataAll.files) : []
                this.dataForm = _dataAll
            },
        },
    }
</script>
