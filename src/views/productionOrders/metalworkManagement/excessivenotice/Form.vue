<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建超领料通知单' : btnType == 'edit' ? '编辑超领料通知单' : btnType == 'copy' ? '新建超领料通知单' : '查看超领料通知单'" />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="通知单信息" name="orderInfo">
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="通知单号" prop="orderNo">
                    <el-input readonly placeholder="请输入通知单号" :disabled="btnType == 'look' ? true : false" v-model="dataForm.orderNo"></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="8" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="生产订单号" prop="productionOrderId">
                    <el-input readonly placeholder="请选择生产订单号" :disabled="btnType == 'look' ? true : false" v-model="dataForm.productionOrderNo" @focus="openSeleceproduction"></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="8" :xs="24">
                  <el-form-item label="领料类型" prop="receiveType">
                    <el-select v-model="dataForm.receiveType" placeholder="请选择领料类型" style="width: 100%;" @change="receiveTypeaction" :disabled="btnType == 'look'">
                      <el-option v-for="(item, index) in personorderList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="超领料人" prop="llr">
                    <el-input readonly placeholder="请选择超领料人" :disabled="btnType == 'look' ? true : false"
                      v-model="dataForm.llr"></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :sm="8" :xs="24">
                  <el-form-item label="超领料日期" prop="operationDate">
                    <el-date-picker v-model="dataForm.operationDate" :default-value="new Date()" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" placeholder="请选择超领料日期" :disabled="btnType == 'look' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="领料人" prop="personId">
                    <user-select v-model="dataForm.personId" placeholder="请选择领料人" clearable style="width: 100%;" :disabled="btnType == 'look'" @change="hangleSelectSales">
                    </user-select>

                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" type="textarea" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>领料订单</h5>
            </div>
            <div v-if="btnType != 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px;  font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceMaterDialog('order')">选择生产订单</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px;  font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="product" class="data-form">
              <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData">
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType !== 'look'" key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="orderNo" label="订单号" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="120" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="workOrderNo" label="工作令号" width="auto" show-overflow-tooltip></el-table-column> -->
                <el-table-column prop="deliveryDate" label="交货日期" width="auto" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productionQuantity" label="生产数量" width="170" :key="60"></el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'edit' || btnType == 'add' || btnType == 'copy'" :key="24">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
            <div style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>领料清单</h5>
            </div>
            <div v-if="btnType != 'look'">
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceMater()" v-if="dataForm.receiveType=='order'">选择用料清单</el-button>
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceMaterDialog('procss')" v-if="dataForm.receiveType=='process'">选择工序物料</el-button>
            </div>
            <el-form :model="dataFormlist" v-bind="dataFormlist" ref="productForm" class="data-form">
              <el-table ref="productlist" :data="dataFormlist.productlist" v-loading="tableloading">
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="productCode" label="产品编码" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="routingCode" label="工艺路线编码" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="routingName" label="工艺路线名称" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="processCode" label="工序编码" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="processName" label="工序名称" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="120" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="num" label="超领料数量" width="150" show-overflow-tooltip v-if="dataForm.receiveType=='order'" key="151"></el-table-column> -->
                <el-table-column prop="num" label="超领料数量" width="170" key="112">
                  <template slot="header">
                    <span class="required">*</span>超领料数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productlist.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                      <el-input v-model="scope.row.num" placeholder="请输入超领料数量" :disabled="btnType == 'look'" maxlength="20" @input="watchnums(scope.row, scope.$index)" style="width: 145px;">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'edit' || btnType == 'add' || btnType == 'copy'" :key="130">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDelyongliao(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="approvalFlow">
            <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="btnType" :nodeConfig.sync="busNodeConfig" ref="workflowRef" />
            <div class="noDataTip" v-if="!workVisible">
              <span class="el-table__empty-text">
                <div data-v-4d190d64="" class="el-empty">
                  <div class="el-empty__image" style="width: 120px;"><svg viewBox="0 0 79 86" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <defs>
                        <linearGradient id="linearGradient-1-48" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%">
                          <stop stop-color="#FCFCFD" offset="0%"></stop>
                          <stop stop-color="#EEEFF3" offset="100%"></stop>
                        </linearGradient>
                        <linearGradient id="linearGradient-2-48" x1="0%" y1="9.5%" x2="100%" y2="90.5%">
                          <stop stop-color="#FCFCFD" offset="0%"></stop>
                          <stop stop-color="#E9EBEF" offset="100%"></stop>
                        </linearGradient>
                        <rect id="path-3-48" x="0" y="0" width="17" height="36"></rect>
                      </defs>
                      <g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="B-type" transform="translate(-1268.000000, -535.000000)">
                          <g id="Group-2" transform="translate(1268.000000, 535.000000)">
                            <path id="Oval-Copy-2" d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z" fill="#F7F8FC"></path>
                            <polygon id="Rectangle-Copy-14" fill="#E5E7E9" transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) " points="13 58 53 58 42 45 2 45"></polygon>
                            <g id="Group-Copy" transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)">
                              <polygon id="Rectangle-Copy-10" fill="#E5E7E9" transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) " points="2.84078316e-14 3 18 3 23 7 5 7"></polygon>
                              <polygon id="Rectangle-Copy-11" fill="#EDEEF2" points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon>
                              <rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-48)" transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) " x="38" y="7" width="17" height="36"></rect>
                              <polygon id="Rectangle-Copy-13" fill="#F8F9FB" transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) " points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon>
                            </g>
                            <rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-48)" x="13" y="45" width="40" height="36"></rect>
                            <g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)">
                              <mask id="mask-4-48" fill="white">
                                <use xlink:href="#path-3-48"></use>
                              </mask>
                              <use id="Mask" fill="#E0E3E9" transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) " xlink:href="#path-3-48"></use>
                              <polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-48)" transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) " points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon>
                            </g>
                            <polygon id="Rectangle-Copy-18" fill="#F8F9FB" transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) " points="62 45 79 45 70 58 53 58"></polygon>
                          </g>
                        </g>
                      </g>
                    </svg></div>
                  <div class="el-empty__description">
                    <p>暂无流程信息</p>
                  </div><!---->
                </div>
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="btnType == 'look'" label="流转记录" name="transferList">
            <el-table v-loading="formLoading" :data="transferData">
              <el-table-column prop="businessName" label="审批业务名称" min-width="160" />
              <el-table-column prop="processedName" label="办理人名称" min-width="160" />
              <el-table-column prop="remark" label="备注" min-width="160" />
              <el-table-column prop="startDate" label="开始时间" min-width="160" />
              <el-table-column prop="endDate" label="结束时间" min-width="160" />
              <el-table-column prop="consumingTime" label="耗时" min-width="160" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <ComSelect-pages multiple ref="ComSelect-page1" @change="submitCustomerProduct" :datetype="datetype" title="选择生产订单" :renderTree="false" :listMethod="ordershengchanList" :listRequestObj="processMaterialListRequestObj" :searchList="ProductTableSearchList1" :elementShow="false" />
      <ComSelect-pages multiple ref="ComSelect-page2" @change="submitCustomerProduct2" :datetype="datetype1" title="选择工序物料" :renderTree="false" :tableItems="tableItemslist" :listMethod="ordercollectlList" :listRequestObj="processMaterialListRequestObj2" :searchList="ProductTableSearchList2" :elementShow="false" :picktype="false" />
      <ComSelect-pages multiple ref="ComSelect-page3" @change="submitCustomerProduct3" :datetype="datetype1" title="选择用料清单" :renderTree="false" :tableItems="tableItemslist3" :listMethod="ordermaterialList" :listRequestObj="processMaterialListRequestObj3" :searchList="[]" :elementShow="false" :picktype="false" />
    </div>
  </transition>
