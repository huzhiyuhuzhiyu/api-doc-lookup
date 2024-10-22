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
                      <el-form-item label="领用目的" prop="useApplication">
                        <el-select v-model="dataForm.useApplication" placeholder="请选择领用目的" style="width: 100%;" @change="useApplicationchange">
                          <el-option v-for="(item, index) in [{label:'设备保养',value:'maintain'},{label:'设备维修',value:'repair'}]" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.useApplication=='maintain'">
                      <el-form-item label="设备保养任务名称" prop="workNo">
                        <ComSelect-page v-model="dataForm.workNo" @change="maintainChange" :tableItems="maintainTableItems" dialogTitle="选择设备保养" placeholder="请选择设备保养" :listMethod="checkmaintenanceList" :listRequestObj="maintainRequestObj" :searchList="maintainSearchList" :isdisabled="btnType === 'look'" :renderTree="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.useApplication=='repair'">
                      <el-form-item label="设备维修单号" prop="workNo">
                        <ComSelect-page v-model="dataForm.workNo" @change="repairChange" :tableItems="repairTableItems" dialogTitle="选择维修单号" placeholder="请选择维修单号" :listMethod="RepairRequestList" :listRequestObj="repairRequestObj" :searchList="repairSearchList" :isdisabled="btnType === 'look'" :renderTree="false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="设备名称" prop="equipmentIdName">
                        <el-input v-model="dataForm.equipmentIdName" placeholder="请输入设备名称" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="领用日期" prop="applicantTime">
                        <el-date-picker v-model="dataForm.applicantTime" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择领用日期" :disabled="btnType == 'look'">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="领用人" prop="recipientId">
                        <user-select v-model="dataForm.recipientId" placeholder="请选择领用人" clearable style="width: 100%" :disabled="btnType == 'look'" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="sbxx">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择备件</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.productData" @selection-change="handeleProductInfoData">
                    <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' key="11" />
                    <el-table-column prop="code" label="产品编码" min-width="120" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="name" label="产品名称" min-width="120" show-overflow-tooltip>
                      <template slot="header">
                        <span class="required">*</span>产品名称
                      </template>
                    </el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" min-width="120" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="mainUnit" label="单位" min-width="120" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="incomingOutgoingNum" label="出入库数量" min-width="120" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="requisitionNum" label="数量" width="160">
                      <template slot="header">
                        <span class="required">*</span>数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'requisitionNum'" :rules='productRules.requisitionNum'>
                          <el-input v-model="scope.row.requisitionNum" placeholder="请输入数量" :disabled="btnType == 'look'" maxlength="11" style="width: 135px;" oninput="value=value.replace(/[^0-9.]/g,'')">
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
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'spare_parts' } }" :listMethod="getProductList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>
    
<script>
import { mapGetters } from 'vuex'
import { addScrapApplicationForm, updateScrapApplicationForm, detailScrapApplicationForm, checkmaintenanceList, RepairRequestList, addCollectionandreturn } from '@/api/dailyManagement/Maintenance'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getOrganization } from '@/api/permission/user'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  data() {
    return {
      repairSearchList: [
        { prop: 'maintenanceNo', label: '维修单号', type: 'input' },
        { prop: 'equipmentIdCode', label: '设备编码', type: 'input' },
        { prop: 'equipmentIdName', label: '设备名称', type: 'input' }
      ],
      repairRequestObj: {
        state: 'maintaining',
        classAttribute: "equipment",
        maintenanceNo: '',
        equipmentIdCode: '',
        equipmentIdName: '',
        applicantIdName: '',
        applicationStartDate: '',
        applicationEndDate: '',
        faultStartTimeStart: '',
        faultStartTimeEnd: '',
        maintenancePersonnel: '',
        startTime: '',
        endTime: '',
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
      RepairRequestList,
      repairTableItems: [
        { prop: 'maintenanceNo', label: '维修单号' },
        { prop: 'equipmentIdCode', label: '设备编码' },
        { prop: 'equipmentIdName', label: '设备名称' }
      ],
      maintainSearchList: [
        { prop: 'name', label: '任务名称', type: 'input' },
        { prop: 'equipmentIdCode', label: '设备编码', type: 'input' },
        { prop: 'equipmentIdName', label: '设备名称', type: 'input' }
      ],
      maintainRequestObj: {
        classAttribute: "equipment",
        name: "",
        taskType: 'maintenance',
        cycleType: "",
        equipmentIdCode: "",
        equipmentIdName: '',
        state: '',
        nextMaintenanceStartTime: '',
        nextMaintenanceEndTime: '',
        startTime: '',
        endTime: '',
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
      checkmaintenanceList,
      maintainTableItems: [
        { prop: 'name', label: '任务名称' },
        { prop: 'equipmentIdCode', label: '设备编码' },
        { prop: 'equipmentIdName', label: '设备名称' },
        { prop: 'nextMaintenanceTime', label: '计划保养日期' }
      ],
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
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
      ],
      ProductTableItems: [
        { prop: 'code', label: '产品编码' },
        { prop: 'name', label: '产品名称' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'productCategoryName', label: '产品分类' },
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
        useApplication: '',
        classAttribute: 'equipment',
        equipmentId: '',
        equipmentIdName: '',
        applicantTime: '',
        recipientId: ''
      },
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
        useApplication: [
          { required: true, message: '请选择领用目的', trigger: 'change' }
        ],
        workNo: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        recipientId: [
          { required: true, message: '领用人不能为空', trigger: 'blur' }
        ],
        applicantTime: [
          { required: true, message: '领用日期不能为空', trigger: 'blur' }
        ]
      },
      selectRows: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    useApplicationchange(val) {
      this.dataForm.useApplication = val
      this.$set(this.dataForm, 'workNo', '')
      this.$set(this.dataForm, 'equipmentIdName', '')
      this.$set(this.dataForm, 'equipmentId', '')
    },
    repairChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('workNo') }) // 校验操作的元素(name是组件绑定的value)
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.workNo = data[0].all.maintenanceNo
        this.dataForm.equipmentId = data[0].all.equipmentId
        this.dataForm.equipmentIdName = data[0].all.equipmentIdName
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.equipmentId = ""
        this.dataForm.workNo = ""
        this.dataForm.equipmentIdName = ""
      }
    },
    maintainChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('workNo') }) // 校验操作的元素(name是组件绑定的value)
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.workNo = data[0].all.name
        this.dataForm.equipmentId = data[0].all.equipmentId
        this.dataForm.equipmentIdName = data[0].all.equipmentIdName
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.equipmentId = ""
        this.dataForm.workNo = ""
        this.dataForm.equipmentIdName = ""
      }
    },
    //领用人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("recipientId") });
    },
    //备件选择
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
            name: item.name,
            code: item.all.code,
            drawingNo: item.all.drawingNo,
            mainUnit: item.all.mainUnit,
            incomingOutgoingNum: item.all.incomingOutgoingNum,
            productId: item.id,
            requisitionNum: 3,
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
        this.dataForm.recipientId = this.userInfo.userId
        this.dataForm.applicantTime = this.jnpf.getToday()
      }
      if (this.dataForm.id) {
        detailScrapApplicationForm(this.dataForm.id).then(res => {
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
          message: '请添加备件',
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
              businessType: '',
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
          formMethod = updateScrapApplicationForm
        } else if (this.btnType == 'add') {
          formMethod = addCollectionandreturn
        }
        formMethod(obj).then(res => {
          console.log(res);
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
    