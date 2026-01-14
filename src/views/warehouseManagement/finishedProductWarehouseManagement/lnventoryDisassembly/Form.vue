<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建存货拆卸' : btnType == 'edit' ? '编辑存货拆卸' : '查看存货拆卸'" />
        <div class="options">
          <el-button type="success" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
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
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="拆卸单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请输入拆卸单号" :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="原型号" prop="drawingNo">
                        <ComSelect-page v-model="dataForm.drawingNo" @change="submitCustomerProduct" :beforeSubmit="beforeSubmit" :tableItems="ProductTableItems" dialogTitle="选择产品" :renderTree="false" :listMethod="getBatchNumber" :listRequestObj="listQuery" :searchList="ProductTableSearchList" :isdisabled="btnType == 'look'" placeholder="请选择产品" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="拆卸人" prop="transferBy">
                        <PersonSelect v-model="dataForm.transferBy" :projectId="warehouseInfo.projectId" placeholder="请选择拆卸人" clearable style="width: 100%" :disabled="btnType == 'look'" @change="hangleSelectSales">
                        </PersonSelect>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="拆卸日期" prop="transferDate">
                        <el-date-picker v-model="dataForm.transferDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择拆卸日期" :disabled="btnType == 'look' ? true : false">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="数量" prop="num">
                        <el-input v-model="dataForm.num" placeholder="请输入数量" :disabled="btnType == 'look' ? true : false" maxlength="11" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="原仓库" prop="warehouseId">
                        <el-input v-model="dataForm.warehouseName" placeholder="请选择原仓库" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="原库位" prop="shelfSpaceId">
                        <el-input v-model="dataForm.shelfSpaceName" placeholder="请选择原库位" disabled />
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :sm="8" :xs="24">
                      <el-form-item label="原箱条码" prop="boxBarcode">
                        <ComSelect-page :placeholder="'请选择原箱条码'" :isdisabled="btnType === 'look' || !dataForm.shelfSpaceName
                      " v-model="dataForm.boxBarcode" :dialogTitle="'选择条码'" ref="ComSelect-pagebox" @change="orginBox" :tableItems="orginTableItems" :renderTree="false" :listMethod="TransferBarCode" :searchList="orginTableSearchList" :listRequestObj="orginRequestObj" :paramsObj="{}" :elementShow="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="原箱数量" prop="realityTotalNum">
                        <el-input v-model="dataForm.realityTotalNum" placeholder="" disabled />
                      </el-form-item>
                    </el-col> -->
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="原批次号" prop="batchNumber">
                        <el-input v-model="dataForm.batchNumber" placeholder="请输入原批次号" disabled maxlength="50" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="原批次数量" prop="availableQuantity">
                        <el-input v-model="dataForm.availableQuantity" placeholder="请输入原批次数量" disabled maxlength="50" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="单位(主)" prop="mainUnit">
                        <el-input v-model="dataForm.mainUnit" placeholder="请输入单位" disabled maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" type="textarea" maxlength="200" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="cpInfo">
                <div v-if="btnType !== 'look'" key="11">
                  <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择产品</el-button>|
                  <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" ref="productForm" class="data-form">
                  <el-table class="TableForm table" ref="product" :data="dataFormTwo.data" @selection-change="handeleProductInfoData" style="border: 1px solid #e3e7ee">
                    <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType != 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="2" />
                    <el-table-column prop="productDrawingNo" label="型号" width="300" show-overflow-tooltip />
                    <el-table-column prop="productCode" label="目标产品编码" width="200" show-overflow-tooltip />
                    <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                    <!-- <el-table-column prop="warehouseId" label="目标仓库" width="260">
                  <template slot="header">
                    <span class="required">*</span>目标仓库
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'warehouseName'"
                      :rules="productRules.warehouseName">
                      <ComSelect-list :requestObj="{ type: 'normal' }" :dialogTitle="'请选择仓库'"
                        v-model="scope.row.warehouseName" :isdisabled="btnType === 'look'" :method="getWarehouseList"
                        :paramsObj="{ scope }" @change="changeWarehouse"></ComSelect-list>
                    </el-form-item>
                  </template>
                </el-table-column> -->
                    <el-table-column prop="shelfSpaceId" label="目标库位" width="260">
                      <template slot="header">
                        <span class="required">*</span>目标库位
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'shelfSpaceName'" :rules="productRules.shelfSpaceName">
                          <ComSelect-list :dialogTitle="'请选择库位'" v-model="scope.row.shelfSpaceName" :requestObj="kwstock" :isdisabled="btnType === 'look'" :method="stockDisassemblykw" placeholder="请选择目标库位" :paramsObj="{ scope }" @change="changeWarehousekw"></ComSelect-list>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="batchNumber" label="目标批次号" width="230" show-overflow-tooltip>
                      <template slot="header">
                        <span class="required">*</span>目标批次号
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'batchNumber'" :rules="productRules.batchNumber">
                          <el-select v-model.trim="scope.row.batchNumber" filterable remote reserve-keyword placeholder="请输入批次号" style="width: 100%" clearable :disabled="btnType == 'look'" :remote-method="remoteMethod" :loading="loading" @focus="actionbat">
                            <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="boxBarcode" label="目标箱条码" width="220">
                      <template slot="header">
                        <span class="required">*</span>目标箱条码
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'boxBarcode'" :rules="productRules.boxBarcode">
                          <ComSelect-page :placeholder="'请选择目标箱条码'" :isdisabled="!scope.row.shelfSpaceId || btnType === 'look'
                        " :value="scope.row.boxBarcode" :dialogTitle="'选择条码'" ref="ComSelect-pageBar" @change="targetBox" :tableItems="targetTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="targetBoxbarCodeRequestObj(scope.$index)
                          " :searchList="targetTableSearchList" :paramsObj="{ scope }" :elementShow="true" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="realityTotalNum" label="目标箱数量" width="120" v-if="btnType !== 'look'" /> -->
                    <el-table-column prop="num" label="数量" width="160">
                      <template slot="header">
                        <span class="required">*</span>数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'num'" :rules="productRules.num">
                          <el-input v-model="scope.row.num" :disabled="btnType === 'look'" maxlength="11" placeholder="请输入数量" @input="watchnums(scope.row, scope.$index)" style="width: 135px">{{ scope.row.num }}
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
                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="111">
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
                <el-col :sm="8" :xs="24">
                  <el-form-item label="拆卸单号" prop="orderNo">
                    <el-input v-model="dataForm.orderNo" placeholder="请输入拆卸单号" :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="原型号" prop="drawingNo">
                    <ComSelect-page v-model="dataForm.drawingNo" @change="submitCustomerProduct" :beforeSubmit="beforeSubmit" :tableItems="ProductTableItems" dialogTitle="选择产品" :renderTree="false" :listMethod="getBatchNumber" :listRequestObj="listQuery" :searchList="ProductTableSearchList" :isdisabled="btnType == 'look'" placeholder="请选择产品" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="拆卸人" prop="transferBy">
                    <PersonSelect v-model="dataForm.transferBy" placeholder="请选择拆卸人" clearable style="width: 100%" :disabled="btnType == 'look'" @change="hangleSelectSales">
                    </PersonSelect>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="拆卸日期" prop="transferDate">
                    <el-date-picker v-model="dataForm.transferDate" type="date" value-format="yyyy-MM-dd" style="width: 100%" placeholder="请选择拆卸日期" :disabled="btnType == 'look' ? true : false">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="数量" prop="num">
                    <el-input v-model="dataForm.num" placeholder="请输入数量" :disabled="btnType == 'look' ? true : false" maxlength="11" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="原仓库" prop="warehouseId">
                    <el-input v-model="dataForm.warehouseName" placeholder="请选择原仓库" disabled />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="原库位" prop="shelfSpaceId">
                    <el-input v-model="dataForm.shelfSpaceName" placeholder="请选择原库位" disabled />
                  </el-form-item>
                </el-col>
                <!-- <el-col :sm="8" :xs="24">
                      <el-form-item label="原箱条码" prop="boxBarcode">
                        <ComSelect-page :placeholder="'请选择原箱条码'" :isdisabled="btnType === 'look' || !dataForm.shelfSpaceName
                      " v-model="dataForm.boxBarcode" :dialogTitle="'选择条码'" ref="ComSelect-pagebox" @change="orginBox" :tableItems="orginTableItems" :renderTree="false" :listMethod="TransferBarCode" :searchList="orginTableSearchList" :listRequestObj="orginRequestObj" :paramsObj="{}" :elementShow="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="原箱数量" prop="realityTotalNum">
                        <el-input v-model="dataForm.realityTotalNum" placeholder="" disabled />
                      </el-form-item>
                    </el-col> -->
                <el-col :sm="8" :xs="24">
                  <el-form-item label="原批次号" prop="batchNumber">
                    <el-input v-model="dataForm.batchNumber" placeholder="请输入原批次号" disabled maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="原批次数量" prop="availableQuantity">
                    <el-input v-model="dataForm.availableQuantity" placeholder="请输入原批次数量" disabled maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="单位(主)" prop="mainUnit">
                    <el-input v-model="dataForm.mainUnit" placeholder="请输入单位" disabled maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'" type="textarea" maxlength="200" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="产品信息" name="cpInfo">
            <div v-if="btnType !== 'look'" key="11">
              <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择产品</el-button>|
              <el-button type="text" style="margin-right: 8px; margin-left: 8px; font-size: 14px !important;" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwo" ref="productForm" class="data-form">
              <el-table class="TableForm table" ref="product" :data="dataFormTwo.data" @selection-change="handeleProductInfoData" style="border: 1px solid #e3e7ee">
                <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType != 'look'" key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="2" />
                <el-table-column prop="productDrawingNo" label="目标型号" width="300" show-overflow-tooltip />
                <el-table-column prop="productCode" label="目标产品编码" width="200" show-overflow-tooltip />
                <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                <!-- <el-table-column prop="warehouseId" label="目标仓库" width="260">
                  <template slot="header">
                    <span class="required">*</span>目标仓库
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'warehouseName'"
                      :rules="productRules.warehouseName">
                      <ComSelect-list :requestObj="{ type: 'normal' }" :dialogTitle="'请选择仓库'"
                        v-model="scope.row.warehouseName" :isdisabled="btnType === 'look'" :method="getWarehouseList"
                        :paramsObj="{ scope }" @change="changeWarehouse"></ComSelect-list>
                    </el-form-item>
                  </template>
                </el-table-column> -->
                <el-table-column prop="shelfSpaceId" label="目标库位" width="260">
                  <template slot="header">
                    <span class="required">*</span>目标库位
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'shelfSpaceName'" :rules="productRules.shelfSpaceName">
                      <ComSelect-list :dialogTitle="'请选择库位'" v-model="scope.row.shelfSpaceName" :requestObj="kwstock" :isdisabled="btnType === 'look'" :method="stockDisassemblykw" placeholder="请选择目标库位" :paramsObj="{ scope }" @change="changeWarehousekw"></ComSelect-list>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="batchNumber" label="目标批次号" width="230" show-overflow-tooltip>
                  <template slot="header">
                    <span class="required">*</span>目标批次号
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'batchNumber'" :rules="productRules.batchNumber">
                      <el-select v-model.trim="scope.row.batchNumber" filterable remote reserve-keyword placeholder="请输入批次号" style="width: 100%" clearable :disabled="btnType == 'look'" :remote-method="remoteMethod" :loading="loading" @focus="actionbat">
                        <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="boxBarcode" label="目标箱条码" width="220">
                      <template slot="header">
                        <span class="required">*</span>目标箱条码
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'boxBarcode'" :rules="productRules.boxBarcode">
                          <ComSelect-page :placeholder="'请选择目标箱条码'" :isdisabled="!scope.row.shelfSpaceId || btnType === 'look'
                        " :value="scope.row.boxBarcode" :dialogTitle="'选择条码'" ref="ComSelect-pageBar" @change="targetBox" :tableItems="targetTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="targetBoxbarCodeRequestObj(scope.$index)
                          " :searchList="targetTableSearchList" :paramsObj="{ scope }" :elementShow="true" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="realityTotalNum" label="目标箱数量" width="120" v-if="btnType !== 'look'" /> -->
                <el-table-column prop="num" label="数量" width="160">
                  <template slot="header">
                    <span class="required">*</span>数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'num'" :rules="productRules.num">
                      <el-input v-model="scope.row.num" :disabled="btnType === 'look'" maxlength="11" placeholder="请输入数量" @input="watchnums(scope.row, scope.$index)" style="width: 135px">{{ scope.row.num }}
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
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="111">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <ComSelect-page ref="ComSelect-page1" @change="submitCustomerProduct1" :tableItems="ProductTableItems1" dialogTitle="选择产品" treeTitle="物料分类" :methodArr="ProductMethodArr" :listMethod="getProductList" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList1" :elementShow="false" multiple />
    </div>
  </transition>
