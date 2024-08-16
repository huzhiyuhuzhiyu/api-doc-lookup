<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="生产需求" name="produce">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.planNo" @keyup.enter.native="search()" placeholder="请输入计划单号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.productCode" @keyup.enter.native="search()" placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input  v-model="orderForm.productName" @keyup.enter.native="search()" placeholder="请输入产品名称" clearable />
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
                  @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="producrData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="planNo" label="计划单号" width="180" fixed="left" sortable="custom"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="150"  
                  sortable="custom"></el-table-column>
                <el-table-column prop="productName" label="产品名称" fixed="left" width="160" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" fixed="left" width="160" sortable="custom" />

                <!-- <el-table-column prop="demandType" label="需求类型" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.demandType == 'finish_product'">成品生产</div>
                    <div v-if="scope.row.demandType == 'semi_finished'">半成品生产</div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="originNo" label="来源单号" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="workOrderNo" label="工作令号" width="120"></el-table-column>
                <el-table-column prop="demandQuantity" label="需求数量" width="120"></el-table-column>
                <el-table-column prop="safeInventory" label="安全库存" width="100"></el-table-column>
                <el-table-column prop="inventoryQuantity" label="库存数量" width="100"></el-table-column>
                <el-table-column prop="totalInProcessQuantity" label="总在制数量" width="120"></el-table-column>
                <el-table-column prop="inProcessQuantity" label="在制数量" width="100"></el-table-column>

                <el-table-column prop="occupancyQuantity" label="占用数量" width="100"> </el-table-column>
                <el-table-column prop="outputQuantity" label="生产数量" width="100" />

                <el-table-column prop="issuedQuantity" label="已下达数量" width="120"> </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="100"> </el-table-column>
                <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom" />

                <el-table-column prop="createTime" label="需求时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="运算人" min-width="120" />
                <el-table-column prop="remark" label="备注" min-width="160" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope"> 
                    <el-button size="mini" type="text" :disabled="scope.row.outputQuantity==0||scope.row.mainProductFlag"
                @click.native="retrospectFun(scope.row.id,'produce')">追溯主产品</el-button>
                <el-button size="mini" type="text"
                @click.native="complateSetFun(scope.row.bomId, 'product')">查看子件</el-button>
                    
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="采购需求" name="purchase">
          <div class="JNPF-common-layout-center JNPF-flex-main">

            <el-row class="JNPF-common-search-box" :gutter="16">

              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.planNo" placeholder="请输入计划单号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.productCode" placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.productName" placeholder="请输入产品名称" clearable />
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
                  @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">

              <JNPF-table ref="tableDataAss" v-loading="listLoading" :data="purchaseData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="planNo" label="计划单号" width="180" fixed="left" sortable="custom"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="150"  
                  sortable="custom"></el-table-column>
                <el-table-column prop="productName" label="产品名称" fixed="left" width="160" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" fixed="left" width="160" sortable="custom" />

                <!-- <el-table-column prop="demandType" label="需求类型" width="100">
                  <template slot-scope="scope">
                    <div v-if="scope.row.demandType == 'finished_materials'">成品物料</div>
                    <div v-if="scope.row.demandType == 'semi_finished_materials'">半成品物料</div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="originNo" label="来源单号" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="workOrderNo" label="工作令号" width="120"></el-table-column>
                <el-table-column prop="demandQuantity" label="需求数量" width="120"></el-table-column>
                <el-table-column prop="safeInventory" label="安全库存" width="100"></el-table-column>
                <el-table-column prop="inventoryQuantity" label="库存数量" width="100"></el-table-column>
                <el-table-column prop="totalInProcessQuantity" label="总在制数量" width="120"></el-table-column>
                <el-table-column prop="inProcessQuantity" label="在制数量" width="100"></el-table-column>

                <el-table-column prop="occupancyQuantity" label="占用数量" width="100"> </el-table-column>
                <el-table-column prop="outputQuantity" label="采购数量" width="100" />

                <el-table-column prop="issuedQuantity" label="已下达数量" width="120"> </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="120"> </el-table-column>
                <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom" />

                <el-table-column prop="createTime" label="需求时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="运算人" min-width="120" />
                <el-table-column prop="remark" label="备注" min-width="160" />
                <el-table-column label="操作" width="120" fixed="right">
                  <template slot-scope="scope"> 
                    <el-button size="mini" type="text"
                    :disabled="scope.row.outputQuantity==0||scope.row.mainProductFlag"
                @click.native="retrospectFun(scope.row.id,'out')">追溯主产品</el-button>
                   
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="外协需求" name="out">
          <div class="JNPF-common-layout-center JNPF-flex-main">

            <el-row class="JNPF-common-search-box" :gutter="16">

              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.planNo" placeholder="请输入计划单号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.productCode" placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.productName" placeholder="请输入产品名称" clearable />
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
                  @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">

              <JNPF-table ref="tableDataAss" v-loading="listLoading" :data="outData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="planNo" label="计划单号" width="180" fixed="left" sortable="custom"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="150" 
                  sortable="custom"></el-table-column>
                <el-table-column prop="productName" label="产品名称" fixed="left" width="160" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" fixed="left" width="160" sortable="custom" />

                <!-- <el-table-column prop="demandType" label="需求类型" width="100">
                  <template slot-scope="scope">
                    <div v-if="scope.row.demandType == 'out'">外协需求</div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="originNo" label="来源单号" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="workOrderNo" label="工作令号" width="100"></el-table-column>
                <el-table-column prop="demandQuantity" label="需求数量" width="120"></el-table-column>
                <el-table-column prop="safeInventory" label="安全库存" width="100"></el-table-column>
                <el-table-column prop="inventoryQuantity" label="库存数量" width="100"></el-table-column>
                <el-table-column prop="totalInProcessQuantity" label="总在制数量" width="120"></el-table-column>
                <el-table-column prop="inProcessQuantity" label="在制数量" width="100"></el-table-column>

                <el-table-column prop="occupancyQuantity" label="占用数量" width="100"> </el-table-column>
                <el-table-column prop="outputQuantity" label="外协数量" width="100" />

                <el-table-column prop="issuedQuantity" label="已下达数量" width="120"> </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="160"> </el-table-column>
                <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom" />

                <el-table-column prop="createTime" label="需求时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="运算人" min-width="100" />
                <el-table-column prop="remark" label="备注" min-width="160" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope"> 
                    <el-button size="mini" type="text" :disabled="scope.row.outputQuantity==0||scope.row.mainProductFlag"
                @click.native="retrospectFun(scope.row.id,'out')">追溯主产品</el-button>
                <el-button size="mini" type="text"
                @click.native="complateSetFun(scope.row.bomId, 'out')">查看子件</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">

        <el-form ref="diaForm" :model="orderForm" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="计划单号">
              <el-input v-model="orderForm.planNo" placeholder="请输入计划单号" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="orderForm.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="orderForm.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="orderForm.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12" v-if="orderForm.demandType != 'out'">
            <el-form-item label="需求类型">
              <el-select v-model="orderForm.demandType" placeholder="请选择需求类型">
                <el-option v-for="(item, index) in demandList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>

          </el-col> -->
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="orderForm.originNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作令号">
              <el-input v-model="orderForm.workOrderNo" placeholder="请输入工作令号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单交货日期">
              <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="需求时间">
              <el-date-picker v-model="createTimeArr" type="datetimerange" format="yyyy-MM-dd HH:mm:ss"
                :picker-options="global.timePickerOptions" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"
                start-placeholder="开始时间" end-placeholder="结束时间" :default-time="['00:00:00', '23:59:59']" clearable>
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
    <ComplateSetForm v-if="complateSetFormVisible" ref="complateSetForm" @refreshDataList="initData" @close="closeForm" :customList="customList"
    />
  </div>
