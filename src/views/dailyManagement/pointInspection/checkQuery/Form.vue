<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建点检任务' : btnType == 'edit' ? '编辑点检任务' : '查看点检任务'" />
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
                      <el-form-item label="设备名称" prop="equipmentId">
                        <el-input v-model="dataForm.equipmentIdName" placeholder="请选择设备名称" readonly @focus="openSeleceProductDialogss" :disabled="btnType !== 'add'">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="计划点检部门" prop="departmentId">
                        <ComSelect v-model="organizeIdTrees" :disabled="btnType === 'look'" placeholder="请选择计划点检部门" auth :dialogTitle="'请选择计划点检部门'" @change="changedepartment" :currOrgId="dataForm.departmentId || '0'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="计划点检人" prop="maintainerId">
                        <el-select v-model="dataForm.maintainerIdName" placeholder="请选择计划点检人" clearable style="width: 100%;" :disabled="btnType === 'look'" filterable @change="selectsales">
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
                    <el-col :sm="6" :xs="24" v-if="dataForm.cycleType == 'cycle'" key="1">
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
                      <el-form-item label="下次点检时间" prop="nextMaintenanceTime">
                        <el-date-picker v-model="dataForm.nextMaintenanceTime" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择下次点检时间" :picker-options="pickerOptions" :disabled="btnType == 'look'">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="状态" prop="state">
                        <!-- <el-input v-model="dataForm.state" placeholder="请选择状态" :disabled="btnType == 'look'" maxlength="50" /> -->
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
              <el-collapse-item title="项目信息" name="xmxx">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择项目</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" fixedNO @selection-change="handeleProductInfoData">
                    <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                    <el-table-column prop="itemCode" label="项目编码" width="200" show-overflow-tooltip>
                      <template slot="header">
                        <span class="required">*</span>项目编码
                      </template>
                    </el-table-column>
                    <el-table-column prop="itemName" label="项目名称" width="200" show-overflow-tooltip>
                      <template slot="header">
                        <span class="required">*</span>项目名称
                      </template>
                    </el-table-column>
                    <el-table-column prop="itemRequirements" label="点检要求" min-width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="inspectionMethod" label="点检方法" min-width="200" show-overflow-tooltip>
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
                <el-table-column prop="name" label="项目名称" />
                <el-table-column prop="code" label="项目编码" show-overflow-tooltip></el-table-column>
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
import { getcategoryTree, getequMaintenanceLevel } from '@/api/basicData/materialSettings'
import { addcheckmaintenance, updatecheckmaintenance, detailcheckmaintenance } from '@/api/dailyManagement/Maintenance'
import { parametersShelveslist } from '@/api/basicData/index'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getEquEquipmentList } from '@/api/basicData/index'
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import { getOrganization } from '@/api/permission/user'
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  data() {
    return {
      activeNames: ["basicInfo", "xmxx"],
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
      getcategoryTree,
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
      selectlist: [],
      productVisible: false,
      cusProductData: [],
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
      provinces: [],
      getEquEquipmentList,
      getDepartmentSelectorByAuth,
      ordersLineId: '',
      isproductDrawingNo: false,
      code: '',
      iszt: false,
      iszhi: false,
      dataFormTwo: {
        productData: [],
      },
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      },
      btnType: undefined,
      activeName: "orderInfo",
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        nextMaintenanceTime: '',
        maintenanceLevelId: '',
        state: '',
        unit: '',
        cycle: '',
        cycleType: '',
        maintainerIdName: '',
        maintainerId: '',
        equipmentIdName: '',
        equipmentId: '',
        departmentId: '',
        departmentIdName: '',
        taskType: 'inspection',
        name: '',
        remark: ''
      },
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
        equipmentId: [
          { required: true, message: '设备不能为空', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '计划点检部门不能为空', trigger: 'change' }
        ],
        maintainerId: [
          { required: true, message: '计划点检人不能为空', trigger: 'change' }
        ],
        nextMaintenanceTime: [
          { required: true, message: '下次点检时间不能为空', trigger: 'change' }
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
    openSeleceProductDialogss() {
      this.$refs['ComSelect-pagesb'].openDialog()
    },
    //表格某一行被点击
    rowaction(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    //计划点检时间
    // planMaintenanceTimeaction(value) {
    //   this.dataForm.planMaintenanceTime = value
    //   this.dataForm.nextMaintenanceTime = value
    // },
    //下次点检时间
    // nextMaintenanceTimeaction(value) {
    //   console.log(value);
    //   this.dataForm.nextMaintenanceTime = this.dateFormat(value)
    //   this.dataForm.planMaintenanceTime = this.dateFormat(value)
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
      console.log("选中的项目", this.selectlist);
      this.selectlist.map(item => {
        this.dataFormTwo.productData.map((item1) => {
          if (item.code == item1.itemCode) {
            item.isrepeat = true
          }
        })
      });
      this.selectlist.map(item => {
        if (!item.isrepeat) {
          this.dataFormTwo.productData.push({
            itemName: item.name,
            itemCode: item.code,
            itemRequirements: item.itemRequirements,
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
    },
    //周期
    // cycleaction(value) {
    //   console.log(value);
    //   if (value > 0 && Number.isInteger(value * 1)) {
    //     if (this.dataForm.unit == '天') {
    //       const end = new Date();//获取当前的日期
    //       end.setDate(end.getDate() + value * 1);
    //       end.setTime(end.getTime())
    //       //计算，将当期日期-1天
    //       //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (this.dataForm.unit == '周') {
    //       const end = new Date();
    //       end.setDate(end.getDate() + value * 7);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (this.dataForm.unit == '月') {
    //       const end = new Date();
    //       end.setMonth(end.getMonth() + value * 1);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (this.dataForm.unit == '季') {
    //       const end = new Date();
    //       end.setMonth(end.getMonth() + value * 3);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (this.dataForm.unit == '年') {
    //       const end = new Date();
    //       // end.setMonth(end.getMonth() + value*3);
    //       end.setFullYear(end.getFullYear() + 1 * value);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else {
    //       this.dataForm.nextMaintenanceTime = ''
    //     }
    //   } else {
    //     this.dataForm.nextMaintenanceTime = ''
    //   }
    // },
    // //单位
    // unitaction(value) {
    //   console.log(value, '单位');
    //   if (this.dataForm.cycle > 0 && Number.isInteger(this.dataForm.cycle * 1)) {
    //     if (value == '天') {
    //       const end = new Date();//获取当前的日期
    //       end.setDate(end.getDate() + this.dataForm.cycle * 1);
    //       end.setTime(end.getTime())
    //       //计算，将当期日期-1天
    //       //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (value == '周') {
    //       const end = new Date();
    //       end.setDate(end.getDate() + this.dataForm.cycle * 7);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (value == '月') {
    //       const end = new Date();
    //       end.setMonth(end.getMonth() + this.dataForm.cycle * 1);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (value == '季') {
    //       const end = new Date();
    //       end.setMonth(end.getMonth() + this.dataForm.cycle * 3);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     } else if (value == '年') {
    //       const end = new Date();
    //       // end.setMonth(end.getMonth() + this.dataForm.cycle*3);
    //       end.setFullYear(end.getFullYear() + 1 * this.dataForm.cycle);
    //       end.setTime(end.getTime())
    //       this.dataForm.nextMaintenanceTime = this.dateFormat(end)
    //     }
    //   } else {
    //     this.dataForm.nextMaintenanceTime = ''
    //   }

    // },
    //计划点检人
    selectsales(val) {
      console.log(val);
      this.dataForm.maintainerId = val
    },
    //计划点检部门
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
    //选择设备
    changeWarehouse(val, data) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('equipmentId')
      })
      if (!val && !data.length) return
      console.log(data, '设备数据');
      this.dataForm.equipmentIdName = data[0].name
      this.dataForm.equipmentId = data[0].id
    },
    dateFormat(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var min = date.getMinutes()
      min = min < 10 ? ('0' + min) : min
      // var s = date.getSeconds()
      // s = s < 10 ? ('0' + s) : s
      const time = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + '00'
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
      console.log("1234", data);
      this.dataFormTwo.productData.splice(data.$index, 1)
    },

    // 监听主数量输入
    watchnums(row, index) {
      console.log("主数量", row, index);
      if (!row.receivedQuantity) {
        return
      }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '');

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = '';
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1);
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i];
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char;
              dotCount++;
            }
          } else {
            result += char;
          }
        }
        row.receivedQuantity = result;
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
        console.log(999666, arr);
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8);
        }
      }
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      if (!row.deliveryQuantity) {
        return
      }
      row.deliveryQuantity = row.deliveryQuantity.replace(/[^0-9.]/g, '');

      if (row.deliveryQuantity.length == 1 && row.deliveryQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.deliveryQuantity = '';
      } else if (row.deliveryQuantity.length == 2 && row.deliveryQuantity[0] == '0' && row.deliveryQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.deliveryQuantity = row.deliveryQuantity.slice(0, 1) + '.' + row.deliveryQuantity.slice(1);
      } else if (row.deliveryQuantity.length > 2 && row.deliveryQuantity[0] == '0' && row.deliveryQuantity[1] != '.') {
        row.deliveryQuantity = row.deliveryQuantity.substring(1, row.deliveryQuantity.length)
      }
      if (row.deliveryQuantity.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.deliveryQuantity.length; i++) {
          const char = row.deliveryQuantity[i];
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char;
              dotCount++;
            }
          } else {
            result += char;
          }
        }
        row.deliveryQuantity = result;
        let arr = row.deliveryQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.deliveryQuantity = arr[0] + '.' + arr[1]
        console.log(999666, arr);
      } else {
        if (row.deliveryQuantity.length > 8) {
          row.deliveryQuantity = row.deliveryQuantity.substring(0, 8);
        }
      }

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
      if (this.btnType == 'add') {
        this.dataForm.state = 'enable'
      }
      if (this.dataForm.id) {
        detailcheckmaintenance(this.dataForm.id).then(res => {
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
              this.salesFlag = true
            }
          })
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
            task: this.dataForm,
            lines: this.dataFormTwo.productData
          }
          this.btnLoading = true
          let formMethod = null;
          if (this.btnType == 'edit') {
            formMethod = updatecheckmaintenance
          } else if (this.btnType == 'add' || this.btnType == 'copy') {
            formMethod = addcheckmaintenance
          }
          formMethod(obj).then(res => {
            console.log(res);
            let msg = "";
            if (formMethod == addcheckmaintenance) {
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
    