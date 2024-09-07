<template>
  <div class="JNPF-common-layout">
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
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.productSource" placeholder="请选择产品来源" clearable style="width: 100%;">
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
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:8px">
          <topOpts :isJudgePer="true" :addPerCode="'btn_add'" @add="addOrUpdateHandle()">
            <!-- <el-button size="mini" type="primary" icon="el-icon-download" @click="downLoadTemplate">下载模版</el-button> -->
            <el-button v-has="'btn_import'" size="mini" type="primary" icon="el-icon-plus" @click="importForm">
              导入
            </el-button>
            <el-button v-has="'btn_export'" :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </topOpts>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          ref="dataTable" :setColumnDisplayList="columnList">
          <el-table-column prop="code" label="产品编码" min-width="140" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                {{ scope.row.code }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom" />
          <el-table-column prop="name" label="产品名称" min-width="140" sortable="custom" />

          <el-table-column prop="productCategoryName" label="产品分类" width="120" />
          <el-table-column prop="mainUnit" label="主单位" width="120" />
          <el-table-column prop="productSource" label="产品来源" width="120">
            <template slot-scope="{ row }">
              <template v-if="row.productSource == 'produce'">
                自制
              </template>
              <template v-else-if="row.productSource == 'purchase'">
                采购
              </template>
              <template v-else-if="row.productSource == 'out'">
                外协
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="productStatus" label="产品状态" width="120" align="center">
            <template slot-scope="{ row }">
              <el-tag type="success" disable-transitions v-if="row.productStatus == 'enable'">启用</el-tag>
              <el-tag type="danger" disable-transitions v-else-if="row.productStatus == 'disabled'">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="brand" label="品牌" width="120" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" />
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                @edit="addOrUpdateHandle(scope.row.id, scope.row.partnerCategoryId)" :hasDel="false">
                <el-button type="text" @click.native="addOrUpdateHandle(scope.row.id, true)">
                  查看详情
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
          :limit.sync="listQuery.pageSize" @pagination="initData" />
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
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getProductList, deleteProduct, uploadProductData } from '@/api/masterDataManagement/productManage'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import Form from './Form'
import { mapState } from 'vuex'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList,
  getbimProductAttributes,
  getbimProductsModelList
} from '@/api/masterDataManagement/index'
import { getUnitData, detailUnitData } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getCooperativeData } from '@/api/basicData/index'
export default {
  components: { Form, ExportForm, SuperQuery },
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
          classAttribute: 'raw_material'
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
      filterText: '',
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
          label: '主单位',
          type: 'select'
        },
        {
          prop: 'productSource',
          label: '产品来源',
          type: 'select',
          options: [
            { label: '自制', value: 'produce' },
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
      columnList: ['remark', 'createTime', 'createByName'],
      exportFormVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      treeData: [],
      tableData: [],
      treeLoading: false,
      listLoading: false,
      loadingText: false,
      listQuery: {},
      productStatusList: [{ label: '启用', value: 'enable' }, { label: '禁用', value: 'disabled' }], // 产品状态
      productSourceList: [
        { label: '自制', value: 'produce' },
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
      uploadVisib: false,
      leftFlag: false
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
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.getcategoryTree()
    this.initData()
    if (localStorage.getItem(this.listQuery.classAttribute)) {
      let roleFlag = JSON.parse(localStorage.getItem(this.listQuery.classAttribute))
      this.expands = roleFlag
      this.toggleExpand(roleFlag)
    }
  },
  computed: {
    ...mapState('user', ['token'])
  },
  methods: {
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
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = '' // 重置数据类型id筛选
      getcategoryTree({ classAttribute: this.listQuery.classAttribute })
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
      if (isRefresh) {
        this.getcategoryTree()
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
      this.search()
    },

    addOrUpdateHandle(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
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
      formData.append('productCategoryId', this.listQuery.productCategoryId)
      formData.append('classAttribute', this.listQuery.classAttribute)
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
        })
        .catch((err) => {
          this.$message.error(`导入数据超过最大限制：500`)
          this.formLoading = false
          this.loadingText = ''
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
