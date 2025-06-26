<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <template v-for="item in searchList">
            <el-col :span="item.searchType === 3 ? 6 : 3">
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
          <el-col :span="5">
            <el-form-item>
                <el-date-picker v-model="createRequirementDate" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="单据开始日期" end-placeholder="单据结束日期"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search('basic')">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
        <div class="JNPF-common-head">
          <div>
            <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成外协对账</el-button>
            <el-button size="mini" type="primary" @click="updateCheckStatusFun()">更新核对状态</el-button>
            <el-button :disabled="tableDataList.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </div>
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

        <JNPF-table v-if="tableFlag" @selection-change="handeleProductInfoData" hasC highlight-current-row
          :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
          :setColumnDisplayList="columnList" :checkSelectable="checkSelectable" customKey="JNPFTableKey_503406">
          <el-table-column prop="orderNo" label="出入库单号" min-width="240" sortable="custom" />
           <el-table-column prop="purchaseOrderNo" label="外协订单号" min-width="240" sortable="custom" >
             <template slot-scope="scope">
              <el-link type="primary" @click.native="orderDetailFun(scope.row.ordersId, 'look')">
                {{ scope.row.purchaseOrderNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="purchaseNoticeNo" label="外协通知单号" min-width="240" sortable="custom" >
             <template slot-scope="scope">
              <el-link type="primary" @click.native="deliveryNoteDetailFun(scope.row.noticeId,'look')">
                {{ scope.row.purchaseNoticeNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="partnerName" label="供应商名称" min-width="180" sortable="custom" />
          <el-table-column prop="partnerCode" label="供应商编码" min-width="180" sortable="custom" />
          <template v-if="$store.getters.configData.warehouse.proportion">
            <el-table-column prop="weight" label="重量(kg)" width="90" />
            <el-table-column prop="proportion" label="比重" width="80" />
            <el-table-column prop="discount" label="折扣" width="80" />
          </template>
          <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom" v-if="isProjectSwitch === '1'"></el-table-column>
          <el-table-column prop="productCode" label="产品编码" min-width="180" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" min-width="180" sortable="custom"
            v-if="isProductNameSwitch === '1'" />
          <el-table-column prop="drawingNo" label="品名规格" min-width="180" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" min-width="160" sortable="custom" />
        
          <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
          <el-table-column prop="businessType" label="收/退货类型" width="140" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'outbound_external'">退货</div>
              <div v-else-if="scope.row.businessType == 'inbound_external'">收货</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
            :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
          <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
          <el-table-column prop="num" label="出入库数量" width="120" >
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'inbound_external'" style="color: #67C23A">
                +{{ scope.row.num }}
              </div>
              <div v-else-if="scope.row.businessType == 'outbound_external'" style="color:red">
                -{{ scope.row.num }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="costPrice" label="单价(含税)" width="120" />
          <el-table-column prop="taxRate" label="税率" width="80">
            <template slot-scope="scope">
              {{ scope.row.taxRate }}%
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="金额" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'inbound_external'" style="color: #67C23A">
                <template v-if="scope.row.weight">
                  +{{ scope.row.totalAmount }}
                </template>
                <template v-else>
                  +{{ scope.row.totalAmount }}
                </template>
              </div>
              <div v-else-if="scope.row.businessType == 'outbound_external'" style="color:red">
                <template v-if="scope.row.weight">
                  -{{ scope.row.totalAmount }}
                </template>
                <template v-else>
                  -{{ scope.row.totalAmount }}
                </template>
              </div>
            </template>
          </el-table-column>
            <el-table-column prop="checkStatus" label="核对状态" min-width="140" sortable="custom"
              :showOverflowTooltip="false" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.checkStatus == 'unchecked'"><el-tag type="warning">未核对</el-tag> </div>
                <div v-if="scope.row.checkStatus == 'checked'"><el-tag type="success">已核对</el-tag></div>
              </template>
            </el-table-column>
          <el-table-column prop="stockMoveOrderDate" label="单据日期" min-width="180" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="100" sortable="custom" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" >
          <div class="text">
            <span>合计：</span>
            <span style="margin-left: 10px">入库数量：{{ InTotalNum }}</span>
            <span style="margin-left: 10px">出库数量：{{ outTotalNum }}</span>
            <span style="margin-left: 10px">金额：{{ totalTotalAmount }}</span>
          </div>
        </pagination>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />

    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
        <orderDetailForm v-if="orderVisible" ref="orderRef" @close="closeFun"></orderDetailForm>
    <deliveryNoteDetailForm v-if="deliveryNoteVisible" ref="deliveryNoteRef" @close="closeFun"></deliveryNoteDetailForm>
  </div>
</template>

<script>
import {updateCheckStatusApi} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getsalefinAccountList } from '@/api/ReconciliaRePayments/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import orderDetailForm from '@/views/outsourcingManagement/productOutsourcingOrder/orderList/Form.vue'
import deliveryNoteDetailForm from '@/views/receivingManagement/receiveGoodsByOutsourcing/receivingAdvice/Form.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import JNPFForm from './Form'
import moment from 'moment'
import { excelExport } from '@/api/basicData/index'
import { getBimBusinessDetail } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  name: 'salefinAccount',
  components: { JNPFForm, ExportForm, SuperQuery,orderDetailForm,deliveryNoteDetailForm },
  mixins: [getProjectList],

  data() {
    return {
      orderVisible:false,
      deliveryNoteVisible:false,
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      basicQuery: {},
      superQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '出入库单号', symbol: 'like', searchType: 1, width: 120 },
        {
          field: 'partnerName',
          fieldValue: '',
          label: '供应商名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
          { field: 'checkStatus', fieldValue: '', label: '核对状态', symbol: '==', searchType: 4, width: 120,options: [
            { label: "未核对", value: "unchecked" },
            { label: "已核对", value: "checked" }, 
          ] },
      ],
      
      superForm: {},
      columnList: ['partnerCode', 'productCode', 'productName', 'createByName'],
      superQueryVisible: false,
      title: '更多查询',
      exportFormVisible: false,
      background: true, //分页器背景颜色
      visible: false,
      tableDataList: [],
      formVisible: false,
      listLoading: false,
 
      listQuery: {
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
        endTime: '',
        orderNo: '',
        pageNum: 1,
        pageSize: 20,
        partnerName: '',
        startTime: '',
        businessType: 'outside_delivery_return',
        superQuery: {}
      },
      receiptReturnTypeList: [
        {
          label: '退货',
          value: 'outbound_purchase'
        },
        {
          label: '收货',
          value: 'inbound_purchase'
        }
      ],
      createRequirementDate: [],
      deliveryDate: [],
      selectData: [], // 选中的数据 带到form页
      total: 0,
      totalNum: 0,
      InTotalNum:0,
      outTotalNum:0,
      totalTotalAmount: 0,
      formVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '出入库单号',
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'partnerCode',
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
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
         {
          prop: 'stockMoveOrderDate',
          label: '单据日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },

     {
          prop: 'checkStatus',
          label: "核对状态",
          type: 'select',

          options: [
            { label: "未核对", value: "unchecked" },
            { label: "已核对", value: "checked" }, 
          ]

        },
        {
          prop: 'taxRate',
          label: '税率(%)',
          type: 'input'
        },

        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },

        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        }
      ]
    }
  },
  async created() {
    await this.getDeputyUnit()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isDeputyUnitSwitch === '1') {
      this.superQueryJson.forEach(item => {
        if (item.prop === 'mainUnit') {
          item.label = '单位(主)'
        }
      })
      this.superQueryJson.splice(6, 0, {
        prop: 'deputyUnit',
        label: '单位(副)',
        type: 'input'
      })

    }
    if (this.isProductNameSwitch === '1') {
      this.searchList.splice(2, 0,{
        field: 'productName',
        fieldValue: '',
        label: '产品名称',
        symbol: 'like',
        searchType: 1,
        width: 120
      })
      this.superQueryJson.splice(3, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.superForm = this.listQuery

    this.initData()
  },
  methods: {
    updateCheckStatusFun(){
      if(!this.selectData.length) return this.$message.error("请选择您要更新的数据！")
      this.$confirm("您确定要更新所选数据的核对状态为已核对吗？", this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        let idArray = this.selectData.map(item => item.id);
        let obj={
          ids:idArray,
          checkStatus:"checked",
        }
        updateCheckStatusApi(obj).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "更新成功",
            duration: 1500,
          })
        })
      }).catch(() => { })

    },
    closeFun(){
      this.orderVisible = false
      this.deliveryNoteVisible=false

    },
    orderDetailFun(id,type){
      this.orderVisible = true
      this.$nextTick(() => {
        this.$refs.orderRef.init(id, type)
      })
    },
    deliveryNoteDetailFun(id,type){
      this.deliveryNoteVisible=true
       this.$nextTick(() => {
          this.$refs.deliveryNoteRef.init(id, type, false, [])
        })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `outDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef)
        let columnList = domRef.columnList.filter((item) => !!item.label && !!item.prop)
        columnList = columnList.map((item) => {
          return { label: item.label, prop: item.prop }
        })
        this.$nextTick(() => {
          this.$refs.exportForm.init(columnList)
        })
      } else {
        this.$message({
          message: '暂无数据导出',
          type: 'error',
          duration: 1500
        })
      }
    },
    // 导出
    exportForm() {
      this.exportType(this.tableDataList, 'tableForm')
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1204',
          exportName: '采购出入库对账',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          negativeFlag:true,
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
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    checkSelectable(row) {
      return !row.disabled
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      console.log(val)
      this.selectData = val
      function calculateTotalValue(arr) {
        return arr.reduce((sum, item) => {
          const value = Number(item.totalAmount); // 将 value 转换为数字  
          if (item.businessType === 'inbound_external') {
            return sum + value;  // 对于 '正', 加上 value  
          } else if (item.businessType === 'outbound_external') {
            return sum - value;   // 对于 '负', 减去 value  
          }
          return sum;  // 默认情况，无需改变 sum  
        }, 0);
      }
      function calculateSum(data, type) {
        return data.reduce((sum, item) => {
          return item.businessType === type ? sum + Number(item.num) : sum;
        }, 0);
      }
      this.InTotalNum = calculateSum(this.selectData, 'inbound_external')
      this.outTotalNum = calculateSum(this.selectData, 'outbound_external')
      // this.totalNum = this.selectData.reduce((sum, e) => sum + Number(e.num || 0), 0)
      this.totalTotalAmount = calculateTotalValue(this.selectData)
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp
      if (
        prop === 'partnerName' ||
        prop === 'partnerCode' ||
        prop === 'productCode' ||
        prop === 'createTime' ||
        prop === 'createByName'
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
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listQuery.startTime = this.createRequirementDate[0]
        this.listQuery.endTime = this.createRequirementDate[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
      this.superForm = this.listQuery
      getsalefinAccountList(this.superForm)
        .then((res) => {
          console.log(res, '采购发/退货列表')
          res.data.records.forEach((item) => {
            // if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
            //   item.disabled = true
            // } else {
            //   item.disabled = fals
            // }
            item.excludingTaxAmount = this.jnpf.numberFormat(item.actualQuantity * item.price)
          })

          this.tableDataList = res.data.records
          this.tableFlag = true

          console.log('this.tableDataList ', this.tableDataList)
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
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()

      this.listQuery = {
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
        endTime: '',
        orderNo: '',
        pageNum: 1,
        pageSize: 20,
        partnerName: '',
        startTime: '',
        businessType: 'outside_delivery_return',
        superQuery: {}
      }
      this.createRequirementDate = []
      this.deliveryDate = []
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '出入库单号', symbol: 'like', searchType: 1, width: 120 },
        {
          field: 'cooperativePartnerName',
          fieldValue: '',
          label: '供应商名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
           { field: 'checkStatus', fieldValue: '', label: '核对状态', symbol: '==', searchType: 4, width: 120,options: [
            { label: "未核对", value: "unchecked" },
            { label: "已核对", value: "checked" }, 
          ] },
      ]
      if (this.isProductNameSwitch === '1') {
        this.searchList.splice(2, 0, {
          field: 'productName',
          fieldValue: '',
          label: '产品名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        })
        this.superQueryJson.splice(3, 0, {
          prop: 'productName',
          label: '产品名称',
          type: 'input'
        })
      }
      this.superForm = JSON.parse(JSON.stringify(this.listQuery))
      this.search('basic')
    },

    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle() {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择你要生成的采购对账单',
          type: 'error',
          duration: 1500
        })
      } else {
        // console.log(this.$refs);
        console.log(this.selectData, 'this.selectData')
        let firstCode = this.selectData[0].partnerCode
        let allCode = this.selectData.every((obj) => obj.partnerCode === firstCode)
        if (allCode) {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.procureForm.init(this.selectData)
          })
        } else {
          this.$message.error('请选择供应商相同的通知单!')
        }
      }
    }
  }
}
</script>
<style scoped>
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

.el-tabs__nav-scroll {
  padding-left: 0;
}
</style>
