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
                <el-input v-model="orderNoS" placeholder="生产任务单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="productDrawingNoS" placeholder="品名规格" clearable @keyup.enter.native="search()" />
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
              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="addTaskFun('', 'add')">
                新建返工任务
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="addition2()">追加生产</el-button>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="reassignmentFun2()">改派</el-button>
              <el-button size="mini" type="primary" icon="el-icon-printer" @click="printOrder('p035')">打印装配单</el-button>
              <el-button size="mini" type="primary" icon="el-icon-printer"
                @click="printFlowCard('p020')">打印流转卡</el-button>
              <el-button size="mini" type="danger" icon="el-icon-close" @click.native="Cancelshipment()"> 关单
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
          <JNPF-table :partentOrChild="'dataTable'" ref="dataTable" v-loading="listLoading" :data="tableData"
            :fixedNO="true" :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" hasC
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="生产任务单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'all')">{{
                  scope.row.orderNo
                }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="orderType" label="任务类型" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderType == 'normal'">正常订单</div>
                <div v-if="scope.row.orderType == 'rework'">返工订单</div>
              </template>
            </el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="productionQuantity" label="总生产数量" min-width="140" sortable="custom" />
            <el-table-column prop="completedQuantity" label="已完成数量" min-width="140" sortable="custom" />
            <el-table-column prop="prodSchedule" label="完成进度" min-width="140">
              <template slot-scope="scope">
                <el-progress
                  :percentage="Number((scope.row.completedQuantity / scope.row.productionQuantity * 100).toFixed(2)) || 0"></el-progress>
              </template>
            </el-table-column>
            <el-table-column prop="routingName" label="工艺路线名称" min-width="160" sortable="custom" />
            <el-table-column prop="routingCode" label="工艺路线编码" min-width="160" sortable="custom" />
            <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" sortable="custom" />
            <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
            <el-table-column prop="oil" label="油脂" min-width="100" sortable="custom" />
            <el-table-column prop="oilQuantity" label="油脂量" min-width="120" sortable="custom" />
            <el-table-column prop="clearance" label="游隙" min-width="100" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom" />
            <el-table-column prop="specialRequire" label="特殊要求" min-width="160" sortable="custom" />
            <el-table-column prop="productionPlanNo" label="生产计划单号" min-width="180" sortable="custom" />
            <el-table-column prop="batchNumber" label="批次号" min-width="180" sortable="custom" />



            <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="urgentFlag" label="是否紧急" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.urgentFlag ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140" sortable="custom" />
            <el-table-column label="操作" width="320" fixed="right">

              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'feed')">投料信息</el-button>
                <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'work')">工单信息</el-button>
                <el-button size="mini" type="text"
                  @click="handleUserRelation(scope.row.orderNo, 'report')">报工信息</el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addition1(scope.row)">
                      追加生产
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="updataDispatch(scope.row.id)">
                      改派
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'all')">
                      查看详情
                    </el-dropdown-item>

                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>

    </div>
    <el-dialog title="追加生产数量" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="addOrderVisible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="form" :rules="dataRule" label-width="120px" label-position="left">
          <el-col :span="24">
            <el-form-item label="生产任务单号" prop="orderNo">
              <el-input v-model="form.orderNo" placeholder="生产任务单号" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="原生产数" prop="productionQuantity">
              <el-input v-model="form.productionQuantity" placeholder="原生产数" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="追加数量" prop="appendQuantity">
              <el-input v-model="form.appendQuantity" placeholder="追加数量" clearable />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrderVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitFun()">
          提交</el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch"
      @close="superQueryVisible = false" />
    <ReworkForm v-if="reworkVisible" ref="reworkForm" @refreshDataList="initData" @close="closeForm"></ReworkForm>
    <BatchDispatchForm v-if="BatchDispatchVisible" ref="BatchDispatchForm" @refreshDataList="initData" @close="closeForm">
    </BatchDispatchForm>

    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" :params="workOrderForm" ref="printForm" />
    <!-- 打印流转卡弹窗选择工单数据 -->
    <el-dialog title="工单信息" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="workOrderVisible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <el-form ref="workOrderForm" :model="workOrderForm" label-width="92px" label-position="left">
          <el-col :span="12">
            <el-form-item label="生产数量：" prop="productionQuantity">
              <el-input v-model="workOrderForm.productionQuantity" placeholder="生产数量" />
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <JNPF-table ref="work" :data="workOrderData" hasC @selection-change="handleSelectWork" fixedNo v-loading="tableloading" border>
        <el-table-column prop="orderNo" label="工单号" min-width="160" />
        <el-table-column prop="processName" label="工序名称" min-width="120" />
        <el-table-column prop="processCode" label="工序编码" min-width="120"></el-table-column>
        <el-table-column prop="planStartDate" label="计划开始日期" min-width="150"></el-table-column>
        <el-table-column prop="planEndDate" label="计划结束日期" min-width="150"></el-table-column>
        <el-table-column prop="mainUnit" label="单位" min-width="80"></el-table-column>
        <el-table-column prop="productionQuantity" label="生产数量" min-width="100"></el-table-column>
        <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="100"></el-table-column>
        <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="130"></el-table-column>
      </JNPF-table>

      <span slot="footer" class="dialog-footer">
        <el-button @click="workOrderVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="printSubmit()">
          打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ordershengchanList, addOrderNum, detailordershengchan } from '@/api/productOrdes/index.js'