</template>

<script>
import { getMRPMaterialList, demandProcureissue, demandProduceissue } from '@/api/calculationList/MRPOperation'

import ComplateSetForm from "./complateSetForm";
import Form from './Form'
import moment from 'moment'
export default {
  name: 'carrierProfile',
  components: { Form,ComplateSetForm },
  data() {
    return {
      complateSetFormVisible:false,
      // 需求类型 最开始默认是生产 
      demandList: [
        { label: "所有生产", value: "produce", },
        { label: "成品生产", value: "finish_product", },
        { label: "半成品生产", value: "semi_finished", },
      ],


      producrData: [],
      outData: [],
      purchaseData: [],
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      treeData: [],
      tableData: [],
      detailTableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      activeName: "produce",
      salespersonList: [],
      flag: true,
      detailFlag: false,
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],

      paymentMethodList: [],
      paymentCycleList: [],
      orderForm: {
        demandType: "produce",
        documentStatus: "submit",
        demandState: "finished",
        planNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        originNo: "",
        workOrderNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        replaceStatus: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      tableDataAss: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      createTimeArr: [],
      deliveryDateArr: [],
      total: 0,
      formVisible: false,
      produceArr: [],
      purchaseArr: [],
      total: 0,
    }
  },
  created() {
    this.initData()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    complateSetFun(id,type){
      console.log(id,type);
      this.complateSetFormVisible=true
      this.$nextTick(() => {
        this.$refs.complateSetForm.init(id, type);
      });
     
    },
    retrospectFun(id,type){
      
      this.formVisible=true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type);
      });
    },
    handleClick(e) {
      console.log(e);
      if (e.name == "produce") {
        this.demandList = [
          { label: "所有生产", value: "produce", },
          { label: "成品生产", value: "finish_product", },
          { label: "半成品生产", value: "semi_finished", },
        ]
        this.produceArr = []
        this.orderForm.demandType = 'produce'
        this.initData()
      } else if (e.name == "purchase") {
        this.demandList = [
          { label: "所有采购", value: "purchase", },
          { label: "成品物料", value: "finished_materials", },
          { label: "半成品物料", value: "semi_finished_materials", },
        ]
        this.purchaseArr = []
        this.orderForm.demandType = 'purchase'
        this.initData()
      } else if (e.name == "out") {
        this.demandList = [
          { label: "外协需求", value: "out", },
        ]
        this.purchaseArr = []
        this.orderForm.demandType = 'out'
        this.initData()
      }
      this.orderForm.pageNum = 1
      this.orderForm.pageSize = 20
    },
    sortChange({ prop, order }) {
      console.log("prop", prop);
      let newProp;
      if (prop === 'productCode' || prop === 'productName' || prop === 'productDrawingNo') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      }
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp

      this.initData()

    },

    moreQueries() {
      this.visible = true
    },
    
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.complateSetFormVisible=false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true

      getMRPMaterialList(this.orderForm).then(res => {
        console.log("res++", res, this.orderForm);
        if (this.orderForm.demandType == 'produce' || this.orderForm.demandType == 'finish_product' || this.orderForm.demandType == 'semi_finished') {

          this.producrData = res.data.records
        } else if (this.orderForm.demandType == 'purchase' || this.orderForm.demandType == 'finished_materials' || this.orderForm.demandType == 'semi_finished_materials') {
          this.purchaseData = res.data.records
        } else if (this.orderForm.demandType == 'out') {
          this.outData = res.data.records
        }
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },


    search() {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1

      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.orderForm.deliveryStartDate = this.deliveryDateArr[0]
        this.orderForm.deliveryEndDate = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartDate = ""
        this.orderForm.deliveryEndDate = ""
      }
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.orderForm.startTime = this.createTimeArr[0]
        this.orderForm.endTime = this.createTimeArr[1]
      } else {
        this.orderForm.startTime = ""
        this.orderForm.endTime = ""
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      let demandType = "";
      if (this.activeName == "produce") {
        demandType = 'produce'
      } else if (this.activeName == "purchase") {
        demandType = 'purchase'

      } else if (this.activeName == "out") {
        demandType = 'out'

      }
      this.createTimeArr = []
      this.deliveryDateArr = []
      this.orderForm = {
        demandType: demandType,
        documentStatus: "submit",
        demandState: "finished",
        planNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        originNo: "",
        workOrderNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        replaceStatus: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

      }

      this.search()
    },
    clear() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.deliveryDateArr = []
      this.orderForm = {
        demandType: "produce",
        documentStatus: "submit",
        demandState: "finished",
        planNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        originNo: "",
        workOrderNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        replaceStatus: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: -1,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

      }
    },
    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
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
  padding-top: 5px;
  padding-bottom: 10px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
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

::v-deep.el-range-editor--small.el-input__inner {
  height: 34px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-dialog .el-dialog__body {
  padding: 30px 20px !important;
}
</style>

