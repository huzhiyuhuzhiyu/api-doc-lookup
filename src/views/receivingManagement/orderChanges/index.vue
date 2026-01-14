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
                    <el-input v-model="dataForm.orderNo" @keyup.enter.native="search()" placeholder="请输入变更单号" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="dataForm.partnerName" @keyup.enter.native="search()" placeholder="请输入供应商名称" clearable />
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
                <topOpts @add="addSupplier('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" @sort-change="sortChange" custom-column fixedNO customKey="JNPFTableKey_717393">
                <el-table-column prop="orderNo" label="变更单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="purchaseOrderNo" label="采购订单号" min-width="200" sortable="custom" />
                <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="150" />
                <el-table-column prop="newCooperativePartnerName" label="新供应商名称" min-width="150" />
                <el-table-column prop="applyReason" label="申请理由" min-width="120" />

                <el-table-column prop="reasonRejection" label="驳回理由" min-width="120" />
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="创建人" width="100"></el-table-column>
                <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>

                <el-table-column prop="documentStatus" label="单据状态" width="120" fixed="right" align="center" sortable="custom">
                  <template slot-scope="scope">
                    <el-tag :type="global.getDictLabelGlobal('documentStatusList', scope.row['documentStatus'], { withType: true }).type">{{ global.getDictLabelGlobal('documentStatusList', scope.row['documentStatus']) }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" label="审批状态" sortable="custom" width="120" fixed="right" align="center" v-if="showAppCodeFlag">
                  <template slot-scope="scope">
                    <el-tag :type="global.getDictLabelGlobal('approvalStateList', scope.row['approvalStatus'], { withType: true }).type">{{ global.getDictLabelGlobal('approvalStateList', scope.row['approvalStatus']) }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus !== 'draft'" @click="updateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus !== 'draft'" @click="handleDel(scope.row.id)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="(scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn') && showAppCodeFlag" @click.native="addSupplier(scope.row.id, 'add')">
                          重新提交
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag" @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                          审批撤回
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" @keyup.enter.native="search()" placeholder="请输入变更单号" />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.purchaseOrderNo" @keyup.enter.native="search()" placeholder="请输入订单号" />
                  </el-form-item>
                </el-col> -->
                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.workOrderNo" @keyup.enter.native="search()" placeholder="请输入工作令号" />
                  </el-form-item>
                </el-col> -->
                <el-col v-if="$store.getters.configData.product.showDrawingNo" :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.productDrawingNo" @keyup.enter.native="search()" :placeholder="`请输入${$store.getters.productDrawingNo}`" />
                  </el-form-item>
                </el-col>
                <el-col v-if="$store.getters.configData.product.showSpec" :span="4" >
                  <el-form-item>
                    <el-input v-model="linesQuery.spec" :placeholder="$store.getters.spec" clearable />
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%;"
                      start-placeholder="请选择申请开始时间" end-placeholder="请选择申请结束时间" clearable
                      :picker-options="global.timePickerOptions">
                    </el-date-picker>
                  </el-form-item>
                </el-col> -->
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
                <topOpts @add="addSupplier('', 'add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible1 = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun1()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" @sort-change="sortChange" :fixedNO="true" custom-column :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="变更单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.ordersChangeId, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="ordersNo" label="采购订单号" min-width="200" sortable="custom">
                </el-table-column>
                <!-- <el-table-column prop="workOrderNo" label="工作令号" width="180" /> -->
                <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="250" />
                <!-- <el-table-column prop="customerProductDrawingNo" :label="`客户${$store.getters.productDrawingNo}`" min-width="160" sortable="custom" /> -->
                <el-table-column prop="productCode" label="产品编码" min-width="140" />
                <el-table-column prop="productName" label="产品名称" min-width="120" />
                <el-table-column v-if="$store.getters.configData.product.showDrawingNo" prop="productDrawingNo" :label="型号" min-width="250" />
                <el-table-column prop="model" :label="$store.getters.model" min-width="160" v-if="$store.getters.configData.product.enable_model"  />
                <el-table-column prop="spec" :label="$store.getters.spec" min-width="160" v-if="$store.getters.configData.product.showSpec"  />
                <el-table-column prop="drawingSheetNo" label="图纸编号" min-width="160" v-if="$store.getters.configData.orderField.drawingSheetNoFlag" />
                <el-table-column prop="num" label="原数量(主)" min-width="120" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="120" />
                <el-table-column prop="assistantNum" label="原数量(副)" min-width="120" />
                <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" />
                <el-table-column prop="price" label="原单价" min-width="120" />
                <el-table-column prop="excludingTaxAmount" label="原金额" min-width="120" />
                <el-table-column prop="deliveryDate" label="原交货日期" min-width="120" />
                <!-- <el-table-column prop="ask" label="要求" min-width="120" /> -->
                <el-table-column prop="newNum" label="新数量" min-width="120" />
                <el-table-column prop="newPrice" label="新单价" min-width="120" />
                <el-table-column prop="newExcludingTaxAmount" label="新金额" min-width="120" />
                <el-table-column prop="newDeliveryDate" label="新交货日期" min-width="120" />
                <!-- <el-table-column prop="newAsk" label="新要求" min-width="120" /> -->
                <el-table-column prop="remark" label="备注" min-width="150"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="创建人" width="100"></el-table-column>
                <el-table-column prop="documentStatus" label="单据状态" width="120" fixed="right" align="center" sortable="custom">
                  <template slot-scope="scope">
                    <el-tag :type="global.getDictLabelGlobal('documentStatusList', scope.row['documentStatus'], { withType: true }).type">{{ global.getDictLabelGlobal('documentStatusList', scope.row['documentStatus']) }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" label="审批状态" sortable="custom" width="120" fixed="right" align="center" v-if="showAppCodeFlag">
                  <template slot-scope="scope">
                    <el-tag :type="global.getDictLabelGlobal('approvalStateList', scope.row['approvalStatus'], { withType: true }).type">{{ global.getDictLabelGlobal('approvalStateList', scope.row['approvalStatus']) }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="updateHandle(scope.row.ordersChangeId, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="handleDel(scope.row.ordersChangeId)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.ordersChangeId, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryVisible1" ref="SuperQuery1" :columnOptions="superQueryJson1" @superQuery="superQuerySearch1" @close="superQueryVisible1 = false" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Form :classAttribute="classAttribute" v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>

<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import { deletePurchaseChange, getPurchaseChangeList, getPurchaseChangeLineList } from '@/api/salesManagement/orderChanges'
import Form from './Form'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
export default {
  name: 'purchaseOrderChange',
  components: { Form, SuperQuery },
  props:{
    classAttribute:{
      type: String,
      default: 'other'
    },
  },
  data() {
    return {
      showAppCodeFlag: true,
      superQueryJson1: [
      {
          prop: 'orderNo',
          label: "变更单号",
          type: 'input'
        },
        {
          prop: 'ordersNo',
          label: "订单号",
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: "供应商名称",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'productName',
          label: "产品名称",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: `${this.$store.getters.productDrawingNo}`,
          type: 'input'
        },
        {
          prop: 'num',
          label: "原数量(主)",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位(主)",
          type: 'input'
        },
        {
          prop: 'assistantNum',
          label: "原数量(副)",
          type: 'input'
        },
        {
          prop: 'deputyUnit',
          label: "单位(副)",
          type: 'input'
        },
        {
          prop: 'price',
          label: "原单价",
          type: 'input'
        },
        {
          prop: 'excludingTaxAmount',
          label: "原金额",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'deliveryDate',
          label: '原交货日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: {}
        },
        {
          prop: 'newNum',
          label: "新数量",
          type: 'input'
        },
        {
          prop: 'newPrice',
          label: "新单价",
          type: 'input'
        },
        {
          prop: 'newExcludingTaxAmount',
          label: "新金额",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'newDeliveryDate',
          label: '新交货日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: {}
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        { // 日期时间选择器（区间）
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
          label: '创建人',
          type: 'input'
        },
        { // 下拉选
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [
            { label: "草稿", value: "draft" },
            { label: "提交", value: "submit" }
          ]
        }
      ],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "变更单号",
          type: 'input'
        },
        {
          prop: 'purchaseOrderNo',
          label: "订单号",
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: "供应商名称",
          type: 'input'
        },
        {
          prop: 'applyReason',
          label: "申请理由",
          type: 'input'
        },
        {
          prop: 'reasonRejection',
          label: "驳回理由",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'approvalCompletionDate',
          label: '审批完成时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        { // 日期时间选择器（区间）
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
          label: '创建人',
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        { // 下拉选
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [
            { label: "草稿", value: "draft" },
            { label: "提交", value: "submit" }
          ]
        }
      ],
      superQueryVisible1: false,
      superQueryVisible: false,
      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},
      initLinesQuery: {
        orderNo: "",
        purchaseOrderNo: "",
        customerProductDrawingNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        pageNum: 1,
        pageSize: 20,
        deliveryEd: "",
        deliverySd: "",
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
        classAttribute:this.classAttribute
      },
      visible: false,
      activeName: "dataTable",
      tableData: [],
      listLoading: false,
      initListQuery: {
        approvalStatus: "",
        orderNo: "",
        documentStatus: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        classAttribute:this.classAttribute
      },
      dataForm: {

      },
      total: 0,
      formVisible: false,

    }
  },
  async created() {
    await this.$store.dispatch('base/getBusinessConfig','gobal')
    const res = await this.jnpf.getBusInfo('b062')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    await this.$refs.dataTable.doLayout();
    this.dataForm = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    columnSetFun() {
      this.$refs['dataTable'].showDrawer()
    },
    columnSetFun1() {
      this.$refs['linesTableData'].showDrawer()
    },
    superQuerySearch(query) {
      this.dataForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    superQuerySearch1(query) {
      this.linesQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 点击切换明细
    handleClick(e) {
      console.log(e);
      this.activeName = e.name
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === "purchaseOrderNo" || prop === 'partnerCode' || prop === 'cooperativePartnerName' || prop === 'shipperName' || prop === 'createByName' || prop === 'productName' || prop === 'productDrawingNo') {
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
      this.search()


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
      this.visible = false
      if (this.activeName === 'dataTable') {
        if (this.dataForm.createTimeArr && this.dataForm.createTimeArr.length > 0) {
          this.dataForm.startTime = this.dataForm.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.dataForm.endTime = this.dataForm.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.dataForm.startTime = ''
          this.dataForm.endTime = ''
        }
        getPurchaseChangeList(this.dataForm).then(res => {
          console.log("res++", res);
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
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
        getPurchaseChangeLineList(this.linesQuery).then(res => {
          console.log("res++", res);
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
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

    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    updateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        console.log(4444444);
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype,)
        })
        // }, 600);
      }


    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deletePurchaseChange(id).then(res => {
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
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        withdrawn(_data).then(res => {
          this.$message({
            type: 'success',
            message: "撤回成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },

  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
