<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建点检记录' : btnType == 'edit' ? '编辑点检记录' : btnType == 'maintenance' ? '设备点检' : '查看点检记录'" />
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
          <el-collapse v-model="activeNames">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-collapse-item title="点检信息" name="basicInfo">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="点检日期" prop="actualMaintenanceDate">
                      <el-date-picker v-model="dataForm.actualMaintenanceDate" placeholder="请选择点检日期" type="date" :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;" @change="cycleaction" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < limit || time.getTime() > Date.now()
                        }
                      }">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="点检部门" prop="actualDepartmentId">
                      <ComSelect v-model="organizeIdTrees" :disabled="btnType === 'look'" placeholder="请选择点检部门" auth :dialogTitle="'请选择点检部门'" @change="changedepartment" :currOrgId="dataForm.actualDepartmentId || '0'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="点检人" prop="actualMaintenanceId">
                      <el-select v-model="dataForm.actualMaintenanceIdText" placeholder="请选择点检人" clearable style="width: 100%;" :disabled="btnType === 'look'" filterable @change="selectsales">
                        <el-option v-for="(item, index) in salesList" :key="index" :label="item.name" :disabled="btnType == 'look'" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="6" :xs="24">
                    <el-form-item label="点检结果" prop="inspectionResults">
                      <el-select v-model="dataForm.inspectionResults" placeholder="请选择点检结果" clearable style="width: 100%;" :disabled="btnType == 'look'">
                        <el-option v-for="(item, index) in inspectionResultsList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" type="textarea" maxlength="200" :rows="2" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="点检拍照" prop="picList">
                      <UploadImg v-model="dataForm.picList" :disabled="btnType == 'look'"></UploadImg>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="设备信息" name="sbInfo">
                <el-row :gutter="30">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="设备名称" prop="equipmentId">
                      <!-- <ComSelectListone :requestObj="{ classAttribute: 'equipment' }" :dialogTitle="'请选择设备'"
                      :disrequestobj="{ state: 'discard', classAttribute: 'equipment' }"
                      v-model="dataForm.equipmentIdName" :placeholder="'请选择设备名称'"
                      :isdisabled="btnType == 'look' || btnType == 'maintenance'" :method="editEquEquipmentAll"
                      @change="changeWarehouse"></ComSelectListone> -->
                      <el-input v-model="dataForm.equipmentIdName" placeholder="请选择设备名称" readonly @focus="openSeleceProductDialogss" :disabled="btnType !== 'add'">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="设备编码" prop="equipmentIdCode">
                      <el-input v-model="dataForm.equipmentIdCode" placeholder="请输入设备编码" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="使用车间" prop="factoryFloor">
                      <el-input v-model="dataForm.factoryFloor" placeholder="请输入使用车间" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="安装地点" prop="mountedPlaces">
                      <el-input v-model="dataForm.mountedPlaces" placeholder="请输入安装地点" :disabled="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="点检任务" name="byrw">
                <el-row :gutter="30">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="计划点检人" prop="maintainerIdName">
                      <el-input v-model="dataForm.maintainerIdName" placeholder="请输入计划点检人" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="计划点检时间" prop="nextMaintenanceTime">
                      <el-input v-model="dataForm.nextMaintenanceTime" placeholder="请输入计划点检时间" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="点检任务名称" prop="name">
                      <el-input v-model="dataForm.name" placeholder="请输入点检任务名称" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="周期类型" prop="cycleType">
                      <el-select v-model="dataForm.cycleType" placeholder="请选择周期类型" clearable style="width: 100%;" :disabled="true">
                        <el-option v-for="(item, index) in cycleTypeStateList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.cycleType == 'cycle'" key="3">
                    <el-form-item label="点检周期" prop="cycle">
                      <el-input v-model="dataForm.cycle" placeholder="请输入点检周期" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.cycleType == 'cycle'" key="1">
                    <el-form-item label="单位" prop="unit">
                      <el-input v-model="dataForm.unit" placeholder="请输入单位" :disabled="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-form>

            <el-collapse-item title="项目信息" name="xmxx">
              <div v-if="btnType == 'edit' || btnType == 'add'">
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择项目</el-button>|
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
              </div>
              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData">
                  <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType == 'edit' || btnType == 'add'" key="1" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                  <el-table-column prop="maintenanceItemCode" label="点检项目编码" width="200" show-overflow-tooltip>
                    <template slot="header">
                      <span class="required">*</span>点检项目编码
                    </template>
                  </el-table-column>
                  <el-table-column prop="maintenanceItemName" label="点检项目名称" width="200" show-overflow-tooltip>
                    <template slot="header">
                      <span class="required">*</span>点检项目名称
                    </template>
                  </el-table-column>
                  <el-table-column prop="maintenanceItemRequirement" label="点检项目要求" width="200" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="inspectionMethod" label="点检项目方法" width="200" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="description" label="说明" min-width="200">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.description" placeholder="请输入说明" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="faultDescription" label="是否完成" width="90">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.inspectionResult" true-label="finished" false-label="not_finished" :disabled="btnType == 'look'"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'edit' || btnType == 'add'" key="30">
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-tabs>
      </div>
      <el-dialog title="选择点检项目" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="productVisible = false">
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.name" placeholder="请输入项目名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.code" placeholder="请输入项目编码" clearable />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.productName" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col> -->
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchcusProduct()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetcusProduct()">{{ $t('common.reset')
                    }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="cusProductData" hasC @row-click="rowaction" ref="dataTable" @selection-change="handleSelectionChange">
                <el-table-column prop="code" label="项目编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="项目名称" />
                <el-table-column prop="itemRequirements" label="点检要求" />
                <el-table-column prop="inspectionMethod" label="点检方法" />
              </JNPF-table>
              <pagination :total="total" :page.sync="productForm.pageNum" :limit.sync="productForm.pageSize" @pagination="getcooperativeProduct" />
            </div>

          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="productVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitCustomerProduct()">
            确定</el-button>
        </span>
      </el-dialog>
      <ComSelect-page ref="ComSelect-pagesb" @change="changeWarehouse" :tableItems="ProductTableItemss" title="选择设备" treeTitle="设备分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'equipment' } }" :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObjs" :searchList="ProductTableSearchLists" :elementShow="false" />
    </div>
  </transition>
