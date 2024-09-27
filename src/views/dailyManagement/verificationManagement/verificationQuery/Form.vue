<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建检定任务' : btnType == 'edit' ? '编辑检定任务' : '查看检定任务'" />
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
          <el-tab-pane label="任务信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="任务名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入任务名称" :disabled="btnType == 'look'" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="检定机构" prop="verificationAgency">
                        <el-input v-model="dataForm.verificationAgency" placeholder="请输入检定机构" :disabled="btnType == 'look'" maxlength="200" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="计划执行部门" prop="departmentId">
                        <ComSelect v-model="organizeIdTrees" :disabled="btnType === 'look'" placeholder="请选择计划执行部门" auth :dialogTitle="'请选择计划执行部门'" @change="changedepartment" :currOrgId="dataForm.departmentId || '0'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="计划执行人" prop="maintainerId">
                        <el-select v-model="dataForm.maintainerIdName" placeholder="请选择计划执行人" clearable style="width: 100%;" :disabled="btnType === 'look'" filterable @change="selectsales">
                          <el-option v-for="(item, index) in salesList" :key="index" :label="item.name" :disabled="btnType == 'look'" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="周期类型" prop="cycleType">
                        <el-select v-model="dataForm.cycleType" placeholder="请选择周期类型" clearable style="width: 100%;" :disabled="btnType == 'look'">
                          <el-option v-for="(item, index) in cycleTypeStateList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.cycleType == 'cycle'" key="369">
                      <el-form-item label="保养等级" prop="maintenanceLevelId">
                        <el-cascader v-model="level" ref="mycascader" :props="props" :options="options" @change=changelevel placeholder="请选择保养等级" style="width: 100%;line-height:29px;"></el-cascader>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.cycleType == 'cycle'" key="3">
                      <el-form-item label="周期" prop="cycle">
                        <el-input v-model="dataForm.cycle" placeholder="请输入周期" :disabled="true" maxlength="50" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="dataForm.cycleType == 'cycle'" key="2">
                      <el-form-item label="单位" prop="unit">
                        <el-select v-model="dataForm.unit" placeholder="请选择单位" clearable style="width: 100%;" :disabled="true">
                          <el-option v-for="(item, index) in unitStateList" :key="index" :label="item.label" :value="item.label"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="下次检定时间" prop="nextCalibrationTime">
                        <el-date-picker v-model="dataForm.nextCalibrationTime" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择下次检定时间" :picker-options="pickerOptions" :disabled="btnType == 'look'">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="状态" prop="state">
                        <el-select v-model="dataForm.state" placeholder="请选择状态" clearable style="width: 100%;" :disabled="btnType == 'look'">
                          <el-option v-for="(item, index) in stateList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
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
              <el-collapse-item title="工具信息" name="gjxx">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择工具</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData">
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
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="选择工具" placeholder="请选择工具名称" treeTitle="工具分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'tool' } }" :listMethod="stateEquEquipment" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>
    