</template>

<script>
import { ordershengchanList, detailordershengchan, addWithdrawal, updateWithdrawal, detailWithdrawal, getMaterialList, ordercollectlList, ordermaterialList } from '@/api/productOrdes/index'
import ComSelectPages from './ComSelect-pages/index.vue'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
import { mapGetters, mapState } from 'vuex'
export default {
  components: { ComSelectPages, workFlow },
  data() {
    return {
      tableloading: false,
      dataFormlist: {
        productlist: []
      },
      datetype1: {
        start: 'startTime',
        end: 'endTime'
      },
      datetype: {
        start: 'deliveryStartDate',
        end: 'deliveryEndDate'
      },
      getMaterialList,
      ordercollectlList,
      ordermaterialList,
      //搜素条件列表
      ProductTableSearchList: [
        { prop: "orderNo", label: "生产单号", type: 'input' },
        { prop: "orderType", label: "订单类型", type: 'select', options: [{ label: '正常订单', value: 'normal' }, { label: '返工订单', value: 'rework' }] }
      ],
      ProductTableSearchList1: [
        { prop: "workOrderNo", label: "工作令号", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "data", label: "交货日期", type: 'date' },
        { prop: "orderNo", label: "订单号", type: 'input' },
        { prop: "productCode", label: "产品编码", type: 'input' },
        { prop: "blankProductsName", label: "下料产品", type: 'input' },
        { prop: "productDrawingNo", label: "产品图号", type: 'input' },
        { prop: "routingCode", label: "工艺路线编码", type: 'input' },
        { prop: "routingName", label: "工艺路线名称", type: 'input' },
        // { prop: "pickingStatus", label: "领料状态", type: 'select', options: [{ label: '已领料', value: 'picked' }, { label: '未领料', value: 'not_picked' }, { label: '领料中', value: 'picking' }] }
      ],
      ProductTableSearchList2: [
        { prop: "productCode", label: "产品编码", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "productDrawingNo", label: "产品图号", type: 'input' },
        { prop: "routingCode", label: "工艺路线编码", type: 'input' },
        { prop: "routingName", label: "工艺路线名称", type: 'input' },
        { prop: "processCode", label: "工序编码", type: 'input' },
        { prop: "processName", label: "工序名称", type: 'input' }
      ],
      tableItemslist: [
        { prop: "productCode", label: "产品编码" },
        { prop: "productName", label: "产品名称" },
        { prop: "productDrawingNo", label: "产品图号" },
        { prop: "routingCode", label: "工艺路线编码" },
        { prop: "routingName", label: "工艺路线名称" },
        { prop: "processCode", label: "工序编码" },
        { prop: "processName", label: "工序名称" },
        { prop: "mainUnit", label: "单位" },
        { prop: "inventoryQuantity", label: "库存数量" },
        { prop: "availableQuantity", label: "可用库存数量" }
      ],
      tableItemslist3: [
        { prop: "productCode", label: "产品编码" },
        { prop: "productName", label: "产品名称" },
        { prop: "productDrawingNo", label: "产品图号" },
        { prop: "routingName", label: "工艺路线名称" },
        { prop: "processCode", label: "工序编码" },
        { prop: "processName", label: "工序名称" }
      ],
      processMaterialListRequestObj3: {},
      ProductListRequestObj: {
        demandType: '',
        pickingFlag: 1,
        receiveStatus: 'received',
        orderItems: [{ asc: false, column: "" }, { asc: false, column: "create_time" }],
        pageNum: 1,
        pageSize: 20,
      },
      dataFormTwo: { productData: [] },
      personorderList: [
        { label: "订单物料", value: "order" },
        { label: "工序物料", value: "process" },
      ],
      ordershengchanList,
      orderVisible: false,
      listLoading: false,
      total: 0,
      dataForm: {
        businessCode: 'metalworking',
        receiveType: 'order',
        pickingStatus: 'not_picked',
        demandType: '',
        notifyType: 'over_picking',
        processId: '',
        personId: '',
        operationDate: '',
        productionOrderNo: '',
        id: '',
        remark: ''
      },
      iszhi: false,
      btnType: undefined,
      activeName: "orderInfo",
      btnLoading: false,
      productRules: {
        num: [{ required: true, trigger: 'blur' }, { validator: this.calcValidate(), trigger: 'blur' }],
      },
      dataRule: {
        receiveType: [
          { required: true, message: '领料类型不能为空', trigger: 'change' }
        ],
        // personId: [
        //   { required: true, message: '超领料人不能为空', trigger: 'change' }
        // ],
        operationDate: [
          { required: true, message: '超领料时间不能为空', trigger: 'change' }
        ],
      },
      selectRows: [],
      materialType: "",
      title: "",
      processDialog: false,
      materialList: [],
      materialProductList: [],
      selectProcessArr: [],
      MaterialListRequestObj: {
        pageNum: 1,
        pageSize: 20,
        productCode: "",
        productDrawingNo: "",
        productName: "",
      },
      processMaterialListRequestObj2: {},
      processMaterialListRequestObj: {
        workOrderNo: '',
        orderNo: '',
        productCode: '',
        routingName: '',
        productDrawingNo: '',
        routingCode: '',
        productName: '',
        blankProductsName: '',
        orderStatus: 'normal',
        pickingStatus: 'picked',
        deliveryEndDate: '',
        deliveryStartDate: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "create_time"
          }
        ]
      },
      orderTotal: 0,
      processTotal: 0,
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: "发起人",
        nodeType: 0,
        type: 'node',
        priorityLevel: "",
        approvalType: "appoint",
        selectMode: "",
        selectRange: "",
        directorLevel: "",
        examineMode: "",
        whenEmpty: "",
        examineEndDirectorLevel: "",
        ccSelfSelectFlag: "",
        conditionList: [],
        nodeUserList: [],
        childNode: null,
        conditionNodes: []
      },
      approvalForm: {},
      firstOneNode: [],
      // 审批 转审记录参数
      transferQuery: {
        approvalFormId: '',
        createByName: "",
        documentId: '',
        endTime: "",
        keyword: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
      transferData: [],
      formLoading: false,
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  // created() {
  //   this.dataForm.orderDate = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  // },
  methods: {
    // 选择用料清单弹框
    openSeleceMater() {
      if (!this.dataFormTwo.productData.length) return this.$message.error("请选择生产订单")
      let a = this.dataFormTwo.productData.map(i => {
        return i.id
      })
      this.processMaterialListRequestObj3 = {
        poIdList: a,
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        endTime: ''
      }
      this.$refs['ComSelect-page3'].openDialog()
    },
    //用料清单
    submitCustomerProduct3(selectedIds, selectedList) {
      let hasItemList = []
      selectedList.map(i => {
        const hasFlag = this.dataFormlist.productlist.some(item => {
          let flag = false
          if (i.all.id === item.id) { flag = true }
          return flag
        })
        if (hasFlag) { hasItemList.push(i.all.productName) }
        else { this.dataFormlist.productlist.push(i.all) }
        if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
      })
      this.$refs['ComSelect-page3'].isvisible()
    },
    //领用类型切换
    receiveTypeaction() {
      this.dataFormTwo.productData = []
      this.dataFormlist.productlist = []
    },
    disproduceData(row) {
      return row.selectFlag
    },
    handleRowClick(row) {
      // 判断当前行是否已经选中
      if (!row.selectFlag) return
      const isSelected = this.$refs.workOrder.$refs.JNPFTable.toggleRowSelection(row);
      // 如果当前行未选中，则调用toggleRowSelection方法选中该行
    },
    handleDBRowClick(row) {
      // 判断当前行是否已经选中
      if (!row.selectFlag) return
      const isSelected =
        this.$refs.workOrder.$refs.JNPFTable.toggleRowSelection(row);
      // 如果当前行未选中，则调用toggleRowSelection方法选中该行
    },
    selectProcessFun(val) {
      val.forEach(row => {
        if (!row.selectFlag) {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      });
      this.selectProcessArr = val;
    },
    // 关闭
    closePro() {
      this.processDialog = false;
    },
    submitProcess() {
      if (!this.selectProcessArr.length) return this.$message.error("请选择产品")
      this.dataFormTwo.productData = [...this.dataFormTwo.productData, ...this.selectProcessArr]


      this.processDialog = false;

    },
    initData(type) {
      this.materialProductList = []
      if (type == 'order') {
        if (this.dataForm.receiveType == 'process') {
          this.processMaterialListRequestObj = {
            workOrderNo: '',
            orderNo: '',
            productCode: '',
            routingName: '',
            pickingStatus: '',
            productDrawingNo: '',
            routingCode: '',
            productName: '',
            blankProductsName: '',
            orderStatus: 'normal',
            deliveryEndDate: '',
            deliveryStartDate: '',
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              {
                "asc": false,
                "column": ""
              },
              {
                "asc": false,
                "column": "create_time"
              }
            ]
          }
        }else{
          this.processMaterialListRequestObj= {
            businessCode: 'metalworking',
            workOrderNo: '',
            orderNo: '',
            productCode: '',
            routingName: '',
            productDrawingNo: '',
            routingCode: '',
            productName: '',
            blankProductsName: '',
            orderStatus: 'normal',
            pickingStatus: 'picked',
            deliveryEndDate: '',
            deliveryStartDate: '',
            pageNum: 1,
            pageSize: 20,
            orderItems: [
              {
                "asc": false,
                "column": ""
              },
              {
                "asc": false,
                "column": "create_time"
              }
            ]
          }
        }
        this.$refs['ComSelect-page1'].openDialog()
      } else {
        if (!this.dataFormTwo.productData.length) return this.$message.error("请选择生产订单")
        let a = this.dataFormTwo.productData.map(i => {
          return i.id
        })
        this.processMaterialListRequestObj2 = {
          processName: '',
          processCode: '',
          routingName: '',
          routingCode: '',
          productDrawingNo: '',
          productName: '',
          productCode: '',
          poIdList: a,
          pageNum: 1,
          pageSize: 20
        }
        this.$refs['ComSelect-page2'].openDialog()
      }
    },
    // 选择订单物料弹框
    openSeleceMaterDialog(type) {
      this.materialType = type
      this.materialProductList = []
      this.title = type == 'order' ? "选择订单物料" : "选择工序物料"
      // if (!this.dataForm.productionOrderId) return this.$message.error('请先选择生产订单')
      this.initData(type)
    },
    //数量单价不能为0
    calcValidate() {
      return (rule, value, callback) => {
        let msg = `超领料数量不能为'0'`
        if (value == 0) { callback(new Error(msg)), this.$message.error(msg) } else {
          callback()
        }
      };
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500,
        })
        return
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.productData.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
      this.dataFormlist.productlist = []
    },
    // 单个删除
    handleDel(data) {
      this.dataFormTwo.productData.splice(data.$index, 1)
      this.dataFormlist.productlist = []
    },
    handleDelyongliao(data){
      this.dataFormlist.productlist.splice(data.$index,1)
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    openSeleceproduction() {
      this.$refs['ComSelect-page'].openDialog()
    },
    handleClick() { },
    //工序物料
    submitCustomerProduct2(selectedIds, selectedList) {
      selectedList.map(i=>{
        if(!i.all.processId){
            i.all.routingCode = ''
            i.all.routingName = ''
            i.all.processCode = ''
            i.all.processName = ''
          }
      })
      if (this.dataFormlist.productlist.length) {
        let hasItemList = []
        selectedList.map(i => {
          const hasFlag = this.dataFormlist.productlist.some(item => {
            let flag = false
            if (i.all.id === item.id) { flag = true }
            return flag
          })
          if (hasFlag) { hasItemList.push(i.all.processName) }
          else { this.dataFormlist.productlist.push(i.all) }
          if (hasItemList.length) this.$message.error(`已经存在的工序：${hasItemList.join('、')}`)
        })
      } else {
        selectedList.map(item => {
          this.dataFormlist.productlist.push(item.all)
        })
      }
      this.$refs['ComSelect-page2'].isvisible()
    },
    //生产订单
    submitCustomerProduct(selectedIds, selectedList) {
      if(!selectedList.length) return this.$message.error(`请选择生产订单`)
      // if (this.dataFormTwo.productData.length) {
        let hasItemList = []
        selectedList.map(i => {
          const hasFlag = this.dataFormTwo.productData.some(item => {
            let flag = false
            if (i.all.id === item.id) { flag = true }
            return flag
          })
          if (hasFlag) { hasItemList.push(i.all.orderNo) }
          else { this.dataFormTwo.productData.push(i.all) }
          if (hasItemList.length) this.$message.error(`已经存在的订单：${hasItemList.join('、')}`)
        })
        this.$refs['ComSelect-page1'].isvisible()
      // 审批
      this.$nextTick(() => { this.getApproverData() })
    },
    //超领料数量
    watchnums(row, index) { 
      if (!row.num) {
        return
      }
      row.num = row.num.replace(/[^0-9.]/g, '');

      if (row.num.length == 1 && row.num == '.') {
        // 如果第一位是小数点，则清空输入框
        row.num = '';
      } else if (row.num.length == 2 && row.num[0] == '0' && row.num[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.num = row.num.slice(0, 1) + '.' + row.num.slice(1);
      } else if (row.num.length > 4 && row.num[0] == '0' && row.num[1] != '.') {
        row.num = row.num.substring(1, row.num.length)
      }
      if (row.num.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.num.length; i++) {
          const char = row.num[i];
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char;
              dotCount++;
            }
          } else {
            result += char;
          }
        }
        row.num = result;
        let arr = row.num.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.num = arr[0] + '.' + arr[1] 
      } else {
        if (row.num.length > 8) {
          row.num = row.num.substring(0, 8);
        }
      }
    },
    //超领料人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('personId')
      })
      this.dataForm.personId = e
    },
    goBack() {
      this.$emit('close')
    },
    dateFormat(dateData) {
      // 转换为年月日
      // var date = new Date(dateData)
      // var y = date.getFullYear()
      // var m = date.getMonth() + 1
      // m = m < 10 ? ('0' + m) : m
      // var d = date.getDate()
      // d = d < 10 ? ('0' + d) : d
      // const time = y + '-' + m + '-' + d
      // return time
      // 转换为年月日时分秒
      var date = new Date(dateData);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");
      var hours = date.getHours().toString().padStart(2, "0");
      var minutes = date.getMinutes().toString().padStart(2, "0");
      var seconds = date.getSeconds().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedDate
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType == 'add' && !this.dataForm.id) {
        const end = new Date();//获取当前的日期
        // end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.operationDate = this.dateFormat(end)
      }
      if (this.dataForm.id && this.btnType !== 'add') {
        this.formLoading = true
        detailWithdrawal(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            this.dataForm = res.data.collect
            if (this.btnType == 'copy') {
              this.dataForm.id = ''
              this.formLoading = false
              this.dataFormlist.productlist = res.data.collectLineList
              this.dataFormTwo.productData = res.data.prodOrderList
              this.dataFormlist.productlist.forEach(item => {
                item.num = ''
                if(!item.processId){
                item.routingCode = ''
                item.routingName = ''
                item.processCode = ''
                item.processName = ''
              }
              })
              // detailordershengchan(res.data.collect.productionOrderId).then(row => {
              //   this.formLoading = false
              //   row.data.materialList.map((item) => {
              //     res.data.collectLineList.map((item1) => {
              //       if (item.productsId == item1.productsId) {
              //         item1.materialsUsedQuantity = item.materialsUsedQuantity
              //         item1.outboundQuantity = item.receivedQuantity
              //         item1.num = ''
              //         item1.returnedQuantity = ""
              //       } else {
              //         item1.num = ''
              //         item1.returnedQuantity = ""
              //       }
              //     })
              //   })
              //   this.dataFormTwo.productData = res.data.collectLineList
              // }).catch(() => {
              //   this.formLoading = false
              // })
              const end = new Date();//获取当前的日期
              // end.setTime(end.getTime())
              //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
              this.dataForm.operationDate = this.dateFormat(end)
            } else {
              this.formLoading = false
              this.dataFormlist.productlist = res.data.collectLineList.map(item=>{
                if(!item.processId){
                  item.routingCode = ''
                  item.routingName = ''
                  item.processCode = ''
                  item.processName = ''
                }
                return item
              })
              this.dataFormTwo.productData = res.data.prodOrderList
            }
          })
        }).catch(() => {
          this.formLoading = false
        })
        getSaleBusDetail(this.dataForm.id).then(res => { 
          if (res.data) {
            this.firstOneNode = []
            this.approvalForm = res.data.form
            this.transferQuery.approvalFormId = this.approvalForm.id
            this.firstOneNode.push({
              name: res.data.form.createByName
            })
            let data = res.data.formNodeTree.childNode
            if (data) {
              this.addNodeTypeAndNodeName(data)

              this.busNodeConfig.childNode = data
              this.workVisible = true
              // this.$nextTick(() => {
              //   this.$refs.workflowRef.initData('busing', this.btnType)
              // })
            }
            if (this.btnType == 'look') {
              this.transferQuery.documentId = this.dataForm.id
              approvalTransferList(this.transferQuery).then(res => { 
                this.transferData = res.data.records
              })
            }
          } else {
            this.busNodeConfig.childNode = null
          }
        })
      }
      // 重新提交
      if (this.dataForm.id && this.btnType === 'add') {
        detailWithdrawal(this.dataForm.id).then(res => {
          this.dataForm = res.data.collect
          this.dataForm.approvalStatus = ''
          this.dataForm.submitDate = ''
          this.dataForm.documentStatus = ''
          this.dataForm.approvalCompletionDate = ''
          this.dataForm.id = ''
          this.dataFormlist.productlist = res.data.collectLineList
          this.dataFormTwo.productData = res.data.prodOrderList
          // detailordershengchan(res.data.collect.productionOrderId).then(row => {
          //   row.data.materialList.map((item) => {
          //     res.data.collectLineList.map((item1) => {
          //       item1.id = ''
          //       if (item.productsId == item1.productsId) {
          //         item1.materialsUsedQuantity = item.materialsUsedQuantity
          //         item1.outboundQuantity = item.receivedQuantity
          //       }
          //     })
          //   })
          //   this.dataFormTwo.productData = res.data.collectLineList
          // })
          // 审批
          this.$nextTick(() => { this.getApproverData() })
        })
      }
    },
    handleConfirm(value) {
      let focusFlag = true
      // 审批条件参数列表
      let nodeCondList = []
      // 审批抄送人列表
      let ccList = []
      let ccLists = []
      let nodeJudg = []
      // 业务审批单流程节点列表
      let formNodeList = []
      // 业务审批单
      let form = {}
      let templateLineList = []
      if (this.btnType == 'add' || this.btnType == 'copy') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map(item=>{
            return {
              ...item,
              nodeUserList:item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }
          if (templateLineList.length && value === 'submit') {
            focusFlag = templateLineList.every(item=>item.nodeUserList.length)
            if (!focusFlag) { 
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && value === 'submit') {
            focusFlag = ccList.every(item=>item.nodeUserList.length)
            if (!focusFlag) { 
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          } 
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: item.name == '审核人' ? 'no' : '',
              adminId: '',
              id: '',
              previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
              ccToId: item.targetId,
              approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
              id: '',
              defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1,
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: value,
            documentId: '',
            id: '',
            approvalFormStatus:'ing'
          }
        }

      }
      if (this.btnType === 'edit' || this.btnType === 'look') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1) 
          flattenedNodes = flattenedNodes.map(item=>{
            return {
              ...item,
              nodeUserList:item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }
          if (templateLineList.length && value === 'submit') {
            focusFlag = templateLineList.every(item=>item.nodeUserList.length)
            if (!focusFlag) { 
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && value === 'submit') {
            focusFlag = ccList.every(item=>item.nodeUserList.length)
            if (!focusFlag) { 
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          } 
          // return
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              // previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              // name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalFormId: item.approvalFormId ? item.approvalFormId : this.approvalForm.id,
              approvalFormNodeCode: item.approvalFormNodeCode ? item.approvalFormNodeCode : item.code,
              ccToId: item.targetId,
              id: item.id ? item.id : ''
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: value,
            approvalFormStatus:'ing'
          }
        }
      }
      if (value === 'submit' && this.dataForm.approvalFlag) {
        if (!this.busNodeConfig.childNode) {
          focusFlag = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach(item => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                focusFlag = false
                this.btnLoading = false
                this.$message.error('未配置发起人自选！')
              }
            }
          })
        }
      }
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.dataFormlist.productlist.length) {
          this.$message({
            message: '领料清单不能为空',
            type: 'error',
            duration: 1500,
          })
          return
        }
        this.dataFormlist.productlist.forEach((item, index) => {
          if (!item.num) {
            this.iszhi = true
            this.$message({
              message: `第${index + 1}行超领料数量不能为空`,
              type: 'error',
              duration: 1500,
            })
          }
        })
        this.$refs['productForm'].validate((valid) => {
          if (valid) {
            if (this.iszhi) return this.iszhi = false
            this.dataForm.documentStatus = value
            this.dataForm.inspectionStatus = 'inspected'
            this.dataFormlist.productlist.map((item) => {
              item.qualifiedQuantity = item.num
              item.inspectionResults = 'qualified'
            })
            let _a = this.dataFormTwo.productData.map(item => {
              return { productionOrderId: item.id }
            })
            let obj = {
              collect: this.dataForm,
              collectLineList: [],
              form: form,
              formNodeList,
              materialProdOrderList: _a,
              nodeCondList: nodeJudg,
              ccList: ccLists,
            }
            this.dataFormlist.productlist.map((item1) => {
              let dep = { ...item1 }
              dep.productsId = item1.productsId ? item1.productsId : item1.productId
              dep.id = ''
              dep.outboundQuantity = 0
              obj.collectLineList.push(dep)
            })
            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'edit') {
              formMethod = updateWithdrawal
            } else if (this.btnType == 'add' || this.btnType == 'copy') {
              obj.collect.pickingStatus = 'not_picked'
              formMethod = addWithdrawal
            }
            if (focusFlag) {
              formMethod(obj).then(res => { 
                let msg = "";
                if (formMethod == addWithdrawal) {
                  msg = "新建成功"
                } else if (value == 'draft') {
                  msg = "保存成功"
                } else if (value == 'submit') {
                  msg = '提交成功'
                }
                this.$message({
                  message: msg,
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.btnLoading = false
                    this.$emit('close', true)
                  }
                })
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              this.btnLoading = false
            }
          }
        })
      })
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) { 
      if (obj) {
        if (obj.name === "审核人") {
          obj.nodeType = 1;
          obj.nodeName = obj.name;
          obj.directorLevel = obj.approvalType == "manager" ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == "multilevel" ? obj.levelSupervisor : ''
        }
        if (obj.name === "路由") {
          obj.nodeType = 4;
        }
        if (obj.name === "抄送人") {
          obj.nodeType = 2;
          obj.nodeName = obj.name;
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode);
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map(item => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(','); // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',');
                  var resultArr = [];
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      };
                      resultArr.push(option);
                    }
                  }
                }
                return {
                  ...item,
                  columnDbname: item.name,
                  columnType: item.dataType,
                  showName: item.name,
                  tjCode: item.code,
                  zdy1: item.comparisonValue,
                  columnId: item.approvalBusinessId,
                  options: resultArr,
                  optType: item.dataType == 'number' ? (item.operationalFormula == 'lt' ? '1' : item.operationalFormula == 'gt' ? '2' : item.operationalFormula == 'eq' ? '4' : item.operationalFormula == 'ge' ? '5' : item.operationalFormula == 'le' ? '3' : '') : ''

                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode);
            }
          }
        }
      }
    },
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) { 
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null,});
        if (node.type === 'node') {

          if (node.childNode) {
            node.previousCode = previousCode
            node.nodeUserList = node.nodeUserList ? node.nodeUserList : []
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {

              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code);
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
        }
      }
      return flattenedNodes;
    },
    // // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = ''  // 条件符号
      let result = null     // 判断条件是否成立
      let condList = []
      getBusDetail('b019').then(res => { 
        state = res.data.business.state
        condExpress = res.data.business.condExpress
        // if (res.data.businessConditionList.length) {
        //   res.data.businessConditionList.forEach(item => {
        //     condList.push({
        //       code: item.code,
        //       val: item.code === 'numCode' ? this.totalNum : this.totalPrice
        //     })
        //   })
        // }
        if (state === 'condition') {
          this.dataForm.approvalFlag = 1
          for (var i = 0; i < condArr.length; i++) {
            if (condExpress.includes(condArr[i])) {
              foundSymbol = condArr[i];
              break;
            }
          }
          // 找到符号并进行销售报价业务判断
          if (foundSymbol) {
            const parts = condExpress.split(foundSymbol); // 使用 ">" 符号拆分字符串
            const leftValue = parts[0]; // 提取 ">" 符号左边的值
            const rightValue = parts[1]; // 提取 ">" 符号右边的值
            // if (leftValue == 'numCode') {
            //   const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // } else {
            //   const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
            //   result = eval(condition); // 执行条件判断
            // }
            if (result) {
              let query = {
                businessCode: "b019",
                condList,
              }
              busApprovalFlowTree(query).then(res => { 
                if (res.data) {
                  this.firstOneNode = []
                  this.approvalForm = res.data.template
                  this.firstOneNode.push({
                    name: this.userInfo.userName
                  })
                  let data = res.data.tempLineTree.childNode
                  if (data) {
                    this.addNodeTypeAndNodeName(data)
                    this.busNodeConfig.childNode = data
                    this.workVisible = true
                    this.$nextTick(() => {
                      this.$refs.workflowRef.initData('busing', this.type)
                    })
                  }
                } else {
                  this.busNodeConfig.childNode = null
                }
              })
            } else {
              this.busNodeConfig.childNode = null
            }
          }
        }
        if (state === 'enable') {
          this.dataForm.approvalFlag = 1
          let query = {
            businessCode: "b019",
            condList,
          }
          busApprovalFlowTree(query).then(res => { 
            if (res.data) {
              this.firstOneNode = []
              this.approvalForm = res.data.template
              this.firstOneNode.push({
                name: this.userInfo.userName
              })
              let data = res.data.tempLineTree.childNode
              if (data) {
                this.addNodeTypeAndNodeName(data)
                this.busNodeConfig.childNode = data
                this.workVisible = true
                this.$nextTick(() => {
                  this.$refs.workflowRef.initData('busing', this.type)
                })
              }
            } else {
              this.busNodeConfig.childNode = null
            }
          })
        }
        if (state === 'disabled') {
          this.dataForm.approvalFlag = 0
          this.busNodeConfig.childNode = null
        }
      })

    },
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
<style scoped>
::v-deep .el-tabs {
  height: 100%!important;
}
::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow:auto!important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 5px 0 10px !important;
}

.el-button span {
  font-size: 14px !important;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
::v-deep .workNode {
  background-color: #f5f5f7 !important;
}
.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}
</style>