</template>
    
<script>
import UploadImg from "@/components/Generator/components/Upload/UploadImg.vue";
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { addequMaintenance, checkmaintenanceList, updateequMaintenance, detailequMaintenance, detailcheckmaintenance, equMaintenancemainte } from '@/api/dailyManagement/Maintenance'
import { parametersShelveslist } from '@/api/basicData/index'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getEquEquipmentList } from '@/api/basicData/index'
import { getOrganization } from '@/api/permission/user'
import { mapGetters } from 'vuex'
export default {
  components: { UploadImg },
  data() {
    return {
      inspectionResultsList: [
        { label: "正常", value: "normal" },
        { label: "异常", value: "abnormal" },
      ],
      cycleTypeStateList: [
        { label: "周期", value: "cycle" },
        { label: "一次", value: "disposable" },
      ],
      activeNames: ["basicInfo", 'byrw', 'sbInfo', "xmxx"],
      getcategoryTree,
      ProductTableSearchLists: [
        { prop: "code", label: "设备编码", type: 'input' },
        { prop: "name", label: "设备名称", type: 'input' },
      ],
      ProductListRequestObjs: {
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
      ProductTableItemss: [
        { prop: 'code', label: '设备编码', fixed: 'left' },
        { prop: 'name', label: '设备名称', fixed: 'left' },
        { prop: 'categoryName', label: '设备分类' },
        { prop: 'specModel', label: '设备规格' },
      ],
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
        typeCode: 'inspectionItem'
      },
      limit: 0,
      nextMaintenanceTime: '',
      selectlist: [],
      tasklist: [],
      productVisible: false,
      cusProductData: [],
      salesList: [],
      getEquEquipmentList,
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
        // inspectionResults: 'normal',
        pic: '',
        name: '',
        cycleType: '',
        cycle: '',
        unit: '',
        factoryFloor: '',
        mountedPlaces: '',
        equipmentIdCode: '',
        maintainerIdName: '',
        nextMaintenanceTime: '',
        maintenanceTaskId: '',
        departmentId: '',
        maintainerId: '',
        planMaintenanceDate: '',
        actualMaintenanceIdText: '',
        actualMaintenanceId: '',
        equipmentIdName: '',
        equipmentId: '',
        actualMaintenanceDate: '',
        actualDepartmentId: '',
        actualDepartmentIdText: '',
        recordType: 'inspection',
        remark: ''
      },

      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 1000 * 3600 * 24;
      //   }
      // },
      organizeIdTrees: [],
      dataRule: {
        // inspectionResults: [
        //   { required: true, message: '请选择点检结果', trigger: 'change' }
        // ],
        equipmentId: [
          { required: true, message: '设备不能为空', trigger: 'change' }
        ],
        actualDepartmentId: [
          { required: true, message: '点检部门不能为空', trigger: 'change' }
        ],
        actualMaintenanceId: [
          { required: true, message: '点检人不能为空', trigger: 'change' }
        ],
        actualMaintenanceDate: [
          { required: true, message: `点检日期不能为空`, trigger: 'change' }
        ],
      },
      selectRows: []
    }
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
    openSeleceProductDialogss() {
      this.$refs['ComSelect-pagesb'].openDialog()
    },
    //表格某一行被点击
    rowaction(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    //点检时间
    // nextMaintenanceTimeaction(value) {
    //   console.log(value);
    //   this.dataForm.actualMaintenanceDate = this.dateFormat(value) 
    // },
    // 打开点检项目
    openSeleceProductDialog() {
      this.productVisible = true
      this.getcooperativeProduct()
    },
    getcooperativeProduct() {
      this.listLoading = true
      parametersShelveslist(this.productForm).then(res => {
        this.cusProductData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 选中项目
    handleSelectionChange(e) {
      this.selectlist = e
    },
    //选择点检项目
    submitCustomerProduct() {
      this.productVisible = false
      this.selectlist.map(item => {
        this.dataFormTwo.productData.map((item1) => {
          if (item.code == item1.maintenanceItemCode) {
            item.isrepeat = true
          }
        })
      });
      this.selectlist.map(item => {
        if (!item.isrepeat) {
          this.dataFormTwo.productData.push({
            maintenanceItemName: item.name,
            maintenanceItemCode: item.code,
            maintenanceItemRequirement: item.itemRequirements,
            inspectionMethod: item.inspectionMethod,
            id: ''
          })
        } else {
          this.$message({
            message: "所选项目编码重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
      // this.selectlist.forEach(item => {
      //   this.dataFormTwo.productData.push({
      //     maintenanceItemName: item.name,
      //     maintenanceItemCode: item.code,
      //     maintenanceItemRequirement: item.itemRequirements,
      //     id: ''
      //   })
      // });
    },
    //周期
    cycleaction(value) {
      if (value) {
        const end = new Date(Date.parse(value))
        if (this.tasklist.unit == '天') {
          end.setDate(end.getDate() + this.tasklist.cycle * 1);
          end.setTime(end.getTime())
          this.nextMaintenanceTime = this.dateFormat(end)
        } else if (this.tasklist.unit == '周') {
          end.setDate(end.getDate() + this.tasklist.cycle * 7);
          end.setTime(end.getTime())
          this.nextMaintenanceTime = this.dateFormat(end)
        } else if (this.tasklist.unit == '月') {
          end.setMonth(end.getMonth() + this.tasklist.cycle * 1);
          end.setTime(end.getTime())
          this.nextMaintenanceTime = this.dateFormat(end)
        } else if (this.tasklist.unit == '季') {
          end.setMonth(end.getMonth() + this.tasklist.cycle * 3);
          end.setTime(end.getTime())
          this.nextMaintenanceTime = this.dateFormat(end)
        } else if (this.tasklist.unit == '年') {
          end.setFullYear(end.getFullYear() + 1 * this.tasklist.cycle);
          end.setTime(end.getTime())
          this.nextMaintenanceTime = this.dateFormat(end)
        } else {
          this.nextMaintenanceTime = ''
        }
      } else {
        this.nextMaintenanceTime = ''
      }
    },
    //点检人
    selectsales(val) {
      console.log(val);
      this.dataForm.actualMaintenanceId = val
    },
    //点检部门
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
    //限制点检时间
    limittime(times) {
      const end = new Date(Date.parse(times))
      if (this.tasklist.unit == '天') {
        end.setDate(end.getDate() - this.tasklist.cycle * 1);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
      } else if (this.tasklist.unit == '周') {
        end.setDate(end.getDate() - this.tasklist.cycle * 7);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
      } else if (this.tasklist.unit == '月') {
        end.setMonth(end.getMonth() - this.tasklist.cycle * 1);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
      } else if (this.tasklist.unit == '季') {
        end.setMonth(end.getMonth() - this.tasklist.cycle * 3);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
      } else if (this.tasklist.unit == '年') {
        end.setFullYear(end.getFullYear() - 1 * this.tasklist.cycle);
        end.setTime(end.getTime())
        this.limit = Date.parse(end)
      } else {
        this.limit = 0
      }
    },
    //选择设备
    changeWarehouse(val, data) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('equipmentId')
      })
      if (!val && !data.length) return
      this.dataForm.equipmentIdName = data[0].name
      this.dataForm.equipmentId = data[0].id
      this.dataForm.equipmentIdCode = data[0].all.code
      this.dataForm.factoryFloor = data[0].all.factoryFloor
      this.dataForm.mountedPlaces = data[0].all.mountedPlaces
      let a = {
        classAttribute: "equipment",
        equipmentIdCode: data[0].all.code,
        taskType: 'inspection',
        pageNum: 1,
        pageSize: 20,
      }
      checkmaintenanceList(a).then(res => {
        if (!res.data.records.length) return
        this.dataForm.maintainerIdName = res.data.records[0].maintainerIdName
        this.dataForm.nextMaintenanceTime = res.data.records[0].nextMaintenanceTime
        this.dataForm.name = res.data.records[0].name
        this.dataForm.cycleType = res.data.records[0].cycleType
        this.dataForm.cycle = res.data.records[0].cycle
        this.dataForm.unit = res.data.records[0].unit
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
    // 重置项目搜索条件
    resetcusProduct() {
      this.productForm = {
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
        typeCode: 'inspectionItem'
      }
      this.searchcusProduct()
    },
    // 搜索项目
    searchcusProduct() {
      this.productForm.pageNum = 1
      this.getcooperativeProduct()
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

    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },
    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (btnType !== 'maintenance') {
        if (this.dataForm.id) {
          detailequMaintenance(this.dataForm.id).then(res => {
            if (res.data.maintenance.pic && res.data.maintenance.picList.length) {
              res.data.maintenance.picList = res.data.maintenance.picList.map(item => {
                return JSON.parse(`{${item}}`)
              })
            } else {
              res.data.maintenance.picList = []
            }
            this.dataForm = res.data.maintenance
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
        } else {
          // this.dataForm.inspectionResults = 'normal'
          this.dataForm.actualMaintenanceId = this.userInfo.userId
          this.dataForm.actualMaintenanceIdText = this.userInfo.userName
          this.dataForm.actualMaintenanceDate = this.jnpf.getToday()
          this.organizeIdTrees.push(this.userInfo.organizeId)
          this.dataForm.actualDepartmentId = this.userInfo.organizeId
          getOrganization({ keyword: "", organizeId: this.userInfo.organizeId }).then(res => {
            if (res.data.length > 0) {
              res.data.forEach(item => {
                item.name = item.fullName.split('/')[0]
              });
            }
            this.salesList = res.data
          })
        }
      }
      if (this.dataForm.id && btnType == 'maintenance') {
        detailcheckmaintenance(id).then((res) => {
          this.tasklist = res.data.task
          this.dataForm = res.data.task
          this.dataForm.maintenanceTaskId = id
          this.dataForm.planMaintenanceDate = res.data.task.nextMaintenanceTime
          this.dataForm.actualMaintenanceId = this.userInfo.userId
          // this.dataForm.inspectionResults = 'normal'
          this.dataForm.actualMaintenanceIdText = this.userInfo.userName
          this.dataForm.actualMaintenanceDate = this.jnpf.getToday()
          this.cycleaction(this.dataForm.actualMaintenanceDate)
          this.organizeIdTrees.push(this.userInfo.organizeId)
          this.dataForm.actualDepartmentId = this.userInfo.organizeId
          getOrganization({ keyword: "", organizeId: this.userInfo.organizeId }).then(res => {
            if (res.data.length > 0) {
              res.data.forEach(item => {
                item.name = item.fullName.split('/')[0]
              });
            }
            this.salesList = res.data
          })
          res.data.lines.forEach((item) => {
            item.maintenanceItemName = item.itemName,
              item.maintenanceItemCode = item.itemCode,
              item.maintenanceItemRequirement = item.itemRequirements,
              this.dataFormTwo.productData.push(item)
          })
          this.limittime(res.data.task.nextMaintenanceTime)
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
          this.dataForm.recordType = 'inspection'
          this.dataForm.picList = Array.isArray(this.dataForm.picList) ?
            this.dataForm.picList.map(item => {
              return JSON.stringify(item)
                .replace("{", "")
                .replace("}", "")
            }) : []
          let obj = {
            maintenance: this.dataForm,
            lines: this.dataFormTwo.productData
          }
          let _data = {
            dto: {
              maintenance: this.dataForm,
              lines: this.dataFormTwo.productData,
            },
            id: this.dataForm.id,
            nextMaintenanceTime: this.nextMaintenanceTime,
          }
          this.btnLoading = true
          if (this.btnType == 'maintenance') {
            equMaintenancemainte(_data).then((res) => {
              this.$message({
                message: '点检成功',
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
            let formMethod = null;
            if (this.btnType == 'edit') {
              formMethod = updateequMaintenance
            } else if (this.btnType == 'add') {
              formMethod = addequMaintenance
            }
            formMethod(obj).then(res => {
              let msg = "";
              if (formMethod == addequMaintenance) {
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
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__header {
  margin-bottom: 15px !important;
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
    