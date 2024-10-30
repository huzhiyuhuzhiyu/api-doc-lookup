<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建工具归还' : btnType == 'edit' ? '编辑工具归还' : '查看工具归还'" />
        <div class="options">
          <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('submit')">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
          <el-tab-pane label="归还信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="工具待归还单号" prop="waitRequisitionNo">
                        <ComSelect-page v-model="dataForm.waitRequisitionNo" @change="waitRequisitionChange" :tableItems="waitRequisitionTableItems" dialogTitle="选择单号" placeholder="请选择待归还单号" :listMethod="CollectionandreturnList" :listRequestObj="waitRequisitionRequestObj" :searchList="waitRequisitionSearchList" :isdisabled="btntype === 'look'" :renderTree="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="归还日期" prop="collectionTime">
                        <el-date-picker v-model="dataForm.collectionTime" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择归还日期" :disabled="btnType == 'look'">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="归还人" prop="recipientId">
                        <user-select v-model="dataForm.recipientId" placeholder="请选择归还人" clearable style="width: 100%" :disabled="btnType == 'look'" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="工具信息" name="sbxx">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择工具</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.productData" @selection-change="handeleProductInfoData">
                    <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' key="11" />
                    <el-table-column prop="equipmentCode" label="工具编号" width="180">
                      <template slot="header">
                        <span class="required">*</span>工具编号
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.'+scope.$index+'.'+'equipmentCode'" :rules='productRules.equipmentCode'>
                          <el-input v-model="scope.row.equipmentCode" placeholder="请输入工具编号" :disabled="btnType == 'look'" style="width: 155px;">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="productCode" label="工具编码" min-width="160" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="productName" label="工具名称" min-width="160" show-overflow-tooltip>
                      <template slot="header">
                        <span class="required">*</span>工具名称
                      </template>
                    </el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" min-width="160" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="unit" label="单位" width="120" show-overflow-tooltip>
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
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="选择工具" treeTitle="工具分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'spare_parts' } }" :listMethod="getProductList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>
    
<script>
import { getBimBusinessDetail } from '@/api/basicData/index'
import { mapGetters } from 'vuex'
import { updateCollectionandreturn, detailCollectionandreturn, CollectionandreturnList, addCollectionandreturn } from '@/api/dailyManagement/Maintenance'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getProductList } from '@/api/basicData/materialFiles' // 工具列表
export default {
  data() {
    return {
      waitRequisitionSearchList: [
        { prop: 'orderNo', label: '领用单号', type: 'input' },
      ],
      waitRequisitionRequestObj: {
        requisitionType: 'requisition',
        equipmentType: 'tool',
        returnFlag: 0,
        maintainerIdText: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      CollectionandreturnList,
      waitRequisitionTableItems: [
        { prop: 'orderNo', label: '领用单号' },
        { prop: 'collectionTime', label: '领用日期' },
        { prop: 'maintainerIdText', label: '领用人' },
        { prop: 'createTime', label: '创建时间' }
      ],
      categoryId: '',
      isattachmentswitch: '',
      activeNames: ["basicInfo", "sbxx"],
      datafilelist: [],
      getcategoryTree,
      getProductList,
      ProductListRequestObj: {
        classAttribute: "spare_parts",
        code: "",
        createTimeArr: [],
        customerQueryFields: [],
        drawingNo: "",
        endTime: "",
        name: "",
        orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }],
        pageNum: 1,
        pageSize: 20,
        productCategoryId: "",
        productSource: "",
        productStatus: "",
        startAndEndTime: [],
        startTime: "",
      },
      index: '',
      ProductTableSearchList: [
        { prop: "code", label: "工具编码", type: 'input' },
        { prop: "name", label: "工具名称", type: 'input' },
      ],
      ProductTableItems: [
        { prop: 'code', label: '工具编码' },
        { prop: 'name', label: '工具名称' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'productCategoryName', label: '工具分类' },
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
        waitRequisitionNo:'',
        requisitionType: 'back',
        equipmentType: 'tool',
        equipmentId: '',
        equipmentIdName: '',
        collectionTime: '',
        recipientId: ''
      },
      productRules: {
        // 数量
        requisitionNum: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["数量不能为空", (errMsg, index) => { this.$message.error(`工具信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '数量必须大于0', (errMsg, index) => { this.$message.error(`工具信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ],
        equipmentCode: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["工具编号不能为空", (errMsg, index) => { this.$message.error(`工具信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
        ]
      },
      dataRule: {
        recipientId: [
          { required: true, message: '归还人不能为空', trigger: 'blur' }
        ],
        collectionTime: [
          { required: true, message: '归还日期不能为空', trigger: 'blur' }
        ]
      },
      selectRows: []
    }
  },
  created() {
    this.getBimBusinessDetail()
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    waitRequisitionChange(val, data) {
      detailCollectionandreturn(data[0].all.id).then(res => {
        this.dataFormTwo.productData = res.data.lines
      })
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_gjgh'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    //归还人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("recipientId") });
    },
    //工具选择
    submitCustomerProduct(selectedIds, selectedList) {
      selectedList.map(item => {
        this.dataFormTwo.productData.map((item1) => {
          if (item.id == item1.productId) {
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
            incomingOutgoingNum: item.all.incomingOutgoingNum,
            productId: item.all.id,
            requisitionNum: '',
          })
        } else {
          this.$message({
            message: "所选工具重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
    },
    // 打开工具
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    goBack() {
      this.$emit('close')
    },
    // 工具列表选中 
    handeleProductInfoData(val) {
      console.log(val);
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的工具',
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
    async handleConfirm(value) {
      let submitFlag = true
      const form_1 = this.$refs.dataForm
      const valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        let formItems = form_1.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }
      if (!this.dataFormTwo.productData.length) {
        this.$message({
          message: '请添加工具',
          type: 'error',
          duration: 1500,
        })
        return
      }
      const form_2 = this.$refs.productForm
      const valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }
      if (submitFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'system_attachment',
              configKey: 'fj_gjgh',
              categoryId: this.categoryId,
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        let obj = {
          attachmentList: this.datafilelist,
          requisition: this.dataForm,
          lines: this.dataFormTwo.productData
        }
        this.btnLoading = true
        let formMethod = null;
        if (this.btnType == 'edit') {
          formMethod = updateCollectionandreturn
        } else if (this.btnType == 'add') {
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
    