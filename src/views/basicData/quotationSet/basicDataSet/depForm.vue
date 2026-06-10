<template>
  <el-dialog :title="!dataForm.id ? '新建销售报价基础数据' : btntype?'查看销售报价基础数据': '编辑销售报价基础数据'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px" @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :rules="dataRules" :model="dataForm"  label-position="top"
      label-width="120px">
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="dataForm.customerName" placeholder="请输入客户名称" maxlength="100" 
          :disabled="btntype ? true : false" />
      </el-form-item>
      <el-form-item label="客户图号" prop="customerMaterialCode">
        <el-input v-model="dataForm.customerMaterialCode" placeholder="请输入客户产品图号" maxlength="100" 
          :disabled="btntype ? true : false" />
      </el-form-item>
      
      <el-form-item label="数据类型" prop="dataType">
        <el-select v-model="dataForm.dataType" placeholder="请选择数据类型" style="width: 100%;" :disabled="btntype ? true : false">
          <el-option v-for="(item, index) in dataTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品图号" prop="productDrawingNo">
        <el-input v-model="dataForm.productDrawingNo" placeholder="请输入产品图号" maxlength="100" 
          :disabled="btntype ? true : false" />
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!btntype">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { addBasicData, editBasicData, getBasicDataInfo,checkCustomerCode} from "@/api/basicData/index";

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataRules:{
        customerMaterialCode: [
          { required: true, message: '请输入客户图号', trigger: 'blur' },
          { validator: this.formValidate('noSpace'), trigger: 'blur' },
          { validator: this.formValidate('filterSpecial'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              let a = {
                customerName: this.dataForm.customerName,
                code: this.jnpf.specialCodeUrl(value)
              }
              checkCustomerCode(a).then(res => {
                if (res.data) {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
        productDrawingNo:[
          { required: true, message: '请输入产品图号', trigger: 'blur' },
        ]
      }, 
      dataTypeList:[
                {
                    label:"接头",
                    value:'joint'
                },
                {
                    label:"胶管",
                    value:"hose"
                },
                {
                  label:"角度",
                  value:"angle"
                }
            ],
      
      dataForm: {
        dataType: 'joint',
        customerMaterialCode: "",
        productDrawingNo: "",
        customerName: ''
      },
      btntype: false,
    }
  },
  created() {
  },
  methods: {
    handleClose() {
    },
    init(id, type) {
      this.visible = true
      this.dataForm.id = id || ''
      if (type == "edit") {
        this.btntype = false
      } else if (type == "look") {
        this.btntype = true

      }
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getBasicDataInfo(this.dataForm.id).then(res => {
            console.log("详情",res);
            this.dataForm = res.data
          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let formMethod = this.dataForm.id ? editBasicData : addBasicData;
          formMethod(this.dataForm).then(res => {
            let msg = ""
            if (formMethod == editBasicData) {
              msg = '修改成功'
            } else {
              msg = '新建成功'
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