import { prodOrderClose } from '@/api/productOrdes/finishedProductOrders.js'
import { UserListAll, } from '@/api/permission/user'
import Form from './Form'
import ReworkForm from './reworkForm.vue'
import BatchDispatchForm from './batchDispatchForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { getPrintBusInfo } from '@/api/system/printDev'
import PrintBrowse from '@/components/PrintBrowse'
export default {
  name: 'assemblyTaskManagement',
  components: { SuperQuery, Form, ReworkForm, BatchDispatchForm, PrintBrowse },
  data() {
    return {
      BatchDispatchVisible: false,
      printBrowseVisible: false,
      workOrderVisible: false,
      workOrderForm: {
        productionQuantity: '',
      },
      form: {
        appendQuantity: "",
        productionQuantity: "",
        orderNo: ""
      },
      reworkVisible: false,
      addOrderVisible: false,
      columnList: ["productCode", "routingCode", "planStartDate", "planEndDate", "createByName",],
      orderNoS: "",
      productDrawingNoS: "",
      productionPlanNoS: "",
      superQueryVisible: false,
      btnLoading: false,
      title: "更多查询",
      tableData: [],
      listLoading: false,
      detailFlag: false,
      orderForm: {},
      orderFormlist: {
        productDrawingNo: "",
        productionPlanNo: "",
        orderNo: "",
        orderStatus: "normal",
        classAttribute: "finish_product",
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
          prop: 'orderNo',
          label: "生产任务单号",
          type: 'input'
        },
        {
          prop: 'orderType',
          label: "任务类型",
          type: 'select',
          options: [
            { label: "正常订单", value: "normal" },
            { label: "返工订单", value: "rework" },
          ]
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
          prop: 'productionQuantity',
          label: "总生产数量",
          type: 'input'
        },
        {
          prop: 'completedQuantity',
          label: "已完成数量",
          type: 'input'
        },
        {
          prop: 'routingName',
          label: "工艺路线名称",
          type: 'input'
        },
        {
          prop: 'routingCode',
          label: "工艺路线编码",
          type: 'input'
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
          prop: 'productionPlanNo',
          label: "生产计划单号",
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
      dataRule: {
        appendQuantity: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["追加数量不能为空", (errMsg, index) => { this.$message.error(`追加数量：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '请输入大于0的正整数',), trigger: 'blur' }
        ],
      },
      workOrderData: [],
      selectWorkOrder: [],
      flowCardCode:''
    }
  },
  created() {
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search()
  },

  mounted() {
    this.getProductClassFun()
  },
  methods: {
    // 改派
    updataDispatch(id) {
      this.BatchDispatchVisible = true
      this.$nextTick(() => {
        this.$refs.BatchDispatchForm.init(id, 'all')
      })
    },
    // 新建返工
    addTaskFun(id, type) {
      this.reworkVisible = true
      this.$nextTick(() => {
        this.$refs.reworkForm.init(id, type)
      })
    },
    // 追加
    addition2() {
      if (!this.selectArr.length) return this.$message.error("请选择您要追加生产的数据!")
      if (this.selectArr.length > 1) return this.$message.error("追加生产只支持单条数据操作")
      if (this.selectArr[0].orderType == 'rework') return this.$message.error("返工任务不可追加生产")
      this.form = this.selectArr[0]
      this.addOrderVisible = true
    },
    addition1(data) {
      this.form = data
      this.addOrderVisible = true



    },

    reassignmentFun2() {
      console.log(this.selectArr);
      if (!this.selectArr.length) return this.$message.error("请选择您要改派的数据!")
      if (this.selectArr.length > 1) return this.$message.error("改派只支持单条数据操作")
      this.BatchDispatchVisible = true
      this.$nextTick(() => {
        this.$refs.BatchDispatchForm.init(this.selectArr[0].id, 'all')
      })
    },
    reassignmentFun1(data) {

      this.BatchDispatchVisible = true
      this.$nextTick(() => {
        this.$refs.BatchDispatchForm.init(id, 'all')
      })
    },
    // 追加生产数量 提交
    submitFun() {
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          console.log(this.form);
          this.btnLoading = true
          addOrderNum(this.form).then(res => {
            this.addOrderVisible = false
            this.btnLoading = false
            this.$message.success("追加生产数量成功")
            this.search()
          }).catch(error => {
            this.btnLoading = false
          })
        }
      })

    },
    // 多选
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //禁用复选框
    checkSelectable(row) {
      if (row.orderStatus !== 'normal' || row.orderStatus == 'suspend' || row.documentStatus == 'draft') {
        return false
      } else {
        return true

      }
    },

    // 关单
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error("请选择您要关单的任务")
      this.$confirm('您确认关闭选中的任务吗？', this.$t('common.tipTitle'), {
        type: 'warning',
        customClass: 'custom-confirm',
      }).then(() => {

        let arr = this.selectArr.map(item => {
          return item.id
        })
        console.log(arr)
        prodOrderClose(arr).then(res => {
          console.log(555);
          this.$message.success("关单成功")
          this.search()
        }).catch(() => {
        })
      }).catch(() => { })
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
      this.reworkVisible = false
      this.BatchDispatchVisible = false
      this.search()
    },
    initData() {
      this.listLoading = true

      if (this.orderNoS) {
        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("orderNo"));
          filteredData.push({ "field": "orderNo", "fieldValue": this.orderNoS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push(
            { "field": "orderNo", "fieldValue": this.orderNoS, "symbol": "like" }
          )
        }
      }
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

        if (this.orderForm.superQuery.condition.length) {
          let filteredData = this.orderForm.superQuery.condition.filter(obj => !obj.field.includes("productDrawingNo"));
          filteredData.push({ "field": "productDrawingNo", "fieldValue": this.productDrawingNoS, "symbol": "like" })
          this.orderForm.superQuery.condition = filteredData
        } else {
          this.orderForm.superQuery.condition.push(
            { "field": "productDrawingNo", "fieldValue": this.productDrawingNoS, "symbol": "like" }
          )
        }
      }
      if (this.orderNoS || this.customerDrawingNumberS || this.productDrawingNoS) {
        this.$set(this.orderForm.superQuery, 'matchLogic', 'AND')
      }
      ordershengchanList(this.orderForm).then(res => {
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

      this.orderNoS = ""
      this.productionPlanNoS = ""
      this.productDrawingNoS = ""
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteQuotationsendlist(id).then(res => {
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

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 打印 装配单
    printOrder(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectArr.length > 1) return this.$message.error("打印只支持单条数据操作！")
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectArr[0].id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    // 打印 流转卡
    printFlowCard(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectArr.length > 1) return this.$message.error("打印只支持单条数据操作！")
      this.workOrderVisible = true
      this.flowCardCode = enCode
      this.workOrderForm.productionQuantity = this.selectArr[0].productionQuantity
      detailordershengchan(this.selectArr[0].id).then(res => {
        this.workOrderData = res.data.workOrderList
      })
    },
    handleSelectWork(val){
      this.selectWorkOrder = val
    },
    printSubmit(){
      if (!this.selectWorkOrder.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectWorkOrder.length > 1) return this.$message.error("打印只支持单条数据操作！")
      getPrintBusInfo(this.flowCardCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectWorkOrder[0].id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
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
