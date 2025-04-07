<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form>
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
          <!-- <el-dropdown> -->
          <topOpts @add="addSupplier('', 'add')">
            <el-button type="primary" size="mini" icon="el-icon-download"
              @click="exportForm('tableForm')">导出</el-button>
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
        <JNPF-table ref="tableForm" :data="tableDataList" :fixedNO="true" v-if="isProjectSwitchFlag"
          :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column>
          <el-table-column prop="quotationNo" label="单号" min-width="160" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="handleUserRelation(scope.row.salesQuotationId, 'look')">{{
                scope.row.quotationNo
              }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="cooperativePartnerCode" label="客户编码" sortable="custom" width="200" />
          <el-table-column prop="cooperativePartnerIdText" label="客户名称" sortable="custom" width="200" />
          <el-table-column prop="bidder" label="报价人" sortable="custom" width="100" />
          <el-table-column prop="quotationTime" label="报价时间" width="130" sortable="custom" />
          <el-table-column prop="validEnd" label="有效时间止" width="130" sortable="custom" />
          <el-table-column prop="customerDrawingNumber" label=" 客户料号" width="150" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
          <el-table-column prop="productDrawingNo" label="品名规格" width="180" sortable="custom" />
          <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
          <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom" />
          <el-table-column prop="num" label="数量" width="80" sortable="custom" />
          <el-table-column prop="unitPrice" label="单价(含税)" width="130" sortable="custom" />
          <el-table-column prop="taxRate" label="税率" width="110" sortable="custom">
            <template slot-scope="scope">
              <div>{{ scope.row.taxRate }}%</div>
            </template>
          </el-table-column>
          <el-table-column prop="excludingTaxUnitPrice" label="单价(不含税)" width="140" sortable="custom" />
          <el-table-column prop="amounts" label="金额(含税)" width="140" sortable="custom" />
          <el-table-column prop="excludingTaxAmounts" label="金额(不含税)" width="140" sortable="custom" />
          <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"
            v-if="sealingCoverTypingFlag == 1" />
          <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"
            v-if="accuracyLevelFlag == 1" />
          <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
            v-if="vibrationLevelFlag == 1" />
          <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
          <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" v-if="oilQuantityFlag == 1" />
          <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
          <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
            v-if="packagingMethodFlag == 1" />
          <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
            v-if="specialRequireFlag == 1" />
          <el-table-column prop="remark" label="备注" width="180" sortable="custom" />
          <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag>
              </div>
              <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'">
                <el-tag>审批中</el-tag>
              </div>
              <div v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'">
                <el-tag type="success">审批通过</el-tag>
              </div>
              <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'">
                <el-tag type="danger">审批拒绝</el-tag>
              </div>
              <div v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                <el-tag type="warning">审批撤回</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="110" sortable="custom" />







          <el-table-column label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')" size="mini"
                :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
              <el-button type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini"
                @click="handleDel(scope.row.salesQuotationId,)" class="JNPF-table-delBtn">删除</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item
                      v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                      @click.native="addSupplier(scope.row.id, 'add')">
                      重新提交
                    </el-dropdown-item> -->
                  <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                    @click.native="withdrawnHandle(scope.row.salesQuotationId, 'withdrawn')">
                    审批撤回
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="handleUserRelation(scope.row.salesQuotationId, 'look')">
                    查看详情
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="downloadOrder(scope.row.salesQuotationId)">
                    下载报价单
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <DepForm v-if="depFormVisible" ref="depForm" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getQuotationLists, deleteQuotationData, getQuotationmxLists, exportSaleQuotation } from '@/api/salesManagement/index'
import DepForm from '../salesQuotationOld/depForm'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport,getOrderFiledMap } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import {  getbimProductAttributesListMap } from "@/api/masterDataManagement/index";
export default {
  name: 'salesQuotationDetail',
  components: { DepForm, SuperQuery, ExportForm },
  mixins: [getProjectList],
  data() {
    return {
      columnList: ["cooperativePartnerCode", "validEnd", "sealingCoverTyping", "accuracyLevel", "vibrationLevel", "oil", "oilQuantity", "clearance", "packagingMethod", "specialRequire", "createByName"],
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'quotationNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerDrawingNumber', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

      ],



      superQueryVisible: false,

      deliveryDatefahuo: [],
      createTimeArrfahuo: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      exportFormVisible: false,


      depFormVisible: false,
      background: true,//分页器背景颜色
      tableDataList: [],
      form: {},
      formlist: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: "createTime"
        }],
        productDrawingNo: "",
        customerDrawingNumber: "",
        quotationNo: "",
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      },
      superQueryJson: [
        {
          prop: 'quotationNo',
          label: "单号",
          type: 'input'
        },

        {
          prop: 'cooperativePartnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'cooperativePartnerIdText',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'bidder',
          label: "报价人",
          type: 'input'
        },

        {
          prop: 'quotationTime',
          label: '报价时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },

        {
          prop: 'validEnd',
          label: '有效时间止',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'customerDrawingNumber',
          label: "客户料号",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },


        // {
        //   prop: 'totalAmount',
        //   label: "总金额",
        //   type: 'input'
        // },
        {
          prop: 'documentStatus',
          label: "单据状态",
          type: 'select',
          options: [
            { label: "草稿", value: "draft" },
            { label: "提交", value: "submit" },
          ]
        },
        {
          prop: 'approvalStatus',
          label: "审批状态",
          type: 'select',
          options: [
            { label: "审批中", value: "ing" },
            { label: "审批通过", value: "ok" },
            { label: "审批拒绝", value: "rebut" },
            { label: "审批撤回", value: "withdrawn" },
          ]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },





      ],
      listLoading: false,
      total: 0,
      formVisible: false,

      isProjectSwitchFlag: false,
      isProjectSwitch: '',
      isProductNameSwitch: '',
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
    this.form = JSON.parse(JSON.stringify(this.formlist))
    this.superForm = this.form
    if (this.isProductNameSwitch == 1) {
      this.searchList.splice(2, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)
      
    }
    if (this.$store.getters.configData.sale.salePersonFlag) {
      this.form.salesPersonFlag = 1
    }
    this.advancedQueryFun()
    this.search('basic')
  },
  methods: {
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })
    },
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
      })
    },
    advancedQueryFun() {
      if (this.isProductNameSwitch === '1') {
        this.superQueryJson.splice(4, 0, {
          prop: 'productName',
          label: '产品名称',
          type: 'input'
        })
      }
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'mainUnit')
      console.log("clas", classIndex);

      if (this.specialRequireFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
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
      console.log("this.packagingMethodFlag", this.packagingMethodFlag);
      if (this.packagingMethodFlag === '1') {
        console.log(555);

        this.superQueryJson.splice(classIndex + 1, 0, {
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
        this.superQueryJson.splice(classIndex + 1, 0, {
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
        this.superQueryJson.splice(classIndex + 1, 0, {
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
        this.superQueryJson.splice(classIndex + 1, 0, {
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
        this.superQueryJson.splice(classIndex + 1, 0, {
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
        this.superQueryJson.splice(classIndex + 1, 0, {
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
        this.superQueryJson.splice(classIndex + 1, 0, {
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
      console.log(this.superQueryJson);
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },

    sortChange({ prop, order }) {
      let newProp
      if (prop == 'cooperativePartnerIdText' || prop == 'productName' || prop == 'projectName' || prop == 'productDrawingNo' || prop == "documentStatus" || prop == 'approvalStatus' || prop == 'createTime') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.form.orderItems[0].asc = order !== 'descending'
      this.form.orderItems[0].column = newProp
      this.search('basic')
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      this.search('basic')
    },
    initData() {
      this.listLoading = true
      if (localStorage.getItem('loginTenant')) {
        this.form.tenant = localStorage.getItem('loginTenant')
      }
      getQuotationmxLists(this.form).then(res => {
        this.tableDataList = res.data.records
        this.listLoading = false
        this.total = res.data.total
      }).catch(() => {
        this.listLoading = false
      })

    },
    search(type) {

      Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
        let item = this.form[key]
        this.form[key] = typeof item === 'string' ? item.trim() : item
      })
      this.form.pageNum = 1 // 重置页码
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
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {

      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.superForm = this.form = JSON.parse(JSON.stringify(this.formlist))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'quotationNo', fieldValue: '', label: '报价单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'customerDrawingNumber', fieldValue: '', label: '客户料号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },

      ]
      if (this.isProductNameSwitch == 1) {
        this.searchList.splice(2, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)
      }
      this.search('basic')


    },
    addSupplier(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    // 编辑
    addOrUpdateHandle(res, type) {
      this.depFormVisible = true


      let id = res.salesQuotationId
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
        deleteQuotationData(id).then(res => {
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    },
    downloadOrder(id) {
      exportSaleQuotation(id).then(res => {
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.formlist
      let _data = {
        ...targetListQuery,
        exportType: '1055',
        exportName: '报价单明细',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        withdrawn(_data).then(res => {
          this.$message({
            type: 'success',
            message: "撤回成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
}

.JNPF-common-head {
  padding: 8px;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />