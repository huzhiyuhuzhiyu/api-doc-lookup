<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="btntype == 'edit' ? ' 编辑商机' : btntype == 'add' ? '新建商机' : '查看商机'" />
        <div class="options" v-if="btntype !== 'look'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
              <el-row :gutter="30" class="custom-row" style="padding: 0 10px;">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="商机名称" prop="businessName">
                    <el-input v-model="dataForm.businessName" placeholder="请输入商机名称" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="客户名称" prop="customerName">
                    <ComSelect-list :isdisabled="btntype=== 'look'" v-model="dataForm.customerName" placeholder="请选择客户名称" @change="onPartnerChange" :title="'选择客户'" :method="getPartnerList" :requestObj="requestObj" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="负责人" prop="ownerUserId">
                    <user-select v-model="dataForm.ownerUserId" placeholder="请选择负责人" clearable style="width: 100%" :disabled="btntype == 'look'" @change="hangleSelectSales">
                    </user-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="商机金额" prop="money">
                    <el-input v-model="dataForm.money" placeholder="请输入商机金额" maxlength="20" :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="预计成交日期" prop="dealDate">
                    <el-date-picker v-model="dataForm.dealDate" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择预计成交日期" :disabled="btntype == 'look' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="下次联系时间" prop="nextTime">
                    <el-date-picker v-model="dataForm.nextTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择下次联系时间" :disabled="btntype == 'look' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btntype == 'look'" type="textarea" maxlength="200" :rows="2" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getPartnerList } from '@/api/customerManagement/index'
import { addcrmBusiness, updatecrmBusiness, detailcrmBusiness } from '@/api/CRMmanagement/index'
export default {
  data() {
    return {
      requestObj: {
        customerStatus: 'private_sea',
      },
      getPartnerList,
      activeName: "jcInfo",
      formLoading: false,
      btnLoading: false,
      dataForm: {
        customerId: '',
        money: '',
        dealDate: '',
        nextTime: '',
        ownerUserId: '',
        businessName: '',
        customerName: '',
        remark: '',
      },
      btntype: false,
      dataRule: {
        ownerUserId: [
          { required: true, message: '请选择负责人', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '请选择客户', trigger: 'blur' },
        ],
        businessName: [
          { required: true, message: '请输入商机名称', trigger: 'blur' },
        ]
      },
    }
  },
  created() {
  },
  methods: {
    onPartnerChange(id, data) {
      if (!data.length) return
      this.$nextTick(() => this.$refs['dataForm'].validateField('name'))
      if (data) {
        this.dataForm.customerId = data[0].id
        this.dataForm.customerName = data[0].name
      } else {
        this.dataForm.customerId = ''
        this.dataForm.customerName = ''
      }
    },
    //负责人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("ownerUserId") });
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      this.btntype = type
      this.dataForm.id = id || ''
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailcrmBusiness(this.dataForm.id).then(res => {
            this.dataForm = res.data
            this.formLoading = false
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
          let obj = {
            ...this.dataForm
          }
          let formMethod = this.dataForm.id ? updatecrmBusiness(obj) : addcrmBusiness(obj);
          formMethod.then(res => {
            let msg = ""
            if (this.btntype == "edit") {
              msg = '修改成功'
            } else {
              msg = '新建成功'
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
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
::v-deep .el-form-item__content p {
  border: none;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
