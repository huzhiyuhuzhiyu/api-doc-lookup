<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建销售合同' : btnType == 'edit' ? '编辑销售合同' : '查看销售合同'" />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            提交</el-button>
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
                <el-col :sm="8" :xs="24">
                  <el-form-item label="合同号" prop="contractNo">
                    <el-input v-model.trim="dataForm.contractNo" placeholder="请输入合同号"
                      :disabled="btnType == 'look' ? true : false" maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="所属客户" prop="cooperativePartnerId">
                    <el-input v-model="dataForm.cooperativePartnerName" placeholder="请选择所属客户" readonly @focus="openDialog"
                      :disabled="btnType == 'look' ? true : false">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="合同日期" prop="contractDate">
                    <el-date-picker v-model="dataForm.contractDate" type="date" value-format="yyyy-MM-dd"
                      style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择合同日期"
                      :disabled="btnType == 'look' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="有效时间起" prop="validityStart">
                    <el-date-picker v-model="dataForm.validityStart" placeholder="请选择有效时间" type="date"
                      :disabled="btnType == 'look' ? true : false" value-format="yyyy-MM-dd" style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="有效时间止" prop="validityEnd">
                    <el-date-picker v-model="dataForm.validityEnd" placeholder="请选择有效时间" type="date"
                      :disabled="btnType == 'look' ? true : false" value-format="yyyy-MM-dd" style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
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
              <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.data" v-bind="dataFormTwo.data" hasC hasNO fixedNO
                @cell-click="rowaction1" @selection-change="handeleProductInfoData" style="border: 1px solid #e3e7ee;">
                <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType != 'look'"
                  key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                <el-table-column prop="productCode" label="产品编码" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="productName" label="产品名称" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="drawingNo" label="产品图号" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="contractQuantity" label="数量" width="160">
                  <template slot="header">
                    <span class="required">*</span>数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'contractQuantity'"
                      :rules='productRules.contractQuantity'>
                      <el-input v-model="scope.row.contractQuantity" :disabled="btnType === 'look'" maxlength="11"
                        placeholder="请输入数量" @input="watchnums(scope.row, scope.$index)" style="width: 135px;">{{
                          scope.row.contractQuantity }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="contractQuantity" label="数量" width="160">
                  <template slot="header">
                    <span class="required">*</span>数量
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.contractQuantity" placeholder="请输入数量"
                      :disabled="btnType == 'look' ? true : false" maxlength="11"
                      @input="watchnums(scope.row, scope.$index)" style="width: 135px;">
                    </el-input>
                  </template>
                </el-table-column> -->
                <el-table-column prop="orderedQuantity" label="已下单数量" width="120" v-if="btnType == 'look'"
                  key="orderedQuantity" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="stopQuantity" label="停止数量" width="120" v-if="btnType == 'look'" key="stopQuantity"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="100" show-overflow-tooltip>
                </el-table-column>



                <el-table-column prop="price" label="单价" width="160">
                  <template slot="header">
                    <span class="required">*</span>单价
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'price'" :rules='productRules.price'>
                      <el-input v-model="scope.row.price" :disabled="btnType === 'look'" maxlength="11"
                        placeholder="请输入单价" @input="watchnums(scope.row, scope.$index)" style="width: 135px;">{{
                          scope.row.price }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="price" label="单价" width="160">
                  <template slot="header">
                    <span class="required">*</span>单价
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.price" placeholder="请输入单价" :disabled="btnType == 'look' ? true : false"
                      maxlength="11" @input="watchnums(scope.row, scope.$index)" style="width: 135px;">
                    </el-input>
                  </template>
                </el-table-column> -->
                <el-table-column prop="taxRate" label="税率%" width="160">
                  <template slot="header">
                    <span class="required">*</span>税率%
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'taxRate'" :rules='productRules.taxRate'>
                      <el-input v-model="scope.row.taxRate" :disabled="btnType === 'look'" maxlength="2"
                        placeholder="请输入数量" @input="watchnums(scope.row, scope.$index)" style="width: 135px;">{{
                          scope.row.taxRate }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="taxRate" label="税率%" width="160">
                  <template slot="header">
                    <span class="required">*</span>税率%
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.taxRate" placeholder="请输入税率" :disabled="btnType == 'look' ? true : false"
                      maxlength="2" style="width: 135px;" @input="watchnums(scope.row, scope.$index)" />
                  </template>
                </el-table-column> -->
                <el-table-column prop="totalAmount" label="总金额" width="120" show-overflow-tooltip>
                  <template slot="header">
                    <span class="required">*</span>总金额
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="230">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false"
                      maxlength="200" />
                  </template>
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


          <!-- <div class="JNPF-common-layout-left">
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
          </div> -->

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.drawingNo" placeholder="请输入产品图号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.productCode" placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="productForm.productName" placeholder="请输入产品名称" clearable />
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
                <el-table-column prop="drawingNo" label="产品图号" />
                <!-- <el-table-column prop="customerProductNo" label="客户产品编号" /> -->
                <el-table-column prop="productCode" label="产品编码"></el-table-column>
                <el-table-column prop="productName" label="产品名称" />
                <el-table-column prop="mainUnit" label="单位" />
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
import { getQuotationlist, checkQuotationBOMCodelist, editQuotationMlist, addQuotationlist } from "@/api/salesManagement/index";
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getcategoryTrees, getAttributeline, getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  data() {
    return {
      datafilelist: [],
      dataFormTwo: {
        data: []
      },
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
      // 选择全部产品参数
      allProVisible: false,
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      productRules: {
        contractQuantity: [{ required: true, trigger: 'blur' }, { validator: this.calcValidate(), trigger: 'blur' }],
        price: [{ required: true, trigger: 'blur' }, { validator: this.calcValidate(), trigger: 'blur' }],
        taxRate: [{ required: true, trigger: 'blur' }],
      },
      allproductData: [],
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
      productData: [],
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
        orderType: "normal",
        contractNo: '',
        cooperativePartnerId: '',
        contractDate: '',
        validityStart: '',
        validityEnd: '',
        remark: ''
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
        validityStart: [
          { required: true, message: '有效期起不能为空', trigger: 'change' }
        ],
        validityEnd: [
          { required: true, message: '有效期止不能为空', trigger: 'change' }
        ],
        contractNo: [
          { required: true, message: '合同号不能为空', trigger: 'blur' },
          // { validator: this.formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const inputvalue = encodeURIComponent(value)
              checkQuotationBOMCodelist(inputvalue, this.dataForm.id).then(res => {
                console.log('res===>', res);
                if (res.data) {
                  callback(new Error("合同号重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
        contractDate: [{ required: true, message: '合同日期不能为空', trigger: 'change' }],
      },
      customerData: {},
      treeLoading: false,
      selectRows: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
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
    //子表格某一单元格被点击
    rowaction1(row, column) {
      if (column.label == '产品名称' || column.label == '产品编码' || column.label == '产品图号') {
        this.$refs.product.toggleRowSelection(row)
      }
    },
    calcValidate() {
      return (rule, value, callback) => {
        let index = Number(rule.field.match(/\d+/)[0])
        let msg = `数量或单价不能为"0"`
        let flag = false
        let list = this.dataFormTwo.data
        let num_1 = Number(list[index].contractQuantity)
        let num_2 = Number(list[index].price)
        if (num_1 == 0 || num_2 == 0) { flag = true }
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
        const index = this.dataFormTwo.data.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      console.log("1234", data);
      this.dataFormTwo.data.splice(data.$index, 1)
    },
    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct() {
      this.productVisible = false
      this.selectlist.map(item => {
        this.dataFormTwo.data.map((item1) => {
          if (item.drawingNo == item1.drawingNo && item.productCode == item1.productCode && item.productName == item1.productName) {
            item.isrepeat = true
          }
        })
      });
      let noselectlist = []
      this.selectlist.map(item => {
        item.price = item.purchasePrice
        if (!item.isrepeat) {
          this.dataFormTwo.data.push(item)
        } else {
          noselectlist.push(item.productName)
          this.$message({
            message: `${noselectlist.join(',')} 产品重复`,
            type: 'error',
            duration: 1500,
          })
        }
      })
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
        console.log("客户产品数据", res);
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
      // if (!row.contractQuantity || !row.price || !row.taxRate) {
      //   return
      // }
      row.taxRate = row.taxRate.replace(/[^0-9]/g, '');
      row.contractQuantity = row.contractQuantity.replace(/[^0-9.]/g, '');

      if (row.contractQuantity.length == 1 && row.contractQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.contractQuantity = '';
      } else if (row.contractQuantity.length == 2 && row.contractQuantity[0] == '0' && row.contractQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.contractQuantity = row.contractQuantity.slice(0, 1) + '.' + row.contractQuantity.slice(1);
      } else if (row.contractQuantity.length > 2 && row.contractQuantity[0] == '0' && row.contractQuantity[1] != '.') {
        row.contractQuantity = row.contractQuantity.substring(1, row.contractQuantity.length)
      }
      if (row.contractQuantity.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.contractQuantity.length; i++) {
          const char = row.contractQuantity[i];
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
        row.contractQuantity = result;
        let arr = row.contractQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.contractQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.contractQuantity.length > 8) {
          row.contractQuantity = row.contractQuantity.substring(0, 8);
        }
      }
      row.price = row.price.replace(/[^0-9.]/g, '');

      if (row.price.length == 1 && row.price == '.') {
        // 如果第一位是小数点，则清空输入框
        row.price = '';
      } else if (row.price.length == 2 && row.price[0] == '0' && row.price[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.price = row.price.slice(0, 1) + '.' + row.price.slice(1);
      } else if (row.price.length > 2 && row.price[0] == '0' && row.price[1] != '.') {
        row.price = row.price.substring(1, row.price.length)
      }
      if (row.price.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.price.length; i++) {
          const char = row.price[i];
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
        row.price = result;
        let arr = row.price.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.price = arr[0] + '.' + arr[1]
        console.log(999666, arr);
      } else {
        if (row.price.length > 8) {
          row.price = row.price.substring(0, 8);
        }
      }
      if (!row.contractQuantity || !row.price) {
        row.totalAmount = ''
      } else {
        let a = (row.price * row.contractQuantity).toFixed(2)
        row.totalAmount = Object.is(a, NaN) ? '' : a
      }
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
    submitAllProduct() {
      this.allProVisible = false
      this.selectArr.forEach(item => {
        // item.productName = item.name,
        // item.productCode = item.code,
        // item.price = item.purchasePrice,
        item.productsId = item.id
        item.excludingTaxPrice = Number(item.purchasePrice) / (1 + Number(item.taxRate))
        this.dataFormTwo.data.push(item)
        console.log("object", this.productData);
      });
      // this.productData=[...this.productData,...this.selectArr]
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
        console.log("客户信息", res);
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
            this.dataFormTwo.data = []
            this.customerData = e
            this.dataForm.cooperativePartnerId = e.id
            this.dataForm.cooperativePartnerName = e.name
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
          this.dataFormTwo.data = []
          this.customerData = e
          this.dataForm.cooperativePartnerId = e.id
          this.dataForm.cooperativePartnerName = e.name
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
        // this.changeProvince(obj)

      }
      if (e.city) {
        let ooo = {
          id: e.city
        }
        // this.changeCity(ooo)

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
    // 选择车型
    changeCX() {

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
      if (this.btnType == 'add') {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.contractDate = this.dateFormat(end)
      }
      if (this.dataForm.id) {
        getQuotationlist(this.dataForm.id).then(res => {
          console.log("订单详情", res);
          this.$nextTick(() => {
            this.dataForm = res.data.contracts
            this.dataFormTwo.data = res.data.lines
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
      }

    },
    goBack() {
      this.$emit('close')
      console.log("cccc");
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
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
              contracts: this.dataForm,
              lines: []
            }
            if (!this.dataFormTwo.data.length) {
              this.$message({
                message: '请选择产品',
                type: 'error',
                duration: 1500,
              })
              return
            }
            this.dataFormTwo.data.forEach(item => {
              let dep = {
                active: item.active,
                createBy: item.createBy,
                contractsId: item.contractsId,
                productId: item.productsId ? item.productsId : item.productId,
                orderedQuantity: item.orderedQuantity,
                updateBy: item.updateBy,
                contractQuantity: item.contractQuantity,
                calculationDirection: item.calculationDirection,
                deputyUnit: item.deputyUnit,
                mainUnit: item.mainUnit,
                price: item.price,
                ratio: item.ratio,
                remark: item.remark,
                stopQuantity: item.stopQuantity,
                taxRate: item.taxRate,
                totalAmount: item.totalAmount,
              }

              obj.lines.push(dep)
              if (!item.contractQuantity || !item.price || !item.taxRate) {
                this.iszhi = true
                this.$message({
                  message: '数量或单价或税率不能为空',
                  type: 'error',
                  duration: 1500,
                })
              } else if (item.contractQuantity == 0 || item.price == 0) {
                this.iszhi = true
                this.$message({
                  message: '数量或单价不能为"0"',
                  type: 'error',
                  duration: 1500,
                })
              }
            })
            if (this.iszhi) {
              this.iszhi = false
              return
            }
            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'edit') {
              formMethod = editQuotationMlist
            } else if (this.btnType == 'add') {
              formMethod = addQuotationlist
            }
            formMethod(obj).then(res => {
              console.log(res);
              let msg = "";
              if (formMethod == editQuotationMlist) {
                msg = "提交成功"
              } else {
                msg = "新建成功"
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

          } else {
            this.$message({
              message: '数量或单价或税率不能为空',
              type: 'error',
              duration: 1500,
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
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

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
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
</style>
