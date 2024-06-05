<template>
    <el-dialog :title="type == 'add' ? `新建${codename}` : type == 'look' ? `查看${codename}` : `编辑${codename}`"
        :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll v-if="visible"
        class="JNPF-dialog JNPF-dialog_center" width="600px">
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
                    <el-form-item label="要求" prop="itemRequirements" v-if="typename == 'maintenanceItem'">
                        <el-input v-model="dataForm.itemRequirements" placeholder="请输入要求" :disabled="type == 'look'"
                            maxlength="200" type="textarea" :rows="2"/>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                    <el-form-item label="要求" prop="itemRequirements" v-if="typename == 'inspectionItem'">
                        <el-input v-model="dataForm.itemRequirements" placeholder="请输入要求" :disabled="type == 'look'"
                            maxlength="200" type="textarea" :rows="2"/>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                    <el-form-item label="点检方法" prop="inspectionMethod" v-if="typename == 'inspectionItem'">
                        <el-input v-model="dataForm.inspectionMethod" placeholder="请输入点检方法" :disabled="type == 'look'"
                            maxlength="50" />
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="type == 'look'"
                            type="textarea" :rows="2" maxlength="200" />
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
import { addparametersShelves, editparametersShelves, getparametersInfo, checparametersCode } from '@/api/basicData/index'
export default {
    data() {
        return {
            type: '',
            typename: '',
            codename: '',
            visible: false,
            formLoading: false,
            btnLoading: false,
            dataForm: {
                code: '',
                name: '',
                typeCode: '',
                itemRequirements: '',
                inspectionMethod: '',
                id: '',
                remark:''
            },
            dataRules: {
                code: [{ required: true, message: '请输入编码', trigger: 'blur' }, { validator: this.formValidate('noSpace'), trigger: 'blur' }, { validator: this.formValidate('filterSpecial'), trigger: 'blur' },
                {
                    validator: (rule, value, callback) => {
                        checparametersCode(this.jnpf.specialCodeUrl(value),this.dataForm.typeCode, this.dataForm.id).then(res => {
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
                name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
            }
        }
    },
    methods: {
        init(id, typename, type) {
            // console.log(id,typename,type,66666666666);
            this.dataForm = {}
            this.visible = true
            this.type = type
            this.typename = typename
            this.dataForm.typeCode = typename
            this.dataForm.id = id || ''
            switch (typename) {
                case 'faultType':
                    this.codename = '故障类型'
                    break;
                case 'faultLocation':
                    this.codename = '故障部位'
                    break;
                case 'maintenanceItem':
                    this.codename = '保养项目'
                    break;
                case 'inspectionItem':
                    this.codename = '点检项目'
                    break;
            }
            if (this.dataForm.id) {
                getparametersInfo(this.dataForm.id).then(res => {
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
                    let obj = {'parameters':this.dataForm}
                    this.btnLoading = true
                    let formMethod = null;
                    if (this.type == 'edit') {
                        formMethod = editparametersShelves
                    } else if (this.type == 'add') {
                        formMethod = addparametersShelves
                    }
                    formMethod(obj).then(res => {
                        console.log(res);
                        let msg = "";
                        if (formMethod == addparametersShelves) {
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
  