<template>
    <el-dialog title="联网" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                   <!-- <el-col :span="24">
                        <el-form-item label="设备名称" prop="name">
                            <el-input v-model="dataForm.name" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="24">
                        <el-form-item label="设备编号" prop="code">
                            <el-input v-model="dataForm.code" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="盒子ID" prop="uuid">
                            <el-input v-model="dataForm.uuid" placeholder="请输入" clearable :style='{"width":"100%"}'>
                                <el-button slot="append" icon="el-icon-thumb" @click="verificationIot(true)">
                                </el-button>
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
    import {
        getEquipmentItem
    } from '@/api/iot'

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
                    code: '',
                    uuid: '',
                },
                rules: {
                    uuid: [{
                        required: true,
                        message: '请输入盒子ID',
                        trigger: 'blur'
                    }, ],

                },

            }
        },
        computed: {},
        watch: {},
        created() {
        },
        mounted() {},
        methods: {

            //验证是否联网
            async verificationIot(f) {
                if (this.dataForm.uuid != '' && this.dataForm.uuid != undefined && this.dataForm.uuid != null) {
                    let _query = {
                        uid: this.dataForm.uuid
                    }
                    let res = await getEquipmentItem(_query)

                    if (res.data.result != null) {
                        if (f) {
                            this.$message({
                                message: '验证成功',
                                type: 'success',
                                center: true
                            });
                        }
                        return true;
                    } else {
                        if (f) {
                            this.$message({
                                message: '验证失败,无效盒子ID',
                                type: 'error',
                                center: true
                            });
                        }
                        return false;
                    }

                } else {
                    this.$message({
                        message: '请输入盒子ID',
                        type: 'warning',
                        center: true
                    });
                }


            },


            clearData() {
                this.dataForm.name = '';
                this.dataForm.code = '';
                this.dataForm.uuid = '';

            },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if (this.dataForm.id) {
                        this.loading = true
                        request({
                            url: '/api/jx/EquipmentIot/' + this.dataForm.id,
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
                        let _query = {
                            uid: this.dataForm.uuid
                        }
                        getEquipmentItem(_query).then(res =>{
                            if (res.data.result != null) {
                               this.request();
                            } else {
                                this.$message({
                                    message: '操作失败,无效盒子ID',
                                    type: 'error',
                                    center: true
                                });
                            }

                        })
                    }
                })
            },
            request() {
                this.btnLoading = true
                let _data = this.dataList()
                if (!this.dataForm.id) {
                    request({
                        url: '/api/jx/EquipmentIot',
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
                        url: '/api/jx/EquipmentIot/' + this.dataForm.id,
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