<script>
import { getcategoryTree, getequMaintenanceLevel } from '@/api/basicData/materialSettings'
import { addverification, updateverification, detailverification } from '@/api/dailyManagement/Maintenance'
import { getOrganizeInfo } from '@/api/permission/organize'
import { stateEquEquipment } from '@/api/basicData/index'
import { getOrganization } from '@/api/permission/user'
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  data() {
    return {
      activeNames: ["basicInfo", "gjxx"],
      level: [],
      options: [
        { label: "日常保养", value: "日常保养" },
        { label: "二级保养", value: "二级保养" },
        { label: "三级保养", value: "三级保养" },
        { label: "四级保养", value: "四级保养" },
        { label: "年度保养", value: "年度保养" }
      ],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          setTimeout(() => {
            const nodes = []
            let initListQuery = {
              level: node.value,
              pageNum: 1,
              pageSize: -1,
            }
            if (level > 1) return
            getequMaintenanceLevel(initListQuery).then(res => {
              res.data.records.map(item => {
                let obj = {
                  value: item.id,
                  label: item.cycle + ' ' + item.unit,
                  leaf: level >= 1
                }
                nodes.push(obj)
              })
              resolve(nodes);
            })
          }, 500);
        }
      },
      datafilelist: [],
      ProductListRequestObj: {
        classAttribute: "tool",
        state: 'normal',
        deviceType: 'normal',
        orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }],
        pageNum: 1,
        pageSize: 20,
      },
      //搜素条件列表
      ProductTableSearchList: [
        { prop: "code", label: "工具编码", type: 'input' },
        { prop: "name", label: "工具名称", type: 'input' }
      ],
      ProductTableItems: [
        { prop: 'code', label: '工具编码', fixed: 'left' },
        { prop: 'name', label: '工具名称', fixed: 'left' },
        { prop: 'specModel', label: '工具规格' },
        { prop: 'categoryName', label: '工具分类' },
      ],

      cycleTypeStateList: [
        { label: "周期", value: "cycle" },
        { label: "一次", value: "disposable" },
      ],
      stateList: [
        { label: "禁用", value: "disabled" },
        { label: "启用", value: "enable" }
      ],
      unitStateList: [
        { label: '天' },
        { label: '周' },
        { label: '月' },
        { label: '季' },
        { label: '年' }
      ],
      salesList: [],
      getcategoryTree,
      stateEquEquipment,
      dataFormTwo: {
        productData: [],
      },
      btnType: undefined,
      activeName: "orderInfo",
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        maintenanceLevelId: '',
        nextCalibrationTime: '',
        verificationAgency: '',
        state: '',
        unit: '',
        cycle: '',
        cycleType: '',
        maintainerIdName: '',
        maintainerId: '',
        departmentId: '',
        departmentIdName: '',
        name: '',
        remark: ''
      },
      anceTime: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 3600 * 24;
        }
      },
      organizeIdTrees: [],
      dataRule: {
        maintenanceLevelId: [
          { required: true, message: '保养等级不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'change' }
        ],
        cycleType: [
          { required: true, message: '周期类型不能为空', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '计划执行部门不能为空', trigger: 'change' }
        ],
        maintainerId: [
          { required: true, message: '计划执行人不能为空', trigger: 'change' }
        ],
        state: [
          { required: true, message: '状态不能为空', trigger: 'change' }
        ],
        cycle: [
          { required: true, message: '周期不能为空', trigger: 'change' },
          { validator: this.formValidate('bigInt'), trigger: 'change' }
        ],
        unit: [
          { required: true, message: '单位不能为空', trigger: 'change' }
        ],
        nextCalibrationTime: [
          { required: true, message: `下次执行时间不能为空`, trigger: 'change' }
        ],
        verificationAgency: [
          { required: true, message: `检定机构不能为空`, trigger: 'change' }
        ],
      },
      customerData: {},
      treeLoading: false,
      selectRows: []
    }
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    changelevel(e) {
      let a = this.$refs['mycascader'].getCheckedNodes()[0].pathLabels[1].split(' ')
      this.dataForm.maintenanceLevelId = e[1]
      this.dataForm.cycle = a[0]
      this.dataForm.unit = a[1]
    },
    //表格某一行被点击
    rowaction(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    //下次执行时间
    // nextMaintenanceTimeaction(value) {
    //   this.dataForm.nextCalibrationTime = value 
    // },
    // 打开工具
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    //工具选择
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
            equipmentIdName: item.name,
            equipmentIdCode: item.all.code,
            spec: item.all.specModel,
            equipmentId: item.id,
            description: ''
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
    //计划执行人
    selectsales(val) {
      console.log(val);
      this.dataForm.maintainerId = val
    },
    //计划执行部门
    changedepartment(val) {
      console.log("val,val", val);
      this.dataForm.departmentIdName = ""
      this.dataForm.departmentId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.departmentId = ''
      this.dataForm.departmentId = val[val.length - 1]
      this.$nextTick(() => { this.$refs['dataForm'].validateField('departmentId') })
      getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
        console.log("用户", res);
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data

      })
    },
    // dateFormat(dateData) {
    //   var date = new Date(dateData)
    //   var y = date.getFullYear()
    //   var m = date.getMonth() + 1
    //   m = m < 10 ? ('0' + m) : m
    //   var d = date.getDate()
    //   d = d < 10 ? ('0' + d) : d
    //   var h = date.getHours()
    //   h = h < 10 ? ('0' + h) : h
    //   var min = date.getMinutes()
    //   min = min < 10 ? ('0' + min) : min
    //   // var s = date.getSeconds()
    //   // s = s < 10 ? ('0' + s) : s
    //   const time = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + '00'
    //   return time
    // },
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
      console.log("1234", data);
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
        this.dataForm.state = 'enable'
      }
      if (this.dataForm.id) {
        detailverification(this.dataForm.id).then(res => {
          this.dataForm = res.data.task
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
              console.log("没有bumen");
              this.salesFlag = true
            }
          })
        })
      }
    },
    goBack() {
      this.$emit('close')
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataFormTwo.productData.length) {
            this.$message({
              message: '请添加工具',
              type: 'error',
              duration: 1500,
            })
            return
          }
          this.dataForm.documentStatus = value
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
            task: this.dataForm,
            lines: this.dataFormTwo.productData
          }
          this.btnLoading = true
          let formMethod = null;
          if (this.btnType == 'edit') {
            formMethod = updateverification
          } else if (this.btnType == 'add' || this.btnType == 'copy') {
            formMethod = addverification
          }
          formMethod(obj).then(res => {
            console.log(res);
            let msg = "";
            if (formMethod == addverification) {
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
                this.visible = false
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
    