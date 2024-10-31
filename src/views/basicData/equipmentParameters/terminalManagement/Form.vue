<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建工位终端管理' : btnType == 'edit' ? '编辑工位终端管理' : '查看工位终端管理'" />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="basicInfo">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="终端编码" prop="code">
                    <el-input v-model="dataForm.code" placeholder="请输入编码" :disabled="btnType == 'look'" maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="终端名称" prop="name">
                    <el-input v-model="dataForm.name" placeholder="请输入名称" :disabled="btnType == 'look'" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="状态" prop="state">
                    <el-select v-model="dataForm.state" placeholder="请选择状态" clearable style="width: 100%;" :disabled="btnType == 'look'">
                      <el-option v-for="(item, index) in stateList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="16" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" type="textarea" maxlength="200" :rows="2" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="设备信息" name="sbInfo">
            <div v-if="btnType !== 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择设备</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData">
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="equipmentIdCode" label="设备编码" width="auto" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="equipmentIdName" label="设备名称" width="auto" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="categoryName" label="设备分类" width="auto" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="specModel" label="设备规格" width="auto" show-overflow-tooltip>
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
      </div>
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="选择设备" treeTitle="设备分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'equipment' } }" :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>
    
<script>
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getEquEquipmentList, addTerminalData, editTerminalData, getTerminalInfo, checkTerminalCode } from '@/api/basicData/index'
export default {
  data() {
    return {
      activeNames: ["basicInfo", "sbInfo"],
      stateList: [
        { label: "禁用", value: "disabled" },
        { label: "启用", value: "enable" }
      ],
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
        disableState: 'discard',
        classAttribute: "equipment",
      },
      index: '',
      ProductTableSearchList: [
        { prop: "code", label: "设备编码", type: 'input' },
        { prop: "name", label: "设备名称", type: 'input' },
      ],
      ProductTableItems: [
        { prop: 'code', label: '设备编码', fixed: 'left' },
        { prop: 'name', label: '设备名称', fixed: 'left' },
        { prop: 'categoryName', label: '设备分类' },
        { prop: 'specModel', label: '设备规格' },
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
        id: '',
        code: '',
        state: '',
        name: '',
        remark: ''
      },
      organizeIdTrees: [],
      dataRule: {
        code: [{ required: true, message: '请输入终端编码', trigger: 'blur' }, { validator: this.formValidate('noSpace'), trigger: 'blur' }, { validator: this.formValidate('filterSpecial'), trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            checkTerminalCode(this.jnpf.specialCodeUrl(value), this.dataForm.id).then(res => {
              if (res.data) {
                callback(new Error("终端编码重复"));
              } else {
                callback();
              }
            }).catch(error => {
            })
          }, trigger: 'blur'
        }
        ],
        name: [{ required: true, message: '请输入终端名称', trigger: 'blur' }],
        state: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      selectRows: []
    }
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    //设备选择
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
      if (this.dataForm.id) {
        getTerminalInfo(this.dataForm.id).then(res => {
          this.dataForm = res.data.equStationTerminal
          this.dataFormTwo.productData = res.data.lines
        })
      }
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.dataFormTwo.productData.length) {
          this.$message({
            message: "请添加设备",
            type: 'error',
            duration: 1500,
          })
          return
        }
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            this.dataForm.documentStatus = value
            let obj = {
              equStationTerminal: this.dataForm,
              lines: this.dataFormTwo.productData
            }
            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'edit') {
              formMethod = editTerminalData
            } else if (this.btnType == 'add') {
              formMethod = addTerminalData
            }
            formMethod(obj).then(res => {
              console.log(res);
              let msg = "";
              if (formMethod == addTerminalData) {
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
  padding-top: 10px;
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
    