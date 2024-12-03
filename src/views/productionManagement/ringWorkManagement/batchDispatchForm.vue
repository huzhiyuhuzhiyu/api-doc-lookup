<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" content="改派" />
        <div class="options">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            提交</el-button>
          <el-button @click="goBack">{{ $t("common.cancelButton") }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <div style="
            line-height: 33px;
            font-size: 18px;
            border-bottom: 1px solid #dcdfe6;
            background: #fafafa;
            padding-left: 5px;
          ">
          <h5>产品信息</h5>
        </div>
        <el-form ref="dataForms" :model="dispatchForm" :rules="dataRule" label-width="160px" label-position="top">
          <el-row :gutter="30" class="custom-row">
            <el-col :sm="12" :xs="24">
              <el-form-item label="工单号" prop="orderNo">
                <el-input readonly placeholder="工单号" disabled v-model="dispatchForm.orderNo"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :xs="24">
              <el-form-item label="产品编码" prop="productCode">
                <el-input placeholder="产品编码" disabled v-model="dispatchForm.productCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="产品名称" prop="productName">
                <el-input placeholder="产品名称" disabled v-model="dispatchForm.productName"></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :xs="24">
              <el-form-item label="品名规格" prop="productDrawingNo">
                <el-input placeholder="品名规格" disabled v-model="dispatchForm.productDrawingNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="工序编码" prop="processCode">
                <el-input placeholder="工序编码" disabled v-model="dispatchForm.processCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="工序名称" prop="processName">
                <el-input placeholder="工序名称" disabled v-model="dispatchForm.processName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="生产数量" prop="productionQuantity">
                <el-input placeholder="生产数量" disabled v-model="dispatchForm.productionQuantity"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="合格数量" prop="qualifiedQuantity">
                <el-input placeholder="合格数量" disabled v-model="dispatchForm.qualifiedQuantity"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="不合格数量" prop="unqualifiedQuantity">
                <el-input placeholder="不合格数量" disabled v-model="dispatchForm.unqualifiedQuantity"></el-input>
              </el-form-item>
            </el-col>
        
            <el-col :sm="12" :xs="24">
              <el-form-item label="班组" prop="workGroupId">
                <el-select v-model="dispatchForm.workGroupId" placeholder="" class="applySelect" disabled
                  style="width: 70%; display: none">
                  <el-option
                    v-for="(item, index) in dispatchForm.workOrderResMap ? dispatchForm.workOrderResMap.work_group : []"
                    :key="index" :label="item.resourceName" :value="item.resourceId"></el-option>
                </el-select>
                <el-button @click="selectWorkgroupFun(dispatchForm)" type="text" class="underline-button"
                  :disabled="dispatchForm.processingType != 'self_produced'">
                  {{ dispatchForm.workGroupId ? dispatchForm.workGroupName : "请选择班组" }}
                </el-button>
              </el-form-item>

            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="设备" prop="equipmentId">
                <el-select v-model="dispatchForm.equipmentId" placeholder="" clearable class="applySelect"
                  style="width: 70%; display: none" disabled>
                  <el-option
                    v-for="(item, index) in dispatchForm.workOrderResMap ? dispatchForm.workOrderResMap.device : []"
                    :key="index" :label="item.resourceName + '(' + item.resourceCode + ')'"
                    :value="item.resourceId"></el-option>
                </el-select>

                <el-button v-if="!dispatchForm.pointLocationCode" @click="selectDeviceFun(dispatchForm)" type="text"
                  class="underline-button" :disabled="dispatchForm.processingType != 'self_produced'">
                  {{ dispatchForm.equipmentId ? dispatchForm.equipmentName + "(" + dispatchForm.equipmentCode + ')' :
                  "请选择设备" }}
                </el-button>
                <el-button v-else @click="selectDeviceFun(dispatchForm)" type="text" class="underline-button"
                  :disabled="dispatchForm.processingType != 'self_produced'">
                  {{ dispatchForm.equipmentId ?
                    dispatchForm.equipmentName + '-' + dispatchForm.pointLocationName + "(" + dispatchForm.equipmentCode +
                    ')' :
                  "请选择设备" }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item label="人员" prop="personId">
                <el-select v-model="dispatchForm.personId" placeholder="" clearable style="width: 60%; display: none"
                  class="applySelect" disabled>
                  <el-option
                    v-for="(item, index) in dispatchForm.workOrderResMap ? dispatchForm.workOrderResMap.personnel : []"
                    :key="index" :label="item.resourceName" :value="item.resourceId"></el-option>
                </el-select>
                <el-button @click="selectPersonnelFun(dispatchForm)" type="text" class="underline-button"
                  :disabled="dispatchForm.processingType != 'self_produced'">
                  {{ dispatchForm.personId ? dispatchForm.personName : "请选择人员" }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
                  {{ totalData[item][0].completedQuantity }}/{{ totalData[item][0].dispatchQuantity }}个
                </p>
                <p style="margin-top: 4px; font-size: 12px">
                  {{ totalData[item][1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}-
                  {{ totalData[item][1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                  {{ totalData[item][1].completedQuantity }}/{{ totalData[item][1].dispatchQuantity }}个
                </p>
              </div>
              <div v-else-if="totalData[item].length == 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                    ".") }}-{{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                  {{ totalData[item][0].completedQuantity }}/{{ totalData[item][0].dispatchQuantity }}个
                </p>
              </div>

              <p v-if="totalData[item].length" style="margin-top: 4px; font-size: 12px">
                派工截止：{{ totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1]
                  .replace("-", ".") }}
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
                  {{ totalData[item][totalData[item].length - 2].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                    ".") }}-
                  {{ totalData[item][totalData[item].length - 2].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                    ".") }}
                  {{ totalData[item][totalData[item].length - 2].completedQuantity
                  }}/{{ totalData[item][totalData[item].length - 2].dispatchQuantity }}个
                </p>
                <p style="margin-top: 4px; font-size: 12px">
                  {{ totalData[item][totalData[item].length - 1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                    ".") }}-
                  {{ totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                    ".") }}
                  {{ totalData[item][totalData[item].length - 1].completedQuantity
                  }}/{{ totalData[item][totalData[item].length - 1].dispatchQuantity }}个
                </p>
              </div>
              <div v-else-if="totalData[item].length == 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                    ".") }}-{{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                  {{ totalData[item][0].completedQuantity }}/{{ totalData[item][0].dispatchQuantity }}个
                </p>
              </div>

              <p v-if="totalData[item].length" style="margin-top: 4px; font-size: 12px">
                派工截止：{{ totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                  ".") }}
                <el-button class="elbutton" type="text" size="mini"
                  @click.stop="getDetailFun(item, totalData[item], '班组')"
                  :style="item.split('_')[0] == currentWorkgroupId ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;' : ''">详细</el-button>
              </p>
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg" :gutter="0" style="margin: 12px 0" v-if="routingProResMapDiaTitle == '设备资源'">
          <el-col :span="4" class="personBox" :class="[item == currentDeviceId ? 'active' : '']"
            v-for="(item, index) in deviceData" :key="index">
            <div class="grid-content bg-purple" @click="changresouce(item, '设备')" @dblclick="selectResouce(item, '设备')"
              :style="!totalData[item].length ? 'height:100%' : ''">
              <p style="margin-top: 14px; font-size: 16px" :style="item.split('_').length > 3 ? 'font-size:14px' : ''">{{
                item.split("_").length > 3 ? item.split("_")[1] + '-' + item.split("_")[3] : item.split("_")[1] }}</p>
              <p style="font-size: 16px">
                {{ item.split("_")[2] ? item.split("_")[2] : "--" }}
              </p>
              <div v-if="totalData[item].length > 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}-
                  {{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                  {{ totalData[item][0].completedQuantity }}/{{ totalData[item][0].dispatchQuantity }}个
                </p>
                <p style="margin-top: 4px; font-size: 12px">
                  {{ totalData[item][1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}-
                  {{ totalData[item][1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                  {{ totalData[item][1].completedQuantity }}/{{ totalData[item][1].dispatchQuantity }}个
                </p>
              </div>
              <div v-else-if="totalData[item].length == 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}-
                  {{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".")
                  }}
                  {{ totalData[item][0].completedQuantity }}/{{
                    totalData[item][0].dispatchQuantity
                  }}个
                </p>
              </div>

              <p v-if="totalData[item].length" style="margin-top: 4px; font-size: 12px">
                派工截止：{{ totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                  ".") }}
                <el-button class="elbutton" type="text" size="mini"
                  @click.stop="getDetailFun(item, totalData[item], '设备')"
                  :style="item == currentDeviceId ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;' : ''">
                  详细
                </el-button>
              </p>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog title="工单数据" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body
        :visible.sync="detailDiaFlag" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1180px">
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
                <el-input v-model="dispatchSearchForm.processName" placeholder="请输入工序名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-date-picker v-model="daterangeList" type="daterange" value-format="yyyy-MM-dd" style="width: 100%"
                  clearable start-placeholder="请选择创建开始日期" end-placeholder="请选择创建结束日期">
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
        <el-table ref="product" :data="detailDataList" border max-height="600">
          <el-table-column type="index" width="70" label="序号" />
          <el-table-column prop="orderNo" label="工单号" min-width="200"></el-table-column>
          <el-table-column prop="productCode" label="产品编码" min-width="120"></el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="120"></el-table-column>
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="300" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processCode" label="工序编码" width="100" />
          <el-table-column prop="processName" label="工序名称" width="100" />
          <el-table-column prop="planStartDate" label="计划开始日期" width="140" />
          <el-table-column prop="planEndDate" label="计划结束日期" width="140" />
          <el-table-column prop="dispatchQuantity" label="派工数量" width="100" />
          <el-table-column prop="completedQuantity" label="完工数量" width="100" />
          <el-table-column prop="createTime" label="创建时间" width="120">
            <template scope="scope">
              <div>{{ scope.row.createTime ? dispatchForm.createTime.substring(0, 10) : '' }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
          <span style="font-weight:500;margin-right:10px">总派工数量：{{ totalDispatchQuantity }}</span>
          <span style="font-weight:500;margin-right:10px">总完工数量：{{ totalCompletedQuantity }}</span>
        </div>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import {
  getprodOrderList,
  prodOrderInfo,
  addProdOrder,
  updateprodOrderFinished,
  prodOrderDispatch,
  dispatchListMap,
} from "@/api/productOrdes/finishedProductOrders";
 
import { detailProcess, getProcessList, getWorkListMap, addProdPlanArrange } from '@/api/basicData/processSettingss.js'
import { detailDispatchData, reassignment } from '@/api/productOrdes/dispatchTicketInquiry'
import { detailWorkData,changProdWork } from '@/api/productOrdes/index.js'

export default {
  data() {
    return {
      detailDiaFlag: false,
      dispatchForm: {},
      btnLoading: false,
      routingProResMapDiaTitle: "",
      formLoading: false,
      routingProResMapDiaFlag: false,
      dispatchSearchForm: {
        resIdList: [],
        resType: "",
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      },
      daterangeList: [],
      detailDataList: [],
      workgroupData: [],
      deviceData: [],
      personnelData: [],
      totalData: [],
      currentPersonId: "",
      currentWorkgroupId: "",
      currentDeviceId: "",
      index: null,
      idKey:"",

      dataRule: {
        planEndDate: [
          { required: true, message: "请选择计划结束日期", trigger: "change" },
        ],
        planStartDate: [
          { required: true, message: "请选择计划结束日期", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    totalDispatchQuantity: function () {
      var totalNums = 0;
      if (!this.detailDataList.length) return
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].dispatchQuantity])
      }
      return totalNums
    },
    totalCompletedQuantity: function () {
      var totalNums = 0;
      if (!this.detailDataList.length) return
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].completedQuantity])
      }
      return totalNums
    },
  },
  mounted() { },
  methods: {





    selectResouce(item, type) {
      console.log("双击item", item);
      if (type == "人员") {
        this.dispatchForm.personId = item.split("_")[0];
        this.dispatchForm.workOrderResMap.personnel.forEach((item) => {
          if (item.resourceId == this.dispatchForm.personId) {
            this.dispatchForm.personName = item.resourceName;
          }
        });
      }
      if (type == "班组") {
        this.dispatchForm.workGroupId = item.split("_")[0];
        this.dispatchForm.workOrderResMap.work_group.forEach((item) => {
          if (item.resourceId == this.dispatchForm.workGroupId) {
            this.dispatchForm.workGroupName = item.resourceName;
          }
        });
      }
      if (type == "设备") {
        this.$set(this.dispatchForm,'pointLocationName',"")
        this.$set(this.dispatchForm,'pointLocationCode',"")
        this.dispatchForm.equipmentId = item.split("_")[0];
        this.dispatchForm.equipmentName = item.split("_")[1];
        this.dispatchForm.equipmentCode = item.split("_")[2];
        if (item.split("_").length > 3) {
          this.dispatchForm.pointLocationName = item.split("_")[3];
          this.dispatchForm.pointLocationCode = item.split("_")[4];
        }else{
          this.dispatchForm.pointLocationName = ""
          this.dispatchForm.pointLocationCode = "";
        }
        // this.dispatchForm.workOrderResMap.device.forEach((item) => {
        //     if (item.resourceId == this.dispatchForm.equipmentId) {
        //         this.dispatchForm.equipmentName =
        //             item.resourceName + "(" + item.resourceCode + ")";
        //     }
        // });
      }
      console.log("'this.workerList'", this.workerList);
      this.$forceUpdate();
      this.routingProResMapDiaFlag = false;
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
        this.currentDeviceId = item
      }
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
        if (this.dispatchSearchForm.resType == "device") {
          this.detailDataList = res.data[this.idKey];

        } else {
          let arr = Object.keys(res.data);
          console.log(555, res.data[arr[0]]);
          this.detailDataList = res.data[arr[0]]
        }
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
      this.idKey = id
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
    // 选择班组
    selectWorkgroupFun(scope) {
      console.log("班组", scope);
      if (this.dispatchForm.workOrderResMap) {
        if (this.dispatchForm.workOrderResMap.work_group) {
          this.index = scope.$index;
          this.currentWorkgroupId = this.dispatchForm.workGroupId;
          let workgroupData = this.dispatchForm.workOrderResMap.work_group;
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
      if (this.dispatchForm.workOrderResMap) {
        if (this.dispatchForm.workOrderResMap.device) {
          this.index = scope.$index;
          if (this.dispatchForm.pointLocationCode) {
            this.currentDeviceId = this.dispatchForm.equipmentId ? this.dispatchForm.equipmentId + "_" + this.dispatchForm.equipmentName + "_" + this.dispatchForm.equipmentCode + '_' + this.dispatchForm.pointLocationName + '_' + this.dispatchForm.pointLocationCode : "";

          } else {
            this.currentDeviceId = this.dispatchForm.equipmentId ? this.dispatchForm.equipmentId + "_" + this.dispatchForm.equipmentName + "_" + this.dispatchForm.equipmentCode : "";

          }
          let deviceDataData = this.dispatchForm.workOrderResMap.device;
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
          getWorkListMap(obj).then((res) => {
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

      if (this.dispatchForm.workOrderResMap) {
        if (this.dispatchForm.workOrderResMap.personnel) {
          this.currentPersonId = this.dispatchForm.personId;
          this.index = scope.$index;
          let personnelData = this.dispatchForm.workOrderResMap.personnel;
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
    clearGroup(data) {
      console.log("班组", data);
    },
    clearPerson(data) {
      console.log("人员", data);
    },

    goBack() {
      this.$emit("close",true); 
    },
    init(id) {
      detailWorkData(id).then(res => {
        console.log("工单详情", res);
        this.dispatchForm = res.data 
        // this.dataForm = res.data.dispatch
        // this.tableData = res.data.workRecordList

        let obj = {
          id: this.dispatchForm.productionOrderId,
          dispatch: "1",
        };
        prodOrderInfo(obj).then((res) => {
          console.log("生产详情", res);
          res.data.workOrderList.forEach((item) => {
            if (item.processId == this.dispatchForm.processId) {

              if (item.workOrderResMap) {
                this.dispatchForm.workOrderResMap = item.workOrderResMap
                this.dispatchForm.processingType = item.processingType
                this.dispatchForm.firstFlag = item.firstFlag
                // this.dispatchForm.workOrderResMap=
                if (item.workOrderResMap && item.workOrderResMap.personnel) {
                  this.dispatchForm.personId = item.workOrderResMap.personnel[0].resourceId;
                  this.dispatchForm.personName = item.workOrderResMap.personnel[0].resourceName;
                }
                console.log("6666", typeof item.workOrderResMap.personnel);
                if (
                  this.dispatchForm.workOrderResMap.work_group &&
                  this.dispatchForm.workOrderResMap.work_group.length == 1
                ) {
                  this.dispatchForm.workGroupId = item.workOrderResMap.work_group[0].resourceId;
                  this.dispatchForm.workGroupName = item.workOrderResMap.work_group[0].resourceName;
                }
                if (
                  this.dispatchForm.workOrderResMap.device &&
                  this.dispatchForm.workOrderResMap.device.length == 1
                ) {
                  this.dispatchForm.equipmentId = item.workOrderResMap.device[0].resourceId;
                  this.dispatchForm.equipmentName = item.workOrderResMap.device[0].resourceName;
                  this.dispatchForm.equipmentCode = item.workOrderResMap.device[0].resourceCode;
                  this.dispatchForm.pointLocationCode = item.workOrderResMap.device[0].pointLocationCode;
                  this.dispatchForm.pointLocationName = item.workOrderResMap.device[0].pointLocationName;
                } 

              } else {
                this.dispatchForm.workOrderResMap = []
              }
            }

          });
          this.workerList = res.data.workOrderList;
          console.log(" this.workerList", this.workerList);
        })
      })

    },
    
    fmatDateFun(data) {
      const date = new Date(data);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 月份从0开始，所以要加1
      const day = date.getDate();

      const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      return formattedDate
    },
    async handleConfirm() {

      this.btnLoading = true

      changProdWork([this.dispatchForm]).then(res => {
        this.$message({
          message: "改派成功",
          type: "success",
          duration: 1500,
          onClose: () => {
            this.btnLoading = false;
            this.$emit("close", true);
          },
        });
      }).catch(() => { this.btnLoading = false });
      console.log(this.dispatchForm);

    },
  },
};
</script>

<style lang="scss" scoped>
.JNPF-common-table {
  border: 1px solid #ebeef5 !important;
}

// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

.el-button--small {
  // padding: 1;
}
</style>

<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
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

::v-deep .el-table__body-wrapper {
  height: auto !important;
}

.tableContainer {
  flex: 1 0 0;
  height: auto;
  overflow: hidden;
}

.el-form-item--small.el-form-item {
  margin-bottom: 0;
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

.personBox p {
  text-align: center;
}

.personBox:nth-child(n + 6) {
  margin-top: 12px;
}

::v-deep .elbutton span {
  font-size: 14px !important;
}

::v-deep.routingProRes .el-dialog__body {
  height: 500px;
}

::v-deep .applySelect .el-icon-arrow-up:before {
  content: "";
}

::v-deep .el-col-24 {
  margin-top: 10px;
}

.underline-button {
  text-decoration: underline;
}
</style>
