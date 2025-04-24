<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="$emit('close')" :content="(btnType === 'add' ? '新建' : btnType === 'edit' ? '编辑' : '查看') + '客户产品价格'" />
        <div class="options">

          <el-button size="mini" type="primary" v-if="btnType !== 'look'" :loading="btnLoading" @click="handleConfirm('submit')">
            提交</el-button>
          <el-button size="mini" @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
          <el-button size="mini" type="primary" v-has="'btn_change'" :loading="btnLoading" @click="getSwitchList">
            切换</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading" ref="main" :element-loading-text="loadingText">
        <el-tabs v-model="activeName" v-if="!approvalFlag" class="JNPF-el_tabs">
          <el-tab-pane label="基础信息" name="orderInfo" class="orderInfo" v-if="switchlist">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="客户" prop="cooperativePartnerIdText">
                        <ComSelect-page key="partner" ref="ComSelect-page" :value="dataForm.cooperativePartnerIdText" @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类" placeholder="请选择客户" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }" :listMethod="getCooperativeData" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList" :treeNodeClick="yxPartnerTreeNodeClick" :isdisabled="btnType == 'look'" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="有效时间起止" prop="validDateArr">

                        <el-date-picker v-model="dataForm.validDateArr" type="daterange" value-format="yyyy-MM-dd" :disabled='btnType == "look"' style="width: 100%;" start-placeholder="有效时间起" end-placeholder="有效时间止" clearable>
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>

              <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                <div v-if="btnType === 'add'">
                  <el-button type="text" style="margin-right:8px;margin-left:5px ;font-size:14px!important" icon="el-icon-plus" @click="addProduct">选择产品</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:5px ;font-size:14px!important" icon="el-icon-plus" @click="importProductFun">导入产品</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important" icon="el-icon-delete" @click="historyPriceFun">历史价格</el-button>
                </div>

                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.lines" @selection-change="handeleProductInfoData" v-bind="customStyleData">
                    <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType === 'add'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                    <el-table-column prop="customerProductNo" label=" 客户料号" min-width="160">
                      <template slot="header">
                        <span class="required">*</span> 客户料号（编码）
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'customerProductNo'" :rules='productRules.customerProductNo'>
                          <el-input :title="scope.row.customerProductNo" v-model="scope.row.customerProductNo" placeholder="请输入" :disabled="btnType == 'look'">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="customerProductName" label=" 客户产品名称" min-width="160">
                  
                      <template slot-scope="scope">
                        <el-form-item  >
                          <el-input   v-model="scope.row.customerProductName" placeholder="请输入" :disabled="btnType == 'look'">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="application" label="应用（规格型号）" min-width="160">
                      <template slot-scope="scope">
                        <el-form-item>
                          <el-input v-model="scope.row.application" placeholder="请输入" :disabled="btnType === 'look'">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                      show-overflow-tooltip></el-table-column>
                    <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="productDrawingNo" label="品名规格" min-width="330">
                      <template slot="header">
                        <span class="required">*</span> 品名规格
                      </template>
                      <template slot-scope="scope">
                        <el-autocomplete v-model="scope.row.productDrawingNo" :fetch-suggestions="querySearchAsync" placeholder="请输入" prefix-icon="el-icon-search" style="width: 100%;" @stop.keyup.enter.native="searchDrawingNoProduct(scope.row, scope.$index)" :disabled="btnType == 'look'" @select="handleSelect(scope.row, scope.$index, $event)"></el-autocomplete>

                      </template>
                      <!-- @select="handleSelect(scope.row, scope.$index, $event)" -->
                    </el-table-column>
                    <el-table-column prop="pairingModeName" label="配对方式" min-width="160">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.pairingModeId" placeholder="请选择配对方式" style="width: 100%;" :disabled="btnType == 'look' ? true : false">
                          <el-option v-for="item in pairingModeList" size="small" :key="item.id" :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </template>

                    </el-table-column>
                    <el-table-column prop="mainUnit" label="单位" width="80" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="price" label="单价(含税)" width="120">
                      <template slot="header">
                        <span class="required">*</span>单价(含税)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'price'" :rules='productRules.price'>
                          <el-input v-model="scope.row.price" placeholder="单价" :disabled="btnType === 'look'" maxlength="20" @input="watchPrice(scope.row, scope.$index)" oninput="value=value.replace(/[^0-9.]/g,'')">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="taxRate" label="税率" width="140">
                      <template slot="header">
                        <span class="required">*</span>税率
                      </template>
                      <!-- <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'taxRate'" :rules='productRules.taxRate'>
                          <el-input v-model="scope.row.taxRate" placeholder="请输入税率" :disabled="status" maxlength="2"
                            style="width: 135px;" oninput="value=value.replace(/[^0-9.]/g,'')"
                            @input="watchnums(scope.row, scope.$index)" />
                        </el-form-item>
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.taxRate" placeholder="税率" style="width: 100%;" :disabled="btnType === 'look'" @change="changeTaxRate(scope.row, scope.$index)">
                          <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName" :value="item.taxRate"></el-option>
                        </el-select>
                      </template>

                    </el-table-column>
                    <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="150" show-overflow-tooltip>
                    </el-table-column>
                    <!-- <el-table-column prop="totalTaxAmount" label="税额" width="150" show-overflow-tooltip>
                    </el-table-column> -->

                    <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  width="120" v-if="sealingCoverTypingFlag === '1'" :key="211">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                          <el-option v-for="(item, index) in list1" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  width="120" v-if="accuracyLevelFlag === '1'" :key="123">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.accuracyLevel" filterable allow-create placeholder="请选择" clearable>
                          <el-option v-for="(item, index) in list2" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="vibrationLevel" label="振动等级" width="120" v-if="vibrationLevelFlag === '1'" :key="17">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.vibrationLevel" filterable allow-create placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list3" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="oil" label="油脂" width="120" v-if="oilFlag === '1'" :key="61">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.oil" filterable allow-create placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list4" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="oilQuantity" label="油脂量" width="120" v-if="oilQuantityFlag === '1'" :key="51">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.oilQuantity" placeholder="请选择" filterable allow-create clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list5" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clearance" label="游隙" width="120" v-if="clearanceFlag === '1'" :key="100">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.clearance" placeholder="请选择" filterable allow-create clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list6" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" width="120" v-if="packagingMethodFlag === '1'" :key="101">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.packagingMethod" placeholder="请选择" filterable allow-create clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list7" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  width="120" v-if="specialRequireFlag === '1'" key="specialRequire">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.specialRequire" placeholder="请选择" filterable allow-create clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list8" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="material" label="保持架材质" width="120" :key="102" v-if="materialFlag === '1'">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.material" placeholder="请选择" filterable allow-create clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list9" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="colour" :label="$store.getters.colour"  width="120" :key="105" v-if="colourFlag === '1'">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.colour" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                          <el-option v-for="(item, index) in list10" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="protrusion" :label="$store.getters.protrusion"  width="120" :key="103" v-if="protrusionFlag === '1'">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.protrusion" placeholder="请选择" filterable allow-create clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list11" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="preload" label="预负荷" width="120" :key="104" v-if="preloadFlag === '1'">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.preload" placeholder="请选择" filterable allow-create clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list12" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="angle" label="角度" width="120" :key="104" v-if="angleFlag === '1'">
                      <template slot-scope="scope">
                        <el-select :disabled="btnType === 'look'" v-model="scope.row.angle" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                          <el-option v-for="(item, index) in list13" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="centerDiameter" label="钢球/中心径/倒角" min-width="200" v-if="centerDiameterFlag === '1'">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.centerDiameter" placeholder="请输入钢球/中心径/倒角" :disabled="btnType === 'look'" />
                      </template>
                    </el-table-column>

                    <el-table-column prop="remark" label="备货工艺备注" min-width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备货工艺备注" :disabled="btnType === 'look'" maxlength="200" />
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'add'">
                      <template slot-scope="scope">
                        <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>

                  </el-table>
                  <!-- <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin:0 10px">总数量：{{ totalNum }}</span>
                    <span style="font-weight:500;margin:0 10px">总金额：{{ totalAmount }}</span>
                  </div> -->
                </el-form>
              </el-collapse-item>

            </el-collapse>

          </el-tab-pane>
          <el-tab-pane label="基础信息" name="orderInfo" class="orderInfo" v-else>
            <el-descriptions class="margin-top"  :size="size" border v-for="item in dataFormTwo.lines" :key="item.id">
              <el-descriptions-item label="客户名称" :span="2">
                {{ dataForm.cooperativePartnerIdText }}
              </el-descriptions-item>
              <el-descriptions-item label="客户型号" :span="2">
                {{item.customerProductNo}}
              </el-descriptions-item>
              <el-descriptions-item label="角度/游隙" :span="2">
                {{item.angle}}/{{item.clearance}}
              </el-descriptions-item>
              <el-descriptions-item label="系统选型" :span="2">
                {{item.productDrawingNo}}
              </el-descriptions-item>
              <el-descriptions-item label="配对方式" :span="2">
                {{item.pairingModeName}}
              </el-descriptions-item>
              <el-descriptions-item label="精度/振动" :span="2">
                {{item.accuracyLevel}}/{{ item.vibrationLevel }}
              </el-descriptions-item>
              <el-descriptions-item label="预负荷/钢球名称" :span="2">
                {{item.preload}}/{{ item.protrusion }}
              </el-descriptions-item>
              <el-descriptions-item label="球中心/倒角" :span="2">
                {{ item.centerDiameter }}
              </el-descriptions-item>
              <el-descriptions-item label="打字" :span="2">
                {{item.sealingCoverTyping}}
              </el-descriptions-item>
              <el-descriptions-item label="保持架" :span="2">
                {{item.material}}
              </el-descriptions-item>
              <el-descriptions-item label="包装" :span="2">
                {{item.packagingMethod}}
              </el-descriptions-item>
              <el-descriptions-item label="油脂" :span="2">
                {{item.oil}}
              </el-descriptions-item>
              <el-descriptions-item label="备货工艺备注" :span="4">
                {{item.specialRequire}}
              </el-descriptions-item>
            </el-descriptions>

          </el-tab-pane>
          <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
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
                  <el-form-item label="客户" prop="cooperativePartnerIdText">
                    <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.cooperativePartnerIdText" @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类" placeholder="请选择客户" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }" :listMethod="getCooperativeData" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList" :treeNodeClick="yxPartnerTreeNodeClick" :isdisabled="btnType === 'look'" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="有效时间起止" prop="validDateArr">
                    <el-date-picker v-model="dataForm.validDateArr" type="daterange" value-format="yyyy-MM-dd" :disabled='btnType == "look"' style="width: 100%;" start-placeholder="有效时间起" end-placeholder="有效时间止" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item title="产品信息" name="productInfo">
            <div v-if="btnType == 'add'">
              <el-button type="text" style="margin-right:8px;margin-left:5px ;font-size:14px!important" icon="el-icon-plus" @click="addProduct">选择产品</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important" icon="el-icon-plus" @click="importProductFun">导入产品</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important" icon="el-icon-delete" @click="historyPriceFun">历史价格</el-button>
            </div>

            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.lines" @selection-change="handeleProductInfoData" v-bind="customStyleData">
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="btnType === 'add'" key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="customerProductNo" label=" 客户料号" min-width="120">
                  <template slot="header">
                    <span class="required">*</span> 客户料号（编码）
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'customerProductNo'" :rules='productRules.customerProductNo'>
                      <el-input :title="scope.row.customerProductNo" v-model="scope.row.customerProductNo" placeholder="请输入" :disabled="btnType == 'look'">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="customerProductName" label=" 客户产品名称" min-width="160">
                  
                  <template slot-scope="scope">
                    <el-form-item  >
                      <el-input   v-model="scope.row.customerProductName" placeholder="请输入" :disabled="btnType == 'look'">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="application" label="应用（规格型号）" min-width="160">
                      <template slot-scope="scope">
                        <el-form-item>
                          <el-input v-model="scope.row.application" placeholder="请输入" :disabled="btnType === 'look'">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="330">
                  <template slot="header">
                    <span class="required">*</span> 品名规格
                  </template>
                  <template slot-scope="scope">
                    <el-autocomplete v-model="scope.row.productDrawingNo" :fetch-suggestions="querySearchAsync" placeholder="请输入" prefix-icon="el-icon-search" style="width: 100%;" @stop.keyup.enter.native="searchDrawingNoProduct(scope.row, scope.$index)" :disabled="btnType == 'look'" @select="handleSelect(scope.row, scope.$index, $event)"></el-autocomplete>

                    <!-- <el-input v-model="scope.row.drawingNo" placeholder="请输入" :disabled="status" maxlength="100"
                            style="width: 100%;"  /> -->
                  </template>
                </el-table-column>
                <el-table-column prop="pairingModeName" label="配对方式" min-width="160">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.pairingModeId" placeholder="请选择配对方式" style="width: 100%;" :disabled="btnType == 'look' ? true : false">
                      <el-option v-for="item in pairingModeList" size="small" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                  </template>

                </el-table-column>

                <el-table-column prop="mainUnit" label="单位" width="80" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="num" label="数量" width="120">
                    <template slot="header">
                      <span class="required">*</span>数量
                    </template>
                    <template slot-scope="scope">
                      <el-form-item :prop="'lines.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                        <el-input :title="scope.row.num" v-model="scope.row.num" placeholder="数量" :disabled="status"
                          maxlength="11" @input="watchnums(scope.row, scope.$index)"
                          oninput="value=value.replace(/[^0-9.]/g,'')">
                        </el-input>
                      </el-form-item>
                    </template>
                  </el-table-column> -->

                <el-table-column prop="price" label="单价(含税)" width="120">
                  <template slot="header">
                    <span class="required">*</span>单价(含税)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'price'" :rules='productRules.price'>
                      <el-input v-model="scope.row.price" placeholder="单价" :disabled="btnType === 'look'" maxlength="20" @input="watchPrice(scope.row, scope.$index)">
                      </el-input>
                      <!-- <el-input v-model="scope.row.price" placeholder="单价" :disabled="btnType === 'look'" maxlength="20" @input="watchPrice(scope.row, scope.$index)" oninput="value=value.replace(/[^0-9.]/g,'')">
                      </el-input> -->
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="taxRate" label="税率" width="140">
                  <template slot="header">
                    <span class="required">*</span>税率
                  </template>
                  <!-- <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'taxRate'" :rules='productRules.taxRate'>
                          <el-input v-model="scope.row.taxRate" placeholder="请输入税率" :disabled="status" maxlength="2"
                            style="width: 135px;" oninput="value=value.replace(/[^0-9.]/g,'')"
                            @input="watchnums(scope.row, scope.$index)" />
                        </el-form-item>
                      </template> -->
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.taxRate" placeholder="税率" style="width: 100%;" :disabled="btnType === 'look'" @change="changeTaxRate(scope.row, scope.$index)">
                      <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName" :value="item.taxRate"></el-option>
                    </el-select>
                  </template>

                </el-table-column>
                <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="150" show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column prop="totalTaxAmount" label="税额" width="150" show-overflow-tooltip>
                </el-table-column> -->
                <!-- <el-table-column prop="amounts" label="金额(含税)" width="150" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="excludingTaxAmounts" label="金额(不含税)" width="150" show-overflow-tooltip>
                  </el-table-column> -->
                <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" v-if="sealingCoverTypingFlag === '1'" :key="211">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list1" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="accuracyLevel" label="精度等级" width="120" v-if="accuracyLevelFlag === '1'" :key="123">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.accuracyLevel" placeholder="请选择" clearable filterable allow-create>
                      <el-option v-for="(item, index) in list2" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="vibrationLevel" label="振动等级" width="120" v-if="vibrationLevelFlag === '1'" :key="17">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.vibrationLevel" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list3" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="oil" label="油脂" width="120" v-if="oilFlag === '1'" :key="61">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.oil" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list4" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="oilQuantity" label="油脂量" width="120" v-if="oilQuantityFlag === '1'" :key="51">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.oilQuantity" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list5" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="clearance" label="游隙" width="120" v-if="clearanceFlag === '1'" :key="100">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.clearance" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list6" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="packagingMethod" label="包装方式" width="120" v-if="packagingMethodFlag === '1'" :key="101">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.packagingMethod" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list7" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="specialRequire" label="特殊要求" width="120" v-if="specialRequireFlag === '1'" :key="101">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.specialRequire" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list8" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="material" label="保持架材质" width="120" :key="102" v-if="materialFlag === '1'">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.material" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list9" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="colour" label="颜色" width="120" :key="105" v-if="colourFlag === '1'">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.colour" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list10" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="protrusion" label="钢球名称" width="120" :key="103" v-if="protrusionFlag === '1'">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.protrusion" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list11" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="preload" label="预负荷" width="120" :key="104" v-if="preloadFlag === '1'">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.preload" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list12" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="angle" label="角度" width="120" :key="104" v-if="angleFlag === '1'">
                  <template slot-scope="scope">
                    <el-select :disabled="btnType === 'look'" v-model="scope.row.angle" placeholder="请选择" clearable filterable allow-create style="width: 100%;">
                      <el-option v-for="(item, index) in list13" :key="index" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="centerDiameter" label="钢球/中心径/倒角" min-width="200" v-if="centerDiameterFlag === '1'">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.centerDiameter" placeholder="请输入钢球/中心径/倒角" :disabled="btnType === 'look'" />
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="status" maxlength="200" />
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'add'">
                  <template slot-scope="scope">
                    <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
                let
              </el-table>
              <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin:0 10px">总数量：{{ totalNum }}</span>
                <span style="font-weight:500;margin:0 10px">总金额：{{ totalAmount }}</span>
              </div>
            </el-form>
          </el-collapse-item>

        </el-collapse>
      </div>
      <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
        <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1" :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text"><em>点击选取文件上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件
            <el-button type="text" class="topButton" icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button>
          </div>

        </el-upload>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="submit()">
            提交</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
        <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
            {{ submitmethodsTitle }}啦！</span><span class="import_b">您还可以进行如下操作：</span></div>

        <!-- <div>
            <el-button type="text" @click="continueImport">继续导入</el-button>

          </div> -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>
          <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()"> {{ btnText }}</el-button>
          <el-button v-else type="primary" @click="continueAdd()"> {{ btnText }}</el-button>
        </span>
      </el-dialog>

      <el-dialog title="历史价格" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="historyVisiblt" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="getHistoryPriceFun()"  v-model="historyPriceRequestObj.customerDrawingNumber" placeholder="请输入客户料号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="getHistoryPriceFun()"  v-model="historyPriceRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="getHistoryPriceFun()"  v-model="historyPriceRequestObj.ask" placeholder="请输入要求" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getHistoryPriceFun()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetHistoryPriceFun()">{{
                      $t('common.reset')
                    }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('dataTable')">导出</el-button>
              </div>
              <JNPF-table :data="historyPriceData" ref="dataTable" custom-column>
                <el-table-column prop="cooperativePartnerIdText" label="客户名称" sortable="custom" width="200" />
                <el-table-column prop="customerDrawingNumber" label=" 客户料号" width="150" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="品名规格" width="180" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom" />
                <el-table-column prop="num" label="数量" width="80" sortable="custom" />
                <el-table-column prop="unitPrice" label="单价(含税)" width="130" sortable="custom" />
                <el-table-column prop="taxRate" label="税率" width="110" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.taxRate }}%</div>
                  </template>
                </el-table-column>
                <el-table-column prop="excludingTaxUnitPrice" label="单价(不含税)" width="140" sortable="custom" />
                <el-table-column prop="ask" label="要求" width="140" sortable="custom" />
                <el-table-column prop="remark" label="备注" width="180" sortable="custom" />
                <el-table-column prop="bidder" label="报价人" width="180" sortable="custom" />
                <el-table-column prop="quotationTime" label="报价时间" width="130" sortable="custom" />
                <el-table-column prop="validEnd" label="有效时间止" width="130" sortable="custom" />

              </JNPF-table>
              <pagination :total="historyPriceTotal" :page.sync="historyPriceRequestObj.pageNum" :limit.sync="historyPriceRequestObj.pageSize" @pagination="getHistoryPriceFun" />
            </div>
          </div>
        </div>

      </el-dialog>
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-left">
            <div class="JNPF-common-title">
              <h2>产品分类</h2>
              <span class="options">
                <el-dropdown>
                  <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="getcategoryTree()">刷新数据</el-dropdown-item>
                    <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                    <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </div>

            <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading">
              <el-tree ref="treeBox" :data="ProductTreeData" :props="defaultProps" :default-expand-all="expands" highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeAllProduct" class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNodeAllProduct">
                <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                  <span class="text" :title="data.name">{{ data.name }}</span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-select v-model="ProductListRequestObj.projectId" placeholder="请选择所属项目" style="width: 100%;" filterable
               >
                <el-option v-for="item in projectIdData" :key="item.id" :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.productCode" placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="isProductNameSwitch == 1">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.productName" placeholder="请输入产品名称" clearable />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchAllProduct()"  v-model="ProductListRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col> -->

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
              <JNPF-table v-loading="listLoading" :data="allproductData" hasC @selection-change="handleSelectionChangeAllPruduct" ref="dataTable" @row-click="handleRowClick">
                <el-table-column prop="code" label="产品编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="产品名称" width="160" v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" />
                <el-table-column prop="productCategoryName" label="所属分类" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom" v-if="isProjectSwitch == 1" />
                <el-table-column prop="mainUnit" label="单位" />
                <el-table-column prop="inventoryQuantity" label="库存数量">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="viewFun(scope.row.id, 'inventoryFlag')">
                      {{ scope.row.inventoryQuantity }}
                    </el-link>
                  </template>
                </el-table-column>

              </JNPF-table>
              <pagination :total="allProductTotal" :page.sync="ProductListRequestObj.pageNum" :limit.sync="ProductListRequestObj.pageSize" @pagination="initData2" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="allProVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
            确定</el-button>
        </span>
      </el-dialog>
      <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    </div>
  </transition>
