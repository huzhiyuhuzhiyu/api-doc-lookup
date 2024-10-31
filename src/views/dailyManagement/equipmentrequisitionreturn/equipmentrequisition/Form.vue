<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建设备领用' : btnType == 'edit' ? '编辑设备领用' : '查看设备领用'" />
        <div class="options">
          <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button> -->
          <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
          <el-tab-pane label="领用信息" name="orderInfo" class="jcInfo" ref="orderInfos">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="领用单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请输入领用单号" :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="领用人" prop="recipientId">
                        <user-select v-model="dataForm.recipientId" placeholder="请选择领用人" clearable style="width: 100%" :disabled="btnType == 'look'" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="领用日期" prop="collectionTime">
                        <el-date-picker v-model="dataForm.collectionTime" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择领用日期" :disabled="btnType == 'look'">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="设备信息" name="gjxx">
                <div class="TableForm_main">
                  <div v-if="btnType !== 'look'" class="TableForm_title">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择设备</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                  </div>
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="tableContainer data-form">
                    <el-table ref="product" class="TableForm table" :data="dataFormTwo.productData" v-bind="customStyleData" hasC hasNO fixedNO @selection-change="handeleProductInfoData">
                      <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                      <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                      <el-table-column prop="productCode" label="设备编码" min-width="160" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="productName" label="设备名称" min-width="160" show-overflow-tooltip>
                        <template slot="header">
                          <span class="required">*</span>设备名称
                        </template>
                      </el-table-column>
                      <el-table-column prop="drawingNo" label="设备规格" min-width="160" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="unit" label="单位" width="120" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="availableQuantity" label="可用库存数量" width="160" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="requisitionNum" label="数量" width="160">
                        <template slot="header">
                          <span class="required">*</span>数量
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'productData.'+scope.$index+'.'+'requisitionNum'" :rules='productRules.requisitionNum'>
                            <el-input v-model="scope.row.requisitionNum" placeholder="请输入数量" :disabled="btnType == 'look'" maxlength="11" style="width: 135px;">
                            </el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="30">
                        <template slot-scope="scope">
                          <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="选择设备" treeTitle="设备分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'spare_parts' } }" :listMethod="getProductList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>
    
<script>
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { mapGetters } from 'vuex'
import { detailCollectionandreturn, addCollectionandreturn } from '@/api/dailyManagement/Maintenance'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getBimBusinessDetail } from '@/api/basicData/index'
export default {
  data() {
    return {
      codeConfig: {},//单据规则配置
      isattachmentswitch: '',
      categoryId: '',
      activeNames: ["basicInfo", "gjxx"],
      datafilelist: [],
      getcategoryTree,
      getProductList,
      ProductListRequestObj: {
        classAttribute: "spare_parts",
        code: "",
        drawingNo: "",
        endTime: "",
        name: "",
        orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }],
        pageNum: 1,
        pageSize: 20,
        startTime: "",
      },
      index: '',
      ProductTableSearchList: [
        { prop: "code", label: "设备编码", type: 'input' },
        { prop: "name", label: "设备名称", type: 'input' },
      ],
      ProductTableItems: [
        { prop: 'code', label: '产品编码' },
        { prop: 'name', label: '产品名称' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'productCategoryName', label: '产品分类' },
        { prop: 'availableQuantity', label: '可用库存数量' },
      ],
      salesList: [],
      dataFormTwo: {
        productData: [],
      },
      btnType: undefined,
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      dataForm: {
        orderNo:'',
        equipmentType: 'equipment',
        requisitionType: 'requisition',
        returnFlag: 0,
        returnTime: '',
        collectionTime: '',
        recipientId: '',
        maintainerIdText: '',
        departmentId: '',
        departmentIdText: '',
        remark: ''
      },
      customStyleData: {},
      organizeIdTrees: [],
      productRules: {
        // 数量
        requisitionNum: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["数量不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '数量必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ]
      },
      dataRule: {
        recipientId: [
          { required: true, message: '领用人不能为空', trigger: 'change' }
        ],
        collectionTime: [
          { required: true, message: '领用日期不能为空', trigger: 'change' }
        ],
      },
      selectRows: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getBimBusinessDetail()
  },
  methods: {
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (this.btnType == 'add') {
          this.dataForm.orderNo = data.number
        }
      } catch (error) {
      }
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_sbly'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    //领用人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("recipientId") });
    },
    //设备选择
    submitCustomerProduct(selectedIds, selectedList) {
      selectedList.map(item => {
        this.dataFormTwo.productData.map((item1) => {
          if (item.all.code == item1.equipmentIdCode && item.name == item1.equipmentIdName) {
            item.isrepeat = true
          }
        })
      });
      selectedList.map(item => {
        if (!item.isrepeat) {
          this.dataFormTwo.productData.push({
            productName: item.all.name,
            productCode: item.all.code,
            drawingNo: item.all.drawingNo,
            unit: item.all.mainUnit,
            availableQuantity: item.all.availableQuantity,
            productId: item.all.id,
            requisitionNum: '',
          })
        } else {
          this.$message({
            message: "所选设备重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
    },
    // 打开设备
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    goBack() {
      this.$emit('close')
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.productData.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      this.dataFormTwo.productData.splice(data.$index, 1)
    },
    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType === 'add' || this.btnType === 'edit') this.fetchData('LYDH')
      if (this.btnType == 'add') {
        this.dataForm.recipientId = this.userInfo.userId
        this.dataForm.collectionTime = this.jnpf.getToday()
      }
      if (this.dataForm.id) {
        detailCollectionandreturn(this.dataForm.id).then(res => {
          this.dataForm = res.data.requisition
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
        if (!valid) {
          return
        }
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            if (!this.dataFormTwo.productData.length) {
              this.$message({
                message: '请添加设备',
                type: 'error',
                duration: 1500,
              })
              return
            }
            if (this.datafilelist.length) {
              this.datafilelist.map((item, index) => {
                item.bimAttachments = {
                  businessType: 'system_attachment',
                  configKey: 'fj_sbly',
                  categoryId: this.categoryId,
                  documentId: item.id,
                  fileFlag: '',
                  sort: index
                }
              })
            }
            this.dataForm.documentStatus = value
            let obj = {
              attachmentList: this.datafilelist,
              requisition: this.dataForm,
              lines: this.dataFormTwo.productData
            }
            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'add') {
              formMethod = addCollectionandreturn
            }
            formMethod(obj).then(res => {
              let msg = "";
              if (formMethod == addCollectionandreturn) {
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
      })
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
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
    