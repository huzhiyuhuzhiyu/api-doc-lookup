<template>

  <transition name="el-zoom-in-center">
    <div style="height:100%">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main org-form">
            <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
              <el-page-header @back="goBack" :content="dialogTitle + `请购单`" v-if="!!dialogTitle" />
              <div style="font-size:18px" v-else>新建请购单</div>
              <div class="options" v-if="type != 'look'">
                <el-button type="success" :loading="btnLoading" @click="handleSubmit('draft')">
                  保存草稿
                </el-button>
                <el-button type="primary" :loading="btnLoading" @click="handleSubmit('submit')">
                  保存并提交
                </el-button>
                <el-button @click="goBack" v-if="!!dialogTitle">{{ $t('common.cancelButton') }}</el-button>
              </div>
            </div>
            <div class="main" ref="main">
              <el-tabs v-model="activeName" v-if="!approvalFlag">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-collapse v-model="activeNames" style="margin-top: 5px;">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                      <el-row :gutter="15" class="" style="margin: 0 0;">
                        <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                          label-position="top">
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="单号" prop="orderNo">
                              <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="type == 'look'
                                ? true
                                : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                                  ? false
                                  : true
                                "></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24" v-if="type=='add'">
                            <el-form-item label="交货日期" prop="deliveryDate" >
                              <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                                  style="width: 100%;" placeholder="请选择交货日期" @change="changDateFun"
                                  ></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="申请部门" prop="applicationDepartmentId">
                              <ComSelect v-model="organizeIdTrees" placeholder="请选择申请部门" auth @change="onOrganizeChangeHandle" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="申请人" prop="applicationUserId">
                              <el-select v-model="dataForm.applicationUserId" placeholder="请选择申请人" clearable style="width: 100%;"  filterable>
                                <el-option v-for="(item, index) in salesList" :key="index" :label="item.name" :value="item.id"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="24" :xs="24">
                            <el-form-item label="申请理由" prop="applicationReason" ref="applicationReason">
                              <el-input type="textarea" :row="3" v-model="dataForm.applicationReason"
                                placeholder="请输入申请理由" maxlength="200"
                                :disabled="type == 'look' ? true : false"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-form>
                      </el-row>
                    </el-collapse-item>

                    <el-collapse-item title="产品信息" name="productInfo">
                      <div v-if="type !== 'look'">
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          icon="el-icon-plus" :disabled="type == 'look' ? true : false"
                          @click="openSeleceProductDialog()">
                          选择产品
                        </el-button>
                        |
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                          批量删除
                        </el-button>
                        |
                      </div>

                      <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                        <JNPF-table style="border: 1px solid #e3e7ee;" @selection-change="handeleProductInfoData" hasC
                          hasNO fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data" id="table"
                          ref="multipleTable" :height="customStyleData" customKey="JNPFTableKey_962982">
                          <el-table-column prop="productCode" label="产品编码" min-width="200" show-overflow-tooltip
                            key="productCode">
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'"
                                :rules="productRules.productCode">
                                <div class="viewData">
                                  <span>{{ scope.row.productCode }}</span>
                                </div>
                              </el-form-item>
                            </template>
                          </el-table-column>
                          <el-table-column prop="productName" label="产品名称" width="120"></el-table-column>
                    <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                          <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" show-overflow-tooltip
                            key="productDrawingNo">
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'"
                                :rules="productRules.productDrawingNo">

                                <div class="viewData">
                                  <span>{{ scope.row.productDrawingNo }}</span>
                                </div>
                              </el-form-item>
                            </template>
                          </el-table-column>


                          <el-table-column prop="planQuantity" label="数量" min-width="120" key="planQuantity">
                            <template slot="header">
                              <span class="required">*</span>
                              数量
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'planQuantity'"
                                :rules="productRules.planQuantity">
                                <el-input v-model="scope.row.planQuantity" clearable
                                  :disabled="type === 'look'" maxlength="20" placeholder="请输入数量">
                                  {{ scope.row.planQuantity }}
                                </el-input>
                              </el-form-item>
                            </template>
                          </el-table-column>
                          <el-table-column prop="mainUnit" label="单位" width="60" key="mainUnit">
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">

                                <div class="viewData">
                                  <span>{{ scope.row.mainUnit }}</span>
                                </div>
                              </el-form-item>
                            </template>
                          </el-table-column>
                          <el-table-column prop="material" label="材质" width="120" ></el-table-column>
                          <el-table-column prop="deliveryDate" label="交货日期" min-width="240" key="deliveryDate">
                            <template slot="header">
                              <span class="required">*</span>
                              交货日期
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                                :rules="productRules.deliveryDate">
                                <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                                  style="width: 100%;" placeholder="请选择交货日期"
                                  :disabled="type == 'look' ? true : false"></el-date-picker>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip key="remark">
                            <template slot-scope="scope">
                              <el-input v-model="scope.row.remark"  :disabled="type === 'look'"
                                :placeholder="type == 'look' ? '' : '请输入备注'" maxlength="200">
                                {{ scope.row.remark }}
                              </el-input>
                            </template>
                          </el-table-column>

                          <el-table-column label="操作" width="180" fixed="right"
                            v-if="dataFormTwo.data.length > 1 && type !== 'look'">
                            <template slot-scope="scope">
                              <el-button v-if="type != 'look'" type="text" class="JNPF-table-delBtn"
                                :disabled="type === 'look'" @click="delequipment_process_relList(scope.$index)">
                                删除
                              </el-button>
                            </template>
                          </el-table-column>
                        </JNPF-table>
                      </el-form>
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                  <UploadWj v-model="datafilelist" :disabled="type === 'look'" :detailed="type === 'look'"
                    style="margin-top: 5px;">
                  </UploadWj>
                </el-tab-pane>
                <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                  <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" style="margin-top: 5px;" />
                </el-tab-pane>
                <el-tab-pane v-if="type == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
                  <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
                </el-tab-pane>
              </el-tabs>
              <el-collapse v-model="activeNames" v-else>
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-row :gutter="15" class="">
                    <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                      label-position="top">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="type == 'look'
                            ? true
                            : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                              ? false
                              : true
                            "></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="type=='add'">
                            <el-form-item label="交货日期" prop="deliveryDate" >
                              <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                                  style="width: 100%;" placeholder="请选择交货日期" @change="changDateFun"
                                  ></el-date-picker>
                            </el-form-item>
                          </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="申请理由" prop="applicationReason" ref="applicationReason">
                          <el-input type="textarea" :row="3" v-model="dataForm.applicationReason" placeholder="请输入申请理由"
                            maxlength="200" :disabled="type == 'look' ? true : false"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form>
                  </el-row>
                </el-collapse-item>

                <el-collapse-item title="产品信息" name="productInfo">
                  <div v-if="type !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openSeleceProductDialog()">
                      选择产品
                    </el-button>
                    |
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                      批量删除
                    </el-button>
                    |
                  </div>

                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">
                    <el-table style="border: 1px solid #e3e7ee;" @selection-change="handeleProductInfoData" hasC hasNO
                      fixedNO v-bind="dataFormTwo.data" :data="dataFormTwo.data" id="table">
                      <el-table-column type="selection" width="60" fixed="left" align="center" v-if="type !== 'look'" />
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                      <el-table-column prop="productCode" label="产品编码" min-width="200" show-overflow-tooltip
                        key="productCode">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productCode'"
                            :rules="productRules.productCode">
                            <div class="viewData">
                              <span>{{ scope.row.productCode }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productName" label="产品名称" width="120"></el-table-column>
                    <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="productDrawingNo" label="品名规格" min-width="200" show-overflow-tooltip
                        key="productDrawingNo">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'productDrawingNo'"
                            :rules="productRules.productDrawingNo">
                            <div class="viewData">
                              <span>{{ scope.row.productDrawingNo }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="planQuantity" label="数量" min-width="200" key="planQuantity">
                        <template slot="header">
                          <span class="required">*</span>
                          数量
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'planQuantity'"
                            :rules="productRules.planQuantity">
                            <el-input v-model="scope.row.planQuantity" clearable
                              :disabled="type === 'look'" maxlength="20" placeholder="请输入数量">
                              {{ scope.row.planQuantity }}
                            </el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="mainUnit" label="单位(主)" min-width="200" show-overflow-tooltip
                        key="mainUnit">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'mainUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.mainUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="deputyUnit" label="单位(副)" min-width="200" show-overflow-tooltip
                        key="deputyUnit">
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deputyUnit'">
                            <div class="viewData">
                              <span>{{ scope.row.deputyUnit }}</span>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="deliveryDate" label="交货日期" min-width="240" key="deliveryDate">
                        <template slot="header">
                          <span class="required">*</span>
                          交货日期
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'deliveryDate'"
                            :rules="productRules.deliveryDate">
                            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                              style="width: 100%;" placeholder="请选择交货日期"
                              :disabled="type == 'look' ? true : false"></el-date-picker>
                          </el-form-item>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip key="remark">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark"  :disabled="type === 'look'"
                            :placeholder="type == 'look' ? '' : '请输入备注'" maxlength="200">
                            {{ scope.row.remark }}
                          </el-input>
                        </template>
                      </el-table-column>

                      <el-table-column label="操作" width="180" fixed="right"
                        v-if="dataFormTwo.data.length > 1 && type !== 'look'">
                        <template slot-scope="scope">
                          <el-button v-if="type != 'look'" type="text" class="JNPF-table-delBtn"
                            :disabled="type === 'look'" @click="delequipment_process_relList(scope.$index)">
                            删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
      <ComSelect-page ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
        :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
        :searchList="ProductTableSearchList" :elementShow="false" multiple />
    </div>
  </transition>


</template>
<script>
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import {
  getpurProcurementRequireDetail,
  addpurProcurementRequire,
  editpurProcurementRequire,
  purProcurementRequirementsList
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import { getBimBusinessDetail } from '@/api/basicData/index'
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";
import {getOrganization} from "@/api/permission/user";
import {mapGetters} from "vuex";
import {getOrganizeInfo} from "@/api/permission/organize";

export default {
  components: { Process, recordList },
  mixins: [busFlow, AbProjectMixin],
  computed:{
    ...mapGetters(['userInfo']),
  },
  data() {
    return {
      salesList: [],
      organizeIdTrees: [],
      customStyleData: 0,
      tableDataFlag: false,
      isattachmentswitch: '',
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      dialogTitle: '',
      loading: false,
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },

      inquirySheetId: '', //询价单id
      dataForm: {
        applicationReason: '', // 申请理由
        approvalCompletionDate: '', // 审批完成时间
        // approvalStatus: "",               // 审批状态
        documentStatus: '', // 单据状态
        id: '',
        orderNo: '', //申请单号
        applicationUserId: '', //申请人
        applicationDepartmentId: '', //申请部门
        reasonRejection: '', //驳回理由
        submitDate: '', //提交时间
        approvalFlag: false,
        deliveryDate:"",
      },

      type: 'add',
      dataFormArr: [],
      rules: {
        applicationReason: [{ required: true, message: '请输入申请理由', trigger: ['blur'] }]
      },
      productRules: {
        productName: [{ required: true, trigger: ['change'] }],
        planQuantity: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          {
            validator: this.formValidate({
              type: 'decimal',
              params: [
                20,
                4,
                '',
                (errMsg) => {
                  this.$message.error('主数量：' + errMsg)
                }
              ]
            }),
            trigger: 'blur'
          },
          {
            validator: this.formValidate('positiveNumber', false, (errMsg) => {
              this.$message.error(`数量(主)：${errMsg}`)
            }),
            trigger: 'blur'
          }
        ],
        deliveryDate: [{
          validator: this.formValidate({
            type: 'noEmtry',
            params: [
              '',
              (errMsg, index) => {
                this.$message.error(`产品信息第${index + 1}行：交货日期${errMsg}`)
              }
            ]
          }),
          trigger: ['blur']
        },]
      },
      productArr: [],
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      getProductList, // 产品选择弹出框树状列表请求api
      ProductMethodArr: [
        { label: '物料分类', classAttribute: '', method: getcategoryTree, requestObj: { classAttribute: '',type: 'material' } }
        // { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: '',
        projectId:'',
        // classAttributeList: ['raw_material', 'semi_finished', 'finish_product', 'accessories'],
        productCategoryId: '',
        code: '',
        name: '',
        orderItems: [
          {
            asc: false,
            column: 'create_time'
          }
        ],
        productStatus: 'enable',
        productSource: '',
        pageNum: 1,
        pageSize: 20
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'projectName', label: '所属项目',render:false },
        { prop: 'code', label: '产品编码' },
        { prop: 'name', label: '产品名称',render:false },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'productCategoryName', label: '产品分类' },
        { prop: "mainUnit", label: "单位" },
        { prop: "material", label: "材质" }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' }
      ], // 产品选择弹出框搜索条件
      formLoading: false,
      codeConfig: {},
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      categoryId: ''
    }
  },
  async created() {
    await this.getProjectList()
    await this.switchStyleheight()
    this.tableDataFlag = true

    this.fetchData('QGD')
    this.initOrganizeAndUser()
    this.getBimBusinessDetail()
    if (this.type === 'add') this.getBusInfo()
  },
  mounted() {
    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.multipleTable) return
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout()
      })
    }
    window.addEventListener('resize', this.clientResize)
    console.log("userInfo ✈️ ", this.userInfo)
  },
  methods: {
   async initOrganizeAndUser(){
     const response = await getOrganizeInfo(this.userInfo.departmentId)
     this.organizeIdTrees = response.data.parentId === '-1'
       ? [this.userInfo.departmentId]
       : [...response.data.organizeIdTree, this.userInfo.departmentId];
     this.dataForm.applicationDepartmentId = this.userInfo.departmentId
     await this.getOrganization()
     this.dataForm.applicationUserId = this.userInfo.userId
    },
    onOrganizeChangeHandle(val) {
      this.$nextTick(() => { this.$refs['elForm'].validateField('applicationDepartmentId') })
      this.dataForm.applicationUserId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.applicationDepartmentId = ''
      this.dataForm.applicationDepartmentId = val[val.length - 1]
      this.salesFlag = false
      this.getOrganization()
    },
   async getOrganization(){
     await getOrganization({ keyword: "", organizeId: this.dataForm.applicationDepartmentId }).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data
      })
    },
        // 表单选择交货日期 表格批量覆盖
    changDateFun() {
      let arr = JSON.parse(JSON.stringify(this.dataFormTwo.data))
      if (this.dataFormTwo.data.length) {
        arr.forEach((item, index) => {
          // item.deliveryDate = this.dataForm.deliveryDate
          if (!item.deliveryDate) {
            this.$set(item, "deliveryDate", this.dataForm.deliveryDate)
          }
        });
        this.dataFormTwo.data = arr
        console.log("this.dataFormTwo.data", this.dataFormTwo.data);
      }
    },
    switchStyleheight() {
      const mainRegion1 = this.$refs.main // 表单页面区域
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 325
      console.log(maxHeight, 'maxHeight')
      this.customStyleData = maxHeight + 'px'
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_qgd'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
        this.$set(this.dataForm, 'orderNo', data.number)
        console.log('dataForm', this.dataForm)
      } catch (error) { }
    },
    // 产品组件回调
    addth(id, data) {
      console.log(data)
      if (data.length) {
        let selectArr = []
        let list = data.map((item) => item.all)
        list.forEach((item, index) => {
          selectArr.push({
            projectName: item.projectName, // 所属项目
            productSource: item.productSource, // 产品来源 采购
            productsId: item.id, // 产品id
            productName: item.name, // 产品名称
            productCode: item.code, // 产品编码
            productDrawingNo: item.drawingNo, // 品名规格
            ratio: item.ratio, // 转换系数
            calculationDirection: item.calculationDirection, // 计算方向
            mainUnit: item.mainUnit, // 主单位
            deputyUnit: item.deputyUnit, // 副单位
            planQuantity: '', //计划数量主
            remark: item.remark,
            material: item.material,
            productCategoryName:item.productCategoryName,
            deliveryDate: this.dataForm.deliveryDate?this.dataForm.deliveryDate:"" // 交期
          })
        })
        if (this.dataFormTwo.data.length) {
          const deletedArray = []
          selectArr = selectArr.filter((item1) => {
            const index = this.dataFormTwo.data.findIndex((item2) => item2.productsId === item1.productsId)
            if (index !== -1) {
              deletedArray.push(item1.productName)
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false
            }
            return true
          })
          console.log(data, '删除后的数据')
          console.log(deletedArray, '被删掉的数据')
        }
        this.dataFormTwo.data = [...this.dataFormTwo.data, ...selectArr]
        // 审批
        // this.$nextTick(() => { this.getApproverData() })
      }
    },

    // 去除系数后两位的小数位
    numberFormat(number) {
      var formatted = parseFloat(number)
        .toFixed(2)
        .replace(/\.?0+$/, '')
      if (isNaN(formatted)) {
        return 0
      } else {
        return formatted
      }
    },
    // 产品弹窗
    openSeleceProductDialog() {
      this.ProductTableSearchList = [
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productDrawingNo', label: '品名规格', type: 'input' },
      ]
      if (this.$store.getters.configData.product.enable_productName) {
      this.ProductTableItems.forEach(tc=>{
        if (tc.prop === 'name') {
          tc.render = true
        }
      })
      let index = this.ProductTableSearchList.findIndex((obj) => obj.prop === 'productCode')
      this.ProductTableSearchList.splice(index+1, 0, { prop: 'productName', label: '产品名称', type: 'input' })
      }
      this.$refs['ComSelect-page'].openDialog()
      // this.productVisibled = true
      // this.$nextTick(() => {
      //   this.$refs.productRef.initData2()
      // })
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.productArr.length === 0) {
        this.$message({
          message: '请选择你要删除的数据',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.productArr.length; i++) {
        const row = this.productArr[i]
        const index = this.dataFormTwo.data.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.productArr = [] // 清空选中的行的数据
    },
    // 选中的产品信息
    handeleProductInfoData(val) {
      this.productArr = val
    },
    clearData() {
      this.dataForm.id = ''
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type, approvalFlag) {
      console.log(id, type)
      // this.fetchData('QGD')
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.approvalFlag = approvalFlag
      this.dialogTitle = type == 'add' ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
          this.getBusInfo()
        } else if (this.dataForm.id && this.type == 'add') {
          this.loading = true
          getpurProcurementRequireDetail(this.dataForm.id).then((res) => {
            this.dataForm = res.data
            if (res.data.attachmentList) {
              res.data.attachmentList.forEach((item) => {
                this.datafilelist.push({
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                })
              })
            }

            purProcurementRequirementsList(this.dataForm.id).then((res) => {
              this.dataForm.approvalStatus = ''
              this.dataForm.submitDate = ''
              this.dataForm.approvalCompletionDate = ''
              this.dataForm.id = ''
              this.dataForm.documentStatus = ''
              this.dataFormTwo.data = res.data
              this.dataFormTwo.data.forEach((item) => {
                item.id = ''
              })
            })
            // 审批
            // this.$nextTick(() => { this.getApproverData() })
            this.getBusInfo()
          })
        } else {
          this.loading = true
          if (this.type === 'edit') {
            this.getBusInfo()
          } else {
            getpurProcurementRequireDetail(this.dataForm.id).then((res) => {
              this.dataForm = res.data
              if (res.data.attachmentList) {
                res.data.attachmentList.forEach((item) => {
                  this.datafilelist.push({
                    name: item.document.fullName,
                    fileSize: item.document.fileSize,
                    filename: item.document.filePath,
                    id: item.document.id,
                    url: item.url
                  })
                })
              }
              purProcurementRequirementsList(this.dataForm.id).then((res) => {
                this.dataFormTwo.data = res.data
              })
              // 流程信息和流转记录
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
            })
          }
        }
      })
    },
    // 表单提交
    handleSubmit(type) {
      this.request(type)
    },

    async request(type) {
      let _data
      let hasCostPrice = true
      this.btnLoading = true
      this.dataForm.documentStatus = type
      if (this.datafilelist.length) {
        this.datafilelist.map((item, index) => {
          item.bimAttachments = {
            businessType: 'system_attachment',
            configKey: 'fj_qgd',
            categoryId: this.categoryId,
            documentId: item.id,
            fileFlag: '',
            sort: index
          }
        })
      }
      _data = {
        attachmentList: this.datafilelist,
        purProcurementRequirements: this.dataForm,
        lines: this.dataFormTwo.data,
        flowData: this.flowData,
      }
      console.log(_data, '参数')
      let msg = ''
      if (this.dataForm.documentStatus === 'draft') {
        msg = '保存成功'
      } else {
        msg = '提交成功'
      }
      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch((err) => false)
      if (hasCostPrice) {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.dataFormTwo.data.length === 0) {
              this.btnLoading = false
              this.$message.error('请至少选择一项产品')
            } else {
              if (!valid_2) {
                console.log(1)
                this.btnLoading = false
                for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                  const item = this.dataFormTwo.data[i]
                  if (!item.planQuantity) {
                    this.$message({
                      type: 'error',
                      message: '请输入第' + (i + 1) + '行的主数量',
                      duration: 1500
                    })
                    break
                  }
                  if (!item.deliveryDate) {
                    this.$message({
                      type: 'error',
                      message: '请选择第' + (i + 1) + '行的交货日期',
                      duration: 1500
                    })
                    break
                  }
                }
                return
              } else {
                this.btnLoading = true

                if (this.type === 'add') {
                  addpurProcurementRequire(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '新建成功'
                      if (!this.dialogTitle) {
                        this.$message({
                          message: msg,
                          type: 'success',
                          duration: 1000,
                          onClose: () => {
                            this.btnLoading = false
                            this.datafilelist = []
                            this.dataFormTwo.data = []
                            this.dataForm = {
                              applicationReason: '',
                              approvalCompletionDate: '',
                              // approvalStatus: "",
                              documentStatus: '',
                              id: '',
                              orderNo: '',
                              reasonRejection: '',
                              submitDate: ''
                            }
                            this.workVisible = false
                          }
                        })
                        return
                      }
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                        }
                      })
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                } else {
                  editpurProcurementRequire(_data)
                    .then((res) => {
                      if (res.msg === 'Success') res.msg = '修改成功'
                      this.$message({
                        message: msg,
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                          this.btnLoading = false
                          this.$emit('close', true)
                        }
                      })
                    })
                    .catch(() => {
                      this.btnLoading = false
                    })
                }
              }
            }
          } else {
            this.btnLoading = false
          }
        })
      } else {
        this.btnLoading = false
      }
    },

    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b015').then(res => {
        if (res.data) {
          if (res.data.enabledMark) {
            this.flowData = res.data
            this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
            this.dataForm.approvalFlag = res.data.enabledMark
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
            this.$message.error('未找到审批流程！')
          }
        } else {
          this.flowTemplateJson = {}
          this.dataForm.approvalFlag = false
        }
      }).catch(() => { })
    },
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id).then(res => {
        if (res.data) {
          this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson) : null
          this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
          this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
          let flowTaskNodeList = res.data.flowTaskNodeList
          if (flowTaskNodeList.length) {
            for (let i = 0; i < flowTaskNodeList.length; i++) {
              const nodeItem = flowTaskNodeList[i]
              const loop = data => {
                if (Array.isArray(data)) data.forEach(d => loop(d))
                if (data.nodeId === nodeItem.nodeCode) {
                  if (nodeItem.type == 0) data.state = 'state-past'
                  if (nodeItem.type == 1) data.state = 'state-curr'
                  if (nodeItem.nodeType === 'approver' || nodeItem.nodeType === 'start' || nodeItem.nodeType === 'subFlow') data.content = nodeItem.userName
                  return
                }
                if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                if (data.childNode) loop(data.childNode)
              }
              loop(this.flowTemplateJson)
            }
          }
        }
      }).catch(() => { })
    },
  }
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 0 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  /* padding: 0 20px; */
}

::v-deep .el-tabs__header {
  /* padding-left: 10px !important; */
  /* padding-bottom: 10px !important; */
  margin-bottom: 0 !important;
  background: #fff;
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
  /* padding: 0 10px 0px; */
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

::v-deep .workNode {
  /* min-height: 1045px !important; */
  background-color: #f5f5f7 !important;
}

.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
