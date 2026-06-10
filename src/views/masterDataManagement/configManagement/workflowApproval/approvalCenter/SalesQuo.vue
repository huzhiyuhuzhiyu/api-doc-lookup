<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')"
          content="审批" />
        <div class="options" v-if="isShow!='disabled'">
          <el-button type="success" :loading="btnLoading" @click="confirmOk('审批同意','ok',row)">
            审批同意</el-button>
          <el-button type="primary" :loading="btnLoading" @click="confirmOk('审批拒绝','rebut',row)">
            审批拒绝</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="订单信息" name="orderInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24" v-if="btnType == 'look' && dataForm.documentStatus != 'draft'">
                  <el-form-item label="报价单号" prop="quotationNo">
                    <el-input v-model="dataForm.quotationNo" placeholder="输入报价单号" :disabled="status" maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="致" prop="deliver">
                    <el-input v-model="dataForm.deliver" placeholder="输入致" :disabled="status" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <!-- 客户产品未生成 并且 打开方式非生成客户产品 -->
                  <el-form-item label="意向客户" prop="yxCooperativePartnerIdText"
                    v-if="!dataForm.generateFlag && btnType !== 'custom'">
                    <ComSelect-page key="yxPartner" ref="ComSelect-page" v-model="dataForm.cooperativePartnerIdText"
                      :tableItems="yxPartnerTableItems" dialogTitle="选择意向客户" treeTitle="意向客户分类"
                      placeholder="请选择意向客户"
                      :methodArr="{ method: getcategoryTree, requestObj: { type: 'public_private_sea' } }"
                      :listMethod="getPrivateList" :listRequestObj="yxPartnerRequestObj" :searchList="yxPartnerSearchList"
                       :isdisabled="status" />
                  </el-form-item>
                  <el-form-item label="客户" prop="cooperativePartnerIdText" v-else>
                    <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.cooperativePartnerIdText"
                      :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类"
                      placeholder="请选择客户" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }"
                      :listMethod="getCooperativeData" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList"
                       :isdisabled="btnType === 'look'" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="报价人" prop="bidder">
                    <el-input v-model="dataForm.bidder" placeholder="输入报价人" :disabled="status" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="报价时间" prop="quotationTime">
                    <el-date-picker v-model="dataForm.quotationTime" type="date" value-format="yyyy-MM-dd"
                      style="width: 100%;" placeholder="请选择报价时间" :disabled="status">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="有效时间止" prop="validEnd">
                    <el-date-picker v-model="dataForm.validEnd" placeholder="请选择有效时间" type="date" :disabled="status"
                      value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="地址" prop="address">
                    <el-input v-model="dataForm.address" placeholder="输入地址" maxlength="300"
                      :disabled="btnType == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="电话" prop="phone">
                    <el-input v-model="dataForm.phone" placeholder="输入电话" maxlength="20"
                      :disabled="btnType == 'look' ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="传真" prop="fax">
                    <el-input v-model="dataForm.fax" placeholder="输入传真" maxlength="20" :disabled="status" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'look' && dataForm.documentStatus != 'draft'">
                  <el-form-item label="是否生成客户产品" prop="generateFlag">
                    <el-input :value="dataForm.generateFlag ? '是' : '否'" placeholder="请选择是否生成客户产品" :disabled="status" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="dataForm.approvalStatus == 'review_failed'">
                  <el-form-item label="驳回理由" prop="reasonRejection">
                    <el-input v-model="dataForm.reasonRejection" placeholder="输入驳回理由" :disabled="status"
                      maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="status" type="textarea"
                      maxlength="200" :rows="2" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>
      
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.lines"  >
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="iszt" key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="customerDrawingNumber" label="客户物料号" width="200" fixed='left'>
                  <template slot="header">
                    <span class="required">*</span>客户物料号
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'customerDrawingNumber'"
                      :rules='productRules.customerDrawingNumber'>
                      <el-input v-model="scope.row.customerDrawingNumber" placeholder="请输入客户物料号" :disabled="status"
                        maxlength="500" style="width: 175px;"  />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="customerProductDrawingNo" label="客户图号" width="200" fixed='left'>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'customerProductDrawingNo'"
                      :rules='productRules.customerProductDrawingNo'>
                      <el-input v-model="scope.row.customerProductDrawingNo" placeholder="请输入客户图号" :disabled="status"
                        maxlength="1000" style="width: 175px;" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="materialDescription" label="物料描述" width="170">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.materialDescription" placeholder="请输入物料描述" :disabled="status"
                      maxlength="100" style="width: 145px;" />
                  </template>
                </el-table-column>
                <el-table-column prop="spec" label="规格型号" width="170">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.spec" placeholder="请输入规格型号" :disabled="status" maxlength="100"
                      style="width: 145px;" />
                  </template>
                </el-table-column>
                <el-table-column prop="num" label="数量" width="160">
                  <template slot="header">
                    <span class="required">*</span>数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                      <el-input :title="scope.row.num" v-model="scope.row.num" placeholder="请输入数量" :disabled="status"
                        maxlength="11"   style="width: 135px;"
                        oninput="value=value.replace(/[^0-9.]/g,'')">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="listPrice" label="牌价(含税)" width="160">
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'listPrice'" :rules='productRules.listPrice'>
                      <el-input v-model="scope.row.listPrice" placeholder="牌价自动生成" disabled maxlength="20"
                        style="width: 135px;">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="unitPrice" label="单价(含税)" width="160">
                  <template slot="header">
                    <span class="required">*</span>单价(含税)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'unitPrice'" :rules='productRules.unitPrice'>
                      <el-input v-model="scope.row.unitPrice" placeholder="请输入单价" :disabled="status" maxlength="20"
                         style="width: 135px;">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="excludingTaxUnitPrice" label="单价(不含税)" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="discount" label="折扣率(%)" width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="amounts" label="金额(含税)" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="excludingTaxAmounts" label="金额(不含税)" width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="totalTaxAmount" label="总税额" width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="140">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.mainUnit" placeholder="请输入单位" :disabled="status" maxlength="20"
                      style="width: 115px;" />
                  </template>
                </el-table-column>
                <el-table-column prop="taxRate" label="税率(%)" width="160">
                  <template slot="header">
                    <span class="required">*</span>税率(%)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'taxRate'" :rules='productRules.taxRate'>
                      <el-input v-model="scope.row.taxRate" placeholder="请输入税率" :disabled="btnType === 'look'"
                        maxlength="2" style="width: 135px;"  />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注1" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注2" :disabled="status" maxlength="200" />
                  </template>
                </el-table-column>
                <el-table-column prop="remark2" label="备注2" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark2" placeholder="请输入备注2" :disabled="status" maxlength="200" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'add' || btnType == 'edit'">
                  <template slot-scope="scope" v-if="btnType != 'look'">
                    <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin-right:10px">总数量：{{ totalNum }}</span>
                <span style="font-weight:500;margin-right:10px">总金额：{{ totalPrice }}</span>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
          <el-tab-pane label="审批" name="approvalFlow">
            <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="btnType" :nodeConfig.sync="busNodeConfig"
              ref="workflowRef" />
          </el-tab-pane>
        </el-tabs>
      </div>


      <errorDialog :visible.sync="tipVisible" :list="tipList" />
      <okOrNo v-if="okOrNoVisible" ref="okForm" @close="closeForm"/>
    </div>
  </transition>
