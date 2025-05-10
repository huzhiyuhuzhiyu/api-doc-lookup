<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

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
          <!-- <el-col :span="5">
            <el-form-item>
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="创建开始时间"
                end-placeholder="创建结束时间" clearable :picker-options="global.timePickerOptions"></el-date-picker>
            </el-form-item>
          </el-col> -->

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
          <!-- <topOpts @add="addSupplier('', 'add')"></topOpts> -->
          <div>
            <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成采购对账</el-button>
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
          :setColumnDisplayList="columnList" :checkSelectable="checkSelectable">
          <el-table-column prop="orderNo" label="资产采购单号" sortable="custom" />
          <el-table-column prop="cooperativePartnerName" label="供应商名称"  sortable="custom" />
          <el-table-column prop="projectName" label="所属项目"  sortable="custom" v-if="abProjectSwitchVisible"></el-table-column>
          <el-table-column prop="name" label="资产名称"  sortable="custom" />
          <el-table-column prop="code" label="资产编码"  ></el-table-column>
          <el-table-column prop="tax" label="税率" >
            <template slot-scope="scope">
              {{ scope.row.tax }}%
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="金额" >
            <template slot-scope="scope">
              <div style="color: #67C23A">+{{ scope.row.totalAmount }} </div></template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"  sortable="custom" />
          <el-table-column prop="createByName" label="创建人"  sortable="custom" />
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
  </div>
</template>

<script>
import {propertyPurchaseOrderList,delPropertyPurchaseOrder} from '@/api/bimPropertyCategory/index'
import SuperQuery from '@/components/SuperQuery/index.vue'

import ExportForm from '@/components/no_mount/ExportBox/index'
import JNPFForm from './Form'
import moment from 'moment'
import { excelExport } from '@/api/basicData/index'
import { getBimBusinessDetail } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import AbProjectMixin from "@/mixins/generator/AbProjectMixin";

export default {
  name: 'purchaseStatement',
  components: { JNPFForm, ExportForm, SuperQuery },
  mixins: [getProjectList,AbProjectMixin],
  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      basicQuery: {},
      superQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '采购单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'propertyName', fieldValue: '', label: '资产名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      superForm: {},
      columnList: [],
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
        pageNum: 1,
        pageSize: 20,
        orderStatus:"received",
        name:"",
        orderNo:"",
        cooperativePartnerName:"",
        billStatus:"no_billing",
        superQuery: {}
      },
   
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
          label: '资产采购单号',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '供应商名称',
          type: 'input'
        }, 
        {
          prop: 'propertyName',
          label: '资产名称',
          type: 'input'
        },
        {
          prop: 'propertyCode',
          label: '资产编码',
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
    this.initData()
  },
  methods: {
 
 
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
          exportName: '出入库对账',
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
          if (item.businessType === 'inbound_purchase') {
            return sum + value;  // 对于 '正', 加上 value  
          } else if (item.businessType === 'outbound_purchase') {
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
      this.InTotalNum = calculateSum(this.selectData, 'inbound_purchase')
      this.outTotalNum = calculateSum(this.selectData, 'outbound_purchase')
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
      // if (this.createRequirementDate && this.createRequirementDate.length > 0) {
      //   this.listQuery.startTime = this.createRequirementDate[0] + ' 00:00:00'
      //   this.listQuery.endTime = this.createRequirementDate[1] + ' 23:59:59'
      // } else {
      //   this.listQuery.startTime = ''
      //   this.listQuery.endTime = ''
      // }
      this.superForm = this.listQuery
      propertyPurchaseOrderList(this.superForm)
        .then((res) => {
          console.log("资产采购",res, )
          res.data.records.forEach((item) => {
          
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
        businessType: 'purchase_delivery_return',
        superQuery: {}
      }
      this.createRequirementDate = []
      this.deliveryDate = []
      this.searchList = [
      { field: 'orderNo', fieldValue: '', label: '采购单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'propertyName', fieldValue: '', label: '资产名称', symbol: 'like', searchType: 1, width: 120 },
      ]
      this.superForm = JSON.parse(JSON.stringify(this.listQuery))
      this.$refs.SuperQuery.conditionList = []
      this.search('basic')
    },
    // addSupplier(id, type) {
    //   this.formVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.JNPFForm.init(id, type)
    //   })
    // },
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
        let firstId = this.selectData[0].cooperativePartnerId
        let allCode = this.selectData.every((obj) => obj.cooperativePartnerId === firstId)
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
