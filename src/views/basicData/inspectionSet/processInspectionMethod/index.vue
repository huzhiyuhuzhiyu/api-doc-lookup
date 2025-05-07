<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-left treeBox" v-if="!formVisible"
      :style="leftFlag ? 'width:15px;background:#fff' : ''">
      <div class="JNPF-common-title" v-if="!leftFlag">
        <h2>工序分类</h2>
        <span class="options">
          <el-dropdown>
            <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
              <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item> -->
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
            <i
              :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
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
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.code" placeholder="工序编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.name" placeholder="工序名称" clearable />
            </el-form-item>
          </el-col> -->
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
          <el-col :span="4">
            <el-form-item>
              <el-select v-model="listQuery.processingType" placeholder="加工类别" clearable>
                <el-option v-for="item in processingTypeOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">{{
                $t("common.search")
              }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="moreQueries()">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head" style="padding:10px">
          <el-button size="mini" @click="handleBatch" type="primary">设置检验方式</el-button>
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
        <JNPF-table v-if="tableDataFlag" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column
          :hasNO="true" hasC @selection-change="currentChange" ref="listTable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_722642">
          <el-table-column prop="code" label="工序编码" width="120" sortable="custom">
          </el-table-column>
          <el-table-column prop="name" label="工序名称" width="140" sortable="custom" />
          <el-table-column prop="productCategoryIdText" label="工序分类" width="130" sortable="custom" />
          <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="unitPrice" label="正品单价" width="100" />
          <el-table-column prop="rejectUnitPrice" label="次品单价" width="100" />
          <el-table-column prop="scrapUnitPrice" label="废品单价" width="100" />
          <el-table-column prop="pricingTypeName" label="计价类型" width="100"> </el-table-column>
          <el-table-column prop="timePrice" label="计时单价" min-width="120"></el-table-column>
          <el-table-column prop="processingType" label="加工类型" width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.processingType == 'self_produced'">自制</div>
              <div v-if="scope.row.processingType == 'external_production'">外协</div>
            </template>
          </el-table-column>
          <el-table-column prop="processType" label="工序类型" width="120" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.processType == 'normal'">正常工序</div>
                <div v-if="scope.row.processType == 'vibrate'">测振工序</div>
                <div v-if="scope.row.processType == 'heat_treatment'">热工工序</div>
                <div v-if="scope.row.processType == 'packing'">包装工序</div>
                <div v-if="scope.row.processType == 'pairs'">配对工序</div>
                <div v-if="scope.row.processType == 'typing'">打字工序</div>
                <div v-if="scope.row.processType == 'fatInjection'">注脂工序</div>
                <div v-if="scope.row.processType == 'grinding'">磨孔工序</div>
                <div v-if="scope.row.processType == 'accuracy'">精度工序</div>
                <div v-if="scope.row.processType == 'boxing'">装盒工序</div>
            </template>
          </el-table-column>
          <el-table-column prop="inspectionMethod" label="检验方式" width="110" sortable="custom" align="center">
            <template slot-scope="{ row }">
              <template v-if="row.inspectionMethod == 'exempt'">
                <el-tag type="success">免检</el-tag>
              </template>
              <template v-else-if="row.inspectionMethod == 'spot_check'">
                <el-tag type="warning">抽检</el-tag>
              </template>
              <template v-else-if="row.inspectionMethod == 'all'">
                <el-tag>全检</el-tag>
              </template>
              <template v-else>
                {{ row.inspectionMethod }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="createByName" label="创建人" width="180" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="remark" label="备注" width="130" />
        </JNPF-table>
        <pagination :total="total" :page.sync="superForm.pageNum" :limit.sync="superForm.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <InspectionSettingForm ref="InspectionSettingForm" v-if="batchVisible" @close="closeForm"
      :selectedData="selectedData" />
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
        <!-- <el-button type="primary" @click="saveSubmit()">
          提交
        </el-button> -->
      </span>
    </el-dialog>
    <!-- <UserRelationList v-if="userRelationListVisible" ref="UserRelationList" @refreshDataList="getOrganizeList" /> -->
  </div>
</template>

<script>
import { getBimProcessList, deleteBimProcess } from '@/api/bimProcess/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'

import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import getProjectList from '@/mixins/generator/getProjectList'
import InspectionSettingForm from './InspectionSettingForm.vue'
export default {
  name: 'basicProcessSettings',
  components: { ExportForm, SuperQuery, InspectionSettingForm },
  mixins: [getProjectList],
  data() {
    return {
      selectedData: [],
      batchVisible: false,
      isProjectSwitch: '',
      tableDataFlag: false,
      searchList: [
        { field: 'code', fieldValue: '', label: '工序编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'name', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },

      ],
      superForm: {},
      basicQuery: {},
      superQuery: {},
      filterText: '',
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'code',
          label: '工序编码',
          type: 'input'
        },
        {
          prop: 'name',
          label: '工序名称',
          type: 'input'
        },
        {
          prop: 'productCategoryIdText',
          label: '工序分类',
          type: 'input'
        },
        {
          prop: 'unitPrice',
          label: '正品单价',
          type: 'input'
        },
        {
          prop: 'scrapUnitPrice',
          label: '次品单价',
          type: 'input'
        },
        {
          prop: 'timePrice',
          label: '计时单价',
          type: 'input'
        },
        {
          prop: 'pricingTypeName',
          label: '计价类型',
          type: 'input'
        },

        {
          prop: 'processingType',
          label: '加工类型',
          type: 'select',
          options: [{ label: '自制', value: 'self_produced' }, { label: '外协', value: 'external_production' }]
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
        },
      ],
      exportFormVisible: false,
      visible: false,
      tableData: [],
      treeData: [],
      listLoading: false,
      listQuery: {
        name: "",
        code: "",
        processingType: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        productCategoryId: '',
      },
      expands: true,
      refreshTree: true,
      total: 0,
      formVisible: false,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      processingTypeOptions: [
        { label: "全部", value: "" },
        { label: "自制", value: "self_produced" },
        { label: "外协", value: "external_production" },
      ],
      // 业务类型
      businessOptions: [
        { fullName: "原材料", enCode: "raw_material" },
        { fullName: "半成品", enCode: "semi_finished" },
        { fullName: "成品", enCode: "finish_product" },
        { fullName: "辅料", enCode: "accessories" },
        { fullName: "其他 ", enCode: "other" }
      ],
      columnList: ['unitPrice', 'createByName', 'rejectUnitPrice', 'scrapUnitPrice', 'createTime'],
      leftFlag: false,
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
    await this.getProjectSwitch('system', 'project')
    this.tableDataFlag = true
    this.superForm = this.listQuery
    // this.initData()
    this.getcategoryTree()
    this.getBusinessOptions()
  },
  methods: {
    currentChange(data) {
      this.selectedData = data
    },
    // 批量操作
    async handleBatch(batchType) {
      if (!this.selectedData.length) return this.$message.error('请先选择批量处理的数据')
      this.batchDataForm = {}
      this.batchVisible = true
      this.$nextTick(() => this.$refs.InspectionSettingForm.init(id, btnType))
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      console.log(isRefresh)
      this.batchVisible = false
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    // 导入
    importForm() {

      // this.$refs.UploadProduct.$el.querySelector('input').click()
      this.uploadVisib = true

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

      a.setAttribute('href', location.origin + '/static/工序导入模板.xlsx')


      a.click()
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append('file', data)
      //调用上传文件接口

      uploadBomData(formData)
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
          console.log(err, 'err')
          this.uploadVisib = false
          console.log(err, 'err')
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
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles()
    },
    saveSubmit() {
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
            h('p', { style: 'font-size:14px;' }, '导入成功，存在BOM相关信息错误！'),
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
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {

      let obj1 = {
        pageNum: 1,
        pageSize: -1,
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

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'sealingCoverTyping');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
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
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'accuracyLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
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

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'vibrationLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
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



        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oil');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
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
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oilQuantity');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
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
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'clearance');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
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
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'packagingMethod');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })


      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log("税率", this.taxRateList);
      })

    },
    changeLeft() {
      this.leftFlag = !this.leftFlag
    },
    sortChange({ prop, order }) {
      let newProp = ""
      if (prop == 'steelBall' || prop == "outerCircle" || prop == "innerCircle" || prop == "createByName") {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());

      }
      this.listQuery.orderItems[0].asc = order === "ascending";
      this.listQuery.orderItems[0].column = order === null ? "" : newProp;
      this.initData();
    },
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.listTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.listTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      console.log(columnList, 'columnList')
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
          exportType: '1034',
          exportName: '工序管理信息',
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
    handleNodeClick(data, node) {
      if (this.superForm.productCategoryId === data.id) return
      this.superForm.productCategoryId = data.id
      this.search('basic')
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
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取指定树状列表
    getcategoryTree() {
      this.listLoading = true
      this.treeLoading = true
      this.listQuery.productCategoryId = "" // 重置数据类型id筛选
      let query = {
        type: "process",
        pageNum: 1,
        pageSize: 20,
      }
      getcategoryTree(query).then(res => {
        this.treeData = res.data
        this.$nextTick(() => {
          this.treeLoading = false
          this.initData()
        })
      }).catch(() => {
        this.treeLoading = false
        this.listLoading = false
      })
    },
    // 获取业务类型
    getBusinessOptions() {
      // getDictionaryDataList("430351197057058245").then(res => {
      //   this.businessOptions = res.data.list
      // })
      this.businessOptions = [
        { fullName: "原材料", enCode: "raw_material" },
        { fullName: "半成品", enCode: "semi_finished" },
        { fullName: "成品", enCode: "finish_product" },
        { fullName: "辅料", enCode: "accessories" },
        { fullName: "其他 ", enCode: "other" }
      ]
    },
    sortChange({ prop, order }) {
      console.log(order);
      let newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase())
      this.listQuery.orderItems[0].asc = order === "ascending"
      if (newProp === "class_attribute_text") { newProp = "baa.class_attribute" }
      if (newProp === "product_category_id_text") { newProp = "productCategoryIdText" }
      // this.listQuery.orderItems[0].column = newProp
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.superForm.projectId = this.userInfo.projectId
      }
      getBimProcessList(this.superForm)
        .then((res) => {
          console.log(res);
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type) {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
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
        this.superForm.processingType = this.listQuery.processingType
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },

    refresh() {
      this.formVisible = false
      this.reset()
    },
    reset() {
      this.$refs['listTable'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        name: "",
        code: "",
        processingType: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        productCategoryId: '',
      }
      this.searchList = [
        { field: 'code', fieldValue: '', label: '工序编码', symbol: 'like', searchType: 1, width: 120 },
        { field: 'name', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },

      ]
      this.superForm = JSON.parse(JSON.stringify(this.listQuery))
      this.$refs.SuperQuery.conditionList = []
      this.filterText = ''
      this.getcategoryTree()
      // this.initData()
    },
    addOrUpdateHandle(id, type) {
      console.log("132,", id, type);
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type)
      })
    },
    handleDel(id) {
      this.$confirm(this.$t("common.delTip"), this.$t("common.tipTitle"), {
        type: "warning",
      })
        .then(() => {
          deleteBimProcess(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功",
              duration: 1500,
              onClose: () => {
                this.initData()
              },
            })
          })
        })
        .catch(() => { })
    },
  },
}
</script>
<style scoped>
/* .JNPF-common-layout-left {
  margin-right: 0;
  border-right: 1px solid #cacaca;
}

::v-deep .el-tabs__content {
  height: calc(100vh - 163px);
} */

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}
</style>
