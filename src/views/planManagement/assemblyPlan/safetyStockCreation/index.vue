<template>
  <div>
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">

        <div class="pageTitle">新建计划</div>
        <div class="options">
          <el-button type="success" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
            @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
            @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <el-form ref="dataForm" :model="planForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="计划类型" prop="planType">
                        <el-select v-model="planForm.planType" placeholder="请选择订单类型" clearable style="width: 100%;"
                          disabled>
                          <el-option v-for="(item, index) in planTypeList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="计划日期" prop="planDate">
                        <el-date-picker v-model="planForm.planDate" type="daterange" value-format="yyyy-MM-dd"
                          :disabled='btnType == "look"' style="width: 100%;" start-placeholder="开始日期" @change="changDateFun"
                          end-placeholder="结束日期" clearable>
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="planForm.remark" placeholder="请输入备注"
                          :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2" maxlength="200" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="productInfo">
                <div>
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    icon="el-icon-plus" @click="openSeleceProductDialog()">选择产品</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
                </div>

                <JNPF-table ref="product" :data="productData" :fixedNO="true" @selection-change="handeleProductInfoData"
                  border height="660" :key="165" style="width: 100%;" hasC>

                  <el-table-column type="planNo" width="60" label="计划单号" :key="1011"
                    v-if="codeConfig.codeWay != 'auto'">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.planNo" placeholder="计划单号" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6"></el-table-column>
                  <el-table-column prop="productName" label="产品名称" width="140" :key="4" />
                  <el-table-column prop="bomId" label="BOM" width="140" :key="444">
                    <template slot-scope="scope">
                      <div>{{ scope.row.bomId ? scope.row.drawingNo : "无BOM" }}</div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位" width="80" :key="89" />
                  <el-table-column prop="inventoryQuantity" label="可用库存数量" width="140" :key="8" />
                  <el-table-column prop="planQuantity" label="计划数量" width="100" :key="7">
                    <template slot="header">
                      <span class="required">*</span>计划数量
                    </template>
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.planQuantity" placeholder="计划数量"
                        oninput="value=value.replace(/^(0+)|[^\d]+/g,'')">
                      </el-input>
                    </template>
                  </el-table-column>

                  <el-table-column prop="planStartDate" label="计划开始日期" width="180" :key="13">
                    <template slot="header">
                      <span class="required">*</span>计划开始日期
                    </template>
                    <template slot-scope="scope">
                      <el-date-picker v-model="scope.row.planStartDate" type="date" value-format="yyyy-MM-dd"
                        :disabled="btnType == 'look' ? true : false" style="width: 100%;" placeholder="请选择">
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="planEndDate" label="计划结束日期" width="180" :key="139">
                    <template slot="header">
                      <span class="required">*</span>计划结束日期
                    </template>
                    <template slot-scope="scope">
                      <el-date-picker v-model="scope.row.planEndDate" type="date" value-format="yyyy-MM-dd"
                        :disabled="btnType == 'look' ? true : false" style="width: 100%;" placeholder="请选择">
                      </el-date-picker>
                    </template>
                  </el-table-column>

                  <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="211">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable
                        style="width: 100%;">
                        <el-option v-for="(item, index) in list1" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in list2" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>

                  <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable style="width: 100%;">
                        <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="oil" label="油脂" width="120" :key="61">

                    <template slot-scope="scope">
                      <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;">
                        <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51">

                    <template slot-scope="scope">
                      <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;">
                        <el-option v-for="(item, index) in list5" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>

                  <el-table-column prop="clearance" label="游隙" width="120" :key="100">

                    <template slot-scope="scope">
                      <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;">
                        <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101">

                    <template slot-scope="scope">
                      <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable style="width: 100%;">
                        <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" width="200" :key="128">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.remark" placeholder="请输入" maxlength="200" />
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="120" fixed="right" :key="15">
                    <template slot-scope="scope">

                      <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>

              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-left treeBox">
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
            <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="ProductListRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="ProductListRequestObj.name" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="ProductListRequestObj.code" placeholder="请输入产品编码" clearable />
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
                @selection-change="handleSelectionChangeAllPruduct" ref="dataTable" @row-click="handleRowClick">
                <el-table-column prop="drawingNo" label="品名规格" sortable="custom" />
                <el-table-column prop="name" label="产品名称" sortable="custom" />
                <el-table-column prop="code" label="产品编码" sortable="custom" width="140"></el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="80"></el-table-column>
                <el-table-column prop="inventoryQuantity" label="可用库存数量" sortable="custom"></el-table-column>

              </JNPF-table>
              <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum"
                :limit.sync="ProductListRequestObj.pageSize" @pagination="initData" />
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
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
        width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>
          <el-button type="primary" @click="continueAdd()"> 继续新增</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- <productForm v-if="productFormVisible" ref="productForm" @refresh="refresh" /> -->
  </div>
