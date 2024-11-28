<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <el-page-header @back="$emit('close')"
          :content="btnType == 'add' || btnType == 'copy' ? '新建销售报价' : btnType == 'edit' ? '编辑销售报价' : '查看销售报价'" />
        <div class="options">
          <el-button size="mini" type="success" :loading="btnLoading" @click="handleConfirm('draft')"
            v-if="btnType !== 'look'">
            保存草稿</el-button>
          <el-button size="mini" type="primary" v-if="btnType !== 'look'" :loading="btnLoading"
            @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button size="mini" @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading" ref="main" :element-loading-text="loadingText">
        <el-tabs v-model="activeName" v-if="!approvalFlag" class="JNPF-el_tabs">
          <el-tab-pane label="基础信息" name="orderInfo" class="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="报价单号" prop="quotationNo">
                        <el-input v-model="dataForm.quotationNo" placeholder="输入报价单号"
                          :disabled="status ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                          maxlength="50" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="致" prop="deliver">
                        <el-input v-model="dataForm.deliver" placeholder="输入致" :disabled="status" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="客户" prop="cooperativePartnerIdText">
                        <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.cooperativePartnerIdText"
                          @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类"
                          placeholder="请选择客户"
                          :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }"
                          :listMethod="getCooperativeData" :listRequestObj="partnerRequestObj"
                          :searchList="partnerSearchList" :treeNodeClick="yxPartnerTreeNodeClick"
                          :isdisabled="btnType === 'look'" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="报价人" prop="bidder">
                        <el-input v-model="dataForm.bidder" placeholder="输入报价人" :disabled="status" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="报价时间" prop="quotationTime">
                        <el-date-picker v-model="dataForm.quotationTime" type="date" value-format="yyyy-MM-dd"
                          style="width: 100%;" placeholder="请选择报价时间" :disabled="status">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="有效时间止" prop="validEnd">
                        <el-date-picker v-model="dataForm.validEnd" placeholder="请选择有效时间" type="date" :disabled="status"
                          value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="pickerOptions">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="地址" prop="address">
                        <el-input v-model="dataForm.address" placeholder="输入地址" maxlength="300" :disabled="status" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="电话" prop="phone">
                        <el-input v-model="dataForm.phone" placeholder="输入电话" maxlength="20" :disabled="status" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="传真" prop="fax">
                        <el-input v-model="dataForm.fax" placeholder="输入传真" maxlength="20" :disabled="status" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24" v-if="dataForm.approvalStatus == 'review_failed'">
                      <el-form-item label="驳回理由" prop="reasonRejection">
                        <el-input v-model="dataForm.reasonRejection" placeholder="输入驳回理由" :disabled="status"
                          maxlength="200" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="status" type="textarea"
                          maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>



              <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                <div v-if="btnType != 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:5px ;font-size:14px!important"
                  icon="el-icon-plus" @click="addProduct">选择产品</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:5px ;font-size:14px!important"
                    icon="el-icon-plus" @click="importProductFun">导入产品</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important"
                    icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important"
                    icon="el-icon-delete" @click="historyPriceFun">历史价格</el-button>
                </div>

                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.lines" @selection-change="handeleProductInfoData"
                    v-if="tableVisible" v-bind="customStyleData">
                    <el-table-column type="selection" width="60" fixed='left' align="center"
                      v-if="this.btnType !== 'look'" key="1" />
                    <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                    <el-table-column prop="customerDrawingNumber" label=" 客户料号" min-width="120">
                      <template slot="header">
                        <span class="required">*</span> 客户料号
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'customerDrawingNumber'"
                          :rules='productRules.customerDrawingNumber'>
                          <el-input :title="scope.row.customerDrawingNumber" v-model="scope.row.customerDrawingNumber"
                            placeholder="请输入" :disabled="status">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column prop="productDrawingNo" label="品名规格" min-width="330">
                      <template slot="header">
                        <span class="required">*</span> 品名规格
                      </template>
                      <template slot-scope="scope">
                        <el-autocomplete v-model="scope.row.productDrawingNo" :fetch-suggestions="querySearchAsync"
                          placeholder="请输入" prefix-icon="el-icon-search" style="width: 100%;"
                          @select="handleSelect(scope.row, scope.$index, $event)"
                          @stop.keyup.enter.native="searchDrawingNoProduct(scope.row, scope.$index)"
                          :disabled="status"></el-autocomplete>
                        <!-- <el-input v-model="scope.row.drawingNo" placeholder="请输入" :disabled="status" maxlength="100"
                          style="width: 100%;"  /> -->
                      </template>
                    </el-table-column>
                    <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />

                    <el-table-column prop="mainUnit" label="单位" width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="num" label="数量" width="120">
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
                    </el-table-column>

                    <el-table-column prop="unitPrice" label="单价(含税)" width="120">
                      <template slot="header">
                        <span class="required">*</span>单价(含税)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'unitPrice'"
                          :rules='productRules.unitPrice'>
                          <el-input v-model="scope.row.unitPrice" placeholder="单价" :disabled="status" maxlength="20"
                            @input="watchPrice(scope.row, scope.$index)" oninput="value=value.replace(/[^0-9.]/g,'')">
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
                        <el-select v-model="scope.row.taxRate" placeholder="税率" style="width: 100%;" :disabled="status"
                          @change="changeTaxRate(scope.row, scope.$index)">
                          <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                            :value="item.taxRate"></el-option>
                        </el-select>
                      </template>

                    </el-table-column>
                    <el-table-column prop="excludingTaxUnitPrice" label="单价(不含税)" width="150" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="totalTaxAmount" label="税额" width="150" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="amounts" label="金额(含税)" width="150" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="excludingTaxAmounts" label="金额(不含税)" width="150" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="211">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable
                          style="width: 100%;">
                          <el-option v-for="(item, index) in list1" :key="index" :disabled="status" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable>
                          <el-option v-for="(item, index) in list2" :key="index" :disabled="status" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list3" :key="index" :disabled="status" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="oil" label="油脂" width="120" :key="61">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list4" :key="index" :disabled="status" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list5" :key="index" :disabled="status" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clearance" label="游隙" width="120" :key="100">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list6" :key="index" :disabled="status" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list7" :key="index" :disabled="status" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="specialRequire" label="特殊要求" width="120" :key="101">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list8" :key="index" :disabled="status" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>


                    <el-table-column prop="remark" label="备注" min-width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="status" maxlength="200" />
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'add' || btnType == 'edit'">
                      <template slot-scope="scope">
                        <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>

                  </el-table>
                  <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin:0 10px">总数量：{{ totalNum }}</span>
                    <span style="font-weight:500;margin:0 10px">总金额：{{ totalAmount }}</span>
                  </div>
                </el-form>
              </el-collapse-item>

            </el-collapse>

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
                  <el-form-item label="报价单号" prop="quotationNo">
                    <el-input v-model="dataForm.quotationNo" placeholder="输入报价单号"
                      :disabled="status ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                      maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="致" prop="deliver">
                    <el-input v-model="dataForm.deliver" placeholder="输入致" :disabled="status" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="客户" prop="cooperativePartnerIdText">
                    <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.cooperativePartnerIdText"
                      @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类"
                      placeholder="请选择客户" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }"
                      :listMethod="getCooperativeData" :listRequestObj="partnerRequestObj"
                      :searchList="partnerSearchList" :treeNodeClick="yxPartnerTreeNodeClick"
                      :isdisabled="btnType === 'look'" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="报价人" prop="bidder">
                    <el-input v-model="dataForm.bidder" placeholder="输入报价人" :disabled="status" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="报价时间" prop="quotationTime">
                    <el-date-picker v-model="dataForm.quotationTime" type="date" value-format="yyyy-MM-dd"
                      style="width: 100%;" placeholder="请选择报价时间" :disabled="status">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="有效时间止" prop="validEnd">
                    <el-date-picker v-model="dataForm.validEnd" placeholder="请选择有效时间" type="date" :disabled="status"
                      value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="地址" prop="address">
                    <el-input v-model="dataForm.address" placeholder="输入地址" maxlength="300" :disabled="status" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="电话" prop="phone">
                    <el-input v-model="dataForm.phone" placeholder="输入电话" maxlength="20" :disabled="status" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="传真" prop="fax">
                    <el-input v-model="dataForm.fax" placeholder="输入传真" maxlength="20" :disabled="status" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'look' && dataForm.documentStatus != 'draft'">
                  <el-form-item label="是否生成客户产品" prop="generateFlag">
                    <el-input :value="dataForm.generateFlag ? '是' : '否'" placeholder="请选择是否生成客户产品" :disabled="status" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="dataForm.approvalStatus == 'review_failed'">
                  <el-form-item label="驳回理由" prop="reasonRejection">
                    <el-input v-model="dataForm.reasonRejection" placeholder="输入驳回理由" :disabled="status"
                      maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="status" type="textarea"
                      maxlength="200" :rows="2" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>



          <el-collapse-item title="产品信息" name="productInfo">
            <div v-if="btnType == 'add' || btnType == 'edit'">
              <el-button type="text" style="margin-right:8px;margin-left:5px ;font-size:14px!important"
              icon="el-icon-plus" @click="addProduct">选择产品</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important"
                icon="el-icon-plus" @click="importProductFun">导入产品</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important"
                icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important"
                icon="el-icon-delete" @click="historyPriceFun">历史价格</el-button>
            </div>

            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.lines" @selection-change="handeleProductInfoData"
                v-if="tableVisible" v-bind="customStyleData">
                <el-table-column type="selection" width="60" fixed='left' align="center" v-if="this.btnType !== 'look'"
                  key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="customerDrawingNumber" label=" 客户料号" width="200">
                  <template slot="header">
                    <span class="required">*</span> 客户料号
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'customerDrawingNumber'"
                      :rules='productRules.customerDrawingNumber'>
                      <el-input :title="scope.row.customerDrawingNumber" v-model="scope.row.customerDrawingNumber"
                        placeholder="请输入" :disabled="status" style="width: 135px;">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="productDrawingNo" label="品名规格" width="400">
                  <template slot="header">
                    <span class="required">*</span> 品名规格
                  </template>
                  <template slot-scope="scope">
                    <el-autocomplete v-model="scope.row.productDrawingNo" :fetch-suggestions="querySearchAsync"
                      placeholder="请输入" prefix-icon="el-icon-search"
                      @select="handleSelect(scope.row, scope.$index, $event)"
                      @stop.keyup.enter.native="searchDrawingNoProduct(scope.row, scope.$index)"
                      :disabled="status"></el-autocomplete>
                    <!-- <el-input v-model="scope.row.drawingNo" placeholder="请输入" :disabled="status" maxlength="100"
                          style="width: 100%;"  /> -->
                  </template>
                </el-table-column>
                <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                <el-table-column prop="mainUnit" label="单位" width="160" show-overflow-tooltip></el-table-column>
                <el-table-column prop="num" label="数量" width="160">
                  <template slot="header">
                    <span class="required">*</span>数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'num'" :rules='productRules.num'>
                      <el-input :title="scope.row.num" v-model="scope.row.num" placeholder="请输入数量" :disabled="status"
                        maxlength="11" @input="watchnums(scope.row, scope.$index)" style="width: 135px;"
                        oninput="value=value.replace(/[^0-9.]/g,'')">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="unitPrice" label="单价(含税)" width="160">
                  <template slot="header">
                    <span class="required">*</span>单价(含税)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'unitPrice'" :rules='productRules.unitPrice'>
                      <el-input v-model="scope.row.unitPrice" placeholder="请输入单价" :disabled="status" maxlength="20"
                        @input="watchPrice(scope.row, scope.$index)" style="width: 135px;"
                        oninput="value=value.replace(/[^0-9.]/g,'')">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="taxRate" label="税率" width="160">
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
                  <template slot-scope="scope" v-if="!status">
                    <el-select v-model="scope.row.taxRate" placeholder="请选择税率" style="width: 100%;" :disabled="status"
                      @change="changeTaxRate(scope.row, scope.$index)">
                      <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                        :value="item.taxRate"></el-option>
                    </el-select>
                  </template>
                  <template slot-scope="scope" v-if="status">
                    <div>{{ scope.row.taxRate }}%</div>
                  </template>
                </el-table-column>
                <el-table-column prop="excludingTaxUnitPrice" label="单价(不含税)" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="totalTaxAmount" label="税额" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="amounts" label="金额(含税)" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="excludingTaxAmounts" label="金额(不含税)" width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="211">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list1" :key="index" :disabled="status" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable>
                      <el-option v-for="(item, index) in list2" :key="index" :disabled="status" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list3" :key="index" :disabled="status" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="oil" label="油脂" width="120" :key="61">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list4" :key="index" :disabled="status" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list5" :key="index" :disabled="status" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="clearance" label="游隙" width="120" :key="100">

                  <template slot-scope="scope">
                    <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list6" :key="index" :disabled="status" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101">

                  <template slot-scope="scope">
                    <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list7" :key="index" :disabled="status" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="specialRequire" label="特殊要求" width="120" :key="101">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list8" :key="index" :disabled="status" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>


                <el-table-column prop="remark" label="备注" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注" :disabled="status" maxlength="200" />
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="120" fixed="right" v-if="btnType == 'add' || btnType == 'edit'">
                  <template slot-scope="scope">
                    <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>

              </el-table>
              <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin:0 10px">总数量：{{ totalNum }}</span>
                <span style="font-weight:500;margin:0 10px">总金额：{{ totalAmount }}</span>
              </div>
            </el-form>
          </el-collapse-item>

        </el-collapse>
      </div>
      <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
        <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false" :limit="1"
          :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange" ref="uploadRef">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text"><em>点击选取文件上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton"
              icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

        </el-upload>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" @click="submit()">
            提交</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
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

      <el-dialog title="历史价格" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="historyVisiblt" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
        append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box  treeBox_bot" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="historyPriceRequestObj.customerDrawingNumber" placeholder="请输入客户料号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="historyPriceRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="historyPriceRequestObj.ask" placeholder="请输入要求" clearable />
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
                <el-button type="primary" size="mini" icon="el-icon-download"
                  @click="exportForm('dataTable')">导出</el-button>
              </div>
              <JNPF-table :data="historyPriceData" ref="dataTable" custom-column>
                <el-table-column prop="cooperativePartnerIdText" label="客户名称" sortable="custom" width="200" />
                <el-table-column prop="customerDrawingNumber" label=" 客户料号" width="150" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="品名规格" width="180" sortable="custom" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
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
              <pagination :total="historyPriceTotal" :page.sync="historyPriceRequestObj.pageNum"
                :limit.sync="historyPriceRequestObj.pageSize" @pagination="getHistoryPriceFun" />
            </div>
          </div>
        </div>

      </el-dialog>
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="allProVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

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
              <el-tree ref="treeBox" :data="ProductTreeData" :props="defaultProps" :default-expand-all="expands"
                highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeAllProduct"
                class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNodeAllProduct">
                <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i
                    :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
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
                    <el-input v-model="ProductListRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="ProductListRequestObj.productCode" placeholder="请输入产品编码" clearable />
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
              <JNPF-table v-loading="listLoading" :data="allproductData" hasC
                @selection-change="handleSelectionChangeAllPruduct" ref="dataTable" @row-click="handleRowClick">
                <el-table-column prop="code" label="产品编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" />
                <el-table-column prop="productCategoryName" label="所属分类" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />
                <el-table-column prop="mainUnit" label="单位" />
                <el-table-column prop="inventoryQuantity" label="库存数量">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="viewFun(scope.row.id, 'inventoryFlag')">
                      {{ scope.row.inventoryQuantity }}
                    </el-link>
                  </template>
                </el-table-column>

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
      <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    </div>
  </transition>
