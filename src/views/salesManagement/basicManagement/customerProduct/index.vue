<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
        <el-tab-pane label="产品价格" name="latestprice">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent ref="latestpriceRef">
                <template v-for="item in searchList">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="search('basic')" />

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
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                      $t('common.reset') }}
                    </el-button>

                  </el-form-item>

                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
              <div class="JNPF-common-head">
                <topOpts @add="addSupplier('', 'add')">
                  <el-button type="primary" size="mini" icon="el-icon-plus" @click="importProductFun()">导入产品
                  </el-button>
                  <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm">导出</el-button>
                </topOpts>
                <!-- <el-button type="primary" size="mini" icon="el-icon-plus" @click="exportForm">导出</el-button> -->
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top" v-if="true">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="seniorFun" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('tableForm')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table highlight-current-row :fixedNO="true" ref="tableForm" v-if="isProjectSwitchFlag"
                :data="tableDataList" @sort-change="sortChange" custom-column :setColumnDisplayList="columnLists">
                <el-table-column prop="partnerName" label="客户名称" min-width="260" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="viewPartner(scope.row.cooperativePartnerId, 'look')">{{
                      scope.row.partnerName
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="partnerCode" label="客户编码" min-width="160" sortable="custom" />
                <el-table-column prop="customerProductNo" label="客户料号" min-width="180" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="viewProduct(scope.row, 'look')">{{
                      scope.row.productCode
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                  v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" min-width="400" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />

                <el-table-column prop="price" min-width="140" label="销售单价(含税)" />
                <el-table-column prop="excludingTaxPrice" label="销售单价(不含税)" width="160" />
                <el-table-column prop="dateOrderStart" label="有效日期起" sortable="custom" min-width="160" />
                <el-table-column prop="dateOrderStop" label="有效日期止" sortable="custom" min-width="160" />
                <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"  v-if="sealingCoverTypingFlag==1"/>
                <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"  v-if="accuracyLevelFlag==1"/>
                <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"  v-if="vibrationLevelFlag==1"/>
                <el-table-column prop="oil" label="油脂" width="100" sortable="custom"  v-if="oilFlag==1"/>
                <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom"  v-if="oilQuantityFlag==1"/>
                <el-table-column prop="clearance" label="游隙" width="100" sortable="custom"  v-if="clearanceFlag==1"/>
                <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"  v-if="packagingMethodFlag==1"/>
                <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"  v-if="specialRequireFlag==1"/>
                <el-table-column prop="material" label="保持架材质" width="130" sortable="custom"  v-if="materialFlag === '1'" />
                <el-table-column prop="colour" label="颜色" width="120" sortable="custom" v-if="colourFlag === '1'" />
                <el-table-column prop="protrusion" label="凸出量" width="120" sortable="custom"  v-if="protrusionFlag==1"/>
                <el-table-column prop="preload" label="预负荷" width="120" sortable="custom"  v-if="preloadFlag==1"/>
                <el-table-column prop="angle" label="角度" width="120" :key="104" v-if="angleFlag === '1'" />
                <el-table-column prop="centerDiameter" label="钢球/中心径/倒角" min-width="200" v-if="centerDiameterFlag === '1'" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
                  <el-table-column label="操作" width="180" fixed="right">
                      <template slot-scope="scope">
                          <el-button size="mini" type="text"
                                     @click="addSupplier(scope.row, 'edit')">编辑</el-button>
                          <el-button size="mini" type="text" class="JNPF-table-delBtn"
                                     @click="handleDel(scope.row.id)">删除</el-button>
                          <el-dropdown hide-on-click>
                                  <span class="el-dropdown-link">
                                    <el-button type="text" size="mini">
                                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                  </span>
                              <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item @click.native="addSupplier(scope.row, 'look')">
                                      查看详情
                                  </el-dropdown-item>
                              </el-dropdown-menu>
                          </el-dropdown>
                      </template>
                  </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
                :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="历史价格" name="historicalprice">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent ref="historicalpriceRef">
                <template v-for="item in searchList1">
                  <el-col :span="item.searchType === 3 ? 6 : 4" :key="item.field">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="search('basic')" />

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
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                      $t('common.reset') }}
                    </el-button>

                  </el-form-item>

                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
              <div class="JNPF-common-head">
                <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm">导出</el-button>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top" v-if="true">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="seniorFun" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('tableFormss')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table highlight-current-row :fixedNO="true" ref="tableFormss" v-if="isProjectSwitchFlag"
                :data="tableDataList" @sort-change="sortChange" custom-column :setColumnDisplayList="columnLists">
                <el-table-column prop="cooperativePartnerIdText" label="客户名称" min-width="260" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="viewPartner(scope.row.cooperativePartnerId, 'look')">{{
                      scope.row.cooperativePartnerIdText
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="cooperativePartnerCode" label="客户编码" min-width="160" sortable="custom" />
                <el-table-column prop="customerDrawingNumber" label="客户料号" min-width="180" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="viewProduct(scope.row, 'look')">{{
                      scope.row.productCode
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                  v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="400" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />
                <el-table-column prop="unitPrice" min-width="140" label="销售单价(含税)" />

                <el-table-column prop="excludingTaxUnitPrice" label="销售单价(不含税)" width="160" />
                <el-table-column prop="validEnd" label="有效日期止" sortable="custom" min-width="160" />
                <el-table-column prop="ask" label="要求" sortable="custom" min-width="160" />
                  <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"  v-if="sealingCoverTypingFlag==1"/>
                  <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"  v-if="accuracyLevelFlag==1"/>
                  <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"  v-if="vibrationLevelFlag==1"/>
                  <el-table-column prop="oil" label="油脂" width="100" sortable="custom"  v-if="oilFlag==1"/>
                  <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom"  v-if="oilQuantityFlag==1"/>
                  <el-table-column prop="clearance" label="游隙" width="100" sortable="custom"  v-if="clearanceFlag==1"/>
                  <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"  v-if="packagingMethodFlag==1"/>
                  <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"  v-if="specialRequireFlag==1"/>
                  <el-table-column prop="material" label="保持架材质" width="130" sortable="custom" v-if="materialFlag === '1'" />
                  <el-table-column prop="colour" label="颜色" width="120" sortable="custom" v-if="colourFlag === '1'" />
<!--                  <el-table-column prop="protrusion" label="凸出量" width="120" sortable="custom"  v-if="protrusionFlag==1"/>-->
<!--                  <el-table-column prop="preload" label="预负荷" width="120" sortable="custom"  v-if="preloadFlag==1"/>-->
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />

              </JNPF-table>
              <pagination :total="total" :page.sync="historyForm.pageNum" :background="background"
                :limit.sync="historyForm.pageSize" @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :classAttribute="classAttribute"
      :productName="productName" :busSetId="busSetId" />
    <FinshForm v-if="finshVisible" ref="finshForm" @refreshDataList="initData" @close="closeForm"></FinshForm>
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <CustomerForm v-if="customerVisible" ref="customerForm" @close="closePage"></CustomerForm>
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
        :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton"
            icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="submit()">
          提交</el-button>
      </span>
    </el-dialog>
    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
  </div>
</template>

<script>
import { getQuotationLists, deleteQuotationData, getQuotationmxLists, exportSaleQuotation } from '@/api/salesManagement/index'
import { getBimVehicleTypeData, deleteBimVehicleType, getPartnerOrProductData } from '@/api/basicData/index'
import { excelExport, addPartnerOrProductData, importCustomerProduct,getOrderFiledMap } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import CustomerForm from '../customerManagement/Officialcustomer/Form.vue'
import Form from '@/views/masterDataManagement/productManagement/components/Form.vue'
import FinshForm from '@/views/masterDataManagement/productManagement/finished_product/Form.vue'
import DepForm from './depForm'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
export default {
  name: 'PartnerProduct',
  mixins: [getProjectList],

  components: { ExportForm, SuperQuery, CustomerForm, Form, FinshForm, DepForm },
  data() {
    return {
      isProductNameSwitch: '',
      finshVisible: false,
      classAttribute: "",
      productName: "",
      customerVisible: false,
      busSetId: "CPBM",
      searchList: [
        { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
      ],
      searchList1: [
        { field: 'cooperativePartnerIdText', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerDrawingNumber', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

      ],
      superQueryVisible: false,
      columnLists: ["partnerCode",],
      exportFormVisible: false,
      depFormVisible: false,
      background: true,//分页器背景颜色
      tableDataList: [
      ],

      listLoading: false,
      listQuery: {
        partnerType: "customer",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        customerProductNo: "",
        drawingNo: "",
        partnerName: "",



        pageNum: 1,
        pageSize: 20,
      },
      superQuery: {},
      superForm: {},
      basicQuery: {},
      historyForm: {
        productDrawingNo: "",
        cooperativePartnerIdText: "",
        customerDrawingNumber: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      formVisible: false,
      activeName: 'latestprice',
      superQueryJson1: [
        {
          prop: 'partnerName',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'customerProductNo',
          label: "客户料号",
          type: 'input',
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input',
        },
        {
          prop: 'drawingNo',
          label: "品名规格 ",
          type: 'custom',
        },

        {
          prop: 'dateOrderStart',
          label: '有效日期起',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'dateOrderStop',
          label: '有效日期止',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },


        {
          prop: 'remark',
          label: "备注",
          type: 'input',

        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
      ],
      superQueryJson2: [
        {
          prop: 'cooperativePartnerIdText',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'customerDrawingNumber',
          label: "客户料号",
          type: 'input',
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input',
        },
        {
          prop: 'productDrawingNo',
          label: "品名规格 ",
          type: 'custom',
        },




        {
          prop: 'validEnd',
          label: '有效日期止',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },


        {
          prop: 'remark',
          label: "备注",
          type: 'input',

        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
      ],
      superQueryJson: [],
      uploadVisib: false,


      isProjectSwitchFlag: false,
      isProjectSwitch: '',
      historyFlag: false,
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      bimProductAttributesList: [],
      protrusionFlag:'',
      preloadFlag:'',
      materialFlag:'',
      colourFlag:'',
      angleFlag:'',
      centerDiameterFlag:'',
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },



  async created() {
    await this.getProductClassFun()
    await this.getOrderFiledMap()

    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    this.isProjectSwitchFlag = true
    this.superForm = this.listQuery
    if (this.isProductNameSwitch == 1) {
      this.searchList.splice(2, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)


    }
    this.search('basic')
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
    getOrderFiledMap() {

      getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.colourFlag = res.data.colour
        this.materialFlag = res.data.material
      })
        getOrderFiledMap('gobal').then(res => {
            this.protrusionFlag = res.data.protrusion //list1
            this.preloadFlag = res.data.preload
            this.centerDiameterFlag = res.data.centerDiameter
            this.angleFlag = res.data.angle
        }).catch(err => {})
    },
    advancedQueryFun(superQuery,needFlag) {
      if (this.isProductNameSwitch === '1') {
          superQuery.splice(4, 0, {
          prop: 'productName',
          label: '产品名称',
          type: 'input'
        })
      }
      let classIndex = superQuery.findIndex((obj) => obj.prop === 'remark')
      console.log("clas",classIndex);

      if (this.specialRequireFlag === '1') {
          superQuery.splice(classIndex + 1, 0, {
          prop: 'specialRequire',
          label: '特殊要求',
          type: 'select',
          options: this.bimProductAttributesList.pa016.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.colourFlag === '1') {
          superQuery.splice(classIndex + 1, 0, {
          prop: 'colour',
          label: '颜色',
          type: 'select',
          options: this.bimProductAttributesList.pa010.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.materialFlag === '1') {
          superQuery.splice(classIndex + 1, 0, {
          prop: 'material',
          label: '保持架材质',
          type: 'select',
          options: this.bimProductAttributesList.pa021.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (needFlag){
          if (this.preloadFlag === '1') {
              superQuery.splice(classIndex + 1, 0, {
                  prop: 'preload',
                  label: '预负荷',
                  type: 'select',
                  options: this.bimProductAttributesList.pa024.map((item) => {
                      return {
                          label: item.name,
                          value: item.name
                      }
                  })
              })
          }
          if (this.protrusionFlag === '1') {
              superQuery.splice(classIndex + 1, 0, {
                  prop: 'protrusion',
                  label: '凸出量',
                  type: 'select',
                  options: this.bimProductAttributesList.pa023.map((item) => {
                      return {
                          label: item.name,
                          value: item.name
                      }
                  })
              })
          }
          if (this.angleFlag === '1') {
              superQuery.splice(classIndex + 1, 0, {
                  prop: 'angle',
                  label: '角度',
                  type: 'select',
                  options: this.bimProductAttributesList.pa025.map((item) => {
                      return {
                          label: item.name,
                          value: item.name
                      }
                  })
              })
          }
          if (this.centerDiameterFlag === '1') {
              superQuery.splice(classIndex + 1, 0, {
                  prop: 'centerDiameter',
                  label: '钢球/中心径/倒角',
                  type: 'input',
              })
          }
      }

      console.log("this.packagingMethodFlag",this.packagingMethodFlag);
      if (this.packagingMethodFlag === '1') {
        console.log(555);

          superQuery.splice(classIndex + 1, 0, {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.bimProductAttributesList.pa015.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.clearanceFlag === '1') {
          superQuery.splice(classIndex + 1, 0, {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: this.bimProductAttributesList.pa001.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilQuantityFlag === '1') {
          superQuery.splice(classIndex + 1, 0, {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: this.bimProductAttributesList.pa003.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilFlag === '1') {
          superQuery.splice(classIndex + 1, 0, {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: this.bimProductAttributesList.pa002.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }

      if (this.vibrationLevelFlag === '1') {
          superQuery.splice(classIndex + 1, 0, {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: this.bimProductAttributesList.pa005.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.accuracyLevelFlag === '1') {
          superQuery.splice(classIndex + 1, 0, {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'select',
          options: this.bimProductAttributesList.pa006.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.sealingCoverTypingFlag === '1') {
          superQuery.splice(classIndex + 1, 0, {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'select',
          options: this.bimProductAttributesList.pa007.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    submit() {
      console.log(this.fileList);
      this.UploadProduct(this.file)
    },

    handleFileChange(file) {
      console.log("所选文件:", file);
      this.file = file.raw
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/客户产品价格导入模板.xlsx')
      a.click()
    },
    importProductFun() {
      this.uploadVisib = true
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    // 上传产品
    UploadProduct(data) {
      console.log("data产品", data);
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data)
      formData.append("type", 'customer')
      //调用上传文件接口
      importCustomerProduct(formData).then(res => {
        if (!res.data) {
          this.$message.success(`导入成功`)

          this.formLoading = false
          this.loadingText = ''
          this.search('basic')
        } else {
          this.handleMessage(res.data)
          this.$refs['uploadRef'].clearFiles();
        }
        this.uploadVisib = false
        // this.tipsvisible=true

        this.$refs['uploadRef'].clearFiles();
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: "error",
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h('div',
          {
            style: "padding-right:20px;display:flex;align-items:center;color:#f56c6c;"
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在客户产品价格信息错误！'),
            h('el-button', {
              props: {
                type: 'text',
                size: "mini",
                icon: 'el-icon-download'
              },
              on: {
                click: () => {
                  this.downNoProduct(data)
                }
              },
              style: {
                border: "none",
                textAlign: "center",
                // width:"20%",
                margin: "0 5px 0 5px ",
              },
            }, '下载导入错误数据')
          ]
        ),
      })
      return
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    seniorFun() {
      if (this.activeName == 'historicalprice') {
        this.advancedQueryFun(this.superQueryJson2,false)
        this.superQueryJson = this.superQueryJson2

      } else {
        console.log("this.superQueryJson1",this.superQueryJson1);
        this.advancedQueryFun(this.superQueryJson1,true)
        this.superQueryJson = this.superQueryJson1

      }

      this.superQueryVisible = true
    },
    viewProduct(row, type) {
      this.productName = row.productName
      this.classAttribute = row.classAttribute
      if (row.classAttribute == 'finish_product') {
        this.finshVisible = true
        this.$nextTick(() => {
          this.$refs.finshForm.init(row.productsId, true)
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row.productsId, true)
        })
      }

    },
    closePage() {
      this.customerVisible = false
    },
    viewPartner(id, type) {
      this.customerVisible = true
      this.$nextTick(() => {
        this.$refs.customerForm.init(id, '', type)
      })
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')

    },
    columnSetFun(ref) {
      this.$refs[ref].showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.tableForm.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        console.log(includeFieldMap);
        let name = ''
        if (this.activeName == 'latestprice') {
          name = '最新报价'
        } else {
          name = '历史报价'
        }
        let _data = {
          ...this.listQuery,
          exportType: '1009',
          exportName: '客户产品' + '-' + name,
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    handleClick(e) {
      this.activeName = e.name
      if (this.isProductNameSwitch == 1) {
        // this.searchList1.splice(2, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)
        this.searchList1.push({ field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 })


      }
      console.log(this.searchList1);
      // this.reset()
    },
    sortChange({ prop, order }) {
      console.log(prop);
      // let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      // console.log(newProp);
      if (this.activeName == "historicalprice") {
        let newProp;
        if (prop === 'cooperativePartnerIdText' || prop == 'productName' || prop == 'projectName' || prop === 'cooperativePartnerCode' || prop === 'customerDrawingNumber' || prop === 'productDrawingNo' || prop === 'productCode' || prop == 'productName' || prop == 'unitPrice'
          || prop == 'excludingTaxUnitPrice' || prop == 'validEnd' || prop == 'ask' || prop == 'remark' || prop == 'createTime'
        ) {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }


        this.historyForm.orderItems[0].asc = order !== 'descending'
        this.historyForm.orderItems[0].column = order === null ? "" : newProp
        this.superForm = this.historyForm
      } else {

        let newProp;
        if (prop === 'productCode' || prop == 'productName' || prop === 'partnerName' || prop == 'projectName' || prop == 'oil' || prop == 'clearance') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }



        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
        this.superForm = this.listQuery
      }


      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.finshVisible = false
      this.depFormVisible = false
      this.initData()
    },

    // 获取打字内容等
    getProductClassFun() {

      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })



    },
    initData() {
      this.listLoading = true
      if (this.activeName == "historicalprice") {
        getQuotationmxLists(this.superForm).then(res => {
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
      } else {
        this.superForm.historyFlag = false

        getPartnerOrProductData(this.superForm).then(res => {
          console.log(res, '客户产品列表');
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    search(type) {
      if (this.activeName == 'latestprice') {

        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
      } else {
        Object.keys(this.historyForm).forEach(key => {
          let item = this.historyForm[key]
          this.historyForm[key] = typeof item === 'string' ? item.trim() : item
        })
      }
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.activeName == 'latestprice' ? this.searchList : this.searchList1
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
      this.superForm.pageNum = 1
      this.initData()
    },
    reset() {
      if (this.activeName == 'latestprice') {

        this.$refs['tableForm'].$refs.JNPFTable.clearSort()

        this.superForm = this.listQuery = {
          partnerType: "customer",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
          partnerId: null,
          historyFlag: false,
          customerProductNo: "",
          pageNum: 1,
          pageSize: 20,
          code: "",
          name: "",
        },
          this.searchList = [
            { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
            { field: 'customerProductNo', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
            { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

          ]
        if (this.isProductNameSwitch === '1') {
          this.superQueryJson.splice(4, 0, {
            prop: 'productName',
            label: '产品名称',
            type: 'input'
          })
        }
        this.$refs.SuperQuery.conditionList = []
        this.search('basic')
        if (this.isProductNameSwitch == 1) {
          this.searchList.splice(2, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)


        }
      } else {

        this.superForm = this.historyForm = {
          productDrawingNo: "",
          cooperativePartnerIdText: "",
          customerDrawingNumber: "",
          pageNum: 1,
          pageSize: 20,
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "createTime"
          }],
        }
        this.searchList1 = [
          { field: 'cooperativePartnerIdText', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
          { field: 'customerDrawingNumber', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
          { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

        ]
        if (this.isProductNameSwitch == 1) {
          this.searchList1.splice(2, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)
        }
        this.$refs.SuperQuery.conditionList = []
        this.search('basic')
      }

    },
    addSupplier(row,type) {

      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(row, type)
      })
    },
    addOrUpdateHandle(id, type) {
      this.depFormVisible = true
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, type)
        })
        // }, 600);
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
          deleteBimVehicleType(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style scoped>
::v-deep .el-tabs__item {
  padding: 0 10px;
}



::v-deep .el-tabs__nav-wrap {
  margin-bottom: 0px;
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
}

.tabs ::v-deep .el-tabs__header {
  padding: 0 8px;
}
</style>
