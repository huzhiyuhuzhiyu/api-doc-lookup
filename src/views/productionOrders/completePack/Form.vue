<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="type == 'add' ? '新建总成生产装箱单' : type == 'edit' ? '编辑总成生产装箱单' : '查看总成生产装箱单'" />
          <div class="options" v-if="type != 'look'">
            <el-button type="success" :loading="btnLoading" @click="dataFormSubmit('draft')">保存草稿</el-button>
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit('submit')">
              保存并提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                   <h5>基本信息</h5>
              </div>
              <el-row :gutter="30" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="生产装箱来源" prop="packingSource">
                      <el-select @change="showTipProductType" v-model="dataForm.packingSource" placeholder="请选择生产装箱来源"
                        style="width: 100%;" :disabled="type !== 'add'">
                        <el-option v-for="(item, index) in packingSourceList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="6" :xs="24">
                    <el-form-item label="装箱类型" prop="packingType">
                      <el-select v-model="dataForm.packingType" placeholder="请选择装箱类型" style="width: 100%;"
                        :disabled="type !== 'add'">
                        <el-option v-for="(item, index) in packingTypeList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :span="24">
                    <el-form-item label="客户名称" prop="partnerName" ref="partnerName">
                      <!-- 供应商选择弹窗  -->
                      <ComSelect-page :beforeSubmit="beforeSubmitPartner" clearable :isdisabled="type === 'look'"
                        :treeNodeClick="treeNodeClick" :value="dataForm.partnerName" ref="ComSelect-page"
                        @change="supplierdata" :tableItems="PartnerTableItems" :placeholder="'请选择客户'" title="选择客户"
                        treeTitle="客户分类" :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                        :listRequestObj="PartnerListRequestObj"
                        :paramsObj="{ proData: dataFormTwo.data, cooperativePartnerId: dataForm.cooperativePartnerId }"
                        :searchList="PartnerTableSearchList" />
                    </el-form-item>
                  </el-col>


                  <el-col :sm="6" :xs="24" v-if="dataForm.packingType === 'mixed'">
                    <el-form-item label="标准箱" prop="standardBoxName">
                      <ComSelect-page :value="dataForm.standardBoxName" :isdisabled="type == 'look'" placeholder="请选择产品名称"
                        :beforeSubmit="beforeSubmit" ref="ComSelect-page" @change="changeStandard" :renderTree="false"
                        :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr"
                        :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
                        :searchList="ProductTableSearchList" :elementShow="true"
                        :paramsObj="{ types: 'standardBox', standardBoxName: dataForm.standardBoxName }" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.packingType === 'mixed'">
                    <el-form-item label="零头箱" prop="oddBoxName">
                      <ComSelect-page :beforeSubmit="beforeSubmit2" :value="dataForm.oddBoxName" :renderTree="false"
                        :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page" @change="changeStandard"
                        :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr"
                        :listMethod="getProductList" :listRequestObj="ProductListRequestObj"
                        :searchList="ProductTableSearchList" :elementShow="true"
                        :paramsObj="{ types: 'oddBox', oddBoxName: dataForm.oddBoxName }" />

                    </el-form-item>
                  </el-col>


                  <el-col :sm="6" :xs="24">
                    <el-form-item label="总箱数" prop="num" ref="num">
                      <el-input v-model="dataForm.num" placeholder="总箱数" maxlength="20" disabled>{{ computedValue }}
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="备注" prop="remark" ref="remark">
                      <el-input type="textarea" :rows="3" v-model="dataForm.remark"
                        :placeholder="type == 'look' ? '' : '请输入备注'" maxlength="200"
                        :disabled="type == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
                <h5>产品信息</h5>
              </div>
              <div v-if="type !== 'look'">
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                  icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openProduct()">选择{{
                    dataForm.packingSource === 'sale_order' ? '销售订单' : dataForm.packingSource === 'plan' ? '计划' :
                    dataForm.packingSource === 'produce_order' ? '生产订单' : '生产工单' }}</el-button>|
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                  icon="el-icon-plus" :disabled="type == 'look' ? true : false" @click="openBarcode()">生成条码</el-button>|
                <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important"
                  :disabled="type == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">清空产品</el-button>|
              </div>

              <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" v-loading="showType">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data"
                  :max-height="customStyleData" :data="dataFormTwo.data" id="table"
                  @selection-change="handeleProductInfoData" ref="table">
                  <el-table-column type="selection" width="60" fixed="left" align="center"
                    v-if="dataForm.packingType === 'mixed' && type !== 'look'" key="selection"
                    :selectable="checkSelectable" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                  <!-- <el-table-column prop="orderNo" label="生产订单号" key="orderNo" min-width="200" fixed="left"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="orderNo">
                        <div class="viewData">
                          <span>{{ scope.row.orderNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column> -->
                  <el-table-column prop="productsCode" label="产品编码" key="productsCode" min-width="200"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="productsCode">
                        <div class="viewData">
                          <span>{{ scope.row.productsCode }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="productsName" label="产品名称" key="productsName" min-width="200"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="productsName">
                        <div class="viewData">
                          <span>{{ scope.row.productsName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="drawingNo" label="产品图号" key="drawingNo" min-width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="drawingNo">
                        <div class="viewData">
                          <span>{{ scope.row.drawingNo }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="routingName" v-if="dataForm.packingSource === 'produce_process'" label="工艺路线名称"
                    key="routingName" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="routingName">
                        <div class="viewData">
                          <span>{{ scope.row.routingName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="processName" v-if="dataForm.packingSource === 'produce_process'" label="工序名称"
                    key="processName" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="processName">
                        <div class="viewData">
                          <span>{{ scope.row.processName }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalNum" label="数量" key="totalNum" min-width="140"
                    v-if="dataForm.packingSource === 'produce_process'">
                    <template slot-scope="scope">
                      <el-form-item prop="totalNum">
                        <div class="viewData">
                          <span>{{ scope.row.totalNum }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <el-table-column prop="mainUnit" label="单位(主)" key="mainUnit" min-width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-form-item prop="mainUnit">
                        <div class="viewData">
                          <span>{{ scope.row.mainUnit }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="packingPersonByName" label="装箱人" key="packingPersonByName" min-width="140"
                    v-if="dataForm.packingSource !== 'produce_process'">
                    <template slot="header">
                      <span class="required">*</span>装箱人
                    </template>
                    <template slot-scope="scope">
                      <el-form-item prop="packingPersonByName">
                        <el-select :disabled="type === 'look'" placeholder="请选择装箱人" v-model="scope.row.packingPersonBy"
                          @focus="handleVisibleChange(scope.row.lwoId,scope.$index)">
                          <el-option v-for="item in scope.row.personList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="waitPackingQuantity" label="待装箱总数量" key="waitPackingQuantity" min-width="140"
                    v-if="dataForm.packingSource !== 'produce_process' && type != 'look'">
                    <template slot-scope="scope">
                      <el-form-item prop="waitPackingQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.waitPackingQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalNum" label="装箱总数量" key="totalNum" min-width="140"
                    v-if="dataForm.packingType === 'single' && dataForm.packingSource !== 'produce_process'">
                    <template slot="header">
                      <span class="required">*</span>装箱总数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'totalNum'" :rules='productRules.totalNum'>
                        <el-input v-model="scope.row.totalNum" maxlength="20" :disabled="type === 'look'"
                          placeholder="请输入装箱总数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <!-- 混装 -->
                  <el-table-column v-if="dataForm.packingType === 'mixed'" key="packingQuantity" prop="packingQuantity"
                    label="已装箱数量" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item prop="packingQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.packingQuantity }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="dataForm.packingType === 'mixed'" key="packedQuantity" prop="packedQuantity"
                    :label="dataForm.packingSource !== 'produce_process' ? '剩余装箱数量' : '待装箱数量'" min-width="180">
                    <template slot-scope="scope">
                      <el-form-item prop="packedQuantity">
                        <div class="viewData">
                          <span>{{ scope.row.packedQuantity ? scope.row.packedQuantity : 0 }}</span>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>

                  <!-- 单装 -->
                  <el-table-column prop="standardBoxName" label="标准箱" min-width="180"
                    v-if="dataForm.packingType === 'single'" key="standardBoxName">
                    <template slot="header">
                      <span class="required">*</span>标准箱
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'standardBoxName'"
                        :rules='productRules.standardBoxName'>
                        <ComSelect-page clearable :beforeSubmit="beforeSubmitStand" :value="scope.row.standardBoxName"
                          :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page" @change="addth"
                          :renderTree="false" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
                          :methodArr="ProductMethodArr" :listMethod="getProductList"
                          :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="true"
                          :paramsObj="{ index: scope.$index, types: 'standardBox', standardBoxName: scope.row.standardBoxName }" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="dataForm.packingType === 'single' && dataForm.packingSource === 'produce_process'"
                    prop="packing" label="装箱数量" min-width="180" key="packing">
                    <template slot="header">
                      <span class="required">*</span>装箱数量
                    </template>
                    <template slot-scope="scope">
                      <!-- <el-form-item :prop="'data.' + scope.$index + '.' + 'packing'" :rules='productRules.packing'
                        v-if="!scope.row.defaultFlag">
                        <div class="viewData">
                          <span>{{ scope.row.packing }}</span>
                        </div>
                      </el-form-item> -->
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'packing'" :rules='productRules.packing'>
                        <el-input clearable v-model="scope.row.packing" maxlength="20" :disabled="type === 'look'"
                          placeholder="请输入装箱数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="dataForm.packingType === 'single' && dataForm.packingSource !== 'produce_process'"
                    prop="packing" label="标准箱数量" min-width="180" key="packings">
                    <template slot="header">
                      <span class="required">*</span>标准箱数量
                    </template>
                    <template slot-scope="scope">
                      <!-- <el-form-item :prop="'data.' + scope.$index + '.' + 'packing'" :rules='productRules.packing'
                        v-if="!scope.row.defaultFlag">
                        <div class="viewData">
                          <span>{{ scope.row.packing }}</span>
                        </div>
                      </el-form-item> -->
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'packing'" :rules='productRules.packing'>
                        <el-input clearable v-model="scope.row.packing" maxlength="20" :disabled="type === 'look'"
                          placeholder="请输入标准箱数量">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="oddBoxName" label="零头箱" v-if="dataForm.packingType === 'single'" min-width="180"
                    key="oddBoxName">
                    <template slot="header">
                      <span class="required">*</span>零头箱
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'data.' + scope.$index + '.' + 'oddBoxName'" :rules='productRules.oddBoxName'>
                        <ComSelect-page clearable :beforeSubmit="beforeSubmitStand2" :value="scope.row.oddBoxName"
                          :renderTree="false" :isdisabled="type == 'look'" placeholder="请选择产品名称" ref="ComSelect-page"
                          @change="addth" :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
                          :methodArr="ProductMethodArr" :listMethod="getProductList"
                          :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="true"
                          :paramsObj="{ index: scope.$index, types: 'oddBox', oddBoxName: scope.row.oddBoxName }" />


                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="num" label="箱数" v-if="dataForm.packingType === 'single'" min-width="140"
                    key="num">
                    <template slot-scope="scope">
                      <el-form-item prop="num">
                        <div class="viewData">
                          <span>{{ scope.row.num }}</span>
                        </div>
                      </el-form-item>

                    </template>
                  </el-table-column>


                  <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip key="remark">
                    <template slot-scope="scope">
                      <el-input :title="scope.row.remark" v-model="scope.row.remark" maxlength="200"
                        :disabled="type === 'look'" :placeholder="type == 'look' ? '' : '请输入备注'">{{
                          scope.row.remark }}
                      </el-input>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="180" fixed="right" key="look">
                    <template slot-scope="scope">
                      <el-button type="text" v-if="type != 'look'"
                        class="JNPF-table-delBtn" :disabled="type === 'look'"
                        @click="deleteLineList(scope.$index)">删除</el-button>
                      <el-button type="text" v-if="type === 'look' && dataForm.packingSource !== 'produce_process'"
                        size="mini" @click="lookProductionSource(scope.row.returnDeliveryNoticeLineId)">生产来源</el-button>
                    </template>
                  </el-table-column>

                </el-table>
              </el-form>



            </el-tab-pane>

            <el-tab-pane label="装箱条码" name="boxCode">
              <CodeTable @lookCode="lookCode" @delth="delequipment_process_relList" :tableData="tableData"
                :mixedTableData="mixedTableData" :listLoading="listLoading" :morePrintData="{
                  packingType: dataForm.packingType,
                  sourceOrderNo: dataForm.sourceOrderNo,
                  cooperativePartnerCode: dataForm.cooperativePartnerCode,
                  createTime: dataForm.submitDate || jnpf.getToday()
                }" :btnType="type" :show="activeName === 'boxCode'" :showRoutingLine="true" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <codeForm :standardBoxName="dataForm.standardBoxName" :oddBoxName="dataForm.oddBoxName"
          :standardBox="dataForm.standardBox" :oddBox="dataForm.oddBox" v-if="codeFormVisible" ref="codeForm"
          @codeData="mixCodeData" :showRoutingLine="true" />
        <sourceForm v-if="sourceFormVisible" ref="sourceForm" :showRoutingLine="true" />

        <ComSelect-page :beforeSubmit="beforeSubmitProduct" :listDataFormatting="ProductlistDataFormatting"
          ref="ComSelect-Product" @change="selectProduct" :tableItems="productionTableItems" title="选择生产订单"
          :renderTree="false" :listMethod="prodOrderPackingList" :paramsObj="{ proData: dataFormTwo.data }"
          :listRequestObj="productionListRequestObj" :searchList="productionTableSearchList" :elementShow="false"
          multiple />
        <ComSelect-page :beforeSubmit="beforeSubmitProduct" :listDataFormatting="worklistDataFormatting"
          ref="ComSelect-work" @change="selectWork" :tableItems="workTableItems" title="选择工单" :renderTree="false"
          :listMethod="getWorkPage" :paramsObj="{ proData: dataFormTwo.data }" :listRequestObj="workListRequestObj"
          :searchList="workTableSearchList" :elementShow="false" multiple />
        <!-- 增加销售订单 和 计划的选择列表 -->
        <ComSelect-page :beforeSubmit="beforeSubmitProduct" :listDataFormatting="saleDataFormatting" :isNeedDate="true"
          :searchDateList="searchDateList" ref="ComSelect-sale" @change="selectSale" :tableItems="saleTableItems"
          title="选择销售订单" :renderTree="false" :listMethod="getsaleOrderList" :paramsObj="{ proData: dataFormTwo.data }"
          :listRequestObj="saleListRequestObj" :searchList="saleTableSearchList" :elementShow="false" multiple />
        <ComSelect-page :beforeSubmit="beforeSubmitProduct" :listDataFormatting="planDataFormatting" ref="ComSelect-plan"
          @change="selectPlan" :tableItems="planTableItems" title="选择计划" :renderTree="false" :listMethod="getPlanList"
          :paramsObj="{ proData: dataFormTwo.data }" :listRequestObj="planListRequestObj" multiple
          :searchList="planTableSearchList" :elementShow="false" />
      </div>
    </transition>
    <!-- 订单来源明细 -->
    <el-dialog title="生产来源明细" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="sourceDialog"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px" append-to-body>
      <el-row :gutter="20" style="margin :10px 0">
        <el-table ref="workerDialog" v-loading="listLoading" :data="sourceList" border height="400">
          <el-table-column prop="ordersNo" label="销售单号" />
          <el-table-column prop="planOrderNo" label="计划单号" />
          <el-table-column prop="workOrderNo" label="工作令号" />
          <el-table-column prop="createTime" label="来源时间" />
        </el-table>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { addSalePackingList, updateSalePackingList, detailSalePackingList, prodOrderPackingList, producePersonList } from '@/api/warehouseManagement/packingList'
import barCodePrint from '@/views/warehouseManagement/containerControl/barcodeManagement/barCodePrint.js'
import { getprodOrderList } from '@/api/productOrdes/finishedProductOrders'     // 生产订单列表
import { getWorkPage } from "@/api/productOrdes/index"    // 工单管理 接口
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { getCooperativeData, getcategoryTree as getPartnerTree, getCooperativeInfo } from '@/api/basicData/index'   // 客户
import { getWorkList } from "@/api/productOrdes/index"
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getPlanList } from '@/api/calculationList/calculationList'
import { getOrderSourceList } from '@/api/productOrdes/finishedProductOrders'
import { mapGetters, mapState } from 'vuex'
import codeForm from '@/views/warehouseManagement/containerControl/components/codeForm.vue'
import sourceForm from '@/views/warehouseManagement/containerControl/components/source.vue'
import CodeTable from '@/views/warehouseManagement/containerControl/components/CodeTable.vue'
export default {
  components: {
    codeForm,
    sourceForm,
    CodeTable
  },
  data() {
    return {
      sourceFormVisible: false,
      getProductList, // 产品选择弹出框树状列表请求api
      getcategoryTree,
      getPartnerTree,
      getCooperativeData,
      getprodOrderList,
      getWorkPage,
      getsaleOrderList,
      getPlanList,
      prodOrderPackingList,
      // 生产订单弹窗渲染列表
      productionListRequestObj: {
        cooperativePartnerId: '',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        createByName: "",
        demandType: "",
        documentStatus: "submit",
        endTime: "",
        keyword: "",
        orderNo: "",
        orderStatus: "",
        packingFlag: 1,
        orderType: "",
        pageNum: 1,
        pageSize: 20,
        planEed: "",
        planEsd: "",
        planSed: "",
        planSsd: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productionStatus: "",
        receiveStatus: "",
        startTime: "",
        workOrderNo: "",
        businessCode: 'complete'
      },
      productionTableItems: [
        { prop: 'orderNo', label: '生产订单号', minWidth: 200, fixed: 'left', sortable: 'custom' },
        { prop: 'productCode', label: '产品编码', sortable: 'custom2' },
        { prop: 'productName', label: '产品名称', sortable: 'custom2' },
        { prop: 'productDrawingNo', label: '产品图号', sortable: 'custom2' },
        // { prop: 'completedQuantity', label: '已完成数量' },
        // { prop: 'packingQuantity', label: '已装箱数量' },
        { prop: 'waitingPackingQuantity', label: '待装箱数量' },
        { prop: 'createTime', label: '创建时间', sortable: 'custom' },
        { prop: 'createByName', label: '创建人' },
      ],

      productionTableSearchList: [
        { prop: 'productionOrderNo', label: '生产订单号', type: 'input' },
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productName', label: '产品名称', type: 'input' },
      ],
      // 工单列表弹窗需要
      workListRequestObj: {
        cooperativePartnerId: '',
        actualEed: "",
        actualSsd: "",
        createByName: "",
        demandType: "",
        endTime: "",
        packingFlag: 1,
        keyword: "",
        orderNo: "",
        orderType: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        stockFlag: 1,
        planEed: "",
        planSsd: "",
        processCode: "",
        processName: "",
        processingType: "",
        prodOrderStatus: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productionOrderNo: "",
        startTime: "",
        workOrderNo: "",
        businessCode: 'complete'
      },
      workTableItems: [
        { prop: 'productionOrderNo', label: '生产订单号', fixed: 'left', minWidth: 200, sortable: 'custom2' },
        { prop: 'orderNo', label: '工单号', fixed: 'left', minWidth: 200, sortable: 'custom' },
        { prop: 'productCode', label: '产品编码', sortable: 'custom2' },
        { prop: 'productName', label: '产品名称', sortable: 'custom2' },
        { prop: 'productDrawingNo', label: '产品图号', sortable: 'custom2' },
        { prop: 'routingName', label: '工艺路线名称', minWidth: 200, sortable: 'custom2' },
        { prop: 'processName', label: '工序名称', sortable: 'custom2' },
        // { prop: 'completedQuantity', label: '完成数量' },
        // { prop: 'packingQuantity', label: '已装箱数量' },
        { prop: 'waitingPackingQuantity', label: '待装箱数量' },
        { prop: 'createTime', label: '创建时间', sortable: 'custom' },
        { prop: 'createByName', label: '创建人' },
      ],

      workTableSearchList: [
        { prop: 'productionOrderNo', label: '生产订单号', type: 'input' },
        { prop: 'orderNo', label: '工单号', type: 'input' },
        { prop: 'productCode', label: '产品编码', type: 'input' },
        { prop: 'productName', label: '产品名称', type: 'input' },
        { prop: 'productDrawingNo', label: '产品图号', type: 'input' },
        { prop: 'processName', label: '工序名称', type: 'input' },
      ],
      // 销售订单 列表请求参数
      saleListRequestObj: {
        orderNo: "",
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        cooperativePartnerId: '',
        orderType: "",
        salesName: "",
        workOrderNo: "",
        sourceOrderNo: "",
        orderStartDate: "",
        orderEndDate: "",
        contractNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        orderCategory: "",
        shipmentStatus: "",
        orderState: "",
        productionStatus: "",
        documentStatus: "",
        approvalStatus: "",
        startTime: "",
        endTime: "",
        packingFlag: 1,
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        deliveryDateArr: [],
        businessCode: 'complete'
      },
      saleTableItems: [
        { prop: 'orderNo', label: '销售订单号', minWidth: 200, sortable: 'custom' },
        { prop: 'orderType', label: '订单类型' },
        { prop: 'workOrderNo', label: '工作令号' },
        { prop: 'orderDate', label: '订单日期', sortable: 'custom' },
        { prop: 'deliveryDate', label: '交货日期', sortable: 'custom' },
        { prop: 'createTime', label: '创建时间', sortable: 'custom' },
        { prop: 'createByName', label: '创建人' },
      ],

      saleTableSearchList: [
        { prop: 'orderNo', label: '销售订单号', type: 'input' },
        { prop: 'workOrderNo', label: '工作令号', type: 'input' },
        { prop: 'deliveryDateArr', label: '交货日期', type: 'date' },
      ],
      searchDateList: [
        { prop: 'deliveryDateArr', startTime: 'deliveryStartDate', endTime: 'deliveryEndDate' },
      ],
      // 计划  列表请求参数
      planListRequestObj: {
        planType: "",
        calcState: "",
        documentStatus: "",
        cooperativePartnerId: '',
        planNo: "",
        originNo: "",
        workOrderNo: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        packingFlag: 1,
        businessCode: 'complete'
      },
      planTableItems: [
        { prop: 'planNo', label: '计划单号', sortable: 'custom' },
        { prop: 'originNo', label: '销售订单号', sortable: 'custom' },
        { prop: 'workOrderNo', label: '工作令号' },
        { prop: 'planType', label: '计划类型' },
        { prop: 'createTime', label: '创建时间', sortable: 'custom' },
        { prop: 'createByName', label: '创建人' },
      ],

      planTableSearchList: [
        { prop: 'planNo', label: '计划单号', type: 'input' },
        { prop: 'originNo', label: '销售订单号', type: 'input' },
        { prop: 'workOrderNo', label: '工作令号', type: 'input' },
      ],

      //  客户 树请求
      PartnerMethodArr: { method: getPartnerTree, requestObj: { type: 'customer', } },
      // 客户 列表
      PartnerTableItems: [
        { prop: 'code', label: '客户编码', fixed: 'left' },
        { prop: 'name', label: '客户名称', fixed: 'left' },
        // { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' },
      ],
      // 客户搜索条件
      PartnerTableSearchList: [
        { prop: "code", label: "客户编码", type: 'input' },
        { prop: "name", label: "客户名称", type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: 'customer',
      },
      // material
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        productCategoryType: "packaging",
        classAttribute: "",
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '产品图号' },
        { prop: 'spec', label: '规格型号' },
        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeText', label: '产品分类' },
        { prop: "mainUnit", label: "主单位" }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件

      codeFormVisible: false,
      listLoading: false,
      tableData: [],
      mixedTableData: [],
      getWorkList,

      activeName: 'jcInfo',
      btnLoading: false,
      index: null,
      dataFormTwo: {
        data: []
      },
      dataForm: {
        packingSource: '',                     //生产订单来源
        orderNo: '',
        documentId: '',                    // 单据id
        cooperativePartnerId: '',
        sourceOrderNo: "",                      //  收货单号
        partnerName: '',                   // 供应商名称
        packingType: 'single',                   // 装箱类型
        remark: "",
        id: '',
        num: '',
        documentStatus: '',
        documentType: 'inbound_production',
        standardBox: '',                   //标准箱
        standardBoxName: '',
        oddBoxName: '',
        oddBox: '',                        // 零头箱
        businessCode: 'complete'
      },
      // 生产订单来源
      packingSourceList: [
        { label: "销售订单装箱", value: "sale_order" },
        { label: "计划装箱", value: "plan" },
        { label: "生产订单装箱", value: "produce_order" },
        { label: "生产工序装箱", value: "produce_process" },
      ],
      productArr: [],
      // 装箱类型
      packingTypeList: [
        { label: "单装", value: "single" },
        { label: "混装", value: "mixed" },
      ],
      type: "",


      rules: {
        packingSource: [{ required: true, message: '请选择生产装箱来源', trigger: ['change'] }],
        packingType: [{ required: true, message: '请选择装箱类型', trigger: ['change'] }],
        standardBoxName: [{ required: true, message: '请选择标准箱产品', trigger: ['change'] }],
        oddBoxName: [{ required: true, message: '请选择零头箱产品', trigger: ['change'] }],
      },
      productRules: {
        standardBoxName: [
          { required: true, trigger: ['change'] },
          { validator: this.formValidate({ type: 'noEmtry', params: ["标准箱包材不能为空", (errMsg) => { this.$message.error('标准箱：' + errMsg) }] }), trigger: 'change' }
        ],
        oddBoxName: [
          { required: true, trigger: ['change'] },
          { validator: this.formValidate({ type: 'noEmtry', params: ["零头箱不能为空", (errMsg) => { this.$message.error('零头箱：' + errMsg) }] }), trigger: 'change' }
        ],
        packing: [
          { validator: this.packingRule(), trigger: 'blur' },
          { required: true, trigger: ['blur'] },
          // { validator: this.formValidate('number', '装箱数量必须是整数', (errMsg) => { this.$message.error('装箱数量：' + errMsg) }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('装箱数量：不能为0') }), trigger: 'blur' },
          // { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => (this.dataFormTwo.data[rowIndex].totalNum * 1 >= value * 1), "装箱数量不能超过现有数量", (errMsg) => { this.$message.error('装箱数量：' + errMsg) }] }), trigger: 'blur' }
        ],
        totalNum: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate('positiveNumber', '', (errMsg) => { this.$message.error('装箱总数量：必须大于0') }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => this.dataFormTwo.data[rowIndex].totalNum <= this.dataFormTwo.data[rowIndex].waitPackingQuantity, "不能超过对应待装箱总数量", (errMsg) => { this.$message.error('装箱总数量：' + errMsg) }] }), trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      oldData: [],
      timeCode: '',
      codeCount: 0,
      oddNum: 0,        // 判断是否零头
      oddprice: '',        // 判断是否零头
      mixAllArr: [],
      oldDataTwo: [],        //切换单混 装后 回到老数据
      oldsData: [],
      tempArr2: [],
      showType: false,
      selectedData: [],
      customStyleData: 0,
      timeout: '',
      oldPackingSource: '',  // 切换装箱来源 取消 恢复原值
      sourceList: [],
      sourceDialog: false,
      personList: [],      // 生产人
    }
  },
  created() {
    this.personList.push({
      value: this.userInfo.userId,
      label: this.userInfo.userName
    })
  },
  mounted() {
    console.log(this.userInfo);
    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.table) return
      this.$nextTick(() => { this.$refs.table.doLayout() })
    }
    window.addEventListener('resize', this.clientResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.clientResize)
  },
  computed: {
    ...mapGetters(['userInfo']),
    computedValue() {
      let count = 0
      if (this.dataForm.packingType === 'single') {
        this.dataFormTwo.data.forEach(item => {
          if (item.num) {
            count += item.num * 1
          }
        })
      } else {
        count = this.mixAllArr.length
      }
      this.dataForm.num = count

      return this.dataForm.num
    },
  },
  watch: {
    'dataFormTwo.data': {
      handler: function (newVal, oldVal) {
        this.oldDataTwo = oldVal
        this.oddNum = 0
        this.oddprice = ''
        // this.tableData = [] 
        newVal.forEach(item => {
          if (Number(item.packing)) {
            if (Number(item.totalNum) && Number(item.packing) && Number(item.totalNum) >= Number(item.packing)) {
              let count = this.divide(item.totalNum, item.packing)
              if (count.quotient && !count.remainder) {
                item.num = this.jnpf.numberFormat(count.quotient)
              }
              if (count.quotient && count.remainder) {
                item.num = this.jnpf.numberFormat(count.quotient) + 1
                this.oddNum = 1
                this.oddprice = this.jnpf.numberFormat(count.remainder)
              }
              if (!count.quotient && count.remainder) {
                item.num = 0
              }
            } else if (Number(item.totalNum) && Number(item.packing) && Number(item.totalNum) < Number(item.packing)) {
              item.num = 1
            } else {
              item.num = 0
            }
            if (Number(item.packingQuantity) >= Number(item.totalNum)) {
              item.disabled = true
            } else {
              item.disabled = false
            }
            if (this.oldsData.length) {
              // this.oldsData.forEach(item2 => {
              //   if (Number(item.packing) !== Number(item2.packing)) {
              //     this.tableData = []
              //   }
              // })
            }
          } else {
            item.num = 0
          }
        })
        if (!this.tableData.length) {
          this.tempArr2 = newVal.map(item => item.packing)
        }
      },
      deep: true,
    },
    'dataForm.packingSource': {
      handler: function (newVal, oldVal) {
        this.oldPackingSource = oldVal
      },
    },
    'dataForm.packingType': {
      handler: function (newVal, oldVal) {
        this.$nextTick(() => { this.switchStyleheight() })
        // if (oldVal!=='') {
        if (this.type === 'add') {
          this.showTipBox(newVal, oldVal)
        }
        // }
      },
    },
  },
  methods: {
    switchStyleheight() {
      const mainRegion = this.$refs.productForm.$parent.$parent.$parent.$el // 表单页面区域
      const mainHeight = mainRegion.clientHeight;
      const TableFormTitle = this.$refs.elForm.$parent.$el // 表单页面区域
      const TableFormTitleHeight = TableFormTitle ? TableFormTitle.clientHeight : 0
      let maxHeight = mainHeight - TableFormTitleHeight
      maxHeight = maxHeight > 300 ? maxHeight : 300
      this.customStyleData = maxHeight - 220
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100);
      };
    },
    handleSelectionChange(data) {
      this.selectedData = data
    },
    //批量打印条码
    printWithLodop(row, type) {
      const callBack = () => {
        this.$refs.dataTable.clearSelection()
        this.selectedData = []
      }
      barCodePrint(row, callBack, type)
    },
    // 已经选择过生产订单产品后 ，再次选择 
    async beforeSubmitProduct(data, paramsObj) {
      let flag = true
      if (paramsObj.proData.length) {
        flag = await this.$confirm('已有产品信息，再次添加将清空装箱信息，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '清空成功!'
          });
          this.mixedTableData = []
          this.mixAllArr = []
          this.tableData = []
          this.dataFormTwo.data.forEach(item => {
            item.disabled = false
            item.packingQuantity = 0
            item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
            // item.oddBox = ''
            // item.oddBoxName = ''
            // item.standardBox = ''
            // item.standardBoxName = ''
            if (item.defaultFlag) {
              item.packing = ''
            }
          })
          this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
          return true
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          return false
        })
      }
      return flag
    },
    // 有装箱信息后，主表标准箱和零头箱 
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
        if (paramsObj.standardBoxName) {
          flag = await this.$confirm('已有装箱信息，修改标准箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.mixedTableData = []
            this.mixAllArr = []
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })

            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      return flag
    },
    async beforeSubmit2(data, paramsObj) {
      let flag = true
      if (this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
        if (paramsObj.oddBoxName) {
          flag = await this.$confirm('已有装箱信息，修改零头箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.mixedTableData = []
            this.mixAllArr = []
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      return flag
    },
    // 有条码信息 装箱数量变化
    packingRule() {
      return async (rule, value, callback) => {
        if (Number(value) && this.tableData.length) {
          let index = Number(rule.field.match(/\d+/)[0])
          if (this.dataForm.packingType === 'single' && this.tableData.length) {
            if (!this.tempArr2[index]) {
              this.tempArr2[index] = value
              callback()
            } else if (this.tempArr2[index] != value) {
              let flag = await this.$confirm('已有装箱信息，修改装箱数量将清空装箱信息，您是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).catch(() => false)
              if (flag) {
                this.$message({
                  type: 'success',
                  message: '清空成功!'
                });
                this.tableData = []
                this.dataFormTwo.data[index].packing = value
                this.tempArr2[index] = value
              } else {
                this.$message({
                  type: 'info',
                  message: '已取消'
                });
                // this.dataFormTwo.data[index].totalNum = Number(this.oldsData[index].totalNum)
                this.dataFormTwo.data[index].packing = this.tempArr2[index]
              }
            }
            callback()
          } else {
            callback()
          }
        }
      };
    },

    // 有装箱信息后，子表切换标准箱和零头箱
    async beforeSubmitStand(data, paramsObj) {
      let flag = true
      if (this.dataForm.packingType === 'single' && this.tableData.length) {
        if (paramsObj.standardBoxName) {
          flag = await this.$confirm('已有装箱信息，修改标准箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.tableData = []
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      if (this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
        if (paramsObj.standardBoxName) {
          flag = await this.$confirm('已有装箱信息，修改标准箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.mixedTableData = []
            this.mixAllArr = []
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      return flag
    },
    async beforeSubmitStand2(data, paramsObj) {
      let flag = true
      if (this.dataForm.packingType === 'single' && this.tableData.length) {
        if (paramsObj.oddBoxName) {
          flag = await this.$confirm('已有装箱信息，修改零头箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.tableData = []
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      if (this.dataForm.packingType === 'mixed' && this.mixedTableData.length) {
        if (paramsObj.oddBoxName) {
          flag = await this.$confirm('已有装箱信息，修改零头箱将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.mixedTableData = []
            this.mixAllArr = []
            return true
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            return false
          })
        }
      }
      return flag
    },
    // 有装箱信息后 切换装箱类型
    showTipBox(type, oldType) {
      if (type === 'single') {
        if (this.mixedTableData.length) {
          this.showType = true
          this.$confirm('已有装箱信息，更换装箱类型，将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            // this.dataFormTwo.data = []
            this.mixedTableData = []
            this.mixAllArr = []
            this.dataForm.packingType = type
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            this.dataForm.oddBoxName = ''
            this.dataForm.oddBox = ''
            this.dataForm.standardBox = ''
            this.dataForm.standardBoxName = ''
            this.showType = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            this.showType = false
            this.dataForm.packingType = oldType
          })
        } else {
          this.dataForm.oddBoxName = ''
          this.dataForm.oddBox = ''
          this.dataForm.standardBox = ''
          this.dataForm.standardBoxName = ''
          // this.dataFormTwo.data = this.oldDataTwo
        }
      }
      if (type === 'mixed') {
        if (this.tableData.length) {
          this.showType = true
          this.$confirm('已有装箱信息，更换装箱类型，将清空装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            // this.dataFormTwo.data = []
            this.tableData = []
            this.dataForm.packingType = type
            if (type === 'mixed' && this.dataForm.packingSource === 'produce_process') {
              this.workListRequestObj.cooperativePartnerId = ''
            }
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
            this.showType = false
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            this.showType = false
            this.dataForm.packingType = oldType
          })
        } else {
          if (type === 'mixed' && this.dataFormTwo.data.length) {
            this.dataFormTwo.data.forEach(item => {
              item.disabled = false
              item.packingQuantity = 0
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
              item.oddBox = ''
              item.oddBoxName = ''
              item.standardBox = ''
              item.standardBoxName = ''
              if (item.defaultFlag) {
                item.packing = ''
              }
            })
          } else {
            this.dataForm.oddBoxName = ''
            this.dataForm.oddBox = ''
            this.dataForm.standardBox = ''
            this.dataForm.standardBoxName = ''
            // this.dataFormTwo.data = this.oldDataTwo
          }
        }
      }

    },
    // 有装箱信息后 切换产品类型
    showTipProductType(val) {
      if (val) {
        if (this.dataFormTwo.data.length) {
          this.showType = true
          this.$confirm('已有产品信息，更换产品类型，将清空产品信息和装箱信息，您是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.dataFormTwo.data = []
            this.mixedTableData = []
            this.mixAllArr = []
            this.tableData = []
            this.dataForm.packingSource = val
            this.showType = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            this.showType = false
            this.dataForm.packingSource = this.oldPackingSource
          })
        }
      }
      if (!val) {
        this.dataFormTwo.data = []
      }

    },

    ProductlistDataFormatting(res) {
      let treeData = res.data.records.map(item => {
        return {
          ...item,
          waitingPackingQuantity: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity])
        }
      })
      return treeData
    },
    worklistDataFormatting(res) {
      let treeData = res.data.records.map(item => {
        return {
          ...item,
          waitingPackingQuantity: this.jnpf.math('subtract', [item.completedQuantity, item.packingQuantity])
        }
      })
      return treeData
    },
    saleDataFormatting(res) {
      let treeData = res.data.records.map(item => {
        return {
          ...item,
          orderType: item.orderType === 'normal' ? '正常订单' : item.orderType === 'prediction' ? '预测订单' : item.orderType === 'sample' ? '样品订单' : item.orderType === 'stock_up' ? '备货订单' : '急件订单'
        }
      })
      return treeData
    },
    planDataFormatting(res) {
      let treeData = res.data.records.map(item => {
        return {
          ...item,
          planType: item.planType === 'order_plan' ? '订单计划' : '新建计划'
        }
      })
      return treeData
    },
    // 选择产品弹窗
    openProduct() {
      if (this.dataForm.packingSource === '') {
        this.$message.error('请先选择生产装箱来源！')
      } else {
        if (this.dataForm.packingSource === 'produce_order') {
          this.$refs['ComSelect-Product'].openDialog()
        }
        if (this.dataForm.packingSource === 'produce_process') {
          this.$refs['ComSelect-work'].openDialog()
        }
        if (this.dataForm.packingSource === 'sale_order') {
          if (this.dataForm.cooperativePartnerId) {
            this.$refs['ComSelect-sale'].openDialog()
          } else {
            this.$message.error('请先选择客户！')
          }
        }
        if (this.dataForm.packingSource === 'plan') {
          this.$refs['ComSelect-plan'].openDialog()
        }
      }
    },

    //  生产订单回调
    selectProduct(id, data) {
      if (data.length) {
        let list = data.map(item => item.all)
        // this.dataForm.sourceOrderNo = data[0].all.orderNo
        let _data = []
        list.forEach(item => {
          if (this.dataForm.packingType === 'mixed') {
            _data.push({
              cooperativePartnerId: item.cooperativePartnerId,
              calculationDirection: item.calculationDirection,
              deputyUnit: item.deputyUnit,
              mainUnit: item.mainUnit,
              packing: Number(item.productPacking) ? Number(item.productPacking) : '',
              productsId: item.productsId,
              ratio: item.ratio,
              remark: item.remark,
              returnDeliveryNoticeLineId: item.id,
              // item.packagingMaterialsName
              // item.packagingMaterials
              standardBoxName: item.packagingMaterialsName,
              standardBox: item.packagingMaterials,
              oddBoxName: item.packagingMaterialsName,
              oddBox: item.packagingMaterials,
              // num: '',
              num: Number(item.productPacking) ? Math.ceil(Number(item.lwoDispatchedQuantity - item.lwoCompletedQuantity) / Number(item.productPacking)) : 0,
              packingQuantity: 0,         // 已装箱
              packedQuantity: '',         // 待装箱
              totalNum: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity]),
              productsCode: item.productCode,
              productsName: item.productName,
              orderNo: item.orderNo,
              drawingNo: item.productDrawingNo,
              lwoId: item.lwoId,
              packingPersonBy: this.userInfo.userId,
              personList: [{value:this.userInfo.userId,label:this.userInfo.userName}],
            })
          } else {
            _data.push({
              waitPackingQuantity: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity]),
              totalNum: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity]),
              cooperativePartnerId: item.cooperativePartnerId,
              calculationDirection: item.calculationDirection,
              deputyUnit: item.deputyUnit,
              mainUnit: item.mainUnit,
              packing: Number(item.productPacking) ? Number(item.productPacking) : '',
              productsId: item.productsId,
              ratio: item.ratio,
              remark: item.remark,
              returnDeliveryNoticeLineId: item.id,
              // item.packagingMaterialsName
              // item.packagingMaterials
              standardBoxName: item.packagingMaterialsName,
              standardBox: item.packagingMaterials,
              oddBoxName: item.packagingMaterialsName,
              oddBox: item.packagingMaterials,
              num: Number(item.productPacking) ? Math.ceil(Number(item.lwoDispatchedQuantity -
                item.lwoCompletedQuantity) / Number(item.productPacking)) : 0,
              packingQuantity: 0,         // 已装箱
              packedQuantity: '',         // 待装箱
              // totalNum: item.completedQuantity - item.packingQuantity,
              productsCode: item.productCode,
              productsName: item.productName,
              orderNo: item.orderNo,
              drawingNo: item.productDrawingNo,
              lwoId: item.lwoId,
              packingPersonBy: this.userInfo.userId,
              personList: [{value:this.userInfo.userId,label:this.userInfo.userName}],
            })
          }

        })
        _data.forEach(item => {
          item.defaultFlag = false
          item.standardBoxFlag = false
          item.oddBoxFlag = false
          if (!item.packing) {
            item.defaultFlag = true
          }
          if (!item.standardBox) {
            item.standardBoxFlag = true
          }
          if (!item.oddBox) {
            item.oddBoxFlag = true
          }
          if (!item.packingQuantity && this.dataForm.packingType === 'mixed') {
            item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
          }
        })
        if (this.dataFormTwo.data.length) {

          const deletedArray = [];
          _data = _data.filter(item1 => {
            const index = this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId && item2.returnDeliveryNoticeLineId === item1.returnDeliveryNoticeLineId);
            if (index !== -1) {
              deletedArray.push(item1.orderNo);
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false;
            }
            return true;
          });
        }
        this.dataFormTwo.data = [...this.dataFormTwo.data, ..._data]
        this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
      }
    },
    // 工单回调
    selectWork(id, data) {
      if (data.length) {
        let list = data.map(item => item.all)
        // this.dataForm.sourceOrderNo = data[0].all.orderNo
        let _data = []
        list.forEach(item => {
          _data.push({
            calculationDirection: item.calculationDirection,
            deputyUnit: item.deputyUnit,
            mainUnit: item.mainUnit,
            packing: Number(item.productPacking) ? Number(item.productPacking) : '',
            productsId: item.productId,
            ratio: item.ratio,
            remark: item.remark,
            returnDeliveryNoticeLineId: item.id,
            // item.packagingMaterialsName
            // item.packagingMaterials
            routingName: item.routingName,
            routingId: item.routingId,
            processName: item.processName,
            processId: item.processId,
            standardBoxName: item.packagingMaterialsName,
            standardBox: item.packagingMaterials,
            oddBoxName: item.packagingMaterialsName,
            oddBox: item.packagingMaterials,
            num: Number(item.productPacking) ? Math.ceil(Number(item.completedQuantity - item.packingQuantity) / Number(item.productPacking)) : 0,
            packingQuantity: 0,         // 已装箱
            packedQuantity: '',         // 待装箱
            totalNum: this.jnpf.math('subtract', [item.completedQuantity, item.packingQuantity]),
            productsCode: item.productCode,
            orderNo: item.orderNo,
            productsName: item.productName,
            drawingNo: item.productDrawingNo,
          })
        })
        _data.forEach(item => {
          item.defaultFlag = false
          item.standardBoxFlag = false
          item.oddBoxFlag = false
          if (!item.packing) {
            item.defaultFlag = true
          }
          if (!item.standardBox) {
            item.standardBoxFlag = true
          }
          if (!item.oddBox) {
            item.oddBoxFlag = true
          }
          if (!item.packingQuantity && this.dataForm.packingType === 'mixed') {
            item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
          }
        })
        if (this.dataFormTwo.data.length) {

          const deletedArray = [];
          _data = _data.filter(item1 => {
            const index = this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId && item2.returnDeliveryNoticeLineId === item1.returnDeliveryNoticeLineId);
            if (index !== -1) {
              deletedArray.push(item1.orderNo);
              if (deletedArray.length) {
                this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
              }
              return false;
            }
            return true;
          });
        }
        this.dataFormTwo.data = [...this.dataFormTwo.data, ..._data]
        this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
      }
    },
    // 销售订单回调
    async selectSale(id, data) {
      if (data.length) {
        let ordersList = data.map(item => item.all)
        let query = {
          ordersIdList: ordersList.map(item => item.id),
          packingFlag: 1,
          businessCode: 'complete'
        }
        const res = await prodOrderPackingList(query)
        if (res.data.records) {
          let _data = []
          res.data.records.forEach(item => {
            if (this.dataForm.packingType === 'mixed') {
              _data.push({
                cooperativePartnerId: item.cooperativePartnerId,
                calculationDirection: item.calculationDirection,
                deputyUnit: item.deputyUnit,
                mainUnit: item.mainUnit,
                packing: Number(item.productPacking) ? Number(item.productPacking) : '',
                productsId: item.productsId,
                ratio: item.ratio,
                remark: item.remark,
                returnDeliveryNoticeLineId: item.id,
                standardBoxName: item.packagingMaterialsName,
                standardBox: item.packagingMaterials,
                oddBoxName: item.packagingMaterialsName,
                oddBox: item.packagingMaterials,
                num: '',
                packingQuantity: 0,         // 已装箱
                packedQuantity: '',         // 待装箱
                totalNum: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity]),
                productsCode: item.productCode,
                productsName: item.productName,
                orderNo: item.orderNo,
                drawingNo: item.productDrawingNo,
                lwoId: item.lwoId,
                packingPersonBy: this.userInfo.userId,
                personList: [{value:this.userInfo.userId,label:this.userInfo.userName}],
              })
            } else {
              _data.push({
                waitPackingQuantity: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity]),
                totalNum: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity]),
                cooperativePartnerId: item.cooperativePartnerId,
                calculationDirection: item.calculationDirection,
                deputyUnit: item.deputyUnit,
                mainUnit: item.mainUnit,
                packing: Number(item.productPacking) ? Number(item.productPacking) : '',
                productsId: item.productsId,
                ratio: item.ratio,
                remark: item.remark,
                returnDeliveryNoticeLineId: item.id,
                standardBoxName: item.packagingMaterialsName,
                standardBox: item.packagingMaterials,
                oddBoxName: item.packagingMaterialsName,
                oddBox: item.packagingMaterials,
                num: '',
                packingQuantity: 0,         // 已装箱
                packedQuantity: '',         // 待装箱
                productsCode: item.productCode,
                productsName: item.productName,
                orderNo: item.orderNo,
                drawingNo: item.productDrawingNo,
                lwoId: item.lwoId,
                packingPersonBy: this.userInfo.userId,
                personList: [{value:this.userInfo.userId,label:this.userInfo.userName}],
              })
            }
          })
          _data.forEach(item => {
            item.defaultFlag = false
            item.standardBoxFlag = false
            item.oddBoxFlag = false
            if (!item.packing) {
              item.defaultFlag = true
            }
            if (!item.standardBox) {
              item.standardBoxFlag = true
            }
            if (!item.oddBox) {
              item.oddBoxFlag = true
            }
            if (!item.packingQuantity && this.dataForm.packingType === 'mixed') {
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
            }
          })
          if (this.dataFormTwo.data.length) {

            const deletedArray = [];
            _data = _data.filter(item1 => {
              const index = this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId && item2.returnDeliveryNoticeLineId === item1.returnDeliveryNoticeLineId);
              if (index !== -1) {
                deletedArray.push(item1.orderNo);
                if (deletedArray.length) {
                  this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
                }
                return false;
              }
              return true;
            });
          }
          this.dataFormTwo.data = [...this.dataFormTwo.data, ..._data]
          this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
        }
      }
    },
    // 计划回调
    async selectPlan(id, data) {
      if (data.length) {
        let planIdList = data.map(item => item.all)
        let query = {
          planIdList: planIdList.map(item => item.id),
          packingFlag: 1,
          businessCode: 'complete'
        }
        const res = await prodOrderPackingList(query)
        if (res.data.records) {
          let _data = []
          res.data.records.forEach(item => {
            if (this.dataForm.packingType === 'mixed') {
              _data.push({
                cooperativePartnerId: item.cooperativePartnerId,
                calculationDirection: item.calculationDirection,
                deputyUnit: item.deputyUnit,
                mainUnit: item.mainUnit,
                packing: Number(item.productPacking) ? Number(item.productPacking) : '',
                productsId: item.productsId,
                ratio: item.ratio,
                remark: item.remark,
                returnDeliveryNoticeLineId: item.id,
                standardBoxName: item.packagingMaterialsName,
                standardBox: item.packagingMaterials,
                oddBoxName: item.packagingMaterialsName,
                oddBox: item.packagingMaterials,
                num: '',
                packingQuantity: 0,         // 已装箱
                packedQuantity: '',         // 待装箱
                totalNum: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity]),
                productsCode: item.productCode,
                productsName: item.productName,
                orderNo: item.orderNo,
                drawingNo: item.productDrawingNo,
                lwoId: item.lwoId,
                packingPersonBy: this.userInfo.userId,
                personList: [{value:this.userInfo.userId,label:this.userInfo.userName}],
              })
            } else {
              _data.push({
                waitPackingQuantity: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity]),
                totalNum: this.jnpf.math('subtract', [item.lwoDispatchedQuantity, item.lwoCompletedQuantity]),
                cooperativePartnerId: item.cooperativePartnerId,
                calculationDirection: item.calculationDirection,
                deputyUnit: item.deputyUnit,
                mainUnit: item.mainUnit,
                packing: Number(item.productPacking) ? Number(item.productPacking) : '',
                productsId: item.productsId,
                ratio: item.ratio,
                remark: item.remark,
                returnDeliveryNoticeLineId: item.id,
                standardBoxName: item.packagingMaterialsName,
                standardBox: item.packagingMaterials,
                oddBoxName: item.packagingMaterialsName,
                oddBox: item.packagingMaterials,
                num: '',
                packingQuantity: 0,         // 已装箱
                packedQuantity: '',         // 待装箱
                productsCode: item.productCode,
                productsName: item.productName,
                orderNo: item.orderNo,
                drawingNo: item.productDrawingNo,
                lwoId: item.lwoId,
                packingPersonBy: this.userInfo.userId,
                personList: [{value:this.userInfo.userId,label:this.userInfo.userName}],
              })
            }
          })
          _data.forEach(item => {
            item.defaultFlag = false
            item.standardBoxFlag = false
            item.oddBoxFlag = false
            if (!item.packing) {
              item.defaultFlag = true
            }
            if (!item.standardBox) {
              item.standardBoxFlag = true
            }
            if (!item.oddBox) {
              item.oddBoxFlag = true
            }
            if (!item.packingQuantity && this.dataForm.packingType === 'mixed') {
              item.packedQuantity = this.jnpf.math('subtract', [item.totalNum, item.packingQuantity])
            }
          })
          if (this.dataFormTwo.data.length) {

            const deletedArray = [];
            _data = _data.filter(item1 => {
              const index = this.dataFormTwo.data.findIndex(item2 => item2.productsId === item1.productsId && item2.returnDeliveryNoticeLineId === item1.returnDeliveryNoticeLineId);
              if (index !== -1) {
                deletedArray.push(item1.orderNo);
                if (deletedArray.length) {
                  this.$message.error(`已经添加过的产品：${deletedArray.join('、')}`)
                }
                return false;
              }
              return true;
            });
          }
          this.dataFormTwo.data = [...this.dataFormTwo.data, ..._data]
          this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
        }
      }
    },
    // 有产品信息 切换客户  销售 必须选客户  其他几个如果选了客户 就要关联客户
    async beforeSubmitPartner(data, paramsObj) {
      let flag = true
      let msg = null
      if (typeof data == 'object') { msg = "切换客户后，将清空产品信息和装箱条码，您是否继续？" }
      if (typeof data == 'undefined') { msg = "删除客户后，将清空产品信息和装箱条码，您是否继续？" }
      if (!this.dataForm.cooperativePartnerId && this.dataFormTwo.data.length > 0) {

        flag = await this.$confirm(`${msg}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '清空成功!'
          });
          this.dataFormTwo.data = []
          this.tempArr2 = []
          this.tableData = []
          this.mixedTableData = []
          this.mixAllArr = []
          return true
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          return false
        })

      }
      return flag
    },
    // 选择客户弹窗
    supplierdata(id, data) {
      if (data.length === 0) {
        this.dataForm.partnerName = ''
        this.dataForm.cooperativePartnerId = ''
        this.workListRequestObj.cooperativePartnerId = ''
        this.productionListRequestObj.cooperativePartnerId = ''
        this.saleListRequestObj.cooperativePartnerId = ''
        this.planListRequestObj.cooperativePartnerId = ''
      } else {
        this.dataForm.partnerName = data[0].all.name
        this.dataForm.cooperativePartnerId = data[0].all.id
        this.productionListRequestObj.cooperativePartnerId = this.dataForm.cooperativePartnerId
        this.saleListRequestObj.cooperativePartnerId = this.dataForm.cooperativePartnerId
        this.planListRequestObj.cooperativePartnerId = this.dataForm.cooperativePartnerId
        // if (this.dataFormTwo.data.length) {
        //   this.dataFormTwo.data.forEach(item => {
        //     if (item.cooperativePartnerId !== this.dataForm.cooperativePartnerId) {
        //       this.$confirm('切换客户后，将清空产品信息和装箱条码，是否继续！', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         type: 'warning'
        //       }).then(() => {
        //         this.$message({
        //           type: 'success',
        //           message: '清空成功!'
        //         });
        //         this.dataFormTwo.data = []
        //         this.tableData = []
        //         this.mixedTableData = []
        //       }).catch(() => {
        //         this.$message({
        //           type: 'info',
        //           message: '已取消'
        //         });
        //         this.dataForm.partnerName = ''
        //         this.dataForm.cooperativePartnerId = ''
        //         this.workListRequestObj.cooperativePartnerId = ''
        //         this.productionListRequestObj.cooperativePartnerId = ''
        //       });
        //     }
        //   })
        // }
      }
    },

    checkSelectable(row) {
      return !row.disabled
    },
    // 主表标准箱和零头箱
    changeStandard(id, data, paramsObj) {
      if (paramsObj.types === 'standardBox') {
        this.$nextTick(() => {
          this.$refs['elForm'].validateField("standardBoxName")
          this.$refs['elForm'].validateField("oddBoxName")
        })
        if (data.length === 0) {
          this.dataForm.standardBox = ''
          this.dataForm.standardBoxName = ''
        } else {
          this.dataForm.standardBox = data[0].id
          this.dataForm.standardBoxName = data[0].all.drawingNo
          // 选择标准箱时如果没有零头箱，默认取标准箱作为零头箱
          if (!this.dataForm.oddBox) {
            this.dataForm.oddBox = data[0].id
            this.dataForm.oddBoxName = data[0].all.drawingNo
          }
        }
      } else {
        this.$nextTick(() => {
          this.$refs['elForm'].validateField("oddBoxName")
        })
        if (data.length === 0) {
          this.dataForm.oddBox = ''
          this.dataForm.oddBoxName = ''
        } else {
          this.dataForm.oddBox = data[0].id
          this.dataForm.oddBoxName = data[0].all.drawingNo
        }
      }
    },
    // 箱数 数量除以装箱数量 得出除数和余数 进行是否零头箱判断
    divide(dividend, divisor) {
      let quotient = 0
      let remainder = 0
      if (Number(dividend) >= Number(divisor)) {
        quotient = Math.floor(dividend / divisor)
        remainder = dividend % divisor;
      } else {
        quotient = Math.floor(divisor / dividend)
        remainder = divisor % dividend;
      }
      return { quotient, remainder };
    },
    // 标准箱弹窗
    addth(id, data, paramsObj) {
      if (paramsObj.types === 'standardBox') {
        this.$nextTick(() => {
          let prop = 'data.' + paramsObj.index + '.' + 'standardBoxName'
          this.$refs['productForm'].validateField(prop)
          prop = 'data.' + paramsObj.index + '.' + 'oddBoxName'
          this.$refs['productForm'].validateField(prop)
        })
        if (data.length === 0) {

          this.dataFormTwo.data[paramsObj.index].standardBox = ''
          this.dataFormTwo.data[paramsObj.index].standardBoxName = ''
        } else {
          this.dataFormTwo.data[paramsObj.index].standardBox = data[0].id
          this.dataFormTwo.data[paramsObj.index].standardBoxName = data[0].all.drawingNo
          // 选择标准箱时如果没有零头箱，默认取标准箱作为零头箱
          if (!this.dataFormTwo.data[paramsObj.index].oddBox) {
            this.dataFormTwo.data[paramsObj.index].oddBox = data[0].id
            this.dataFormTwo.data[paramsObj.index].oddBoxName = data[0].all.drawingNo
          }
        }
      } else {
        this.$nextTick(() => {
          let prop = 'data.' + paramsObj.index + '.' + 'oddBoxName'
          this.$refs['productForm'].validateField(prop)
        })
        if (data.length === 0) {
          this.dataFormTwo.data[paramsObj.index].oddBox = ''
          this.dataFormTwo.data[paramsObj.index].oddBoxName = ''
        } else {
          this.dataFormTwo.data[paramsObj.index].oddBox = data[0].id
          this.dataFormTwo.data[paramsObj.index].oddBoxName = data[0].all.drawingNo
        }
      }
    },

    // 点击装箱条码
    async handleClick(e) {
      if (e.name === 'jcInfo') this.$nextTick(() => { this.switchStyleheight() })
      if (e.name === 'boxCode' && this.type === 'add') {
        if (this.dataForm.packingType === 'single') {
        } else {
          this.tableData = []
          // 混装 生成条码数据
          if (this.mixedTableData.length) {

          }
        }
      } if (e.name === 'boxCode' && this.type !== 'add') {
        if (this.mixedTableData.length) {
          this.mixedTableData.forEach(item => {
            if (!item.oddFlag) {
              item.standardBox = this.dataForm.standardBox
              item.standardBoxName = this.dataForm.standardBoxName
            } else {
              item.standardBox = this.dataForm.oddBox
              item.standardBoxName = this.dataForm.oddBoxName
            }
          })
        }
        if (this.tableData.length) {
          this.dataFormTwo.data.forEach(item => {
            this.tableData.forEach(item2 => {
              if (item.productsCode === item2.productsCode) {
                if (!item2.oddFlag) {
                  item2.standardBox = item.standardBox
                  item2.standardBoxName = item.standardBoxName
                } else {
                  item2.standardBox = item.oddBox
                  item2.standardBoxName = item.oddBoxName
                }
              }
            })
          })
        }
      }
    },


    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
    // 生成条码
    async openBarcode() {
      let focusFlag = true // 自动聚焦是否可用
      let form_1 = this.$refs['elForm']
      let valid_1 = await form_1.validate().catch(err => false)

      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && focusFlag) {
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            focusFlag = false
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }
      if (focusFlag && valid_1) {
        if (this.dataFormTwo.data.length) {
          this.timeCode = this.timeCode ? this.timeCode : new Date().getTime()
          if (this.dataForm.packingType === 'single') {
            this.tableData = []
            this.dataFormTwo.data.forEach((item, index) => {
              if (Number(item.totalNum) >= Number(item.packing)) {

                let total = 0
                for (let i = 0; i < item.num; i++) {
                  this.tableData.push({
                    barCode: this.timeCode + '000',
                    productsCode: item.productsCode,
                    productsName: item.productsName,
                    productsId: item.productsId,
                    drawingNo: item.drawingNo,
                    totalNum: item.packing,
                    standardBox: item.standardBox,
                    standardBoxName: item.standardBoxName,
                    routingName: item.routingName,
                    routingId: item.routingId,
                    processName: item.processName,
                    processId: item.processId,
                    // 零头箱
                    oddFlag: 0,
                    returnDeliveryNoticeLineId: item.returnDeliveryNoticeLineId,
                  })
                  total++
                }
                if (item.packing * total !== Number(this.dataFormTwo.data[index].totalNum)) {
                  this.tableData[this.tableData.length - 1].oddFlag = 1
                  this.tableData[this.tableData.length - 1].standardBoxName = this.dataFormTwo.data[this.dataFormTwo.data.length - 1].oddBoxName
                  this.tableData[this.tableData.length - 1].standardBox = this.dataFormTwo.data[this.dataFormTwo.data.length - 1].oddBox
                  this.tableData[this.tableData.length - 1].totalNum = Number(this.dataFormTwo.data[index].totalNum) - item.packing * (total - 1)
                }
              } else {
                this.tableData.push({
                  barCode: this.timeCode + '000',
                  productsCode: item.productsCode,
                  productsName: item.productsName,
                  productsId: item.productsId,
                  drawingNo: item.drawingNo,
                  totalNum: Number(item.totalNum),
                  standardBox: item.oddBox,
                  standardBoxName: item.oddBoxName,
                  routingName: item.routingName,
                  routingId: item.routingId,
                  processName: item.processName,
                  processId: item.processId,
                  // 零头箱
                  oddFlag: 1,
                  returnDeliveryNoticeLineId: item.returnDeliveryNoticeLineId,
                })
              }
            })
            for (let j = 0; j < this.dataForm.num; j++) {
              this.tableData[j].barCode = this.tableData[j].barCode * 1 + j + 1
            }
            this.$message.success('生成条码成功')
          } else {
            if (this.productArr.length) {
              let barCode = ''
              if (this.mixedTableData.length) {

                barCode = this.mixedTableData[this.mixedTableData.length - 1].barCode ? this.mixedTableData[this.mixedTableData.length - 1].barCode : ''
              }
              this.codeCount++
              this.codeFormVisible = true
              this.$nextTick(() => {
                this.$refs.codeForm.init(this.timeCode, this.codeCount, this.productArr, this.dataFormTwo.data, barCode)
              })
            } else {
              this.$message.error('请先选择要生成条码的数据！')
            }



          }
        } else {
          this.$message.error('请先选择产品！')
        }
      }
    },
    // 混装生成条码后传递的数据
    mixCodeData(data, dataFormTwo) {
      this.mixAllArr = [...this.mixAllArr, ...data]
      this.dataFormTwo.data = dataFormTwo
      this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
      this.mixedTableData = this.mixAllArr
      this.$message.success('生成条码成功')
    },
    // 混装 装箱条码 查看事件
    // 通过 数据中的条码 找到对应的数据
    lookCode(data) {
      this.sourceFormVisible = true
      this.$nextTick(() => {
        this.$refs.sourceForm.init(data.barcodeLines)
      })
    },
    // 删除事件
    delequipment_process_relList(data, index, dataFormTwo) {
      dataFormTwo = this.dataFormTwo
      // this.mixedTableData

      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: "删除成功",
          duration: 1500,
        })
        dataFormTwo.forEach((item, index) => {
          data.barcodeLines.forEach(item2 => {
            if (item.processId === item2.processId) {
              dataFormTwo[index].packingQuantity = this.jnpf.math('subtract', [dataFormTwo[index].packingQuantity, item2.totalNum])
              dataFormTwo[index].packedQuantity = this.jnpf.math('add', [item.packedQuantity, item2.totalNum])
            }
          })
        })
        this.tempArr2 = dataFormTwo.map(item => item.packing)

        this.mixedTableData.splice(index, 1)
      }).catch(() => { })
    },
    // 混装选择产品事件 选中的产品信息
    handeleProductInfoData(val) {
      this.productArr = val
    },

    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
      this.tempArr2 = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.type = type
      this.switchStyleheight()
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          detailSalePackingList(this.dataForm.id).then(res => {
            this.dataForm.sourceOrderNo = res.data.sourceOrderNo
            this.dataForm.documentId = res.data.documentId
            this.dataForm.documentType = res.data.documentType
            this.dataForm.packingSource = res.data.packingSource
            this.dataForm.remark = res.data.remark
            this.dataForm.packingType = res.data.packingType
            this.dataForm.partnerName = res.data.cooperativePartnerName
            this.dataForm.cooperativePartnerId = res.data.cooperativePartnerId
            this.dataForm.cooperativePartnerCode = res.data.cooperativePartnerCode
            this.dataForm.submitDate = res.data.submitDate
            this.dataForm.num = res.data.num
            this.dataForm.orderNo = res.data.orderNo
            this.dataForm.standardBox = res.data.standardBox
            this.dataForm.standardBoxName = res.data.standardBoxName
            this.dataForm.oddBoxName = res.data.oddBoxName
            this.dataForm.oddBox = res.data.oddBox
            // 明细列表
            this.dataFormTwo.data = res.data.packingListLines
            this.dataFormTwo.data.forEach((item, index) => {
              item.personList = []
              item.defaultFlag = true
              item.standardBoxFlag = true
              item.oddBoxFlag = true
              item.personList.push({label:item.packingPersonByName,value:item.packingPersonBy})
              if (item.totalNum && item.packingQuantity) {
                this.$set(this.dataFormTwo.data[index], 'packedQuantity', this.jnpf.math('subtract', [item.totalNum, item.packingQuantity]))
              }
            })
            // 装箱单条码信息
            if (this.dataForm.packingType === 'single') {
              this.tableData = res.data.barcodes
              this.oldData.push(res.data.barcodes)
            }
            if (this.dataForm.packingType === 'mixed') {
              this.mixAllArr = res.data.barcodes
              this.mixedTableData = this.mixAllArr
            }
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
            this.oldsData = JSON.parse(JSON.stringify(this.dataFormTwo.data))
            this.$refs.table.doLayout()
          }).catch(() => { })
        }
      })
    },
    // 表单提交
    dataFormSubmit(type) {
      this.request(type)
    },

    async request(type) {
      let _data
      this.btnLoading = true
      let isOk = true
      let barcodeDTOS = []      //装箱单条码列表信息
      let barcodeLines = []
      this.dataForm.documentStatus = type
      let linesList = JSON.parse(JSON.stringify(this.dataFormTwo.data || []))


      let form_2 = this.$refs['productForm']
      let valid_2 = await form_2.validate().catch(err => false)

      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          if (this.dataFormTwo.data.length === 0) {
            this.btnLoading = false
            this.$message.error('请至少选择一项产品生成条码')
          } else {
            if (valid_2) {
              if (this.dataForm.packingType === 'single') {
                if (this.tableData.length === 0) {
                  this.$message.error('请先生成装箱条码！')
                  this.btnLoading = false
                  isOk = false
                } else {
                  this.tableData.forEach(item => {
                    barcodeLines.push({
                      totalNum: item.totalNum,
                      id: item.barcodeLines ? item.barcodeLines[0].id : '',
                      packingBarcodeId: item.barcodeLines ? item.barcodeLines[0].packingBarcodeId : '',
                      packingListId: item.barcodeLines ? item.barcodeLines[0].packingListId : '',
                      packingListLineId: item.barcodeLines ? item.barcodeLines[0].packingListLineId : '',
                      returnDeliveryNoticeLineId: item.barcodeLines ? item.barcodeLines[0].returnDeliveryNoticeLineId : item.returnDeliveryNoticeLineId,
                      returnDeliveryNoticeLineIdList: [item.barcodeLines ? item.barcodeLines[0].returnDeliveryNoticeLineId : item.returnDeliveryNoticeLineId],
                    })
                    barcodeDTOS.push({
                      barcode: {
                        barCode: item.barCode,
                        oddFlag: item.oddFlag,
                        standardBox: item.standardBox,
                        totalNum: item.totalNum,
                      },
                      barcodeLines
                    })
                    barcodeLines = []
                    isOk = true
                  })
                }
              } else {
                if (this.mixedTableData.length === 0) {
                  this.$message.error('请先生成装箱条码！')
                  this.btnLoading = false
                  isOk = false
                } else {
                  this.mixedTableData.forEach(item => {
                    item.barcodeLines.forEach(item2 => {
                      barcodeLines.push({
                        totalNum: item2.totalNum,
                        id: item2.id ? item2.id : '',
                        packingBarcodeId: item2.packingBarcodeId ? item2.packingBarcodeId : '',
                        packingListId: item2.packingListId ? item2.packingListId : '',
                        packingListLineId: item2.packingListLineId ? item2.packingListLineId : '',
                        returnDeliveryNoticeLineId: item2.returnDeliveryNoticeLineId,
                        returnDeliveryNoticeLineIdList: [item2.returnDeliveryNoticeLineId],
                        productsId: item2.productsId,
                        processId: item2.processId,
                        routingLineId: item2.routingLineId
                      })
                    })
                    barcodeDTOS.push({
                      barcode: {
                        barCode: item.barCode,
                        oddFlag: item.oddFlag,
                        standardBox: item.standardBox,
                        totalNum: item.totalNum,
                      },
                      barcodeLines
                    })
                    barcodeLines = []
                  })
                  // if (this.dataForm.documentStatus !== 'draft') { // 保存并提交时合并条码箱内的同产品
                  //   barcodeDTOS.forEach(box => {
                  //     box.barcodeLines = box.barcodeLines.reduce((result, obj) => {
                  //       let existingObj = result.find(product =>
                  //         product.productsId === obj.productsId &&
                  //         product.processId == obj.processId &&
                  //         product.routingLineId == obj.routingLineId
                  //       );
                  //       if (existingObj) {
                  //         existingObj.totalNum = this.jnpf.math('add', [existingObj.totalNum, obj.totalNum]);
                  //         existingObj.returnDeliveryNoticeLineIdList.push(obj.returnDeliveryNoticeLineId)
                  //         existingObj.returnDeliveryNoticeLineId = ''
                  //       } else {
                  //         result.push({
                  //           ...obj,
                  //           returnDeliveryNoticeLineId: ''
                  //         });
                  //       }
                  //       return result;
                  //     }, []);
                  //   })
                  //   linesList = linesList.map(line => {
                  //     return {
                  //       ...line,
                  //       returnDeliveryNoticeLineIdList: [line.returnDeliveryNoticeLineId]
                  //     }
                  //   })
                  // }
                }
              }
              _data = {
                barcodeDTOS,
                stockPackingList: this.dataForm,
                stockPackingListLines: linesList,
              }
              if (isOk) {
                this.btnLoading = true
                if (this.type === 'add') {
                  addSalePackingList(_data).then(res => {
                    if (res.msg === 'Success') res.msg = this.dataForm.documentStatus === 'draft' ? '保存成功' : '提交成功'
                    this.$message({
                      message: res.msg,
                      type: 'success',
                      duration: 1000,
                      onClose: () => {

                        this.btnLoading = false
                        this.$emit('close', true)
                      }
                    })

                  }).catch(() => {
                    this.btnLoading = false
                  })
                } else {
                  updateSalePackingList(_data).then((res) => {
                    if (res.msg === 'Success') res.msg = this.dataForm.documentStatus === 'draft' ? '保存成功' : '提交成功'
                    this.$message({
                      message: res.msg,
                      type: 'success',
                      duration: 1000,
                      onClose: () => {

                        this.btnLoading = false
                        this.$emit('close', true)

                      }
                    })
                  }).catch(() => {
                    this.btnLoading = false
                  })
                }

              }
            } else {
              this.btnLoading = false
              for (let i = 0; i < this.dataFormTwo.data.length; i++) {
                const item = this.dataFormTwo.data[i]
                if (!item.standardBoxName) {
                  this.$message({
                    type: 'error',
                    message: '请选择第' + (i + 1) + '行的标准箱',
                    duration: 1500,
                  })
                  break
                }
                if (!item.packing) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的装箱数量',
                    duration: 1500,
                  })
                  break
                }
                if (!item.oddBoxName) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的零头箱',
                    duration: 1500,
                  })
                  break
                }

              }
              return
            }
          }
        } else {
          this.btnLoading = false
        }

      })

    },
    // 删除项
    deleteLineList(index) {
      if (this.tableData.length || this.mixedTableData.length) {
        this.$confirm(`删除产品将清空条码信息`, this.$t('common.tipTitle'), {
          type: 'warning'
        }).then(() => {
          this.dataFormTwo.data.splice(index, 1)
          if (this.dataFormTwo.data.length) {
            this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
          } else {
            this.tempArr2 = []
          }
          this.tableData = []
          this.mixedTableData = []
          this.mixAllArr = []
        }).catch(() => { })
      } else {
        this.dataFormTwo.data.splice(index, 1)
        if (this.dataFormTwo.data.length) {
          this.tempArr2 = this.dataFormTwo.data.map(item => item.packing)
        } else {
          this.tempArr2 = []
        }
      }
    },
    // 清空产品
    batchDelete() {
      if (this.tableData.length || this.mixedTableData.length) {
        this.$confirm(`清空产品将清空条码信息`, this.$t('common.tipTitle'), {
          type: 'warning'
        }).then(() => {
          this.dataFormTwo.data = []
          this.tempArr2 = []
          this.tableData = []
          this.mixedTableData = []
          this.mixAllArr = []
        }).catch(() => { })
      } else {
        this.dataFormTwo.data = []
        this.tempArr2 = []
        this.tableData = []
        this.mixedTableData = []
        this.mixAllArr = []
      }
    },
    lookProductionSource(id) {
      let obj = {
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        productionOrderId: id,
        startTime: "",
        startUpdateTime: ""
      }
      getOrderSourceList(obj).then(res => {
        if (res.data.records.length) {
          this.sourceList = res.data.records
          this.sourceDialog = true
        } else {
          this.$message.error("暂无来源明细")
        }
      })
    },
    // 下拉框 获取装箱人信息
    async handleVisibleChange(id,index) {
      const res = await producePersonList(id)
      console.log(res);
      if (res.data){
        this.dataFormTwo.data[index].personList = []
        for (const key in res.data) {
          this.dataFormTwo.data[index].personList.push({
            value: key,
            label: res.data[key]
          })
        }
        this.dataFormTwo.data[index].personList.push({value:this.userInfo.userId,label:this.userInfo.userName})
        
      }
    },

  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 10px;
}

.main .boxCode-table {
  height: 100%;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .el-table--small .el-table__cell {
  padding: 10px 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />