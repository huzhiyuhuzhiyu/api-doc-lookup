<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建备件' : btnType == 'edit' ? '编辑备件' : '查看备件'" />
        <div class="options">
          <el-button v-if="btnType != 'look'" type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
          <el-tab-pane label="备件信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="备件编码" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备件编码" :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="备件名称" prop="remark1">
                        <el-input v-model="dataForm.remark1" placeholder="请输入报废理由" :disabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="规格型号" prop="remark2">
                        <el-input v-model="dataForm.remark2" placeholder="请输入规格型号" :disabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="单位" prop="remark3">
                        <el-input v-model="dataForm.remark3" placeholder="请输入单位" :disabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="生产厂家" prop="remark4">
                        <el-input v-model="dataForm.remark4" placeholder="请输入生产厂家" :disabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="单价(元)" prop="remark5">
                        <el-input v-model="dataForm.remark5" placeholder="请输入单价(元)" :disabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="安全库存" prop="remark6">
                        <el-input v-model="dataForm.remark6" placeholder="请输入安全库存" :disabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="备注" prop="remark7">
                        <el-input v-model="dataForm.remark7" placeholder="请输入备注" :disabled="btnType == 'look'" type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>
    
<script>
import { addScrapApplicationForm, updateScrapApplicationForm, detailScrapApplicationForm } from '@/api/dailyManagement/Maintenance'
export default {
  data() {
    return {
      codeConfig: {},//单据规则配置
      activeNames: ["basicInfo", "sbxx"],
      datafilelist: [],
      index: '',
      salesList: [],
      btnType: undefined,
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      dataForm: {
        remark7: '',
        remark6: '',
        remark5: '',
        remark4: '',
        remark3: '',
        remark2: '',
        remark1: '',
        remark: '',
      },
      dataRule: {
        remark: [
          { required: true, message: '备件编码不能为空', trigger: 'blur' }
        ],
        remark1: [
          { required: true, message: '设备名称不能为空', trigger: 'change' }
        ],
        remark2: [
          { required: true, message: '规格型号不能为空', trigger: 'change' }
        ],
        remark3: [
          { required: true, message: '单位不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (this.btnType == 'add') {
          this.dataForm.remark = data.number
        }
      } catch (error) {
      }
    },
    goBack() {
      this.$emit('close')
    },
    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType === 'add' || this.btnType === 'edit') this.fetchData('BJBM')
      if (this.dataForm.id) {
        detailScrapApplicationForm(this.dataForm.id).then(res => {
          this.dataForm = res.data.scrapping
          this.dataFormTwo.productData = res.data.lines
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push(
                {
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                }
              )
            })
          }
        })
      }
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: '',
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj = {
            attachmentList: this.datafilelist,
            ...this.dataForm
          }
          this.btnLoading = true
          let formMethod = null;
          if (this.btnType == 'edit') {
            formMethod = updateScrapApplicationForm
          } else if (this.btnType == 'add') {
            formMethod = addScrapApplicationForm
          }
          formMethod(obj).then(res => {
            console.log(res);
            let msg = "";
            if (formMethod == addScrapApplicationForm) {
              msg = "新建成功"
            } else if (value == 'draft') {
              msg = "保存成功"
            } else if (value == 'submit') {
              msg = '提交成功'
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
<style scoped lang="scss">
::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
.required {
  color: red;
  margin-right: 4px;
}
::v-deep .data-form {
  margin-bottom: 18px;
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
.JNPF-preview-main .main {
  padding-top: 0;
}
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
    