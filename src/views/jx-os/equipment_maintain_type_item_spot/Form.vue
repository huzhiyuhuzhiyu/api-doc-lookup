<template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <!-- <el-form-item label="操作类型" prop="type">
                            <el-select v-model="typeName" placeholder="请选择"  :style='{"width":"100%"}'
                                @change="gettypeidOptions()">
                                <el-option v-for="(item, index) in type" :key="index" :label="item.name"
                                    :value="item.name"></el-option>

                            </el-select>
                        </el-form-item> -->

                        <el-form-item :label="typeNameItem" prop="typeid">
                            <el-select v-model="dataForm.typeid" placeholder="请选择" clearable :style='{"width":"100%"}'>
                                <el-option v-for="(item, index) in typeidOptions" :key="index" :label="item.name"
                                    :value="item.F_Id" :disabled="item.disabled"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="内容名称" prop="name">
                            <el-input v-model="dataForm.name" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="方法" prop="method">
                            <el-input v-model="dataForm.method" placeholder="请输入" clearable :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="要求" prop="requirement">
                            <el-input v-model="dataForm.requirement" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否必须" prop="isMust">
                            <el-radio-group v-model="dataForm.isMust" size="small">
                                <el-radio v-for="(item, index) in isMustOptions" :key="index" :label="item.id"
                                    :disabled="item.disabled">
                                    {{item.fullName}}
                                </el-radio>

                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="标准" prop="standard">
                            <el-input v-model="dataForm.standard" placeholder="请输入" clearable :style='{"width":"100%"}'>

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
import { type } from 'os'

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
                typeid: "",
                name: '',
                method: '',
                requirement: '',
                isMust: '',
                standard: '',
                note: '',
                type: "2",
                active: 1
            },
            rules:
            {

                typeid: [
                    {
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    },
                ],
                name: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    },
                ],
                method: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    },
                ],
                requirement: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    },
                ],
                isMust: [
                    {
                        required: true,
                        message: '不能为空',
                        trigger: 'change'
                    },
                ],
                standard: [
                    {
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    },
                ],



            },
            typeidOptions: [],
            isMustOptions: [{ "fullName": "是", "id": "1" }, { "fullName": "否", "id": "0" }],
            type: [{ "name": "点检" }, { "name": "保养" }],
            typeNameItem: '点检类型',
            typeId: '2'

        }
    },
    computed: {},
    watch: {},
    created() {
        this.gettypeidOptions();
    },
    mounted() { },
    methods: {
        gettypeidOptions() {
            let list = [{
                field:'type',
                defaultValue:'2'
            }]
            let test = {
                paramList:list,
                tenantId:'',
                origin:'preview'
            }
            getDataInterfaceRes('340089684799522501',test).then(res => {
                let d = res.data
                this.typeidOptions = d
            })
        },
        clearData() {
            this.dataForm.typeid = "";
            this.dataForm.name = '';
            this.dataForm.method = '';
            this.dataForm.requirement = '';
            this.dataForm.isMust = '';
            this.dataForm.standard = '';
            this.dataForm.note = '';
            this.dataForm.type = this.typeId;
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
                        url: '/api/maintionTypeItem/Equipment_maintain_type_item/' + this.dataForm.id,
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
            let _data = this.dataList();
            if (!this.dataForm.id) {
                request({
                    url: '/api/maintionTypeItem/Equipment_maintain_type_item',
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
                    url: '/api/maintionTypeItem/Equipment_maintain_type_item/' + this.dataForm.id,
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
            return _data;
        },
        dataInfo(dataAll) {
            let _dataAll = dataAll
            this.dataForm = _dataAll
        },
    },
}

</script>
