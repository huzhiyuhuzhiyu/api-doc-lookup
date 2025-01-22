<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">

      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="goBack" :content="title" />
        <div class="options">
          <el-button v-if="btnType !== 'look'" type="success" :loading="btnLoading"
            @click="handleConfirm('draft')">保存草稿</el-button>
          <el-button v-if="btnType !== 'look'" type="primary" :loading="btnLoading"
            @click="handleConfirm('submit')">保存并提交</el-button>
          <el-button v-if="btnType == 'look' && dataForm.approvalStatus == 'ok'" type="primary" :loading="btnLoading"
            @click="inventoryAdjustmentFun()">转库存调整单</el-button>
          <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain" ref="main">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
              :element-loading-text="loadingText">
              <el-tabs v-model="activeName" v-if="!approvalFlag && dataForm.approvalFlag">
                <el-tab-pane label="基础信息" name="orderInfo" class="orderInfo">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px"
                        label-position="top">
                        <el-row :gutter="30" class="custom-row">
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="单号" prop="orderNo">
                              <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                                :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                                maxlength="300" />
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="盘点日期" prop="orderDate">
                              <el-date-picker v-model="dataForm.orderDate" type="date" value-format="yyyy-MM-dd"
                                style="width: 100%;"  placeholder="请选择盘点日期"
                                :disabled="btnType == 'look'">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="6" :xs="24">
                            <el-form-item label="盘点人员" prop="personName">
                              <el-input v-model="dataForm.personName" placeholder="请选择盘点人员" disabled maxlength="300" />
                            </el-form-item>
                          </el-col>

                          <el-col :sm="6" :xs="24">
                            <el-form-item label="盘点仓库" prop="warehouseName">
                              <ComSelect-list
                                :requestObj="{ type: '', state: 'enable', projectId: isProjectSwitch === '1' ? userInfo.projectId || '' : '' }"
                                :dialogTitle="'选择盘点仓库'" :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName"
                                :method="getWarehouseList" placeholder="请选择仓库"
                                @change="changeWarehousex"></ComSelect-list>
                            </el-form-item>
                          </el-col>
                        </el-row>


                      </el-form>
                    </el-collapse-item>



                    <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                      <div v-if="btnType !== 'look'">
                        <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                          :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceIventOProductDialog()">选择库存产品</el-button>|
                        <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                          :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-plus"
                          @click="importFun">导入</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-download"
                          @click="exportForm">导出</el-button>
                      </div>
                         <!--若keyProp未设置或keyProp值不唯一，可能导致表格空数据或者滚动时渲染的数据断层、不连贯、滚动不了-->
                      <virtual-scroll :data="virtualData" :item-size="15" key-prop="id"
                         @change="(virtualList) => tableData = virtualList" :virtualized="true">
  
                      <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="btnType != 'look'"
                        @selection-change="handeleProductInfoData" border :key="165" style="width: 100%;" :height="customStyleData">

                        <el-table-column prop="productName" label="产品名称" v-show="productNameFlag" min-width="160" />
                        <el-table-column prop="productCode" label="产品编码" width="160" :key="4" show-overflow-tooltip />
                        <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="stockNum" label="当前库存" width="120" :key="6" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="pairingModeName" label="配对方式" min-width="160">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.pairingModeId" placeholder="请选择配对方式" style="width: 100%;"
                              :disabled="btnType == 'look' ? true : false" >
                              <el-option v-for="item in pairingModeList" size="small" :key="item.id" :label="item.name"
                                :value="item.id">
                              </el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="num" label="盘点数量" width="120" :key="10112">
                          <template slot="header">
                            <span class="required">*</span>盘点数量
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.num" :disabled="btnType == 'look'"
                              @blur="computedDiffNum(scope.row, scope.$index,)" placeholder="盘点数量">
                            </el-input>

                          </template>
                        </el-table-column>
                        <el-table-column prop="diffNum" label="差额数量" width="120" :key="8" />
                        <el-table-column prop="warehouseName" label="当前仓库" width="160" :key="10112">
                          <template slot="header">
                            <span class="required">*</span>当前仓库
                          </template>
                          <template slot-scope="scope">
                            <ComSelect-list
                              :requestObj="{ type: '', virtuallyFlag: false, state: 'enable', projectId: isProjectSwitch === '1' ? userInfo.projectId || '' : '' }"
                              :dialogTitle="'选择盘点仓库'" :isdisabled="btnType == 'look'" v-model="scope.row.warehouseName"
                              :method="getWarehouseList" placeholder="请选择仓库" :currentIndex="scope.$index"
                              @change="changeCurrentWarehousex"></ComSelect-list>

                          </template>
                        </el-table-column>
                        <el-table-column prop="shelfSpaceName" label="库位" width="120" :key="10112">

                          <template slot-scope="scope" v-if="scope.row.allocationFlag">
                            <el-input v-model="scope.row.shelfSpaceName" readonly :disabled="btnType == 'look'"
                              @focus="openSeleceWareDialog(scope.row, scope.$index, 'table')" placeholder="库位">
                            </el-input>

                          </template>
                        </el-table-column>

                        <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111">

                          <template slot-scope="scope">
                            <el-input v-model="scope.row.batchNumber" readonly :disabled="btnType == 'look'"
                              @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                              {{ scope.row.batchNumber }}
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="cooperativePartnerName" label="供应商" width="200" :key="10111">
                          <template slot-scope="scope">
                            <ComSelect-page key="partner" ref="ComSelect-page"
                              v-model="scope.row.cooperativePartnerName" @change="partnerChange"
                              :tableItems="partnerTableItems" :dialogTitle="scope.row.partnerDialogTitle"
                              :treeTitle="scope.row.partnerTreeTitle" :placeholder="scope.row.partnerPlaceholder"
                              :methodArr="scope.row.getCooperativeMethodArr" :listMethod="getCooperativeData"
                              :listRequestObj="scope.row.partnerRequestObj" :searchList="scope.row.partnerSearchList"
                              :treeNodeClick="yxPartnerTreeNodeClick" :isdisabled="btnType === 'look'"
                              :index="scope.$index" />
                          </template>
                        </el-table-column>
                        <el-table-column prop="productCategoryName" label="产品分类" width="140" key="productCode" />
                        <el-table-column prop="specSize" label="规格/尺寸" width="120" key="2115">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.specSize" placeholder="请选择" clearable style="width: 100%;"
                              :disabled="btnType == 'look'">
                              <el-option v-for="(item, index) in scope.row.spaceSizeList" :key="index"
                                :label="item.name" :value="item.name"></el-option>
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
                            <el-select v-model="scope.row.divideEqually" placeholder="请选择" clearable
                              style="width: 100%;" :disabled="btnType == 'look'">
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
                            <el-select v-model="scope.row.standardValue" placeholder="请选择" clearable
                              style="width: 100%;" :disabled="btnType == 'look'">
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
                        <el-table-column prop="sealingCoverTyping" v-if="sealingCoverTypingFlag == 1" label="打字内容"
                          width="120" key="2111">
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
                        <el-table-column prop="accuracyLevel" v-if="accuracyLevelFlag == 1" label="精度等级" width="120"
                          key="123">
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
                        <el-table-column prop="vibrationLevel" v-if="vibrationLevelFlag == 1" label="振动等级" width="120"
                          key="17">
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
                        <el-table-column prop="oil" label="油脂" v-if="oilFlag == 1" width="120" key="61">

                          <template slot-scope="scope">
                            <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;"
                              :disabled="btnType == 'look'">
                              <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="clearance" label="游隙" v-if="clearanceFlag == 1" width="120" key="1055">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;"
                              :disabled="btnType == 'look'">
                              <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="aperture" label="孔径" v-if="apertureFlag == 1" width="120" key="106">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.aperture" placeholder="请选择" clearable style="width: 100%;"
                              :disabled="btnType == 'look'">
                              <el-option v-for="(item, index) in list10" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="packagingMethod" label="包装方式" v-if="packagingMethodFlag == 1" width="120"
                          key="101">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable
                              :disabled="btnType == 'look'" style="width: 100%;">
                              <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column prop="specialRequire" label="特殊要求" v-if="specialRequireFlag == 1" width="160"
                          key="202">
                          <template slot-scope="scope">
                            <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable
                              :disabled="btnType == 'look'" style="width: 100%;">
                              <el-option v-for="(item, index) in list9" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'"
                          fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                          </template>
                        </el-table-column>
                      </JNPF-table>
                    </virtual-scroll>


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
              <el-collapse v-model="activeNames" style="margin-top: 5px;" v-else>
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入单号"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                            maxlength="300" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="盘点日期" prop="orderDate">
                          <el-date-picker v-model="dataForm.orderDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;"  placeholder="请选择盘点日期"
                            :disabled="btnType == 'look'">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="盘点人员" prop="personName">
                          <el-input v-model="dataForm.personName" placeholder="请选择盘点人员" disabled maxlength="300" />
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="盘点仓库" prop="warehouseName">
                          <ComSelect-list
                            :requestObj="{ type: '', virtuallyFlag: false, state: 'enable', projectId: isProjectSwitch === '1' ? userInfo.projectId || '' : '' }"
                            :dialogTitle="'选择盘点仓库'" :isdisabled="btnType == 'look'" v-model="dataForm.warehouseName"
                            :method="getWarehouseList" placeholder="请选择仓库" @change="changeWarehousex"></ComSelect-list>
                        </el-form-item>
                      </el-col>
                    </el-row>


                  </el-form>
                </el-collapse-item>



                <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                  <div v-if="btnType !== 'look'">
                    <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                      :disabled="btnType == 'look' ? true : false"
                      @click="openSeleceIventOProductDialog()">选择库存产品</el-button>|
                    <el-button type="text" style="margin-right:8px; font-size:14px!important" icon="el-icon-plus"
                      :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                      @click="batchDelete">批量删除</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-plus"
                      @click="importFun">导入</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-download"
                      @click="exportForm">导出</el-button>
                  </div>

                  <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="btnType != 'look'"
                    @selection-change="handeleProductInfoData" border :key="165" style="width: 100%;" :height="customStyleData">

                    <el-table-column prop="productName" label="产品名称" v-show="productNameFlag" min-width="160" />
                    <el-table-column prop="productCode" label="产品编码" width="160" :key="4" show-overflow-tooltip />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="processName" label="工序" width="120" :key="6" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="stockNum" label="当前库存" width="120" :key="6" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="pairingModeName" label="配对方式" min-width="160">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.pairingModeId" placeholder="请选择配对方式" style="width: 100%;"
                          :disabled="btnType == 'look' ? true : false"
                          @change="(value) => changePairingMode(value, scope)">
                          <el-option v-for="item in pairingModeList" size="small" :key="item.id" :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="num" label="盘点数量" width="120" :key="10112">
                      <template slot="header">
                        <span class="required">*</span>盘点数量
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.num" :disabled="btnType == 'look'"
                          @blur="computedDiffNum(scope.row, scope.$index,)" placeholder="盘点数量">
                        </el-input>

                      </template>
                    </el-table-column>
                    <el-table-column prop="diffNum" label="差额数量" width="120" :key="8" />
                    <el-table-column prop="warehouseName" label="当前仓库" width="160" :key="10112">
                      <template slot="header">
                        <span class="required">*</span>当前仓库
                      </template>
                      <template slot-scope="scope">
                        <ComSelect-list
                          :requestObj="{ type: '', virtuallyFlag: false, state: 'enable', projectId: isProjectSwitch === '1' ? userInfo.projectId || '' : '' }"
                          :dialogTitle="'选择盘点仓库'" :isdisabled="btnType == 'look'" v-model="scope.row.warehouseName"
                          :method="getWarehouseList" placeholder="请选择仓库" :currentIndex="scope.$index"
                          @change="changeCurrentWarehousex"></ComSelect-list>

                      </template>
                    </el-table-column>
                    <el-table-column prop="shelfSpaceName" label="库位" width="120" :key="10112">

                      <template slot-scope="scope" v-if="scope.row.allocationFlag">
                        <el-input v-model="scope.row.shelfSpaceName" readonly :disabled="btnType == 'look'"
                          @focus="openSeleceWareDialog(scope.row, scope.$index, 'table')" placeholder="库位">
                        </el-input>

                      </template>
                    </el-table-column>
                    <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111">

                      <template slot-scope="scope">
                        <el-input v-model="scope.row.batchNumber" readonly :disabled="btnType == 'look'"
                          @focus="openSeleceBatchNumberDialog(scope.row, scope.$index)" placeholder="批次号">
                          {{ scope.row.batchNumber }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="cooperativePartnerName" label="供应商" width="200" :key="10111">
                      <template slot-scope="scope">
                        <ComSelect-page key="partner" ref="ComSelect-page" v-model="scope.row.cooperativePartnerName"
                          @change="partnerChange" :tableItems="partnerTableItems"
                          :dialogTitle="scope.row.partnerDialogTitle" :treeTitle="scope.row.partnerTreeTitle"
                          :placeholder="scope.row.partnerPlaceholder" :methodArr="scope.row.getCooperativeMethodArr"
                          :listMethod="getCooperativeData" :listRequestObj="scope.row.partnerRequestObj"
                          :searchList="scope.row.partnerSearchList" :treeNodeClick="yxPartnerTreeNodeClick"
                          :isdisabled="btnType === 'look' || (scope.row.productSource != 'out' && scope.row.productSource != 'purchase')"
                          :index="scope.$index" />
                      </template>
                    </el-table-column>

                    <el-table-column prop="productCategoryName" label="产品分类" width="140" key="productCode" />
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
                    <el-table-column prop="sealingCoverTyping" v-if="sealingCoverTypingFlag == 1" label="打字内容"
                      width="120" key="2111">
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
                    <el-table-column prop="accuracyLevel" v-if="accuracyLevelFlag == 1" label="精度等级" width="120"
                      key="123">
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
                    <el-table-column prop="vibrationLevel" v-if="vibrationLevelFlag == 1" label="振动等级" width="120"
                      key="17">
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
                    <el-table-column prop="oil" label="油脂" v-if="oilFlag == 1" width="120" key="61">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;"
                          :disabled="btnType == 'look'">
                          <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clearance" label="游隙" v-if="clearanceFlag == 1" width="120" key="1055">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;"
                          :disabled="btnType == 'look'">
                          <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="aperture" label="孔径" v-if="apertureFlag == 1" width="120" key="106">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.aperture" placeholder="请选择" clearable style="width: 100%;"
                          :disabled="btnType == 'look'">
                          <el-option v-for="(item, index) in list10" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" v-if="packagingMethodFlag == 1" width="120"
                      key="101">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable
                          :disabled="btnType == 'look'" style="width: 100%;">
                          <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="specialRequire" label="特殊要求" v-if="specialRequireFlag == 1" width="160"
                      key="202">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable
                          :disabled="btnType == 'look'" style="width: 100%;">
                          <el-option v-for="(item, index) in list9" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'"
                      fixed="right">
                      <template slot-scope="scope">
                        <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
                    <span style="font-weight:500;margin-right:10px">当前库存总数：{{ totalStock }}</span>
                    <!-- <span style="font-weight:500;margin-right:10px">总副数量：{{ totalAssistantNum }}</span> -->
                    <span style="font-weight:500;margin-right:10px">盘点数量总数：{{ totalCount }}</span>
                    <span style="font-weight:500;margin-right:10px">差额数量总数：{{ totalDiff }}</span>
                  </div>

                </el-collapse-item>

              </el-collapse>
            </div>
          </div>
        </div>
      </div>

      <!-- 选择产品信息 -->
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
        @close="productVisible = false" :visible.sync="productVisible" lock-scroll
        class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchProductFun(type)"  v-model="productForm.productDrawingNo" placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchProductFun(type)"  v-model="productForm.productName" placeholder="产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchProductFun(type)"  v-model="productForm.productCode" placeholder="产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductFun(type)">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetProductFun(type)">{{
                      $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>

            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="productList" hasC :fixedNO="true"
                @selection-change="handleSelectionChangeAllPruduct" ref="form">



                <el-table-column prop="code" label="产品编码" show-overflow-tooltip min-width="160"></el-table-column>
                <el-table-column prop="name" label="产品名称" v-show="productNameFlag" min-width="160" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="330" />
                <el-table-column prop="processName" label="工序名称" v-if="type == 'invent'" min-width="180"></el-table-column>
                <el-table-column prop="productCategoryName" label="所属分类" v-if="type == 'all'" min-width="120" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                <el-table-column prop="mainUnit" label="单位" width="80" />
                <el-table-column prop="batchNumber" label="批次号" v-if="type == 'invent'"
                  min-width="180"></el-table-column>
                <el-table-column prop="stockNum" label="库存数量" v-if="type == 'invent'" min-width="120"></el-table-column>
                <el-table-column prop="warehouseName" label="仓库名称" v-if="type == 'invent'"
                  min-width="120"></el-table-column>
                <el-table-column prop="shelfSpaceName" label="库位名称" v-if="type == 'invent'"
                  min-width="120"></el-table-column>
                <el-table-column prop="productCategoryName" label="产品分类" width="140" key="productCode" />
                <el-table-column prop="specSize" label="规格/尺寸" width="120" key="2115">

                </el-table-column>
                <el-table-column prop="logo" label="Logo" width="120" key="2116">

                </el-table-column>
                <el-table-column prop="divideEqually" label="开等分" width="120" key="2117">

                </el-table-column>
                <el-table-column prop="material" label="材质" width="120" key="2118">

                </el-table-column>
                <el-table-column prop="standardValue" label="规值" width="120" key="211">

                </el-table-column>
                <el-table-column prop="colour" label="颜色" width="120" key="210">

                </el-table-column>
                <el-table-column prop="sealingCoverTyping" v-if="sealingCoverTypingFlag == 1" label="打字内容" width="120"
                  key="2111">

                </el-table-column>
                <el-table-column prop="accuracyLevel" v-if="accuracyLevelFlag == 1" label="精度等级" width="120" key="123">
                  <!-- <template slot="header">
                            <span class="required">*</span>精度等级
                          </template> -->

                </el-table-column>
                <el-table-column prop="vibrationLevel" v-if="vibrationLevelFlag == 1" label="振动等级" width="120" key="17">

                </el-table-column>
                <el-table-column prop="oil" label="油脂" v-if="oilFlag == 1" width="120" key="61">

                </el-table-column>
                <el-table-column prop="clearance" label="游隙" v-if="clearanceFlag == 1" width="120" key="1055">

                </el-table-column>
                <el-table-column prop="aperture" label="孔径" v-if="apertureFlag == 1" width="120" key="106">

                </el-table-column>
                <el-table-column prop="packagingMethod" label="包装方式" v-if="packagingMethodFlag == 1" width="120"
                  key="101">

                </el-table-column>
                <el-table-column prop="specialRequire" label="特殊要求" v-if="specialRequireFlag == 1" width="160"
                  key="202">

                </el-table-column>


              </JNPF-table>
              <pagination :total="productTotal" :page.sync="productForm.pageNum" :limit.sync="productForm.pageSize"
                @pagination="searchProductFun(type)" />
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
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center tips"
        width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>


        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>

        </span>
      </el-dialog>
      <!-- 选客户 -->
      <!-- <CustomerForm v-if="CustomerForm" ref="CustomerForms" @selectCustomer="handleSelectCustomer"></CustomerForm> -->
      <!-- 选库位 -->
      <WareHouseForm v-if="wareHouseVisible" ref="WareHouseForms" @selectWareHouseFun="selectWareHouseFun">
      </WareHouseForm>
      <!-- 选批次号 -->
      <BatchNumberForm v-if="batchNumVisible" ref="BatchNumberForms" @selectBatchNumberFun="selectBatchNumberFun">
      </BatchNumberForm>
      <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
        <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
          :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text"><em>点击选取文件上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件</div>

        </el-upload>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="submit()">
            提交</el-button>
        </span>
      </el-dialog>
      <Adjust v-if="adjustVisible" ref="adjustForm" @close="closeForm"></Adjust>
    </div>
  </transition>
</template>

<script>
import { addWarehouseData, updateWarehouseData, detailWarehouseData, autoDistribute, getProductRoutingList } from "@/api/warehouseManagement/inboundAndOutbound"
import { getWarehouseList } from '@/api/basicData/index'
import { getQuotationsendlist } from "@/api/salesManagement/index";
import { getProducts, getDetailByDrawNo, getbimProductAttributesListMap, getbimProductAttributesList } from '@/api/masterDataManagement/index.js' // 产品列表

// import CustomerForm from './customerForm.vue'
import WareHouseForm from './wareHouseForm.vue'
import BatchNumberForm from './batchNumberForm.vue'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import { mapGetters, mapState } from 'vuex'
import { excelExport } from '@/api/basicData/index'
import Adjust from '../inventoryAdjustmentSheet/Form.vue'
import { getInventProduct, addStocktak, detailStocktak, editStocktak, deleteStocktak, productExport, productImport, stockTakingToAdjus } from '@/api/warehouseManagement/stocktak.js'
import Process from '@/components/Process/Preview'
import flowMixin from '@/mixins/generator/flowMixin'
import recordList from '@/views/workFlow/components/RecordList.vue'
import busFlow from '@/mixins/generator/busFlow';
import getProjectList from '@/mixins/generator/getProjectList'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeData, getOrderFiledMap, getBimBusinessDetail,getBatchNumber } from '@/api/basicData/index'
import VirtualScroll, { VirtualColumn } from 'el-table-virtual-scroll'
export default {
  // components: { CustomerForm, WareHouseForm, BatchNumberForm, Process, recordList },
  components: { Process, recordList, WareHouseForm, BatchNumberForm, Adjust },
  mixins: [flowMixin, busFlow, getProjectList],
  data() {
    return {
      customStyleData: 0,
      formLoading:true,
      partnerRequestObj: {
        code: "",
        name: "",
        taxId: "",
        mobilePhone: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "supplier",
      },
      getCooperativeData,
      getCooperativeMethodArr: { method: getcategoryTrees, requestObj: { type: 'supplier' } },
      partnerTreeTitle: "采购供应商分类",
      partnerDialogTitle: '选择供应商',
      partnerPlaceholder: '请选择采购供应商',
      partnerSearchList: [
        { prop: 'code', label: '供应商编码', type: 'input' },
        { prop: 'name', label: '供应商名称', type: 'input' },
        { prop: 'taxId', label: '税号', type: 'input' }
      ], // 客户搜索条件
      partnerTableItems: [
        { prop: 'code', label: '供应商编码' },
        { prop: 'name', label: '供应商名称' },
        { prop: 'taxId', label: '税号' },
      ], // 客户列表字段
      adjustVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      warehouseRequestObj: {

      },
      allocationFlag: false,
      selectSaleProductArr: [],
      dataRule: {
        orderNo: [{ required: true, message: "请输入单号", trigger: 'blur' }],
      },
      dataForm: {  //表单信息
        orderNo: "",
        warehouseName: "",
        warehouseId: "",
        warehouseType: "",
        approvalFlag: false,
        personId: "",
        personName: "",
        orderDate: ""
      },
      productForm: {
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }],
      },
      exportFormVisible: false,





      batchNumVisible: false,
      wareHouseVisible: false,

      btnText: "",
      submitmethodsTitle: "",
      tipsvisible: false,
      CustomerForm: false,
      activeNames: ["productInfo", "basicInfo"],
      jyFlag: false,//是否显示检验标志
      codeConfig: {},//单号配置信息(单据规则)

      customerInfo: {},//所选客户信息
      getWarehouseList,



      productList: [],
      productTotal: 0,
      deliveryDateArr: [],
      productVisible: false,
      virtualData: [], // 实际数据
      productData: [],
      selectRows: [],
      listLoading: false,
      currentProductIndex: "",



      title: "",
      visible: true,
      btnType: false,
      wareVisibled: false,
      btnLoading: false,
      formLoading: false,


      spaceLines: [],
      loadingText: '',
      copyLinesData: [],
      previousValue: "",
      activeName: "orderInfo",
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      productNameFlag: null,
      uploadVisib: false,
      isProjectSwitch: '',

      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      bimProductAttributesList: [],
      standardValueFlag: "",
      colourFlag: "",
      processFlag: "",
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
      partnerInfo: {},
      pairingModeList: [],
    }
  },
  components: {
    VirtualScroll: VirtualScroll,
    VirtualColumn: VirtualColumn
  },
  async created() {
    this.formLoading = true
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    await this.getpairingModeListFun()
    await this.switchStyleheight()
    this.formLoading = false
  },

  computed: {
    totalStock() {
      return this.productData.reduce((total, item) => Number(total) + Number(item.stockNum), 0);
    },
    totalCount() {
      return this.productData.reduce((total, item) => Number(total) + Number(item.num), 0);
    },
    totalDiff() {
      return this.productData.reduce((total, item) => Number(total) + Number(item.diffNum), 0);
    },
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

  },
  mounted() {
  },
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },

  methods: {
    switchStyleheight() {
      const mainRegion1 = this.$refs.main // 表单页面区域
      const mainHeight1 = mainRegion1.clientHeight
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach((item) => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight = mainHeight1 - 280
      console.log(maxHeight, 'maxHeight')
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },
    
    // 获取配对方式
    async getpairingModeListFun() {
      try {
        this.pairingModeList = await this.jnpf.getpairingModeListFun()
        console.log("this.par", this.pairingModeList);
      } catch (error) { }
    },
    // 意向客户分类节点点击
    yxPartnerTreeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.id
      return listQuery
    },
    partnerChange(id, data, is, index) {
      console.log(data, id, is, index);

      if (data && data.length) { // 数据有效，进行更新
        const partnerInfo = data[0].all
        this.partnerInfo = data[0].all
        console.log(partnerInfo);
        this.$set(this.productData[index], 'cooperativePartnerId', partnerInfo.id)
        this.$set(this.productData[index], 'cooperativePartnerName', partnerInfo.name)

      } else { // 不选择任何内容，置空绑定的值
        this.$set(this.productData[index], 'cooperativePartnerId', '')
        this.$set(this.productData[index], 'cooperativePartnerName', '')
      }
      console.log(this.productData);
    },
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
        console.log(66, this.bimProductAttributesList);
      })

    },
    advancedQueryFuns() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式          
      //     specialRequire //特殊要求

      if (this.colourFlag === '1') {
        this.list11 = this.bimProductAttributesList.pa010.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })

      }
      console.log(555, this.bimProductAttributesList);
      this.list10 = this.bimProductAttributesList.pa009.map((item) => {
        return {
          label: item.name,
          name: item.name
        }
      })

      if (this.standardValueFlag === '1') {
        this.list8 = this.bimProductAttributesList.pa008.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }

      if (this.specialRequireFlag === '1') {
        this.list9 = this.bimProductAttributesList.pa016.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.packagingMethodFlag === '1') {
        this.list7 = this.bimProductAttributesList.pa015.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.clearanceFlag === '1') {
        this.list6 = this.bimProductAttributesList.pa001.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })

      }

      if (this.oilFlag === '1') {
        this.list4 = this.bimProductAttributesList.pa002.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.vibrationLevelFlag === '1') {
        this.list3 = this.bimProductAttributesList.pa005.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      console.log("list3", this.list3);
      if (this.accuracyLevelFlag === '1') {
        this.list2 = this.bimProductAttributesList.pa006.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }
      if (this.sealingCoverTypingFlag === '1') {
        this.list1 = this.bimProductAttributesList.pa007.map((item) => {
          return {
            label: item.name,
            name: item.name
          }
        })
      }

    },
    getOrderFiledMap() {
      getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
      })
      getOrderFiledMap('purchase').then(res => {
        this.standardValueFlag = res.data.standardValue
        this.colourFlag = res.data.colour
        this.processFlag = res.data.process
      })
    },
    closeForm() {
      this.adjustVisible = false
    },
    submit() {
      this.UploadProduct(this.file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/盘点单模板.xlsx')
      a.click()
    },
    handleFileChange(file) {
      console.log(file);
      this.file = file.raw
    },

    // 上传产品
    UploadProduct(data) {
      console.log(data);
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data)
      //调用上传文件接口
      productImport(formData).then(res => {
        if (!res.data.url) {
          this.$message.success(`导入成功`)
          this.productData = []
          if (res.data.list.length > 0) {
            console.log(111, res.data);
            res.data.list.forEach(item => {
              this.$set(item, 'productCode', item.productsCode)
              this.$set(item, 'productName', item.productsName)
              this.$set(item, 'allocationFlag', item.locationStatus == 'disabled' ? false : true)
              this.$set(item, 'diffNum', this.jnpf.numberFormat(this.jnpf.math('subtract', [item.num, item.stockNum]), 2))

            });
          }
          this.productData = res.data.list
          this.formLoading = false
          this.loadingText = ''
          this.uploadVisib = false
        } else {
          this.handleMessage(res.data)
          this.$refs['uploadRef'].clearFiles();
          this.formLoading = false
          this.loadingText = ''
        }
        // this.tipsvisible=true

        this.$refs['uploadRef'].clearFiles();
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 提示
    handleMessage(data) {
      const h = this.$createElement
      this.$message({
        type: "error",
        duration: 0,
        showClose: true,
        customClass: 'my-message', // 自定义类名，用于设置样式
        message: h('div',
          {
            style: "padding-right:20px;display:flex;align-items:center;color:#f56c6c;"
          },
          [
            h('p', { style: 'font-size:14px;' }, '导入成功，存在产品相关信息错误！'),
            h('el-button', {
              props: {
                type: 'text',
                size: "mini",
                icon: 'el-icon-download'
              },
              on: {
                click: () => {
                  this.downNoProduct(data)
                }
              },
              style: {
                border: "none",
                textAlign: "center",
                // width:"20%",
                margin: "0 5px 0 5px ",
              },
            }, '下载导入错误数据')
          ]
        ),
      })
      return
    },
    // 导入产品  下载导入错误数据
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
    },
    // 导入
    importFun() {
      if (this.productData.length) {
        this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).then(() => {
          this.uploadVisib = true

          // this.$refs.UploadProduct.$el.querySelector('input').click()
        }).catch(() => { })
      } else {
        this.uploadVisib = true
      }
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    // 导出
    exportForm() {
      console.log(this.productData);
      if (!this.productData.length) return this.$message.error("暂无数据可导出")
      console.log(this.productData);
      productExport(this.productData).then(res => {
        console.log("导出结果", res);
        this.jnpf.downloadFile(res.data.url)
      })


    },

    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let query = this.initListQuery
        let _data = {
          ...query,
          exportType: '1012',
          exportName: '盘点产品信息',
          includeFieldMap,
          pageSize: 1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    // 输入盘点数量 失去焦点时计算差额数量
    computedDiffNum(row, index) {
      row.diffNum = this.jnpf.numberFormat(this.jnpf.numberFormat(this.jnpf.math('subtract', [row.num, row.stockNum]), 2))

    },
    // 打开选择批次号弹框
    openSeleceBatchNumberDialog(data, index) {
      if (!data.warehouseId) return this.$message.error("请先选择仓库")
      this.batchNumVisible = true
      this.$nextTick(() => {
        this.$refs.BatchNumberForms.init(data, index)
      })
    },
    // 选择批次
    selectBatchNumberFun(data, index) {
      console.log("批次号数据", data, index);
      this.productData[index].batchNumber = data.batchNumber
      this.productData[index].stockNum = data.inventoryQuantity
     
      this.productData[index].cooperativePartnerName = data.partnerName
      this.productData[index].cooperativePartnerId = data.cooperativePartnerId
      this.productData[index].cooperativePartnerCode = data.partnerCode
     
      if (this.productData[index].num) {
        this.productData[index].diffNum = this.jnpf.numberFormat(this.jnpf.math('subtract', [this.productData[index].num, this.productData[index].stockNum]), 2)
      }


    },
    // 获取当前日期
    getDateFun() {
      // 获取当前日期
      const currentDate = new Date();
      // 获取年份
      const year = currentDate.getFullYear();
      // 获取月份（注意月份从0开始，所以要加1）
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      // 获取日期
      const date = String(currentDate.getDate()).padStart(2, '0');
      // 拼接为YYYY-MM-DD格式
      const formattedDate = `${year}-${month}-${date}`;
      this.dataForm.orderDate = formattedDate;
    },
    inventoryAdjustmentFun() {
      stockTakingToAdjus(this.dataForm.id).then(res => {
        this.adjustVisible = true
        this.$nextTick(() => {
          this.$refs.adjustForm.init(res.data, 'Form')
        })
      })
    },

    // 打开选择库位弹框
    openSeleceWareDialog(row, index, type) {
      if (!this.productData[index].warehouseId) return this.$message.error("请先选择当前数据的仓库!")
      this.currentProductIndex = index
      this.wareHouseVisible = true
      this.$nextTick(() => {
        this.$refs.WareHouseForms.initData(row.warehouseId, type)
      })
    },

    // 所选的库位信息
    selectWareHouseFun(data, type) {
      console.log("库位信息", data);
      let index = this.currentProductIndex
      this.productData[index].shelfSpaceName = data.name
      this.productData[index].shelfSpaceId = data.id
      this.productData[index].shelfSpaceCode = data.code
      this.index = ""
    },
    // 表单切换仓库
    changeWarehousex(val, data) {
      console.log("data", data);
      if (!val && !data.length) {
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.warehouseType = ""
        this.dataForm.warehouseCode = ""
        return
      }
      this.allocationFlag = data[0].all.locationStatus == 'disabled' ? false : true

      this.dataForm.warehouseId = data[0].id
      this.dataForm.warehouseName = data[0].name
      this.dataForm.warehouseType = data[0].all.type
      this.dataForm.warehouseCode = data[0].all.code
      if (this.productData.length) {
        this.productData.forEach(item => {
          this.$set(item, 'allocationFlag', data[0].all.locationStatus == 'disabled' ? false : true)
          item.warehouseId = data[0].id
          item.warehouseName = data[0].name
          item.warehouseCode = data[0].all.code
          item.shelfSpaceName = ""
          item.shelfSpaceId = ""
          item.shelfSpaceCode = ""
          item.batchNumber = ""
        });
      }
    },
    // 表格选择仓库
    changeCurrentWarehousex(val, data, obj, index) {
      console.log("data", val, data, obj, index);
      if (!val && !data.length) {
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.warehouseType = ""
        this.dataForm.warehouseCode = ""
        return
      }
      this.productData[index].warehouseId = data[0].id
      this.productData[index].warehouseName = data[0].name
      this.productData[index].warehouseCode = data[0].all.code
      this.$set(this.productData[index], 'allocationFlag', data[0].all.locationStatus == 'disabled' ? false : true)


    },
    getIndex(index) {
      console.log(55, index);
    },
    // 产品信息列表复制功能
    copyFun(row, index) {
      let data = JSON.parse(JSON.stringify(row))
      this.productData.splice(index + 1, 0, data);

    },

    // 点击选择产品 
    openSeleceProductDialog() {
      this.productVisible = true
      this.productForm.productName = ''
      this.productForm.productCode = ''
      this.productForm.productDrawingNo = ''
      this.productForm.pageNum = 1
      this.productForm.pageSize = 20
      this.searchProductFun('all')
    },
    // 点击选择库存产品
    openSeleceIventOProductDialog() {
      this.productVisible = true
      this.productForm.productName = ''
      this.productForm.productCode = ''
      this.productForm.productDrawingNo = ''
      this.productForm.pageNum = 1
      this.productForm.pageSize = 20
      this.searchProductFun('invent')
    },
    searchProductFun(type) {
      this.advancedQueryFuns()
      this.type = type
      this.productForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      if (type == 'all') {

        getProducts(this.productForm).then(res => {
          // this.productList = [...this.selectSaleProductArr,...res.data.records]
          this.productList = res.data.records
          this.productTotal = res.data.total
          if (this.selectSaleProductArr.length) {
            this.selectSaleProductArr.forEach(row => {
              this.$refs.form.toggleRowSelection(row, true);
            });
          } else {
            this.$refs.multipleTable.clearSelection();
          }
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {

        getInventProduct(this.productForm).then(res => {
          this.productList = res.data.records
          this.productTotal = res.data.total
          this.listLoading = false
        })
      }



    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      val.forEach(item => {
        this.$set(item, 'productName', item.name)
        this.$set(item, 'productCode', item.code)
      });
      this.selectSaleProductArr = val
      console.log("11", this.selectSaleProductArr);
    },
    // 选择产品——重置
    resetProductFun(type) {
      this.productForm = {
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }],
      }
      this.searchProductFun(type)

    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      let arr = JSON.parse(JSON.stringify(this.selectSaleProductArr))


      arr.forEach(item => {
        if (this.type == 'all') {
          this.$set(item, 'stockNum', 0)
        } else {
          this.$set(item, 'stockNum', item.stockNum)

        }

        if (item.productSource == 'purchase') {
          this.$set(item, 'partnerTitle', '采购供应商')
          this.$set(item, 'partnerDialogTitle', '选择采购供应商')
          this.$set(item, 'partnerTreeTitle', '采购供应商分类')
          this.$set(item, 'partnerPlaceholder', '请选择采购供应商')
          this.$set(item, 'getCooperativeMethodArr', { method: getcategoryTrees, requestObj: { type: 'supplier' } })
          this.$set(item, 'partnerRequestObj', {
            code: "",
            name: "",
            taxId: "",
            mobilePhone: '',
            pageNum: 1,
            pageSize: 20,
            partnerCategoryId: "",
            type: "supplier",
          })
        } else if (item.productSource == 'out') {
          this.$set(item, 'partnerTitle', '外协供应商')
          this.$set(item, 'partnerDialogTitle', '选择外协供应商')
          this.$set(item, 'partnerTreeTitle', '外协供应商分类')
          this.$set(item, 'partnerPlaceholder', '请选择外协供应商')
          this.$set(item, 'getCooperativeMethodArr', { method: getcategoryTrees, requestObj: { type: 'outsourcing_suppliers' } })
          this.$set(item, 'partnerRequestObj', {
            code: "",
            name: "",
            taxId: "",
            mobilePhone: '',
            pageNum: 1,
            pageSize: 20,
            partnerCategoryId: "",
            type: "outsourcing_suppliers",
          })


        }


1
        this.$set(item, 'num', '')
        this.$set(item, 'diffNum', '')
        this.$set(item, 'shelfSpaceId', item.shelfSpaceId)
        this.$set(item, 'shelfSpaceName', item.shelfSpaceName)
        this.$set(item, 'shelfSpaceCode', item.shelfSpaceCode)
        this.$set(item, 'batchNumber', item.batchNumber)
        this.$set(item, 'productsId', item.id)
        this.$set(item, 'allocationFlag', item.locationStatus == 'disabled' ? false : true)
        this.$set(item, 'specSize', '')
        this.$set(item, 'logo', '')
        this.$set(item, 'divideEqually', '')
        this.$set(item, 'material', '')
        this.$set(item, 'standardValue', '')
        this.$set(item, 'colour', '')
        this.$set(item, 'sealingCoverTyping', '')
        this.$set(item, 'accuracyLevel', '')
        this.$set(item, 'vibrationLevel', '')
        this.$set(item, 'oil', '')
        this.$set(item, 'clearance', '')
        this.$set(item, 'aperture', '')
        this.$set(item, 'packagingMethod', '')
        this.$set(item, 'specialRequire', '')
        this.$set(item, 'pairingModeId', '') 
        this.$set(item, 'processName', item.processName)
        this.$set(item, 'processCode', item.processCode)
        this.$set(item, 'processId', item.processId) 
        if (this.dataForm.warehouseId) {
          this.$set(item, 'warehouseName', this.dataForm.warehouseName)
          this.$set(item, 'allocationFlag', this.allocationFlag)
          this.$set(item, 'warehouseCode', this.dataForm.warehouseCode)
          this.$set(item, 'warehouseId', this.dataForm.warehouseId)
        } else {
          this.$set(item, 'warehouseName', item.warehouseName)
          this.$set(item, 'allocationFlag', item.allocationFlag)
          this.$set(item, 'warehouseId', item.warehouseId)
          this.$set(item, 'warehouseCode', item.warehouseCode)
        }

        if(item.batchNumber){
          let obj = {
            productsId:item.productsId,
            warehouseId:item.warehouseId
          }
          getBatchNumber(obj).then(res=>{
              console.log(res,'re')
              if (res.data.records && res.data.records.length !==0) {
                let data = res.data.records[0]
  
                this.$set(item, 'cooperativePartnerName', data.partnerName)
                this.$set(item, 'cooperativePartnerId', data.cooperativePartnerId)
                this.$set(item, 'cooperativePartnerCode', data.partnerCode)
              }
              
          })
        }
        // if (item.productCategoryName == '保持架') {
        //   let arr = ['pa017', 'pa021']
        //   arr.forEach(items => {
        //     let obj1 = {
        //       pageNum: -1,
        //       pageSize: 20,
        //       typeCode: items,//保持架尺寸
        //     };
        //     getbimProductAttributesList(obj1).then(res => {
        //       let list = items == 'pa017' ? 'spaceSizeList' : 'materialList'
        //       this.$set(item, list, res.data.records)
        //     })
        //   });
        // }
        // if (item.productCategoryName == '防尘盖') {
        //   let arr = ['pa018', 'pa022']
        //   arr.forEach(items => {
        //     let obj1 = {
        //       pageNum: -1,
        //       pageSize: 20,
        //       typeCode: items,//保持架尺寸
        //     };
        //     getbimProductAttributesList(obj1).then(res => {
        //       let list = items == 'pa018' ? 'spaceSizeList' : items == 'pa019' ? 'logoList' : items == 'pa020' ? 'divideEquallyList' : 'materialList'
        //       this.$set(item, list, res.data.records)
        //     })
        //   });
        // }
        // if (item.productCategoryName != '防尘盖' && item.productCategoryName != '防尘盖') {
        //   let arr = ['pa019', 'pa020',]
        //   arr.forEach(items => {
        //     let obj1 = {
        //       pageNum: -1,
        //       pageSize: 20,
        //       typeCode: items,
        //     };
        //     getbimProductAttributesList(obj1).then(res => {
        //       let list = items == 'pa019' ? 'logoList' : 'divideEquallyList'
        //       this.$set(item, list, res.data.records)
        //     })
        //   });

        // }
      });
      this.productData = [...this.productData, ...arr]


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




    getDetailFun(id) {
      detailStocktak(id).then(res => {
        console.log("详情", res);
        this.dataForm = res.data
        res.data.stockTakingLineVOList.forEach(item => {
          this.$set(item, 'productName', item.productsName)
          this.$set(item, 'productCode', item.productsCode)
          this.$set(item, 'allocationFlag', item.locationStatus == 'disabled' ? false : true)

        });
        this.productData = res.data.stockTakingLineVOList
      })
    },
    goBack() {
      this.$emit('close', true)
    },
    init(id, btnType) {
      this.oldId = JSON.parse(JSON.stringify(id))
      this.oldType = JSON.parse(JSON.stringify(btnType))

      this.btnType = btnType
      if (id) {
        this.getDetailFun(id)
        this.fetchData("KCPDDH", false)
      } else {
        this.fetchData("KCPDDH", true)
      }





      if (btnType == 'look') {
        this.title = '查看盘点单'


        // 流程信息和流转记录
        if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
      } else {
        this.getBusInfo('b045')
        this.title = btnType == 'add' ? '新建盘点单' : '编辑盘点单'
        if (btnType == 'add') {
          this.dataForm.personName = this.userInfo.userName
          this.dataForm.personId = this.userInfo.userId


          this.getDateFun()
        }
      }




    },

    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.tipsvisible = false
      this.btnLoading = false
      this.dataForm = {  //表单信息
        orderNo: "",
        warehouseName: "",
        warehouseId: "",
        warehouseType: "",
        approvalFlag: false,
        inspectionResults: "",
        personId: "",
        personName: "",
      }
      this.productData = []
      this.$refs.dataForm.resetFields()
      this.init('', 'add')
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
    async handleConfirm(submitModel) {
      console.log(this.productData);
      if (submitModel == 'submit') {

        let submitFlag = true // 自动聚焦是否可用
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {

            // 判断子表是否有效
            if (!this.productData.length && submitFlag) {
              submitFlag = false
              this.$message.error('请至少选择一个产品')
            }


            if (this.productData.length) {
              console.log(this.productData);
              let totals = {};
              let totalNum = {};
              for (let index = 0; index < this.productData.length; index++) {
                const item = this.productData[index];
                if (!item.num) {
                  submitFlag = false
                  this.$message.error("产品信息第" + (index + 1) + "行盘点数量不能为空")
                  break
                }
                if (!item.shelfSpaceId && item.allocationFlag) {
                  submitFlag = false
                  this.$message.error("产品信息第" + (index + 1) + "行库位不能为空")
                  break
                }
              }


            }




            // 自动聚焦未使用则提交
            if (submitFlag) {
              this.dataForm.documentStatus = submitModel
              const formMethod = this.btnType == 'add' ? addStocktak : editStocktak
              let arr = []
              this.productData.forEach(item => {
                let obj = {
                  batchNumber: item.batchNumber,
                  diffNum: item.diffNum,
                  num: item.num,
                  productsId: item.productsId,
                  shelfSpaceId: item.shelfSpaceId,
                  stockNum: item.stockNum,
                  warehouseId: item.warehouseId,
                  pairingModeId:item.pairingModeId,
                  specSize: item.specSize,
                  logo: item.logo,
                  divideEqually: item.divideEqually,
                  material: item.material,
                  standardValue: item.standardValue,
                  colour: item.colour,
                  sealingCoverTyping: item.sealingCoverTyping,
                  accuracyLevel: item.accuracyLevel,
                  vibrationLevel: item.vibrationLevel,
                  oil: item.oil,

                  clearance: item.clearance,
                  aperture: item.aperture,
                  packagingMethod: item.packagingMethod,
                  specialRequire: item.specialRequire,
                  cooperativePartnerName: item.cooperativePartnerName,
                  cooperativePartnerId: item.cooperativePartnerId,
                  processName: item.processName,
                  processCode: item.processCode,
                  processId: item.processId,

                }
                arr.push(obj)
              });
              let obj = {
                stockTaking: this.dataForm,
                stockTakingLineList: arr
              }




              // // 提交确认
              // if (submitModel === 'submit') {
              //   let flag = await this.$confirm('请确认信息是否正确，提交后不允许修改，是否提交！', '提交确认', { type: 'warning' }).catch(err => false)
              //   if (!flag) {
              //     console.log(dataObj)
              //     return this.btnLoading = false
              //   }
              // }
              console.log("this.productData", obj);
              this.btnLoading = true
              formMethod(obj).then(res => {
                let msg = res.msg
                if (submitModel == "draft") {
                  this.submitmethodsTitle = "保存成功"
                } else {
                  this.submitmethodsTitle = "提交成功"

                }
                if (this.btnType == 'edit') {
                  this.btnText = "继续修改"
                } else if (this.btnType == 'add') {
                  this.btnText = "继续新增"
                }
                this.tipsvisible = true

                this.btnLoading = false

              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              this.btnLoading = false
            }
          }
        })
      } else {
        const formMethod = this.btnType == 'add' ? addStocktak : editStocktak
        this.dataForm.documentStatus = submitModel
        let arr = []
        this.productData.forEach(item => {
          let obj = {
            batchNumber: item.batchNumber,
            diffNum: item.diffNum,
            num: item.num,
            productsId: item.productsId,
            shelfSpaceId: item.shelfSpaceId,
            stockNum: item.stockNum,
            warehouseId: item.warehouseId
          }
          arr.push(obj)
        });
        let obj = {
          stockTaking: this.dataForm,
          stockTakingLineList: arr
        }
        this.btnLoading = true
        formMethod(obj).then(res => {
          let msg = res.msg
          if (submitModel == "draft") {
            this.submitmethodsTitle = "保存成功"
          } else {
            this.submitmethodsTitle = "提交成功"

          }
          if (this.btnType == 'edit') {
            this.btnText = "继续修改"
          } else if (this.btnType == 'add') {
            this.btnText = "继续新增"
          }
          this.tipsvisible = true

          this.btnLoading = false

        }).catch(() => {
          this.btnLoading = false
        })
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
  padding: 5px 10px;
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

::v-deep.tips .JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 !important;
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

.JNPF-common-layout-main {
  padding-top: 0;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
}
</style>