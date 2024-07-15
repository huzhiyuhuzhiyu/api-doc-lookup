<template>
    <transition name="el-zoom-in-center">
        <div class="JNPF-preview-main flow-form-main">
            <div class="JNPF-common-page-header">
                <el-page-header @back="goBack" :content="!dataForm.id ? '新建更新说明' : '编辑更新说明'" />
                <div class="options">
                    <el-button  size="mini" type="primary" @click="dataFormSubmit()" :loading="btnLoading">
                        {{ $t("common.confirmButton") }}</el-button>
                    <el-button  size="mini" @click="goBack()">{{
                    $t("common.cancelButton")
                }}</el-button>
                </div>
            </div>
            <el-row class="main">
                <el-col :span="14" :offset="5">
                    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="mt-20" label-width="120px"
                        @submit.native.prevent>
                        <el-col :span="24">
                            <el-form-item label="更新日期" prop="updateDate">
                                <el-date-picker v-model="dataForm.updateDate" type="date" value-format="yyyy-MM-dd"
                                    placeholder="选择日期时间" defaule-value="defaultValue">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="更新说明" prop="updateContent">
                                <el-input v-model="dataForm.updateContent" type="textarea" :autosize="{ minRows: 22 }"
                                    placeholder="请输入" clearable :style="{ width: '100%' }" maxlength="500">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </transition>
</template>

<script>
import { deleteInstructionsList,detailInstructionsList,editInstructionsList,addInstructionsList,getInstructionsList } from '@/api/masterDataManagement/index.js'

export default {
    components: {},
    data() {
        return {
            showCron: false,
            showCrontab: true,
            dataForm: {
                id: "",
                updateDate: this.jnpf.toDate(new Date(), "yyyy-MM-dd"),
                updateContent: ""
            },
            dataRule: {
                updateDate: [
                    {
                        required: true,
                        message: "更新日期不能为空",
                        trigger: "blur"
                    }
                ],
                updateContent: [
                    {
                        required: true,
                        message: "更新说明不能为空",
                        trigger: "blur"
                    }
                ]
            },
            formVisible: false,
            btnLoading: false,
            taskOptions: []
        };
    },
    computed: {},
    methods: {
        goBack() {
            this.$emit("close");
        },
        init(id) {
            this.dataForm = {
                id: "",
                updateDate: this.jnpf.toDate(new Date(), "yyyy-MM-dd"),
                updateContent: ""
            };
            this.dataForm.id = id || "";
            this.$nextTick(() => {
                this.$refs["dataForm"].resetFields();
                if (this.dataForm.id) {
                    detailInstructionsList(this.dataForm.id).then(res => {
                        this.dataForm = res.data;
                        
                        this.dataForm.updateContent = this.dataForm.updateContent;
                    });
                }
            });
        },
        dataFormSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.btnLoading = true;

                    let query = { ...this.dataForm };
                    const formMethod = this.dataForm.id ? editInstructionsList : addInstructionsList;
                    formMethod(query)
                        .then(res => {
                            this.$message({
                                message: this.dataForm.id
                                    ? "修改成功"
                                    : "创建成功",
                                type: "success",
                                duration: 1500,
                                onClose: () => {
                                    this.visible = false;
                                    this.btnLoading = false;
                                    this.$emit("close", true);
                                }
                            });
                        })
                        .catch(() => {
                            this.btnLoading = false;
                        });
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
>>>.el-dialog__body {
    padding: 10px 10px 0 !important;
}

>>>.popup-main {
    .pop_btn {
        display: none !important;
    }

    .popup-result:nth-child(2) {
        margin-bottom: 2px;
    }
}

.delBtn {
    text-align: right;
}
</style>
