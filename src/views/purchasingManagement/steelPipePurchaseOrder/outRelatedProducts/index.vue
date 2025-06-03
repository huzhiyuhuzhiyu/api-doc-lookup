<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 4">
                <el-form-item>
                  <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                    @keyup.enter.native="search('basic')" />
                  <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                    clearable>
                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                    :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                    :type="item.dateType"
                    :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="addFun()">新建</el-button>
             
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="advanceFun" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table :partentOrChild="'dataTable'" ref="dataTable" :data="tableData"  
            :fixedNO="true"  
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="purchasePartnerName" label="采购供应商名称" min-width="180" sortable="custom" />
            <el-table-column prop="outPartnerName" label="外协供应商名称" min-width="180" sortable="custom" />
            <el-table-column prop="outProductName" label="产品名称" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="outProductCode" label="产品编码" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="outProductDrawingNo" label="品名规格" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="yieldRate" label="成材率" min-width="120" sortable="custom"> </el-table-column>
            <el-table-column prop="buyBackPrice" label="回购单价" min-width="120" sortable="custom"> </el-table-column>
            <!-- <el-table-column prop="buyBackRate" label="回购税率(%)" min-width="120" sortable="custom"> </el-table-column> -->
            <el-table-column prop="remark" label="备注" min-width="200" sortable="custom"> </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="editFun(scope.row, 'edit')">编辑</el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope.row.id,)">删除</el-button>
               
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="addOrderVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="dataForm" :rules="dataRule" label-width="120px" label-position="left">
          <el-col :span="24">
            <el-form-item label="采购供应商" prop="purchasePartnerName">
              <ComSelect-page clearable :isdisabled="btnType === 'look'" :treeNodeClick="treeNodeClickPurchase"
                            v-model="dataForm.purchasePartnerName" :beforeSubmit="beforeSubmitPurchase" ref="ComSelect-page"
                            @change="selectPurchasePartner" :tableItems="PartnerTableItems" :placeholder="'请选择采购供应商'"
                            title="选择采购供应商" treeTitle="采购供应商分类" :methodArr="purchasePartnerMethodArr"
                            :listMethod="getCooperativeData" :listRequestObj="purcashePartnerListRequestObj"
                            :paramsObj="{ oldDataPurchase }" :searchList="PartnerTableSearchList" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="外协供应商" prop="outPartnerName">
              <ComSelect-page clearable :isdisabled="btnType === 'look'" :treeNodeClick="treeNodeClick"
                            v-model="dataForm.outPartnerName" :beforeSubmit="beforeSubmit" ref="ComSelect-page"
                            @change="selectOutPartner" :tableItems="PartnerTableItems" :placeholder="'请选择外协供应商'"
                            title="选择外协供应商" treeTitle="外协供应商分类" :methodArr="outPartnerMethodArr"
                            :listMethod="getCooperativeData" :listRequestObj="outPartnerListRequestObj"
                            :paramsObj="{ oldData }" :searchList="PartnerTableSearchList" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="品名规格" prop="outProductDrawingNo">
              <el-input v-model="dataForm.outProductDrawingNo" placeholder="品名规格" :disabled="btnType === 'look'"  readonly @focus="addProduct"/>
            </el-form-item>
          </el-col>
     
          <el-col :span="24">
            <el-form-item label="成材率" prop="yieldRate">
              <el-input v-model="dataForm.yieldRate" placeholder="成材率" clearable :disabled="btnType === 'look'"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item :label="this.isXL?'毛坯加工单价':'回购单价'" prop="buyBackPrice">
              <el-input v-model="dataForm.buyBackPrice" placeholder="回购单价" clearable :disabled="btnType === 'look'"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="回购税率" prop="buyBackRate">
              <el-select v-model="dataForm.buyBackRate" placeholder="请选择" style="width: 100%;" :disabled="btnType === 'look'">
                      <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.enCode"
                        :value="item.taxRate"></el-option>
                    </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="仓库名称" prop="warehouseName">
              <ComSelect-list v-model="dataForm.warehouseName" :disabled="btnType === 'look'" :requestObj="{ type: 'normal', state: 'enable',  }" :dialogTitle="'选择仓库'"  :method="getWarehouseList" placeholder="请选择仓库" @change="changeWarehousex"></ComSelect-list>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" placeholder="请输入备注"  type="textarea" :rows="2" maxlength="200"   clearable :disabled="btnType === 'look'"/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrderVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitFun()">
          提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

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
      <el-tree ref="treeBox" :data="ProductTreeData" :props="defaultProps" :default-expand-all="expands" highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeAllProduct" class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNodeAllProduct">
        <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
          <i :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
          <span class="text" :title="data.name">{{ data.name }}</span>
        </span>
      </el-tree>
    </el-scrollbar>
      </div>
      <div class="JNPF-common-layout-center JNPF-flex-main">
    <el-row class="JNPF-common-search-box" :gutter="16">
      <el-form @submit.native.prevent>
        <el-col :span="6" v-if="abProjectSwitchVisible">
          <el-form-item>
            <el-select v-model="ProductListRequestObj.projectId" placeholder="请选择所属项目" style="width: 100%;" filterable
       >
        <el-option v-for="item in projectIdData" :key="item.id" :label="item.name"
          :value="item.id"></el-option>
      </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.productCode" placeholder="请输入产品编码" clearable />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6" >
          <el-form-item>
            <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.drawingNo" placeholder="请输入品名规格" clearable />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item>
            <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
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
      <JNPF-table v-loading="listLoading" :data="allproductData"  ref="dataTable" @row-click="handleRowClick" customKey="JNPFTableKey_903180">
        <el-table-column prop="code" label="产品编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="产品名称" width="160"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="drawingNo" label="品名规格" />
        <el-table-column prop="productCategoryName" label="所属分类" />
        <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom" v-if="isProjectSwitch == 1" />
        <el-table-column prop="mainUnit" label="单位" />
        <el-table-column prop="inventoryQuantity" label="库存数量">
          <template slot-scope="scope">
            <el-link type="primary" @click.native="viewFun(scope.row, 'inventoryFlag')">
              {{ scope.row.inventoryQuantity }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" >
              <template slot-scope="scope" >
                <el-button type="text" @click="selectFun(scope.row)">选择</el-button>
              </template>
            </el-table-column>
      </JNPF-table>
      <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum" :limit.sync="ProductListRequestObj.pageSize" @pagination="initData2" />
    </div>
      </div>
      </div>
    
    </el-dialog>
        <!-- 高级查询 -->
        <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
      <Form v-if="productVisible" ref="Form"></Form>

  </div>
</template>
<script>
import { getCooperativeData, getcategoryTree, getBimBusinessDetail } from '@/api/basicData/index'
import { getcategoryTree as productTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
 
import {  outRelatedProductList,addOutRelatedProduct,editOutRelatedProduct,delOutRelatedProduct} from '@/api/purchasingAndOutsourcingOrders/index';


import { ordershengchanList, addOrderNum, detailordershengchan } from '@/api/productOrdes/index.js'
import { prodOrderClose } from '@/api/productOrdes/finishedProductOrders.js'
import { UserListAll, } from '@/api/permission/user'
import { getWarehouseList } from '@/api/basicData/index'

import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import { getPrintBusInfo } from '@/api/system/printDev'
import { getProducts } from '@/api/masterDataManagement/index.js' // 产品列表


import { getPrintList } from '@/api/system/printDev'
import { excelExport, getOrderFiledMap,getProductionLineList } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import Form from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventory/Form.vue'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
import tenantMinix from "@/mixins/generator/TenantMinix"

// import TaskForm from './taskForm.vue'
import QRCode from 'qrcodejs2'
export default {
  name: 'outRelatedProducts',
  components: { SuperQuery,Form},
  mixins: [getProjectList,AbProjectMixin,tenantMinix],
  data() {
    return {
      allProVisible:false,
      taxRateList: [],
      getWarehouseList,
      searchList: [
        { field: 'outProductName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'outProductCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'outPartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码', fixed: 'left' },
        { prop: 'name', label: '供应商名称', fixed: 'left' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      //  外协供应商 树请求
      outPartnerMethodArr: { method: getcategoryTree, requestObj: { type: 'outsourcing_suppliers' } },
      purchasePartnerMethodArr:{ method: getcategoryTree, requestObj: { type: 'supplier' } },
      getCooperativeData,
      getcategoryTree,
      // 供应商请求参数
      outPartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'outsourcing_suppliers'
      },
      purcashePartnerListRequestObj:{
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      },
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '供应商编码', type: 'input' },
        { prop: 'name', label: '供应商名称', type: 'input' }
      ],
      oldData:[],
      oldDataPurchase:[],
      dataForm:{
        purchasePartnerName:"",
        purchasePartnerId:"",
        purchasePartnerCode:"",
        outPartnerName:"",
        outPartnerId:"",
        outProductName:"",
        outProductId:"",
        outProductCode:"",
        outProductDrawingNo:"",
        yieldRate:"",
        buyBackPrice:"",
        buyBackRate:"",
        warehouseName:"",
        warehouseId:"",
        warehouseType:"",
        warehouseCode:"",
        remark:"",
      },
      superQuery: {},
      superForm: {},
      basicQuery: {},
      orderForm: {},
      orderFormlist: {
        outProductName:"",
        outProductCode:"",
        outPartnerName:"",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      total: 0,
      addOrderVisible:false,
      ProductTreeData: [],
      expands: true,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      ProductListRequestObj: {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        saleFlag: true,
        projectId:"",
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
      ProductMethodArr: [
        {
          label: "产品分类", classAttribute: "", method: productTree, requeseObj: {
            classAttribute: "", type: "material",
          }
        },
      ],
      btnType:"",

  
    
 
      columnList: [],
      superQueryVisible: false,
      btnLoading: false,
      title: "",
      tableData: [],
      listLoading: false,
      detailFlag: false,

      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'outProductName',
          label: "供应商名称",
          type: 'input'
        },
        {
          prop: 'outProductName',
          label: "产品名称",
          type: 'input',
        },
        {
          prop: 'outProductCode',
          label: "产品编码",
          type: 'input',
        },
        {
          prop: 'outProductDrawingNo',
          label: "品名规格",
          type: 'input',
        },
        {
          prop: 'warehouseName',
          label: "仓库名称",
          type: 'input',
        },
      ],

      dataRule: {
        outPartnerName: [{ required: true, message: '请选择外协供应商', trigger: ['change'] }],
        purchasePartnerName: [{ required: true, message: '请选择采购供应商', trigger: ['change'] }],
        outProductDrawingNo: [{ required: true, message: '请选择产品', trigger: ['change'] }],
        // buyBackRate: [{ required: true, message: '请选择回购税率', trigger: ['change'] }],
        warehouseName: [{ required: true, message: '请选择仓库', trigger: ['change'] }],
        yieldRate: [{ required: true, message: '请输入成材率', trigger: ['blur'] }],
        buyBackPrice: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["回购单价不能为空", (errMsg, index) => { this.$message.error(`回购单价：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 12, "", (errMsg) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' } 
        ],
      },
      
      workOrderData: [],
   productVisible:false,
   
 
    }
  },
  async created() {
    this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getProductClassFun()
  },
  methods: {
        // 查看库存明细
    viewFun(row) {
      this.productVisible = true
      this.$set(row,'productsId',row.id)
      this.$nextTick(() => {
        this.$refs.Form.init(row, 'inventoryFlag', "", row.projectId)
      })
    },
    selectFun(row) {
      this.allProVisible = false
      this.dataForm.outProductCode=row.code
      this.dataForm.outProductId=row.id
      this.dataForm.outProductName=row.name
      this.dataForm.outProductDrawingNo=row.drawingNo
    },
    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
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
        projectId:'',
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
      if (this.isProjectSwitch === '1') {
        console.log(this.userInfo,'ss')
        this.ProductListRequestObj.projectId = this.userInfo.userProjectId
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
            this.initData2()
          }
        })
      });

    },
    // 获取所有产品列表数据
    initData2() {
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
    // 搜索所有产品 列表
    searchAllProduct() {
      this.ProductListRequestObj.pageNum = 1
      this.initData2()
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.ProductListRequestObj = {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        saleFlag: true,
        projectId:"",
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
      }
      if (this.isProjectSwitch === '1') {
        console.log(this.userInfo,'ss')
        this.ProductListRequestObj.projectId = this.userInfo.userProjectId
      }
        this.searchAllProduct()
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
    // 表单切换仓库
    changeWarehousex(val, data) {
      console.log("data", data);
      if (!val && !data.length) {
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.warehouseType = ""
        this.dataForm.warehouseCode = ""
        return
      } 

      this.dataForm.warehouseId = data[0].id
      this.dataForm.warehouseName = data[0].name
      this.dataForm.warehouseType = data[0].all.type
      this.dataForm.warehouseCode = data[0].all.code
      this.$nextTick(() => {
        this.$refs['diaForm'].validateField('warehouseName')
      })
    },
    getProductClassFun() {
    
      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    addFun(){
      this.btnType='add'
      this.title="新建委外关联产品"
      this.addOrderVisible=true
      this.dataForm.outPartnerName=''
        this.dataForm.outPartnerId=''
        this.dataForm.outProductName=''
        this.dataForm.outProductId=''
        this.dataForm.outProductCode=''
        this.dataForm.outProductDrawingNo=''
        this.dataForm.yieldRate=''
        this.dataForm.buyBackPrice=''
        this.dataForm.buyBackRate=''
        this.dataForm.warehouseName=''
        this.dataForm.warehouseId=''
        this.dataForm.warehouseType=''
        this.dataForm.warehouseCode=''
        this.dataForm.remark=''
        this.dataForm.id=''
      this.$nextTick(()=>{
          this.$refs['diaForm'].resetFields()
      })
    },
    editFun(row,type){
      this.btnType='edit'
      this.title="编辑委外关联产品"
      this.addOrderVisible=true
        this.dataForm.outPartnerName=row.outPartnerName
        this.dataForm.outPartnerId=row.outPartnerId
        this.dataForm.outProductName=row.outProductName
        this.dataForm.outProductId=row.outProductId
        this.dataForm.outProductCode=row.outProductCode
        this.dataForm.outProductDrawingNo=row.outProductDrawingNo
        this.dataForm.yieldRate=row.yieldRate
        this.dataForm.buyBackPrice=row.buyBackPrice
        this.dataForm.buyBackRate=row.buyBackRate
        this.dataForm.warehouseName=row.warehouseName
        this.dataForm.warehouseId=row.warehouseId
        this.dataForm.warehouseType=row.warehouseType
        this.dataForm.warehouseCode=row.warehouseCode
        this.dataForm.remark=row.remark
        this.dataForm.id=row.id
    },
   // 弹窗节点的点击
   treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    treeNodeClickPurchase(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 打开选择供应商弹窗
    // 切换供应商后给的提示
    async beforeSubmit(data, paramsObj) {
      // if (!this.dataForm.transferOutWarehouseName) return true
      let flag = true
      if (paramsObj.oldData.length) {
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
            // this.$refs['productForm'].resetFields()
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
    async beforeSubmitPurchase(data, paramsObj) {
      // if (!this.dataForm.transferOutWarehouseName) return true
      let flag = true
      if (paramsObj.oldDataPurchase.length) {
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
            // this.$refs['productForm'].resetFields()
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
    selectPurchasePartner(id,data){
      console.log("id,",id,data);
      this.$nextTick(() => {
        this.$refs['diaForm'].validateField('purchasePartnerName')
      })
      if (data.length === 0) {
        this.dataForm.purchasePartnerName = ''
        this.dataForm.purchasePartnerCode = ''
        this.dataForm.purchasePartnerId = ''
        this.oldDataPurchase = []
      } else {
        if (this.oldDataPurchase.length) {
        } else {
          this.oldDataPurchase.push(data)
        }
        this.dataForm.purchasePartnerName = data[0].all.name
        this.dataForm.purchasePartnerCode = data[0].all.code
        this.dataForm.purchasePartnerId = data[0].all.id
     
      }
    },
    selectOutPartner(id,data){
      console.log("id,",id,data);
      this.$nextTick(() => {
        this.$refs['diaForm'].validateField('outPartnerName')
      })
      if (data.length === 0) {
        this.dataForm.outPartnerName = ''
        this.dataForm.outPartnerCode = ''
        this.dataForm.outPartnerId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.outPartnerName = data[0].all.name
        this.dataForm.outPartnerCode = data[0].all.code
        this.dataForm.outPartnerId = data[0].all.id
     
      }
    },
    //  提交
    submitFun() {
      console.log(555555555);
      console.log("this.$refs['diaForm']",this.$refs['diaForm']);
      this.$refs['diaForm'].validate((valid) => {
        console.log(4444);
        if (valid) { 
          let methods=null
          this.btnLoading = true
          if(this.btnType=='add'){
            methods=addOutRelatedProduct
          }else{
            methods=editOutRelatedProduct
          }
          methods(this.dataForm).then(res => {
            this.addOrderVisible = false
            this.btnLoading = false
            this.$message.success("新建委外关联产品成功")
            this.search('basic')
          }).catch(error => {
            this.btnLoading = false
          })
        }
      })
    },
    
 
 

    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' ||prop=='productionLineNmae'|| prop == 'pairingModeName' || prop == 'productName' || prop == 'projectName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'productDrawingNo' || prop == 'productCode' || prop == 'routingName' || prop == 'routingCode') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
 
    initData() {
      this.listLoading = true
      this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      outRelatedProductList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
      { field: 'outProductName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'outProductCode', fieldValue: '', label: '产品编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'outPartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
      ],
        this.search('basic')
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delOutRelatedProduct(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
 
 
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
 
    
 
  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
  margin-bottom: 5px;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}
::v-deep #qrcode img{
  margin: 0 auto;
}
</style>
