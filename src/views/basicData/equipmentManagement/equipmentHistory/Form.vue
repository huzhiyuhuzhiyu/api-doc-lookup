<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" content="查看履历" />
        <div class="options">
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" class=".el-table">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="基本信息" name="basicInfo">
              <el-form ref="dataForm" :model="dataForm" label-width="160px" label-position="top">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="设备名称" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入设备名称" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="规格型号" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入规格型号" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="购入日期" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入购入日期" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="设备编码" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入设备编码" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="购入价格(万元)" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入购入价格" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="供应商" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入供应商" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="电话" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入电话" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="传真" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入传真" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="供应商地址" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入供应商地址" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="联系人" prop="reasonScrapping">
                      <el-input v-model="dataForm.reasonScrapping" placeholder="请输入联系人" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" type="textarea" maxlength="200" :rows="2" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
            <el-collapse-item :title="title+'记录'" name="wbjl">
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data">
                  <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                  <el-table-column prop="maintenanceDate" label="日期" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="contentRecord" :label="title+'内容记录'" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="partsReplacementRecord" label="零件更新记录" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="maintenancePersonnel" :label="title+'人'" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-collapse-item>
          </el-collapse>
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
      activeNames: ["basicInfo", "wbjl"],
      dataFormTwo: {
        productData: [],
      },
      btnType: undefined,
      activeName: "orderInfo",
      formLoading: false,
      dataForm: {},
      title: ''
    }
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      // if (this.dataForm.id) {
      //   this.formLoading = true
      //   detailScrapApplicationForm(this.dataForm.id).then(res => {
      //     this.dataForm = res.data.scrapping
      //     switch (this.dataForm.maintenanceType) {
      //       case 'repair':
      //         this.title = '维修'
      //         break;
      //       case 'maintain':
      //         this.title = '保养'
      //         break;
      //       case 'inspection':
      //         this.title = '点检'
      //         break;
      //       case 'test':
      //         this.title = '检定'
      //         break;
      //     }
      //     this.dataFormTwo.productData = res.data.lines
      //     this.formLoading = false
      //   })
      // }
    }
  }
}
</script>
<style scoped lang="scss">
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
    