</template>

<script>
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index"
import { getQuotationmxLists, addQuotationData, editQuotationMData, getQuotationInfo, denerateQuotationMData, calculatequotationData, calculatequotationSpecData, saleUploadData, saleUploadAmountsCount, exportNoProduct } from "@/api/salesManagement/index";
import { getCounryData, getPrivateList, deletePrivate, getcategoryTree, privateDetail } from '@/api/basicData/index'
import { getcategoryTree as productTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getcategoryTrees, getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getProducts, getDetailByDrawNo } from '@/api/masterDataManagement/index.js' // 产品列表
import { mapGetters, mapState } from 'vuex'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import flowMixin from '@/mixins/generator/flowMixin'
import { getBimBusinessDetail } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  components: { ExportForm, Process, recordList },
  mixins: [busFlow, flowMixin, getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
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
      getcategoryTree, // 意向客户分类
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
        quotationNo: "",
        deliver: '',
        publicPrivateSeaId: '',
        cooperativePartnerId: '',
        bidder: '',
        quotationTime: '',
        validEnd: '',
        address: '',
        phone: '',
        fax: '',
        totalAmount: 0,
        // approvalStatus: '',
        // reasonRejection: '',
        documentStatus: '',
        // submitDate: '',
        remark: '',
        approvalFlag: false
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
        quotationNo: [{ required: true, message: '报价单号不能为空', trigger: 'blur' }],
        deliver: [{ required: true, message: '致不能为空', trigger: 'blur' }],
        cooperativePartnerIdText: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        validEnd: [{ required: true, message: '有效期止不能为空', trigger: 'blur' }],
        bidder: [{ required: true, message: '报价人不能为空', trigger: 'blur' }],
        quotationTime: [{ required: true, message: '报价时间不能为空', trigger: 'blur' }],
        validEnd: [{ required: true, message: '有效时间止不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
      },
      productRules: {

        // 客户物料号
        customerDrawingNumber: [
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
        unitPrice: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["单价(含税)不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '单价(含税)必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [18, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：单价(含税)${errMsg}`) }] }), trigger: 'blur' }
        ],


      },
      activeNames: ["productInfo", "basicInfo"],
      customStyleData: {},
      tableVisible: true,
      loadingText: '',
      fontSizeValue: '',
      oldId: "",
      oldType: "",
      tipsvisible: false,
      createdData: {
        salesQuotationId: '',
        customerProductDrawingNo: '',
        customerDrawingNumber: '',
        materialDescription: "",
        productDrawingNo: "",
        num: "",
        listPrice: "",
        unitPrice: "",
        excludingTaxUnitPrice: "",
        discount: "",
        amounts: "",
        excludingTaxAmounts: "",
        totalTaxAmount: "",
        mainUnit: "",
        taxRate: "",
        remark: "",
        remark2: ""
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
      ProductMethodArr: [
        {
          label: "产品分类", classAttribute: "", method: productTree, requeseObj: {
            classAttribute: "", type: "material",
          }
        },
      ],
      allproductData: [],
      allProductTotal: 0,

      ProductTreeData: [],
      allProVisible:false,
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
    }
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
  computed: {
    totalNum: function () {
      var totalNum = 0;
      for (var i = 0; i < this.dataFormTwo.lines.length; i++) {
        totalNum = this.jnpf.numberFormat(this.jnpf.math('add', [totalNum, this.dataFormTwo.lines[i].num]), 2)
      }
      return totalNum
    },
    totalAmount: function () {
      console.log(5555);
      var totalAmount = 0;
      for (var i = 0; i < this.dataFormTwo.lines.length; i++) {
        totalAmount = this.jnpf.numberFormat(this.jnpf.math('add', [totalAmount, this.dataFormTwo.lines[i].amounts]), 2)
      }
      return totalAmount
    },
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

  },
  mounted() {
    this.getTaxRateFun()
    this.getBimBusinessDetail()

  },
  async created() {
    await this.getProjectSwitch('system', 'project')
  },
  methods: {

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
        this.searchAllProduct()
    },
    // 所有产品列表 多选
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val


    },
    submitAllProduct() {
      this.allProVisible = false
      this.selectArr.forEach(item => {
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
          item.num === "" &&
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
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_quotation'
      }
      getBimBusinessDetail(obj).then(res => {
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

      if (this.dataFormTwo.lines[index].customerDrawingNumber) customerDrawingNumber = JSON.parse(JSON.stringify(this.dataFormTwo.lines[index].customerDrawingNumber))
      if (item.value) {
        let objs = {
          productDrawingNo: item.value,
          customerDrawingNumber: "",
          cooperativePartnerId: this.dataForm.cooperativePartnerId,
          pageNum: 1,
          pageSize: 20,
          orderItems: [{
            asc: false,
            column: "quotationTime"
          }],
        }
        getQuotationmxLists(objs).then(res => {
          if (res.data.records.length) {
            console.log('有值', res.data.records[0]);
            let data = res.data.records[0]

            // res.data.records[0].customerProductDrawingNo = customerDrawingNumber ? customerDrawingNumber : res.data.records[0].customerProductDrawingNo
            res.data.records[0].taxRate = res.data.records[0].taxRate * 1
            this.$set(this.dataFormTwo.lines, index, res.data.records[0])
            // this.$set(this.dataFormTwo.lines, index, res.data.records[0])
            console.log(111, this.dataFormTwo.lines);
            let exists = this.taxRateList.some(item => item.taxRate === parseInt(res.data.records[0].taxRate));
            if (!exists && res.data.records[0].taxRate) {
              let obj = {
                taxRate: res.data.records[0].taxRate * 1,
                fullName: res.data.records[0].taxRate + '%',
                enCode: res.data.records[0].taxRate + '%',
              }
              this.taxRateList.push(obj)
            }
          } else {

            item.data.taxRate = this.taxRate * 1
            this.$set(item.data, 'productDrawingNo', item.value)
            this.$set(item.data, 'unitPrice', "")
            this.$set(item.data, 'customerProductDrawingNo', customerDrawingNumber)
            item.data.productsId = item.data.id

            this.$set(this.dataFormTwo.lines, index, item.data)
            // this.$set(this.dataFormTwo.lines, index, item.data)
            this.watchPrice(this.dataFormTwo.lines[index], index)
          }
          console.log(666777);
          this.dataFormTwo.lines.push(obj)
        })
      }
    },





    changeTaxRate(row, index) {
      console.log(row, index);
      let productArr = [...this.dataFormTwo.lines]
      productArr[index].excludingTaxUnitPrice = this.jnpf.numberFormat(row.unitPrice / (1 + (row.taxRate * 1 / 100)), 2)
      productArr[index].excludingTaxAmounts = this.jnpf.numberFormat((row.excludingTaxUnitPrice * row.num), 2)
      productArr[index].totalTaxAmount = this.jnpf.numberFormat((row.amounts * 1 - row.excludingTaxAmounts), 2)
      this.dataFormTwo.lines = productArr
    },
    getTaxRateFun() {

      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log("税率", this.taxRateList);
      })

    },
    // 输入品名规格  查找对应得产品数据 按下enter键 自动新增一行空白数据
    searchDrawingNoProduct(data, idx) {
      console.log(data, idx);
      let obj = JSON.parse(JSON.stringify(this.createdData))
      obj.taxRate = this.taxRate * 1
      console.log(8989);
      if (data.num || data.unitPrice) return
      getDetailByDrawNo(data.productDrawingNo).then(res => {
        if (res.data) {
          this.dataFormTwo.lines.push(obj)
          res.data.unitPrice = ""
          res.data.customerDrawingNumber = data.customerDrawingNumber
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
      this.init(this.dataForm.id, this.btnType)
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
          item.customerDrawingNumber === "" &&
          item.num === "" &&
          item.unitPrice === "" &&
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
      saleUploadData(formData).then(res => {
        if (!res.data.url) {
          this.$message.success(`导入成功`)
          if (res.data.length > 0) {
            this.dataFormTwo.lines = res.data

          }
          this.formLoading = false
          this.loadingText = ''
          this.uploadVisib = false
        } else {
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
    // 联系人信息新增行
    addtable(type, data) {
      if (!type) {
        this.dataFormTwo.lines.push(this.createdData)

      }
    },


    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/销售报价导入模板.xlsx')
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

      row.unitPrice = row.unitPrice ? row.unitPrice.replace(/[^\d.]/g, '') : ''
      // 单价处理
      if (row.unitPrice.length == 1 && row.unitPrice == '.') {
        // 如果第一位是小数点，则清空输入框
        row.unitPrice = '';
      } else if (row.unitPrice.length == 2 && row.unitPrice[0] == '0' && row.unitPrice[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.unitPrice = row.unitPrice.slice(0, 1) + '.' + row.unitPrice.slice(1);
      } else if (row.unitPrice.length > 2 && row.unitPrice[0] == '0' && row.unitPrice[1] != '.') {
        row.unitPrice = row.unitPrice.substring(1, row.unitPrice.length)
      }
      if (row.unitPrice.includes('.')) {
        let dotCount = 0; // 小数点的数量
        let result = ''; // 处理后的结果
        for (let i = 0; i < row.unitPrice.length; i++) {
          const char = row.unitPrice[i];
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
        row.unitPrice = result;
        let arr = row.unitPrice.split('.')
        if (arr[0].length > 12) {
          arr[0] = arr[0].substring(0, 12)
        }
        if (arr[1].length > 6) {
          arr[1] = arr[1].substring(0, 6)
        }
        row.unitPrice = arr[0] + '.' + arr[1]
      } else {
        if (row.unitPrice.length > 20) {
          row.unitPrice = row.unitPrice.substring(0, 20);
        }
      }
      if (row.unitPrice && row.unitPrice != '0') {
        let b = this.jnpf.numberFormat(this.jnpf.math('divide', [row.unitPrice, 1 + row.taxRate / 100]), 2)
        row.excludingTaxUnitPrice = b ? b : 0
        productArr[index].excludingTaxUnitPrice = b ? b : 0
      } else {
        row.excludingTaxUnitPrice = ''
      }


      let a = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.unitPrice, row.num]), 2)
      console.log("aaa", a);
      row.amounts = a ? a : '' // 含税金额 
      productArr[index].amounts = a ? a : 0
      console.log(this.dataFormTwo.lines);

      if (row.excludingTaxUnitPrice && row.num) {
        let c = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.excludingTaxUnitPrice, row.num]), 2)
        row.excludingTaxAmounts = c ? c : ''
        productArr[index].excludingTaxAmounts = c ? c : 0
      } else {
        row.excludingTaxAmounts = ''
      }
      if (row.excludingTaxAmounts && row.amounts) { // 税额计算
        let d = this.jnpf.numberFormat(this.jnpf.math('subtract', [row.amounts, row.excludingTaxAmounts]), 2)
        row.totalTaxAmount = d ? d : 0
        productArr[index].totalTaxAmount = d ? d : 0
      }
      this.dataFormTwo.lines = productArr
    },
    // 监听主数量输入
    watchnums(row, index) {
      console.log("ROW", row, index);
      // 数量处理
      row.num = row.num ? row.num.replace(/[^\d.]/g, '') : ''
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
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.num = arr[0] + '.' + arr[1]
      } else {
        if (row.num.length > 8) {
          row.num = row.num.substring(0, 8);
        }
      }
      // if (row.num.length) {
      //   console.log(2222222222222);
      //   // 数量变化 更新审批流程
      //   // this.$nextTick(() => { this.getApproverData() })//暂时注释
      // }



      if (row.unitPrice && row.unitPrice != '0') {
        let b = this.jnpf.numberFormat((row.unitPrice / (1 + row.taxRate / 100)), 2)
        row.excludingTaxUnitPrice = b ? b : 0
      } else {
        row.excludingTaxUnitPrice = ''
      }

      if (!row.num || !row.unitPrice) {
        row.amounts = ''
        row.totalTaxAmount = ''
        this.dataForm.totalAmount = 0
      } else {
        let a = this.jnpf.numberFormat((row.unitPrice * row.num), 2)
        row.amounts = a ? a : '' // 含税金额
      }
      var totalPrice = 0;
      for (var a = 0; a < this.dataFormTwo.lines.length; a++) {
        let item = this.dataFormTwo.lines[a]
        console.log("item", item.amounts);
        totalPrice = this.jnpf.math('add', [totalPrice, item.amounts])
      }
      if (row.excludingTaxUnitPrice && row.num) {
        let c = this.jnpf.numberFormat((row.excludingTaxUnitPrice * row.num), 2)
        row.excludingTaxAmounts = c ? c : ''
      } else {
        row.excludingTaxAmounts = ''
      }
      if (row.excludingTaxAmounts && row.amounts) { // 税额计算
        let d = this.jnpf.numberFormat((row.amounts * 1 - row.excludingTaxAmounts * 1), 2)
        row.totalTaxAmount = d ? d : 0
      }
      console.log("pfijspdfjp");
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
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
    init(id, btnType, approvalFlag) {
      // 表格表单适配模式
      this.$nextTick(() => { this.switchStyle('onresize') });
      this.dataForm.id = id || ''
      this.approvalFlag = approvalFlag

      // this.oldId = JSON.parse(JSON.stringify(id)) || ""
      // this.oldType = JSON.parse(JSON.stringify(btnType))
      this.btnType = btnType
      if (btnType == 'look') {
        this.iszt = false
        this.status = true
      } else {
        this.getProductClassFun()
        this.iszt = true
        this.status = false
        let obj = JSON.parse(JSON.stringify(this.createdData))
        this.dataFormTwo.lines.push(obj)
      }
      console.log('status', this.status);

      // 新建
      if ((this.btnType == 'add' && !this.dataForm.id) || this.btnType == 'copy') {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.quotationTime = this.jnpf.dateFormat(end, 'YYYY-MM-DD')
        this.dataForm.validEnd = this.jnpf.dateFormat(end, 'YYYY-MM-DD')
        // 向后推20年存放到dataForm.validEnd
        var originalDate = new Date(this.dataForm.validEnd);
        originalDate.setFullYear(originalDate.getFullYear() + 20);
        var newDate = originalDate.toISOString().slice(0, 10);
        this.dataForm.validEnd = newDate

        this.dataForm.bidder = this.userInfo.userName
        this.dataForm.quotationType = 'latest'
        if (this.btnType == 'copy') {
          this.formLoading = true
          getQuotationInfo(this.dataForm.id).then(res => {
            // this.$nextTick(() => {
            this.dataForm = res.data.sale
            this.dataFormTwo.lines = res.data.lines

            this.dataForm.totalAmount = 0
            this.dataForm.approvalStatus = ''
            this.dataForm.submitDate = ''
            this.dataForm.approvalCompletionDate = ''
            this.dataForm.id = ''
            this.dataForm.reasonRejection = ''

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
            this.fetchData("XSBJ", true)
            // 审批
            this.$nextTick(() => {
              this.getBusInfo('b001')
            })//暂时注释
            this.formLoading = false
            // })
          }).catch(err => {
            this.formLoading = false
          })
        } else {
          this.fetchData("XSBJ", true)
          this.getBusInfo('b001')

        }
      }

      // 重新提交
      if (this.btnType == 'add' && this.dataForm.id) {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        //计算，将当期日期-1天
        //此时得到的是中国标准时间，格式不是yyyy-MM-dd，需要用dateFormat这个函数转换下
        this.dataForm.quotationTime = this.jnpf.dateFormat(end, 'YYYY-MM-DD')
        this.dataForm.validEnd = this.jnpf.dateFormat(end, 'YYYY-MM-DD')
        // 向后推20年存放到dataForm.validEnd
        var originalDate = new Date(this.dataForm.validEnd);
        originalDate.setFullYear(originalDate.getFullYear() + 20);
        var newDate = originalDate.toISOString().slice(0, 10);
        this.dataForm.validEnd = newDate

        this.dataForm.bidder = this.userInfo.userName
        this.dataForm.quotationType = 'latest'
        this.formLoading = true
        getQuotationInfo(this.dataForm.id).then(res => {
          // this.$nextTick(() => {
          this.dataForm = res.data.sale
          this.dataFormTwo.lines = res.data.lines

          this.dataForm.totalAmount = 0
          this.dataForm.approvalStatus = ''
          this.dataForm.submitDate = ''
          this.dataForm.approvalCompletionDate = ''
          this.dataForm.id = ''
          this.dataForm.reasonRejection = ''

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
          this.fetchData("XSBJ", true)
          // 审批
          this.$nextTick(() => {
            this.getBusInfo('b001')
          })//暂时注释
          this.formLoading = false
          // })
        }).catch(err => {
          this.formLoading = false
        })

      }
      if (this.btnType !== 'add' && this.btnType !== 'copy') {
        this.formLoading = true
        this.fetchData("XSBJ", false)
        getQuotationInfo(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            this.dataForm = res.data.sale
            res.data.lines.forEach(item => {
              item.taxRate = item.taxRate * 1
            });
            this.dataFormTwo.lines = res.data.lines
            this.dataForm.totalAmount = 0

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
            this.formLoading = false
            if (this.btnType === 'edit') {
              this.getBusInfo('b001')
            } else {
              // 流程信息和流转记录
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
            }
          })
        }).catch(err => {
          this.formLoading = false
        })

      }
    },
    async handleConfirm(value) {
      this.dataForm.documentStatus = value
      let submitFlag = true


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
        if (this.dataFormTwo.lines.length) {
          let index = this.dataFormTwo.lines.findIndex(item =>
            item.customerDrawingNumber === "" &&
            item.num === "" &&
            item.unitPrice === "" &&
            item.productDrawingNo == ""
          )
          console.log(index);
          if (index !== -1) {
            this.dataFormTwo.lines.splice(index, 1);
          }
        }
        this.btnLoading = true
        this.dataForm.totalAmount = Number(this.dataForm.totalAmount = 0)
        this.dataForm.totalAmount = this.totalPrice
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
        let filteredArr = this.dataFormTwo.lines.filter(item => item.productDrawingNo && item.productsId);
        let obj = {
          attachmentList: this.datafilelist,
          sale: this.dataForm,
          lines: filteredArr,
          flowData: this.flowData
        }
        console.log(obj, '参数');
        // return
        let formMethod = null;
        if (this.btnType == 'edit' || this.btnType == 'bjkh') {
          formMethod = editQuotationMData
        } else if (this.btnType == 'add' || this.btnType == 'copy') {
          formMethod = addQuotationData
        }
        formMethod(obj).then(res => {
          let msg = "";
          if (value == "draft") {
            this.submitmethodsTitle = "保存成功"
          } else {
            this.submitmethodsTitle = "提交成功"

          }
          if (this.btnType == 'edit') {
            msg = "提交成功"
            this.btnText = "继续修改"
          } else if (this.btnType == 'add' || this.btnType == 'copy') {
            msg = "新建成功"
            this.btnText = "继续新增"
          } else {
            if (res.data) {
              this.btnLoading = false
              this.handleMessage(res.data)
              return
            }
          }
          this.tipsvisible = true


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
    // 生成客户产品  下载无产品档案列表
    downNoProduct(res) {
      this.jnpf.downloadFile(res.url, res.name)
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
            h('p', { style: 'font-size:14px;' }, '生成失败，存在客户产品找不到产品档案！'),
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
            }, '下载无档案列表')
          ]
        ),
      })
      return
    },
    // 测试审批流
    // getBusInfo() {
    //   getBusinessFlowInfo('b001').then(res => {
    //     if (res.data) {
    //       if (res.data.enabledMark) {
    //         this.flowData = res.data
    //         this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
    //         this.dataForm.approvalFlag = res.data.enabledMark
    //       } else {
    //         this.flowTemplateJson = {}
    //         this.dataForm.approvalFlag = false
    //         this.$message.error('未找到审批流程！')
    //       }
    //     } else {
    //       this.flowTemplateJson = {}
    //       this.dataForm.approvalFlag = false
    //     }
    //   }).catch(() => { })
    // },
    // // 流程信息 && 流转记录
    // getFlowDetail(id) {
    //   getBusinessFlowDetail(id).then(res => {
    //     if (res.data) {
    //       this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson) : null
    //       this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
    //       this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
    //       let flowTaskNodeList = res.data.flowTaskNodeList
    //       if (flowTaskNodeList.length) {
    //         for (let i = 0; i < flowTaskNodeList.length; i++) {
    //           const nodeItem = flowTaskNodeList[i]
    //           const loop = data => {
    //             if (Array.isArray(data)) data.forEach(d => loop(d))
    //             if (data.nodeId === nodeItem.nodeCode) {
    //               if (nodeItem.type == 0) data.state = 'state-past'
    //               if (nodeItem.type == 1) data.state = 'state-curr'
    //               if (nodeItem.nodeType === 'approver' || nodeItem.nodeType === 'start' || nodeItem.nodeType === 'subFlow') data.content = nodeItem.userName
    //               return
    //             }
    //             if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
    //             if (data.childNode) loop(data.childNode)
    //           }
    //           loop(this.flowTemplateJson)
    //         }
    //       }
    //     }
    //   }).catch(() => { })
    // },
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
// padding: 1;</style>
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

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
}
</style>
<style>
.my-message {
  font-size: 16px !important;
}
</style>