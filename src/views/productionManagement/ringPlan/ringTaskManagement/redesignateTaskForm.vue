<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" content="改制" />
          <div class="options">
            <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading"
              @click="handleConfirm('submit')">提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="基础信息" name="orderInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">

                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="品名规格" prop="productDrawingNo">
                          <el-input v-model="dataForm.productDrawingNo" placeholder="品名规格" readonly
                            @focus="openSelectProductFun">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单位" prop="mainUnit">
                          <el-input v-model="dataForm.mainUnit" placeholder="单位" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="生产重量" prop="productionWeight">
                          <el-input v-model="dataForm.productionWeight" placeholder="生产重量">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="生产桶数" prop="productionBarrels">
                          <el-input v-model="dataForm.productionBarrels" placeholder="生产桶数" >
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="万粒数量" prop="productionQuantity">
                          <el-input v-model="dataForm.productionQuantity" placeholder="万粒数量">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="规值" prop="standardValue">
                          <el-select v-model="dataForm.standardValue" placeholder="请选择"
                            :disabled="type == 'look' ? true : false" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in bimProductAttributesList.pa008" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="精度等级" prop="productionQuantity">
                          <el-select v-model="dataForm.accuracyLevel" placeholder="请选择" clearable >
                              <el-option v-for="(item, index) in bimProductAttributesList.pa006" :key="index"
                                :label="item.name" :value="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                      </el-col>
                      
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" maxlength="200"
                            :rows="2" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>

              
              </el-collapse>
            </el-tab-pane>
          
          </el-tabs>
        </div>
        <el-dialog :title="routingProResMapDiaTitle" :close-on-click-modal="false" :close-on-press-escape="false"
          append-to-body :visible.sync="routingProResMapDiaFlag" lock-scroll
          class="JNPF-dialog JNPF-dialog_center routingProRes" width="950px">
          <el-row class="row-bg" :gutter="0" style="margin: 12px 0" v-if="routingProResMapDiaTitle == '人员资源'">
            <el-col :span="4" class="personBox" :class="[item.split('_')[0] == currentPersonId ? 'active' : '']"
              v-for="(item, index) in personnelData" :key="index">
              <div class="grid-content bg-purple" @click="changresouce(item, '人员')"
                :style="!totalData[item].length ? 'height:100%' : ''" @dblclick="selectResouce(item, '人员')">
                <p style="margin-top: 14px; font-size: 16px">{{ item.split("_")[1] }}</p>
                <p style="font-size: 16px">
                  {{ item.split("_")[2] ? item.split("_")[2] : "--" }}
                </p>
                <div v-if="totalData[item].length > 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}-
                    {{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity }}个
                  </p>
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}-
                    {{ totalData[item][1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                    {{ totalData[item][1].qualifiedQuantity }}/{{ totalData[item][1].productionQuantity }}个
                  </p>
                </div>
                <div v-else-if="totalData[item].length == 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}-{{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity }}个
                  </p>
                </div>

                <p v-if="totalData[item].length" style="margin-top: 4px; font-size: 12px">
                  工单截止：{{ totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1]
                    .replace("-", ".")
                  }}
                  <el-button class="elbutton" type="text" size="mini"
                    @click.stop="getDetailFun(item, totalData[item], '人员')"
                    :style="item.split('_')[0] == currentPersonId ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;' : ''">详细</el-button>
                </p>
              </div>
            </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="0" style="margin: 12px 0" v-if="routingProResMapDiaTitle == '班组资源'">
            <el-col :span="4" class="personBox" :class="[item.split('_')[0] == currentWorkgroupId ? 'active' : '']"
              v-for="(item, index) in workgroupData" :key="index">
              <div class="grid-content bg-purple" :style="!totalData[item].length ? 'height:100%' : ''"
                @click="changresouce(item, '班组')" @dblclick="selectResouce(item, '班组')">
                <p style="margin-top: 14px; font-size: 16px">{{ item.split("_")[1] }}</p>
                <p style="font-size: 16px">
                  {{ item.split("_")[2] ? item.split("_")[2] : "--" }}
                </p>
                <div v-if="totalData[item].length > 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][totalData[item].length - 2].planStartDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                    }}-
                    {{ totalData[item][totalData[item].length - 2].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}
                    {{ totalData[item][totalData[item].length - 2].qualifiedQuantity
                    }}/{{ totalData[item][totalData[item].length
                      - 2].productionQuantity }}个
                  </p>
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][totalData[item].length - 1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}-
                    {{ totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}
                    {{ totalData[item][totalData[item].length - 1].qualifiedQuantity
                    }}/{{ totalData[item][totalData[item].length
                      - 1].productionQuantity }}个
                  </p>
                </div>
                <div v-else-if="totalData[item].length == 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}-{{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity }}个
                  </p>
                </div>

                <p v-if="totalData[item].length" style="margin-top: 4px; font-size: 12px">
                  工单截止：{{ totalData[item][totalData[item].length -
                    1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}
                  <el-button class="elbutton" type="text" size="mini"
                    @click.stop="getDetailFun(item, totalData[item], '班组')"
                    :style="item.split('_')[0] == currentWorkgroupId ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;' : ''">详细</el-button>
                </p>
              </div>
            </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="0" style="margin:12px 0;" v-if="routingProResMapDiaTitle == '设备资源'">
            <el-col :span="4" class="personBox" :class="[item.split('_')[0] == currentDeviceId ? 'active' : '']"
              v-for="(item, index) in deviceData" :key="index">
              <div class="grid-content bg-purple" @click="changresouce(item, '设备')"
                @dblclick="selectResouce(item, '设备')" :style="!totalData[item].length ? 'height:100%' : ''">
                <p style="margin-top:14px; font-size:18px">{{ item.split('_')[1] }}</p>
                <p style=" font-size:18px">{{ item.split('_')[2] ? item.split('_')[2] : '--' }}
                </p>
                <div v-if="totalData[item].length > 1">
                  <p style="margin-top:4px; font-size:12px">
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace('-', '.') }}-
                    {{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace('-', '.') }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity
                    }}个

                  </p>
                  <p style="margin-top:4px; font-size:12px">
                    {{ totalData[item][1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.') }}-
                    {{ totalData[item][1].planEndDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace('-', '.') }}
                    {{ totalData[item][1].qualifiedQuantity }}/{{ totalData[item][1].productionQuantity
                    }}个
                  </p>
                </div>
                <div v-else-if="totalData[item].length == 1">
                  <p style="margin-top:4px; font-size:12px">
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.')
                    }}-{{
                      totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.') }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity
                    }}个
                  </p>
                </div>

                <p v-if="totalData[item].length" style="margin-top:4px; font-size:12px">工单截止：{{
                  totalData[item][totalData[item].length -
                    1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.') }} <el-button class="elbutton" type="text"
                    size="mini" @click.stop="getDetailFun(item, totalData[item], '设备')"
                    :style="item.split('_')[0] == currentDeviceId ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;' : ''">详细</el-button>
                </p>
              </div>
            </el-col>



          </el-row>
        </el-dialog>
        <el-dialog title="工单信息" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body
          :visible.sync="detailDiaFlag" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1180px"
          :header-cell-style="headerCellStyle" @close="detailDiaFlag = false">
          <el-row class="JNPF-common-search-box" :gutter="5">
            <el-form @submit.native.prevent>
              <el-col :span="5">
                <el-form-item>
                  <el-input v-model="dispatchSearchForm.orderNo" @keyup.enter.native="dataFormSubmit()"
                    placeholder="工单号" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item>
                  <el-input @keyup.native.enter="dataFormSubmit()" v-model="dispatchSearchForm.processName"
                    placeholder="工序名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-date-picker v-model="daterangeList" type="daterange" value-format="yyyy-MM-dd" style="width: 100%"
                    clearable start-placeholder="创建开始日期" end-placeholder="创建结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="dataFormSubmit()">
                    {{ $t("common.search") }}</el-button>
                  <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                    $t("common.reset") }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-table ref="product" :data="detailDataList" border max-height="380">
            <el-table-column type="index" width="70" label="序号" fixed />
            <el-table-column prop="orderNo" label="工单号" min-width="200"></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="processName" show-overflow-tooltip label="工序名称" width="100" />
            <el-table-column prop="processCode" label="工序编码" width="100" />
            <el-table-column prop="planStartDate" label="计划开始日期" width="140" />
            <el-table-column prop="planEndDate" label="计划结束日期" width="140" />
            <el-table-column prop="productionQuantity" label="生产数量" width="100" />
            <el-table-column prop="qualifiedQuantity" label="合格数量" width="100" />
            <el-table-column prop="unqualifiedQuantity" label="不合格数量" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="120">
              <template slot-scope="scope">
                <div>{{ scope.row.createTime ? scope.row.createTime.substring(0, 10) : '' }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
            <span style="font-weight:500;margin-right:10px">总生产数量：{{ totalProductionQuantity }}</span>
            <span style="font-weight:500;margin-right:10px">合格数量：{{ totalQualifiedQuantity }}</span>
            <span style="font-weight:500;margin-right:10px">不合格数量：{{ totalUnqualifiedQuantity }}</span>
          </div>
        </el-dialog>






        <RoutingForm v-if="routingVisible" ref="routingForm" @selectRouting="selectRoutingFun">
        </RoutingForm>
        <SelectProductForm v-if="productVisible" ref="productForm" @selectProduct="selectProductFun">
        </SelectProductForm>
      </div>
    </transition>
  </div>
</template>

<script>
import { reformOrderNum } from '@/api/productOrdes/index.js'
import { excelExport, getProductionLineInfo, getProductionLineList } from "@/api/basicData/index";
import SelectProductForm from './selectProductForm.vue'
import RoutingForm from "./RoutingForm.vue"
import { detailProcess, getProcessList, getWorkListMap, addProdPlanArrange, detailResourceProcess } from '@/api/basicData/processSettingss.js'
import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { getWarehouseList } from '@/api/basicData/index'
import { getBimBusinessDetail } from '@/api/basicData/index'
import {
  BOMLineList
} from "@/api/calculationList/MRPOperation"
import { mapGetters, mapState } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import TableFormProduct from '@/components/no_mount/TableForm-product/index.vue'
import { getBimProcessList } from '@/api/bimProcess'
import { detailordershengchan } from '@/api/productOrdes/index.js'
import { getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
export default {
  mixins: [getProjectList],
  components: {
    TableFormProduct,
    RoutingForm,
    SelectProductForm,
  },
  data() {
    return {
      productVisible: false,
      isattachmentswitch: "",
      taskMethodList: [{ label: "指定加工对象", value: "appoint" }, { label: "不指定加工对象", value: "not_appoint" },],
      activeNames: ["productInfo", "basicInfo"],
      activeNamess: ['pickInfo', 'productInfos'],
      allocationFlag: false,
      routingVisible: false,
      collectForm: {
        orderNo: "",
        operationDate: this.jnpf.getToday(),
        personId: "",
      },
      collectConfig: {

      },
      pickDataRule: {
        orderNo: [
          { required: true, message: '领料单号单号不能为空', trigger: 'blur' }
        ],
        operationDate: [
          { required: true, message: '领料日期不能为空', trigger: 'change' }
        ],

      },
      dataForm: {
        planDate: [],
        lineEdgeList: [],
        lineEdgeId: "",
        orderNo: "",
        productDrawingNo: "",
        productsCode: "",
        mainUnit: "",
        planProductionQuantity: "",
        availableArrangeQuantity: "",
        productionQuantity: "",
        taskMethod: "appoint",
        planStartDate: "",
        planEndDate: "",
        routingName: "",
        routingId: "",
        sealingCoverTyping: "",
        accuracyLevel: "",
        vibrationLevel: "",
        oil: "",
        oilQuantity: "",
        clearance: "",
        packagingMethod: "",
        specialRequire: "",
        remark: "",
        bomId: "",
        projectId: "",
        orderType: "manually",
        lineEdgeId: "",
      },
      bimProductAttributesList:{},
      dataFormTwo: {
        data: [],
      },
      listLoading: false,
      activeName: "orderInfo",
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataRule: {
        lineEdgeId: [{ required: true, message: '请选择线边仓库', trigger: 'blur' }],
        planDate: [
          { required: true, message: '计划生产日期不能为空', trigger: 'change' }
        ],
        productionQuantity: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["生产数量不能为空", (errMsg, index) => { this.$message.error(`生产数量：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '生产数量必须大于0', (errMsg, index) => { this.$message.error(`生产数量：${errMsg}`) }), trigger: 'blur' }
        ],
        routingName: [
          { required: true, message: '工艺路线不能为空', trigger: 'change' }
        ],
        productDrawingNo: [
          { required: true, message: '品名规格不能为空', trigger: 'blur' }
        ]
      },
      selectArr: [],

      totalData: [],
      index: "",
      currentWorkgroupId: "",
      currentDeviceId: "",
      currentPersonId: '',
      routingProResMapDiaFlag: false,
      routingProResMapDiaTitle: "",
      workgroupData: [],
      deviceData: [],
      personnelData: [],
      workstationList: [],
      productionLineList: [],
      codeConfig: {},
      dispatchSearchForm: {
        resIdList: [],
        resType: "",
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      },
      detailDataList: [],
      detailDiaFlag: false,
      headerCellStyle: {
        backgroundColor: '#f5f7fa',
        fontWeight: 'bold'
      },
      naturalResourcesFlag: true,
      processList: [],
      warehouseList: [],
      isProjectSwitch: "",
      projectIdData: [],
      isProductNameSwitch: "",
      isTechnicalSwitch: "",
      isCheckingSwitch: "",
      materialList: [],
      linesFormItems_right: [],
      lineIndex: null
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

    totalProductionQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].productionQuantity])
      }
      return totalNums
    },
    totalQualifiedQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].qualifiedQuantity])
      }
      return totalNums
    },
    totalUnqualifiedQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].unqualifiedQuantity])
      }
      return totalNums
    },
  },

  async created() {
    await this.getProjectList()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getTechnicalSwitch('produce', 'technical_requirement')
    await this.getCheckingSwitch('produce', 'checking_information')
    this.getProductClassFun()
  },

  methods: {
      // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
      getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })
    },
    delethHandle(scope) {
      this.$confirm(this.$t('此操作将删除当前数据，确认删除？'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        this.dataFormTwo.data.splice(scope.$index, 1)

      }).catch(() => { })
    },
    getProcessData(id, data, params, index) {
      this.materialList[params.scope.$index].processId = data[0].id || ''
      this.materialList[params.scope.$index].processName = data[0].name || ''
    },
    async getTechnicalSwitch(code, type) {
      try {
        this.isTechnicalSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getCheckingSwitch(code, type) {
      try {
        this.isCheckingSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    openSelectProductFun() {
      this.productVisible = true
      this.$nextTick(() => {
        if (this.isProjectSwitch == 1) {
          this.$refs.productForm.init(this.userInfo.projectId || '')

        } else {
          this.$refs.productForm.init('')

        }
      })
    },
    // 选择产品
    selectProductFun(data) {
      console.log("所选返工产品", data);
      // this.dataForm = data
      // this.$set(this.dataForm, 'orderType', 'manually')
      // this.$set(this.dataForm, 'taskMethod', 'appoint')
      // this.$set(this.dataForm, 'productsDrawingNo', data.drawingNo)
      // this.$set(this.dataForm, 'planDate', [])
      // this.$set(this.dataForm, 'orderNo', this.codeConfig.number)
      this.dataForm = {
        ...data,
        orderType: 'manually',
        taskMethod: 'appoint',
        planDate: [],
        orderNo: this.codeConfig.number
      }
      this.$refs.dataForm.clearValidate('productDrawingNo');

      this.dataForm.productDrawingNo = data.drawingNo
      this.dataForm.productCode = data.code
      this.dataForm.productName = data.name
      this.dataForm.productId = data.id
 

    },
    //领料人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.collectForm.clearValidate('personId')
      })
      this.collectForm.personId = e
    },


    // 通过查询条件查询未完成的派工单
    dataFormSubmit() {
      if (this.daterangeList.length) {
        this.dispatchSearchForm.startTime = this.daterangeList[0] + " 00:00:00";
        this.dispatchSearchForm.endTime = this.daterangeList[1] + " 23:59:59";
      } else {
        this.dispatchSearchForm.startTime = "";
        this.dispatchSearchForm.endTime = "";
      }
      getWorkListMap(this.dispatchSearchForm).then((res) => {
        console.log("查询结果", res);
        let arr = Object.keys(res.data);
        console.log(555, res.data[arr[0]]);
        this.detailDataList = res.data[arr[0]];
      });
    },
    // 重置查询条件
    reset() {
      this.daterangeList = [];
      this.dispatchSearchForm = {
        resIdList: this.dispatchSearchForm.resIdList,
        resType: this.dispatchSearchForm.resType,
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      },
        this.dataFormSubmit();
    },
    // 点击详情
    getDetailFun(id, data, type) {
      console.log(data);
      this.dispatchSearchForm.resIdList = [];
      this.dispatchSearchForm.resIdList.push(id.split("_")[0]);
      // this.detailDataList = data
      this.detailDiaFlag = true;
      if (type == "人员") this.dispatchSearchForm.resType = "personnel";
      if (type == "设备") this.dispatchSearchForm.resType = "device";
      if (type == "班组") this.dispatchSearchForm.resType = "work_group";
      this.detailDiaFlag = true;
      this.dispatchSearchForm.startTime = "";
      this.dispatchSearchForm.endTime = "";
      this.daterangeList = [];
      this.dataFormSubmit();
    },
    changresouce(item, type) {
      console.log("单击item", item);
      if (type == "人员") {
        this.currentPersonId = item.split("_")[0];
      }
      if (type == "班组") {
        this.currentWorkgroupId = item.split("_")[0];
      }
      if (type == "设备") {
        this.currentDeviceId = item.split("_")[0];
      }
    },
    openRoutingFun() {
      if (!this.dataForm.id) return this.$message.error("请先选择产品")
      this.routingVisible = true
      if (this.isProjectSwitch == 1) {
        this.$nextTick(() => {
          this.$refs.routingForm.init(this.dataForm.projectId)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.routingForm.init("")
        })
      }
    },
    selectRoutingFun(data) {
      console.log(data);
      this.dataForm.routingId = data.id
      this.dataForm.routingName = data.name
      this.getRoutingDetail(this.dataForm.routingId)
    },
    // 选择班组
    selectWorkgroupFun(scope) {
      console.log("班组", scope);
      this.totalData = []
      if (scope.row.routingProResMap) {
        if (scope.row.routingProResMap.work_group) {
          this.index = scope.$index;
          this.currentWorkgroupId = scope.row.workGroupId;
          let workgroupData = scope.row.routingProResMap.work_group;
          this.routingProResMapDiaFlag = true;
          this.routingProResMapDiaTitle = "班组资源";
          let resIdList = [];
          workgroupData.forEach((item) => {
            resIdList.push(item.resourceId);
          });
          let obj = {
            resType: "work_group",
            resIdList: resIdList,
          };
          getWorkListMap(obj).then((res) => {
            console.log("班组数据", res);
            this.workgroupData = Object.keys(res.data).sort();
            this.totalData = res.data;
            console.log(this.workgroupData);
            console.log(this.totalData);
          });
        } else {
          this.$message.error("当前工序没有配置班组资源");
        }
      } else {
        this.$message.error("当前工序没有配置班组资源");
      }
    },
    // 选择设备
    selectDeviceFun(scope) {
      console.log("设备", scope);
      this.totalData = []
      if (scope.row.routingProResMap) {
        if (scope.row.routingProResMap.device) {
          this.index = scope.$index
          this.currentDeviceId = scope.row.equipmentId
          let deviceDataData = scope.row.routingProResMap.device
          this.routingProResMapDiaFlag = true
          this.routingProResMapDiaTitle = "设备资源"
          let resIdList = []
          deviceDataData.forEach(item => {
            resIdList.push(item.resourceId)
          });
          let obj = {
            resType: "device",
            resIdList: resIdList,
          }
          getWorkListMap(obj).then(res => {
            console.log("设备数据", res);
            this.deviceData = Object.keys(res.data).sort();
            this.totalData = res.data
          })
        } else {
          this.$message.error("当前工序没有配置设备资源")

        }
      } else {
        this.$message.error("当前工序没有配置设备资源")
      }
    },
    //  选择人员
    selectPersonnelFun(scope) {
      console.log(scope.row);

      this.totalData = []
      if (scope.row.routingProResMap) {
        if (scope.row.routingProResMap.personnel) {
          this.currentPersonId = scope.row.personId;
          this.index = scope.$index;
          let personnelData = scope.row.routingProResMap.personnel;
          this.routingProResMapDiaFlag = true;
          this.routingProResMapDiaTitle = "人员资源";
          let resIdList = [];
          personnelData.forEach((item) => {
            resIdList.push(item.resourceId);
          });
          let obj = {
            resType: "personnel",
            resIdList: resIdList,
          };
          getWorkListMap(obj).then((res) => {
            console.log("人员数据", res);

            this.personnelData = Object.keys(res.data).sort();
            this.totalData = res.data;
          });
        } else {
          this.$message.error("当前工序没有配置人员资源");
        }
      } else {
        this.$message.error("当前工序没有配置人员资源");
      }
    },
    selectResouce(item, type) {
      console.log("双击item", item);
      if (type == "人员") {
        this.dataFormTwo.data[this.index].personId = item.split("_")[0];
        this.dataFormTwo.data[this.index].routingProResMap.personnel.forEach((item) => {
          if (item.resourceId == this.dataFormTwo.data[this.index].personId) {
            this.dataFormTwo.data[this.index].personName = item.resourceName;
          }
        });
      }
      if (type == "班组") {
        this.dataFormTwo.data[this.index].workGroupId = item.split("_")[0];
        this.dataFormTwo.data[this.index].routingProResMap.work_group.forEach((item) => {
          if (item.resourceId == this.dataFormTwo.data[this.index].workGroupId) {
            this.dataFormTwo.data[this.index].workGroupName = item.resourceName;
          }
        });
      }
      if (type == "设备") {
        this.dataFormTwo.data[this.index].equipmentId = item.split("_")[0];
        this.dataFormTwo.data[this.index].equipmentName = item.split("_")[1];
        this.dataFormTwo.data[this.index].equipmentCode = item.split("_")[2];

        // this.dataFormTwo.data[this.index].routingProResMap.device.forEach((item) => {
        //     if (item.resourceId == this.dataFormTwo.data[this.index].equipmentId) {
        //         this.dataFormTwo.data[this.index].equipmentName =
        //             item.resourceName + "(" + item.resourceCode + ")";
        //     }
        // });
      }
      console.log("'this.dataFormTwo.data'", this.dataFormTwo.data);
      this.$forceUpdate();
      this.routingProResMapDiaFlag = false;
    },
    // 选择工位
    selectworkstation(row) {
      console.log(row);
      this.workstationList = [];
      getProductionLineInfo(row.productionLineId).then((res) => {
        console.log("工位", res);
        this.workstationList = res.data.returnList;
        console.log(this.workstationList);

        this.$forceUpdate();
      });
    },



    dateFormat(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      const time = y + '-' + m + '-' + d
      return time
    },
    handeleProductInfoData(val) {
      this.selectRows = val
    },












    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },







    search() {
      this.form.pageNum = 1
      this.initData()
    },

    initData() {
      this.listLoading = true
      getCooperativeData(this.form).then(res => {
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 产线
    getProductionLineListFun() {
      let objs = {
        code: "",
        createByName: "",
        endTime: "",
        name: "",
        orderItems: [
          {
            asc: true,
            column: "",
          },
        ],
        pageNum: 1,
        pageSize: -1,
      };
      // 获取产线

      objs.projectId = this.dataForm.projectId
      getProductionLineList(objs).then((res) => {
        console.log("产线", res);
        this.productionLineList = res.data.records;
      });
    },
    init(id) {
      detailordershengchan(id).then(res => {
          console.log("生产任务详情", res);
          this.dataForm = res.data.prodOrder
          this.$set(this.dataForm,'splitNo',1)
          this.oldWorkOrderList = res.data.workOrderList
          this.dataFormTwo.data = res.data.workOrderList
      })
      // this.getProductionLineListFun()
      // this.fetchData("PROD")
      this.creaFun()
    },
    creaFun() {
      this.linesFormItems_right = [
        { prop: "productsCode", label: "产品编码", value: "", type: 'view', minWidth: 140 },
        { prop: "productsName", label: "产品名称", value: "", type: 'view', minWidth: 120, render: this.isProductNameSwitch === '1' },
        { prop: "productsDrawingNo", label: "品名规格", value: "", type: 'view', minWidth: 150 },
        {
          prop: "processName", label: "工序名称", value: "", type: 'custom', minWidth: 140,
          customComponent: 'ComSelect-page', renderTree: false, change: this.getProcessData,
          tableItems: [
            { prop: 'name', label: '工序名称' },
            { prop: 'code', label: '工序编码' },
          ], placeholder: "请选择工序名称", title: "选择工序名称",
          listMethod: getBimProcessList, listRequestObj: {
            "name": "",
            "code": "",
            "processingType": "",
            "orderItems": [
              {
                "asc": false,
                "column": ""
              },
              {
                "asc": false,
                "column": "create_time"
              }
            ],
            "pageNum": 1,
            "pageSize": 20,
            "productCategoryId": "",
            "projectId": ''
          },
          searchList: [
            { prop: "code", label: "工序编码", type: 'input' },
            { prop: "name", label: "工序名称", type: 'input' },
          ]
        },
        {
          prop: "qty", label: "数量", value: "", type: 'input', width: 180,
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：数量${errMsg}`) }] }), trigger: 'blur' },
            { required: true, message: '', trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：数量${errMsg}`) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：数量${errMsg}`) }), trigger: 'blur' }
          ]
        },
        { prop: "mainUnit", label: "单位", value: "", type: 'view', minWidth: 80 },
        {
          prop: 'reduceType',
          label: '扣减料方式',
          value: 'picking',
          type: 'select',
          disabled: this.btnType === 'look',
          options: [
            { label: '生成领料单', value: 'picking' },
            { label: '自动扣减料', value: 'auto' },
            { label: '都不是', value: 'none' }
          ],
          itemRules: [{ required: true, trigger: 'change' }],
          minWidth: 160,
        },
        {
          prop: "materialsUsedQuantity", label: "领料数量", value: "", type: 'input', minWidth: 140,
          itemRules: [
            { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：领料数量${errMsg}`) }] }), trigger: 'blur' },
            { required: true, message: '', trigger: 'blur' },
            { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：领料数量${errMsg}`) }] }), trigger: 'blur' },
            { validator: this.formValidate('positiveNumber', false, (errMsg, index) => { this.$message.error(`领料清单列表第${index + 1}行：领料数量${errMsg}`) }), trigger: 'blur' }
          ]
        },
      ]
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        if (code == 'PROD') {
          this.codeConfig = data
          this.dataForm.orderNo = data.number

        }
        if (code == 'PODH') {
          this.collectConfig = data
          this.collectForm.orderNo = data.number

        }

      } catch (error) {
      }
    },

    goBack() {
      this.$emit('close', true)
    },
    async handleConfirm(value) {
      console.log(this.dataForm);
      this.btnLoading = true
      reformOrderNum(this.dataForm).then(res => {
        this.btnLoading = false
        this.$message.success("改制成功")
        setTimeout(() => {
          this.$emit('close')
        }, 1500);
      }).catch(error => {
        this.btnLoading = false

      })
     
    

    },
    addth(data, index, type) {
      console.log("dtata", data);
      let tempList = JSON.parse(JSON.stringify(this.materialList))
      let hasItemList = []
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        item.productsId = item.id
        item.productsCode = item.code
        item.productsName = item.name
        item.productsDrawingNo = item.drawingNo
        item.qty = 1
        const hasFlag = this.materialList.find(i => item.productsId === i.productsId)
        if (hasFlag) { hasItemList.push(item.productDrawingNo) }
        else { tempList.push(item) }
        if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
      }
      this.materialList = tempList.map(item => {
        return {
          productsId: item.productsId,
          productsCode: item.productsCode,
          productsName: item.productsName,
          productsDrawingNo: item.productsDrawingNo,
          qty: item.qty,
          calculationDirection: item.calculationDirection,
          mainUnit: item.mainUnit,
          ratio: item.ratio,
          // materialsUsedQuantity: item.materialsUsedQuantity || '',
          materialsUsedQuantity: this.jnpf.numberFormat(this.jnpf.math('multiply', [this.dataForm.productionQuantity, item.qty]), 6) || '',
          processName: item.processName,
          processId: item.processId,
          selectProduct: true,
          reduceType: "picking",
        }
      })
      console.log(this.materialList, 'this.materialList')
    },
    deleteth(scope, index, type) {
      this.materialList.splice(scope.$index, 1)
    },
    linesChange(dataOrIndex, prop, value, index, type) {
      if (Array.isArray(dataOrIndex)) {
        this.materialList = JSON.parse(JSON.stringify(dataOrIndex))
        // this.$set(this.dataForm, type, JSON.parse(JSON.stringify(dataOrIndex)))
      } else if (prop) {
        console.log(111)
        console.log(dataOrIndex)
        console.log(value)
        console.log(prop)
        if (prop === 'processName') {
          this.lineIndex = dataOrIndex
          return
        }
        this.materialList[dataOrIndex][prop] = value
      }
    },
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .data-form {
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}

