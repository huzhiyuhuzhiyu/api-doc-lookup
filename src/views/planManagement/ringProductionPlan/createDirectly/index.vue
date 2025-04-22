<template>
  <div style="height:100%">
    <div class="JNPF-common-layout" style="position: initial;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
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
                    <el-form ref="dataForm" :model="planForm" :rules="dataRule" label-width="160px"
                      label-position="top">
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
                        <el-col :sm="6" :xs="24" v-if="isProjectSwitch == 1">
                          <el-form-item label="所属项目" prop="projectId">
                            <el-select v-model="planForm.projectId" placeholder="请选择所属项目" clearable style="width: 100%;"
                              @change="changeProject" :disabled="btnType == 'look' ? true : false">
                              <el-option v-for="(item, index) in projectIdDataList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="产线" prop="productionLineId">
                            <el-select v-model="planForm.productionLineId" placeholder="产线" clearable
                              :disabled="btnType == 'look' ? true : false" style="width: 100%;" @change="selectLine">
                              <el-option v-for="(item, index) in productionLineList" :key="index" :label="item.name"
                                :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="计划日期" prop="planDate" style="margin-bottom: 20px;">
                            <el-date-picker v-model="planForm.planDate" type="daterange" value-format="yyyy-MM-dd"
                              :disabled='btnType == "look"' style="width: 100%;" start-placeholder="开始日期"
                              @change="changDateFun" end-placeholder="结束日期" clearable>
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
                    <div v-if="btnType != 'look'">
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        icon="el-icon-plus" @click="openSeleceProductDialog()">选择产品</el-button>|
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
                    </div>

                    <JNPF-table ref="product" :data="productData" @selection-change="handeleProductInfoData" border
                      height="660"  :showOverflowTooltip="false" style="width: 100%;" :hasC="btnType == 'look' ? false : true">

                      <el-table-column type="planNo" width="160" label="计划单号" :key="1011"
                        v-if="codeConfig.codeWay != 'auto'">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.planNo" placeholder="计划单号"
                            :disabled="btnType == 'look' ? true : false" />
                        </template>
                      </el-table-column>
                      <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column prop="productCategoryName" label="产品分类" width="140"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6"></el-table-column>
                      <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                      <el-table-column prop="bomId" label="BOM" width="140" :key="444">
                        <template slot-scope="scope">
                          <div>{{ scope.row.bomId ? scope.row.drawingNo : "无BOM" }}</div>
                        </template>
                      </el-table-column>

                      <el-table-column prop="mainUnit" label="单位" width="80" :key="89" />
                      <el-table-column prop="inventoryQuantity" label="库存数量" width="140" :key="8" />
                      <el-table-column prop="maxInventory" label="最高库存数量" width="140" :key="88" />
                      <el-table-column prop="pairingModeName" label="配对方式" min-width="160">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.pairingModeId" placeholder="请选择配对方式" style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="item in pairingModeList" size="small" :key="item.id" :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="planQuantity" label="计划数量" width="160" :key="7">
                        <template slot="header">
                          <span class="required">*</span>计划数量
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.planQuantity" placeholder="计划数量"
                            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                            :disabled="btnType == 'look' ? true : false">
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

                      <el-table-column prop="planEndDate" label="计划结束日期" width="180" :key="13">
                        <template slot="header">
                          <span class="required">*</span>计划结束日期
                        </template>
                        <template slot-scope="scope">
                          <el-date-picker v-model="scope.row.planEndDate" type="date" value-format="yyyy-MM-dd"
                            :disabled="btnType == 'look' ? true : false" style="width: 100%;" placeholder="请选择">
                          </el-date-picker>
                        </template>
                      </el-table-column>

                      <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  width="120"
                        v-if="sealingCoverTypingFlag == 1" :key="211">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable
                            :disabled="btnType == 'look' ? true : false" style="width: 100%;">
                            <el-option v-for="(item, index) in list1" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  width="120" v-if="accuracyLevelFlag == 1"
                        :key="123">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in list2" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="vibrationLevel" label="振动等级" width="120" v-if="vibrationLevelFlag == 1"
                        :key="17">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable
                            :disabled="btnType == 'look' ? true : false" style="width: 100%;">
                            <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="oil" label="油脂" width="120" v-if="oilFlag == 1" :key="61">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="oilQuantity" label="油脂量" width="120" v-if="oilQuantityFlag == 1" :key="51">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in list5" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="clearance" label="游隙" width="120" v-if="clearanceFlag == 1" :key="100">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="packagingMethod" label="包装方式" width="120" v-if="packagingMethodFlag == 1"
                        :key="101">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable
                            :disabled="btnType == 'look' ? true : false" style="width: 100%;">
                            <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  width="120" v-if="specialRequireFlag == 1"
                        :key="101">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable
                            :disabled="btnType == 'look' ? true : false" style="width: 100%;">
                            <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="material" label="保持架材质" width="120" v-if="materialFlag == 1" :key="105">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.material" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in list9" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="colour" :label="$store.getters.colour"  width="120" v-if="colourFlag == 1" :key="110">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.colour" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in list10" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="remark" label="备注" width="200" :key="128">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.remark" placeholder="请输入" maxlength="200"
                            :disabled="btnType == 'look' ? true : false" />
                        </template>
                      </el-table-column>

                    </JNPF-table>

                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
                <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'">
                </UploadWj>
              </el-tab-pane>
            </el-tabs>
          </div>
          <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
            :visible.sync="allProVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
            append-to-body>

            <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

              <div class="JNPF-common-layout-center JNPF-flex-main">
                <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
                  <el-form @submit.native.prevent>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input @keyup.native.enter="searchAllProduct()" v-model="ProductListRequestObj.productCode"
                          placeholder="请输入产品编码" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="isProductNameSwitch === '1'">
                      <el-form-item>
                        <el-input @keyup.native.enter="searchAllProduct()" v-model="ProductListRequestObj.productName"
                          placeholder="请输入产品名称" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input @keyup.native.enter="searchAllProduct()"
                          v-model="ProductListRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
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
                    <el-table-column prop="code" label="产品编码" sortable="custom" width="160"></el-table-column>
                    <el-table-column prop="name" label="产品名称" sortable="custom" width="160"
                      v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" sortable="custom" min-width="330" />
                    <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                    <el-table-column prop="mainUnit" label="单位" width="80"></el-table-column>
                    <el-table-column prop="inventoryQuantity" label="可用库存数量" min-width="160"
                      sortable="custom"></el-table-column>
                    <el-table-column prop="bomId" label="是否有BOM" sortable="custom" min-width="140">
                      <template slot-scope="scope">
                        {{ scope.row.bomId ? '有' : '无' }}
                      </template>
                    </el-table-column>

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
    </div>
  </div>
