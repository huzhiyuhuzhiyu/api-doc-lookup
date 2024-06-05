<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form" ref="main">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          :content="btnType == 'add' ? '新建计划' : btnType == 'edit' ? '编辑计划' : btnType == 'look' ? '查看计划' : ''" />
        <div class="options" v-if="btnType != 'look'">
          <el-button v-if="type == 'add_plan'" type="success" :loading="btnLoading" @click="handleConfirm('draft')"
            :disabled="dataForm.planType == 'order_plan'">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="计划管理信息" name="orderInfo" class="jcInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">

                <el-col :sm="8" :xs="24">
                  <el-form-item label="计划类型" prop="planType">
                    <el-select v-model="dataForm.planType" placeholder="请选择计划类型" clearable style="width: 100%;" disabled>
                      <el-option v-for="(item, index) in planTypeList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24" v-if="dataForm.planType == 'order_plan'">
                  <el-form-item label="销售订单" prop="ordersNo">
                    <el-input readonly placeholder="请选择订单" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.ordersNo" @focus="openOrderDia"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24" v-if="dataForm.planType=='add_plan'">
                  <el-form-item label="工作令号" prop="workOrderNo" v-if="btnType!='add'">
                    <el-input v-model="dataForm.workOrderNo" :readonly="dataForm.planType == 'order_plan'"
                      placeholder="请输入工作令号" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24" v-else>
                  <el-form-item label="工作令号" prop="workOrderNo">
                    <el-input v-model="dataForm.workOrderNo" :readonly="dataForm.planType == 'order_plan'"
                      placeholder="请输入工作令号" :disabled="btnType == 'look' ? true : false" />
                  </el-form-item>
                </el-col>

                <el-col :sm="16" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2"
                      :disabled="btnType == 'look' ? true : false" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>
              <TableForm-product :value="orderDetailData" @input="contentChanges" ref="sleeveForm"
                :tableItems="linesListItems" :openMode="openMode" :planType="dataForm.planType" @addth="addOrDelLinesItem"
                @deleteth="addOrDelLinesItem" customStyle/>

          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
          </el-tab-pane>
          <!-- <el-tab-pane label="审批流" name="approval">
          </el-tab-pane> -->
        </el-tabs>
      </div>
      <el-dialog title="选择销售订单" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="orderVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="handleClose">

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.orderNo" placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerCode" placeholder="请输入客户编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerName" placeholder="请输入客户名称" clearable />
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
              <JNPF-table v-loading="listLoading" :data="orderData" :fixedNO="true">
                <el-table-column prop="orderNo" label="订单号" width="160" fixed="left"></el-table-column>

                <el-table-column prop="cooperativePartnerCode" label="客户编码" width="160" />
                <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="200" />
                <el-table-column prop="workOrderNo" label="工作令号" width="160"></el-table-column>
                <el-table-column prop="sourceOrderNo" label="来源单号" width="160"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="220" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />

                <el-table-column label="操作" width="100" >
                  <template slot-scope="scope">
                    <el-button type="text" size="mini" :disabled="selectFlag" @click="selectOrder(scope.row)">
                      选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="initData" />
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
                    <el-input v-model="ProductListRequestObj.code" placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="ProductListRequestObj.name" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="ProductListRequestObj.drawingNo" placeholder="请输入图号" clearable />
                  </el-form-item>
                </el-col>


                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchAllProduct()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetAllProduct()">{{ $t('common.reset')
                    }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="allproductData" hasC
                @selection-change="handleSelectionChangeAllPruduct">
                <el-table-column prop="code" label="产品编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="产品名称" />
                <el-table-column prop="drawingNo" label="图号" />
                <el-table-column prop="spec" label="规格型号" />

              </JNPF-table>
              <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum"
                :limit.sync="ProductListRequestObj.pageSize" @pagination="initData2" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="allProVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
            确定</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>

import { getOrderDetail, getsaleOrderList, } from '@/api/salesManagement/assemblyOrders'
import { addPlanList, updatePlanList, detailPlanList } from '@/api/calculationList/calculationList'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import TableFormProduct from './TableForm-product/index' // 产品选择组件

