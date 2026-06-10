<!-- 异常记录 --> 
<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
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
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="advanceFun" />
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
          <JNPF-table :partentOrChild="'dataTable'" ref="dataTable" :data="tableData"
            :fixedNO="true"  @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="abnormalNo" label="异常单号" min-width="180" sortable="custom" />
            <el-table-column prop="equipmentIdName" label="设备名称" min-width="180" sortable="custom" />
            <el-table-column prop="equipmentIdCode" label="设备编码" min-width="180" sortable="custom" />
            <el-table-column prop="handleFlag" label="异常状态" min-width="180" sortable="custom" >
               <template slot-scope="scope">
                  <el-tag  v-if="!scope.row.handleFlag">待处理</el-tag>
                <el-tag type="success" v-if="scope.row.handleFlag">已处理</el-tag>
               </template>
            </el-table-column>
            <el-table-column prop="createByName" label="上报人" min-width="180" sortable="custom" />
            <el-table-column prop="createTime" label="上报时间" min-width="180" sortable="custom" />
            <el-table-column prop="abnormalDescribe" label="异常描述" min-width="180" sortable="custom" />
            <el-table-column prop="handleTime" label="完成时间" min-width="180" sortable="custom" />
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'

import {equAbnormalReportingList} from '@/api/bimPropertyCategory/index'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'abnormalRecords',
  components: {  SuperQuery },
  data() {
    return {
      addOrderVisible: false,
      superQueryVisible: false,
      columnList: [],
      superQuery: {},
      superForm: {}, 
     

 
   
      basicQuery: {},
      searchList: [
        { field: 'abnormalNo', fieldValue: '', label: '异常单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'equipmentIdName', fieldValue: '', label: '设备名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'equipmentIdCode', fieldValue: '', label: '设备编码', symbol: 'like', searchType: 1, width: 120 },
      ],
      taskKey:"",
     
      reworkVisible: false,
      btnLoading: false,
      title: "更多查询",
      tableData: [],
      listLoading: false,
      detailFlag: false,
      orderForm: {},
      orderFormlist: { 
        equipmentType:"tool",
        equipmentIdName:"",
        equipmentIdCode:"",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      total: 0,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        
        {
          prop: 'abnormalNo',
          label: "异常单号",
          type: 'input'
        },
         {
          prop: 'equipmentIdName',
          label: "设备名称",
          type: 'input'
        },
        {
          prop: 'equipmentIdCode',
          label: "设备编码",
          type: 'input'
        },
            {
          prop: 'handleFlag',
          label: "异常状态",
          type: 'select',
          options: [
            { label: "已处理", value: true },
            { label: "待处理", value: false},
          ]
        },
        
   
        {
          prop: 'handleTime',
          label: '完成时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
      
      ],
      list:[],
    }
  },
  async created() {


    this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
  },
  methods: {
 
 
  
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' ||prop=='productionLineNmae'|| prop == 'pairingModeName' || prop == 'productName' || prop == 'projectName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'productDrawingNo' || prop == 'productCode' || prop == 'routingName' || prop == 'routingCode') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
   
    initData() {
      this.listLoading = true
      equAbnormalReportingList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
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
      this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'abnormalNo', fieldValue: '', label: '异常单号', symbol: 'like', searchType: 1, width: 120 }, 
      { field: 'equipmentIdName', fieldValue: '', label: '设备名称', symbol: 'like', searchType: 1, width: 120 },
      { field: 'equipmentIdCode', fieldValue: '', label: '设备编码', symbol: 'like', searchType: 1, width: 120 },
      ],
        this.search('basic')
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    closePrint() {
      this.printVisible = false
    },
  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
  margin-bottom: 5px;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}
::v-deep #qrcode img{
  margin: 0 auto;
}
</style>
