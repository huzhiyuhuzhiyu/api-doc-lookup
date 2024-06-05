<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.planNo" placeholder="请输入计划单号" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.originNo" placeholder="请输入来源单号" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.workOrderNo" placeholder="请输入工作令号" />
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                  icon="icon-ym icon-ym-report-icon-search-setting" @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus"
                    @click="addOrderPlan('', 'add', 'order_Plan')">订单生成计划</el-button>
                  <el-button size="mini" type="primary" icon="el-icon-plus"
                    @click="addPlan('', 'add', 'add_plan')">新建计划</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange"
                custom-column>
                <el-table-column prop="planNo" label="计划单号" min-width="180" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary"
                      @click.native="handleUserRelation(scope.row.id, 'look', scope.row.planType)">{{
                        scope.row.planNo
                      }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="originNo" label="来源单号" width="180" sortable="custom" />
                <el-table-column prop="workOrderNo" label="工作令号" width="120" sortable="custom">

                </el-table-column>
                <el-table-column prop="planType" label="计划类型" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.planType == 'order_plan'"> 订单计划</div>
                    <div v-if="scope.row.planType == 'add_plan'">新建计划</div>
                  </template>
                </el-table-column>
                <el-table-column prop="calcState" label="运算状态" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.calcState == 'not_calculated'"><el-tag type="warning">未运算</el-tag> </div>
                    <div v-if="scope.row.calcState == 'calculated'"><el-tag type="success">已运算</el-tag></div>
                  </template>
                </el-table-column>

                <el-table-column prop="partnerCode" label="客户编码" width="180" sortable="custom" />
                <el-table-column prop="partnerName" label="客户名称" width="180" sortable="custom" />
                <el-table-column prop="totalOrderNum" label="订单数量" min-width="120" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                <el-table-column prop="updateTime" label="修改时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="updateByName" label="修改人" width="120"></el-table-column>
                <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" fixed="right">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                    <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="updateHandle(scope.row.id, 'edit', scope.row.planType)"
                      :editDisabled="scope.row.documentStatus == 'submit' ? true : false"
                      :delDisabled="scope.row.documentStatus == 'submit' ? true : false" @del="handleDel(scope.row.id)">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look', scope.row.planType)">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.planNo" placeholder="请输入计划单号" @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.originNo" placeholder="请输入来源单号" @keyup.enter.native="search()" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.workOrderNo" placeholder="请输入工作令号" @keyup.enter.native="search()" />
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
                <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
                  @click="visible = true">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus"
                    @click="addOrderPlan('', 'add', 'order_Plan')">订单生成计划</el-button>
                  <el-button size="mini" type="primary" icon="el-icon-plus"
                    @click="addPlan('', 'add', 'add_plan')">新建计划</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true" border
                @sort-change="sortChange" :partentOrChild="'child'" custom-column>
                <el-table-column prop="planNo" label="计划单号" min-width="180" sortable="custom" >
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.planId, 'look')">
                      {{ scope.row.planNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="originNo" label="来源单号" min-width="220" sortable="custom"></el-table-column>
                <el-table-column prop="workOrderNo" label="工作令号" min-width="140" sortable="custom" />
                <el-table-column prop="planType" label="计划类型" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.planType == 'order_plan'"> 订单计划</div>
                    <div v-if="scope.row.planType == 'add_plan'">新建计划</div>
                  </template>
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="140"  sortable="custom" />
                <el-table-column prop="productName" label="产品名称" min-width="140"  sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="240" sortable="custom"  />
                
                
                <!-- <el-table-column prop="bomCode" label="BOM编码" min-width="140" />
                <el-table-column prop="bomName" label="BOM名称" min-width="140" /> -->
                <!-- <el-table-column prop="routingCode" label="工艺路线编码" min-width="140" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="140" /> -->
                <el-table-column prop="planQuantity" label="计划数量" min-width="140" />
                <el-table-column prop="relaxQuantity" label="宽放数量" min-width="140" />
                <el-table-column prop="finalPlanQuantity" label="最终计划数量" min-width="140" />
                <el-table-column prop="mainUnit" label="单位" min-width="140" />
                <el-table-column prop="deliveryDate" label="交货日期" min-width="140" sortable="custom" />
                <el-table-column prop="remark" min-width="140" label="备注" />
                <el-table-column prop="partnerCode" label="客户编码" width="180" sortable="custom" />
                <el-table-column prop="partnerName" label="客户名称" width="180" sortable="custom" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"  />
                <el-table-column prop="createByName" label="创建人" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="updateHandle(scope.row.planId, 'edit', scope.row.planType)"
                      :editDisabled="scope.row.documentStatus == 'submit' ? true : false"
                      :delDisabled="scope.row.documentStatus == 'submit' ? true : false" @del="handleDel(scope.row.planId)">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="handleUserRelation(scope.row.planId, 'look', scope.row.planType)">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>
                  </template>
                </el-table-column>
              </JNPF-table>

              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20" v-if="activeName === 'dataTable'">

        <el-form ref="diaForm" :model="dataForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="计划单号">
              <el-input v-model="dataForm.planNo" placeholder="请输入计划单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="dataForm.originNo" placeholder="请输入来源单号" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="工作令号">
              <el-input v-model="dataForm.workOrderNo" placeholder="请输入工作令号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="dataForm.partnerCode" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="dataForm.partnerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划类型">
              <el-select v-model="dataForm.planType" placeholder="请选择计划类型" clearable>
                <el-option v-for="(item, index) in planTypeList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="运算状态">
              <el-select v-model="dataForm.calcState" placeholder="请选择运算状态" clearable>
                <el-option v-for="(item, index) in calcStateList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="dataForm.documentStatus" placeholder="请选择单据状态" clearable>
                <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>


        </el-form>
      </el-row>
      <el-row :gutter="20" v-else>

        <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="计划单号">
              <el-input v-model="linesQuery.planNo" placeholder="请输入计划单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="linesQuery.originNo" placeholder="请输入来源单号" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="工作令号">
              <el-input v-model="linesQuery.workOrderNo" placeholder="请输入工作令号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户编码">
              <el-input v-model="linesQuery.partnerCode" placeholder="请输入客户编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="linesQuery.partnerName" placeholder="请输入客户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交货日期">
              <el-date-picker v-model="linesQuery.deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" clearable start-placeholder="请选择交货开始日期" end-placeholder="请选择交货结束日期" >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" clearable >
              </el-date-picker>
            </el-form-item>
          </el-col>


        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">
          搜索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPlanList, deletePlanList, getPlanLineList } from '@/api/calculationList/calculationList'
import Form from './Form'
export default {
  name: 'carrierProfile',
  components: { Form, },
  data() {
    return {
      linesTotal: 0,
      activeName: 'dataTable',
      linesTableData: [],
      title: "更多查询",
      planTypeList: [
        { label: "订单计划", value: "order_plan" },
        { label: "新建计划", value: "add_plan" },
      ],
      calcStateList: [
        { label: "未运算", value: "not_calculated" },
        { label: "已运算", value: "calculated" },
      ],
      calcStateList: [
        { label: "未运算", value: "not_calculated" },
        { label: "已运算", value: "calculated" },
      ],
      documentStatusList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

      visible: false,
      tableData: [],
      listLoading: false,
      dataForm: {

      },
      initListQuery: {
        planType: "",
        calcState: "",
        documentStatus: "",
        planNo: "",
        originNo: "",
        workOrderNo: "",
        pageNum: 1,
        pageSize: 20,
        partnerCode:"",
        partnerName:"",
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
      filterText: '',


      linesQuery: {},
      initLinesQuery: {
        planNo: "",
        originNo: "",
        workOrderNo: "",
        productName: "",
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        deliveryEd: "",
        deliverySd: "",
        partnerCode:"",
        partnerName:"",
        endTime: "",
        startTime: "",
        deliveryDateArr: [],
        createTimeArr: [],

        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.dataForm = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  methods: {
    // 点击切换明细
    handleClick(e) {
      console.log(e);
      this.activeName = e.name
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    // 订单生成计划
    addOrderPlan(id, btntype, type) {
      
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype, type)
      })
    },
    // 新建计划
    addPlan(id, btntype, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype, type)
      })
    },
    sortChange({ prop, order }) {
      let newProp;
      if (  prop === 'createByName' ||prop==="productCode"||prop==="productName"||prop==="productDrawingNo"||prop==="partnerCode"||prop==="partnerName") {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          
      }
      if (this.activeName == "dataTable") {
        this.dataForm.orderItems[0].asc = order !== "descending"
        this.dataForm.orderItems[0].column = order === null ? "" : newProp
        
      } else {
        this.linesQuery.orderItems[0].asc = order !== 'descending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()


    },
  
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        getPlanList(this.dataForm).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        if (this.linesQuery.deliveryDateArr && this.linesQuery.deliveryDateArr.length > 0) {
          this.linesQuery.deliverySd = this.linesQuery.deliveryDateArr[0]
          this.linesQuery.deliveryEd = this.linesQuery.deliveryDateArr[1]
        } else {
          this.linesQuery.deliverySd = ''
          this.linesQuery.deliveryEd = ''
        }
        if (this.linesQuery.createTimeArr && this.linesQuery.createTimeArr.length > 0) {
          this.linesQuery.startTime = this.linesQuery.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.linesQuery.endTime = this.linesQuery.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.linesQuery.startTime = ''
          this.linesQuery.endTime = ''
        }
        getPlanLineList(this.linesQuery).then(res => {
          console.log("res++", res);
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },

    search() {
      if (this.activeName === 'dataTable') {
        Object.keys(this.dataForm).forEach(key => {
          let item = this.dataForm[key]
          this.dataForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.dataForm.pageNum = 1
      } else {
        Object.keys(this.linesQuery).forEach(key => {
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1
      }
      this.initData()
    },
    reset() {
      if (this.activeName === 'dataTable') {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.dataForm = JSON.parse(JSON.stringify(this.initListQuery))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()

        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
        this.linesQuery.createTimeArr = []
        this.linesQuery.deliveryDate = []
      }


      this.search()
    },

    addSupplier(id, btntype, type) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype, type)
      })
    },
    updateHandle(id, btntype, type) {
      this.formVisible = true
      if (id) {
        console.log(4444444,);
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype, type)
        })
        // }, 600);
      }


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
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },

  }
}
</script>
<style  scoped>
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

.JNPF-common-head {
  padding: 10px;
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
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
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

