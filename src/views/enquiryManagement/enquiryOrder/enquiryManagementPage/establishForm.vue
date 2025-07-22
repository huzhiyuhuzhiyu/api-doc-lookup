<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')"
          :content="btnType == 'add' || btnType == 'copy' ? '新建询价' : btnType == 'edit' ? '编辑询价' : '查看询价管理'" />
        <div class="options">
          <el-button size="mini" type="success" :loading="btnLoading" @click="handleConfirm('draft')"
            v-if="btnType !== 'look'">
            保存</el-button>
          <el-button size="mini" type="primary" v-if="btnType !== 'look'" :loading="btnLoading"
            @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button size="mini" @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading" ref="main" :element-loading-text="loadingText">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="待询价单" prop="inquiryNo">
                    <el-input v-model="dataForm.inquiryNo" placeholder="请选择待询价单" readonly
                      @focus="showInquiryNoListDialog" :disabled="btnType == 'look' ? true : false">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="客户编号" prop="cooperativePartnerId">
                    <el-input v-model="dataForm.bidder" placeholder="请选择待询价单" :disabled="formDisabled" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="询价日期" prop="inquiryTime">
                    <el-date-picker v-model="dataForm.inquiryTime" type="date" value-format="yyyy-MM-dd"
                      style="width: 100%;" placeholder="请选择待询价单" :disabled="formDisabled">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="制单人" prop="bidder">
                    <el-input v-model="dataForm.bidder" placeholder="请选择待询价单" :disabled="formDisabled" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="业务员" prop="cooperativePartnerIdText">
                    <el-input v-model="dataForm.cooperativePartnerIdText" placeholder="请选择待询价单"
                      :disabled="formDisabled" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="采购负责人" prop="purchaseUserId">
                    <el-input v-model="dataForm.purchaseUserId" placeholder="请选择待询价单" :disabled="formDisabled" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="供应商" prop="cooperativePartnerName" ref="cooperativePartnerName">
                    <!-- 供应商选择弹窗  -->
                    <ComSelect-page clearable :isdisabled="type === 'look'" :treeNodeClick="treeNodeClick"
                      v-model="dataForm.cooperativePartnerName" :beforeSubmit="beforeSubmit" ref="ComSelect-page"
                      @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'" title="选择供应商"
                      treeTitle="供应商分类" :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                      :listRequestObj="PartnerListRequestObj" :paramsObj="{ oldData }"
                      :searchList="PartnerTableSearchList" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
            <div v-if="btnType != 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:5px ;font-size:14px!important"
                icon="el-icon-plus" @click="addProduct">选择产品</el-button>
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.lines" @selection-change="handeleProductInfoData"
                v-bind="customStyleData">
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="this.btnType !== 'look'"
                  key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="productCode" label="产品型号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" label="产品名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mainUnit" label="单位" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sampleNumStr" label="样品数" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sampleAmounts" label="样品报价" show-overflow-tooltip></el-table-column>
                <el-table-column prop="amounts" label="报价">
                  <template slot="header">
                    <span class="required-head-style">*</span>报价
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'amounts'" :rules='productRules.amounts'>
                      <el-input :title="scope.row.amounts" v-model="scope.row.amounts" placeholder="请输入样品报价"
                        :disabled="status" maxlength="11">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="moldAmounts" label="模具费">
                  <template slot="header">
                    <span class="required-head-style">*</span>模具费
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'moldAmounts'"
                      :rules='productRules.moldAmounts'>
                      <el-input :title="scope.row.moldAmounts" v-model="scope.row.moldAmounts" placeholder="请输入模具费"
                        :disabled="status" maxlength="11">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="minNumStr" label="起订量">
                  <template slot="header">
                    <span class="required-head-style">*</span>起订量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'minNumStr'" :rules='productRules.minNumStr'>
                      <el-input :title="scope.row.minNumStr" v-model="scope.row.minNumStr" placeholder="请输入起订量"
                        :disabled="status" maxlength="11">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="deliveryDate" label="交期">
                  <template slot="header">
                    <span class="required-head-style">*</span>交期
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'deliveryDate'"
                      :rules='productRules.deliveryDate'>
                      <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择交期" :disabled="status">
                      </el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="remark1" label="采购反馈">
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'remark1'"
                      :rules='productRules.remark1'>
                      <el-input :title="scope.row.remark1" v-model="scope.row.remark1" placeholder="请输入采购反馈"
                        :disabled="status" maxlength="11">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="material" label="材质" show-overflow-tooltip></el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'add' || btnType == 'edit'">
                  <template slot-scope="scope">
                    <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-dialog title="请选择待询价单" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="inquiryNoListDialog" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
        append-to-body>
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table :data="inquiryNoData" ref="dataTable" custom-column customKey="JNPFTableKey_861730">
                <el-table-column prop="quotationNo" label="询价单号" />
                <el-table-column prop="cooperativePartnerId" label="客户编号" />
                <el-table-column prop="quotationTime" label="询价日期"></el-table-column>
                <el-table-column prop="bidder" label="制单人" />
                <el-table-column prop="cooperativePartnerIdText" label="业务员" />
                <el-table-column prop="purchaseUserId" label="采购负责人" />
                <el-table-column prop="remark" label="状态" />
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'add' || btnType == 'edit'">
                  <template slot-scope="scope">
                    <el-button type="text" @click="selectWaitEnquiry(scope)">选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="inquiryNoTotal" :page.sync="inquiryNoRequestObj.pageNum"
                :limit.sync="inquiryNoRequestObj.pageSize" @pagination="getHistoryPriceFun" />
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-left">
            <div class="JNPF-common-title">
              <h2>产品分类</h2>
              <span class="options">
                <el-dropdown>
                  <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                    <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                    <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>

            <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
              <el-tree ref="treeBox" :data="ProductTreeData" :props="defaultProps" :default-expand-all="expands"
                highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeAllProduct"
                class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNodeAllProduct">
                <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i
                    :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                  <span class="text" :title="data.name">{{ data.name }}</span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchAllProduct()" v-model="ProductListRequestObj.productCode"
                      placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchAllProduct()" v-model="ProductListRequestObj.productName"
                      placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchAllProduct()" v-model="ProductListRequestObj.productDrawingNo"
                      placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchAllProduct()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetAllProduct()">{{
                      $t('common.reset')
                    }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="allproductData" hasC @sort-change="sortChange"
                @selection-change="handleSelectionChangeAllPruduct" ref="dataTable" @row-click="handleRowClick"
                customKey="JNPFTableKey_612241">
                <el-table-column prop="code" label="产品编码" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column prop="name" label="产品名称" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column prop="mainUnit" label="单位" />
                <el-table-column prop="inventoryQuantity" label="库存数量" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="viewFun(scope.row, 'inventoryFlag')">
                      {{ scope.row.inventoryQuantity }}
                    </el-link>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum"
                :limit.sync="ProductListRequestObj.pageSize" @pagination="selectProductsFun" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="allProVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
            确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>
          <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()"> {{ btnText }}</el-button>
          <el-button v-else type="primary" @click="continueAdd()"> {{ btnText }}</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import busFlow from '@/mixins/generator/busFlow';
