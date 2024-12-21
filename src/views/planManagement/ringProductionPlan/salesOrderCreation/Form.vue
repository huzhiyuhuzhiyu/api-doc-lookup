<template>
  <transition name="el-zoom-in-center">
    <div>
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack"
            :content="btnType == 'add' ? '新建计划' : btnType == 'edit' ? '编辑计划' : btnType == 'look' ? '查看计划' : '新建计划'" />
          <div class="options">
            <el-button type="success" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('draft')">
              保存草稿</el-button>
            <el-button type="primary" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('submit')">
              保存并提交</el-button>
            <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">

          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础信息" name="orderInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-form ref="dataForm" :model="planForm" :rules="dataRule" label-width="160px" label-position="top"
                    key="555">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="计划单号" prop="planNo">
                          <el-input v-model="planForm.planNo" placeholder="请输入计划单号"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                            maxlength="300" />
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="计划类型" prop="planType">
                          <el-select v-model="planForm.planType" placeholder="请选择计划类型" clearable style="width: 100%;"
                            disabled>
                            <el-option v-for="(item, index) in planTypeList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="产品编码" prop="productCode">
                          <el-input v-model="planForm.productCode" placeholder="请输入产品编码" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="isProductNameSwitch == 1">
                        <el-form-item label="产品名称" prop="productName">
                          <el-input v-model="planForm.productName" placeholder="请输入产品名称" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="品名规格" prop="productDrawingNo">
                          <el-input v-model="planForm.productDrawingNo" placeholder="请输入品名规格" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                 



                      <el-col :sm="6" :xs="24">
                        <el-form-item label="产品来源" prop="productSource">
                          <el-select v-model="planForm.productSource" placeholder="产品来源" clearable style="width: 100%;"
                            disabled>
                            <el-option v-for="(item, index) in productSourceList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="BOM" prop="bomId">

                          <el-input v-model="planForm.bomText" placeholder="请输入是否有BOM" disabled v-if="!planForm.bomId">
                          </el-input>
                          <el-input class="BOM_T" style="color: #3fb9f8;" @focus="lookBom(planForm)"
                            v-model="planForm.productDrawingNo" placeholder="请输入是否有BOM" readonly v-else>
                          </el-input>
                          <!-- <el-tooltip class="item" effect="dark" :content="planForm.productDrawingNo"
                            placement="top-start" v-else>
                            <div style="color: #3fb9f8;" class="drawingNo" @click="lookBom(planForm)">{{ planForm.productDrawingNo }}</div>
                          </el-tooltip> -->

                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="计划日期" prop="planDate" style="margin-bottom: 20px;">
                          <el-date-picker v-model="planForm.planDate" type="daterange" value-format="yyyy-MM-dd"
                            :disabled='btnType == "look"' style="width: 100%;" start-placeholder="开始日期"
                            end-placeholder="结束日期" clearable>
                          </el-date-picker>
                        </el-form-item>
                      </el-col>




                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单位" prop="mainUnit">

                          <el-input v-model="planForm.mainUnit" placeholder="请输入单位" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <!-- <el-col :sm="6" :xs="24" v-if="btnType != 'look'">
                        <el-form-item label="可用库存数量" prop="availableQuantity">

                          <el-input v-model="planForm.availableQuantity" placeholder="请输入可用库存数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col> -->
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="需求数量" prop="planQuantity">

                          <el-input v-model="planForm.planQuantity" placeholder="请输入计划数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="合格率" prop="qualificationRate">
                          <el-input v-model="planForm.qualificationRate" placeholder="请输入合格率"
                            :disabled='btnType == "look"' oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                            @blur="watchRate(planForm.qualificationRate)">
                            <template slot="append">
                              <div>%</div>
                            </template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="宽放需求数量" prop="relaxQuantity">

                          <el-input v-model="planForm.relaxQuantity" placeholder="请输入宽放计划数量"
                            :disabled='btnType == "look"' @blur="watchkF"
                            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="planForm.remark" placeholder="请输入备注"
                            :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2" maxlength="200" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="24" :xs="24" class="special">
                        <div style="padding: 0 15px ;background-color: azure;">
                          <el-form-item label="下达数量">
                            <span class="lab_t" style="margin-left: 0">利用库存数量</span>
                            <el-input class="ipt1" v-model="planForm.utilizationQuantity" @blur="watchly"
                              placeholder="利用库存数量" :disabled='btnType == "look"'
                              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')">
                            </el-input>

                            <span class="lab_t" v-if="btnType != 'look'">可用库存数量</span>
                            <span v-if="btnType != 'look'" class="pointer" @click="viewAvailableQuantity()">{{
                              planForm.availableQuantity
                            }}</span>

                            <span
                              :style="planForm.productSource == 'assemble' || planForm.productSource == 'produce' ? 'background:#3fb9f8;color:#fff' : ''"
                              class="lab_t">生产数量</span>
                            <el-input class="ipt2" v-model="planForm.productionQuantity" @blur="watchProduce"
                              placeholder="生产数量"
                              :disabled='btnType == "look" || planForm.productSource == "assemble" || planForm.productSource == "produce"'
                              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>

                            <span :style="planForm.productSource == 'purchase' ? 'background:#3fb9f8;color:#fff' : ''"
                              class="lab_t">采购数量</span>
                            <el-input class="ipt3" v-model="planForm.purchaseQuantity" @blur="watchcg"
                              placeholder="采购数量" :disabled='btnType == "look" || planForm.productSource == "purchase"'
                              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>

                            <span :style="planForm.productSource == 'out' ? 'background:#3fb9f8;color:#fff' : ''"
                              class="lab_t">外协数量</span>
                            <el-input class="ipt4" v-model="planForm.outsourcingQuantity" @blur="watchOut
                              " placeholder="外协数量" :disabled='btnType == "look" || planForm.productSource == "out"'
                              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>

                          </el-form-item>
                        </div>
                      </el-col>


                    </el-row>


                  </el-form>
                </el-collapse-item>



                <el-collapse-item title="产品信息" name="productInfo">
                  <div style="height:530px;display:flex;" ref="boxresiz">
                    <el-table ref="product" :data="productData" :fixedNO="false" border height="100%" :key="191"
                      style="width: 100%;height:100%">
                      <el-table-column type="index" width="60" label="序号" :key="10"></el-table-column>
                      <el-table-column prop="ordersNo" label="订单号" width="160" :key="1212"
                        v-if="planForm.planType == 'order_plan'"></el-table-column>
                      <el-table-column prop="cooperativePartnerName" show-overflow-tooltip label="客户名称" min-width="180"
                        v-if="planForm.planType == 'order_plan'" :key="6">
                      </el-table-column>
                      <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                        show-overflow-tooltip></el-table-column>
                      <el-table-column prop="productDrawingNo" label="品名规格" min-width="360" :key="4"
                        show-overflow-tooltip />
                      <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                      <el-table-column prop="deliveryDate" label="交货日期" width="150"
                        v-if="planForm.planType == 'order_plan'" :key="8" />
                      <el-table-column prop="mainUnit" label="单位" width="100" :key="121"></el-table-column>
                      <el-table-column prop="planQuantity" label="计划数量" width="100" :key="7"
                        v-if="planForm.planType == 'safety_stock_plan' || planForm.planType == 'add_plan'">
                        <template slot-scope="scope">
                          <el-input placeholder="计划数量'" v-if="btnType != 'look'" @blur="watchPlanQuantity(scope.row)"
                            v-model="scope.row.planQuantity"
                            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                          <div v-else>{{ scope.row.planQuantity }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="planQuantity" label="订单数量" width="100" :key="110"
                        v-if="planForm.planType == 'order_plan'">
                        <template slot-scope="scope">
                          <el-input placeholder="订单数量'" v-if="btnType != 'look'" @blur="watchPlanQuantity(scope.row)"
                            v-model="scope.row.planQuantity"
                            oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
                          <div v-else>{{ scope.row.planQuantity }}</div>
                        </template>
                      </el-table-column>

                      <el-table-column prop="remark" label="备注" width="200" :key="128"></el-table-column>
                    </el-table>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
              <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- <productForm v-if="productFormVisible" ref="productForm" @refresh="refresh" /> -->
      <BomForm v-if="bomFormVisible" ref="bomForm" @refreshDataList="initData" @close="closeForm" />
      <Form v-if="formVisible" ref="form"></Form>
    </div>
  </transition>
</template>

<script>
// import productForm from "./productForm"
import { getProductInventory } from '@/api/plan/index.js'
import BomForm from "@/views/basicData/bomSettings/productionBom/Form.vue"
import {
  getProvinceList,
} from '@/api/system/province'
import { getbomOrderDetail } from '@/api/salesManagement/assemblyOrders'
import { BillNumber } from '@/api/system/billRule'
import { addPlanList, updatePlanList } from '@/api/calculationList/calculationList.js'
import Form from '../../assemblyPlan/salesOrderCreation/invent.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { getBimBusinessDetail } from '@/api/basicData/index'
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],

  components: {
    BomForm,
    Form
  },
  data() {
    return {
      formVisible: false,
      isattachmentswitch: '',

      bomFormVisible: false,
      planTypeList: [
        { label: "订单生成计划", value: "order_plan" },
        { label: "直接创建计划", value: "add_plan" },
        { label: "安全库存创建计划", value: "safety_stock_plan" },
      ],
      planForm: {
        planNo: "",
        planType: "order_plan",
        productDrawingNo: "",
        productName: "",
        productCode: "",
        bomId: "",
        bomText: "",
        planDate: [],
        planStartDate: "",
        planEndDate: "",
        mainUnit: "",
        availableQuantity: "",
        planQuantity: "",
        qualificationRate: 100,
        relaxQuantity: 0,
        purchaseQuantity: 0,
        outsourcingQuantity: 0,
        productionQuantity: 0,
        utilizationQuantity: "",
        finalPlanQuantity: "",
        remark: "",
        id: "",
      },
      codeConfig: {},//单据规则配置
      activeName: "orderInfo",
      btnText: "",
      activeNames: ["productInfo", "basicInfo"],
      btnType: undefined,
      productData: [],

      datafilelist: [],



      validateNumber: (rule, value, callback) => {
        const regex = /^\d{0,10}(\.\d{0,2})?$/; // 正则表达式，限制整数最多6位，小数最多4位
        if (!value || regex.test(value)) {
          callback(); // 验证通过
        } else {
          callback(new Error('请输入最多6位整数和最多4位小数')); // 验证失败
        }
      },
      productSourceList: [
        { label: '组装', value: 'assemble' },
        { label: '生产', value: 'produce' },
        { label: '采购', value: 'purchase' },
        { label: '外协', value: 'out' }
      ],






      bimVehicle: [],
      areaList: [],
      provinces: [],
      cities: [],
      area: [],
      deliveryAddressList: [],
      countryList: [],
      listQuery: {
        keyword: ''
      },
      salesList: [],
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      createOrderType: 'normal',

      defaultAddress: "",
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dataRule: {
        planDate: [
          { required: true, message: '计划日期不能为空', trigger: 'change' }
        ],

        qualificationRate: [
          { required: true, message: '合格率不能为空', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '部门不能为空', trigger: 'no' }

        ],
        salesName: [
          { required: true, message: '所属销售不能为空', trigger: 'change' }
        ],
        workplanNo: [{ required: true, message: "请输入工作令号", trigger: 'blur' }],
        planNo: [{ required: true, message: "请输入订单号", trigger: 'blur' }],
        orderDate: [{ required: true, message: '订单日期不能为空', trigger: 'change' }],
        deliveryDate: [{ required: true, message: '交货日期不能为空', trigger: 'change' }],
        // paymentMethod: [{ required: true, message: '付款方式不能为空', trigger: 'change' }],
        // paymentCycle: [{ required: true, message: '付款周期不能为空', trigger: 'change' }],

      },
      isProjectSwitch: "",
      isProjectSwitchFlag: null,
      projectIdDataList: [],
      isProductNameSwitch: '',

      originalData: [],
    }
  },


  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

  },

  async created() {
    await this.getProjectList()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')

    this.isProjectSwitchFlag = true

  },
  mounted() {
    this.getBimBusinessDetail()
  },
  beforeDestroy() {
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },

    // 查看库存信息
    viewAvailableQuantity() {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.form.init(this.productData[0].productsId, 'availableFlag', false, this.productData[0].projectId)
      })
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_plan'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
      })
    },
    lookBom(data) {
      console.log(data);
      this.bomFormVisible = true
      this.$nextTick(() => {
        this.$refs.bomForm.init(data.bomId, 'look')
      })
    },
    closeForm() {
      this.bomFormVisible = false
    },
    // 监听列表计划数量/订单数量修改
    watchPlanQuantity(data) {
      console.log(data);
      this.planForm.planQuantity = data.planQuantity
      this.planForm.relaxQuantity = Math.ceil(this.jnpf.numberFormat(this.jnpf.math('multiply', [100, this.jnpf.numberFormat(this.jnpf.math('divide', [this.planForm.planQuantity, this.planForm.qualificationRate]), 6)]), 6))
      // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
      this.planForm.finalPlanQuantity = this.planForm.productionQuantity
    },
    // 合格率
    // relaxQuantity 宽放 
    // purchaseQuantity 采购
    // utilizationQuantity 利用
    // finalPlanQuantity 最终
    // 宽放=计划/合格率  向上取整
    // 最终=宽放-采购-利用
    watchRate(val) {
      console.log(val);
      if (Number(val) > 100) {
        this.$message.error("合格率最大只能输入100")
        this.planForm.qualificationRate = 100
        this.planForm.relaxQuantity = Math.ceil(this.jnpf.numberFormat(this.jnpf.math('multiply', [100, this.jnpf.numberFormat(this.jnpf.math('divide', [this.planForm.planQuantity, this.planForm.qualificationRate]), 6)]), 6))

        this.countFun1()
        // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
      } else if (1 <= Number(val) <= 100) {
        this.planForm.relaxQuantity = Math.ceil(this.jnpf.numberFormat(this.jnpf.math('multiply', [100, this.jnpf.numberFormat(this.jnpf.math('divide', [this.planForm.planQuantity, this.planForm.qualificationRate]), 6)]), 6))

        this.countFun1()
        // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
      }

    },
    // 宽放数量  监听
    watchkF(val) {
      if (!this.planForm.relaxQuantity) {
        this.$message.error("宽放数量不能为空")
        this.planForm.relaxQuantity = Math.ceil(this.jnpf.numberFormat(this.jnpf.math('multiply', [100, this.jnpf.numberFormat(this.jnpf.math('divide', [this.planForm.planQuantity, this.planForm.qualificationRate]), 6)]), 6))
        // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
        this.countFun1()
      } else {
        let total = this.jnpf.numberFormat(this.jnpf.math('add', [this.planForm.purchaseQuantity, this.planForm.utilizationQuantity, this.planForm.outsourcingQuantity, this.planForm.productionQuantity]), 6)
        if (Number(total) > Number(this.planForm.relaxQuantity)) this.$message.error("采购数量、外协数量、生产数量、利用库存数量之和不能超过宽放数量")
        this.countFun1()
      }
    },



    countFun1() {

      if (this.planForm.productSource == 'assemble' || this.planForm.productSource == 'produce') {
        this.planForm.purchaseQuantity = 0
        this.planForm.outsourcingQuantity = 0
        if (this.planForm.availableQuantity >= this.planForm.relaxQuantity) {
          this.planForm.utilizationQuantity = this.planForm.relaxQuantity
          this.planForm.finalPlanQuantity = this.planForm.productionQuantity = 0
        } else {
          this.planForm.utilizationQuantity = this.planForm.availableQuantity
          this.planForm.finalPlanQuantity = this.planForm.productionQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.utilizationQuantity, this.planForm.outsourcingQuantity, this.planForm.purchaseQuantity]))
        }
        if (this.planForm.utilizationQuantity < 0) {
          this.planForm.utilizationQuantity = 0
          this.planForm.finalPlanQuantity = this.planForm.productionQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.outsourcingQuantity, this.planForm.utilizationQuantity]), 6)
        }
      }

      if (this.planForm.productSource == 'purchase') {
        this.planForm.finalPlanQuantity = this.planForm.productionQuantity = 0
        this.planForm.outsourcingQuantity = 0
        if (this.planForm.availableQuantity >= this.planForm.relaxQuantity) {
          this.planForm.utilizationQuantity = this.planForm.relaxQuantity
          this.planForm.purchaseQuantity = 0
        } else {
          this.planForm.utilizationQuantity = this.planForm.availableQuantity
          this.planForm.purchaseQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.utilizationQuantity, this.planForm.outsourcingQuantity, this.planForm.productionQuantity]))
        }
        if (this.planForm.utilizationQuantity < 0) {
          this.planForm.utilizationQuantity = 0
          this.planForm.purchaseQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.outsourcingQuantity, this.planForm.utilizationQuantity]), 6)
        }
      }
      if (this.planForm.productSource == 'out') {
        this.planForm.finalPlanQuantity = this.planForm.productionQuantity = 0
        this.planForm.purchaseQuantity = 0
        if (this.planForm.availableQuantity >= this.planForm.relaxQuantity) {
          this.planForm.utilizationQuantity = this.planForm.relaxQuantity
          this.planForm.outsourcingQuantity = 0
        } else {
          this.planForm.utilizationQuantity = this.planForm.availableQuantity
          this.planForm.outsourcingQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.utilizationQuantity, this.planForm.purchaseQuantity, this.planForm.productionQuantity]))
        }
        if (this.planForm.utilizationQuantity < 0) {
          this.planForm.utilizationQuantity = 0
          this.planForm.outsourcingQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
        }
      }

    },
    countFun2() {

      if (this.planForm.productSource == 'assemble' || this.planForm.productSource == 'produce') {

        if (this.planForm.availableQuantity >= this.planForm.relaxQuantity) {
          this.planForm.utilizationQuantity = this.planForm.relaxQuantity
          this.planForm.finalPlanQuantity = this.planForm.productionQuantity = 0
        } else {
        }
        this.planForm.utilizationQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.outsourcingQuantity, this.planForm.purchaseQuantity]))
        if (this.planForm.utilizationQuantity < 0) {
          this.planForm.utilizationQuantity = 0
          this.planForm.finalPlanQuantity = this.planForm.productionQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.outsourcingQuantity, this.planForm.utilizationQuantity]), 6)
        }
      }

      if (this.planForm.productSource == 'purchase') {

        if (this.planForm.availableQuantity >= this.planForm.relaxQuantity) {
          this.planForm.utilizationQuantity = this.planForm.relaxQuantity
          this.planForm.purchaseQuantity = 0
        } else {
          this.planForm.utilizationQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.outsourcingQuantity, this.planForm.purchaseQuantity]))
        }
        if (this.planForm.utilizationQuantity < 0) {
          this.planForm.utilizationQuantity = 0
          this.planForm.purchaseQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.outsourcingQuantity, this.planForm.utilizationQuantity]), 6)
        }
      }
      if (this.planForm.productSource == 'out') {

        if (this.planForm.availableQuantity >= this.planForm.relaxQuantity) {
          this.planForm.utilizationQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.purchaseQuantity, this.planForm.outsourcingQuantity]))
          this.planForm.outsourcingQuantity = 0
        } else {
        }
        this.planForm.utilizationQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.purchaseQuantity, this.planForm.outsourcingQuantity]))
        if (this.planForm.utilizationQuantity < 0) {
          this.planForm.utilizationQuantity = 0
          this.planForm.outsourcingQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
        }
      }

    },
    // 采购数量监听
    watchcg(val) {
      let Nums = this.jnpf.numberFormat(this.jnpf.math('add', [this.planForm.purchaseQuantity, this.planForm.outsourcingQuantity, this.planForm.productionQuantity, this.planForm.utilizationQuantity]), 6)
      if (Number(this.planForm.purchaseQuantity) > Number(this.planForm.relaxQuantity)) {
        this.$message.error("采购数量不能超过宽放数量")
        this.planForm.purchaseQuantity = 0
        // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
        this.countFun2()
        return
      } else {
        if (Nums > Number(this.planForm.relaxQuantity)) this.$message.error("采购数量、外协数量、生产数量、利用库存数量之和不能超过宽放数量")
        this.countFun2()
      }

    },
    // 外协数量监听
    watchOut(val) {
      let Nums = this.jnpf.numberFormat(this.jnpf.math('add', [this.planForm.purchaseQuantity, this.planForm.outsourcingQuantity, this.planForm.productionQuantity, this.planForm.utilizationQuantity]), 6)
      if (Number(this.planForm.outsourcingQuantity) > Number(this.planForm.relaxQuantity)) {
        this.$message.error("外协数量不能超过宽放数量")
        this.planForm.outsourcingQuantity = 0
        // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
        this.countFun2()
        return
      } else {
        if ((Nums > Number(this.planForm.relaxQuantity))) this.$message.error("采购数量、外协数量、生产数量、利用库存数量之和不能超过宽放数量")
        this.countFun2()
      }
    },
    // 生产数量监听
    watchProduce(val) {
      let Nums = this.jnpf.numberFormat(this.jnpf.math('add', [this.planForm.purchaseQuantity, this.planForm.outsourcingQuantity, this.planForm.productionQuantity, this.planForm.utilizationQuantity]), 6)
      if (Number(this.planForm.productionQuantity) > Number(this.planForm.relaxQuantity)) {
        this.$message.error("生产数量不能超过宽放数量")
        this.planForm.productionQuantity = 0
        // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
        this.countFun2()
        return
      } else {
        if ((Nums > Number(this.planForm.relaxQuantity))) this.$message.error("采购数量、外协数量、生产数量、利用库存数量之和不能超过宽放数量")
        this.countFun2()
      }
    },

    // 利用数量监听
    watchly(val) {
      let total = this.jnpf.numberFormat(this.jnpf.math('add', [this.planForm.purchaseQuantity, this.planForm.utilizationQuantity, this.planForm.outsourcingQuantity, this.planForm.productionQuantity]), 6)
      if (Number(this.planForm.utilizationQuantity) > Number(this.planForm.availableQuantity)) {
        this.$message.error("利用库存数量不能超过可用库存数量")
        if (this.planForm.availableQuantity) this.planForm.utilizationQuantity = 0
        if (this.planForm.availableQuantity >= this.planForm.relaxQuantity) this.planForm.utilizationQuantity = this.planForm.relaxQuantity
        else this.planForm.utilizationQuantity = this.planForm.availableQuantity


      }
      else if (Number(this.planForm.utilizationQuantity) > Number(this.planForm.relaxQuantity)) {
        this.$message.error("利用库存数量不能超过宽放数量")
        this.planForm.utilizationQuantity = 0
        this.countFun2()

        // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
        return
      }
      if (Number(total) > Number(this.planForm.relaxQuantity)) {
        this.$message.error("采购数量、外协数量、生产数量、利用库存数量之和不能超过宽放数量")
        this.planForm.utilizationQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.outsourcingQuantity, this.planForm.purchaseQuantity]))
        // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
      } else {
        if (this.planForm.productSource == 'assemble' || this.planForm.productSource == 'produce') {


          this.planForm.finalPlanQuantity = this.planForm.productionQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.outsourcingQuantity, this.planForm.utilizationQuantity]), 6)
        }

        if (this.planForm.productSource == 'purchase') {


          this.planForm.purchaseQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.outsourcingQuantity, this.planForm.utilizationQuantity]), 6)
        }
        if (this.planForm.productSource == 'out') {


          this.planForm.outsourcingQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.productionQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
        }
      }
    },



    validateInput(value) {
      // 使用正则表达式来匹配正整数  
      const reg = /^\d*$/; // 或者用 /^\d+$/ 来匹配至少一位数字  
      if (value === '' || reg.test(value)) {
        this.inputValue = value; // 只有当输入符合条件时才更新  
      } else {
        this.inputValue = this.inputValue; // 保持原值不变  
      }
    },


    // 切换table
    handleClick(tab, event) {
      console.log("tab", tab);
      if (tab.index == 0) {
        this.$nextTick(() => {
        })
      } else if (tab.name == "schedule") {
        this.switchStyleheight()
        this.scheduleForm = JSON.parse(JSON.stringify(this.scheduleForm1))
        this.resetDetail()
      }
    },

    resetDetail() {
      this.scheduleForm = JSON.parse(JSON.stringify(this.scheduleForm1))
      this.scheduleForm.pageNum = 1
      this.searchDetail()
    },
    switchStyleheight() {
      const mainRegion = this.$refs.orderInfos.$parent.$parent.$el // 表单页面区域
      const mainHeight = mainRegion.clientHeight;
      const TableFormTitle = mainRegion.querySelector('.TableForm_title') // 获取TableForm头部操作栏
      const TableFormTitleHeight = TableFormTitle ? TableFormTitle.clientHeight : 0
      let maxHeight = mainHeight - TableFormTitleHeight - 65 - 154
      maxHeight = maxHeight > 500 ? maxHeight : 500
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100);
      };
    },




    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        this.planForm.planNo = data.number

      } catch (error) {
      }
    },

    init(id, btnType, productData, planType) {
      console.log("传递过来的数据", id, btnType, productData, planType);
      this.planForm.id = id || ''
      this.btnType = btnType
      this.planForm.planType = planType

      if (this.btnType == 'add') {

        this.fetchData("JHDH")
        let obj = {
          productsId: productData[0].productsId,
          accuracyLevel: productData[0].accuracyLevel,
          clearance: productData[0].clearance,
          oil: productData[0].oil,
          productDrawingNo: productData[0].drawingNo,
          sealingCoverTyping: productData[0].sealingCoverTyping,
          vibrationLevel: productData[0].vibrationLevel,
          packagingMethod: productData[0].packagingMethod,
          specialRequire: productData[0].specialRequire,
        };
        this.planForm.bomId = productData[0].bomId
        if (productData[0].bomId) {
          this.planForm.bomText = productData[0].drawingNo
        } else {
          this.planForm.bomText = "无BOM"

        }

        this.planForm.planQuantity = productData.reduce((acc, item) => {
          return acc + Number(item.num); // 使用 Number() 将字符串转换为数字  
        }, 0);

        this.planForm.productDrawingNo = productData[0].drawingNo
        this.planForm.productName = productData[0].productName
        this.planForm.productCode = productData[0].productCode
        this.planForm.mainUnit = productData[0].mainUnit
        this.planForm.productName = productData[0].productName
        this.planForm.productSource = productData[0].productSource

        productData.forEach(item => {
          item.productDrawingNo = item.drawingNo
          item.ordersNo = item.orderNo
          this.$set(item, 'planQuantity', item.num)
        });
        console.log(obj);
        this.productData = productData
        this.originalData = JSON.parse(JSON.stringify(productData))

        getProductInventory(obj).then(res => {
          console.log("产品库存", res);
          this.planForm.availableQuantity = res.data.availableQuantity
          this.planForm.relaxQuantity = this.jnpf.numberFormat(this.jnpf.math('multiply', [100, this.jnpf.numberFormat(this.jnpf.math('divide', [this.planForm.planQuantity, this.planForm.qualificationRate]), 6)]), 6)

          if (this.planForm.availableQuantity > this.planForm.relaxQuantity) {
            this.planForm.utilizationQuantity = JSON.parse(JSON.stringify(this.planForm.relaxQuantity))
          } else {
            this.planForm.utilizationQuantity = JSON.parse(JSON.stringify(this.planForm.availableQuantity))
          }
          this.countFun1()

          // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
        })
      }
      if (btnType == 'edit' || btnType == 'look') {

        if (planType == 'order_plan') {
          this.planForm.planQuantity = productData.planLineList.reduce((acc, item) => {
            return acc + Number(item.num); // 使用 Number() 将字符串转换为数字  
          }, 0);
        } else {
          this.planForm.planQuantity = productData.plan.planQuantity
        }
        // { label: "订单生成计划", value: "order_plan" },
        // { label: "直接创建计划", value: "add_plan " },
        // { label: "安全库存创建计划", value: "safety_stock_plan" },
        this.planForm = productData.plan
        this.$set(this.planForm, 'planDate', [])
        this.planForm.planDate.push(productData.plan.planStartDate)
        this.planForm.planDate.push(productData.plan.planEndDate)
        if (productData.plan.bomId) {
          this.planForm.bomText = productData.plan.productDrawingNo
        } else {
          this.planForm.bomText = "无BOM"

        }


        productData.planLineList.forEach(item => {
          item.accuracyLevel = productData.plan.accuracyLevel
          item.clearance = productData.plan.clearance
          item.oil = productData.plan.oil
          item.productDrawingNo = productData.plan.productDrawingNo
          item.sealingCoverTyping = productData.plan.sealingCoverTyping
          item.vibrationLevel = productData.plan.vibrationLevel
          item.mainUnit = productData.plan.mainUnit
          if (planType == 'order_plan') {
            console.log(777);
            this.$set(item, 'planQuantity', item.ordersNum)
          } else {
            console.log(666);
            this.$set(item, 'planQuantity', this.planForm.planQuantity)

          }
          item.cooperativePartnerName = item.partnerName
          this.productData.push(item)
        })

        console.log("productData", this.productData);


        let obj = {
          productsId: productData.plan.productsId,
          accuracyLevel: productData.plan.accuracyLevel,
          clearance: productData.plan.clearance,
          oil: productData.plan.oil,
          productDrawingNo: productData.plan.productDrawingNo,
          sealingCoverTyping: productData.plan.sealingCoverTyping,
          vibrationLevel: productData.plan.vibrationLevel,

        };
        if (this.btnType == 'edit') {
          getProductInventory(obj).then(res => {
            console.log("产品库存", res);
            this.planForm.availableQuantity = res.data.availableQuantity
            this.planForm.relaxQuantity = this.jnpf.numberFormat(this.jnpf.math('multiply', [100, this.jnpf.numberFormat(this.jnpf.math('divide', [this.planForm.planQuantity, this.planForm.qualificationRate]), 6)]), 6)

            if (this.planForm.availableQuantity > this.planForm.relaxQuantity) {
              this.planForm.utilizationQuantity = JSON.parse(JSON.stringify(this.planForm.relaxQuantity))
            } else {
              this.planForm.utilizationQuantity = JSON.parse(JSON.stringify(this.planForm.availableQuantity))
            }
            this.countFun1()

            // this.planForm.finalPlanQuantity = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.planForm.relaxQuantity, this.planForm.purchaseQuantity, this.planForm.utilizationQuantity]), 6)
          })
        }

      }
    },

    goBack() {
      this.$emit('close', true)
    },



    handleConfirm(value) {

      console.log(this.productData);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          let submitFlag = null;


          this.planForm.documentStatus = value
          let obj = {
            planLineList: [],
            plan: {},
          }
          let arr = []
          if (!this.productData.length) return this.$message.error("产品信息至少需要一条数据")
          this.productData.forEach(item => {
            let objs = {
              cooperativePartnerId: item.cooperativePartnerId,
              ordersId: item.ordersId,
              ordersLineId: item.id,
              productsId: item.productsId,
              planId: item.planId || null,
              pairingModeId: item.pairingModeId,
            }
            if (this.btnType != 'look') {
              objs.id = item.id
            }
            arr.push(objs)
          });
          obj.planLineList = arr
          if (!obj.planLineList.length) return
          if (this.btnType == 'add') {
            obj.plan.documentStatus = value
            obj.plan.finalPlanQuantity = this.planForm.productionQuantity
            obj.plan.planNo = this.planForm.planNo
            obj.plan.planQuantity = this.planForm.planQuantity
            obj.plan.planState = "not_finished"
            obj.plan.planType = this.planForm.planType
            obj.plan.purchaseQuantity = this.planForm.purchaseQuantity
            obj.plan.qualificationRate = this.planForm.qualificationRate
            obj.plan.relaxQuantity = this.planForm.relaxQuantity
            obj.plan.remark = this.planForm.remark
            obj.plan.id = this.planForm.id
            obj.plan.outsourcingQuantity = this.planForm.outsourcingQuantity
            obj.plan.productionQuantity = this.planForm.productionQuantity
            obj.plan.utilizationQuantity = this.planForm.utilizationQuantity
            obj.plan.sealingCoverTyping = this.productData[0].sealingCoverTyping
            obj.plan.vibrationLevel = this.productData[0].vibrationLevel
            obj.plan.ratio = this.productData[0].ratio
            obj.plan.productSource = this.productData[0].productSource
            obj.plan.productsId = this.productData[0].productsId
            obj.plan.packagingMethod = this.productData[0].packagingMethod
            obj.plan.planStartDate = this.planForm.planDate[0]
            obj.plan.planEndDate = this.planForm.planDate[1]
            obj.plan.oilQuantity = this.productData[0].oilQuantity
            obj.plan.oil = this.productData[0].oil
            obj.plan.accuracyLevel = this.productData[0].accuracyLevel
            obj.plan.bomId = this.productData[0].bomId
            obj.plan.calculationDirection = this.productData[0].calculationDirection
            obj.plan.classAttribute = this.productData[0].classAttribute
            obj.plan.clearance = this.productData[0].clearance
            obj.plan.deputyUnit = this.productData[0].deputyUnit
            obj.plan.mainUnit = this.productData[0].mainUnit
            obj.plan.projectId=this.isProjectSwitch==1?this.productData[0].projectId:"" 
            obj.plan.pairingModeId = this.productData[0].pairingModeId
          } else {
            obj.plan = this.planForm
          }
          console.log(obj);

          this.btnLoading = true
          let formMethod = null;
          formMethod = this.btnType == 'add' ? addPlanList : updatePlanList
          formMethod(obj).then(res => {
            let msg = "";
            if (value == "draft") {
              msg = "保存成功"
            } else {
              msg = "新建成功"

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
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px
}



//.el-button--small {
// padding: 1;
//}</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 9px 10px;
}
</style>
<style scoped lang="scss">
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



.el-table__footer {
  display: none;
}

::v-deep.el-input-group__append {
  padding: 0;
  border: none;
  background-color: #fff;
}

::v-deep.has-gutter {
  display: none;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  // background: #dcdfe6;
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  // border-bottom:none;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;

}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px
}


.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important
}


.drawingNo {
  color: rgb(63, 185, 248);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  margin-top: 7px
}

.lab_t {
  display: inline-block;
  height: 32px;
  border: 1px solid #DCDFE6;
  vertical-align: top;
  line-height: 32px;
  padding: 0 10px;
  border-right: 0;
  font-size: 18px;
  font-weight: 600;
  margin-left: 10px;
}


.special {
  padding: 0 !important;
}

.special ::v-deep .el-form-item {
  padding-bottom: 20px;

}

.special ::v-deep .el-input {
  width: 8%;
}

.special ::v-deep.el-form-item__label {
  font-size: 18px !important;
  font-weight: 600;
  padding: 5px 0 !important;
  color: #000;
}

.pointer {
  width: 8%;
  display: inline-block;
  height: 32px;
  line-height: 32px;
  color: #3FB9F8;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  padding-left: 10px;
  vertical-align: top;
  font-size: 16px;
}

.BOM_T ::v-deep .el-input__inner {
  color: rgb(63, 185, 248)
}
</style>