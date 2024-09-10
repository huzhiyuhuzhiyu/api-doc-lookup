<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="productionPlanNoS" placeholder="生产计划单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="productDrawingNoS" placeholder="品名规格" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="orderForm.urgentFlag" placeholder="是否紧急" style="width: 100%;">
                  <el-option v-for="(item, index) in urgentFlagList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="translateFun()">
                编排
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-download" @click.native="exportForm('dataTable')">
                导出
              </el-button>


            </div>
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            header-cell-class-name="all-select" @sort-change="sortChange" custom-column
            :setColumnDisplayList="columnList" hasC @selection-change="selectFun" :checkSelectable="dispurchaseData">
            <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" sortable="custom" />
            <el-table-column prop="productsDrawingNo" label="品名规格" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="productsCode" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="planProductionQuantity" label="计划生产数量" min-width="160" sortable="custom" />
            <el-table-column prop="availableArrangeQuantity" label="可编排数量" min-width="160" sortable="custom" />
            <el-table-column prop="arrangeOrderNum" label="已编排单数/数量" min-width="180" sortable="custom" />

            <el-table-column prop="urgentFlag" label="是否紧急" min-width="120" sortable="custom"
              :cell-class-name="cellClassName">
              <template slot-scope="scope">
                <div :style="scope.row.urgentFlag ? 'color:red' : ''">{{ scope.row.urgentFlag ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" sortable="custom"></el-table-column>

            <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" sortable="custom" />
            <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
            <el-table-column prop="oil" label="油脂" min-width="100" sortable="custom" />
            <el-table-column prop="oilQuantity" label="油脂量" min-width="120" sortable="custom" />
            <el-table-column prop="clearance" label="游隙" min-width="100" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom" />
            <el-table-column prop="specialRequire" label="特殊要求" min-width="160" sortable="custom" />

            <el-table-column prop="arithmeticNo" label="运算单号" min-width="160" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="180" sortable="custom"></el-table-column>

            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" />
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.orderType == 'rework'"
                  @click="addition(scope.row)">编排</el-button>

              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { UserListAll, } from '@/api/permission/user'
import Form from './Form'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { getProductionPlanList } from '@/api/productionManagement/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport } from '@/api/basicData/index'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'assemblyplanManagement',
  components: { Form, SuperQuery, ExportForm },
  data() {
    return {
      columnList: ["productCode", "arithmeticNo", "remark", "createByName",],
      productDrawingNoS: "",
      productionPlanNoS: "",
      superQueryVisible: false,
      exportFormVisible: false,
      qxbtnLoading: false,
      hbbtnLoading: false,
      btnLoading: false,

      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,

      orderForm: {},
      orderFormlist: {
        productsDrawingNo: "",
        productionPlanNo: "",
        urgentFlag: "",
        pageNum: 1,
        availableArrangeFlag: 1,
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
        classAttribute: "finish_product",
      },
      urgentFlagList: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },

      total: 0,
      diagramVisible: false,
      formVisible: false,
      selectArr: [],

      superQueryJson: [
        {
          prop: 'productionPlanNo',
          label: "生产计划单号",
          type: 'input'
        },

        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'planProductionQuantity',
          label: "计划生产数量",
          type: 'input'
        },
        {
          prop: 'availableArrangeQuantity',
          label: "可编排数量",
          type: 'input'
        },
        {
          prop: 'urgentFlag',
          label: "是否紧急",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'sealingCoverTyping',
          label: "打字内容",
          type: 'select',
          options: []
        },
        {
          prop: 'accuracyLevel',
          label: "精度等级",
          type: 'select',
          options: []
        },
        {
          prop: 'vibrationLevel',
          label: "振动等级",
          type: 'select',
          options: []
        },

        {
          prop: 'oil',
          label: "油脂",
          type: 'select',
          options: []
        },
        {
          prop: 'oilQuantity',
          label: "油脂量",
          type: 'select',
          options: []
        },
        {
          prop: 'clearance',
          label: "游隙",
          type: 'select',
          options: []
        },
        {
          prop: 'packagingMethod',
          label: "包装方式",
          type: 'select',
          options: []
        },
        {
          prop: 'specialRequire',
          label: "特殊要求",
          type: 'select',
          options: []
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input',

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
      ],
      requestArr: [
        {
          prop: "sealingCoverTyping",
          typeCode: "pa007"
        }, {
          prop: "accuracyLevel",
          typeCode: "pa006"
        },
        {
          prop: "vibrationLevel",
          typeCode: "pa005"
        },
        {
          prop: "oil",
          typeCode: "pa002"
        }, {
          prop: "oilQuantity",
          typeCode: "pa003"
        }, {
          prop: "clearance",
          typeCode: "pa001"
        }, {
          prop: "packagingMethod",
          typeCode: "pa015"
        }, {
          prop: "specialRequire",
          typeCode: "pa016"
        }
      ],

    }
  },
  created() {
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search()
  },
  watch: {
    activeName() {
      this.search()
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  methods: {
    dispurchaseData(row) {
      return !row.selectFlag;
    },
    addition(data) {
      if (this.selectArr) {
        this.selectArr = []
        this.selectArr.push(data)
        this.translateFun()
      } else {
        this.selectArr.push(data)
        this.translateFun()
      }
    },
    // 编排
    translateFun() {
      if (!this.selectArr.length) return this.$message.error("请选择您要生成编排的数据")
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(this.selectArr)
      })
    },
    selectFun(val) {
      console.log(val);
      if (val.length) {
        this.tableData.forEach(item => {
          if (item.id != val[0].id) {
            item.selectFlag = true
          }
        });
        this.selectArr = val
      } else {
        this.tableData.forEach(item => {
          item.selectFlag = false
        });

      }

    },
    // 获取打字内容等
    getProductClassFun() {
      this.requestArr.forEach((item, index) => {
        let obj1 = {
          pageNum: -1,
          pageSize: 20,
          typeCode: item.typeCode,
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
          res.data.records.forEach(items => {
            let obj = {
              label: items.name,
              value: items.name,
            }
            arr.push(obj)
          });
          let oilObj = this.superQueryJson.find(rs => rs.prop === item.prop);
          if (oilObj) {
            // 将options赋值为5  
            oilObj.options = JSON.parse(JSON.stringify(arr));
          }
        })
      })




    },

    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },






    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName') {
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

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.selectArr = []
      this.search()
    },
    initData() {
      this.listLoading = true




      if (this.productionPlanNoS) {

        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("productionPlanNo"));
          filteredData.push({ "field": "productionPlanNo", "fieldValue": this.productionPlanNoS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push(
            { "field": "productionPlanNo", "fieldValue": this.productionPlanNoS, "symbol": "like" }
          )
        }
      }
      if (this.productDrawingNoS) {
        // this.orderForm.superQuery.condition.push(
        //   { "field": "productDrawingNo", "fieldValue": this.productDrawingNo, "symbol": "like" }
        // )
        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("productsDrawingNo"));
          filteredData.push({ "field": "productsDrawingNo", "fieldValue": this.productDrawingNoS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push(
            { "field": "productsDrawingNo", "fieldValue": this.productDrawingNoS, "symbol": "like" }
          )
        }
      }
      if (this.customerDrawingNumberS || this.productDrawingNoS) {
        this.$set(this.orderForm.superQuery, 'matchLogic', 'AND')
      }
      getProductionPlanList(this.orderForm).then(res => {
        res.data.records.forEach(item => {
          item.selectFlag = false
        })
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    search() {

      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码

      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮

      this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))

      this.productionPlanNoS = ""
      this.productDrawingNoS = ""
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },





    columnSetFun() {
      this.$refs.dataTable.showDrawer()
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
      const targetListQuery = this.orderForm
      let _data = {
        ...targetListQuery,
        exportType: "1210",
        exportName: '生产计划',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
  }
}
</script>
<style scoped>
::v-deep .all-select .cell .el-checkbox__inner {
  display: none;
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}
</style>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
