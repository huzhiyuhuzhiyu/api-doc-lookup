<template>
  <div style="height: 100%;margin-top: -8px;">
    <div style="height: 57px;">
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
    <div class="JNPF-common-layout" style="height: calc(99% - 50px);">
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
          <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands" :highlight-current="highlightCurrentFlag"
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

      <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="listLoading">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.productCode" placeholder="产品编码" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="isProductNameSwitch === '1'">
              <el-form-item>
                <el-input v-model.trim="listQuery.productName" placeholder="产品名称" clearable
                  @keyup.enter.native="search()" />
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
                <el-select v-model="listQuery.productSource" placeholder="产品来源" clearable style="width: 100%;" @change="productSourceChange">
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
          <template v-if="tableFlag">
            <JNPF-table v-show="dataTableFlag" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
              ref="dataTable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_547744">
              <el-table-column prop="projectName" label="所属项目" width="140" sortable="custom"
                v-if="isProjectSwitch === '1'"></el-table-column>
              <el-table-column prop="code" label="产品编码" min-width="140" sortable="custom">
              </el-table-column>
              <el-table-column prop="name" label="产品名称" width="120"
                v-if="isProductNameSwitch === '1'"></el-table-column>
              <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
              <el-table-column prop="productCategoryName" label="产品分类" width="120" sortable="custom" />
              <el-table-column prop="productSource" label="产品来源" width="120" sortable="custom">
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
              <el-table-column prop="mainUnit" label="单位" width="60" />
              <el-table-column prop="purchaseTaxRate" label="采购税率" width="120" align="center">
                <template slot="header" slot-scope="scope">
                  采购税率
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="采购税率：采购订单和采购收货入库默认从供应商产品价格中获取税率，如果供应商产品价格获取不到税率，则会从这里获取采购税率。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
                <template slot-scope="{ row }">
                  <el-select v-model="row.purchaseTaxRate" placeholder="请选择" @change="purchaseTaxRateChange(row)">
                    <el-option v-for="item in taxRateList" :key="item.taxRate" :label="item.fullName"
                      :value="item.enCode"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="purchasePrice" label="采购单价(含税)" width="160" align="center">
                <template slot="header" slot-scope="scope">
                  采购单价(含税)
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="采购单价：采购订单和采购收货入库默认从供应商产品价格中获取单价，如果供应商产品价格获取不到单价，则会从这里获取采购单价。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
                <template slot-scope="{ row }">
                  <el-input v-model="row.purchasePrice" placeholder="请输入内容" @blur="purchasePriceChange(row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="purchaseExcludingTaxPrice" label="采购单价(不含税)" width="180">
                <template slot="header" slot-scope="scope">
                  采购单价(不含税)
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="采购单价：采购订单和采购收货入库默认从供应商产品价格中获取单价，如果供应商产品价格获取不到单价，则会从这里获取采购单价。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="salesTaxRate" label="销售税率" width="120" align="center">
                <template slot="header" slot-scope="scope">
                  销售税率
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="销售税率：销售订单和销售发货出库默认从客户产品价格中获取税率，如果客户产品价格获取不到税率，则会从这里获取销售税率。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
                <template slot-scope="{ row }">
                  <el-select v-model="row.salesTaxRate" placeholder="请选择" @change="salesTaxRateChange(row)">
                    <el-option v-for="item in taxRateList" :key="item.taxRate" :label="item.fullName"
                      :value="item.enCode"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="salesPrice" label="销售单价(含税)" width="160" align="center">
                <template slot="header" slot-scope="scope">
                  销售单价(含税)
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="销售价格：销售订单和销售发货出库默认从客户产品价格中获取单价，如果客户产品价格获取不到单价，则会从这里获取销售单价。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
                <template slot-scope="{ row }">
                  <el-input v-model="row.salesPrice" placeholder="请输入内容" @blur="salesPriceChange(row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="salesExcludingTaxPrice" label="销售单价(不含税)" width="180">
                <template slot="header" slot-scope="scope">
                  销售单价(不含税)
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="销售价格：销售订单和销售发货出库默认从客户产品价格中获取单价，如果客户产品价格获取不到单价，则会从这里获取销售单价。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="model" label="型号" width="120" sortable="custom" />
              <el-table-column prop="sealingCoverStructure" label="密封盖-结构" width="140" sortable="custom" />
              <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  width="140" sortable="custom" />
              <el-table-column prop="structureType" label="结构类型" width="140" sortable="custom" />
              <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" />

              <el-table-column prop="oil" label="油脂" width="100" sortable="custom" />
              <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" />
              <el-table-column prop="noise" label="噪音" width="100" sortable="custom" />
              <el-table-column prop="holder" label="保持架" width="100" sortable="custom" />
              <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom" />
              <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  width="120" sortable="custom" />
              <el-table-column prop="colour" :label="$store.getters.colour"  width="100" sortable="custom" />
              <el-table-column prop="aperture" label="孔径" width="100" sortable="custom" />
              <el-table-column prop="remark" label="备注" width="120" />
              <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
              <el-table-column prop="createByName" label="创建人" />
            </JNPF-table>
            <JNPF-table v-show="!dataTableFlag" :data="tableData" :fixedNO="true" @sort-change="sortChange"
              custom-column ref="otherTable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_970309">
              <el-table-column prop="projectName" label="所属项目" width="140" sortable="custom"
                v-if="isProjectSwitch === '1'"></el-table-column>
              <el-table-column prop="code" label="产品编码" min-width="140" sortable="custom">
              </el-table-column>
              <el-table-column prop="name" label="产品名称" min-width="140" sortable="custom">
              </el-table-column>
              <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
              <el-table-column prop="productCategoryName" label="产品分类" width="120" sortable="custom" />
              <el-table-column prop="productSource" label="产品来源" width="120" sortable="custom">
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
                <template slot="header" slot-scope="scope">
                  采购税率
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="采购税率：采购订单和采购收货入库默认从供应商产品价格中获取税率，如果供应商产品价格获取不到税率，则会从这里获取采购税率。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
                <template slot-scope="{ row }">
                  <el-select v-model="row.purchaseTaxRate" placeholder="请选择" @change="purchaseTaxRateChange(row)">
                    <el-option v-for="item in taxRateList" :key="item.taxRate" :label="item.fullName"
                      :value="item.enCode"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="purchasePrice" label="采购单价(含税)" width="160" align="center">
                <template slot="header" slot-scope="scope">
                  采购单价(含税)
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="采购单价：采购订单和采购收货入库默认从供应商产品价格中获取单价，如果供应商产品价格获取不到单价，则会从这里获取采购单价。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
                <template slot-scope="{ row }">
                  <el-input v-model="row.purchasePrice" placeholder="请输入内容" @blur="purchasePriceChange(row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="purchaseExcludingTaxPrice" label="采购单价(不含税)" width="175">
                <template slot="header" slot-scope="scope">
                  采购单价(不含税)
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="采购单价：采购订单和采购收货入库默认从供应商产品价格中获取单价，如果供应商产品价格获取不到单价，则会从这里获取采购单价。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="salesTaxRate" label="销售税率" width="120" align="center">
                <template slot="header" slot-scope="scope">
                  销售税率
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="销售税率：销售订单和销售发货出库默认从客户产品价格中获取税率，如果客户产品价格获取不到税率，则会从这里获取销售税率。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
                <template slot-scope="{ row }">
                  <el-select v-model="row.salesTaxRate" placeholder="请选择" @change="salesTaxRateChange(row)">
                    <el-option v-for="item in taxRateList" :key="item.taxRate" :label="item.fullName"
                      :value="item.enCode"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="salesPrice" label="销售单价(含税)" width="160" align="center">
                <template slot="header" slot-scope="scope">
                  销售单价(含税)
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="销售价格：销售订单和销售发货出库默认从客户产品价格中获取单价，如果客户产品价格获取不到单价，则会从这里获取销售单价。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
                <template slot-scope="{ row }">
                  <el-input v-model="row.salesPrice" placeholder="请输入内容" @blur="salesPriceChange(row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="salesExcludingTaxPrice" label="销售单价(不含税)" width="175">
                <template slot="header" slot-scope="scope">
                  销售单价(不含税)
                  <el-popover placement="bottom" width="200" trigger="click"
                    content="销售价格：销售订单和销售发货出库默认从客户产品价格中获取单价，如果客户产品价格获取不到单价，则会从这里获取销售单价。">
                    <el-button style="margin-left: -13px;color: black;" icon="el-icon-question" circle slot="reference"
                      type="text"></el-button>
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column prop="remark" label="备注" width="120" />
              <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
              <el-table-column prop="createByName" label="创建人" />
            </JNPF-table>
          </template>
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

