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



          <el-col :span="5">
            <el-form-item>
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

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
            <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成销售对账</el-button>
            <el-button size="mini" type="primary" v-loading="taxLoading" @click="changeTaxFlag(true)">税率置0</el-button>
            <el-button size="mini" type="primary" v-loading="taxLoading" @click="changeTaxFlag(false)">税率复原</el-button>
            <el-button v-has="'btn_export'" :disabled="tableDataList.length > 0 ? false : true" size="mini"
              type="primary" icon="el-icon-download" @click="exportForm">导出</el-button>
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

        <JNPF-table @selection-change="handeleProductInfoData" hasC highlight-current-row v-if="isProjectSwitchFlag"
          :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
          :setColumnDisplayList="columnList" :checkSelectable="checkSelectable" customKey="JNPFTableKey_675849">
          <el-table-column prop="orderNo" label="出入库单号" min-width="200" sortable="custom" />
          <el-table-column prop="customerProductNo" label="客户料号" min-width="200" sortable="custom" />
          <el-table-column prop="partnerName" label="客户名称" min-width="180" sortable="custom" />
          <el-table-column prop="partnerCode" label="客户编码" min-width="180" sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" min-width="180" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
          <el-table-column prop="drawingNo" label="品名规格" min-width="180" sortable="custom" />
          <!-- <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" /> -->
          <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
            v-if="isProjectSwitch == 1" />
          <el-table-column prop="businessType" label="发/退货类型" min-width="150" sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'outbound_sale_send'">发货</div>
              <div v-else-if="scope.row.businessType == 'inbound_sale_return'">退货</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" label="单位" min-width="80" />
          <el-table-column prop="num" label="出入库数量" min-width="120" />
          <el-table-column prop="costPrice" label="单价(含税)" min-width="120" />
          <el-table-column prop="taxRate" label="税率" min-width="80">
            <template slot-scope="scope">
                <div>{{ scope.row.taxFlag ? 0 : scope.row.taxRate }}%</div>
            </template>
          </el-table-column>
          <el-table-column prop="totalAmount" label="金额" min-width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.businessType == 'outbound_sale_send'" style="color: #67C23A">+{{
                scope.row.totalAmount }}</div>
              <div v-else-if="scope.row.businessType == 'inbound_sale_return'" style="color:red">-{{
                scope.row.totalAmount
              }}</div>
            </template>
          </el-table-column>
          <AttributeDictionaryLine :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'sale'" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="180" sortable="custom" />




        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData">

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
import { getsalefinAccountList, updateTaxFlag } from '@/api/ReconciliaRePayments/index'
import SuperQuery from '@/components/SuperQuery/index.vue'

import ExportForm from '@/components/no_mount/ExportBox/index'
import JNPFForm from './Form'
import moment from 'moment'
import { excelExport, getOrderFiledMap } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import {
   getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
export default {
  name: 'salesReconciliationReal',
  mixins: [getProjectList],

  components: { JNPFForm, ExportForm, SuperQuery },
  data() {
    return {
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '出入库单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      columnList: ["partnerCode", "productCode",  "createByName"],
      superQueryVisible: false,
      title: "更多查询",
      exportFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [
      ],
      formVisible: false,
      listLoading: false,
      listQuery: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        endTime: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        partnerName: "",
        startTime: "",
        businessType: 'send_return',
        superQuery: {},
      },
      receiptReturnTypeList: [
        {
          label: '发货',
          value: 'outbound_sale_send'
        },
        {
          label: '退货',
          value: 'inbound_sale_return'
        },
      ],
      createRequirementDate: [],
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
      taxLoading:false,
    }
  },
  async created() {
    this.superForm = this.listQuery
    this.search('basic')
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.advancedQueryFun()
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(4, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    await this.getProjectSwitch('system', 'project')
    this.isProjectSwitchFlag = true
  },
  computed: {
    ...mapGetters(['userInfo'])
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
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
    },
    advancedQueryFun() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式
      //     specialRequire //特殊要求
      //     material //保持架材质
      //     colour //颜色
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'contractNo')
      if (this.colourFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'colour',
          label: '颜色',
          type: 'select',
          options: this.bimProductAttributesList.pa010.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.materialFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'material',
          label: '保持架材质',
          type: 'select',
          options: this.bimProductAttributesList.pa021.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
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
      if (this.packagingMethodFlag === '1') {
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
    exportType(data, ref) {
      if (data.length) {
        this.exportFormVisible = true
        let domRef = this.$refs[`${ref}`]
        console.log(domRef);
        let columnList = domRef.columnList.filter(item => !!item.label && !!item.prop)
        columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
        this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
      } else {
        this.$message({
          message: "暂无数据导出",
          type: "error",
          duration: 1500,
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
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let query = this.listQuery
        let _data = {
          ...query,
          exportType: '1204',
          exportName: '出入库对账',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
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
      this.selectData = val
      function calculateTotalValue(arr) {
        return arr.reduce((sum, item) => {
          const value = Number(item.totalAmount); // 将 value 转换为数字
          if (item.businessType === 'outbound_sale_send') {
            return sum + value;  // 对于 '正', 加上 value
          } else if (item.businessType === 'inbound_sale_return') {
            return sum - value;   // 对于 '负', 减去 value
          }
          return sum;  // 默认情况，无需改变 sum
        }, 0);
      }

      this.totalNum = this.selectData.reduce((sum, e) => sum + Number(e.num || 0), 0)
      this.totalTotalAmount = calculateTotalValue(this.selectData)
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
      this.listLoading = true
      if (this.createRequirementDate && this.createRequirementDate.length > 0) {
        this.listQuery.startTime = this.createRequirementDate[0] + " 00:00:00"
        this.listQuery.endTime = this.createRequirementDate[1] + " 23:59:59"
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }

      getsalefinAccountList(this.listQuery).then(res => {
        console.log(res, '销售发/退货列表');
        res.data.records.forEach(item => {
          // if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
          //   item.disabled = true
          // } else {
          //   item.disabled = fals
          // }
          item.excludingTaxAmount = this.jnpf.numberFormat(item.actualQuantity * item.price)
        });

        this.tableDataList = res.data.records
        console.log("this.tableDataList ", this.tableDataList);
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

      this.superForm = this.listQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        endTime: "",
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        partnerName: "",
        startTime: "",
        businessType: 'send_return',
        superQuery: {},
      },
        this.searchList = [
          { field: 'orderNo', fieldValue: '', label: '出入库单号', symbol: 'like', searchType: 1, width: 120 },
          { field: 'partnerName', fieldValue: '', label: '客户名称', symbol: 'like', searchType: 1, width: 120 },

        ]
      this.createRequirementDate = []
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
          message: "请选择你要生成的销售对账单",
          type: "error",
          duration: 1500,
        })
      } else {
        // console.log(this.$refs);
        console.log(this.selectData, 'this.selectData')
        let firstCode = this.selectData[0].partnerCode
        let allCode = this.selectData.every(obj => obj.partnerCode === firstCode)
        if (allCode) {
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.procureForm.init(this.selectData)
          })
        } else {
          this.$message.error('请选择客户相同的通知单!')
        }

      }

    },
    changeTaxFlag(type){
      this.taxLoading = true
      if (!this.selectData.length) return this.$message.error('请至少选择一条数据')
      let idList = this.selectData.map(item=>item.id)
      updateTaxFlag(idList,type).then(res=>{
        this.$message.success('修改成功')
        this.taxLoading = false
        this.initData()
      }).catch(err=>{this.taxLoading = false})
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
