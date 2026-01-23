<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title">
        <h2 v-if="!leftFlag">产品分类</h2>
        <span class="options" v-if="!leftFlag">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
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
      <JNPF-tableQuery :listQuery="listQuery" :systemSearchView="systemSearchView" tableRef="dataTable" />
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head" style="padding:8px">
          <div>
            <el-button size="mini" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle('','add')">
              新建
            </el-button>
<!--            <el-dropdown style="margin-right:10px;">-->
<!--              <el-button size="mini" type="primary" icon="el-icon-plus">-->
<!--                新建-->
<!--                <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--              </el-button>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item @click.native="quickAdd()">快速新建</el-dropdown-item>-->
<!--                <el-dropdown-item @click.native="addOrUpdateHandle()">普通新建</el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
            <!-- <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button> -->
            <el-button v-has="'btn_import'" size="mini" type="primary" icon="el-icon-plus" @click="importForm">
              导入
            </el-button>
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
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
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-if="tableFlag" :data="tableData" :fixedNO="true" custom-column
          ref="dataTable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_398000" :listQuery="listQuery" @queryChange="initData" :queryJson="superQueryJson">
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="code" label="产品编码" min-width="140">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="产品名称" min-width="140" />
          <el-table-column prop="drawingNo" label="型号" min-width="300" />
          <el-table-column prop="productCategoryName" label="产品分类" width="120" />
          <el-table-column prop="mainUnit" label="主单位" width="120" />
          <el-table-column prop="productSource" label="产品来源" width="120">
            <template slot-scope="{ row }">
              <el-tag
                :type="global.getDictLabelGlobal('productSource', row.productSource, { withType: true }).type">{{
                  global.getDictLabelGlobal('productSource', row.productSource)
                }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productStatus" label="产品状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag type="success" disable-transitions v-if="row.productStatus == 'enable'">启用</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="row.productStatus == 'disabled'">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productionLineName" label="产线" min-width="120"/>
          <el-table-column prop="routingName" label="工艺路线" min-width="120"/>
          <el-table-column prop="customerProductDrawingNo" label="客户型号" min-width="220"/>
          <el-table-column prop="createTime" label="创建时间" min-width="180" />
          <el-table-column prop="createByName" label="创建人" />
          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                @edit="addOrUpdateHandle(scope.row.id, 'edit')" @del="handleDel(scope.row.id)">
                <el-button type="text" size="mini" @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                  查看详情
                </el-button>
                <el-button type="text" size="mini" @click.native="copyHandle(scope.row.id, 'copy')">
                  复制
                </el-button>
                <!-- <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini" v-has="'btn_detail'">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
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
          :limit.sync="listQuery.pageSize" @pagination="initData()" />
      </div>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm"
      :classAttribute="listQuery.classAttribute" :productName="productName" :busSetId="busSetId" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 导入产品 -->
    <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
      :http-request="UploadProduct" />
    <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
      <div style="margin-bottom: 10px;" v-if="isProjectSwitch === '1'">
        <el-select v-model="importProjectId" placeholder="请选择所属项目" style="width: 100%;" filterable
          :disabled="!userInfo.projectId ? false : userInfo.projectId === '1' ? false : true">
          <el-option v-for="item in projectIdOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
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
        hide-required-asterisk="fasle" v-if="quickFormFlag">
        <el-row :gutter="15">
          <el-col :span="12" v-if="isProjectSwitch === '1'">
            <el-form-item label="所属项目" prop="projectId">
              <template slot="label">
                所属项目
                <span class="required">*</span>
              </template>
              <el-select v-model="quickForm.projectId" placeholder="请选择所属项目" style="width: 100%;" filterable
                :disabled="!userInfo.projectId ? false : userInfo.projectId === '1' ? false : true">
                <el-option v-for="item in projectIdOptions" :key="item.id" :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

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
                :requestObj="quickRequestObj" :dataFormatting="dataFormatting" />
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
import { excelExport } from '@/api/basicData/index'
import {
  getProductList,
  deleteProduct,
  uploadProductData,
  addProduct,
  checkCodeExist,
  checkDrawExist
} from '@/api/masterDataManagement/productManage'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import Form from './Form'
import { mapState } from 'vuex'
import {
  getbimProductAttributesList,
  getbimProductAttributes,
  getbimProductsModelList
} from '@/api/masterDataManagement/index'
import { getUnitData, detailUnitData } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getCooperativeData } from '@/api/basicData/index'
import { getcategoryTree as getcategoryCoop } from '@/api/basicData/materialSettings'
import { mapGetters } from 'vuex'
import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { getProjectList } from '@/api/system/projectManagement'
import { deepClone } from "@/utils";
export default {
  components: { Form, ExportForm },
  name: 'productCom',
  props: {
    initListQuery: {
      type: Object,
      default() {
        return {
          code: '',
          name: '',
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
          classAttribute: 'raw_material',
        }
      }
    },
    productName: {
      type: String,
      default: ''
    },
    busSetId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [ // 视图查询条件（自动根据绑定表格的列顺序排序）
            // 这里放置系统原顶栏显示的查询元素，如：
            { prop: 'approvalStatus', symbol: '==', value: 'ok', fixed: false },
            { prop: 'productSource', symbol: '==', value: '', fixed: true },
          ],
          keywordQuery: {
            keywordFlag: true, // 是否开启关键词查询
            fieldList: [
              'code',
              'name',
              'drawingNo',
              'model',
              'spec',
            ],
          },
          pageSize: 20, // 每页条数*
          orderItems: [
            {
              asc: false,
              column: 'createTime'
            }
          ]
        },
      }],
      importProjectId: '',
      isProductNameSwitch: '',
      isProjectSwitch: '',
      tableFlag: false,
      quickFormFlag: false,
      quickVisible: false,
      quickForm: {
        projectId: '',
        name: '',
        code: '',
        drawingNo: '',
        unit: '',
        productCategoryName: '',
        productSource: ''
      },
      codeConfig: {},
      quickRules: {
        projectId: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
        code: [
          { required: true, message: '请输入产品编码', trigger: 'blur' },
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
          { required: true, message: '请输入型号', trigger: 'blur' },
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
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        productCategoryName: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
        productSource: [{ required: true, message: '请选择产品来源', trigger: 'change' }]
      },
      getcategoryCoop,
      productSourceOptions: [
        // { label: '组装', value: 'assemble' },
        { label: '生产', value: 'produce' },
        { label: '采购', value: 'purchase' },
        { label: '外协', value: 'out' }
      ],
      quickRequestObj: {
        classAttribute: this.initListQuery.classAttribute
      },
      filterText: '',
      superQueryJson: [
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
      ],
      columnList: ['remark', 'createTime', 'createByName'],
      exportFormVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      loadingText: false,
      listQuery: {
        customerProductFlag: true
      },
      total: 0,
      formVisible: false,
      expands: true,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      uploadVisib: false,
      leftFlag: false,
      unitOptions: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
    beforeCreate() {
        this.$options.name = this.$route.name
    },
  mounted() {
    this.getProductClassFun()
  },
  async created() {
    this.listQuery = {...this.listQuery,...deepClone(this.initListQuery)}
    await this.getProjectSwitch()
    await this.getProductNameSwitch('product', 'enable_productName')
    this.getcategoryTree()
    if (localStorage.getItem(this.listQuery.classAttribute)) {
      let roleFlag = JSON.parse(localStorage.getItem(this.listQuery.classAttribute))
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
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
    getProjectSwitch() {
      let obj = {
        businessCode: 'system',
        pageSize: -1
      }
      getBimBusinessSwitchConfigList(obj).then((res) => {
        res.data.system.forEach((item) => {
          if (item.configKey == 'project') {
            this.isProjectSwitch = item.configValue1
            this.tableFlag = true
          }
        })
      })
    },
    quickAdd() {
      this.quickVisible = true
      this.quickFormFlag = true
      if (this.userInfo.projectId !== '1') {
        this.quickForm.projectId = this.userInfo.projectId
      }

      this.fetchData('CPBM', true)

      if (['spare_parts', 'accessories'].includes(this.listQuery.classAttribute)) {
        this.productSourceOptions = [{ label: '采购', value: 'purchase' }]
        this.quickForm.productSource = 'purchase'
      } else {
        this.productSourceOptions = [
          { label: '生产', value: 'produce' },
          { label: '采购', value: 'purchase' },
          { label: '外协', value: 'out' }
        ]
        this.quickForm.productSource = 'produce'
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
          this.quickForm.classAttribute = this.listQuery.classAttribute
          this.quickForm.saleFlag = true
          this.quickForm.tradeFlag = false
          this.quickForm.productStatus = 'enable'
          addProduct(this.quickForm).then((res) => {
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
      } catch (error) { }
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
      // 所属项目
      let obj18 = {
        pageNum: -1,
        pageSize: -1
      }
      getProjectList(obj18).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        this.projectIdOptions = res.data.records
        if (this.listQuery.classAttribute === 'semi_finished') {
          this.projectIdOptions = this.projectIdOptions.filter((item) => item.id !== '1')
        }

        let tcObj = this.superQueryJson.find((item) => item.prop === 'projectName')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
          if (this.listQuery.classAttribute === 'semi_finished') {
            tcObj.options = tcObj.options.filter((item) => item.id !== '1')
          }
        }
      })
    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    handleRemove(file, fileList) { },
    handlePreview(file) { },
    handleFileChange(file) {
      this.file = file.raw
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    saveSubmit() {
      if (this.isProjectSwitch === '1') {
        if (!this.importProjectId) return this.$message.error('请选择所属项目');
      }
      this.UploadProduct(this.file)
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
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
          exportName: this.productName + '信息',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
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
        localStorage.setItem(this.listQuery.classAttribute, expands)
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 获取指定树状列表
    getcategoryTree(refreshFlag) {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = '' // 重置数据类型id筛选
      getcategoryTree({ classAttribute: this.listQuery.classAttribute })
        .then((res) => {
          this.treeData = res.data.length ? res.data : []
          this.$nextTick(() => {
            this.treeLoading = false
            if (refreshFlag) this.$refs.dataTable.queryChange(this.listQuery)
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
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.getcategoryTree()
        this.initData()
      }
    },
    initData(listQuery) {
      if (listQuery) this.listQuery = listQuery;
      if (!this.listQuery?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();
      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      // this.listQuery.pageNum = 1
      this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
      getProductList(this.listQuery)
        .then((res) => {
          if (listLoadKey !== this.listLoadKey) return; // 请求过期

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
        this.$refs.Form.init(id, btnType,'',this.isProjectSwitch)
      })
    },
    // 复制
    copyHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType,false)
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
      if (this.userInfo.projectId !== '1') {
        this.importProjectId = this.userInfo.projectId
      } else {
        this.importProjectId = ''
      }
      this.uploadVisib = true
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + `/static/产品导入模板.xlsx`)
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
      if (this.isProjectSwitch === '1') {
        formData.append('projectId', this.importProjectId)
      }
      //调用上传文件接口
      uploadProductData(formData)
        .then((res) => {
          if (!res.data) {
            this.$message.success(`导入成功`)
            this.uploadVisib = false
            this.$refs['uploadRef'].clearFiles()
            this.initData()
          } else {
            this.handleMessage(res.data)
          }

          this.formLoading = false
          this.loadingText = ''
          this.$refs['uploadRef'].clearFiles()
        })
        .catch((err) => {
          // this.$message.error(`导入数据超过最大限制：500`)
          this.$message.error(`导入失败`)
          this.formLoading = false
          this.loadingText = ''
          this.$refs['uploadRef'].clearFiles()
        })
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
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
            h('p', { style: 'font-size:14px;' }, `导入成功，存在${this.productName}产品档案错误！`),
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