</template>

<script>
import { batchAddPlan } from '@/api/plan/index.js'
import { getcategoryTree as productTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getOrderDetail, addOrders, editOrders, getcategoryTrees, getAttributeline, getcooperativeProduct, getCopyOrders, getWorkOrderNo, uploadProduct, } from '@/api/salesManagement/assemblyOrders'
import { getCounryData, getCooperativeInfo, getCooperativeData, getscheduleList } from '@/api/basicData/index'
import { getProducts, getDetailByDrawNo } from '@/api/masterDataManagement/index.js' // 产品列表 
import { mapGetters, mapState } from 'vuex'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { log } from 'mathjs'

export default {


  data() {
    return {
      planTypeList: [
        { label: "订单生成计划", value: "order_plan" },
        { label: "直接创建计划", value: "add_plan" },
        { label: "安全库存创建计划", value: "safety_stock_plan" },
      ],
      planForm: { 
        planType: "safety_stock_plan",
        planDate: [],
        planStartDate: "",
        planEndDate: "",
      },
      codeConfig: {},//单据规则配置
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      btnText: "",
      tipsvisible: false,
      activeNames: ["productInfo", "basicInfo"],

      ProductListRequestObj: {
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        productStatus: 'enable',
        purchaseFlag: false,
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
      dataFormTwo: {
        data: []
      },
      submitmethodsTitle: "",
      background: true,
      datafilelist: [],
      allProVisible: false,
      // 选择全部产品参数
      ProductMethodArr: [
        { label: "产品分类", classAttribute: "", method: productTree, requeseObj: { classAttribute: "" } },
      ],
      allproductData: [],
      allProductTotal: 0,

      ProductTreeData: [],
      productData: [],
      listLoading: false,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      index: null,
      expands: true,
      refreshTree: true,
      customerVisible: false,
      btnType: undefined,
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      treeLoading: false,
      parentId: '',
      dataRule: {
        planDate: [
          { required: true, message: '计划日期不能为空', trigger: 'change' }
        ],
      },
      customerData: {},
      selectRows: [],
      selectArr: [],
      customStyleData: 0,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
  },
  mounted() {
    this.init()
    this.getProductClassFun()
  },
  beforeDestroy() {
  },
  methods: {
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {

      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa007",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj1).then(res => {
        this.list1 = res.data.records
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa006",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj2).then(res => {
        this.list2 = res.data.records
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj3).then(res => {
        this.list3 = res.data.records
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa002",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj4).then(res => {
        this.list4 = res.data.records
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa003",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj5).then(res => {
        this.list5 = res.data.records
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa001",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };

      getbimProductAttributesList(obj6).then(res => {
        this.list6 = res.data.records
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa015",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj7).then(res => {
        this.list7 = res.data.records
      })




    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }

      this.ProductListRequestObj.orderItems[0].asc = order === "ascending"
      this.ProductListRequestObj.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },


    //多选
    handleRowClick(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    // 表单选择交货日期 表格批量覆盖
    changDateFun() {
      let arr = JSON.parse(JSON.stringify(this.productData))
      if (this.productData.length) {
        arr.forEach((item, index) => {
          // item.deliveryDate = this.dataForm.deliveryDate
          if (!item.planStartDate) {
            this.$set(item, "planStartDate", this.planForm.planDate[0])
          }

          if (!item.planEndDate) {
            this.$set(item, "planEndDate", this.planForm.planDate[1])
          }
        });
        this.productData = arr
      }
    },







    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.productData.indexOf(row);
        if (index > -1) {
          this.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      this.productData.splice(data.$index, 1)
    },






    getcategoryTree() {
      this.openSeleceProductDialog()
    },

    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {

      this.allProVisible = true
      let arr = [];

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
            this.resetAllProduct()
          }
        })
      });


    },
    // 获取所有产品列表数据
    initData() {
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
      this.initData()
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.ProductListRequestObj = {
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        code: "",
        name: "",
        purchaseFlag: false,
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
      },
        this.searchAllProduct()
    },
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val


    },
    submitAllProduct() {
      console.log("所选的数据", this.selectArr);

      this.allProVisible = false
      this.selectArr.forEach(item => {
        item.productName = item.name
        item.productsId = item.id
        item.planType='safety_stock_plan'
        if (this.planForm.planDate.length) {
          this.$set(item,'planStartDate',this.planForm.planDate[0])
          this.$set(item,'planEndDate',this.planForm.planDate[1])
        
        }
        if (this.codeConfig.codeWay != 'auto') {
          item.planNo = ""
        }
        this.productData.push(item)
      });
      let uniqueArr = [];
      let idSet = new Set();

      this.productData.forEach(item => {
        if (!idSet.has(item.id)) {
          uniqueArr.push(item);
          idSet.add(item.id);
        }
      });
      this.productData = uniqueArr

    },








    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
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










    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data 

      } catch (error) {
      }
    },
    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.init('', 'add')

      this.tipsvisible = false
      this.btnLoading = false
      this.planForm = {
          planNo: "",
        planType: "add_plan",
        planDate: [],
        planStartDate: "",
        planEndDate: "",
      }
      this.productData=[]
    },
    init(id, btnType) {
      this.fetchData("JHDH")
    },

    goBack() {
      this.$router.push({
        path: "/planManagement/assemblyPlan/assemblyPlanManagement",
      })
      this.tipsvisible = false
    },



    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          let submitFlag = null;




          // this.dataForm.documentStatus = value
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

          if (this.productData.length < 1) {
            submitFlag = false
            this.$message({
              message: "请选择产品",
              type: 'error',
              duration: 1500,
            })
            return
          } else {
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.planQuantity) {
                submitFlag = false
                this.$message({
                  message: "请输入第" + (index + 1) + "行产品的计划数量",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (Number(item.num) == 0) {
                submitFlag = false
                this.$message({
                  message: "第" + (index + 1) + "行产品的计划数量必须大于0",
                  type: 'error',
                  duration: 1500,
                })
                break
              }

              if (!item.planStartDate) {
                submitFlag = false
                this.$message({
                  message: "请选择第" + (index + 1) + "行产品的计划开始日期",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (!item.planEndDate) {
                submitFlag = false
                this.$message({
                  message: "请选择第" + (index + 1) + "行产品的计划结束日期",
                  type: 'error',
                  duration: 1500,
                })
                break
              }



            }

          }
          this.productData.forEach(item => {
            item.documentStatus=value
          });
          if (submitFlag === false) return
          this.btnLoading = true

          batchAddPlan(this.productData).then(res => {
            let msg = "";
            if (value == "draft") {
              this.submitmethodsTitle = "保存成功"
            } else {
              this.submitmethodsTitle = "提交成功"

            }
            this.tipsvisible = true

          }).catch(() => {
            this.btnLoading = false
          })

        }
      })
    },

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
  margin-bottom: 10px
}



//.el-button--small {
// padding: 1;
//}</style>
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
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
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
  padding-bottom: 0px
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
  border-bottom: none !important
}

.options {
  display: inline-block;
  float: right;
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