<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <!-- <el-col :span="24">
                        <el-form-item label="主表id" prop="equipmentMaintainId">
                            <el-input v-model="dataForm.equipmentMaintainId" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="内容" prop="equimentMaintainTypeItemId">
                            <el-select v-model="dataForm.equimentMaintainTypeItemId" placeholder="请选择" disabled
                                :style='{"width":"100%"}'>
                                <el-option v-for="(item, index) in equimentMaintainTypeItemIdOptions" :key="index"
                                    :label="item.name" :value="item.F_Id" :disabled="item.disabled"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="正常/异常" prop="normal">
                            <el-radio-group v-model="dataForm.normal" size="small">
                                <el-radio v-for="(item, index) in normalOptions" :key="index" :label="item.id"
                                    :disabled="item.disabled">
                                    {{item.fullName}}
                                </el-radio>

                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="实测值" prop="measuredValue">
                            <el-input v-model="dataForm.measuredValue" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="note">
                            <el-input v-model="dataForm.note" placeholder="请输入" :style='{"width":"100%"}' true
                                type="textarea" :autosize='{"minRows":4,"maxRows":4}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="附件" prop="file">
                            <JNPF-UploadImg v-model="dataForm.file" :fileSize="10" sizeUnit="MB" :limit="9">

                            </JNPF-UploadImg>
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
                equipmentMaintainId: '',
                equimentMaintainTypeItemId: '',
                normal: '',
                measuredValue: '',
                note: '',
                file: [],
            },
            rules:
            {



            },
            normalOptions: [{ "fullName": "正常", "id": "正常" }, { "fullName": "异常", "id": "异常" }],

        }
    },
    computed: {},
    watch: {},
    created() {
        this.getequimentMaintainTypeItemIdOptions();
    },
    mounted() { },
    methods: {
        getequimentMaintainTypeItemIdOptions() {
            getDataInterfaceRes('342236067107180869').then(res => {
                let data = res.data
                this.equimentMaintainTypeItemIdOptions = data
            })
        },
        clearData() {
            this.dataForm.equipmentMaintainId = '';
            this.dataForm.equimentMaintainTypeItemId = '';
            this.dataForm.normal = '';
            this.dataForm.measuredValue = '';
            this.dataForm.note = '';
            this.dataForm.file = [];
        },
        init(id) {
            this.dataForm.id = id || 0;
            this.visible = true;
            this.$nextTick(() => {
                this.$refs['elForm'].resetFields();
                if (this.dataForm.id) {
                    this.loading = true
                    request({
                        url: '/api/equipmentMaintainLine/Equipment_maintain_line/' + this.dataForm.id,
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
                    url: '/api/equipmentMaintainLine/Equipment_maintain_line',
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
                    url: '/api/equipmentMaintainLine/Equipment_maintain_line/' + this.dataForm.id,
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
    },
}

</script>
