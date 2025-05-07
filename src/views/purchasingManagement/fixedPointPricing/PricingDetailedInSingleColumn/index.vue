<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="(item) in searchList">
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
            <el-col :span="3">
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>

        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <topOpts @add="addOrUpdateHandle('', 'add')">
              <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
                icon="el-icon-download" @click="exportForm">导出</el-button>
            </topOpts>
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

          <JNPF-table v-if="tableDataFlag" highlight-current-row :fixedNO="true" ref="dataTable" :data="tableDataList"
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList" customKey="JNPFTableKey_399128">
            <el-table-column prop="orderNo" label="单号" min-width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.fixedPointPricingId, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="150" sortable="custom" />
            <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="150" sortable="custom" />
            <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="productsCode" label="产品编码" width="150" sortable="custom" />
            <el-table-column prop="productsName" label="产品名称" width="120"
              v-if="isProductNameSwitch === '1'"></el-table-column>
            <el-table-column prop="drawingNo" label="品名规格" width="150" sortable="custom" />
                <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
            <el-table-column prop="price" label="协议价(含税)" width="140" sortable="custom" />
            <el-table-column prop="excludingTaxPrice" label="协议价(不含税)" width="160" sortable="custom" />
            <el-table-column prop="taxRate" label="税率" width="80" sortable="custom">
              <template slot-scope="scope">
                {{ scope.row.taxRate }}%
              </template>
            </el-table-column>
            <el-table-column prop="effectiveTimeStart" label="有效时间起" width="150" sortable="custom" />
            <el-table-column prop="effectiveTimeEnd" label="有效时间止" width="150" sortable="custom" />
            <el-table-column prop="standardValue" label="规值" width="80" sortable="custom" />
            <el-table-column prop="colour" :label="$store.getters.colour"  width="80" sortable="custom" />
            <el-table-column prop="remark" label="备注" width="150" />
            <el-table-column prop="documentStatus" label="单据状态" align="center" sortable="custom" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间" sortable="custom" width="180" />
            <el-table-column prop="createByName" label="创建人" />
            <el-table-column label="操作" min-width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus !== 'draft'"
                  @click="addOrUpdateHandle(scope.row.fixedPointPricingId, 'edit')">
                  编辑
                </el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  :disabled="scope.row.documentStatus !== 'draft'" @click="handleDel(scope.row.id)">
                  删除
                </el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn'"
                      @click.native="addOrUpdateHandle(scope.row.fixedPointPricingId, 'add')">
                      重新提交
                    </el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.approvalStatus === 'ing'"
                      @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                      审批撤回
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.fixedPointPricingId, 'look')">
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
    </div>

    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
     
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import {
  buyFixedPointPricingDetailList,
  deletebuyFixedPointPricing,
  linesbuyFixedPointPricing
} from '@/api/purchasingManagement/purchaseInquirySheet'
import JNPFForm from '../pricingListedSeparately/Form.vue'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import moment from 'moment'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  name: 'fixedPointPricing',
  components: { JNPFForm, SuperQuery, ExportForm },
  mixins: [getProjectList],
  data() {
    return {
      isProductNameSwitch: '',
      columnList: ['cooperativePartnerCode', 'productsCode', 'remark', 'createByName'],
      basicQuery: {},
      superQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        {
          field: 'cooperativePartnerName',
          fieldValue: '',
          label: '供应商名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 }
      ],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '单号',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '供应商名称',
          type: 'input'
        },

        {
          prop: 'cooperativePartnerCode',
          label: '供应商编码',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'price',
          label: '协议价(含税)',
          type: 'input'
        },
        {
          prop: 'excludingTaxPrice',
          label: '协议价(不含税)',
          type: 'input'
        },
        {
          prop: 'taxRate',
          label: '税率',
          type: 'select',
          options: []
        },
        {
          prop: 'createTime',
          label: '有效时间起',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createTime',
          label: '有效时间止',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'standardValue',
          label: '规值',
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
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
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
      basicQuery: {},
      superQuery: {},
      exportFormVisible: false,
      activeName: 'dataTable',
      background: true, //分页器背景颜色
      detailVisible: false,
      visible: false,
      tableDataList: [],
      linesTableData: [],
      formVisible: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        approvalStatus: '', // 审批状态 审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: '', //	供应商编码
        cooperativePartnerId: '', // 供应商id
        cooperativePartnerName: '', // 	供应商名称
        classAttribute: 'other',
        documentStatus: '', // 单据状态:草稿 draft、提交 submit,可用值:draft,normal,submit
        startAndEndTime: '',
        listPriceFlag: '', // 是否设置牌价:0否1是
        orderNo: '', // 单号
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        submitEndTime: '', //提交时间-结束
        submitStartTime: ''
        // startAndEndTime: [],
      },
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'createTime'
          }
        ],
        cooperativePartnerCode: '', //	供应商编码
        cooperativePartnerId: '', // 供应商id
        cooperativePartnerName: '', // 	供应商名称
        productsCode: '',
        drawingNo: '',
        productsName: '',
        bargaining: '',
        taxRate: '',
        excludingTaxPrice: '',
        targetPrice: '',
        historicalPrice: '',
        effectiveTimeStart: '',
        effectiveTimeEnd: '',
        contrastProductsName: '',
        contrastProductsPrice: '',
        startAndEndTime: '',
        orderNo: '', // 单号
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        submitEndTime: '', //提交时间-结束
        submitStartTime: ''
      },
      superForm: {},
      documentStatusList: [
        {
          label: '草稿',
          value: 'draft'
        },
        {
          label: '提交',
          value: 'submit'
        }
      ],
      statusList: [
        {
          label: '审批中',
          value: 'ing'
        },
        {
          label: '审批通过',
          value: 'ok'
        },
        {
          label: '审批拒绝',
          value: 'rebut'
        },
        { label: '审批撤回', value: 'withdrawn' }
      ],
      // 明细列表
      total: 0,
      formVisible: false
    }
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isProductNameSwitch === '1') {
      this.searchList.splice(2, 0, {
        field: 'productsName',
        fieldValue: '',
        label: '产品名称',
        symbol: 'like',
        searchType: 1,
        width: 120
      })
      this.superQueryJson.splice(4, 0, {
        prop: 'productsName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.tableDataFlag = true
    console.log(this.isProjectSwitch)
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.superForm = this.listQuery
    this.initData()
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj0 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa008',
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
      getbimProductAttributesList(obj0).then((res) => {
        console.log(res, 'res123')
        let arr = []
        arr = res.data.records.map(item => {
          return {
            label: item.name,
            value: item.name
          }
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'standardValue')

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
        arr = res.data.records.map(item => {
          return {
            label: item.name,
            value: item.name
          }
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'colour')

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
        console.log('税率', this.taxRateList)
        let arr = []
        arr = res.data.list.map(item => {
          return {
            label: item.fullName,
            value: item.taxRate
          }
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'taxRate')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
        console.log(tcObj, 'tcObj')
      })
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter(item => !!item.label && !!item.prop)
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
        let _data = {
          ...this.listQuery,
          exportType: '1067',
          exportName: '定点定价明细列表',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalRowFlag: true,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    sortChange({ prop, order }) {
      console.log(prop)
      let newProp
      if (
        prop === 'cooperativePartnerCode' ||
        prop === 'cooperativePartnerName' ||
        prop === 'productsCode' ||
        prop === 'createByName' ||
        prop === 'productsName' ||
        prop === 'drawingNo' ||
        prop === 'createTime'
      ) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp

      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },

    initData() {
      this.listLoading = true

      if (this.listQuery.startAndEndTime && this.listQuery.startAndEndTime.length > 0) {
        this.listQuery.startTime = this.listQuery.startAndEndTime[0]
        this.listQuery.endTime = this.listQuery.startAndEndTime[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      buyFixedPointPricingDetailList(this.superForm)
        .then((res) => {
          console.log(res, '询价单列表')
          this.tableDataList = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type) {
      Object.keys(this.listQuery).forEach((key) => {
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
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery.startAndEndTime = []
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        {
          field: 'cooperativePartnerName',
          fieldValue: '',
          label: '供应商名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
        { field: 'drawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 }
      ]
      if (this.isProductNameSwitch === '1') {
        this.searchList.splice(2, 0, {
          field: 'productsName',
          fieldValue: '',
          label: '产品名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        })
      }
      this.superForm = JSON.parse(JSON.stringify(this.initListQuery))

      this.initData()
    },

    addOrUpdateHandle(id, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.JNPFForm.init(id, type, false, 'other')
      })
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deletebuyFixedPointPricing(id).then((res) => {
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
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          withdrawn(_data).then((res) => {
            this.$message({
              type: 'success',
              message: '撤回成功',
              duration: 1500,
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => { })
    }
  }
}
</script>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
