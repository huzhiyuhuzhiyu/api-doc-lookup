<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="4">
            <el-form-item>
              <!-- <el-input v-model.trim="listQuery.source" placeholder="请输入来源" clearable @keyup.enter.native="search()" /> -->
              <el-select v-model="listQuery.source" placeholder="请选择来源" clearable style="width: 100%;" :disabled="false">
                <el-option v-for="(item, index) in sourceList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.sourceOrderNo" placeholder="请输入来源单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>


          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成外协订单</el-button>
          <div class="JNPF-common-head-right">
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>

        <JNPF-table v-loading="listLoading" @selection-change="handeleProductInfoData" hasC highlight-current-row
          :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
          :checkSelectable="disOutData">


          <el-table-column prop="source" label="来源" min-width="120" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="getPoolSourceList(scope.row.id,)"
                v-if="scope.row.source == 'procure'">采购</el-link>
              <el-link type="primary" @click.native="getPoolSourceList(scope.row.id,)"
                v-if="scope.row.source == 'mrp'">MRP下发</el-link>
              <el-link type="primary" @click.native="getPoolSourceList(scope.row.id,)"
                v-if="scope.row.source == 'external_process'">外协工序</el-link>
                

            </template>
          </el-table-column>
          <!-- <el-table-column prop="sourceOrderNo" label="来源单号" min-width="180" sortable="custom" /> -->
          <el-table-column prop="productCode" label="产品编码" min-width="180" sortable="custom" />
          <el-table-column prop="productName" label="产品名称" min-width="180" sortable="custom" />
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="180" sortable="custom" />
          <!-- <el-table-column prop="routingCode" label="工艺路线编码" min-width="180" />
          <el-table-column prop="routingName" label="工艺路线名称" min-width="180" /> -->
          <!-- <el-table-column prop="processCode" label="工序编码" min-width="180" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" min-width="180" sortable="custom" /> -->

          <el-table-column prop="planDemandQuantity" label="计划需求数" min-width="180" />
          <el-table-column prop="orderedQuantity" label="已下单数量" min-width="180" />
          <el-table-column prop="completedQuantity" label="已完成数量" min-width="180" />
          <el-table-column prop="mainUnit" label="单位" min-width="180" />
          <el-table-column prop="deliveryDate" label="交货日期" min-width="180" sortable="custom" />

          <el-table-column prop="createTime" label="创建需求日期" min-width="180" sortable="custom" />
          <el-table-column prop="demandStatus" label="需求状态" width="120" align="center" sortable="custom" fixed="right">
            <template slot-scope="scope">
              <div v-if="scope.row.demandStatus == 'not_finish'"><el-tag type="warning">未完成</el-tag> </div>
              <div v-if="scope.row.demandStatus == 'finishing'"><el-tag>完成中</el-tag></div>
              <div v-if="scope.row.demandStatus == 'finished'"><el-tag type="success">已完成</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="90" fixed="right">
            <template slot-scope="scope">
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="lookOrder(scope.row.id)">
                    查看发料清单
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
    <JNPF-Form v-if="formVisible" ref="JNPFForm" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">

          <el-col :span="12">
            <el-form-item label="来源">
              <el-select v-model="listQuery.source" placeholder="请选择来源" clearable style="width: 100%;" :disabled="false">
                <el-option v-for="(item, index) in sourceList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model.trim="listQuery.sourceOrderNo" placeholder="请输入来源单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model.trim="listQuery.productCode" placeholder="请输入产品编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model.trim="listQuery.productName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model.trim="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="工序编码">
              <el-input v-model.trim="listQuery.processCode" placeholder="请输入工序编码" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model.trim="listQuery.processName" placeholder="请输入工序名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col> -->

          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="deliveryDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需求状态">
              <el-select v-model="listQuery.demandStatus" placeholder="需求状态" clearable style="width: 100%;">
                <el-option v-for="(item, index) in demandStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建需求时间">
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          {{ $t('common.search') }}
        </el-button>
      </span>
    </el-dialog>
    <!-- 订单来源明细 -->
    <el-dialog title="订单来源明细" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="sourceDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20" style="margin :10px 0">
        <el-table ref="workerDialog" v-loading="listLoading" :data="sourceList" border height="400">
          <el-table-column prop="ordersNo" label="销售单号"> </el-table-column>
          <el-table-column prop="planOrderNo" label="计划单号" />
          <el-table-column prop="createTime" label="来源时间"></el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
    <DepForm v-if="depformVisible" ref="DepForm"></DepForm>

  </div>
</template>
  
