<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建维修任务' : btnType == 'edit' ? '编辑维修任务' : btnType == 'start' ? '开始维修' : btnType == 'end' ? '完成维修' : '查看维修任务'" />
        <div class="options" v-if="btnType != 'look'">
          <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button> -->
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <!-- <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            {{ $t('common.submitButton') }}
          </el-button> -->
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
                    <el-col :sm="6" :xs="24" v-if="btnType == 'start' || btnType == 'end' || (dataForm.state == 'maintaining' && btnType == 'look') || (dataForm.state == 'maintained' && btnType == 'look')" key="3">
                      <el-form-item label="维修人" prop="maintenancePersonnel">
                        <user-select v-model="dataForm.maintenancePersonnel" placeholder="请选择维修人" clearable style="width: 100%;" :disabled="btnType == 'look' || btnType == 'end'" @change="hangleSelectSales">
                        </user-select>
                        <!-- <el-input v-model="dataForm.maintenancePersonnel" placeholder="请输入维修人" :disabled="btnType == 'look'"
                      maxlength="50" /> -->
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'start' || btnType == 'end' || (dataForm.state == 'maintaining' && btnType == 'look') || (dataForm.state == 'maintained' && btnType == 'look')" key="4">
                      <el-form-item label="开始维修时间" prop="startMaintenanceTime">
                        <el-date-picker v-model="dataForm.startMaintenanceTime" type="datetime" placeholder="请选择开始维修时间" :disabled="btnType == 'look' || btnType == 'end'" style="width: 100%;" clearable @change="nextMaintenanceTimeactionwei" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < timefaultStartTime - 1000 * 3599 * 24;
                        }
                      }">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="工具名称" prop="equipmentId">
                        <el-input v-model="dataForm.equipmentIdName" placeholder="请选择工具名称" readonly @focus="openSeleceProductDialogss" :disabled="btnType !== 'add'">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'end' || (dataForm.state == 'maintained' && btnType == 'look')" key="5">
                      <el-form-item label="维修完成时间" prop="repairCompletionTime">
                        <el-date-picker v-model="dataForm.repairCompletionTime" type="datetime" placeholder="请选择维修完成时间" :disabled="btnType == 'look'" style="width: 100%;" clearable @change="nextMaintenanceTimeactionwan" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < times - 1000 * 3599 * 24;
                        }
                      }">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="申请部门" prop="departmentId">
                        <ComSelect v-model="organizeIdTrees" :disabled="btnType === 'look' || btnType == 'start' || btnType == 'end'" placeholder="请选择申请部门" auth :dialogTitle="'请选择申请部门'" @change="changedepartment" :currOrgId="dataForm.departmentId || '0'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="申请人" prop="applicantId">
                        <el-select v-model="dataForm.applicantIdName" placeholder="请选择申请人" clearable style="width: 100%;" :disabled="btnType === 'look' || btnType == 'start' || btnType == 'end'" filterable @change="selectsales">
                          <el-option v-for="( item, index ) in  salesList " :key="index" :label="item.name" :disabled="btnType == 'look'" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="申请时间" prop="applicationDate">
                        <el-date-picker v-model="dataForm.applicationDate" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择申请时间" :disabled="btnType == 'look' || btnType == 'start' || btnType == 'end'">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="故障开始时间" prop="faultStartTime">
                        <el-date-picker v-model="dataForm.faultStartTime" type="datetime" placeholder="请选择故障开始时间" :disabled="btnType == 'look' || btnType == 'start' || btnType == 'end'" style="width: 100%;" @change="nextMaintenanceTimeaction" :picker-options="pickerOptions">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="状态" prop="state">
                        <el-select v-model="dataForm.state" placeholder="请选择状态" clearable style="width: 100%;" :disabled="btnType == 'look'">
                          <el-option v-for="(item, index) in stateList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24" v-if="btnType == 'end' || (dataForm.state == 'maintained' && btnType == 'look')" key="6">
                      <el-form-item label="解决措施" prop="solutionMeasures">
                        <el-input v-model="dataForm.solutionMeasures" placeholder="请输入解决措施" :disabled="btnType == 'look'" type="textarea" maxlength="200" :rows="2" />
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
              <el-collapse-item title="故障信息" name="gzxx">
                <div v-if="btnType == 'edit' || btnType == 'add'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择故障类型</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" @selection-change="handeleProductInfoData">
                    <el-table-column type="selection" width="60" v-if="btnType == 'edit' || btnType == 'add'" key="1" align="center" />
                    <el-table-column type="index" width="60" label="序号" align="center" />
                    <el-table-column prop="faultTypeCode" label="故障类型编码" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="faultTypeName" label="故障类型名称" width="200" show-overflow-tooltip>
                      <template slot="header">
                        <span class="required">*</span>故障类型名称
                      </template>
                    </el-table-column>
                    <el-table-column prop="faultLocationName" label="故障部位名称" width="200">
                      <template slot="header">
                        <span class="required">*</span>故障部位名称
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'faultLocationName'" :rules='productRules.faultLocationName'>
                          <el-input v-model="scope.row.faultLocationName" placeholder="请选择故障部位名称" readonly @focus="openSeleceProductDialogs(scope.$index)" :disabled="btnType == 'look' || btnType == 'start' || btnType == 'end'">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="faultLocationCode" label="故障部位编码" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="faultDescription" label="故障描述" min-width="230">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.faultDescription" placeholder="请输入故障描述" :disabled="btnType == 'look' ? true : false" maxlength="200" />
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
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="更换零部件信息" name="replacecomponents" v-if="btnType == 'look' || btnType == 'end'" key="36">
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>零部件信息</h5>
            </div>
            <div v-if="btnType !== 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="addtable()">添加零部件</el-button>|
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDeleteling">批量删除</el-button>|
            </div>
            <el-form :model="dataForms" v-bind="dataForms" ref="productForms" class="data-form">
              <el-table ref="product" :data="dataForms.lines" @selection-change="handeleProductInfoDataling">
                <el-table-column type="selection" width="60" align="center" v-if="btnType !== 'look'" key="22" />
                <!-- <el-table-column type="selection" width="60" fixed='left' align="center" key="10" v-if="btnType !== 'look'"/> -->
                <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                <!-- <el-table-column prop="salesQuotationId" label="报价名称" width="175" v-if="btnType == 'look'"
                key="salesQuotationId">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.salesQuotationId" placeholder="请输入报价名称" :disabled="status" maxlength="200"
                    style="width: 145px;" />
                </template>
              </el-table-column> -->
                <el-table-column prop="partName" label="零部件名称" min-width="200">
                  <template slot="header">
                    <span class="required">*</span>零部件名称
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'partName'" :rules='productRulesling.partName'>
                      <el-input v-model="scope.row.partName" placeholder="请输入零部件名称" :disabled="btnType == 'look'" maxlength="100" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="num" label="数量" width="180">
                  <template slot="header">
                    <span class="required">*</span>数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'num'" :rules='productRulesling.num'>
                      <el-input :title="scope.row.num" v-model="scope.row.num" placeholder="请输入数量" :disabled="btnType == 'look'" maxlength="11" @input="watchnums(scope.row, scope.$index)" style="width: 100%;" oninput="value=value.replace(/[^0-9.]/g,'')">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="140">
                  <template slot="header">
                    <span class="required">*</span>单位
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'mainUnit'" :rules='productRulesling.mainUnit'>
                      <el-input v-model="scope.row.mainUnit" placeholder="请输入单位" :disabled="btnType == 'look'" maxlength="20" style="width: 115px;" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="remark" label="备注" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btnType !== 'look'"
                      maxlength="200" />
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="120" v-if="btnType !== 'look'" key="11">
                  <template slot-scope="scope">
                    <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-page ref="ComSelect-pages" @change="submitfaultLocationName" :tableItems="faultLocationNameItems" title="故障部位" placeholder="请选择故障部位名称" :renderTree="false" :listMethod="parametersShelveslist" :paramsObj="{ index }" :listRequestObj="faultLocationNameRequestObj" :searchList="ProductfaultLocationName" :elementShow="false" />
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="故障类型" placeholder="请选择故障类型名称" :renderTree="false" :listMethod="parametersShelveslist" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
      <ComSelect-page ref="ComSelect-pagesb" @change="changeWarehouse" :tableItems="ProductTableItemss" title="选择工具" treeTitle="工具分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'tool' } }" :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObjs" :searchList="ProductTableSearchLists" :elementShow="false" />
    </div>
  </transition>
