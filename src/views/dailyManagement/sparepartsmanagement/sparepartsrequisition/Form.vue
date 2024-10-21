<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建备件领用' : btnType == 'edit' ? '编辑备件领用' : '查看备件领用'" />
        <div class="options">
          <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('submit')">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
          <el-tab-pane label="报废信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="出库仓库" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请输入出库仓库" :disabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="领用目的" prop="remark3">
                        <el-select v-model="dataForm.remark3" placeholder="请选择领用目的" style="width: 100%;">
                          <el-option v-for="(item, index) in [{label:'设备保养',value:'submit'},{label:'设备维修',value:'draft'}]" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.remark3=='submit'">
                      <el-form-item label="设备保养单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请输入设备保养单号" :disabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.remark3=='draft'">
                      <el-form-item label="设备维修单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请输入设备维修单号" :disabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="设备名称" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请输入设备名称" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="领用日期" prop="applicantTime">
                        <el-date-picker v-model="dataForm.applicantTime" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择领用日期" :disabled="btnType == 'look'">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="领用部门" prop="departmentId">
                        <ComSelect v-model="organizeIdTrees" :disabled="btnType === 'look'" placeholder="请选择领用部门" auth :dialogTitle="'请选择申请部门'" @change="changedepartment" :currOrgId="dataForm.departmentId || '0'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="领用人" prop="applicantId">
                        <el-select v-model="dataForm.applicantIdName" placeholder="请选择领用人" clearable style="width: 100%;" :disabled="btnType === 'look'" filterable @change="selectsales">
                          <el-option v-for="(item, index) in salesList" :key="index" :label="item.name" :disabled="btnType == 'look'" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="备件信息" name="sbxx">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择备件</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData">
                    <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                    <el-table-column prop="equipmentIdCode" label="备件编码" min-width="120" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="equipmentIdName" label="备件名称" min-width="120" show-overflow-tooltip>
                      <template slot="header">
                        <span class="required">*</span>备件名称
                      </template>
                    </el-table-column>
                    <el-table-column prop="specModel" label="备件规格" min-width="120" show-overflow-tooltip>
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
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="选择备件" treeTitle="备件分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'equipment' } }" :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>
    
<script>
import { addScrapApplicationForm, updateScrapApplicationForm, detailScrapApplicationForm } from '@/api/dailyManagement/Maintenance'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getEquEquipmentList } from '@/api/basicData/index'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getOrganization } from '@/api/permission/user'
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  data() {
    return {
      activeNames: ["basicInfo", "sbxx"],
      datafilelist: [],
      getcategoryTree,
      getEquEquipmentList,
      ProductListRequestObj: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "create_time"
          }
        ],
        code: "",
        name: "",
        state: 'normal',
        deviceType: 'normal',
        classAttribute: "equipment",
      },
      index: '',
      ProductTableSearchList: [
        { prop: "code", label: "备件编码", type: 'input' },
        { prop: "name", label: "备件名称", type: 'input' },
      ],
      ProductTableItems: [
        { prop: 'code', label: '备件编码', fixed: 'left' },
        { prop: 'name', label: '备件名称', fixed: 'left' },
        { prop: 'categoryName', label: '备件分类' },
        { prop: 'specModel', label: '备件规格' },
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
        orderNo: '',
        classAttribute: 'equipment',
        applicantTime: '',
        reasonScrapping: '',
        departmentId: '',
        departmentIdName: '',
        applicantId: '',
        applicantIdName: '',
        remark: ''
      },
      organizeIdTrees: [],

      dataRule: {
        orderNo: [
          { required: true, message: '报废单号不能为空', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '申请部门不能为空', trigger: 'change' }
        ],
        applicantId: [
          { required: true, message: '申请人不能为空', trigger: 'change' }
        ],
        applicantTime: [
          { required: true, message: '申请日期不能为空', trigger: 'change' }
        ],
        reasonScrapping: [
          { required: true, message: '报废理由不能为空', trigger: 'change' }
        ],
      },
      selectRows: []
    }
  },
  methods: {
    //备件选择
    submitCustomerProduct(selectedIds, selectedList) {
      selectedList.map(item => {
        this.dataFormTwo.productData.map((item1) => {
          if (item.id == item1.equipmentId) {
            item.isrepeat = true
          }
        })
      });
      selectedList.map(item => {
        if (!item.isrepeat) {
          this.dataFormTwo.productData.push({
            equipmentIdName: item.name,
            equipmentIdCode: item.all.code,
            categoryName: item.all.categoryName,
            specModel: item.all.specModel,
            equipmentId: item.id,
          })
        } else {
          this.$message({
            message: "所选备件重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
    },
    // 打开备件
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    //申请人
    selectsales(val) {
      this.dataForm.applicantId = val
    },
    //申请部门
    changedepartment(val) {
      this.dataForm.departmentIdName = ""
      this.dataForm.departmentId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.departmentId = ''
      this.dataForm.departmentId = val[val.length - 1]
      this.$nextTick(() => { this.$refs['dataForm'].validateField('departmentId') })
      getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data

      })
    },
    goBack() {
      this.$emit('close')
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      console.log(val);
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
      if (this.btnType == 'add') {
        this.dataForm.applicantTime = this.jnpf.getToday()
      }
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
          this.$nextTick(() => {
            if (this.dataForm.departmentId) {
              getOrganizeInfo(this.dataForm.departmentId).then(sss => {
                this.organizeIdTrees = sss.data.organizeIdTree || []
                this.organizeIdTrees.push(this.dataForm.departmentId)
              })
              getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
                if (res.data.length > 0) {
                  res.data.forEach(item => {
                    item.name = item.fullName.split('/')[0]
                  });
                }
                console.log(this.salesList);
                this.salesList = res.data
              })
            } else {
              this.salesFlag = true
            }
          })
        })
      }
    },
    handleConfirm(value) {
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            if (!this.dataFormTwo.productData.length) {
              this.$message({
                message: '请添加备件',
                type: 'error',
                duration: 1500,
              })
              return
            }
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
              scrapping: this.dataForm,
              lines: this.dataFormTwo.productData
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
    