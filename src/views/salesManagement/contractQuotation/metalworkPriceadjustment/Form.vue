<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          :content="btnType == 'add' ? '新建金工销售调价单' : btnType == 'edit' ? '编辑金工销售调价单' : '查看金工销售调价单'" />
        <!-- <div class="options" v-if="btnType != 'look'">
            <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
              提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div> -->

        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')"
            v-if="btnType == 'add' || btnType == 'edit'">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>

      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
          <el-tab-pane label="订单信息" name="orderInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <!-- <el-col :sm="8" :xs="24">
                    <el-form-item label="合同号" prop="contractNo">
                      <el-input v-model="dataForm.contractNo" placeholder="输入合同号"
                        :disabled="btnType == 'look' ? true : false" maxlength="50" />
                    </el-form-item>
                  </el-col> -->
                <el-col :sm="12" :xs="24">
                  <el-form-item label="客户名称" prop="cooperativePartnerId">
                    <el-input v-model="dataForm.partnerName" placeholder="请选择客户" readonly @focus="openDialog"
                      :disabled="btnType == 'look' ? true : false">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="调价理由" prop="reason">
                    <el-input v-model="dataForm.reason" placeholder="请输入调价理由" :disabled="btnType == 'look' ? true : false"
                      maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false"
                      type="textarea" :rows="2" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>
            <div v-if="btnType !== 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择产品</el-button>|
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.productData" @selection-change="handeleProductInfoData"
                style="border: 1px solid #e3e7ee;">
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'"
                  key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <!-- <el-table-column prop="customerProductNo" label="客户物料号" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="customerProductDrawingNo" label="客户产品图号" width="200" show-overflow-tooltip>
                </el-table-column> -->
                <el-table-column prop="productCode" label="产品编码" min-width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="productName" label="产品名称" min-width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="drawingNo" label="产品图号" min-width="160" v-if="isproductDrawing" show-overflow-tooltip
                  key="23">
                </el-table-column>
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="160" v-else show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位(主)" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="listPrice" label="牌价" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="discount" label="折扣率" width="150" show-overflow-tooltip>
                </el-table-column>
              

                <el-table-column prop="originPrice" label="原单价(含税)" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="excludingTaxOriginPrice" label="原单价(不含税)" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="newPrice" label="新单价(含税)" width="160">
                  <template slot="header">
                    <span class="required">*</span>新单价
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'newPrice'" :rules='productRules.newPrice'>
                      <el-input v-model="scope.row.newPrice" placeholder="请输入新单价"
                        :disabled="btnType == 'look' ? true : false" maxlength="11"
                        @input="watchnums(scope.row, scope.$index)" style="width: 135px;">
                        {{ scope.row.newPrice }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="newDiscount" label="新折扣率" min-width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="excludingTaxNewPrice" label="新单价(不含税)" min-width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="approvalFlow">
            <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="btnType" :nodeConfig.sync="busNodeConfig"
              ref="workflowRef" />
            <div class="noDataTip" v-if="!workVisible">
              <span class="el-table__empty-text">
                <div data-v-4d190d64="" class="el-empty">
                  <div class="el-empty__image" style="width: 120px;"><svg viewBox="0 0 79 86" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <defs>
                        <linearGradient id="linearGradient-1-48" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%">
                          <stop stop-color="#FCFCFD" offset="0%"></stop>
                          <stop stop-color="#EEEFF3" offset="100%"></stop>
                        </linearGradient>
                        <linearGradient id="linearGradient-2-48" x1="0%" y1="9.5%" x2="100%" y2="90.5%">
                          <stop stop-color="#FCFCFD" offset="0%"></stop>
                          <stop stop-color="#E9EBEF" offset="100%"></stop>
                        </linearGradient>
                        <rect id="path-3-48" x="0" y="0" width="17" height="36"></rect>
                      </defs>
                      <g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="B-type" transform="translate(-1268.000000, -535.000000)">
                          <g id="Group-2" transform="translate(1268.000000, 535.000000)">
                            <path id="Oval-Copy-2"
                              d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z"
                              fill="#F7F8FC"></path>
                            <polygon id="Rectangle-Copy-14" fill="#E5E7E9"
                              transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) "
                              points="13 58 53 58 42 45 2 45"></polygon>
                            <g id="Group-Copy"
                              transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)">
                              <polygon id="Rectangle-Copy-10" fill="#E5E7E9"
                                transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) "
                                points="2.84078316e-14 3 18 3 23 7 5 7"></polygon>
                              <polygon id="Rectangle-Copy-11" fill="#EDEEF2"
                                points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon>
                              <rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-48)"
                                transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) "
                                x="38" y="7" width="17" height="36"></rect>
                              <polygon id="Rectangle-Copy-13" fill="#F8F9FB"
                                transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) "
                                points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon>
                            </g>
                            <rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-48)" x="13" y="45" width="40"
                              height="36"></rect>
                            <g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)">
                              <mask id="mask-4-48" fill="white">
                                <use xlink:href="#path-3-48"></use>
                              </mask>
                              <use id="Mask" fill="#E0E3E9"
                                transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) "
                                xlink:href="#path-3-48"></use>
                              <polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-48)"
                                transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) "
                                points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon>
                            </g>
                            <polygon id="Rectangle-Copy-18" fill="#F8F9FB"
                              transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) "
                              points="62 45 79 45 70 58 53 58"></polygon>
                          </g>
                        </g>
                      </g>
                    </svg></div>
                  <div class="el-empty__description">
                    <p>暂无流程信息</p>
                  </div><!---->
                </div>
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="btnType == 'look'" label="流转记录" name="transferList">
            <el-table v-loading="formLoading" :data="transferData">
              <el-table-column prop="businessName" label="审批业务名称" min-width="160" />
              <el-table-column prop="processedName" label="办理人名称" min-width="160" />
              <el-table-column prop="remark" label="备注" min-width="160" />
              <el-table-column prop="startDate" label="开始时间" min-width="160" />
              <el-table-column prop="endDate" label="结束时间" min-width="160" />
              <el-table-column prop="consumingTime" label="耗时" min-width="160" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="选择客户" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="handleClose">

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-left">
            <div class="JNPF-common-title">
              <h2>客户分类</h2>
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
              <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
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
                    <el-input v-model="form.code" placeholder="请输入客户编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="form.name" placeholder="请输入客户名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="form.taxId" placeholder="请输入税号" clearable />
                  </el-form-item>
                </el-col>



                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="tableDataCustomer" @row-dblclick="seleceCustomer">
                <el-table-column prop="code" label="客户编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="客户名称" />
                <el-table-column prop="taxId" label="税号" />
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="seleceCustomer(scope.row)" size="mini">选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData" />
            </div>
          </div>
        </div>

      </el-dialog>
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="productVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body
        @close="productVisible = false">
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="24">
              <el-form @submit.native.prevent>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-model="productForm.customerProductNo" placeholder="请输入客户物料号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-input v-model="productForm.customerProductDrawingNo" placeholder="请输入客户产品图号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.productName" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.drawingNo" placeholder="请输入产品图号" clearable />
                  </el-form-item>
                </el-col>
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
              <JNPF-table v-loading="listLoading" :data="cusProductData" hasC @selection-change="handleSelectionChange"
                @row-click="rowaction" ref="dataTable">
                <el-table-column prop="customerProductNo" label="客户物料号" />
                <el-table-column prop="customerProductDrawingNo" label="客户产品图号" />
                <el-table-column prop="productCode" label="产品编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" label="产品名称" />
                <el-table-column prop="drawingNo" label="产品图号" />
              </JNPF-table>
              <pagination :total="cusPrototal" :page.sync="productForm.pageNum" :limit.sync="productForm.pageSize"
                @pagination="getcooperativeProduct" />
            </div>

          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="productVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitCustomerProduct()">
            确定</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>
  
