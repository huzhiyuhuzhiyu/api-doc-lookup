<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建保养记录' : btnType == 'edit' ? '编辑保养记录' : btnType == 'maintenance' ? '工具保养' : '查看保养记录'" />
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

              <el-collapse-item title="工具信息" name="sbInfo">
                <el-row :gutter="30">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="工具名称" prop="equipmentId">
                      <!-- <ComSelectListone :requestObj="{ classAttribute: 'equipment' }" :dialogTitle="'请选择工具'"
                      :disrequestobj="{ state: 'discard', classAttribute: 'equipment' }"
                      v-model="dataForm.equipmentIdName" :placeholder="'请选择工具名称'"
                      :isdisabled="btnType === 'look' || btnType == 'maintenance'" :method="editEquEquipmentAll"
                      @change="changeWarehouse"></ComSelectListone> -->
                      <el-input v-model="dataForm.equipmentIdName" placeholder="请选择工具名称" readonly @focus="openSeleceProductDialogss" :disabled="btnType !== 'add'">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="工具编码" prop="equipmentIdCode">
                      <el-input v-model="dataForm.equipmentIdCode" placeholder="请输入工具编码" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="isProjectSwitch==='1'">
                    <el-form-item label="所属项目" prop="projectName">
                      <el-input v-model="dataForm.projectName" placeholder="请输入所属项目" maxlength="20" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="用途" prop="usin">
                      <el-input v-model="dataForm.usin" placeholder="请输入用途" :disabled="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="保养任务" name="byrw" v-if="btnType==='look'">
                <el-row :gutter="30">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="计划保养人" prop="maintainerIdText">
                      <el-input v-model="dataForm.maintainerIdText" placeholder="请输入计划保养人" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="计划保养时间" prop="planMaintenanceDate">
                      <el-input v-model="dataForm.planMaintenanceDate" placeholder="请输入计划保养时间" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="保养任务名称" prop="maintenanceTaskIdText">
                      <el-input v-model="dataForm.maintenanceTaskIdText" placeholder="请输入保养任务名称" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="周期类型" prop="cycleType">
                      <el-select v-model="dataForm.cycleType" placeholder="请选择周期类型" clearable style="width: 100%;" :disabled="true">
                        <el-option v-for="(item, index) in cycleTypeStateList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.cycleType == 'cycle'" key="2">
                    <el-form-item label="保养等级" prop="level">
                      <el-input v-model="dataForm.level" placeholder="请输入保养等级" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.cycleType == 'cycle'" key="3">
                    <el-form-item label="保养周期" prop="cycle">
                      <el-input v-model="dataForm.cycle" placeholder="请输入保养周期" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.cycleType == 'cycle'" key="1">
                    <el-form-item label="单位" prop="unit">
                      <el-input v-model="dataForm.unit" placeholder="请输入单位" :disabled="true" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="保养信息" name="basicInfo">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="保养日期" prop="actualMaintenanceDate">
                      <el-date-picker v-model="dataForm.actualMaintenanceDate" placeholder="请选择保养日期" type="date" :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;" @change="cycleaction" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < limit || time.getTime() > Date.now()
                        }
                      }">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="保养日期" prop="actualMaintenanceDate">
                    <el-date-picker v-model="dataForm.actualMaintenanceDate" type="datetime" placeholder="请选择保养日期"
                      :picker-options="pickerOptions" :disabled="btnType == 'look'" style="width: 100%;" clearable
                      @change="nextMaintenanceTimeaction">
                    </el-date-picker>
                  </el-form-item>
                </el-col> -->
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="保养部门" prop="actualDepartmentId">
                      <ComSelect v-model="organizeIdTrees" :disabled="btnType === 'look'" placeholder="请选择保养部门" auth :dialogTitle="'请选择保养部门'" @change="changedepartment" :currOrgId="dataForm.actualDepartmentId || '0'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="保养人" prop="actualMaintenanceId">
                      <el-select v-model="dataForm.actualMaintenanceIdText" placeholder="请选择保养人" clearable style="width: 100%;" :disabled="btnType === 'look'" filterable @change="selectsales">
                        <el-option v-for="(item, index) in salesList" :key="index" :label="item.name" :disabled="btnType == 'look'" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" type="textarea" maxlength="200" :rows="2" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="保养拍照" prop="picList">
                      <UploadImg v-model="dataForm.picList" :disabled="btnType == 'look'"></UploadImg>
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
                <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" @selection-change="handeleProductInfoData">
                  <el-table-column type="selection" width="60" align="center" v-if="btnType == 'edit' || btnType == 'add'" key="1" />
                  <el-table-column type="index" width="60" label="序号" align="center" />
                  <el-table-column prop="maintenanceItemCode" label="保养项目编码" width="200" show-overflow-tooltip>
                    <template slot="header">
                      <span class="required">*</span>保养项目编码
                    </template>
                  </el-table-column>
                  <el-table-column prop="maintenanceItemName" label="保养项目名称" width="200" show-overflow-tooltip>
                    <template slot="header">
                      <span class="required">*</span>保养项目名称
                    </template>
                  </el-table-column>
                  <el-table-column prop="maintenanceItemRequirement" label="保养项目要求" width="200" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="description" label="说明" min-width="300">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.description" placeholder="请输入说明" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="inspectionResult" label="是否完成" width="90">
                    <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.inspectionResult" true-label="finished" false-label="not_finished" :disabled="btnType == 'look'"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" v-if="btnType == 'edit' || btnType == 'add'" key="30">
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-collapse-item>
            <el-collapse-item title="更换零部件信息" name="ghlbjxx">
              <div v-if="btnType !== 'look'">
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="addtable()">添加零部件</el-button>|
                <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDeleteling">批量删除</el-button>|
              </div>
              <el-form :model="dataForms" v-bind="dataForms" ref="productForm" class="data-form">
                <el-table ref="product" :data="dataForms.lines" @selection-change="handeleProductInfoDataling">
                  <el-table-column type="selection" width="60" align="center" v-if="btnType !== 'look'" key="22" />
                  <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                  <el-table-column prop="partCode" label="备件编码" min-width="160" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="partName" label="备件名称" min-width="160" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="drawingNo" label="品名规格" min-width="160" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="mainUnit" label="单位" width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="num" label="数量" width="180">
                    <template slot="header">
                      <span class="required">*</span>数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'lines.' + scope.$index + '.' + 'num'" :rules='productRulesling.num'>
                        <el-input :title="scope.row.num" v-model="scope.row.num" placeholder="请输入数量" :disabled="btnType == 'look'" maxlength="11" style="width: 100%;">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" v-if="btnType !== 'look'" key="11">
                    <template slot-scope="scope">
                      <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-tabs>
      </div>
      <el-dialog title="选择保养项目" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="productVisible = false">
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchcusProduct()"  v-model="productForm.name" placeholder="请输入项目名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchcusProduct()"  v-model="productForm.code" placeholder="请输入项目编码" clearable />
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
              <JNPF-table v-loading="listLoading" :data="cusProductData" hasC @row-click="rowaction" ref="dataTable" @selection-change="handleSelectionChange" customKey="JNPFTableKey_444156">
                <el-table-column prop="name" label="项目名称" />
                <el-table-column prop="code" label="项目编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="itemRequirements" label="保养要求" />
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
      <ComSelect-page ref="ComSelect-pagesb" @change="changeWarehouse" :tableItems="ProductTableItemss" title="选择工具" treeTitle="工具分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'tool' } }" :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObjs" :searchList="ProductTableSearchLists" :elementShow="false" />
      <!-- 备件 -->
      <ComSelect-page ref="ComSelect-sparepart" @change="submitsparepart" :tableItems="sparepartItems" title="备件" placeholder="请选择备件" :renderTree="false" :listMethod="equRequisitionRecordsproducts" :listRequestObj="sparepartRequestObj" :searchList="[]" :elementShow="false" multiple />
    </div>
  </transition>
