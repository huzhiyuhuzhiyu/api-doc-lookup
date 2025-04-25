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
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="JNPF-common-layout">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading" ref="main"
              :element-loading-text="loadingText">
              <el-tabs v-model="activeName" v-if="!approvalFlag && dataForm.approvalFlag" class="JNPF-el_tabs">
                <el-tab-pane label="基础信息" name="orderInfo" class="orderInfo">
                  <el-collapse v-model="activeNames" v-loading="listLoading">
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
                            <el-form-item label="调拨日期" prop="pickingDate">
                              <el-date-picker v-model="dataForm.pickingDate" type="date" value-format="yyyy-MM-dd"
                                style="width: 100%;" placeholder="请选择调拨日期" :disabled="btnType == 'look' ? true : false">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :sm="12" :xs="24">
                            <el-form-item label="备注" prop="remark">
                              <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2"
                                maxlength="200" />
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="产品信息" name="productInfo">
                      <div v-if="btnType != 'look'">
                        <el-button type="text" style="margin-right:8px;font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" @click="scanFun()"><i
                          class="iconfont-menu icon-saoma"></i>扫码录入</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                          @click="openSeleceProductDialog()">选择产品</el-button>|
                        <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                          :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                          @click="batchDelete">批量删除</el-button>
                      </div>

                      <JNPF-table ref="product" :data="productData" :fixedNO="true" hasC v-if="tableDataFlag"
                        @selection-change="handeleProductInfoData" border :key="165" style="width: 100%;">
                        <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                        <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                        v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" />
                        <el-table-column prop="projectName" label="所属项目" min-width="120"
                        v-if="isProjectSwitch == 1" />
                        <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111"></el-table-column>
                        <el-table-column prop="inventoryQuantity" label="批次库存数量" width="180" :key="8"
                          v-if="btnType != 'look'" />
                        <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
                        <el-table-column prop="num" :label="mainUnitFlag == 1 ? '调拨数量(主)' : '调拨数量'" min-width="160">
                          <template slot="header">
                            <span class="required">*</span>{{ mainUnitFlag == 1 ? '调拨数量(主)' : '调拨数量' }}
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.num" placeholder="调拨数量" :disabled="btnType == 'look'"
                              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
                              @blur="tranNumFun(scope.row, scope.$index)">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="deputyNum" label="调拨数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="pairingModeName" label="配对方式" min-width="120"   />
                        

                        <el-table-column prop="inWarehouseName" label="目标仓库" width="160" :key="1888">
                          <template slot="header">
                            <span class="required">*</span>目标仓库
                          </template>
                          <template slot-scope="scope">
                            <ComSelect-list
                              :requestObj="{ type: '',  virtuallyFlag: false, state: 'enable', projectId: isProjectSwitch === '1' ? this.wareHouseInfo.projectId || '' : ''  }"
                              :dialogTitle="'选择仓库'" :isdisabled="btnType == 'look'" v-model="scope.row.inWarehouseName"
                              :method="getWarehouseList" placeholder="请选择仓库" :paramsObj="{ index: scope.$index }"
                              @change="changeWarehousex"></ComSelect-list>
                          </template>
                        </el-table-column>
                        <el-table-column prop="inShelfSpaceName" label="目标库位" width="160" :key="10112"
                          v-if="allocationFlag">
                          <template slot="header">
                            <span class="required">*</span>目标库位
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.inShelfSpaceName" readonly :disabled="btnType == 'look'"
                              @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="库位">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="warehouseName" label="原仓库" width="160" :key="889"></el-table-column>
                        <el-table-column prop="shelfSpaceName" label="原库位" width="160" :key="888"></el-table-column>
                        <el-table-column prop="standardValue" label="规值" min-width="120" v-if="standardValueFlag == 1" />
                    <el-table-column prop="colour" :label="$store.getters.colour"  min-width="120" v-if="colourFlag == 1" />
                    <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  min-width="140"
                      v-if="sealingCoverTypingFlag == 1"></el-table-column>
                    <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  min-width="120"
                      v-if="accuracyLevelFlag == 1"></el-table-column>
                    <el-table-column prop="vibrationLevel" label="振动等级" min-width="120"
                      v-if="vibrationLevelFlag == 1"></el-table-column>
                    <el-table-column prop="oil" label="油脂" min-width="120" v-if="oilFlag == 1"></el-table-column>
                    <el-table-column prop="clearance" label="游隙" min-width="120"
                      v-if="clearanceFlag == 1"></el-table-column>
                    <el-table-column prop="aperture" label="孔径" min-width="120"
                      v-if="apertureFlag == 1"></el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" min-width="120"
                      v-if="packagingMethodFlag == 1"></el-table-column>
                    <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  min-width="120"
                      v-if="specialRequireFlag == 1"></el-table-column>
                        <el-table-column prop="processName" label="工序" width="120" :key="105"></el-table-column>

                        <el-table-column prop="remark" label="备注" width="200" :key="128"></el-table-column>
                        <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'">
                          <template slot-scope="scope">
                            <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                          </template>
                        </el-table-column>
                      </JNPF-table>

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
                        <el-form-item label="调拨日期" prop="pickingDate">
                          <el-date-picker v-model="dataForm.pickingDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择调拨日期" :disabled="btnType == 'look' ? true : false">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2"
                            maxlength="200" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="产品信息" name="productInfo">
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

                  <JNPF-table ref="product" :data="productData" :fixedNO="true"
                    @selection-change="handeleProductInfoData" :hasC="btnType !== 'look'" border :key="165" style="width: 100%;">
                    <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                    <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" />
                    <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                    v-if="isProjectSwitch == 1" />
                    <el-table-column prop="batchNumber" label="批次号" width="200" :key="10111"></el-table-column>
                    <el-table-column prop="inventoryQuantity" label="批次库存数量" width="180" :key="8"
                      v-if="btnType != 'look'" />
                    <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
                    <el-table-column prop="num" :label="mainUnitFlag == 1 ? '调拨数量(主)' : '调拨数量'" min-width="160">
                      <template slot="header">
                        <span class="required">*</span>{{ mainUnitFlag == 1 ? '调拨数量(主)' : '调拨数量' }}
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.num" placeholder="调拨数量" :disabled="btnType == 'look'"
                          oninput="value=value.replace(/^(0+)|[^\d]+/g,'')" @blur="tranNumFun(scope.row, scope.$index)">
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />
                    <el-table-column prop="deputyNum" label="调拨数量(副)" min-width="120" v-if="mainUnitFlag == 1" />
                        <el-table-column prop="pairingModeName" label="配对方式" min-width="120"   />
                    <el-table-column prop="inWarehouseName" label="目标仓库" width="160" :key="1888">
                      <template slot="header">
                        <span class="required">*</span>目标仓库
                      </template>
                      <template slot-scope="scope">
                        <ComSelect-list
                          :requestObj="{ type: '',  virtuallyFlag: false, state: 'enable' }"
                          :dialogTitle="'选择仓库'" :isdisabled="btnType == 'look'" v-model="scope.row.inWarehouseName"
                          :method="getWarehouseList" placeholder="请选择仓库" :paramsObj="{ index: scope.$index }"
                          @change="changeWarehousex"></ComSelect-list>
                      </template>
                    </el-table-column>
                    <el-table-column prop="inShelfSpaceName" label="目标库位" width="160" :key="10112"
                      v-if="allocationFlag">
                      <template slot="header">
                        <span class="required">*</span>目标库位
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.inShelfSpaceName" readonly :disabled="btnType == 'look'"
                          @focus="openSeleceWareDialog(scope.row, scope.$index)" placeholder="库位">
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="warehouseName" label="原仓库" width="160" :key="889"></el-table-column>
                    <el-table-column prop="shelfSpaceName" label="原库位" width="160" :key="888"></el-table-column>
                    <el-table-column prop="standardValue" label="规值" min-width="120" v-if="standardValueFlag == 1" />
                    <el-table-column prop="colour" label="颜色" min-width="120" v-if="colourFlag == 1" />
                    <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120"
                      v-if="sealingCoverTypingFlag == 1"></el-table-column>
                    <el-table-column prop="accuracyLevel" label="精度等级" min-width="120"
                      v-if="accuracyLevelFlag == 1"></el-table-column>
                    <el-table-column prop="vibrationLevel" label="振动等级" min-width="120"
                      v-if="vibrationLevelFlag == 1"></el-table-column>
                    <el-table-column prop="oil" label="油脂" min-width="120" v-if="oilFlag == 1"></el-table-column>
                    <el-table-column prop="clearance" label="游隙" min-width="120"
                      v-if="clearanceFlag == 1"></el-table-column>
                    <el-table-column prop="aperture" label="孔径" min-width="120"
                      v-if="apertureFlag == 1"></el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" min-width="120"
                      v-if="packagingMethodFlag == 1"></el-table-column>
                    <el-table-column prop="specialRequire" label="特殊要求" min-width="120"
                      v-if="specialRequireFlag == 1"></el-table-column>
                    <el-table-column prop="processName" label="工序" width="120" :key="105"></el-table-column>

                    <el-table-column prop="remark" label="备注" width="200" :key="128"></el-table-column>
                    <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'">
                      <template slot-scope="scope">
                        <el-button type="text" @click="copyFun(scope.row, scope.$index)" size="mini">复制</el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>

                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </div>
      <!-- 选择产品 产品信息 -->
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.productName" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.batchNumber" placeholder="请输入批次号" clearable />
                  </el-form-item>
                </el-col>



                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchAllProduct()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetAllProduct()">{{
                      $t('common.reset')
                    }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="allproductData" hasC @sort-change="sortChange" :fixedNO="true"
                @selection-change="handleSelectionChangeAllPruduct" ref="dataTable" @row-click="handleRowClick">
                <el-table-column prop="partnerName" label="供应商名称" min-width="160" />
                <el-table-column prop="partnerCode" label="供应商编码" min-width="160" />
                <el-table-column prop="productCode" label="产品编码" sortable="custom" min-width="120" />
                <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="160"
                  sortable="custom"></el-table-column>
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                v-if="isProjectSwitch == 1" />
                <el-table-column prop="productCategoryName" label="产品分类" sortable="custom" min-width="120" />
                <el-table-column prop="batchNumber" label="批次号" sortable="custom" min-width="180" />
                <el-table-column prop="mainUnit" :label="mainUnitFlag == 1 ? '单位(主)' : '单位'" min-width="120" />
                <el-table-column prop="deputyUnit" label="单位(副)" min-width="120" v-if="mainUnitFlag == 1" />

                <el-table-column prop="inventoryQuantity" label="批次库存数量" sortable="custom" min-width="160"
                  v-if="btnType != 'look'" />
                <el-table-column prop="inspectionResults" label="检验结果" sortable="custom" min-width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.inspectionResults == 'qualified'">合格</div>
                    <div v-if="scope.row.inspectionResults == 'unqualified'">不合格</div>
                    <div v-if="scope.row.inspectionResults == 'partially_qualified'">部分合格</div>
                    <div v-if="scope.row.inspectionResults == 'discard'">报废</div>
                    <div v-if="scope.row.inspectionResults == 'concessive_acceptance'">让步接收</div>
                  </template>
                </el-table-column>
                <el-table-column prop="warehouseName" label="仓库" sortable="custom" min-width="120" />
                <el-table-column prop="shelfSpaceName" label="库位" sortable="custom" min-width="120" />
                <el-table-column prop="pairingModeName" label="配对方式" min-width="120"   />

                <el-table-column prop="standardValue" label="规值" min-width="120" v-if="standardValueFlag == 1" />
                    <el-table-column prop="colour" :label="$store.getters.colour"  min-width="120" v-if="colourFlag == 1" />
                    <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  min-width="140"
                      v-if="sealingCoverTypingFlag == 1"></el-table-column>
                    <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  min-width="120"
                      v-if="accuracyLevelFlag == 1"></el-table-column>
                    <el-table-column prop="vibrationLevel" label="振动等级" min-width="120"
                      v-if="vibrationLevelFlag == 1"></el-table-column>
                    <el-table-column prop="oil" label="油脂" min-width="120" v-if="oilFlag == 1"></el-table-column>
                    <el-table-column prop="clearance" label="游隙" min-width="120"
                      v-if="clearanceFlag == 1"></el-table-column>
                    <el-table-column prop="aperture" label="孔径" min-width="120"
                      v-if="apertureFlag == 1"></el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" min-width="120"
                      v-if="packagingMethodFlag == 1"></el-table-column>
                    <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  min-width="120"
                      v-if="specialRequireFlag == 1"></el-table-column>
                <el-table-column prop="processName" label="工序" width="120" sortable="custom" min-width="160"
                  :key="1100"></el-table-column>
              </JNPF-table>
              <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum"
                :limit.sync="ProductListRequestObj.pageSize" @pagination="initData2" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="allProVisible = false">{{ $t('common.cancelButton') }}</el-button>
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
      <!-- 选库位 -->
      <WareHouseForm v-if="wareHouseVisible" ref="WareHouseForms" @selectWareHouseFun="selectWareHouseFun">
      </WareHouseForm>

    </div>
  </transition>
</template>

<script>
import { getWarehouseList, getWarehouseInfo, getStockGoodsShelvesList, getProductionLotList, getBimBusinessSwitchConfigList, getBatchNumber, getStockGoodsShelves,getOrderFiledMap } from '@/api/basicData/index'
import { getProductList } from '@/api/masterDataManagement/productManage'
import { addTransferData, updateTransferData, detailTransferData, TransferBarCode } from '@/api/warehouseManagement/transferManagement'
import { getclassAttributelistByCode } from '@/api/masterDataManagement/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import flowMixin from '@/mixins/generator/flowMixin'
import WareHouseForm from './wareHouseForm.vue'
export default {
  components: { WareHouseForm, Process, recordList },
  mixins: [flowMixin, busFlow,getProjectList],
  
  data() {
    return {
      scanDialog: false,
      getWarehouseList,
      treeLoading: false,
      ProductTreeData: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      activeName: 'orderInfo',
      dataForm: {
        orderNo: "",
        pickingDate: "",
        remark: "",
        id: "",
        documentStatus: "",
        classAttribute: "",
        approvalFlag: false
      },
      // 选择全部产品参数
      allProVisible: false,

      title: "",
      allproductData: [],
      allProductTotal: 0,
      wareHouseVisible: false,
      ProductListRequestObj: {
        classAttributeList: "",
        productDrawingNo: "",
        productCategoryId: "",
        batchNumber: "",
        availableBatch: 1,
        inspectStockFlag: true,
        productCode: "",
        warehouseId: "",
        productName: "",
        orderItems: [{
          "asc": false,
          "column": ""
        },],
        pageNum: 1,
        pageSize: 20,
      },
      selectArr: [],
      btnText: "",
      submitmethodsTitle: "",
      tipsvisible: false,
      activeNames: ["productInfo", "basicInfo"],
      codeConfig: {},//单号配置信息(单据规则)
      dataRule: {
        pickingDate: [{ required: true, message: "调拨日期不能为空", trigger: 'change' }],
        orderNo: [{ required: true, message: "单号不能为空", trigger: 'blur' }],

      },
      productData: [],
      selectRows: [],
      listLoading: false,
      currentProductIndex: "",
      btnType: false,
      visible: true,
      wareVisibled: false,
      btnLoading: false,
      formLoading: false,
      allocationFlag: false,
      spaceLines: [],
      loadingText: '',
      copyLinesData: [],
      previousValue: "",
      taxRateList: [],
      classAttribute: "",
      warehouseCode: "",
      classAttributeList: [],
      wareHouseInfo: {},
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      tableDataFlag: false,
      mainUnitFlag: null,
      isProjectSwitch: '',
      isProductNameSwitch: "",
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
    }
  },


  async created() {
    this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')

  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getMainUnitFun('deputyUnit', 'warehouseDeputyUnit')

  },
  methods: {
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
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getMainUnitFun(code, type) {
      this.listLoading = true
      try {
        this.mainUnitFlag = await this.jnpf.getMainUnitFun(code, type);
        this.tableDataFlag = true
        this.listLoading = false


      } catch (error) {
      }
    },
    tranNumFun(row, index) {
      if (row.calculationDirection == 'multiplication') {
        this.productData[index].deputyNum = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.ratio]), 6)
      } else {
        this.productData[index].deputyNum = this.jnpf.numberFormat(this.jnpf.math('divide', [row.num, row.ratio]), 6)
      }
    },
    getProductFun() {
      console.log(21341234);
      console.log(this.scanResult);
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
      obj.projectId = this.isProjectSwitch === '1' ? this.wareHouseInfo.projectId || '' : ''
      getProductList(obj).then(res => {
        console.log("产品信息", res);
        res.data.records.forEach(item => {
          item.productCode = item.code
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
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.dataForm.orderItems[0].asc = order === "ascending"
      this.dataForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    //多选
    handleRowClick(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },

    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {

      this.allProVisible = true
      let arr = [];
      this.ProductListRequestObj = {
        classAttributeList: "", 
        productDrawingNo: "",
        productCategoryId: "",
        batchNumber: "",
        availableBatch: 1,
        inspectStockFlag: true,
        warehouseId: "",

        productCode: "",
        productName: "",
        orderItems: [{
          "asc": false,
          "column": ""
        },],
        pageNum: 1,
        pageSize: 20,
      }
      this.allproductData = []
      this.initData2()


    },
    // 获取所有产品列表数据
    initData2() {
      this.listLoading = true
      // this.ProductListRequestObj.classAttributeList = this.classAttributeList

      // this.ProductListRequestObj.warehouseId = this.wareHouseInfo.id
      console.log(this.wareHouseInfo);
      this.ProductListRequestObj.projectId = this.isProjectSwitch === '1' ? this.wareHouseInfo.projectId || '' : ''
      getBatchNumber(this.ProductListRequestObj).then(listRes => {
        if (Array.isArray(listRes.data)) {
          this.allproductData = listRes.data
        } else {
          this.allproductData = listRes.data.records
        }
        this.allProductTotal = listRes.data.total
        this.$forceUpdate()
        this.treeLoading = false
        this.listLoading = false
      })
    },
    // 搜索所有产品 列表
    searchAllProduct() {
      this.ProductListRequestObj.pageNum = 1
      this.initData2()
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.ProductListRequestObj = {
        classAttributeList: "", 
        productDrawingNo: "",
        productCategoryId: "",
        batchNumber: "",
        availableBatch: 1,
        inspectStockFlag: true,
        productCode: "",
        productName: "",
        warehouseId: "",
        orderItems: [{
          "asc": false,
          "column": ""
        },],
        pageNum: 1,
        pageSize: 20,
      },
        this.searchAllProduct()
    },
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val


    },
    submitAllProduct() {
      this.allProVisible = false
      this.selectArr.forEach(item => {
        this.$set(item, 'num', JSON.parse(JSON.stringify(item.inventoryQuantity)))
        if (item.calculationDirection == 'multiplication') {
          this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6))
        } else {
          this.$set(item, 'deputyNum', this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6))
        }

      })
      this.productData = [...this.productData, ...this.selectArr]
      console.log(this.productData);
      // this.productData=[...this.productData,...this.selectArr]
    },



    // 打开选择库位弹框
    openSeleceWareDialog(row, index) {
      if (!row.inWarehouseId) return this.$message.error("请先选择目标仓库!")
      this.wareHouseVisible = true
      this.$nextTick(() => {
        this.$refs.WareHouseForms.initData(row.inWarehouseId)
      })
      this.currentProductIndex = index
    },
    // 所选的库位信息
    selectWareHouseFun(data) {
      console.log("库位信息", data);
      let index = this.currentProductIndex
      this.$set(this.productData[index], 'inShelfSpaceName', data.name)
      this.$set(this.productData[index], 'inAreaId', data.areaId)
      this.$set(this.productData[index], 'inGoodsShelvesId', data.goodsShelvesId)
      this.$set(this.productData[index], 'inWarehouseId', data.warehouseId)
      this.$set(this.productData[index], 'inShelfSpaceId', data.id)
    },
    // 产品信息列表复制功能
    copyFun(row, index) {
      let data = JSON.parse(JSON.stringify(row))
      this.productData.splice(index + 1, 0, data);

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

    currentIndexFun(index) {
      console.log(index);
    },
    changeWarehousex(val, data, index) {
      console.log("data", val, data, index);
      if (!val && !data.length) {
        this.productData[index.index].inWarehouseId = ''
        this.productData[index.index].warehouseName = ''
        this.productData[index.index].warehouseType = ""
        return
      }
      this.allocationFlag = data[0].all.locationStatus == 'disabled' ? false : true
      this.$set(this.productData[index.index], 'inWarehouseId', data[0].id)
      this.$set(this.productData[index.index], 'inWarehouseName', data[0].name)
      this.$set(this.productData[index.index], 'warehouseType', data[0].all.type)
      console.log(this.productData);

    },
    goBack() {
      this.$emit('close', true)
    },
    // 获取仓库id
    getWarehouseListFun() {
      getWarehouseList({ code: this.warehouseCode }).then(res => {
        this.dataForm.warehouseName = res.data[0].name
        this.dataForm.warehouseId = res.data[0].id
        // 获取仓库详情信息
        getWarehouseInfo(res.data[0].id).then(response => {
          this.wareHouseInfo = response.data
          this.dataForm.warehouseType = response.data.type
          this.allocationFlag = response.data.locationStatus == 'disabled' ? false : true
        })
      })
    },
    init(id, btnType, approvalFlag, warehouseCode) {
      console.log(warehouseCode);
      // this.visible = true
      this.formLoading = true
      this.approvalFlag = approvalFlag
      this.oldId = JSON.parse(JSON.stringify(id)) || ""
      this.oldType = JSON.parse(JSON.stringify(btnType))
      this.dataForm.id = id
      this.warehouseCode = warehouseCode
      this.btnType = btnType
      console.log("btnty", btnType);
      if (btnType != 'look') {
        this.getclassAttributeList()
        this.getWarehouseListFun()
      }
      // this.refeshDataFormItems()
      if (id) {
        this.title = btnType == 'look' ? '查看调拨单' : '编辑调拨单'
        // 获取详情
        this.fetchData("DBDH", false)

        detailTransferData(id).then(res => {
          console.log("详情", res);
          this.formLoading = false
          this.dataForm = res.data.picking
          res.data.lines.forEach(item => {
            item.warehouseName = item.outWarehouseName
            item.shelfSpaceName = item.outShelfSpaceName
          });
          this.productData = res.data.lines
          if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
        }).catch(() => { this.formLoading = false })
      } else {
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
        this.dataForm.pickingDate = formattedDate;
        this.title = '新建调拨单'
        this.formLoading = false
        this.fetchData("DBDH", true)
        this.getBusInfo('b051')


      }

    },
    getclassAttributeList() {
      getclassAttributelistByCode({ code: this.warehouseCode }).then(res => {
        console.log("类别属性", res);
        this.classAttributeList = res.data
      })
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
        pickingDate: "",
        remark: "",
      }
      this.fetchData("DBDH",true)
      this.getBusInfo('b051')
      this.productData = []
      this.$refs.dataForm.resetFields()
    },

    async handleConfirm(submitModel) {

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let submitFlag = true // 自动聚焦是否可用
          // 判断子表是否有效
          if (!this.productData.length && submitFlag) {
            submitFlag = false
            this.$message.error('请至少选择一个产品')
          }


          if (this.productData.length) {
            let totals = {};
            let totalNum = {};
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行调拨数量不能为空")
                break
              }
              if (!item.inWarehouseId) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行目标仓库不能为空")
                break
              }
              if (!item.inShelfSpaceId && this.allocationFlag) {
                submitFlag = false
                this.$message.error("产品信息第" + (index + 1) + "行目标库位不能为空")
                break
              }
            }


          }




          // 自动聚焦未使用则提交
          if (submitFlag) {
            this.dataForm.documentStatus = submitModel
            this.dataForm.transferType = 'allocate_transfer'

            let obj = {
              picking: this.dataForm,
              lines: [],
              flowData: this.flowData
            }
            let arr = []
            this.productData.forEach(item => {
              let obj = {
                accuracyLevel: item.accuracyLevel,
                batchNumber: item.batchNumber,
                calculationDirection: item.calculationDirection,
                classAttribute: item.classAttribute,
                clearance: item.clearance,
                inAreaId: item.inAreaId,
                inGoodsShelvesId: item.inGoodsShelvesId,
                inShelfSpaceId: item.inShelfSpaceId,
                inWarehouseId: item.inWarehouseId,
                mainUnit: item.mainUnit,
                num: item.num,
                oil: item.oil,
                id: this.dataForm.id ? item.id : "",
                deputyNum: item.calculationDirection == 'multiplication' ? this.jnpf.numberFormat(this.jnpf.math('multiply', [item.num, item.ratio]), 6) : this.jnpf.numberFormat(this.jnpf.math('divide', [item.num, item.ratio]), 6),
                deputyUnit: item.deputyUnit,
                outAreaId: item.areaId,
                outGoodsShelvesId: item.goodsShelvesId,
                outShelfSpaceId: item.shelfSpaceId,
                outWarehouseId: item.warehouseId,
                processId: item.processId,
                productsId: item.productsId,
                ratio: item.ratio,
                packagingMethod:item.packagingMethod,
                sealingCoverTyping: item.sealingCoverTyping,
                standardValue: item.standardValue,
                vibrationLevel: item.vibrationLevel,
                pairingModeId:item.pairingModeId,
                specialRequire:item.specialRequire,
              }
              arr.push(obj)
            });
            obj.lines = arr
            const formMethod = this.dataForm.id ? updateTransferData : addTransferData
            // spaceLines每一项的产品id如果与linesList项的产品id相同，那么让spaceLines项的批次号也等于linesList项的批次号


            formMethod(obj).then(res => {
              let msg = res.msg
              if (res.msg === 'Success') { msg = submitModel == "submit" ? "提交成功" : "保存成功" }
              if (submitModel == "draft") {
                this.submitmethodsTitle = "保存成功"
              } else {
                this.submitmethodsTitle = "提交成功"

              }
              if (this.btnType == 'edit') {
                this.btnText = "继续修改"
              } else if (this.btnType == 'add' || this.btnType == 'copy') {
                this.btnText = "继续新增"
              }
              this.tipsvisible = true


            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            this.btnLoading = false
          }
        }
      })



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



.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}

.JNPF-common-layout-main.JNPF-flex-main {
  padding-top: 5px;
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

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px !important;
}

::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  padding: 0;
}
</style>
