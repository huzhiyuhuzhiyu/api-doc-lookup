<template>
  <div class="JNPF-preview-main org-form">
    <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
      <div class="pageTitle">{{ btnType == 'look' ? '查看直接出入库单' : btnType == 'edit' ? '编辑直接出入库单' : '新建直接出入库单' }}</div>
      <div class="options">
        <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading"
          @click="handleConfirm('draft')">保存草稿</el-button>
        <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
          @click="handleConfirm('submit')">保存并提交</el-button>
        <el-button
          v-if="btnType !== 'look' && (dataForm.businessType == 'inbound_purchase' || dataForm.businessType == 'outbound_external_send' || dataForm.businessType == 'outbound_purchase')"
          type="primary" :loading="btnLoading" @click="handleConfirm('submit', 'print')">提交并打印</el-button>
        <el-button v-if="btnType == 'look' || btnType == 'edit'" @click="goBack">{{ $t('common.cancelButton')
          }}</el-button>
      </div>
    </div>
    <div class="contain">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
            :element-loading-text="loadingText">
            <el-tabs v-model="activeName">
              <el-tab-pane label="基本信息" name="orderInfo" class="orderInfo">
                <el-collapse v-model="activeNames">
                  <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px"
                      label-position="top">
                      <el-row :gutter="30" class="custom-row">
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="单号" prop="orderNo">
                            <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                              :disabled="JSON.stringify(codeConfig) == '{}' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                              maxlength="300" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="业务类型" prop="documentType">
                            <el-select v-model="dataForm.businessType" placeholder="业务类型" clearable style="width: 100%;"
                              :disabled="btnType == 'look'" filterable @change="selectDocutementType">
                              <el-option v-for="(item, index) in list" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" v-if="partnerFlag">
                          <el-form-item :label="partnerTitle" prop="cooperativePartnerIdText">
                            <ComSelect-page key="partner" ref="ComSelect-page"
                              v-model="dataForm.cooperativePartnerIdText" @change="partnerChange"
                              :tableItems="partnerTableItems" :dialogTitle="partnerDialogTitle"
                              :treeTitle="partnerTreeTitle" :placeholder="partnerPlaceholder"
                              :methodArr="getCooperativeMethodArr" :listMethod="getCooperativeData"
                              :listRequestObj="partnerRequestObj" :searchList="partnerSearchList"
                              :treeNodeClick="yxPartnerTreeNodeClick" :isdisabled="btnType === 'look'" />
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="仓库" prop="warehouseName">
                            <ComSelect-list
                              :requestObj="{ type: 'normal', state: 'enable', projectId: isProjectSwitch === '1' ? dataForm.projectId || '' : '' }"
                              :dialogTitle="'选择仓库'" :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName"
                              :method="getWarehouseList" placeholder="请选择仓库"
                              @change="changeWarehousex"></ComSelect-list>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24"
                          v-if="dataForm.businessType == 'outbound_pick_out' || dataForm.businessType == 'inbound_return_materials'">
                          <el-form-item :label="dataForm.businessType == 'outbound_pick_out' ? '领料人' : '退料人'"
                            prop="recipientBy">
                            <user-select v-model="dataForm.recipientBy"
                              :placeholder="dataForm.businessType == 'outbound_pick_out' ? '请选择领料人' : '请选择退料人'"
                              clearable style="width: 100%;" :disabled="btnType == 'look'" @change="hangleSelectSales">
                            </user-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24" v-if="dataForm.documentType == 'inbound'">
                          <el-form-item label="检验结果" prop="inspectionResults">
                            <el-select v-model="dataForm.inspectionResults" placeholder="请选择检验结果" style="width: 100%;"
                              :disabled="btnType == 'look'">
                              <el-option v-for="(item, index) in inspectionResultsList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <!-- v-if="dataForm.businessType == 'inbound_purchase' || dataForm.businessType == 'outbound_purchase' || dataForm.businessType == 'outbound_external_send' || dataForm.businessType == 'inbound_external'"> -->
                        <el-col :sm="6" :xs="24"
                          v-if="dataForm.businessType == 'inbound_purchase' || dataForm.businessType == 'outbound_purchase' || dataForm.businessType == 'outbound_external_send' || dataForm.businessType == 'inbound_external'">
                          <el-form-item label="是否显示比重折扣" prop="weightFlag">
                            <el-select v-model="dataForm.weightFlag" placeholder="是否显示比重折扣" style="width: 100%;"
                              :disabled="btnType == 'look' ? true : false">
                              <el-option v-for="(item, index) in weightFlagList" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="6" :xs="24">
                          <el-form-item label="单据日期" prop="orderDate">
                            <el-date-picker v-model="dataForm.orderDate" type="date" :clearable="false"
                              :disabled="btnType == 'look' ? true : false" value-format="yyyy-MM-dd"
                              style="width: 100%;" placeholder="请选择单据日期"></el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="12" :xs="24">
                          <el-form-item label="备注" prop="remark">
                            <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2"
                              :disabled="btnType == 'look'" maxlength="200" />
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </el-collapse-item>
                  <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                    <div v-if="btnType != 'look'">
                      <el-button type="text" style="margin-right:8px;font-size:14px!important"
                        :disabled="btnType == 'look' ? true : false" @click="scanFun()"><i
                          class="iconfont icon-saoma"></i>扫码录入</el-button>|
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                        @click="openSeleceProductDialog()">选择产品</el-button>|
                      <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                        :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                        @click="batchDelete">批量删除</el-button>
                    </div>
                    <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="btnType != 'look'"
                      @selection-change="handeleProductInfoData" border style="width: 100%;">
                      <el-table-column prop="productCode" label="产品编码" width="140" key="productCode" />
                      <el-table-column prop="productName" label="产品名称" min-width="160" key="productName"
                        v-if="productNameFlag == '1'" />
                      <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" key="productDrawingNo"
                        v-if="dataForm.documentType == 'outbound'" />
                      <el-table-column prop="drawingNo" label="品名规格" min-width="300" key="drawingNo"
                        v-if="dataForm.documentType == 'inbound'"> </el-table-column>
                      <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                      <el-table-column prop="batchNumber" label="批次号" width="200" key="batchNumber"
                        v-if="dataForm.documentType == 'outbound'">
                        <template slot="header">
                          <span class="required">*</span>批次号
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.batchNumber" readonly :disabled="btnType == 'look'"
                            @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                            {{ scope.row.batchNumber }}
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="inventoryQuantity" label="批次库存" width="200" key="inventoryQuantity"
                        v-if="dataForm.documentType == 'outbound' && btnType != 'look'">
                      </el-table-column>
                      <el-table-column prop="shelfSpaceName" label="库位" width="140" key="shelfSpaceName"
                        v-if="allocationFlag">
                        <template slot="header" v-if="dataForm.documentType == 'inbound'">
                          <span class="required">*</span>库位
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.shelfSpaceName" readonly :disabled="btnType == 'look'"
                            v-if="dataForm.documentType == 'inbound'"
                            @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="库位">
                          </el-input>
                          <div v-if="dataForm.documentType == 'outbound'"> {{ scope.row.shelfSpaceName }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="weight" label="重量(kg)" width="140" :key="737"
                        v-if="dataForm.weightFlag == true">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                            v-model="scope.row.weight" placeholder="重量"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="proportion" label="比重" width="140" :key="727"
                        v-if="dataForm.weightFlag == true">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                            v-model="scope.row.proportion" placeholder="比重"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="discount" label="折扣(0~1)" width="140" :key="717"
                        v-if="dataForm.weightFlag == true">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                            v-model="scope.row.discount" placeholder="折扣(0~1)"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
                      <el-table-column prop="num" :label="mainUnitFlag == 1 ? '数量(主)' : '数量'" min-width="160">
                        <template slot="header">
                          <span class="required">*</span>{{ mainUnitFlag == 1 ? '数量(主)' : '数量' }}
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.num" placeholder="数量" :disabled="btnType == 'look'"
                            @input="watchNum(scope.row, scope.$index)">
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
                      <el-table-column prop="deputyNum" label="数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
                      <!-- <el-table-column prop="mainUnit" label="单位" width="80" key="8" />
                      <el-table-column prop="num" label="数量" width="140" key="77">
                        <template slot="header">
                          <span class="required">*</span>数量
                        </template>
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'"
                            v-model="scope.row.num" placeholder="数量"></el-input>
                        </template>
                      </el-table-column> -->
                      <el-table-column prop="costPrice" label="单价(含税)" width="120" key="110">
                        <template slot="header">
                          <span class="required">*</span>单价(含税)
                        </template>
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.costPrice" :disabled="btnType == 'look' ? true : false"
                            @input="watchPrice(scope.row, scope.$index)" placeholder="请输入"
                            @blur="checkPrice(scope.row, scope.$index)">{{
                              scope.row.costPrice }}
                          </el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taxRate" label="税率" width="120" key="171">
                        <template slot="header">
                          <span class="required">*</span>税率(%)
                        </template>
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;"
                            :disabled="btnType == 'look'" @change="changeTaxRate(scope.row, scope.$index)">
                            <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                              :value="item.taxRate"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="taxAmount" label="税额" width="120" key="1721"></el-table-column>
                      <el-table-column prop="totalAmount" label="总金额(含税)" width="120" key="125"></el-table-column>
                      <el-table-column prop="originalBatchNumber" label="原批次号" width="140" key="1255"
                        v-if="dataForm.documentType == 'inbound'">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" v-model="scope.row.originalBatchNumber"
                            placeholder="原批次号"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="specSize" label="规格/尺寸" width="120" key="2115">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.specSize" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in scope.row.spaceSizeList" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="logo" label="Logo" width="120" key="2116">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.logo" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in scope.row.logoList" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="divideEqually" label="开等分" width="120" key="2117">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.divideEqually" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in scope.row.divideEquallyList" :key="index"
                              :label="item.name" :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="material" label="材质" width="120" key="2118">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.material" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in scope.row.materialList" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="standardValue" label="规值" width="120" key="211">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.standardValue" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="colour" label="颜色" width="120" key="210">
                        <!-- <template slot="header">
                            <span class="required">*</span>打字内容
                          </template> -->
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.colour" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list11" key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" key="2111">
                        <!-- <template slot="header">
                            <span class="required">*</span>打字内容
                          </template> -->
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable
                            :disabled="btnType == 'look'" style="width: 100%;">
                            <el-option v-for="(item, index) in list1" key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="accuracyLevel" label="精度等级" width="120" key="123">
                        <!-- <template slot="header">
                            <span class="required">*</span>精度等级
                          </template> -->
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list2" key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="vibrationLevel" label="振动等级" width="120" key="17">
                        <!-- <template slot="header">
                            <span class="required">*</span>振动等级
                          </template> -->
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable
                            :disabled="btnType == 'look'" style="width: 100%;">
                            <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="oil" label="油脂" width="120" key="61">
                        <!-- <template slot="header">
                            <span class="required">*</span>油脂
                          </template> -->
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="clearance" label="游隙" width="120" key="1055">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="aperture" label="孔径" width="120" key="106">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.aperture" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in list10" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="packagingMethod" label="包装方式" width="120" key="101">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable
                            :disabled="btnType == 'look'" style="width: 100%;">
                            <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="specialRequire" label="特殊要求" width="160" key="202">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable
                            :disabled="btnType == 'look'" style="width: 100%;">
                            <el-option v-for="(item, index) in list9" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="processName" label="工序" width="160" key="103">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.processId" placeholder="请选择" clearable style="width: 100%;"
                            :disabled="btnType == 'look'">
                            <el-option v-for="(item, index) in processList" :key="index" :label="item.name"
                              :value="item.id"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="remark" label="备注" width="200" key="128">
                        <template slot-scope="scope">
                          <el-input :disabled="btnType == 'look'" v-model="scope.row.remark"
                            placeholder="备注"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" fixed="right" width="100"
                        v-if="productData.length && btnType != 'look'">
                        <template slot-scope="scope">
                          <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                        </template>
                      </el-table-column>
                    </JNPF-table>
                    <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
                      <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ totalAmount }}</span>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="流程信息" name="approvalFlow" v-if="dataForm.approvalFlag">
                <Process :conf="flowTemplateJson" v-if="flowTemplateJson.nodeId" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择产品 产品信息 -->
    <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" @close="productVisible = false"
      :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
      append-to-body>
      <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <el-row class="JNPF-common-search-box" :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                <el-form-item>
                  <el-input v-model="orderForm.productDrawingNo" placeholder="请输入品名规格"
                    @keyup.enter.native="searchProductFun" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'outbound' && productNameFlag == '1'">
                <el-form-item>
                  <el-input v-model="orderForm.productName" placeholder="请输入产品名称" @keyup.enter.native="searchProductFun"
                    clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'outbound'">
                <el-form-item>
                  <el-input v-model="orderForm.batchNumber" placeholder="请输入批次号" @keyup.enter.native="searchProductFun"
                    clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                <el-form-item>
                  <el-input v-model="listQuery.productDrawingNo" placeholder="请输入品名规格"
                    @keyup.enter.native="searchProductFun" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'inbound' && productNameFlag == '1'">
                <el-form-item>
                  <el-input v-model="listQuery.productName" placeholder="请输入产品名称" @keyup.enter.native="searchProductFun"
                    clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6" v-if="dataForm.documentType == 'inbound'">
                <el-form-item>
                  <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" @keyup.enter.native="searchProductFun"
                    clearable />
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
            <JNPF-table v-loading="listLoading" :data="productList" hasC :fixedNO="true"
              @selection-change="handleSelectionChangeAllPruduct" @sort-change="sortChange">
              <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="productCode" />
              <el-table-column prop="code" label="产品编码" min-width="130" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" key="code" />
                <el-table-column prop="productName" label="产品名称" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && productNameFlag == '1'" />
              <el-table-column prop="name" label="产品名称" min-width="160" sortable="custom"
                v-if="dataForm.documentType == 'inbound' && productNameFlag == '1'" />
              <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="productDrawingNo" />
              <el-table-column prop="drawingNo" label="品名规格" min-width="300" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" key="drawingNo" />


              <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                v-if="isProjectSwitch == 1" />
              <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" width="120" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="mainUnit" />
              <el-table-column prop="mainUnit" label="单位(副)" width="120" sortable="custom"
                v-if="dataForm.documentType == 'outbound' && mainUnitFlag == 1" key="mainUnit" />
              <el-table-column prop="inventoryQuantity" label="库存数量" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="inventoryQuantity" />
              <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="availableQuantity" />
              <el-table-column prop="occupancyQuantity" label="占用库存数量" width="160" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="occupancyQuantity" />
              <el-table-column prop="batchNumber" label="批次号" width="180" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="batchNumber" />
              <el-table-column prop="standardValue" label="规值" width="80" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="standardValue" />
              <el-table-column prop="colour" label="颜色" width="80" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="colour" />
              <el-table-column prop="sealingCoverTyping" label="打字内容" width="110" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="sealingCoverTyping" />
              <el-table-column prop="accuracyLevel" label="精度等级" width="110" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="accuracyLevel" />
              <el-table-column prop="vibrationLevel" label="振动等级" width="110" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="vibrationLevel" />
              <el-table-column prop="oil" label="油脂" width="80" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="oil" />
              <el-table-column prop="clearance" label="游隙" width="80" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="clearance" />
              <el-table-column prop="aperture" label="孔径" width="80" :key="102" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="aperture"></el-table-column>
              <el-table-column prop="packagingMethod" label="包装方式" width="110" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="packagingMethod" />
              <el-table-column prop="specialRequire" label="特殊要求" width="110" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="specialRequire" />
              <el-table-column prop="remark" label="备注" width="100" sortable="custom"
                v-if="dataForm.documentType == 'outbound'" key="remark" />
              <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"
                v-if="dataForm.documentType == 'inbound'" key="createTime" />
            </JNPF-table>
            <pagination :total="productTotal" v-if="dataForm.documentType == 'outbound'" :page.sync="orderForm.pageNum"
              :limit.sync="orderForm.pageSize" @pagination="searchProductFun" />
            <pagination :total="productTotal" v-if="dataForm.documentType == 'inbound'" :page.sync="listQuery.pageNum"
              :limit.sync="listQuery.pageSize" @pagination="searchProductFun" />
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
      :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
      <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
          {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="continueAdd()"> 继续新增</el-button>
      </span>
    </el-dialog>
    <el-dialog title="扫码录入" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="true" :visible.sync="scanDialog" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px"
      @close="closeScanDiaFun()">
      <div class="scand">
        <div class="box">
          <el-input v-model="scanResult" ref="inputRef" placeholder="请扫产品码" @keyup.enter.native="getProductFun()">
          </el-input>
          <div class="tip">说明：根据产品码自动添加对应的产品</div>
        </div>
      </div>
    </el-dialog>
    <!-- 选客户 -->
    <CustomerForm v-if="CustomerForm" ref="CustomerForms" @selectCustomer="handleSelectCustomer"></CustomerForm>
    <!-- 选库位 -->
    <WareHouseForm v-if="wareHouseVisible" ref="WareHouseForms" @selectWareHouseFun="selectWareHouseFun">
    </WareHouseForm>
    <!-- 选批次号 -->
    <BatchNumberForm v-if="batchNumVisible" ref="BatchNumberForms" @selectBatchNumberFun="selectBatchNumberFun">
    </BatchNumberForm>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
  </div>
</template>
<script>
import {
    addWarehouseData,
    updateWarehouseData,
    detailWarehouseData,
    autoDistribute,
    getProductRoutingList,
    stockWarehouseBusinessTypeList
} from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList, getWarehouseInfo, getStockGoodsShelvesList, getProductionLotList, getBimBusinessSwitchConfigList, getBatchNumber, getStockGoodsShelves } from '@/api/basicData/index'
import { getProductList } from '@/api/masterDataManagement/productManage'
import { getBimProcessList } from '@/api/bimProcess/index'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import WareHouseForm from './wareHouseForm.vue'
import CustomerForm from './customerForm.vue'
import BatchNumberForm from './batchNumberForm.vue'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import { getclassAttributelistByCode } from '@/api/masterDataManagement/index'
import { getCooperativeData } from '@/api/basicData/index'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import flowMixin from '@/mixins/generator/flowMixin'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo } from '@/api/system/printDev'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  components: { WareHouseForm, BatchNumberForm, CustomerForm, Process, PrintBrowse, PrintDialog },
  mixins: [flowMixin, getProjectList],
  props: {
    warehouseCode: "",
  },
  name: "directInandOutWarehouse",
  data() {
    return {
      printVisible: false,
      isProjectSwitch: '',
      prindId: '',
      formId: '',
      enCode: "",
      weightFlagList: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      scanResult: "",
      scanDialog: false,
      processList: [],
      documentTypeList: [
        { label: "直接出库", value: "outbound", },
        { label: "直接入库", value: "inbound", },
      ],
     businessType2Title: Object.freeze(new Map([
            ["outbound_sale_send", "销售发货"],
            ["inbound_sale_return", "销售退货"],
            ["inbound_purchase", "采购收货"],
            ["outbound_purchase", "采购退货"],
            ["outbound_pick_out", "生产领料"],
            ["inbound_return_materials", "生产退料"],
            ["outbound_external_send", "外协发料"],
            ["inbound_external_return", "外协退料"],
            ["inbound_external", "外协收货"],
            ["outbound_external", "外协退货"],
            ["inbound_mock_production", "生产入库"],
        ])),
      list: [
      ],
      batchNumVisible: false,
      wareHouseVisible: false,
      // 选择批次号请求条件
      batchNOForm: {
        batchNumber: "",
        shelfSpaceName: "",
        orderItems: [{
          "asc": false,
          "column": ""
        },],
        productsId: "",
        pageNum: 1,
        pageSize: 20,
        warehouseId: "",
      },
      btnText: "",
      submitmethodsTitle: "",
      tipsvisible: false,
      CustomerForm: false,
      activeNames: ["productInfo", "basicInfo"],
      jyFlag: false,//是否显示检验标志
      codeConfig: {},//单号配置信息(单据规则)
      dataForm: {  //表单信息
        orderNo: "",
        warehouseName: "",
        warehouseId: "",
        documentType: "",
        businessType: "",
        sourceType: "direct",
        id: "",
        warehouseType: "",
        inspectionResults: "",
        partnerName: "",
        cooperativePartnerId: "",
        approvalFlag: false,
        weightFlag: false,
        orderDate: this.jnpf.getToday(),
        recipientBy: "",
      },
      weightFlagList: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      customerInfo: {},//所选客户信息
      getWarehouseList,
      inspectionResultsList: [//检验下拉框数据
        { label: "待检验", value: "unInspect" },
        { label: "合格", value: "qualified" },
      ],
      dataRule: {
        documentType: [{ required: true, message: "单据类型不能为空", trigger: 'change' }],
        inspectionResults: [{ required: true, message: "检验结果不能为空", trigger: 'change' }],
        orderDate: [
          { required: true, message: '单据日期不能为空', trigger: 'change' }
        ],
        orderNo: [{ required: true, message: "请输入单号", trigger: 'blur' }],
        cooperativePartnerIdText: [
          { required: true, message: '客户不能为空', trigger: 'change' }
        ],
        warehouseName: [
          { required: true, message: '仓库不能为空', trigger: 'change' }
        ],
        weightFlag: [
          { required: true, message: '是否显示比重折扣不能为空', trigger: 'change' }
        ],
        recipientBy: [
          { required: true, message: '领(退)料人不能为空', trigger: 'change' }
        ],
      },
      orderForm: { //获取产品数据
        productDrawingNo: "",        // customerProductNo: "",
        customerProductDrawingNo: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
        productName: "",
      },
      productList: [],
      productTotal: 0,
      productVisible: false,
      selectSaleProductArr: [],
      productData: [],
      selectRows: [],
      listLoading: false,
      currentProductIndex: "",
      title: "",
      visible: true,
      btnType: 'add',
      wareVisibled: false,
      btnLoading: false,
      formLoading: false,
      allocationFlag: false,
      dataFormItems: [/* 通过 this.refeshDataFormItems() 动态更改 */],
      linesList: [],
      linesListItems: [/* 通过 this.refeshLinesListItems() 动态更改 */],
      spaceLines: [],
      productionLotList: [],
      loadingText: '',
      copyLinesData: [],
      previousValue: "",
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
      list9: [],
      list10: [],
      list11: [],
      taxRateList: [],
      listQuery: {
        productName: '',
        productCode: '',
        productDrawingNo: '', // 图号
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        classAttribute: ''
      },
      activeName: "orderInfo",
      flowTemplateJson: {},
      flowData: {},
      classAttributeList: [],
      // 客户
      partnerFlag: false,
      getcategoryTrees, // 客户列表
      getCooperativeData, // 客户列表
      getCooperativeMethodArr: { method: getcategoryTrees, requestObj: { type: 'customer' } },
      partnerRequestObj: {
        code: "",
        name: "",
        taxId: "",
        mobilePhone: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }, // 意向客户列表入参
      partnerSearchList: [
        { prop: 'code', label: '客户编码', type: 'input' },
        { prop: 'name', label: '客户名称', type: 'input' },
        { prop: 'taxId', label: '税号', type: 'input' }
      ], // 客户搜索条件
      partnerTableItems: [
        { prop: 'code', label: '客户编码' },
        { prop: 'name', label: '客户名称' },
        { prop: 'taxId', label: '税号' },
      ], // 客户列表字段
      partnerTitle: '',
      partnerDialogTitle: '',
      partnerTreeTitle: '',
      partnerPlaceholder: '',
      productNameFlag: null,
      printBrowseVisible: false,
      mainUnitFlag: null,
      tableDataFlag: false,
      arr: [
        {
          businessType: 'inbound_purchase',
          code: "p017",
          fullName: "采购收货单"
        },
        {
          businessType: 'outbound_purchase',
          code: "p008",
          fullName: "采购退货"
        },
        {
          businessType: 'outbound_external_send',
          code: "p013",
          fullName: "外协发料单"
        },
      ],
      calculateQuantityFlag: "",
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    totalAmount: function () {
      var totalAmounts = 0;
      for (var i = 0; i < this.productData.length; i++) {
        totalAmounts = this.jnpf.math('add', [totalAmounts, this.productData[i].totalAmount])
      }
      return totalAmounts
    },
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.getProductClassFun()
    this.getprocessList()
    this.getWarehouseListFun()
    this.getclassAttributeList()
    this.getBusInfo('b046')
    let objs = { "pageSize": -1, "businessCode": "product" }
    getBimBusinessSwitchConfigList(objs).then(res => {
      this.productNameFlag = res.data.product[1].configValue1
    })
  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        this.getBusinessTypeList();
        if (oldVal) this.spaceLines = []
      },
    }
  },
  mounted() {
    this.getMainUnitFun('deputyUnit', 'warehouseDeputyUnit', 'unitFlag')
  },
  methods: {
     async getBusinessTypeList(){
          const res = await stockWarehouseBusinessTypeList(this.dataForm.warehouseId)
         const list =[{ label: "直接入库", value: "inbound_other" }, { label: "直接出库", value: "outbound_other" },]

            this.list = res.data.records.length ? res.data.records.map(item=>({
                label: this.businessType2Title.get(item.businessType),
                value: item.businessType
            })).concat(list) : list


      },
    async getMainUnitFun(code, type, flag) {
      this.listLoading = true
      try {
        if (flag == 'unitFlag') this.mainUnitFlag = await this.jnpf.getMainUnitFun(code, type);
        if (flag == 'proportionFlag') this.calculateQuantityFlag = await this.jnpf.getMainUnitFun(code, type);
        console.log("this.calculateQuantityFlag", this.calculateQuantityFlag);
        this.dataForm.weightFlag = this.calculateQuantityFlag == 1 ? true : false
        this.tableDataFlag = true
        this.listLoading = false
      } catch (error) {
      }
    },
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.printVisible = false
          this.prindId = res.data.id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    closePrint() {
      this.printVisible = false
    },
    computedNumFun(data, index) {
      if (data.discount && data.proportion && data.weight) {
        if (Number(data.discount) > 1 || Number(data.discount) < 0) return this.$message.error("请输入合理的折扣值，0~1范围内")
        this.productData[index].num = Math.floor(this.jnpf.numberFormat(this.jnpf.math('multiply', [data.discount, data.proportion, data.weight]), 2)) + ''
        this.watchNum(data, index)
      }
    },
    getclassAttributeList() {
      getclassAttributelistByCode({ code: this.warehouseCode }).then(res => {
        console.log("类别属性", res);
        this.classAttributeList = res.data
      })
    },
    getProductFun() {
      if (!this.scanResult) return
      let obj = {
        productName: "",
        productCode: this.scanResult,
        productDrawingNo: '', // 图号
        classAttributeList: this.classAttributeList,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
      }
      getProductList(obj).then(res => {
        res.data.records.forEach(item => {
          item.productCode = item.code
          item.productDrawingNo = item.drawingNo
          this.$set(item, 'num', '')
          if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'inbound_external') {
            this.$set(item, 'discount', '')
            this.$set(item, 'proportion', '')
            this.$set(item, 'weight', '')
          }
        });
        this.$nextTick(() => {
          if (res.data.records.length) {
            this.productData.push(res.data.records[0])
          }
          this.scanResult = ""
        })
      })
    },
    scanFun() {
      this.scanDialog = true
      this.$nextTick(() => {
        this.$refs.inputRef.$refs.input.focus();
      });
    },
    closeScanDiaFun() {
      this.scanDialog = false
      this.scanResult = ""
    },
    getprocessList() {
      let obj = {
        "name": "",
        "code": "",
        "processingType": "",
        "orderItems": [{ "asc": false, "column": "" }, { "asc": false, "column": "create_time" }],
        "pageNum": -1,
        "pageSize": 20,
        "productCategoryId": ""
      };
      obj.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getBimProcessList(obj).then(res => {
        this.processList = res.data.records
      })
    },
    // 所选择的客户数据
    handleSelectCustomer(data) {
      this.dataForm['cooperativePartnerId'] = data.id
      this.dataForm['partnerName'] = data.name
      this.customerInfo = data
    },
    changeTaxRate(row, index) {
      let productArr = [...this.productData]
      productArr[index].excludingTaxCostPrice = this.jnpf.numberFormat(row.costPrice / (1 + (row.taxRate * 1 / 100)), 4)
      productArr[index].excludingTaxTotalAmount = this.jnpf.numberFormat((row.excludingTaxCostPrice * row.num), 4)
      productArr[index].taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [row.costPrice, row.excludingTaxCostPrice]), 6)]), 6)
      this.productData = productArr
    },
    // 打开选择批次号弹框
    openSeleceBatchNumberDialog(data, index) {
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库")
      this.batchNumVisible = true
      data.warehouseId = this.dataForm.warehouseId
      this.$nextTick(() => {
        this.$refs.BatchNumberForms.init(data, index)
      })
    },
    // 选择批次
    selectBatchNumberFun(data, index) {
      console.log("data", data, index);
      this.$set(this.productData[index], 'warehouseId', data.warehouseId)
      this.$set(this.productData[index], 'shelfSpaceId', data.shelfSpaceId)
      this.$set(this.productData[index], 'shelfSpaceName', data.shelfSpaceName)
      let num = this.jnpf.numberFormat(this.jnpf.math('subtract', [data.availableQuantity, data.occupancyQuantity]), 6)
      this.$set(this.productData[index], 'availableBatchNumber', num)
      this.$set(this.productData[index], 'batchNumber', data.batchNumber)
      this.$set(this.productData[index], 'inventoryQuantity', data.inventoryQuantity)
      this.$set(this.productData[index], 'costPrice', data.price)
      this.$set(this.productData[index], 'taxRate', data.taxRate * 1)
      this.$set(this.productData[index], 'excludingTaxCostPrice', data.excludingTaxPrice * 1)
      if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'inbound_external') {
        this.$set(this.productData[index], 'discount', '')
        this.$set(this.productData[index], 'proportion', '')
        this.$set(this.productData[index], 'weight', '')
      }
    },
    // 打开选择库位弹框
    openSeleceWareDialog(row, index) {
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库!")
      this.wareHouseVisible = true
      this.$nextTick(() => {
        this.$refs.WareHouseForms.initData(this.dataForm.warehouseId)
      })
      this.currentProductIndex = index
    },
    // 所选的库位信息
    selectWareHouseFun(data) {
      let index = this.currentProductIndex
      this.$set(this.productData[index], 'shelfSpaceName', data.name)
      this.$set(this.productData[index], 'shelfSpaceId', data.id)
      this.$set(this.productData[index], 'warehouseId', data.warehouseId)
    },
    // 产品信息列表复制功能
    copyFun(row, index) {
      let data = JSON.parse(JSON.stringify(row))
      this.productData.splice(index + 1, 0, data);
    },
    // 点击选择产品
    openSeleceProductDialog() {
      if (!this.dataForm.documentType) return this.$message.error("请先选择业务类型")
      if (!this.dataForm.warehouseId) return this.$message.error("请先选择仓库")
      this.productVisible = true
      this.orderForm.productName = ""
      this.listQuery.productName = ""
      this.searchProductFun()
    },
    // 销售发货选择产品——搜索 如果是销售订单  需要计算待出库数量=订单数量-已出库数量  如果是通知单 则直接取接口返回的待出库数量
    searchProductFun() {
      if (this.dataForm.documentType == 'outbound') {
        this.orderForm.classAttributeList = this.classAttributeList
        this.orderForm.warehouseId = this.dataForm.warehouseId
        this.orderForm.availableBatch = true
        this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
        getBatchNumber(this.orderForm).then(res => {
          this.productList = res.data.records
          this.productTotal = res.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        this.listLoading = true
        Object.keys(this.listQuery).forEach((key) => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        // this.listQuery.pageNum = 1
        this.jnpf.searchTimeFormat(this.listQuery, this.listQuery.createTimeArr, 'startTime', 'endTime')
        this.listQuery.classAttributeList = this.classAttributeList
        this.listQuery.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
        getProductList(this.listQuery)
          .then((res) => {
            this.productList = res.data.records
            this.productTotal = res.data.total
            this.listLoading = false
            this.visible = false
          })
          .catch(() => {
            this.listLoading = false
          })
      }
    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      this.selectSaleProductArr = val
    },
    // 销售发货选择产品——重置
    resetProductFun() {
      this.orderForm = { //获取产品数据
        productDrawingNo: "",        // customerProductNo: "",
        productName: "",
        productCode: "",
        warehouseId: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
      },
        this.listQuery = {
          productName: '',
          productCode: '',
          productDrawingNo: '', // 图号
          orderItems: [
            {
              asc: false,
              column: ''
            },
            {
              asc: false,
              column: 'create_time'
            }
          ],
          pageNum: 1,
          pageSize: 20,
          classAttributeList: this.classAttributeList
        },
        this.searchProductFun()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productDrawingNo' || prop === 'productName' || prop === 'productCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order === 'ascending'
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.searchProductFun()
    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      let arr = JSON.parse(JSON.stringify(this.selectSaleProductArr))
      arr.forEach(item => {
        if (this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'inbound_external') {
          this.$set(item, 'discount', '')
          this.$set(item, 'proportion', '')
          this.$set(item, 'weight', '')
        }
        if (this.mainUnitFlag == 1) {
          this.$set(item, 'deputyNum', '')
          this.$set(item, 'deputyUnit', item.deputyUnit)
        }
        this.$set(item, 'warehouseId', this.dataForm.warehouseId)
        this.$set(item, 'warehouseName', this.dataForm.warehouseName)
        this.$set(item, 'warehouseType', this.dataForm.warehouseType)
        item.classAttribute = item.classAttribute
        item.ordersId = ""
        item.ordersLineId = ""
        item.noticeId = ""
        item.num = ''
        item.costPrice = ""
        item.excludingTaxCostPrice = ""
        item.excludingTaxTotalAmount = ""
        item.noticeLineId = ""
        item.ordersLineId = ""
        item.totalAmount = ""
        item.taxAmount = ""
        item.taxRate = item.taxRate * 1
        item.costPrice = item.price
        item.excludingTaxCostPrice = item.excludingTaxPrice
        if (this.dataForm.documentType == 'inbound') {
          item.productCode = item.code
          item.productName = item.name
          item.productsId = item.id
        }
        if (this.dataForm.businessType == 'inbound_purchase') {
          if (item.productCategoryName == '保持架') {
            let arr = ['pa017', 'pa019', 'pa020', 'pa021']
            arr.forEach(items => {
              let obj1 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: items,//保持架尺寸
              };
              getbimProductAttributesList(obj1).then(res => {
                let list = items == 'pa017' ? 'spaceSizeList' : items == 'pa019' ? 'logoList' : items == 'pa020' ? 'divideEquallyList' : 'materialList'
                this.$set(item, list, res.data.records)
              })
            });
          }
          if (item.productCategoryName == '防尘盖') {
            let arr = ['pa018', 'pa019', 'pa020', 'pa022']
            arr.forEach(items => {
              let obj1 = {
                pageNum: -1,
                pageSize: 20,
                typeCode: items,//保持架尺寸
              };
              getbimProductAttributesList(obj1).then(res => {
                let list = items == 'pa018' ? 'spaceSizeList' : items == 'pa019' ? 'logoList' : items == 'pa020' ? 'divideEquallyList' : 'materialList'
                this.$set(item, list, res.data.records)
              })
            });
          }
        }
        this.productData.push(item)
        console.log("this.productData", this.productData);
      });
    },
    // 产品信息列表多选
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 产品信息列表 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.productData.indexOf(row);
        if (index > -1) {
          this.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 含税价格输入失去焦点 检验不能为  0
    checkPrice(row, index) {
      if (!row.costPrice) {
        this.$message({
          message: "请填写第" + (index + 1) + "行产品的单价(含税)",
          type: 'error',
          duration: 1500,
        })
      } else if (Number(row.costPrice) == 0) {
        this.$message({
          message: "第" + (index + 1) + "行产品的单价(含税)必须大于0",
          type: 'error',
          duration: 1500,
        })
      }
    },
    // 监听含税价格输入
    watchPrice(row, index) {
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      row.costPrice = row.costPrice.replace(/[^\d.]/g, '');
      let productArr = [...this.productData]
      if (row.costPrice.length == 1 && row.costPrice == '.') {
        // 如果第一位是小数点，则清空输入框
        row.costPrice = '';
        row.assistantNum = '';
      } else if (row.costPrice.length == 2 && row.costPrice[0] == '0' && row.costPrice[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.costPrice = row.costPrice.slice(0, 1) + '.' + row.costPrice.slice(1);
      } else if (row.costPrice.length > 2 && row.costPrice[0] == '0' && row.costPrice[1] != '.') {
        row.costPrice = row.costPrice.substring(1, row.costPrice.length)
      }
      if (row.costPrice.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.costPrice.length; i++) {
          const char = row.costPrice[i];
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
        row.costPrice = result;
        let arr = row.costPrice.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 4) {
          arr[1] = arr[1].substring(0, 4)
        }
        row.costPrice = arr[0] + '.' + arr[1]
      } else {
        if (row.costPrice.length > 8) {
          row.costPrice = row.costPrice.substring(0, 8);
        }
      }
      productArr[index].excludingTaxCostPrice = this.jnpf.numberFormat(row.costPrice / (1 + (row.taxRate * 1 / 100)), 4)
      productArr[index].excludingTaxTotalAmount = this.jnpf.numberFormat((row.excludingTaxCostPrice * row.num), 4)
      productArr[index].totalAmount = this.jnpf.numberFormat((row.costPrice * row.num), 4)
      productArr[index].taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [row.costPrice, row.excludingTaxCostPrice]), 6)]), 6)
      this.productData = productArr
    },
    // 主数量输入失去焦点 检验不能为  0
    checkNum(row, index) {
      if (!row.num) {
        this.$message({
          message: "请填写第" + (index + 1) + "行产品的主数量",
          type: 'error',
          duration: 1500,
        })
      } else if (Number(row.num) == 0) {
        this.$message({
          message: "第" + (index + 1) + "行产品的数量必须大于0",
          type: 'error',
          duration: 1500,
        })
      }
    },
    // 监听主数量输入
    watchNum(row, index) {
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      row.num = row.num.replace(/[^\d.]/g, '');
      let productArr = [...this.productData]
      if (row.num.length == 1 && row.num == '.') {
        // 如果第一位是小数点，则清空输入框
        row.num = '';
      } else if (row.num.length == 2 && row.num[0] == '0' && row.num[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.num = row.num.slice(0, 1) + '.' + row.num.slice(1);
      } else if (row.num.length > 2 && row.num[0] == '0' && row.num[1] != '.') {
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
        if (arr[1].length > 4) {
          arr[1] = arr[1].substring(0, 4)
        }
        row.num = arr[0] + '.' + arr[1]
      } else {
        if (row.num.length > 8) {
          row.num = row.num.substring(0, 8);
        }
      }
      if (this.mainUnitFlag == 1) {
        if (row.calculationDirection == 'multiplication') {
          productArr[index].deputyNum = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.ratio]), 6)
        } else {
          productArr[index].deputyNum = this.jnpf.numberFormat(this.jnpf.math('divide', [row.num, row.ratio]), 6)
        }
      }
      productArr[index].totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.costPrice]), 6)
      productArr[index].taxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, this.jnpf.numberFormat(this.jnpf.math('subtract', [row.costPrice, row.excludingTaxCostPrice]), 6)]), 6)
      productArr[index].excludingTaxTotalAmount = this.jnpf.numberFormat(this.jnpf.math('subtract', [productArr[index].totalAmount, productArr[index].taxAmount]), 6)
      this.productData = productArr
    },
    // 选择业务类型
    selectDocutementType(val) {
      // 如果选择的是外协收货 外协发料 采购收退货 需要调用后台参数配置 是否开启显示重量比重折扣显示
      if (val == 'inbound_purchase' || val == 'outbound_purchase' || val == 'outbound_external_send' || val == 'inbound_external') {
        this.getMainUnitFun('warehouse', 'proportion', 'proportionFlag')
      }
      if (val == 'outbound_sale_send' || val == 'outbound_purchase' || val == 'outbound_pick_out' || val == 'outbound_external_send' || val == 'outbound_other') {
        // if (  val == 'outbound_other') {
        this.dataForm.documentType = 'outbound'
        if (this.btnType == 'add') this.fetchData("CKDH")
      }
      if (val == 'inbound_sale_return' || val == 'inbound_production' || val == 'inbound_order_production' || val == 'inbound_purchase' || val == 'inbound_return_materials' || val == 'inbound_external' || val == 'inbound_other') {
        // if ( val == 'inbound_other') {
        this.dataForm.documentType = 'inbound'
        if (this.btnType == 'add') this.fetchData("RKDH")
      }
      if (val == 'outbound_sale_send' || val == 'inbound_sale_return') {
        this.partnerFlag = true
        this.partnerTitle = '客户'
        this.partnerDialogTitle = '选择客户'
        this.partnerTreeTitle = '客户分类'
        this.partnerPlaceholder = '请选择客户'
        this.getCooperativeMethodArr = { method: getcategoryTrees, requestObj: { type: 'customer' } }
        this.partnerRequestObj = {
          code: "",
          name: "",
          taxId: "",
          mobilePhone: '',
          pageNum: 1,
          pageSize: 20,
          partnerCategoryId: "",
          type: "customer",
        } // 意向客户列表入参
        this.dataRule.cooperativePartnerIdText[0].message = '客户不能为空'
      } else if (val == 'inbound_purchase' || val == 'outbound_purchase') {
        this.partnerFlag = true
        this.partnerTitle = '采购供应商'
        this.partnerDialogTitle = '选择采购供应商'
        this.partnerTreeTitle = '采购供应商分类'
        this.partnerPlaceholder = '请选择采购供应商'
        this.getCooperativeMethodArr = { method: getcategoryTrees, requestObj: { type: 'supplier' } }
        this.partnerRequestObj = {
          code: "",
          name: "",
          taxId: "",
          mobilePhone: '',
          pageNum: 1,
          pageSize: 20,
          partnerCategoryId: "",
          type: "supplier",
        } // 意向客户列表入参
        this.dataRule.cooperativePartnerIdText[0].message = '采购供应商不能为空'
        // this.dataRule
      } else if (val == 'outbound_external_send' || val == 'inbound_external') {
        this.partnerFlag = true
        this.partnerTitle = '外协供应商'
        this.partnerDialogTitle = '选择外协供应商'
        this.partnerTreeTitle = '外协供应商分类'
        this.partnerPlaceholder = '请选择外协供应商'
        this.getCooperativeMethodArr = { method: getcategoryTrees, requestObj: { type: 'outsourcing_suppliers' } }
        this.partnerRequestObj = {
          code: "",
          name: "",
          taxId: "",
          mobilePhone: '',
          pageNum: 1,
          pageSize: 20,
          partnerCategoryId: "",
          type: "outsourcing_suppliers",
        } // 意向客户列表入参
        this.dataRule.cooperativePartnerIdText[0].message = '外协供应商不能为空'
      } else {
        this.partnerFlag = false
      }
      if (this.productData.length) {
        this.productData.forEach(item => {
          if (item.productDrawingNo) {
            item.drawingNo = item.productDrawingNo
          }
          if (item.drawingNo) {
            item.productDrawingNo = item.drawingNo
          }
        });
      }
      this.getBusInfo('b046')
      this.orderForm = { //获取产品数据
        cooperativePartnerId: "",
        productDrawingNo: "",        // customerProductNo: "",
        customerProductDrawingNo: "",
        productName: "",
        deliveryStartTime: "",
        deliveryEndTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
      }
    },
    // 打开选择客户弹框
    openDialog() {
      this.CustomerForm = true
      this.$nextTick(() => {
        this.$refs.CustomerForms.init()
      })
    },
    changeWarehousex(val, data) {
      console.log(val, data);
      if (!val && !data.length) {
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.warehouseType = ""
        return
      }
      console.log(data);
      if (data[0].id) {
        this.allocationFlag = data[0].all.locationStatus == 'disabled' ? false : true
        this.dataForm.warehouseId = data[0].id
        this.dataForm.warehouseName = data[0].name
        this.dataForm.warehouseType = data[0].all.type
        if (this.productData.length) {
          this.productData.forEach(item => {
            this.$set(item, 'warehouseId', this.dataForm.warehouseId)
            this.$set(item, 'warehouseName', this.dataForm.warehouseName)
            this.$set(item, 'warehouseType', this.dataForm.warehouseType)
          });
        }
      }
    },
    goBack() {
      this.$emit('close')
    },
    // 获取仓库id
    getWarehouseListFun() {
      getWarehouseList({ code: this.warehouseCode }).then(res => {
        this.dataForm.warehouseName = res.data[0].name
        this.dataForm.warehouseId = res.data[0].id
        // 获取仓库详情信息
        getWarehouseInfo(res.data[0].id).then(response => {
          this.dataForm.warehouseType = response.data.type
          this.dataForm.projectId = res.data[0].projectId
          this.allocationFlag = response.data.locationStatus == 'disabled' ? false : true
        })
      })
    },
    init(id, btnType) {
      console.log(777, id, btnType);
      this.formLoading = true
      this.getclassAttributeList()
      this.btnType = btnType
      if (id) {
        this.title = btnType == 'look' ? '查看出入库单' : '编辑出入库单'
        // 获取详情
        detailWarehouseData(id).then(res => {
          this.$set(res.data.stockMove, 'cooperativePartnerIdText', res.data.stockMove.partnerName)
          this.dataForm = res.data.stockMove
          this.selectDocutementType(this.dataForm.businessType)
          res.data.spaceLines.forEach(item => {
            this.$set(item, 'productDrawingNo', item.drawingNo)
          });
          this.productData = res.data.spaceLines
          this.spaceLines = res.data.spaceLines
          this.formLoading = false
          let arr = [
            { label: "组装入库", value: "inbound_merge", },
            { label: "拆卸入库", value: "inbound_split", },
            { label: "形态转换入库", value: "inbound_shift", },
            { label: "组装出库", value: "outbound_merge", },
            { label: "拆卸出库", value: "outbound_split", },
            { label: "形态转换出库", value: "outbound_shift", },
            { label: "调拨出库", value: "outbound_transfer", },
            { label: "调拨入库", value: "inbound_transfer", },
            { label: "直接领料入库", value: "inbound_receive_material", },
            { label: "直接领料出库", value: "outbound_receive_material", },
          ]
          this.list = [...this.list, ...arr]
        }).catch(() => { this.formLoading = false })
      } else {
        this.title = '新建出入库单'
        this.formLoading = false
      }
    },
    // 继续新增
    continueAdd() {
      this.tipsvisible = false
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        this.dataForm.orderNo = data.number
      } catch (error) {
      }
    },
    async handleConfirm(submitModel, type) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let submitFlag = true // 自动聚焦是否可用
          // 判断子表是否有效
          if (!this.productData.length && submitFlag) {
            submitFlag = false
            this.$message.error('请至少选择一个产品')
          }
          if (this.allocationFlag) {
            this.productData.forEach((item, index) => {
              if (!item.shelfSpaceId) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行库位不能为空")
              }
            })
          }
          if (this.productData.length) {
            let totals = {};
            let totalNum = {};
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行数量不能为空")
                break
              }
              if (!item.costPrice) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行单价不能为空或为0")
                break
              }
              // if ((this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'inbound_external') && this.calculateQuantityFlag == 1) {
              //   if (!item.weight) {
              //     submitFlag = false
              //     this.$message.error("产品信息第" + (index + 1) + "行重量不能为空或为0")
              //     break
              //   }
              //   if (!item.proportion) {
              //     submitFlag = false
              //     this.$message.error("产品信息第" + (index + 1) + "行比重不能为空或为0")
              //     break
              //   }
              //   if (!item.discount) {
              //     submitFlag = false
              //     this.$message.error("产品信息第" + (index + 1) + "行折扣不能为空或为0")
              //     break
              //   }
              // }
            }
          }
          // 自动聚焦未使用则提交
          if (submitFlag) {
            this.dataForm.documentStatus = submitModel
            this.productData.forEach(item => item.id = "")
            const formMethod = this.dataForm.id ? updateWarehouseData : addWarehouseData
            // spaceLines每一项的产品id如果与linesList项的产品id相同，那么让spaceLines项的批次号也等于linesList项的批次号
            this.copyLinesData = JSON.parse(JSON.stringify(this.productData))
            this.copyLinesData.forEach(element => {
              element.warehouseType = this.dataForm.warehouseType
            });
            this.dataForm.classAttributeList = this.classAttributeList
            let dataObj = {
              stockMove: this.dataForm,
              lines: this.productData,
              spaceLines: this.copyLinesData,
              flowData: this.flowData
            }
            formMethod(dataObj).then(res => {
              let msg = res.msg
              if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
              this.$message.success(msg)
              if (type) {
                let codes = this.arr
                  .filter(item => item.businessType === this.dataForm.businessType) // 筛选出 businessType 等于 type 的项
                  .map(item => item.code); // 提取满足条件的 code 值
                this.enCode = codes
                this.formId = res.data.id
                this.fullName = this.arr
                  .filter(item => item.businessType === this.dataForm.businessType) // 筛选出 businessType 等于 type 的项
                  .map(item => item.fullName);
                this.printVisible = true
                this.$nextTick(() => {
                  this.$refs.printTemplate.init(this.enCode)
                })
              }
              // 提交之后  保留表单数据 清空产品信息
              this.btnLoading = false
              if (this.dataForm.businessType == 'outbound_sale_send' || this.dataForm.businessType == 'outbound_purchase' || this.dataForm.businessType == 'outbound_pick_out' || this.dataForm.businessType == 'outbound_external_send' || this.dataForm.businessType == 'outbound_other') {
                this.dataForm.documentType = 'outbound'
                this.fetchData("CKDH")
              }
              if (this.dataForm.businessType == 'inbound_sale_return' || this.dataForm.businessType == 'inbound_purchase' || this.dataForm.businessType == 'inbound_return_materials' || this.dataForm.businessType == 'inbound_external' || this.dataForm.businessType == 'inbound_other') {
                this.dataForm.documentType = 'inbound'
                this.fetchData("RKDH")
              }
              this.dataForm = {  //表单信息
                orderNo: "",
                businessType: this.dataForm.businessType,
                documentType: this.dataForm.documentType,
                warehouseId: this.dataForm.warehouseId,
                warehouseName: this.dataForm.warehouseName,
                sourceType: "direct",
                id: "",
                weightFlag: this.dataForm.weightFlag,
                cooperativePartnerId: this.dataForm.cooperativePartnerId,
                cooperativePartnerIdText: this.dataForm.cooperativePartnerIdText,
                warehouseType: this.dataForm.warehouseType,
                inspectionResults: this.dataForm.inspectionResults,
                approvalFlag: false,
                orderDate: this.dataForm.orderDate
              }
              this.productData = []
              this.$refs.dataForm.resetFields()
            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            this.btnLoading = false
          }
        }
      })
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      // 孔径
      let objO = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa009",
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
      getbimProductAttributesList(objO).then(res => {
        this.list10 = res.data.records
      })
      // 颜色
      let objT = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa010",
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
      getbimProductAttributesList(objT).then(res => {
        this.list11 = res.data.records
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
        this.list9 = res.data.records
      })
      let obj0 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa008",
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
      getbimProductAttributesList(obj0).then(res => {
        this.list8 = res.data.records
      })
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
      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    // 意向客户分类节点点击
    yxPartnerTreeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.id
      return listQuery
    },
    // 客户选框传值
    partnerChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('cooperativePartnerIdText') }) // 校验操作的元素(name是组件绑定的value)
      if (data && data.length) { // 数据有效，进行更新
        const partnerInfo = data[0].all
        this.partnerInfo = data[0].all
        this.dataForm.cooperativePartnerId = partnerInfo.id
        this.dataForm.cooperativePartnerIdText = partnerInfo.name
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.cooperativePartnerId = ""
        this.dataForm.cooperativePartnerIdText = ""
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.contain {
  position: relative;
  height: calc(100% - 47px);
  overflow-y: auto;
}
::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  padding: 10px 10px;
  padding-top: 0;
}
::v-deep .JNPF-common-layout-main.JNPF-flex-main {
  overflow: auto;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}
.required {
  color: red;
  margin-right: 4px;
}
.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}
::v-deep.JNPF-dialog.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 !important;
}
::v-deep.pintDevLog.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 10px 20px 10px !important;
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
.JNPF-common-search-box {
  margin-bottom: 5px;
}
// .orderInfo ::v-deep .el-collapse-item__wrap {
//   border-bottom: none !important
// }
.JNPF-common-table {
  border: 1px solid #ebeef5 !important;
}
.options {
  display: inline-block;
  float: right;
}
.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}
::v-deep .el-tabs__header {
  margin-bottom: 5px;
}
.productInfo {
  padding: 0;
}
.scand ::v-deep.el-input__inner {
  height: 60px;
  line-height: 60px;
  font-size: 20px !important;
  font-weight: 600;
  border-color: #3fb9f8;
}
.scand .box {
  padding: 40px 20px;
}
.scand .tip {
  margin-top: 10px;
  font-size: 18px;
}
</style>
