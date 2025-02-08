<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建形态转换' : btnType == 'edit' ? '编辑形态转换' : '查看形态转换'" />
        <div class="options">
          <el-button v-if="btnType != 'look'" type="success" :loading="btnLoading" @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button v-if="btnType != 'look'" type="primary" :loading="btnLoading" @click="handleConfirm('submit')">保存并提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
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
                      <el-form-item label="转换单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请输入转换单号" :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="仓库" prop="warehouseName">
                        <ComSelect-list :requestObj="{ type: 'normal',projectId:warehouseInfo.projectId }" :dialogTitle="'选择仓库'" v-model="dataForm.warehouseName" :warehouseId="dataForm.warehouseId" :isdisabled="btnType === 'look'" :method="getWarehouseList" placeholder="请选择仓库" @change="changeWarehouse" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2" maxlength="200" />
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
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table class="TableForm table" ref="product" :data="dataFormTwo.data" v-bind="dataFormTwo.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData" border>
                    <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType != 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                    <el-table-column prop="productDrawingNo" label="原品名规格" width="200" show-overflow-tooltip key="productDrawingNo" />
                    <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                    <el-table-column prop="shelfSpaceName" label="原库位" width="260" show-overflow-tooltip key="shelfSpaceName" />
                    <el-table-column prop="originBatchNumber" label="原批次号" width="230" show-overflow-tooltip key="originBatchNumber" />
                    <el-table-column prop="originSealingCoverTyping" label="原打字内容" width="230" show-overflow-tooltip key="originSealingCoverTyping" />
                <el-table-column prop="originAccuracyLevel" label="原精度等级" width="140" show-overflow-tooltip key="originAccuracyLevel" />
                <el-table-column prop="originVibrationLevel" label="原振动等级" width="140" show-overflow-tooltip key="originVibrationLevel" />
                <el-table-column prop="originClearance" label="原游隙" width="160" show-overflow-tooltip key="originClearance" />
                <el-table-column prop="originOil" label="原油脂" width="160" show-overflow-tooltip key="originOil" />
                <el-table-column prop="originStandardValue" label="原规值(钢球属性)" width="160" show-overflow-tooltip key="originStandardValue" />
                <el-table-column prop="originPackagingMethod" label="原包装方式" width="160" show-overflow-tooltip key="originPackagingMethod" />
                <el-table-column prop="originColour" label="原颜色" width="140" show-overflow-tooltip key="originColour" />
                <el-table-column prop="originPairingModeName" label="原配对方式" width="160" show-overflow-tooltip key="originPairingModeName" />
                <el-table-column prop="originSpecialRequire" label="原特殊要求" width="200" show-overflow-tooltip key="originSpecialRequire" />
                <el-table-column prop="originAperture" label="原孔径" width="140" show-overflow-tooltip key="originAperture" />
                <el-table-column prop="originSpecSize" label="原规格/尺寸" width="140" show-overflow-tooltip key="originSpecSize" />
                <el-table-column prop="originLogo" label="原logo" width="160" show-overflow-tooltip key="originLogo" />
                <el-table-column prop="originDivideEqually" label="原开等分" width="160" show-overflow-tooltip key="originDivideEqually" />
                <el-table-column prop="originMaterial" label="原材质" width="180" show-overflow-tooltip key="originMaterial" />
                <el-table-column prop="originProtrusion" label="原凸出量" width="160" show-overflow-tooltip key="originProtrusion" />
                <el-table-column prop="originPreload" label="原预负荷" width="160" show-overflow-tooltip key="originPreload" />
                    <el-table-column prop="availableQuantity" label="原批次数量" width="120" show-overflow-tooltip v-if="btnType !== 'look'" key="availableQuantity" />
                    <!-- <el-table-column prop="availableQuantity" label="可用库存数量" width="170" show-overflow-tooltip
                  v-if="btnType != 'look'" key="3"></el-table-column> -->

                    <!-- <el-table-column prop="originBoxBarcode" label="原箱条码" width="220" key="originBoxBarcode">
                      <template slot="header">
                        <span class="required">*</span>原箱条码
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'originBoxBarcode'" :rules='productRules.originBoxBarcode'>
                          <ComSelect-page :placeholder="'请选择原箱条码'" :value="scope.row.originBoxBarcode" :dialogTitle="'选择条码'" @change="addth" :tableItems="barCodeTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="dataRequestObj[scope.$index]" :isdisabled="btnType === 'look'" :paramsObj="{ scope }" :searchList="barCodeSearchList" :elementShow="true" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="originRealityTotalNum" label="原箱数量" width="120" v-if="btnType !== 'look'" key="originRealityTotalNum" /> -->
                    <el-table-column prop="mainUnit" label="单位" width="110" show-overflow-tooltip key="mainUnit" />
                    <el-table-column prop="num" label="转换数量" width="170" key="num">
                      <template slot="header">
                        <span class="required">*</span>转换数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                          <el-input v-model="scope.row.num" :disabled="scope.row.targetBoxBarcode === '整箱转换' || btnType === 'look'" maxlength="11" placeholder="请输入转换数量" style="width: 145px;">{{
                          scope.row.num }}
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="targetProductDrawingNo" label="目标品名规格" width="260" key="targetProductDrawingNo">
                      <template slot="header">
                        <span class="required">*</span>目标品名规格
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'targetProductDrawingNo'" :rules='productRules.targetProductDrawingNo'>
                          <ComSelect-page v-model="scope.row.targetProductDrawingNo" @change="submitCustomerProduct1" :tableItems="targetProductTableItems" dialogTitle="选择产品" treeTitle="产品分类" :methodArr="productMethodArr" :listMethod="getProductList" :listRequestObj="targetProductListQueryObj" :searchList="productTableSearchList" placeholder="请选择目标产品" :paramsObj="{ scope }" :isdisabled="btnType === 'look'" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="targetProcessName" label="目标工序名称" width="230" show-overflow-tooltip key="targetProcessName" /> -->
                    <el-table-column prop="targetSealingCoverTyping" label="目标打字内容" width="230" key="targetSealingCoverTyping">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetSealingCoverTyping" :disabled="btnType === 'look'" placeholder="请输入目标打字内容">{{ scope.row.targetSealingCoverTyping }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetAccuracyLevel" label="目标精度等级" width="140" key="targetAccuracyLevel">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetAccuracyLevel" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetAccuracyLevel }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetVibrationLevel" label="目标振动等级" width="140" key="targetVibrationLevel">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetVibrationLevel" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetVibrationLevel }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetClearance" label="目标游隙" width="160" key="targetClearance">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetClearance" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetClearance }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetOil" label="目标油脂" width="160" key="targetOil">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetOil" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetOil }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetStandardValue" label="目标规值(钢球属性)" width="200" key="targetStandardValue">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetStandardValue" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetStandardValue }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetPackagingMethod" label="目标包装方式" width="200" key="targetPackagingMethod">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetPackagingMethod" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetPackagingMethod }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetColour" label="目标颜色" width="140" key="targetColour">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetColour" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetColour }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetPairingModeId" label="目标配对方式" width="160">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.targetPairingModeId" placeholder="请选择" style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false"
                            @change="(value) => changePairingMode(value, scope)">
                            <el-option v-for="item in pairingModeList" size="small" :key="item.id" :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                <el-table-column prop="targetSpecialRequire" label="目标特殊要求" width="200" key="targetSpecialRequire">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetSpecialRequire" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetSpecialRequire }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetAperture" label="目标孔径" width="140" key="targetAperture">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetAperture" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetAperture }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetSpecSize" label="目标规格/尺寸" width="160" key="targetSpecSize">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetSpecSize" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetSpecSize }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetLogo" label="目标logo" width="160" key="targetLogo">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetLogo" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetLogo }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetDivideEqually" label="目标开等分" width="160" key="targetDivideEqually">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetDivideEqually" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetDivideEqually }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetMaterial" label="目标材质" width="180" key="targetMaterial">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetMaterial" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetMaterial }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetProtrusion" label="目标凸出量" width="160" key="targetProtrusion">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetProtrusion" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetProtrusion }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetPreload" label="目标预负荷" width="160" key="targetPreload">
                  <template slot-scope="scope">
                    <el-form-item>
                      <el-input v-model="scope.row.targetPreload" :disabled="btnType === 'look'" placeholder="请输入">{{ scope.row.targetPreload }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                    <el-table-column prop="targetNum" label="转换目标数量" width="170" key="targetNum">
                      <template slot="header">
                        <span class="required">*</span>转换目标数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'targetNum'" :rules='productRules.targetNum'>
                          <el-input v-model="scope.row.targetNum" :disabled="btnType === 'look'" maxlength="11" placeholder="请输入转换目标数量">{{ scope.row.targetNum }}
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="targetShelfSpaceId" label="目标库位" width="260" key="targetShelfSpaceId">
                      <template slot="header">
                        <span class="required">*</span>目标库位
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'targetShelfSpaceName'" :rules='productRules.targetShelfSpaceName'>
                          <ComSelect-list :requestObj="shelfSpaceRequestObj" :dialogTitle="'选择目标库位'" placeholder="请选择目标库位" v-model="scope.row.targetShelfSpaceName" :beforeSubmit="beforeSubmitPartner" :isdisabled="btnType === 'look' || !dataForm.warehouseName" :method="stockDisassemblykw" :paramsObj="{ scope }" @change="changeWarehousekwmb"></ComSelect-list>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="targetBatchNumber" label="目标产品批次号" width="230" key="targetBatchNumber">
                      <template slot="header">
                        <span class="required">*</span>目标产品批次号
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'targetBatchNumber'" :rules='productRules.targetBatchNumber'>
                          <el-select v-model="scope.row.targetBatchNumber" filterable remote reserve-keyword placeholder="请选择目标产品批次号" style="width:100%" clearable :disabled="btnType == 'look'" :remote-method="remoteMethod" :loading="loading" @focus="action">
                            <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="targetBoxBarcode" label="目标箱条码" width="220" key="targetBoxBarcode">
                      <template slot="header">
                        <span class="required">*</span>目标箱条码
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'targetBoxBarcode'" :rules='productRules.targetBoxBarcode'>
                          <ComSelect-page :listDataFormatting="listDataFormatting" :placeholder="'请选择目标箱条码'" :isdisabled="!scope.row.targetShelfSpaceId || btnType == 'look'" :value="scope.row.targetBoxBarcode" :dialogTitle="'选择条码'" @change="targetBox" :tableItems="barCodeTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="barCodeRequestObjList[scope.$index]" :paramsObj="{ scope }" :searchList="barCodeSearchList" />
                        </el-form-item>
                      </template>
                    </el-table-column> -->
                    <!-- <el-table-column prop="targetRealityTotalNum" label="目标箱数量" width="120" v-if="btnType !== 'look'" key="targetRealityTotalNum" /> -->
                    <el-table-column prop="targetProductsMainUnit" label="单位" width="110" show-overflow-tooltip key="targetProductsMainUnit" />
                    <el-table-column prop="remark" label="备注" min-width="230" key="remark">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="66">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
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
                  <el-form-item label="转换单号" prop="orderNo">
                    <el-input v-model="dataForm.orderNo" placeholder="请输入转换单号" :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="仓库" prop="warehouseName">
                    <ComSelect-list :requestObj="{ type: 'normal' }" :dialogTitle="'选择仓库'" v-model="dataForm.warehouseName" :warehouseId="dataForm.warehouseId" :isdisabled="btnType === 'look'" :method="getWarehouseList" placeholder="请选择仓库" @change="changeWarehouse" />
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2" maxlength="200" />
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
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table class="TableForm table" ref="product" :data="dataFormTwo.data" v-bind="dataFormTwo.data" hasC hasNO fixedNO @selection-change="handeleProductInfoData" border>
                <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType != 'look'" key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                <el-table-column prop="productDrawingNo" label="原品名规格" width="200" show-overflow-tooltip key="productDrawingNo" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                <el-table-column prop="shelfSpaceName" label="原库位" width="260" show-overflow-tooltip key="shelfSpaceName" />
                <el-table-column prop="originBatchNumber" label="原批次号" width="230" show-overflow-tooltip key="originBatchNumber" />
                <el-table-column prop="originSealingCoverTyping" label="原打字内容" width="230" show-overflow-tooltip key="originSealingCoverTyping" />
                <el-table-column prop="originAccuracyLevel" label="原精度等级" width="140" show-overflow-tooltip key="originAccuracyLevel" />
                <el-table-column prop="originVibrationLevel" label="原振动等级" width="140" show-overflow-tooltip key="originVibrationLevel" />
                <el-table-column prop="originClearance" label="原游隙" width="160" show-overflow-tooltip key="originClearance" />
                <el-table-column prop="originOil" label="原油脂" width="160" show-overflow-tooltip key="originOil" />
                <el-table-column prop="originStandardValue" label="原规值(钢球属性)" width="160" show-overflow-tooltip key="originStandardValue" />
                <el-table-column prop="originPackagingMethod" label="原包装方式" width="160" show-overflow-tooltip key="originPackagingMethod" />
                <el-table-column prop="originColour" label="原颜色" width="140" show-overflow-tooltip key="originColour" />
                <el-table-column prop="originPairingModeName" label="原配对方式" width="160" show-overflow-tooltip key="originPairingModeName" />
                <el-table-column prop="originSpecialRequire" label="原特殊要求" width="200" show-overflow-tooltip key="originSpecialRequire" />
                <el-table-column prop="originAperture" label="原孔径" width="140" show-overflow-tooltip key="originAperture" />
                <el-table-column prop="originSpecSize" label="原规格/尺寸" width="140" show-overflow-tooltip key="originSpecSize" />
                <el-table-column prop="originLogo" label="原logo" width="160" show-overflow-tooltip key="originLogo" />
                <el-table-column prop="originDivideEqually" label="原开等分" width="160" show-overflow-tooltip key="originDivideEqually" />
                <el-table-column prop="originMaterial" label="原材质" width="180" show-overflow-tooltip key="originMaterial" />
                <el-table-column prop="originProtrusion" label="原凸出量" width="160" show-overflow-tooltip key="originProtrusion" />
                <el-table-column prop="originPreload" label="原预负荷" width="160" show-overflow-tooltip key="originPreload" />

                <el-table-column prop="availableQuantity" label="原批次数量" width="120" show-overflow-tooltip v-if="btnType !== 'look'" key="availableQuantity" />
                <!-- <el-table-column prop="availableQuantity" label="可用库存数量" width="170" show-overflow-tooltip
                  v-if="btnType != 'look'" key="3"></el-table-column> -->

                <!-- <el-table-column prop="originBoxBarcode" label="原箱条码" width="220" key="originBoxBarcode">
                      <template slot="header">
                        <span class="required">*</span>原箱条码
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'originBoxBarcode'" :rules='productRules.originBoxBarcode'>
                          <ComSelect-page :placeholder="'请选择原箱条码'" :value="scope.row.originBoxBarcode" :dialogTitle="'选择条码'" @change="addth" :tableItems="barCodeTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="dataRequestObj[scope.$index]" :isdisabled="btnType === 'look'" :paramsObj="{ scope }" :searchList="barCodeSearchList" :elementShow="true" />
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="originRealityTotalNum" label="原箱数量" width="120" v-if="btnType !== 'look'" key="originRealityTotalNum" /> -->
                <el-table-column prop="mainUnit" label="单位" width="110" show-overflow-tooltip key="mainUnit" />
                <el-table-column prop="num" label="转换数量" width="170" key="num">
                  <template slot="header">
                    <span class="required">*</span>转换数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                      <el-input v-model="scope.row.num" :disabled="scope.row.targetBoxBarcode === '整箱转换' || btnType === 'look'" maxlength="11" placeholder="请输入转换数量" style="width: 145px;">{{
                          scope.row.num }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetProductDrawingNo" label="目标品名规格" width="260" key="targetProductDrawingNo">
                  <template slot="header">
                    <span class="required">*</span>目标品名规格
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'targetProductDrawingNo'" :rules='productRules.targetProductDrawingNo'>
                      <ComSelect-page v-model="scope.row.targetProductDrawingNo" @change="submitCustomerProduct1" :tableItems="targetProductTableItems" dialogTitle="选择产品" treeTitle="产品分类" :methodArr="productMethodArr" :listMethod="getProductList" :listRequestObj="targetProductListQueryObj" :searchList="productTableSearchList" placeholder="请选择目标产品" :paramsObj="{ scope }" :isdisabled="btnType === 'look'" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetSealingCoverTyping" label="目标打字内容" width="230" show-overflow-tooltip key="targetSealingCoverTyping" />
                <el-table-column prop="targetAccuracyLevel" label="目标精度等级" width="140" show-overflow-tooltip key="targetAccuracyLevel" />
                <el-table-column prop="targetVibrationLevel" label="目标振动等级" width="140" show-overflow-tooltip key="targetVibrationLevel" />
                <el-table-column prop="targetClearance" label="目标游隙" width="160" show-overflow-tooltip key="targetClearance" />
                <el-table-column prop="targetOil" label="目标油脂" width="160" show-overflow-tooltip key="targetOil" />
                <el-table-column prop="targetStandardValue" label="目标规值(钢球属性)" width="160" show-overflow-tooltip key="targetStandardValue" />
                <el-table-column prop="targetPackagingMethod" label="目标包装方式" width="160" show-overflow-tooltip key="targetPackagingMethod" />
                <el-table-column prop="targetColour" label="目标颜色" width="140" show-overflow-tooltip key="targetColour" />
                <el-table-column prop="targetPairingModeName" label="目标配对方式" width="160" show-overflow-tooltip key="targetPairingModeName" />
                <el-table-column prop="targetSpecialRequire" label="目标特殊要求" width="200" show-overflow-tooltip key="targetSpecialRequire" />
                <el-table-column prop="targetAperture" label="目标孔径" width="140" show-overflow-tooltip key="targetAperture" />
                <el-table-column prop="targetSpecSize" label="目标规格/尺寸" width="140" show-overflow-tooltip key="targetSpecSize" />
                <el-table-column prop="targetLogo" label="目标logo" width="160" show-overflow-tooltip key="targetLogo" />
                <el-table-column prop="targetDivideEqually" label="目标开等分" width="160" show-overflow-tooltip key="targetDivideEqually" />
                <el-table-column prop="targetMaterial" label="目标材质" width="180" show-overflow-tooltip key="targetMaterial" />
                <el-table-column prop="targetProtrusion" label="目标凸出量" width="160" show-overflow-tooltip key="targetProtrusion" />
                <el-table-column prop="targetPreload" label="目标预负荷" width="160" show-overflow-tooltip key="targetPreload" />
                <el-table-column prop="targetNum" label="转换目标数量" width="170" key="targetNum">
                  <template slot="header">
                    <span class="required">*</span>转换目标数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'targetNum'" :rules='productRules.targetNum'>
                      <el-input v-model="scope.row.targetNum" :disabled="btnType === 'look'" maxlength="11" placeholder="请输入转换目标数量">{{ scope.row.targetNum }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetShelfSpaceId" label="目标库位" width="260" key="targetShelfSpaceId">
                  <template slot="header">
                    <span class="required">*</span>目标库位
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'targetShelfSpaceName'" :rules='productRules.targetShelfSpaceName'>
                      <ComSelect-list :requestObj="shelfSpaceRequestObj" :dialogTitle="'选择目标库位'" placeholder="请选择目标库位" v-model="scope.row.targetShelfSpaceName" :beforeSubmit="beforeSubmitPartner" :isdisabled="btnType === 'look' || !dataForm.warehouseName" :method="stockDisassemblykw" :paramsObj="{ scope }" @change="changeWarehousekwmb"></ComSelect-list>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="targetBatchNumber" label="目标产品批次号" width="230" key="targetBatchNumber">
                  <template slot="header">
                    <span class="required">*</span>目标产品批次号
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'data.' + scope.$index + '.' + 'targetBatchNumber'" :rules='productRules.targetBatchNumber'>
                      <el-select v-model="scope.row.targetBatchNumber" filterable remote reserve-keyword placeholder="请选择目标产品批次号" style="width:100%" clearable :disabled="btnType == 'look'" :remote-method="remoteMethod" :loading="loading" @focus="action">
                        <el-option v-for="item in options" :key="item.value" :label="item.value" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="targetBoxBarcode" label="目标箱条码" width="220" key="targetBoxBarcode">
                      <template slot="header">
                        <span class="required">*</span>目标箱条码
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'targetBoxBarcode'" :rules='productRules.targetBoxBarcode'>
                          <ComSelect-page :listDataFormatting="listDataFormatting" :placeholder="'请选择目标箱条码'" :isdisabled="!scope.row.targetShelfSpaceId || btnType == 'look'" :value="scope.row.targetBoxBarcode" :dialogTitle="'选择条码'" @change="targetBox" :tableItems="barCodeTableItems" :renderTree="false" :listMethod="TransferBarCode" :listRequestObj="barCodeRequestObjList[scope.$index]" :paramsObj="{ scope }" :searchList="barCodeSearchList" />
                        </el-form-item>
                      </template>
                    </el-table-column> -->
                <!-- <el-table-column prop="targetRealityTotalNum" label="目标箱数量" width="120" v-if="btnType !== 'look'" key="targetRealityTotalNum" /> -->
                <el-table-column prop="targetProductsMainUnit" label="单位" width="110" show-overflow-tooltip key="targetProductsMainUnit" />
                <el-table-column prop="remark" label="备注" min-width="230" key="remark">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="btnType == 'look' ? true : false" maxlength="200" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="66">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!-- 选择产品 -->
      <ComSelect-page ref="ComSelect-page" @change="submitAllProduct" :renderTree="false" :tableItems="productTableItems" dialogTitle="选择产品" :listMethod="getBatchNumber" :listRequestObj="productRequestObj" :searchList="productTableSearchList" :elementShow="false" multiple />

    </div>
  </transition>
</template>

<script>
import getProjectList from '@/mixins/generator/getProjectList'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import flowMixin from '@/mixins/generator/flowMixin'
import { addTransferData, updateTransferData, detailTransferData, TransferBarCode } from '@/api/warehouseManagement/transferManagement'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { InventorymodalShiftdata, updateInventorymodalShift, detaInventorymodalShiftData } from '@/api/warehouseManagement/modalShift'
import { stockDisassemblykw } from '@/api/warehouseManagement/productlistChange'
import { inventorySpaceList } from '@/api/warehouseManagement/inventory'
import { getWarehouseList } from '@/api/basicData/index'// 仓库树
import { getProductionLotList, getBatchNumber } from '@/api/basicData/index'
export default {
  mixins: [busFlow, flowMixin, getProjectList],
  components: { Process, recordList },
  data() {
    return {
      isProjectSwitch: '',
      warehouseInfo: {},
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      codeConfig: {},//单据规则配置
      getProductList,
      activeNames: ["basicInfo", "cpInfo"],
      TransferBarCode,
      getBatchNumber,
      getWarehouseList,
      stockDisassemblykw,

      dataForm: {
        orderNo: '',
        id: '',
        approvalFlag: false,
        remark: '',
        warehouseId: '',
        warehouseName: ''
      },
      dataFormTwo: {
        data: []
      },
      pairingModeList:[],
      options: [],      //批次号
      loading: false,
      btnType: undefined,
      activeName: "orderInfo",
      visible: false,
      btnLoading: false,
      formLoading: false,
      selectRows: [],
      dataRequestObj: [],
      dataRule: {
        orderNo: [
          { required: true, message: "转换单号不能为空", trigger: "blur" },
        ],
        warehouseName: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ]
      },
      productRules: {
        targetBatchNumber: [{ required: true, trigger: 'change' }],
        targetShelfSpaceName: [{ required: true, trigger: 'change' }],
        targetProductDrawingNo: [{ required: true, trigger: 'change' }],
        originBoxBarcode: [{ required: true, trigger: 'change' }],
        targetBoxBarcode: [{ required: true, trigger: 'change' }],
        num: [
          { required: true, trigger: 'change' },
          { validator: this.formValidate('noZero', '不能为0', (errMsg) => { this.$message.error('转换数量：' + errMsg) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => Number(this.dataFormTwo.data[rowIndex].num) <= Number(this.dataFormTwo.data[rowIndex].availableQuantity), "不能超过对应源产品批次数量", (errMsg) => { this.$message.error('转换数量：' + errMsg) }] }), trigger: 'blur' },
          // { validator: this.formValidate({ type: 'calc', params: [(rowIndex, value) => Number(this.dataFormTwo.data[rowIndex].num) <= Number(this.dataFormTwo.data[rowIndex].originRealityTotalNum), "不能超过对应原箱数量", (errMsg) => { this.$message.error('转换数量：' + errMsg) }] }), trigger: 'blur' }
        ],
        targetNum: [
          { required: true, trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, "", (errMsg) => { this.$message.error('数量：' + errMsg) }] }), trigger: 'blur' }
        ]
      },

      // 添加产品组件相关参数
      productMethodArr: [ // &
        { label: "产品分类", type: "material", method: getcategoryTree, requestObj: { type: "material" } },
      ],
      productTableSearchList: [ // &
        { prop: "productCode", label: "产品编码", type: "input" },
        // { prop: "name", label: "产品名称", type: "input" },
        { prop: "productDrawingNo", label: "品名规格", type: 'input' }
      ],
      productRequestObj: { // 明细
        accuracyLevel: "",
        availableStock: true,
        excludeProcessFlag:1,
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
      productTableItems: [ // 明细
        { prop: 'productDrawingNo', label: '品名规格', minWidth: 120 },
        { prop: 'productCode', label: '产品编码', fixed: 'left', minWidth: 160 },
        { prop: 'shelfSpaceName', label: '库位', minWidth: 120 },
        { prop: 'availableQuantity', label: '当前库存', minWidth: 120 },
        { prop: 'mainUnit', label: '单位', minWidth: 120 },
        { prop: 'batchNumber', label: '批次号', minWidth: 180 },
      ],
      targetProductListQueryObj: { // 目标产品
        productDrawingNo: "",
        productCategoryId: "",
        productCode: "",
        name: "",
        queryType: 1,
        classAttributeList: ["raw_material", "accessories", "semi_finished", "finish_product"],
        classAttribute: "",
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
      targetProductTableItems: [ // 目标产品
        { prop: "code", label: "产品编码", fixed: "left" },
        { prop: "drawingNo", label: "品名规格" },
        { prop: "productCategoryName", label: "产品分类" },
        { prop: "mainUnit", label: "单位" },
      ],

      // 条码选择组件相关参数
      barCodeRequestObjList: [],
      barCodeTableItems: [
        { prop: 'barCode', label: '条码', minWidth: 200 },
        { prop: 'realityTotalNum', label: '实际数量', minWidth: 120 },
      ],
      barCodeSearchList: [{ prop: 'barcode', label: '条码', type: 'input', },],


      // 选择批次号
      batchNumerRequestObj: {
        keyword: "",
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
      // 选择目标库位
      shelfSpaceRequestObj: {
        orderItems: [{
          "asc": true,
          "column": ""
        }],
        pageNum: 1,
        pageSize: -1,
        warehouseId: '',
        locationType: 'goods_allocation'
      },
    }
  },
  async created() {
    await this.getpairingModeListFun()
    await this.getProjectSwitch('system', 'project')
  },
  mounted() {
    this.calcHeight()
  },
  methods: {
    // 获取配对方式
    async getpairingModeListFun() {
      try {
        this.pairingModeList = await this.jnpf.getpairingModeListFun()
      } catch (error) { }
    },
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
    // 选择原箱条码
    addth(id, data, paramsObj) {
      let index = paramsObj.scope.$index
      let targetIndex = this.dataFormTwo.data.findIndex(line => line.originBoxBarcode === data[0].all.barCode)
      if (targetIndex !== -1 && index !== targetIndex) return this.$message.error(`这个条码已经用在产品信息第${targetIndex + 1}行`)
      this.$nextTick(() => { this.$refs.productForm.validateField('data.' + index + '.' + 'originBoxBarcode') })
      if (!data || !data.length) {
        this.dataFormTwo.data[index].originBoxBarcode = ""
        this.dataFormTwo.data[index].originRealityTotalNum = ""
      } else {
        if (this.dataFormTwo.data[index].targetBoxBarcode == '整箱转换') {
          this.dataFormTwo.data[index].originBoxBarcode = data[0].all.barCode
          this.dataFormTwo.data[index].originRealityTotalNum = data[0].all.realityTotalNum
          this.dataFormTwo.data[index].num = this.dataFormTwo.data[index].originRealityTotalNum
        } else {
          this.dataFormTwo.data[index].originBoxBarcode = data[0].all.barCode
          this.dataFormTwo.data[index].originRealityTotalNum = data[0].all.realityTotalNum
        }
      }
    },
    // 选择目标箱条码
    targetBox(id, data, paramsObj) {
      this.$nextTick(() => { this.$refs.productForm.validateField('data.' + index + '.' + 'targetBoxBarcode') })
      let index = paramsObj.scope.$index
      if (!data || !data.length) {
        this.dataFormTwo.data[index].targetBoxBarcode = ""
        this.dataFormTwo.data[index].targetRealityTotalNum = ""
      } else {
        this.dataFormTwo.data[index].targetBoxBarcode = data[0].all.barCode
        this.dataFormTwo.data[index].targetRealityTotalNum = data[0].all.realityTotalNum ? data[0].all.realityTotalNum : 0
        if (this.dataFormTwo.data[index].originRealityTotalNum && data[0].all.barCode === '整箱转换') {
          this.dataFormTwo.data[index].num = this.dataFormTwo.data[index].originRealityTotalNum
        }
      }
    },
    listDataFormatting(res) {
      let data = { barCode: '整箱转换', realityTotalNum: '' }
      let treeData = res.data
      treeData.unshift(data)
      return treeData
    },
    //输入批次号
    action() {
      this.options = []
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.batchNumerRequestObj.keyword = query
        this.options = []
        setTimeout(() => {
          getProductionLotList(this.batchNumerRequestObj).then(res => {
            this.loading = false;
            res.data.records.forEach((item) => {
              item.value = item.batchNumber
              this.options.push(item)
            })
          }).catch(() => {
            this.loading = false;
          })
        }, 200);
      } else {
        this.options = [];
      }
    },
    //选择仓库
    changeWarehouse(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('warehouseName') })
      if (!val && !data.length) {
        this.dataFormTwo.data = []
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.shelfSpaceRequestObj.warehouseId = ''
        this.productRequestObj.warehouseId = ''
        return
      }
      this.dataFormTwo.data = []
      this.dataForm.warehouseId = data[0].id
      this.dataForm.warehouseName = data[0].name
      this.shelfSpaceRequestObj.warehouseId = data[0].id
      this.productRequestObj.warehouseId = data[0].id
    },
    async beforeSubmitPartner(val, data, paramsObj) {
      let index = paramsObj.scope.$index
      if (!val && data.length) return true // 忽略处理自动回显的数据
      if (!this.dataFormTwo.data[index].targetShelfSpaceName || !this.dataFormTwo.data[index].targetBoxBarcode) return true // 如果判断条件真，直接提交，不弹出提示
      let flag = await this.$confirm('此操作将清空目标箱条码', '提示', { type: 'warning' }).catch(err => false)
      return flag
    },
    //目标库位选择
    changeWarehousekwmb(val, data, params) {
      this.$nextTick(() => {
        this.$refs.productForm.validateField('data.' + index + '.' + 'targetShelfSpaceName')
      })
      if (!val && data.length) return
      let index = params.scope.$index
      this.dataFormTwo.data[index].targetBoxBarcode = ""
      this.dataFormTwo.data[index].targetRealityTotalNum = ""
      if (data[0].all.parentId == -1) {
        this.dataFormTwo.data[index].goodsShelvesId = null
      } else {
        this.dataFormTwo.data[index].goodsShelvesId = data[0].all.parentId
        this.dataFormTwo.data[index].targetGoodsShelvesId = data[0].all.parentId
      }
      this.dataFormTwo.data[index].targetShelfSpaceId = data[0].id
      this.dataFormTwo.data[index].targetShelfSpaceName = data[0].name
      this.barCodeRequestObjList = []
      this.dataFormTwo.data.forEach(item => {
        this.barCodeRequestObjList.push({
          removeShelfSpaceId: item.targetShelfSpaceId,
          isTarget: true,
          productsId: '',
          routingLineId: '',
          barcode: ''
        })
      })
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
      this.$emit('close')
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) return this.$message.error('请选择要删除的产品')

      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.data.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.data.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
      this.dataRequestObj = []
      this.dataFormTwo.data.forEach(item => {
        this.dataRequestObj.push({
          removeShelfSpaceId: item.shelfSpaceId,
          isTarget: false,
          productsId: item.originProductsId,
          routingLineId: '',
          barcode: ''
        })
      })
      this.barCodeRequestObjList = []
      this.dataFormTwo.data.forEach(item => {
        this.barCodeRequestObjList.push({
          removeShelfSpaceId: item.targetShelfSpaceId,
          isTarget: true,
          productsId: '',
          routingLineId: '',
          barcode: ''
        })
      })
    },
    // 单个删除
    handleDel(data) {
      this.dataFormTwo.data.splice(data.$index, 1)
      this.dataRequestObj = []
      this.dataFormTwo.data.forEach(item => {
        this.dataRequestObj.push({
          removeShelfSpaceId: item.shelfSpaceId,
          isTarget: false,
          productsId: item.originProductsId,
          routingLineId: '',
          barcode: ''
        })
      })
      this.barCodeRequestObjList = []
      this.dataFormTwo.data.forEach(item => {
        this.barCodeRequestObjList.push({
          removeShelfSpaceId: item.targetShelfSpaceId,
          isTarget: true,
          productsId: '',
          routingLineId: '',
          barcode: ''
        })
      })
    },
    // 目标产品提交
    submitCustomerProduct1(val, data, paramsObj) {
      let index = paramsObj.scope.$index
      this.$nextTick(() => { this.$refs.productForm.validateField('data.' + index + '.' + 'targetProductDrawingNo') })
      this.$set(this.dataFormTwo.data[index], 'targetProductDrawingNo', data[0].all.drawingNo)
      this.$set(this.dataFormTwo.data[index], 'targetProductsId', data[0].all.id)
      this.$set(this.dataFormTwo.data[index], 'targetProductsCode', data[0].all.code)
      this.$set(this.dataFormTwo.data[index], 'targetProductsMainUnit', data[0].all.mainUnit)
    },
    //选择库存产品
    openSeleceProductDialogtes() {
      if (this.dataForm.warehouseId) {
        console.log(this.$refs);
        this.$refs['ComSelect-page'].openDialog()
      } else {
        this.$message.error('请先选择仓库')
      }
    },
    // 添加产品
    submitAllProduct(val, data, paramsObj) {
      data = data.map(item => item.all)
      let tempList = JSON.parse(JSON.stringify(this.dataFormTwo.data))
      let hasItemList = []
      for (let i = 0; i < data.length; i++) {
        let item = {
          originSealingCoverTyping: data[i].sealingCoverTyping,
          originAccuracyLevel: data[i].accuracyLevel,
          originVibrationLevel: data[i].vibrationLevel,
          originClearance: data[i].clearance,
          originOil: data[i].oil,
          originStandardValue: data[i].standardValue,
          originPackagingMethod: data[i].packagingMethod,
          originColour: data[i].colour,
          originPairingModeName: data[i].pairingModeName,
          originPairingModeId: data[i].pairingModeId,
          originSpecialRequire: data[i].specialRequire,
          originAperture: data[i].aperture,
          originSpecSize: data[i].specSize,
          originLogo: data[i].logo,
          originDivideEqually: data[i].divideEqually,
          originMaterial: data[i].material,
          originProtrusion: data[i].protrusion,
          originPreload: data[i].preload,

          originProductsId: data[i].productsId,
          productCode: data[i].productCode,
          productName: data[i].name,
          productDrawingNo: data[i].productDrawingNo,
          mainUnit: data[i].mainUnit,
          deputyUnit: data[i].deputyUnit,
          calculationDirection: data[i].calculationDirection,
          ratio: data[i].ratio,
          availableQuantity: data[i].availableQuantity,
          originBatchNumber: data[i].batchNumber,
          num: '',
          targetNum: '',
          shelfSpaceId: data[i].shelfSpaceId,
          shelfSpaceName: data[i].shelfSpaceName,
          goodsShelvesId: data[i].goodsShelvesId,
          originBoxBarcode: '',
          originRealityTotalNum: '',
          targetBoxBarcode: '',
          targetRealityTotalNum: '',
        }

        // 找出this.linesList中与item 产品id、货位id、批次号 完全相同的项
        const hasFlag = this.dataFormTwo.data.some(i => {
          let flag = false
          if (i.originProductsId === item.originProductsId && i.shelfSpaceId === item.shelfSpaceId && i.originBatchNumber === item.originBatchNumber) { flag = true }
          return flag
        })
        if (hasFlag) { hasItemList.push(`${item.productDrawingNo} - ${item.shelfSpaceName} - ${item.originBatchNumber}`) }
        else { tempList.push(item) }
        if (hasItemList.length) this.$message.error(`已经存在的产品：${hasItemList.join('、')}`)
      }
      this.dataFormTwo.data = JSON.parse(JSON.stringify(tempList))

      this.dataRequestObj = this.dataFormTwo.data.map(item => {
        return {
          removeShelfSpaceId: item.shelfSpaceId,
          isTarget: false,
          productsId: item.originProductsId,
          routingLineId: '',
          barcode: ''
        }
      })
    },
    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(id, btnType, approvalFlag, obj) {
      this.approvalFlag = approvalFlag
      this.dataForm.id = id || ''
      this.btnType = btnType
      this.warehouseInfo = obj.warehouseInfo
      this.formLoading = true
      if (this.btnType === 'add' || this.btnType === 'edit') {
        this.getBusInfo('b064')
        this.fetchData('MSDH')
      }
      if (this.dataForm.id) {
        detaInventorymodalShiftData(this.dataForm.id).then(res => {
          this.dataForm = {
            ...res.data.shift,

          }
          this.dataFormTwo.data = res.data.shiftLineList
          this.productRequestObj.warehouseId = this.dataForm.warehouseId
          this.shelfSpaceRequestObj.warehouseId = this.dataForm.warehouseId

          this.dataRequestObj = [] // 明细数据
          this.barCodeRequestObjList = [] // 选择目标箱条码的入参列表

          this.dataFormTwo.data.forEach(item => {
            this.dataRequestObj.push({
              removeShelfSpaceId: item.shelfSpaceId,
              isTarget: false,
              productsId: item.originProductsId,
              routingLineId: '',
              barcode: ''
            })
            this.barCodeRequestObjList.push({
              removeShelfSpaceId: item.targetShelfSpaceId,
              isTarget: true,
              productsId: '',
              routingLineId: '',
              barcode: ''
            })
          })
          if (this.btnType == 'add') {
            this.dataForm.id = ''
          }
          if (this.btnType === 'look') {
            // 流程信息和流转记录
            if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
          }
          this.formLoading = false
        })
      } else {
        this.dataForm.warehouseId = this.warehouseInfo.id
        this.dataForm.warehouseName = this.warehouseInfo.name
        this.shelfSpaceRequestObj.warehouseId = this.warehouseInfo.id
        this.productRequestObj.warehouseId = this.warehouseInfo.id
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
        this.jnpf.focusErrValidItem(form_1.fields)
      }

      const form_2 = this.$refs.productForm
      const valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }

      if (!this.dataFormTwo.data.length && submitFlag) {
        this.$message.error('请选择产品')
        submitFlag = false
      }

      // 目标产品不能与原产品相同
      if (submitFlag) {
        let flag = this.dataFormTwo.data.some((line, index) => {
          if (line.originProductsId === line.targetProductsId) {
            this.$message.error(`产品信息第${index + 1}行：未对产品进行转换，请选择不同的目标产品`)
            submitFlag = false
            return true
          }
        })
      }

      // 库位相同，原箱条码不能与目标箱条码相同
      // if (submitFlag) {
      //   let flag = this.dataFormTwo.data.some((line, index) => {
      //     if (line.shelfSpaceId === line.targetShelfSpaceId && ((line.originBoxBarcode === line.targetBoxBarcode) || line.targetBoxBarcode === '整箱移')) {
      //       this.$message.error(`产品信息第${index + 1}行：库位相同，原箱条码不能与目标箱条码相同`)
      //       submitFlag = false
      //       return true
      //     }
      //   })
      // }

      if (submitFlag) {
        this.dataForm.documentStatus = value
        let formMethod = null;
        if (this.btnType == 'edit') {
          formMethod = updateInventorymodalShift
        } else if (this.btnType == 'add') {
          formMethod = InventorymodalShiftdata
        }
        let barCodeFlag = true
        let lines = JSON.parse(JSON.stringify(this.dataFormTwo.data))
        lines.forEach((item, index) => {
          if (item.targetBoxBarcode === '整箱转换') {
            item.targetBoxBarcode = item.originBoxBarcode
          }
        })
        let obj = {
          shift: this.dataForm,
          shiftLineList: lines,
          flowData: this.flowData
        }
        if (barCodeFlag) {
          formMethod(obj).then(res => {
            let msg = "";
            if (formMethod == InventorymodalShiftdata) {
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
        }
      } else {
        this.btnLoading = false
      }
    }
  }
}
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
