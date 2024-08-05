<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productDrawingNo" placeholder="请输入品名规格" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="listQuery.productName" placeholder="请输入产品名称" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-date-picker v-model="deliveryDateArr" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                style="width: 100%" start-placeholder="交货开始日期" end-placeholder="交货结束日期" clearable></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button> -->
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <!-- <topOpts @add="addSupplier('', 'add')"></topOpts> -->
          <div>
            <el-button size="mini" type="primary" @click="addOrUpdateHandle()">生成采购订单</el-button>
            <!-- <el-button size="mini" type="primary" @click="batchQuiry()">批量询价</el-button>
            <el-button size="mini" type="primary" @click="batchFixed()">批量定价</el-button> -->
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

        <JNPF-table v-loading="listLoading" @selection-change="handeleProductInfoData" hasC highlight-current-row
          :fixedNO="true" ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
          :checkSelectable="checkSelectable">


          <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" />
          <el-table-column prop="productName" label="产品名称" min-width="140" sortable="custom" />
          <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
          <!-- <el-table-column prop="spec" label="规格型号" min-width="180" sortable="custom" /> -->

          <el-table-column prop="immediatelyBuyFlag" label="立即采购" min-width="90">
            <template slot-scope="scope">
              <div style="color:red;" v-if="scope.row.immediatelyBuyFlag">是</div>
              <div v-else>否</div>
            </template>
          </el-table-column>
          <el-table-column prop="mainUnit" label="单位" min-width="80" />
          <el-table-column prop="planDemandQuantity" label="计划需求数" min-width="120" />
          <!-- <el-table-column prop="hasPrice" label="有无价格" width="90">
            <template slot-scope="scope">
              <div v-if="scope.row.hasPrice">有</div>
              <div v-else>无</div>
            </template>
          </el-table-column> -->
          <el-table-column prop="orderedQuantity" label="已下单数量" min-width="120" />
          <!-- <el-table-column prop="completedQuantity" label="已完成数量" min-width="120" /> -->

          <el-table-column prop="deliveryDate" label="交货日期" min-width="160" sortable="custom" />
          <el-table-column prop="source" label="来源" min-width="140" sortable="custom">
            <template slot-scope="scope">
              <!-- <div v-if="scope.row.source == 'procure'">请购单</div>
              <div v-if="scope.row.source == 'mrp'">MRP下发</div>
              <div v-if="scope.row.source == 'order_distribute'">订单分配</div> -->
              <el-link type="primary" @click.native="getPoolSourceList(scope.row.id)"
                v-if="scope.row.source == 'procure'">
                请购单
              </el-link>
              <el-link type="primary" @click.native="getPoolSourceList(scope.row.id)" v-if="scope.row.source == 'mrp'">
                MRP下发
              </el-link>
              <el-link type="primary" @click.native="getPoolSourceList(scope.row.id)"
                v-if="scope.row.source == 'order_distribute'">
                订单分配
              </el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="sourceOrderNo" label="来源单号" min-width="180" sortable="custom" /> -->
          <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="180" sortable="custom" />
          <!-- <el-table-column prop="demandStatus" label="需求状态" width="120" align="center" sortable="custom" fixed="right">
            <template slot-scope="scope">
              <div v-if="scope.row.demandStatus == 'not_finish'"><el-tag type="warning">未完成</el-tag></div>
              <div v-if="scope.row.demandStatus == 'finishing'"><el-tag>完成中</el-tag></div>
              <div v-if="scope.row.demandStatus == 'finished'"><el-tag type="success">已完成</el-tag></div>
            </template>
          </el-table-column> -->

          <!-- <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" :disabled="type === 'look'" @click="addOrUpdateHandle(scope.row.id, 'edit')">生成采购订单</el-button>
              <el-dropdown hide-on-click>
                <span class="el-dropdown-link">
                  <el-button type="text" size="mini">
                    {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, 'look')">
                    查看详情
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column> -->
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
          :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <JNPF-Form v-if="formVisible" ref="procureForm" @refresh="refresh" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="来源">
              <el-select v-model="listQuery.source" placeholder="请选择来源" clearable style="width: 100%;">
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
            <el-form-item label="品名规格">
              <el-input v-model.trim="listQuery.productDrawingNo" placeholder="请输入品名规格" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="deliveryDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期"></el-date-picker>
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
            <el-form-item label="有无价格">
              <el-select v-model="listQuery.hasPrice" placeholder="请选择有无价格" clearable style="width: 100%;">
                <el-option v-for="(item, index) in [{ label: '有价格', value: true }, { label: '无价格', value: false }]"
                  :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="立即采购">
              <el-select v-model="listQuery.immediatelyBuyFlag" placeholder="请选择是否立即采购" clearable style="width: 100%;">
                <el-option v-for="(item, index) in [{ label: '是', value: true }, { label: '否', value: false }]"
                  :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="createRequirementDate" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable :picker-options="global.timePickerOptions"></el-date-picker>
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
        <el-table ref="workerDialog" v-loading="listLoading" :data="sourceListData" border height="400">
          <el-table-column prop="ordersNo" label="销售单号"></el-table-column>
          <el-table-column prop="planOrderNo" label="计划单号" />
          <el-table-column prop="createTime" label="来源时间"></el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
    <QuiryForm v-if="quiryVisible" ref="QuiryForm" @closePool="closePool" />
    <fixedForm v-if="fixedVisible" ref="fixedForm" @closePool="closePoolfix" />
  </div>
