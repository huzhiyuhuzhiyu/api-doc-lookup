<!-- 装配计划管理 -->
<template>

  <div class="JNPF-common-layout">

      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.planNo" @keyup.enter.native="search()" placeholder="计划单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.productDrawingNo" @keyup.enter.native="search()" placeholder="品名规格"
                  clearable />
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
            <el-button type="primary" size="mini" icon="el-icon-download"
              @click="exportForm('dataTable')">导出</el-button>
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
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column>
            <el-table-column prop="planNo" label="计划单号" width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row, 'look')">{{
                  scope.row.planNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" width="160" sortable="custom" /> 
            <el-table-column prop="productCode" label="产品编码" width="120" sortable="custom" />
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="150" sortable="custom" />
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="150" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="planQuantity" label="计划数量" min-width="120" sortable="custom" />
            <el-table-column prop="relaxQuantity" label="宽放计划数量" min-width="150" sortable="custom" />
            <el-table-column prop="finalPlanQuantity" label="最终计划数量" min-width="150" sortable="custom" />
            <!-- <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" sortable="custom" />
            <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" />
            <el-table-column prop="oilQuantity" label="油脂量" min-width="120" sortable="custom" />
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom" /> -->
            <el-table-column prop="remark" label="备注" width="120" />
            <el-table-column prop="planState" label="计划状态" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.planState == 'not_finish'"><el-tag type="danger">未完成</el-tag></div>
                <div v-else-if="scope.row.planState == 'finish'"><el-tag type="success">已完成</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" width="120" sortable="custom" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="addOrUpdateHandle(scope.row, 'edit')">编辑</el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="handleDel(scope.row.id)">删除</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="handleUserRelation(scope.row, 'look')">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>

          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData">

          </pagination>

        </div>
      </div>


    <!-- <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" /> -->

    <OrderForm v-if="orderFormVisible" ref="orderForm" @refreshDataList="initData" @close="closeForm" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { excelExport } from '@/api/basicData/index'
import { getsaleOrderList, getsaleOrderDetailList, deleteOrders, getAttributeline, getSaleordersTotal, getOrderLineReport } from '@/api/salesManagement/assemblyOrders'
import { addPlanList, updatePlanList, deletePlanList, getPlanList, detailPlanList } from '@/api/calculationList/calculationList.js'
import Form from './Form'
import OrderForm from '../salesOrderCreation/Form.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'assemblyPlanManagement',
  components: { Form, ExportForm, SuperQuery, OrderForm },
  data() {
    return {
      CreateFormVisible: false,
      columnList: ["productCode", 'planState'],
      orderFormVisible: false,
      superQueryVisible: false,
      exportFormVisible: false,
      tableData: [],
      listLoading: false,
      orderForm: {
        classAttribute: "semi_finished",
        productName: "",
        productDrawingNo: "",
        planNo: "",
        planState: "not_finished",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

        superQuery: {},
      },


      deliveryDateArr: [],
      total: 0,
      formVisible: false,
      filterText: '',
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "计划单号",
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'deliverDate',
          label: '计划日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'planQuantity',
          label: "计划数量",
          type: 'input'
        },
        {
          prop: 'relaxQuantity',
          label: "宽放计划数量",
          type: 'input'
        },
        {
          prop: 'finalPlanQuantity',
          label: "最终计划数量",
          type: 'input'
        },
        // {
        //   prop: 'sealingCoverTyping',
        //   label: "打字内容",
        //   type: 'select',
        //   options: [],
        // },
        // {
        //   prop: 'accuracyLevel',
        //   label: "精度等级",
        //   type: 'select',
        //   options: [],
        // },
        // {
        //   prop: 'vibrationLevel',
        //   label: "振动等级",
        //   type: 'select',
        //   options: [],
        // },
        // {
        //   prop: 'oil',
        //   label: "油脂",
        //   type: 'select',
        //   options: [],
        // },
        // {
        //   prop: 'oilQuantity',
        //   label: "油脂量",
        //   type: 'select',
        //   options: [],
        // },
        // {
        //   prop: 'clearance',
        //   label: "游隙",
        //   type: 'select',
        //   options: [],
        // },
        // {
        //   prop: 'packagingMethod',
        //   label: "包装方式",
        //   type: 'select',
        //   options: [],
        // },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        {
          prop: 'planState',
          label: "计划状态",
          type: 'select',
          options: [{ label: "未完成", value: "not_finish" }, { label: "已完成", value: "finish" },]
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'createByName',
          label: "创建人",
          type: 'input'
        },




      ],
      selectList: [],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },


  created() {
    this.initData()
    // this.getProductClassFun()
  },
  methods: {
    getProductClassFun() {
      let obj0 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa008",
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

      getbimProductAttributesList(obj0).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'standardValue');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj1 = {
        pageNum: -1,
        pageSize: 20,
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




    },







    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },






    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus' || prop == 'productDrawingNo') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },


    dataFormSubmit() {
      this.orderForm.pageNum = 1
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })



      this.initData()

    },


    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.orderFormVisible = false
      this.CreateFormVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      getPlanList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },


    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.deliveryDateArr = []
      this.orderForm = {
        classAttribute: "semi_finished",
        productName: "",
        productDrawingNo: "",
        planNo: "",
        planState: "not_finished",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

        superQuery: {},
      }

      this.search()
    },



     
    addOrUpdateHandle(data, btnType) {
        // 订单创建计划
        detailPlanList(data.id).then(res => {
          console.log("订单计划详情", res);
          this.orderFormVisible = true
          this.$nextTick(() => {
            this.$refs.orderForm.init(data.id, btnType, res.data, data.planType)
          })
        })
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletePlanList(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(data, btnType) {
      console.log(data, btnType);
      // 订单创建计划
      detailPlanList(data.id).then(res => {
        console.log("订单计划详情", res);
        this.orderFormVisible = true
        this.$nextTick(() => {
          this.$refs.orderForm.init(data.id, btnType, res.data, data.planType)
        })
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
      const targetListQuery = this.orderForm
      let _data = {
        ...targetListQuery,
        exportType: '1014',
        exportName: '计划管理',
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
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}



.JNPF-common-search-box { 
  padding: 8px 0 !important;
  margin-left: 0!important;
  margin-bottom: 5px;
}

.JNPF-common-head {
  padding: 8px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #f5f5f5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

.aaa ::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}
</style>