import { mapState, mapGetters } from 'vuex'
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
import { getProjectList } from '@/api/system/projectManagement'
export default {
  components: { SuperQuery },
  name: 'productPriceSetting',
  data() {
    return {
      highlightCurrentFlag:false,
      isProjectSwitch: '',
      isProductNameSwitch: '',
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
      tableFlag: false,
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
        orderItems: [
          {
            asc: true,
            column: 'drawing_no'
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
        productStatus: 'enable', // 产品状态
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
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'code',
          label: '产品编码',
          type: 'input'
        },

        {
          prop: 'productCategoryName',
          label: '产品分类',
          type: 'input'
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
          prop: 'mainUnit',
          label: '单位',
          type: 'select'
        },

        {
          prop: 'purchaseTaxRate',
          label: '采购税率',
          type: 'select',
          options: this.taxRateList
        },
        {
          prop: 'purchasePrice',
          label: '采购单价(含税)',
          type: 'select',
          options: this.taxRateList
        },
        {
          prop: 'purchaseExcludingTaxPrice',
          label: '采购单价(不含税)',
          type: 'select',
          options: this.taxRateList
        },
        {
          prop: 'salesTaxRate',
          label: '销售税率',
          type: 'select',
          options: this.taxRateList
        },
        {
          prop: 'salesPrice',
          label: '销售单价(含税)',
          type: 'select',
          options: this.taxRateList
        },
        {
          prop: 'salesExcludingTaxPrice',
          label: '销售单价(不含税)',
          type: 'select',
          options: this.taxRateList
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
    productSourceChange(){
      this.initData()
    },
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },
    'listQuery.classAttribute': function (newVal) {
      if (localStorage.getItem(`${this.listQuery.classAttribute}productPriceSettingFlag`)) {
        let roleFlag = JSON.parse(localStorage.getItem(`${this.listQuery.classAttribute}productPriceSettingFlag`))

        this.expands = roleFlag
        this.toggleExpand(roleFlag)
      }

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
            prop: 'productCategoryName',
            label: '产品分类',
            type: 'input'
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
            prop: 'mainUnit',
            label: '单位',
            type: 'select'
          },

          {
            prop: 'purchaseTaxRate',
            label: '采购税率',
            type: 'select',
            options: this.taxRateList
          },
          {
            prop: 'purchasePrice',
            label: '采购单价(含税)',
            type: 'select',
            options: this.taxRateList
          },
          {
            prop: 'purchaseExcludingTaxPrice',
            label: '采购单价(不含税)',
            type: 'select',
            options: this.taxRateList
          },
          {
            prop: 'salesTaxRate',
            label: '销售税率',
            type: 'select',
            options: this.taxRateList
          },
          {
            prop: 'salesPrice',
            label: '销售单价(含税)',
            type: 'select',
            options: this.taxRateList
          },
          {
            prop: 'salesExcludingTaxPrice',
            label: '销售单价(不含税)',
            type: 'select',
            options: this.taxRateList
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
            prop: 'vibrationLevel',
            label: '振动等级',
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
            prop: 'remark',
            label: '备注',
            type: 'input'
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
        if (this.isProductNameSwitch === '1') {
          this.superQueryJson.splice(1, 0, {
            prop: 'productName',
            label: '产品名称',
            type: 'input'
          })
        }
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
              prop: 'productCategoryName',
              label: '产品分类',
              type: 'input'
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
              prop: 'mainUnit',
              label: '单位',
              type: 'select'
            },

            {
              prop: 'purchaseTaxRate',
              label: '采购税率',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'purchasePrice',
              label: '采购单价(含税)',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'purchaseExcludingTaxPrice',
              label: '采购单价(不含税)',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'salesTaxRate',
              label: '销售税率',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'salesPrice',
              label: '销售单价(含税)',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'salesExcludingTaxPrice',
              label: '销售单价(不含税)',
              type: 'select',
              options: this.taxRateList
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
              prop: 'vibrationLevel',
              label: '振动等级',
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
              prop: 'remark',
              label: '备注',
              type: 'input'
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
          if (this.isProductNameSwitch === '1') {
            this.superQueryJson.splice(1, 0, {
              prop: 'productName',
              label: '产品名称',
              type: 'input'
            })
          }
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
              prop: 'productCategoryName',
              label: '产品分类',
              type: 'input'
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
              prop: 'mainUnit',
              label: '单位',
              type: 'select'
            },

            {
              prop: 'purchaseTaxRate',
              label: '采购税率',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'purchasePrice',
              label: '采购单价(含税)',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'purchaseExcludingTaxPrice',
              label: '采购单价(不含税)',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'salesTaxRate',
              label: '销售税率',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'salesPrice',
              label: '销售单价(含税)',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'salesExcludingTaxPrice',
              label: '销售单价(不含税)',
              type: 'select',
              options: this.taxRateList
            },
            {
              prop: 'remark',
              label: '备注',
              type: 'input'
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
          if (this.isProductNameSwitch === '1') {
            this.superQueryJson.splice(1, 0, {
              prop: 'productName',
              label: '产品名称',
              type: 'input'
            })
          }
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
          } else {
            item.purchaseExcludingTaxPrice = ''
          }
          if ((item.salesPrice && item.salesTaxRate) || (item.salesPrice && item.salesTaxRate == 0)) {
            item.salesExcludingTaxPrice = this.jnpf.numberFormat(item.salesPrice / (1 + (item.salesTaxRate * 1) / 100))
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
  async created() {
    if (localStorage.getItem(`${this.listQuery.classAttribute}productPriceSettingFlag`)) {
      let roleFlag = JSON.parse(localStorage.getItem(`${this.listQuery.classAttribute}productPriceSettingFlag`))

      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
    await this.getProductNameSwitch('product', 'enable_productName')
    this.getcategoryTree()
    this.getProjectSwitch()
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

    this.getBimBusinessSwitchConfigList()

    this.initData()
  },
  computed: {
    ...mapState('user', ['token']),
    ...mapGetters(['userInfo'])
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    getclassAttributeList() {
      let obj = {
        orderItems: [{ asc: true, column: 'sort' }]
      }
      getclassAttributeList(obj).then((res) => {
        this.categoryList = res.data.records.filter((item) => item.code !== 'spare_parts')
      })
    },
    purchaseTaxRateChange(row) {
      updateProductPrice(row).then((res) => { })
      this.initData()
    },
    purchasePriceChange(row) {
      if (!row.purchasePrice) return this.$message.error('采购单价(含税)不能为空')
      if (Number(row.purchasePrice) < 0) return this.$message.error('采购单价(含税)不能小于0')
      if (!/^-?\d+\.?\d*$/.test(row.purchasePrice)) return this.$message.error('采购单价(含税)应该是数字')
      updateProductPrice(row).then((res) => { })
      this.initData()
    },
    salesTaxRateChange(row) {
      updateProductPrice(row).then((res) => { })
      this.initData()
    },
    salesPriceChange(row) {
      if (!row.salesPrice) return this.$message.error('销售单价(含税)不能为空')
      if (Number(row.salesPrice) < 0) return this.$message.error('销售单价(含税)不能小于0')
      if (!/^-?\d+\.?\d*$/.test(row.salesPrice)) return this.$message.error('销售单价(含税)应该是数字')

      updateProductPrice(row).then((res) => { })
      this.initData()
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
    getProjectSwitch() {
      let obj = {
        businessCode: 'system',
        pageSize: -1
      }
      getBimBusinessSwitchConfigList(obj).then((res) => {
        res.data.system.forEach((item) => {
          if (item.configKey == 'project') {
            this.isProjectSwitch = item.configValue1
            console.log(this.isProjectSwitch, 'this.isProjectSwitch')
          }
        })
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
      })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      if (this.dataTableFlag) {
        this.$refs.dataTable.showDrawer()
      } else {
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
      let newProp
      if (prop === 'productCategoryName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
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
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      console.log(this.listLoading, 'this.listLoading')
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      // this.listQuery.pageNum = 1
      this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
      getProductList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.tableFlag = true
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
      this.highlightCurrentFlag=false

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
