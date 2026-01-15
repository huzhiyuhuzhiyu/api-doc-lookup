<template>
  <div class="JNPF-common-layout" :element-loading-text="loadingText">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title">
        <h2 v-if="!leftFlag">产品分类</h2>
        <span class="options" v-if="!leftFlag">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false"/>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree(true)">刷新数据</el-dropdown-item>
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
            ]"/>
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
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:8px">
          <div>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle('','add')">
              新建
            </el-button>
            <!--            <el-dropdown style="margin-right:10px;" v-if="configFlag">-->
            <!--              <el-button size="mini" type="primary" icon="el-icon-plus">-->
            <!--                新建-->
            <!--                <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            <!--              </el-button>-->
            <!--              <el-dropdown-menu slot="dropdown">-->
            <!--                <el-dropdown-item @click.native="addOrUpdateHandle('',false, configFlag)">普通新建</el-dropdown-item>-->
            <!--                <el-dropdown-item @click.native="aiAdd()">智能新建</el-dropdown-item>-->
            <!--              </el-dropdown-menu>-->
            <!--            </el-dropdown>-->
            <!--            <el-dropdown style="margin-right:10px;" v-else>-->
            <!--              <el-button size="mini" type="primary" icon="el-icon-plus">-->
            <!--                新建-->
            <!--                <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            <!--              </el-button>-->
            <!--              <el-dropdown-menu slot="dropdown">-->
            <!--                <el-dropdown-item @click.native="quickAdd()">快速新建</el-dropdown-item>-->
            <!--                <el-dropdown-item @click.native="addOrUpdateHandle('', false, configFlag)">普通新建</el-dropdown-item>-->
            <!--              </el-dropdown-menu>-->
            <!--            </el-dropdown>-->
            <!-- <el-button size="mini" type="primary" icon="el-icon-plus" @click="aiAdd">智能新建</el-button> -->
            <!-- <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button> -->
            <el-button class="imporBtn" size="mini" type="primary" icon="el-icon-plus" @click="importForm">导入</el-button>
            <el-button class="imporBtns" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </div>

          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.dataTable.showSortDrawer()" />
              </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()"/>
            </el-tooltip>

            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()"/>
            </el-tooltip>
          </div>
        </div>
        <JNPF-table :data="tableData" :fixedNO="true" custom-column
          ref="dataTable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_337892" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="code" label="产品编码" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="产品名称" min-width="140"/>
          <el-table-column prop="drawingNo" label="型号" min-width="300"/>
          <el-table-column prop="productCategoryName" label="产品分类" width="120"/>
          <el-table-column prop="mainUnit" label="主单位" width="120"/>
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

          <el-table-column prop="productStatus" label="产品状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag type="success" disable-transitions v-if="row.productStatus == 'enable'">启用</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="row.productStatus == 'disabled'">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productionLineName" label="产线" min-width="120"/>
          <el-table-column prop="customerProductDrawingNo" label="客户型号" min-width="220"/>
          <el-table-column prop="model" label="型号" width="120"/>
          <el-table-column prop="sealingCoverStructure" label="密封盖-结构" width="120"/>
          <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping" width="140"/>
          <el-table-column prop="structureType" label="结构类型" width="120"/>
          <el-table-column prop="clearance" label="游隙" width="120"/>
          <el-table-column prop="steelBallManufacturer" label="钢球厂家" width="120"/>
          <el-table-column prop="oil" label="油脂" width="120"/>
          <el-table-column prop="oilQuantity" label="油脂量" width="120"/>
          <el-table-column prop="noise" label="噪音" width="120"/>
          <el-table-column prop="holder" label="保持架" width="120"/>
          <el-table-column prop="vibrationLevel" label="振动等级" width="120"/>
          <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel" width="120"/>
          <el-table-column prop="colour" :label="$store.getters.colour" width="120"/>
          <el-table-column prop="aperture" label="孔径" width="120"/>
          <el-table-column prop="remark" label="备注" width="120"/>
          <el-table-column prop="createTime" label="创建时间" min-width="180"/>
          <el-table-column prop="createByName" label="创建人"/>
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id, 'edit')"
                @del="handleDel(scope.row.id)">
                <el-button type="text" size="mini" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                  查看详情
                </el-button>
                <el-button type="text" size="mini" @click.native="copyHandle(scope.row.id, 'copy')">
                  复制
                </el-button>
                <!-- <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData()"/>
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData()" @close="closeForm"/>
    <aiForm v-if="aiformVisible" ref="aiForm" @close="closeForm"/>

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download"/>
    <!-- 导入产品 -->
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct"/>
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">

      <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
        :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选取文件上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传.xls/.xlsx文件
          <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">
            下载模板
          </el-button>
        </div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="saveSubmit()">
          提交
        </el-button>
      </span>
    </el-dialog>
    <el-dialog title="快速创建" :visible.sync="quickVisible" width="50%" :before-close="handleClose"
      class="JNPF-dialog JNPF-dialog_center" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="quickForm" :rules="quickRules" ref="quickForm" label-width="100px" labelPosition="top"
        hide-required-asterisk="fasle" :close-on-click-modal="false">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="产品编码" prop="code">
              <template slot="label">
                产品编码
                <span class="required">*</span>
              </template>
              <el-input v-model="quickForm.code" placeholder="请输入产品编码" :disabled="codeConfig.modifyFlag == true ? false : true
                "></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="isProductNameSwitch === '1'">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="quickForm.name" placeholder="请输入产品名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="型号" prop="drawingNo">
              <template slot="label">
                型号
                <span class="required">*</span>
              </template>
              <el-input v-model="quickForm.drawingNo" placeholder="请输入型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品分类" prop="productCategoryName">
              <template slot="label">
                产品分类
                <span class="required">*</span>
              </template>
              <ComSelect-list v-model="quickForm.productCategoryName" placeholder="请选择产品分类" auth
                @change="productCategoryChange" :title="'选择产品分类'" :method="getcategoryCoop"
                :requestObj="quickRequestObj" :dataFormatting="dataFormatting"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <template slot="label">
                单位
                <span class="required">*</span>
              </template>
              <el-select v-model="quickForm.unit" placeholder="请选择单位" style="width: 100%;" filterable>
                <el-option v-for="item in unitOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品来源" prop="productSource">
              <template slot="label">
                产品来源
                <span class="required">*</span>
              </template>
              <el-select v-model="quickForm.productSource" placeholder="请选择产品来源" style="width: 100%;">
                <el-option v-for="item in productSourceOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('quickForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import {excelExport, getBimBusinessSwitchConfigList, getCooperativeData} from '@/api/basicData/index'
