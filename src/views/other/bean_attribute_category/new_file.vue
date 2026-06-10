<!-- <template>
    <el-dialog :title="!dataForm.id ? '新建' :'编辑'" :close-on-click-modal="false" append-to-body :visible.sync="visible"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll width="600px">
        <el-row :gutter="15" class="">
            <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                label-position="right">
                <template v-if="!loading">
                    <el-col :span="24">
                        <el-form-item label="控件标题" prop="data.label">
                            <el-input v-model="dataForm.data.label" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="控件编码" prop="data.prop">
                            <el-input v-model="dataForm.data.prop" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="占位提示" prop="data.placeholder">
                            <el-input v-model="dataForm.data.placeholder" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="表单栅格" prop="data.config.span">
                            <el-slider v-model="dataForm.data.config.span" :max="24" :step="1" show-stops>

                            </el-slider>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="最小行数" prop="data.autosize.minRows">
                            <el-input-number v-model="dataForm.data.autosize.minRows" placeholder="数字文本" :step="1"
                                controls-position='right'>

                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="最大行数" prop="data.autosize.maxRows">
                            <el-input-number v-model="dataForm.data.autosize.maxRows" placeholder="数字文本" :step="1"
                                controls-position='right'>

                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="开启展示" prop="data.activeTxt">
                            <el-input v-model="dataForm.data.activeTxt" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="开启值" prop="data.active-value">
                            <el-input v-model="dataForm.data.active-value" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="关闭展示" prop="data.inactiveTxt">
                            <el-input v-model="dataForm.data.inactiveTxt" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="关闭值" prop="data.inactive-value">
                            <el-input v-model="dataForm.data.inactive-value" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="时间段" prop="data.picker-options.selectableRange">
                            <el-input v-model="dataForm.data.picker-options.selectableRange" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="时间类型" prop="data.value-format">
                            <el-select v-model="dataForm.data.value-format" placeholder="请选择" clearable
                                :style='{"width":"100%"}'>
                                <el-option v-for="(item, index) in data.value-formatOptions" :key="index"
                                    :label="item.fullName" :value="item.id" :disabled="item.disabled"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="时间格式" prop="data.format">
                            <el-input v-model="dataForm.data.format" placeholder="请输入" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="123" prop="data.controls-position">
                            <el-input v-model="dataForm.data.controls-position" placeholder="选项名" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="123" prop="data.size">
                            <el-input v-model="dataForm.data.size" placeholder="选项值" clearable
                                :style='{"width":"100%"}'>

                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="步长" prop="data.step">
                            <el-input-number v-model="dataForm.data.step" placeholder="数字文本" :step="1"
                                controls-position='right'>

                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="列表宽度" prop="data.width">
                            <el-input-number v-model="dataForm.data.width" placeholder="数字文本" :step="1"
                                controls-position='right'>

                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="能否清除" prop="data.clearable">
                            <el-switch v-model="dataForm.data.clearable" :active-value="1" :inactive-value="0">

                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否密码" prop="data.show-password">
                            <el-switch v-model="dataForm.data.show-password" :active-value="1" :inactive-value="0">

                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否必填" prop="data.config.required">
                            <el-switch v-model="dataForm.data.config.required" :active-value="1" :inactive-value="0">

                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否只读" prop="data.readonly">
                            <el-switch v-model="dataForm.data.readonly" :active-value="1" :inactive-value="0">

                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否禁用" prop="data.disabled">
                            <el-switch v-model="dataForm.data.disabled" :active-value="1" :inactive-value="0">

                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="结尾换行" prop="data.isblock">
                            <el-switch v-model="dataForm.data.isblock" :active-value="1" :inactive-value="0">

                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="能否搜索" prop="data.issearch">
                            <el-switch v-model="dataForm.data.issearch" :active-value="1" :inactive-value="0">

                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="描述" prop="data.j_desc">
                            <el-input v-model="dataForm.data.j_desc" placeholder="请输入" :style='{"width":"100%"}' true
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
                    data.label: '',
                    data.prop: '',
                    data.placeholder: "请输入",
                    data.config.span: 24,
                    data.autosize.minRows: undefined,
                    data.autosize.maxRows: undefined,
                    data.activeTxt: '',
                    data.active - value: '',
                    data.inactiveTxt: '',
                    data.inactive - value: '',
                    data.picker - options.selectableRange: '',
                    data.value - format: "",
                    data.format: '',
                    data.controls - position: '',
                    data.size: '',
                    data.step: undefined,
                    data.width: 0,
                    data.clearable: 1,
                    data.show - password: 0,
                    data.config.required: 0,
                    data.readonly: 0,
                    data.disabled: 0,
                    data.isblock: 0,
                    data.issearch: 0,
                    data.j_desc: '',
                },
                rules: {
                    data.label: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],
                    data.prop: [{
                        required: true,
                        message: '请输入',
                        trigger: 'blur'
                    }, ],



                },
                data.value - formatOptions: [{
                    "fullName": "日期(date)",
                    "id": "yyyy-MM-dd"
                }, {
                    "fullName": "日期时间(datetime)",
                    "id": "yyyy-MM-dd HH:mm:ss"
                }],

            }
        },
        computed: {},
        watch: {},
        created() {},
        mounted() {},
        methods: {
            clearData() {
                this.dataForm.data.label = '';
                this.dataForm.data.prop = '';
                this.dataForm.data.placeholder = "请输入";
                this.dataForm.data.config.span = 24;
                this.dataForm.data.autosize.minRows = undefined,
                    this.dataForm.data.autosize.maxRows = undefined,
                    this.dataForm.data.activeTxt = '';
                this.dataForm.data.active - value = '';
                this.dataForm.data.inactiveTxt = '';
                this.dataForm.data.inactive - value = '';
                this.dataForm.data.picker - options.selectableRange = '';
                this.dataForm.data.value - format = "";
                this.dataForm.data.format = '';
                this.dataForm.data.controls - position = '';
                this.dataForm.data.size = '';
                this.dataForm.data.step = undefined,
                    this.dataForm.data.width = 0;
                this.dataForm.data.clearable = 1;
                this.dataForm.data.show - password = 0;
                this.dataForm.data.config.required = 0;
                this.dataForm.data.readonly = 0;
                this.dataForm.data.disabled = 0;
                this.dataForm.data.isblock = 0;
                this.dataForm.data.issearch = 0;
                this.dataForm.data.j_desc = '';
            },
            init(id) {
                this.dataForm.id = id || 0;
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs['elForm'].resetFields();
                    if (this.dataForm.id) {
                        this.loading = true
                        request({
                            url: '/api/system/Temp11111/' + this.dataForm.id,
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
                        url: '/api/system/Temp11111',
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
                        url: '/api/system/Temp11111/' + this.dataForm.id,
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
                _data.data.config.span = parseInt(_data.data.config.span)
                _data.data.clearable = parseInt(_data.data.clearable)
                _data.data.show - password = parseInt(_data.data.show - password)
                _data.data.config.required = parseInt(_data.data.config.required)
                _data.data.readonly = parseInt(_data.data.readonly)
                _data.data.disabled = parseInt(_data.data.disabled)
                _data.data.isblock = parseInt(_data.data.isblock)
                _data.data.issearch = parseInt(_data.data.issearch)
                return _data;
            },
            dataInfo(dataAll) {
                let _dataAll = dataAll
                _dataAll.data.config.span = parseInt(_dataAll.data.config.span)
                _dataAll.data.clearable = parseInt(_dataAll.data.clearable)
                _dataAll.data.show - password = parseInt(_dataAll.data.show - password)
                _dataAll.data.config.required = parseInt(_dataAll.data.config.required)
                _dataAll.data.readonly = parseInt(_dataAll.data.readonly)
                _dataAll.data.disabled = parseInt(_dataAll.data.disabled)
                _dataAll.data.isblock = parseInt(_dataAll.data.isblock)
                _dataAll.data.issearch = parseInt(_dataAll.data.issearch)
                this.dataForm = _dataAll
            },
        },
    }
</script>
 -->