</template>


<script>
import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from '@/api/masterDataManagement/index'
import { getQuotationmxLists, addQuotationData, editQuotationMData, getQuotationInfo, denerateQuotationMData, calculatequotationData, calculatequotationSpecData, saleUploadData, saleUploadAmountsCount, exportNoProduct, saleUploadProductData } from "@/api/salesManagement/index";
import {
  getCounryData,
  getPrivateList,
  deletePrivate,
  getcategoryTree,
  privateDetail,
  getOrderFiledMap, updatePartnerOrProductData
} from '@/api/basicData/index'
import { getcategoryTree as productTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getcategoryTrees, getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getProducts, getDetailByDrawNo } from '@/api/masterDataManagement/index.js' // 产品列表
import { mapGetters, mapState } from 'vuex'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import flowMixin from '@/mixins/generator/flowMixin'
import { getBimBusinessDetail } from '@/api/basicData/index'
import { excelExport, addPartnerOrProductData, importCustomerProduct, getcooperativeproductInfo } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: { ExportForm, Process, recordList },
  mixins: [busFlow, flowMixin, getProjectList],
  data() {
    return {
      isProjectSwitch:'',
      projectIdData:[],
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
      list12: [],
      list13: [],
      enterFlag: false,
      exportFormVisible: false,
      historyPriceTotal: 0,
      historyPriceData: [],
      historyPriceRequestObj: {
        ask: "",
        productDrawingNo: "",
        customerDrawingNumber: "",
        cooperativePartnerId: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: "quotationTime"
        }],
      },

      btnText: "",
      uploadVisib: false,
      submitmethodsTitle: "",
      historyVisiblt: false,

      getcategoryTrees, // 客户列表
      getCooperativeData, // 客户列表
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

      datafilelist: [],
      iszt: true,
      status: false,
      dataFormTwo: {
        lines: []
      },
      iszhi: false,
      attributeLines: [],
      index: null,
      btnType: undefined,
      area: [],
      deliveryAddressList: [],
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      dataForm: {
        partnerType: "customer",
        dateOrderStart: "",
        cooperativePartnerId: '',
        cooperativePartnerIdText: '',
        validDateArr: [],
      },
      taxRateList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 3600 * 24;
        }
      },
      selectRows: [],
      taxRate: '13', // 默认税率
      dataRule: {
        cooperativePartnerIdText: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        validDateArr: [{ required: true, message: '有效期止不能为空', trigger: 'blur' }],
      },
      productRules: {

        // 客户物料号
        customerProductNo: [
          { validator: this.formValidate({ type: 'noEmtry', params: [" 客户料号不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' }
        ],
        // 数量
        num: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["数量不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '数量必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ],
        // 单价（含税）
        price: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["单价(含税)不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '单价(含税)必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [18, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：单价(含税)${errMsg}`) }] }), trigger: 'blur' }
        ],


      },
      activeNames: ["productInfo", "basicInfo"],
      customStyleData: {},
      tableVisible: false,
      loadingText: '',
      fontSizeValue: '',
      oldId: "",
      oldType: "",
      tipsvisible: false,
      createdData: {
        customerProductName:"",
        salesQuotationId: '',
        productsId: "",
        customerProductNo: "",
        productName: "",
        productDrawingNo: "",
        pairingModeName: '',
        pairingModeId: '',
        mainUnit: "",
        price: "",
        taxRate: "",
        excludingTaxPrice: "",
        totalTaxAmount: "",
        sealingCoverTyping: "",
        accuracyLevel: "",
        vibrationLevel: "",
        oil: "",
        oilQuantity: "",
        clearance: "",
        packagingMethod: "",
        specialRequire: "",
        material: "",
        colour: "",
        protrusion: "",
        preload: "",
        angle: '',
        centerDiameter: '',
        remark: "",
      },
      codeConfig: {},
      selectName: [],
      partnerInfo: {},
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      isattachmentswitch: '',
      isProjectSwitch: '',
      allProVisible: false,
      ProductMethodArr: [
        {
          label: "产品分类", classAttribute: "", method: productTree, requeseObj: {
            classAttribute: "", type: "material",
          }
        },
      ],
      allproductData: [],
      allProductTotal: 0,
      pairingModeList: [],
      ProductTreeData: [],
      ProductListRequestObj: {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        saleFlag: true,
        productStatus: 'enable',
        productCode: "",
        productName: "",
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
      productData: [],
      expands: true,
      refreshTree: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      selectArr: [],
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
      protrusionFlag: '',
      preloadFlag: '',
      materialFlag: '',
      colourFlag: '',
      angleFlag: '',
      centerDiameterFlag: '',
      bimProductAttributesList: [],
      row: null,
      switchlist: true
    }
  },
  computed: {

    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

  },
  watch: {
    activeName(val) {
      // 如果切换到订单信息tab并且表格表单处于适配模式，触发计算高度
      if (val === 'orderInfo' && JSON.stringify(this.customStyleData) !== '{}') this.$nextTick(() => { this.switchStyle('onresize') })
    }
  },
  beforeDestroy() {
    window.onresize = null
  },

  async mounted() {
    try {

      await Promise.all([
        this.getProductClassFun().then(this.getProductAttributeFun),
        this.getProjectSwitch('system', 'project'),
        this.getProductNameSwitch('product', 'enable_productName'),
        this.getpairingModeListFun(),
        this.getBimBusinessDetail()
      ])
    } catch (e) { console.log(e) }
    finally {
      this.$nextTick(() => {
        this.$refs.product.doLayout()
      })
    }
  },
  methods: {
    getSwitchList() {
      this.switchlist = !this.switchlist
    },
    // 获取配对方式
    async getpairingModeListFun() {
      try {
        this.pairingModeList = await this.jnpf.getpairingModeListFun()
        console.log("this.par", this.pairingModeList);
      } catch (error) { }
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    // 点击选择产品
    addProduct() {
      this.allProVisible = true
      let arr = [];
      this.ProductListRequestObj = {
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        queryType: 2,
        productStatus: 'enable',
        saleFlag: true,
        projectId:'',
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
      }
      if (this.isProjectSwitch === '1') {
        console.log(this.userInfo,'ss')
        this.ProductListRequestObj.projectId = this.userInfo.userProjectId
      }
      this.allproductData = []
      let successTotal = 0;
      let tempTreeData = [...this.ProductMethodArr]
      this.ProductMethodArr.forEach((item, index) => {
        item.method(item.requeseObj).then(res => {
          if (Array.isArray(res.data)) {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data
            }
          } else {
            tempTreeData[index] = {
              id: item.label,
              name: item.label,
              classAttribute: item.classAttribute,
              childrenList: res.data.records
            }
          }
          if ((++successTotal) === this.ProductMethodArr.length) {
            this.ProductTreeData = tempTreeData
            this.initData2()
          }
        })
      });

    },
    // 获取所有产品列表数据
    initData2() {
      this.listLoading = true

      getProducts(this.ProductListRequestObj).then(listRes => {
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
        classAttributeList: [],
        classAttribute: "",
        productDrawingNo: "",
        productCategoryId: "",
        queryType: 2,
        saleFlag: true,
        projectId:"",
        productCode: "",
        productName: "",
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      }
      if (this.isProjectSwitch === '1') {
        console.log(this.userInfo,'ss')
        this.ProductListRequestObj.projectId = this.userInfo.userProjectId
      }
        this.searchAllProduct()
    },
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val


    },
    submitAllProduct() {
      this.allProVisible = false
      this.selectArr.forEach(item => {
        item.productCategoryName = item.productCategoryName
        item.productName = item.name
        item.productCode = item.code
        item.productsId = item.id
        this.$set(item, 'price', item.salesPrice)
        this.$set(item, 'productDrawingNo', item.drawingNo)
        item.taxRate = item.taxRate * 1
        if (item.taxRate) {
          item.excludingTaxPrice = this.jnpf.numberFormat(Number(item.salesPrice) / (1 + (Number(item.taxRate)) / 100), 2)

        } else {
          item.excludingTaxPrice = item.salesPrice
        }
      });
      if (this.dataFormTwo.lines.length) {
        let index = this.dataFormTwo.lines.findIndex(item =>
          item.productDrawingNo === "" &&
          item.productsId === "" &&

          item.price === "" &&
          item.deliveryDate === ""
        )
        if (index !== -1) {
          // 使用 splice 插入 newDataArray
          this.dataFormTwo.lines.splice(index, 0, ...this.selectArr);
        } else {
          this.dataFormTwo.lines = [...this.selectArr, ...this.dataFormTwo.lines,]
        }
      }
    },
    filterNodeAllProduct(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ""
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.ProductListRequestObj.classAttribute = data.classAttribute
      this.searchAllProduct()
    },
    getNodePathProduct(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },
    // 获取业务参数中 属性字段动态显示
    async getProductAttributeFun() {
      await Promise.all([
        getOrderFiledMap('sale').then(res => {
          console.log("产品属性", res);
          // sealingCoverTypingFlag list1  pa007
          // accuracyLevelFlag list2  pa006
          // vibrationLevelFlag list3 pa005
          // oilFlag list4 pa002
          // oilQuantityFlag list5 pa003
          // clearanceFlag list6 pa001
          // packagingMethodFlag list7 pa015
          // specialRequireFlag list8 pa016

          this.accuracyLevelFlag = res.data.accuracyLevel //list1
          if (this.accuracyLevelFlag === '1') {
            this.list2 = this.bimProductAttributesList.pa006.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.clearanceFlag = res.data.clearance
          if (this.clearanceFlag === '1') {
            this.list6 = this.bimProductAttributesList.pa001.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          console.log("this.list6", this.list6);
          this.oilFlag = res.data.oil
          if (this.oilFlag === '1') {
            this.list4 = this.bimProductAttributesList.pa002.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.oilQuantityFlag = res.data.oilQuantity
          if (this.oilQuantityFlag === '1') {
            this.list5 = this.bimProductAttributesList.pa003.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.packagingMethodFlag = res.data.packagingMethod
          if (this.packagingMethodFlag === '1') {
            this.list7 = this.bimProductAttributesList.pa015.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.sealingCoverTypingFlag = res.data.sealingCoverTyping
          if (this.sealingCoverTypingFlag === '1') {
            this.list1 = this.bimProductAttributesList.pa007.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.specialRequireFlag = res.data.specialRequire
          if (this.specialRequireFlag === '1') {
            this.list8 = this.bimProductAttributesList.pa016.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.vibrationLevelFlag = res.data.vibrationLevel
          if (this.vibrationLevelFlag === '1') {
            this.list3 = this.bimProductAttributesList.pa005.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
            console.log(this.list3);
          }
          this.materialFlag = res.data.material
          if (this.materialFlag === '1') {
            this.list9 = this.bimProductAttributesList.pa021.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.colourFlag = res.data.colour
          if (this.colourFlag === '1') {
            this.list10 = this.bimProductAttributesList.pa010.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.formLoading = false
        }).catch(err => this.formLoading = false),
        getOrderFiledMap('gobal').then(res => {
          this.protrusionFlag = res.data.protrusion //list1
          if (this.protrusionFlag === '1') {
            this.list11 = this.bimProductAttributesList.pa023.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.preloadFlag = res.data.preload
          if (this.preloadFlag === '1') {
            this.list12 = this.bimProductAttributesList.pa024.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.angleFlag = res.data.angle
          if (this.angleFlag === '1') {
            this.list13 = this.bimProductAttributesList.pa025.map((item) => {
              return {
                label: item.name,
                name: item.name
              }
            })
          }
          this.centerDiameterFlag = res.data.centerDiameter
          this.formLoading = false
          this.tableVisible = true
        }).catch(err => this.formLoading = false)
      ])
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7) 保持架材质（list9）、颜色(10)
    async getProductClassFun() {
      await Promise.all([
        // 产品属性
        getbimProductAttributesListMap().then((res) => {
          this.bimProductAttributesList = res.data
        }),
        // 获取税率(数据字典)
        getbimProductAttributes("585438081021126405").then(res => {
          res.data.list.forEach(item => {
            item.taxRate = item.enCode.replace('%', '') * 1
          })
          this.taxRateList = res.data.list
          console.log("税率", this.taxRateList);
        })
      ])

    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_customerproducts'
      }
      return getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
      })
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.historyPriceRequestObj
      let _data = {
        ...targetListQuery,
        exportType: '1055',
        exportName: '历史价格',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    getHistoryPriceFun() {
      getQuotationmxLists(this.historyPriceRequestObj).then(res => {
        this.historyPriceData = res.data.records
        this.historyPriceTotal = res.data.total
      })
    },
    resetHistoryPriceFun() {
      this.historyPriceRequestObj = {
        ask: "",
        productDrawingNo: "",
        customerDrawingNumber: "",
        cooperativePartnerId: this.dataForm.cooperativePartnerId,
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: "quotationTime"
        }],
      },
        this.getHistoryPriceFun()
    },
    // 点击历史查询
    historyPriceFun() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error("请先选择客户")
      this.historyPriceRequestObj.cooperativePartnerId = this.dataForm.cooperativePartnerId
      this.historyVisiblt = true
      this.getHistoryPriceFun()
    },
    querySearchAsync(queryString, cb) {
      // if (!this.dataForm.cooperativePartnerId) {
      //   let air = []
      //   cb(air)
      //   this.$message.error("请先选择客户!")
      // } else {
      if (queryString && queryString.length >= 3) {
        let ProductListRequestObj = {
          classAttributeList: [],
          classAttribute: "",
          productDrawingNo: queryString,
          productCategoryId: "",
          queryType: 2,
          productStatus: 'enable',
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
        }
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          getProducts(ProductListRequestObj).then(res => {
            let datas = res.data.records
            if (datas !== []) {
              var restaurants = datas
              var arr = []
              restaurants.forEach((item, index) => {
                arr.push({
                  value: item.drawingNo,
                  data: item,
                })
              })
              cb(arr)
            } else {
              let air = []
              this.$message.error("您输入的品名规格暂未匹配到对应的产品数据，请重新输入!")
              queryString = ""
              cb(air)
            }

          })
            .catch(res => {
              this.$message({
                type: 'error',
                message: '获取数据失败'
              })
            })
        }, 500)

      } else {
        let air = []
        cb(air)

      }
      // }



    },
    handleSelect(row, index, item) {
      console.log(666, item);
      //返回的意见点击选择触发事件
      let customerDrawingNumber
      let obj = JSON.parse(JSON.stringify(this.createdData))
      obj.taxRate = this.taxRate * 1
      this.dataFormTwo.lines[index].productCategoryName = item.data.productCategoryName
      this.dataFormTwo.lines[index].productDrawingNo = item.data.drawingNo
      this.dataFormTwo.lines[index].mainUnit = item.data.mainUnit
      this.dataFormTwo.lines[index].productsId = item.data.id
      this.dataFormTwo.lines[index].productName = item.data.name
      this.dataFormTwo.lines[index].productCode = item.data.code
      this.dataFormTwo.lines[index].taxRate = item.data.taxRate * 1 || this.taxRate * 1
      let exists = this.taxRateList.some(line => line.taxRate === item.data.taxRate * 1);
      if (!exists && item.data.taxRate) {
        let obj = {
          taxRate: item.data.taxRate * 1,
          fullName: item.data.taxRate + '%',
          enCode: item.data.taxRate + '%',
        }
        this.taxRateList.push(obj)
      }
      if (this.dataFormTwo.lines[index].customerProductNo) customerDrawingNumber = JSON.parse(JSON.stringify(this.dataFormTwo.lines[index].customerProductNo))
      if (item.value) {
        this.dataFormTwo.lines.push(obj)
      }
    },





    changeTaxRate(row, index) {
      console.log(row, index);
      let productArr = [...this.dataFormTwo.lines]
      productArr[index].excludingTaxPrice = this.jnpf.numberFormat(row.price / (1 + (row.taxRate * 1 / 100)), 2)
      productArr[index].excludingTaxAmounts = this.jnpf.numberFormat((row.excludingTaxPrice * row.num), 2)
      //  = this.jnpf.numberFormat((row.price * 1 - row.excludingTaxPrice), 2)
      productArr[index].totalTaxAmount = this.jnpf.numberFormat(this.jnpf.math('subtract', [row.price, row.excludingTaxPrice]), 2)
      this.dataFormTwo.lines = productArr
    },

    // 输入品名规格  查找对应得产品数据 按下enter键 自动新增一行空白数据
    searchDrawingNoProduct(data, idx) {
      console.log(data, idx);
      let obj = JSON.parse(JSON.stringify(this.createdData))
      obj.taxRate = this.taxRate * 1
      console.log(8989);
      if (data.num || data.price) return
      getDetailByDrawNo(data.productDrawingNo).then(res => {
        if (res.data) {
          this.dataFormTwo.lines.push(obj)
          res.data.price = ""
          res.data.customerProductNo = data.customerDrawingNumber
          res.data.productCode = res.data.code
          res.data.productDrawingNo = res.data.drawingNo
          res.data.productsId = res.data.id
          res.data.taxRate = this.taxRate * 1
          this.$set(this.dataFormTwo.lines, idx, res.data)
          let exists = this.taxRateList.some(item => item.taxRate === parseInt(res.data.taxRate));
          if (!exists && res.data.taxRate) {
            let obj = {
              taxRate: res.data.taxRate * 1,
              fullName: res.data.taxRate + '%',
              enCode: res.data.taxRate + '%',
            }
            this.taxRateList.push(obj)
          }
        } else {
          this.$message.error("您输入的品名规格未匹配到对应的产品，请重新输入")
          data.productDrawingNo = ""
        }


      })
    },
    goBack() {
      this.$emit('close', true)
      this.tipsvisible = false
    },
    // 继续修改
    continueEdit() {
      this.init(this.dataForm, this.btnType)
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.init('', 'add')
      this.btnLoading = false
      this.tipsvisible = false
    },
    submit() {
      if (this.dataFormTwo.lines.length) {
        let index = this.dataFormTwo.lines.findIndex(item =>
          item.customerProductNo === "" &&
          item.price === "" &&
          item.productDrawingNo == ""
        )
        if (index !== -1) {
          if (this.dataFormTwo.lines.length == 1) {
            this.UploadProduct(this.file)

          } else {
            this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).then(() => {
              this.UploadProduct(this.file)
            }).catch(() => { })
          }
        } else {
          this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).then(() => {
            this.UploadProduct(this.file)
          }).catch(() => { })

        }
      } else {
        this.UploadProduct(this.file)

      }

    },

    handleFileChange(file) {
      console.log("所选文件:", file);
      this.file = file.raw
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    // 导入产品
    importProductFun() {
      this.uploadVisib = true

    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data)
      //调用上传文件接口
      saleUploadProductData(formData).then(res => {
        if (!res.data.url) {
          this.$message.success(`导入成功`)
          if (res.data) {
            let lineArr = []
            if (res.data.list && res.data.list.length) {
              lineArr = res.data.list.map(item => {
                return {
                  ...item,
                  productDrawingNo: item.drawingNo,
                  productName: item.productsName || ''
                }
              })
            }
            lineArr.forEach(item => {
              let excludingTaxPrice = this.jnpf.numberFormat(this.jnpf.math('divide', [item.price, 1 + item.taxRate / 100]), 2)
              this.$set(item, 'excludingTaxPrice', excludingTaxPrice)
            });
            this.dataFormTwo.lines = lineArr

          }
          this.formLoading = false
          this.loadingText = ''
          this.uploadVisib = false
        } else {
          this.formLoading = false
          this.handleMessage(res.data)
        }
        // this.tipsvisible=true

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
        if (!this.status) {
          this.dataForm = {
            ...this.dataForm,
            phone: partnerInfo.phone,
            fax: partnerInfo.fax,
            country: partnerInfo.country,
            province: partnerInfo.province,
            city: partnerInfo.city,
            area: partnerInfo.area,
            address: partnerInfo.address
          }
          this.taxRate = partnerInfo.taxRate || ""
          this.dataFormTwo.lines.forEach(row => {
            row.taxRate = this.taxRate * 1
          })
        }
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.cooperativePartnerId = ""
        this.dataForm.cooperativePartnerIdText = ""
      }
    },


    // 批量删除
    batchDelete() {
      if (!this.selectRows.length) return this.$message('请选择要删除的产品')
      if (this.dataFormTwo.lines.length === this.selectRows.length) return this.$message.error('至少需要保留一条产品数据')

      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.lines.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.lines.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },



    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/客户产品价格新建导入.xlsx')
      a.click()
    },
    // 联系人信息删除当前行
    deltable(row, index) {
      if (this.dataFormTwo.lines.length === 1) return this.$message.error('至少需要保留一条产品数据')
      this.dataFormTwo.lines.splice(row.$index, 1)
    },
    // 监听单价(含税)输入
    watchPrice(row, index) {
      let productArr = [...this.dataFormTwo.lines]

      row.price = row.price ? row.price.replace(/[^\d.]/g, '') : ''
      // 单价处理
      if (row.price.length == 1 && row.price == '.') {
        // 如果第一位是小数点，则清空输入框
        row.price = '';
      } else if (row.price.length == 2 && row.price[0] == '0' && row.price[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.price = row.price.slice(0, 1) + '.' + row.price.slice(1);
      } else if (row.price.length > 2 && row.price[0] == '0' && row.price[1] != '.') {
        row.price = row.price.substring(1, row.price.length)
      }
      if (row.price.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.price.length; i++) {
          const char = row.price[i];
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
        row.price = result;
        let arr = row.price.split('.')
        if (arr[0].length > 12) {
          arr[0] = arr[0].substring(0, 12)
        }
        if (arr[1].length > 6) {
          arr[1] = arr[1].substring(0, 6)
        }
        row.price = arr[0] + '.' + arr[1]
      } else {
        if (row.price.length > 20) {
          row.price = row.price.substring(0, 20);
        }
      }
      if (row.price && row.price != '0') {
        let b = this.jnpf.numberFormat(this.jnpf.math('divide', [row.price, 1 + row.taxRate / 100]), 2)
        row.excludingTaxPrice = b ? b : 0
        row.totalTaxAmount = this.jnpf.numberFormat(this.jnpf.math('subtract', [row.price, row.excludingTaxPrice]), 2)
        productArr[index].excludingTaxPrice = b ? b : 0
      } else {
        row.excludingTaxPrice = ''
      }



      this.dataFormTwo.lines = productArr
    },
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    async getProject(){
      await this.getProjectSwitch('system', 'project')
      if (this.isProjectSwitch === '1') {
        await this.getProjectList()
      }
    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.quotationNo = data.number

        }
      } catch (error) {
      }
    },
    calculateExpiryDate() {  
      const today = new Date();  
      const expiryDate = new Date(today.setFullYear(today.getFullYear() + 30));  
      return this.formatDate(expiryDate);  
    },  
    formatDate(date) {  
      const year = date.getFullYear();  
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始  
      const day = String(date.getDate()).padStart(2, '0');  
      return `${year}-${month}-${day}`;  
    },
    init(row, btnType, approvalFlag) {
      console.log("btntyoe",btnType);
      this.formLoading = true
      this.row = row ? { ...row, productDrawingNo: row.drawingNo, cooperativePartnerIdText: row.partnerName,taxRate:row.taxRate*1 } || '' : ''
      // 表格表单适配模式
      this.$nextTick(() => { this.switchStyle('onresize') });
      this.getProject() 
      this.approvalFlag = approvalFlag
      this.btnType = btnType

      this.iszt = true
      this.status = false
      if (this.btnType == 'add') {
        let obj = JSON.parse(JSON.stringify(this.createdData))
        this.dataFormTwo.lines.push(obj)
        this.dataForm.validDateArr = [this.formatDate(new Date()),this.calculateExpiryDate()]

      } else {
        getcooperativeproductInfo(row.id).then(res => {
          this.dataForm.cooperativePartnerId=res.data.cooperativePartnerId
          this.dataForm.cooperativePartnerIdText=res.data.partnerName
          this.dataForm.id=res.data.id
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
        })
        this.row.taxRate=this.row.taxRate*1
        this.dataForm.validDateArr = [row.dateOrderStart, row.dateOrderStop]
        this.dataFormTwo.lines.push(this.row)
        console.log(this.dataFormTwo.lines,'this.dataFormTwo.lines12')
      }



    },
    async handleConfirm(value) {
      this.dataForm.documentStatus = value
      let submitFlag = true
      if (this.dataFormTwo.lines.length) {
        let index = this.dataFormTwo.lines.findIndex(item =>
          item.customerProductNo === "" &&
          item.price === "" &&
          item.productDrawingNo == ""
        )
        console.log(index);
        if (index !== -1) {
          this.dataFormTwo.lines.splice(index, 1);
        }
      }

      // 校验主表
      const form_1 = this.$refs['dataForm']
      const valid_1 = await form_1.validate().catch(err => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        const formItems = form_1.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }

      // 校验子表
      if (!this.dataFormTwo.lines.length && submitFlag) {
        submitFlag = false
        this.$message.error('请添加产品')
      }
      const form_2 = this.$refs['productForm']
      const valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        const formItems = form_2.fields
        formItems.some(formItem => {
          if (formItem.validateState === 'error') {
            this.jnpf.focusItem(formItem.$children[1].$el)
            this.$nextTick(() => { this.jnpf.formItemValidate(formItem) });
            return true
          }
        });
      }

      if (this.dataFormTwo.lines.length) {

        for (let index = 0; index < this.dataFormTwo.lines.length; index++) {
          const item = this.dataFormTwo.lines[index];
          if (!item.productDrawingNo) {
            submitFlag = false
            this.$message.error("产品信息第" + (index + 1) + "行品名规格不能为空")
            return
          }
          if (!item.productsId) {
            submitFlag = false
            this.$message({
              message: "第" + (index + 1) + "行产品不存在",
              type: 'error',
              duration: 1500,
            })
            break
          }
        }
      }

      if (submitFlag) {

        this.btnLoading = true
        this.dataForm.totalAmount = Number(this.dataForm.totalAmount = 0)
        this.dataForm.totalAmount = this.totalPrice
        if (this.dataForm.validDateArr.length) {
          this.dataForm.dateOrderStart = this.dataForm.validDateArr[0]
          this.dataForm.dateOrderStop = this.dataForm.validDateArr[1]
        }
        console.log(this.datafilelist,';this.datafilelist1')
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
        console.log(this.datafilelist,'this.datafilelist2')
        
        let filteredArr = this.dataFormTwo.lines.filter(item => item.productDrawingNo && item.productsId);
        console.log(filteredArr,'filteredArr')
        let obj = {
          attachmentList: this.datafilelist,
          // sale: this.dataForm,
          cooperativePartnerId: this.dataForm.cooperativePartnerId,
          dateOrderStart: this.dataForm.dateOrderStart,
          dateOrderStop: this.dataForm.dateOrderStop,
          list: filteredArr,
          // flowData: this.flowData
          partnerType: "customer",
        }
        let editObj = {
          ...filteredArr[0],
          attachmentList: this.datafilelist,
          // sale: this.dataForm,
          id: this.dataForm.id,
          cooperativePartnerId: this.dataForm.cooperativePartnerId,
          dateOrderStart: this.dataForm.dateOrderStart,
          dateOrderStop: this.dataForm.dateOrderStop,
          // list: filteredArr,
          // flowData: this.flowData
          partnerType: "customer",
        }
        console.log(obj, '参数');
        let queryBody = (this.btnType === 'add'||this.btnType=='copy') ? obj : editObj
        // return
        const formMethod =  (this.btnType === 'add'||this.btnType=='copy') ? addPartnerOrProductData : updatePartnerOrProductData
        formMethod(queryBody).then(res => {
          let msg = "";
          if (value == "draft") {
            this.submitmethodsTitle = "保存成功"
          } else {
            this.submitmethodsTitle = "提交成功"

          }
          if (this.btnType == 'edit') {
            msg = "提交成功"
          } else if (this.btnType == 'add' || this.btnType == 'copy') {
            msg = "新建成功"

          } else {
            if (res.data) {
              this.btnLoading = false
              this.handleMessage(res.data)
              return
            }
          }
          this.tipsvisible = true
          this.btnText = this.btnType === 'add' ? "继续新增" : '继续编辑'


        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }
    },

    async switchStyle(type) {
      await this.$nextTick();
      const mainRegion = this.$refs.main // 可用区域
      if (JSON.stringify(this.customStyleData) === "{}" || type === 'onresize') {
        if (type !== 'onresize') this.$message.success('适配模式')
        // 获取可用区域的高度
        const mainHeight = mainRegion.clientHeight;
        // 其他同级组件占用高度
        let bortherHeight = 0
        const bortherItems = mainRegion.querySelectorAll('.orderInfo > *')
        bortherItems.forEach(item => {
          if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
        })

        // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
        let maxHeight = mainHeight - bortherHeight - 112

        // 计算高度最低500
        maxHeight = maxHeight > 500 ? maxHeight : 500

        this.customStyleData = {
          height: 10000,
          maxHeight
        }

        // 附带防抖的监听适配模式屏幕缩放
        window.onresize = () => {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this.switchStyle('onresize')
          }, 100);
        };
      } else {
        this.$message.success('全展模式')
        window.onresize = null
        this.customStyleData = {}
        // 重新加载表格
        this.tableVisible = false
        this.$nextTick(() => { this.tableVisible = true })
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

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px !important;
}

::v-deep .workNode {
  background-color: #f5f5f7 !important;
}

//.el-button--small {
// padding: 1;
</style>
<style scoped>
::v-deep .el-tabs {
  height: 100% !important;
}

::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow: auto !important;
  padding: 0;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
.tableContainer {
  padding: 0 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

.el-dialog .el-dialog__body {
  padding: 20px 0px 2px !important;
}

.el-button span {
  font-size: 14px !important;
}

.pagination-container {
  background-color: #f5f7fa;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
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
  padding: 0 !important;
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

.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}

.JNPF-preview-main .main {
  padding-top: 0;
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
  padding-bottom: 0px;
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
  border-bottom: none !important;
}

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
}
</style>
<style>
.my-message {
  font-size: 16px !important;
}
</style>