.data-form ::v-deep.el-table__body-wrapper {
  height: auto !important;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0;
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

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .el-input-group__append {
  background-color: #48a2ff;
  color: #fff;
}
</style>
<style lang="scss" scoped>
$footerPadding: '10px';

::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
}

::v-deep .el-dialog__body {
  margin-bottom: 10px;
}

::v-deep .el-dialog__footer {
  padding: 0 20px 10px;
}

::v-deep .even-row,
::v-deep .odd-row {
  cursor: pointer;
}

.killPadding {
  padding: 0;
}

.killPaddingLeft {
  padding-left: 0 !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding: 2px 10px 2px 0;
}

::v-deep .JNPF-common-search-box.noSearchList {
  padding: 3px 0;
}

::v-deep .has-gutter .el-table__cell.gutter {
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.JNPF-common-search-box {
  padding: 8px 0px 0;
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

.productInfo ::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  padding: 0
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

.orderInfo {
  margin-top: 5px;
}

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important
}

::v-deep.routingProRes .el-dialog__body {
  height: 500px;
}

::v-deep .applySelect .el-icon-arrow-up:before {
  content: "";
}

.underline-button {
  text-decoration: underline;
}



.personBox p {
  text-align: center;
}

.personBox:nth-child(n + 6) {
  margin-top: 12px;
}

::v-deep .elbutton span {
  font-size: 14px !important;
}

.personBox {
  border: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  /* background-color: #1890ff; */
  margin-left: 26px;
  height: 150px;
  border-radius: 5px;
}

.active {
  background-color: #5d9bd5;
  color: #fff;
}

::v-deep .UploadFile-container-main {
  margin-top: 5px;
}
</style>
