<template>
  <div style="height:100%">
    <div class="JNPF-common-layout">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-preview-main org-form">
          <div :class="['JNPF-common-page-header']">
            <div class="pageTitle">设备报修</div>
            <div class="options">
              <el-button type="primary" size="mini" :loading="btnLoading" @click="handleConfirm('submit')">
                保存并提交</el-button>
              <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
            </div>
          </div>
          <div class="main">
            <el-tabs v-model="activeName">
              <el-tab-pane label="报修信息" name="orderInfo">
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="基本信息" name="basicInfo">
                    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                      <el-row :gutter="30" class="custom-row">
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="维修单号" prop="maintenanceNo">
                            <el-input v-model="dataForm.maintenanceNo" placeholder="请输入维修单号" :disabled="codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="设备名称" prop="equipmentId">
                            <el-input v-model="dataForm.equipmentIdName" placeholder="请选择设备名称" readonly @focus="openSeleceProductDialogss">
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" v-if="isProjectSwitch==='1'">
                          <el-form-item label="所属项目" prop="projectName">
                            <el-input v-model="dataForm.projectName" placeholder="请输入所属项目" maxlength="20" :disabled="true" />
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
                        <el-col :sm="6" :xs="24" v-if="!isApprovalwitch">
                          <el-form-item label="紧急程度" prop="degree">
                            <el-select v-model="dataForm.degree" placeholder="请选择紧急程度" clearable style="width: 100%;" :disabled="btnType == 'look'|| btnType == 'end'">
                              <el-option v-for="(item, index) in degreeList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="申请部门" prop="departmentId">
                            <ComSelect v-model="organizeIdTrees" placeholder="请选择申请部门" auth :dialogTitle="'请选择申请部门'" @change="changedepartment" :currOrgId="dataForm.departmentId || '0'" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="申请人" prop="applicantId">
                            <el-select v-model="dataForm.applicantIdName" placeholder="请选择申请人" clearable style="width: 100%;" filterable @change="selectsales">
                              <el-option v-for="( item, index ) in  salesList " :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="申请时间" prop="applicationDate">
                            <el-date-picker v-model="dataForm.applicationDate" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择申请时间">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="故障开始时间" prop="faultStartTime">
                            <el-date-picker v-model="dataForm.faultStartTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择故障开始时间" style="width: 100%;" :picker-options="pickerOptions">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="备注" prop="remark">
                            <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" maxlength="200" :rows="2" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="24" :xs="24">
                          <el-form-item label="故障情况照片" prop="frontPicList">
                            <UploadImg v-model="dataForm.frontPicList"></UploadImg>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </el-collapse-item>
                  <el-collapse-item title="故障信息" name="gzxx">
                    <div>
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus" @click="openSeleceProductDialog()">选择故障类型</el-button>|
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                    </div>
                    <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                      <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" @selection-change="handeleProductInfoData">
                        <el-table-column type="selection" width="60" key="1" align="center" />
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
                              <el-input v-model="scope.row.faultLocationName" placeholder="请选择故障部位名称" readonly @focus="openSeleceProductDialogs(scope.$index)">
                              </el-input>
                            </el-form-item>
                          </template>
                        </el-table-column>
                        <el-table-column prop="faultLocationCode" label="故障部位编码" width="200" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="faultDescription" label="故障描述" min-width="230">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.faultDescription" placeholder="请输入故障描述" maxlength="200" />
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120" key="30">
                          <template slot-scope="scope">
                            <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                <UploadWj v-model="datafilelist">
                </UploadWj>
              </el-tab-pane>
            </el-tabs>
          </div>
          <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
            <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
                {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="goBack">返回列表</el-button>
              <el-button type="primary" @click="continueAdd()"> 继续新增</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
    <ComSelect-page ref="ComSelect-pages" @change="submitfaultLocationName" :tableItems="faultLocationNameItems" title="故障部位" placeholder="请选择故障部位名称" :renderTree="false" :listMethod="parametersShelveslist" :paramsObj="{ index }" :listRequestObj="faultLocationNameRequestObj" :searchList="ProductfaultLocationName" :elementShow="false" />
    <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="故障类型" placeholder="请选择故障类型名称" :renderTree="false" :listMethod="parametersShelveslist" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
    <ComSelect-page ref="ComSelect-pagesb" @change="changeWarehouse" :tableItems="ProductTableItemss" title="选择设备" treeTitle="设备分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'equipment' } }" :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObjs" :searchList="ProductTableSearchLists" :elementShow="false" />
  </div>
</template>

<script>
import { getBimBusinessDetail } from '@/api/basicData/index'
import UploadImg from "@/components/Generator/components/Upload/UploadImg.vue";
import { addRepairRequest } from '@/api/dailyManagement/Maintenance'
import { getOrganization } from '@/api/permission/user'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { mapGetters } from 'vuex'
import { getEquEquipmentList, parametersShelveslist } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'equipmentrepairreport',
  mixins: [getProjectList],
  components: { UploadImg },
  data() {
    return {
      degreeList: [
        { label: '特别紧急', value: '1' },
        { label: '紧急', value: '2' },
        { label: '一般', value: '3' },
        { label: '不急', value: '4' }
      ],
      isProjectSwitch: '',
      submitmethodsTitle: '',
      categoryId: '',
      isattachmentswitch: '',
      codeConfig: {},//单据规则配置
      btnLoading: false,
      salesList: [],
      ProductTableSearchLists: [
        { prop: "code", label: "设备编码", type: 'input' },
        { prop: "name", label: "设备名称", type: 'input' },
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
        deviceType: 'normal',
        repairFlag: 1,
        classAttribute: "equipment",
      },
      organizeIdTrees: [],
      getEquEquipmentList,
      getcategoryTree,
      ProductTableItemss: [
        { prop: 'code', label: '设备编码', fixed: 'left' },
        { prop: 'name', label: '设备名称', fixed: 'left' },
        { prop: 'categoryName', label: '设备分类' },
        { prop: 'specModel', label: '设备规格' },
      ],
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
      ProductfaultLocationName: [
        { prop: "code", label: "故障部位编码", type: 'input' },
        { prop: "name", label: "故障部位名称", type: 'input' },
      ],
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
      parametersShelveslist,
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
      activeNames: ["basicInfo", "gzxx"],
      activeName: "orderInfo",
      datafilelist: [],
      dataForm: {
        degree: '',
        projectName: '',
        maintenanceNo: '',
        frontPicList: [],
        factoryFloor: '',
        mountedPlaces: '',
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
      dataFormTwo: {
        productData: []
      },
      selectRows: [],
      index: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      productRules: {
        faultLocationName: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["故障部位名称不能为空", (errMsg, index) => { this.$message.error(`故障信息第${index + 1}行：${errMsg}`) }] }), trigger: 'change' },
          { required: true, trigger: 'change' },
        ],
      },
      dataRule: {
        maintenanceNo: [
          { required: true, message: '请输入维修单号', trigger: 'blur' },
        ],
        equipmentId: [
          { required: true, message: '设备不能为空', trigger: 'change' }
        ],
        degree: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' }
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
      tipsvisible: false,
      isApprovalwitch: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.getSwitch()
    this.getBimBusinessDetail()
    this.init()
  },
  methods: {
    getSwitch() {
      let obj = {
        businessCode: 'maintenance',
        configKey: `pg_maintenance`
      }
      getBimBusinessDetail(obj).then(res => {
        this.isApprovalwitch = res.data.configValue1 == '1' ? true : false
      })
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_sbbx'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        this.dataForm.maintenanceNo = data.number
      } catch (error) {
      }
    },
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
    init() {
      this.fetchData('SBWXDH')
      this.dataForm.applicantId = this.userInfo.userId
      this.dataForm.applicantIdName = this.userInfo.userName
      this.dataForm.applicationDate = this.jnpf.getToday()
      this.dataForm.faultStartTime = this.jnpf.getToday('YYYY-MM-DD HH:mm:ss')
      this.organizeIdTrees.push(this.userInfo.organizeId)
      this.dataForm.departmentId = this.userInfo.organizeId
      getOrganization({ keyword: "", organizeId: this.userInfo.organizeId }).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data
      })
    },
    //申请人
    selectsales(val) {
      console.log(val);
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
    //选择设备
    changeWarehouse(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('equipmentId') })
      if (!val && !data.length) return
      if (data && data.length) {
        this.dataForm.equipmentId = data[0].id
        this.dataForm.equipmentIdName = data[0].name
        this.dataForm.factoryFloor = data[0].all.factoryFloor
        this.dataForm.mountedPlaces = data[0].all.mountedPlaces
        this.dataForm.projectName = data[0].all.projectName
      } else {
        this.dataForm.factoryFloor = ''
        this.dataForm.mountedPlaces = ''
        this.dataForm.equipmentId = ''
        this.dataForm.equipmentIdName = ''
        this.dataForm.projectName = ''
      }
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
      this.ProductListRequestObjs.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      this.$refs['ComSelect-pagesb'].openDialog()
    },
    // 继续新增
    continueAdd() {
      this.fetchData('SBWXDH')
      this.tipsvisible = false
      this.btnLoading = false
      this.organizeIdTrees = []
      this.datafilelist = []
      this.dataForm = {
        frontPicList: [],
        factoryFloor: '',
        mountedPlaces: '',
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
      }
      this.dataFormTwo.productData = []
      this.init()
    },
    goBack() {
      if (this.isApprovalwitch) {
        this.$router.push({
          path: "/dailyManagement/maintenanceManagement/pendingdispatch",
        })
      } else {
        this.$router.push({
          path: "/dailyManagement/maintenanceManagement/deviceservice",
        })
      }
      this.tipsvisible = false
    },
    async handleConfirm() {
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
      if (!this.dataFormTwo.productData.length) {
        this.$message.error('请添加故障类型')
        return
      }
      if (submitFlag) {
        this.dataForm.frontPicList = Array.isArray(this.dataForm.frontPicList) ?
          this.dataForm.frontPicList.map(item => {
            return JSON.stringify(item)
              .replace("{", "")
              .replace("}", "")
          }) : "[]"
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'system_attachment',
              configKey: 'fj_sbbx',
              categoryId: this.categoryId,
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        if (!this.isApprovalwitch) this.dataForm.state = 'maintaining'
        let obj = {
          attachmentList: this.datafilelist,
          equLine: [],
          repair: this.dataForm,
          lines: this.dataFormTwo.productData
        }
        this.btnLoading = true;
        addRepairRequest(obj).then(res => {
          this.submitmethodsTitle = '提交成功'
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
              this.tipsvisible = true
            }
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px;
}

//.el-button--small {
// padding: 1;
//}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 9px 10px;
}
</style>
<style scoped lang="scss">
::v-deep .data-form {
  margin-bottom: 18px;
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
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

.el-table__footer {
  display: none;
}

::v-deep.has-gutter {
  display: none;
}

.JNPF-preview-main .main {
  padding-top: 0;
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
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
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

.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important;
}

.options {
  display: inline-block;
}

.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}
</style>