<script>
import { purexternalDemandPoolList, getPoolSourceList } from '@/api/purchasingManagement/purchaseInquirySheet'
import JNPFForm from './Form'
import DepForm from './depForm'
import moment from 'moment'
export default {
  name: 'fixedPointPricing',
  components: { JNPFForm, DepForm },
  data() {
    return {
      sourceDialog: false,
      sourceList: [],
      depformVisible: false,
      title: "更多查询",
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
          column: "create_time"
        }],
        demandStatus: 'not_finish',
        createByName: "",
        createEndTime: "",
        createRequirementDate: "",      //创建日期
        createStartTime: "",
        deliveryDate: "",               //交期
        deliveryEndTime: "",
        deliveryStartTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 20,
        poolType: "external",           //外协池类型  采购 procure、外协 external,可用值:external,procure
        processCode: "",                //工序编码
        processName: "",                //工序名称
        productCode: "",                //产品编码
        productName: "",                //产品名称
        productDrawingNo:"",            //产品图号
        source: "",                     //来源
        sourceOrderNo: "",              //来源单号
        startTime: "",                  //创建开始时间
      },
      demandStatusList: [
        {
          label: '未完成',
          value: 'not_finish'
        },
        // {
        //   label: '完成中',
        //   value: 'finishing'
        // },
        {
          label: '已完成',
          value: 'finished'
        },
      ],
      sourceList: [
        // {
        //   label: '采购',
        //   value: 'procure'
        // },
        {
          label: 'MRP下发',
          value: 'mrp'
        },
        {
          label: '外协工序',
          value: 'external_process'
        },
      ],
      createRequirementDate: [],         // 创建需求日期区间
      deliveryDate: [],                  // 交货日期区间

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick(picker) {
            const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      total: 0,
      formVisible: false,
      selectData: [],
    }
  },
  created() {
    this.initData()
  },
  methods: {
    getPoolSourceList(id) {
      let obj = {
        "createByName": "",
        "endTime": "",
        "endUpdateTime": "",
        "keyword": "",
        "orderItems": [
          {
            "asc": true,
            "column": ""
          }
        ],
        "procurementDemandPoolId": id,
        "startTime": "",
        "startUpdateTime": ""
      }
      getPoolSourceList(obj).then(res => {
        console.log("订单来源明细", res);
        if (res.data.records.length) {
          this.sourceList = res.data.records
          this.sourceDialog = true
        } else {
          this.$message.error("暂无来源明细")
        }
      })
    },
    disOutData(row) {
      return !row.disabled
    },
    lookOrder(id) {
      // console.log(data);
      this.depformVisible = true
      // console.log(this.$refs['DepForm']);
      this.$nextTick(() => {
        this.$refs.DepForm.initData(id)
      })
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      console.log(val);
      this.selectData = val
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
      if (newProp === 'process_name') {
        newProp = 'processName'
      }
      if (newProp === 'process_code') {
        newProp = 'processCode'
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
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
        this.listQuery.createStartTime = this.createRequirementDate[0] + " 00:00:00"
        this.listQuery.createEndTime = this.createRequirementDate[1] + " 23:59:59"
      } else {
        this.listQuery.createStartTime = ''
        this.listQuery.createEndTime = ''
      }
      if (this.deliveryDate && this.deliveryDate.length > 0) {
        this.listQuery.deliveryStartTime = this.deliveryDate[0] + " 00:00:00"
        this.listQuery.deliveryEndTime = this.deliveryDate[1] + " 23:59:59"
      } else {
        this.listQuery.deliveryStartTime = ''
        this.listQuery.deliveryEndTime = ''
      }
      purexternalDemandPoolList(this.listQuery).then(res => {
        console.log(res, '外协需求池列表');
        this.tableDataList = res.data.records
        res.data.records.forEach(item => {
          if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
            item.disabled = true
          } else {
            item.disabled = false

          }
        });
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.createRequirementDate = []
      this.deliveryDate = []
      this.listQuery = {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createByName: "",
        createEndTime: "",
        createRequirementDate: "",      //创建日期
        createStartTime: "",
        deliveryDate: "",               //交期
        deliveryEndTime: "",
        deliveryStartTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 20,
        poolType: "external",           //外协池类型  采购 procure、外协 external,可用值:external,procure
        processCode: "",                //工序编码
        processName: "",                //工序名称
        productCode: "",                //产品编码
        productName: "",                //产品名称
        productDrawingNo:"",            //产品图号
        source: "",                     //来源
        sourceOrderNo: "",              //来源单号
        startTime: "",
        demandStatus: 'not_finish',
      },
        this.search()
    },
    // 生成外协订单
    addOrUpdateHandle() {
      if (this.selectData.length === 0) {
        this.$message({
          message: "请选择你要生成的外协订单",
          type: "error",
          duration: 1500,
        })
      } else {
        // console.log(this.$refs);
        let msg = true
        let tempList = JSON.parse(JSON.stringify(this.selectData))
        let hasItemList = []
        for (let i = 0; i < this.selectData.length; i++) {
          let item = this.selectData[i];
          if (item.demandStatus === 'finishing') {

            if (item.orderedQuantity != null) {
              if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
                hasItemList.push(item.productName)
                if (hasItemList.length) {
                  this.$message.error(`已下单数量已大于或等于计划需求数的产品：${hasItemList.join('、')}`)
                  msg = false
                } else {
                  msg = true
                }
              }
            }
          }



          // const hasFlag = this.selectData.find(i => item.orderedQuantity > i.planDemandQuantity)
          // if (hasFlag) { hasItemList.push(item.productName) }
          // else { tempList.push(item) }
          // if (hasItemList.length) {
          //   this.$message.error(`已下单数量已大于计划需求数的产品：${hasItemList.join('、')}`)
          //   msg = false
          // }
        }
        if (msg) {
          this.selectData.forEach((item, index) => {
            item.purchaseQuantity = item.planDemandQuantity - item.orderedQuantity * 1
            // item.purchaseQuantity2 = this.jnpf.numberFormat(item.planDemandQuantity * item.ratio) 
            if (item.calculationDirection === 'multiplication') {

              this.$set(this.selectData[index], 'purchaseQuantity2', this.jnpf.numberFormat(item.purchaseQuantity * item.ratio))
            } else {
              this.$set(this.selectData[index], 'purchaseQuantity2', this.jnpf.numberFormat(item.purchaseQuantity / item.ratio))
            }
          })
          var maxDate = null; // 最大日期初始值设为null
          // 遍历列表中的数据 找到最大交期
          for (var i = 0; i < this.selectData.length; i++) {
            var currentDate = new Date(this.selectData[i].deliveryDate);
            if (maxDate === null || currentDate > maxDate) {
              maxDate = currentDate;
              console.log(maxDate);
            }
          }
          let demandDelivery = null
          demandDelivery = maxDate.toISOString().split('T')[0];
          console.log(demandDelivery);
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.JNPFForm.init(this.selectData, demandDelivery)
          })
        }
      }

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
  