</template>

<script>
import { batchAddPlan } from '@/api/plan/index.js'
import { getcategoryTree as productTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getOrderDetail, addOrders, editOrders, getcategoryTrees, getAttributeline, getcooperativeProduct, getCopyOrders, getWorkOrderNo, uploadProduct, } from '@/api/salesManagement/assemblyOrders'
import { getCounryData, getCooperativeInfo, getCooperativeData, getscheduleList, getOrderFiledMap, getProductionLineList } from '@/api/basicData/index'
import { getProducts, getDetailByDrawNo } from '@/api/masterDataManagement/index.js' // 产品列表 
import { mapGetters, mapState } from 'vuex'
import { updatePlanList } from '@/api/calculationList/calculationList'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import getProjectList from '@/mixins/generator/getProjectList'
import { getBimBusinessDetail } from '@/api/basicData/index'

export default {

  mixins: [getProjectList],

  data() {
    return {
      isattachmentswitch: "",
      planTypeList: [
        { label: "订单生成计划", value: "order_plan" },
        { label: "直接创建计划", value: "add_plan" },
        { label: "安全库存创建计划", value: "safety_stock_plan" },
      ],
      planForm: {
        planType: "add_plan",
        planDate: [],
        planStartDate: "",
        planEndDate: "",
        projectId: "",
        productionLineId: "",
      },
      btnType: 'add',
      productionLineList: [],
      codeConfig: {},//单据规则配置
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
      btnText: "",
      tipsvisible: false,
      activeNames: ["productInfo", "basicInfo"],

      ProductListRequestObj: {
        classAttribute: "semi_finished",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        productStatus: 'enable',
        purchaseFlag: false,
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
      dataFormTwo: {
        data: []
      },
      submitmethodsTitle: "",
      background: true,
      datafilelist: [],
      allProVisible: false,

      allproductData: [],
      allProductTotal: 0,

      productData: [],
      listLoading: false,

      index: null,

      customerVisible: false,
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      treeLoading: false,
      parentId: '',
      dataRule: {
        // planDate: [
        //   { required: true, message: '计划日期不能为空', trigger: 'change' }
        // ],
        projectId: [
          { required: true, message: '所属项目不能为空', trigger: 'change' }
        ],
      },
      customerData: {},
      selectRows: [],
      selectArr: [],
      customStyleData: 0,
      isProjectSwitch: "",
      isProjectSwitchFlag: null,
      projectIdDataList: [],
      isProductNameSwitch: "",
      pairingModeList: [],
      tableflag: false,
      bimProductAttributesList: {},
       // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag: '',
      colourFlag: '',
      bimProductAttributesList: {},
      dataFalg: false,
      pairingModeList: [],
      pairingModeNum: 1,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

  },

  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductClassFun()
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getpairingModeListFun()

    await this.getProjectList()

  },
  mounted() {
    // this.getBimBusinessDetail()
    if (this.btnType == 'add') {
      this.fetchData("JHDH")
    }


  },
  beforeDestroy() {
  },
  methods: {
    // 产线
    getProductionLineListFun() {
      let objs = {
        code: "",
        createByName: "",
        endTime: "",
        name: "",
        orderItems: [
          {
            asc: true,
            column: "",
          },
        ],
        pageNum: 1,
        pageSize: -1,
      };
      // 获取产线
      objs.projectId = this.planForm.projectId
      getProductionLineList(objs).then((res) => {
        console.log("产线", res);
        this.productionLineList = res.data.records;
      });
    },
    // 获取业务参数中 属性字段动态显示
    async getProductAttributeFun() {
      await  getOrderFiledMap('sale').then(res => {
        console.log("产品属性", res);
        // sealingCoverTypingFlag list1  pa007
        // accuracyLevelFlag list2  pa006
        // vibrationLevelFlag list3 pa005
        // oilFlag list4 pa002
        // oilQuantityFlag list5 pa003
        // clearanceFlag list6 pa001
        // packagingMethodFlag list7 pa015
        // specialRequireFlag list8 pa016

        this.accuracyLevelFlag = res.data.accuracyLevel //list1
        if (this.accuracyLevelFlag == 1) {
          console.log(this.bimProductAttributesList, 'bimProductAttributesList')
          this.list2 = this.bimProductAttributesList.pa006.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }
        this.clearanceFlag = res.data.clearance
        if (this.clearanceFlag == 1) {
          this.list6 = this.bimProductAttributesList.pa001.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }
        console.log("this.list6", this.list6);
        this.oilFlag = res.data.oil
        if (this.oilFlag == 1) {
          this.list4 = this.bimProductAttributesList.pa002.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }
        this.oilQuantityFlag = res.data.oilQuantity
        if (this.oilQuantityFlag == 1) {
          this.list5 = this.bimProductAttributesList.pa003.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }
        this.packagingMethodFlag = res.data.packagingMethod
        if (this.packagingMethodFlag == 1) {
          this.list7 = this.bimProductAttributesList.pa015.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        if (this.sealingCoverTypingFlag == 1) {
          this.list1 = this.bimProductAttributesList.pa007.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }
        this.specialRequireFlag = res.data.specialRequire
        if (this.specialRequireFlag == 1) {
          this.list8 = this.bimProductAttributesList.pa016.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }
        // 保持架材质
        this.materialFlag = res.data.material
        if (this.materialFlag == 1) {
          this.list9 = this.bimProductAttributesList.pa021.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }
        // 颜色
        this.colourFlag = res.data.colour
        if (this.colourFlag == 1) {
          this.list10 = this.bimProductAttributesList.pa010.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
        }
        this.vibrationLevelFlag = res.data.vibrationLevel
        if (this.vibrationLevelFlag == 1) {
          this.list3 = this.bimProductAttributesList.pa005.map((item) => {
            return {
              label: item.name,
              name: item.name
            }
          })
          console.log(this.list3);
        }


        if (this.sealingCoverTypingFlag != 1 && this.accuracyLevelFlag != 1 && this.vibrationLevelFlag != 1 && this.oilFlag != 1 && this.oilQuantityFlag != 1
          && this.clearanceFlag != 1 && this.packagingMethodFlag != 1 && this.specialRequireFlag != 1) {
          this.selectProductClassFlag = true
        } else {
          this.selectProductClassFlag = false

        }
      })
    },
    // 获取配对方式
    async getpairingModeListFun() {
      try {
        this.pairingModeList = await this.jnpf.getpairingModeListFun()
        console.log("this.par", this.pairingModeList);
      } catch (error) { }
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
    },
    changeProject() {
      this.productData = this.productData.filter(item => item.projectId === this.planForm.projectId);
      this.getProductionLineListFun()

    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_plan'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
      })
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    async getProductClassFun() {
      // 产品属性
      const res = await getbimProductAttributesListMap()
      this.bimProductAttributesList = res.data
      await this.getProductAttributeFun()


    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop == 'projectName' || prop === 'productCode') {
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








    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {
      if (!this.planForm.projectId && this.isProjectSwitch == 1) return this.$message.error("请先选择所属项目")

      this.allProVisible = true
      this.allproductData = []
      this.resetAllProduct()


    },
    // 获取所有产品列表数据
    initData() {
      this.listLoading = true
      this.ProductListRequestObj.projectId = this.isProjectSwitch === '1' ? this.planForm.projectId || '' : ''
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
        classAttribute: "semi_finished",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        productCode: "",
        productName: "",
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
        this.$set(item, 'pairingModeName', '')
        item.productsId = item.id
        item.bomId = item.bomId
        item.planType = 'add_plan'
        if (this.planForm.planDate.length) {
          this.$set(item, 'planStartDate', this.planForm.planDate[0])
          this.$set(item, 'planEndDate', this.planForm.planDate[1])

        }
        if (this.codeConfig.codeWay != 'auto') {
          item.planNo = null
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




















    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        console.log("data", data);
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
      this.productData = []
    },

    init(id, btnType, productData, planType) {
      console.log("传递过来的数据", id, btnType, productData, planType);

      this.planForm.id = id || ''
      this.btnType = btnType || 'add'
      this.planForm.planType = planType
      this.planForm = productData.plan
      this.productData = productData.planLineList
      if (this.productData.length) {
        this.productData.forEach(item => {
          this.$set(item, 'planQuantity', this.planForm.planQuantity)
          this.$set(item, 'planStartDate', this.planForm.planStartDate)
          this.$set(item, 'planEndDate', this.planForm.planEndDate)
          this.$set(item, 'drawingNo', this.planForm.productDrawingNo)
          this.$set(item, 'bomId', this.planForm.bomId)
          this.$set(item, 'id', this.planForm.id)
          this.$set(item, 'classAttribute', this.planForm.classAttribute)
          this.$set(item, 'projectId', this.planForm.projectId)
          this.$set(item, 'planNo', this.planForm.planNo)
          this.$set(item, 'productSource', this.planForm.productSource)
          this.$set(item, 'planType', this.planForm.planType)
          this.$set(item, 'ratio', this.planForm.ratio)
          this.$set(item, 'calculationDirection', this.planForm.calculationDirection)
          this.$set(item, 'mainUnit', this.planForm.mainUnit)
          this.$set(item, 'deputyUnit', this.planForm.deputyUnit)
          this.$set(item, 'planState', this.planForm.planState)
        });
      }
      this.fetchData("JHDH")
      this.getProductionLineListFun()
      setTimeout(() => {
        this.tableflag = true
      }, 300);

      console.log("this.planForm", this.planForm);
    },

    goBack() {
      if (this.btnType == 'add') {
        this.$router.push({ path: "/planManagement/assemblyPlan/assemblyPlanManagement" })
      } else {
        this.$emit('close')
      }

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
            if (this.productData.length == 1) {
              let item = this.productData[0]
              let num = this.jnpf.numberFormat(this.jnpf.math('add', [item.inventoryQuantity, item.planQuantity]), 6)
              let methods = ""
              let data = null
              if (this.btnType == 'add') {
                methods = batchAddPlan
                data = this.productData
              }
              if (this.btnType == 'edit') {
                methods = updatePlanList
                data = {
                  plan: this.productData[0]
                }
              }
              if (num > item.maxInventory) {
                this.$confirm(this.$t('产品信息可用库存加计划数量大于最高库存,确认提交吗?'), this.$t('提示'), {
                  type: 'warning'
                }).then(() => {
              this.btnLoading = true
              this.productData.forEach(item => {
                    item.documentStatus = value
                    item.finalPlanQuantity = item.planQuantity
                    item.productionLineId = this.planForm.productionLineId
                  });

                  methods(data).then(res => {
                    let msg = "";
                    if (value == "draft") {
                      this.submitmethodsTitle = "保存成功"
                    } else {
                      this.submitmethodsTitle = "提交成功"

                    }
                    this.tipsvisible = true
                    this.btnLoading = false

                  }).catch(() => {
                    this.btnLoading = false
                  })
                }).catch(() => { })

              }
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
                if (!item.bomId) {
                  submitFlag = false
                  this.$message({
                    message: "第" + (index + 1) + "行产品无BOM，请配置BOM信息",
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
              this.productData.forEach(item => {
                item.documentStatus = value
                item.finalPlanQuantity = item.planQuantity
                item.productionLineId = this.planForm.productionLineId
              });
              if (submitFlag === false) return
              this.btnLoading = true
              let methods = ""
              let data = null
              if (this.btnType == 'add') {
                methods = batchAddPlan
                data = this.productData
              }
              if (this.btnType == 'edit') {
                methods = updatePlanList
                data = {
                  plan: this.productData[0]
                }
              }

              methods(data).then(res => {
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

          }


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
  margin-bottom: 5px
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