</template>
    
<script>
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { addRepairRequest, updateRepairRequest, detailRepairRequest } from '@/api/dailyManagement/Maintenance'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getEquEquipmentList, parametersShelveslist } from '@/api/basicData/index'
import { getOrganization } from '@/api/permission/user'
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  data() {
    return {
      activeNames: ["basicInfo", "gzxx"],
      datafilelist: [],
      getcategoryTree,
      ProductTableSearchLists: [
        { prop: "code", label: "工具编码", type: 'input' },
        { prop: "name", label: "工具名称", type: 'input' },
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
        classAttribute: "tool",
      },
      ProductTableItemss: [
        { prop: 'code', label: '工具编码', fixed: 'left' },
        { prop: 'name', label: '工具名称', fixed: 'left' },
        { prop: 'categoryName', label: '工具分类' },
        { prop: 'specModel', label: '工具规格' },
      ],
      stateList: [
        { label: "待维修", value: "toBeMaintain" },
        { label: "正在维修", value: "maintaining" },
        { label: "已维修", value: "maintained" }
      ],
      formLoading: false,
      productRulesling: {
        num: [{ required: true, trigger: 'blur' }, { validator: this.calcValidate(), trigger: 'blur' }],
        partName: [{ required: true, trigger: 'blur' }],
        mainUnit: [{ required: true, trigger: 'blur' }]
      },
      dataForms: {
        lines: []
      },
      selectRowsling: [],
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
        typeCode: "faultType"
      },
      timefaultStartTime: '',
      times: '',
      index: '',
      faultLocationNameRequestObj: {
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
        typeCode: "faultLocation"
      },
      ProductTableSearchList: [
        { prop: "code", label: "故障类型编码", type: 'input' },
        { prop: "name", label: "故障类型名称", type: 'input' },
      ],
      ProductTableItems: [
        { prop: 'code', label: '故障类型编码', fixed: 'left' },
        { prop: 'name', label: '故障类型名称', fixed: 'left' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'createByName', label: '创建人' },
      ],
      ProductfaultLocationName: [
        { prop: "code", label: "故障部位编码", type: 'input' },
        { prop: "name", label: "故障部位名称", type: 'input' },
      ],
      faultLocationNameItems: [
        { prop: 'code', label: '故障部位编码', fixed: 'left' },
        { prop: 'name', label: '故障部位名称', fixed: 'left' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'createByName', label: '创建人' },
      ],
      salesList: [],
      parametersShelveslist,
      getEquEquipmentList,
      dataFormTwo: {
        productData: [],
      },
      btnType: undefined,
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      dataForm: {
        maintenancePersonnel: '',
        startMaintenanceTime: '',
        repairCompletionTime: '',
        solutionMeasures: '',
        equipmentId: '',
        equipmentIdName: '',
        departmentId: '',
        departmentIdName: '',
        applicantId: '',
        applicantIdName: '',
        applicationDate: '',
        faultStartTime: '',
        remark: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      organizeIdTrees: [],
      productRules: {
        faultLocationName: [
          { required: true, trigger: 'blur' }
        ],
      },
      dataRule: {
        maintenancePersonnel: [
          { required: true, message: '维修人不能为空', trigger: 'change' }
        ],
        startMaintenanceTime: [
          { required: true, message: '开始维修时间不能为空', trigger: 'blur' }
        ],
        repairCompletionTime: [
          { required: true, message: '维修完成时间不能为空', trigger: 'blur' }
        ],
        solutionMeasures: [
          { required: true, message: '解决措施不能为空', trigger: 'blur' }
        ],
        equipmentId: [
          { required: true, message: '工具不能为空', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '申请部门不能为空', trigger: 'change' }
        ],
        applicantId: [
          { required: true, message: '申请人不能为空', trigger: 'change' }
        ],
        applicationDate: [
          { required: true, message: '申请时间不能为空', trigger: 'change' }
        ],
        faultStartTime: [
          { required: true, message: '故障开始时间不能为空', trigger: 'change' }
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
  methods: {
    //数量单价不能为0
    calcValidate() {
      return (rule, value, callback) => {
        if (value == 0) {
          this.$message.error('数量不能为"0"')
          callback(new Error('数量不能为"0"'));
        } else {
          callback()
        }
      };
    },
    // 监听主数量输入
    watchnums(row, index) {
      row.num = row.num.replace(/[^\d.]/g, '');

      if (row.num.length == 1 && row.num == '.') {
        // 如果第一位是小数点，则清空输入框
        row.num = '';
      } else if (row.num.length == 2 && row.num[0] == '0' && row.num[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.num = row.num.slice(0, 1) + '.' + row.num.slice(1);
      } else if (row.num.length > 2 && row.num[0] == '0' && row.num[1] != '.') {
        row.num = row.num.substring(1, row.num.length)
      }
      if (row.num.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.num.length; i++) {
          const char = row.num[i];
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
        row.num = result;
        let arr = row.num.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.num = arr[0] + '.' + arr[1]
      } else {
        if (row.num.length > 8) {
          row.num = row.num.substring(0, 8);
        }
      }
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
      this.dataForms.lines.push({
        businessId: '',
        businessType: 'repair',
        id: "",
        mainUnit: "",
        num: "",
        partName: ""
      })
    },
    //零部件选中
    handeleProductInfoDataling(val) {
      this.selectRowsling = val
    },
    //维修人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('maintenancePersonnel')
      })
      this.dataForm.maintenancePersonnel = e
    },
    //故障部位选择
    submitfaultLocationName(selectedIds, selectedList, ind) {
      this.$nextTick(() => {
        this.$refs.productForm.validateField('productData.' + ind.index + '.' + 'faultLocationName')
      })
      this.$set(this.dataFormTwo.productData[ind.index], 'faultLocationName', selectedList[0].all.name)
      this.$set(this.dataFormTwo.productData[ind.index], 'faultLocationCode', selectedList[0].all.code)
    },
    //故障类型选择
    submitCustomerProduct(selectedIds, selectedList) {
      selectedList.map(item => {
        this.dataFormTwo.productData.map((item1) => {
          if (item.all.code == item1.faultTypeCode) {
            item.isrepeat = true
          }
        })
      });
      selectedList.map(item => {
        if (!item.isrepeat) {
          this.dataFormTwo.productData.push({
            faultTypeName: item.all.name,
            faultTypeCode: item.all.code,
            faultLocationName: '',
            faultLocationCode: '',
            faultDescription: '',
            equipmentRepairId: ''
          })
        } else {
          this.$message({
            message: "所选故障类型编码重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
    },
    //故障开始时间
    nextMaintenanceTimeaction(value) {
      this.dataForm.faultStartTime = this.dateFormat(value)
    },
    //维修完成时间
    nextMaintenanceTimeactionwan(value) {
      this.dataForm.repairCompletionTime = this.dateFormat(value)
    },
    //维修开始时间
    nextMaintenanceTimeactionwei(value) {
      this.dataForm.startMaintenanceTime = this.dateFormat(value)
    },
    // 打开故障部位
    openSeleceProductDialogs(index) {
      this.index = index
      this.$refs['ComSelect-pages'].openDialog()
    },
    // 打开故障类型
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    openSeleceProductDialogss() {
      this.$refs['ComSelect-pagesb'].openDialog()
    },
    //申请人
    selectsales(val) {
      console.log(val);
      this.dataForm.applicantId = val
    },
    //申请部门
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
    //选择工具
    changeWarehouse(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('equipmentId') })
      if (!val && !data.length) return
      if (data && data.length) {
        this.dataForm.equipmentId = data[0].id
        this.dataForm.equipmentIdName = data[0].name
      } else {
        this.dataForm.equipmentId = ''
        this.dataForm.equipmentIdName = ''
      }
    },
    //故障开始时间
    dateFormat(dateData) {
      if (!dateData) return
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
      var s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      const time = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s
      return time
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
    //申请时间
    dateFormattime(dateData) {
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      this.formLoading = true
      if (this.btnType == 'add') {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        this.dataForm.applicationDate = this.dateFormattime(end)
        this.dataForm.faultStartTime = this.dateFormat(end)
        this.formLoading = false
      }
      if (this.dataForm.id) {
        detailRepairRequest(this.dataForm.id).then(res => {
          this.dataForm = res.data.repair
          this.dataForms.lines = res.data.equLine
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
          if (this.btnType == 'start') {
            const end = new Date();//获取当前的日期
            end.setTime(end.getTime())
            this.dataForm.startMaintenanceTime = this.dateFormat(end)
            this.timefaultStartTime = Date.parse(res.data.repair.faultStartTime)
          }
          if (this.btnType == 'end') {
            this.times = Date.parse(res.data.repair.startMaintenanceTime)
            // this.times = new Date(res.data.repair.startMaintenanceTime).getTime()
          }
          this.formLoading = false
          this.$nextTick(() => {
            if (this.dataForm.departmentId) {
              this.formLoading = true
              let requestSuccessTotal = 0
              getOrganizeInfo(this.dataForm.departmentId).then(sss => {
                this.organizeIdTrees = sss.data.organizeIdTree || []
                this.organizeIdTrees.push(this.dataForm.departmentId)
                if (++requestSuccessTotal === 2) this.formLoading = false
              })
              getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
                if (res.data.length > 0) {
                  res.data.forEach(item => {
                    item.name = item.fullName.split('/')[0]
                  });
                }
                this.salesList = res.data
                if (++requestSuccessTotal === 2) this.formLoading = false
              })
            } else {
              this.salesFlag = true
            }
          })
        })
      }
    },
    async handleConfirm(value) {
      let submitFlag = false
      let valid_2
      let valid_1 = await this.$refs.dataForm.validate().catch(err => false)
      if (!valid_1) {
        this.activeName = "orderInfo",
          submitFlag = true
      }
      if (!this.dataFormTwo.productData.length) {
        submitFlag = true
        this.$message({
          message: '请添加故障类型',
          type: 'error',
          duration: 1500,
        })
      } else {
        this.dataFormTwo.productData.map((item, index) => {
          if (!item.faultLocationName) {
            this.activeName = "orderInfo",
              this.$message.error(`第${index + 1}行故障部位名称不能为空`)
            submitFlag = true
            return
          }
        })
        valid_2 = await this.$refs.productForm.validate().catch(err => false)
      }
      if (!valid_2) return submitFlag = true
      if (['look', 'end'].includes(this.btnType)) {
        let valid_3 = await this.$refs.productForms.validate().catch(err => false)
        if (!valid_3) {
          this.activeName = "replacecomponents",
            this.$message.error('更换零部件信息请填写完整')
          submitFlag = true
          return
        }
      }
      if (submitFlag) return submitFlag = false
      let fault = Date.parse(this.dataForm.faultStartTime)
      let start = Date.parse(this.dataForm.startMaintenanceTime)
      let end = Date.parse(this.dataForm.repairCompletionTime)
      if (this.btnType == 'start' && fault > start) return this.$message.error('开始维修时间不能小于故障开始时间')
      if (this.btnType == 'end' && start > end) return this.$message.error('维修完成时间不能小于开始维修时间')
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
        equLine: this.dataForms.lines,
        repair: this.dataForm,
        lines: this.dataFormTwo.productData
      }
      this.btnLoading = true
      let formMethod = null;
      if (this.btnType == 'edit' || this.btnType == 'start' || this.btnType == 'end') {
        formMethod = updateRepairRequest
      } else if (this.btnType == 'add') {
        formMethod = addRepairRequest
      }
      formMethod(obj).then(res => {
        let msg = "";
        if (formMethod == addRepairRequest) {
          msg = "新建成功"
        } else if (value == 'draft') {
          msg = "保存成功"
        } else if (value == 'submit') {
          msg = '提交成功'
        }
        this.$emit('close', true)
        this.$message({
          message: msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.btnLoading = false
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })
      // }
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
    