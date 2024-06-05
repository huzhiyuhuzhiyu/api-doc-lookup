<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建领用' : btnType == 'edit' ? '编辑领用' : '查看领用'" />
        <div class="options" v-if="btnType != 'look'">
          <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button> -->
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
          <el-tab-pane label="领用信息" name="orderInfo" class="jcInfo" ref="orderInfos">
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="领用部门" prop="departmentId">
                    <ComSelect v-model="organizeIdTrees" :disabled="btnType === 'look'" placeholder="请选择领用部门" auth :dialogTitle="'请选择领用部门'" @change="changedepartment" :currOrgId="dataForm.departmentId || '0'" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="领用人" prop="recipientId">
                    <el-select v-model="dataForm.maintainerIdText" placeholder="请选择领用人" clearable style="width: 100%;" :disabled="btnType === 'look'" filterable @change="selectsales">
                      <el-option v-for="(item, index) in salesList" :key="index" :label="item.name" :disabled="btnType == 'look'" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
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
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>工具信息</h5>
            </div>
            <div class="TableForm_main">
              <div v-if="btnType !== 'look'" class="TableForm_title">
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择工具</el-button>|
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
              </div>
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="tableContainer">
                <el-table ref="product" class="TableForm table" :data="dataFormTwo.productData" v-bind="customStyleData" hasC hasNO fixedNO @selection-change="handeleProductInfoData" v-if="tableVisible">
                  <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                  <el-table-column prop="equipmentIdCode" label="工具编码" width="200" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="equipmentIdName" label="工具名称" width="200" show-overflow-tooltip>
                    <template slot="header">
                      <span class="required">*</span>工具名称
                    </template>
                  </el-table-column>
                  <el-table-column prop="spec" label="工具规格" width="200" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="description" label="说明" min-width="300">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.description" placeholder="请输入说明" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="30">
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" fixed="right" width="40">
                    <template slot="header">
                      <el-tooltip content="切换展示模式" placement="top">
                        <el-link icon="el-icon-sort" :underline="false" @click="switchStyle" />
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </div>

          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="选择工具" treeTitle="工具分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'tool' } }" :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>
    
<script>
import { detailCollectionandreturn, addCollectionandreturn } from '@/api/dailyManagement/Maintenance'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getEquEquipmentList } from '@/api/basicData/index'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getOrganization } from '@/api/permission/user'
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  data () {
    return {
      tableVisible: true,
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
            "column": "createTime"
          }
        ],
        code: "",
        name: "",
        classAttribute: "tool",
        deviceType: 'normal',
        state: 'normal'
      },
      index: '',
      ProductTableSearchList: [
        { prop: "code", label: "工具编码", type: 'input' },
        { prop: "name", label: "工具名称", type: 'input' },
      ],
      ProductTableItems: [
        { prop: 'code', label: '工具编码', fixed: 'left' },
        { prop: 'name', label: '工具名称', fixed: 'left' },
        { prop: 'specModel', label: '工具规格' },
        { prop: 'categoryName', label: '工具分类' },
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
        collectionTime: '',
        recipientId: '',
        maintainerIdText: '',
        departmentId: '',
        departmentIdText: '',
        remark: ''
      },
      customStyleData: {},
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 1000 * 3600 * 24;
      //   }
      // },
      organizeIdTrees: [],

      dataRule: {
        departmentId: [
          { required: true, message: '领用部门不能为空', trigger: 'change' }
        ],
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
  mounted () {
    // let tBody = document.querySelectorAll('.el-table')[1]
    // tBody.style.height = 'auto'
    // tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    switchStyle (type) {
      // function getParentMain (_this) {
      //   if (!_this) return null
      //   if (_this.$refs.productForm) return _this.$refs.productForm
      //   return getParentMain(_this.$parent)
      // }
      const mainRegion = this.$refs.orderInfos.$parent.$parent.$el // 表单页面区域
      if (JSON.stringify(this.customStyleData) === "{}" || type === 'onresize') {
        if (type !== 'onresize') this.$message.success('适配模式')
        const mainHeight = mainRegion.clientHeight;
        let bortherHeight = 0
        const bortherItems = mainRegion.querySelectorAll('.jcInfo > *') // 与TableForm同级的所有组件
        bortherItems.forEach(item => {
          if (item.className !== 'TableForm_main') bortherHeight += item.clientHeight // 计算除TableForm之外的所有组件的高
        })
        const TableFormTitle = mainRegion.querySelector('.TableForm_title') // 获取TableForm头部操作栏
        const TableFormTitleHeight = TableFormTitle ? TableFormTitle.clientHeight : 0
        mainRegion.querySelector('.tableContainer').style.height = TableFormTitle ? 'calc(100% - 36px)' : '100%' // 设置表单容器的高度
        // 表格高度 = 区域总高度 - 同级元素高度 - TableForm头部操作栏高度 - 安全高度（一般写67，如果有tabs加49，如果有合计行加40）
        let maxHeight = mainHeight - bortherHeight - TableFormTitleHeight - (67 + 51)

        // 计算高度最低500
        maxHeight = maxHeight > 500 ? maxHeight : 500

        this.customStyleData = {
          height: 10000,
          maxHeight
        }
        // 附带防抖的监听适配模式屏幕缩放
        window.onresize = () => {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.switchStyle('onresize')
          }, 100);
        };
      } else {
        this.$message.success('全展模式')
        window.onresize = null
        this.customStyleData = {}
        mainRegion.querySelector('.tableContainer').style.height = '100%' // 设置表单容器的高度
        // 重新加载表格
        this.tableVisible = false
        this.$nextTick(() => { this.tableVisible = true })
      }
    },
    //工具选择
    submitCustomerProduct (selectedIds, selectedList) {
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
            equipmentIdCode: item.all.code,
            spec: item.all.specModel,
            equipmentIdName: item.name,
            equipmentId: item.id,
            description: '',
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
    openSeleceProductDialog () {
      this.$refs['ComSelect-page'].openDialog()
    },
    //领用人
    selectsales (val) {
      this.dataForm.recipientId = val
    },
    //领用部门
    changedepartment (val) {
      this.dataForm.departmentIdText = ""
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
    goBack () {
      this.$emit('close')
    },
    // 产品列表选中 
    handeleProductInfoData (val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete () {
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
    handleDel (data) {
      this.dataFormTwo.productData.splice(data.$index, 1)
    },
    //领用时间
    dateFormattime (dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      const time = y + '-' + m + '-' + d
      return time
    },
    // 切换table
    handleClick (tab, event) {
      console.log(tab, event);
    },
    init (id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType == 'add') {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        this.dataForm.collectionTime = this.dateFormattime(end)
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
                this.salesList = res.data
              })
            } else {
              this.salesFlag = true
            }
          })
        })
      }
    },
    handleConfirm (value) {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            if (!this.dataFormTwo.productData.length) {
              this.$message({
                message: '请添加工具',
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
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>
    