</template>

<script>
import { purProcurementDemandPoolList, getPoolSourceList } from '@/api/purchasingManagement/purchaseInquirySheet'
import JNPFForm from './Form'
import moment from 'moment'
import QuiryForm from '@/views/purchasingManagement/priceAdjustmentInquiry/purchaseInquirySheet/Form.vue'
import fixedForm from '@/views/purchasingManagement/priceAdjustmentInquiry/fixedPointPricing/Form.vue'
export default {
  name: 'fixedPointPricing',
  components: { JNPFForm, QuiryForm, fixedForm },
  data() {
    return {
      columnList: [
        'productCode',
        'source',
        'createByName',
      ],
      deliveryDateArr: [],
      sourceDialog: false,
      sourceList: [],
      title: '更多查询',
      background: true, //分页器背景颜色
      visible: false,
      quiryVisible: false,
      fixedVisible: false,
      tableDataList: [],
      formVisible: false,
      listLoading: false,
      sourceListData: [],
      listQuery: {
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        // orderDistribute:'order_distribute',
        createByName: '',
        createEndTime: '',
        createRequirementDate: '', //创建日期
        createStartTime: '',
        deliveryDate: '', //交期
        deliveryEndTime: '',
        deliveryStartTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        demandStatus: 'not_finish', //需求状态 需求状态 未完成 not_finish、完成中 finishing、已完成 finished,可用值:finished,finishing,not_finish
        poolType: 'procure', //采购池类型  采购 procure、外协 external,可用值:external,procure
        productCode: '', //产品编码
        productName: '', //产品名称
        productDrawingNo: '', //品名规格
        source: '', //来源    需求来源 请购单 procure、MRP下发 mrp、外协工序 external_process,可用值:external_process,mrp,procure
        sourceOrderNo: '', //来源单号
        startTime: '', //创建开始时间
        hasPrice: ''
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
        }
      ],
      sourceList: [
        {
          label: '请购单',
          value: 'procure'
        },
        {
          label: 'MRP下发',
          value: 'mrp'
        },
        {
          label: '订单分配',
          value: 'order_distribute'
        }
      ],
      // demandStatusList:[
      //   {label:'未完成',value:'not_finish'}
      // ],
      createRequirementDate: [], // 创建需求日期区间
      deliveryDate: [], // 交货日期区间
      selectData: [], // 选中的数据 带到form页
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上个月',
            onClick(picker) {
              const end = new Date(moment(new Date().getTime()).format('YYYY-MM-01 00:00:00'))
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      total: 0,
      formVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    getPoolSourceList(id) {
      let obj = {
        createByName: '',
        endTime: '',
        endUpdateTime: '',
        keyword: '',
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        procurementDemandPoolId: id,
        startTime: '',
        startUpdateTime: ''
      }
      getPoolSourceList(obj).then((res) => {
        if (res.data.records.length) {
          this.sourceListData = res.data.records
          this.sourceDialog = true
        } else {
          this.$message.error('暂无来源明细')
        }
      })
    },
    checkSelectable(row) {
      return !row.disabled
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      this.selectData = val
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      if (newProp === 'product_code') {
        newProp = 'productCode'
      }
      if (newProp === 'product_name') {
        newProp = 'productName'
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
        this.listQuery.createStartTime = this.createRequirementDate[0] + ' 00:00:00'
        this.listQuery.createEndTime = this.createRequirementDate[1] + ' 23:59:59'
      } else {
        this.listQuery.createStartTime = ''
        this.listQuery.createEndTime = ''
      }
      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.listQuery.deliveryStartTime = this.deliveryDateArr[0] + ' 00:00:00'
        this.listQuery.deliveryEndTime = this.deliveryDateArr[1] + ' 23:59:59'
      } else {
        this.listQuery.deliveryStartTime = ''
        this.listQuery.deliveryEndTime = ''
      }
      purProcurementDemandPoolList(this.listQuery)
        .then((res) => {
          this.tableDataList = res.data.records
          // res.data.records.forEach(item => {
          //   if (item.planDemandQuantity * 1 <= item.orderedQuantity * 1) {
          //     item.disabled = true
          //   } else {
          //     item.disabled = false

          //   }
          // });
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      Object.keys(this.listQuery).forEach((key) => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.deliveryDateArr = []
      this.listQuery = {
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        createByName: '',
        createEndTime: '',
        createRequirementDate: '', //创建日期
        createStartTime: '',
        deliveryDate: '', //交期
        deliveryEndTime: '',
        deliveryStartTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        demandStatus: 'not_finish', //需求状态 需求状态 未完成 not_finish、完成中 finishing、已完成 finished,可用值:finished,finishing,not_finish
        poolType: 'procure', //采购池类型  采购 procure、外协 external,可用值:external,procure
        productCode: '', //产品编码
        productName: '', //产品名称
        productDrawingNo: '', //品名规格
        source: '', //来源    需求来源 请购单 procure、MRP下发 mrp、外协工序 external_process,可用值:external_process,mrp,procure
        sourceOrderNo: '', //来源单号
        startTime: ''
      }
      this.createRequirementDate = []
      this.deliveryDate = []
      this.search()
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
          message: '请选择你要生成的采购订单',
          type: 'error',
          duration: 1500
        })
      } else {
        let msg = true
        let tempList = JSON.parse(JSON.stringify(this.selectData))
        let hasItemList = []
        for (let i = 0; i < this.selectData.length; i++) {
          let item = this.selectData[i]

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
        if (msg) {
          this.selectData.forEach((item, index) => {
            item.purchaseQuantity = item.planDemandQuantity - item.orderedQuantity * 1
            if (item.calculationDirection === 'multiplication') {
              this.$set(
                this.selectData[index],
                'purchaseQuantity2',
                this.jnpf.numberFormat(item.purchaseQuantity * item.ratio)
              )
            } else {
              this.$set(
                this.selectData[index],
                'purchaseQuantity2',
                this.jnpf.numberFormat(item.purchaseQuantity / item.ratio)
              )
            }
          })
          var maxDate = null // 最大日期初始值设为null
          // 遍历列表中的数据 找到最大交期
          for (var i = 0; i < this.selectData.length; i++) {
            var currentDate = new Date(this.selectData[i].deliveryDate)
            if (maxDate === null || currentDate > maxDate) {
              maxDate = currentDate
            }
          }
          let demandDelivery = null
          demandDelivery = maxDate.toISOString().split('T')[0]
          this.formVisible = true
          this.$nextTick(() => {
            this.$refs.procureForm.init(this.selectData, demandDelivery)
          })
        }
      }
    },
    // 批量询价
    batchQuiry() {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择你要询价的产品',
          type: 'error',
          duration: 1500
        })
      } else {
        // let quirtFlag = this.selectData.every(item => item.hasPrice == false)
        let quirtFlag = true
        if (quirtFlag) {
          this.quiryVisible = true
          let quiryData = []
          this.selectData.forEach((item, index) => {
            quiryData.push({
              productSource: item.productSource, // 产品来源 采购
              productsId: item.productsId, // 产品id
              productsName: item.productName, // 产品名称
              productCode: item.productCode, // 产品编码
              taxRate: 13, // 产品税率
              materialPrice: '', // 产品价格
              productsDrawingNo: item.productDrawingNo
            })
          })
          quiryData = Object.values(
            quiryData.reduce((acc, item) => {
              // 如果累加器中已经有了该productsId的条目，则累加planDemandQuantity
              if (acc[item.productsId]) {
                // acc[item.productsId].planDemandQuantity = String(Number(acc[item.productsId].planDemandQuantity) + Number(item.planDemandQuantity));
              } else {
                // 否则，把当前条目以productsId为键存入累加器
                acc[item.productsId] = { ...item }
              }
              return acc
            }, {})
          )
          this.$nextTick(() => {
            this.$refs.QuiryForm.init('', 'add', 'quiryPool', quiryData)
          })
        } else {
          this.$message({
            message: '请选择无价格的产品',
            type: 'error',
            duration: 1500
          })
        }
      }
    },
    // 关闭询价单页面
    closePool(isRefresh) {
      this.quiryVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    // 关闭定价单页面
    closePoolfix(isRefresh) {
      this.fixedVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    // 批量定价
    batchFixed() {
      if (this.selectData.length === 0) {
        this.$message({
          message: '请选择你要定价的产品',
          type: 'error',
          duration: 1500
        })
      } else {
        // let quirtFlag = this.selectData.every(item => item.hasPrice == false)
        let quirtFlag = true
        if (quirtFlag) {
          this.fixedVisible = true
          let quiryData = []
          this.selectData.forEach((item, index) => {
            quiryData.push({
              productSource: item.productSource, // 产品来源 采购
              productsId: item.productsId, // 产品id
              productsName: item.productName, // 产品名称
              productsCode: item.productCode,
              drawingNo: item.productDrawingNo,
              taxRate: 13, // 产品税率
              materialPrice: '', // 产品价格
              bargaining: '', // 协议价
              excludingTaxPrice: 0, // 不含税价
              historicalPrice: item.historicalPrice, // 历史价格
              targetPrice: '', // 目标价格
              // contrastProductsId:'',              // 对比物料id
              contrastProducts: '', // 对比物料
              costPrice: '', // 对比价格
              effectiveTimeStart: this.jnpf.getToday(), // 有效时间起
              effectiveTimeEnd: '' // 有效时间止
            })
          })
          quiryData = Object.values(
            quiryData.reduce((acc, item) => {
              // 如果累加器中已经有了该productsId的条目，则累加planDemandQuantity
              if (acc[item.productsId]) {
                // acc[item.productsId].planDemandQuantity = String(Number(acc[item.productsId].planDemandQuantity) + Number(item.planDemandQuantity));
              } else {
                // 否则，把当前条目以productsId为键存入累加器
                acc[item.productsId] = { ...item }
              }
              return acc
            }, {})
          )
          this.$nextTick(() => {
            this.$refs.fixedForm.init('', 'add', 'fixPool', quiryData)
          })
        } else {
          this.$message({
            message: '请选择无价格的产品',
            type: 'error',
            duration: 1500
          })
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
