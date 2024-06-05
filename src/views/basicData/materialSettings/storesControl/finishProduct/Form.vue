<template>
    <el-dialog title='设置库存' :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll
        class="JNPF-dialog JNPF-dialog_center" width="500px">
        <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
            label-width="120px">
            <el-form-item label="产品编码" prop="code">
                <el-input v-model="dataForm.code" placeholder="请输入产品编码" maxlength="20" disabled />
            </el-form-item>
            <el-form-item label="产品名称" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入产品名称" maxlength="20" disabled />
            </el-form-item>
            <el-form-item label="产品图号" prop="drawingNo">
                <el-input v-model="dataForm.drawingNo" placeholder="请输入产品图号" maxlength="20" disabled />
            </el-form-item>
            <!-- <el-form-item label="上级分类" prop="parentName">
          <ComSelect3 v-model="dataForm.parentName" :isdisabled="isdisabled" placeholder="请选择上级分类" auth
            @change="onOrganizeChange" :currOrgId="dataForm.id" :type="dataForm.type"
            :classAttribute="dataForm.classAttribute" />
        </el-form-item> -->
            <el-form-item label="最低库存" prop="minInventory">
                <el-input v-model.trim="dataForm.minInventory" placeholder="请输入最低库存" maxlength="20" />
            </el-form-item>
            <el-form-item label="最高库存" prop="maxInventory">
                <el-input v-model.trim="dataForm.maxInventory" placeholder="请输入最高库存" maxlength="20" />
            </el-form-item>
            <el-form-item label="安全库存" prop="safeInventory">
                <el-input v-model.trim="dataForm.safeInventory" placeholder="请输入安全库存" maxlength="20" />
            </el-form-item>
            <el-form-item label="单位" prop="mainUnit">
                <el-input v-model="dataForm.mainUnit" disabled />
            </el-form-item>
            <!-- <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" placeholder="请输入备注"/>
        </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
                提交</el-button>
        </span>
    </el-dialog>
</template>
  
<script>
import { detailProductData, updateProductkcData } from "@/api/basicData/materialFiles"

export default {
    data() {
        return {
            visible: false,
            formLoading: false,
            btnLoading: false,
            isdisabled: false,
            dataForm: {
                minInventory: '',
                maxInventory: '',
                safeInventory: '',
                classAttribute: "finish_product"
            },
            organizeIdTree: [],
            dataRule: {
                minInventory: [
                    { required: true, message: '最低库存不能为空', trigger: 'blur' },
                    { validator: this.formValidate({ type: 'decimal', params: [20, 4,'请输入正确的库存(最多保留2位小数,整数8位)'] }), trigger: 'blur' }
                ],
                maxInventory: [
                    { required: true, message: '最高库存不能为空', trigger: 'blur' },
                    { validator: this.formValidate({ type: 'decimal', params: [20, 4,'请输入正确的库存(最多保留2位小数,整数8位)'] }), trigger: 'blur' }
                ],
                safeInventory: [
                    { required: true, message: '安全库存不能为空', trigger: 'blur' },
                    { validator: this.formValidate({ type: 'decimal', params: [20, 4,'请输入正确的库存(最多保留2位小数,整数8位)'] }), trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        init(id) {
            this.visible = true
            this.dataForm.id = id
            // this.parentId = parentId || ''
            // if (parentId == '-1') {
            //   this.isdisabled = true
            // } else {
            //   this.isdisabled = false
            // }
            this.organizeIdTree = []
            this.formLoading = true
            this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
                if (this.dataForm.id) {
                    detailProductData(this.dataForm.id).then(res => {
                        console.log('详情', res);
                        this.dataForm = res.data.product
                        //   this.dataForm = res.data
                        //   this.organizeIdTree = res.data
                        this.formLoading = false
                    })
                } else {
                    this.formLoading = false
                }
            })
        },
        //   onOrganizeChange(val, data) {

        //     this.dataForm.parentId = data[0].id
        //     this.dataForm.parentName = data[0].name
        //   },
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.btnLoading = true
                    // this.dataForm.type = "supplier"
                    updateProductkcData(this.dataForm).then(res => {
                        console.log('设置成功', res);
                        this.$message({
                            message: '设置成功',
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
  