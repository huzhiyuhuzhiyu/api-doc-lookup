<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" content="生产编排" />
          <div class="options">
            <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading"
              @click="handleConfirm('submit')">提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">

          <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="基本信息" name="orderInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">

                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="生产计划单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="生产任务单号" prop="exchangeGoodsFlag">
                          <el-select v-model="dataForm.exchangeGoodsFlag" placeholder="请选择状态" style="width: 100%;"
                            :disabled="btnType == 'look' || Flagtype" @change="changeclick">
                            <el-option v-for="(item, index) in documentStatusList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="品名规格" prop="partnerName">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择客户" :disabled="btnType == 'look'"
                            readonly @focus="openDialog">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="产品编码" prop="partnerName">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择客户" :disabled="btnType == 'look'"
                            readonly @focus="openDialog">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="单位" prop="partnerName">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择客户" :disabled="btnType == 'look'"
                            readonly @focus="openDialog">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="计划生产数量" prop="partnerName">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择客户" :disabled="btnType == 'look'"
                            readonly @focus="openDialog">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="可编排数量" prop="partnerName">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择客户" :disabled="btnType == 'look'"
                            readonly @focus="openDialog">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="编排数量" prop="partnerName">
                          <el-input v-model="dataForm.partnerName" placeholder="请选择客户" :disabled="btnType == 'look'"
                            readonly @focus="openDialog">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="计划生产——结束日期" prop="planDate">
                          <el-date-picker v-model="planForm.planDate" type="daterange" value-format="yyyy-MM-dd"
                            :disabled='btnType == "look"' style="width: 100%;" start-placeholder="开始日期"
                            @change="changDateFun" end-placeholder="结束日期" clearable>
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="工艺路线名称" prop="delivery">
                          <el-select v-model="dataForm.delivery" placeholder="工艺路线名称" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in departMentList" :key="index" :label="item.label"
                              @click.native="changeDelivery(item.value)" :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="打字内容" prop="sealingCoverTyping">
                          <el-select v-model="dataForm.sealingCoverTyping" placeholder="打字内容" clearable
                            style="width: 100%;">
                            <el-option v-for="(item, index) in list1" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="精度等级" prop="accuracyLevel">
                          <el-select v-model="dataForm.accuracyLevel" placeholder="精度等级" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list2" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="振动等级" prop="vibrationLevel">
                          <el-select v-model="dataForm.vibrationLevel" placeholder="振动等级" clearable
                            style="width: 100%;">
                            <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="油脂" prop="oil">
                          <el-select v-model="dataForm.oil" placeholder="油脂" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="油脂量" prop="oilQuantity">
                          <el-select v-model="dataForm.oilQuantity" placeholder="油脂量" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list5" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="游隙" prop="clearance">
                          <el-select v-model="dataForm.clearance" placeholder="游隙" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="包装方式" prop="packagingMethod">
                          <el-select v-model="dataForm.packagingMethod" placeholder="包装方式" clearable
                            style="width: 100%;">
                            <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="特殊要求" prop="specialRequire">
                          <el-select v-model="dataForm.specialRequire" placeholder="特殊要求" clearable
                            style="width: 100%;">
                            <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                              :value="item.name"></el-option>
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
                <el-collapse-item title="工序信息" name="productInfo">
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                    <JNPF-table ref="product" :data="dataFormTwo.data" @selection-change="handeleProductInfoData"
                      fixedNo hasC v-loading="tableloading">
                      <el-table-column prop="processCode" label="工序编码" width="130"></el-table-column>
                      <el-table-column prop="processName" label="工序名称" min-width="170" />
                      <el-table-column prop="processingType" label="加工类型" width="100">
                        <template slot-scope="scope">
                          <div>
                            {{ scope.row.processingType == "self_produced" ? "自制" : "外协" }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="workGroupId" label="班组" min-width="150">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.workGroupId" placeholder="" class="applySelect" disabled
                            style="width: 70%; display: none">
                            <el-option
                              v-for="(item, index) in scope.row.routingProResMap ? scope.row.routingProResMap.work_group : []"
                              :key="index" :label="item.resourceName" :value="item.resourceId"></el-option>
                          </el-select>
                          <el-button @click="selectWorkgroupFun(scope)" type="text" class="underline-button"
                            :disabled="scope.row.processingType != 'self_produced' || (scope.row.firstFlag && dataFormTwo.prodOrderList[0].blankingProductsId ? true : false)">
                            {{ scope.row.workGroupId ? scope.row.workGroupName : "请选择班组" }}
                          </el-button>
                        </template>
                      </el-table-column>
                      <el-table-column prop="equipmentId" label="设备" min-width="150">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.equipmentId" placeholder="" clearable class="applySelect"
                            style="width: 70%; display: none" disabled>
                            <el-option
                              v-for="(item, index) in scope.row.routingProResMap ? scope.row.routingProResMap.device : []"
                              :key="index" :label="item.resourceName + '(' + item.resourceCode + ')'"
                              :value="item.resourceId"></el-option>
                          </el-select>
                          <el-button @click="selectDeviceFun(scope)" type="text" class="underline-button"
                            :disabled="scope.row.processingType != 'self_produced' || (scope.row.firstFlag && dataFormTwo.prodOrderList[0].blankingProductsId ? true : false)">
                            {{ scope.row.equipmentId ? +"(" + scope.row.equipmentCode + ')' : "请选择设备" }}
                          </el-button>
                        </template>
                      </el-table-column>
                      <el-table-column prop="personId" label="人员" min-width="100">

                        <template slot-scope="scope">
                          <el-select v-model="scope.row.personId" placeholder="" clearable
                            style="width: 60%; display: none" class="applySelect" disabled>
                            <el-option
                              v-for="(item, index) in scope.row.routingProResMap ? scope.row.routingProResMap.personnel : []"
                              :key="index" :label="item.resourceName" :value="item.resourceId"></el-option>
                          </el-select>
                          <el-button @click="selectPersonnelFun(scope)" type="text" class="underline-button"
                            :disabled="scope.row.processingType != 'self_produced' || (scope.row.firstFlag && dataFormTwo.prodOrderList[0].blankingProductsId ? true : false)">
                            {{ scope.row.personId ? scope.row.personName : "请选择人员" }}
                          </el-button>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productionLineId" label="产线" min-width="160">

                        <template slot-scope="scope">
                          <!-- <el-input v-model="scope.row.productCode" placeholder="请选择产线"  /> -->
                          <el-select v-model="scope.row.productionLineId" placeholder="请选择产线" clearable
                            :disabled="scope.row.processingType != 'self_produced' || (scope.row.firstFlag && dataFormTwo.prodOrderList[0].blankingProductsId ? true : false)">
                            <el-option v-for="(item, index) in lineList" :key="index" :label="item.name"
                              :value="item.id"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="workstationId" label="工位" min-width="160">

                        <template slot-scope="scope">
                          <!-- <el-input v-model="scope.row.productCode" placeholder="请选择工位" /> -->
                          <el-select v-model="scope.row.workstationId" placeholder="请选择工位"
                            :disabled="!scope.row.productionLineId" clearable @focus="selectworkstation(scope.row)">
                            <el-option v-for="(item, index) in workstationList" :key="index"
                              :label="item.workstationIdName" :value="item.workstationId"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                    </JNPF-table>

                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
            </el-tab-pane>
          </el-tabs>
        </div>

        <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
          :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
          append-to-body>

          <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

            <div class="JNPF-common-layout-center JNPF-flex-main">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="orderForm.customerProductDrawingNo" placeholder="请输入客户料号" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="orderForm.drawingNo" placeholder="请输入品名规格" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="交货日期">
                      <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                        style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item>
                      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductFun()">
                        {{ $t('common.search') }}</el-button>
                      <el-button size="mini" icon="el-icon-refresh-right" @click="resetProductFun()">{{
                        $t('common.reset') }}
                      </el-button>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div class="JNPF-common-layout-main JNPF-flex-main">
                <JNPF-table v-loading="listLoading" :data="productList" hasC
                  @selection-change="handleSelectionChangeAllPruduct">
                  <el-table-column prop="orderNo" label="订单号" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="customerProductNo" label="客户料号" width="160" sortable="custom" />
                  <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
                  <el-table-column prop="drawingNo" label="品名规格" width="160" sortable="custom" />
                  <el-table-column prop="mainUnit" label="单位" width="160" sortable="custom" />
                  <el-table-column prop="num" label="数量" width="160" sortable="custom" />
                  <el-table-column prop="waitDeliverNum" label="待发货数量" width="160" sortable="custom" />
                  <el-table-column prop="deliveryDate" label="交货日期" width="160" sortable="custom" />
                  <el-table-column prop="sealingCoverTyping" label="打字内容" width="160" sortable="custom" />
                  <el-table-column prop="accuracyLevel" label="精度等级" width="160" sortable="custom" />
                  <el-table-column prop="vibrationLevel" label="振动等级" width="160" sortable="custom" />
                  <el-table-column prop="oil" label="油脂" width="160" sortable="custom" />
                  <el-table-column prop="oilQuantity" label="油脂量" width="160" sortable="custom" />
                  <el-table-column prop="clearance" label="游隙" width="160" sortable="custom" />
                  <el-table-column prop="packagingMethod" label="包装方式" width="160" sortable="custom" />
                  <el-table-column prop="specialRequire" label="特殊要求" width="160" sortable="custom" />
                  <el-table-column prop="remark" label="备注" width="160" sortable="custom" />
                  <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                </JNPF-table>
                <pagination :total="productTotal" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                  @pagination="searchProductFun" />
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click=" productVisible = false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
              确定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
          :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
          width="500px">
          <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
              {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>


          <span slot="footer" class="dialog-footer">
            <el-button @click="goBack">返回列表</el-button>
            <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()"> {{ btnText }}</el-button>
            <el-button v-else type="primary" @click="continueAdd()"> {{ btnText }}</el-button>
          </span>
        </el-dialog>

      </div>
    </transition>
    <changeAddress v-if="addressVisibled" ref="addressRef" @getChangeAddress="getChangeAddress"></changeAddress>
  </div>
</template>

<script>
import {
  editPartner, addPartner,
  getCounryData, checkCode
} from '@/api/basicData/index'
import {
  getProvinceList,
} from '@/api/system/province'
// import { getOrderDetail, addOrders, editOrders, getcategoryTrees, getAttributeline, getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
import { editQuotationMsendlist, addQuotationsendlist, getQuotationsendlist, editReceiptnoticelist } from "@/api/salesManagement/index";
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getcategoryTrees, getcooperativeProduct, getOrderDetail, getsaleOrderDetailList } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData, getAddressInfo } from '@/api/basicData/index'
import {
    getProductionLineList,
    getProductionLineInfo,
    excelExport,
} from "@/api/basicData/index";
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index' 
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  components: {
    changeAddress
  },
  data() {
    return {

      listLoading: false,

      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      },


      activeName: "orderInfo",
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,


      dataRule: {
        orderNo: [
          { required: true, message: '订单编号不能为空', trigger: 'change' }
        ],
        exchangeGoodsFlag: [
          { required: true, message: '换货标识不能为空', trigger: 'change' }
        ],
        partnerName: [
          { required: true, message: '所属客户不能为空', trigger: 'change' }
        ],
        deliverDate: [
          { required: true, message: '发货日期不能为空', trigger: 'change' }
        ],
        recipient: [
          { required: true, message: '收件人不能为空', trigger: 'change' }
        ],
        phone: [{ required: true, message: '收件人电话不能为空', trigger: 'change' }, { validator: this.formValidate('iphone', '请输入正确的收件人电话'), trigger: 'blur' },],
        province: [{ required: true, message: '省份不能为空', trigger: 'change' }],
        city: [{ required: true, message: '市不能为空', trigger: 'change' }],
        area: [{ required: true, message: '地区不能为空', trigger: 'change' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'change' }],
        delivery: [{ required: true, message: '发货方式不能为空', trigger: 'change' }],
        // shipperId: [{ required: true, message: '发货人不能为空', trigger: 'change' }],
        country: [{ required: true, message: '国家不能为空', trigger: 'change' }],
      },

      selectArr: [],
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
      totalData:[],
      index:"",
      currentWorkgroupId:"",
      currentDeviceId:"",
      currentPersonId:'',
      routingProResMapDiaFlag:false,
      routingProResMapDiaTitle:"",
      workgroupData:[],
      deviceData:[],
      personnelData:[],
      workstationList:[],
      lineList:[]
    }
  },
  computed: {

  },
  created() {

  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
  },
  methods: {
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
          dispatchListMap(obj).then((res) => {
            console.log("班组数据", res);
            this.workgroupData = Object.keys(res.data).sort();
            this.totalData = res.data;
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
          this.index = scope.$index;
          this.currentDeviceId = scope.row.equipmentId ? scope.row.equipmentId : "";
          let deviceDataData = scope.row.routingProResMap.device;
          this.routingProResMapDiaFlag = true;
          this.routingProResMapDiaTitle = "设备资源";
          let resIdList = [];
          deviceDataData.forEach((item) => {
            resIdList.push(item.resourceId);
          });
          let obj = {
            resType: "device",
            resIdList: resIdList,
          };
          dispatchListMap(obj).then((res) => {
            console.log("设备数据", res);
            this.deviceData = Object.keys(res.data).sort();
            console.log(111, this.deviceData);
            this.totalData = res.data;
          });
        } else {
          this.$message.error("当前工序没有配置设备资源");
        }
      } else {
        this.$message.error("当前工序没有配置设备资源");
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
          dispatchListMap(obj).then((res) => {
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
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {

      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa007",
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
        this.list1 = res.data.records
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa006",
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
      getbimProductAttributesList(obj2).then(res => {
        this.list2 = res.data.records
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
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
      getbimProductAttributesList(obj3).then(res => {
        this.list3 = res.data.records
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa002",
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
      getbimProductAttributesList(obj4).then(res => {
        this.list4 = res.data.records
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa003",
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
      getbimProductAttributesList(obj5).then(res => {
        this.list5 = res.data.records
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa001",
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

      getbimProductAttributesList(obj6).then(res => {
        this.list6 = res.data.records
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa015",
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
      getbimProductAttributesList(obj7).then(res => {
        this.list7 = res.data.records
      })
      let obj8 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa016",
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
      getbimProductAttributesList(obj8).then(res => {
        this.list8 = res.data.records
      })



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
     



    init(data) {
      if (data && data.length) { 
        let objs = {
                code: "",
                createByName: "",
                endTime: "",
                keyword: "",
                name: "",
                orderItems: [
                    {
                        asc: true,
                        column: "",
                    },
                ],
                pageNum: 1,
                pageSize: -1,
                startTime: "",
                state: "",
            };
            // 获取产线
            getProductionLineList(objs).then((res) => {
                console.log("产线", res);
                this.lineList = res.data.records;
            });
        
      }
      this.formLoading = true
      // this.getProvinceList()
      console.log("传递数据", btnType);
      this.dataForm.id = id || ''
      this.btnType = btnType
      this.oldId = JSON.parse(JSON.stringify(id)) || ""
      this.oldType = JSON.parse(JSON.stringify(btnType))
      if (this.dataForm.id) {
        getQuotationsendlist(this.dataForm.id).then(res => {
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
          this.dataForm = res.data.notice
          this.dataForm.country = res.data.notice.country === '中国' ? 'CN' : res.data.notice.country
          if (this.dataForm.country === 'CN') {
            this.defaultAddress = res.data.notice.region.provinceName + res.data.notice.region.cityName + res.data.notice.region.areaName + res.data.notice.address
          } else {
            this.defaultAddress = res.data.notice.region.countryName + res.data.notice.address
          }
          if (this.btnType == 'copy') {
            this.dataForm.stockStatus = ''
            this.dataForm.inspectionStatus = ''
            this.dataForm.id = ''
            this.datafilelist = []
            this.dataForm.approvalStatus = ''
            this.dataForm.fullReceiptFlag = false
            res.data.noticeLineList.forEach(item => {
              item.deliveryQuantity = ""
            });
            this.dataFormTwo.data = res.data.noticeLineList


            console.log("this.dataFormTwo.data", this.dataFormTwo.data);

          } else if (this.btnType == 'edit' || this.btnType == 'look') {

            // this.dataFormTwo.data = res.data.noticeLineList
            this.processingdata(res.data.noticeLineList)
          }

        })

      }

      if (this.btnType == 'edit') {
        this.fetchData("SSDH", false)
        this.btnText = "继续修改"
      } else if (this.btnType == 'add' || this.btnType == 'copy') {
        this.btnText = "继续新增"
        const currentDate = new Date();
        // 获取年份
        const year = currentDate.getFullYear();
        // 获取月份（注意月份从0开始，所以要加1）
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        // 获取日期
        const date = String(currentDate.getDate()).padStart(2, '0');
        // 拼接为YYYY-MM-DD格式
        const formattedDate = `${year}-${month}-${date}`;
        this.dataForm.deliverDate = formattedDate;
        this.fetchData("SSDH", true)
      }
      this.formLoading = false

    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.orderNo = data.number
        }
      } catch (error) {
      }
    },

    goBack() {
      this.$emit('close', true)
    },
    handleConfirm(value) {
      this.$refs['productForm'].validate((valid) => {
        this.iszhi = valid ? false : true
      })
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (valid) {
          if (!this.dataFormTwo.data.length) {
            this.$message({
              message: '至少有一条发货明细',
              type: 'error',
              duration: 1500,
            })
            return
          }


          if (this.iszhi) {
            this.iszhi = false
            return
          }
          // let eve = this.dataFormTwo.data.some(({ deliveryQuantity }) => {
          //   return deliveryQuantity < 1
          // })
          // if (eve) {
          //   this.$message({
          //     message: `发货数量需不能为'0'`,
          //     type: 'error',
          //     duration: 1500,
          //   })
          //   return
          // }
          if (value == 'submit') {
            this.dataForm.inspectionStatus = 'inspected'
          }
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: '',
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj1 = {
            attachmentList: this.datafilelist,
            id: this.dataForm.id,
            remark: this.dataForm.remark,
            receiptLineList: [],
          }
          let obj = {
            attachmentList: this.datafilelist,
            notice: this.dataForm,
            noticeLineList: [],
            sourceNoticeList: this.btnType == 'add' ? this.dataFormTwo.data.map(item => { return { ordersId: item.ordersId, cooperativePartnerId: item.cooperativePartnerId, returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '' } }) : this.dataFormTwo.data
          }
          this.dataFormTwo.data.forEach((item, index) => {
            let dep1 = {
              billStatus: item.billStatus ? item.billStatus : '',
              calculationDirection: item.calculationDirection ? item.calculationDirection : '',
              deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
              deputyUnit: item.deputyUnit ? item.deputyUnit : '',
              mainUnit: item.mainUnit ? item.mainUnit : '',
              ordersId: item.ordersId,
              notifyType: 'sale',
              id: item.id ? item.id : '',
              classAttribute: item.classAttribute,
              productsId: item.productsId,
              // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
              ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
              pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
              ratio: item.ratio ? item.ratio : '',
              receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
              remark: item.remark ? item.remark : '',
              returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
            }
            obj1.receiptLineList.push(dep1)
            if (this.btnType == 'add' || this.btnType == 'copy') {
              let dep = {
                calculationDirection: item.calculationDirection ? item.calculationDirection : '',
                deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                deputyUnit: item.deputyUnit ? item.deputyUnit : '',
                mainUnit: item.mainUnit ? item.mainUnit : '',
                ordersId: item.ordersId,
                notifyType: 'sale',
                inspectionResults: 'qualified',
                qualifiedQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                id: '',
                classAttribute: item.classAttribute,
                productsId: item.productsId,
                ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
                ratio: item.ratio ? item.ratio : '',
                // receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
                remark: item.remark ? item.remark : '',
                returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
                sourceNoticeLineList: [
                  {
                    id: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].id : '',
                    deliveryQuantity: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].deliveryQuantity : item.deliveryQuantity,
                    ordersId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].ordersId : item.ordersId,
                    ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                    returnDeliveryNoticeId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeId : '',
                    returnDeliveryNoticeLineId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeLineId : '',
                  }
                ]
              }
              obj.noticeLineList.push(dep)
            } else {
              let dep2 = {
                billStatus: item.billStatus ? item.billStatus : '',
                calculationDirection: item.calculationDirection ? item.calculationDirection : '',
                deliveryQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                deputyUnit: item.deputyUnit ? item.deputyUnit : '',
                mainUnit: item.mainUnit ? item.mainUnit : '',
                ordersId: item.ordersId,
                notifyType: 'sale',
                inspectionResults: 'qualified',
                qualifiedQuantity: item.deliveryQuantity ? item.deliveryQuantity : '',
                id: '',
                classAttribute: item.classAttribute,
                productsId: item.productsId,
                ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
                ratio: item.ratio ? item.ratio : '',
                receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
                remark: item.remark ? item.remark : '',
                returnDeliveryNoticeId: this.dataForm.id ? this.dataForm.id : '',
                sourceNoticeLineList: [
                  {
                    id: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].id : '',
                    deliveryQuantity: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].deliveryQuantity : item.deliveryQuantity,
                    ordersId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].ordersId : item.ordersId,
                    ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
                    returnDeliveryNoticeId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeId : '',
                    returnDeliveryNoticeLineId: item.sourceNoticeLineList ? item.sourceNoticeLineList[0].returnDeliveryNoticeLineId : '',
                  }
                ]
              }
              obj.noticeLineList.push(dep2)
            }
          })

          let isQuantity = this.dataFormTwo.data.some((item, index) => {
            return item.ordersNum && item.deliveryQuantity * 1 + item.outboundQuantity * 1 + item.undeliveredQuantity * 1 > item.ordersNum * 1
          })
          if (!this.dataForm.exchangeGoodsFlag && isQuantity) {
            this.$confirm(`总发货数量大于订单数量,是否继续？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.btnLoading = true
              let formMethod = null;
              if (this.btnType == 'edit') {
                formMethod = editQuotationMsendlist
              } else if (this.btnType == 'add' || this.btnType == 'copy') {
                obj.notice.deliveryStatus = 'undelivered'
                formMethod = addQuotationsendlist
              }
              formMethod(obj).then(res => {
                let msg = "";
                if (value == 'draft') {
                  this.submitmethodsTitle = "保存成功"
                } else if (value == 'submit') {
                  this.submitmethodsTitle = "提交成功"
                }
                this.tipsvisible = true
                // this.$message({
                //   message: msg,
                //   type: 'success',
                //   duration: 1500,
                // })
                // this.visible = false
                // this.btnLoading = false
                // this.$emit('close', true)
              }).catch(() => {
                this.btnLoading = false
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          } else {
            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'edit') {
              formMethod = editQuotationMsendlist
            } else if (this.btnType == 'add' || this.btnType == 'copy') {
              obj.notice.deliveryStatus = 'undelivered'
              formMethod = addQuotationsendlist
            }
            formMethod(obj).then(res => {
              let msg = "";
              if (value == 'draft') {
                this.submitmethodsTitle = "保存成功"
              } else if (value == 'submit') {
                this.submitmethodsTitle = "提交成功"
              }
              this.tipsvisible = true
            }).catch(() => {
              this.btnLoading = false
            })
          }
        }
      })
    }
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
</style>