import {checkCodeExist, checkDrawExist, cpAddProduct, deleteProduct, getProductList, uploadCpProductData, uploadUnCpProductData} from '@/api/masterDataManagement/productManage'
import {getcategoryTree, getcategoryTree as getcategoryCoop, getUnitData} from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import Form from './Form'
import aiForm from './aiForm'
import {mapGetters, mapState} from 'vuex'
import {getbimProductAttributes, getbimProductAttributesListMap, getbimProductsModelList} from '@/api/masterDataManagement/index'

export default {
  components: {Form, ExportForm, aiForm},
  name: 'finished_product',
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            // {
            //   prop: 'createTime', // 属性*
            //   value: [this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'today-29'), this.jnpf.getToday('YYYY-MM-DD HH:mm:ss', 'todayLastMoment')], // 默认值
            //   symbol: 'between', // 比较符*
            //   timeOffset: true, // 保存视图后的静态时间区间随实际查询时刻偏移
            //   fixed: true // 是否在搜索栏显示
            // },
            { prop: 'productSource', symbol: '==', fixed: true },
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      highlightCurrentFlag: false,
      importProjectId: '',
      isProductNameSwitch: '',
      bimProductAttributesObj: {},
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
        projectId: [{required: true, message: '请选择所属项目', trigger: 'change'}],
        code: [
          {required: true, message: '请输入产品编码', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (this.quickForm.code === this.autoDrawingNo) {
                callback()
              } else {
                // this.jnpf.specialCodeUrl 对浏览器无法解析的url字符进行手动转码
                checkCodeExist({
                  id: this.quickForm.id || '',
                  code: this.jnpf.specialCodeUrl(this.quickForm.code)
                })
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('此产品编码已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              }
            },
            trigger: 'blur'
          }
        ],
        drawingNo: [
          {required: true, message: '请输入型号', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (this.quickForm.drawingNo === this.autoDrawingNo) {
                callback()
              } else {
                // this.jnpf.specialCodeUrl 对浏览器无法解析的url字符进行手动转码
                checkDrawExist({
                  id: this.quickForm.id || '',
                  drawingNo: this.jnpf.specialCodeUrl(this.quickForm.drawingNo)
                })
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('此型号已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              }
            },
            trigger: 'blur'
          }
        ],
        unit: [{required: true, message: '请输入单位', trigger: 'blur'}],
        productCategoryName: [{required: true, message: '请选择产品分类', trigger: 'change'}],
        productSource: [{required: true, message: '请选择产品来源', trigger: 'change'}]
      },
      getcategoryCoop,
      productSourceOptions: [
        {label: '组装', value: 'assemble'},
        {label: '生产', value: 'produce'},
        {label: '采购', value: 'purchase'},
        {label: '外协', value: 'out'}
      ],
      quickRequestObj: {
        classAttribute: 'finish_product'
      },
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
      listQuery: {
        classAttribute: 'finish_product',
        customerProductFlag: true
      },
      productStatusList: [{label: '启用', value: 'enable'}, {label: '禁用', value: 'disabled'}], // 产品状态
      productSourceList: [
        {label: '组装', value: 'assemble'},
        {label: '生产', value: 'produce'},
        {label: '采购', value: 'purchase'},
        {label: '外协', value: 'out'}
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
      superQueryJson: [{
        prop: 'mainUnit',
        label: '主单位',
        type: 'select'
      }, {
        prop: 'productSource',
        label: '产品来源',
        type: 'select',
        options: [{
          label: '生产',
          value: 'produce'
        }, {
          label: '采购',
          value: 'purchase'
        }, {
          label: '外协',
          value: 'out'
        }]
      }, {
        prop: 'productStatus',
        label: '产品状态',
        type: 'select',
        options: [{
          label: '启用',
          value: 'enable'
        }, {
          label: '禁用',
          value: 'disabled'
        }]
      }, {
        prop: 'brand',
        label: '品牌',
        type: 'select',
        options: []
      }, {
        prop: 'model',
        label: '型号',
        type: 'select',
        options: []
      }, {
        prop: 'sealingCoverStructure',
        label: '密封盖-结构',
        type: 'select',
        options: []
      }, {
        prop: 'sealingCoverTyping',
        label: '密封盖-打字',
        type: 'select',
        options: []
      }, {
        prop: 'structureType',
        label: '结构类型',
        type: 'select',
        options: []
      }, {
        prop: 'clearance',
        label: '游隙',
        type: 'select',
        options: []
      }, {
        prop: 'steelBallManufacturer',
        label: '钢球厂家',
        type: 'select',
        options: []
      }, {
        prop: 'oil',
        label: '油脂',
        type: 'select',
        options: []
      }, {
        prop: 'oilQuantity',
        label: '油脂量',
        type: 'select',
        options: []
      }, {
        prop: 'noise',
        label: '噪音',
        type: 'select',
        options: []
      }, {
        prop: 'holder',
        label: '保持架',
        type: 'select',
        options: []
      }, {
        prop: 'accuracyLevel',
        label: '精度等级',
        type: 'select',
        options: []
      }, {
        prop: 'vibrationLevel',
        label: '振动等级',
        type: 'select',
        options: []
      }, {
        prop: 'colour',
        label: '颜色',
        type: 'select',
        options: []
      }, {
        prop: 'aperture',
        label: '孔径',
        type: 'select',
        options: []
      }],
      filterText: '',
      uploadVisib: false,
      configFlag: true,
      unitOptions: [],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  async created() {
    await this.getProductNameSwitch('product', 'enable_productName')

    if (localStorage.getItem('finishedFlag')) {
      let roleFlag = JSON.parse(localStorage.getItem('finishedFlag'))
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
    this.getcategoryTree(false)

    this.getBimBusinessSwitchConfigList()

  },
  computed: {
    ...mapState('user', ['token']),
    ...mapGetters(['userInfo'])
  },
  methods: {
    productSourceChange() {
      this.initData()
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) {
      }
    },
    dataFormatting(res) {
      return res.data[0].childrenList
    },
    productCategoryChange(val, data) {
      this.quickForm.productCategoryName = data[0].name
      this.quickForm.productCategoryId = data[0].id
    },
    handleClose() {
      this.quickVisible = false
      this.$refs.quickForm.resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.quickForm.mainUnit = this.quickForm.unit
          this.quickForm.deputyUnit = this.quickForm.unit
          this.quickForm.ratio = 1
          this.quickForm.calculationDirection = 'multiplication'
          this.quickForm.classAttribute = 'finish_product'
          this.quickForm.saleFlag = true
          this.quickForm.tradeFlag = false
          this.quickForm.productStatus = 'enable'

          cpAddProduct(this.quickForm).then((res) => {
            if (res.code == '200') {
              this.$message({
                message: '新建成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.quickVisible = false
                  this.$refs.quickForm.resetFields()
                  this.initData()
                }
              })
            }
          })
        } else {
          return false
        }
      })
    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (flag) {
          this.quickForm.code = data.number
        }
      } catch (error) {
      }
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
    // 选择型号 带出 密封盖 结构 打字 结构类型 游隙 钢球厂家 油脂 噪音 保持架
    modelChange(val, data, paramsObj) {
      this.$nextTick(() => {
        this.$refs['dataForm'][paramsObj.tabInd].$children[0].validateField(paramsObj.prop)
      })
      if (data && data.length) {
        // 数据有效，进行更新
        this.dataForm[paramsObj.prop] = data[0].all.model
      } else {
        // 不选择任何内容，置空绑定的值
        this.dataForm[paramsObj.prop] = ''
      }
    },

    // 获取产品属性
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesObj = res.data
        let sealingCoverTypingObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverTyping')
        if (sealingCoverTypingObj) {
          sealingCoverTypingObj.options = this.bimProductAttributesObj.pa007.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        }
        this.superQueryJson.forEach((item) => {
          if (item.prop === 'sealingCoverTyping') {
            let arr = []
            this.bimProductAttributesObj.pa007.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'accuracyLevel') {
            let arr = []
            this.bimProductAttributesObj.pa006.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'vibrationLevel') {
            let arr = []
            this.bimProductAttributesObj.pa005.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'oil') {
            let arr = []
            this.bimProductAttributesObj.pa002.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'oilQuantity') {
            let arr = []
            this.bimProductAttributesObj.pa003.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'clearance') {
            let arr = []
            this.bimProductAttributesObj.pa001.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'packagingMethod') {
            let arr = []
            this.bimProductAttributesObj.pa015.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'brand') {
            let arr = []
            this.bimProductAttributesObj.pa011.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'structureType') {
            let arr = []
            this.bimProductAttributesObj.pa013.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'sealingCoverStructure') {
            let arr = []
            this.bimProductAttributesObj.pa012.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'noise') {
            let arr = []
            this.bimProductAttributesObj.pa014.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'holder') {
            let arr = []
            this.bimProductAttributesObj.pa004.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'colour') {
            let arr = []
            this.bimProductAttributesObj.pa010.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          } else if (item.prop === 'aperture') {
            let arr = []
            this.bimProductAttributesObj.pa009.forEach((item) => {
              let obj = {
                label: item.name,
                value: item.name
              }
              arr.push(obj)
            })
            item.options = arr
          }
        })
      })
      // 单位
      let obj1 = {

        pageSize: 100
      }
      getUnitData(obj1).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        this.unitOptions = arr

        this.superQueryJson.forEach((tc) => {
          if (tc.prop === 'mainUnit') {
            tc.options = arr
          }
        })
      })
      // 型号
      let obj2 = {

        pageSize: 20
      }
      getbimProductsModelList(obj2).then((res) => {
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
          modelObj.options = arr
        }
      })
      // 钢球厂商
      let obj3 = {

        pageSize: 20,
        type: 'supplier'
      }
      getCooperativeData(obj3).then((res) => {
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
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return {label: item.label, prop: item.prop}
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let _data = {
          ...this.listQuery,
          exportType: '1200',
          exportName: '成品信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => {
          })
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
        localStorage.setItem('finishedFlag', expands)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取指定树状列表
    getcategoryTree(flag) {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = '' // 重置数据类型id筛选
      getcategoryTree({classAttribute: 'finish_product'})
        .then((res) => {
          this.treeData = res.data.length ? res.data : []
          this.$nextTick(() => {
            this.treeLoading = false
            flag && this.initData()
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
      this.initData()
    },


    // 关闭新建、编辑页面
    closeForm(isRefresh = true) {
      this.formVisible = false
      this.aiformVisible = false
      if (isRefresh) {
        this.initData()
      }
    },

    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      if (listLoadKey !== this.listLoadKey) return; // 请求过期
      this.listLoading = true
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



     addOrUpdateHandle(id, btnType) {
      this.formVisible = true

      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    // 复制
    copyHandle(id, btnType, flag, row) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType, flag, row, '')
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
        .catch(() => {
        })
    },
    // 导入
    importForm() {
      // this.$refs.UploadProduct.$el.querySelector('input').click()
      if (this.userInfo.projectId !== '1') {
        this.importProjectId = this.userInfo.projectId
      } else {
        this.importProjectId = ''
      }
      this.uploadVisib = true
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleFileChange(file) {
      this.file = file.raw
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      if (this.configFlag) {
        a.setAttribute('href', location.origin + '/static/成品导入模板.xlsx')
      } else {
        a.setAttribute('href', location.origin + '/static/成品(没有型号)导入模板.xlsx')
      }

      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      // formData.append('productCategoryId', this.listQuery.productCategoryId)
      formData.append('classAttribute', this.listQuery.classAttribute)
      //调用上传文件接口
      if (this.configFlag) {
        uploadCpProductData(formData)
          .then((res) => {
            if (!res.data) {
              this.$message.success(`导入成功`)
              this.uploadVisib = false
              this.$refs['UploadProduct']
              this.initData()
            } else {
              this.uploadVisib = false
              this.handleMessage(res.data)
            }

            this.formLoading = false
            this.loadingText = ''
            this.$refs['uploadRef'].clearFiles()
          })
          .catch((err) => {
            this.uploadVisib = false
            // this.$message.error(`导入数据超过最大限制：500`)
            this.$message.error(`导入失败`)
            this.formLoading = false
            this.loadingText = ''
            this.$refs['uploadRef'].clearFiles()
          })
      } else {
        uploadUnCpProductData(formData)
          .then((res) => {
            if (!res.data) {
              this.$message.success(`导入成功`)
              this.uploadVisib = false
              this.$refs['UploadProduct']
              this.initData()
            } else {
              this.uploadVisib = false
              this.handleMessage(res.data)
            }

            this.formLoading = false
            this.loadingText = ''
          })
          .catch((err) => {
            this.uploadVisib = false
            // this.$message.error(`导入数据超过最大限制：500`)
            this.$message.error(`导入失败`)
            this.formLoading = false
            this.loadingText = ''
          })
      }
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    saveSubmit() {
      if (!this.file) return this.$message.error('请上传文件')
      this.UploadProduct(this.file)
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: 'error',
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h(
          'div',
          {
            style: 'padding-right:20px;display:flex;align-items:center;color:#f56c6c;'
          },
          [
            h('p', {style: 'font-size:14px;'}, '导入成功，存在成品产品档案错误！'),
            h(
              'el-button',
              {
                props: {
                  type: 'text',
                  size: 'mini',
                  icon: 'el-icon-download'
                },
                on: {
                  click: () => {
                    this.downNoProduct(data)
                  }
                },
                style: {
                  border: 'none',
                  textAlign: 'center',
                  // width:"20%",
                  margin: '0 5px 0 5px '
                }
              },
              '下载导入错误数据'
            )
          ]
        )
      })
      return
    },
    // 智能新建
    aiAdd() {
      this.aiformVisible = true
      this.$nextTick(() => {
        this.$refs.aiForm.init('')
      })
    },
    quickAdd() {
      if (this.userInfo.projectId !== '1') {
        this.quickForm.projectId = this.userInfo.projectId
      }
      this.quickVisible = true
      this.fetchData('CPBM', true)
      this.quickForm.productSource = 'assemble'
    },

  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped/>
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

.el-button [class*=icon-ym-] + span {
  margin-left: 5px;
}

.imporBtn ::v-deep span {
  margin-left: 8px !important;
}


</style>
