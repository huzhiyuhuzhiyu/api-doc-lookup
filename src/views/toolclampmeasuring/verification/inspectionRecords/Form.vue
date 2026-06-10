<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建检定记录' : btnType == 'edit' ? '编辑检定记录' : btnType == 'maintenance' ? '工具检定' : '查看检定记录'" />
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
          <el-tab-pane label="检定信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="检定机构" prop="verificationAgency">
                        <el-input v-model="dataForm.verificationAgency" placeholder="请输入检定机构" :disabled="btnType == 'look' || btnType == 'maintenance'" maxlength="200" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="检定日期" prop="actualMaintenanceDate">
                        <el-date-picker v-model="dataForm.actualMaintenanceDate" placeholder="请选择检定日期" type="date" :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;" @change="cycleaction" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < limit || time.getTime() > Date.now()
                        }
                      }">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="执行部门" prop="actualDepartmentId">
                        <ComSelect v-model="organizeIdTrees" :disabled="btnType === 'look'" placeholder="请选择执行部门" auth :dialogTitle="'请选择执行部门'" @change="changedepartment" :currOrgId="dataForm.actualDepartmentId || '0'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="执行人" prop="actualMaintenanceId">
                        <el-select v-model="dataForm.actualMaintenanceIdText" placeholder="请选择执行人" clearable style="width: 100%;" :disabled="btnType === 'look'" filterable @change="selectsales">
                          <el-option v-for="(item, index) in salesList" :key="index" :label="item.name" :disabled="btnType == 'look'" :value="item.id"></el-option>
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
                <div v-if="btnType == 'edit' || btnType == 'add'">
                  <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择工具</el-button>|
                  <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData">
                    <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType == 'edit' || btnType == 'add'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                    <el-table-column prop="equipmentIdCode" label="工具编码" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="equipmentIdName" label="检定工具" width="200" show-overflow-tooltip>
                      <template slot="header">
                        <span class="required">*</span>检定工具
                      </template>
                    </el-table-column>
                    <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                    <el-table-column prop="spec" label="工具规格" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="description" label="说明" min-width="300">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.description" placeholder="请输入说明" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'edit' || btnType == 'add'" key="24">
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
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="选择工具" treeTitle="工具分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'tool' } }" :listMethod="stateEquEquipment" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>
</template>
    