</template>
<script>
import PersonSelect from '@/views/basicData/processSettings/basicProcessSettings/personSelect.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import flowMixin from '@/mixins/generator/flowMixin'
import {
  stockDisassemblykw,
  detaDisassemblyData,
  updateInventoryDisassemblycx,
  InventoryDisassemblydatacx,
} from "@/api/warehouseManagement/productlistChange";
import { getcategoryTree } from "@/api/basicData/materialSettings"; // 产品分类 编排属性值
import { inventorySpaceList } from "@/api/warehouseManagement/inventory";
import { getProductList } from "@/api/basicData/materialFiles"; // 产品列表
import { getWarehouseList, getProductionLotList, getBatchNumber } from "@/api/basicData/index"; // 仓库树
import { TransferBarCode } from "@/api/warehouseManagement/transferManagement";
import formValidate from "@/utils/formValidate";
export default {
  mixins: [busFlow, flowMixin, getProjectList],
  components: { Process, recordList, PersonSelect },
  data() {
    return {
      isProjectSwitch: '',
      warehouseInfo: {},
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      getBatchNumber,
      codeConfig: {},//单据规则配置
      activeNames: ["basicInfo", "cpInfo"],
      TransferBarCode,
      // 原箱条码请求参数
      orginRequestObj: {
        removeShelfSpaceId: "",
        isTarget: false,
        productsId: "",
        routingLineId: "",
        barcode: "",
      },
      orginTableItems: [
        { prop: "barCode", label: "条码", minWidth: 200 },
        { prop: "realityTotalNum", label: "实际数量", minWidth: 120 },
      ],
      orginTableSearchList: [{ prop: "barcode", label: "条码", type: "input" }],
      // 目标箱条码
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
      getcategoryTree,
      getProductList,
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: "input" },
        { prop: "name", label: "产品名称", type: "input" },
        { prop: "drawingNo", label: "型号", type: 'input' }
      ],
      ProductTableSearchList1: [
        { prop: "code", label: "产品编码", type: "input" },
        { prop: "name", label: "产品名称", type: "input" },
        { prop: "drawingNo", label: "型号", type: 'input' }
      ],
      ProductTableItems: [
        { prop: "productCode", label: "产品编码", fixed: "left" },
        { prop: "productDrawingNo", label: "型号" },
        { prop: "warehouseName", label: "仓库" },
        { prop: "shelfSpaceName", label: "库位" },
        { prop: "batchNumber", label: "批次号" },
        { prop: "availableQuantity", label: "可用库存数量" },
      ],
      ProductTableItems1: [
        { prop: "code", label: "产品编码", fixed: "left" },
        { prop: "drawingNo", label: "型号" },
        { prop: "productCategoryName", label: "产品分类" },
        { prop: "mainUnit", label: "单位" },
      ],
      kwstock: {
        pageNum: 1,
        pageSize: 20,
        warehouseId: "",
      },
      getWarehouseList,
      inventorySpaceList,
      stockDisassemblykw,
      ProductTreeDatakctes: [],
      shelfSpacelist: [],
      dataFormTwo: {
        data: [],
      },
      selectlist: [],
      //批次号
      options: [],
      loading: false,
      formdata: {
        keyword: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: 20,
      },
      // 选择客户产品参数
      productForm: {
        drawingNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        pageNum: 1,
        pageSize: 20,
      },
      ProductMethodArr: { method: getcategoryTree, requestObj: { type: "material" } }, // 产品选择弹出框树状列表
      productRules: {
        num: [
          { validator: this.formValidate('noZero', '不能为0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：数量${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: "blur" },
        ],
        shelfSpaceName: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：货位名称${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: "blur" },
        ],
        warehouseName: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：仓库名称${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: "blur" },
        ],
        batchNumber: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：目标批次号${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: "blur" },
        ]
      },
      ProductListRequestObj: {
        projectId: '',
        drawingNo: '',
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
        pageNum: 1,
        pageSize: 20,
        productStatus: "enable",
      },
      btnType: undefined,
      listQuery: {
        projectId: '',
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
      },
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      dataForm: {
        batchNumber: '',
        orderNo: '',
        id: '',
        approvalFlag: false,
        transferBy: "",
        productsId: "",
        remark: "",
        drawingNo: '',
        productName: "",
        transferDate: "",
        transferType: "split",
        shelfSpaceId: "",
        warehouseId: "",
        warehouseName: "",
        shelfSpaceName: "",
        realityTotalNum: "",
        boxBarcode: "",
        num: "",
        mainUnit: "",
      },
      parentId: "",
      dataRule: {
        orderNo: [
          { required: true, message: "拆卸单号不能为空", trigger: "blur" },
        ],
        drawingNo: [
          { required: true, message: "型号不能为空", trigger: "change" },
        ],
        transferBy: [
          { required: true, message: "拆卸人不能为空", trigger: "blur" },
        ],
        transferDate: [
          { required: true, message: "拆卸日期不能为空", trigger: "blur" },
        ],
        batchNumber: [
          { required: true, message: "原批次号不能为空", trigger: "change" },
        ],
        // warehouseId: [
        //   { required: true, message: "仓库不能为空", trigger: "change" },
        // ],
        // shelfSpaceId: [
        //   { required: true, message: "库位不能为空", trigger: "change" },
        // ],
        boxBarcode: [
          { required: true, message: "请选择原箱条码", trigger: "change" },
        ],
        num: [
          { required: true, message: "数量不能为空", trigger: "blur" },
          { validator: this.formValidate({ type: "decimal", params: [10, 2, "请输入正确的数量(最多保留2位小数,整数8位)"], }), trigger: "change", },
          { validator: this.formValidate('noZero', '不能为0', (errMsg) => { this.$message.error('数量：' + errMsg) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => Number(this.dataForm.num) <= Number(this.dataForm.availableQuantity), "不能超过原批次数量", (errMsg) => { this.$message.error('数量：' + errMsg) }] }), trigger: 'blur' },
          // { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => Number(this.dataForm.num) <= Number(this.dataForm.realityTotalNum), "不能超过原箱数量", (errMsg) => { this.$message.error('数量：' + errMsg) }] }), trigger: 'blur' }
        ],
      },
      selectRows: [],
    };
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
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
    // 原箱条码回调
    orginBox(id, data) {
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
    // 目标箱条码回调
    targetBox(id, data, paramsObj) {
      let index = paramsObj.scope.$index;
      if (!data || !data.length) {
        this.dataFormTwo.data[index].boxBarcode = "";
        this.dataFormTwo.data[index].realityTotalNum = "";
      } else {
        this.dataFormTwo.data[index].boxBarcode = data[0].all.barCode;
        this.dataFormTwo.data[index].realityTotalNum =
          data[0].all.realityTotalNum ? data[0].all.realityTotalNum : 0
      }
    },
    // 目标箱参数处理
    targetBoxbarCodeRequestObj(rowIndex) {
      this.targetRequestObj.removeShelfSpaceId =
        this.dataFormTwo.data[rowIndex].shelfSpaceId;
      this.targetRequestObj.productsId = ''
      return this.targetRequestObj;
    },
    async beforeSubmit(data, paramsObj) {
      let flag = true
      if (this.dataForm.warehouseId && data.warehouseId !== this.dataForm.warehouseId) {
        flag = await this.$confirm('如果切换仓库产品会重置产品明细的库位信息，确定继续吗？', this.$t('common.tipTitle'), {
          type: 'warning'
        }).catch(err => false)
      }
      return flag
    },
    //产品单选
    submitCustomerProduct(val, data) {
      this.$nextTick(() => { this.$refs["dataForm"].validateField("drawingNo") });
      if (!val && data.length) return // 忽略处理自动回显的数据
      if (data && data.length) {
        // 切换拆卸产品，如果仓库改变了，重置子表库位
        if (this.dataForm.warehouseId && data[0].all.warehouseId !== this.dataForm.warehouseId) {
          this.dataFormTwo.data.forEach(line => {
            line.shelfSpaceName = ''
            line.shelfSpaceId = ''
            line.goodsShelvesId = ''
          })
        }
        this.kwstock.warehouseId = data[0].all.warehouseId
        this.dataForm.productsId = data[0].all.productsId
        this.dataForm.productName = data[0].all.name
        this.dataForm.drawingNo = data[0].all.productDrawingNo
        this.orginRequestObj.removeShelfSpaceId = data[0].all.shelfSpaceId;
        this.orginRequestObj.productsId = data[0].all.id
        this.dataForm.availableQuantity = data[0].all.availableQuantity
        this.dataForm.batchNumber = data[0].all.batchNumber
        this.dataForm.goodsShelvesId = data[0].all.goodsShelvesId
        this.dataForm.shelfSpaceId = data[0].all.shelfSpaceId
        this.dataForm.shelfSpaceName = data[0].all.shelfSpaceName
        this.dataForm.warehouseId = data[0].all.warehouseId
        this.dataForm.warehouseName = data[0].all.warehouseName
        this.dataForm.mainUnit = data[0].all.mainUnit
        this.dataForm.deputyUnit = data[0].all.deputyUnit
        this.dataForm.ratio = data[0].all.ratio
        this.dataForm.calculationDirection = data[0].all.calculationDirection
      } else {
        this.dataForm.productsId = ''
        this.dataForm.productName = ''
        this.dataForm.drawingNo = ''
        this.orginRequestObj.removeShelfSpaceId = ''
        this.orginRequestObj.productsId = ''
        this.dataForm.availableQuantity = ''
        this.dataForm.batchNumber = ''
        this.dataForm.goodsShelvesId = ''
        this.dataForm.shelfSpaceId = ''
        this.dataForm.shelfSpaceName = ''
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.mainUnit = ''
        this.dataForm.deputyUnit = ''
        this.dataForm.ratio = ''
        this.dataForm.calculationDirection = ''
      }
    },
    //产品多选
    submitCustomerProduct1(selectedIds, selectedList) {
      selectedList.forEach((item) => {
        // this.kwstock.warehouseId = item.all.warehouseId;
        item.all.productName = item.all.name;
        item.all.warehouseId = this.kwstock.warehouseId
        item.all.productsId = item.all.id;
        item.all.productCode = item.all.code;
        item.all.productDrawingNo = item.all.drawingNo
        if (item.all.goodsShelvesId == -1) {
          item.all.goodsShelvesId = null;
        } else {
          item.all.goodsShelvesId = item.all.goodsShelvesId;
        }
        this.dataFormTwo.data.push(item.all);
      });
      this.dataFormTwo.data.forEach((item, index) => {
        this.$set(this.dataFormTwo.data[index], "boxBarcode", "");
        this.$set(this.dataFormTwo.data[index], "realityTotalNum", "");
      });
    },
    //输入批次号
    actionbat() {
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
    //拆卸人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("transferBy") });
    },
    //库位选择
    changeWarehousekw(val, data, params) {
      this.$nextTick(() => { this.$refs.productForm.validateField("data." + index + "." + "shelfSpaceName") });
      if (!val && !data.length) return;
      let index = params.scope.$index;
      if (data.length == 0) {
        this.$set(this.dataFormTwo.data[index], "shelfSpaceName", "");
        this.$set(this.dataFormTwo.data[index], "shelfSpaceId", "");
      } else {
        this.$set(this.dataFormTwo.data[index], "shelfSpaceName", data[0].name);
        this.$set(this.dataFormTwo.data[index], "shelfSpaceId", data[0].id);
        if (data[0].all.parentId == -1) {
          this.$set(this.dataFormTwo.data[index], "goodsShelvesId", null);
        } else {
          this.$set(this.dataFormTwo.data[index], "goodsShelvesId", data[0].all.parentId);
        }
      }
    },
    //仓库选择
    changeWarehouse(val, data, params) {
      if (!val && !data.length) return;
      this.kwstock.warehouseId = data[0].id;
      this.$nextTick(() => { this.$refs.productForm.validateField("data." + index + "." + "warehouseName") });
      let index = params.scope.$index;
      this.$set(this.dataFormTwo.data[index], "shelfSpaceName", "");
      this.$set(this.dataFormTwo.data[index], "shelfSpaceId", "");
      if (data.length == 0) {
        this.$set(this.dataFormTwo.data[index], "warehouseName", "");
        this.$set(this.dataFormTwo.data[index], "warehouseId", "");
      } else {
        this.$set(this.dataFormTwo.data[index], "warehouseName", data[0].name);
        this.$set(this.dataFormTwo.data[index], "warehouseId", data[0].id);
      }
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
      this.dataFormTwo.data.splice(data.$index, 1);
    },
    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {
      if (!this.dataForm.drawingNo) return this.$message.error('请先选择原产品')
      this.$refs["ComSelect-page1"].openDialog();
    },
    // 监听主数量输入
    watchnums(row, index) {
      console.log("主数量", row, index);
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
    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(id, btnType, approvalFlag, obj) {
      this.approvalFlag = approvalFlag
      this.formLoading = true
      this.dataForm.id = id || "";
      this.btnType = btnType;
      this.warehouseInfo = obj.warehouseInfo || ''
      this.listQuery.projectId = this.warehouseInfo.projectId || ''
      this.ProductListRequestObj.projectId = this.warehouseInfo.projectId || ''
      if (this.btnType === 'add' || this.btnType === 'edit') {
        this.getBusInfo('b063')
        this.fetchData('SPSD')
      }
      if (this.dataForm.id) {
        detaDisassemblyData(this.dataForm.id).then((res) => {
          this.dataForm = res.data.trans;
          this.dataForm.orderNo = res.data.trans.transferNo
          this.dataForm.drawingNo = res.data.trans.productDrawingNo
          this.dataFormTwo.data = res.data.transLineList;
          this.orginRequestObj.removeShelfSpaceId = res.data.trans.shelfSpaceId;
          this.orginRequestObj.productsId = res.data.trans.productsId;
          this.formLoading = false
          this.kwstock.warehouseId = this.dataForm.warehouseId;
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
        })
      }

      if (!this.dataFormTwo.data.length && submitFlag) {
        this.$message.error('请选择产品')
        submitFlag = false
      }

      if (submitFlag) {
        this.dataForm.documentStatus = value;
        this.dataForm.transferType = "split";
        let obj = {
          trans: this.dataForm,
          transLineList: this.dataFormTwo.data,
          flowData: this.flowData
        };
        this.btnLoading = true;
        let formMethod = null;
        if (this.btnType == "edit") {
          formMethod = updateInventoryDisassemblycx;
        } else if (this.btnType == "add") {
          formMethod = InventoryDisassemblydatacx;
        }
        formMethod(obj).then((res) => {
          let msg = "";
          if (formMethod == InventoryDisassemblydatacx) {
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
              this.btnLoading = false;
              this.$emit("close", true);
            },
          });
        }).catch(() => { this.btnLoading = false; });
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
