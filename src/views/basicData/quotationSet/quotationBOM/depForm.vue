<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btntype == 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="title" />
        <div class="options" v-if="btntype == 'edit' || btntype == 'add'">
          <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">{{ $t('common.submitButton')
          }}</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="BOMForm" v-loading="formLoading" :model="BOMForm" :rules="dataRules" label-position="top"
              label-width="120px">
              <el-row :gutter="30">
                <!-- <el-col :span="12">
                  <el-form-item label="BOM编码" prop="code">
                    <el-input v-model="BOMForm.code" placeholder="请输入BOM编码" maxlength="100"
                      :disabled="btntype=='look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="BOM名称" prop="name">
                    <el-input v-model.trim="BOMForm.name" placeholder="请输入BOM名称" maxlength="100"
                      :disabled="btntype=='look' ? true : false" />
                  </el-form-item>
                </el-col> -->
                <el-col :span="12">
                  <el-form-item label="客户物料号" prop="customerProductNo">
                    <el-input v-model="BOMForm.customerProductNo" placeholder="请输入客户物料号" maxlength="1000"
                      :disabled="btntype != 'add' ? true : false" @blur="checkcustomerNoFun()" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="客户图号" prop="customerDrawingNumber">
                    <el-input v-model.trim="BOMForm.customerDrawingNumber" placeholder="请输入客户图号" maxlength="100"
                      :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品图号" prop="materialCode">
                    <el-input v-model.trim="BOMForm.materialCode" placeholder="请输入产品图号" maxlength="100"
                      :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model.trim="BOMForm.remark" placeholder="请输入备注" maxlength="200"
                      :disabled="btntype == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>
            <div v-if="btntype != 'look'">
              <el-button type="text" icon="el-icon-plus" @click="addtable()">添加产品</el-button>
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>| -->
            </div>
            <el-form :model="dataForm" v-bind="dataForm" ref="productForm">
              <el-table :data="dataForm.bimFormulaLineList">
                <el-table-column type="index" label="序号" width="60" fixed="left" align="center" key="no" />
                <el-table-column prop="productCode" label="产品编码" />
                <el-table-column prop="productName" label="产品名称" />
                <el-table-column prop="drawingNo" label="型号" />
                <el-table-column prop="qty" label="数量">
                  <template slot="header">
                    <span class="required">*</span>数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'bimFormulaLineList.' + scope.$index + '.' + 'qty'" :rules='productRules.qty'>
                      <el-input v-model="scope.row.qty" :disabled="btntype === 'look'" maxlength="20" placeholder="请输入数量">
                        {{ scope.row.qty }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" />
                <el-table-column prop="remark" label="备注">
                  <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.remark" placeholder="请输入备注" :disabled="btntype === 'look'">
                      {{ scope.row.remark }}
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="90" v-if="btntype != 'look'">
                  <template slot-scope="scope">
                    <!-- <el-button @click="addtable(scope.row)" type="text" >添加</el-button> -->
                    <el-button @click="deltable(scope)" type="text" style="color:rgb(245,108,108)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btntype == 'look'" :detailed="btntype == 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="submitAllProduct" :tableItems="ProductTableItems" title="选择产品"
        treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
        :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>

<script>

import { addQuotationBOMData, editQuotationBOMData, getQuotationBOMInfo, checkQuotationBOMCode, checkQuotationBOMDrawing, checkCustomerProductNo } from "@/api/salesManagement/index";
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
export default {
  data() {
    return {
      datafilelist: [],
      activeName: 'jcInfo',
      productRules: {
        qty: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["数量不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：` + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：` + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：` + errMsg) }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
        ]
      },
      getProductList,
      title: "",
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        drawingNo: "",
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
      },
      formLoading: false,
      btnLoading: false,
      BOMForm: {
        code: "",
        name: "",
        remark: "",
        id: "",
        materialCode: "",
        customerDrawingNumber: "",
        customerProductNo: '',       // 客户物料号
      },
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号' },
        { prop: 'spec', label: '规格型号' },
        { prop: 'classAttributeText', label: '产品分类' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input', },
        { prop: "name", label: "产品名称", type: 'input', },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      dataForm: {
        bimFormulaLineList: [],
      },
      lines: [],
      btntype: "",
      customerProductNoFlag: "",
      dataRules: {
        customerProductNo: [
          { required: true, message: '请输入客户物料号', trigger: 'blur' },
        ],
        materialCode: [
          { required: true, message: '请输入产品图号', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    checkcustomerNoFun() {
      checkCustomerProductNo(this.jnpf.specialCodeUrl(this.BOMForm.customerProductNo)).then(res => {
        this.customerProductNoFlag = res.data
      }).catch(error => { })
    },
    goBack() {
      this.$emit('close')
    },
    submitAllProduct(val, data) {
      let selectedList = data.map(item => item.all)
      selectedList.forEach(item => {
        let obj = {
          calculationDirection: item.calculationDirection,
          deputyUnit: item.deputyUnit,
          mainUnit: item.mainUnit,
          productId: item.id,
          qty: item.qty,
          ratio: item.ratio,
          productName: item.name,
          productCode: item.code,
          quotationBomId: "",
          drawingNo: item.drawingNo
        }
        this.dataForm.bimFormulaLineList.push(obj)
      });
    },
    // 删除当前公式行
    deltable(row, index) {
      this.dataForm.bimFormulaLineList.splice(row.$index, 1)
    },
    // 新增公式行
    addtable() {
      this.$refs['ComSelect-page'].openDialog()
    },
    init(id, type) {
      console.log(id, type);
      this.BOMForm.id = id || ''
      this.btntype = type
      // if (type == "edit" || type == 'add') {
      //   this.btntype = false
      // } else if (type == "look") {
      //   this.btntype = true

      // }
      this.title = !this.BOMForm.id ? '新建报价BOM' : this.btntype == 'look' ? '查看报价BOM' : '编辑报价BOM'
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['BOMForm'].resetFields()
        if (this.BOMForm.id) {
          getQuotationBOMInfo(this.BOMForm.id).then(res => {
            console.log("详情", res);
            this.dataForm.bimFormulaLineList = res.data.lines
            this.BOMForm = res.data.bom
            this.formLoading = false
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
        } else {
          this.formLoading = false
          this.dataForm.bimFormulaLineList = []
        }
      })
    },
    async dataFormSubmit() {
      let submitFlag = true
      this.btnLoading = true

      let form_1 = this.$refs['BOMForm']
      const valid_1 = form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      let form_2 = this.$refs['productForm']
      console.log(form_2);
      const valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      if (this.dataForm.bimFormulaLineList.length === 0 && submitFlag) {
        submitFlag = false
        this.$message.error('请选择产品')
      }

      if (submitFlag) {
        let index = this.dataForm.bimFormulaLineList.findIndex(line => line.drawingNo === this.BOMForm.materialCode)
        if (index !== -1) {
          submitFlag = false
          this.$message.error(`产品信息第${index + 1}行：产品与主产品重复`)
        }
      }

      if (submitFlag) {
        let temp = true
        if (this.customerProductNoFlag) temp = await this.$confirm(`该客户物料号已有对应报价BOM，是否覆盖已有BOM？`, `提示`, { type: 'warning' })
        if (!temp) return this.btnLoading = false

        let formMethod = this.BOMForm.id ? editQuotationBOMData : addQuotationBOMData;
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'customer',
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        let obj = {
          attachmentList: this.datafilelist,
          lines: this.dataForm.bimFormulaLineList,
          bom: this.BOMForm
        }
        formMethod(obj).then(res => {
          let msg = ""
          if (formMethod == editQuotationBOMData) {
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
      } else {
        this.btnLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.selectPro>>>.el-dialog__footer {
  border-top: 1px solid #dcdfe6;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

.selectPro>>>.el-dialog__body {
  padding: 20px 20px 2px !important;
}

.required {
  color: red;
  margin-right: 4px;
}

.el-table__cell .el-form-item {
  margin-bottom: 0 !important;
}

::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px 30px;
  overflow: auto;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}
</style>