<script>
import { equcemainterecords, addVerificationrecords, detailVerificationrecords, detailverification } from '@/api/dailyManagement/Maintenance'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { stateEquEquipment } from '@/api/basicData/index'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getOrganization } from '@/api/permission/user'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      activeNames: ["basicInfo", "gjxx"],
      getcategoryTree,
      stateEquEquipment,
      productForm: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        code: "",
        name: "",
        typeCode: 'maintenanceItem'
      },
      //搜素条件列表
      ProductTableSearchList: [
        { prop: "code", label: "工具编码", type: 'input' },
        { prop: "name", label: "工具名称", type: 'input' }
      ],
      ProductListRequestObj: {
        projectId: '',
        classAttribute: "tool",
        orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }],
        pageNum: 1,
        pageSize: 20,
        state: 'normal',
        deviceType: 'normal',
      },
      ProductTableItems: [
        { prop: 'code', label: '工具编码', fixed: 'left' },
        { prop: 'name', label: '工具名称', fixed: 'left' },
        { prop: 'specModel', label: '工具规格' },
        { prop: 'categoryName', label: '工具分类' },
      ],
      limit: 0,
      nextCalibrationTime: '',
      selectlist: [],
      tasklist: [],
      productVisible: false,
      cusProductData: [],
      salesList: [],
      dataFormTwo: {
        productData: [],
      },
      listLoading: false,
      total: 0,
      btnType: undefined,
      activeName: "orderInfo",
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        actualMaintenanceId: '',
        verificationAgency: '',
        verificationTaskId: '',
        departmentId: '',
        maintainerId: '',
        planMaintenanceDate: '',
        actualMaintenanceDate: '',
        actualDepartmentId: '',
        actualDepartmentIdText: '',
        remark: ''
      },
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 1000 * 3600 * 24;
      //   }
      // },
      organizeIdTrees: [],
      dataRule: {
        verificationAgency: [
          { required: true, message: '检定机构不能为空', trigger: 'change' }
        ],
        actualDepartmentId: [
          { required: true, message: '执行部门不能为空', trigger: 'change' }
        ],
        actualMaintenanceId: [
          { required: true, message: '执行人不能为空', trigger: 'change' }
        ],
        actualMaintenanceDate: [
          { required: true, message: `检定日期不能为空`, trigger: 'change' }
        ],
      },
      selectRows: []
    }
  },
  watch: {
    'dataForm.actualMaintenanceId'(newValue) {
      if (this.isProjectSwitch === '1') {
        this.dataFormTwo.productData = []
        let _data = this.salesList.filter(item => item.id == newValue)[0]
        this.ProductListRequestObj.projectId = _data.projectId ? _data.projectId || '' : ''
      }
    }
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
  },
  methods: {
    //保养时间
    // nextMaintenanceTimeaction(value) {
    //   console.log(value);
    //   this.dataForm.actualMaintenanceDate = this.dateFormat(value) 
    // },
    //  打开工具
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
            spec: item.all.specModel,
            equipmentIdCode: item.all.code,
            projectName: item.all.projectName,
            equipmentIdName: item.name,
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
    //周期
    cycleaction(value) {
      if (value) {
        const end = new Date(Date.parse(value))
        if (this.tasklist.unit == '天') {
          end.setDate(end.getDate() + this.tasklist.cycle * 1);
          end.setTime(end.getTime())
          this.nextCalibrationTime = this.dateFormat(end)
        } else if (this.tasklist.unit == '周') {
          end.setDate(end.getDate() + this.tasklist.cycle * 7);
          end.setTime(end.getTime())
          this.nextCalibrationTime = this.dateFormat(end)
        } else if (this.tasklist.unit == '月') {
          end.setMonth(end.getMonth() + this.tasklist.cycle * 1);
          end.setTime(end.getTime())
          this.nextCalibrationTime = this.dateFormat(end)
        } else if (this.tasklist.unit == '季') {
          end.setMonth(end.getMonth() + this.tasklist.cycle * 3);
          end.setTime(end.getTime())
          this.nextCalibrationTime = this.dateFormat(end)
        } else if (this.tasklist.unit == '年') {
          end.setFullYear(end.getFullYear() + 1 * this.tasklist.cycle);
          end.setTime(end.getTime())
          this.nextCalibrationTime = this.dateFormat(end)
        } else {
          this.nextCalibrationTime = ''
        }
      } else {
        this.nextCalibrationTime = ''
      }
    },
    //保养人
    selectsales(val) {
      this.dataForm.actualMaintenanceId = val
    },
    //保养部门
    changedepartment(val) {
      console.log("val,val", val);
      this.dataForm.actualDepartmentIdText = ""
      this.dataForm.actualDepartmentId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.actualDepartmentId = ''
      this.dataForm.actualDepartmentId = val[val.length - 1]
      this.$nextTick(() => { this.$refs['dataForm'].validateField('actualDepartmentId') })
      getOrganization({ keyword: "", organizeId: this.dataForm.actualDepartmentId }).then(res => {
        console.log("用户", res);
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data

      })
    },
    dateFormat(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      // var h = date.getHours()
      // h = h < 10 ? ('0' + h) : h
      // var min = date.getMinutes()
      // min = min < 10 ? ('0' + min) : min
      // var s = date.getSeconds()
      // s = s < 10 ? ('0' + s) : s
      const time = y + '-' + m + '-' + d
      return time
    },
    //限制保养时间
    limittime(times) {
      // var date = Date.parse(times) 
      const end = new Date(Date.parse(times))
      // var year = date.getFullYear()
      // var month = date.getMonth() + 1
      // var day = date.getDate()
      if (this.tasklist.unit == '天') {
        end.setDate(end.getDate() - this.tasklist.cycle * 1);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
        // date = date - this.tasklist.cycle * 1 * 1000 * 3600 * 24
        // this.limit = date + 1000 * 3600 * 24
      } else if (this.tasklist.unit == '周') {
        end.setDate(end.getDate() - this.tasklist.cycle * 7);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
        // date = date - this.tasklist.cycle * 7 * 1000 * 3600 * 24
        // this.limit = date + 1000 * 3600 * 24
      } else if (this.tasklist.unit == '月') {
        end.setMonth(end.getMonth() - this.tasklist.cycle * 1);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
        // month = month - this.tasklist.cycle * 1
        // this.limit = Date.parse(time) + 1000 * 3600 * 24
      } else if (this.tasklist.unit == '季') {
        end.setMonth(end.getMonth() - this.tasklist.cycle * 3);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
        // month = month - this.tasklist.cycle * 3
        // this.limit = Date.parse(time) + 1000 * 3600 * 24
      } else if (this.tasklist.unit == '年') {
        end.setFullYear(end.getFullYear() - 1 * this.tasklist.cycle);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
        // year = year - this.tasklist.cycle * 1
        // this.limit = Date.parse(time) + 1000 * 3600 * 24
      } else {
        this.limit = 0
      }
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
      if (this.dataForm.id && btnType !== 'maintenance') {
        detailVerificationrecords(this.dataForm.id).then(res => {
          console.log(res, '检定记录明细');
          this.dataForm = res.data.verification
          this.dataFormTwo.productData = res.data.lines
          this.$nextTick(() => {
            if (this.dataForm.actualDepartmentId) {
              getOrganizeInfo(this.dataForm.actualDepartmentId).then(sss => {
                this.organizeIdTrees = sss.data.organizeIdTree || []
                this.organizeIdTrees.push(this.dataForm.actualDepartmentId)
              })
              getOrganization({ keyword: "", organizeId: this.dataForm.actualDepartmentId }).then(res => {
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
      if (this.dataForm.id && btnType == 'maintenance') {
        detailverification(id).then((res) => {
          console.log(res, '检定明细');
          this.tasklist = res.data.task
          this.dataForm.verificationTaskId = id
          this.dataForm.verificationAgency = res.data.task.verificationAgency
          this.dataForm.departmentId = res.data.task.departmentId
          this.dataForm.maintainerId = res.data.task.maintainerId
          this.dataForm.planMaintenanceDate = res.data.task.nextCalibrationTime
          res.data.lines.forEach((item) => {
            this.dataFormTwo.productData.push(item)
          })
          this.limittime(res.data.task.nextCalibrationTime)
        })
      }
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataFormTwo.productData.length) {
            this.$message({
              message: '请添加项目',
              type: 'error',
              duration: 1500,
            })
            return
          }
          this.dataForm.documentStatus = value
          let obj = {
            verification: this.dataForm,
            lines: this.dataFormTwo.productData
          }
          let _data = {
            dto: {
              verification: this.dataForm,
              lines: this.dataFormTwo.productData
            },
            id: this.dataForm.id,
            nextMaintenanceTime: this.nextCalibrationTime
          }
          this.btnLoading = true
          if (this.btnType == 'maintenance') {
            equcemainterecords(_data).then((res) => {
              this.$message({
                message: '检定成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.btnLoading = false
                  this.$emit('close', true)
                }
              })
            }).catch((err) => {
              this.btnLoading = false
            })
          } else {
            addVerificationrecords(obj).then(res => {
              this.$message({
                message: '新建成功',
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