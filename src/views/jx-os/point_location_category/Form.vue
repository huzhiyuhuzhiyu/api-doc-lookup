<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <el-row :gutter="15">
                            <el-col :span="24">
                                <el-form-item label="分类名称" prop="name">
                                    <el-input v-model="dataForm.name" placeholder="请输入" clearable
                                        :style='{"width":"100%"}'>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="分类类型" prop="type">
                                    <el-select v-model="dataForm.type" placeholder="请选择" @change="typeChange">
                                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24" v-show="dataForm.parentId != '-1'">
                                <el-form-item label="上级分类" prop="parentId">
                                    <JNPFTreeSelect v-model="dataForm.parentId" placeholder="请选择" clearable
                                        :options="parentIdOptions" :props="parentIdProps">

                                    </JNPFTreeSelect>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="note">
                            <el-input v-model="dataForm.note" placeholder="请输入" :style='{"width":"100%"}' true
                                type="textarea" :autosize='{"minRows":5,"maxRows":4}'>

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
        // props: ["defaultValue"],
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
                    parentId: "",
                    note: '',
                    active: 1,
                    type: ''
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    type: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }]


                },
                parentIdOptions: [],
                parentIdProps: {
                    "label": "name",
                    "value": "id",
                    "children": "children"
                },

                typeOptions: [{
                        label: "电",
                        value: "电",
                    },
                    {
                        label: "水",
                        value: "水",
                    },
                    {
                        label: "气",
                        value: "气",
                    }
                ],
                //改变后的上级ID
                parentIdOptions2: [],

            }
        },
        computed: {},
        watch: {},
        created() {
            // this.getparentIdOptions();
        },
        mounted() {},
        methods: {
            typeChange(e) {
               this.dataForm.parentId = ""
               this.getparentIdOptions(e);
            },
            getparentIdOptions(type) {
                let _query = {
                    paramList: [{
                        field: "parentId",
                        fieldName: "父ID",
                        dataType: "int",
                        required: 0,
                        defaultValue: ''
                    }, {
                        field: "type",
                        fieldName: "类型",
                        dataType: "varchar",
                        required: 0,
                        defaultValue: type
                    }],
                    tenantId: "",
                    origin: "preview"
                }
                getDataInterfaceRes('339308611257762501', _query).then(res => {
                    let data = res.data
                    this.parentIdOptions = data
                    console.log(this.parentIdOptions);
                })
            },
            clearData() {
                this.dataForm.name = '';
                this.dataForm.parentId = "";
                this.dataForm.note = '';
                this.dataForm.active = 1;
            },
            init(id) {
                console.log(id);
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if (this.dataForm.id) {
                        this.loading = true
                        request({url: '/api/equipmentCategory/Equipment_category/' + this.dataForm.id,method: 'get'}).then(res => {
                            this.dataInfo(res.data);


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
                        url: '/api/equipmentCategory/Equipment_category',
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
                        url: '/api/equipmentCategory/Equipment_category/' + this.dataForm.id,
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
                // console.log(this.dataForm);
            },
        },
    }
</script>
