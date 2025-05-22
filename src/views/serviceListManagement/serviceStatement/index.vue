<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
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
          <!-- <topOpts @add="addSupplier('', 'add')"></topOpts> -->
          <div>
            <el-button size="mini" type="primary" @click="addOrUpdateHandle()">新建服务单</el-button>
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

        <JNPF-table  highlight-current-row 
          :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
          :setColumnDisplayList="columnList"  customKey="JNPFTableKey_123476">
          <el-table-column prop="orderNo" label="服务单号" min-width="200" sortable="custom" />
          <el-table-column prop="cooperativePartnerName" label="供应商/客户名称" min-width="200" sortable="custom" />
          <el-table-column prop="cooperativePartnerTaxId" label="税号" min-width="200" sortable="custom" />
          <el-table-column prop="cooperativePartnerPhone" label="联系方式" min-width="200" sortable="custom" />
          <el-table-column prop="content" label="服务内容" min-width="180" sortable="custom" />
            <el-table-column prop="paymentType" label="收付款类型" min-width="150" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.paymentType == 'pay'">付款</div>
              <div v-else-if="scope.row.paymentType == 'receive'">收款</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="含税金额" min-width="180" sortable="custom" />
          <el-table-column prop="taxRate" label="税率" sortable="custom" width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billStatus" label="对账状态" min-width="120" sortable="custom" >
            <template slot-scope="scope">
              <div v-if="scope.row.billStatus == 'no_billing'"><el-tag>未对账</el-tag> </div>
              <div v-if="scope.row.billStatus == 'billed'"><el-tag type="success">已对账</el-tag></div>
              <div v-if="scope.row.billStatus == 'in_bill' && scope.row.documentStatus == 'submit'"><el-tag type="warning">对账中</el-tag></div>
            </template>
          </el-table-column> 
        
          <el-table-column prop="remark" label="备注" min-width="180" sortable="custom" />
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData">
          <div class="text">
            <span>合计：</span>
            <span style="margin-left: 10px">总含税金额：{{ totalTotalAmount }}</span>
          </div>
        </pagination>
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" /> 
  </div>
</template>

<script> 
import SuperQuery from '@/components/SuperQuery/index.vue'

import JNPFForm from './Form'
import moment from 'moment'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList' 
import {delFinServiceTicket,finServiceTicketList}from '@/api/service/index'
import tenantMinix from "@/mixins/generator/TenantMinix"
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
export default {
  name: 'salefinAccount',
  mixins: [getProjectList,tenantMinix,AbProjectMixin],

  components: { JNPFForm,  SuperQuery },
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '服务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '供应商/客户名称', symbol: 'like', searchType: 1, width: 120 }, 
        { field: 'billStatus', fieldValue: '', label: '对账状态', symbol: 'like', searchType: 4, width: 120, options: [
          {label:"no_billing",value:"未对账",},
          {label:"billed",value:"已对账",},
          {label:"no_billing",value:"对账中",},
        ]},
      ],
      columnList: [],
      superQueryVisible: false,
      title: "更多查询",
      exportFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      formVisible: false,
      listLoading: false,
      listQuery:{},
      listQuerylist: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        orderNo: "",
        cooperativePartnerName: "",
        pageNum: 1,
        pageSize: 20,
        businesbillStatusType: '',
        superQuery: {},
      },
      selectData: [],                    // 选中的数据 带到form页
      total: 0,
      totalNum: 0,
      totalTotalAmount: 0,
      formVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "出入库单号",
          type: 'input'
        },
        {
          prop: 'saleOrderNo',
          label: "销售订单号",
          type: 'input'
        },
        {
          prop: 'saleNoticeNo',
          label: "销售通知单号",
          type: 'input'
        },
        {
          prop: 'deliverDate',
          label: '发货日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        
        {
          prop: 'partnerName',
          label: "客户名称",
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: "客户编码",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
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

        {
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },

        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        }


      ],
      isProjectSwitch: "",
      isProjectSwitchFlag: false,
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
      materialFlag: '',
      colourFlag: '',
      bimProductAttributesList: [],
    }
  },
  async created() {
    this.superForm = this.listQuery=JSON.parse(JSON.stringify(this.listQuerylist))
    this.search('basic')    
    
  },
  computed: {
    ...mapGetters(['userInfo'])
  },

  methods: {
     
 
  
   
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
  
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    checkSelectable(row) {
      return !row.disabled
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      this.selectData = val
      function calculateTotalValue(arr) {
        return arr.reduce((sum, item) => {
          const value = Number(item.totalAmount); // 将 value 转换为数字  
          if (item.paymentType === 'receive') {
            return sum + value;  // 对于 '正', 加上 value  
          } else if (item.paymentType === 'pay') {
            return sum - value;   // 对于 '负', 减去 value  
          }
          return sum;  // 默认情况，无需改变 sum  
        }, 0);
      }
      function calculateSum(data, type) {
        return data.reduce((sum, item) => {
          return item.paymentType === type ? sum + Number(item.num) : sum;
        }, 0);
      }
      this.totalNum = this.selectData.reduce((sum, e) => sum + Number(e.num || 0), 0)
      this.totalTotalAmount = calculateTotalValue(this.selectData)
      this.InTotalNum = calculateSum(this.selectData, 'receive')
      this.outTotalNum = calculateSum(this.selectData, 'pay')

    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      if (newProp === 'product_code') {
        newProp = 'productCode'
      }
      if (newProp === 'product_name') {
        newProp = 'productName'
      }
      if (newProp === 'partner_name') {
        newProp = 'partnerName'
      }
      if (newProp === 'create_time') {
        newProp = 'createTime'
      }

      if (newProp == 'project_name') {
        newProp = 'projectName'

      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.totalNum = 0
      this.totalTotalAmount = 0
      if (isRefresh) {
        this.initData()
      }
    },
    refresh() {
      this.formVisible = false
      this.reset()
    },


    initData() {
      
      
      finServiceTicketList(this.listQuery).then(res => {
       

        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
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
         this.superForm = this.listQuery=JSON.parse(JSON.stringify(this.listQuerylist))
        this.searchList =  [
        { field: 'orderNo', fieldValue: '', label: '服务单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '供应商/客户名称', symbol: 'like', searchType: 1, width: 120 }, 
        { field: 'billStatus', fieldValue: '', label: '对账状态', symbol: 'like', searchType: 4, width: 120, options: [
          {label:"no_billing",value:"未对账",},
          {label:"billed",value:"已对账",},
          {label:"no_billing",value:"对账中",},
        ]},
      ],
      this.$refs.SuperQuery.conditionList = []

      this.search('basic')
    },
  
    // 生成采购订单 将选中的数据传递过去
    addOrUpdateHandle() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.procureForm.init('add')
      })

    },

  }
}
</script>
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
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

.JNPF-common-head {
  padding: 8px !important
}
</style>