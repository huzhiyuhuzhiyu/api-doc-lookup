<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建存货组装' : btnType == 'edit' ? '编辑存货组装' : '查看存货组装'" />
        <div class="options">
          <el-button v-if="btnType != 'look'" type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button v-if="btnType != 'look'" type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
          <el-button @click="goBack">{{ $t("common.cancelButton") }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName" v-if="!approvalFlag" @tab-click="handleClick" class=".el-table">
          <el-tab-pane label="订单信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="组装单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请输入组装单号" :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="品名规格" prop="drawingNo">
                        <ComSelect-page v-model="dataForm.drawingNo" @change="submitCustomerProduct1" :tableItems="ProductTableItems1" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList1" :isdisabled="btnType == 'look'" placeholder="请选择产品" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="组装人" prop="transferBy">
                        <user-select v-model="dataForm.transferBy" placeholder="请选择组装人" clearable style="width: 100%" :disabled="btnType == 'look'" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="组装日期" prop="transferDate">
                        <el-date-picker v-model="dataForm.transferDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择组装日期" :disabled="btnType == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="仓库" prop="warehouseId">
                        <ComSelect-list :requestObj="{ type: 'normal' }" dialogTitle="选择仓库" placeholder="请选择仓库" :value="dataForm.warehouseName" :isdisabled="btnType === 'look'" :method="getWarehouseList" @change="changeWarehouse" :beforeSubmit="beforeWarehoustChange"></ComSelect-list>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="库位" prop="shelfSpaceId">
                        <ComSelect-list :requestObj="kwstock" dialogTitle="请选择库位" placeholder="请选择库位" :value="dataForm.shelfSpaceName" :isdisabled="btnType === 'look' || !dataForm.warehouseName" :method="stockDisassemblykw" @change="changeWarehousekw"></ComSelect-list>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :sm="8" :xs="24">
                      <el-form-item label="目标箱条码" prop="boxBarcode">
                        <ComSelect-page :placeholder="'请选择目标箱条码'" :isdisabled="btnType === 'look' || !dataForm.shelfSpaceName
                      " :value="dataForm.boxBarcode" :dialogTitle="'选择条码'" @change="targetBox" :tableItems="targetTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="targetRequestObj" :paramsObj="{}" :searchList="targetTableSearchList" :elementShow="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="btnType !== 'look'">
                      <el-form-item label="目标箱数量" prop="realityTotalNum">
                        <el-input v-model="dataForm.realityTotalNum" placeholder="" disabled />
                      </el-form-item>
                    </el-col> -->

                    <el-col :sm="8" :xs="24">
                      <el-form-item label="数量" prop="num">
                        <el-input v-model="dataForm.num" placeholder="请输入数量" :disabled="btnType == 'look' ? true : false" maxlength="11" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="批次号" prop="batchNumber">
                        <el-select v-model.trim="dataForm.batchNumber" filterable remote reserve-keyword placeholder="请输入批次号" style="width: 100%" clearable :disabled="btnType == 'look'" :remote-method="remoteMethod" :loading="loading" @focus="action">
                          <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="单位(主)" prop="mainUnit">
                        <el-input v-model="dataForm.mainUnit" placeholder="请输入单位" disabled maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" type="textarea" maxlength="200" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="cpInfo">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialogtes()">选择产品</el-button>|
                  <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" ref="productForm" class="data-form">
                  <el-table class="TableForm table" ref="product" :data="dataFormTwo.data" @selection-change="handeleProductInfoData" style="border: 1px solid #e3e7ee">
                    <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType != 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="2" />
                    <el-table-column prop="productDrawingNo" label="品名规格" width="300" show-overflow-tooltip />
                    <!-- <el-table-column prop="productSpec" label="规格型号" width="200" show-overflow-tooltip /> -->
                    <el-table-column prop="warehouseName" label="仓库" width="200" show-overflow-tooltip />
                    <el-table-column prop="shelfSpaceName" label="库位" width="200" show-overflow-tooltip />
                    <el-table-column prop="batchNumber" label="批次号" width="200" show-overflow-tooltip />
                    <el-table-column prop="availableQuantity" label="原批次数量" width="120" show-overflow-tooltip v-if="btnType !== 'look'" />
                    <!-- <el-table-column prop="boxBarcode" label="原箱条码" width="220">
                      <template slot="header">
                        <span class="required">*</span>原箱条码
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'boxBarcode'" :rules="productRules.boxBarcode">
                          <ComSelect-page :placeholder="'请选择原箱条码'" :value="scope.row.boxBarcode" :dialogTitle="'选择条码'" @change="addth" :tableItems="targetTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="barCodeRequestObj(scope.$index)" :paramsObj="{ scope }" :searchList="targetTableSearchList" :isdisabled="btnType === 'look'" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="realityTotalNum" label="原箱数量" width="120" v-if="btnType !== 'look'" /> -->

                    <el-table-column prop="num" label="数量" width="160">
                      <template slot="header">
                        <span class="required">*</span>数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'num'" :rules="productRules.num">
                          <el-input v-model="scope.row.num" :disabled="btnType === 'look'" maxlength="11" placeholder="请输入数量" @input="watchnums(scope.row, scope.$index)" style="width: 100%">{{ scope.row.num }}
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="mainUnit" label="单位(主)" width="110" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="remark" label="备注" min-width="230">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="actionBar">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
            <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
          </el-tab-pane>
          <el-tab-pane v-if="btnType == 'look' && dataForm.approvalFlag" label="流转记录" name="transferList">
            <recordList :list='flowTaskOperatorRecordList' :endTime='endTime' />
          </el-tab-pane>
        </el-tabs>
        <el-collapse v-model="activeNames" v-else>
          <el-collapse-item title="基本信息" name="basicInfo">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="组装单号" prop="orderNo">
                    <el-input v-model="dataForm.orderNo" placeholder="请输入组装单号" :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="品名规格" prop="drawingNo">
                    <ComSelect-page v-model="dataForm.drawingNo" @change="submitCustomerProduct1" :tableItems="ProductTableItems1" title="选择产品" treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList1" :isdisabled="btnType == 'look'" placeholder="请选择产品" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="组装人" prop="transferBy">
                    <user-select v-model="dataForm.transferBy" placeholder="请选择组装人" clearable style="width: 100%" :disabled="btnType == 'look'" @change="hangleSelectSales">
                    </user-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="组装日期" prop="transferDate">
                    <el-date-picker v-model="dataForm.transferDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择组装日期" :disabled="btnType == 'look' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="仓库" prop="warehouseId">
                    <ComSelect-list :requestObj="{ type: 'normal' }" dialogTitle="选择仓库" placeholder="请选择仓库" :value="dataForm.warehouseName" :isdisabled="btnType === 'look'" :method="getWarehouseList" @change="changeWarehouse" :beforeSubmit="beforeWarehoustChange"></ComSelect-list>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="库位" prop="shelfSpaceId">
                    <ComSelect-list :requestObj="kwstock" dialogTitle="请选择库位" placeholder="请选择库位" :value="dataForm.shelfSpaceName" :isdisabled="btnType === 'look' || !dataForm.warehouseName" :method="stockDisassemblykw" @change="changeWarehousekw"></ComSelect-list>
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="8" :xs="24">
                      <el-form-item label="目标箱条码" prop="boxBarcode">
                        <ComSelect-page :placeholder="'请选择目标箱条码'" :isdisabled="btnType === 'look' || !dataForm.shelfSpaceName
                      " :value="dataForm.boxBarcode" :dialogTitle="'选择条码'" @change="targetBox" :tableItems="targetTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="targetRequestObj" :paramsObj="{}" :searchList="targetTableSearchList" :elementShow="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="btnType !== 'look'">
                      <el-form-item label="目标箱数量" prop="realityTotalNum">
                        <el-input v-model="dataForm.realityTotalNum" placeholder="" disabled />
                      </el-form-item>
                    </el-col> -->

                <el-col :sm="8" :xs="24">
                  <el-form-item label="数量" prop="num">
                    <el-input v-model="dataForm.num" placeholder="请输入数量" :disabled="btnType == 'look' ? true : false" maxlength="11" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="批次号" prop="batchNumber">
                    <el-select v-model.trim="dataForm.batchNumber" filterable remote reserve-keyword placeholder="请输入批次号" style="width: 100%" clearable :disabled="btnType == 'look'" :remote-method="remoteMethod" :loading="loading" @focus="action">
                      <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="单位(主)" prop="mainUnit">
                    <el-input v-model="dataForm.mainUnit" placeholder="请输入单位" disabled maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" type="textarea" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="产品信息" name="cpInfo">
            <div v-if="btnType !== 'look'">
              <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialogtes()">选择产品</el-button>|
              <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwo" ref="productForm" class="data-form">
              <el-table class="TableForm table" ref="product" :data="dataFormTwo.data" @selection-change="handeleProductInfoData" style="border: 1px solid #e3e7ee">
                <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType != 'look'" key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="2" />
                <el-table-column prop="productDrawingNo" label="品名规格" width="300" show-overflow-tooltip />
                <!-- <el-table-column prop="productSpec" label="规格型号" width="200" show-overflow-tooltip /> -->
                <el-table-column prop="warehouseName" label="仓库" width="200" show-overflow-tooltip />
                <el-table-column prop="shelfSpaceName" label="库位" width="200" show-overflow-tooltip />
                <el-table-column prop="batchNumber" label="批次号" width="200" show-overflow-tooltip />
                <el-table-column prop="availableQuantity" label="原批次数量" width="120" show-overflow-tooltip v-if="btnType !== 'look'" />
                <!-- <el-table-column prop="boxBarcode" label="原箱条码" width="220">
                      <template slot="header">
                        <span class="required">*</span>原箱条码
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'boxBarcode'" :rules="productRules.boxBarcode">
                          <ComSelect-page :placeholder="'请选择原箱条码'" :value="scope.row.boxBarcode" :dialogTitle="'选择条码'" @change="addth" :tableItems="targetTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="barCodeRequestObj(scope.$index)" :paramsObj="{ scope }" :searchList="targetTableSearchList" :isdisabled="btnType === 'look'" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="realityTotalNum" label="原箱数量" width="120" v-if="btnType !== 'look'" /> -->

                <el-table-column prop="num" label="数量" width="160">
                  <template slot="header">
                    <span class="required">*</span>数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'num'" :rules="productRules.num">
                      <el-input v-model="scope.row.num" :disabled="btnType === 'look'" maxlength="11" placeholder="请输入数量" @input="watchnums(scope.row, scope.$index)" style="width: 100%">{{ scope.row.num }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位(主)" width="110" show-overflow-tooltip></el-table-column>

                <el-table-column prop="remark" label="备注" min-width="230">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="actionBar">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>

      <ComSelect-page ref="ComSelect-page" @change="submitAllProduct" :tableItems="ProductTableItems2" dialogTitle="选择产品" :renderTree="false" :listMethod="getBatchNumber" :listRequestObj="ProductListRequestObj2" :searchList="ProductTableSearchList1" :elementShow="false" />
    </div>
  </transition>
</template>

<script>
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import flowMixin from '@/mixins/generator/flowMixin'
import {
  stockDisassembly,
  stockDisassemblykw,
  detaDisassemblyData,
  updateInventoryDisassembly,
  InventoryDisassemblydata,
} from "@/api/warehouseManagement/productlistChange";
import { getcategoryTree } from "@/api/basicData/materialSettings"; // 产品分类 编排属性值
import { inventorySpaceList } from "@/api/warehouseManagement/inventory";
import { getProductList } from "@/api/basicData/materialFiles"; // 产品列表
import { getWarehouseList, getProductionLotList, getBatchNumber } from "@/api/basicData/index"; // 仓库树
import { TransferBarCode } from "@/api/warehouseManagement/transferManagement";
export default {
  mixins: [busFlow, flowMixin],
  components: { Process, recordList },
  data() {
    return {
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      getBatchNumber,
      codeConfig: {},//单据规则配置
      activeNames: ["basicInfo", "cpInfo"],
      // 选择主表产品
      getProductList,
      ProductMethodArr: { method: getcategoryTree, requestObj: { type: "material" } }, // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "",
        queryType: 2,
        drawingNo: "",
        classAttributeList: [
          "raw_material",
          "semi_finished",
          "finish_product",
          "accessories",
        ],
        productCategoryId: "",
        code: "",
        name: "",
        orderItems: [{
          asc: false,
          column: "create_time",
        }],
        pageNum: 1,
        pageSize: 20,
        productStatus: "enable",
        bizTypeList: ['normal', 'transfer', '!material_head', 'blanking', 'to_plated', 'wire_side', 'raw_material', 'hose', 'complete'].filter(item => item.indexOf('!') === -1),
      },
      ProductTableSearchList1: [
        { prop: "code", label: "产品编码", type: "input" },
        { prop: "name", label: "产品名称", type: "input" },
        { prop: "drawingNo", label: "品名规格", type: 'input' }
      ],
      ProductTableItems1: [
        { prop: 'code', label: '产品编码', fixed: 'left', minWidth: 160 },
        { prop: 'drawingNo', label: '品名规格', minWidth: 300 },
        { prop: 'productCategoryName', label: '产品分类', minWidth: 120 },
        { prop: 'mainUnit', label: '单位', minWidth: 120 },
      ],

      // 选择子表产品
      ProductListRequestObj2: {
        accuracyLevel: "",
        availableStock: true,
        availableBatch: 1,
        batchNumber: "",
        clearance: "",
        oil: "",
        orderItems: [{ asc: false, column: "" }],
        pageNum: 1,
        pageSize: 20,
        sealingCoverTyping: "",
        shelfSpaceName: "",
        vibrationLevel: "",
        warehouseId: ""
      }, // 产品选择弹出框列表请求参数
      ProductTableItems2: [
        { prop: 'productDrawingNo', label: '品名规格', minWidth: 300 },
        { prop: 'productCode', label: '产品编码', fixed: 'left', minWidth: 160 },
        { prop: 'productCategoryName', label: '产品分类', minWidth: 120 },
        { prop: 'shelfSpaceName', label: '库位', minWidth: 120 },
        { prop: 'availableQuantity', label: '当前库存', minWidth: 120 },
        { prop: 'mainUnit', label: '单位', minWidth: 120 },
        { prop: 'batchNumber', label: '批次号', minWidth: 180 },
      ], // 产品选择弹出框表单展示字段

      // 选择仓库
      getWarehouseList,
      // 选择库位
      stockDisassemblykw,
      kwstock: {
        pageNum: 1,
        pageSize: 20,
        warehouseId: "",
        locationType: "goods_allocation",
      },

      // 选择目标箱条码
      TransferBarCode,
      targetRequestObj: {
        removeShelfSpaceId: "",
        isTarget: true,
        productsId: "",
        routingLineId: "",
        barcode: "",
      },
      targetTableItems: [
        { prop: "barCode", label: "条码", minWidth: 200 },
        { prop: "realityTotalNum", label: "实际数量", minWidth: 120 },
      ],
      targetTableSearchList: [
        { prop: "barcode", label: "条码", type: "input" },
      ],
      // 选择原箱条码
      orginRequestObj: {
        removeShelfSpaceId: "",
        isTarget: false,
        productsId: "",
        routingLineId: "",
        barcode: "",
      },

      btnType: undefined,

      // 选择批次号
      options: [],
      loading: false,
      formdata: {
        keyword: "",
        orderItems: [{
          asc: false,
          column: "create_time",
        }],
        pageNum: 1,
        pageSize: 20,
      },

      activeName: "orderInfo",
      visible: false,
      btnLoading: false,
      formLoading: false,
      selectRows: [],

      dataForm: {
        orderNo: '',
        id: '',
        approvalFlag: false,
        transferBy: "",
        productsId: "",
        remark: "",
        productName: "",
        drawingNo: '',
        transferDate: "",
        transferType: "merge",
        shelfSpaceId: "",
        warehouseId: "",
        warehouseName: "",
        shelfSpaceName: "",
        num: "",
        mainUnit: "",
        boxBarcode: "",
        targetRealityTotalNum: "",
      },
      dataRule: {
        orderNo: [
          { required: true, message: "组装单号不能为空", trigger: "blur" },
        ],
        drawingNo: [
          { required: true, message: "品名规格不能为空", trigger: "change" },
        ],
        transferBy: [
          { required: true, message: "组装人不能为空", trigger: "change" },
        ],
        transferDate: [
          { required: true, message: "组装日期不能为空", trigger: "change" },
        ],
        warehouseId: [
          { required: true, message: "仓库不能为空", trigger: "change" },
        ],
        shelfSpaceId: [
          { required: true, message: "库位不能为空", trigger: "change" },
        ],
        boxBarcode: [
          { required: true, message: "请选择目标箱条码", trigger: "change" },
        ],
        num: [
          { required: true, message: "数量不能为空", trigger: "blur" },
          { validator: this.formValidate({ type: "decimal", params: [20, 4], }), trigger: "blur", },
          { validator: this.formValidate("positiveNumber"), trigger: "blur" },
        ],
      },
      dataFormTwo: {
        data: [],
      },
      productRules: {
        num: [
          { validator: this.formValidate('noZero', '不能为0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：转换数量${errMsg}`) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => Number(this.dataFormTwo.data[rowIndex].num) <= Number(this.dataFormTwo.data[rowIndex].availableQuantity), "不能超过原批次数量", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：转换数量${errMsg}`) }] }), trigger: 'blur' },
          // { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => Number(this.dataFormTwo.data[rowIndex].num) <= Number(this.dataFormTwo.data[rowIndex].realityTotalNum), "不能超过对应原箱数量", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：转换数量${errMsg}`) }] }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：转换数量${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: "blur" },
        ],
      },

    };
  },
  mounted() {
    this.calcHeight();
  },
  methods: {
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (this.btnType == 'add') {
          this.dataForm.orderNo = data.number
        }
      } catch (error) {
      }
    },
    // 目标箱
    targetBox(id, data, paramsObj) {
      this.$nextTick(() => {
        this.$refs["dataForm"].validateField("boxBarcode");
      });
      if (!data || !data.length) {
        this.dataForm.boxBarcode = "";
        this.dataForm.realityTotalNum = "";
      } else {
        this.dataForm.boxBarcode = data[0].all.barCode;
        this.dataForm.realityTotalNum = data[0].all.realityTotalNum;
      }
    },
    // 原箱回调
    addth(id, data, paramsObj) {
      // this.$nextTick(() => { this.$refs.dataForm.$children[0].validateField("boxBarcode") })
      let index = paramsObj.scope.$index;
      if (!data || !data.length) {
        this.dataFormTwo.data[index].boxBarcode = "";
        this.dataFormTwo.data[index].realityTotalNum = "";
      } else {
        this.dataFormTwo.data[index].boxBarcode = data[0].all.barCode;

        this.dataFormTwo.data[index].realityTotalNum =
          data[0].all.realityTotalNum;
        console.log(this.dataFormTwo.data[index].boxBarcode);
      }
    },
    barCodeRequestObj(rowIndex) {
      this.orginRequestObj.removeShelfSpaceId = this.dataFormTwo.data[rowIndex].shelfSpaceId;
      this.orginRequestObj.productsId = this.dataFormTwo.data[rowIndex].productsId;
      return this.orginRequestObj;
    },
    submitCustomerProduct1(val, data) {
      this.$nextTick(() => { this.$refs["dataForm"].validateField("drawingNo") });
      if (!val && !data.length) return;
      if (data && data.length) {
        this.dataForm.productsId = data[0].all.id;
        this.targetRequestObj.productsId = ''
        this.dataForm.productName = data[0].all.name;
        this.dataForm.drawingNo = data[0].all.drawingNo;
        this.dataForm.mainUnit = data[0].all.mainUnit;
        this.dataForm.deputyUnit = data[0].all.deputyUnit;
        this.dataForm.ratio = data[0].all.ratio;
        this.dataForm.calculationDirection = data[0].all.calculationDirection;
        if (data[0].all.goodsShelvesId == -1) {
          this.dataForm.goodsShelvesId = null;
        } else {
          this.dataForm.goodsShelvesId = data[0].all.goodsShelvesId;
        }
      } else {
        this.dataForm.productsId = "";
        this.dataForm.productName = "";
        this.dataForm.drawingNo = ""
      }
    },
    // 批次号聚焦
    action() {
      this.options = [];
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        this.formdata.keyword = query;
        this.options = [];
        setTimeout(() => {
          getProductionLotList(this.formdata)
            .then((res) => {
              this.loading = false;
              res.data.records.forEach((item) => {
                item.value = item.batchNumber;
                this.options.push(item);
              });
            })
            .catch(() => {
              this.loading = false;
            });
        }, 200);
      } else {
        this.options = [];
      }
    },
    //组装人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("transferBy") });
    },
    async beforeWarehoustChange(val, data, paramsObj) {
      if (!val && data.length) return true // 忽略处理自动回显的数据
      let flag = true
      if (this.dataFormTwo.data.length) { // 数据有效，进行更新
        if (!data.length || (this.dataForm.warehouseName && data.length && this.dataForm.warehouseName !== data[0].name)) {
          flag = await this.$confirm('如果切换仓库会重置产品明细信息，确定继续吗？', this.$t('common.tipTitle'), {
            type: 'warning'
          }).catch(err => false)
          if (flag) this.dataFormTwo.data = []
        }
      }
      return flag
    },
    //选择仓库
    async changeWarehouse(val, data) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("warehouseId") });
      if (!val && data.length) return // 忽略处理自动回显的数据
      if (data && data.length) { // 数据有效，进行更新
        this.dataForm.shelfSpaceId = "";
        this.dataForm.shelfSpaceName = "";
        this.dataForm.warehouseId = data[0].id;
        this.dataForm.warehouseName = data[0].name;
        this.kwstock.warehouseId = data[0].id;
        // this.ProductListRequestObj2.selfWarehouseIds = [data[0].id]
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.shelfSpaceId = "";
        this.dataForm.shelfSpaceName = "";
        this.dataForm.warehouseId = "";
        this.dataForm.warehouseName = "";
        this.kwstock.warehouseId = "";
        this.dataForm.boxBarcode = "";
        this.dataForm.realityTotalNum = "";
        // this.ProductListRequestObj2.selfWarehouseIds = []
      }
    },
    //库位选择
    changeWarehousekw(val, data) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField("shelfSpaceId");
      });
      if (!val && !data.length) return (this.dataForm.shelfSpaceId = "");
      if (data[0].all.parentId == -1) {
        this.dataForm.goodsShelvesId = null;
      } else {
        this.dataForm.goodsShelvesId = data[0].all.parentId;
      }
      this.dataForm.shelfSpaceId = data[0].id;
      this.dataForm.shelfSpaceName = data[0].name;
      this.targetRequestObj.removeShelfSpaceId = this.dataForm.shelfSpaceId;
    },
    calcHeight() {
      this.$nextTick(() => {
        let tBodyList = document.querySelectorAll('.TableForm.table')
        tBodyList.forEach(item => {
          item.style.height = 'auto'
          item.querySelector('.el-table__body-wrapper').style.height = 'auto'
        })
      });
    },
    goBack() {
      this.$emit("close");
    },
    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val;
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: "请选择要删除的产品",
          type: "error",
          duration: 1500,
        });
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.data.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      console.log("1234", data);
      this.dataFormTwo.data.splice(data.$index, 1);
    },
    //选择库存产品
    openSeleceProductDialogtes() {
      if (!this.dataForm.warehouseId) return this.$message.error('请先选择仓库')
      this.$refs['ComSelect-page'].openDialog()
    },
    // 监听主数量输入
    watchnums(row, index) {
      // console.log("主数量", row, index);
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      // if (!row.contractQuantity || !row.price || !row.taxRate) {
      //   return
      // }
      row.num = row.num.replace(/[^0-9.]/g, "");

      if (row.num.length == 1 && row.num == ".") {
        // 如果第一位是小数点，则清空输入框
        row.num = "";
      } else if (
        row.num.length == 2 &&
        row.num[0] == "0" &&
        row.num[1] != "."
      ) {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.num = row.num.slice(0, 1) + "." + row.num.slice(1);
      } else if (row.num.length > 2 && row.num[0] == "0" && row.num[1] != ".") {
        row.num = row.num.substring(1, row.num.length);
      }
      if (row.num.includes(".")) {
        let dotCount = 0; // 小数点的数量
        let result = ""; // 处理后的结果
        for (let i = 0; i < row.num.length; i++) {
          const char = row.num[i];
          if (char === ".") {
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
        if (arr[0].length > 16) {
          arr[0] = arr[0].substring(0, 16)
        }
        if (arr[1].length > 4) {
          arr[1] = arr[1].substring(0, 4)
        }
        row.num = arr[0] + '.' + arr[1]
      } else {
        if (row.num.length > 20) {
          row.num = row.num.substring(0, 20);
        }
      }
    },
    //产品多选
    submitAllProduct(val, data, paramsObj) {
      data = data.map(item => {
        return {
          productsId: item.all.productsId,
          productName: item.all.name,
          productDrawingNo: item.all.productDrawingNo,
          productSpec: item.all.spec,
          warehouseId: item.all.warehouseId,
          warehouseName: item.all.warehouseName,
          shelfSpaceId: item.all.shelfSpaceId,
          shelfSpaceName: item.all.shelfSpaceName,
          batchNumber: item.all.batchNumber,
          availableQuantity: item.all.availableQuantity,
          boxBarcode: '',
          realityTotalNum: '',
          mainUnit: item.all.mainUnit,
          remark: '',
          mainUnit: item.all.mainUnit,
          deputyUnit: item.all.deputyUnit,
          ratio: item.all.ratio,
          calculationDirection: item.all.calculationDirection
        }
      })
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...data]
    },

    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(id, btnType, approvalFlag) {
      this.approvalFlag = approvalFlag
      this.formLoading = true
      this.dataForm.id = id || "";
      this.btnType = btnType;
      if (this.btnType === 'add' || this.btnType === 'edit') {
        this.getBusInfo('b061')
        this.fetchData('MSSD')
      }
      if (this.dataForm.id) {
        detaDisassemblyData(this.dataForm.id).then((res) => {
          this.formLoading = false
          this.dataForm = res.data.trans;
          this.dataFormTwo.data = res.data.transLineList;
          this.targetRequestObj.removeShelfSpaceId = res.data.trans.shelfSpaceId;
          this.targetRequestObj.productsId = res.data.trans.productsId;
          // this.ProductListRequestObj2.selfWarehouseIds = [this.dataForm.warehouseId]
          if (this.btnType == 'add') {
            this.dataForm.id = ''
          }
          if (this.btnType === 'look') {
            // 流程信息和流转记录
            if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
          }
        });
      } else {
        this.dataForm.transferDate = this.jnpf.getToday();
        this.formLoading = false
      }
    },
    async handleConfirm(value) {
      this.btnLoading = true
      let submitFlag = true

      const form_1 = this.$refs.dataForm
      const valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        let formItems = form_1.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        })
      }

      const form_2 = this.$refs.productForm
      const valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        let formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }

      if (!this.dataFormTwo.data.length && submitFlag) {
        this.$message.error('请选择产品')
        submitFlag = false
      }

      if (submitFlag) {
        this.dataForm.documentStatus = value;
        this.dataForm.transferType = "merge";
        let obj = {
          trans: this.dataForm,
          transLineList: this.dataFormTwo.data,
          flowData: this.flowData
        };
        this.btnLoading = true;
        let formMethod = null;
        if (this.btnType == "edit") {
          formMethod = updateInventoryDisassembly;
        } else if (this.btnType == "add") {
          formMethod = InventoryDisassemblydata;
        }
        formMethod(obj)
          .then((res) => {
            console.log(res);
            let msg = "";
            if (formMethod == InventoryDisassemblydata) {
              msg = "新建成功";
            } else if (value == "draft") {
              msg = "保存成功";
            } else if (value == "submit") {
              msg = "提交成功";
            }
            this.$message({
              message: msg,
              type: "success",
              duration: 1500,
              onClose: () => {
                this.visible = false;
                this.btnLoading = false;
                this.$emit("close", true);
              },
            });
          }).catch(() => {
            this.btnLoading = false;
          });
      } else {
        this.btnLoading = false
      }
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}
.required {
  color: red;
  margin-right: 4px;
}
::v-deep .data-form {
  margin-bottom: 18px;
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
.JNPF-preview-main .main {
  padding-top: 0;
}
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
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
  padding-bottom: 0px;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