import flowMixin from '@/mixins/generator/flowMixin'
import getProjectList from '@/mixins/generator/getProjectList'
import { getWaitEnquiryOrdersList } from '@/api/enquiryManagement/index'
import { getProducts } from '@/api/masterDataManagement/index.js' // 产品列表
import { getcategoryTree as productTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getcategoryTree } from '@/api/basicData/index'
import { getCooperativeData } from '@/api/basicData/index'
import { getQuotationInfo } from "@/api/salesManagement/index";
export default {
  components: {
  },
  mixins: [busFlow, flowMixin, getProjectList,],
  data() {
    return {
      activeNames: ["productInfo", "basicInfo"],
      formDisabled: true,
      dataForm: {},
      formLoading: false,
      dataRule: {
        inquiryNo: [
          { required: true, message: '请选择待询价单', trigger: 'change' }
        ],
        cooperativePartnerName: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ]
      },
      customStyleData: {},
      dataFormTwo: {
        lines: []
      },
      inquiryNoListDialog: false,
      inquiryNoData: [],
      inquiryNoRequestObj: {},
      inquiryNoTotal: 0,
      allProVisible: false,
      ProductListRequestObj: {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        saleFlag: true,
        productStatus: 'enable',
        productCode: "",
        productName: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      btnType: '',
      ProductMethodArr: [
        {
          label: "产品分类", classAttribute: "", method: productTree, requeseObj: {
            classAttribute: "", type: "material",
          }
        },
      ],
      allproductData: [],
      ProductTreeData: [],
      refreshTree: true,
      getcategoryTree, // 意向客户分类
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      expands: true,
      selectArr: [],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '供应商编码', type: 'input' },
        { prop: 'name', label: '供应商名称', type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      },
      getCooperativeData,
      PartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'supplier' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码', fixed: 'left' },
        { prop: 'name', label: '供应商名称', fixed: 'left' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      oldData: [],
      productRules: {
        // 起订量
        minNumStr: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["起订量不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '起订量必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ],
        // 报价
        amounts: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["报价不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '报价必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ],
        // 模具费
        moldAmounts: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["模具费不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '模具费必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ],
        // 交期
        deliveryDate: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["交期不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
        ],
      },
    }
  },
  watch: {
  },
  props: {
  },
  beforeDestroy() {
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },
  mounted() {
  },
  async created() {
  },
  methods: {
    // 待询价工单查询子产品列表
    getProductsList() {
      getQuotationInfo(this.dataForm.id).then(res => {
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
          }).catch(err => {
            this.formLoading = false
          })
    },
    // 保存提交
    async handleConfirm(type) {
      // 校验主表
      const basicInfoFlag = this.$refs['dataForm']
      const basicInfoValid = await basicInfoFlag.validate().catch(err => false)
      if (!basicInfoValid) {
        this.$message.error('基本信息校验不通过，请检查')
        return false
      }
      // 验证产品列表
      if (!this.dataFormTwo.lines.length) {
        this.$message.error('请添加产品')
        return false
      }
      const productFormRef = this.$refs['productForm']
      const productValid = await productFormRef.validate().catch(err => false)
      if (!productValid) {
        const formItems = productFormRef.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }
      if (this.dataFormTwo.lines.length) {
        for (let index = 0; index < this.dataFormTwo.lines.length; index++) {
          const item = this.dataFormTwo.lines[index];
          if (!item.productsId) {
            this.$message({
              message: "第" + (index + 1) + "行产品不存在",
              type: 'error',
              duration: 1500,
            })
            break
          }
        }
      }

      // formMethod(obj).then(res => {
      //   if (value == "draft") {
      //     this.submitmethodsTitle = "保存成功"
      //   } else {
      //     this.submitmethodsTitle = "提交成功"
      //   }
      //   if (this.btnType == 'edit') {
      //     this.btnText = "继续修改"
      //   } else if (this.btnType == 'add' || this.btnType == 'copy') {
      //     this.btnText = "继续新增"
      //   } else {
      //     if (res.data) {
      //       this.btnLoading = false
      //       this.handleMessage(res.data)
      //       return
      //     }
      //   }
      //   this.tipsvisible = true
      // }).catch(() => {
      //   this.btnLoading = false
      // })
    },
    // 设置基本信息
    setBasicInfo(row) {
      this.dataForm = { ...this.dataForm, ...row }
      this.inquiryNoListDialog = false
      this.$refs['dataForm'].clearValidate(['inquiryNo'])
      // 根据待询价工单查询产品信息
      this.getProductsList()
    },
    supplierdata(id, data) {
      // 如果传入的data为空数组
      if (data.length === 0) {
        // 将dataForm中的合作伙伴名称设为空字符串
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.cooperativePartnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
        // 清除供应商的验证爆红
        this.$refs['dataForm'].clearValidate(['cooperativePartnerName', 'cooperativePartnerCode'])
      }
    },
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (paramsObj.oldData) {
        flag = await this.$confirm('切换供应商将更新产品信息的含税单价和税率，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '更换成功!'
            })
            return true
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            return false
          })
      }
      return flag
    },
    // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 联系人信息删除当前行
    deltable(row, index) {
      if (this.dataFormTwo.lines.length === 1) return this.$message.error('至少需要保留一条产品数据')
      this.dataFormTwo.lines.splice(row.$index, 1)
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop == 'cooperativePartnerIdText' || prop == 'cooperativePartnerCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.ProductListRequestObj.orderItems[0].asc = order !== 'descending'
      this.ProductListRequestObj.orderItems[0].column = newProp
      this.listLoading = true
      this.searchAllProduct()
    },
    //多选
    handleRowClick(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },
    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 切换产品树的折叠
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    // 搜索所有产品 列表
    searchAllProduct() {
      this.ProductListRequestObj.pageNum = 1
      this.selectProductsFun()
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.ProductListRequestObj.classAttribute = data.classAttribute
      this.searchAllProduct()
    },
    getNodePathProduct(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    // 初始化方法
    init(id, type) {
      this.btnType = type
      if (type === 'add') {
        this.dataFormTwo.lines = []
        this.dataFormTwo.lines.push({})
      }
    },
    // 选择待询价单弹窗
    showInquiryNoListDialog() {
      this.inquiryNoListDialog = true
      this.getWaitEnquiryOrdersListFun()
    },
    // 获取待询价列表
    getWaitEnquiryOrdersListFun() {
      getWaitEnquiryOrdersList({
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: "create_time"
        }],
        quotationStatus: 'pending_feedback',
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      }).then((res) => {
        const { records, total } = res.data
        this.inquiryNoData = records
        this.inquiryNoTotal = total
      })
    },
    // 选中一条数据
    async selectWaitEnquiry(scope) {
      // 判断是否已经有选择的待询价订单
      const inquiryNo = this.dataForm.inquiryNo
      if (inquiryNo) {
        const flag = await this.$confirm('切换待询价单将更新基础信息的数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        if (flag) {
          this.setBasicInfo(scope.row)
        }
      } else {
        this.setBasicInfo(scope.row)
      }
    },
    // 点击选择产品
    addProduct() {
      this.allProVisible = true
      let arr = [];
      this.ProductListRequestObj = {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        queryType: 2,
        productStatus: 'enable',
        saleFlag: true,
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      }
      this.allproductData = []
      let successTotal = 0;
      let tempTreeData = [...this.ProductMethodArr]
      this.ProductMethodArr.forEach((item, index) => {
        item.method(item.requeseObj).then(res => {
          if (Array.isArray(res.data)) {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data
            }
          } else {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data.records
            }
          }
          if ((++successTotal) === this.ProductMethodArr.length) {
            this.ProductTreeData = tempTreeData
            this.selectProductsFun()
          }
        })
      });
    },
    // 获取所有产品列表数据
    selectProductsFun() {
      this.listLoading = true
      getProducts(this.ProductListRequestObj).then(listRes => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        this.allProductTotal = listRes.data.total
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      })
    },
    // 选择产品
    submitAllProduct() {
      this.allProVisible = false
      console.log(this.selectArr);
      this.selectArr.forEach(item => {
        const { name: productName, purchasePrice: procurementAmounts, id: productsId, code: productCode, salesPrice: amounts, drawingNo: productDrawingNo, salesExcludingTaxPrice: excludingTaxUnitPrice, excludingTaxPrice: excludingTaxAmounts } = item
        item.productName = productName
        item.productCode = productCode
        item.productsId = productsId
        item.price = amounts
        item.excludingTaxUnitPrice = excludingTaxUnitPrice
        this.$set(item, 'amounts', amounts ?? '')
        this.$set(item, 'procurementAmounts', procurementAmounts ?? '')
        this.$set(item, 'productDrawingNo', productDrawingNo)
        this.$set(item, 'excludingTaxAmounts', excludingTaxAmounts ?? '')
      });
      if (this.dataFormTwo.lines.length) {
        let index = this.dataFormTwo.lines.findIndex(item =>
          item.productDrawingNo === "" &&
          item.productsId === "" &&
          item.num === "" &&
          item.price === "" &&
          item.deliveryDate === ""
        )
        if (index !== -1) {
          // 使用 splice 插入 newDataArray
          this.dataFormTwo.lines.splice(index, 0, ...this.selectArr);
        } else {
          this.dataFormTwo.lines = [...this.selectArr, ...this.dataFormTwo.lines,]
        }
      }
    },
  }
}
</script>
<style lang="scss" scoped>
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
  padding-bottom: 0px
}

.required-head-style {
  color: red;
  margin-right: 4px;
}
</style>