</template>

<script>
import { addQuotationData, editQuotationMData, getQuotationInfo, denerateQuotationMData, calculatequotationData, saleUploadData, saleUploadAmountsCount } from "@/api/salesManagement/index";
import { getCounryData, getPrivateList, deletePrivate, getcategoryTree, privateDetail } from '@/api/basicData/index'
import { getcategoryTrees, getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { mapGetters, mapState } from 'vuex'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail } from '@/api/basicData/approvalAdministrator'
import errorDialog from '@/components/WorkFlow/dialog/errorDialog.vue'
import okOrNo from './okOrNoForm.vue'
export default {
  components: { workFlow, errorDialog,okOrNo },
  data() {
    return {
      okOrNoVisible:false,
      getcategoryTree, // 意向客户分类
      getPrivateList, // 意向客户列表
      yxPartnerRequestObj: {
        code: "",
        name: "",
        taxId: "",
        mobilePhone: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "public_private_sea",
      }, // 意向客户列表入参
      yxPartnerSearchList: [
        { prop: 'name', label: '意向客户名称', type: 'input' },
        { prop: 'taxId', label: '税号', type: 'input' },
        { prop: 'mobilePhone', label: '手机号', type: 'input' }
      ], // 意向客户搜索条件
      yxPartnerTableItems: [
        { prop: 'name', label: '意向客户名称' },
        { prop: 'taxId', label: '税号' },
        { prop: 'mobilePhone', label: '手机号' },
        { prop: 'nameEn', label: '英文名称' }
      ], // 意向客户列表字段

      getcategoryTrees, // 客户列表
      getCooperativeData, // 客户列表
      partnerRequestObj: {
        code: "",
        name: "",
        taxId: "",
        mobilePhone: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }, // 意向客户列表入参
      partnerSearchList: [
        { prop: 'code', label: '客户编码', type: 'input' },
        { prop: 'name', label: '客户名称', type: 'input' },
        { prop: 'taxId', label: '税号', type: 'input' }
      ], // 客户搜索条件
      partnerTableItems: [
        { prop: 'code', label: '客户编码' },
        { prop: 'name', label: '客户名称' },
        { prop: 'taxId', label: '税号' },
      ], // 客户列表字段

      datafilelist: [],
      iszt: true,
      status: false,
      dataFormTwo: {
        lines: []
      },
      iszhi: false,
      attributeLines: [],
      index: null,
      btnType: undefined,
      area: [],
      deliveryAddressList: [],
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      dataForm: {
        deliver: '',
        publicPrivateSeaId: '',
        cooperativePartnerId: '',
        bidder: '',
        quotationTime: '',
        validEnd: '',
        address: '',
        phone: '',
        fax: '',
        totalAmount: 0,
        // approvalStatus: '',
        // reasonRejection: '',
        documentStatus: '',
        // submitDate: '',
        remark: ''
      },
      defaultAddress: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 3600 * 24;
        }
      },
      selectRows: [],
      taxRate: '13', // 默认税率
      dataRule: {
        deliver: [{ required: true, message: '致不能为空', trigger: 'blur' }],
        yxCooperativePartnerIdText: [{ required: true, message: '意向客户不能为空', trigger: 'change' }],
        cooperativePartnerIdText: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        validEnd: [{ required: true, message: '有效期止不能为空', trigger: 'blur' }],
        bidder: [{ required: true, message: '报价人不能为空', trigger: 'blur' }],
        quotationTime: [{ required: true, message: '报价时间不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
      },
      productRules: {
        // 客户物料号
        customerDrawingNumber: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["客户物料号不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ],
        // 数量
        num: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["数量不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '数量必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ],
        // 单价（含税）
        unitPrice: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["单价(含税)不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '单价(含税)必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [18, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：单价(含税)${errMsg}`) }] }), trigger: 'blur' }
        ],
        // 牌价（含税）
        listPrice: [
          { validator: this.formValidate('positiveNumber', '牌价(含税)等于0，请完善牌价信息', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ],
        // 税率
        taxRate: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["税率不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '税率必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [18, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' }
        ],
      },
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: "发起人",
        nodeType: 0,
        type: 'node',
        priorityLevel: "",
        approvalType: "appoint",
        selectMode: "",
        selectRange: "",
        directorLevel: "",
        examineMode: "",
        whenEmpty: "",
        examineEndDirectorLevel: "",
        ccSelfSelectFlag: "",
        conditionList: [],
        nodeUserList: [],
        childNode: null,
        conditionNodes: []
      },
      approvalForm: {},
      firstOneNode: [],
      tipVisible: false,
      tipList: [],
      row:{},
      isShow:'',
    }
  },
  computed: {
    totalNum: function () {
      var totalNum = 0;
      for (var i = 0; i < this.dataFormTwo.lines.length; i++) {
        totalNum = this.jnpf.math('add', [totalNum, this.dataFormTwo.lines[i].num])
      }
      return totalNum
    },
    totalPrice: function () {
      var totalPrice = 0;
      for (var a = 0; a < this.dataFormTwo.lines.length; a++) {
        totalPrice = this.jnpf.math('add', [totalPrice, this.dataFormTwo.lines[a].amounts])
      }
      return this.jnpf.numberFormat(totalPrice, 6)
    },
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },
  methods: {

    init(row, btnType,isShow) {
      this.row = row
      this.isShow = isShow
      this.dataForm.id = row.documentId || ''
      this.btnType = btnType
      if (btnType == 'look' || btnType == 'custom' || btnType == 'bjkh') {
        this.iszt = false
        this.status = true
      } else {
        this.iszt = true
        this.status = false
      }
      if (this.btnType == 'add') {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.quotationTime = this.jnpf.dateFormat(end, 'YYYY-MM-DD')
        this.dataForm.validEnd = this.jnpf.dateFormat(end, 'YYYY-MM-DD')
        // 向后推20年存放到dataForm.validEnd
        var originalDate = new Date(this.dataForm.validEnd);
        originalDate.setFullYear(originalDate.getFullYear() + 20);
        var newDate = originalDate.toISOString().slice(0, 10);
        this.dataForm.validEnd = newDate

        this.dataForm.bidder = this.userInfo.userName
        this.dataForm.quotationType = 'latest'
        // 审批
        this.getApproverData()
      }
      if (this.dataForm.id) {
        this.formLoading = true
        getQuotationInfo(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            this.dataForm = res.data.sale
            this.dataForm.yxCooperativePartnerIdText = this.dataForm.cooperativePartnerIdText
            this.dataFormTwo.lines = res.data.lines
            this.dataForm.totalAmount = 0
            if (this.btnType === 'custom') {
              this.dataForm.cooperativePartnerIdText = ''
            }
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
            this.formLoading = false
          })
        }).catch(err => {
          this.formLoading = false
        })
        getSaleBusDetail(this.dataForm.id).then(res => {
          console.log(res, '业务详情');
          this.approvalForm = res.data.form
          this.firstOneNode.push({
            name: res.data.form.createByName
          })
          let data = res.data.formNodeTree.childNode
          if (data) {
            this.addNodeTypeAndNodeName(data)

            this.busNodeConfig.childNode = data
            this.workVisible = true
            // this.$nextTick(() => {
            //   this.$refs.workflowRef.initData('busing', this.btnType)
            // })
          }

        })
      }
    },
    async handleConfirm(value) {
      this.btnLoading = true
      let submitFlag = true
      // 审批条件参数列表
      let nodeCondList = []
      // 审批抄送人列表
      let ccList = []
      let nodeJudg = []
      // 业务审批单流程节点列表
      let formNodeList = []
      // 业务审批单
      let form = {}
      this.tipList = [];
      this.reErr(this.busNodeConfig);
      if (this.tipList.length != 0) {
        this.tipVisible = true;
        this.btnLoading = false
        return;
      }
      console.log(this.busNodeConfig, '提交提交');
      if (this.btnType === 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          console.log(flattenedNodes, 'flattenedNodesflattenedNodes');
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: 'no',
              id: '',
              previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccList = ccList.map(item => {
            return {
              ...item,
              ccToId: item.nodeUserList[0].targetId,
              approvalFormNodeCode: item.code,
              id: '',
              defaultFlag: 1,
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: value,
            documentId: '',
            id: ''
          }
        }
      } else {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          console.log(flattenedNodes, 'flattenedNodesflattenedNodes');
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: 'no',
              previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccList = ccList.map(item => {
            return {
              ...item,
              ccToId: item.nodeUserList[0].targetId,
              approvalFormNodeCode: item.code,
              defaultFlag: item.defaultFlag ? item.defaultFlag : item.active ? 1 : 0,
              id: item.nodeUserList[0].id ? item.nodeUserList[0].id : ''
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: value,
          }
        }
      }
      if (value === 'submit') {
        if (!this.busNodeConfig.childNode) {
          submitFlag = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach(item => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                submitFlag = false
                this.btnLoading = false
                this.$message.error('未配置发起人自选！')
              }
            }
          })
        }
      }

      // 校验主表
      const form_1 = this.$refs['dataForm']
      const valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        const formItems = form_1.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }

      // 校验子表
      if (!this.dataFormTwo.lines.length && submitFlag) {
        submitFlag = false
        this.$message.error('请添加产品')
      }
      const form_2 = this.$refs['productForm']
      const valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        const formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }

      if (submitFlag) {
        this.dataForm.totalAmount = Number(this.dataForm.totalAmount = 0)
        this.dataForm.totalAmount = this.totalPrice
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
          sale: this.dataForm,
          lines: this.dataFormTwo.lines,
          form: form,
          formNodeList,
          nodeCondList: nodeJudg,
          ccList
        }
        console.log(obj, '参数');
        // return
        let formMethod = null;
        if (this.btnType == 'edit' || this.btnType == 'bjkh') {
          formMethod = editQuotationMData
        } else if (this.btnType == 'add') {
          formMethod = addQuotationData
        } else if (this.btnType == 'custom') {
          formMethod = denerateQuotationMData
        }
        formMethod(obj).then(res => {
          let msg = "";
          if (this.btnType == 'edit') {
            msg = "提交成功"
          } else if (this.btnType == 'add') {
            msg = "新建成功"
          } else {
            msg = '生成客户产品成功'
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
      } else {
        this.btnLoading = false
      }
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      console.log(obj);
      if (obj) {
        if (obj.name === "审核人") {
          obj.nodeType = 1;
          obj.nodeName = obj.name;
          obj.directorLevel = obj.approvalType == "manager" ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == "multilevel" ? obj.levelSupervisor : ''
        }
        if (obj.name === "路由") {
          obj.nodeType = 4;
        }
        if (obj.name === "抄送人") {
          obj.nodeType = 2;
          obj.nodeName = obj.name;
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode);
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map(item => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(','); // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',');
                  var resultArr = [];
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      };
                      resultArr.push(option);
                    }
                  }
                }
                return {
                  ...item,
                  columnDbname: item.name,
                  columnType: item.dataType,
                  showName: item.name,
                  tjCode: item.code,
                  zdy1: item.comparisonValue,
                  columnId: item.approvalBusinessId,
                  options: resultArr,
                  optType: item.dataType == 'number' ? (item.operationalFormula == 'lt' ? '1' : item.operationalFormula == 'gt' ? '2' : item.operationalFormula == 'eq' ? '4' : item.operationalFormula == 'ge' ? '5' : item.operationalFormula == 'le' ? '3' : '') : ''

                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode);
            }
          }
        }
      }
    },
    // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        console.log(node, '提交数1');
        this.count++
        console.log(this.count);
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null });
        if (node.type === 'node') {

          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {

              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code);
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
        }
      }
      return flattenedNodes;
    },
    // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      if (this.totalNum && this.totalPrice) {
        let query = {
          businessCode: "b001",
          condList: [
            {
              "code": 'numCode',
              "val": this.totalNum
            },
            {
              "code": 'moneyCode',
              "val": this.totalPrice
            },
          ]
        }
        busApprovalFlowTree(query).then(res => {
          console.log(res, '树详情');
          if (res.data) {
            this.approvalForm = res.data.template
            this.firstOneNode.push({
              name: this.userInfo.userName
            })
            let data = res.data.tempLineTree.childNode
            if (data) {
              this.addNodeTypeAndNodeName(data)
              this.busNodeConfig.childNode = data
              this.workVisible = true
              this.$nextTick(() => {
                this.$refs.workflowRef.initData('busing', this.btnType)
              })
            }
          } else {
            this.busNodeConfig.childNode = null
          }
        })
      }
    },
    // 节点未填错误提示
    reErr({ childNode }) {
      console.log(childNode, 'errrrrrr');
      if (childNode) {
        let { nodeType, error, nodeName, conditionNodes, code } = childNode
        if (nodeType == 1 || nodeType == 2) {
          if (!code) {
            this.tipList.push({ name: nodeName, nodeType: ["", "审核人", "抄送人"][nodeType] })
          }
          this.reErr(childNode)
        } else if (nodeType == 3) {
          this.reErr(childNode)
        } else if (nodeType == 4) {
          this.reErr(childNode)
          for (var i = 0; i < conditionNodes.length; i++) {
            if (!conditionNodes[i].code || !conditionNodes[i].conditionList.length) {
              this.tipList.push({ name: conditionNodes[i].nodeName, nodeType: "条件" })
            }
            this.reErr(conditionNodes[i])
          }
        }
      } else {
        childNode = null
      }
    },
    confirmOk(title,state,row){
      this.okOrNoVisible = true
      this.$nextTick(()=>{
        this.$refs.okForm.init(title,state,row)
      })
    },
    closeForm(isRefresh){
      if (isRefresh) {
        this.$emit('close', true)
      }
    },
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

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

::v-deep .workNode {
  min-height: 1000px !important;
}

//.el-button--small {
// padding: 1;
//}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
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

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 5px 10px;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>
<style lang="scss" scoped>
$footerPadding: '10px';

::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
}

::v-deep .el-dialog__body {
  margin-bottom: 10px;
}

::v-deep .el-dialog__footer {
  padding: 0 20px 10px;
}

::v-deep .even-row,
::v-deep .odd-row {
  cursor: pointer;
}

.killPadding {
  padding: 0;
}

.killPaddingLeft {
  padding-left: 0 !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding: 2px 10px 2px 0;
}

::v-deep .JNPF-common-search-box.noSearchList {
  padding: 3px 0;
}

::v-deep .has-gutter .el-table__cell.gutter {
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}
</style>