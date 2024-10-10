<template>
  <div style="height: 99%;">
    <div style="height: 7%;">
      <div class="tag-group JNPF-common-search-box treeBox_bot"
        style="display:flex;align-items:center;padding:5px 0 5px 10px;margin:5px 0 0px 0">
        <el-radio-group v-model="listQuery.classAttribute" style="background-color:#fff;">
          <el-radio-button label="" style="margin:3px 0">全部</el-radio-button>
          <el-radio-button style="margin:2px 0;border-left: 1px solid #DCDFE6" v-for="item in categoryList"
            :key="item.code" :label="item.code">
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="JNPF-common-layout" style="height: 92%;">
      <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
        <div class="JNPF-common-title">
          <h2 v-if="!leftFlag">产品分类</h2>
          <span class="options" v-if="!leftFlag">
            <el-dropdown>
              <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div v-if="!leftFlag">
          <el-input placeholder="请输入" v-model="filterText" style="width:200px;margin:10px auto;display:block"
            suffix-icon="el-icon-search" clearable></el-input>
        </div>
        <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
          <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" highlight-current
            :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="JNPF-common-el-tree"
            v-if="refreshTree" :filter-node-method="filterNode">
            <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
              <i :class="[
                data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm'
              ]" />
              <span class="text" :title="data.name">{{ data.name }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
        <div v-if="!leftFlag" class="retract" style="position: absolute">
          <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
        </div>
        <div v-if="leftFlag" class="expand" style="position: absolute">
          <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
        </div>
      </div>

      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productCode" placeholder="产品编码" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productDrawingNo" placeholder="品名规格" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item>
                <el-select v-model="listQuery.productSource" placeholder="产品来源" clearable style="width: 100%;">
                  <el-option v-for="(item, index) in productSourceList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head" style="padding:8px">
            <div></div>

            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                  @click="superQueryVisible = true" />
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
          <JNPF-table v-show="dataTableFlag" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column ref="dataTable" :setColumnDisplayList="columnList">
            <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
            <el-table-column prop="code" label="产品编码" min-width="140" sortable="custom">
              <!-- <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                  {{ scope.row.code }}
                </el-link>
              </template> -->
            </el-table-column>

            <el-table-column prop="productCategoryName" label="产品分类" width="120" />
            <el-table-column prop="productSource" label="产品来源" width="120">
              <template slot-scope="{ row }">
                <template v-if="row.productSource == 'produce'">
                  生产
                </template>
                <template v-else-if="row.productSource == 'purchase'">
                  采购
                </template>
                <template v-else-if="row.productSource == 'out'">
                  外协
                </template>
                <template v-else-if="row.productSource == 'assemble'">
                  组装
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="mainUnit" label="单位" width="120" />
            <el-table-column prop="purchaseTaxRate" label="采购税率" width="120" align="center">
              <template slot-scope="{ row }">
                <el-select v-model="row.purchaseTaxRate" placeholder="请选择" @change="purchaseTaxRateChange(row)">
                  <el-option v-for="item in taxRateList" :key="item.taxRate" :label="item.fullName"
                    :value="item.enCode"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" label="采购单价(含税)" width="150" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.purchasePrice" placeholder="请输入内容" @blur="purchasePriceChange(row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseExcludingTaxPrice" label="采购单价(不含税)" width="160" />
            <el-table-column prop="salesTaxRate" label="销售税率" width="120" align="center">
              <template slot-scope="{ row }">
                <el-select v-model="row.salesTaxRate" placeholder="请选择" @change="salesTaxRateChange(row)">
                  <el-option v-for="item in taxRateList" :key="item.taxRate" :label="item.fullName"
                    :value="item.enCode"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="salesPrice" label="销售单价(含税)" width="150" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.salesPrice" placeholder="请输入内容" @blur="salesPriceChange(row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="salesExcludingTaxPrice" label="销售单价(不含税)" width="160" />
            <el-table-column prop="model" label="型号" width="120" />
            <el-table-column prop="sealingCoverStructure" label="密封盖-结构" width="120" />
            <el-table-column prop="sealingCoverTyping" label="密封盖-打字" width="120" />
            <el-table-column prop="structureType" label="结构类型" width="120" />
            <el-table-column prop="clearance" label="游隙" width="120" />
            <el-table-column prop="steelBallManufacturer" label="钢球厂家" width="120" />
            <el-table-column prop="oil" label="油脂" width="120" />
            <el-table-column prop="oilQuantity" label="油脂量" width="120" />
            <el-table-column prop="noise" label="噪音" width="120" />
            <el-table-column prop="holder" label="保持架" width="120" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" />
            <el-table-column prop="accuracyLevel" label="精度等级" width="120" />
            <el-table-column prop="colour" label="颜色" width="120" />
            <el-table-column prop="aperture" label="孔径" width="120" />
            <el-table-column prop="remark" label="备注" width="120" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" />

          </JNPF-table>
          <JNPF-table v-show="!dataTableFlag" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column ref="otherTable" :setColumnDisplayList="columnList">
            <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
            <el-table-column prop="code" label="产品编码" min-width="140" sortable="custom">
              <!-- <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                  {{ scope.row.code }}
                </el-link>
              </template> -->
            </el-table-column>

            <el-table-column prop="productCategoryName" label="产品分类" width="120" />
            <el-table-column prop="productSource" label="产品来源" width="120">
              <template slot-scope="{ row }">
                <template v-if="row.productSource == 'produce'">
                  生产
                </template>
                <template v-else-if="row.productSource == 'purchase'">
                  采购
                </template>
                <template v-else-if="row.productSource == 'out'">
                  外协
                </template>
                <template v-else-if="row.productSource == 'assemble'">
                  组装
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="mainUnit" label="单位" width="120" />
            <el-table-column prop="purchaseTaxRate" label="采购税率" width="120" align="center">
              <template slot-scope="{ row }">
                <el-select v-model="row.purchaseTaxRate" placeholder="请选择" @change="purchaseTaxRateChange(row)">
                  <el-option v-for="item in taxRateList" :key="item.taxRate" :label="item.fullName"
                    :value="item.enCode"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="purchasePrice" label="采购单价(含税)" width="150" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.purchasePrice" placeholder="请输入内容" @blur="purchasePriceChange(row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="purchaseExcludingTaxPrice" label="采购单价(不含税)" width="160" />
            <el-table-column prop="salesTaxRate" label="销售税率" width="120" align="center">
              <template slot-scope="{ row }">
                <el-select v-model="row.salesTaxRate" placeholder="请选择" @change="salesTaxRateChange(row)">
                  <el-option v-for="item in taxRateList" :key="item.taxRate" :label="item.fullName"
                    :value="item.enCode"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="salesPrice" label="销售单价(含税)" width="150" align="center">
              <template slot-scope="{ row }">
                <el-input v-model="row.salesPrice" placeholder="请输入内容" @blur="salesPriceChange(row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="salesExcludingTaxPrice" label="销售单价(不含税)" width="160" />

            <el-table-column prop="remark" label="备注" width="120" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" />

          </JNPF-table>

          <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
            :limit.sync="listQuery.pageSize" @pagination="initData" />
        </div>
      </div>
    </div>

    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import {
  getProductList,
  deleteProduct,
  uploadCpProductData,
  updateProductPrice,
  cpAddProduct
} from '@/api/masterDataManagement/productManage'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { getcategoryTree as getcategoryCoop } from '@/api/basicData/materialSettings'

import { mapState } from 'vuex'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList,
  getbimProductAttributes,
  getbimProductsModelList
} from '@/api/masterDataManagement/index'
import { getUnitData, detailUnitData } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getCooperativeData } from '@/api/basicData/index'
import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { getclassAttributeList } from '@/api/masterDataManagement/index'
export default {
  components: { SuperQuery },
  name: 'productPriceSetting',
  data() {
    return {
      categoryList: [],
      exportFormVisible: false,
      quickVisible: false,
      quickForm: {
        code: '',
        drawingNo: '',
        unit: '',
        productCategoryName: '',
        productSource: ''
      },
      codeConfig: {},
      quickRules: {
        code: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        drawingNo: [{ required: true, message: '请输入品名规格', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        productCategoryName: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
        productSource: [{ required: true, message: '请选择产品来源', trigger: 'change' }]
      },
      getcategoryCoop,
      dataTableFlag: true,
      getbimProductsModelList, // 型号管理属性列表
      title: '更多查询',
      background: true, //分页器背景颜色

      aiformVisible: false,
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      loadingText: false,
      leftFlag: false,

      initListQuery: {
        code: '',
        name: '',
        productStatus: 'enable',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        drawingNo: '', // 图号
        productSource: '', // 产品来源
        startAndEndTime: [], // 创建时间
        productCategoryId: '', // 类型id
        productStatus: '', // 产品状态
        customerQueryFields: [],
        createTimeArr: [],
        classAttribute: ''
      },
      listQuery: {},
      productStatusList: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }], // 产品状态
      productSourceList: [
        { label: '组装', value: 'assemble' },
        { label: '生产', value: 'produce' },
        { label: '采购', value: 'purchase' },
        { label: '外协', value: 'out' }
      ], // 产品来源
      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      columnList: [
        'name',
        'mainUnit',
        'brand',
        'model',
        'sealingCoverStructure',
        'sealingCoverTyping',
        'structureType',
        'clearance',
        'steelBallManufacturer',
        'oil',
        'oilQuantity',
        'noise',
        'holder',
        'vibrationLevel',
        'accuracyLevel',
        'colour',
        'aperture',
        'remark',
        'createByName',
        'createTime'
      ],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input'
        },

        {
          prop: 'name',
          label: '产品名称',
          type: 'input'
        },
        {
          prop: 'productCategoryName',
          label: '产品分类',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'select'
        },
        {
          prop: 'productSource',
          label: '产品来源',
          type: 'select',
          options: [
            { label: '生产', value: 'produce' },
            { label: '采购', value: 'purchase' },
            { label: '外协', value: 'out' }
          ]
        },
        {
          prop: 'productStatus',
          label: '产品状态',
          type: 'select',
          options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }]
        },
        {
          prop: 'brand',
          label: '品牌',
          type: 'select',
          options: []
        },
        {
          prop: 'model',
          label: '型号',
          type: 'select',
          options: []
        },
        {
          prop: 'sealingCoverStructure',
          label: '密封盖-结构',
          type: 'select',
          options: []
        },
        {
          prop: 'sealingCoverTyping',
          label: '密封盖-打字',
          type: 'select',
          options: []
        },
        {
          prop: 'structureType',
          label: '结构类型',
          type: 'select',
          options: []
        },
        {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: []
        },
        {
          prop: 'steelBallManufacturer',
          label: '钢球厂家',
          type: 'select',
          options: []
        },

        {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: []
        },
        {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: []
        },
        {
          prop: 'noise',
          label: '噪音',
          type: 'select',
          options: []
        },
        {
          prop: 'holder',
          label: '保持架',
          type: 'select',
          options: []
        },
        {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'select',
          options: []
        },
        {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: []
        },
        {
          prop: 'colour',
          label: '颜色',
          type: 'select',
          options: []
        },
        {
          prop: 'aperture',
          label: '孔径',
          type: 'select',
          options: []
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ],
      filterText: '',
      uploadVisib: false,
      configFlag: true,
      unitOptions: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },
    'listQuery.classAttribute': function (newVal) {
      if (localStorage.getItem(`${this.listQuery.classAttribute}productPriceSettingFlag`)) {
        let roleFlag = JSON.parse(localStorage.getItem(`${this.listQuery.classAttribute}productPriceSettingFlag`))
        console.log(roleFlag, 'fff')
        this.expands = roleFlag
        this.toggleExpand(roleFlag)
      }
      console.log(newVal, '5')
      if (!newVal) {
        this.dataTableFlag = true
        this.superQueryJson = [
          {
            prop: 'code',
            label: '产品编码',
            type: 'input'
          },
          {
            prop: 'drawingNo',
            label: '品名规格',
            type: 'input'
          },

          {
            prop: 'name',
            label: '产品名称',
            type: 'input'
          },
          {
            prop: 'productCategoryName',
            label: '产品分类',
            type: 'input'
          },
          {
            prop: 'mainUnit',
            label: '单位',
            type: 'select'
          },
          {
            prop: 'productSource',
            label: '产品来源',
            type: 'select',
            options: [
              { label: '生产', value: 'produce' },
              { label: '采购', value: 'purchase' },
              { label: '外协', value: 'out' }
            ]
          },
          {
            prop: 'productStatus',
            label: '产品状态',
            type: 'select',
            options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }]
          },
          {
            prop: 'brand',
            label: '品牌',
            type: 'select',
            options: []
          },
          {
            prop: 'model',
            label: '型号',
            type: 'select',
            options: []
          },
          {
            prop: 'sealingCoverStructure',
            label: '密封盖-结构',
            type: 'select',
            options: []
          },
          {
            prop: 'sealingCoverTyping',
            label: '密封盖-打字',
            type: 'select',
            options: []
          },
          {
            prop: 'structureType',
            label: '结构类型',
            type: 'select',
            options: []
          },
          {
            prop: 'clearance',
            label: '游隙',
            type: 'select',
            options: []
          },
          {
            prop: 'steelBallManufacturer',
            label: '钢球厂家',
            type: 'select',
            options: []
          },

          {
            prop: 'oil',
            label: '油脂',
            type: 'select',
            options: []
          },
          {
            prop: 'oilQuantity',
            label: '油脂量',
            type: 'select',
            options: []
          },
          {
            prop: 'noise',
            label: '噪音',
            type: 'select',
            options: []
          },
          {
            prop: 'holder',
            label: '保持架',
            type: 'select',
            options: []
          },
          {
            prop: 'accuracyLevel',
            label: '精度等级',
            type: 'select',
            options: []
          },
          {
            prop: 'vibrationLevel',
            label: '振动等级',
            type: 'select',
            options: []
          },
          {
            prop: 'colour',
            label: '颜色',
            type: 'select',
            options: []
          },
          {
            prop: 'aperture',
            label: '孔径',
            type: 'select',
            options: []
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'daterange',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'createByName',
            label: '创建人',
            type: 'input'
          },
          {
            prop: 'remark',
            label: '备注',
            type: 'input'
          }
        ]
        this.productSourceList = [
          { label: '组装', value: 'assemble' },
          { label: '生产', value: 'produce' },
          { label: '采购', value: 'purchase' },
          { label: '外协', value: 'out' }
        ]
      } else {
        if (newVal == 'finish_product') {
          this.dataTableFlag = true
          this.superQueryJson = [
            {
              prop: 'code',
              label: '产品编码',
              type: 'input'
            },
            {
              prop: 'drawingNo',
              label: '品名规格',
              type: 'input'
            },

            {
              prop: 'name',
              label: '产品名称',
              type: 'input'
            },
            {
              prop: 'productCategoryName',
              label: '产品分类',
              type: 'input'
            },
            {
              prop: 'mainUnit',
              label: '单位',
              type: 'select'
            },
            {
              prop: 'productSource',
              label: '产品来源',
              type: 'select',
              options: [
                { label: '生产', value: 'produce' },
                { label: '采购', value: 'purchase' },
                { label: '外协', value: 'out' }
              ]
            },
            {
              prop: 'productStatus',
              label: '产品状态',
              type: 'select',
              options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }]
            },
            {
              prop: 'brand',
              label: '品牌',
              type: 'select',
              options: []
            },
            {
              prop: 'model',
              label: '型号',
              type: 'select',
              options: []
            },
            {
              prop: 'sealingCoverStructure',
              label: '密封盖-结构',
              type: 'select',
              options: []
            },
            {
              prop: 'sealingCoverTyping',
              label: '密封盖-打字',
              type: 'select',
              options: []
            },
            {
              prop: 'structureType',
              label: '结构类型',
              type: 'select',
              options: []
            },
            {
              prop: 'clearance',
              label: '游隙',
              type: 'select',
              options: []
            },
            {
              prop: 'steelBallManufacturer',
              label: '钢球厂家',
              type: 'select',
              options: []
            },

            {
              prop: 'oil',
              label: '油脂',
              type: 'select',
              options: []
            },
            {
              prop: 'oilQuantity',
              label: '油脂量',
              type: 'select',
              options: []
            },
            {
              prop: 'noise',
              label: '噪音',
              type: 'select',
              options: []
            },
            {
              prop: 'holder',
              label: '保持架',
              type: 'select',
              options: []
            },
            {
              prop: 'accuracyLevel',
              label: '精度等级',
              type: 'select',
              options: []
            },
            {
              prop: 'vibrationLevel',
              label: '振动等级',
              type: 'select',
              options: []
            },
            {
              prop: 'colour',
              label: '颜色',
              type: 'select',
              options: []
            },
            {
              prop: 'aperture',
              label: '孔径',
              type: 'select',
              options: []
            },
            {
              prop: 'createTime',
              label: '创建时间',
              type: 'daterange',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
              pickerOptions: this.global.timePickerOptions
            },
            {
              prop: 'createByName',
              label: '创建人',
              type: 'input'
            },
            {
              prop: 'remark',
              label: '备注',
              type: 'input'
            }
          ]
          this.productSourceList = [
            { label: '组装', value: 'assemble' },
            { label: '生产', value: 'produce' },
            { label: '采购', value: 'purchase' },
            { label: '外协', value: 'out' }
          ]
        } else {
          this.dataTableFlag = false
          this.superQueryJson = [
            {
              prop: 'code',
              label: '产品编码',
              type: 'input'
            },
            {
              prop: 'drawingNo',
              label: '品名规格',
              type: 'input'
            },

            {
              prop: 'name',
              label: '产品名称',
              type: 'input'
            },
            {
              prop: 'productCategoryName',
              label: '产品分类',
              type: 'input'
            },
            {
              prop: 'mainUnit',
              label: '单位',
              type: 'select'
            },
            {
              prop: 'productSource',
              label: '产品来源',
              type: 'select',
              options: [
                { label: '生产', value: 'produce' },
                { label: '采购', value: 'purchase' },
                { label: '外协', value: 'out' }
              ]
            },
            {
              prop: 'productStatus',
              label: '产品状态',
              type: 'select',
              options: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }]
            },
            {
              prop: 'brand',
              label: '品牌',
              type: 'select',
              options: []
            },

            {
              prop: 'createTime',
              label: '创建时间',
              type: 'daterange',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
              pickerOptions: this.global.timePickerOptions
            },
            {
              prop: 'createByName',
              label: '创建人',
              type: 'input'
            }
          ]
          this.productSourceList = [
            { label: '生产', value: 'produce' },
            { label: '采购', value: 'purchase' },
            { label: '外协', value: 'out' }
          ]
        }
      }

      this.getcategoryTree()
      this.initData()
    },
    tableData: {
      // immediate:true,
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          if ((item.purchasePrice && item.purchaseTaxRate) || (item.purchasePrice && item.purchaseTaxRate == 0)) {
            item.purchaseExcludingTaxPrice = this.jnpf.numberFormat(
              item.purchasePrice / (1 + (item.purchaseTaxRate * 1) / 100)
            )
            console.log(item.purchaseExcludingTaxPrice, 'l')
          } else {
            item.purchaseExcludingTaxPrice = ''
          }
          if ((item.salesPrice && item.salesTaxRate) || (item.salesPrice && item.salesTaxRate == 0)) {
            item.salesExcludingTaxPrice = this.jnpf.numberFormat(item.salesPrice / (1 + (item.salesTaxRate * 1) / 100))
            console.log(item.salesExcludingTaxPrice, 'l')
          } else {
            item.salesExcludingTaxPrice = ''
          }

          // if (item.purchaseQuantity && item.excludingTaxPrice) {
          //   item.excludingTaxAmount = this.jnpf.numberFormat(item.purchaseQuantity * item.excludingTaxPrice)
          // }
          // if (item.price && item.purchaseQuantity && item.excludingTaxAmount) {
          //   item.taxAmount = this.jnpf.numberFormat(item.price * item.purchaseQuantity - item.excludingTaxAmount)
          // }
          // if (item.excludingTaxAmount && item.taxAmount) {
          //   item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          // }
          // if (!item.price) {
          //   this.$message.error('未找到供应商单价')
          // }
        })
      },
      deep: true
    }
  },
  mounted() {
    this.getProductClassFun()
    this.getclassAttributeList()
  },
  created() {
    if (localStorage.getItem(`${this.listQuery.classAttribute}productPriceSettingFlag`)) {
      let roleFlag = JSON.parse(localStorage.getItem(`${this.listQuery.classAttribute}productPriceSettingFlag`))
      console.log(roleFlag, 'fff')
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
    this.getcategoryTree()
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.getBimBusinessSwitchConfigList()
    this.initData()
  },
  computed: {
    ...mapState('user', ['token'])
  },
  methods: {
    getclassAttributeList() {
      let obj = {}
      getclassAttributeList(obj).then((res) => {
        this.categoryList = res.data.records
        console.log(this.categoryList, 'list')
      })
    },
    purchaseTaxRateChange(row) {
      console.log(row)
      updateProductPrice(row).then((res) => {
        console.log(res, 'iiiF')
      })
      this.initData()
    },
    purchasePriceChange(row) {
      console.log(row, 'h')
      if (!row.purchasePrice) return this.$message.error('错了哦，这是一条错误消息')

      updateProductPrice(row).then((res) => {
        console.log(res, 'iiiF')
      })
      this.initData()
    },
    salesTaxRate(row) {
      console.log(row)
      updateProductPrice(row).then((res) => {
        console.log(res, 'iiiF')
      })
      this.initData()
    },
    salesPriceChange(row) {
      console.log(row, 'h')
      if (!row.salesPrice) return this.$message.error('错了哦，这是一条错误消息')

      updateProductPrice(row).then((res) => {
        console.log(res, 'iiiF')
      })
      this.initData()
    },

    productCategoryChange(val, data) {
      this.quickForm.productCategoryName = data[0].name
      this.quickForm.productCategoryId = data[0].id
    },
    handleClose() {
      this.quickVisible = false
      this.$refs.quickForm.resetFields()
    },

    getBimBusinessSwitchConfigList() {
      let obj = {
        pageSize: 1, // 1是编码 0是财务
        businessCode: 'product' //attachment——附件   warehouse——仓库
      }
      getBimBusinessSwitchConfigList(obj).then((res) => {
        if (res.data.product[0].configValue1 == 1) {
          this.configFlag = true
        } else {
          this.configFlag = false
        }
      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa007',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj1).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverTyping')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa006',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj2).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'accuracyLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa005',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj3).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'vibrationLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa002',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj4).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oil')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa003',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj5).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oilQuantity')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa001',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj6).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'clearance')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa015',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj7).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'packagingMethod')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj8 = {
        pageNum: 1,
        pageSize: 100
      }
      getUnitData(obj8).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        this.unitOptions = arr
        // let oilObj = this.superQueryJson.find((item) => item.prop === 'mainUnit')
        this.superQueryJson.forEach((tc) => {
          if (tc.prop === 'mainUnit') {
            tc.options = arr
          }
        })
      })
      let obj9 = {
        pageNum: -1,
        pageSize: 20
      }
      getbimProductsModelList(obj9).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.model,
            value: item.model
          }
          arr.push(obj)
        })
        let modelObj = this.superQueryJson.find((item) => item.prop === 'model')

        if (modelObj) {
          // 将options赋值为5
          modelObj.options = arr
        }
      })

      let obj10 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa011',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj10).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let brandObj = this.superQueryJson.find((item) => item.prop === 'brand')

        if (brandObj) {
          // 将options赋值为5
          brandObj.options = arr
        }
      })

      let obj11 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa013',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj11).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'structureType')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })
      let obj12 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa012',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj12).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverStructure')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })
      let obj13 = {
        pageNum: -1,
        pageSize: 20,
        type: 'supplier'
      }
      getCooperativeData(obj13).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.id
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'steelBallManufacturer')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })
      let obj14 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa014',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj14).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'noise')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })
      let obj15 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa004',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj15).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'holder')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })

      let obj16 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa010',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj16).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'colour')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })

      let obj17 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa009',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj17).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'aperture')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log(this.taxRateList, 'v')
      })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      console.log(this.dataTableFlag, 'this.dataTableFlag')
      console.log(this.$refs, 'ff')
      if (this.dataTableFlag) {
        console.log(1)
        this.$refs.dataTable.showDrawer()
      } else {
        console.log(3)
        this.$refs.otherTable.showDrawer()
      }
    },

    // 展开或折叠全部
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
    // // 设置默认展开
    setexpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem(`${this.listQuery.classAttribute}productPriceSettingFlag`, expands)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取指定树状列表
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = '' // 重置数据类型id筛选
      getcategoryTree({
        classAttribute: this.listQuery.classAttribute,
        type: 'material'
      })
        .then((res) => {
          this.treeData = res.data.length ? res.data : []
          this.$nextTick(() => {
            this.treeLoading = false
            this.initData()
          })
        })
        .catch(() => {
          this.treeLoading = false
          this.listLoading = false
        })
    },
    handleNodeClick(data, node) {
      if (this.listQuery.productCategoryId === data.id) return
      this.listQuery.productCategoryId = data.id
      this.listQuery.productCategoryCode = data.code
      this.search()
    },

    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.aiformVisible = false
      if (isRefresh) {
        this.initData()
      }
    },

    initData() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      // this.listQuery.pageNum = 1
      this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
      getProductList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.$refs.SuperQuery.conditionList = []
      this.filterText = ''
      this.initData()
    },

    addOrUpdateHandle(id, btnType, flag) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType, flag)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deleteProduct(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    // 导入
    importForm() {
      if (!this.listQuery.productCategoryId) {
        this.$message.warning('请先选择产品分类')
      } else {
        // this.$refs.UploadProduct.$el.querySelector('input').click()
        this.uploadVisib = true
      }
    },
    handleRemove(file, fileList) { },
    handlePreview(file) { },
    handleFileChange(file) {
      this.file = file.raw
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/成品导入模板.xlsx')
      a.click()
    },

    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    }
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
.custom_title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  margin-left: -12px;
}

.required {
  color: red;
  margin-left: 4px;
}

::v-deep .el-dialog__body {
  padding: 0px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
</style>
