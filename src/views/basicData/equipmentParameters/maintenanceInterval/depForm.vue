<template>
    <el-dialog :title="type == 'add' ? '新建保养周期' : type == 'look' ? '查看保养周期' : '编辑保养周期'" :close-on-click-modal="false"
        :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
        width="600px">
        <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRules" label-position="top"
            label-width="120px">
            <el-row :gutter="30">
                <el-col :sm="24" :xs="24">
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="dataForm.code" placeholder="请输入编码" :disabled="type == 'look'" maxlength="20" />
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入名称" :disabled="type == 'look'" maxlength="20" />
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                    <el-form-item label="周期" prop="cycle">
                        <el-input v-model="dataForm.cycle" placeholder="请输入周期" :disabled="type == 'look'" maxlength="11"/>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                    <el-form-item label="单位" prop="unit">
                        <el-input v-model="dataForm.unit" placeholder="请输入单位" :disabled="type == 'look'" maxlength="10" />
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="type == 'look'" type="textarea"
                            :rows="2" maxlength="200" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="type !== 'look'">
            <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
                提交</el-button>
        </span>
    </el-dialog>
</template>
  
<script>
import { addmaintenanceShelves, editmaintenanceShelves, getmaintenanceInfo, checmaintenanceCode } from '@/api/basicData/index'
export default {
    data() {
        return {
            type: '',
            visible: false,
            formLoading: false,
            btnLoading: false,
            dataForm: {
                code: '',
                name: '',
                cycle: '',
                id: '',
                remark: '',
                unit: ''
            },
            dataRules: {
                code: [{ required: true, message: '请输入编码', trigger: 'blur' }, { validator: this.formValidate('noSpace'), trigger: 'blur' }, { validator: this.formValidate('filterSpecial'), trigger: 'blur' },
                {
                    validator: (rule, value, callback) => {
                        checmaintenanceCode(this.jnpf.specialCodeUrl(value), this.dataForm.id).then(res => {
                            if (res.data) {
                                callback(new Error("编码重复"));
                            } else {
                                callback();
                            }
                        }).catch(error => {
                        })
                    }, trigger: 'blur'
                }
                ],
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                cycle: [{ required: true, message: '请输入周期', trigger: 'blur' },{ validator: this.formValidate('bigInt'), trigger: 'change' }],
                unit: [{ required: true, message: '请输入单位', trigger: 'blur' }]
            }
        }
    },
    methods: {
        init(id, type) {
            this.dataForm = {}
            this.visible = true
            this.type = type
            this.dataForm.id = id || ''
            if (this.dataForm.id) {
                getmaintenanceInfo(this.dataForm.id).then(res => {
                    console.log("详情", res);
                    this.dataForm = res.data
                })
            } else {
                this.formLoading = false
            }
        },
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    let obj = { 'cycle': this.dataForm }
                    this.btnLoading = true
                    let formMethod = null;
                    if (this.type == 'edit') {
                        formMethod = editmaintenanceShelves
                    } else if (this.type == 'add') {
                        formMethod = addmaintenanceShelves
                    }
                    formMethod(obj).then(res => {
                        console.log(res);
                        let msg = "";
                        if (formMethod == addmaintenanceShelves) {
                            msg = "新建成功"
                        } else {
                            msg = '提交成功'
                        }
                        this.$message({
                            message: msg,
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.visible = false
                                this.btnLoading = false
                                this.$emit('close', true)
                            }
                        })
                    }).catch(() => {
                        this.btnLoading = false
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
::v-deep #table .el-form-item--small.el-form-item {
    margin-bottom: 0px;
}

.required {
    color: red;
    margin-right: 4px;
}
</style>
  