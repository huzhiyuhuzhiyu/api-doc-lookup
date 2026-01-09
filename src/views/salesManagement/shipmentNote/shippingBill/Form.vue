<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')" :content="btnType ? '查看不良项' : title" />
        <div class="options" v-if="!btnType">
          <el-button type="primary" :loading="btnLoading" @click="submit()">{{ $t('common.submitButton') }}</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-collapse :value="['basicInfo', 'report', 'inspection', 'defective']">
          <el-collapse-item title="基本信息" name="basicInfo" style="margin-top: 5px;">
            <JNPF-col v-model="dataForm" :tabContent="dataFormItem" ref="dataForm" :btnType="btnType" />
          </el-collapse-item>

          <el-collapse-item title="报工数量信息" name="report" style="margin-top: 5px;">
            <el-form label-position="top">
              <el-row :gutter="20">
                <el-col :sm="12" :xs="24">
                  <el-form-item label="报工合格数量">
                    <el-input v-model="dataForm.qualifiedQuantity" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="报工不合格数量">
                    <el-input v-model="dataForm.unqualifiedQuantity" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="dataForm.causesList">
              <el-table-column type="index" label="序号" width="60" fixed />
              <el-table-column prop="name" label="不良名称" min-width="120" />
              <el-table-column prop="code" label="不良编码" min-width="120" />
              <el-table-column prop="unqualifiedQuantity" label="不良数量" min-width="120" />
            </el-table>
          </el-collapse-item>

          <el-collapse-item title="检验数量信息" name="inspection" style="margin-top: 5px;">
            <el-form label-position="top">
              <el-row :gutter="20">
                <!-- <el-col :sm="12" :xs="24">
                  <el-form-item label="检验合格数量">
                    <el-input v-model="dataForm.qualifiedQuantity" disabled />
                  </el-form-item>
                </el-col> -->
                <el-col :sm="12" :xs="24">
                  <el-form-item label="检验不合格数量">
                    <el-input v-model="dataForm.inspectUnqualifiedQuantity" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table :data="dataForm.inspectCausesList">
              <el-table-column type="index" label="序号" width="60" fixed />
              <el-table-column prop="name" label="不良名称" min-width="120" />
              <el-table-column prop="code" label="不良编码" min-width="120" />
              <el-table-column prop="unqualifiedQuantity" label="不良数量" min-width="120" />
            </el-table>
          </el-collapse-item>

          <el-collapse-item title="不良品处理信息" name="defective" style="margin-top: 5px;">
            <el-form ref="dataForm" :model="dataForm" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="处理后最终合格数量">
                    <el-input v-model="dataForm.treatmentQualifiedQuantity" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="处理后最终不合格数量">
                    <el-input v-model="dataForm.treatmentUnqualifiedQuantity" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="报废数量">
                    <el-input v-model="dataForm.treatmentScrapQuantity" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="返工数量">
                    <el-input v-model="dataForm.treatmentRepairQuantity" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </transition>
</template>

<script>
import { workReportDetail } from "@/api/productOrdes/index.js"
export default {
  data() {
    return {
      btnType: null,
      formLoading: false,
      btnLoading: false,
      dataForm: {},
      dataFormItem: [
        { prop: "orderNo", label: "报工单号", value: "", type: "input", sm: 8, itemDisabled: true },
        { prop: "processName", label: "工序名称", value: "", type: "input", sm: 8, itemDisabled: true },
        { prop: "processCode", label: "工序编码", value: "", type: "input", sm: 8, itemDisabled: true },
      ]
    }
  },
  methods: {
    init(id, btnType) {
      // this.formLoading = true
      this.btnType = btnType

      workReportDetail(id).then(res => {
        this.formLoading = false
        this.dataForm = res.data
      }).catch(() => {

      })
    },
    async submit() {
      this.btnLoading = true
      let submitFlag = true // 提交可行性判断


      // 校验自定义属性
      let attributeForm = this.$refs['attributeLine'].$refs.main
      let valid_2 = await attributeForm.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.activeName = 'customAttribute'
        let formItems = attributeForm.fields
        this.jnpf.focusErrValidItem(attributeForm.fields)
      }

      // 校验表格表单（套筒属性）
      let sleeveForm = this.$refs['sleeveForm'].$refs.main
      let valid_3 = await sleeveForm.validate().catch(err => false)
      if (!valid_3 && submitFlag) {
        submitFlag = false
        this.activeName = 'sleeve'
        this.jnpf.focusErrValidItem(sleeveForm.fields)
      }

      // 判断条件后发送请求
      if (submitFlag) {
        const formMethod = this.dataForm.id ? updateProductData : addProductData

        let dataObj = {}
        formMethod(dataObj).then(res => {
          let msg = res.msg
          if (res.msg === 'Success') { msg = formMethod == addProductData ? "新建成功" : "修改成功" }
          this.$message.success(msg)
          this.$emit('close', true)
          this.visible = false
          this.btnLoading = false
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }

    },
  },
}
</script>
<style lang="scss" scoped>
.main {
  padding: 0px 10px 10px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep #sleeve .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  height: calc(100% - 48px);

}

::v-deep .el-collapse-item__content {
  height: 100%;
}

.reportInfo ::v-deep .el-collapse-item__wrap {
  padding: 0;
}

::v-deep .el-collapse-item__content {
  padding: 10px
}
</style>
