<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="800px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
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
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="盒子ID" prop="uuid">
                            <el-input v-model="dataForm.uuid" placeholder="请输入" clearable :style='{"width":"100%"}'>
                                <el-button slot="append" icon="el-icon-thumb" @click="verificationIot(true)">
                                </el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="生产车间" prop="mrpWorkshopId">
                            <JNPFTreeSelect v-model="dataForm.mrpWorkshopId" placeholder="请选择" clearable
                                :options="mrpWorkshopIdOptions" :props="mrpWorkshopIdProps">

                            </JNPFTreeSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="设备类型" prop="typeS">
                            <el-select v-model="dataForm.typeS" placeholder="请选择" clearable :style='{"width":"100%"}'>
                                <el-option v-for="(item, index) in typeSOptions" :key="index" :label="item.fullName"
                                    :value="item.enCode" :disabled="item.disabled"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="24">
                        <el-form-item label="设备类型" prop="typeS">
                            <el-select v-model="dataForm.typeS" placeholder="请选择" >
                                <el-option v-for="item in typeSOptions" :label="item.label" :value="item.id">{{item.label}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="理论节拍" prop="theoryBeat">
                            <el-input v-model="dataForm.theoryBeat" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="长" prop="length">
                            <el-input v-model="dataForm.length" placeholder="请输入" clearable :style='{"width":"100%"}'>
                                <template slot="append">mm</template>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="X坐标" prop="axisX">
                            <el-input v-model="dataForm.axisX" placeholder="请输入" clearable :style='{"width":"100%"}'>

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
                        <el-form-item label="y坐标" prop="axisY">
                            <el-input v-model="dataForm.axisY" placeholder="请输入" clearable :style='{"width":"100%"}'>

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
                        <el-form-item label="z坐标" prop="axisZ">
                            <el-input v-model="dataForm.axisZ" placeholder="请输入" clearable :style='{"width":"100%"}'>

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
                    mrpWorkshopId: "",
                    theoryBeat: '',
                    length: '',
                    axisX: '',
                    width: '',
                    axisY: '',
                    height: '',
                    axisZ: "",
                    effectiveDate: "",
                    typeS: "CG",
                    active: 1,
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入设备名称',
                        trigger: 'blur'
                    }, ],
                    code: [{
                        required: true,
                        message: '请输入设备编号',
                        trigger: 'blur'
                    }, ],
                    uuid: [{
                        required: true,
                        message: '请输入盒子ID',
                        trigger: 'blur'
                    }, ],
                    mrpWorkshopId: [{
                        required: true,
                        message: '请选择生产车间',
                        trigger: 'change'
                    }, ],
                    theoryBeat: [{
                            required: true,
                            message: '请输入理论节拍',
                            trigger: 'blur'
                        },
                        {
                            pattern: /^\d+$/,
                            message: '请输入正确的数字',
                            trigger: 'blur'
                        },
                    ],



                },
                mrpWorkshopIdOptions: [],
                mrpWorkshopIdProps: {
                    "label": "name",
                    "value": "id",
                    "children": "children"
                },

                typeSOptions: [{
                        label: '生产设备',
                        id: 'CG',
                    },
                    {
                        label: '生产检测一体机',
                        id: 'SCJC',
                    },
                    {
                        label: '检测机',
                        id: 'JC',
                    }

                ],
                typeSProps: {
                    "label": "name",
                    "value": "id",
                },


            }
        },
        computed: {},
        watch: {},
        created() {
            this.getmrpWorkshopIdOptions();
            this.gettypeSOptions();
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

            getmrpWorkshopIdOptions() {
                getDataInterfaceRes('342715607101211205').then(res => {
                    let data = res.data
                    this.mrpWorkshopIdOptions = data
                })
            },
            //查询设备类型集合
            gettypeSOptions() {
                getDictionaryDataSelector('350188256479946181').then(res => {
                    let arr = [];
                    for (var i = 0; i < res.data.list.length; i++) {
                        let item = res.data.list[i]
                        if(item.enCode == 'NH'){
                            item.disabled = true;
                        }
                        arr.push(item)
                    }

                    this.typeSOptions = arr

                })
            },

            clearData() {
                this.dataForm.name = '';
                this.dataForm.code = '';
                this.dataForm.uuid = '';
                this.dataForm.mrpWorkshopId = "";
                this.dataForm.theoryBeat = '';
                this.dataForm.length = '';
                this.dataForm.axisX = '';
                this.dataForm.width = '';
                this.dataForm.axisY = '';
                this.dataForm.height = '';
                this.dataForm.axisZ = "";
                this.dataForm.effectiveDate = "";
                this.dataForm.typeS = "CG";
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
                        getEquipmentItem(_query).then(res => {
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