<script>
import { getAdjustPrice, editAdjustPrice, addPriceAdjust } from "@/api/salesManagement/priceAdjust";
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getcategoryTrees, getAttributeline, getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { mapGetters, mapState } from 'vuex'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
export default {
  components: { workFlow },
  data() {
    return {
      datafilelist: [],
      isproductDrawing: false,
      selectlist: [],
      iszt: false,
      iszhi: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,
      // 选择客户产品参数
      productForm: {
        drawingNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
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
      productVisible: false,
      cusPrototal: 0,//选择客户产品分页器的总条数
      cusProductData: [],
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      allproductData: [],
      productRules: {
        newPrice: [     
          { validator: this.formValidate({ type: 'noEmtry', params: ["新单价(含税)不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '新单价(含税)必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [18, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：新单价(含税)${errMsg}`) }] }), trigger: 'blur' }]
      },
      allProductTotal: 0,

      ProductTreeData: [],
      ProductListRequestObj: {
        classAttribute: "",
        drawingNo: "",
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
      },
      attributeLines: [],
      dataFormTwo: {
        productData: []
      },
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      treeData: [],
      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      index: null,
      expands: true,
      refreshTree: true,
      customerVisible: false,
      paymentMethodList: [],
      paymentCycleList: [],
      activeNameDetail: 'productInfo',
      coverNum: "",//用于计算
      invoicingStatusList: [
        { label: "未开票", value: "not_invoiced" },
        { label: "部分开票", value: "partial_invoicing" },
        { label: "已开票", value: "invoiced" },
      ],
      btnType: undefined,
      areaList: [],
      provinces: [],
      cities: [],
      area: [],
      contactsList: [],
      deliveryAddressList: [],
      countryList: [],
      listQuery: {
        keyword: ''
      },
      activeName: "orderInfo",
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        //   orderType: "normal",
        reason: '',
        cooperativePartnerId: '',
        remark: '',
        adjustType:'old_metalworking'
      },
      defaultAddress: "",
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dataRule: {
        cooperativePartnerId: [
          { required: true, message: '所属客户不能为空', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '调价理由不能为空', trigger: 'change' }
        ],
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
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
       // 审批 转审记录参数
       transferQuery: {
        approvalFormId: '',
        createByName: "",
        documentId: '',
        endTime: "",
        keyword: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
      transferData: [],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  computed:{
    ...mapGetters(['userInfo']),
  },
  created() {
    this.getAttributeline()
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
    //表格某一行被点击
    rowaction(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    calcValidate() {
      return (rule, value, callback) => {
        let index = Number(rule.field.match(/\d+/)[0])
        let msg = `新单价不能为"0"`
        let flag = false
        let list = this.dataFormTwo.productData
        let num_1 = Number(list[index].newPrice)
        // let num_2 = Number(list[index].price)
        if (num_1 == 0) { flag = true }
        if (flag) {
          this.$message.error(msg)
          callback(new Error(msg));
        } else { callback() }
      };
    },
    dateFormat(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      const time = y + '-' + m + '-' + d
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
    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct() {
      this.productVisible = false
      this.selectlist.map(item => {
        item.originPrice = item.price
        item.listPrice = item.purchasePrice
        item.excludingTaxOriginPrice = item.excludingTaxPrice
        this.dataFormTwo.productData.map((item1) => {
          if (item.customerProductDrawingNo == item1.customerProductDrawingNo && item.productCode == item1.productCode && item.productName == item1.productName) {
            item.isrepeat = true
          }
        })
      });
      this.selectlist.map(item => {
        if (!item.isrepeat) {
          item.originPrice = item.price
          item.listPrice = item.purchasePrice
          item.newDiscount = ''
          item.excludingTaxNewPrice = ''
          item.excludingTaxOriginPrice = item.excludingTaxPrice
          this.dataFormTwo.productData.push(item)
        } else {
          this.$message({
            message: "所选产品编码重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
      if (this.selectlist.length > 0) {
        this.isproductDrawing = true
      }
      this.$nextTick(() => { this.getApproverData() })
    },

    // 重置客户产品搜索条件
    resetcusProduct() {
      this.productForm = {
        drawingNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
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
      this.searchcusProduct()
    },
    // 搜索客户产品
    searchcusProduct() {
      this.productForm.pageNum = 1
      this.getcooperativeProduct()
    },
    // 获取客户产品数据
    getcooperativeProduct() {
      this.productForm.partnerId = this.dataForm.cooperativePartnerId
      getcooperativeProduct(this.productForm).then(res => {
        this.cusProductData = res.data.records
        this.cusPrototal = res.data.total
      })
    },
    // 选中客户产品
    handleSelectionChange(e) {
      this.selectlist = e
    },
    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {
      if (this.dataForm.cooperativePartnerId) {
        this.productVisible = true
        this.getcooperativeProduct()
      } else {
        this.$message({
          message: "请先选择客户",
          type: 'error',
          duration: 1500,
        })
      }
    },


    // },
    // 获取所有产品列表数据
    initData2() {
      this.listLoading = true
      getProductList(this.ProductListRequestObj).then(listRes => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        console.log("listRes", listRes);
        this.allProductTotal = listRes.data.total
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      })
    },
    // 搜索所有产品 列表
    searchAllProduct() {
      this.ProductListRequestObj.pageNum = 1
      this.initData2()
    },
    // 监听主数量输入
    watchnums(row, index) {
      console.log("主数量", row, index);
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      if (!row.newPrice) {
        row.newDiscount = ''
        row.excludingTaxNewPrice = ''
        return
      }
      // row.taxRate = row.taxRate.replace(/[^0-9]/g, '');
      row.newPrice = row.newPrice.replace(/[^0-9.]/g, '');

      if (row.newPrice.length == 1 && row.newPrice == '.') {
        // 如果第一位是小数点，则清空输入框
        row.newPrice = '';
      } else if (row.newPrice.length == 2 && row.newPrice[0] == '0' && row.newPrice[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.newPrice = row.newPrice.slice(0, 1) + '.' + row.newPrice.slice(1);
      } else if (row.newPrice.length > 2 && row.newPrice[0] == '0' && row.newPrice[1] != '.') {
        row.newPrice = row.newPrice.substring(1, row.newPrice.length)
      }
      if (row.newPrice.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.newPrice.length; i++) {
          const char = row.newPrice[i];
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
        row.newPrice = result;
        let arr = row.newPrice.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.newPrice = arr[0] + '.' + arr[1]
        console.log(999666, arr);
      } else {
        if (row.newPrice.length > 8) {
          row.newPrice = row.newPrice.substring(0, 8);
        }
      }
      // 新不含税单价
      if (row.newPrice && row.newPrice != '0') {
        let b = this.jnpf.numberFormat((row.newPrice / (1 + row.taxRate / 100)), 6)
        row.excludingTaxNewPrice = b ? b : 0
      }else{
        row.excludingTaxNewPrice = ''
      }
      // 新折扣率
      if (row.newPrice && row.listPrice && row.newPrice != '0' && row.listPrice != '0') {
        let a = this.jnpf.math('multiply',[this.jnpf.numberFormat(row.newPrice / row.listPrice),100])
        row.newDiscount = a ? a : 0
      } else {
        row.newDiscount = ''
      }
      // if (!row.contractQuantity || !row.price) {
      //   row.totalAmount = ''
      // } else {
      //   let a = (row.price * row.contractQuantity).toFixed(2)
      //   row.totalAmount = Object.is(a, NaN) ? '' : a
      // }
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.ProductListRequestObj = {
        classAttribute: "",
        drawingNo: "",
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
      },
        this.searchAllProduct()
    },
    handleSelectionChangeAllPruduct(val) {
      console.log("所有产品多选", val);
      this.selectArr = val
    },
    // 获取产品列表字段 编排属性
    getAttributeline() {
      getAttributeline('product').then(res => {
        console.log("res", res);
        this.attributeLines = res.data
      })
    },

    // 选完所属销售，带出所属部门
    hangleSelectSales(e, r) {
      this.dataForm.departmentId = r.parentId
      this.dataForm.departmentName = r.organize
    },
    handleClose() {
      this.form = {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.initData()
    },
    closeproductVisible() {

    },
    // 选择客户
    seleceCustomer(e) {
      getCooperativeInfo(e.id).then(res => {
        if (this.dataForm.cooperativePartnerId && res.msg == 'Success') {
          this.$confirm('已选择过客户，是否切换，切换后会清空客户和产品信息是否继续!', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '切换成功'
            })
            this.dataFormTwo.productData = []
            this.customerData = e
            this.dataForm.cooperativePartnerId = e.id
            this.dataForm.partnerName = e.name
            this.dataForm.code = e.code
            this.customerVisible = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            this.customerVisible = true
          })
        } else {
          this.dataFormTwo.productData = []
          this.customerData = e
          this.dataForm.cooperativePartnerId = e.id
          this.dataForm.partnerName = e.name
          this.dataForm.code = e.code
          this.customerVisible = false
        }
      })
      if (e.country) {
        this.changeCountry(e.country)
      }
      if (e.province) {
        let obj = {
          id: e.province
        }
      }
      if (e.city) {
        let ooo = {
          id: e.city
        }
      }
    },
    changeCountry(e) {
      this.dataForm.country = e
    },
    search() {
      this.form.pageNum = 1
      this.initData()
    },
    reset() {
      this.form = {
        code: "",
        taxId: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.getcategoryTree()
    },
    initData() {
      this.listLoading = true
      getCooperativeData(this.form).then(res => {
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      console.log("请选择节点", node);
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.search()
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      console.log(this.ProductListRequestObj.productCategoryId, data.id);
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.ProductListRequestObj.classAttribute = data.classAttribute
      console.log(this.ProductListRequestObj.classAttribute);
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
    // 获取客户数据
    getcategoryTree(isInit) {
      this.treeLoading = true
      let listQuery = {
        keyword: '',
        type: "customer"
      };
      getcategoryTrees(listQuery).then(res => {
        console.log(99, res);
        this.treeData = res.data
        this.$nextTick(() => {
          this.initData()
          this.treeLoading = false
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    // 打开选择客户弹框
    openDialog() {
      this.customerVisible = true
      this.getcategoryTree()
    },
    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType != 'look') {
        this.iszt = true
      }
      if (this.btnType == 'add' && !this.dataForm.id) {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.contractDate = this.dateFormat(end)
      }
      if (this.btnType == 'add' && this.dataForm.id) {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.contractDate = this.dateFormat(end)
        getAdjustPrice(this.dataForm.id).then(res => {
          console.log("订单详情", res);
          // this.$nextTick(() => {
            this.dataForm = res.data.adjustPrice
            this.dataFormTwo.productData = res.data.adjustPriceLineList
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
          // 审批
          this.$nextTick(() => {this.getApproverData()})
          // })
        })
      }
      if (this.dataForm.id && this.btnType !== 'add') {
        getAdjustPrice(this.dataForm.id).then(res => {
          console.log("订单详情", res);
          this.$nextTick(() => {
            this.dataForm = res.data.adjustPrice
            this.dataFormTwo.productData = res.data.adjustPriceLineList
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
          })
        })
        getSaleBusDetail(this.dataForm.id).then(res => {
          console.log(res, '业务详情');
          if (res.data) {
            this.firstOneNode = []
            this.approvalForm = res.data.form
            this.transferQuery.approvalFormId = this.approvalForm.id
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
            if (this.btnType == 'look') {
              console.log(this.approvalForm, '++++++++++');
              this.transferQuery.documentId = this.dataForm.id
              approvalTransferList(this.transferQuery).then(res => {
                console.log(res, '流转记录');
                this.transferData = res.data.records
              })
            }
          } else {
            this.busNodeConfig.childNode = null
          }
        })
      }

    },
    goBack() {
      this.$emit('close')
    },
    handleConfirm(value) {
      let submitFlag = true
      // 审批条件参数列表
      let nodeCondList = []
      // 审批抄送人列表
      let ccList = []
      let ccLists = []
      let nodeJudg = []
      // 业务审批单流程节点列表
      let formNodeList = []
      // 业务审批单
      let form = {}
      if (this.btnType === 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          console.log(flattenedNodes, 'flattenedNodesflattenedNodes');
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')

          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }

          console.log(ccLists, 'ccListsccLists');
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: item.name == '审核人' ? 'no' : '',
              adminId: '',
              id: '',
              previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              name: item.nodeName,
              designatedMembersId:  item.designatedMembersId ? item.designatedMembersId :  item.nodeUserList ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
              ccToId: item.targetId,
              approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
              id: '',
              defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1,
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
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }
          console.log(ccLists, 'ccListsccLists');
          // return
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              // previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              // name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalFormId: item.approvalFormId ? item.approvalFormId : this.approvalForm.id,
              approvalFormNodeCode: item.approvalFormNodeCode ? item.approvalFormNodeCode : item.code,
              ccToId: item.targetId,
              id: item.id ? item.id : ''
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
      if (value === 'submit' && this.dataForm.approvalFlag) {
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
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.dataFormTwo.productData.length) {
          this.$message({
            message: '请选择产品',
            type: 'error',
            duration: 1500,
          })
          return
        }
        this.dataFormTwo.productData.map((item, index) => {
          if (!item.newPrice) {
            this.iszhi = true
            this.$message({
              message: `第${index + 1}行新单价不能为空`,
              type: 'error',
              duration: 1500,
            })
          }
        })
        if (this.iszhi) {
          this.iszhi = false
          return
        }
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            if (this.datafilelist.length) {
              this.datafilelist.map((item, index) => {
                item.bimAttachments = {
                  businessType: 'customer',
                  documentId: item.id,
                  fileFlag: '',
                  sort: index
                }
              })
            }
            this.dataForm.documentStatus = value
            let obj = {
              attachmentList: this.datafilelist,
              adjustPrice: this.dataForm,
              adjustPriceLineList: this.dataFormTwo.productData,
              form: form,
              formNodeList,
              nodeCondList: nodeJudg,
              ccList: ccLists,
            }

            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'edit') {
              formMethod = editAdjustPrice
            } else if (this.btnType == 'add') {
              formMethod = addPriceAdjust
            }
            if (submitFlag) {
              formMethod(obj).then(res => {
                console.log(res);
                let msg = "";
                if (formMethod == addPriceAdjust) {
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
            }else{
              this.btnLoading = false
            }

          }
        })

      })
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
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        console.log(node, '提交数1');
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
    // // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = ''  // 条件符号
      let result = null     // 判断条件是否成立
      let condList = []
      getBusDetail('b021').then(res => {
          console.log(res);
          state = res.data.business.state
          condExpress = res.data.business.condExpress
          if (res.data.businessConditionList.length) {
            res.data.businessConditionList.forEach(item => {
              condList.push({
                code: item.code,
                val: item.code === 'numCode' ? this.totalNum : this.totalPrice
              })
            })
          }
          if (state === 'condition') {
            this.dataForm.approvalFlag = 1
            for (var i = 0; i < condArr.length; i++) {
              if (condExpress.includes(condArr[i])) {
                foundSymbol = condArr[i];
                break;
              }
            }
            // 找到符号并进行销售报价业务判断
            if (foundSymbol) {
              const parts = condExpress.split(foundSymbol); // 使用 ">" 符号拆分字符串
              const leftValue = parts[0]; // 提取 ">" 符号左边的值
              const rightValue = parts[1]; // 提取 ">" 符号右边的值
              console.log(leftValue);
              console.log(rightValue);
              if (leftValue == 'numCode') {
                const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
                result = eval(condition); // 执行条件判断
              } else {
                const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
                result = eval(condition); // 执行条件判断
              }
              if (result) {
                let query = {
                  businessCode: "b021",
                  condList,
                }
                busApprovalFlowTree(query).then(res => {
                  console.log(res, '树详情');
                  if (res.data) {
                    this.firstOneNode = []
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
              } else {
                this.busNodeConfig.childNode = null
              }
            }
          }
          if (state === 'enable') {
            this.dataForm.approvalFlag = 1
            let query = {
              businessCode: "b021",
              condList,
            }
            busApprovalFlowTree(query).then(res => {
              console.log(res, '树详情');
              if (res.data) {
                this.firstOneNode = []
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
          if (state === 'disabled') {
            this.dataForm.approvalFlag = 0
            this.busNodeConfig.childNode = null
          }
      })
    
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
::v-deep .workNode {
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
}
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

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
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
</style>
<style lang="scss" scoped>
$footerPadding : '10px';

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
  border-bottom: 1px solid #EBEEF5;
  background-color: #F5F7FA;
}
.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}
</style>
  