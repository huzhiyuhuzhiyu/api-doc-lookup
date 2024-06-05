<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType !== 'fp' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="btnType=='look'?'查看分配订单':'分配订单'" />
        <div class="options" v-if="btnType!=='look'">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            {{ $t('common.submitButton') }}
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="订单分配" name="orderAllocation" v-loading="formLoading">
            <!-- <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div> -->
            <el-table ref="product" :data="productData" :fixedNO="true" :span-method="objectSpanMethod" class="tableheight"
              style="border:1px solid #dcdfe6" :summary-method="getSummaries" show-summary>
              <el-table-column type="index" width="60"  align="center" label="序号" />
              <el-table-column prop="customerProductNo" width="120"  align="center" label="客户物料号" />
              <el-table-column prop="customerProductDrawingNo" label="客户产品图号" min-width="350" show-overflow-tooltip />
              <el-table-column prop="productCode" label="产品编码" width="150" show-overflow-tooltip />
              <el-table-column prop="productName" label="产品名称" width="100" show-overflow-tooltip />
              <el-table-column prop="drawingNo" label="产品图号" min-width="320" show-overflow-tooltip />
              <el-table-column prop="num" label="数量(主)" width="80" show-overflow-tooltip />
              <el-table-column prop="mainUnit" label="单位(主)" width="100" show-overflow-tooltip />
              <el-table-column prop="assistantNum" label="数量(副)" width="100" show-overflow-tooltip />
              <el-table-column prop="deputyUnit" label="单位(副)" width="100" show-overflow-tooltip />
              <el-table-column prop="price" label="单价(含税)" width="140" show-overflow-tooltip />
              <el-table-column prop="totalAmount" label="金额" width="100" show-overflow-tooltip />
              <el-table-column prop="availableQuantity" label="可用库存数量" width="140" show-overflow-tooltip >
                <template slot-scope="scope">
                  <div>{{ scope.row.availableQuantity?scope.row.availableQuantity:0 }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="utilizationQuantity" label="利用库存数量" width="140">
                <template slot="header"><span class="required">*</span>利用库存数量</template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.utilizationQuantity" placeholder="请输入利用库存数量"
                    @input="watchKC(scope.row, scope.$index)" @blur="handleKC(scope)" :disabled="btnType == 'look'">{{
                      scope.row.utilizationQuantity }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="productionQuantity" label="需生产数量" width="140">
                <!-- <template slot="header"><span class="required">*</span>需生产数量</template> -->
                <template slot-scope="scope">
                  <el-input v-model="scope.row.productionQuantity" placeholder="请输入需生产数量"
                    @input="watchSC(scope.row, scope.$index)" @blur="handleSC(scope)"
                    :disabled="scope.row.productSource == 'produce'||btnType == 'look'">{{
                      scope.row.recipient }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="purchaseQuantity" label="需采购数量" width="140">
                <!-- <template slot="header"><span class="required">*</span>需采购数量</template> -->
                <template slot-scope="scope">
                  <el-input v-model="scope.row.purchaseQuantity" placeholder="请输入需采购数量"
                    @input="watchCG(scope.row, scope.$index)" @blur="handleCG(scope)"
                    :disabled="scope.row.productSource == 'purchase'||btnType == 'look'">{{
                      scope.row.recipient }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="outsourcingQuantity" label="需外协数量" width="140">
                <!-- <template slot="header"><span class="required">*</span>需外协数量</template> -->
                <template slot-scope="scope">
                  <el-input v-model="scope.row.outsourcingQuantity" placeholder="请输入需外协数量"
                    @input="watchWX(scope.row, scope.$index)" @blur="handleWX(scope)"
                    :disabled="scope.row.productSource == 'out'||btnType == 'look'">{{
                      scope.row.recipient }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="deliveryDate" label="交货日期" width="140" show-overflow-tooltip />
              <el-table-column prop="remark" label="备注" width="200" show-overflow-tooltip />
            </el-table>
            <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
              <span style="font-weight:500;margin-right:10px">总主数量：{{ totalNum }}</span>
              <span style="font-weight:500;margin-right:10px">总副数量：{{ totalAssistantNum }}</span>
              <span style="font-weight:500;margin-right:10px">总金额：{{ totalAmount  }}</span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="订单信息" name="orderInfo" v-loading="formLoading">
            <!-- <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div> -->
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="订单类型" prop="orderType">
                    <el-select v-model="dataForm.orderType" placeholder="请选择订单类型" clearable style="width: 100%;"
                      :disabled="btnType == 'fp'||btnType == 'look'">
                      <el-option v-for="(item, index) in orderList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :sm="6" :xs="24">
                  <el-form-item label="所属客户" prop="cooperativePartnerId">
                    <el-input v-model="dataForm.cooperativePartnerName" placeholder="请选择所属客户" readonly
                      :disabled="btnType == 'fp'||btnType == 'look'">
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="所属销售" prop="salesId">
                    <user-select v-model="dataForm.salesId" placeholder="请选择所属销售人员" clearable style="width: 100%;"
                      :disabled="btnType == 'fp'||btnType == 'look'">
                    </user-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="所属部门" prop="departmentId">
                    <ComSelect v-model="organizeIdTrees" :disabled="isdisabled" placeholder="请选择所属部门" auth
                      @change="onOrganizeChangeHandle" :currOrgId="dataForm.departmentId || '0'" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="工作令号" prop="workOrderNo">
                    <el-input v-model="dataForm.workOrderNo" placeholder="请输入工作令号"
                      :disabled="btnType == 'fp'||btnType == 'look'" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="来源单号" prop="sourceOrderNo">
                    <el-input v-model="dataForm.sourceOrderNo" :disabled="btnType == 'fp'||btnType == 'look'"
                      maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="订单日期" prop="orderDate">
                    <el-date-picker v-model="dataForm.orderDate" type="date" value-format="yyyy-MM-dd"
                      style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择订单日期"
                      :disabled="btnType == 'fp'||btnType == 'look'">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="客户合同号" prop="contractName">
                    <el-select v-model="dataForm.contractName" style="width: 100%;" placeholder=""
                      :disabled="btnType == 'fp'||btnType == 'look'">
                      <el-option v-for="(item, index) in contactsList" :key="index" :label="item.options"
                        :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="交货日期" prop="deliveryDate">
                    <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                      style="width: 100%;" placeholder="请选择交货日期" :disabled="btnType == 'fp'||btnType == 'look'">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="付款方式" prop="paymentMethod">
                    <el-select v-model="dataForm.paymentMethod" placeholder="请选择付款方式" clearable style="width: 100%;"
                      :disabled="btnType == 'fp'||btnType == 'look'">
                      <el-option v-for="(item, index) in paymentMethodList" :key="index" :label="item.fullName"
                        :value="item.enCode"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
          
                <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="收件人" prop="recipient">
                    <el-input v-model="dataForm.recipient" readonly :disabled="btnType == 'fp'||btnType == 'look'"
                      maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="收件人电话" prop="phone">
                    <el-input v-model="dataForm.phone" readonly :disabled="btnType == 'fp'||btnType == 'look'"
                      maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="地址" prop="address">
                    <el-input v-model="defaultAddress" readonly :disabled="btnType == 'fp'||btnType == 'look'"
                      maxlength="300" />
                  </el-form-item>
                </el-col> -->
                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" :disabled="btnType == 'fp'||btnType == 'look'" type="textarea"
                      :rows="2" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-loading="formLoading">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'fp'||btnType == 'look'" :detailed="btnType == 'fp'||btnType == 'look'"></UploadWj>
          </el-tab-pane>
          <!-- <el-tab-pane label="审批流" name="approval" v-loading="formLoading">
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { allocateOrders, getOrderDetail } from '@/api/salesManagement/assemblyOrders'
import { getCounryData, getCooperativeInfo, getCooperativeData, getBimVehicleTypeData } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getQuotationdatalist } from "@/api/salesManagement/index"
import { number } from 'echarts/lib/export'

export default {
  props: {
    customList: {
      require: true,
      type: Array
    }
  },
  data() {
    return {
      datafilelist: [],
      isdisabled: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,
      // 选择客户产品参数
      productForm: {
        drawingNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      productVisible: false,
      cusPrototal: 0,//选择客户产品分页器的总条数
      cusProductData: [],


      organizeIdTrees: [],


      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '图号', minWidth: 0 },
        { prop: 'spec', label: '规格型号', minWidth: 0 },
        { prop: 'classAttributeText', label: '产品分类', minWidth: 0 }
      ],
      attributeLines: [],
      productData: [],



      validateNumber: (rule, value, callback) => {
        const regex = /^\d{0,10}(\.\d{0,2})?$/; // 正则表达式，限制整数最多6位，小数最多4位
        if (!value || regex.test(value)) {
          callback(); // 验证通过
        } else {
          callback(new Error('请输入最多6位整数和最多4位小数')); // 验证失败
        }
      },

      listLoading: false,
      total: 0,
      treeData: [],
      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      index: null,
      expands: true,
      refreshTree: true,
      customerVisible: false,
      paymentMethodList: [],
      paymentCycleList: [],
      activeNameDetail: 'productInfo',
      coverNum: "",//用于计算
      invoicingStatusList: [
        { label: "未开票", value: "not_invoiced" },
        { label: "部分开票", value: "partial_invoicing" },
        { label: "已开票", value: "invoiced" },
      ],
      orderProduceStateList: [
        { label: "未开始", value: "not_started" },
        { label: "已排计划", value: "planned" },
        { label: "已开始生产", value: "start_production" },
        { label: "已生产完成", value: "production_completed" },

      ],
      standardFlagList: [
        { label: "是", value: true },
        { label: "否", value: false }
      ],
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],
      btnType: undefined,
      bimVehicle: [],
      areaList: [],
      provinces: [],
      cities: [],
      area: [],
      contactsList: [],
      deliveryAddressList: [],
      countryList: [],
      listQuery: {
        keyword: ''
      },
      activeName: "orderAllocation",
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        orderNo: "",
        orderType: "normal",
        orderCategory: "assembly",
        cooperativePartnerId: "",
        salesId: "",
        contractId: "",
        contractName: "",
        departmentId: "",
        workOrderNo: "",
        sourceOrderNo: "",
        orderDate: "",
        deliveryDate: "",
        shippingControl: "",
        delivery: "",
        recipient: "",
        phone: "",
        country: "",
        province: "",
        city: "",
        area: "",
        address: "",
        paymentMethod: "",
        paymentCycle: "",
        vehicleTypeCorrespondingId: "",
        vehicleTypeCorrespondingName: "",
        remark: "",
        id: "",
        cooperativePartnerName: "",
        departmentName: "",
      },
      defaultAddress: "",
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dataRule: {
        cooperativePartnerId: [
          { required: true, message: '所属客户不能为空', trigger: 'change' }
        ],
        orderType: [
          { required: true, message: '订单类型不能为空', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '所属部门不能为空', trigger: 'change' }
        ],
        salesId: [
          { required: true, message: '所属销售不能为空', trigger: 'change' }
        ],
        workOrderNo: [{ required: true, message: "请输入工作令号", trigger: 'blur' }],
        orderDate: [{ required: true, message: '订单日期不能为空', trigger: 'change' }],
        deliveryDate: [{ required: true, message: '交货日期不能为空', trigger: 'change' }],
        paymentMethod: [{ required: true, message: '付款方式不能为空', trigger: 'change' }],
        // paymentCycle: [{ required: true, message: '付款周期不能为空', trigger: 'change' }],
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
      selectArr: [],
      contactsList: [],
      productArr: [],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    this.getDictionaryType()
  },
  mounted() {
    this.initheigth()
  },
  methods: {
    initheigth(){
      const mainHeight=document.querySelector('.main').clientHeight - 170
      document.querySelector('.tableheight .el-table__body-wrapper').style.height = mainHeight + 'px'
    },
    // out,produce,purchase 外协、生产、采购
    // utilizationQuantity,productionQuantity,purchaseQuantity,outsourcingQuantity
    watchSC(row, index) {

      // 使用正则表达式验证输入内容
      row.productionQuantity = row.productionQuantity.replace(/[^\d.]/g, '');

      if (row.productionQuantity.length == 1 && row.productionQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.productionQuantity = '';
        row.assistantproductionQuantity = '';
      } else if (row.productionQuantity.length == 2 && row.productionQuantity[0] == '0' && row.productionQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.productionQuantity = row.productionQuantity.slice(0, 1) + '.' + row.productionQuantity.slice(1);
      } else if (row.productionQuantity.length > 2 && row.productionQuantity[0] == '0' && row.productionQuantity[1] != '.') {
        row.productionQuantity = row.productionQuantity.substring(1, row.productionQuantity.length)
      }
      if (row.productionQuantity.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果

        for (let i = 0; i < row.productionQuantity.length; i++) {
          const char = row.productionQuantity[i];
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

        row.productionQuantity = result;
        let arr = row.productionQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.productionQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.productionQuantity.length > 8) {
          row.productionQuantity = row.productionQuantity.substring(0, 8);
        }
      }
    },
    watchCG(row, index) {
      // 使用正则表达式验证输入内容
      row.purchaseQuantity = row.purchaseQuantity.replace(/[^\d.]/g, '');
      if (row.purchaseQuantity.length == 1 && row.purchaseQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.purchaseQuantity = '';
        row.assistantpurchaseQuantity = '';
      } else if (row.purchaseQuantity.length == 2 && row.purchaseQuantity[0] == '0' && row.purchaseQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.purchaseQuantity = row.purchaseQuantity.slice(0, 1) + '.' + row.purchaseQuantity.slice(1);
      } else if (row.purchaseQuantity.length > 2 && row.purchaseQuantity[0] == '0' && row.purchaseQuantity[1] != '.') {
        row.purchaseQuantity = row.purchaseQuantity.substring(1, row.purchaseQuantity.length)
      }
      if (row.purchaseQuantity.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.purchaseQuantity.length; i++) {
          const char = row.purchaseQuantity[i];
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
        row.purchaseQuantity = result;
        let arr = row.purchaseQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.purchaseQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.purchaseQuantity.length > 8) {
          row.purchaseQuantity = row.purchaseQuantity.substring(0, 8);
        }
      }
      if (row.productSource == "out") { }
    },
    watchKC(row, index) {
      // 使用正则表达式验证输入内容
      row.utilizationQuantity = row.utilizationQuantity.replace(/[^\d.]/g, '');
      if (row.utilizationQuantity.length == 1 && row.utilizationQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.utilizationQuantity = '';
        row.assistantutilizationQuantity = '';
      } else if (row.utilizationQuantity.length == 2 && row.utilizationQuantity[0] == '0' && row.utilizationQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.utilizationQuantity = row.utilizationQuantity.slice(0, 1) + '.' + row.utilizationQuantity.slice(1);
      } else if (row.utilizationQuantity.length > 2 && row.utilizationQuantity[0] == '0' && row.utilizationQuantity[1] != '.') {
        row.utilizationQuantity = row.utilizationQuantity.substring(1, row.utilizationQuantity.length)
      }
      if (row.utilizationQuantity.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果

        for (let i = 0; i < row.utilizationQuantity.length; i++) {
          const char = row.utilizationQuantity[i];
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

        row.utilizationQuantity = result;
        let arr = row.utilizationQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.utilizationQuantity = arr[0] + '.' + arr[1]

      } else {
        if (row.utilizationQuantity.length > 8) {
          row.utilizationQuantity = row.utilizationQuantity.substring(0, 8);
        }
      }
    },
    watchWX(row, index) {

      // 使用正则表达式验证输入内容
      row.outsourcingQuantity = row.outsourcingQuantity.replace(/[^\d.]/g, '');

      if (row.outsourcingQuantity.length == 1 && row.outsourcingQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.outsourcingQuantity = '';
        row.assistantoutsourcingQuantity = '';
      } else if (row.outsourcingQuantity.length == 2 && row.outsourcingQuantity[0] == '0' && row.outsourcingQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.outsourcingQuantity = row.outsourcingQuantity.slice(0, 1) + '.' + row.outsourcingQuantity.slice(1);
      } else if (row.outsourcingQuantity.length > 2 && row.outsourcingQuantity[0] == '0' && row.outsourcingQuantity[1] != '.') {
        row.outsourcingQuantity = row.outsourcingQuantity.substring(1, row.outsourcingQuantity.length)
      }
      if (row.outsourcingQuantity.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果

        for (let i = 0; i < row.outsourcingQuantity.length; i++) {
          const char = row.outsourcingQuantity[i];
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

        row.outsourcingQuantity = result;
        let arr = row.outsourcingQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.outsourcingQuantity = arr[0] + '.' + arr[1]

      } else {
        if (row.outsourcingQuantity.length > 8) {
          row.outsourcingQuantity = row.outsourcingQuantity.substring(0, 8);
        }
      }
    },
    handleKC(data) {
      let item = data.row, index = data.$index;
      let type = item.productSource, productArr = [];
      if (Number(item.utilizationQuantity) > Number(item.availableQuantity)) {
        this.$message({
          message: "第" + (index + 1) + "行产品的利用库存数量不能大于可用库存数量",
          type: 'error',
          duration: 1500,
        })
      } else if (Number(item.utilizationQuantity) > Number(item.num)) {
        this.$message({
          message: "第" + (index + 1) + "行产品的利用库存数量不能大于订单数量",
          type: 'error',
          duration: 1500,
        })
      }
      if (type == 'produce') {
        if (Number(item.utilizationQuantity) > Number(item.num)) {
          
          item.utilizationQuantity = 0
          item.productionQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.outsourcingQuantity)
        } else {
          item.productionQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.outsourcingQuantity)
        }
      }
      if (type == 'purchase') {
        console.log(Number(item.utilizationQuantity),Number(item.num));
        if (Number(item.utilizationQuantity) > Number(item.num)) {
          item.utilizationQuantity = 0
          item.purchaseQuantity = Number(item.num) - Number(item.outsourcingQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        } else {
          item.purchaseQuantity = Number(item.num) - Number(item.outsourcingQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        }
      }
      if (type == 'out') {
        if (Number(item.utilizationQuantity) > Number(item.num)) {
          item.utilizationQuantity = 0
          item.outsourcingQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        } else {
          item.outsourcingQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        }
      }
    },
    handleSC(data) {
      let item = data.row, index = data.$index;
      let type = item.productSource, productArr = [];
      let nums=Number(item.productionQuantity) + Number(item.purchaseQuantity) + Number(item.utilizationQuantity) + Number(item.outsourcingQuantity)
      if (type == 'purchase') {
        if (Number(item.productionQuantity) > Number(item.purchaseQuantity)&&nums>Number(item.num)) {
          this.$message({
            message:"分配合计数量不能大于订单数量！",
            type:"error"
          })
          item.productionQuantity = 0
          item.purchaseQuantity = Number(item.num) - Number(item.outsourcingQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        } else {
          item.purchaseQuantity = Number(item.num) - Number(item.outsourcingQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        }
      }
      if (type == 'out') {
        if (Number(item.productionQuantity) > Number(item.outsourcingQuantity)&&nums>Number(item.num)) {
          this.$message({
            message:"分配合计数量不能大于订单数量！",
            type:"error"
          })
          item.productionQuantity = 0
          item.outsourcingQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        } else {
          item.outsourcingQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        }
      }

    },
    handleWX(data) {
      let item = data.row, index = data.$index;
      let type = item.productSource, productArr = [];
      let nums=Number(item.productionQuantity) + Number(item.purchaseQuantity) + Number(item.utilizationQuantity) + Number(item.outsourcingQuantity)

      if (type == 'produce') {
        if (Number(item.outsourcingQuantity) > Number(item.productionQuantity)&&nums>Number(item.num)) {
          this.$message({
            message:"分配合计数量不能大于订单数量！",
            type:"error"
          })
          item.outsourcingQuantity = 0
          item.productionQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.outsourcingQuantity)
        } else {
          item.productionQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.outsourcingQuantity)
        }
      }
      if (type == 'purchase') {
        if (Number(item.outsourcingQuantity) > Number(item.purchaseQuantity)&&nums>Number(item.num)) {
          this.$message({
            message:"分配合计数量不能大于订单数量！",
            type:"error"
          })
          item.outsourcingQuantity = 0
          item.purchaseQuantity = Number(item.num) - Number(item.outsourcingQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        } else {
          item.purchaseQuantity = Number(item.num) - Number(item.outsourcingQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        }
      }
    },
    handleCG(data) {
      let item = data.row, index = data.$index;
      let type = item.productSource;
      let nums=Number(item.productionQuantity) + Number(item.purchaseQuantity) + Number(item.utilizationQuantity) + Number(item.outsourcingQuantity)
      if (type == 'produce') {
        if (Number(item.purchaseQuantity) > Number(item.productionQuantity)&&nums>Number(item.num)) {
          this.$message({
            message:"分配合计数量不能大于订单数量！",
            type:"error"
          })
          item.purchaseQuantity = 0
          item.productionQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.outsourcingQuantity)
        } else {
          item.productionQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.outsourcingQuantity)
        }
      }
      if (type == 'out') {
        if (Number(item.purchaseQuantity) > Number(item.outsourcingQuantity&&nums>Number(item.num))) {
          this.$message({
            message:"分配合计数量不能大于订单数量！",
            type:"error"
          })
          item.outsourcingQuantity = 0
          item.outsourcingQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        } else {
          item.outsourcingQuantity = Number(item.num) - Number(item.purchaseQuantity) - Number(item.utilizationQuantity) - Number(item.productionQuantity)
        }
      }
    },
    onOrganizeChangeHandle(val) {
      if (!val || !val.length) return this.dataForm.departmentId = ''
      this.dataForm.departmentId = val[val.length - 1]
    },
    // 获取合同数据
    getQuotationdatalist() {
      let orderForm = {
        pageNum: 1,
        pageSize: -1,
      };
      getQuotationdatalist(orderForm).then(res => {
        if (res.data.records.length > 0) {
          res.data.records.forEach(item => {
            item.options = item.contractNo + "/" + item.validityStart + "/" + item.validityEnd
          });
        }
        this.contactsList = res.data.records
        if (this.contactsList.length > 0) {
          this.contactsList.forEach(item => {
            if (item.id == this.dataForm.contractId) {
              this.dataForm.contractName = item.options
            }
          });
        }
      })
    },
    goBack() {
      this.$emit('close')
    },
    // 将合计行中某些列给合并
    objectSpanMethod() {
      this.$nextTick(x => {
        if (this.$refs.product.$el) {
          var current = this.$refs.product.$el
            .querySelector(".el-table__footer-wrapper")
            .querySelector(".el-table__footer");
          var cell = current.rows[0].cells;
          cell[0].style.display = "none";
          cell[1].style.display = "none";
          cell[2].style.display = "none";
          cell[3].classList.remove('is-left')
          cell[3].colSpan = "4";
        }
      })
    },
    // 合计
    getSummaries(param) {

      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '';
          return;
        } if (index === 1) {
          sums[index] = '';
          return;
        }
        if (index === 2) {
          sums[index] = '';
          return;
        }
        if (index === 3) {
          sums[index] = '';
          return;
        }
        if (index === 4) {
          sums[index] = '';
          return;
        }
        if (index >= 12) {
          sums[index] = '';
          return;
        }

        if (index === 9) {
          sums[index] = '';
          return;
        }
        if (this.btnType == 'fp'||this.btnType == 'look') {

          if (index === 6) {
            sums[index] = '';
            return;
          }
          if (index === 8) {
            sums[index] = '';
            return;
          }
          if (index === 9) {
            sums[index] = '';
            return;
          }

          if (index === 11) {
            sums[index] = '';
            return;
          }

        } else if (this.btnType == 'edit') {


          if (index === 5) {
            sums[index] = '';
            return;
          }
          if (index === 7) {
            sums[index] = '';
            return;
          }

          if (index === 10) {
            sums[index] = '';
            return;
          }


        } else {
          if (index === 2) {
            sums[index] = '';
            return;
          }
          if (index === 3) {
            sums[index] = '';
            return;
          }
          if (index === 4) {
            sums[index] = '';
            return;
          }
          if (index === 5) {
            sums[index] = '';
            return;
          }
          if (index === 7) {
            sums[index] = '';
            return;
          }
          if (index === 9) {
            sums[index] = '';
            return;
          }
          if (index === 10) {
            sums[index] = '';
            return;
          }


        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return  Number(Number(prev + curr).toFixed(2));
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' ';
        } else {
          sums[index] = '';
        }
      });
      if (this.btnType == 'edit' || this.btnType == 'add' || this.btnType == 'copy') {
        this.totalNum = sums[6]
        this.totalAssistantNum = sums[8]
        this.totalAmount = Number(sums[10]).toFixed(2)
      } else if (this.btnType == 'fp'||this.btnType == 'look') {
        this.totalNum =sums[5]
        this.totalAssistantNum =sums[7]
        this.totalAmount = Number(sums[10]).toFixed(2)
      }
      return sums;
    },

    search() {
      this.form.pageNum = 1
      this.initData()
    },
    reset() {
      this.form = {
        code: "",
        taxId: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.getcategoryTree()
    },

    // 切换table
    handleClick(tab, event) {
    },
    // 获取等级、付款方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {

        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "paymentMethod") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {

                  this.paymentMethodList = response.data.list
                })
              }
              if (resp.enCode == "paymentCycle") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.paymentCycleList = response.data.list
                })
              }

            });

          }

        });
      })
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.formLoading = true
      this.btnType = btnType
      if (btnType == 'fp'||btnType == 'look') { this.isdisabled = true }
      if (this.dataForm.id) {
        getOrderDetail(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            this.dataForm = res.data.order
            let objData = {
              "code": "",
              "createByName": "",
              "customerDrawingNo": "",
              "drawingNo": "",
              "endTime": "",
              "keyword": "",
              "name": "",
              "ncode": "",
              "nname": "",
              "orderItems": [
                {
                  "asc": true,
                  "column": ""
                }
              ],
              "pageNum": 1,
              "pageSize": -1,
              "startTime": "",
              "station": "",
              "vehicleModel": ""
            }
            if (res.data.attachmentList) {
              res.data.attachmentList.forEach((item) => {
                this.datafilelist.push(
                  {
                    name: item.document.fullName,
                    fileSize: item.document.fileSize,
                    filename: item.document.filePath,
                    id: item.document.id,
                    url: item.url
                  }
                )
              })
            }
            getBimVehicleTypeData(objData).then(res => {
              this.bimVehicle = res.data.records
              if (this.bimVehicle.length > 0) {
                this.bimVehicle.forEach(item => {
                  if (item.id == this.dataForm.vehicleTypeCorrespondingId) {

                    this.dataForm.vehicleTypeCorrespondingName = item.name
                  }
                });
              }
            })
            this.getQuotationdatalist()
            this.$forceUpdate()
            if (this.dataForm.departmentId) {
              getOrganizeInfo(this.dataForm.departmentId).then(sss => {
                this.organizeIdTrees = sss.data.organizeIdTree || []
                this.organizeIdTrees.push(this.dataForm.departmentId)
              })
            }

            if (res.data.orderLines.length > 0 && btnType == 'fp') {
              res.data.orderLines.forEach(item => {
                // out,produce,purchase 外协、生产、采购
                // utilizationQuantity,productionQuantity,purchaseQuantity,outsourcingQuantity
                if (Number(item.num) > Number(item.availableQuantity)) {
                  item.utilizationQuantity = item.availableQuantity?item.availableQuantity:0
                } else if (Number(item.num) < Number(item.availableQuantity)) {
                  item.utilizationQuantity = item.num
                } else {
                  item.utilizationQuantity = item.num
                }
                if (item.productSource == 'produce') {
                  item.productionQuantity = Number(item.num) - Number(item.utilizationQuantity)
                }
                if (item.productSource == 'out') {
                  item.outsourcingQuantity = Number(item.num) - Number(item.utilizationQuantity)
                }
                if (item.productSource == 'purchase') {
                  item.purchaseQuantity = Number(item.num) - Number(item.utilizationQuantity)
                }
              });
            }else if(res.data.orderLines.length > 0 && btnType == 'look' && this.dataForm.distributeStatus == "undistributed"){
              res.data.orderLines.forEach(item=>{
                item.utilizationQuantity=''
                item.productionQuantity=''
                item.purchaseQuantity=''
                item.outsourcingQuantity=''
              })
            }
            let a = res.data.orderLines.filter(row => {
              return row.shipmentStatus !== 'stopped'
            })
            this.productData = a
            this.productArr = Array.from(a);
            this.formLoading = false
          })
        })
      } else { this.formLoading = false }
    },
    goBack() {
      this.$emit('close')
    },
    onOrganizeChange(val, data) {
      this.dataForm.partnerCategoryId = data ? data[0].id : ''
      this.dataForm.partnerCategoryIdText = data ? data[0].name : ''
    },
    extractSameKeys(obj1, obj2) {
      const newObj = {};
      for (let key in obj1) {
        if (obj2.hasOwnProperty(key)) {
          newObj[key] = obj2[key];
        }
      }
      return newObj;
    },
    groupById(arr) {
      let idMap = new Map();
      for (let item of arr) {
        if (idMap.has(item.productsId)) {
          idMap.get(item.productsId).push(item);
        } else {
          idMap.set(item.productsId, [item]);
        }
      }
      return Array.from(idMap.values());
    },
    handleConfirm(value) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let submitFlag = null;
          let f = {};
          this.customList.forEach(item => {
            f[item.prop] = ""
          })
          this.dataForm.documentStatus = value
          let obj = {
            order: this.dataForm,
            attributeLines: this.attributeLines,
            orderLines: [],
          }
          if (this.productData.length < 1) {
            submitFlag = false
            this.$message({
              message: "请选择产品",
              type: 'error',
              duration: 1500,
            })
            return
          } else {
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
                submitFlag = false
                this.$message({
                  message: "请输入第" + (index + 1) + "行产品的数量",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (!item.deliveryDate) {
                submitFlag = false
                this.$message({
                  message: "请选择第" + (index + 1) + "行产品的交货日期",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (item.utilizationQuantity==="") {
                submitFlag = false
                this.$message({
                  message: "请输入第" + (index + 1) + "行产品的利用库存数量",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (item.productionQuantity==="") {
                submitFlag = false
                this.$message({
                  message: "请输入第" + (index + 1) + "行产品的需生产数量",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (item.purchaseQuantity==="") {
                submitFlag = false
                this.$message({
                  message: "请输入第" + (index + 1) + "行产品的需采购数量",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (item.outsourcingQuantity==="") {
                submitFlag = false
                this.$message({
                  message: "请输入第" + (index + 1) + "行产品的需外协数量",
                  type: 'error',
                  duration: 1500,
                })
                break
              }

              if (Number(item.utilizationQuantity) > Number(item.availableQuantity)) {
                submitFlag = false
                this.$message({
                  message: "第" + (index + 1) + "行产品的利用库存数量不可大于可用库存数量",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              // 判断每条数据的产品类型 如果是生产，则利用库存量+采购量+外协量不能超过生产量
              if (item.productSource == 'produce') {
                if (Number(item.productionQuantity) < 0) {
                  submitFlag = false
                  this.$message({
                    message: "第" + (index + 1) + "行产品的利用库存量、采购量、外协量之和不能超过生产量",
                    type: 'error',
                    duration: 1500,
                  })
                  break
                }
              }
              if (item.productSource == 'out') {
                if (Number(item.outsourcingQuantity) < 0) {
                  submitFlag = false
                  this.$message({
                    message: "第" + (index + 1) + "行产品的利用库存量、采购量、生产量之和不能超过外协量",
                    type: 'error',
                    duration: 1500,
                  })
                  break
                }
              }
              if (item.productSource == 'purchase') {
                if (Number(item.purchaseQuantity) < 0) {
                  submitFlag = false
                  this.$message({
                    message: "第" + (index + 1) + "行产品的利用库存量、外协量、生产量之和不能超过采购量",
                    type: 'error',
                    duration: 1500,
                  })
                  break
                }
              }
              // if(Number(item.))
              if (value != 'draft') {
                if (!item.price) {
                  submitFlag = false
                  this.$message({
                    message: "第" + (index + 1) + "行产品的单价不能为空",
                    type: 'error',
                    duration: 1500,
                  })
                  break
                }
              }
            }
            let result = this.groupById(this.productData);
            for (let index = 0; index < result.length; index++) {
              const item = result[index];
              if (item.length > 1) {
                let num = 0;
                for (let i = 0; i < item.length; i++) {
                  const element = item[i];
                  num += Number(element.utilizationQuantity)
                  if (num > element.availableQuantity) {
                    submitFlag = false
                    this.$message({
                      message: "存在相同的产品："+element.productName+",且利用库存数量之和大于可用库存",
                      type:"error"
                    })
                    break
                  }
                }
              }
            }
            console.log(result);
            this.productData.forEach(item => {

              let objs = {
                line: {},
                values: {}
              };
              objs.line = item
              objs.values = this.extractSameKeys(f, item,)
              objs.values['orderAttributeType'] = 'sale_order'
              obj.orderLines.push(objs)
            });
          }
          if (submitFlag === false) return
          this.btnLoading = true
          allocateOrders(obj).then(res => {

            this.$message({
              message: "分配成功",
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

        }
      })
    },
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ""
      if (cellValue.includes(":")) {
        return cellValue.replace(/:(.*?)(,|$)/g, "$2");
      } else {
        return cellValue;
      }
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep.main {
  padding: 0px 30px 10px;

  .el-tabs__header {
    padding-left: 0 !important;
  }
}

::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

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

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}

.required {
  color: red;
  margin-right: 4px;
}
::v-deep .el-table__body-wrapper{
  height: 969px;
  overflow-y: auto;
}
</style>