</template>
    
<script>
import UploadImg from "@/components/Generator/components/Upload/UploadImg.vue";
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { addequMaintenance, checkmaintenanceList, updateequMaintenance, detailequMaintenance, detailcheckmaintenance, equMaintenancemainte, equRequisitionRecordsproducts } from '@/api/dailyManagement/Maintenance'
import { parametersShelveslist } from '@/api/basicData/index'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getEquEquipmentList } from '@/api/basicData/index'
import { getOrganization } from '@/api/permission/user'
import { mapGetters } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],
  components: { UploadImg },
  data() {
    return {
      isProjectSwitch: '',
      sparepartRequestObj: {
        pageNum: 1,
        pageSize: 20,
        workNo: '',
      },
      equRequisitionRecordsproducts,
      sparepartItems: [
        { prop: 'productCode', label: '备件编码' },
        { prop: 'productName', label: '备件名称' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'requisitionNum', label: '领用数量' },
      ],
      cycleTypeStateList: [
        { label: "周期", value: "cycle" },
        { label: "一次", value: "disposable" },
      ],
      activeNames: ["basicInfo", 'byrw', 'sbInfo', "xmxx", 'ghlbjxx'],
      ProductTableSearchLists: [
        { prop: "code", label: "工具编码", type: 'input' },
        { prop: "name", label: "工具名称", type: 'input' },
      ],
      ProductListRequestObjs: {
        projectId: '',
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
        classAttribute: "tool",
      },
      getcategoryTree,
      ProductTableItemss: [
        { prop: 'code', label: '工具编码' },
        { prop: 'name', label: '工具名称' },
        { prop: 'categoryName', label: '工具分类' },
        { prop: 'specModel', label: '工具规格' },
      ],
      productRulesling: {
        num: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["数量不能为空", (errMsg, index) => { this.$message.error(`备件信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '数量必须大于0', (errMsg, index) => { this.$message.error(`备件信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ]
      },
      dataForms: {
        lines: []
      },
      selectRowsling: [],
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
        picList: '',
        maintenanceTaskIdText: '',
        level: '',
        cycle: '',
        unit: '',
        cycleType: '',
        usin: '',
        equipmentIdCode: '',
        maintainerIdText: '',
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
        recordType: 'maintenance',
        remark: ''
      },
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 1000 * 3600 * 24;
      //   }
      // },
      organizeIdTrees: [],
      dataRule: {
        equipmentId: [
          { required: true, message: '工具不能为空', trigger: 'change' }
        ],
        actualDepartmentId: [
          { required: true, message: '保养部门不能为空', trigger: 'change' }
        ],
        actualMaintenanceId: [
          { required: true, message: '保养人不能为空', trigger: 'blur' }
        ],
        actualMaintenanceDate: [
          { required: true, message: `保养日期不能为空`, trigger: 'blur' }
        ],
      },
      selectRows: []
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  watch: {
    'dataForm.actualMaintenanceId'(newValue) {
      if (this.isProjectSwitch === '1') {
        this.dataForm.equipmentIdName = ''
        this.dataForm.equipmentId = ''
        this.dataForm.equipmentIdCode = ''
        this.dataForm.usin = ''
        this.dataForm.projectName = ''
        let _data = this.salesList.filter(item => item.id == newValue)[0]
        this.ProductListRequestObjs.projectId = _data.projectId ? _data.projectId || '' : ''
      }
    }
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    //备件选择
    submitsparepart(selectedIds, selectedList) {
      selectedList.map(item => {
        this.dataForms.lines.map((item1) => {
          if (item.id == item1.productId) {
            item.isrepeat = true
          }
        })
      });
      selectedList.map(item => {
        if (!item.isrepeat) {
          this.dataForms.lines.push({
            partName: item.all.productName,
            partCode: item.all.productCode,
            drawingNo: item.all.drawingNo,
            mainUnit: item.all.mainUnit,
            productId: item.all.productId,
            num: '',
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
    openSeleceProductDialogss() {
      this.$refs['ComSelect-pagesb'].openDialog()
    },
    //零部件信息删除当前行
    deltable(row, index) {
      this.dataForms.lines.splice(row.$index, 1)
    },
    // 零部件批量删除
    batchDeleteling() {
      // 遍历选中的行的数据
      if (!this.selectRowsling.length) {
        this.$message({
          message: '请选择要删除的零部件',
          type: 'error',
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRowsling.length; i++) {
        const row = this.selectRowsling[i];
        const index = this.dataForms.lines.indexOf(row);
        if (index > -1) {
          this.dataForms.lines.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRowsling = []; // 清空选中的行的数据
    },
    //零部件信息新增行
    addtable() {
      this.sparepartRequestObj.workNo = this.dataForm.maintenanceTaskIdText
      this.$refs['ComSelect-sparepart'].openDialog()
    },
    //零部件选中
    handeleProductInfoDataling(val) {
      this.selectRowsling = val
    },
    //表格某一行被点击
    rowaction(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    //保养时间
    // nextMaintenanceTimeaction(value) {
    //   this.dataForm.actualMaintenanceDate = this.dateFormat(value) 
    // },
    // 打开保养项目
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
    //选择保养项目
    submitCustomerProduct() {
      this.selectlist.map(item => {
        this.productVisible = false
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
    //保养人
    selectsales(val) {
      this.dataForm.actualMaintenanceId = val
    },
    //保养部门
    changedepartment(val) {
      this.dataForm.actualDepartmentIdText = ""
      this.dataForm.actualDepartmentId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.actualDepartmentId = ''
      this.dataForm.actualDepartmentId = val[val.length - 1]
      this.$nextTick(() => { this.$refs['dataForm'].validateField('actualDepartmentId') })
      getOrganization({ keyword: "", organizeId: this.dataForm.actualDepartmentId }).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data

      })
    },
    //选择工具
    changeWarehouse(val, data) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('equipmentId')
      })
      if (!val && !data.length) return
      this.dataForm.equipmentIdName = data[0].name
      this.dataForm.equipmentId = data[0].id
      this.dataForm.equipmentIdCode = data[0].all.code
      this.dataForm.usin = data[0].all.usin
      this.dataForm.projectName = data[0].all.projectName
      let a = {
        classAttribute: "tool",
        equipmentIdCode: data[0].all.code,
        taskType: 'maintenance',
        pageNum: 1,
        pageSize: 20,
      }
      checkmaintenanceList(a).then(res => {
        if (!res.data.records.length) return
        this.dataForm.maintainerIdText = res.data.records[0].maintainerIdName
        this.dataForm.planMaintenanceDate = res.data.records[0].nextMaintenanceTime
        this.dataForm.maintenanceTaskIdText = res.data.records[0].name
        this.dataForm.cycleType = res.data.records[0].cycleType
        this.dataForm.level = res.data.records[0].level
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
    //限制保养时间
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
        typeCode: 'maintenanceItem'
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
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (btnType !== 'maintenance') {
        if (this.dataForm.id) {
          detailequMaintenance(this.dataForm.id).then(res => {
            this.dataForms.lines = res.data.equLine
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
                  this.salesList = res.data
                })
              } else {
                this.salesFlag = true
              }
            })
          })
        } else {
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
          this.dataForm.maintainerIdText = res.data.task.maintainerIdName
          this.dataForm.maintenanceTaskIdText = res.data.task.name
          this.dataForm.planMaintenanceDate = res.data.task.nextMaintenanceTime
          this.dataForm.actualMaintenanceId = this.userInfo.userId
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
            item.maintenanceItemName = item.itemName
            item.maintenanceItemCode = item.itemCode
            item.maintenanceItemRequirement = item.itemRequirements
            item.inspectionResult = 'not_finished'
            this.dataFormTwo.productData.push(item)
          })
          this.limittime(res.data.task.nextMaintenanceTime)
        })
      }
    },
    handleConfirm(value) {
      let isvallid = false
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          // this.activeName = "orderInfo",
          isvallid = true
          return
        }
        if (!this.dataFormTwo.productData.length) {
          isvallid = true
          // this.activeName = "orderInfo",
          this.$message({
            message: '请添加项目',
            type: 'error',
            duration: 1500,
          })
          return
        }
        this.$refs['productForm'].validate((valid) => {
          if (!valid) {
            isvallid = true
            // this.activeName = "replacecomponents",
            this.$message({
              message: '更换零部件信息请填写完整',
              type: 'error',
              duration: 1500,
            })
            return
          }
        })
      })
      if (isvallid) {
        isvallid = false
        return
      }
      this.dataForm.documentStatus = value
      this.dataForm.recordType = 'maintenance'
      this.dataForm.picList = Array.isArray(this.dataForm.picList) ?
        this.dataForm.picList.map(item => {
          return JSON.stringify(item)
            .replace("{", "")
            .replace("}", "")
        }) : []
      let obj = {
        equLine: this.dataForms.lines,
        maintenance: this.dataForm,
        lines: this.dataFormTwo.productData
      }
      let a = {
        id: this.dataForm.id,
        line: this.dataForms.lines,
        nextMaintenanceTime: this.nextMaintenanceTime
      }
      this.btnLoading = true
      let _data = {
        dto: {
          equLine: this.dataForms.lines,
          lines: this.dataFormTwo.productData,
          maintenance: this.dataForm,
        },
        id: this.dataForm.id,
        nextMaintenanceTime: this.nextMaintenanceTime
      }
      if (this.btnType == 'maintenance') {
        equMaintenancemainte(_data).then((res) => {
          this.$message({
            message: '保养成功',
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
    