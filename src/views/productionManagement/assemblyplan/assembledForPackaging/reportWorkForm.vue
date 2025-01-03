<script>
import {getbimProductAttributesList} from '@/api/masterDataManagement';
import {getPromise, notEmpty} from '@/utils';

export default {
    name: 'ReportWorkForm',
    model: {
        prop: 'formVisible',
        event: 'closeReportForm',
    },
    props: {
        formVisible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            reportFormPromise: null,
            reportFormResolve: null,
            reportFormReject: null,
            reportForm: {
                packagingMethod: '',
                producerId: '',
                reportingQuantity: 0,
                mainUint: '',
                pairingModeQuantity: 1,
                id: '',
            },
            btnLoading: false,
            packagingMethodList: [],
            packagingMethodDisabled: false,
            currentReportRow: null,
            reportFormProps: {
                packagingMethod: [
                    {required: true, message: '请选择包装模式', trigger: 'change'},
                ],
                producerId: [
                    {required: true, message: '请选择包装人', trigger: 'change'},
                ],
                reportingQuantity: [
                    {required: true, message: '请输入包装数量', trigger: 'blur'},
                    {type: 'number', message: '请输入数字', trigger: 'blur'},
                    {
                        validator: (rule, value, callback) => {
                            if (value <= 0) {
                                return callback(new Error('包装数量必须大于0'));
                            }
                            if (value >
                                (this.currentReportRow.completedQuantity - this.currentReportRow.packagingQuantity)) {
                                return callback(new Error('包装数量不能大于可包装数量'));
                            }
                            callback();

                        },
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    computed: {
        reportFormVisible: {
            get() {
                return this.formVisible;
            },
            set(val) {
                this.$emit('closeReportForm', val);
            },
        },
    },
    methods: {
        async handlePackagePerson() {
            await this.$nextTick();
            this.$refs.reportRef.validateField('producerId');
        },
        async reportWork(item) {
            if (this.reportFormPromise !== null) {
                return this.reportFormPromise;
            }
            this.currentReportRow = item;
            getbimProductAttributesList({
                pageNum: -1,
                pageSize: 20,
                typeCode: 'pa015',
                orderItems: [
                    {
                        asc: false,
                        column: '',
                    },
                    {
                        asc: false,
                        column: 'code',
                    },
                ],
            }).then(res => {
                this.packagingMethodList = res.data.records.map((item) => ({label: item.name, value: item.name}));
            });
            this.setReportFormPromise(true);
            this.packagingMethodDisabled = notEmpty(item.packagingMethod);
            console.log(item.completedQuantity, item.packagingQuantity, '-');
            const defaultReportingQuantity = item.completedQuantity - item.packagingQuantity;
            console.log(defaultReportingQuantity);
            console.log(defaultReportingQuantity <= 0 ? 0 : defaultReportingQuantity);
            this.reportForm = {
                packagingMethod: this.packagingMethodDisabled ? item.packagingMethod : '',
                producerId: '',
                reportingQuantity: defaultReportingQuantity <= 0 ? 0 : defaultReportingQuantity,
                id: '',
                mainUint: item.mainUnit,
                pairingModeQuantity: item.pairingModeId ? item.pairingModeQuantity : 1,
            };
            await this.$nextTick();
            this.$refs.reportRef.clearValidate();
            return this.reportFormPromise;
        },
        async submitReportFun() {
            const res = await this.$refs.reportRef.validate();
            if (!res) {
                return;
            }
            this.reportFormResolve({...this.reportForm});
            this.setReportFormPromise();
        },
        closeReportForm() {
            this.reportFormVisible = false;
            this.reportFormReject && this.reportFormReject('cancel');
            this.setReportFormPromise();
        },
        setReportFormPromise(setPromise = false) {
            if (setPromise) {
                const {promise, resolve, reject} = getPromise();
                this.reportFormPromise = promise;
                this.reportFormResolve = resolve;
                this.reportFormReject = reject;
                return;
            }
            this.reportFormPromise = null;
            this.reportFormResolve = null;
            this.reportFormReject = null;
            this.reportFormVisible = false;
        },
    },
};
</script>

<template>
    <el-dialog title="报工" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="formVisible"
               @close="closeReportForm" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px" append-to-body>
        <el-row :gutter="20">

            <el-form ref="reportRef" :model="reportForm" :rules="reportFormProps" label-width="120px"
                     label-position="top">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="包装方式" prop="packagingMethod">
                            <el-select :disabled="packagingMethodDisabled" v-model="reportForm.packagingMethod"
                                       placeholder="包装方式" style="width: 100%;">
                                <el-option v-for="(item, index) in packagingMethodList" :key="index" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="包装人" prop="producerId">
                            <user-select v-model="reportForm.producerId" placeholder="请选择包装人" clearable
                                         style="width: 100%" @change="handlePackagePerson">
                            </user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item :label="`包装数量（${reportForm.mainUint}）`" prop="reportingQuantity">
                            <el-input v-model.number="reportForm.reportingQuantity" placeholder="包装数量"/>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
        </el-row>

        <span slot="footer" class="dialog-footer">
      <el-button @click="closeReportForm">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitReportFun()">
        提交</el-button>
    </span>
    </el-dialog>
</template>

<style scoped lang="scss">

</style>