export default {
  computed: {
    isdeleteFun() {
      let deleteth = null;
      if (this.dataForm.planType == 'add_plan') {
        deleteth = { deleteth: this.deleteth }
      } else {
        deleteth = {}
      }
      return deleteth
    }
  },
  components: { TableFormProduct },
  data() {
    return {
      openMode: "只读",
      tableFlag: false,
      refreshTree: true,
      allProVisible: false,
      selectFlag: false,
      linesListItems: [
        { prop: "productCode", label: "产品编码", value: "", type: 'view', width: "180", fixed: "" },
        { prop: "productName", label: "产品名称", value: "", type: 'view', width: "180", },
        { prop: "productDrawingNo", label: "产品图号", value: "", type: 'view', width: "180", },
        { prop: "bomFlagText", label: "是否有BOM", value: "", type: 'view', width: "160", },
        
        // { prop: "routingCode", label: "工艺路线编码", value: "", type: 'view', width: "180", },
        // { prop: "routingName", label: "工艺路线名称", value: "", type: 'view', width: "180", },
        { prop: "productSourceLabel", label: "产品来源", value: "", type: 'view', width: "120", },
        { prop: "planQuantity", label: "计划数量", value: "", type: 'view', width: "180", change: this.changePlanNum },
        { prop: "relaxQuantity", label: "宽放数量", value: 0, type: 'input', width: "180", change: this.changePlanNum, maxlength: 11, itemRules: [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [20, 4, false, errMsg => { this.$message.error(`宽放数量：${errMsg}`) }] }), trigger: 'blur' }] },
        { prop: "finalPlanQuantity", label: "最终计划数量", value: "", type: 'view', width: "180", },
        { prop: "mainUnit", label: "单位", value: "", type: 'view', width: "180", },
        { prop: "deliveryDate", label: "交货日期", value: "", type: 'view', width: "200" },
        { prop: "remark", label: "备注", value: "", type: 'input', maxlength: 200, width: "180" },

      ],
      planTypeList: [
        { label: "订单计划", value: "order_plan" },
        { label: "新建计划", value: "add_plan" }
      ],
      orderVisible: false,
      listLoading: false,
      total: 0,
      orderDetailData: [],
      orderData: [],
      dataForm: {
        planType: "",
        workOrderNo: "",
        remark: "",
        documentStatus: "",
        ordersId: "",
        ordersNo: "",
      },
      orderForm: {
        planStatus: "not_generated",
        hideProduce: true,
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        pageNum: 1,
        pageSize: 20,
        ordersNo: "",
        orderState: "not_finish",
        documentStatus: "submit",
        distributeStatus: "distributed",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      btnType: undefined,
      activeName: "orderInfo",
      nodeId: -1,
      btnLoading: false,
      formLoading: false,
      parentId: '',
      dataRule: {
        ordersNo: [
          { required: true, message: '销售订单不能为空', trigger: 'change' }
        ],
        workOrderNo: [
          { required: true, message: '请输入工作令号', trigger: 'blur' }
        ],
      },
      ProductMethodArr: [
      { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ],
      allproductData: [],
      allProductTotal: 0,

      ProductTreeData: [],
      ProductListRequestObj: {
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        classAttribute: "",
        drawingNo: "",
        productCategoryId: "",
        queryType: 1,

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
      selectRows: [],
      selectArr: [],
      treeLoading: false,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      expands: true,
      selectRows: [],
      type: ""
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },
  },
  created() {

  },
  mounted() {

  },
  methods: {
    changePlanNum(e, scope) {
      // planQuantity,relaxQuantity,finalPlanQuantity
      this.orderDetailData[scope.$index].planQuantity = Number(scope.row.planQuantity) < 0 ? 0 :scope.row.planQuantity.replace(/[^\d.]/g, '')
      this.orderDetailData[scope.$index].relaxQuantity = !Number(scope.row.relaxQuantity)  ? 0 : scope.row.relaxQuantity.replace(/[^\d.]/g, '')
      let totalNum = Number(scope.row.planQuantity) + Number(scope.row.relaxQuantity)
       this.$set(this.orderDetailData[scope.$index],'finalPlanQuantity',totalNum)
      this.$forceUpdate()
    },
    // 对应子数据新增或删除行
    addOrDelLinesItem(data) {
      let type = Array.isArray(data) ? 'Array' : 'Object'
      if (type === 'Object') { this.orderDetailData.splice(data.$index, 1) }
      else {
        let tempList = JSON.parse(JSON.stringify(this.orderDetailData))
        let hasItemList = []
        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          item.remark = ""
          const hasFlag = this.orderDetailData.find(i => item.productId === i.productId)
          if (hasFlag) { hasItemList.push(item.productName) }
          else { tempList.push(item) }
          if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
        }
        this.orderDetailData = JSON.parse(JSON.stringify(tempList))
        this.orderDetailData.forEach(item => {
          if (item.productSource == 'produce') {
            item.productSourceLabel = "生产"
          } else if (item.productSource == 'purchase') {
            item.productSourceLabel = "采购"
    
          // item.routingCode=""
          // item.routingId=""
          // item.routingName=""
          } else if (item.productSource == 'out') {
            item.productSourceLabel = "外协"
          //   item.routingCode=""
          // item.routingId=""
          // item.routingName=""
          }
        item.bomFlagText=item.bomId?"是":"否"
         
          item.productName = item.name
          item.productDrawingNo = item.drawingNo
          item.productCode = item.code
          item.productsId = item.id
        });
        this.$nextTick(() => { this.$refs.sleeveForm.setDefaultValue() });
      //   this.$nextTick(() => {
      //   let tBody = document.querySelectorAll('.el-table')[1]
      //   tBody.style.height = 'auto'
      //   tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
      // });
      }
    },
    contentChanges(dataOrIndex, prop, value) {
      if (Array.isArray(dataOrIndex)) {
        this.orderDetailData = JSON.parse(JSON.stringify(dataOrIndex))
      } else if (prop) {
        this.orderDetailData[dataOrIndex][prop] = value
      }
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
        const index = this.orderDetailData.indexOf(row);
        if (index > -1) {
          this.orderDetailData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    deleteth(data) {
      this.orderDetailData.splice(data.$index, 1)
    },
    handleSelectionChange(val) {
      this.selectRows = val

    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.ProductListRequestObj = {
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        classAttribute: "",
        drawingNo: "",
        productCategoryId: "",
        queryType: 1,
        productStatus: 'enable',

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
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {

      this.selectArr = val
   

    },
    submitAllProduct() {
      this.allProVisible = false
      console.log(5555);
      this.selectArr.forEach(item => {
        item.productName = item.name
        item.productDrawingNo = item.drawingNo
        item.productCode = item.code
        item.productsId = item.id 
        
        // if (item.productSource == 'purchase') {
        //   item.routingCode=""
        //   item.routingId=""
        //   item.routingName=""
        // } else if (item.productSource == 'out') {
        //   item.routingCode=""
        //   item.routingId=""
        //   item.routingName=""
        // }
        console.log("item",item);
        this.orderDetailData.push(item)
      });
      console.log("this.orderDetailData",this.orderDetailData);
      this.$nextTick(() => {
        let tBody = document.querySelectorAll('.el-table')[1]
        tBody.style.height = 'auto'
        tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
      });
    },
    // 搜索所有产品 列表
    searchAllProduct() {
      this.ProductListRequestObj.pageNum = 1
      this.initData2()
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
        this.allProductTotal = listRes.data.total
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      })
    },
    openSeleceProductDialog() {
      this.allProVisible = true
      let arr = [];
      this.ProductListRequestObj = {
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        classAttribute: "",
        drawingNo: "",
        productCategoryId: "",
        queryType: "1",
        productStatus: 'enable',

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
            this.initData2()
          }
        })
      });
    },

    handleClick() {

    },
    // 弹框中选择订单
    selectOrder(row) {
      this.dataForm.ordersNo = row.orderNo
      this.dataForm.originNo = row.orderNo
      this.dataForm.ordersId = row.id
      this.dataForm.workOrderNo = row.workOrderNo
      this.orderDetailData = []
      getOrderDetail(row.id).then(res => {
        this.selectFlag = true
        this.orderVisible = false
        this.selectFlag = false

        res.data.orderLines.forEach(item => {



          if (Number(item.productionQuantity) > 0) {
            let obj = {
              bomName: item.bomName,
              bomCode: item.bomCode,
              bomId: item.bomId,
              deliveryDate: item.deliveryDate ? item.deliveryDate : "",
              mainUnit: item.mainUnit ? item.mainUnit : "",
              deputyUnit: item.deputyUnit ? item.deputyUnit : "",
              ordersLineId: item.id ? item.id : "",
              planQuantity: item.productionQuantity,
              productsId: item.productsId ? item.productsId : "",
              ratio: item.ratio ? item.ratio : "",
              calculationDirection: item.calculationDirection,
              remark: item.remark ? item.remark : "",
              // routingCode: item.routingCode,
              // routingId: item.routingId,
              // routingName: item.routingName,
              productSource: "produce",
              productCode: item.productCode ? item.productCode : "",
              productName: item.productName ? item.productName : "",
              productDrawingNo: item.drawingNo ? item.drawingNo : "",
              productSourceLabel: "生产",
              orderId: row.id ? row.id : "",
              relaxQuantity: 0,
              finalPlanQuantity:item.productionQuantity,
              bomFlagText:item.bomId?"是":"否"
            }
            this.orderDetailData.push(obj)


          }
          if (Number(item.outsourcingQuantity) > 0) {
            let obj = {
              bomName: item.bomName,
              bomCode: item.bomCode,
              bomId: item.bomId,
              deliveryDate: item.deliveryDate ? item.deliveryDate : "",
              mainUnit: item.mainUnit ? item.mainUnit : "",
              deputyUnit: item.deputyUnit ? item.deputyUnit : "",
              ordersLineId: item.id ? item.id : "",
              planQuantity: item.outsourcingQuantity,
              productsId: item.productsId ? item.productsId : "",
              ratio: item.ratio ? item.ratio : "",
              calculationDirection: item.calculationDirection,
              remark: item.remark ? item.remark : "",
              // routingCode: "",
              // routingId: "",
              // routingName:  "",
              productSource: "out",
              productCode: item.productCode ? item.productCode : "",
              productName: item.productName ? item.productName : "",
              productDrawingNo: item.drawingNo ? item.drawingNo : "",
              productSourceLabel: "外协",
              orderId: row.id ? row.id : "",
              relaxQuantity: 0,
              finalPlanQuantity:item.outsourcingQuantity,
              bomFlagText:item.bomId?"是":"否"
            }
            this.orderDetailData.push(obj)
          }
          // out,produce,purchase 外协、生产、采购
          // utilizationQuantity,productionQuantity,purchaseQuantity,outsourcingQuantity
        })
      })
    },
    handleClose() {
      this.orderVisible = false
    },
    search() {
      this.orderForm.pageNum = 1
      this.getOrderData()
    },
    reset() {
      this.orderForm = {
        planStatus: "not_generated",
        cooperativePartnerCode: "",
        hideProduce: true,
        cooperativePartnerName: "",
        pageNum: 1,
        pageSize: 20,
        ordersNo: "",
        orderState: "not_finish",
        documentStatus: "submit",
        distributeStatus: "distributed",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
      this.search()
    },
    openOrderDia() {
      this.orderVisible = true
      // 获取销售订单的数据
      this.getOrderData()
    },
    getOrderData() {
      getsaleOrderList(this.orderForm).then(res => {
        this.orderData = res.data.records
        this.total = res.data.total
      })
    },
    goBack() {
      this.$emit('close')
    },
    initData() {
      this.getOrderData()
    },
    init(id, btnType, type) {
      this.type = type
      this.dataForm.id = id || ''
      if (type && type == 'add_plan') {
        this.dataForm.planType = 'add_plan'
        if (btnType == "edit") {

          this.openMode = "编辑"
        } else if (btnType == "add") {
          this.openMode = "新建"

        } else if (btnType == "look") {
          this.openMode = "只读"

        }
        this.linesListItems.forEach(item => {
          if (item.prop == "planQuantity") {
            item.type = 'input'
            item.maxlength = 11
            item.itemRules = [{ required: true, trigger: "blur" }, { validator: this.formValidate({ type: 'decimal', params: [20, 4, false, errMsg => { this.$message.error(`计划数量${errMsg}`) }] }), trigger: 'blur' }]
            this.$forceUpdate()
          }
          if (item.prop == "productName") {
            item.type = 'view'
            item.itemRules = [{ required: true, trigger: "blur" },]
            this.$forceUpdate()
          }
          if (item.prop == 'deliveryDate') {
            item.type = 'date'
            item.itemRules = [{ required: true, trigger: "change" },]
          }
        });
      } else if (type && type == 'order_Plan') {
        this.dataForm.planType = 'order_plan'
        if (btnType == "edit") {

          this.openMode = "编辑"
        } else if (btnType == "add") {
          this.openMode = "新建"

        } else if (btnType == "look") {
          this.openMode = "只读"

        }
      }
      this.btnType = btnType
      this.tableFlag = true
      if (this.dataForm.id) {
        detailPlanList(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            this.dataForm = res.data.plan
            res.data.planLineList.forEach(item => {
              if (item.productSource == 'produce') {
                item.productSourceLabel = "生产"
              } else if (item.productSource == 'purchase') {
                item.productSourceLabel = "采购"
              } else if (item.productSource == 'out') {
                item.productSourceLabel = "外协"
              }
              item.bomFlagText=item.bomId?"是":"否"

            });
            this.orderDetailData = res.data.planLineList

          })

        })

      }
    },
    goBack() {
      this.$emit('close')
    },
    async handleConfirm(value) {
      let focusFlag = true // 自动聚焦是否可用

      // 校验表单
      let form_1 = this.$refs['dataForm']
      let valid_1 = await form_1.validate().catch(() => false)
      if (!valid_1 && focusFlag) {
        // 校验失败，聚焦第一失败项，继续校验后续项
        if (focusFlag) {
          // 聚焦第一个失败的表单元素
          let formItems = form_1.$children[0].$children
          for (let j = 0; j < formItems.length; j++) {
            let formItem = formItems[j].$children[0]
            if (formItem.validateState === 'error') {
              focusFlag = false
              this.jnpf.focusItem(formItem.$children[1].$el)
              this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
              break
            }
          }
        }
      }

      // 校验表单表格（子数据列表）
      let form_2 = this.$refs['sleeveForm'].$children[0]
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && focusFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            focusFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }
      if (focusFlag) {
        this.btnLoading = true
        let formMethod = null;
        if (this.btnType == 'edit') {
          formMethod = updatePlanList
        } else if (this.btnType == 'add') {
          formMethod = addPlanList
        }
        this.dataForm.documentStatus = value
        let obj = {
          planLineList: this.orderDetailData,
          plan: this.dataForm,
        }
        let idx = null;
        let flag = null;
        if (this.orderDetailData.length < 1) {
          this.btnLoading = false
          flag = false
          return this.$message({
            message: "请选择产品",
            type: 'error',
            duration: 1500,
          })
        }else{
          this.orderDetailData.forEach(item=>{
            if(item.productSource=="out"){
              // item.routingCode=""
              // item.routingId=""
              // item.routingName=""
            }
          })
        }
        // 原订单数量-（原订单已出库数量+待出库数量）
        //       changeNum(val,scope){
        //   // 监听新数量的输入undeliveredQuantity 
        //   let index=scope.$index;
        //   let num=Number(this.orderDetailData[index].undeliveredQuantity)+Number(this.orderDetailData[index].outboundQuantity)
        //   if(val<num){
        //     this.$message
        //   }
        // },
        if (flag === false) return
        this.btnLoading = true
        formMethod(obj).then(res => {
          let msg = "";

          if (value == 'draft') {
            msg = "保存成功"
          } else {
            msg = "提交成功"
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
        this.btnLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

// .el-button--small {
//   // padding: 1;
// }
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
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

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
/* ::v-deep .el-table__body-wrapper{
  height: auto!important;;
}  */
::v-deep .el-table .cell.el-tooltip{
  overflow:initial;
}

</style>